import { describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import { ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, activityEntries, finishActivity, keepActivity, toolActivity } from '../../../../../hooks/shared/activity/domain/services/activity'
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
