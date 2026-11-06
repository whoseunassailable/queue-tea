// A realm's designs, as main reads them from <realm>/docs/designs/ and the
// window shows and edits them. docs/design-tab.md has the file format.

export const DESIGNS_FOLDER = 'docs/designs'
export const DESIGN_FORMAT = 1
export const LIMITS = { label: 40, comment: 2000, title: 200, size: 10_000, place: 10_000, radius: 1000, fontSize: 400, layers: 2000, depth: 20, bytes: 2 * 1024 * 1024 } as const

// A layer keeps every field it was read with; the editor changes only these.
export type Layer = { id: string; type: string; name: string; x: number; y: number; width: number; height?: number; [field: string]: unknown }
export type FrameLayer = Layer & { type: 'frame'; height: number; fill?: string; radius?: number; stroke?: { color: string; width: number }; children?: Layer[] }
export type TextLayer = Layer & { type: 'text'; text: string; font: string; size: number; weight: number; color: string; align?: 'left' | 'center' | 'right' }
export type Scene = { format: number; name: string; width: number; height: number; fill: string; edited?: { by: Author; at: string }; nodes: Layer[]; [field: string]: unknown }
export type Author = 'claude' | 'you'

export const isFrame = (layer: Layer): layer is FrameLayer => layer.type === 'frame'
export const isText = (layer: Layer): layer is TextLayer => layer.type === 'text'
export const childrenOf = (layer: Layer): Layer[] => (isFrame(layer) && Array.isArray(layer.children) ? layer.children : [])

// Every layer, parents before children, in drawing order.
export const layersOf = (nodes: readonly Layer[]): Layer[] => nodes.flatMap(layer => [layer, ...layersOf(childrenOf(layer))])

// Problem: a file that doesn't read, in plain words, and when its last good
// copy was kept (null when there is none).
export type Problem = { file: string; detail: string; backupAt: number | null }

export type DesignComment = { id: string; design: string; on: string | null; text: string; by: string; at: string; resolved: string | null; sentTo: string | null }
// Open: not resolved, and not sent to a next version yet.
export const isOpen = (c: DesignComment) => c.resolved === null && c.sentTo === null
export type CommentInput = { design: string; on: string | null; text: string }
export type NextVersion = { label: string; quest: string }

export type VersionRow = {
  folder: string
  label: string
  made: string | null
  by: Author | null
  from: string | null
  designCount: number
  open: number
  resolved: number
  sent: number
  sentTo: string | null
  next: NextVersion | null
  problem: Problem | null
}
// coming: a next version filed as a quest that hasn't been drafted yet.
export type DesignsView = { versions: VersionRow[]; coming: (NextVersion & { from: string })[] }
// uncommitted: files in the version's folder git hasn't been given yet.
// commentsProblem: the comments file doesn't read, so comments can't be added.
export type VersionView = { folder: string; label: string; designs: string[]; comments: DesignComment[]; commentsProblem: Problem | null; uncommitted: number }
export type DesignRead = { kind: 'ready'; scene: Scene; stamp: string } | { kind: 'broken'; problem: Problem }
export type DesignSave = { kind: 'saved'; stamp: string; at: number } | { kind: 'changed' }

// A version's folder: its label, lower-cased, every run of other characters one -.
export const folderOf = (label: string): string =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 60)

export const isFolderName = (value: unknown): value is string => typeof value === 'string' && /^[a-z0-9]([a-z0-9.-]{0,58}[a-z0-9])?$/.test(value) && !value.includes('..')
export const isDesignId = (value: unknown): value is string => typeof value === 'string' && /^[a-z0-9]([a-z0-9-]{0,58}[a-z0-9])?$/.test(value)
export const isHex = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

// The label after this one: its last number plus one, or " 2" when it has
// none, skipping any already taken.
export const suggestLabel = (label: string, taken: readonly string[]): string => {
  const used = new Set(taken.map(folderOf))
  const match = /^(.*?)(\d+)(\D*)$/.exec(label)
  const at = (n: number) => (match === null ? `${label} ${n}` : `${match[1]}${n}${match[3]}`)
  let n = match === null ? 2 : Number(match[2]) + 1
  while (used.has(folderOf(at(n)))) n += 1

  return at(n)
}

// An id for a design or layer that isn't taken: the name in folder form, then -2, -3…
export const freeId = (name: string, taken: ReadonlySet<string>): string => {
  const base = folderOf(name).replace(/\./g, '-').slice(0, 55).replace(/-+$/, '') || 'layer'
  if (!taken.has(base)) return base
  let n = 2
  while (taken.has(`${base}-${n}`)) n += 1

  return `${base}-${n}`
}
