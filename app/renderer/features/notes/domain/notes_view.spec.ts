import { describe, expect, it } from 'vitest'

import type { ReadableView } from '../../workspace/state_management/workspace_store'
import { activeQuest, note, projectView, quest } from '../../../test_support'
import { captureOf, folderError, foldersOf, linkOptionsOf, linkQueryAt, matches, questLineOf, questLinesOf, tagsError, tagsOf, titleError, withLink } from './notes_view'

describe('quick capture', () => {
  it('makes the line the title when it fits, with no body', () => {
    expect(captureOf('  Try a graph view  ')).toEqual({ title: 'Try a graph view', folder: 'Inbox', body: '' })
    expect(captureOf('   ')).toBeNull()
  })

  it('cleans what a title cannot hold, and keeps the whole text as the body', () => {
    expect(captureOf('Link [[Plan]] #idea\nmore')).toEqual({ title: 'Link Plan idea', folder: 'Inbox', body: 'Link [[Plan]] #idea\nmore' })
    const long = captureOf(`${'word '.repeat(30)}end`)!
    expect(long.title.length).toBeLessThanOrEqual(81)
    expect(long.title.endsWith('…')).toBe(true)
  })
})

describe('checks', () => {
  it('a title is required, short enough, and free of link marks', () => {
    expect(titleError(' ')).toBe('Title is required.')
    expect(titleError('a|b')).toMatch(/can't have/)
    expect(titleError('x'.repeat(201))).toMatch(/200/)
    expect(titleError('Fine')).toBeUndefined()
  })

  it('a folder is one level', () => {
    expect(folderError('a/b')).toBe('A folder is one level, so leave out /.')
    expect(folderError('Research')).toBeUndefined()
  })

  it('tags come from commas, without # or repeats, with spaces as -', () => {
    expect(tagsOf('#a, b, a, ,, deep work')).toEqual(['a', 'b', 'deep-work'])
    expect(tagsError(Array.from({ length: 21 }, (_, i) => `t${i}`).join(','))).toMatch(/20/)
  })
})

describe('the link picker', () => {
  it('opens on [[ before the caret, on the same line, until it is closed', () => {
    expect(linkQueryAt('See [[Pl', 8)).toEqual({ start: 6, query: 'Pl' })
    expect(linkQueryAt('See [[', 6)).toEqual({ start: 6, query: '' })
    expect(linkQueryAt('See [[Plan]] ', 13)).toBeNull()
    expect(linkQueryAt('[[a\nb', 5)).toBeNull()
  })

  it('puts the title in and closes the link, over a ]] already there', () => {
    expect(withLink('See [[Pl and', 6, 8, 'Plan')).toEqual({ body: 'See [[Plan]] and', caret: 12 })
    expect(withLink('See [[]]', 6, 6, 'Plan')).toEqual({ body: 'See [[Plan]]', caret: 12 })
  })
})

describe('the picker’s order', () => {
  it('puts titles starting with the text first, then a word starting with it, then anywhere', () => {
    const notes = [note({ id: '1', title: 'Misplan' }), note({ id: '2', title: 'The plan' }), note({ id: '3', title: 'Plan B' }), note({ id: '4', title: 'Planet', isArchived: true }), note({ id: 'me', title: 'Plan me' })]

    expect(linkOptionsOf(notes, 'pla', 'me', 8).map(n => n.title)).toEqual(['Plan B', 'The plan', 'Misplan'])
  })
})

describe('the list', () => {
  it('a #word in search matches tags only', () => {
    expect(matches(note({ body: '#security in text', tags: [] }), '#security')).toBe(false)
    expect(matches(note({ tags: ['security'] }), '#sec')).toBe(true)
  })

  it('puts Inbox first, then folders A to Z, newest note first, and searches every word', () => {
    const notes = [note({ id: 'z', folder: 'Zeta' }), note({ id: 'i1', folder: 'Inbox', updated: '1' }), note({ id: 'i2', folder: 'Inbox', updated: '2', tags: ['x'] }), note({ id: 'a', folder: 'Alpha', isArchived: true })]

    expect(foldersOf(notes, '', false).map(g => [g.folder, g.notes.map(n => n.id)])).toEqual([
      ['Inbox', ['i2', 'i1']],
      ['Zeta', ['z']],
    ])
    expect(foldersOf(notes, '', true).map(g => g.folder)).toEqual(['Alpha'])
    expect(foldersOf(notes, 'bug #x', false).flatMap(g => g.notes.map(n => n.id))).toEqual(['i2'])
  })
})

describe('where a filed quest is now', () => {
  it('reads it from the queue: waiting, sealed, in progress, done, or gone', () => {
    const view = projectView('a-000001', {
      ready: [{ kind: 'saga', quest: quest({ id: 'p' }), chapters: [quest({ id: 'c' })], progress: { done: 0, total: 1 } as never, hasStar: false }],
      sealed: [{ kind: 'quest', quest: quest({ id: 's' }) }],
      activeQuests: [activeQuest({ id: 'c', title: 'c' })],
      victories: [{ id: 'd', title: 'Done one', finished: '', minutes: 1, xp: 1 }],
    }) as ReadableView
    const lines = questLinesOf(view)

    expect(['p', 'c', 's', 'd', 'x'].map(id => questLineOf(lines, id).state)).toEqual(['waiting', 'active', 'sealed', 'done', 'gone'])
  })
})
