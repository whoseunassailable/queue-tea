import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { TasksDeps } from '../../tasks/api/scope'

// Counts what the reader opens and checks, so a test can see a refresh that does needless work.
const counts = vi.hoisted(() => ({ open: 0, stat: 0 }))
vi.mock('node:fs/promises', async importOriginal => {
  const fs = await importOriginal<typeof import('node:fs/promises')>()
  return { ...fs, open: (...args: Parameters<typeof fs.open>) => { counts.open += 1; return fs.open(...args) }, stat: (...args: Parameters<typeof fs.stat>) => { counts.stat += 1; return fs.stat(...args) } }
})
const { readCodexSession } = await import('./codex_source')

const row = (type: string, payload: Record<string, unknown>, ms: number) => JSON.stringify({ timestamp: new Date(ms).toISOString(), type, payload })
let home: string
let now: number
// When the task started: fixed, as a real task's start is.
let since: number
const deps = () => ({ home, now: () => now }) as TasksDeps
// More sessions than the old 128-entry cache held, as a busy Codex user has.
const SESSIONS = 150

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-codex-'))
  now = Date.now()
  since = now - 1
  const folder = join(home, '.codex/sessions/2026/11/06')
  await mkdir(folder, { recursive: true })
  for (let i = 0; i < SESSIONS; i++) {
    const cwd = i === 0 ? '/task-a' : `/other-${i}`
    await writeFile(join(folder, `rollout-${i}.jsonl`), `${row('session_meta', { cwd }, now)}\n${row('event_msg', { type: 'task_started' }, now)}\n`)
  }
  counts.open = 0
  counts.stat = 0
})
afterEach(() => rm(home, { recursive: true, force: true }))

it('reads nothing again on a refresh where no session grew', async () => {
  expect((await readCodexSession(deps(), '/task-a', since)).state).toBe('working')
  now += 1_500
  counts.open = 0

  expect((await readCodexSession(deps(), '/task-a', since)).state).toBe('working')

  expect(counts.open).toBe(0)
})

it('checks each session once per refresh, however many tasks ask', async () => {
  for (const folder of ['/task-a', '/other-1', '/other-2', '/other-3']) await readCodexSession(deps(), folder, since)

  // Once in the listing, plus each task's own session checked again for fresh output.
  expect(counts.stat).toBeLessThanOrEqual(SESSIONS + 4)
})

it("still follows a task's session that grows after the folder was last listed", async () => {
  await readCodexSession(deps(), '/task-a', since)
  const { appendFile } = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  await appendFile(join(home, '.codex/sessions/2026/11/06/rollout-0.jsonl'), `${row('event_msg', { type: 'task_complete' }, now)}\n`)
  now += 1_500

  expect((await readCodexSession(deps(), '/task-a', since)).state).toBe('review')
})
