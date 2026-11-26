// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { EngineApi, Reply } from '../../shared/engine_api'
import type { BranchReview as Review } from '../../shared/branches'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { activeQuest, fakeEngine, helperJob, projectView } from '../test_support'
import { branchGraph, branchReview, mergeOperation, mergeWorkspace, MERGE, SOURCE } from '../features/branches/test_fixtures'
import { BranchReview } from '../features/branches/presentation/widgets/branch_review'
import { MergeReview } from '../features/branches/presentation/widgets/merge_review'
import { t } from '../l10n/en'
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

it('places an enabled close control in the dialog header', async () => {
  const close = vi.fn()
  const { engine } = fakeEngine({ readBranch: async () => ({ ok: true, data: branchReview({ operation: mergeOperation() }) }), runMergeChecks: () => new Promise(() => {}) })
  await act(async () => { render(<BranchReview engine={engine} realm={KEY} id="one" onClose={close} />) })
  const dialog = await screen.findByRole('dialog', { name: 'Review work' })
  const header = dialog.querySelector('.sheet-heading')!
  expect(header).toBeTruthy()
  await click(within(header as HTMLElement).getByRole('button', { name: 'Close' }))
  expect(close).toHaveBeenCalledTimes(1)
  expect(engine.cancelMergeChecks).not.toHaveBeenCalled()
})

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

it("lists the in-app check runner's latest result for each check, without its output", async () => {
  const run = { id: 'run', checkId: 'test', name: 'test', command: 'npm run test — vitest run', tree: mergeOperation().tree!, at: 1, finished: 2, owner: 1, status: 'failed' as const, output: '1 test failed', exitCode: 1, truncated: false }
  await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ checks: [run] }) }) })
  await click(await screen.findByRole('tab', { name: 'Checks' }))
  const panel = screen.getByRole('tabpanel', { name: 'Checks' })
  expect(within(panel).getByText('npm run test — vitest run')).toBeTruthy()
  expect(within(panel).getByText('Failed')).toBeTruthy()
  expect(within(panel).getByText(t.branches.exitCode(1))).toBeTruthy()
  expect(within(panel).queryByText('1 test failed')).toBeNull()
  expect(within(panel).getByText(t.branches.checkHint)).toBeTruthy()
})

it('says no checks were observed when the check runner has none, and has no step log', async () => {
  await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ checks: [] }) }) })
  await click(await screen.findByRole('tab', { name: 'Checks' }))
  expect(screen.getByText(t.branches.noChecks)).toBeTruthy()
  expect(screen.queryByRole('tab', { name: 'Activity' })).toBeNull()
})

it("shows the step the task is on in the review's overview", async () => {
  const step = { id: 'run', at: '2026-11-04T12:00:00Z', finished: null, kind: 'test' as const, status: 'running' as const, subject: 'npm test' }
  await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ state: 'working', step }) }) })
  const line = await screen.findByLabelText(t.activity.stepLabel)
  expect(line.textContent).toContain(t.activity.now)
  expect(line.textContent).toContain(t.activity.doing.test)
  expect(line.textContent).toContain('npm test')
})

it('shows dependency setup instructions, keeps merging blocked, and lets the user retry checks', async () => {
  const workspace = mergeWorkspace({ availableChecks: [{ id: 'build', name: 'docs: build', folder: 'docs', command: 'npm run build' }], checksCurrent: false,
    checks: [{ id: 'setup', checkId: 'build', name: 'docs: build', command: 'npm run build', tree: mergeOperation().tree!, at: 1, finished: 2, owner: 1, status: 'setupRequired', output: 'Package folder: /integration/docs\nnpm ci --offline', exitCode: null, truncated: false }] })
  const { engine } = fakeEngine({ readMergeWorkspace: async () => ({ ok: true, data: workspace }) })
  await act(async () => { render(<MergeReview engine={engine} realm={KEY} id="operation" remotes={[]} onChanged={() => {}} />) })
  expect(await screen.findByText('Dependency setup required')).toBeTruthy()
  expect(screen.getByRole('log', { name: 'Live output: docs: build' }).textContent).toContain('npm ci --offline')
  await click(screen.getByRole('checkbox', { name: /I have stopped/ }))
  expect((screen.getByRole('button', { name: 'Merge task/first into main' }) as HTMLButtonElement).disabled).toBe(true)
  await click(screen.getByRole('checkbox', { name: /docs: build/ }))
  await click(screen.getByRole('button', { name: 'Run selected checks' }))
  expect(engine.runMergeChecks).toHaveBeenCalledWith(KEY, { operationId: workspace.operation.id, approval: workspace.approval, checkIds: ['build'] })
  expect(engine.completeMerge).not.toHaveBeenCalled()
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

describe('Tea-Concile on a merge with conflicts', () => {
  const OP = mergeOperation().id
  const SEND = 'Send Tea-Concile to reconcile these conflicts'
  const conflicted = async (over: Partial<EngineApi> = {}, resolved: string[] = []) => {
    const conflicts = [{ path: 'a.ts', base: 'base', target: 'main', source: 'feature', result: null, editable: true }]
    const { engine, tellHelpers } = fakeEngine({ readMergeWorkspace: async () => ({ ok: true, data: mergeWorkspace({ operation: mergeOperation({ stage: 'conflicts' }), approval: null, conflicts, resolved }) }), ...over })
    await act(async () => { render(<MergeReview engine={engine} realm={KEY} id={OP} remotes={[]} onChanged={() => {}} />) })
    await screen.findByRole('region', { name: t.branches.bench })
    return { engine, tellHelpers }
  }
  const zone = () => document.querySelector('.merge-review') as HTMLElement
  const carrying = (id: string) => ({ types: ['application/x-queue-tea-helper'], getData: (type: string) => (type === 'application/x-queue-tea-helper' ? id : '') })
  const decisions = (entries: object[]) => `\`\`\`tea-concile-decisions\n${JSON.stringify(entries)}\n\`\`\``
  const CHOICE = { file: 'a.ts', question: 'Fade or blink?', target: 'main blinks the dot', source: 'The task fades it in', recommend: 'source', why: 'The quest says never flash.' }

  it('is the one helper beside the merge', async () => {
    await conflicted()
    const bench = within(screen.getByRole('region', { name: t.branches.bench }))
    expect(bench.getAllByRole('button').map(button => button.getAttribute('aria-label'))).toEqual([SEND])
  })

  it('reconciles the conflicts when it is dropped on the merge', async () => {
    const { engine } = await conflicted()
    await act(() => void fireEvent.dragOver(zone(), { dataTransfer: carrying('tea-concile') }))
    expect(zone().classList.contains('dropping')).toBe(true)
    await act(() => void fireEvent.drop(zone(), { dataTransfer: carrying('tea-concile') }))
    expect(engine.concileMerge).toHaveBeenCalledWith(KEY, 'tea-concile', OP)
    expect(zone().classList.contains('dropping')).toBe(false)
  })

  it('takes a press from the keyboard, and ignores a drop that carries no helper', async () => {
    const { engine } = await conflicted()
    await act(() => void fireEvent.drop(zone(), { dataTransfer: carrying('someone') }))
    expect(engine.concileMerge).not.toHaveBeenCalled()
    await click(screen.getByRole('button', { name: SEND }))
    expect(engine.concileMerge).toHaveBeenCalledWith(KEY, 'tea-concile', OP)
  })

  it('holds the merge while it works, then shows what it said without its list of choices', async () => {
    const { engine, tellHelpers } = await conflicted()
    await act(() => tellHelpers([helperJob({ helper: 'tea-concile', merge: OP, doing: { kind: 'editing', target: 'a.ts' } })]))
    expect(screen.getByText(/Tea-Concile: Editing a.ts/)).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Use destination version' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: SEND }) as HTMLButtonElement).disabled).toBe(true)
    await act(() => void fireEvent.drop(zone(), { dataTransfer: carrying('tea-concile') }))
    expect(engine.concileMerge).not.toHaveBeenCalled()
    await click(screen.getByRole('button', { name: 'Stop' }))
    expect(engine.stopHelper).toHaveBeenCalledWith('tea-concile')
    await act(() => tellHelpers([helperJob({ helper: 'tea-concile', merge: OP, status: 'done', reply: `Kept both constants.\n\n${decisions([])}` })]))
    expect(screen.getByText('Kept both constants.')).toBeTruthy()
    expect(document.querySelector('.bench-reply')?.textContent).not.toContain('tea-concile-decisions')
    expect((screen.getByRole('button', { name: 'Use destination version' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('marks each choice it left on its file, with its recommendation as the main button', async () => {
    const { tellHelpers } = await conflicted()
    await act(() => tellHelpers([helperJob({ helper: 'tea-concile', merge: OP, status: 'done', reply: `Resolved what fit.\n\n${decisions([CHOICE, { ...CHOICE, file: 'gone.ts' }])}` })]))
    expect(screen.getByText(t.branches.decisionsLeft(1))).toBeTruthy()
    const file = within(screen.getByRole('region', { name: 'a.ts' }))
    const choice = within(file.getByRole('group', { name: t.branches.decision }))
    expect(choice.getByText('Fade or blink?')).toBeTruthy()
    expect(choice.getByText(/The task fades it in/)).toBeTruthy()
    expect(choice.getByText(`${t.branches.recommends(t.branches.recommendChoice.source)} The quest says never flash.`)).toBeTruthy()
    expect(file.getByRole('button', { name: 'Use task version' }).className).toBe('btn primary')
    expect(file.getByRole('button', { name: 'Save resolved file' }).className).toBe('btn')
    expect(document.querySelector('.bench-bot .bot')?.classList.contains('asking')).toBe(true)
  })

  it('says when its list of choices did not read, and logs why', async () => {
    const { engine, tellHelpers } = await conflicted()
    await act(() => tellHelpers([helperJob({ helper: 'tea-concile', merge: OP, status: 'done', reply: 'Left one.\n```tea-concile-decisions\n[{ broken\n```' })]))
    expect(screen.getByText(t.branches.decisionsUnreadable)).toBeTruthy()
    expect(screen.queryByRole('group', { name: t.branches.decision })).toBeNull()
    expect(engine.log).toHaveBeenCalledWith('warn', expect.stringContaining("Tea-Concile's choices"))
  })

  it('says why it could not be sent', async () => {
    await conflicted({ concileMerge: async () => ({ ok: false, error: { message: 'This merge has no conflicts left to resolve.' } }) })
    await click(screen.getByRole('button', { name: SEND }))
    expect((await screen.findByRole('alert')).textContent).toBe('This merge has no conflicts left to resolve.')
  })

  it('puts a resolved file back to its conflict', async () => {
    const { engine } = await conflicted({}, ['b.ts'])
    const resolved = within(screen.getByRole('region', { name: t.branches.resolvedHere }))
    await click(resolved.getByRole('button', { name: t.branches.restoreNamed('b.ts') }))
    expect(engine.restoreConflict).toHaveBeenCalledWith(KEY, { operationId: OP, path: 'b.ts' })
  })
})

describe('the conflict preview before a merge is prepared', () => {
  it('lists the files the merge would conflict in', async () => {
    await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ preview: ['a.ts', 'b.ts'] }) }) })
    expect(await screen.findByText(t.branches.preview(2, 'main'))).toBeTruthy()
    expect(screen.getByText('a.ts')).toBeTruthy()
    expect(screen.getByText(t.branches.previewHint)).toBeTruthy()
  })

  it('says when it merges clean, and says nothing when it could not tell', async () => {
    await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ preview: [] }) }) })
    expect(await screen.findByText(t.branches.previewClean('main'))).toBeTruthy()
    cleanup()
    await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ preview: null }) }) })
    await screen.findByRole('button', { name: 'Prepare merge for review' })
    expect(screen.queryByText(t.branches.previewClean('main'))).toBeNull()
  })

  it('shows a few files and counts the rest', async () => {
    await openReview({ readBranch: async () => ({ ok: true, data: branchReview({ preview: Array.from({ length: 25 }, (_, i) => `f${i}.ts`) }) }) })
    expect(await screen.findByText(t.branches.previewMore(5))).toBeTruthy()
    expect(screen.queryByText('f20.ts')).toBeNull()
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

it('keeps both active quests usable on Home', async () => {
  window.location.hash = '#/home'
  const { engine } = await open()
  expect(screen.getByRole('heading', { name: one.title, level: 1 })).toBeTruthy()
  await click(screen.getByRole('button', { name: t.home.pick(two.title) }))
  expect(screen.getByRole('heading', { name: two.title, level: 1 })).toBeTruthy()
  await click(await screen.findByRole('button', { name: 'Show Codex' }))
  expect(engine.openClaude).toHaveBeenCalledWith(KEY, 'two')
})

describe('Claude\'s proposed commit in the review', () => {
  const FILES = [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }, { path: 'c.ts', previous: null, status: ' M' }]
  const FIRST = { message: 'fixed the retry button', files: ['a.ts', 'c.ts'], head: SOURCE, at: '2026-11-20T09:00:00+01:00' }
  const NEWER = { message: 'fixed the retry button and its test', files: ['b.ts'], head: SOURCE, at: '2026-11-20T09:05:00+01:00' }
  // Preact runs the form's effects after the next frame (35 ms at most in jsdom,
  // longer on a busy machine). A test that expects a change waits for it; one
  // that expects none waits this long, then checks nothing moved.
  const painted = () => act(() => new Promise<void>(resolve => setTimeout(resolve, 50)))
  const messageBox = () => screen.getByLabelText(t.branches.commitMessage) as HTMLTextAreaElement
  const ticked = () => FILES.map(f => f.path).filter(path => (screen.getByRole('checkbox', { name: new RegExp(path.replace('.', '\\.')) }) as HTMLInputElement).checked)
  const reviewing = async (first: Partial<Review>) => {
    let review = branchReview({ files: FILES, ...first })
    const readBranch = vi.fn<EngineApi['readBranch']>(async () => ({ ok: true, data: review }))
    const opened = await openReview({ readBranch })
    await click(await screen.findByRole('tab', { name: t.branches.tabs.changes }))
    // A record change makes the review read again, now with `next`.
    const reread = async (next: Partial<Review>) => {
      review = branchReview({ files: FILES, ...next })
      const reads = readBranch.mock.calls.length
      await act(() => opened.fire())
      await waitFor(() => expect(readBranch.mock.calls.length).toBeGreaterThan(reads))
      await painted()
    }
    return { ...opened, reread }
  }

  it('fills the commit message, ticks only the proposed files and says Claude proposed them; nothing is committed until Commit is pressed', async () => {
    const { engine } = await reviewing({ proposal: FIRST })

    await waitFor(() => expect(messageBox().value).toBe(FIRST.message))
    expect(ticked()).toEqual(['a.ts', 'c.ts'])
    expect(screen.getByText(t.branches.proposed)).toBeTruthy()
    expect(engine.commitBranchFiles).not.toHaveBeenCalled()

    await click(screen.getAllByRole('checkbox', { name: t.branches.idle })[0]!)
    await click(screen.getByRole('button', { name: t.branches.commitSelected }))

    expect(engine.commitBranchFiles).toHaveBeenCalledWith(KEY, expect.objectContaining({ files: ['a.ts', 'c.ts'], message: FIRST.message }))
  })

  it('a newer proposal replaces a message Rohan has not edited, and its files', async () => {
    const { reread } = await reviewing({ proposal: FIRST })
    await waitFor(() => expect(messageBox().value).toBe(FIRST.message))

    await reread({ proposal: NEWER })

    await waitFor(() => {
      expect(messageBox().value).toBe(NEWER.message)
      expect(ticked()).toEqual(['b.ts'])
    })
  })

  it('a newer proposal leaves a message Rohan has edited, and the files ticked', async () => {
    const { reread } = await reviewing({ proposal: FIRST })
    await waitFor(() => expect(messageBox().value).toBe(FIRST.message))
    await act(() => void fireEvent.input(messageBox(), { target: { value: 'fixed the retry button, in my words' } }))

    await reread({ proposal: NEWER })

    expect(messageBox().value).toBe('fixed the retry button, in my words')
    expect(ticked()).toEqual(['a.ts', 'c.ts'])
  })

  it('a newer proposal fills a message Rohan has emptied', async () => {
    const { reread } = await reviewing({ proposal: FIRST })
    await waitFor(() => expect(messageBox().value).toBe(FIRST.message))
    await act(() => void fireEvent.input(messageBox(), { target: { value: '' } }))

    await reread({ proposal: NEWER })

    await waitFor(() => {
      expect(messageBox().value).toBe(NEWER.message)
      expect(ticked()).toEqual(['b.ts'])
    })
  })

  it('the same proposal read again leaves the files Rohan unticked', async () => {
    const { reread } = await reviewing({ proposal: FIRST })
    await waitFor(() => expect(messageBox().value).toBe(FIRST.message))
    await click(screen.getByRole('checkbox', { name: /c\.ts/ }))

    await reread({ proposal: { ...FIRST } })

    expect(ticked()).toEqual(['a.ts'])
    expect(messageBox().value).toBe(FIRST.message)
  })

  it.each([
    ['no proposal', {}],
    ['a proposal of null', { proposal: null }],
  ])('with %s, nothing is filled in, ticked or said', async (_, over) => {
    await reviewing(over)
    await painted()

    expect(messageBox().value).toBe('')
    expect(ticked()).toEqual([])
    expect(screen.queryByText(t.branches.proposed)).toBeNull()
  })
})
