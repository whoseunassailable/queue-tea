import { describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../../types'
import { emptyRecord } from '../../../../../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../../../tasks/api/fixtures'
import { victoryOf } from './victory'

const NOW = Date.parse('2026-10-27T12:00:00Z')
const PATH = '/p/demo'

const won = (over: Partial<Task> & { id: string; hard?: boolean }): Task =>
  makeTask({ state: 'done', finished: '2026-10-27T12:00:00+01:00', difficulty: { expected: 'medium', actual: 'medium' }, ...over })

const record = (tasks: Task[], path = PATH): ProjectRecord => ({ ...emptyRecord('demo', path), tasks })

describe('what a win earned', () => {
  it('counts the XP and gold by the difficulty chosen, not the one expected', () => {
    const task = won({ id: 'one', title: 'Fix it', difficulty: { expected: 'light', actual: 'hard' } })

    expect(victoryOf([record([task])], PATH, 'one', 60, NOW)).toMatchObject({ title: 'Fix it', xp: 50, gold: 50, actual: 'hard', expected: 'light', hoard: 50 })
  })

  it('reports where the bar stands after the win', () => {
    const task = won({ id: 'one', difficulty: { expected: 'hard', actual: 'hard' } })
    const other = won({ id: 'old', difficulty: { expected: 'hard', actual: 'hard' } })

    expect(victoryOf([record([task, other])], PATH, 'one', 60, NOW)).toMatchObject({ level: 2, didLevelUp: true, xpIntoLevel: 0, xpToNextLevel: 200, nextLevelAt: 300, stage: 'hatchling' })
  })

  it('stays on the level when the win does not reach the next', () => {
    expect(victoryOf([record([won({ id: 'one' })])], PATH, 'one', 60, NOW)).toMatchObject({ level: 1, didLevelUp: false, xpIntoLevel: 25, xpToNextLevel: 100 })
  })

  it('names a badge earned by this win', () => {
    const victory = victoryOf([record([won({ id: 'one' })])], PATH, 'one', 60, NOW)

    expect(victory.newBadges).toContain('firstFlame')
  })

  it('leaves out a badge earned before', () => {
    const older = won({ id: 'old', finished: '2026-10-20T12:00:00+01:00' })

    expect(victoryOf([record([older, won({ id: 'one' })])], PATH, 'one', 60, NOW).newBadges).not.toContain('firstFlame')
  })

  it('counts every realm in the hoard', () => {
    const elsewhere = record([won({ id: 'far', finished: '2026-10-20T12:00:00+01:00' })], '/p/other')

    expect(victoryOf([record([won({ id: 'one' })]), elsewhere], PATH, 'one', 60, NOW).hoard).toBe(50)
  })

  it('calls an urgent quest a boss', () => {
    expect(victoryOf([record([won({ id: 'one', priority: 'urgent' })])], PATH, 'one', 60, NOW).kind).toBe('boss')
  })

  it('calls the win that ends a saga a saga won', () => {
    const saga = won({ id: 'saga' })
    const chapter = won({ id: 'one', parentId: 'saga' })

    expect(victoryOf([record([saga, chapter])], PATH, 'one', 60, NOW).kind).toBe('saga')
  })

  it('keeps a chapter a quest while the saga goes on', () => {
    const saga = makeTask({ id: 'saga' })
    const chapter = won({ id: 'one', parentId: 'saga' })

    expect(victoryOf([record([saga, chapter])], PATH, 'one', 60, NOW).kind).toBe('quest')
  })

  it('throws when the win is not in the records, for the caller to report', () => {
    expect(() => victoryOf([record([])], PATH, 'one', 60, NOW)).toThrow()
  })
})
