import { describe, expect, it } from 'vitest'

import type { RealmQuest } from '../../../../shared/brew_draft'
import { MESSAGES } from '../../../core/messages'
import { blockOf, draftOfReply } from './brew_reply'
import type { ReplyContext } from './brew_reply'

const realmQuest = (over: Partial<RealmQuest> = {}): RealmQuest => ({ id: 't-1', title: 'Sidebar polish', state: 'queued', parentIds: [], priority: 'mid', description: null, ...over })
const NOTE = { id: 'n-1', title: 'Plan', body: 'We should count terminal time.\n\n- [ ] Fix sidebar spacing' }
const ctx = (over: Partial<ReplyContext> = {}): ReplyContext => ({
  id: 'd-abcd1234',
  notes: [NOTE, { id: 'n-2', title: 'Research', body: 'iTerm and Ghostty both count.' }],
  realm: [realmQuest(), realmQuest({ id: 't-2', title: 'Finished thing', state: 'done' }), realmQuest({ id: 't-3', title: 'Child', parentIds: ['t-1'] })],
  said: { unknownParent: MESSAGES.brewUnknownParent, parentNotOpen: MESSAGES.brewParentNotOpen, tooMany: MESSAGES.brewTooMany, loopLeftOut: MESSAGES.brewLoopLeftOut },
  ...over,
})
const fenced = (value: unknown) => `Here is the draft.\n\n\`\`\`brewquest-draft\n${JSON.stringify(value)}\n\`\`\``
const draftOf = (value: unknown, over: Partial<ReplyContext> = {}) => {
  const read = draftOfReply(fenced(value), ctx(over))
  if (read.kind !== 'draft') throw new Error(`should read: ${read.why}`)

  return read.draft
}
const quest = (over: Record<string, unknown> = {}) => ({ key: 'q1', title: 'Count terminal time', summary: 'Terminal time counts.', priority: 'high', difficulty: 'medium', points: 5, criteria: ['Counts iTerm'], waitsFor: [], sources: [{ note: 'Plan', quote: 'count terminal time' }], doubts: [], match: null, item: null, ...over })

describe('reading the block', () => {
  it('takes the last brewquest-draft block, and says why a reply does not read', () => {
    expect(blockOf('```brewquest-draft\n{"a":1}\n```\nthen\n```brewquest-draft\n{"a":2}\n```')).toEqual({ kind: 'found', value: { a: 2 } })
    expect(blockOf('No block here.')).toEqual({ kind: 'unreadable', why: 'no-block' })
    expect(blockOf('```brewquest-draft\n{not json}\n```')).toEqual({ kind: 'unreadable', why: 'bad-json' })
    expect(draftOfReply(fenced({ understood: 'x' }), ctx())).toEqual({ kind: 'unreadable', why: 'not-a-draft' })
  })
})

describe('a draft made safe to show and file', () => {
  it('keeps what BrewQuest wrote, under keys of the draft’s own', () => {
    const draft = draftOf({ understood: 'Track terminal time.', groups: [{ parent: { new: 'Terminal tracking' }, why: 'One feature.', quests: [quest()] }], questions: ['Which terminals?'], missing: ['No spec for the timer.'], files: ['CLAUDE.md'] })

    expect(draft).toMatchObject({ id: 'd-abcd1234', by: 'claude', understood: 'Track terminal time.', questions: ['Which terminals?'], missing: ['No spec for the timer.'], trouble: null, learned: [] })
    expect(draft.read).toEqual({ notes: [{ id: 'n-1', title: 'Plan' }, { id: 'n-2', title: 'Research' }], files: ['CLAUDE.md'] })
    expect(draft.groups[0]).toMatchObject({ key: 'd-abcd1234.g1', parent: { kind: 'new', title: 'Terminal tracking', why: 'One feature.' } })
    expect(draft.groups[0]!.quests[0]).toEqual({
      key: 'd-abcd1234.q1',
      title: 'Count terminal time',
      summary: 'Terminal time counts.',
      priority: 'high',
      difficulty: 'medium',
      points: 5,
      criteria: ['Counts iTerm'],
      waitsFor: [],
      sources: [{ noteId: 'n-1', title: 'Plan', quote: 'count terminal time', isFound: true }],
      doubts: [],
      match: null,
      item: null,
    })
  })

  it('falls back to defaults for values that are not allowed, and cuts long text', () => {
    const [drafted] = draftOf({ groups: [{ parent: null, quests: [quest({ title: `  ${'T'.repeat(300)}  `, priority: 'asap', difficulty: 'tiny', points: 4, criteria: ['A', 'a', '', 7, 'B'], summary: 42 })] }] }).groups[0]!.quests

    expect(drafted).toMatchObject({ priority: 'mid', difficulty: 'medium', points: 5, criteria: ['A', 'B'], summary: '' })
    expect(drafted!.title).toHaveLength(200)
  })

  it('checks quotes against the notes they name, and marks words that are not there', () => {
    const [drafted] = draftOf({ groups: [{ parent: null, quests: [quest({ sources: [{ note: 'research', quote: 'iTerm and  Ghostty' }, { note: 'Plan', quote: 'count every keystroke' }, { quote: '' }] })] }] }).groups[0]!.quests

    expect(drafted!.sources).toEqual([
      { noteId: 'n-2', title: 'Research', quote: 'iTerm and Ghostty', isFound: true },
      { noteId: 'n-1', title: 'Plan', quote: 'count every keystroke', isFound: false },
    ])
  })

  it('keeps a parent only when it is an open quest under no other, and says so on the quests otherwise', () => {
    const draft = draftOf({
      groups: [
        { parent: { existing: 't-1' }, why: 'It polishes the sidebar.', quests: [quest({ key: 'q1' })] },
        { parent: { existing: 't-2' }, quests: [quest({ key: 'q2', title: 'Two' })] },
        { parent: { existing: 't-3' }, quests: [quest({ key: 'q3', title: 'Three' })] },
        { parent: { existing: 't-gone' }, quests: [quest({ key: 'q4', title: 'Four' })] },
      ],
    })

    expect(draft.groups.map(group => group.parent.kind)).toEqual(['existing', 'none', 'none', 'none'])
    expect(draft.groups[0]!.parent).toEqual({ kind: 'existing', id: 't-1', title: 'Sidebar polish', why: 'It polishes the sidebar.' })
    expect(draft.groups.slice(1).map(group => group.quests[0]!.doubts[0])).toEqual([MESSAGES.brewParentNotOpen, MESSAGES.brewParentNotOpen, MESSAGES.brewUnknownParent])
  })

  it('keeps a checklist line only when it is an open line of the note', () => {
    const quests = draftOf({ groups: [{ parent: null, quests: [quest({ key: 'q1', item: 'Fix sidebar spacing' }), quest({ key: 'q2', title: 'Other', item: 'Not a line' })] }] }).groups[0]!.quests

    expect(quests.map(one => one.item)).toEqual(['Fix sidebar spacing', null])
  })

  it('keeps a match only for a quest still in the realm, and matches the rest by title', () => {
    const quests = draftOf({
      groups: [{ parent: null, quests: [quest({ key: 'q1', title: 'Make it count', match: { id: 't-1', kind: 'same', why: 'Already planned.' } }), quest({ key: 'q2', title: 'Polish the sidebar', match: { id: 't-gone', kind: 'same' } })] }],
    }).groups[0]!.quests

    expect(quests[0]!.match).toEqual({ id: 't-1', title: 'Sidebar polish', state: 'queued', kind: 'same', why: 'Already planned.', by: 'brewquest' })
    expect(quests[1]!.match).toMatchObject({ id: 't-1', kind: 'same', by: 'title' })
  })

  it('turns waits into draft keys or open quest ids, drops ones that name nothing, and leaves out a loop with a doubt', () => {
    const quests = draftOf({
      groups: [
        {
          parent: null,
          quests: [quest({ key: 'q1', title: 'One', waitsFor: ['q2', 't-1', 't-2', 'q9', 'q1'] }), quest({ key: 'q2', title: 'Two', waitsFor: ['q3'] }), quest({ key: 'q3', title: 'Three', waitsFor: ['q1'] })],
        },
      ],
    }).groups[0]!.quests

    expect(quests.map(one => one.waitsFor)).toEqual([['d-abcd1234.q2', 't-1'], ['d-abcd1234.q3'], []])
    expect(quests[2]!.doubts).toEqual([MESSAGES.brewLoopLeftOut('One')])
  })

  it('files 50 quests at most, and asks about the rest', () => {
    const many = Array.from({ length: 53 }, (_, i) => quest({ key: `q${i + 1}`, title: `Quest ${i + 1}` }))
    const draft = draftOf({ groups: [{ parent: null, quests: many }], questions: [] })

    expect(draft.groups[0]!.quests).toHaveLength(50)
    expect(draft.questions).toEqual([MESSAGES.brewTooMany(3)])
  })

  it('leaves out groups with no quests and quests with no title', () => {
    const draft = draftOf({ groups: [{ parent: { new: 'Empty' }, quests: [] }, { parent: null, quests: [quest({ title: '  ' }), quest({ key: 'q2', title: 'Kept' })] }] })

    expect(draft.groups.map(group => [group.key, group.quests.map(one => [one.key, one.title])])).toEqual([['d-abcd1234.g1', [['d-abcd1234.q1', 'Kept']]]])
  })
})
