// A realm's canvas: one board of cards and lines, kept as Obsidian's open
// JSON Canvas format (jsoncanvas.org) beside the notes, so it opens there too.
// docs/notes.md has the cards Queue-tea makes.
export const NOTE_CANVAS = 'Canvas.canvas'
export const CANVAS_LIMITS = { nodes: 1000, edges: 3000, text: 100_000, id: 64, extras: 20, coordinate: 10_000_000, bytes: 5_000_000 } as const

// A field the format may hold beyond the ones Queue-tea reads: Obsidian's
// colour, a group's label, a line's ends. Kept as they came.
export type CanvasValue = string | number | boolean
// type is text, file, link or group in Obsidian today. A note card is a file
// card naming the note's file, an image a file card naming the attachment, a
// web page a link card, and a quest a text card holding only its quest link.
export type CanvasNode = { id: string; type: string; x: number; y: number; width: number; height: number; text?: string; file?: string; url?: string; [field: string]: CanvasValue | undefined }
export type CanvasSide = 'top' | 'right' | 'bottom' | 'left'
// fromSide and toSide, when set, are one of CANVAS_SIDES in a file Obsidian wrote.
export type CanvasEdge = { id: string; fromNode: string; toNode: string; [field: string]: CanvasValue | undefined }
export type NoteCanvas = { nodes: CanvasNode[]; edges: CanvasEdge[] }
// stamp is the file as it was read; null when there is no file yet.
export type CanvasView = { canvas: NoteCanvas; stamp: string | null }
// changed: the file isn't the one the board read, and nothing was written.
export type CanvasSave = { kind: 'saved'; stamp: string } | { kind: 'changed'; view: CanvasView }

export const CANVAS_SIDES: readonly CanvasSide[] = ['top', 'right', 'bottom', 'left']
