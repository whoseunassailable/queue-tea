import { describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../types'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../../tasks/api/fixtures'
import { chronicleOf } from './chronicle'

const TODAY = '2026-10-28' // a Wednesday

const won = (id: string, day: string, over: Partial<Task> = {}): Task =>
  makeTask({ id, state: 'done', finished: `${day}T12:00:00+01:00`, difficulty: { expected: 'medium', actual: 'medium' }, minutesByDay: { [day]: 30 }, ...over })

const record = (name: string, tasks: Task[], unassigned: Record<string, number> = {}): ProjectRecord => ({ ...emptyRecord(name, `/p/${name}`), tasks, unassignedMinutesByDay: unassigned })

describe('a week of the chronicle', () => {
  it('runs Monday to Sunday and says which week it is', () => {
    const view = chronicleOf([record('a', [])], TODAY, TODAY)

    expect(view.days.map(d => d.day)).toEqual(['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01'])
    expect(view.isThisWeek).toBe(true)
  })

  it('splits each day into time on quests and time elsewhere', () => {
    const view = chronicleOf([record('a', [makeTask({ id: 'x', minutesByDay: { '2026-10-27': 20 } }), won('y', '2026-10-27')], { '2026-10-27': 15 })], TODAY, TODAY)

    expect(view.days[1]).toEqual({ day: '2026-10-27', onQuests: 50, elsewhere: 15 })
    expect(view).toMatchObject({ minutes: 65, onQuests: 50, elsewhere: 15 })
  })

  it('adds up the realms it was given', () => {
    const view = chronicleOf([record('a', [won('x', '2026-10-27')]), record('b', [won('y', '2026-10-28')], { '2026-10-28': 10 })], TODAY, TODAY)

    expect(view.victories.map(v => v.realm)).toEqual(['b', 'a'])
    expect(view.minutes).toBe(70)
  })

  it('counts who was as expected, harder and easier, and the XP by what it really was', () => {
    const view = chronicleOf(
      [
        record('a', [
          won('same', '2026-10-27'),
          won('up', '2026-10-27', { difficulty: { expected: 'light', actual: 'hard' } }),
          won('down', '2026-10-27', { difficulty: { expected: 'hard', actual: 'light' } }),
        ]),
      ],
      TODAY,
      TODAY,
    )

    expect(view).toMatchObject({ asExpected: 1, harder: 1, easier: 1, xp: 85 })
  })

  it('takes a win with no actual difficulty as expected', () => {
    const view = chronicleOf([record('a', [won('x', '2026-10-27', { difficulty: { expected: 'hard', actual: null } })])], TODAY, TODAY)

    expect(view).toMatchObject({ asExpected: 1, xp: 50 })
    expect(view.victories[0]!.actual).toBe('hard')
  })

  it('lists the latest win first, and leaves out other weeks', () => {
    const view = chronicleOf([record('a', [won('old', '2026-10-20'), won('one', '2026-10-26'), won('two', '2026-10-28')])], TODAY, TODAY)

    expect(view.victories.map(v => v.id)).toEqual(['two', 'one'])
  })

  it('reads an earlier week from any day in it', () => {
    const view = chronicleOf([record('a', [won('old', '2026-10-20')])], '2026-10-22', TODAY)

    expect(view.days[0]!.day).toBe('2026-10-19')
    expect(view.victories.map(v => v.id)).toEqual(['old'])
    expect(view.isThisWeek).toBe(false)
  })

  it('tells of last week for the empty state', () => {
    const view = chronicleOf([record('a', [won('old', '2026-10-20')], { '2026-10-21': 5 })], TODAY, TODAY)

    expect(view.lastWeek).toEqual({ victories: 1, minutes: 35 })
    expect(view.hasAny).toBe(true)
  })

  it('a week with no time at all is all zeroes, and nothing breaks', () => {
    const view = chronicleOf([record('a', [])], TODAY, TODAY)

    expect(view).toMatchObject({ minutes: 0, onQuests: 0, elsewhere: 0, asExpected: 0, harder: 0, easier: 0, xp: 0, hasAny: false, lastWeek: { victories: 0, minutes: 0 } })
    expect(view.victories).toEqual([])
  })

  it('a day with time and no victory still counts', () => {
    const view = chronicleOf([record('a', [], { '2026-10-27': 40 })], TODAY, TODAY)

    expect(view).toMatchObject({ minutes: 40, elsewhere: 40, hasAny: false })
    expect(view.victories).toEqual([])
  })

  it('keeps what a row needs for its detail', () => {
    const task = won('x', '2026-10-27', {
      title: 'Fix it',
      branch: 'task/fix',
      startCommit: 'abcdef1234',
      started: '2026-10-27T11:00:00+01:00',
      effort: { understandingMessages: 1, improvingMessages: 4, filesRead: 2, filesChanged: 16, linesAdded: 958, linesRemoved: 799, filesTouched: 27 },
    })

    expect(chronicleOf([record('a', [task])], TODAY, TODAY).victories[0]).toMatchObject({
      title: 'Fix it',
      branch: 'task/fix',
      startCommit: 'abcdef1234',
      started: '2026-10-27T11:00:00+01:00',
      improvingMessages: 4,
      filesRead: 2,
      filesChanged: 16,
      linesAdded: 958,
      linesRemoved: 799,
      filesTouched: 27,
      minutes: 30,
    })
  })
})
