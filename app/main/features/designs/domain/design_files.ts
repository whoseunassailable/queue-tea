import { isDesignId, isHex, LIMITS } from '../../../../shared/designs'
import { MESSAGES } from '../../../core/messages'
import type { Author, DesignComment, NextVersion, Scene } from '../../../../shared/designs'

// What a version.json holds. rest is every field this version of the app
// doesn't know, written back as it was read.
export type VersionFile = { format: number; label: string; made: string | null; by: Author | null; from: string | null; designs: string[]; next: NextVersion | null; [field: string]: unknown }
export type CommentsFile = { format: number; comments: DesignComment[]; [field: string]: unknown }
export type Parsed<T> = { ok: true; value: T } | { ok: false; detail: string }

type Json = Record<string, unknown>

const F = MESSAGES.designFaults

const isObject = (value: unknown): value is Json => typeof value === 'object' && value !== null && !Array.isArray(value)
const isNumberIn = (value: unknown, low: number, high: number): value is number => typeof value === 'number' && Number.isFinite(value) && value >= low && value <= high
const isText = (value: unknown, most: number): value is string => typeof value === 'string' && value.trim() !== '' && value.length <= most

// Where JSON.parse stopped, as a line: newer engines say it, older ones give
// the position, and an unexpected token comes with only the text round it.
export const lineOf = (text: string, message: string): number | null => {
  // V8 quotes 10 characters either side of the token, with ... where it cut;
  // checked first, since the quoted text could itself say "line 5".
  const near = /, (\.\.\.)?"([\s\S]*)"(\.\.\.)? is not valid JSON$/.exec(message)
  if (near !== null) {
    const [, cutBefore, quoted = '', cutAfter] = near
    // The whole text quoted, which V8 does under 21 characters, says nothing of where.
    if (cutBefore === undefined && cutAfter === undefined) return null
    // shortcut: takes the first place the quoted text appears; a 20-character run repeated before the mistake would name an earlier line.
    const start = text.indexOf(quoted)
    if (start === -1) return null

    return text.slice(0, cutBefore === undefined ? quoted.length - 10 : start + 10).split('\n').length
  }
  const said = /line (\d+)/.exec(message)
  if (said !== null) return Number(said[1])
  const at = /position (\d+)/.exec(message)

  return at === null ? null : text.slice(0, Number(at[1])).split('\n').length
}

export const parseJson = (text: string): Parsed<unknown> => {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (err) {
    // The parser's own words never reach the window; only the line does.
    const line = lineOf(text, err instanceof Error ? err.message : '')

    return { ok: false, detail: line === null ? F.unplacedMistake : F.mistakeNear(line) }
  }
}

const fault = F.noUsable

// The first thing wrong with one layer and what it holds, or null.
const layerFault = (value: unknown, ids: Set<string>, depth: number, count: { n: number }): string | null => {
  if (!isObject(value)) return F.notALayer
  count.n += 1
  if (count.n > LIMITS.layers) return F.tooManyLayers(LIMITS.layers)
  if (depth > LIMITS.depth) return F.tooDeep(LIMITS.depth)
  if (!isText(value.id, 100)) return F.layerNoId
  const where = F.theLayer(typeof value.name === 'string' && value.name !== '' ? value.name : value.id)
  if (ids.has(value.id)) return F.sharedId(where)
  ids.add(value.id)
  if (typeof value.type !== 'string') return fault(where, 'type')
  if (typeof value.name !== 'string') return fault(where, 'name')
  if (!isNumberIn(value.x, -LIMITS.place, LIMITS.place)) return fault(where, 'x')
  if (!isNumberIn(value.y, -LIMITS.place, LIMITS.place)) return fault(where, 'y')
  if (!isNumberIn(value.width, 0, LIMITS.size)) return fault(where, 'width')
  if (value.height !== undefined && !isNumberIn(value.height, 0, LIMITS.size)) return fault(where, 'height')
  if (value.type === 'text') {
    if (typeof value.text !== 'string') return fault(where, 'text')
    if (typeof value.font !== 'string') return fault(where, 'font')
    if (!isNumberIn(value.size, 1, LIMITS.fontSize)) return fault(where, 'size')
    if (!isNumberIn(value.weight, 100, 900)) return fault(where, 'weight')
    if (!isHex(value.color)) return fault(where, 'color')
    if (value.align !== undefined && !['left', 'center', 'right'].includes(value.align as string)) return fault(where, 'align')
  }
  if (value.type === 'frame') {
    if (!isNumberIn(value.height, 0, LIMITS.size)) return fault(where, 'height')
    if (value.fill !== undefined && !isHex(value.fill)) return fault(where, 'fill')
    if (value.radius !== undefined && !isNumberIn(value.radius, 0, LIMITS.radius)) return fault(where, 'radius')
    if (value.stroke !== undefined && !(isObject(value.stroke) && isHex(value.stroke.color) && isNumberIn(value.stroke.width, 0, 100))) return fault(where, 'stroke')
    if (value.children !== undefined) {
      if (!Array.isArray(value.children)) return fault(where, 'children')
      for (const child of value.children) {
        const wrong = layerFault(child, ids, depth + 1, count)
        if (wrong !== null) return wrong
      }
    }
  }

  return null
}

// A design as read from disk or sent by the window, checked the same way.
export const checkScene = (value: unknown): Parsed<Scene> => {
  if (!isObject(value)) return { ok: false, detail: F.notADesign }
  if (!isNumberIn(value.format, 1, 1)) return { ok: false, detail: F.unknownFormat }
  if (!isText(value.name, LIMITS.title)) return { ok: false, detail: fault(F.theDesign, 'name') }
  if (!isNumberIn(value.width, 1, LIMITS.size)) return { ok: false, detail: fault(F.theDesign, 'width') }
  if (!isNumberIn(value.height, 1, LIMITS.size)) return { ok: false, detail: fault(F.theDesign, 'height') }
  if (!isHex(value.fill)) return { ok: false, detail: fault(F.theDesign, 'fill') }
  if (!Array.isArray(value.nodes)) return { ok: false, detail: fault(F.theDesign, 'layers') }
  const ids = new Set<string>()
  const count = { n: 0 }
  for (const layer of value.nodes) {
    const wrong = layerFault(layer, ids, 1, count)
    if (wrong !== null) return { ok: false, detail: wrong }
  }

  return { ok: true, value: value as Scene }
}

const then = <T>(text: string, check: (value: unknown) => Parsed<T>): Parsed<T> => {
  const parsed = parseJson(text)

  return parsed.ok ? check(parsed.value) : parsed
}

export const parseScene = (text: string): Parsed<Scene> => then(text, checkScene)

const nextOf = (value: unknown): NextVersion | null | undefined => {
  if (value === undefined || value === null) return null

  return isObject(value) && isText(value.label, LIMITS.label) && isText(value.quest, LIMITS.title) ? { label: value.label, quest: value.quest } : undefined
}

export const parseVersion = (text: string): Parsed<VersionFile> =>
  then(text, value => {
    if (!isObject(value)) return { ok: false, detail: F.notAVersion }
    if (!isNumberIn(value.format, 1, 1)) return { ok: false, detail: F.unknownFormat }
    if (!isText(value.label, LIMITS.label)) return { ok: false, detail: fault(F.theVersion, 'label') }
    if (value.designs !== undefined && !(Array.isArray(value.designs) && value.designs.every(isDesignId))) return { ok: false, detail: fault(F.theVersion, 'list of designs') }
    const next = nextOf(value.next)
    if (next === undefined) return { ok: false, detail: fault(F.theVersion, 'next version') }

    return {
      ok: true,
      value: {
        ...value,
        format: value.format,
        label: value.label,
        made: typeof value.made === 'string' ? value.made : null,
        by: value.by === 'claude' || value.by === 'you' ? value.by : null,
        from: typeof value.from === 'string' ? value.from : null,
        designs: (value.designs as string[] | undefined) ?? [],
        next,
      },
    }
  })

const isComment = (value: unknown): value is DesignComment =>
  isObject(value) &&
  isText(value.id, 100) &&
  isDesignId(value.design) &&
  (value.on === null || typeof value.on === 'string') &&
  typeof value.text === 'string' &&
  typeof value.by === 'string' &&
  typeof value.at === 'string' &&
  (value.resolved === null || typeof value.resolved === 'string') &&
  (value.sentTo === null || typeof value.sentTo === 'string')

export const parseComments = (text: string): Parsed<CommentsFile> =>
  then(text, value => {
    if (!isObject(value) || !Array.isArray(value.comments)) return { ok: false, detail: F.notComments }
    if (!value.comments.every(isComment)) return { ok: false, detail: F.commentMissing }

    return { ok: true, value: { ...value, format: typeof value.format === 'number' ? value.format : 1, comments: value.comments } }
  })

