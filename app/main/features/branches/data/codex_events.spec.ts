import { mkdir, mkdtemp, writeFile, appendFile, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { codexEvents } from './codex_events'
import { readCodexSession } from './codex_source'
import { createLogger } from '../../../core/logger'
import type { TasksDeps } from '../../tasks/api/scope'
const now = Date.now()
const row = (type: string, payload: Record<string, unknown>, ms = now) => JSON.stringify({ timestamp: new Date(ms).toISOString(), type, payload })
it('observes nested command events, partial output and the later background result once', () => {
  const start = row('event_msg', { type: 'task_started' })
  const cmd = { type: 'CommandExecution', id: 'native-1', command: ['/bin/zsh', '-lc', 'npm test'], process_id: '42', exit_code: null, status: 'in_progress', aggregated_output: 'START' }
  const first = row('event_msg', { type: 'item_completed', item: cmd })
  expect(codexEvents(start + '\n' + first, now - 1, now).steps[0]).toMatchObject({ status: 'running', output: 'START' })
  const end = row('event_msg', { type: 'item_completed', item: { ...cmd, id: 'native-poll', aggregated_output: 'START\nFAIL', exit_code: 1, status: 'completed' } })
  const final = codexEvents([start, first, end].join('\n'), now - 1, now)
  expect(final.steps).toHaveLength(1)
  expect(final.steps[0]).toMatchObject({ kind: 'test', subject: 'npm test', status: 'failed', output: 'START\nFAIL' })
})
it('records native additions, edits and deletions without copying file contents', () => {
  const observed = codexEvents(row('event_msg', { type: 'item_completed', item: { type: 'FileChange', id: 'patch', status: 'completed', changes: { 'a.ts': { type: 'add', content: 'secret' }, 'b.ts': { type: 'update' }, 'c.ts': { type: 'delete' } } } }), now - 1, now)
  expect(observed.steps.map(s => [s.kind, s.subject, s.status, s.output])).toEqual([['write', 'a.ts', 'succeeded', ''], ['edit', 'b.ts', 'succeeded', ''], ['edit', 'c.ts', 'succeeded', '']])
})
it('stops pulsing for a question, completion, or stale evidence', () => {
  const start = row('event_msg', { type: 'task_started' })
  expect(codexEvents(start, now - 1, now).state).toBe('working')
  expect(codexEvents(start, now - 1, now + 100000).state).toBe('unobserved')
  expect(codexEvents(start + '\n' + row('response_item', { type: 'function_call', name: 'request_user_input', call_id: 'question', arguments: '{}' }), now - 1, now).state).toBe('needsYou')
  expect(codexEvents(start + '\n' + row('event_msg', { type: 'task_complete' }), now - 1, now).state).toBe('review')
})
it('finds a resumed old session and incrementally reads appended events for two different tasks', async () => {
  const home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-codex-observe-')))
  try {
    const dir = join(home, '.codex/sessions/2024/01/01'); await mkdir(dir, { recursive: true })
    const first = join(dir, 'old.jsonl'); const second = join(dir, 'other.jsonl')
    await writeFile(first, row('session_meta', { cwd: '/task-a' }) + '\n' + row('event_msg', { type: 'task_started' }) + '\n')
    await writeFile(second, row('session_meta', { cwd: '/task-b' }) + '\n' + row('event_msg', { type: 'task_started' }) + '\n')
    const d = { home, now: () => now, log: createLogger('dev', () => {}) } as TasksDeps
    expect((await readCodexSession(d, '/task-a', now - 1)).state).toBe('working')
    expect((await readCodexSession(d, '/task-b', now - 1)).state).toBe('working')
    await appendFile(first, row('event_msg', { type: 'task_complete' }) + '\n')
    expect((await readCodexSession(d, '/task-a', now - 1)).state).toBe('review')
  } finally { await rm(home, { recursive: true, force: true }) }
})

it('keeps identical concurrent commands separate and records failed file changes honestly', () => {
  const item = { type: 'CommandExecution', command: ['bash', '-lc', 'npm test'], exit_code: null, status: 'in_progress', aggregated_output: '' }
  const input = [row('event_msg', { type: 'item_completed', item: { ...item, id: 'a', process_id: '10' } }), row('event_msg', { type: 'item_completed', item: { ...item, id: 'b', process_id: '20' } }), row('event_msg', { type: 'item_completed', item: { ...item, id: 'c', process_id: '10', exit_code: 0 } }), row('event_msg', { type: 'item_completed', item: { type: 'FileChange', id: 'bad', status: 'Failed', changes: { 'a.ts': { type: 'update' } } } })].join('\n')
  const observed = codexEvents(input, now - 1, now)
  expect(observed.steps.filter(s => s.kind === 'test').map(s => s.status)).toEqual(['succeeded', 'running'])
  expect(observed.steps.find(s => s.subject === 'a.ts')?.status).toBe('failed')
})
it('bounds a long native session to recent steps', () => {
  const input = Array.from({ length: 350 }, (_, i) => row('event_msg', { type: 'item_completed', item: { type: 'CommandExecution', id: `command-${i}`, command: ['echo', String(i)], exit_code: 0, aggregated_output: '' } })).join('\n')
  const observed = codexEvents(input, now - 1, now)
  expect(observed.steps).toHaveLength(200)
  expect(observed.steps[0]!.subject).toBe('echo 150')
})
