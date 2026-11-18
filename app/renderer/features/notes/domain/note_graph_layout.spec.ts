import { describe, expect, it } from 'vitest'

import type { GraphEdge } from './note_graph'
import type { LayoutInput, Point } from './note_graph_layout'
import { layoutOf, nextNode, nodeAt } from './note_graph_layout'

// Ids padded so that string order matches number order, as edges keep a < b.
const id = (prefix: string, i: number) => `${prefix}-${String(i).padStart(2, '0')}`

describe('the layout', () => {
  it('lays out the same graph the same way twice', () => {
    const input: LayoutInput = { ids: ['a', 'b', 'c', 'd'], edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }], centre: null, start: new Map() }

    expect(layoutOf(input)).toEqual(layoutOf(input))
  })

  it('pins the centre note at the middle', () => {
    const input: LayoutInput = { ids: ['c', 'x', 'y'], edges: [{ a: 'c', b: 'x' }, { a: 'c', b: 'y' }], centre: 'c', start: new Map() }

    expect(layoutOf(input).get('c')).toEqual({ x: 0, y: 0 })
  })

  it('gives every node a finite place, linked or not', () => {
    const linked = Array.from({ length: 50 }, (_, i) => id('n', i))
    const unlinked = Array.from({ length: 50 }, (_, i) => id('u', i))
    const edges: GraphEdge[] = linked.slice(1).map((b, i) => ({ a: linked[i]!, b }))
    const points = layoutOf({ ids: [...linked, ...unlinked], edges, centre: null, start: new Map() })

    expect(points.size).toBe(100)
    for (const point of points.values()) {
      expect(Number.isFinite(point.x)).toBe(true)
      expect(Number.isFinite(point.y)).toBe(true)
    }
  })

  it('reports progress rising to 1', () => {
    const ids = Array.from({ length: 10 }, (_, i) => id('n', i))
    const edges: GraphEdge[] = ids.slice(1).map((b, i) => ({ a: ids[i]!, b }))
    const shares: number[] = []
    layoutOf({ ids, edges, centre: null, start: new Map() }, share => shares.push(share))

    expect(shares.length).toBeGreaterThan(1)
    expect(shares.some(share => share < 1)).toBe(true)
    shares.slice(1).forEach((share, i) => expect(share).toBeGreaterThanOrEqual(shares[i]!))
    expect(shares.at(-1)).toBe(1)
  })
})

describe('finding a node', () => {
  it('finds the shown node within reach, and nothing beyond it or hidden', () => {
    const points = new Map<string, Point>([['a', { x: 0, y: 0 }], ['b', { x: 30, y: 0 }]])

    expect(nodeAt(points, new Set(['a', 'b']), { x: 4, y: 0 }, 10)).toBe('a')
    expect(nodeAt(points, new Set(['a', 'b']), { x: 15, y: 0 }, 10)).toBeNull()
    expect(nodeAt(points, new Set(['b']), { x: 4, y: 0 }, 10)).toBeNull()
  })

  it('moves to the nearest node in a direction', () => {
    const points = new Map<string, Point>([
      ['o', { x: 0, y: 0 }],
      ['p', { x: 10, y: 0 }],
      ['q', { x: 30, y: 1 }],
      ['r', { x: -5, y: 0 }],
      ['s', { x: 2, y: 20 }],
    ])
    const shown = new Set(points.keys())

    expect(nextNode(points, shown, 'o', 'right')).toBe('p')
    expect(nextNode(points, shown, 'o', 'left')).toBe('r')
    // y grows downward, so down is the larger y.
    expect(nextNode(points, shown, 'o', 'down')).toBe('s')
    expect(nextNode(points, shown, 'o', 'up')).toBeNull()
  })
})
