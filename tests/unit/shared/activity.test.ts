import { expect, test } from 'claude-code/testing'

import { live } from '../../../hooks/core/session/live'
import { beginActivity } from '../../../hooks/shared/activity/presentation/state_management/activity_controller'
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

test('saves a started tool and its failed result to the same task across a task change', async () => {
  const { ports, view, mem, saved } = setup()
  live.ctx = CTX
  try {
    const finish = await beginActivity(ports, 'Bash', { command: 'npm test' })
    expect(saved().tasks[0]?.activity?.[0]?.status).toBe('running')
    const switched = { ...saved(), tasks: saved().tasks.map(t => ({ ...t, state: t.id === 'first' ? 'queued' as const : 'current' as const })) }
    mem.files.set(CTX.file, JSON.stringify(switched))
    view.record = switched
    await finish?.({ result: { stdout: '1 failed', exitCode: 1 } })
    expect(saved().tasks[0]?.activity?.[0]).toMatchObject({ status: 'failed', output: '1 failed' })
    expect(saved().tasks[1]?.activity).toBeUndefined()
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
    expect(done.logs.some(line => line.includes('saving a started activity failed'))).toBe(true)
  } finally {
    live.ctx = null
    mem.host.write = original
  }
})

test('a background check keeps waiting until its own task result is retrieved', async () => {
  const { ports, saved } = setup()
  live.ctx = CTX
  try {
    const launched = await beginActivity(ports, 'Bash', { command: 'npm test' })
    await launched?.({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } })
    expect(saved().tasks[0]?.activity?.[0]?.status).toBe('running')
    expect(await beginActivity(ports, 'GetTask', { taskId: 'other' })).toBeNull()
    const poll = await beginActivity(ports, 'GetTask', { taskId: 'bg-1' })
    await poll?.({ isError: true })
    expect(saved().tasks[0]?.activity?.[0]?.status).toBe('running')
    await poll?.({ result: { taskId: 'bg-1', status: 'completed', result: { isError: false, content: [{ type: 'text', text: '12 passed' }] } } })
    expect(saved().tasks[0]?.activity).toHaveLength(1)
    expect(saved().tasks[0]?.activity?.[0]).toMatchObject({ status: 'succeeded', output: '12 passed' })
  } finally {
    live.ctx = null
  }
})
