import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import type { ProjectRecord } from '../../../../../types'
import { applyPending, createTracker } from '../../../../../hooks/shared/effort/domain/services/effort_tracker'
import { leaveCodexUseCase } from '../../../../../hooks/features/tasks/domain/usecases/leave_codex'
import type { Deps } from '../../../../../hooks/features/tasks/domain/usecases/deps'
import { emptyRecord, parseRecord, updateRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import { weekMinutes } from '../../../../../hooks/shared/time/domain/services/week_stats'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from '../../tasks/api/fixtures'
import { manaOf } from '../../mana/domain/mana'
import { chronicleOf, dayTimeOf } from './chronicle'

const DAY = '2026-11-19'
const MINUTE = 60_000
const at = (hour: number) => Date.parse(`${DAY}T00:00:00Z`) + hour * 60 * MINUTE
const folders: string[] = []

afterEach(async () => {
  await Promise.all(folders.splice(0).map(folder => rm(folder, { recursive: true, force: true })))
})

const store = async (record: ProjectRecord) => {
  const folder = await mkdtemp(join(tmpdir(), 'queue-tea-realm-time-'))
  folders.push(folder)
  const file = join(folder, 'record.json')
  await writeFile(file, JSON.stringify(record))
  const quiet = () => {}
  const host = nodeHost({ debug: quiet, warn: quiet, error: quiet }, async () => ({ exitCode: 0, stdout: '', stderr: '' }))

  return { file, host }
}

const realm = (name = 'demo'): ProjectRecord => ({
  ...emptyRecord(name, `/p/${name}`),
  tasks: ['one', 'two'].map(id => makeTask({ id, title: id, state: 'current', worktreePath: `/trees/${id}` })),
})

const pending = (start: number, end: number, elsewhere = false, offset = 0) => {
  const tracker = createTracker(15, offset)
  if (elsewhere) tracker.route('project')
  tracker.activity(start)
  for (let time = start + 15 * MINUTE; time < end; time += 15 * MINUTE) tracker.activity(time)
  tracker.activity(end)

  return tracker.take()
}

const add = (record: ProjectRecord, id: string, start: number, end: number, elsewhere = false, offset = 0) =>
  applyPending(record, pending(start, end, elsewhere, offset), undefined, { projectPath: record.project.path, cwd: `/trees/${id}` })

describe('daily work time in a Realm', () => {
  it('merges 1–4 pm and 2–5 pm into four Realm hours and keeps three hours on each task', () => {
    const record = add(add(realm(), 'one', at(13), at(16)), 'two', at(14), at(17))
    const view = manaOf(record, DAY)

    expect(view.today).toEqual({ day: DAY, onQuests: 240, elsewhere: 0 })
    expect(view.weekMinutes).toBe(240)
    expect(view.byQuest.map(row => row.minutes)).toEqual([180, 180])
    expect(chronicleOf([record], DAY, DAY).minutes).toBe(240)
    expect(weekMinutes(record.tasks, record.unassignedMinutesByDay, DAY, record.realmTime)[3]).toBe(240)
  })

  it('preserves gaps, joins touching periods and ignores nested overlaps regardless of arrival order', () => {
    let record = add(realm(), 'two', at(14), at(15))
    record = add(record, 'one', at(9), at(10))
    record = add(record, 'two', at(9.25), at(9.75))
    record = add(record, 'one', at(10), at(11))

    expect(dayTimeOf([record], DAY).onQuests).toBe(180)
    expect(manaOf(record, DAY).byQuest.map(row => row.minutes)).toEqual([120, 90])
  })

  it('keeps each Realm independent when work overlaps across projects', () => {
    const first = add(realm('first'), 'one', at(13), at(16))
    const second = add(realm('second'), 'one', at(14), at(17))

    expect(manaOf(first, DAY).weekMinutes).toBe(180)
    expect(manaOf(second, DAY).weekMinutes).toBe(180)
  })

  it('counts Elsewhere only once when it overlaps task work, without reducing the saved task time', () => {
    const record = add(add(realm(), 'one', at(13), at(16)), 'two', at(14), at(17), true)

    expect(dayTimeOf([record], DAY)).toEqual({ day: DAY, onQuests: 180, elsewhere: 60 })
    expect(record.tasks[0]!.minutesByDay[DAY]).toBe(180)
    expect(record.unassignedMinutesByDay[DAY]).toBe(180)
  })

  it('preserves earlier recorded minutes that have no periods, including a write from an older tracker', () => {
    let record = realm()
    record.tasks[0]!.minutesByDay[DAY] = 25
    record.unassignedMinutesByDay[DAY] = 10
    record = add(add(record, 'one', at(13), at(16)), 'two', at(14), at(17))

    expect(manaOf(record, DAY).weekMinutes).toBe(275)
    record.tasks[1]!.minutesByDay[DAY]! += 7
    expect(manaOf(record, DAY).weekMinutes).toBe(282)
  })

  it('splits Realm work at local midnight while leaving the task accounting rule intact', () => {
    const start = Date.parse('2026-11-19T21:55:00Z')
    const record = add(realm(), 'one', start, start + 10 * MINUTE, false, 120)

    expect(dayTimeOf([record], DAY).onQuests).toBe(5)
    expect(dayTimeOf([record], '2026-11-20').onQuests).toBe(5)
    expect(record.tasks[0]!.minutesByDay).toEqual({ '2026-11-20': 10 })
  })

  it('does not turn a long idle gap into continuous work', () => {
    const tracker = createTracker(15, 0)
    for (const time of [at(9), at(9.25), at(14), at(14.25)]) tracker.activity(time)
    const record = applyPending(realm(), tracker.take(), undefined, { cwd: '/trees/one', projectPath: '/p/demo' })

    expect(manaOf(record, DAY).weekMinutes).toBe(30)
  })

  it('survives serialization, a restarted tracker and two concurrent writers to the same record', async () => {
    const { file, host } = await store(realm())
    await Promise.all([
      updateRecord(host, file, r => add(r, 'one', at(13), at(16)), 'demo', '/p/demo'),
      updateRecord(host, file, r => add(r, 'two', at(14), at(17)), 'demo', '/p/demo'),
    ])
    const record = parseRecord(await readFile(file, 'utf8'))
    expect(record).not.toBe('unreadable')
    if (record === 'unreadable') throw new Error('Saved record did not load')

    expect(manaOf(record, DAY).weekMinutes).toBe(240)
    const resumed = add(record, 'one', at(17), at(18))
    expect(manaOf(resumed, DAY).weekMinutes).toBe(300)
    expect(resumed.tasks.map(task => task.minutesByDay[DAY])).toEqual([240, 180])
  })

  it('merges returned Codex activity with live Claude activity and imports a concurrent return once', async () => {
    const initial = add(realm(), 'one', at(13), at(16))
    initial.tasks[1]!.codexSince = new Date(at(14)).toISOString()
    const { file, host } = await store(initial)
    const stamps = Array.from({ length: 13 }, (_, index) => at(14) + index * 15 * MINUTE)
    const deps = {
      records: {
        read: async () => parseRecord(await readFile(file, 'utf8')),
        update: (change: (record: ProjectRecord) => ProjectRecord) => updateRecord(host, file, change, 'demo', '/p/demo'),
      },
      codex: { activitySince: async () => stamps },
      env: { now: async () => at(17), log: () => {} },
    } as unknown as Deps
    const ctx = {
      projectPath: '/p/demo', projectName: 'demo', cwd: '/trees/two', home: tmpdir(), file, offsetMinutes: 0,
      options: { idleGapMinutes: 15, freshAtTokens: 100_000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
    }

    await Promise.all([leaveCodexUseCase(deps, ctx, 'two'), leaveCodexUseCase(deps, ctx, 'two')])
    const saved = parseRecord(await readFile(file, 'utf8'))
    if (saved === 'unreadable') throw new Error('Codex record did not load')

    expect(manaOf(saved, DAY).weekMinutes).toBe(240)
    expect(saved.tasks.map(task => task.minutesByDay[DAY])).toEqual([180, 180])
    expect(saved.tasks[1]!.codexSince).toBeNull()
  })

  it('stores adjacent activity compactly instead of saving every tool stamp', () => {
    const record = add(realm(), 'one', at(13), at(16))

    expect(record.realmTime?.days[DAY]?.onQuests).toEqual([{ start: at(13), end: at(16) }])
  })

  it('preserves older records, but refuses malformed saved work periods', () => {
    expect(parseRecord(JSON.stringify(realm()))).not.toBe('unreadable')
    const record = add(realm(), 'one', at(13), at(16))
    const malformed = JSON.parse(JSON.stringify(record))
    malformed.realmTime.days[DAY].onQuests[0].end = 'not a time'

    expect(parseRecord(JSON.stringify(malformed))).toBe('unreadable')
  })
})
