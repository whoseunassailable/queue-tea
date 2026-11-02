import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord, projectKey } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { readSettingsPage } from '../../realms/api/realms_api'
import { COMMAND_SCRIPT } from '../data/command_script'
import { pathFromUrl } from '../domain/open_url'
import { installCommand, openedFromUrl } from './opening_api'
import type { OpeningDeps } from './opening_api'

const run = promisify(execFile)

let home: string
let folder: string
let bins: { usr: string; brew: string; local: string }
let deps: OpeningDeps
const logged: string[] = []

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const link = (path: string) => `queue-tea://open?path=${encodeURIComponent(path)}`

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-opening-')))
  folder = join(home, '.queue-tea/projects')
  await mkdir(folder, { recursive: true })
  bins = { usr: join(home, 'usr-bin'), brew: join(home, 'brew-bin'), local: join(home, '.local/bin') }
  logged.length = 0
  const log = createLogger('dev', line => logged.push(line))
  deps = {
    host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })),
    home,
    now: () => 0,
    log,
    offsetMinutes: () => 60,
    reveal: () => {},
    pickFolder: async () => null,
    commandDirs: [bins.usr, bins.brew, bins.local],
  }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('reading a link', () => {
  it.each([
    ['a plain path', 'queue-tea://open?path=%2Fp%2Fdemo', '/p/demo'],
    ['a space', 'queue-tea://open?path=%2Fp%2Fmy%20realm', '/p/my realm'],
    ['accents', `queue-tea://open?path=${encodeURIComponent('/p/café ☕')}`, '/p/café ☕'],
    ['a trailing slash', 'queue-tea://open?path=%2Fp%2Fdemo%2F', '/p/demo'],
  ])('takes %s', (_, url, path) => {
    expect(pathFromUrl(url)).toBe(path)
  })

  it.each([
    ['no path', 'queue-tea://open'],
    ['an empty path', 'queue-tea://open?path='],
    ['a relative path', 'queue-tea://open?path=demo'],
    ['another action', 'queue-tea://delete?path=%2Fp'],
    ['another scheme', 'https://open?path=%2Fp'],
    ['no host', 'queue-tea:open?path=%2Fp'],
    ['a null byte', 'queue-tea://open?path=%2Fp%00x'],
    ['rubbish', 'not a link'],
  ])('refuses %s', (_, url) => {
    expect(pathFromUrl(url)).toBeNull()
  })
})

describe('a link arriving', () => {
  it('offers to add a folder Queue-tea doesn\'t know, and writes nothing', async () => {
    const path = join(home, 'demo')
    await mkdir(path)

    expect(await openedFromUrl(deps, link(path))).toEqual({ kind: 'folder', pick: { path, name: 'demo', key: projectKey(path), isKnown: false, isRepo: false } })
  })

  it('knows a realm already there', async () => {
    const path = join(home, 'demo')
    await mkdir(path)
    await writeFile(join(folder, `${projectKey(path)}.json`), JSON.stringify(emptyRecord('demo', path)))

    expect(await openedFromUrl(deps, link(path))).toMatchObject({ kind: 'folder', pick: { isKnown: true } })
  })

  it('takes the repository\'s top folder, from inside it', async () => {
    const top = join(home, 'repo')
    await mkdir(join(top, 'src'), { recursive: true })
    await run('git', ['init', '-b', 'main'], { cwd: top })

    expect(await openedFromUrl(deps, link(join(top, 'src')))).toMatchObject({ kind: 'folder', pick: { path: top, isRepo: true } })
  })

  it('says so for a bad link', async () => {
    expect(await openedFromUrl(deps, 'queue-tea://open')).toEqual({ kind: 'failed', message: "That link doesn't name a folder Queue-tea can open." })
  })

  it('says so for a folder that isn\'t there', async () => {
    const path = join(home, 'moved-away')

    expect(await openedFromUrl(deps, link(path))).toEqual({ kind: 'failed', message: `There's no folder at ${path}.` })
  })

  it('says so rather than throwing when it can\'t look', async () => {
    deps = { ...deps, host: { ...deps.host, exists: () => Promise.reject(new Error('disk went away')) } }

    expect((await openedFromUrl(deps, link('/p/demo'))).kind).toBe('failed')
    expect(logged.join('\n')).toContain('disk went away')
  })
})

describe('installing the command', () => {
  const made = async () => {
    await mkdir(bins.usr, { recursive: true })
    await mkdir(bins.brew, { recursive: true })
  }

  it('goes in the first folder it can write to, ready to run', async () => {
    await made()

    expect(data(await installCommand(deps))).toEqual({ path: join(bins.usr, 'queue-tea'), needsPath: false })
    expect((await stat(join(bins.usr, 'queue-tea'))).mode & 0o111).toBe(0o111)
    expect(await readFile(join(bins.usr, 'queue-tea'), 'utf8')).toBe(COMMAND_SCRIPT)
  })

  it('moves on from a folder it can\'t write to', async () => {
    await made()
    await chmod(bins.usr, 0o555)

    try {
      expect(data(await installCommand(deps)).path).toBe(join(bins.brew, 'queue-tea'))
    } finally {
      await chmod(bins.usr, 0o755)
    }
  })

  it('moves on from a folder that isn\'t there', async () => {
    await mkdir(bins.brew)

    expect(data(await installCommand(deps)).path).toBe(join(bins.brew, 'queue-tea'))
  })

  it('falls back on ~/.local/bin, making it, and says it needs adding to the PATH', async () => {
    expect(data(await installCommand(deps))).toEqual({ path: join(bins.local, 'queue-tea'), needsPath: true })
  })

  it('replaces its own earlier copy', async () => {
    await made()
    await writeFile(join(bins.usr, 'queue-tea'), `${COMMAND_SCRIPT}\n# an older version\n`)

    data(await installCommand(deps))

    expect(await readFile(join(bins.usr, 'queue-tea'), 'utf8')).toBe(COMMAND_SCRIPT)
  })

  it('leaves a file that isn\'t its own, and says where', async () => {
    await made()
    const theirs = join(bins.usr, 'queue-tea')
    await writeFile(theirs, '#!/bin/sh\necho mine\n')

    expect(await installCommand(deps)).toEqual({ ok: false, error: { message: `There's already a queue-tea at ${theirs} that isn't ours, so nothing was changed.` } })
    expect(await readFile(theirs, 'utf8')).toBe('#!/bin/sh\necho mine\n')
  })

  it('shows on the Settings page once it\'s there', async () => {
    await made()
    expect(data(await readSettingsPage(deps)).command).toBeNull()

    data(await installCommand(deps))

    expect(data(await readSettingsPage(deps)).command).toEqual({ path: join(bins.usr, 'queue-tea'), needsPath: false })
  })

  it('doesn\'t take someone else\'s queue-tea for its own', async () => {
    await made()
    await writeFile(join(bins.usr, 'queue-tea'), 'theirs')

    expect(data(await readSettingsPage(deps)).command).toBeNull()
  })
})

describe('the command itself', () => {
  let script: string
  let opened: string

  // A real shell runs the real script; only `open` stands in.
  const runIt = (args: string[], cwd = home) => run('/bin/sh', [script, ...args], { cwd, env: { ...process.env, PATH: `${join(home, 'fake-bin')}:/usr/bin:/bin` } })
  const openedLink = async () => (await readFile(opened, 'utf8')).trim()

  beforeEach(async () => {
    script = join(home, 'queue-tea')
    opened = join(home, 'opened.txt')
    await writeFile(script, COMMAND_SCRIPT)
    await mkdir(join(home, 'fake-bin'))
    await writeFile(join(home, 'fake-bin/open'), `#!/bin/sh\nprintf '%s' "$1" > '${opened}'\n`)
    await chmod(join(home, 'fake-bin/open'), 0o755)
  })

  it.runIf(process.platform === 'darwin')('opens this folder with no path given', async () => {
    const here = join(home, 'demo')
    await mkdir(here)

    await runIt(['open'], here)

    expect(pathFromUrl(await openedLink())).toBe(here)
  })

  it.runIf(process.platform === 'darwin')('opens the folder named, from anywhere', async () => {
    const there = join(home, 'demo')
    await mkdir(there)

    await runIt(['open', 'demo'])

    expect(pathFromUrl(await openedLink())).toBe(there)
  })

  it.runIf(process.platform === 'darwin').each(['my realm', 'café ☕', "o'brien", 'a&b=c?d#e', 'per%20cent'])('carries %s through the link whole', async name => {
    const there = join(home, name)
    await mkdir(there)

    await runIt(['open', there])

    expect(pathFromUrl(await openedLink())).toBe(there)
  })

  it('says so for a folder that isn\'t there, and opens nothing', async () => {
    await expect(runIt(['open', join(home, 'nope')])).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('no such folder') })
    await expect(readFile(opened, 'utf8')).rejects.toThrow()
  })

  it.each([
    ['nothing', []],
    ['another command', ['delete']],
    ['too much', ['open', 'a', 'b']],
  ])('shows how to use it for %s', async (_, args) => {
    await expect(runIt(args)).rejects.toMatchObject({ code: 2, stderr: expect.stringContaining('usage: queue-tea open [path]') })
  })

  it.runIf(process.platform === 'darwin')('says so when the app isn\'t there to open', async () => {
    await writeFile(join(home, 'fake-bin/open'), '#!/bin/sh\nexit 1\n')

    await expect(runIt(['open'])).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('/Applications') })
  })
})
