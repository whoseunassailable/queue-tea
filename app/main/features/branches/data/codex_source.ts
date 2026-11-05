import { open, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { StringDecoder } from 'node:string_decoder'
import type { TasksDeps } from '../../tasks/api/scope'
import { CodexEvents } from './codex_events'
import type { CodexObservation } from './codex_events'

const READ_CHUNK = 256_000
const DISCOVER_MS = 1_000
const catalog = new Map<string, { at: number; files: string[] }>()
const cache = new Map<string, { offset: number; pending: string; decoder: StringDecoder; cwd: string | null; events: CodexEvents }>()
// Discover by modification time, never by session start date: an old session
// resumed today belongs in today's activity too. Read only appended bytes.
export const readCodexSession = async (d: TasksDeps, folder: string, since: number): Promise<CodexObservation> => {
  const root = join(d.home, '.codex/sessions'); const now = d.now()
  let list = catalog.get(root)
  if (!list || now - list.at > DISCOVER_MS) {
    try {
      const entries = await readdir(root, { recursive: true, withFileTypes: true })
      list = { at: now, files: entries.filter(e => e.isFile() && e.name.endsWith('.jsonl')).map(e => join(e.parentPath, e.name)) }
      catalog.set(root, list)
    } catch (err) { if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { state: 'unobserved', seenAt: null, steps: [] }; throw err }
  }
  const observations: CodexObservation[] = []
  for (const file of list.files) {
    const info = await stat(file)
    if (info.mtimeMs < since) continue
    let reader = cache.get(file)
    if (!reader || reader.offset > info.size) {
      reader = { offset: 0, pending: '', decoder: new StringDecoder('utf8'), cwd: null, events: new CodexEvents(0) }
      if (cache.size >= 128) cache.delete(cache.keys().next().value!)
      cache.set(file, reader)
    }
    const handle = await open(file, 'r')
    try {
      while (reader.offset < info.size) {
        const buffer = Buffer.alloc(Math.min(READ_CHUNK, info.size - reader.offset))
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, reader.offset)
        if (!bytesRead) break
        reader.offset += bytesRead
        const lines = (reader.pending + reader.decoder.write(buffer.subarray(0, bytesRead))).split('\n')
        reader.pending = lines.pop() ?? ''
        for (const line of lines) {
          if (!reader.cwd) {
            try { const row = JSON.parse(line) as { type?: string; payload?: { cwd?: string } }; if (row.type === 'session_meta') reader.cwd = row.payload?.cwd ?? null } catch { continue /* Incomplete metadata is not a task association. */ }
          }
          reader.events.accept(line)
        }
      }
    } finally { await handle.close() }
    if (reader.cwd === folder) observations.push(reader.events.snapshot(now, since))
  }
  observations.sort((a, b) => (b.seenAt ?? 0) - (a.seenAt ?? 0))
  const latest = observations[0] ?? { state: 'unobserved' as const, seenAt: null, steps: [] }
  // Several sessions can contribute history. An executing older session still
  // blocks merging even when a newer, idle session wrote the latest message.
  return { ...latest, state: observations.some(o => o.state === 'working') ? 'working' : latest.state, steps: observations.flatMap(o => o.steps).sort((a, b) => Date.parse(a.at) - Date.parse(b.at)).slice(-200) }
}
