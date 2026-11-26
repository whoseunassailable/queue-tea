import { expect, test } from 'claude-code/testing'

import { live } from '../../../hooks/core/session/live'
import { beginActivity, finishNotifiedActivity } from '../../../hooks/shared/activity/presentation/state_management/activity_controller'
import { emptyRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import type { ProjectRecord } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'

const setup = () => {
  const record = { ...emptyRecord('p', '/p'), tasks: [makeTask({ id: 'first', state: 'current' }), makeTask({ id: 'second' })] }
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(record) } })
  const fake = fakePorts(mem, { view: { record } })
  const saved = () => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord

  return { ...fake, mem, saved }
}

test('saves a started tool and how it ended to the same task across a task change, without its output', async () => {
  const { ports, view, mem, saved } = setup()
  live.ctx = CTX
  try {
    const finish = await beginActivity(ports, 'Bash', { command: 'npm test' })
    expect(saved().tasks[0]?.step?.status).toBe('running')
    const switched = { ...saved(), tasks: saved().tasks.map(t => ({ ...t, state: t.id === 'first' ? 'queued' as const : 'current' as const })) }
    mem.files.set(CTX.file, JSON.stringify(switched))
    view.record = switched
    await finish?.({ result: { stdout: '1 failed', exitCode: 1 } })
    expect(saved().tasks[0]?.step).toMatchObject({ kind: 'test', status: 'failed', subject: 'npm test' })
    expect(mem.files.get(CTX.file)).not.toContain('1 failed')
    expect(saved().tasks[1]?.step).toBeUndefined()
  } finally {
    live.ctx = null
  }
})

test('ignores unrelated tools, missing context, and tasks that are not current', async () => {
  const { ports, view, mem } = setup()
  live.ctx = null
  expect(await beginActivity(ports, 'Bash', { command: 'npm test' })).toBeNull()
  live.ctx = CTX
  try {
    expect(await beginActivity(ports, 'Unrelated', {})).toBeNull()
    view.record = emptyRecord('p', '/p')
    expect(await beginActivity(ports, 'Bash', { command: 'npm test' })).toBeNull()
    expect(mem.writes).toEqual([])
  } finally {
    live.ctx = null
  }
})

test('a recording failure is logged without stopping the tool', async () => {
  const { ports, mem, done } = setup()
  live.ctx = CTX
  const original = mem.host.write
  mem.host.write = async () => { throw new Error('disk unavailable') }
  try {
    expect(await beginActivity(ports, 'Bash', { command: 'npm test' })).toBeNull()
    expect(done.logs.some(line => line.includes('saving a started step failed'))).toBe(true)
  } finally {
    live.ctx = null
    mem.host.write = original
  }
})

test('a background check keeps waiting until its own task result is retrieved', async () => {
  const { ports, mem, saved } = setup()
  live.ctx = CTX
  try {
    const launched = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await launched?.({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } })
    expect(saved().tasks[0]?.step).toMatchObject({ status: 'running', backgroundId: 'bg-1' })
    expect(saved().tasks[0]?.waiting).toHaveLength(1)
    expect(await beginActivity(ports, 'GetTask', { taskId: 'other' })).toBeNull()
    const poll = await beginActivity(ports, 'GetTask', { taskId: 'bg-1' })
    await poll?.({ isError: true })
    expect(saved().tasks[0]?.step?.status).toBe('running')
    await poll?.({ result: { taskId: 'bg-1', status: 'completed', result: { isError: false, content: [{ type: 'text', text: '12 passed' }] } } })
    expect(saved().tasks[0]?.step).toMatchObject({ status: 'succeeded', subject: 'npm test' })
    expect(saved().tasks[0]?.waiting).toBeUndefined()
    expect(mem.files.get(CTX.file)).not.toContain('12 passed')
  } finally {
    live.ctx = null
  }
})

test('records each concurrent session only on the task in its own worktree', async () => {
  const { ports, view, mem, saved } = setup()
  const record = { ...saved(), version: 2 as const, tasks: [makeTask({ id: 'first', state: 'current', worktreePath: '/worktrees/first' }), makeTask({ id: 'second', state: 'current', worktreePath: '/worktrees/second' })] }
  mem.files.set(CTX.file, JSON.stringify(record))
  view.record = record
  live.ctx = { ...CTX, cwd: '/worktrees/second' }
  try {
    const finish = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await finish?.({ result: { stdout: 'passed', exitCode: 0 } })
    expect(saved().tasks[0]?.step).toBeUndefined()
    expect(saved().tasks[1]?.step).toMatchObject({ status: 'succeeded', subject: 'npm test' })
  } finally { live.ctx = null }
})

const notified = (id: string, status: string, summary: string) =>
  `<task-notification>\n<task-id>${id}</task-id>\n<status>${status}</status>\n<summary>${summary}</summary>\n</task-notification>`
const LATER = Date.parse('2026-10-21T07:22:00Z')

test('a notification ends the background check on the task it ran on, after a task change, with its span', async () => {
  const { ports, view, mem, saved } = setup()
  live.ctx = CTX
  try {
    const launched = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await launched?.({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } })
    const switched = { ...saved(), tasks: saved().tasks.map(t => ({ ...t, state: t.id === 'first' ? 'queued' as const : 'current' as const })) }
    mem.files.set(CTX.file, JSON.stringify(switched))
    view.record = switched
    ports.now = async () => LATER

    await finishNotifiedActivity(ports, notified('bg-1', 'failed', 'Background command "npm test" failed with exit code 1'))

    expect(saved().tasks[0]?.step).toMatchObject({ status: 'failed', finished: '2026-10-21T09:22:00+02:00' })
    expect(saved().tasks[0]?.waiting).toBeUndefined()
    expect(saved().tasks[0]?.testPeriods).toEqual([{ start: Date.parse('2026-10-21T07:12:00Z'), end: LATER }])
    expect(saved().tasks[1]?.step).toBeUndefined()
  } finally {
    live.ctx = null
  }
})

test('a notification that ends no running step writes nothing', async () => {
  const { ports, mem, saved } = setup()
  live.ctx = CTX
  try {
    const launched = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await launched?.({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } })
    const writes = mem.writes.length

    for (const text of ['hello', notified('bg-9', 'completed', 'exit code 0'), notified('bg-1', 'running', 'still going'), '<task-notification>\n<task-id>bg-1</task-id>\n<event>line</event>\n</task-notification>']) {
      await finishNotifiedActivity(ports, text)
    }
    live.ctx = null
    await finishNotifiedActivity(ports, notified('bg-1', 'completed', 'exit code 0'))

    expect(mem.writes.length).toBe(writes)
    expect(saved().tasks[0]?.step?.status).toBe('running')
  } finally {
    live.ctx = null
  }
})

test('a failure while ending a background step is logged, and the prompt goes on', async () => {
  const { ports, mem, done } = setup()
  live.ctx = CTX
  const original = mem.host.write
  try {
    const launched = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await launched?.({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } })
    mem.host.write = async () => { throw new Error('disk unavailable') }

    await finishNotifiedActivity(ports, notified('bg-1', 'completed', 'exit code 0'))

    expect(done.logs.some(line => line.includes('finishing a background step failed'))).toBe(true)
  } finally {
    live.ctx = null
    mem.host.write = original
  }
})

test('a background check that ends after the next step leaves the line on that step, and stops waiting', async () => {
  const { ports, saved } = setup()
  live.ctx = CTX
  try {
    const launched = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await launched?.({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } })
    const edit = await beginActivity(ports, 'Edit', { file_path: '/p/src/a.ts' })
    await edit?.({ result: 'ok' })
    ports.now = async () => LATER

    await finishNotifiedActivity(ports, notified('bg-1', 'completed', 'exit code 0'))

    expect(saved().tasks[0]?.step).toMatchObject({ kind: 'edit', status: 'succeeded', subject: '/p/src/a.ts' })
    expect(saved().tasks[0]?.waiting).toBeUndefined()
    expect(saved().tasks[0]?.testPeriods).toEqual([{ start: Date.parse('2026-10-21T07:12:00Z'), end: LATER }])
  } finally {
    live.ctx = null
  }
})

test("a step's line is the command's first line, cut to 200 characters", async () => {
  const { ports, saved } = setup()
  live.ctx = CTX
  try {
    await beginActivity(ports, 'Bash', { command: `  ${'x'.repeat(300)}\necho done` })
    const subject = saved().tasks[0]?.step?.subject ?? ''
    expect(subject.length).toBe(200)
    expect(subject.endsWith('…')).toBe(true)
    expect(subject).not.toContain('echo')
  } finally {
    live.ctx = null
  }
})
