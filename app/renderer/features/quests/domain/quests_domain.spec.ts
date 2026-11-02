import { describe, expect, it } from 'vitest'

import type { BoardEntry } from '../../../../shared/engine_api'
import { quest } from '../../../test_support'
import { isTyping, questKeyOf } from '../presentation/state_management/quest_keys'
import { openRow, rowsOf, stepFrom } from './board'
import { emptyQuestForm, questOf, sealError, sealOf, titleError, validateQuest } from './quest_form'

const press = (key: string, over: Partial<KeyboardEvent> = {}) => ({ key, metaKey: false, ctrlKey: false, altKey: false, ...over })

describe('the New quest form', () => {
  it('wants a title, in the field’s own words', () => {
    expect(titleError('   ')).toBe('Title is required.')
    expect(titleError('x'.repeat(201))).toBe('Title must be 200 characters or fewer.')
    expect(titleError('Fine')).toBe(undefined)
  })

  it('wants Part of answered when the answer was left open', () => {
    expect(validateQuest({ ...emptyQuestForm('unset'), title: 'A' })).toEqual({ part: 'Pick what it is part of first, or On its own.' })
    expect(validateQuest({ ...emptyQuestForm('none'), title: 'A' })).toEqual({})
  })

  it('wants a saga title only once New saga is picked', () => {
    expect(validateQuest({ ...emptyQuestForm('new'), title: 'A' })).toEqual({ sagaTitle: 'Saga title is required.' })
    expect(validateQuest({ ...emptyQuestForm('new'), title: 'A', sagaTitle: 'S' })).toEqual({})
  })

  it('turns the form into a quest', () => {
    const form = { ...emptyQuestForm('t-1'), title: ' A ', description: ' Why ', criteria: 'One\n\n  Two  \n' }

    expect(questOf(form)).toEqual({ title: 'A', priority: 'mid', difficulty: 'medium', parent: { kind: 'task', id: 't-1' }, description: 'Why', criteria: ['One', 'Two'] })
    expect(questOf({ ...emptyQuestForm('none'), title: 'A' }).parent).toEqual({ kind: 'none' })
    expect(questOf({ ...emptyQuestForm('new'), title: 'A', sagaTitle: ' S ' }).parent).toEqual({ kind: 'new', title: 'S' })
  })
})

describe('the Seal form', () => {
  it('wants a quest or a reason', () => {
    expect(sealError({ waitFor: null, reason: '  ' })).toBe('Pick a quest to wait for, or write a reason.')
    expect(sealError({ waitFor: 'x', reason: '' })).toBe(undefined)
    expect(sealError({ waitFor: null, reason: 'Later' })).toBe(undefined)
  })

  it('says which', () => {
    expect(sealOf({ waitFor: 'x', reason: '' })).toEqual({ waitFor: 'x' })
    expect(sealOf({ waitFor: null, reason: ' Later ' })).toEqual({ reason: 'Later' })
  })
})

describe('the board as rows', () => {
  const saga: BoardEntry = {
    kind: 'saga',
    quest: quest({ id: 'saga' }),
    chapters: [quest({ id: 'star', title: 'Star', isStar: true, why: 'urgent' }), quest({ id: 'two' })],
    progress: { done: 0, total: 2, current: 0, blocked: 0 },
    hasStar: true,
  }

  it('puts chapters directly under their saga', () => {
    expect(rowsOf([saga]).map(r => [r.quest.id, r.isChapter])).toEqual([
      ['saga', false],
      ['star', true],
      ['two', true],
    ])
  })

  it('a folded saga hides its chapters and keeps the ★ on show', () => {
    const rows = rowsOf([saga], ['saga'])

    expect(rows.map(r => r.quest.id)).toEqual(['saga'])
    expect(rows[0]?.foldedStar?.title).toBe('Star')
  })

  it('opens the picked quest, else the ★, else the first', () => {
    const rows = rowsOf([saga])

    expect(openRow(rows, 'two')?.quest.id).toBe('two')
    expect(openRow(rows, undefined)?.quest.id).toBe('star')
    expect(openRow(rows, 'gone')?.quest.id).toBe('star')
    expect(openRow([], undefined)).toBe(null)
  })

  it('steps through the rows and stops at the ends', () => {
    const rows = rowsOf([saga])

    expect(stepFrom(rows, 'star', 1)?.quest.id).toBe('two')
    expect(stepFrom(rows, 'two', 1)?.quest.id).toBe('two')
    expect(stepFrom(rows, 'saga', -1)?.quest.id).toBe('saga')
    expect(stepFrom([], undefined, 1)).toBe(null)
  })
})

describe('the keys', () => {
  it('are the terminal’s letters', () => {
    expect(questKeyOf(press('f'))).toEqual({ kind: 'playNext' })
    expect(questKeyOf(press('k'))).toEqual({ kind: 'seal' })
    expect(questKeyOf(press('u'))).toEqual({ kind: 'unseal' })
    expect(questKeyOf(press('p'))).toEqual({ kind: 'partOf' })
    expect(questKeyOf(press('a'))).toEqual({ kind: 'activeSaga' })
    expect(questKeyOf(press('x'))).toEqual({ kind: 'remove' })
    expect(questKeyOf(press('Backspace'))).toEqual({ kind: 'remove' })
  })

  it('1 to 5 set the priority, urgent to low', () => {
    expect(questKeyOf(press('1'))).toEqual({ kind: 'priority', priority: 'urgent' })
    expect(questKeyOf(press('5'))).toEqual({ kind: 'priority', priority: 'low' })
    expect(questKeyOf(press('6'))).toBe(null)
    expect(questKeyOf(press('0'))).toBe(null)
  })

  it('leave anything with ⌘ alone', () => {
    expect(questKeyOf(press('k', { metaKey: true }))).toBe(null)
    expect(questKeyOf(press('1', { ctrlKey: true }))).toBe(null)
  })

  it('know a text field when they are in one', () => {
    expect(isTyping({ tagName: 'INPUT' } as unknown as EventTarget)).toBe(true)
    expect(isTyping({ tagName: 'TEXTAREA' } as unknown as EventTarget)).toBe(true)
    expect(isTyping({ tagName: 'BUTTON' } as unknown as EventTarget)).toBe(false)
    expect(isTyping(null)).toBe(false)
  })
})
