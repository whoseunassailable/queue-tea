import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord, parseRecord, projectKey } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from '../../tasks/api/fixtures'
import { readProject } from '../../projects/api/projects_api'
import { addProject, openFolder, readSettingsPage, restoreRealm, setTaskLog, showRecord } from './realms_api'
import type { RealmsDeps } from './realms_api'

const NOW = Date.parse('2026-10-26T16:50:00Z')
const run = promisify(execFile)

let home: string
let folder: string
let revealed: string[]
let picked: string | null
let deps: RealmsDeps

const fileOf = (key: string) => join(folder, `${key}.json`)
const seed = (key: string, over: object = {}) => writeFile(fileOf(key), JSON.stringify({ ...emptyRecord(key.split('-')[0]!, `/p/${key}`), ...over }))
const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = <T>(answer: Reply<T>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const session = async (over: object) => {
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: '/p/a-000001', recordFile: 'x', currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW, ...over }))
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-realms-')))
  folder = join(home, '.queue-tea/projects')
  await mkdir(folder, { recursive: true })
  revealed = []
  picked = null
  const log = createLogger('dev', () => {})
  deps = {
    host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })),
    home,
    now: () => NOW,
    log,
    offsetMinutes: () => 60,
    reveal: path => void revealed.push(path),
    pickFolder: async () => picked,
  }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('the Settings page', () => {
  it('shows only the realm you\'re in, with its log and whether it has a last good copy', async () => {
    await seed('a-000001', { docsLogPath: 'docs/task_log.md' })
    await seed('b-000002')
    await writeFile(`${fileOf('a-000001')}.bak`, '{}')

    const page = data(await readSettingsPage(deps, 'a-000001'))

    expect(page.realm).toEqual({ key: 'a-000001', name: 'a', path: '/p/a-000001', file: 'a-000001.json', hasCopy: true, logPath: 'docs/task_log.md', isReadable: true })
    expect(JSON.stringify(page)).not.toContain('b-000002')
  })

  it('shows no realm with none picked', async () => {
    await seed('a-000001')

    expect(data(await readSettingsPage(deps, null)).realm).toBeNull()
  })

  it('refuses a realm it doesn\'t know', async () => {
    expect((await readSettingsPage(deps, 'nope-000000')).ok).toBe(false)
  })

  it('keeps a record that doesn\'t read, without its log', async () => {
    await writeFile(fileOf('broken-000003'), '{ not json')

    expect(data(await readSettingsPage(deps, 'broken-000003')).realm).toEqual({ key: 'broken-000003', name: 'broken', path: '', file: 'broken-000003.json', hasCopy: false, logPath: null, isReadable: false })
  })

  it('shows the defaults, marked, with no session', async () => {
    expect(data(await readSettingsPage(deps, null))).toMatchObject({ isDefault: true, options: { freshAtTokens: expect.any(Number) } })
  })

  it('shows a live session\'s own values', async () => {
    await session({ options: { idleGapMinutes: 7, freshAtTokens: 1, handoffAtPercent: 2, checkTimeoutSeconds: 3 } })

    expect(data(await readSettingsPage(deps, null))).toMatchObject({ isDefault: false, options: { idleGapMinutes: 7 } })
  })

  it('doesn\'t trust a session gone stale', async () => {
    await session({ heartbeat: NOW - 91_000, options: { idleGapMinutes: 7 } })

    expect(data(await readSettingsPage(deps, null)).isDefault).toBe(true)
  })
})

describe('the task log path', () => {
  it('saves the path', async () => {
    await seed('a-000001')

    data(await setTaskLog(deps, 'a-000001', ' notes/log.md '))

    expect(JSON.parse(await readFile(fileOf('a-000001'), 'utf8')).docsLogPath).toBe('notes/log.md')
  })

  it.each([
    ['nothing', '   ', 'Task log path is required.'],
    ['a folder', 'docs/', 'Enter a file path, such as docs/task_log.md.'],
  ])('refuses %s, as the Finish sheet does', async (_, path, message) => {
    await seed('a-000001')

    expect(refused(await setTaskLog(deps, 'a-000001', path))).toBe(message)
    expect(JSON.parse(await readFile(fileOf('a-000001'), 'utf8')).docsLogPath).toBeNull()
  })

  it.each([
    ['a path into another project', '../other-project/docs/task_log.md'],
    ['an absolute path elsewhere', '/p/other-project/docs/task_log.md'],
    ['a path that leaves and looks back', 'docs/../../other-project/log.md'],
  ])('refuses %s, so one realm\'s log can\'t land in another', async (_, path) => {
    await seed('a-000001')

    expect(refused(await setTaskLog(deps, 'a-000001', path))).toBe("The task log has to stay inside this realm's folder.")
    expect(JSON.parse(await readFile(fileOf('a-000001'), 'utf8')).docsLogPath).toBeNull()
  })

  it('refuses no path at all', async () => {
    await seed('a-000001')

    expect(refused(await setTaskLog(deps, 'a-000001', null))).toBe('Task log path is required.')
  })

  it('refuses a realm that doesn\'t read', async () => {
    await writeFile(fileOf('broken-000003'), '{ not json')

    expect((await setTaskLog(deps, 'broken-000003', 'log.md')).ok).toBe(false)
  })
})

describe('showing a record in Finder', () => {
  it('shows a realm\'s file, by key', async () => {
    await seed('a-000001')

    data(await showRecord(deps, 'a-000001'))

    expect(revealed).toEqual([fileOf('a-000001')])
  })

  it('never reveals a path made up by the window', async () => {
    expect((await showRecord(deps, '../../etc/passwd')).ok).toBe(false)
    expect(revealed).toEqual([])
  })
})

describe('Open folder', () => {
  it('does nothing when the dialog is cancelled', async () => {
    expect(data(await openFolder(deps))).toBeNull()
  })

  it('offers to add a folder with no record, and writes nothing yet', async () => {
    picked = join(home, 'demo')
    await mkdir(picked)

    expect(data(await openFolder(deps))).toEqual({ path: picked, name: 'demo', key: projectKey(picked), isKnown: false, isRepo: false })
    expect(await readdir(folder)).toEqual([])
  })

  it('knows a realm already there', async () => {
    picked = join(home, 'demo')
    await mkdir(picked)
    await writeFile(join(folder, `${projectKey(picked)}.json`), JSON.stringify(emptyRecord('demo', picked)))

    expect(data(await openFolder(deps))).toMatchObject({ isKnown: true, key: projectKey(picked) })
  })

  it('takes the repository\'s top folder when given one inside it', async () => {
    const top = join(home, 'repo')
    await mkdir(join(top, 'src/deep'), { recursive: true })
    await run('git', ['init', '-b', 'main'], { cwd: top })
    picked = join(top, 'src/deep')

    expect(data(await openFolder(deps))).toEqual({ path: top, name: 'repo', key: projectKey(top), isKnown: false, isRepo: true })
  })
})

describe('adding a realm', () => {
  it('writes an empty record in the projects folder, and nothing in the project', async () => {
    const path = join(home, 'demo')
    await mkdir(path)

    const key = data(await addProject(deps, path))

    expect(key).toBe(projectKey(path))
    expect(parseRecord(await readFile(fileOf(key), 'utf8'))).toMatchObject({ project: { name: 'demo', path }, tasks: [] })
    expect(await readdir(path)).toEqual([])
  })

  it('keeps a record already there', async () => {
    const path = join(home, 'demo')
    await mkdir(path)
    const key = projectKey(path)
    await writeFile(fileOf(key), JSON.stringify({ ...emptyRecord('demo', path), tasks: [makeTask({ id: 'keep-me' })] }))

    data(await addProject(deps, path))

    expect(JSON.parse(await readFile(fileOf(key), 'utf8')).tasks).toHaveLength(1)
  })

  it('uses the repository\'s top folder, as a session in it would', async () => {
    const top = join(home, 'repo')
    await mkdir(join(top, 'src'), { recursive: true })
    await run('git', ['init', '-b', 'main'], { cwd: top })

    expect(data(await addProject(deps, join(top, 'src')))).toBe(projectKey(top))
  })

  it.each([
    ['a relative path', 'demo'],
    ['nothing', ''],
    ['not text', 42],
  ])('refuses %s', async (_, path) => {
    expect((await addProject(deps, path)).ok).toBe(false)
    expect(await readdir(folder)).toEqual([])
  })

  it('refuses a folder that isn\'t there', async () => {
    expect((await addProject(deps, join(home, 'no-such-folder'))).ok).toBe(false)
    expect(await readdir(folder)).toEqual([])
  })
})

describe('the failed record', () => {
  const GOOD = JSON.stringify(emptyRecord('a', '/p/a'))

  it('says why it can\'t be read', async () => {
    await writeFile(fileOf('a-000001'), '{ "version": 3 }')

    expect(data(await readProject(deps, 'a-000001'))).toMatchObject({ kind: 'unreadable', isNewer: true, reason: 'it was written by a newer Queue-tea (record version 3); update Queue-tea to read it', file: fileOf('a-000001') })
  })

  it('puts the last good copy back, and keeps the broken one beside it', async () => {
    await writeFile(fileOf('a-000001'), '{ not json')
    await writeFile(`${fileOf('a-000001')}.bak`, GOOD)

    const keptAs = data(await restoreRealm(deps, 'a-000001'))

    expect(parseRecord(await readFile(fileOf('a-000001'), 'utf8'))).toMatchObject({ project: { name: 'a' } })
    expect(keptAs).toBe('a-000001.json.broken-2026-10-26T17-50-00')
    expect(await readFile(join(folder, keptAs), 'utf8')).toBe('{ not json')
  })

  it('refuses a record written by a newer Queue-tea, even with a copy there', async () => {
    const newer = JSON.stringify({ version: 3, future: 'work' })
    await writeFile(fileOf('a-000001'), newer)
    await writeFile(`${fileOf('a-000001')}.bak`, GOOD)

    expect(refused(await restoreRealm(deps, 'a-000001'))).toBe('There is no good copy of this record to go back to.')
    expect(await readFile(fileOf('a-000001'), 'utf8')).toBe(newer)
  })

  it('refuses with no copy', async () => {
    await writeFile(fileOf('a-000001'), '{ not json')

    expect((await restoreRealm(deps, 'a-000001')).ok).toBe(false)
    expect(await readFile(fileOf('a-000001'), 'utf8')).toBe('{ not json')
  })

  it('leaves a record that reads alone', async () => {
    await writeFile(fileOf('a-000001'), GOOD)
    await writeFile(`${fileOf('a-000001')}.bak`, JSON.stringify(emptyRecord('old', '/p/old')))

    data(await restoreRealm(deps, 'a-000001'))

    expect(await readFile(fileOf('a-000001'), 'utf8')).toBe(GOOD)
  })

  it('refuses a key that isn\'t one', async () => {
    expect((await restoreRealm(deps, '../secret')).ok).toBe(false)
  })
})
