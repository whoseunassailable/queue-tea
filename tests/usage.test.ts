import { expect, test } from 'claude-code/testing'

import { afterTurn } from '../hooks/flow'
import { emptyRecord } from '../hooks/record'
import { formatAllowance, readAllowance, shouldFresh, shouldHandoff } from '../hooks/usage'
import type { ProjectRecord } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'

const RESET = '2026-10-21T14:40:00Z'
const current = () => makeTask({ title: 'Retry button', state: 'current', messages: ['add a retry button'] })
const setup = (reply: string | undefined) => {
  const task = current()
  const record = { ...emptyRecord('p', '/p'), tasks: [task] }
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(record) } })
  const fake = fakePorts(mem, { reply, view: { record } })

  return { ...fake, mem, task }
}
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord

test('readAllowance picks the five-hour window', () => {
  expect(
    readAllowance([
      { kind: 'seven_day', percentUsed: 12 },
      { kind: 'five_hour', percentUsed: 62.5, resetsAt: RESET },
    ]),
  ).toEqual({ percent: 62.5, resetsAt: RESET })
  expect(readAllowance([])).toBeNull()
})

test('formatAllowance with and without a reset time', () => {
  expect(formatAllowance({ percent: 62.4, resetsAt: RESET }, 120)).toBe('5h: 62% · resets 16:40')
  expect(formatAllowance({ percent: 7, resetsAt: null }, 120)).toBe('5h: 7%')
})

test('shouldFresh only past the size', () => {
  expect(shouldFresh(100_001, 100_000)).toBe(true)
  expect(shouldFresh(100_000, 100_000)).toBe(false)
  expect(shouldFresh(undefined, 100_000)).toBe(false)
})

test('shouldHandoff once per reset window', () => {
  expect(shouldHandoff(90, 90, null, RESET)).toBe(true)
  expect(shouldHandoff(95, 90, RESET, RESET)).toBe(false)
  expect(shouldHandoff(89.9, 90, null, RESET)).toBe(false)
  expect(shouldHandoff(91, 90, RESET, '2026-10-21T19:40:00Z')).toBe(true)
})

test('over 100,000 tokens: handoff, then clear and the first message from the note', async () => {
  const { ports, done, settle, mem, task } = setup('Button done; colour left.')

  await afterTurn(ports, CTX, { tokens: 120_000, allowance: null }, null)
  await settle()

  expect(stored(mem).tasks[0]!.handoff).toEqual({ text: 'Button done; colour left.', written: '2026-10-21T09:12:00+02:00' })
  expect(done.clears).toBe(1)
  expect(done.submits[0]).toStartWith(
    `Task: ${task.title}\n\nadd a retry button\n\nHandoff note (2026-10-21T09:12:00+02:00):\nButton done; colour left.\n\nChecked by Queue-tea just now:`,
  )
})

test('a failed handoff note does not clear', async () => {
  const { ports, done, settle, mem } = setup(undefined)

  await afterTurn(ports, CTX, { tokens: 120_000, allowance: null }, null)
  await settle()

  expect(done.clears).toBe(0)
  expect(stored(mem).tasks[0]!.handoff).toBeNull()
  expect(done.statuses).toContain("Queue-tea: couldn't write the checkpoint; trying again after the next reply")
  expect(done.logs.length > 0).toBe(true)
})

test('90% writes one handoff note per reset window, without clearing', async () => {
  const { ports, done, settle, mem } = setup('Halfway.')

  const first = await afterTurn(ports, CTX, { tokens: 10_000, allowance: { percent: 91, resetsAt: RESET } }, null)
  const second = await afterTurn(ports, CTX, { tokens: 10_000, allowance: { percent: 93, resetsAt: RESET } }, first)
  await settle()

  expect(first).toBe(RESET)
  expect(second).toBe(RESET)
  expect(stored(mem).tasks[0]!.handoff?.text).toBe('Halfway.')
  expect(done.clears).toBe(0)
  expect(done.logs.filter(l => l.includes('handoff')).length).toBe(0)
})

test('under the size and the mark, nothing happens', async () => {
  const { ports, done, settle, mem } = setup('note')

  expect(await afterTurn(ports, CTX, { tokens: 50_000, allowance: { percent: 40, resetsAt: RESET } }, null)).toBeNull()
  await settle()

  expect(done.clears).toBe(0)
  expect(stored(mem).tasks[0]!.handoff).toBeNull()
})

test('with no current task, nothing happens', async () => {
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(emptyRecord('p', '/p')) } })
  const { ports, done, settle } = fakePorts(mem, { reply: 'note', view: { record: emptyRecord('p', '/p') } })

  await afterTurn(ports, CTX, { tokens: 500_000, allowance: { percent: 99, resetsAt: RESET } }, null)
  await settle()

  expect(done.clears).toBe(0)
})

test('with no reset time, the 90% note is written once', async () => {
  const { ports, settle } = setup('Halfway.')
  const writes: string[] = []
  const fork = ports.ask.fork
  ports.ask.fork = async prompt => {
    writes.push(prompt)

    return fork(prompt)
  }

  const first = await afterTurn(ports, CTX, { allowance: { percent: 95, resetsAt: null } }, null)
  await afterTurn(ports, CTX, { allowance: { percent: 96, resetsAt: null } }, first)
  await settle()

  expect(writes).toHaveLength(1)
})
