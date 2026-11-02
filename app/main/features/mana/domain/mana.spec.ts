import { describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../types'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { SessionFile } from '../../../../../hooks/shared/sessions/domain/entities/session_file'
import { makeTask } from '../../tasks/api/fixtures'
import { allowanceOf, manaOf } from './mana'

const TODAY = '2026-10-28'
const NOW = Date.parse('2026-10-28T12:00:00Z')

const record = (tasks: Task[], unassigned: Record<string, number> = {}): ProjectRecord => ({ ...emptyRecord('demo', '/p/demo'), tasks, unassignedMinutesByDay: unassigned })

const session = (over: Partial<SessionFile>): SessionFile =>
  ({ id: 's', projectPath: '/p/demo', recordFile: 'f', currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW, ...over }) as SessionFile

describe('time in a realm', () => {
  it('splits today into quests and elsewhere', () => {
    const view = manaOf(record([makeTask({ id: 'x', minutesByDay: { [TODAY]: 19 } })], { [TODAY]: 118 }), TODAY)

    expect(view.today).toEqual({ day: TODAY, onQuests: 19, elsewhere: 118 })
  })

  it('compares this week with the last', () => {
    const view = manaOf(record([makeTask({ id: 'x', minutesByDay: { '2026-10-20': 100, '2026-10-26': 30 } })], { '2026-10-27': 12 }), TODAY)

    expect(view).toMatchObject({ weekMinutes: 42, lastWeekMinutes: 100 })
  })

  it('counts this week\'s victories and what is in progress', () => {
    const view = manaOf(record([makeTask({ id: 'a', state: 'done', finished: '2026-10-27T12:00:00+01:00' }), makeTask({ id: 'b', state: 'done', finished: '2026-10-20T12:00:00+01:00' }), makeTask({ id: 'c', state: 'current' })]), TODAY)

    expect(view).toMatchObject({ victories: 1, inProgress: 1 })
  })

  it('lists this week\'s time by quest, the most first, without quests that had none', () => {
    const view = manaOf(record([makeTask({ id: 'a', title: 'Small', minutesByDay: { [TODAY]: 5 } }), makeTask({ id: 'b', title: 'Big', minutesByDay: { [TODAY]: 50 } }), makeTask({ id: 'c', title: 'Old', minutesByDay: { '2026-10-01': 50 } })], { [TODAY]: 9 }), TODAY)

    expect(view.byQuest).toEqual([{ title: 'Big', minutes: 50 }, { title: 'Small', minutes: 5 }])
    expect(view.elsewhere).toBe(9)
  })

  it('leaves the active quest out when there is none', () => {
    expect(manaOf(record([]), TODAY).active).toBeNull()
  })

  it('keeps the active quest\'s messages and files', () => {
    const task = makeTask({ id: 'a', title: 'Boss', state: 'current', priority: 'urgent', minutesByDay: { [TODAY]: 43 }, effort: { understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39, linesAdded: 0, linesRemoved: 0, filesTouched: 0 } })

    expect(manaOf(record([task]), TODAY).active).toMatchObject({ title: 'Boss', isBoss: true, minutes: 43, understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39 })
  })
})

describe('the allowance', () => {
  it('takes the newest live session that knows it', () => {
    const allowance = allowanceOf([session({ heartbeat: NOW - 1_000, allowance: { percent: 40, resetsAt: null } }), session({ heartbeat: NOW, allowance: { percent: 62, resetsAt: null } })], NOW)

    expect(allowance).toMatchObject({ percent: 62, isStale: false, seenAt: NOW })
  })

  it('falls back on the last one seen, and says it is old', () => {
    const allowance = allowanceOf([session({ heartbeat: NOW - 600_000, allowance: { percent: 62, resetsAt: null } })], NOW)

    expect(allowance).toMatchObject({ percent: 62, isStale: true })
  })

  it('has nothing to say when no session reported it', () => {
    expect(allowanceOf([session({ allowance: null })], NOW)).toBeNull()
  })
})
