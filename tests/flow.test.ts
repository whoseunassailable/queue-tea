import { expect, test } from 'claude-code/testing'

import {
  fileTask,
  finishDocs,
  finishTask,
  firstMessage,
  onMessage,
  shouldCheck,
  startTask,
  taskLooksDone,
  taskSection,
} from '../hooks/flow'
import { emptyRecord } from '../hooks/record'
import type { ProjectRecord } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'
import type { Run } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const DIRTY = [
  OID,
  '# branch.head main',
  '# branch.upstream origin/main',
  '# branch.ab +2 -0',
  '1 .M N... 100644 100644 100644 a b x.ts',
  '1 .M N... 100644 100644 100644 a b y.ts',
  '? z.ts',
  '',
].join('\n')
const gitWith = (status: string, more: Record<string, Run> = {}): Record<string, Run> => ({
  'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
  'git status --porcelain=v2 --branch': { stdout: status },
  'git branch --format=%(refname:short)': { stdout: 'main\n' },
  'git switch -c task/dark-mode': {},
  ...more,
})
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const withRecord = (r: ProjectRecord) => ({ [CTX.file]: JSON.stringify(r) })
const FILE_INPUT = {
  text: 'add dark mode',
  title: 'Dark mode',
  priority: 'high' as const,
  difficulty: 'hard' as const,
  intent: 'improving' as const,
}

test('a new message is held and the band asks for its priority', async () => {
  const mem = memoryHost({ files: withRecord(emptyRecord('p', '/p')) })
  const { ports, view } = fakePorts(mem, {
    reply: '{"kind":"new","intent":"improving","title":"Dark mode","difficulty":"hard"}',
    view: { record: emptyRecord('p', '/p') },
  })

  expect(await onMessage(ports, CTX, 'add dark mode')).toEqual({ verdict: 'drop', intent: 'improving', kind: 'new' })
  expect(view.band).toEqual({
    kind: 'file',
    text: 'add dark mode',
    title: 'Dark mode',
    priority: 'mid',
    difficulty: 'hard',
    intent: 'improving',
  })
  expect(view.isChecking).toBe(false)
})

test('a same-task message goes through', async () => {
  const { ports, view } = fakePorts(memoryHost(), {
    reply: '{"kind":"same","intent":"understanding"}',
    view: { record: emptyRecord('p', '/p') },
  })

  expect(await onMessage(ports, CTX, 'why does it fail?')).toEqual({ verdict: 'pass', intent: 'understanding', kind: 'same' })
  expect(view.band).toEqual({ kind: 'none' })
})

test('a quick question goes through', async () => {
  const { ports } = fakePorts(memoryHost(), {
    reply: '{"kind":"quick","intent":"understanding"}',
    view: { record: emptyRecord('p', '/p') },
  })

  expect((await onMessage(ports, CTX, 'what does this error mean?')).verdict).toBe('pass')
})

test('a failed check holds the message and says the check did not run', async () => {
  const { ports, view } = fakePorts(memoryHost(), { reply: 'no idea', view: { record: emptyRecord('p', '/p') } })

  expect((await onMessage(ports, CTX, 'hmm')).verdict).toBe('drop')
  expect(view.band).toEqual({ kind: 'unsure', text: 'hmm', intent: 'improving', didCheckRun: false })
})

test('an unsure answer asks, saying the check ran', async () => {
  const { ports, view } = fakePorts(memoryHost(), {
    reply: '{"kind":"unsure","intent":"understanding"}',
    view: { record: emptyRecord('p', '/p') },
  })

  await onMessage(ports, CTX, 'hmm')
  expect(view.band).toEqual({ kind: 'unsure', text: 'hmm', intent: 'understanding', didCheckRun: true })
})

test('with no record loaded, a message goes through unchecked', async () => {
  const { ports } = fakePorts(memoryHost(), { reply: '{"kind":"new","intent":"improving","title":"X"}' })

  expect(await onMessage(ports, CTX, 'x')).toEqual({ verdict: 'pass', intent: null, kind: null })
})

test('slash commands and the mod’s own prompts are not checked', () => {
  expect(shouldCheck({ origin: { kind: 'composer' } })).toBe(true)
  expect(shouldCheck({ origin: { kind: 'composer' }, command: { name: 'help', args: '' } })).toBe(false)
  expect(shouldCheck({ origin: { kind: 'composer' }, isMeta: true })).toBe(false)
  const fromPlugin = { kind: 'plugin', name: 'queue-tie' }
  expect(shouldCheck({ origin: fromPlugin })).toBe(false)
  expect(shouldCheck({ origin: { kind: 'task-notification' } })).toBe(false)
})

test('Save twice files one task', async () => {
  const current = makeTask({ state: 'current' })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [current] }) })
  const { ports, done } = fakePorts(mem)

  await Promise.all([fileTask(ports, CTX, FILE_INPUT), fileTask(ports, CTX, FILE_INPUT)])

  expect(stored(mem).tasks.filter(t => t.title === 'Dark mode')).toHaveLength(1)
  expect(done.toasts).toEqual(['Queued: Dark mode (high)'])
})

test('filing with nothing current starts the task: branch, clear, first message', async () => {
  const mem = memoryHost({ files: withRecord(emptyRecord('p', '/p')), git: gitWith(CLEAN) })
  const { ports, view, done, settle } = fakePorts(mem)

  await fileTask(ports, CTX, FILE_INPUT)
  await settle()
  const task = stored(mem).tasks[0]!

  expect(mem.runs).toContainEqual(['git', 'switch', '-c', 'task/dark-mode'])
  expect(task.state).toBe('current')
  expect(task.branch).toBe('task/dark-mode')
  expect(task.startCommit).toBe('1a2b3c4')
  expect(task.created).toBe('2026-10-21T09:12:00+02:00')
  expect(task.started).toBe('2026-10-21T09:12:00+02:00')
  expect(done.clears).toBe(1)
  expect(done.submits[0]!.startsWith('Task: Dark mode')).toBe(true)
  expect(view.hold).toBeNull()
})

test('a dirty tree holds the start and says what is left', async () => {
  const mem = memoryHost({ files: withRecord(emptyRecord('p', '/p')), git: gitWith(DIRTY) })
  const { ports, view, done, settle } = fakePorts(mem)

  await fileTask(ports, CTX, FILE_INPUT)
  await settle()
  const task = stored(mem).tasks[0]!

  expect(view.hold).toEqual({ taskId: task.id, text: '3 files not committed · 2 commits not pushed' })
  expect(task.state).toBe('queued')
  expect(mem.runs.some(argv => argv.includes('switch'))).toBe(false)
  expect(done.clears).toBe(0)
})

test('Check again after a commit and push starts the held task', async () => {
  const mem = memoryHost({ files: withRecord(emptyRecord('p', '/p')), git: gitWith(DIRTY) })
  const { ports, view, settle } = fakePorts(mem)
  await fileTask(ports, CTX, FILE_INPUT)
  const id = view.hold!.taskId

  mem.git['git status --porcelain=v2 --branch'] = { stdout: CLEAN }
  expect(await startTask(ports, CTX, id)).toBe('started')
  await settle()
  expect(view.hold).toBeNull()
})

test('not a repo starts without a branch', async () => {
  const mem = memoryHost({
    files: withRecord(emptyRecord('p', '/p')),
    git: { 'git rev-parse --is-inside-work-tree': { exitCode: 128 } },
  })
  const { ports, view, done, settle } = fakePorts(mem)

  await fileTask(ports, CTX, FILE_INPUT)
  await settle()

  expect(stored(mem).tasks[0]!.state).toBe('current')
  expect(stored(mem).tasks[0]!.branch).toBeNull()
  expect(view.notice).toBe('Not a git repository, so no branches are made')
  expect(done.clears).toBe(1)
})

test('a branch git refuses to make holds the start with a way to retry', async () => {
  const git = gitWith(CLEAN)
  delete git['git switch -c task/dark-mode']
  const mem = memoryHost({ files: withRecord(emptyRecord('p', '/p')), git })
  const { ports, view, done } = fakePorts(mem)

  await fileTask(ports, CTX, FILE_INPUT)

  expect(view.hold?.text).toBe("Couldn't make the branch task/dark-mode. Check again to retry.")
  expect(done.clears).toBe(0)
  expect(done.logs.length).toBe(1)
})

test('task_looks_done asks in the panel', async () => {
  const { ports, view } = fakePorts(memoryHost())

  await taskLooksDone(ports)
  expect(view.isAskingDone).toBe(true)
})

test('finishing measures the diff, marks done and writes the docs log', async () => {
  const current = makeTask({
    title: 'Retry button',
    state: 'current',
    priority: 'high',
    difficulty: { expected: 'light', actual: null },
    branch: 'task/retry-button',
    startCommit: 'abc1234',
    minutesByDay: { '2026-10-21': 84 },
  })
  const mem = memoryHost({
    files: withRecord({ ...emptyRecord('p', '/p'), docsLogPath: 'docs/task_log.md', tasks: [current] }),
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git diff --shortstat abc1234': { stdout: ' 4 files changed, 160 insertions(+), 38 deletions(-)\n' },
    },
  })
  const { ports, view } = fakePorts(mem, { view: { isAskingDone: true } })

  await finishTask(ports, CTX, current.id, 'medium')
  const task = stored(mem).tasks[0]!

  expect(task.state).toBe('done')
  expect(task.finished).toBe('2026-10-21T09:12:00+02:00')
  expect(task.difficulty).toEqual({ expected: 'light', actual: 'medium' })
  expect([task.effort.linesAdded, task.effort.linesRemoved, task.effort.filesTouched]).toEqual([160, 38, 4])
  expect(mem.files.get('/p/docs/task_log.md')).toContain(
    '| Retry button | High | Light → Medium | 1h 24m | `task/retry-button` |',
  )
  expect(view.isChoosingNext).toBe(true)
  expect(view.isAskingDone).toBe(false)
})

test('the first finish in a project asks for the docs log path', async () => {
  const current = makeTask({ title: 'Retry button', state: 'current', startCommit: null })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [current] }) })
  const { ports, view } = fakePorts(mem)

  await finishTask(ports, CTX, current.id, 'light')
  expect(view.band).toEqual({ kind: 'docsPath', taskId: current.id, suggested: 'docs/task_log.md' })
  expect(mem.files.has('/p/docs/task_log.md')).toBe(false)

  await finishDocs(ports, CTX, current.id, 'docs/task_log.md')
  expect(stored(mem).docsLogPath).toBe('docs/task_log.md')
  expect(mem.files.get('/p/docs/task_log.md')).toContain('| Retry button |')
  expect(view.band).toEqual({ kind: 'none' })
  expect(view.isChoosingNext).toBe(true)
})

test('the compose section names the task only while one is current', () => {
  const current = makeTask({ title: 'Retry button', state: 'current' })

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [makeTask()] })).toBeNull()
  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })).toEqual({
    id: 'queue-tie:task',
    scope: 'session',
    text: 'The current Queue-tie task is "Retry button". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.',
  })
  expect(taskSection(null)).toBeNull()
})

test('firstMessage includes the handoff note when there is one', () => {
  const task = makeTask({ title: 'Retry button', messages: ['add a retry button', 'make it blue'] })

  expect(firstMessage(task)).toBe('Task: Retry button\n\nadd a retry button\n\nmake it blue')
  expect(
    firstMessage({ ...task, handoff: { text: 'Button done; colour left.', written: '2026-10-21T10:00:00+02:00' } }),
  ).toBe(
    'Task: Retry button\n\nadd a retry button\n\nmake it blue\n\nHandoff note (2026-10-21T10:00:00+02:00):\nButton done; colour left.\n\n' +
      'First compare the checkpoint with the repository and say in one line what differs. A check counts as passed only when Queue-tie saw it pass; rerun the ones the work relies on. Then do the next action.',
  )
})

test('an unreadable record stops the start: no branch, no clear', async () => {
  const mem = memoryHost({ files: { [CTX.file]: '{bad' }, git: gitWith(CLEAN) })
  const { ports, view, done, settle } = fakePorts(mem)

  await fileTask(ports, CTX, FILE_INPUT)
  await settle()

  expect(view.load).toBe('failed')
  expect(mem.runs.some(argv => argv.includes('switch'))).toBe(false)
  expect(done.clears).toBe(0)
  expect(mem.files.get(CTX.file)).toBe('{bad')
})
