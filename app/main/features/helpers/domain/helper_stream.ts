import { HELPER_ORDER_CHARS } from '../../../../shared/engine_api'
import type { HelperDoing } from '../../../../shared/engine_api'

export const HELPER_LIMITS = { orderChars: HELPER_ORDER_CHARS, runMinutes: 30, targetChars: 80, lineChars: 4_000_000 } as const

// What one line of Claude Code's stream-json means for the helper's card.
export type Seen = { kind: 'doing'; doing: HelperDoing } | { kind: 'done'; reply: string } | { kind: 'failed'; detail: string } | { kind: 'missing' }

type Block = { type?: unknown; name?: unknown; input?: unknown }
type StreamEvent = { type?: unknown; subtype?: unknown; agents?: unknown; is_error?: unknown; result?: unknown; message?: { content?: unknown } }

const clip = (text: unknown): string | null => {
  if (typeof text !== 'string' || text.trim() === '') return null
  const line = text.trim().split('\n')[0]!

  return line.length > HELPER_LIMITS.targetChars ? `${line.slice(0, HELPER_LIMITS.targetChars - 1)}…` : line
}

const fileOf = (path: unknown): string | null => (typeof path === 'string' ? (path.split('/').filter(Boolean).pop() ?? null) : null)

const siteOf = (url: unknown): string | null => {
  try {
    return typeof url === 'string' ? new URL(url).host : null
  } catch {
    // Not a URL: the line just names no site.
    return null
  }
}

export const doingOf = (tool: string, input: Record<string, unknown>): HelperDoing => {
  if (tool === 'Read') return { kind: 'reading', target: fileOf(input.file_path) }
  if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit') return { kind: 'editing', target: fileOf(input.file_path ?? input.notebook_path) }
  if (tool === 'Write') return { kind: 'writing', target: fileOf(input.file_path) }
  // Claude's own description is already a sentence ("Run the tests"), so it stands alone.
  if (tool === 'Bash') return clip(input.description) !== null ? { kind: 'step', target: clip(input.description) } : { kind: 'running', target: clip(input.command) }
  if (tool === 'Grep' || tool === 'Glob') return { kind: 'searching', target: clip(input.pattern) }
  if (tool === 'WebFetch' || tool === 'WebSearch') return { kind: 'browsing', target: clip(input.query) ?? siteOf(input.url) }
  if (tool === 'Agent' || tool === 'Task') return { kind: 'asking', target: clip(input.subagent_type) }
  if (tool === 'Skill') return { kind: 'skill', target: clip(input.skill) }
  if (tool === 'TodoWrite') return { kind: 'planning', target: null }

  return { kind: 'working', target: tool }
}

const parse = (line: string): StreamEvent | null => {
  try {
    const event: unknown = JSON.parse(line)

    return typeof event === 'object' && event !== null ? (event as StreamEvent) : null
  } catch {
    // stream-json writes one event per line; anything else carries nothing for the card.
    return null
  }
}

export const seenIn = (line: string, agent: string): Seen | null => {
  const event = parse(line)
  if (event === null) return null
  if (event.type === 'system' && event.subtype === 'init') return Array.isArray(event.agents) && !event.agents.includes(agent) ? { kind: 'missing' } : null
  if (event.type === 'result') {
    const text = typeof event.result === 'string' ? event.result : ''

    return event.is_error === true || event.subtype !== 'success' ? { kind: 'failed', detail: text || String(event.subtype) } : { kind: 'done', reply: text }
  }
  if (event.type !== 'assistant' || !Array.isArray(event.message?.content)) return null
  const blocks = (event.message.content as unknown[]).filter((b): b is Block => typeof b === 'object' && b !== null)
  const tool = blocks.filter(b => b.type === 'tool_use' && typeof b.name === 'string').pop()
  if (tool !== undefined) return { kind: 'doing', doing: doingOf(tool.name as string, (tool.input ?? {}) as Record<string, unknown>) }

  return blocks.some(b => b.type === 'text' || b.type === 'thinking') ? { kind: 'doing', doing: { kind: 'thinking', target: null } } : null
}

// Output arrives in chunks that cut lines anywhere; this hands on whole lines.
export const lineReader = (onLine: (line: string) => void): ((chunk: string) => void) => {
  let rest = ''

  return chunk => {
    const lines = (rest + chunk).split('\n')
    rest = lines.pop() ?? ''
    // shortcut: a single line past the limit (a huge tool result) is dropped; the card never needs those.
    if (rest.length > HELPER_LIMITS.lineChars) rest = ''
    for (const line of lines) if (line.trim() !== '') onLine(line)
  }
}

// The order as the engine takes it, or the sentence that says why not.
export const orderOf = (input: unknown): { ok: true; order: string } | { ok: false; why: 'empty' | 'long' } => {
  const order = typeof input === 'string' ? input.trim() : ''
  if (order === '') return { ok: false, why: 'empty' }

  return order.length > HELPER_LIMITS.orderChars ? { ok: false, why: 'long' } : { ok: true, order }
}
