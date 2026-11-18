import { GRAPH_LABEL_CHARS } from '../../../../core/constants/constants'
import type { GraphEdge, GraphNode, NoteGraph } from '../../domain/note_graph'
import type { Point } from '../../domain/note_graph_layout'

// Draws the note graph on a canvas from laid-out points. Pan and zoom only
// redraw from the same points; nothing here moves a node.

export type GraphColours = { note: string; meeting: string; quest: string; gone: string; line: string; ring: string; label: string; halo: string }
// A point (x, y) of the layout sits at (x * zoom + view.x, y * zoom + view.y) on the canvas.
export type GraphViewBox = { zoom: number; x: number; y: number }
export type GraphFrame = {
  width: number
  height: number
  ratio: number
  view: GraphViewBox
  graph: NoteGraph
  points: Map<string, Point>
  shown: ReadonlySet<string>
  openId: string
  // The node under the pointer or the keyboard's focus; it and its neighbours stay bright.
  hot: string | null
  // Whether every shown node gets its title, not only the open and hot ones.
  isLabelled: boolean
  colours: GraphColours
  // The label of a quest that is not in the queue.
  goneQuest: string
}

const DIM = 0.18
const DONE_ALPHA = 0.45
const QUEST_SIZE = 6
const RING_GAP = 3
const LABEL_FONT = '600 11px "Nunito Sans", system-ui, sans-serif'

// A note grows a little with its links, so hubs stand out.
export const radiusOf = (node: GraphNode): number => (node.kind === 'quest' ? QUEST_SIZE : 4 + Math.min(6, Math.sqrt(node.links) * 1.5))

const TOKENS: Record<keyof GraphColours, [string, string]> = {
  note: ['--ink2', '#54473A'],
  meeting: ['--mp', '#3BA6D6'],
  quest: ['--xp', '#2E9C7E'],
  gone: ['--ink3', '#665848'],
  line: ['--line-soft', 'rgba(184,137,58,.45)'],
  ring: ['--gold', '#E8B04B'],
  label: ['--ink', '#2A2218'],
  halo: ['--pn-solid', '#FFFAEE'],
}

// The theme's colours where the graph sits, so day, evening and night all read.
export const graphColoursOf = (element: Element): GraphColours => {
  const style = getComputedStyle(element)
  const colours = {} as GraphColours
  for (const [key, [token, fallback]] of Object.entries(TOKENS) as [keyof GraphColours, [string, string]][]) colours[key] = style.getPropertyValue(token).trim() || fallback

  return colours
}

const shortTitleOf = (title: string): string => (title.length > GRAPH_LABEL_CHARS ? `${title.slice(0, GRAPH_LABEL_CHARS - 1).trimEnd()}…` : title)

const shapeOf = (ctx: CanvasRenderingContext2D, node: GraphNode, at: Point) => {
  const r = radiusOf(node)
  if (node.kind === 'quest') {
    ctx.moveTo(at.x, at.y - r)
    ctx.lineTo(at.x + r, at.y)
    ctx.lineTo(at.x, at.y + r)
    ctx.lineTo(at.x - r, at.y)
    ctx.closePath()
  } else {
    ctx.moveTo(at.x + r, at.y)
    ctx.arc(at.x, at.y, r, 0, Math.PI * 2)
  }
}

export const drawGraph = (ctx: CanvasRenderingContext2D, frame: GraphFrame) => {
  const { width, height, ratio, view, graph, points, shown, openId, hot, isLabelled, colours, goneQuest } = frame
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.clearRect(0, 0, width, height)
  const near = hot === null ? null : new Set([hot, ...(graph.neighbours.get(hot) ?? [])])
  const isBright = (id: string) => near === null || near.has(id)

  // Layout units from here on, so shapes and lines grow with the zoom.
  ctx.setTransform(ratio * view.zoom, 0, 0, ratio * view.zoom, ratio * view.x, ratio * view.y)
  ctx.lineWidth = 1 / view.zoom
  ctx.strokeStyle = colours.line
  // One path per brightness, since a stroke per line is slow at 10,000 lines.
  const strokeLines = (alpha: number, isKept: (edge: GraphEdge) => boolean) => {
    ctx.globalAlpha = alpha
    ctx.beginPath()
    for (const edge of graph.edges) {
      const a = points.get(edge.a)
      const b = points.get(edge.b)
      if (a === undefined || b === undefined || !shown.has(edge.a) || !shown.has(edge.b) || !isKept(edge)) continue
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
    }
    ctx.stroke()
  }
  if (hot === null) strokeLines(1, () => true)
  else {
    strokeLines(DIM, edge => edge.a !== hot && edge.b !== hot)
    strokeLines(1, edge => edge.a === hot || edge.b === hot)
  }

  for (const id of shown) {
    const node = graph.nodes.get(id)
    const at = points.get(id)
    if (node === undefined || at === undefined) continue
    const alpha = isBright(id) ? 1 : DIM
    ctx.beginPath()
    shapeOf(ctx, node, at)
    if (node.kind === 'quest' && node.questState === 'gone') {
      ctx.globalAlpha = alpha
      ctx.setLineDash([2 / view.zoom, 2 / view.zoom])
      ctx.strokeStyle = colours.gone
      ctx.stroke()
      ctx.setLineDash([])
      continue
    }
    ctx.globalAlpha = node.questState === 'done' ? alpha * DONE_ALPHA : alpha
    ctx.fillStyle = node.kind === 'quest' ? colours.quest : node.kind === 'meeting' ? colours.meeting : colours.note
    ctx.fill()
  }

  const open = graph.nodes.get(openId)
  const openAt = points.get(openId)
  if (open !== undefined && openAt !== undefined) {
    ctx.globalAlpha = 1
    ctx.lineWidth = 2 / view.zoom
    ctx.strokeStyle = colours.ring
    ctx.beginPath()
    ctx.arc(openAt.x, openAt.y, radiusOf(open) + RING_GAP / view.zoom + 1, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Labels in screen pixels, so they stay one size at any zoom.
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.font = LABEL_FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 3
  ctx.strokeStyle = colours.halo
  ctx.fillStyle = colours.label
  for (const id of shown) {
    if (!isLabelled && id !== openId && id !== hot) continue
    const node = graph.nodes.get(id)
    const at = points.get(id)
    if (node === undefined || at === undefined) continue
    const x = at.x * view.zoom + view.x
    const y = (at.y + radiusOf(node)) * view.zoom + view.y + 3
    // Off screen, a title costs time and shows nothing.
    if (x < -200 || x > width + 200 || y < -20 || y > height + 20) continue
    ctx.globalAlpha = isBright(id) ? 1 : DIM
    const title = shortTitleOf(node.title ?? goneQuest)
    ctx.strokeText(title, x, y)
    ctx.fillText(title, x, y)
  }
  ctx.globalAlpha = 1
}
