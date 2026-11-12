// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'
import type { BranchGraph, BranchReview, MergeWorkspace } from '../../shared/branches'
import type { Reply } from '../../shared/engine_api'
import { fakeEngine, projectView } from '../test_support'
import { branchGraph, branchReview, mergeOperation, mergeWorkspace } from '../features/branches/test_fixtures'
import { BranchesPage } from '../features/branches/presentation/pages/branches_page'
import type { QuestActions } from '../features/quests/presentation/state_management/flow_keys'

afterEach(() => { cleanup(); vi.useRealTimers() })

it('bounds reads with graph, review and checks open, refreshes final output and closes while checking', async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
  const slow = <T,>(initial: T) => {
    const answers: ((reply: Reply<T>) => void)[] = []
    const read = vi.fn(() => read.mock.calls.length === 1 ? Promise.resolve({ ok: true as const, data: initial }) : new Promise<Reply<T>>(resolve => answers.push(resolve)))
    return { read, answers }
  }
  const graph = slow<BranchGraph>(branchGraph())
  const review = slow<BranchReview>(branchReview({ operation: mergeOperation() }))
  const workspace = mergeWorkspace({ checksCurrent: false, availableChecks: [{ id: 'test', name: 'test', folder: '.', command: 'npm test' }], checks: [{ id: 'run', checkId: 'test', name: 'test', command: 'npm test', tree: mergeOperation().tree!, at: Date.now(), finished: null, owner: 1, status: 'running', exitCode: null, output: 'checking now', truncated: false }] })
  const merge = slow<MergeWorkspace>(workspace)
  const { engine, fire } = fakeEngine({ readBranches: graph.read, readBranch: review.read, readMergeWorkspace: merge.read })
  const view = projectView('a-000001')
  if (view.kind !== 'readable') throw new Error('Expected readable fixture')
  await act(async () => { render(<BranchesPage engine={engine} view={view} actions={{} as QuestActions} flow={undefined} onOpen={() => {}} />) })
  const open = await screen.findByRole('button', { name: 'Review work' })
  await act(async () => { fireEvent.click(open) })
  expect(await screen.findByRole('log')).toHaveProperty('textContent', 'checking now')
  await act(async () => { vi.advanceTimersByTime(5000); for (let n = 0; n < 30; n++) fire() })
  expect(graph.read).toHaveBeenCalledTimes(2) // The open review suspends the graph timer; events still refresh it.
  expect(review.read).toHaveBeenCalledTimes(2)
  expect(merge.read).toHaveBeenCalledTimes(2)
  // The read that started while running can finish before the final read.
  await act(async () => merge.answers[0]!({ ok: true, data: workspace }))
  await vi.waitFor(() => expect(merge.read).toHaveBeenCalledTimes(3))
  await act(async () => merge.answers[1]!({ ok: true, data: { ...workspace, checksCurrent: true, checks: [{ ...workspace.checks![0]!, status: 'succeeded', exitCode: 0, finished: Date.now(), output: 'final passed output' }] } }))
  expect(await screen.findByText('Passed')).toBeTruthy()
  expect(screen.getByRole('log')).toHaveProperty('textContent', 'final passed output')
  // Another in-progress read may land after closing; it must not reopen the sheet or start trailing work.
  await act(async () => { fire(); fireEvent.click(screen.getByRole('button', { name: 'Close' })) })
  expect(screen.queryByRole('dialog')).toBeNull()
  const mergeCalls = merge.read.mock.calls.length
  const reviewCalls = review.read.mock.calls.length
  await act(async () => { for (const answer of review.answers) answer({ ok: true, data: branchReview() }); for (const answer of merge.answers.slice(2)) answer({ ok: true, data: workspace }); vi.advanceTimersByTime(5000) })
  expect(review.read).toHaveBeenCalledTimes(reviewCalls)
  expect(merge.read).toHaveBeenCalledTimes(mergeCalls)
  expect(engine.cancelMergeChecks).not.toHaveBeenCalled()
})
