import { describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import { ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, activityEntries, finishActivity, finishNotified, keepActivity, notifiedEnds, toolActivity } from '../../../../../hooks/shared/activity/domain/services/activity'
import { emptyCheckpoint } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { makeTask } from '../api/fixtures'
import { readActivity } from '../data/activity_source'
import { createLogger } from '../../../core/logger'

const AT = '2026-11-04T12:00:00Z'
const END = '2026-11-04T12:01:00Z'
const step = () => toolActivity('Bash', { command: 'npm test' }, 'run-1', AT)!
const log = createLogger('dev', () => {})
const ok = (stdout: string) => ({ exitCode: 0, stdout, stderr: '' })

describe('recorded tool steps', () => {
  it('ignores malformed stored entries without losing valid history', () => {
    expect(activityEntries({ steps: [] })).toEqual([])
    expect(activityEntries([null, { ...step(), kind: 'unexpected' }, { ...step(), at: 'bad date' }, step()])).toEqual([step()])
  })
  it('names the command and starts without claiming success', () => {
    expect(step()).toMatchObject({ subject: 'npm test', kind: 'test', status: 'running', finished: null })
    expect(toolActivity('Edit', { file_path: 'test/a.spec.ts' }, 'edit', AT)).toMatchObject({ kind: 'edit', subject: 'test/a.spec.ts' })
    expect(toolActivity('Read', {}, 'read', AT)).toBeNull()
    expect(toolActivity('Unknown', {}, 'other', AT)).toBeNull()
  })

  it.each([
    [{ result: { stdout: '24 passed', exitCode: 0 } }, 'succeeded'],
    [{ result: { stderr: '1 failed', exitCode: 1 } }, 'failed'],
    [{ result: { exit_code: 2 } }, 'failed'],
    [{ result: { interrupted: true } }, 'failed'],
    [{ isError: true }, 'failed'],
    [{ deny: 'Commits belong to you' }, 'blocked'],
  ] as const)('records the actual outcome of %j', (result, status) => {
    expect(finishActivity(step(), result, END)).toMatchObject({ status, finished: END })
  })

  it('retains output, bounds it, and never saves read file contents', () => {
    expect(finishActivity(step(), { result: { stdout: 'Tests', stderr: 'Failed' } }, END).output).toBe('Tests\nFailed')
    const large = finishActivity(step(), { result: 'x'.repeat(ACTIVITY_TEXT_LIMIT) + 'last line' }, END)
    expect(large.output).toHaveLength(ACTIVITY_TEXT_LIMIT)
    expect(large.output.endsWith('last line')).toBe(true)
    expect(large.truncated).toBe(true)
    const read = toolActivity('Read', { file_path: 'private.txt' }, 'read', AT)!
    expect(finishActivity(read, { result: 'file contents' }, END).output).toBe('')
  })

  it('does not count a background launch as a passing check', () => {
    expect(finishActivity(step(), { result: { stdout: 'Starting…', backgroundTaskId: 'bg-1' } }, END)).toMatchObject({ status: 'running', finished: null })
  })

  it('updates a started step without duplication and bounds retained history', () => {
    const task = makeTask({ id: 'one' })
    const started = keepActivity(task, step())
    const finished = keepActivity(started, finishActivity(step(), { result: 'passed' }, END))
    expect(finished.activity).toHaveLength(1)
    expect(finished.activity![0]!.status).toBe('succeeded')
    expect(task.activity).toBeUndefined()
    let many = task
    for (let index = 0; index <= ACTIVITY_LIMIT; index++) many = keepActivity(many, { ...step(), id: String(index) })
    expect(many.activity).toHaveLength(ACTIVITY_LIMIT)
    expect(many.activity![0]!.id).toBe('1')
  })
})

describe('activity from local git and earlier records', () => {
  const COMMIT = 'a'.repeat(40)
  const task = () => makeTask({ id: 'one', branch: 'task/one', startCommit: 'b'.repeat(40), activity: [step()] })
  const host = () => ({ run: vi.fn(async (argv: string[]) => ok(argv[1] === 'log' ? `${COMMIT}\0${END}\0added task activity\n` : 'refs/remotes/origin/main\nrefs/remotes/origin/HEAD\n')) })

  it('reads the task branch, commit message, and containing remote refs without any mutation or network command', async () => {
    const h = host()
    const result = await readActivity(h as unknown as Host, log, '/repo', task())
    expect(result.commits).toEqual([{ id: COMMIT, at: END, message: 'added task activity', remotes: ['origin/main'] }])
    expect(h.run.mock.calls.map(([argv]) => argv[1])).toEqual(['log', 'for-each-ref'])
    expect(h.run.mock.calls[0]![0]).toContain(`${'b'.repeat(40)}..refs/heads/task/one`)
  })

  it('keeps tool steps when git fails', async () => {
    const h = { run: vi.fn(async () => { throw new Error('folder moved') }) }
    expect(await readActivity(h as unknown as Host, log, '/repo', task())).toMatchObject({ steps: [step()], gitUnavailable: true })
  })

  it('does not call unverified remote state a push or fail the rest of the history', async () => {
    const h = host()
    h.run.mockImplementation(async argv => argv[1] === 'log' ? ok(`${COMMIT}\0${END}\0message\n`) : { exitCode: 1, stdout: '', stderr: 'failed' })
    expect((await readActivity(h as unknown as Host, log, '/repo', task())).commits[0]!.remotes).toBeNull()
  })

  it('handles an old task with no branch or activity without invoking git', async () => {
    const h = host()
    expect(await readActivity(h as unknown as Host, log, '/repo', makeTask({ id: 'old' }))).toEqual({ steps: [], commits: [], gitUnavailable: false })
    expect(h.run).not.toHaveBeenCalled()
  })

  it('exposes checkpoint summaries once, including a command finished during a recorded step', async () => {
    const command = { command: 'npm test', isTest: true, isOk: true, at: END, summary: '24 passed' }
    const old = makeTask({ id: 'old', checkpoint: { ...emptyCheckpoint(), seen: { at: END, files: [], git: null, commands: [command] } } })
    const h = host() as unknown as Host
    const before = await readActivity(h, log, '/repo', old)
    expect(before.steps).toHaveLength(1)
    expect(before.steps[0]).toMatchObject({ output: '24 passed', truncated: true })
    old.activity = [finishActivity(step(), { result: '24 passed' }, END)]
    expect((await readActivity(h, log, '/repo', old)).steps).toHaveLength(1)
  })
})

describe("a quest's testing time", () => {
  const span = (at: string, finished: string) => ({ start: Date.parse(at), end: Date.parse(finished) })

  it('a finished check adds its span once, though the step is saved twice', () => {
    const started = keepActivity(makeTask({ id: 'one' }), step())
    expect(started.testPeriods).toBeUndefined()

    const finished = keepActivity(started, finishActivity(step(), { result: { stdout: '1 failed', exitCode: 1 } }, END))
    const again = keepActivity(finished, finishActivity(step(), { result: { stdout: '1 failed', exitCode: 1 } }, END))

    expect(finished.testPeriods).toEqual([span(AT, END)])
    expect(again.testPeriods).toEqual([span(AT, END)])
  })

  it('two checks running at once count their time once', () => {
    const other = { ...toolActivity('Bash', { command: 'npx vitest' }, 'run-2', '2026-11-04T12:00:30Z')! }
    let task = keepActivity(makeTask({ id: 'one' }), finishActivity(step(), { result: 'passed' }, END))
    task = keepActivity(task, finishActivity(other, { result: 'passed' }, '2026-11-04T12:01:30Z'))

    expect(task.testPeriods).toEqual([span(AT, '2026-11-04T12:01:30Z')])
  })

  it('a command or an edit adds no testing time', () => {
    const ls = toolActivity('Bash', { command: 'ls tests' }, 'ls', AT)!
    const edit = toolActivity('Edit', { file_path: 'a.ts' }, 'edit', AT)!
    let task = keepActivity(makeTask({ id: 'one' }), finishActivity(ls, { result: 'a.test.ts' }, END))
    task = keepActivity(task, finishActivity(edit, { result: 'ok' }, END))

    expect(ls.kind).toBe('command')
    expect(task.testPeriods).toBeUndefined()
  })

  it('the testing time outlives the steps the activity list lets go', () => {
    let task = keepActivity(makeTask({ id: 'one' }), finishActivity(step(), { result: 'passed' }, END))
    for (let index = 0; index <= ACTIVITY_LIMIT; index++) task = keepActivity(task, { ...toolActivity('Bash', { command: 'ls' }, `ls-${index}`, END)! })

    expect(task.activity!.some(entry => entry.id === 'run-1')).toBe(false)
    expect(task.testPeriods).toEqual([span(AT, END)])
  })
})

describe('a background shell ending by notification', () => {
  const note = (id: string, status: string, summary: string) =>
    `<task-notification>\n<task-id>${id}</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/${id}.output</output-file>\n<status>${status}</status>\n<summary>${summary}</summary>\n</task-notification>`
  const PASSED = 'Background command "Run the tests" completed (exit code 0)'

  it('a completed run with exit code 0 is a pass', () => {
    expect(notifiedEnds(note('bg-1', 'completed', PASSED))).toEqual([{ id: 'bg-1', isOk: true, summary: PASSED }])
  })

  it.each([
    ['failed', 'Background command "Run the tests" failed with exit code 1'],
    ['killed', 'Background command "Run the tests" was stopped'],
    ['completed', 'Background command "Run the tests" completed (exit code 2)'],
    ['completed', 'Background command "Run the tests" completed (exit code 10)'],
  ])('a %s run reading "%s" is a failure', (status, summary) => {
    expect(notifiedEnds(note('bg-1', status, summary))).toEqual([{ id: 'bg-1', isOk: false, summary }])
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
    finishActivity(toolActivity('Bash', { command }, `run-${id}`, AT)!, { result: { stdout: 'Starting…', backgroundTaskId: id } }, AT)
  const ended = (id: string, isOk = true) => [{ id, isOk, summary: isOk ? PASSED : 'failed with exit code 1' }]

  it('ends only the running step with that id, with the summary as its output', () => {
    const task = keepActivity(keepActivity(makeTask({ id: 'one' }), launched('bg-1')), launched('bg-2'))

    const step = (t: typeof task, id: string) => t.activity!.find(entry => entry.backgroundId === id)

    const after = finishNotified(task, ended('bg-1'), END)

    expect(after.activity).toHaveLength(2)
    expect(step(after, 'bg-1')).toMatchObject({ status: 'succeeded', finished: END, output: PASSED })
    expect(step(after, 'bg-2')).toMatchObject({ status: 'running', finished: null })
    expect(step(finishNotified(task, ended('bg-2', false), END), 'bg-2')).toMatchObject({ status: 'failed', finished: END })
  })

  it('a step GetTask already ended stays as it is, and the same task comes back', () => {
    const done = keepActivity(makeTask({ id: 'one' }), finishActivity(launched('bg-1'), { result: '12 passed' }, END))

    expect(finishNotified(done, ended('bg-1', false), '2026-11-04T12:05:00Z')).toBe(done)
    expect(done.activity![0]).toMatchObject({ status: 'succeeded', output: '12 passed', finished: END })
  })

  it('with nothing to end, the same task comes back', () => {
    const task = keepActivity(makeTask({ id: 'one' }), launched('bg-1'))
    const empty = makeTask({ id: 'two' })

    expect(finishNotified(task, ended('bg-9'), END)).toBe(task)
    expect(finishNotified(task, [], END)).toBe(task)
    expect(finishNotified(empty, ended('bg-1'), END)).toBe(empty)
  })

  it("a check's span joins the testing time; a command's adds none", () => {
    const check = finishNotified(keepActivity(makeTask({ id: 'one' }), launched('bg-1')), ended('bg-1', false), END)
    const server = finishNotified(keepActivity(makeTask({ id: 'two' }), launched('bg-2', 'npm run dev')), ended('bg-2'), END)

    expect(check.testPeriods).toEqual([{ start: Date.parse(AT), end: Date.parse(END) }])
    expect(server.activity![0]).toMatchObject({ kind: 'command', status: 'succeeded' })
    expect(server.testPeriods).toBeUndefined()
  })
})
