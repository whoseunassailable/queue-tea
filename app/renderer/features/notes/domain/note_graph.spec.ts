import { describe, expect, it } from 'vitest'

import type { NoteType } from '../../../../shared/notes'
import { note } from '../../../test_support'
import type { GraphFilter } from './note_graph'
import { aroundOf, noteGraphOf, SHOW_ALL, shownIdsOf } from './note_graph'
import type { QuestLine, QuestState } from './notes_view'

const line = (title: string | null, state: QuestState): QuestLine => ({ title, state, priority: 'mid', difficulty: 'medium' })

describe('the graph from the notes', () => {
  it('joins two notes once, whichever way and however often they link', () => {
    const a = note({ id: 'n-a', title: 'A', body: '[[B]] [[B]]' })
    const b = note({ id: 'n-b', title: 'B', body: '[[A]]' })
    // B comes first, so its link to A is read first and the ids still come out sorted.
    const graph = noteGraphOf([b, a], new Map())

    expect(graph.edges).toEqual([{ a: 'n-a', b: 'n-b' }])
    expect(graph.nodes.get('n-a')!.links).toBe(1)
    expect(graph.nodes.get('n-b')!.links).toBe(1)
  })

  it('matches a title ignoring case', () => {
    const threat = note({ id: 'n-threat', title: 'Threat model' })
    const plan = note({ id: 'n-plan', title: 'Plan', body: 'See [[threat MODEL]].' })

    expect(noteGraphOf([threat, plan], new Map()).edges).toEqual([{ a: 'n-plan', b: 'n-threat' }])
  })

  it('ignores a link to itself', () => {
    const a = note({ id: 'n-a', title: 'A', body: 'Back to [[A]].' })
    const graph = noteGraphOf([a], new Map())

    expect(graph.edges).toEqual([])
    expect(graph.nodes.get('n-a')!.links).toBe(0)
    expect(graph.neighbours.get('n-a')?.has('n-a') ?? false).toBe(false)
    expect([...aroundOf(graph, 'n-a', 2).nodes.keys()]).toEqual(['n-a'])
  })

  it('leaves out archived notes, missing notes and attachment links', () => {
    const live = note({ id: 'n-live', title: 'Live', body: '[[Old]] [[Nowhere]] [[table.csv]]' })
    const old = note({ id: 'n-old', title: 'Old', isArchived: true, body: '[[Live]]' })
    const graph = noteGraphOf([live, old], new Map())

    expect([...graph.nodes.keys()]).toEqual(['n-live'])
    expect(graph.edges).toEqual([])
  })

  it('adds each linked or filed quest once, with its state and title', () => {
    const parser = note({
      id: 'n-parser',
      title: 'Parser',
      body: 'First [[quest:t-1a2b|Parser]].',
      quests: [{ id: 't-1a2b', item: null }, { id: 't-3c4d', item: 'Ship' }],
    })
    const graph = noteGraphOf([parser], new Map([['t-1a2b', line('Write the parser', 'active')]]))

    expect(graph.nodes.get('quest/t-1a2b')).toMatchObject({ kind: 'quest', title: 'Write the parser', questState: 'active' })
    expect(graph.nodes.get('quest/t-3c4d')).toMatchObject({ kind: 'quest', title: null, questState: 'gone' })
    expect(graph.edges).toHaveLength(2)
  })

  it('keeps a linked quest that left the queue, as gone', () => {
    const plan = note({ id: 'n-plan', title: 'Plan', body: 'Was [[quest:t-9e9e|Old work]].' })
    const graph = noteGraphOf([plan], new Map())

    expect(graph.nodes.get('quest/t-9e9e')).toMatchObject({ kind: 'quest', questState: 'gone' })
    expect(graph.edges).toEqual([{ a: 'n-plan', b: 'quest/t-9e9e' }])
  })

  it('marks a meeting note', () => {
    const graph = noteGraphOf([note({ id: 'n-visit', title: 'Clinic visit', type: 'meeting' }), note({ id: 'n-idea', title: 'Gait sensor', type: 'idea' })], new Map())

    expect(graph.nodes.get('n-visit')).toMatchObject({ kind: 'meeting', noteType: 'meeting' })
    expect(graph.nodes.get('n-idea')).toMatchObject({ kind: 'note', noteType: 'idea' })
  })

  it('keeps one step or two steps around a note, through a shared quest too', () => {
    const a = note({ id: 'n-a', title: 'A', body: '[[quest:t-00aa]]' })
    const b = note({ id: 'n-b', title: 'B', body: '[[quest:t-00aa]] [[C]]' })
    const c = note({ id: 'n-c', title: 'C' })
    const graph = noteGraphOf([a, b, c], new Map([['t-00aa', line('Shared', 'waiting')]]))

    const one = aroundOf(graph, 'n-a', 1)
    expect(new Set(one.nodes.keys())).toEqual(new Set(['n-a', 'quest/t-00aa']))
    expect(one.edges).toEqual([{ a: 'n-a', b: 'quest/t-00aa' }])
    expect(one.nodes.get('quest/t-00aa')!.links).toBe(1)

    const two = aroundOf(graph, 'n-a', 2)
    expect(new Set(two.nodes.keys())).toEqual(new Set(['n-a', 'quest/t-00aa', 'n-b']))
    expect(two.edges).toHaveLength(2)
    expect(two.edges).toEqual(expect.arrayContaining([{ a: 'n-a', b: 'quest/t-00aa' }, { a: 'n-b', b: 'quest/t-00aa' }]))
    expect(graph.nodes.get('n-b')!.links).toBe(2)
    expect(two.nodes.get('n-b')!.links).toBe(1)
    expect(two.nodes.get('quest/t-00aa')!.links).toBe(2)
  })

  it('hides by type, quests and done quests, but never the open note', () => {
    const open = note({ id: 'n-open', title: 'Standup', type: 'meeting' })
    const retro = note({ id: 'n-meet', title: 'Retro', type: 'meeting' })
    const loose = note({ id: 'n-plain', title: 'Loose thought' })
    const idea = note({ id: 'n-idea', title: 'Graph view', type: 'idea', body: '[[quest:t-00a1]] [[quest:t-00d0]]' })
    const graph = noteGraphOf([open, retro, loose, idea], new Map([['t-00a1', line('Draw it', 'active')], ['t-00d0', line('Ship it', 'done')]]))
    const shown = (filter: GraphFilter) => [...shownIdsOf(graph, filter, 'n-open')].sort()
    const hiding = (...types: (NoteType | 'none')[]): GraphFilter => ({ ...SHOW_ALL, hiddenTypes: new Set(types) })

    expect(shown(SHOW_ALL)).toEqual(['n-idea', 'n-meet', 'n-open', 'n-plain', 'quest/t-00a1', 'quest/t-00d0'])
    expect(shown(hiding('meeting'))).toEqual(['n-idea', 'n-open', 'n-plain', 'quest/t-00a1', 'quest/t-00d0'])
    expect(shown(hiding('none'))).toEqual(['n-idea', 'n-meet', 'n-open', 'quest/t-00a1', 'quest/t-00d0'])
    expect(shown({ ...SHOW_ALL, quests: false })).toEqual(['n-idea', 'n-meet', 'n-open', 'n-plain'])
    expect(shown({ ...SHOW_ALL, doneQuests: false })).toEqual(['n-idea', 'n-meet', 'n-open', 'n-plain', 'quest/t-00a1'])
  })
})
