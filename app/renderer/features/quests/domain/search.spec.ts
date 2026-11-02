import { describe, expect, it } from 'vitest'

import type { BoardEntry } from '../../../../shared/engine_api'
import { quest } from '../../../test_support'
import { rowsOf } from './board'
import { EMPTY_BOARD, filterEntries, hasFilters, isFiltering, partsOf } from './search'
import type { BoardView } from './search'

const one = (id: string, over = {}): BoardEntry => ({ kind: 'quest', quest: quest({ id, title: id, ...over }) })
const saga = (id: string, chapters: string[], over = {}): BoardEntry => ({
  kind: 'saga',
  quest: quest({ id, title: id, ...over }),
  chapters: chapters.map(title => quest({ id: title, title, parentId: id })),
  progress: { done: 0, total: chapters.length, current: 0, blocked: 0 },
  hasStar: false,
})
const board = (over: Partial<BoardView>): BoardView => ({ ...EMPTY_BOARD, ...over, filters: { ...EMPTY_BOARD.filters, ...over.filters } })
const ids = (entries: BoardEntry[]) => rowsOf(entries).map(row => row.quest.id)

describe('search', () => {
  it('leaves the board alone with nothing asked', () => {
    const entries = [one('a'), one('b')]

    expect(filterEntries(entries, EMPTY_BOARD, null, null)).toEqual(entries)
    expect(isFiltering(EMPTY_BOARD)).toBe(false)
  })

  it('matches a title, whatever the case', () => {
    expect(ids(filterEntries([one('Fix the docs'), one('Other')], board({ search: 'FIX' }), null, null))).toEqual(['Fix the docs'])
  })

  it('matches a branch', () => {
    expect(ids(filterEntries([one('a', { branch: 'task/fix-it' }), one('b')], board({ search: 'fix-it' }), null, null))).toEqual(['a'])
  })

  it('ignores spaces around what was typed', () => {
    expect(ids(filterEntries([one('Fix')], board({ search: '  fix ' }), null, null))).toEqual(['Fix'])
    expect(isFiltering(board({ search: '   ' }))).toBe(false)
  })

  it('keeps a saga on screen for a chapter that matches, without its other chapters', () => {
    const filtered = filterEntries([saga('The saga', ['Needle', 'Hay'])], board({ search: 'needle' }), null, null)

    expect(ids(filtered)).toEqual(['The saga', 'Needle'])
  })

  it('keeps every chapter when the saga itself matches', () => {
    expect(ids(filterEntries([saga('Needle saga', ['One', 'Two'])], board({ search: 'needle' }), null, null))).toEqual(['Needle saga', 'One', 'Two'])
  })

  it('drops a saga with no match in it', () => {
    expect(filterEntries([saga('The saga', ['One'])], board({ search: 'needle' }), null, null)).toEqual([])
  })
})

describe('filters', () => {
  it('filters by priority and difficulty, and they combine', () => {
    const entries = [one('a', { priority: 'high', difficulty: 'hard' }), one('b', { priority: 'high', difficulty: 'light' }), one('c', { priority: 'low', difficulty: 'hard' })]

    expect(ids(filterEntries(entries, board({ filters: { ...EMPTY_BOARD.filters, priorities: ['high'] } }), null, null))).toEqual(['a', 'b'])
    expect(ids(filterEntries(entries, board({ filters: { ...EMPTY_BOARD.filters, priorities: ['high'], difficulties: ['hard'] } }), null, null))).toEqual(['a'])
  })

  it('combines with the search', () => {
    const entries = [one('Fix a', { priority: 'high' }), one('Fix b', { priority: 'low' })]

    expect(ids(filterEntries(entries, board({ search: 'fix', filters: { ...EMPTY_BOARD.filters, priorities: ['low'] } }), null, null))).toEqual(['Fix b'])
  })

  it('keeps to the active saga', () => {
    const entries = [saga('The saga', ['One']), one('Other')]

    expect(ids(filterEntries(entries, board({ filters: { ...EMPTY_BOARD.filters, onlySaga: true } }), 'The saga', null))).toEqual(['The saga', 'One'])
  })

  it('shows nothing for Only the active saga with no saga active', () => {
    expect(filterEntries([one('a')], board({ filters: { ...EMPTY_BOARD.filters, onlySaga: true } }), null, null)).toEqual([])
  })

  it('keeps what fits the time', () => {
    const entries = [one('short', { estimateMinutes: 30 }), one('long', { estimateMinutes: 240 })]

    expect(ids(filterEntries(entries, board({ filters: { ...EMPTY_BOARD.filters, fitsTime: true } }), null, 60))).toEqual(['short'])
  })

  it('ignores Fits Time I have with no time set', () => {
    expect(ids(filterEntries([one('a')], board({ filters: { ...EMPTY_BOARD.filters, fitsTime: true } }), null, null))).toEqual(['a'])
  })

  it('says when any is set', () => {
    expect(hasFilters(EMPTY_BOARD.filters)).toBe(false)
    expect(hasFilters({ ...EMPTY_BOARD.filters, sections: ['sealed'] })).toBe(true)
  })

  it('filters 500 quests within 50 ms', () => {
    const entries = Array.from({ length: 500 }, (_, i) => one(`Quest number ${i}`, { branch: `task/quest-${i}` }))
    const started = performance.now()

    const found = filterEntries(entries, board({ search: 'number 49', filters: { ...EMPTY_BOARD.filters, priorities: ['mid'] } }), null, null)

    expect(performance.now() - started).toBeLessThan(50)
    expect(found.length).toBe(11)
  })
})

describe('marking the match', () => {
  it('splits a title around what was searched for', () => {
    expect(partsOf('Fix cut-off diagrams', 'diagrams')).toEqual([
      { text: 'Fix cut-off ', isMatch: false },
      { text: 'diagrams', isMatch: true },
    ])
  })

  it('keeps the title\'s own case', () => {
    expect(partsOf('DIAGRAMS', 'diagrams')).toEqual([{ text: 'DIAGRAMS', isMatch: true }])
  })

  it('leaves a title alone with nothing searched for, or no match', () => {
    expect(partsOf('Title', ' ')).toEqual([{ text: 'Title', isMatch: false }])
    expect(partsOf('Title', 'other')).toEqual([{ text: 'Title', isMatch: false }])
  })

  it('takes what was typed as plain text, not a pattern', () => {
    expect(partsOf('a.b', '.')).toEqual([
      { text: 'a', isMatch: false },
      { text: '.', isMatch: true },
      { text: 'b', isMatch: false },
    ])
  })
})
