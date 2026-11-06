import { chmod, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { accountsOf, codeOf, isGithubLogin } from '../domain/accounts'
import { githubApi } from './github_api'
import type { GithubDeps } from './github_api'

let home: string
let gh: string
let calls: string
let state: string
let deps: GithubDeps
let opened: string[]

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const statusJson = (accounts: { login: string; active: boolean; state?: string; gitProtocol?: string }[]) =>
  JSON.stringify({ hosts: { 'github.com': accounts.map(a => ({ state: a.state ?? 'success', active: a.active, host: 'github.com', login: a.login, tokenSource: 'keyring', scopes: 'repo', gitProtocol: a.gitProtocol ?? 'ssh' })) } })

// A stand-in gh, run as a real process. It answers status from a file, and on
// login prints what the real one prints, then waits to be told how it went.
const fakeGh = async (statusFile: string, loginScript: string) => {
  await writeFile(
    gh,
    `#!/bin/sh
echo "$*" >> '${calls}'
case "$2" in
  status) cat '${statusFile}' ;;
  switch) ;;
  login) ${loginScript} ;;
esac
`,
  )
  await chmod(gh, 0o755)
}
const WAITS = `printf '\\n! First copy your one-time code: 100F-29B8\\nOpen this URL to continue in your web browser: https://github.com/login/device\\n' >&2; while [ ! -f '${join('$HOME_DIR', 'go')}' ] && [ -d '$HOME_DIR' ]; do sleep 0.05; done`

const login = (over: Partial<GithubDeps> = {}) => githubApi({ ...deps, ...over })
const callLog = async () => {
  try {
    return (await readFile(calls, 'utf8')).trim().split('\n')
  } catch {
    // No file means gh was never run.
    return []
  }
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-github-')))
  await mkdir(join(home, 'bin'))
  gh = join(home, 'bin/gh')
  calls = join(home, 'calls.txt')
  state = join(home, 'status.json')
  opened = []
  await writeFile(state, statusJson([{ login: 'first', active: true }]))
  await fakeGh(state, WAITS.replaceAll('$HOME_DIR', home))
  const log = createLogger('dev', () => {})
  const host = nodeHost(log, async url => {
    opened.push(url)

    return { exitCode: 0, stdout: '', stderr: '' }
  })
  deps = { host, home, log, ghPaths: [join(home, 'bin/missing'), gh], codeWaitMs: 2_000, loginWaitMs: 5_000 }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('reading what gh says', () => {
  it('lists the accounts on github.com', () => {
    expect(accountsOf(statusJson([{ login: 'first', active: true }, { login: 'second', active: false }]))).toEqual([
      { login: 'first', isActive: true, isWorking: true },
      { login: 'second', isActive: false, isWorking: true },
    ])
  })

  it('marks an account whose sign-in has lapsed', () => {
    expect(accountsOf(statusJson([{ login: 'first', active: true, state: 'error' }]))[0]?.isWorking).toBe(false)
  })

  it('doesn\'t blame the account for GitHub being out of reach', () => {
    expect(accountsOf(statusJson([{ login: 'first', active: true, state: 'timeout' }]))[0]?.isWorking).toBe(true)
  })

  it('has none for no hosts, or for anything else', () => {
    expect(accountsOf('{"hosts":{}}')).toEqual([])
    expect(accountsOf('not json')).toEqual([])
    expect(accountsOf('{"hosts":{"github.com":[{"state":"success"}]}}')).toEqual([])
  })

  it('finds the code and the address in the sign-in output', () => {
    expect(codeOf('\n! First copy your one-time code: 100F-29B8\nOpen this URL to continue in your web browser: https://github.com/login/device\n')).toEqual({ code: '100F-29B8', url: 'https://github.com/login/device' })
  })

  it('waits for both', () => {
    expect(codeOf('! First copy your one-time code: 100F-29B8\n')).toBeNull()
    expect(codeOf('')).toBeNull()
  })

  it('takes only an address on GitHub', () => {
    expect(codeOf('one-time code: 100F-29B8\nOpen this URL: https://evil.example/login/device')).toBeNull()
  })

  it('knows a login when it sees one', () => {
    expect(isGithubLogin('whoseunassailable')).toBe(true)
    expect(isGithubLogin('with-dash1')).toBe(true)
    expect(isGithubLogin('no spaces')).toBe(false)
    expect(isGithubLogin('')).toBe(false)
    expect(isGithubLogin(42)).toBe(false)
  })
})

describe('the accounts', () => {
  it('lists what gh knows, finding gh where Homebrew puts it', async () => {
    expect(data(await login().readGithub())).toEqual({ kind: 'ready', accounts: [{ login: 'first', isActive: true, isWorking: true }] })
  })

  it('says when gh isn\'t installed', async () => {
    expect(data(await login({ ghPaths: [join(home, 'nope')] }).readGithub())).toEqual({ kind: 'missing' })
  })

  it('has an empty list when gh is signed out, which it reports as a failure', async () => {
    await writeFile(state, '{"hosts":{}}')
    await fakeGh(state, ':')
    await writeFile(gh, `#!/bin/sh\ncat '${state}'\nexit 1\n`)

    expect(data(await login().readGithub())).toEqual({ kind: 'ready', accounts: [] })
  })

  it('never reads a token', async () => {
    await login().readGithub()

    expect((await callLog()).join(' ')).not.toContain('token')
  })
})

describe('adding an account', () => {
  const go = () => writeFile(join(home, 'go'), '')

  it('hands over the code, running gh\'s own web sign-in', async () => {
    const api = login()

    expect(data(await api.startGithubLogin())).toEqual({ code: '100F-29B8', url: 'https://github.com/login/device' })
    expect((await callLog()).at(-1)).toBe('auth login --web --hostname github.com --git-protocol ssh --skip-ssh-key')
    await api.cancelGithubLogin()
  })

  it('keeps the git protocol already in use', async () => {
    await writeFile(state, statusJson([{ login: 'first', active: true, gitProtocol: 'https' }]))
    const api = login()

    await api.startGithubLogin()

    expect((await callLog()).at(-1)).toContain('--git-protocol https')
    await api.cancelGithubLogin()
  })

  it('names the account that came in, and puts the terminal\'s account back', async () => {
    const api = login()
    await api.startGithubLogin()
    await writeFile(state, statusJson([{ login: 'first', active: false }, { login: 'second', active: true }]))

    const waiting = api.awaitGithubLogin()
    await go()
    const outcome = data(await waiting)

    expect(outcome.added).toBe('second')
    expect((await callLog()).at(-2)).toBe('auth switch --hostname github.com --user first')
  })

  it('leaves things alone when the same account signs in again', async () => {
    const api = login()
    await api.startGithubLogin()

    const waiting = api.awaitGithubLogin()
    await go()

    expect(data(await waiting).added).toBeNull()
    expect((await callLog()).join(' ')).not.toContain('auth switch')
  })

  it('puts the terminal\'s account back when a known one signs in again', async () => {
    await writeFile(state, statusJson([{ login: 'first', active: true }, { login: 'second', active: false }]))
    const api = login()
    await api.startGithubLogin()
    await writeFile(state, statusJson([{ login: 'first', active: false }, { login: 'second', active: true }]))

    const waiting = api.awaitGithubLogin()
    await go()

    expect(data(await waiting).added).toBeNull()
    expect((await callLog()).at(-2)).toBe('auth switch --hostname github.com --user first')
  })

  it('switches nothing when it was the first account', async () => {
    await writeFile(state, '{"hosts":{}}')
    const api = login()
    await api.startGithubLogin()
    await writeFile(state, statusJson([{ login: 'first', active: true }]))

    const waiting = api.awaitGithubLogin()
    await go()

    expect(data(await waiting).added).toBe('first')
    expect((await callLog()).join(' ')).not.toContain('auth switch')
  })

  it('opens only the address gh gave', async () => {
    const api = login()
    await api.startGithubLogin()

    data(await api.openGithubLogin())

    expect(opened).toEqual(['https://github.com/login/device'])
    await api.cancelGithubLogin()
  })

  it('has nothing to open with no sign-in running', async () => {
    expect((await login().openGithubLogin()).ok).toBe(false)
    expect(opened).toEqual([])
  })

  it('runs one at a time', async () => {
    const api = login()
    await api.startGithubLogin()

    expect(await api.startGithubLogin()).toEqual({ ok: false, error: { message: 'A GitHub sign-in is already running. Finish it or cancel it first.' } })

    await api.cancelGithubLogin()
  })

  it('stops gh when it\'s cancelled, and can start again', async () => {
    const api = login()
    await api.startGithubLogin()
    const waiting = api.awaitGithubLogin()

    data(await api.cancelGithubLogin())

    expect((await waiting).ok).toBe(false)
    expect((await api.startGithubLogin()).ok).toBe(true)
    await api.cancelGithubLogin()
  })

  it('is fine with nothing to cancel', async () => {
    expect((await login().cancelGithubLogin()).ok).toBe(true)
  })

  it('stops gh if the code never comes', async () => {
    await fakeGh(state, 'sleep 30')
    const api = login({ codeWaitMs: 100 })

    expect(await api.startGithubLogin()).toEqual({ ok: false, error: { message: "GitHub's sign-in didn't start. Check your connection and try again." } })
    expect((await api.startGithubLogin()).ok).toBe(false)
  })

  it('stops gh if nobody signs in', async () => {
    const api = login({ loginWaitMs: 100 })
    await api.startGithubLogin()

    expect(await api.awaitGithubLogin()).toEqual({ ok: false, error: { message: 'The sign-in timed out. Try again.' } })
  })

  it('says so when gh fails', async () => {
    await fakeGh(state, `printf 'one-time code: 100F-29B8\\nOpen: https://github.com/login/device\\n' >&2; sleep 0.1; exit 1`)
    const api = login()
    await api.startGithubLogin()

    expect(await api.awaitGithubLogin()).toEqual({ ok: false, error: { message: "GitHub's sign-in didn't finish. Try again." } })
  })

  it('says when gh isn\'t there to run', async () => {
    expect((await login({ ghPaths: [] }).startGithubLogin()).ok).toBe(false)
  })
})
