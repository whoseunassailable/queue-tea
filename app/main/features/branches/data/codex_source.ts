import { open, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { StringDecoder } from 'node:string_decoder'
import type { TasksDeps } from '../../tasks/api/scope'
import { CodexEvents } from './codex_events'
import type { CodexObservation } from './codex_events'

const READ_CHUNK = 256_000
const DISCOVER_MS = 1_000
// shortcut: remembers where it stopped in up to 4,096 sessions; past that the oldest are read again from the start. Raise it if Codex keeps more.
const MAX_SESSIONS = 4_096
type Session = { path: string; mtimeMs: number; size: number }
const catalog = new Map<string, { at: number; files: Session[] }>()
const cache = new Map<string, { offset: number; pending: string; decoder: StringDecoder; cwd: string | null; events: CodexEvents }>()
// Discover by modification time, never by session start date: an old session
// resumed today belongs in today's activity too. Read only appended bytes.
export const readCodexSession = async (d: TasksDeps, folder: string, since: number): Promise<CodexObservation> => {
  const root = join(d.home, '.codex/sessions'); const now = d.now()
  let list = catalog.get(root)
  if (!list || now - list.at > DISCOVER_MS) {
    try {
      const entries = await readdir(root, { recursive: true, withFileTypes: true })
      const paths = entries.filter(e => e.isFile() && e.name.endsWith('.jsonl')).map(e => join(e.parentPath, e.name))
      // One listing a second serves every task, so each session is checked once, not once per task.
      const files = await Promise.all(paths.map(path => stat(path).then(info => ({ path, mtimeMs: info.mtimeMs, size: info.size }), err => {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null // Deleted since the listing: nothing left to read.
        throw err
      })))
      list = { at: now, files: files.filter((file): file is Session => file !== null) }
      catalog.set(root, list)
    } catch (err) { if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { state: 'unobserved', seenAt: null, steps: [] }; throw err }
  }
  const observations: CodexObservation[] = []
  for (const { path: file, mtimeMs, size: listed } of list.files) {
    if (mtimeMs < since) continue
    let reader = cache.get(file)
    // This task's own sessions are checked again, so what they wrote since the listing shows at once.
    let size = listed
    if (reader?.cwd === folder) {
      try { size = (await stat(file)).size } catch (err) { if ((err as NodeJS.ErrnoException).code === 'ENOENT') continue; throw err }
    }
    if (!reader || reader.offset > size) {
      reader = { offset: 0, pending: '', decoder: new StringDecoder('utf8'), cwd: null, events: new CodexEvents(0) }
      if (cache.size >= MAX_SESSIONS) cache.delete(cache.keys().next().value!)
      cache.set(file, reader)
    }
    // Another task's session is read when that task asks, from where it stopped.
    if ((reader.cwd !== null && reader.cwd !== folder) || reader.offset >= size) {
      if (reader.cwd === folder) observations.push(reader.events.snapshot(now, since))
      continue
    }
    const handle = await open(file, 'r')
    try {
      while (reader.offset < size) {
        const buffer = Buffer.alloc(Math.min(READ_CHUNK, size - reader.offset))
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
        if (reader.cwd !== null && reader.cwd !== folder) break
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
