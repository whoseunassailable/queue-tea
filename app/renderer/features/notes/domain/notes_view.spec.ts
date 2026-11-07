import { lexer } from 'marked'
import type { Token, Tokens } from 'marked'
import { describe, expect, it } from 'vitest'

import type { ReadableView } from '../../workspace/state_management/workspace_store'
import { NOTE_TYPES } from '../../../../shared/notes'
import { t } from '../../../l10n/en'
import { activeQuest, note, projectView, quest } from '../../../test_support'
import type { QuestLine } from './notes_view'
import { captureOf, folderError, folderNameError, foldersOf, linkOptionsOf, linkQueryAt, matches, questLineOf, questLinesOf, tagsError, tagsOf, templateChange, titleError, toggleTaskAt, withLink, linkPicksOf } from './notes_view'

describe('note templates', () => {
  it.each(NOTE_TYPES)('starts a %s note with its own text and leaves the folder alone', type => {
    const patch = templateChange(type, 'My note', [], 'me', '2026-11-07')

    expect(patch).toEqual({ type, body: t.notebook.templates[type] })
    expect(patch.body!.length).toBeGreaterThan(20)
  })

  it('gives an untitled daily note today’s next free title, leaving a chosen title alone', () => {
    const notes = [note({ title: '2026-11-07' }), note({ id: 'next', title: '2026-11-07 2' })]

    expect(templateChange('daily', 'Untitled 2', notes, 'me', '2026-11-07').title).toBe('2026-11-07 3')
    expect(templateChange('daily', 'My journal', notes, 'me', '2026-11-07').title).toBeUndefined()
    expect(templateChange('idea', 'Untitled', notes, 'me', '2026-11-07').title).toBeUndefined()
  })
})

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

  it('a renamed folder must have a name within the folder limits', () => {
    expect(folderNameError('  ')).toBe(t.notebook.folderRequired)
    expect(folderNameError('a/b')).toBe(t.notebook.folderSlash)
    expect(folderNameError('x'.repeat(61))).toBe(t.notebook.folderLong)
    expect(folderNameError('Plans')).toBeUndefined()
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

describe('ticking a box in the Read view', () => {
  const body = ['- [ ] one', '- [x] two', '  - [ ] nested', '', '1. [ ] ordered', '', '> [!warning] Careful', '> - [ ] quoted', '', '```', '- [ ] not a task, in code', '```', '- [ ]', '* [ ] star'].join('\n')
  // The boxes marked draws, in the order it draws them.
  const boxes = (tokens: Token[]): Tokens.ListItem[] =>
    tokens.flatMap(token => [...(token.type === 'list_item' && (token as Tokens.ListItem).task ? [token as Tokens.ListItem] : []), ...boxes([...('items' in token ? (token.items as Token[]) : []), ...('tokens' in token && token.type !== 'list_item' ? (token.tokens as Token[]) : []), ...(token.type === 'list_item' ? ((token as Tokens.ListItem).tokens ?? []) : [])])])

  it('counts the lines in the order marked draws the boxes, leaving out code and empty boxes', () => {
    const drawn = boxes(lexer(body)).map(item => item.text.split('\n')[0])

    expect(drawn).toEqual(['one', 'two', 'nested', 'ordered', 'quoted', 'star'])
    drawn.forEach((text, i) => {
      const changed = toggleTaskAt(body, i).split('\n').filter((line, n) => line !== body.split('\n')[n])
      expect(changed).toHaveLength(1)
      expect(changed[0]).toContain(text)
    })
  })

  it('ticks an open box and opens a ticked one, keeping the rest of the line', () => {
    expect(toggleTaskAt('- [ ] one', 0)).toBe('- [x] one')
    expect(toggleTaskAt('  - [X] two', 0)).toBe('  - [ ] two')
    expect(toggleTaskAt('- [ ] one', 3)).toBe('- [ ] one')
  })
})

describe('the picker’s order', () => {
  it('puts titles starting with the text first, then a word starting with it, then anywhere', () => {
    const notes = [note({ id: '1', title: 'Misplan' }), note({ id: '2', title: 'The plan' }), note({ id: '3', title: 'Plan B' }), note({ id: '4', title: 'Planet', isArchived: true }), note({ id: 'me', title: 'Plan me' })]

    expect(linkOptionsOf(notes, 'pla', 'me', 8).map(n => n.title)).toEqual(['Plan B', 'The plan', 'Misplan'])
  })
})

describe('quests in the link picker', () => {
  const line = (title: string | null, state: QuestLine['state']): QuestLine => ({ title, state, priority: 'mid', difficulty: 'medium' })

  it('keeps three of eight rows for quests, then fills unused space from either side', () => {
    const notes = Array.from({ length: 10 }, (_, i) => note({ id: `n-${i}`, title: `Plan ${i}` }))
    const quests = new Map(Array.from({ length: 10 }, (_, i) => [`t-${i}`, line(`Plan quest ${i}`, 'waiting')]))
    const picks = linkPicksOf(notes, quests, '', 'here', 8, 3)
    expect([picks.notes.length, picks.quests.length]).toEqual([5, 3])
    const fewNotes = linkPicksOf(notes.slice(0, 1), quests, '', 'here', 8, 3)
    expect([fewNotes.notes.length, fewNotes.quests.length]).toEqual([1, 7])
    const fewQuests = linkPicksOf(notes, new Map([...quests].slice(0, 1)), '', 'here', 8, 3)
    expect([fewQuests.notes.length, fewQuests.quests.length]).toEqual([7, 1])
    expect(linkPicksOf([], quests, '', 'here', 8, 3).quests).toHaveLength(8)
    expect(linkPicksOf(notes, new Map(), '', 'here', 8, 3).notes).toHaveLength(8)
  })

  it('ranks matching titles before state, then active, waiting and sealed, excluding done and gone', () => {
    const quests = new Map([
      ['t-1', line('Misplan', 'active')], ['t-2', line('The plan', 'active')],
      ['t-3', line('Plan sealed', 'sealed')], ['t-4', line('Plan waiting', 'waiting')],
      ['t-5', line('Plan active', 'active')], ['t-6', line('Plan done', 'done')],
      ['t-7', line(null, 'gone')], ['t-8', line('Other', 'waiting')],
    ])
    expect(linkPicksOf([], quests, ' PLA ', 'here', 8, 3).quests.map(q => q.id)).toEqual(['t-5', 't-4', 't-3', 't-2', 't-1'])
    expect(linkPicksOf([], quests, 'no match', 'here', 8, 3)).toEqual({ notes: [], quests: [] })
  })

  it('offers a same-titled note and quest, while omitting archived, current and reserved note titles', () => {
    const notes = [note({ id: 'here' }), note({ id: 'old', isArchived: true }), note({ id: 'reserved', title: 'quest:t-abc' }), note({ id: 'plan', title: 'Plan' })]
    const picks = linkPicksOf(notes, new Map([['t-abc', line('Plan', 'waiting')]]), '', 'here', 8, 3)
    expect(picks.notes.map(n => n.id)).toEqual(['plan'])
    expect(picks.quests.map(q => q.id)).toEqual(['t-abc'])
    expect(withLink('See [[pl]] after', 6, 8, 'quest:t-abc|Plan')).toEqual({ body: 'See [[quest:t-abc|Plan]] after', caret: 24 })
  })
})

describe('the list', () => {
  it('shows pins once at the top, newest first, with a real folder named Pinned kept separate', () => {
    const notes = [note({ id: 'old', isPinned: true, updated: '1' }), note({ id: 'new', folder: 'Inbox', isPinned: true, updated: '2' }), note({ id: 'inbox', folder: 'Inbox' }), note({ id: 'named', folder: 'Pinned' })]

    expect(foldersOf(notes, '', false).map(g => [g.folder, g.notes.map(n => n.id)])).toEqual([[null, ['new', 'old']], ['Inbox', ['inbox']], ['Pinned', ['named']]])
  })

  it('searches pinned notes too, and archived pins show in their own folder', () => {
    const notes = [note({ id: 'pin', isPinned: true, tags: ['special'] }), note({ id: 'archive', isPinned: true, isArchived: true, folder: 'Old' })]

    expect(foldersOf(notes, '#special', false).map(g => [g.folder, g.notes.map(n => n.id)])).toEqual([[null, ['pin']]])
    expect(foldersOf(notes, 'missing', false)).toEqual([])
    expect(foldersOf(notes, '', true).map(g => [g.folder, g.notes.map(n => n.id)])).toEqual([['Old', ['archive']]])
  })

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
