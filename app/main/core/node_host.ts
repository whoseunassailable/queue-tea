import { execFile } from 'node:child_process'
import { access, mkdir, readdir, readFile, rename, rm, rmdir, stat, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import type { Host, RunResult } from '../../../hooks/core/host/host'
import { FORBIDDEN_GIT } from './constants'
import type { Logger } from './logger'

const failed = (err: unknown): RunResult => ({ exitCode: 1, stdout: '', stderr: err instanceof Error ? err.message : String(err) })

const attempt = async (work: () => Promise<unknown>): Promise<RunResult> => {
  try {
    await work()

    return { exitCode: 0, stdout: '', stderr: '' }
  } catch (err) {
    return failed(err)
  }
}

// The word after git's own options, so `-C path` can't hide it.
export const isForbiddenGit = (argv: string[]): boolean => {
  if (argv[0] !== 'git') return false
  let i = 1
  while (i < argv.length) {
    const word = argv[i]!
    if (word === '-C' || word === '-c') i += 2
    else if (word.startsWith('-')) i += 1
    else break
  }

  return (FORBIDDEN_GIT as readonly string[]).includes(argv[i] ?? '')
}

// The app's Host: the same shape as the mod's, on Node's own calls. It is the
// one place the app runs a process, so the rule on git lives here.
export const nodeHost = (log: Logger, openUrl: (url: string) => Promise<RunResult>): Host => ({
  exists: async path => {
    try {
      await access(path)

      return true
    } catch {
      // Not reachable is what the question asks.
      return false
    }
  },
  read: path => readFile(path, 'utf8'),
  write: async (path, text) => {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, text, 'utf8')
  },
  run: (argv, cwd) =>
    new Promise(done => {
      if (isForbiddenGit(argv)) {
        log.error(`refused to run: ${argv.join(' ')}`)
        done({ exitCode: 1, stdout: '', stderr: 'Commits, pushes, merges and pulls are yours to make.' })

        return
      }
      log.debug(`run: ${argv.join(' ')}`)
      execFile(argv[0]!, argv.slice(1), { cwd, maxBuffer: 16 * 1024 * 1024 }, (err, stdout, stderr) => {
        const code = err === null ? 0 : typeof err.code === 'number' ? err.code : 1
        done({ exitCode: code, stdout, stderr: err !== null && stderr === '' ? err.message : stderr })
      })
    }),
  list: async dir => {
    try {
      return (await readdir(dir, { withFileTypes: true })).filter(e => e.isFile()).map(e => e.name)
    } catch (err) {
      // A folder that isn't there yet holds nothing; anything else is a fault.
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw err
    }
  },
  sleep: ms => new Promise(done => setTimeout(done, ms)),
  move: (from, to) => attempt(() => rename(from, to)),
  makeDir: path => attempt(() => mkdir(path)),
  makeDirs: path => attempt(() => mkdir(path, { recursive: true })),
  removeDir: path => attempt(() => rmdir(path)),
  remove: path => attempt(() => rm(path, { force: true })),
  modifiedAt: async path => {
    try {
      return (await stat(path)).mtimeMs
    } catch {
      // A file that isn't there has no time, and that is the answer asked for.
      return null
    }
  },
  open: openUrl,
})
