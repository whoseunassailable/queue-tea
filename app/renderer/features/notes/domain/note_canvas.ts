import { noteFilePath } from '../../../../shared/note_attachments'
import { bookmarkUrlOf } from '../../../../shared/note_bookmarks'
import { CANVAS_SIDES } from '../../../../shared/note_canvas'
import type { CanvasEdge, CanvasNode, CanvasSide, NoteCanvas } from '../../../../shared/note_canvas'
import { isNoteId, linkPartsOf, questLinkOf } from '../../../../shared/notes'
import { CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_CURVE_PX, CANVAS_MIN_SIZE } from '../../../core/constants/constants'

export type Point = { x: number; y: number }

// What a card on the board shows. A file card names a note by its file (a
// note made in Obsidian's subfolders isn't one of this realm's), an
// attachment by its path; a text card holding only a quest link is that
// quest. Anything else Obsidian can hold shows as it is.
export type Card =
  | { kind: 'note'; id: string }
  | { kind: 'quest'; id: string; shown: string }
  | { kind: 'file'; path: string }
  | { kind: 'link'; url: string }
  | { kind: 'text'; text: string }
  | { kind: 'group'; label: string }
  | { kind: 'other'; text: string }

export const cardOf = (node: CanvasNode): Card => {
  if (node.type === 'file' && node.file !== undefined) {
    const id = node.file.endsWith('.md') ? node.file.slice(0, -3) : null
    if (id !== null && isNoteId(id)) return { kind: 'note', id }
    const path = noteFilePath(node.file)

    return path === null ? { kind: 'other', text: node.file } : { kind: 'file', path }
  }
  if (node.type === 'link' && node.url !== undefined) {
    const url = bookmarkUrlOf(node.url)

    return url === null ? { kind: 'other', text: node.url } : { kind: 'link', url }
  }
  if (node.type === 'text') {
    const parts = linkPartsOf((node.text ?? '').trim())
    const only = parts.length === 1 ? parts[0]! : null

    return only?.kind === 'quest' ? { kind: 'quest', id: only.id, shown: only.shown } : { kind: 'text', text: node.text ?? '' }
  }
  if (node.type === 'group') return { kind: 'group', label: typeof node.label === 'string' ? node.label : '' }

  return { kind: 'other', text: node.text ?? node.file ?? node.url ?? '' }
}

// What the Add buttons put on the board.
export type NewCard = { kind: 'note'; id: string } | { kind: 'quest'; id: string; title: string } | { kind: 'link'; url: string } | { kind: 'file'; path: string }

const fieldsOf = (card: NewCard): Pick<CanvasNode, 'type' | 'text' | 'file' | 'url'> =>
  card.kind === 'note' ? { type: 'file', file: `${card.id}.md` } : card.kind === 'quest' ? { type: 'text', text: `[[${questLinkOf(card.id, card.title)}]]` } : card.kind === 'link' ? { type: 'link', url: card.url } : { type: 'file', file: card.path }

// The card, centred on centre, stepped down and right past any card that
// starts at the same place, so a run of new cards fans out instead of stacking.
export const withCard = (canvas: NoteCanvas, id: string, card: NewCard, centre: Point): NoteCanvas => {
  const size = CANVAS_CARD_SIZE[card.kind]
  let at = { x: Math.round(centre.x - size.width / 2), y: Math.round(centre.y - size.height / 2) }
  while (canvas.nodes.some(node => node.x === at.x && node.y === at.y)) at = { x: at.x + CANVAS_CASCADE_PX, y: at.y + CANVAS_CASCADE_PX }

  return { ...canvas, nodes: [...canvas.nodes, { id, ...fieldsOf(card), ...at, ...size }] }
}

export const withoutCard = (canvas: NoteCanvas, id: string): NoteCanvas => ({ nodes: canvas.nodes.filter(node => node.id !== id), edges: canvas.edges.filter(edge => edge.fromNode !== id && edge.toNode !== id) })

export const withoutLine = (canvas: NoteCanvas, id: string): NoteCanvas => ({ ...canvas, edges: canvas.edges.filter(edge => edge.id !== id) })

// Moves or resizes a card; resizing never makes it smaller than CANVAS_MIN_SIZE,
// and moving leaves a smaller card made in Obsidian the size it is.
export const withPlace = (canvas: NoteCanvas, id: string, place: Partial<Pick<CanvasNode, 'x' | 'y' | 'width' | 'height'>>): NoteCanvas => ({
  ...canvas,
  nodes: canvas.nodes.map(node =>
    node.id !== id
      ? node
      : {
          ...node,
          x: Math.round(place.x ?? node.x),
          y: Math.round(place.y ?? node.y),
          width: place.width === undefined ? node.width : Math.max(CANVAS_MIN_SIZE.width, Math.round(place.width)),
          height: place.height === undefined ? node.height : Math.max(CANVAS_MIN_SIZE.height, Math.round(place.height)),
        },
  ),
})

const centreOf = (node: CanvasNode): Point => ({ x: node.x + node.width / 2, y: node.y + node.height / 2 })

// The sides that face each other: across when the cards sit more side by side, up and down otherwise.
export const sidesOf = (from: CanvasNode, to: CanvasNode): [CanvasSide, CanvasSide] => {
  const [a, b] = [centreOf(from), centreOf(to)]
  const [dx, dy] = [b.x - a.x, b.y - a.y]
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? ['right', 'left'] : ['left', 'right']

  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom']
}

// One line from a card to another, drawn from facing sides, as Obsidian
// joins them; a line Queue-tea didn't make keeps the sides it was given. A
// card can't join itself, and two cards join once whichever way round.
// The same canvas back means nothing was added.
export const withLine = (canvas: NoteCanvas, id: string, fromId: string, toId: string): NoteCanvas => {
  const from = canvas.nodes.find(node => node.id === fromId)
  const to = canvas.nodes.find(node => node.id === toId)
  const isJoined = canvas.edges.some(edge => (edge.fromNode === fromId && edge.toNode === toId) || (edge.fromNode === toId && edge.toNode === fromId))
  if (from === undefined || to === undefined || fromId === toId || isJoined) return canvas
  const [fromSide, toSide] = sidesOf(from, to)

  return { ...canvas, edges: [...canvas.edges, { id, fromNode: fromId, fromSide, toNode: toId, toSide }] }
}

const OUT: Record<CanvasSide, Point> = { top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 } }
const sideOf = (value: unknown): CanvasSide | null => CANVAS_SIDES.find(side => side === value) ?? null
const anchorOf = (node: CanvasNode, side: CanvasSide): Point => ({ x: node.x + (node.width * (OUT[side].x + 1)) / 2, y: node.y + (node.height * (OUT[side].y + 1)) / 2 })

// A line's curve, as an SVG path, bowing out of each card's side; mid is
// where its remove button sits. Arrow ends follow the format: the far end
// has one unless toEnd is none, the near end only when fromEnd is arrow.
export type LinePath = { d: string; mid: Point; isArrowTo: boolean; isArrowFrom: boolean }
export const linePathOf = (from: CanvasNode, to: CanvasNode, edge: CanvasEdge): LinePath => {
  const facing = sidesOf(from, to)
  const [fromSide, toSide] = [sideOf(edge.fromSide) ?? facing[0], sideOf(edge.toSide) ?? facing[1]]
  const [a, b] = [anchorOf(from, fromSide), anchorOf(to, toSide)]
  const bow = Math.min(CANVAS_CURVE_PX, Math.hypot(b.x - a.x, b.y - a.y) / 2)
  const [c1, c2] = [{ x: a.x + OUT[fromSide].x * bow, y: a.y + OUT[fromSide].y * bow }, { x: b.x + OUT[toSide].x * bow, y: b.y + OUT[toSide].y * bow }]
  // The curve's halfway point: a cubic Bézier at t = 0.5.
  const mid = { x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8 }

  return { d: `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`, mid, isArrowTo: edge.toEnd !== 'none', isArrowFrom: edge.fromEnd === 'arrow' }
}

// The box round every card, or null for an empty board.
export const boundsOf = (nodes: readonly CanvasNode[]): { left: number; top: number; right: number; bottom: number } | null =>
  nodes.length === 0
    ? null
    : nodes.reduce((box, node) => ({ left: Math.min(box.left, node.x), top: Math.min(box.top, node.y), right: Math.max(box.right, node.x + node.width), bottom: Math.max(box.bottom, node.y + node.height) }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity })
