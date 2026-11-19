import { CANVAS_LIMITS } from '../../../../shared/note_canvas'
import type { CanvasEdge, CanvasNode, CanvasValue, NoteCanvas } from '../../../../shared/note_canvas'

// The canvas file, read from disk or sent by the window. Every field the
// format may add is kept as it came, as long as it's a plain value, so a
// board made in Obsidian saves back without losing its colours or labels.
// null: not a canvas Queue-tea can keep safely.

const KEY = /^[A-Za-z][A-Za-z0-9_-]{0,39}$/
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isId = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= CANVAS_LIMITS.id
const isPlace = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= CANVAS_LIMITS.coordinate
const isSize = (value: unknown): value is number => isPlace(value) && value > 0
const isValue = (value: unknown): value is CanvasValue => (typeof value === 'string' ? value.length <= CANVAS_LIMITS.text : typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value)))

const extrasOf = (value: Record<string, unknown>, known: readonly string[]): Record<string, CanvasValue> | null => {
  const extra = Object.entries(value).filter(([key, field]) => !known.includes(key) && field !== undefined)
  if (extra.length > CANVAS_LIMITS.extras || extra.some(([key, field]) => !KEY.test(key) || !isValue(field))) return null

  return Object.fromEntries(extra) as Record<string, CanvasValue>
}

const nodeOf = (value: unknown): CanvasNode | null => {
  if (!isObject(value) || !isId(value.id) || typeof value.type !== 'string' || !KEY.test(value.type)) return null
  const { x, y, width, height } = value
  if (!isPlace(x) || !isPlace(y) || !isSize(width) || !isSize(height)) return null
  if ((['text', 'file', 'url'] as const).some(field => value[field] !== undefined && typeof value[field] !== 'string')) return null
  const extras = extrasOf(value, ['id', 'type', 'x', 'y', 'width', 'height'])

  return extras === null ? null : { id: value.id, type: value.type, ...extras, x, y, width, height }
}

const edgeOf = (value: unknown): CanvasEdge | null => {
  if (!isObject(value) || !isId(value.id) || !isId(value.fromNode) || !isId(value.toNode)) return null
  const extras = extrasOf(value, ['id', 'fromNode', 'toNode'])

  return extras === null ? null : { id: value.id, fromNode: value.fromNode, toNode: value.toNode, ...extras }
}

const isUnique = (ids: string[]) => new Set(ids).size === ids.length

export const canvasOf = (value: unknown): NoteCanvas | null => {
  if (!isObject(value)) return null
  const given = { nodes: value.nodes ?? [], edges: value.edges ?? [] }
  if (!Array.isArray(given.nodes) || !Array.isArray(given.edges) || given.nodes.length > CANVAS_LIMITS.nodes || given.edges.length > CANVAS_LIMITS.edges) return null
  const nodes = given.nodes.map(nodeOf)
  const edges = given.edges.map(edgeOf)
  if (nodes.some(node => node === null) || edges.some(edge => edge === null)) return null
  const kept = nodes as CanvasNode[]
  if (!isUnique(kept.map(node => node.id)) || !isUnique((edges as CanvasEdge[]).map(edge => edge.id))) return null
  const ids = new Set(kept.map(node => node.id))

  // A line to a card that isn't there draws nothing in Obsidian either, so dropping it loses nothing.
  return { nodes: kept, edges: (edges as CanvasEdge[]).filter(edge => ids.has(edge.fromNode) && ids.has(edge.toNode)) }
}

// Tabs, as Obsidian writes it, so a board saved here diffs cleanly there.
export const canvasText = (canvas: NoteCanvas): string => `${JSON.stringify({ nodes: canvas.nodes, edges: canvas.edges }, null, '\t')}\n`

export const parseCanvas = (text: string): NoteCanvas | null => {
  if (text.trim() === '') return { nodes: [], edges: [] }
  try {
    return canvasOf(JSON.parse(text))
  } catch {
    // Not JSON at all: the caller says so, and the file is left as it is.
    return null
  }
}
