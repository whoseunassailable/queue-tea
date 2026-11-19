import { describe, expect, it } from 'vitest'

import { canvasOf, canvasText, parseCanvas } from './note_canvas'

const node = (id: string, over: Record<string, unknown> = {}) => ({ id, type: 'text', text: 'Hi', x: 0, y: 0, width: 100, height: 50, ...over })

describe('a canvas file', () => {
  it('keeps every plain field it does not read, so an Obsidian board saves back whole', () => {
    const board = { nodes: [node('a', { color: '#ff0000', isLocked: true, z: 2 }), node('g', { type: 'group', label: 'Week 1', background: 'bg.png', backgroundStyle: 'cover', text: undefined })], edges: [{ id: 'e', fromNode: 'a', fromSide: 'bottom', fromEnd: 'arrow', toNode: 'g', toSide: 'top', toEnd: 'none', color: '2', label: 'next' }] }

    expect(canvasOf(board)).toEqual({ nodes: [node('a', { color: '#ff0000', isLocked: true, z: 2 }), { id: 'g', type: 'group', label: 'Week 1', background: 'bg.png', backgroundStyle: 'cover', x: 0, y: 0, width: 100, height: 50 }], edges: board.edges })
    expect(parseCanvas(canvasText(canvasOf(board)!))).toEqual(canvasOf(board))
  })

  it('reads an empty file and missing lists as an empty board', () => {
    expect(parseCanvas('')).toEqual({ nodes: [], edges: [] })
    expect(parseCanvas('{}')).toEqual({ nodes: [], edges: [] })
  })

  it('drops a line to a card that is not there', () => {
    expect(canvasOf({ nodes: [node('a')], edges: [{ id: 'e', fromNode: 'a', toNode: 'gone' }] })?.edges).toEqual([])
  })

  it('refuses what it could not write back safely', () => {
    for (const bad of [
      '{ not json',
      '[]',
      '{"nodes": {}}',
      JSON.stringify({ nodes: [node('a'), node('a')] }),
      JSON.stringify({ nodes: [node('a')], edges: [{ id: 'e', fromNode: 'a', toNode: 'a' }, { id: 'e', fromNode: 'a', toNode: 'a' }] }),
      JSON.stringify({ nodes: [node('')] }),
      JSON.stringify({ nodes: [node('x'.repeat(65))] }),
      JSON.stringify({ nodes: [node('a', { type: 'bad type' })] }),
      JSON.stringify({ nodes: [node('a', { width: -1 })] }),
      JSON.stringify({ nodes: [node('a', { x: 1e8 })] }),
      JSON.stringify({ nodes: [node('a', { file: 3 })] }),
      JSON.stringify({ nodes: [node('a', { meta: { nested: true } })] }),
      JSON.stringify({ nodes: [node('a', { 'bad key': 1 })] }),
      JSON.stringify({ nodes: [node('a', Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`k${i}`, i])))] }),
      JSON.stringify({ nodes: Array.from({ length: 1001 }, (_, i) => node(`n${i}`)) }),
    ]) {
      expect(parseCanvas(bad)).toBeNull()
    }
  })
})
