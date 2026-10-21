import { expect, test } from 'claude-code/testing'

import { checkMessage } from '../hooks/check'
import type { Ask } from '../hooks/check'
import { escapeCell } from '../hooks/docslog'
import { applyPending, createTracker } from '../hooks/effort'
import {
  afterTurn,
  fileTask,
  finishDocs,
  finishTask,
  onMessage,
  removeQueued,
  sendHeld,
  shouldCheck,
  startTask,
} from '../hooks/flow'
import { emptyRecord, updateRecord } from '../hooks/record'
import type { Band, ProjectRecord } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'
import type { Run } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const DIRTY = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', '? a', ''].join('\n')
const git = (status = CLEAN, more: Record<string, Run> = {}): Record<string, Run> => ({
  'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
  'git status --porcelain=v2 --branch': { stdout: status },
  'git branch --format=%(refname:short)': { stdout: 'main\n' },
  'git switch -c task/a': {},
  'git switch -c task/b': {},
  ...more,
})
const withRecord = (r: ProjectRecord) => ({ [CTX.file]: JSON.stringify(r) })
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const newReply = (title: string) => `{"kind":"new","intent":"improving","title":"${title}","difficulty":"light"}`

test('a second held message waits behind the first band, and both get filed', async () => {
  const current = makeTask({ state: 'current' })
  const record = { ...emptyRecord('p', '/p'), tasks: [current] }
  const mem = memoryHost({ files: withRecord(record) })
  const first = fakePorts(mem, { reply: newReply('A'), view: { record } })
  await onMessage(first.ports, CTX, 'do A')
  const ports = { ...first.ports, ask: fakePorts(mem, { reply: newReply('B') }).ports.ask }
  await onMessage(ports, CTX, 'do B')

  expect((first.view.band as Extract<Band, { kind: 'file' }>).title).toBe('A')
  await fileTask(ports, CTX, first.view.band as Extract<Band, { kind: 'file' }>)
  expect((first.view.band as Extract<Band, { kind: 'file' }>).title).toBe('B')
  await fileTask(ports, CTX, first.view.band as Extract<Band, { kind: 'file' }>)

  expect(first.view.band).toEqual({ kind: 'none' })
  expect(stored(mem).tasks.map(t => t.title)).toEqual([current.title, 'A', 'B'])
})

test('afterTurn twice before the fresh conversation starts writes one note and clears once', async () => {
  const task = makeTask({ state: 'current' })
  const record = { ...emptyRecord('p', '/p'), tasks: [task] }
  const mem = memoryHost({ files: withRecord(record) })
  const { ports, done, settle } = fakePorts(mem, { reply: 'note', view: { record } })
  let forks = 0
  const fork = ports.ask.fork
  ports.ask.fork = async prompt => {
    forks += 1

    return fork(prompt)
  }

  await afterTurn(ports, CTX, { tokens: 150_000, allowance: null }, null)
  await afterTurn(ports, CTX, { tokens: 160_000, allowance: null }, null)
  await settle()

  expect(forks).toBe(1)
  expect(done.clears).toBe(1)
})

test('a save that cannot write keeps the band and says so', async () => {
  const mem = memoryHost({ files: { [CTX.file]: '{bad' } })
  const band: Band = { kind: 'file', text: 'do A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving' }
  const { ports, view } = fakePorts(mem, { view: { band } })

  await fileTask(ports, CTX, band)

  expect(view.band).toEqual(band)
  expect(view.load).toBe('failed')
})

test('a save whose write fails keeps the band', async () => {
  const mem = memoryHost({ files: withRecord(emptyRecord('p', '/p')) })
  const run = mem.host.run
  mem.host.run = async (argv, cwd) => (argv[0] === 'mv' ? { exitCode: 1, stdout: '', stderr: 'no' } : run(argv, cwd))
  const band: Band = { kind: 'file', text: 'do A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving' }
  const { ports, view } = fakePorts(mem, { view: { band } })

  await fileTask(ports, CTX, band)

  expect(view.band).toEqual(band)
  expect(view.notice).toBe("Couldn't save the task. Try Save again.")
})

test('a prompt with attachments is not checked', () => {
  expect(shouldCheck({ origin: { kind: 'composer' }, attachments: [{ kind: 'image' }] })).toBe(false)
  expect(shouldCheck({ origin: { kind: 'composer' }, attachments: [] })).toBe(true)
})

test('a held message sent on goes as Rohan’s and shows the next band', async () => {
  const next: Band = { kind: 'unsure', text: 'two', intent: 'improving', didCheckRun: true }
  const { ports, view, done } = fakePorts(memoryHost(), {
    view: { band: { kind: 'unsure', text: 'one', intent: 'understanding', didCheckRun: false }, bandQueue: [next] },
  })

  expect(await sendHeld(ports)).toBe('understanding')
  expect(done.submits).toEqual(['one'])
  expect(done.asUser).toEqual([true])
  expect(view.band).toEqual(next)
})

test('onMessage says what kind the message was', async () => {
  const { ports } = fakePorts(memoryHost(), {
    reply: '{"kind":"quick","intent":"understanding"}',
    view: { record: emptyRecord('p', '/p') },
  })

  expect(await onMessage(ports, CTX, 'what is this?')).toEqual({ verdict: 'pass', intent: 'understanding', kind: 'quick' })
})

test('after a quick question, time goes to the project until the next task message', () => {
  const T0 = Date.parse('2026-10-21T08:00:00Z')
  const tracker = createTracker(15, 0)
  tracker.activity(T0)
  tracker.route('project')
  tracker.activity(T0 + 4 * 60_000)
  tracker.route('task')
  tracker.activity(T0 + 10 * 60_000)

  const current = makeTask({ state: 'current' })
  const after = applyPending({ ...emptyRecord('p', '/p'), tasks: [current] }, tracker.take())

  expect(after.unassignedMinutesByDay).toEqual({ '2026-10-21': 4 })
  expect(after.tasks[0]!.minutesByDay).toEqual({ '2026-10-21': 6 })
})

test('Start pressed twice makes one branch and clears once', async () => {
  const task = makeTask({ title: 'A' })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [task] }), git: git() })
  const { ports, done, settle } = fakePorts(mem)

  await Promise.all([startTask(ports, CTX, task.id), startTask(ports, CTX, task.id)])
  await settle()

  expect(mem.runs.filter(argv => argv.includes('switch'))).toHaveLength(1)
  expect(done.clears).toBe(1)
})

test('finishing twice, or saving the docs path twice, writes one row', async () => {
  const a = makeTask({ title: 'A', state: 'current' })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), docsLogPath: 'docs/task_log.md', tasks: [a] }) })
  const { ports } = fakePorts(mem)
  await Promise.all([finishTask(ports, CTX, a.id, 'light'), finishTask(ports, CTX, a.id, 'light')])

  const b = makeTask({ title: 'B', state: 'current' })
  const mem2 = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [b] }) })
  const second = fakePorts(mem2)
  await finishTask(second.ports, CTX, b.id, 'light')
  await Promise.all([
    finishDocs(second.ports, CTX, b.id, 'docs/task_log.md'),
    finishDocs(second.ports, CTX, b.id, 'docs/task_log.md'),
  ])

  expect(mem.files.get('/p/docs/task_log.md')!.split('\n').filter(l => l.startsWith('| A |'))).toHaveLength(1)
  expect(mem2.files.get('/p/docs/task_log.md')!.split('\n').filter(l => l.startsWith('| B |'))).toHaveLength(1)
})

test('Check again does not start a removed task, and Remove clears its hold', async () => {
  const task = makeTask({ title: 'A' })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [task] }), git: git(DIRTY) })
  const { ports, view, done, settle } = fakePorts(mem)
  await startTask(ports, CTX, task.id)
  expect(view.hold?.taskId).toBe(task.id)

  await removeQueued(ports, CTX, task.id)
  expect(view.hold).toBeNull()

  mem.git['git status --porcelain=v2 --branch'] = { stdout: CLEAN }
  expect(await startTask(ports, CTX, task.id)).toBe('failed')
  await settle()
  expect(mem.runs.some(argv => argv.includes('switch'))).toBe(false)
  expect(done.clears).toBe(0)
})

test('a task cannot start while another is current', async () => {
  const current = makeTask({ title: 'Now', state: 'current' })
  const queued = makeTask({ title: 'B' })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [current, queued] }), git: git() })
  const { ports } = fakePorts(mem)

  expect(await startTask(ports, CTX, queued.id)).toBe('failed')
  expect(stored(mem).tasks.filter(t => t.state === 'current')).toHaveLength(1)
})

test('two record writes use different temp files', async () => {
  const mem = memoryHost()

  await updateRecord(mem.host, CTX.file, r => r, 'p', '/p')
  await updateRecord(mem.host, CTX.file, r => r, 'p', '/p')

  expect(mem.writes).toHaveLength(2)
  expect(mem.writes[0] === mem.writes[1]).toBe(false)
  expect(mem.writes.every(w => w.startsWith(`${CTX.file}.`) && w.endsWith('.tmp'))).toBe(true)
})

test('a check whose model call rejects gives null, and onMessage stops checking', async () => {
  const logs: string[] = []
  const ask: Ask = {
    fork: async () => ({ isAnswered: false, reason: 'nothing-to-fork' }),
    complete: async () => {
      throw new Error('blocked model')
    },
    sleep: () => new Promise<void>(() => {}),
    log: text => logs.push(text),
  }
  expect(await checkMessage(ask, 'p', 10_000)).toBeNull()
  expect(logs.length).toBe(1)

  const { ports, view } = fakePorts(memoryHost(), { view: { record: emptyRecord('p', '/p') } })
  ports.ask.fork = async () => {
    throw new Error('boom')
  }
  await onMessage(ports, CTX, 'x').catch(() => {})
  expect(view.isChecking).toBe(false)
})

test('a title cannot break the table or an MDX build', () => {
  expect(escapeCell('a \\| b')).toBe('a \\\\\\| b')
  expect(escapeCell('<Button> {x}')).toBe('&lt;Button> \\{x\\}')
  expect(escapeCell('one\r\ntwo\rthree')).toBe('one two three')
})
