import { describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import { finishNotified, finishStep, fromOldLog, keepStep, latestStep, notifiedEnds, stepOf, toolStep } from '../../../../../hooks/shared/activity/domain/services/activity'
import { STEP_SUBJECT_LIMIT, WAITING_LIMIT } from '../../../../../hooks/shared/activity/domain/constants/step_limits'
import { parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import { emptyCheckpoint } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { makeTask } from '../api/fixtures'
import { readActivity } from '../data/activity_source'
import { createLogger } from '../../../core/logger'

const AT = '2026-11-04T12:00:00Z'
const END = '2026-11-04T12:01:00Z'
const step = () => toolStep('Bash', { command: 'npm test' }, 'run-1', AT)!
const log = createLogger('dev', () => {})
const ok = (stdout: string) => ({ exitCode: 0, stdout, stderr: '' })

describe('the step a task is on', () => {
  it('reads a stored step, keeping only its own fields, and drops a malformed one', () => {
    expect(stepOf({ ...step(), output: '24 passed', truncated: true })).toEqual(step())
    for (const bad of [null, { steps: [] }, { ...step(), kind: 'unexpected' }, { ...step(), at: 'bad date' }, { ...step(), id: '' }]) expect(stepOf(bad)).toBeNull()
  })

  it('names the command by its first line, cut to the limit, and starts without claiming success', () => {
    expect(step()).toEqual({ id: 'run-1', at: AT, finished: null, kind: 'test', status: 'running', subject: 'npm test' })
    expect(toolStep('Bash', { command: `${'x'.repeat(STEP_SUBJECT_LIMIT + 50)}\necho done` }, 'long', AT)!.subject).toHaveLength(STEP_SUBJECT_LIMIT)
    expect(toolStep('Edit', { file_path: 'test/a.spec.ts' }, 'edit', AT)).toMatchObject({ kind: 'edit', subject: 'test/a.spec.ts' })
    expect(toolStep('Read', {}, 'read', AT)).toBeNull()
    expect(toolStep('Unknown', {}, 'other', AT)).toBeNull()
  })

  it.each([
    [{ result: { stdout: '24 passed', exitCode: 0 } }, 'succeeded'],
    [{ result: { stderr: '1 failed', exitCode: 1 } }, 'failed'],
    [{ result: { exit_code: 2 } }, 'failed'],
    [{ result: { interrupted: true } }, 'failed'],
    [{ isError: true }, 'failed'],
    [{ deny: 'Commits belong to you' }, 'blocked'],
  ] as const)('records the actual outcome of %j, and none of its output', (result, status) => {
    const ended = finishStep(step(), result, END)
    expect(ended).toMatchObject({ status, finished: END })
    expect(JSON.stringify(ended)).not.toMatch(/passed|1 failed|Commits belong/)
  })

  it('does not count a background launch as a passing check', () => {
    expect(finishStep(step(), { result: { stdout: 'Starting…', backgroundTaskId: 'bg-1' } }, END)).toMatchObject({ status: 'running', finished: null, backgroundId: 'bg-1' })
  })

  it('keeps one step: the newest replaces the last, and a task keeps no history', () => {
    const task = makeTask({ id: 'one' })
    const finished = keepStep(keepStep(task, step()), finishStep(step(), { result: 'passed' }, END))
    expect(finished.step).toMatchObject({ id: 'run-1', status: 'succeeded' })
    const next = keepStep(finished, toolStep('Edit', { file_path: 'a.ts' }, 'edit', END)!)
    expect(next.step).toMatchObject({ id: 'edit', kind: 'edit' })
    expect(task.step).toBeUndefined()
    expect(Object.keys(next)).not.toContain('activity')
  })

  it('the later of two steps is the one started last', () => {
    const later = { ...step(), id: 'later', at: END }
    expect(latestStep(step(), later, null, undefined)).toBe(later)
    expect(latestStep(later, step())).toBe(later)
    expect(latestStep()).toBeNull()
  })
})

describe("an older record's step log", () => {
  const entry = (id: string, at: string, extra: Record<string, unknown> = {}) =>
    ({ ...step(), id, at, finished: at, status: 'succeeded', output: 'x'.repeat(8_000), truncated: true, ...extra })

  it('leaves its latest step and the background checks still waiting, without output', () => {
    const old = fromOldLog([entry('b', END, { kind: 'edit', subject: 'a.ts' }), entry('a', AT, { status: 'running', finished: null, backgroundId: 'bg-1' }), 'junk'])
    expect(old.step).toEqual({ id: 'b', at: END, finished: END, kind: 'edit', status: 'succeeded', subject: 'a.ts' })
    expect(old.waiting?.map(s => s.backgroundId)).toEqual(['bg-1'])
    expect(JSON.stringify(old)).not.toContain('xxxx')
    expect(fromOldLog(undefined)).toEqual({})
  })

  it('is gone once the record is read, and a record of 300 long steps comes back small', () => {
    const steps = Array.from({ length: 300 }, (_, i) => entry(`s-${i}`, new Date(Date.parse(AT) + i * 1000).toISOString()))
    const text = JSON.stringify({ version: 2, project: { name: 'p', path: '/p' }, docsLogPath: null, playNext: null, feature: null, tasks: [{ ...makeTask({ id: 'one' }), activity: steps }], unassignedMinutesByDay: {}, requests: [] })
    expect(text.length).toBeGreaterThan(2_000_000)
    const read = parseRecord(text)
    if (read === 'unreadable') throw new Error('unreadable')
    const saved = JSON.stringify(read, null, 2)
    expect(saved.length).toBeLessThan(10_000)
    expect(saved).not.toContain('"activity"')
    expect(read.tasks[0]!.step?.id).toBe('s-299')
  })
})

describe('activity from local git', () => {
  const COMMIT = 'a'.repeat(40)
  const task = () => makeTask({ id: 'one', branch: 'task/one', startCommit: 'b'.repeat(40), step: step() })
  const host = () => ({ run: vi.fn(async (argv: string[]) => ok(argv[1] === 'log' ? `${COMMIT}\0${END}\0added task activity\n` : 'refs/remotes/origin/main\nrefs/remotes/origin/HEAD\n')) })

  it('reads the task branch, commit message, and containing remote refs without any mutation or network command', async () => {
    const h = host()
    const result = await readActivity(h as unknown as Host, log, '/repo', task())
    expect(result.commits).toEqual([{ id: COMMIT, at: END, message: 'added task activity', remotes: ['origin/main'] }])
    expect(h.run.mock.calls.map(([argv]) => argv[1])).toEqual(['log', 'for-each-ref'])
    expect(h.run.mock.calls[0]![0]).toContain(`${'b'.repeat(40)}..refs/heads/task/one`)
  })

  it('keeps the step when git fails', async () => {
    const h = { run: vi.fn(async () => { throw new Error('folder moved') }) }
    expect(await readActivity(h as unknown as Host, log, '/repo', task())).toMatchObject({ step: step(), gitUnavailable: true })
  })

  it('does not call unverified remote state a push or fail the rest of the history', async () => {
    const h = host()
    h.run.mockImplementation(async argv => argv[1] === 'log' ? ok(`${COMMIT}\0${END}\0message\n`) : { exitCode: 1, stdout: '', stderr: 'failed' })
    expect((await readActivity(h as unknown as Host, log, '/repo', task())).commits[0]!.remotes).toBeNull()
  })

  it('handles an old task with no branch or step without invoking git, and shows no checkpoint commands as steps', async () => {
    const h = host()
    const command = { command: 'npm test', isTest: true, isOk: true, at: END, summary: '24 passed' }
    const old = makeTask({ id: 'old', checkpoint: { ...emptyCheckpoint(), seen: { at: END, files: [], git: null, commands: [command] } } })
    expect(await readActivity(h as unknown as Host, log, '/repo', old)).toEqual({ step: null, commits: [], gitUnavailable: false })
    expect(h.run).not.toHaveBeenCalled()
  })
})

describe("a quest's testing time", () => {
  const span = (at: string, finished: string) => ({ start: Date.parse(at), end: Date.parse(finished) })

  it('a finished check adds its span once, though the step is saved twice', () => {
    const started = keepStep(makeTask({ id: 'one' }), step())
    expect(started.testPeriods).toBeUndefined()

    const finished = keepStep(started, finishStep(step(), { result: { stdout: '1 failed', exitCode: 1 } }, END))
    const again = keepStep(finished, finishStep(step(), { result: { stdout: '1 failed', exitCode: 1 } }, END))

    expect(finished.testPeriods).toEqual([span(AT, END)])
    expect(again.testPeriods).toEqual([span(AT, END)])
  })

  it('two checks running at once count their time once', () => {
    const other = { ...toolStep('Bash', { command: 'npx vitest' }, 'run-2', '2026-11-04T12:00:30Z')! }
    let task = keepStep(makeTask({ id: 'one' }), finishStep(step(), { result: 'passed' }, END))
    task = keepStep(task, finishStep(other, { result: 'passed' }, '2026-11-04T12:01:30Z'))

    expect(task.testPeriods).toEqual([span(AT, '2026-11-04T12:01:30Z')])
  })

  it('a command or an edit adds no testing time', () => {
    const ls = toolStep('Bash', { command: 'ls tests' }, 'ls', AT)!
    const edit = toolStep('Edit', { file_path: 'a.ts' }, 'edit', AT)!
    let task = keepStep(makeTask({ id: 'one' }), finishStep(ls, { result: 'a.test.ts' }, END))
    task = keepStep(task, finishStep(edit, { result: 'ok' }, END))

    expect(ls.kind).toBe('command')
    expect(task.testPeriods).toBeUndefined()
  })

  it('the testing time outlives the step it came from', () => {
    let task = keepStep(makeTask({ id: 'one' }), finishStep(step(), { result: 'passed' }, END))
    task = keepStep(task, toolStep('Bash', { command: 'ls' }, 'ls', END)!)

    expect(task.step?.id).toBe('ls')
    expect(task.testPeriods).toEqual([span(AT, END)])
  })
})

describe('a background shell ending by notification', () => {
  const note = (id: string, status: string, summary: string) =>
    `<task-notification>\n<task-id>${id}</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/${id}.output</output-file>\n<status>${status}</status>\n<summary>${summary}</summary>\n</task-notification>`
  const PASSED = 'Background command "Run the tests" completed (exit code 0)'

  it('a completed run with exit code 0 is a pass', () => {
    expect(notifiedEnds(note('bg-1', 'completed', PASSED))).toEqual([{ id: 'bg-1', isOk: true }])
  })

  it.each([
    ['failed', 'Background command "Run the tests" failed with exit code 1'],
    ['killed', 'Background command "Run the tests" was stopped'],
    ['completed', 'Background command "Run the tests" completed (exit code 2)'],
    ['completed', 'Background command "Run the tests" completed (exit code 10)'],
  ])('a %s run reading "%s" is a failure', (status, summary) => {
    expect(notifiedEnds(note('bg-1', status, summary))).toEqual([{ id: 'bg-1', isOk: false }])
  })

  it('one delivery with two blocks gives both ends, in order', () => {
    const text = `${note('bg-1', 'completed', PASSED)}\nThe other one:\n${note('bg-2', 'failed', 'failed with exit code 1')}`

    expect(notifiedEnds(text).map(end => [end.id, end.isOk])).toEqual([['bg-1', true], ['bg-2', false]])
  })

  it('a block with no status, an unknown status or no id, and plain text, end nothing', () => {
    const monitor = '<task-notification>\n<task-id>mon-1</task-id>\n<event>build finished</event>\n</task-notification>'

    expect(notifiedEnds(monitor)).toEqual([])
    expect(notifiedEnds(note('bg-1', 'running', 'still going'))).toEqual([])
    expect(notifiedEnds(note('', 'completed', PASSED))).toEqual([])
    expect(notifiedEnds('the tests completed (exit code 0)')).toEqual([])
    expect(notifiedEnds('')).toEqual([])
  })

  const launched = (id: string, command = 'npm test') =>
    finishStep(toolStep('Bash', { command }, `run-${id}`, AT)!, { result: { stdout: 'Starting…', backgroundTaskId: id } }, AT)
  const ended = (id: string, isOk = true) => [{ id, isOk }]

  it('ends only the waiting step with that id; the line stays on the step started last', () => {
    const task = keepStep(keepStep(makeTask({ id: 'one' }), launched('bg-1')), launched('bg-2'))
    expect(task.waiting?.map(s => s.backgroundId)).toEqual(['bg-1', 'bg-2'])

    const after = finishNotified(task, ended('bg-1'), END)

    expect(after.waiting?.map(s => s.backgroundId)).toEqual(['bg-2'])
    expect(after.step).toMatchObject({ id: 'run-bg-2', status: 'running' })
    const last = finishNotified(after, ended('bg-2', false), END)
    expect(last.step).toMatchObject({ id: 'run-bg-2', status: 'failed', finished: END })
    expect(last.waiting).toBeUndefined()
  })

  it('a step GetTask already ended stays as it is, and the same task comes back', () => {
    const done = keepStep(keepStep(makeTask({ id: 'one' }), launched('bg-1')), finishStep(launched('bg-1'), { result: '12 passed' }, END))

    expect(done.waiting).toBeUndefined()
    expect(finishNotified(done, ended('bg-1', false), '2026-11-04T12:05:00Z')).toBe(done)
    expect(done.step).toMatchObject({ status: 'succeeded', finished: END })
  })

  it('with nothing to end, the same task comes back', () => {
    const task = keepStep(makeTask({ id: 'one' }), launched('bg-1'))
    const empty = makeTask({ id: 'two' })

    expect(finishNotified(task, ended('bg-9'), END)).toBe(task)
    expect(finishNotified(task, [], END)).toBe(task)
    expect(finishNotified(empty, ended('bg-1'), END)).toBe(empty)
  })

  it('waits on at most the limit of background shells, the newest', () => {
    let task = makeTask({ id: 'one' })
    for (let i = 0; i <= WAITING_LIMIT; i++) task = keepStep(task, launched(`bg-${i}`))

    expect(task.waiting).toHaveLength(WAITING_LIMIT)
    expect(task.waiting![0]!.backgroundId).toBe('bg-1')
  })

  it("a check's span joins the testing time; a command's adds none", () => {
    const check = finishNotified(keepStep(makeTask({ id: 'one' }), launched('bg-1')), ended('bg-1', false), END)
    const server = finishNotified(keepStep(makeTask({ id: 'two' }), launched('bg-2', 'npm run dev')), ended('bg-2'), END)

    expect(check.testPeriods).toEqual([{ start: Date.parse(AT), end: Date.parse(END) }])
    expect(server.step).toMatchObject({ kind: 'command', status: 'succeeded' })
    expect(server.testPeriods).toBeUndefined()
  })
})
