import { describe, expect, it, vi } from 'vitest'

import type { Ctx } from '../../../../../hooks/core/env/env'
import type { Deps } from '../../../../../hooks/features/tasks/domain/usecases/deps'
import { startTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/start_task'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { ProjectRecord, Task } from '../../../../../types'
import { makeTask } from '../api/fixtures'

const ctx: Ctx = { cwd: '/repo', home: '/home', projectPath: '/repo', projectName: 'repo', file: '/record', offsetMinutes: 0, options: { idleGapMinutes: 15, freshAtTokens: 100_000, handoffAtPercent: 90, checkTimeoutSeconds: 10 } }

// All git calls are fakes: these tests never create or switch real branches.
const setup = (over: Partial<Task> = {}) => {
  let record = { ...emptyRecord('repo', '/repo'), tasks: [makeTask({ id: 'one', title: 'Task activity', ...over })] }
  let id = 0
  const d: Deps = {
    records: {
      read: async () => record,
      update: vi.fn(async (change: (r: ProjectRecord) => ProjectRecord) => (record = change(record))),
      problem: async () => null, restore: async () => 'no-copy', others: async () => [],
    },
    git: {
      state: async () => ({ isRepo: true, branch: 'main', head: 'abc1234', isDetached: false, uncommitted: 0, unpushed: 0, hasUpstream: true }),
      branches: async () => ['main', 'task/resumed'], head: async () => ({ commit: 'a'.repeat(40), branch: 'main' }),
      make: vi.fn(async () => {}), switchTo: vi.fn(async () => {}), facts: async () => null,
      diffSince: async () => ({ linesAdded: 0, linesRemoved: 0, filesTouched: 0 }), drift: async () => [], commitsBetween: async () => [],
    },
    taskLog: {} as Deps['taskLog'],
    codex: { activitySince: async () => [] },
    env: { now: async () => Date.parse('2026-11-04T12:00:00Z'), newId: () => `activity-${++id}`, log: vi.fn() },
  }

  return { d, record: () => record }
}

describe('branch activity', () => {
  it('records both creation and switching after a new branch succeeds', async () => {
    const { d, record } = setup()
    expect((await startTaskUseCase(d, ctx, 'one')).kind).toBe('started')
    expect(record().tasks[0]!.activity?.map(step => step.kind)).toEqual(['branchCreated', 'branchSwitched'])
    expect(record().tasks[0]!.activity?.every(step => step.status === 'succeeded' && step.subject === 'task/task-activity')).toBe(true)
  })

  it('records only switching when resuming an existing branch', async () => {
    const { d, record } = setup({ branch: 'task/resumed' })
    await startTaskUseCase(d, ctx, 'one')
    expect(record().tasks[0]!.activity?.map(step => step.kind)).toEqual(['branchSwitched'])
    expect(d.git.make).not.toHaveBeenCalled()
  })

  it('records no successful step when git fails and returns the task to the queue', async () => {
    const { d, record } = setup()
    vi.mocked(d.git.make).mockRejectedValue(new Error('git failed'))
    expect((await startTaskUseCase(d, ctx, 'one')).kind).toBe('branch_failed')
    expect(record().tasks[0]).toMatchObject({ state: 'queued', branch: null })
    expect(record().tasks[0]!.activity).toBeUndefined()
  })

  it('does not repeat a successful branch operation if recording its activity fails', async () => {
    const { d } = setup()
    vi.mocked(d.records.update).mockImplementationOnce(async change => change(await d.records.read() as ProjectRecord)).mockRejectedValueOnce(new Error('record unavailable'))
    expect((await startTaskUseCase(d, ctx, 'one')).kind).toBe('started')
    expect(d.git.make).toHaveBeenCalledTimes(1)
    expect(d.env.log).toHaveBeenCalled()
  })
})
