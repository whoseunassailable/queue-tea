// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { EngineApi, Reply } from '../../shared/engine_api'
import type { BranchReview as Review } from '../../shared/branches'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { activeQuest, fakeEngine, helperJob, projectView } from '../test_support'
import { branchGraph, branchReview, mergeOperation, mergeWorkspace, MERGE } from '../features/branches/test_fixtures'
import { BranchReview } from '../features/branches/presentation/widgets/branch_review'
import { MergeReview } from '../features/branches/presentation/widgets/merge_review'
import { App } from './app'

const KEY = 'a-000001'
const one = activeQuest({ id: 'one', title: 'Auto update', worktreePath: '/quests/one', baseBranch: 'main' })
const two = activeQuest({ id: 'two', title: 'Settings option', branch: 'task/settings', worktreePath: '/quests/two', baseBranch: 'main', codexSince: '2026-11-03T12:00:00Z' })
const view = projectView(KEY, { active: one, activeQuests: [one, two] })
const open = async (over: Partial<EngineApi> = {}) => {
  const graph = branchGraph()
  graph.tasks[0]!.state = 'working'
  graph.tasks.push({ ...graph.tasks[0]!, id: two.id, title: two.title, branch: two.branch!, state: 'unobserved' })
  const { engine, fire } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), readBranches: async () => ({ ok: true, data: graph }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => { render(<App workspace={workspace} engine={engine} />); await workspace.start() })
  return { engine, workspace, fire }
}
const openReview = async (over: Partial<EngineApi> = {}) => {
  const { engine, fire } = fakeEngine(over)
  await act(async () => { render(<BranchReview engine={engine} realm={KEY} id="one" onClose={() => {}} />) })
  return { engine, fire }
}
const click = async (button: HTMLElement) => act(() => void fireEvent.click(button))
beforeEach(() => { window.location.hash = '#/branches' })
afterEach(cleanup)

it('draws real history and pulses only observed working tasks, while both terminals remain usable', async () => {
  const { engine } = await open()
  expect(await screen.findByRole('img', { name: /actual commit parents/ })).toBeTruthy()
  expect(screen.getByText('2 in progress')).toBeTruthy()
  const working = screen.getByRole('article', { name: one.title })
  const unobserved = screen.getByRole('article', { name: two.title })
  expect(working.querySelector('.observed-working')).toBeTruthy()
  expect(unobserved.querySelector('.observed-working')).toBeNull()
  await click(within(unobserved).getByRole('button', { name: 'Show Codex' }))
  expect(engine.openClaude).toHaveBeenCalledWith(KEY, 'two')
  await click(within(working).getByRole('button', { name: 'Review work' }))
  expect(await screen.findByRole('dialog', { name: 'Review work' })).toBeTruthy()
  expect(engine.completeMerge).not.toHaveBeenCalled()
})

it('shows loading, failure and retry without issuing a Git mutation', async () => {
  let answer!: (reply: Reply<Review>) => void
  const { engine } = await openReview({ readBranch: () => new Promise(resolve => { answer = resolve }) })
  expect(screen.getByText('Reading changes and checking both branches…')).toBeTruthy()
  await act(() => answer({ ok: false, error: { message: 'The branch could not be read. Try again.' } }))
  expect(await screen.findByText('The branch could not be read. Try again.')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
  expect(engine.prepareMerge).not.toHaveBeenCalled()
})

it('requires explicit idle confirmation to prepare, then a separate approval to merge', async () => {
  const { engine } = await openReview()
  const prepare = await screen.findByRole('button', { name: 'Prepare merge for review' }) as HTMLButtonElement
  expect(prepare.disabled).toBe(true)
  await click(await screen.findByRole('checkbox', { name: /I have stopped/ }))
  await click(prepare)
  expect(engine.prepareMerge).toHaveBeenCalledWith(KEY, expect.objectContaining({ taskId: 'one', target: 'main', idleConfirmed: true }))
  const merge = await screen.findByRole('button', { name: 'Merge task/first into main' }) as HTMLButtonElement
  expect(merge.disabled).toBe(true)
  expect(engine.completeMerge).not.toHaveBeenCalled()
  await click(await screen.findByRole('button', { name: 'Open integration folder' }))
  expect(engine.openMergeFolder).toHaveBeenCalledWith(KEY, expect.any(String))
  await click(await screen.findByRole('checkbox', { name: /I have stopped/ }))
  await click(merge)
  expect(engine.completeMerge).toHaveBeenCalledWith(KEY, expect.objectContaining({ approval: 'approval', message: 'Merge task/first into main' }))
  expect(engine.pushMerge).not.toHaveBeenCalled()
})

it('shows stale approval failures and retains the prepared merge for review', async () => {
  const { engine } = fakeEngine({ completeMerge: vi.fn(async () => ({ ok: false as const, error: { message: 'The branches changed. Review again.' } })) })
  await act(async () => { render(<MergeReview engine={engine} realm={KEY} id="operation" remotes={[]} onChanged={() => {}} />) })
  await click(await screen.findByRole('checkbox', { name: /I have stopped/ }))
  await click(await screen.findByRole('button', { name: 'Merge task/first into main' }))
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'The branches changed. Review again.')
  expect(screen.getByRole('button', { name: 'Refresh branches' })).toBeTruthy()
  expect(engine.pushMerge).not.toHaveBeenCalled()
})

it('renders observed check output without treating missing checks as passing', async () => {
  await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ steps: [{ id: 'test', at: '2026-11-04T12:00:00Z', finished: '2026-11-04T12:00:01Z', kind: 'test', status: 'failed', subject: 'npm test', output: '1 test failed', truncated: false }] }) }) })
  await click(await screen.findByRole('tab', { name: 'Checks' }))
  expect(screen.getByText('npm test')).toBeTruthy()
  expect(screen.getByText('1 test failed')).toBeTruthy()
  expect(screen.getByText('Failed')).toBeTruthy()
  expect(screen.getByText(/not certified against the current commit/)).toBeTruthy()
})

it('selects only user-chosen files and validates the commit message', async () => {
  const { engine } = await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ files: [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }] }) }) })
  await click(await screen.findByRole('tab', { name: 'Changes' }))
  await click(await screen.findByRole('checkbox', { name: /a.ts/ }))
  await click(screen.getAllByRole('checkbox', { name: /I have stopped/ })[0]!)
  await click(await screen.findByRole('button', { name: 'Commit selected files' }))
  expect(screen.getByText('Commit message is required.')).toBeTruthy()
  expect(engine.commitBranchFiles).not.toHaveBeenCalled()
  await act(() => void fireEvent.input(screen.getByLabelText('Commit message *'), { target: { value: 'Review selected work' } }))
  await click(await screen.findByRole('button', { name: 'Commit selected files' }))
  expect(engine.commitBranchFiles).toHaveBeenCalledWith(KEY, expect.objectContaining({ files: ['a.ts'], message: 'Review selected work' }))
})

it('keeps the review usable and the ticked files while it rereads in the background', async () => {
  const files = [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }]
  let answer: ((reply: Reply<Review>) => void) | null = null
  let reads = 0
  const { fire } = await openReview({ readBranch: () => (++reads === 1 ? Promise.resolve({ ok: true as const, data: branchReview({ files }) }) : new Promise(resolve => { answer = resolve })) })
  await click(await screen.findByRole('tab', { name: 'Changes' }))
  await click(await screen.findByRole('checkbox', { name: /a.ts/ }))
  await act(() => fire())
  expect(answer).not.toBeNull()
  const box = screen.getByRole('checkbox', { name: /b.ts/ }) as HTMLInputElement
  expect(box.disabled).toBe(false)
  expect((screen.getByRole('button', { name: 'Commit selected files' }) as HTMLButtonElement).disabled).toBe(true) // only for the idle tick
  // A session writing in the worktree changes the fingerprint; what's ticked stays.
  await act(() => answer!({ ok: true, data: branchReview({ files, fingerprint: 'f'.repeat(64) }) }))
  expect((screen.getByRole('checkbox', { name: /a.ts/ }) as HTMLInputElement).checked).toBe(true)
})

it('ticks every changed file at once and clears them again', async () => {
  await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ files: [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }] }) }) })
  await click(await screen.findByRole('tab', { name: 'Changes' }))
  await click(await screen.findByRole('checkbox', { name: 'Select all files' }))
  expect(screen.getAllByRole('checkbox', { name: /\.ts/ }).every(box => (box as HTMLInputElement).checked)).toBe(true)
  await click(screen.getByRole('checkbox', { name: 'Select all files' }))
  expect(screen.getAllByRole('checkbox', { name: /\.ts/ }).some(box => (box as HTMLInputElement).checked)).toBe(false)
})

it('resolves conflicts with branch-labelled sides and rejects remaining markers', async () => {
  const { engine } = fakeEngine({ readMergeWorkspace: async () => ({ ok: true, data: mergeWorkspace({ operation: mergeOperation({ stage: 'conflicts' }), approval: null, conflicts: [{ path: 'a.ts', base: 'base', target: 'main', source: 'feature', result: '<<<<<<< HEAD\nmain\n=======\nfeature\n>>>>>>> task', editable: true }] }) }) })
  await act(async () => { render(<MergeReview engine={engine} realm={KEY} id="operation" remotes={[]} onChanged={() => {}} />) })
  await click(await screen.findByRole('button', { name: 'Save resolved file' }))
  expect(screen.getByText('Remove all conflict markers before saving.')).toBeTruthy()
  expect(engine.resolveMergeFile).not.toHaveBeenCalled()
  await act(() => void fireEvent.input(screen.getByLabelText('Resolved result'), { target: { value: 'combined result' } }))
  await click(await screen.findByRole('button', { name: 'Save resolved file' }))
  expect(engine.resolveMergeFile).toHaveBeenCalledWith(KEY, expect.objectContaining({ path: 'a.ts', choice: 'edited', text: 'combined result' }))
})

describe('a helper on a merge with conflicts', () => {
  const OP = mergeOperation().id
  const conflicted = async (over: Partial<EngineApi> = {}) => {
    const conflicts = [{ path: 'a.ts', base: 'base', target: 'main', source: 'feature', result: null, editable: true }]
    const { engine, tellHelpers } = fakeEngine({ readMergeWorkspace: async () => ({ ok: true, data: mergeWorkspace({ operation: mergeOperation({ stage: 'conflicts' }), approval: null, conflicts }) }), ...over })
    await act(async () => { render(<MergeReview engine={engine} realm={KEY} id={OP} remotes={[]} onChanged={() => {}} />) })
    await screen.findByRole('region', { name: 'Helpers for this merge' })
    return { engine, tellHelpers }
  }
  const zone = () => document.querySelector('.merge-review') as HTMLElement
  const carrying = (id: string) => ({ types: ['application/x-queue-tea-helper'], getData: (type: string) => (type === 'application/x-queue-tea-helper' ? id : '') })

  it('resolves the conflicts with the helper dropped on it', async () => {
    const { engine } = await conflicted()
    await act(() => void fireEvent.dragOver(zone(), { dataTransfer: carrying('commit-chai-n') }))
    expect(zone().classList.contains('dropping')).toBe(true)
    await act(() => void fireEvent.drop(zone(), { dataTransfer: carrying('commit-chai-n') }))
    expect(engine.concileMerge).toHaveBeenCalledWith(KEY, 'commit-chai-n', OP)
    expect(zone().classList.contains('dropping')).toBe(false)
  })

  it('takes a helper pressed from the keyboard, and ignores a drop that carries no helper', async () => {
    const { engine } = await conflicted()
    await act(() => void fireEvent.drop(zone(), { dataTransfer: carrying('someone') }))
    expect(engine.concileMerge).not.toHaveBeenCalled()
    await click(screen.getByRole('button', { name: 'Send Tea-DD to resolve these conflicts' }))
    expect(engine.concileMerge).toHaveBeenCalledWith(KEY, 'tea-dd', OP)
  })

  it('holds the merge while the helper works, then shows what it said', async () => {
    const { engine, tellHelpers } = await conflicted()
    await act(() => tellHelpers([helperJob({ helper: 'chai-pter', merge: OP, doing: { kind: 'editing', target: 'a.ts' } }), helperJob({ helper: 'tea-dd', status: 'working' })]))
    expect(screen.getByText(/Chai-pter: Editing a.ts/)).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Use destination version' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Send Commit Chai-n to resolve these conflicts' }) as HTMLButtonElement).disabled).toBe(true)
    await act(() => void fireEvent.drop(zone(), { dataTransfer: carrying('commit-chai-n') }))
    expect(engine.concileMerge).not.toHaveBeenCalled()
    await click(screen.getByRole('button', { name: 'Stop' }))
    expect(engine.stopHelper).toHaveBeenCalledWith('chai-pter')
    await act(() => tellHelpers([helperJob({ helper: 'chai-pter', merge: OP, status: 'done', reply: 'Kept both constants.' })]))
    expect(screen.getByText('Kept both constants.')).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Use destination version' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('says why a helper could not be sent', async () => {
    await conflicted({ concileMerge: async () => ({ ok: false, error: { message: 'This merge has no conflicts left to resolve.' } }) })
    await click(screen.getByRole('button', { name: 'Send Tea-DD to resolve these conflicts' }))
    expect((await screen.findByRole('alert')).textContent).toBe('This merge has no conflicts left to resolve.')
  })
})

it('does not contact a remote until requested and keeps the local merge after push failure', async () => {
  const { engine } = fakeEngine({ readMergeWorkspace: async () => ({ ok: true, data: mergeWorkspace({ operation: mergeOperation({ stage: 'merged', commit: MERGE }), approval: null }) }) })
  await act(async () => { render(<MergeReview engine={engine} realm={KEY} id="operation" remotes={['origin']} onChanged={() => {}} />) })
  expect(await screen.findByText(/Merged locally into main/)).toBeTruthy()
  expect(engine.readPush).not.toHaveBeenCalled()
  await click(await screen.findByRole('button', { name: 'Check remote for push' }))
  expect(engine.readPush).toHaveBeenCalledWith(KEY, expect.any(String), 'origin')
  expect(screen.getByText('Remote unavailable.')).toBeTruthy()
  expect(await screen.findByText(/Merged locally into main/)).toBeTruthy()
})

it('keeps both active cards usable on Home', async () => {
  window.location.hash = '#/home'
  const { engine } = await open()
  expect(screen.getByRole('heading', { name: one.title })).toBeTruthy()
  expect(screen.getByRole('heading', { name: two.title })).toBeTruthy()
  await click(await screen.findByRole('button', { name: 'Show Codex' }))
  expect(engine.openClaude).toHaveBeenCalledWith(KEY, 'two')
})
