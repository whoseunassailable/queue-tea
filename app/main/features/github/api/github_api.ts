import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'

import type { Host } from '../../../../../hooks/core/host/host'
import type { GithubAccount, GithubAdded, GithubLoginCode, GithubView, Reply } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { accountsOf, codeOf, gitProtocolOf } from '../domain/accounts'

export type GithubDeps = {
  host: Host
  home: string
  log: Logger
  // Where gh may be. An app opened from the Finder has no shell PATH to find it on.
  ghPaths: string[]
  codeWaitMs: number
  loginWaitMs: number
}

const HOST = 'github.com'

type Login = { child: ChildProcess; finished: Promise<number | null>; url: string; before: GithubAccount[] }

// The GitHub half of the engine API. It holds the one sign-in that can be
// running. Accounts and tokens stay in gh: the app only asks.
export const githubApi = (d: GithubDeps) => {
  let running: Login | null = null
  let isStarting = false

  const findGh = async (): Promise<string | null> => {
    for (const path of d.ghPaths) if (await d.host.exists(path)) return path

    return null
  }

  // gh exits 1 when signed out, but still prints its JSON, so stdout decides.
  const statusOf = async (gh: string): Promise<string> => (await d.host.run([gh, 'auth', 'status', '--json', 'hosts'], d.home)).stdout

  const stop = (child: ChildProcess) => {
    child.kill('SIGTERM')
  }

  const startLogin = (gh: string, protocol: string): { child: ChildProcess; finished: Promise<number | null>; firstCode: Promise<{ code: string; url: string } | null> } => {
    const child = spawn(gh, ['auth', 'login', '--web', '--hostname', HOST, '--git-protocol', protocol, '--skip-ssh-key'], { cwd: d.home, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    const finished = new Promise<number | null>(done => {
      child.once('error', err => {
        d.log.error('running gh failed', err)
        done(null)
      })
      // Exit, not close: close waits for every pipe, so a stuck child of gh's
      // could hold the dialog open after gh itself has gone.
      child.once('exit', code => done(code))
    })
    const firstCode = new Promise<{ code: string; url: string } | null>(done => {
      const timer = setTimeout(() => done(null), d.codeWaitMs)
      const heard = (chunk: Buffer) => {
        output += chunk.toString()
        const found = codeOf(output)
        if (found !== null) {
          clearTimeout(timer)
          done(found)
        }
      }
      child.stdout?.on('data', heard)
      child.stderr?.on('data', heard)
      void finished.then(() => {
        clearTimeout(timer)
        done(null)
      })
    })

    return { child, finished, firstCode }
  }

  // Signing in makes that account gh's active one, which would quietly change
  // who the terminal is. So the account that was active goes back.
  const restoreActive = async (gh: string, before: GithubAccount[], after: GithubAccount[]) => {
    const was = before.find(account => account.isActive)
    if (was === undefined || after.find(account => account.isActive)?.login === was.login) return
    const ran = await d.host.run([gh, 'auth', 'switch', '--hostname', HOST, '--user', was.login], d.home)
    if (ran.exitCode !== 0) d.log.warn(`putting gh back on ${was.login} failed: ${ran.stderr}`)
  }

  return {
    readGithub: (): Promise<Reply<GithubView>> =>
      reply(d.log, MESSAGES.readGithub, async () => {
        const gh = await findGh()

        return gh === null ? { kind: 'missing' } : { kind: 'ready', accounts: accountsOf(await statusOf(gh)) }
      }),

    startGithubLogin: (): Promise<Reply<GithubLoginCode>> =>
      reply(d.log, MESSAGES.startGithubLogin, async () => {
        if (running !== null || isStarting) throw new Refusal(MESSAGES.loginRunning)
        const gh = await findGh()
        if (gh === null) throw new Refusal(MESSAGES.ghMissing)
        isStarting = true
        try {
          const status = await statusOf(gh)
          const { child, finished, firstCode } = startLogin(gh, gitProtocolOf(status))
          const found = await firstCode
          if (found === null) {
            stop(child)
            await finished
            throw new Refusal(MESSAGES.startGithubLogin)
          }
          running = { child, finished, url: found.url, before: accountsOf(status) }

          return found
        } finally {
          isStarting = false
        }
      }),

    openGithubLogin: (): Promise<Reply<null>> =>
      reply(d.log, MESSAGES.openGithub, async () => {
        if (running === null) throw new Refusal(MESSAGES.noLogin)
        const opened = await d.host.open(running.url)
        if (opened.exitCode !== 0) throw new Error(opened.stderr)

        return null
      }),

    awaitGithubLogin: (): Promise<Reply<GithubAdded>> =>
      reply(d.log, MESSAGES.awaitGithubLogin, async () => {
        const login = running
        if (login === null) throw new Refusal(MESSAGES.noLogin)
        let isLate = false
        const timer = setTimeout(() => {
          isLate = true
          stop(login.child)
        }, d.loginWaitMs)
        const exit = await login.finished
        clearTimeout(timer)
        const wasCancelled = running !== login
        running = null
        if (isLate) throw new Refusal(MESSAGES.loginTimedOut)
        if (wasCancelled) throw new Refusal(MESSAGES.loginCancelled)
        if (exit !== 0) throw new Refusal(MESSAGES.awaitGithubLogin)

        const gh = await findGh()
        if (gh === null) throw new Refusal(MESSAGES.ghMissing)
        const accounts = accountsOf(await statusOf(gh))
        const added = accounts.find(account => !login.before.some(known => known.login === account.login))?.login ?? null
        await restoreActive(gh, login.before, accounts)

        return { view: { kind: 'ready', accounts: accountsOf(await statusOf(gh)) }, added }
      }),

    cancelGithubLogin: (): Promise<Reply<null>> =>
      reply(d.log, MESSAGES.awaitGithubLogin, async () => {
        const login = running
        if (login === null) return null
        running = null
        stop(login.child)
        await login.finished

        return null
      }),

    // For the app quitting: no sign-in outlives it.
    stopGithubLogin: () => {
      if (running !== null) stop(running.child)
      running = null
    },
  }
}

export type GithubApi = ReturnType<typeof githubApi>
