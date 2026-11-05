import type { TaskActivity } from '../../../../../types'
import { finishActivity, toolActivity } from '../../../../../hooks/shared/activity/domain/services/activity'
import { BRANCH_LIMITS } from '../domain/constants'

export type CodexObservation = { state: 'working' | 'review' | 'unobserved' | 'needsYou'; seenAt: number | null; steps: TaskActivity[] }
type Row = { timestamp?: string; type?: string; payload?: Record<string, unknown> }
const textOf = (value: unknown): string => typeof value === 'string' ? value : Array.isArray(value) ? value.map(v => typeof v?.text === 'string' ? v.text : '').join('\n') : JSON.stringify(value) ?? ''
const commandOf = (value: unknown) => typeof value === 'string' ? value : Array.isArray(value) ? value.length >= 3 && /^-(?:l?c|cl)$/.test(String(value[1])) ? String(value[2]) : value.join(' ') : null
const parse = (text: string): Record<string, unknown> | null => { try { const v: unknown = JSON.parse(text); return v && typeof v === 'object' ? v as Record<string, unknown> : null } catch { return null /* A partial tool result is not evidence yet. */ } }

// Native item events expose the actual nested commands/file changes, including
// exec batches. No JavaScript is evaluated and no success is inferred from prose.
export class CodexEvents {
  private steps = new Map<string, TaskActivity>()
  private calls = new Map<string, string>()
  private sessions = new Map<string, string>()
  private working = false
  private complete = false
  private needsYou = false
  private seenAt: number | null = null
  constructor(private since: number) {}
  accept(line: string) {
    const row = parse(line) as Row | null; const p = row?.payload
    const ms = Date.parse(row?.timestamp ?? '')
    if (!p || !Number.isFinite(ms) || ms < this.since || ms > Date.now() + 60_000) return
    this.seenAt = Math.max(this.seenAt ?? 0, ms)
    const at = new Date(ms).toISOString()
    if (row!.type === 'event_msg') {
      if (p.type === 'task_started') { this.working = true; this.complete = false; this.needsYou = false }
      if (p.type === 'task_complete' || p.type === 'turn_aborted') { this.working = false; this.complete = p.type === 'task_complete'; this.needsYou = false }
      if (['item_started', 'item_updated', 'item_completed'].includes(String(p.type))) this.item(p.item, at, p.type === 'item_completed', typeof p.started_at_ms === 'number' ? new Date(p.started_at_ms).toISOString() : at)
      this.trim()
      return
    }
    if (row!.type !== 'response_item') return
    if (p.type === 'message' && p.role === 'assistant' && (p.phase === 'final_answer' || p.channel === 'final')) { this.working = false; this.complete = true }
    const call = String(p.call_id ?? p.id ?? '')
    const name = String(p.name ?? '').split('.').at(-1)!
    if (p.type === 'function_call' || p.type === 'custom_tool_call') {
      this.working = true; this.complete = false; this.needsYou = false
      const input = typeof p.arguments === 'string' ? parse(p.arguments) : typeof p.input === 'string' ? parse(p.input) : null
      if (name === 'request_user_input' || name === 'request_user_input_async') { this.needsYou = true; this.working = false }
      if (name === 'write_stdin' && input) { const original = this.sessions.get(String(input.session_id)); if (original) this.calls.set(call, original) }
      const cmd = input && commandOf(input.cmd ?? input.command)
      const step = cmd ? toolActivity('Bash', { command: cmd }, `codex-${call}`, at) : null
      if (step) { this.steps.set(step.id, step); this.calls.set(call, step.id) }
      if (name === 'apply_patch' && typeof p.input === 'string') this.patch(p.input, `codex-${call}`, at, false)
      if (input && ['read_file', 'Read', 'read', 'write_file', 'Write', 'edit_file', 'Edit'].includes(name)) {
        const file = input.file_path ?? input.path
        const tool = /write/i.test(name) ? 'Write' : /edit/i.test(name) ? 'Edit' : 'Read'
        const entry = toolActivity(tool, { file_path: file }, `codex-${call}`, at)
        if (entry) { this.steps.set(entry.id, entry); this.calls.set(call, entry.id) }
      }
    }
    if (p.type === 'function_call_output' || p.type === 'custom_tool_call_output') {
      const output = textOf(p.output)
      const id = this.calls.get(call); const entry = id ? this.steps.get(id) : null
      if (entry) this.result(entry, output, at)
      for (const step of this.steps.values()) if (step.id.startsWith(`codex-${call}:`) && step.status === 'running') this.steps.set(step.id, finishActivity(step, { isError: p.isError === true || /^(?:error|failed)/i.test(output) }, at))
      // Function exec exposes nested results as JSON text blocks. Native item
      // events carry their identities; preserve output until those events arrive.
    }
    this.trim()
  }
  private trim() {
    while (this.steps.size > 200) this.steps.delete(this.steps.keys().next().value!)
    if (this.calls.size > 400) for (const [key, id] of this.calls) if (!this.steps.has(id)) this.calls.delete(key)
    if (this.sessions.size > 400) for (const [key, id] of this.sessions) if (!this.steps.has(id)) this.sessions.delete(key)
  }
  private result(entry: TaskActivity, output: string, at: string) {
    const structured = parse(output)
    if (entry.kind !== 'command' && entry.kind !== 'test') { this.steps.set(entry.id, finishActivity(entry, { isError: structured?.isError === true }, at)); return }
    const exit = structured?.exit_code ?? structured?.exitCode
    const code = typeof exit === 'number' ? exit : Number(/(?:Process exited with code|Exit code:)\s*(-?\d+)/.exec(output)?.[1] ?? NaN)
    const session = structured?.session_id ?? /(?:session ID|session_id["': ]+)\s*([\w-]+)/.exec(output)?.[1]
    if (session !== undefined && session !== null) this.sessions.set(String(session), entry.id)
    const combined = typeof structured?.output === 'string' ? structured.output : output
    this.steps.set(entry.id, Number.isFinite(code) ? finishActivity(entry, { result: { stdout: combined, exitCode: code } }, at) : { ...entry, output: combined.slice(-BRANCH_LIMITS.output), truncated: combined.length > BRANCH_LIMITS.output })
  }
  private patch(text: string, id: string, at: string, finished: boolean) {
    for (const match of text.matchAll(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm)) {
      const file = match[1]!
      this.steps.set(`${id}:${file}`, { id: `${id}:${file}`, at, finished: finished ? at : null, kind: 'edit', subject: file, status: finished ? 'succeeded' : 'running', output: '', truncated: false })
    }
  }
  private item(value: unknown, at: string, completed: boolean, startedAt: string) {
    if (!value || typeof value !== 'object') return
    const item = value as Record<string, unknown>; const id = String(item.id ?? '')
    if (!id) return
    const type = String(item.type).toLowerCase().replace(/_/g, '')
    if (type === 'commandexecution') {
      const command = commandOf(item.command); if (!command) return
      const previous = [...this.steps.values()].find(s => !s.id.startsWith('codex-item-') && s.subject === command && s.status === 'running')
      const sessionKey = String(item.process_id ?? '')
      const stable = this.sessions.get(sessionKey) ?? previous?.id ?? `codex-item-${id}`
      const entry = this.steps.get(stable) ?? toolActivity('Bash', { command }, stable, startedAt)!
      if (sessionKey) this.sessions.set(sessionKey, stable)
      const output = textOf(item.aggregated_output ?? item.output ?? '')
      const code = item.exit_code
      const done = completed && typeof code === 'number'
      this.steps.set(stable, done ? finishActivity(entry, { result: { stdout: output, exitCode: code } }, at) : { ...entry, output: output.slice(-BRANCH_LIMITS.output), truncated: output.length > BRANCH_LIMITS.output })
    }
    if (type === 'filechange') {
      const changes = item.changes && typeof item.changes === 'object' ? item.changes as Record<string, { type?: string }> : {}
      for (const [file, change] of Object.entries(changes)) {
        const pending = [...this.steps.values()].find(s => s.kind === 'edit' && s.subject === file && s.status === 'running')
        const stable = pending?.id ?? `codex-file-${id}:${file}`
        const status = ['failed', 'declined'].includes(String(item.status).toLowerCase()) ? 'failed' : completed ? 'succeeded' : 'running'
        this.steps.set(stable, { id: stable, at: pending?.at ?? at, finished: completed ? at : null, kind: change.type === 'add' ? 'write' : 'edit', status, subject: file, output: '', truncated: false })
      }
    }
    if (type === 'agentmessage' && item.phase === 'final_answer') { this.working = false; this.complete = true }
  }
  snapshot(now: number, since = this.since): CodexObservation {
    if ((this.seenAt ?? 0) < since) return { state: 'unobserved', seenAt: null, steps: [] }
    return { state: this.needsYou ? 'needsYou' : this.complete ? 'review' : this.working && this.seenAt !== null && now - this.seenAt < BRANCH_LIMITS.recentMs ? 'working' : 'unobserved', seenAt: this.seenAt, steps: [...this.steps.values()].filter(s => Date.parse(s.at) >= since && Date.parse(s.at) <= now).slice(-200) }
  }
}
export const codexEvents = (text: string, since: number, now: number): CodexObservation => {
  const reader = new CodexEvents(since)
  for (const line of text.split('\n')) reader.accept(line)
  return reader.snapshot(now)
}
