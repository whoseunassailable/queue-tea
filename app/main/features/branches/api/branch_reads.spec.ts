import { beforeEach, expect, it, vi } from 'vitest'
import type { BranchGraph, BranchReview, MergeWorkspace } from '../../../../shared/branches'
import { createLogger } from '../../../core/logger'
import { scopeOf, type TasksDeps } from '../../tasks/api/scope'
import { graphOf, reviewOf } from '../data/branch_source'
import { workspaceOf } from '../data/merge_workspace'
import { readBranch, readBranches, readMergeWorkspace } from './branch_api'

vi.mock('../../tasks/api/scope', () => ({ scopeOf: vi.fn(async (_d, key) => ({ key, ctx: { projectPath: '/repo' }, record: { tasks: [{ id: 'one', branch: 'task/one', baseBranch: 'main' }] } })) }))
vi.mock('../data/branch_source', () => ({ graphOf: vi.fn(), reviewOf: vi.fn() }))
vi.mock('../data/merge_workspace', () => ({ workspaceOf: vi.fn() }))
vi.mock('../data/commit_progress', () => ({ readCommitProgress: async () => null }))
vi.mock('../data/operation_store', () => ({ loadOperation: async (_d: unknown, _key: string, id: string) => ({ id }), operationsOf: async () => [] }))
const pending = <T>() => { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done }); return { promise, resolve } }
const d = () => ({ log: createLogger('dev', () => {}) }) as TasksDeps
beforeEach(() => vi.clearAllMocks())

it('shares only outstanding graph reads, then reads again for a fresh final result', async () => {
  const deps = d(); const work = pending<BranchGraph>()
  vi.mocked(graphOf).mockReturnValue(work.promise)
  const reads = Array.from({ length: 30 }, () => readBranches(deps, 'realm'))
  await vi.waitFor(() => expect(graphOf).toHaveBeenCalledTimes(1))
  work.resolve({ at: 1 } as BranchGraph)
  expect((await Promise.all(reads)).every(r => r.ok && r.data.at === 1)).toBe(true)
  vi.mocked(graphOf).mockResolvedValue({ at: 2 } as BranchGraph)
  expect(await readBranches(deps, 'realm')).toMatchObject({ ok: true, data: { at: 2 } })
})

it('shares matching branch and merge reads without conflating realms, destinations or operations', async () => {
  const deps = d(); const review = pending<BranchReview>(); const workspace = pending<MergeWorkspace>()
  vi.mocked(reviewOf).mockImplementation(async (_d, _scope, _task, target) => ({ ...await review.promise, target }))
  vi.mocked(workspaceOf).mockReturnValue(workspace.promise)
  const reads = [readBranch(deps, 'realm', 'one', 'main'), readBranch(deps, 'realm', 'one', 'main'), readBranch(deps, 'realm', 'one', 'stage'), readBranch(deps, 'other', 'one', 'main')]
  const merges = [readMergeWorkspace(deps, 'realm', 'op-1'), readMergeWorkspace(deps, 'realm', 'op-1'), readMergeWorkspace(deps, 'realm', 'op-2')]
  await vi.waitFor(() => { expect(reviewOf).toHaveBeenCalledTimes(3); expect(workspaceOf).toHaveBeenCalledTimes(2) })
  review.resolve({} as BranchReview); workspace.resolve({ checksCurrent: false } as MergeWorkspace)
  expect((await Promise.all(reads)).map(r => r.ok && r.data.target)).toEqual(['main', 'main', 'stage', 'main'])
  await Promise.all(merges)
  expect(scopeOf).toHaveBeenCalledTimes(5)
})

it('releases failed reads for retry and keeps engines separate', async () => {
  const deps = d()
  vi.mocked(graphOf).mockRejectedValueOnce(new Error('disk unavailable'))
  expect(await readBranches(deps, 'realm')).toMatchObject({ ok: false })
  vi.mocked(graphOf).mockResolvedValue({ at: 3 } as BranchGraph)
  expect(await readBranches(deps, 'realm')).toMatchObject({ ok: true })
  await readBranches(d(), 'realm')
  expect(graphOf).toHaveBeenCalledTimes(3)
})
