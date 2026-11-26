import { expect, test } from 'claude-code/testing'

import { addToAlike, fileTask } from '../../../hooks/features/tasks/presentation/state_management/filing_controller'
import { FILE_BAND_TEXT } from '../../../hooks/features/tasks/presentation/constants/file_band_text'
import { finishDocs, finishTask, helperCallOf, noteHelperRun, startTask, taskLooksDone, taskSection } from '../../../hooks/features/tasks/presentation/state_management/tasks_controller'
import { firstMessage } from '../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { onMessage } from '../../../hooks/features/message_check/presentation/state_management/message_check_controller'
import { shouldCheck } from '../../../hooks/features/message_check/domain/services/check_prompt'
import { emptyRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import { ASKED, CLASSIFY_LINE, CRITERIA_SUMMARY, DIDNT_RUN, HELPER_LINES, PROFILE_LINE, QUICK_LINE, REMIND, TASK_LINE } from '../../../hooks/features/tasks/presentation/constants/tasks_text'
import { criteriaAnswer, helperToRemind } from '../../../hooks/features/tasks/domain/services/task_rules'
import { live } from '../../../hooks/core/session/live'
import type { HelperId, ProjectRecord } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'
import type { Run } from '../../helpers'

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

test('new work that is already waiting is held with that task offered on the band', async () => {
  const waiting = makeTask({ title: 'Dark mode', state: 'queued' })
  const r = { ...emptyRecord('p', '/p'), tasks: [waiting] }
  const { ports, view } = fakePorts(memoryHost({ files: withRecord(r) }), {
    reply: '{"kind":"new","intent":"improving","title":"Add dark mode","difficulty":"hard"}',
    view: { record: r },
  })

  expect((await onMessage(ports, CTX, 'add dark mode please')).verdict).toBe('drop')
  expect(view.band).toMatchObject({ kind: 'file', title: 'Add dark mode', alike: waiting.id })
})

test('Add to it puts the held message on the waiting task, once, and files nothing', async () => {
  live.ctx = CTX
  const waiting = makeTask({ title: 'Dark mode', state: 'queued', messages: ['dark mode'] })
  const r = { ...emptyRecord('p', '/p'), tasks: [waiting] }
  const mem = memoryHost({ files: withRecord(r) })
  const band = { kind: 'file' as const, text: 'also a dark sidebar', title: 'Dark sidebar mode', priority: 'mid' as const, difficulty: 'medium' as const, intent: 'improving' as const, alike: waiting.id }
  const { ports, view, done } = fakePorts(mem, { view: { record: r, band } })

  await addToAlike(ports)

  expect(stored(mem).tasks).toHaveLength(1)
  expect(stored(mem).tasks[0]?.messages).toEqual(['dark mode', 'also a dark sidebar'])
  expect(view.band).toEqual({ kind: 'none' })
  expect(done.toasts).toEqual(['Added to: Dark mode'])
})

test('Add to it on a task that has started since keeps the band and says why', async () => {
  live.ctx = CTX
  const started = makeTask({ title: 'Dark mode', state: 'current' })
  const r = { ...emptyRecord('p', '/p'), tasks: [started] }
  const mem = memoryHost({ files: withRecord(r) })
  const band = { kind: 'file' as const, text: 'dark mode', title: 'Dark mode', priority: 'mid' as const, difficulty: 'medium' as const, intent: 'improving' as const, alike: started.id }
  const { ports, view } = fakePorts(mem, { view: { record: r, band } })

  await addToAlike(ports)

  expect(stored(mem).tasks[0]?.messages).toEqual([])
  expect(view.band).toEqual(band)
  expect(view.notice).toBe(FILE_BAND_TEXT.notWaiting)
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

test('an operational command goes through and is never filed', async () => {
  const { ports, view } = fakePorts(memoryHost(), {
    reply: '{"kind":"command","intent":"improving"}',
    view: { record: emptyRecord('p', '/p') },
  })

  expect(await onMessage(ports, CTX, 'push it to origin')).toEqual({ verdict: 'pass', intent: 'improving', kind: 'command' })
  expect(view.band).toEqual({ kind: 'none' })
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
  const fromPlugin = { kind: 'plugin', name: 'queue-tea' }
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
    id: 'queue-tea:task',
    scope: 'session',
    text: 'The current Queue-tea task is "Retry button". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does. When work is ready to commit, propose it with propose_commit, and he commits it from Branches in the Queue-tea app.',
  })
  expect(taskSection(null)).toBeNull()
})

test('in a Manual realm the brief only says Rohan commits, and names no propose_commit', () => {
  const current = makeTask({ title: 'Retry button', state: 'current' })

  const text = taskSection({ ...emptyRecord('p', '/p'), gitMode: 'manual', tasks: [current] })?.text

  expect(text).toBe(TASK_LINE('Retry button', 'manual'))
  expect(text).toBe('The current Queue-tea task is "Retry button". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.')
})

test('an Assisted realm’s brief asks for propose_commit', () => {
  const current = makeTask({ title: 'Retry button', state: 'current' })

  expect(taskSection({ ...emptyRecord('p', '/p'), gitMode: 'assisted', tasks: [current] })?.text).toBe(TASK_LINE('Retry button', 'assisted'))
  expect(TASK_LINE('Retry button', 'assisted')).toContain('propose_commit')
})

test('before a profile is picked, the brief asks to classify first, then adds a line for each helper that is on, in work order', () => {
  const current = makeTask({ title: 'Retry button', state: 'current', helpers: { on: ['commit-chai-n', 'tea-dd'], ran: [], reminded: false } })
  const line = (id: HelperId) => HELPER_LINES.find(([h]) => h === id)![1]

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text).toBe(
    [TASK_LINE('Retry button', 'assisted'), CLASSIFY_LINE, line('tea-dd'), line('commit-chai-n')].join('\n'),
  )
})

test('a Quick change skips Mocha Mockup, Chai-pter and Tea-DD in the brief and keeps Commit Chai-n for review', () => {
  const profile = { id: 'quick' as const, by: 'tea-dd' as const, reason: 'Notes moves to fourth on the toolbar' }
  const current = makeTask({ title: 'Notes fourth', state: 'current', helpers: { on: ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd'], ran: [], reminded: false }, testProfile: profile })
  const text = taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text

  expect(text).toBe(
    [TASK_LINE('Notes fourth', 'assisted'), QUICK_LINE(['Mocha Mockup', 'Chai-pter', 'Tea-DD']), HELPER_LINES.find(([h]) => h === 'commit-chai-n')![1], PROFILE_LINE(profile)].join('\n'),
  )
  expect(text).not.toContain('Before writing code, work out the design')
  expect(text).not.toContain('update the docs')
  expect(QUICK_LINE(['Mocha Mockup', 'Chai-pter', 'Tea-DD'])).toContain('Mocha Mockup, Chai-pter and Tea-DD are on but not needed for it, so skip them.')
})

test('a Quick profile Rohan picked routes the same way, and a lone skipped helper reads in the singular', () => {
  const current = makeTask({ title: 'Padding', state: 'current', helpers: { on: ['tea-dd'], ran: [], reminded: false }, testProfile: { id: 'quick', by: 'rohan' } })

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text).toBe(
    [TASK_LINE('Padding', 'assisted'), QUICK_LINE(['Tea-DD']), 'Test profile: Quick, chosen by Rohan. Tea-DD keeps to it.'].join('\n'),
  )
  expect(QUICK_LINE(['Tea-DD'])).toContain('Tea-DD is on but not needed for it, so skip it.')
})

test('a Standard change keeps every helper that is on', () => {
  const profile = { id: 'standard' as const, by: 'tea-dd' as const, reason: 'a filter inside one feature' }
  const on: HelperId[] = ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd']
  const current = makeTask({ title: 'Quest filter', state: 'current', helpers: { on, ran: [], reminded: false }, testProfile: profile })

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text).toBe(
    [TASK_LINE('Quest filter', 'assisted'), ...HELPER_LINES.map(([, l]) => l), PROFILE_LINE(profile)].join('\n'),
  )
})

test("a profile Tea-DD picked closes the compose section, with its reason", () => {
  const current = makeTask({ title: 'Retry button', state: 'current', helpers: { on: ['tea-dd'], ran: [], reminded: false }, testProfile: { id: 'deep', by: 'tea-dd', reason: 'a new tool' } })
  const line = HELPER_LINES.find(([h]) => h === 'tea-dd')![1]

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text).toBe(
    [TASK_LINE('Retry button', 'assisted'), line, 'Test profile: Deep, chosen by Tea-DD: a new tool'].join('\n'),
  )
})

test("a profile Rohan picked tells Claude that Tea-DD keeps to it", () => {
  const current = makeTask({ title: 'Retry button', state: 'current', testProfile: { id: 'critical', by: 'rohan' } })

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text).toBe(
    [TASK_LINE('Retry button', 'assisted'), 'Test profile: Critical, chosen by Rohan. Tea-DD keeps to it.'].join('\n'),
  )
})

test('with no helpers on, the compose section is the task line alone', () => {
  const current = makeTask({ title: 'Retry button', state: 'current' })

  expect(taskSection({ ...emptyRecord('p', '/p'), tasks: [current] })?.text).toBe(TASK_LINE('Retry button', 'assisted'))
})

test('firstMessage includes the handoff note when there is one', () => {
  const task = makeTask({ title: 'Retry button', messages: ['add a retry button', 'make it blue'] })

  expect(firstMessage(task)).toBe('Task: Retry button\n\nadd a retry button\n\nmake it blue')
  expect(
    firstMessage({ ...task, handoff: { text: 'Button done; colour left.', written: '2026-10-21T10:00:00+02:00' } }),
  ).toBe(
    'Task: Retry button\n\nadd a retry button\n\nmake it blue\n\nHandoff note (2026-10-21T10:00:00+02:00):\nButton done; colour left.\n\n' +
      'First compare the checkpoint with the repository and say in one line what differs. A check counts as passed only when Queue-tea saw it pass; rerun the ones the work relies on. Then do the next action.',
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

const helpersOf = (on: HelperId[], ran: HelperId[] = [], reminded = false) => ({ on, ran, reminded })
const doneSetup = (on: HelperId[], failWrite = false) => {
  live.ctx = CTX
  const task = makeTask({ state: 'current', helpers: helpersOf(on) })
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [task] }) })
  if (failWrite) {
    // Only the first write fails: the reminder mark; the review mark after it saves.
    const run = mem.host.run
    let isFailed = false
    mem.host.run = async (argv, cwd) => {
      if (argv[0] !== 'mv' || isFailed) return run(argv, cwd)
      isFailed = true

      return { exitCode: 1, stdout: '', stderr: 'no' }
    }
  }

  return { mem, ...fakePorts(mem, { view: { record: stored(mem) } }) }
}

test('helperToRemind picks Tea-DD, then Commit Chai-n, and never the other two', () => {
  const t = (on: HelperId[], ran: HelperId[] = []) => makeTask({ helpers: helpersOf(on, ran) })

  expect(helperToRemind(t(['tea-dd']))).toBe('tea-dd')
  expect(helperToRemind(t(['tea-dd', 'commit-chai-n'], ['tea-dd']))).toBe('commit-chai-n')
  expect(helperToRemind(t(['mocha-mockup', 'chai-pter']))).toBeNull()
  expect(helperToRemind(t(['tea-dd'], ['tea-dd']))).toBeNull()
})

test('at a Quick profile done asks for Commit Chai-n but never Tea-DD', () => {
  const quick = (on: HelperId[], ran: HelperId[] = []) => makeTask({ helpers: helpersOf(on, ran), testProfile: { id: 'quick', by: 'tea-dd', reason: 'padding' } })

  expect(helperToRemind(quick(['tea-dd']))).toBeNull()
  expect(helperToRemind(quick(['tea-dd', 'commit-chai-n']))).toBe('commit-chai-n')
  expect(helperToRemind(makeTask({ helpers: helpersOf(['tea-dd']), testProfile: { id: 'standard', by: 'rohan' } }))).toBe('tea-dd')
})

test("task_looks_done reminds once, then asks Rohan with the didn't-run line", async () => {
  const { mem, ports, view } = doneSetup(['tea-dd'])

  expect(await taskLooksDone(ports)).toBe(REMIND('Tea-DD'))
  expect(view.isAskingDone).not.toBe(true)
  expect(stored(mem).tasks[0]?.helpers.reminded).toBe(true)

  expect(await taskLooksDone(ports, 'ran it')).toBe(ASKED)
  expect(view.isAskingDone).toBe(true)
  expect(view.checked).toBe("ran it Tea-DD is on and didn't run.")
})

test("a long checked line still ends with the didn't-run line", async () => {
  const { ports, view } = doneSetup(['tea-dd'])
  await taskLooksDone(ports)

  await taskLooksDone(ports, 'x'.repeat(400))

  expect(view.checked?.endsWith(DIDNT_RUN('Tea-DD'))).toBe(true)
})

test('a failed reminder save asks Rohan instead', async () => {
  const { ports, view, done } = doneSetup(['tea-dd'], true)

  expect(await taskLooksDone(ports)).toBe(ASKED)
  expect(view.isAskingDone).toBe(true)
  expect(done.logs.length).toBe(1)
})

test('an unreadable record on the reminder save asks Rohan instead', async () => {
  const { mem, ports, view } = doneSetup(['tea-dd'])
  mem.files.set(CTX.file, '{bad')

  expect(await taskLooksDone(ports)).toBe(ASKED)
  expect(view.isAskingDone).toBe(true)
  expect(view.checked).toBe(DIDNT_RUN('Tea-DD'))
})

test('noteHelperRun notes a helper once, and adds each run to its totals', async () => {
  const { mem, ports } = doneSetup(['tea-dd'])
  const call = await helperCallOf(ports, 'queue-tea:tea-dd')

  await noteHelperRun(ports, call, { outcome: 'done', ms: 42_000, tokens: 18_000 })
  await noteHelperRun(ports, call, { outcome: 'done', ms: 30_000, tokens: null })

  const task = stored(mem).tasks[0]!
  expect(task.helpers.ran).toEqual(['tea-dd'])
  expect(task.helperUsage).toEqual({ 'tea-dd': { runs: 2, failed: 0, timed: 2, ms: 72_000, counted: 1, tokens: 18_000 } })
})

test('a failed helper run is counted as a failure, never as run, so done still asks for it', async () => {
  const { mem, ports } = doneSetup(['tea-dd'])

  await noteHelperRun(ports, await helperCallOf(ports, 'queue-tea:tea-dd'), { outcome: 'failed', ms: 900, tokens: null })

  const task = stored(mem).tasks[0]!
  expect(task.helpers.ran).toEqual([])
  expect(task.helperUsage?.['tea-dd']).toEqual({ runs: 1, failed: 1, timed: 1, ms: 900, counted: 0, tokens: 0 })
  expect(await taskLooksDone(ports)).toBe(REMIND('Tea-DD'))
  expect(REMIND('Tea-DD')).toContain('say why in checked')
})

test('a run is noted only on the task it started for', async () => {
  const { mem, ports } = doneSetup(['tea-dd'])
  const call = await helperCallOf(ports, 'queue-tea:tea-dd')
  const other = { ...call!, taskId: 't-elsewhere' }

  await noteHelperRun(ports, other, { outcome: 'done', ms: 1, tokens: 1 })

  expect(stored(mem).tasks[0]?.helpers.ran).toEqual([])
  expect(stored(mem).tasks[0]?.helperUsage).toBeUndefined()
})

test('other agents and odd input are ignored', async () => {
  const { mem, ports, done } = doneSetup(['tea-dd'])
  const before = mem.files.get(CTX.file)

  for (const agent of ['general-purpose', 'queue-tea:nobody', undefined, 42]) {
    const call = await helperCallOf(ports, agent)
    expect(call).toBeNull()
    await noteHelperRun(ports, call, { outcome: 'done', ms: 1, tokens: 1 })
  }

  expect(stored(mem).tasks[0]?.helpers.ran).toEqual([])
  expect(mem.files.get(CTX.file)).toBe(before)
  expect(done.logs).toEqual([])
})

const criteriaTasks = () => {
  const feature = makeTask({ id: 'f', title: 'Plan rebuild' })
  const task = makeTask({ state: 'current', criteria: ['Saves the plan', 'Shows a spinner'], parentIds: ['f'], criteriaByParent: { f: ['Feels like one app'] } })

  return { task, tasks: [task, feature] }
}
const yes = (evidence = 'plan test passed') => ({ met: true, evidence })

test('the criteria rule wants one answered entry per criterion, own sets first', () => {
  const { task, tasks } = criteriaTasks()
  const lines = ['Saves the plan', 'Shows a spinner', 'Feels like one app']

  expect(criteriaAnswer(makeTask(), [], undefined)).toEqual({ kind: 'none' })
  expect(criteriaAnswer(task, tasks, undefined)).toEqual({ kind: 'refused', lines, given: 0, missing: [1, 2, 3] })
  expect(criteriaAnswer(task, tasks, 'all done')).toEqual({ kind: 'refused', lines, given: 0, missing: [1, 2, 3] })
  expect(criteriaAnswer(task, tasks, [yes(), { met: true, evidence: '  ' }, { met: 'yes', evidence: 'x' }])).toEqual({ kind: 'refused', lines, given: 3, missing: [2, 3] })
  expect(criteriaAnswer(task, tasks, [yes(), yes(), yes(), yes()])).toEqual({ kind: 'refused', lines, given: 4, missing: [] })
  expect(criteriaAnswer(task, tasks, [yes(), { met: false, evidence: ' no e2e on this Mac ' }, yes()])).toEqual({ kind: 'answered', total: 3, unmet: [{ n: 2, why: 'no e2e on this Mac' }] })
})

test('the brief pins the criteria, numbered across every set', () => {
  const { task, tasks } = criteriaTasks()

  expect(taskSection({ ...emptyRecord('p', '/p'), gitMode: 'manual', tasks })?.text).toBe(
    [TASK_LINE(task.title, 'manual', true), 'Acceptance criteria, in the order task_looks_done takes them:', '1. Saves the plan', '2. Shows a spinner', 'Under "Plan rebuild":', '3. Feels like one app'].join('\n'),
  )
})

test('task_looks_done turns back a call without every criterion, every time, saving nothing', async () => {
  live.ctx = CTX
  const { task, tasks } = criteriaTasks()
  const mem = memoryHost({ files: withRecord({ ...emptyRecord('p', '/p'), tasks: [{ ...task, helpers: helpersOf(['tea-dd']) }, tasks[1]!] }) })
  const { ports, view } = fakePorts(mem, { view: { record: stored(mem) } })
  const before = mem.files.get(CTX.file)

  for (const criteria of [undefined, [yes()]]) {
    const text = await taskLooksDone(ports, 'wrote it', criteria)
    expect(text).toContain('Rohan was not asked')
    expect(text).toContain('3. Feels like one app')
  }
  expect(view.isAskingDone).not.toBe(true)
  expect(mem.files.get(CTX.file)).toBe(before)

  // Answered: the helper reminder comes next, then Rohan sees the summary first.
  const answered = [yes(), { met: false, evidence: 'no e2e on this Mac' }, yes()]
  expect(await taskLooksDone(ports, 'ran it', answered)).toBe(REMIND('Tea-DD'))
  expect(await taskLooksDone(ports, 'ran it', answered)).toBe(ASKED)
  expect(view.checked).toBe(`Criteria: 2 of 3 met. Not met: 2 (no e2e on this Mac). ran it ${DIDNT_RUN('Tea-DD')}`)
})

test("the criteria summary shortens long reasons and counts the rest", () => {
  const unmet = [1, 2, 3, 4].map(n => ({ n, why: 'x'.repeat(80) }))

  expect(CRITERIA_SUMMARY(4, [])).toBe('Criteria: 4 of 4 met.')
  expect(CRITERIA_SUMMARY(4, unmet)).toBe(`Criteria: 0 of 4 met. Not met: 1 (${'x'.repeat(59)}…); 2 (${'x'.repeat(59)}…); +2 more.`)
})
