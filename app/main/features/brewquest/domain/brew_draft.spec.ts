import { describe, expect, it } from 'vitest'

import { checklistDraftOf, draftKeyOf, isDraftKey, likeness, linkedNotesOf, pointsNear, titleMatchOf, withTitleMatches } from '../../../../shared/brew_draft'
import type { BrewDraft, RealmQuest } from '../../../../shared/brew_draft'
import type { Note } from '../../../../shared/notes'

const realmQuest = (over: Partial<RealmQuest> = {}): RealmQuest => ({ id: 't-1', title: 'Sidebar polish', state: 'queued', parentIds: [], priority: 'mid', description: null, ...over })
const noteOf = (over: Partial<Note> = {}): Pick<Note, 'id' | 'title' | 'body' | 'quests' | 'isArchived'> => ({ id: 'n-1', title: 'Plan', body: '', quests: [], isArchived: false, ...over })

describe('draft keys and points', () => {
  it('makes keys a filing can find again, and refuses anything else', () => {
    expect(draftKeyOf('d-abcd1234', 'q', 3)).toBe('d-abcd1234.q3')
    for (const key of ['d-abcd1234.q3', 'd-abcd1234.g12']) expect(isDraftKey(key)).toBe(true)
    for (const key of ['q3', 'd-ab.q1', 'd-abcd1234.x1', 'd-abcd1234.q1/..', 7, null]) expect(isDraftKey(key)).toBe(false)
  })

  it('rounds an effort to the nearest planning step, and anything else to 3', () => {
    expect([1, 2, 4, 6, 10, 11, 40].map(pointsNear)).toEqual([1, 2, 5, 5, 8, 13, 13])
    expect([NaN, '5', null].map(pointsNear)).toEqual([3, 3, 3])
  })
})

describe('matching drafted quests to the realm by title', () => {
  it('sees the same quest in other words, and a quest that only overlaps', () => {
    expect(likeness('Fix the sidebar spacing', 'Sidebar spacing fixes')).toBe(1)
    expect(titleMatchOf('Fix sidebar spacing', [realmQuest({ title: 'Sidebar spacing' })])).toMatchObject({ id: 't-1', kind: 'same', by: 'title', why: '' })
    expect(titleMatchOf('Sidebar spacing and icons', [realmQuest({ title: 'Sidebar spacing' })])).toMatchObject({ kind: 'overlaps' })
  })

  it('needs two shared words to call a quest an overlap, and never matches a removed quest', () => {
    expect(titleMatchOf('Terminal sidebar', [realmQuest({ title: 'Sidebar' })])).toBeNull()
    expect(titleMatchOf('Sidebar polish', [realmQuest({ state: 'removed' })])).toBeNull()
  })

  it('checks only the quests BrewQuest left unmatched, and never against the group’s own parent', () => {
    const draft = checklistDraftOf('d-abcd1234', noteOf({ title: 'Sidebar polish', body: '- [ ] Sidebar polish' }), [])
    const parentOf: BrewDraft = { ...draft, groups: draft.groups.map(group => ({ ...group, parent: { kind: 'existing', id: 't-1', title: 'Sidebar polish', why: '' } })) }

    expect(withTitleMatches(parentOf, [realmQuest()]).groups[0]!.quests[0]!.match).toBeNull()
    expect(withTitleMatches(draft, [realmQuest()]).groups[0]!.quests[0]!.match).toMatchObject({ id: 't-1', kind: 'same' })
  })
})

describe('the checklist draft', () => {
  it('drafts one quest a line, under a new parent named after the note, each quoting its line', () => {
    const draft = checklistDraftOf('d-abcd1234', noteOf({ body: '- [ ] Scan\n- [ ] Report\n- [x] Done' }), [])

    expect(draft).toMatchObject({ id: 'd-abcd1234', by: 'checklist', understood: '', trouble: null, read: { notes: [{ id: 'n-1', title: 'Plan' }], files: [] } })
    expect(draft.groups).toHaveLength(1)
    expect(draft.groups[0]!.parent).toEqual({ kind: 'new', title: 'Plan', why: '' })
    expect(draft.groups[0]!.quests.map(quest => [quest.key, quest.title, quest.item, quest.points, quest.sources[0]?.quote])).toEqual([
      ['d-abcd1234.q1', 'Scan', 'Scan', 3, 'Scan'],
      ['d-abcd1234.q2', 'Report', 'Report', 3, 'Report'],
    ])
  })

  it('puts new lines under the note’s own quest while it’s open, and keeps the reason it fell back', () => {
    const note = noteOf({ body: '- [ ] Scan\n- [ ] Report', quests: [{ id: 't-9', item: null }, { id: 't-10', item: 'Scan' }] })
    const draft = checklistDraftOf('d-abcd1234', note, [realmQuest({ id: 't-9', title: 'Plan saga' })], 'Claude Code is missing.')

    expect(draft.groups[0]!.parent).toEqual({ kind: 'existing', id: 't-9', title: 'Plan saga', why: '' })
    expect(draft.groups[0]!.quests.map(quest => quest.title)).toEqual(['Report'])
    expect(draft.trouble).toBe('Claude Code is missing.')
  })

  it('has no groups once everything in the note is filed', () => {
    expect(checklistDraftOf('d-abcd1234', noteOf({ quests: [{ id: 't-9', item: null }] }), []).groups).toEqual([])
  })
})

describe('the notes beside a note', () => {
  it('takes the notes it links to, then the notes linking to it, each once and never archived', () => {
    const plan = noteOf({ body: 'See [[Research]] and [[Old]].' })
    const notes = [plan, noteOf({ id: 'n-2', title: 'Research', body: 'Back to [[Plan]].' }), noteOf({ id: 'n-3', title: 'Meeting', body: '[[plan]] came up.' }), noteOf({ id: 'n-4', title: 'Old', isArchived: true })]

    expect(linkedNotesOf(plan, notes).map(note => note.title)).toEqual(['Research', 'Meeting'])
  })

  it('reads five at most', () => {
    const many = Array.from({ length: 8 }, (_, i) => noteOf({ id: `n-${i + 2}`, title: `Note ${i}`, body: '[[Plan]]' }))

    expect(linkedNotesOf(noteOf(), [noteOf(), ...many])).toHaveLength(5)
  })
})
