import { describe, expect, it } from 'vitest'

import type { BoardEntry } from '../../../../shared/engine_api'
import { activeQuest, projectView, quest } from '../../../test_support'
import { EMPTY_BOARD } from '../../quests/domain/search'
import type { BoardView } from '../../quests/domain/search'
import type { ReadableView } from '../../workspace/state_management/workspace_store'
import { allItemsOf, canStartRow, dashboardOf, groupsOf, matchesActive, nextUpOf, pickedOf, shownOf, stepItem, toggleGroup, visibleItemsOf } from './dashboard'

const readable = (over: Parameters<typeof projectView>[1] = {}): ReadableView => projectView('a-000001', over) as ReadableView
const one = (id: string, over: Parameters<typeof quest>[0] | object = {}): BoardEntry => ({ kind: 'quest', quest: quest({ id, ...over }) })
type Saga = Extract<BoardEntry, { kind: 'saga' }>
const saga: Saga = {
  kind: 'saga',
  quest: quest({ id: 'saga', title: 'Notes saga' }),
  chapters: [quest({ id: 'ch1', title: 'Chapter one' }), quest({ id: 'ch2', title: 'Chapter two', isStar: true })],
  progress: { done: 1, total: 3, current: 0, blocked: 0 },
  hasStar: true,
  shared: [],
}
const searching = (search: string): BoardView => ({ ...EMPTY_BOARD, search })
const filtering = (filters: Partial<BoardView['filters']>): BoardView => ({ ...EMPTY_BOARD, filters: { ...EMPTY_BOARD.filters, ...filters } })
const pages = { active: 1, ready: 1, sealed: 1 }

describe('nextUpOf', () => {
  it('offers the ★ first', () => {
    expect(nextUpOf(readable({ ready: [one('a'), one('b', { isStar: true })] }))?.id).toBe('b')
  })

  it('finds a ★ chapter inside a saga', () => {
    expect(nextUpOf(readable({ ready: [one('a'), saga] }))?.id).toBe('ch2')
    const unstarred: Saga = { ...saga, chapters: [quest({ id: 'ch1' })], hasStar: false }
    expect(nextUpOf(readable({ ready: [unstarred, one('a')] }))?.id).toBe('ch1')
  })

  it('skips a sealed ★ and never offers a saga itself', () => {
    expect(nextUpOf(readable({ ready: [one('a', { isStar: true, sealedBecause: 'waits on b' }), one('b')] }))?.id).toBe('b')
    const lone: Saga = { ...saga, chapters: [] }
    expect(nextUpOf(readable({ ready: [lone] }))).toBeNull()
  })

  it('has nothing to offer on an empty or all-sealed board', () => {
    expect(nextUpOf(readable())).toBeNull()
    expect(nextUpOf(readable({ ready: [one('a', { sealedBecause: 'x' })] }))).toBeNull()
  })
})

describe('dashboardOf', () => {
  const view = readable({ activeQuests: [activeQuest({ id: 'x', title: 'Mana tracking' }), activeQuest({ id: 'y', title: 'Recipe panel', review: { at: 'now', checked: null } })], ready: [one('a', { title: 'Fix docs', priority: 'urgent' }), saga], sealed: [one('s', { sealedBecause: 'waits' })] })

  it('groups the quests in hand, the board and the sealed', () => {
    const groups = groupsOf(dashboardOf(view, EMPTY_BOARD, []))

    expect(groups.active.map(item => item.id)).toEqual(['x', 'y'])
    expect(groups.ready.map(item => item.id)).toEqual(['a', 'saga', 'ch1', 'ch2'])
    expect(groups.sealed.map(item => item.id)).toEqual(['s'])
  })

  it('folds a saga as Quests does, unless the board is narrowed', () => {
    expect(groupsOf(dashboardOf(view, EMPTY_BOARD, ['saga'])).ready.map(item => item.id)).toEqual(['a', 'saga'])
    expect(groupsOf(dashboardOf(view, searching('two'), ['saga'])).ready.map(item => item.id)).toEqual(['saga', 'ch2'])
  })

  it('narrows every group by the words', () => {
    const groups = groupsOf(dashboardOf(view, searching('recipe'), []))

    expect(groups.active.map(item => item.id)).toEqual(['y'])
    expect(groups.ready).toEqual([])
  })

  it('narrows by priority and by state', () => {
    expect(groupsOf(dashboardOf(view, filtering({ priorities: ['urgent'] }), [])).ready.map(item => item.id)).toEqual(['a'])
    const judging = groupsOf(dashboardOf(view, filtering({ sections: ['judgement'] }), []))
    expect(judging.active.map(item => item.id)).toEqual(['y'])
    expect(judging.ready).toEqual([])
    expect(judging.sealed).toEqual([])
  })
})

describe('matchesActive', () => {
  it('reads a quest in hand by its branch and its saga', () => {
    const inSaga = activeQuest({ branch: 'task/mana', parentIds: ['saga'] })

    expect(matchesActive(inSaga, searching('MANA'), null)).toBe(true)
    expect(matchesActive(inSaga, filtering({ onlySaga: true }), 'saga')).toBe(true)
    expect(matchesActive(inSaga, filtering({ onlySaga: true }), 'other')).toBe(false)
    expect(matchesActive(inSaga, filtering({ difficulties: ['light'] }), null)).toBe(false)
  })
})

describe('picking', () => {
  const view = readable({ activeQuests: [activeQuest({ id: 'x' })], ready: [one('a'), one('b', { isStar: true })] })
  const items = allItemsOf(groupsOf(dashboardOf(view, EMPTY_BOARD, [])))

  it('keeps a quest that is still listed', () => {
    expect(pickedOf(items, 'a', nextUpOf(view))?.id).toBe('a')
  })

  it('falls back to the first active quest, then Next up, then the first', () => {
    expect(pickedOf(items, 'gone', nextUpOf(view))?.id).toBe('x')
    const idle = allItemsOf(groupsOf(dashboardOf(readable({ ready: [one('a'), one('b', { isStar: true })] }), EMPTY_BOARD, [])))
    expect(pickedOf(idle, null, quest({ id: 'b' }))?.id).toBe('b')
    expect(pickedOf(idle, null, null)?.id).toBe('a')
    expect(pickedOf([], 'a', null)).toBeNull()
  })

  it('steps through the list and stays at its ends', () => {
    expect(stepItem(items, 'x', 1)?.id).toBe('a')
    expect(stepItem(items, 'b', 1)?.id).toBe('b')
    expect(stepItem(items, 'x', -1)?.id).toBe('x')
    expect(stepItem(items, 'gone', 1)?.id).toBe('x')
  })

  it('moves only through the open groups', () => {
    const groups = groupsOf(dashboardOf(view, EMPTY_BOARD, []))

    expect(visibleItemsOf(groups, ['active'], pages, null).map(item => item.id)).toEqual(['a', 'b'])
  })

  it('folds and opens a group, keeping the others', () => {
    expect(toggleGroup(['sealed'], 'active')).toEqual(['active', 'sealed'])
    expect(toggleGroup(['active', 'sealed'], 'active')).toEqual(['sealed'])
  })

  it('offers Start only on a quest that can start', () => {
    const rows = groupsOf(dashboardOf(readable({ ready: [one('a'), saga, one('s', { sealedBecause: 'x' })] }), EMPTY_BOARD, [])).ready

    expect(rows.flatMap(item => (item.kind === 'row' && canStartRow(item.row) ? [item.id] : []))).toEqual(['a', 'ch1', 'ch2'])
  })
})

describe('hundreds of quests', () => {
  const many = Array.from({ length: 500 }, (_, i) => one(`q${i}`, { title: `Quest number ${i}`, priority: i % 7 === 0 ? 'urgent' : 'mid' }))
  const view = readable({ activeQuests: Array.from({ length: 20 }, (_, i) => activeQuest({ id: `a${i}`, title: `Active ${i}` })), ready: many })

  it('shows a page of each group, and enough to hold the picked card', () => {
    const groups = groupsOf(dashboardOf(view, EMPTY_BOARD, []))

    expect(shownOf(groups.ready, 1, null)).toHaveLength(60)
    expect(shownOf(groups.ready, 2, null)).toHaveLength(120)
    expect(shownOf(groups.ready, 1, 'q299')).toHaveLength(300)
  })

  it('builds, narrows and steps the list quickly', () => {
    const started = performance.now()
    for (let i = 0; i < 20; i++) {
      const groups = groupsOf(dashboardOf(view, i % 2 === 0 ? searching(`number ${i}`) : filtering({ priorities: ['urgent'] }), []))
      const items = allItemsOf(groups)
      stepItem(items, pickedOf(items, `q${i}`, nextUpOf(view))?.id ?? null, 1)
    }

    expect(performance.now() - started).toBeLessThan(500)
  })
})
