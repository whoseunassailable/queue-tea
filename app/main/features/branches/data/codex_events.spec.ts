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
it('observes a nested command and its later background result as one step, keeping no output', () => {
  const start = row('event_msg', { type: 'task_started' })
  const cmd = { type: 'CommandExecution', id: 'native-1', command: ['/bin/zsh', '-lc', 'npm test'], process_id: '42', exit_code: null, status: 'in_progress', aggregated_output: 'START' }
  const first = row('event_msg', { type: 'item_completed', item: cmd })
  const running = codexEvents(start + '\n' + first, now - 1, now).step
  expect(running).toMatchObject({ status: 'running', subject: 'npm test' })
  expect(running).not.toHaveProperty('output')
  const end = row('event_msg', { type: 'item_completed', item: { ...cmd, id: 'native-poll', aggregated_output: 'START\nFAIL', exit_code: 1, status: 'completed' } })
  const final = codexEvents([start, first, end].join('\n'), now - 1, now)
  expect(final.step).toMatchObject({ id: running!.id, kind: 'test', subject: 'npm test', status: 'failed' })
  expect(JSON.stringify(final)).not.toContain('FAIL')
})
it('records native additions, edits and deletions without copying file contents', () => {
  const change = (changes: Record<string, unknown>) => codexEvents(row('event_msg', { type: 'item_completed', item: { type: 'FileChange', id: 'patch', status: 'completed', changes } }), now - 1, now)
  expect(change({ 'a.ts': { type: 'add', content: 'secret' } }).step).toEqual({ id: 'codex-file-patch:a.ts', at: new Date(now).toISOString(), finished: new Date(now).toISOString(), kind: 'write', status: 'succeeded', subject: 'a.ts' })
  expect(change({ 'b.ts': { type: 'update' } }).step).toMatchObject({ kind: 'edit', subject: 'b.ts', status: 'succeeded' })
  const all = change({ 'a.ts': { type: 'add', content: 'secret' }, 'b.ts': { type: 'update' }, 'c.ts': { type: 'delete' } })
  expect(all.step).toMatchObject({ kind: 'edit', subject: 'c.ts', status: 'succeeded' })
  expect(JSON.stringify(all)).not.toContain('secret')
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
  const commands = [row('event_msg', { type: 'item_completed', item: { ...item, id: 'a', process_id: '10' } }), row('event_msg', { type: 'item_completed', item: { ...item, id: 'b', process_id: '20' } }), row('event_msg', { type: 'item_completed', item: { ...item, id: 'c', process_id: '10', exit_code: 0 } })]
  // The end of the command on process 10 leaves the one on process 20 running.
  expect(codexEvents(commands.join('\n'), now - 1, now).step).toMatchObject({ id: 'codex-item-b', kind: 'test', status: 'running' })
  const failed = row('event_msg', { type: 'item_completed', item: { type: 'FileChange', id: 'bad', status: 'Failed', changes: { 'a.ts': { type: 'update' } } } })
  expect(codexEvents([...commands, failed].join('\n'), now - 1, now).step).toMatchObject({ subject: 'a.ts', status: 'failed' })
})
it('a long native session shows its last step', () => {
  const input = Array.from({ length: 350 }, (_, i) => row('event_msg', { type: 'item_completed', item: { type: 'CommandExecution', id: `command-${i}`, command: ['echo', String(i)], exit_code: 0, aggregated_output: '' } }, now - 350 + i)).join('\n')
  expect(codexEvents(input, now - 1000, now).step).toMatchObject({ subject: 'echo 349', status: 'succeeded' })
})
