import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../types'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import type { TasksDeps } from '../../tasks/api/scope'
import { scopeOf } from '../../tasks/api/scope'
import { makeTask } from '../../tasks/api/fixtures'
import { changePlan, readPlan } from './plan_api'

const KEY = 'demo-abc123'
const OTHER = 'other-def456'
const NOW = Date.parse('2026-11-26T08:00:00Z')
let home: string
let deps: TasksDeps
const logged: string[] = []

const fileOf = (key: string) => `${home}/.queue-tea/projects/${key}.json`
const seed = (key: string, tasks: Task[], over: Partial<ProjectRecord> = {}) =>
  writeFile(fileOf(key), JSON.stringify({ ...emptyRecord(key.split('-')[0]!, `/p/${key}`), tasks, ...over }))
const onDisk = async (key = KEY) => {
  const read = parseRecord(await readFile(fileOf(key), 'utf8'))
  if (read === 'unreadable') throw new Error('should read')

  return read
}
const stored = async (id: string) => (await onDisk()).tasks.find(t => t.id === id)!

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-plan-'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  logged.length = 0
  const log = createLogger('dev', line => logged.push(line))
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => 't-child', terminal: async () => 'terminal', copy: () => {} }
})
afterEach(() => rm(home, { recursive: true, force: true }))

describe('reading the plan', () => {
  it('reads every realm, and counts one that does not read', async () => {
    await seed(KEY, [makeTask({ id: 'a', title: 'First' })])
    await seed(OTHER, [makeTask({ id: 'b', title: 'Second' })])
    await writeFile(fileOf('broken-000aaa'), '{half')

    const read = await readPlan(deps)
    if (!read.ok) throw new Error('should read')

    expect(read.data.realms.map(r => r.key).sort()).toEqual([KEY, OTHER])
    expect(read.data.unreadable).toBe(1)
  })
})

describe('changing the plan', () => {
  it('writes the change and hands back the realm with what Undo needs', async () => {
    await seed(KEY, [makeTask({ id: 'a' }), makeTask({ id: 'b' })])

    const changed = await changePlan(deps, KEY, { kind: 'bulk', ids: ['a'], op: { kind: 'points', points: 8 } })
    if (!changed.ok) throw new Error(changed.error.message)

    expect((await stored('a')).points).toBe(8)
    expect(changed.data.view.kind).toBe('readable')
    expect(changed.data.undo).toEqual([expect.objectContaining({ id: 'a', points: null })])

    const undone = await changePlan(deps, KEY, { kind: 'restore', quests: changed.data.undo })
    expect(undone.ok).toBe(true)
    expect('points' in (await stored('a'))).toBe(false)
  })

  it('adds a child quest with a new id', async () => {
    await seed(KEY, [makeTask({ id: 'a', title: 'Parent' })])

    expect((await changePlan(deps, KEY, { kind: 'childQuest', parentId: 'a', title: 'Small part' })).ok).toBe(true)
    expect(await stored('t-child')).toMatchObject({ title: 'Small part', parentQuest: 'a', state: 'queued' })
  })

  it('refuses in plain words and leaves the file as it was', async () => {
    await seed(KEY, [makeTask({ id: 'a', title: 'Waits' }), makeTask({ id: 'b', title: 'Blocker', blockedBy: ['a'] })])
    const before = await readFile(fileOf(KEY), 'utf8')

    const refused = await changePlan(deps, KEY, { kind: 'link', id: 'a', link: 'dependsOn', to: 'b', isOn: true })

    expect(refused).toEqual({ ok: false, error: { message: MESSAGES.planLoop('Waits', 'Blocker') } })
    expect(JSON.parse(await readFile(fileOf(KEY), 'utf8')).tasks).toEqual(JSON.parse(before).tasks)
  })

  it('refuses a change that does not read, and an unknown realm', async () => {
    await seed(KEY, [makeTask({ id: 'a' })])

    expect(await changePlan(deps, KEY, { kind: 'bulk', ids: ['a'], op: { kind: 'points', points: 7 } })).toEqual({ ok: false, error: { message: MESSAGES.badValue } })
    expect(await changePlan(deps, 'nope-000000', { kind: 'rank', id: 'a', before: null })).toEqual({ ok: false, error: { message: MESSAGES.unknownProject } })
  })

  it('a record that stops reading is refused and left alone', async () => {
    await writeFile(fileOf(KEY), '{half a reco')

    expect(await changePlan(deps, KEY, { kind: 'rank', id: 'a', before: null })).toMatchObject({ ok: false })
    expect(await readFile(fileOf(KEY), 'utf8')).toBe('{half a reco')
  })
})

describe('old records and the mod', () => {
  it('reads a record saved before planning existed', async () => {
    await writeFile(fileOf(KEY), JSON.stringify({ ...emptyRecord('demo', '/p/demo'), tasks: [makeTask({ id: 'a' })] }))

    const read = await readPlan(deps)
    if (!read.ok) throw new Error('should read')

    expect(read.data.realms[0]?.quests[0]).toMatchObject({ tags: [], points: null, rank: null, parentQuest: null, links: [] })
  })

  it('the mod’s own writes keep the planning fields', async () => {
    await seed(KEY, [makeTask({ id: 'a', tags: ['ui'], points: 3, rank: 0, links: [{ kind: 'relates', id: 'b' }] }), makeTask({ id: 'b', parentQuest: 'a' })])
    const { deps: mod } = await scopeOf(deps, KEY)

    await mod.records.update(r => ({ ...r, tasks: r.tasks.map(t => ({ ...t, priority: 'high' as const })) }))

    expect(await stored('a')).toMatchObject({ tags: ['ui'], points: 3, rank: 0, links: [{ kind: 'relates', id: 'b' }], priority: 'high' })
    expect(await stored('b')).toMatchObject({ parentQuest: 'a' })
  })
})
