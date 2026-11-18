import type { SimulationNodeDatum } from 'd3-force'
import { forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'

import { GRAPH_CHARGE, GRAPH_GRAVITY, GRAPH_LINK_DISTANCE, GRAPH_PROGRESS_TICKS, GRAPH_THETA, GRAPH_TICKS, GRAPH_WARM_ALPHA } from '../../../core/constants/constants'
import type { GraphEdge } from './note_graph'

// Where each node of the graph sits, worked out by d3-force. Its many-body
// force is Barnes-Hut, which keeps a realm of 5,000 notes workable.

export type Point = { x: number; y: number }
// start: kept points to begin from; centre: pinned at (0, 0), or null for the whole realm.
export type LayoutInput = { ids: string[]; edges: GraphEdge[]; centre: string | null; start: Map<string, Point> }

type Body = SimulationNodeDatum & { id: string }

export const layoutOf = (input: LayoutInput, onProgress?: (share: number) => void): Map<string, Point> => {
  const bodies: Body[] = input.ids.map(id => {
    const start = input.start.get(id)
    const body: Body = start === undefined ? { id } : { id, x: start.x, y: start.y }
    if (id === input.centre) {
      body.fx = 0
      body.fy = 0
    }

    return body
  })
  const kept = input.ids.filter(id => input.start.has(id)).length
  const simulation = forceSimulation(bodies)
    .stop()
    .force('link', forceLink<Body, { source: string; target: string }>(input.edges.map(edge => ({ source: edge.a, target: edge.b }))).id(body => body.id).distance(GRAPH_LINK_DISTANCE))
    .force('charge', forceManyBody().strength(GRAPH_CHARGE).theta(GRAPH_THETA))
    .force('x', forceX(0).strength(GRAPH_GRAVITY))
    .force('y', forceY(0).strength(GRAPH_GRAVITY))
    .alpha(input.ids.length > 0 && kept * 2 >= input.ids.length ? GRAPH_WARM_ALPHA : 1)
  // A cold layout settles in GRAPH_TICKS steps.
  simulation.alphaDecay(1 - Math.pow(simulation.alphaMin(), 1 / GRAPH_TICKS))
  const total = Math.max(1, Math.ceil(Math.log(simulation.alphaMin() / simulation.alpha()) / Math.log(1 - simulation.alphaDecay())))
  for (let ticks = 1; simulation.alpha() >= simulation.alphaMin(); ticks++) {
    simulation.tick()
    if (ticks % GRAPH_PROGRESS_TICKS === 0) onProgress?.(Math.min(1, ticks / total))
  }
  onProgress?.(1)

  return new Map(bodies.map(body => [body.id, { x: body.x ?? 0, y: body.y ?? 0 }]))
}

// The nearest shown node within reach of a point, if any.
export const nodeAt = (points: Map<string, Point>, shown: ReadonlySet<string>, at: Point, reach: number): string | null => {
  let best: string | null = null
  let bestDistance = reach * reach
  for (const id of shown) {
    const point = points.get(id)
    if (point === undefined) continue
    const distance = (point.x - at.x) ** 2 + (point.y - at.y) ** 2
    if (distance <= bestDistance) {
      best = id
      bestDistance = distance
    }
  }

  return best
}

export type Direction = 'up' | 'down' | 'left' | 'right'
const AXES: Record<Direction, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }

// The closest shown node in the 90° cone around a direction, for the arrow keys.
export const nextNode = (points: Map<string, Point>, shown: ReadonlySet<string>, from: string, direction: Direction): string | null => {
  const origin = points.get(from)
  if (origin === undefined) return null
  const axis = AXES[direction]
  let best: string | null = null
  let bestDistance = Infinity
  for (const id of shown) {
    const point = points.get(id)
    if (id === from || point === undefined) continue
    const dx = point.x - origin.x
    const dy = point.y - origin.y
    const along = dx * axis.x + dy * axis.y
    const across = Math.abs(dx * axis.y - dy * axis.x)
    const distance = dx * dx + dy * dy
    if (along > 0 && along >= across && distance < bestDistance) {
      best = id
      bestDistance = distance
    }
  }

  return best
}
