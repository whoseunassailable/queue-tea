import { describe, expect, it } from 'vitest'

import type { CanvasNode, NoteCanvas } from '../../../../shared/note_canvas'
import { CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_MIN_SIZE } from '../../../core/constants/constants'
import { boundsOf, cardOf, linePathOf, sidesOf, withCard, withLine, withoutCard, withoutLine, withPlace } from './note_canvas'

const node = (id: string, over: Partial<CanvasNode> = {}): CanvasNode => ({ id, type: 'text', text: '', x: 0, y: 0, width: 100, height: 50, ...over })
const empty: NoteCanvas = { nodes: [], edges: [] }

describe('what a card shows', () => {
  it('reads notes, quests, files, links, text and groups as Obsidian stores them', () => {
    expect(cardOf(node('a', { type: 'file', file: 'n-3f9a2b7e.md' }))).toEqual({ kind: 'note', id: 'n-3f9a2b7e' })
    expect(cardOf(node('a', { type: 'file', file: 'Clinic visit.md' }))).toEqual({ kind: 'note', id: 'Clinic visit' })
    expect(cardOf(node('a', { type: 'file', file: 'attachments/ab.png' }))).toEqual({ kind: 'file', path: 'attachments/ab.png' })
    expect(cardOf(node('a', { type: 'link', url: 'https://example.com/post' }))).toEqual({ kind: 'link', url: 'https://example.com/post' })
    expect(cardOf(node('a', { text: ' [[quest:t-e84dd5ab|Write the parser]] ' }))).toEqual({ kind: 'quest', id: 't-e84dd5ab', shown: 'Write the parser' })
    expect(cardOf(node('a', { text: 'Do [[quest:t-e84dd5ab|this]] first' }))).toEqual({ kind: 'text', text: 'Do [[quest:t-e84dd5ab|this]] first' })
    expect(cardOf(node('a', { type: 'group', label: 'Week 1' }))).toEqual({ kind: 'group', label: 'Week 1' })
  })

  it('shows what it cannot follow as it is: a note in a subfolder, a file outside the vault, a link that is not a web page', () => {
    expect(cardOf(node('a', { type: 'file', file: 'Projects/plan.md' }))).toEqual({ kind: 'other', text: 'Projects/plan.md' })
    expect(cardOf(node('a', { type: 'file', file: '../secret.png' }))).toEqual({ kind: 'other', text: '../secret.png' })
    expect(cardOf(node('a', { type: 'link', url: 'javascript:alert(1)' }))).toEqual({ kind: 'other', text: 'javascript:alert(1)' })
    expect(cardOf(node('a', { type: 'sticker', text: undefined }))).toEqual({ kind: 'other', text: '' })
  })
})

describe('changing the board', () => {
  it('centres a new card on the view, fanning out past one already there, in the format Obsidian reads', () => {
    const one = withCard(empty, 'a', { kind: 'note', id: 'n-1' }, { x: 0, y: 0 })
    const three = withCard(withCard(one, 'b', { kind: 'note', id: 'n-2' }, { x: 0, y: 0 }), 'c', { kind: 'note', id: 'n-3' }, { x: 0, y: 0 })
    const size = CANVAS_CARD_SIZE.note

    expect(one.nodes).toEqual([{ id: 'a', type: 'file', file: 'n-1.md', x: -size.width / 2, y: -size.height / 2, ...size }])
    expect(three.nodes.map(card => [card.x, card.y])).toEqual([0, 1, 2].map(n => [-size.width / 2 + n * CANVAS_CASCADE_PX, -size.height / 2 + n * CANVAS_CASCADE_PX]))
    expect(withCard(empty, 'q', { kind: 'quest', id: 't-1', title: 'Write [the] parser' }, { x: 0, y: 0 }).nodes[0]).toMatchObject({ type: 'text', text: '[[quest:t-1|Write the parser]]', ...CANVAS_CARD_SIZE.quest })
    expect(withCard(empty, 'c', { kind: 'link', url: 'https://example.com' }, { x: 0, y: 0 }).nodes[0]).toMatchObject({ type: 'link', url: 'https://example.com' })
    expect(withCard(empty, 'd', { kind: 'file', path: 'attachments/ab.png' }, { x: 0, y: 0 }).nodes[0]).toMatchObject({ type: 'file', file: 'attachments/ab.png' })
  })

  it('moves and resizes in whole pixels, never below the smallest card, keeping fields it does not own', () => {
    const board = { nodes: [node('a', { color: '3' })], edges: [] }

    expect(withPlace(board, 'a', { x: 10.4, y: -3.6 }).nodes[0]).toEqual(node('a', { color: '3', x: 10, y: -4 }))
    expect(withPlace(board, 'a', { width: 5, height: 900.5 }).nodes[0]).toMatchObject({ width: CANVAS_MIN_SIZE.width, height: 901 })
  })

  it('joins two cards once, from the sides that face each other, and never a card to itself', () => {
    const board = { nodes: [node('a'), node('b', { x: 300, y: 40 }), node('c', { y: 300 })], edges: [] }
    const joined = withLine(board, 'e', 'a', 'b')

    expect(joined.edges).toEqual([{ id: 'e', fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left' }])
    expect(withLine(joined, 'f', 'b', 'a')).toBe(joined)
    expect(withLine(joined, 'f', 'a', 'a')).toBe(joined)
    expect(withLine(joined, 'f', 'a', 'gone')).toBe(joined)
    expect(withLine(joined, 'f', 'a', 'c').edges[1]).toMatchObject({ fromSide: 'bottom', toSide: 'top' })
  })

  it('removes a card with its lines, or one line alone', () => {
    const board = withLine(withLine({ nodes: [node('a'), node('b', { x: 300 }), node('c', { y: 300 })], edges: [] }, 'ab', 'a', 'b'), 'bc', 'b', 'c')

    expect(withoutCard(board, 'b')).toEqual({ nodes: [node('a'), node('c', { y: 300 })], edges: [] })
    expect(withoutLine(board, 'ab').edges.map(edge => edge.id)).toEqual(['bc'])
  })
})

describe('drawing the board', () => {
  it('faces left and right when cards sit side by side, and up and down otherwise', () => {
    expect(sidesOf(node('a'), node('b', { x: -300, y: 50 }))).toEqual(['left', 'right'])
    expect(sidesOf(node('a'), node('b', { x: 20, y: -200 }))).toEqual(['top', 'bottom'])
  })

  it('bows a line out of the sides it was given, with arrows where the format puts them', () => {
    const [a, b] = [node('a'), node('b', { x: 300 })]
    const path = linePathOf(a, b, { id: 'e', fromNode: 'a', toNode: 'b' })

    expect(path).toMatchObject({ isArrowTo: true, isArrowFrom: false, mid: { x: 200, y: 25 } })
    expect(path.d).toBe('M 100 25 C 200 25 200 25 300 25')
    expect(linePathOf(a, b, { id: 'e', fromNode: 'a', fromSide: 'bottom', toNode: 'b', toSide: 'nowhere', fromEnd: 'arrow', toEnd: 'none' })).toMatchObject({ isArrowTo: false, isArrowFrom: true, d: expect.stringMatching(/^M 50 50 C 50 /) })
  })

  it('bounds every card, or none on an empty board', () => {
    expect(boundsOf([])).toBeNull()
    expect(boundsOf([node('a', { x: -10 }), node('b', { x: 200, y: 300 })])).toEqual({ left: -10, top: 0, right: 300, bottom: 350 })
  })
})
