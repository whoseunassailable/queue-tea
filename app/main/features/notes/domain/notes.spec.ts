import { describe, expect, it } from 'vitest'

import { backlinksOf, firstParagraphOf, freeTitle, isNoteId, isTitleTaken, linkPartsOf, linksOf, openItemsOf, proposalOf, questIdOf, questLinkOf, questLinksOf, renameLinks } from '../../../../shared/notes'
import type { Note } from '../../../../shared/notes'
import { noteText, parseNote } from './note_file'

const note = (over: Partial<Note> = {}): Note => ({ id: 'n-1', title: 'Bug Bounty Helper', folder: 'Ideas', tags: [], created: '', updated: '', isArchived: false, quests: [], body: '', stamp: '', ...over })

describe('a note file', () => {
  it('reads what it writes, and keeps front matter it does not own', () => {
    const text = noteText({ title: 'Bug "Bounty"', folder: 'Ideas', tags: ['security'], created: '2026-11-07T10:00:00', updated: '2026-11-07T11:00:00', isArchived: true, quests: [{ id: 't-1', item: null }], body: '# Plan\n\n---\nnot front matter', aliases: ['bbh'], rest: ['cssclass: wide'] })
    const read = parseNote(text, 'n-1', 'file-time')

    expect(read).toEqual({ title: 'Bug "Bounty"', folder: 'Ideas', tags: ['security'], created: '2026-11-07T10:00:00', updated: '2026-11-07T11:00:00', isArchived: true, quests: [{ id: 't-1', item: null }], body: '# Plan\n\n---\nnot front matter', aliases: ['bbh'], rest: ['cssclass: wide'] })
    expect(noteText(read)).toBe(text)
  })

  it('reads a note Obsidian wrote: plain values and YAML lists', () => {
    const read = parseNote('---\r\ntitle: My idea\r\ntags:\r\n  - "#ideas"\r\n  - deep work\r\naliases: [My idea, mi]\r\ncssclass: wide\r\n---\r\nHello', 'my-idea', 'file-time')

    expect(read).toMatchObject({ title: 'My idea', folder: 'Inbox', tags: ['ideas', 'deep-work'], created: 'file-time', isArchived: false, body: 'Hello', rest: ['cssclass: wide'] })
  })

  it('takes a file with no front matter as all body, named after the file', () => {
    expect(parseNote('just text\n', 'Scratch', 'file-time')).toMatchObject({ title: 'Scratch', folder: 'Inbox', body: 'just text\n', rest: [] })
    expect(parseNote('---\nno end', 'Open', 'file-time')).toMatchObject({ title: 'Open', body: '---\nno end' })
  })

  it('drops quest links it cannot read', () => {
    expect(parseNote('---\nquests: [{"id":1}, {"id":"t-2","item":"x"}]\n---\n', 'n', 't').quests).toEqual([{ id: 't-2', item: 'x' }])
  })
})

describe('titles', () => {
  it('are taken by a live note of the same title, whatever its case', () => {
    const notes = [note({ id: 'a', title: 'Plan' }), note({ id: 'b', title: 'Old', isArchived: true })]

    expect(isTitleTaken(notes, ' plan ', null)).toBe(true)
    expect(isTitleTaken(notes, 'Plan', 'a')).toBe(false)
    expect(isTitleTaken(notes, 'Old', null)).toBe(false)
    expect(freeTitle([...notes, note({ id: 'c', title: 'Plan 2' })], 'Plan')).toBe('Plan 3')
  })
})

describe('note ids', () => {
  it('are file names with no folders, hidden files or ..', () => {
    expect(['n-1a2b3c4d', 'My idea', 'Bug (v2)'].every(isNoteId)).toBe(true)
    expect(['', '.hidden', '../x', 'a/b', 'a\\b', 'a..b', 'x'.repeat(121), 7].some(isNoteId)).toBe(false)
  })
})

describe('links', () => {
  it('finds each linked title once, with or without an alias or heading', () => {
    expect(linksOf('See [[Plan]], [[plan|the plan]], [[Risks#Top]] and [[ ]].')).toEqual(['Plan', 'Risks'])
  })

  it('cuts text into plain runs and links, showing an alias where one is given', () => {
    expect(linkPartsOf('See [[Plan|the plan]], [[Risks#Top]] and [[ ]].')).toEqual([
      { kind: 'text', text: 'See ' },
      { kind: 'link', title: 'Plan', shown: 'the plan' },
      { kind: 'text', text: ', ' },
      { kind: 'link', title: 'Risks', shown: 'Risks' },
      { kind: 'text', text: ' and ' },
      { kind: 'text', text: '[[ ]]' },
      { kind: 'text', text: '.' },
    ])
  })

  it('renames every form of a link and leaves the others', () => {
    expect(renameLinks('[[Plan]] [[plan|p]] [[Plan#x]] [[Planet]]', 'Plan', 'Roadmap')).toBe('[[Roadmap]] [[Roadmap|p]] [[Roadmap#x]] [[Planet]]')
  })

  it('backlinks are the other live notes that link here', () => {
    const here = note()
    const notes = [here, note({ id: 'a', body: '[[bug bounty helper]]' }), note({ id: 'b', body: '[[Bug Bounty Helper]]', isArchived: true }), note({ id: 'c', body: 'none' })]

    expect(backlinksOf(notes, here).map(n => n.id)).toEqual(['a'])
  })
})

describe('quest links', () => {
  it('recognises generated quest ids, ignoring case, while ordinary note titles stay notes', () => {
    expect(questIdOf(' QUEST:T-A1B2C3D4 ')).toBe('t-a1b2c3d4')
    expect(questIdOf('quest:t-12345678-abcd-4321-abcd-123456789abc')).toBe('t-12345678-abcd-4321-abcd-123456789abc')
    for (const title of ['Quest plan', 'quest:', 'quest:t-plan', 'quest:t-abc/def']) expect(questIdOf(title)).toBeNull()
  })

  it('writes an alias that cannot close or split the link, preserving unicode', () => {
    const written = questLinkOf('t-abc123', 'Fix [[input]] | café\r\nnext')
    expect(written).toBe('quest:t-abc123|Fix input café next')
    expect(linkPartsOf(`[[${written}]]`)).toEqual([{ kind: 'quest', id: 't-abc123', shown: 'Fix input café next' }])
    expect(questLinkOf('t-abc123', ' []|\n ')).toBe('quest:t-abc123')
  })

  it('keeps quest ids separate from note links and deduplicates their aliases', () => {
    const body = '[[Plan]] [[quest:t-abc|Old]] [[QUEST:T-ABC|New]] [[quest:t-def]] [[quest:t-plan]]'
    expect(questLinksOf(body)).toEqual(['t-abc', 't-def'])
    expect(linksOf(body)).toEqual(['Plan', 'quest:t-plan'])
    expect(linkPartsOf('[[quest:t-def]]')).toEqual([{ kind: 'quest', id: 't-def', shown: 't-def' }])
  })

  it('never rewrites a quest link or counts it as a backlink to a same-named note', () => {
    const body = '[[quest:t-abc|Plan]] [[Plan]]'
    expect(renameLinks(body, 'quest:t-abc', 'Roadmap')).toBe(body)
    expect(renameLinks(body, 'Plan', 'Roadmap')).toBe('[[quest:t-abc|Plan]] [[Roadmap]]')
    const here = note({ title: 'quest:t-abc' })
    expect(backlinksOf([here, note({ id: 'other', body })], here)).toEqual([])
  })
})

describe('turning a note into quests', () => {
  const body = '# Plan\n\nAn intelligent security helper.\n\n- [ ] Scan dependencies\n- [x] Done already\n* [ ] Write the report\n- [ ] Scan dependencies\n'

  it('reads the unticked checklist lines', () => {
    expect(openItemsOf(body)).toEqual(['Scan dependencies', 'Write the report', 'Scan dependencies'])
  })

  it('offers a new parent named after the note for two or more lines', () => {
    expect(proposalOf(note({ body }))).toEqual({
      parent: { kind: 'new', title: 'Bug Bounty Helper' },
      quests: [
        { title: 'Scan dependencies', priority: 'mid', difficulty: 'medium', item: 'Scan dependencies' },
        { title: 'Write the report', priority: 'mid', difficulty: 'medium', item: 'Write the report' },
      ],
    })
  })

  it('offers only the lines not filed yet, under the note’s own quest', () => {
    const filed = note({ body, quests: [{ id: 't-own', item: null }, { id: 't-1', item: 'Scan dependencies' }] })

    expect(proposalOf(filed)).toEqual({ parent: { kind: 'task', id: 't-own' }, quests: [{ title: 'Write the report', priority: 'mid', difficulty: 'medium', item: 'Write the report' }] })
  })

  it('once the note’s own quest is done, offers new lines under a new parent, and never the note again', () => {
    const done = note({ body, quests: [{ id: 't-own', item: null }] })

    expect(proposalOf(done, () => false).parent).toEqual({ kind: 'new', title: 'Bug Bounty Helper' })
    expect(proposalOf(note({ body: 'Words', quests: [{ id: 't-own', item: null }] }), () => false).quests).toEqual([])
  })

  it('once its lines are all filed, offers nothing, not the note itself', () => {
    expect(proposalOf(note({ body: '- [ ] Only this', quests: [{ id: 't-1', item: 'Only this' }] })).quests).toEqual([])
  })

  it('makes one line one quest, and a note with none the quest itself', () => {
    expect(proposalOf(note({ body: '- [ ] Only this' })).quests).toEqual([{ title: 'Only this', priority: 'mid', difficulty: 'medium', item: 'Only this' }])
    expect(proposalOf(note({ body: 'Words' }))).toEqual({ parent: { kind: 'none' }, quests: [{ title: 'Bug Bounty Helper', priority: 'mid', difficulty: 'medium', item: null }] })
    expect(proposalOf(note({ body: 'Words', quests: [{ id: 't-own', item: null }] })).quests).toEqual([])
  })

  it('describes a quest with the first paragraph that is prose', () => {
    expect(firstParagraphOf(body)).toBe('An intelligent security helper.')
    expect(firstParagraphOf('# Only a heading')).toBeNull()
  })
})
