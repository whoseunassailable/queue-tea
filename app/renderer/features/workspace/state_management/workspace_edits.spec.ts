import { describe, expect, it, vi } from 'vitest'

import type { ProjectView, Reply } from '../../../../shared/engine_api'
import { withPriority, withoutQuest } from '../../quests/domain/edits'
import { questEdits } from '../../quests/presentation/state_management/quest_edits'
import { fakeEngine, projectRow, projectView, quest } from '../../../test_support'
import { createWorkspace } from './workspace_store'
import type { ReadableView, WorkspaceState } from './workspace_store'

const KEY = 'a-000001'
const ROW = quest({ id: 'x', title: 'The quest', priority: 'mid' })
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: ROW }], canStart: 1 })
const fail = { ok: false as const, error: { message: 'Could not save.' } }

const priorityOn = (state: WorkspaceState) => {
  const { project } = state
  if (project.status !== 'ready' || project.data.kind !== 'readable') throw new Error('should show the realm')

  return project.data.ready[0]?.quest.priority
}

const open = async (over: Parameters<typeof fakeEngine>[0] = {}) => {
  const fake = fakeEngine({ readProject: async () => ({ ok: true, data: BOARD }), ...over })
  const workspace = createWorkspace(fake.engine)
  await workspace.start()

  return { ...fake, workspace, edits: questEdits(fake.engine, workspace) }
}

// A call that answers when the test says.
const held = () => {
  let answer: (reply: Reply<ProjectView>) => void = () => {}
  const reply = new Promise<Reply<ProjectView>>(done => (answer = done))

  return { reply, answer }
}

describe('an edit', () => {
  it('shows before main answers', async () => {
    const write = held()
    const { workspace, edits } = await open({ setPriority: () => write.reply })

    void edits.setPriority(KEY, ROW, 'urgent')

    expect(priorityOn(workspace.getState())).toBe('urgent')
    write.answer({ ok: true, data: BOARD })
  })

  it("then takes main's answer as the truth", async () => {
    const after = projectView(KEY, { ready: [{ kind: 'quest', quest: { ...ROW, priority: 'high' } }] })
    const { workspace, edits } = await open({ setPriority: async () => ({ ok: true, data: after }) })

    await edits.setPriority(KEY, ROW, 'urgent')

    expect(priorityOn(workspace.getState())).toBe('high')
  })

  it('reverts when the write fails, and says so with a way to try again', async () => {
    const setPriority = vi.fn(async () => fail)
    const { workspace, edits } = await open({ setPriority })

    await edits.setPriority(KEY, ROW, 'urgent')

    expect(priorityOn(workspace.getState())).toBe('mid')
    const [toast] = workspace.getState().toasts
    expect(toast).toMatchObject({ tone: 'error', text: 'Could not save.' })

    toast?.action?.run()
    await vi.waitFor(() => expect(setPriority).toHaveBeenCalledTimes(2))
  })

  it('a refresh arriving between the click and the reply cannot paint the old value back', async () => {
    const write = held()
    const { workspace, edits, fire } = await open({ setPriority: () => write.reply })

    void edits.setPriority(KEY, ROW, 'urgent')
    fire()
    await new Promise(done => setTimeout(done, 10))

    expect(priorityOn(workspace.getState())).toBe('urgent')
    write.answer({ ok: true, data: projectView(KEY, { ready: [{ kind: 'quest', quest: { ...ROW, priority: 'urgent' } }] }) })
  })

  it('a slow read from before the write cannot land after it', async () => {
    const read = held()
    let isSlow = false
    const { workspace, edits, fire } = await open({
      readProject: async () => (isSlow ? read.reply : { ok: true, data: BOARD }),
      setPriority: async () => ({ ok: true, data: projectView(KEY, { ready: [{ kind: 'quest', quest: { ...ROW, priority: 'urgent' } }] }) }),
    })
    isSlow = true
    fire()
    await new Promise(done => setTimeout(done, 5))

    await edits.setPriority(KEY, ROW, 'urgent')
    read.answer({ ok: true, data: BOARD })
    await new Promise(done => setTimeout(done, 5))

    expect(priorityOn(workspace.getState())).toBe('urgent')
  })

  it('marks the chip as saved, then lets go', async () => {
    vi.useFakeTimers()
    const { workspace, edits } = await open()

    await edits.setPriority(KEY, ROW, 'urgent')
    expect(workspace.getState().savedQuest).toBe('x')

    vi.advanceTimersByTime(1_200)
    expect(workspace.getState().savedQuest).toBe(null)
    vi.useRealTimers()
  })

  it('a form that shows its own error gets no toast', async () => {
    const { workspace, edits } = await open({ fileQuest: async () => fail })

    const answer = await edits.file(KEY, { title: 'x', priority: 'mid', difficulty: 'medium', parent: { kind: 'none' }, description: null, criteria: [] }, null)

    expect(answer).toEqual({ ok: false, message: 'Could not save.' })
    expect(workspace.getState().toasts).toEqual([])
  })

  it('keeps three toasts at most', async () => {
    const { workspace } = await open()

    for (const text of ['a', 'b', 'c', 'd']) workspace.say({ tone: 'info', text })

    expect(workspace.getState().toasts.map(toast => toast.text)).toEqual(['b', 'c', 'd'])
  })
})

describe('Undo', () => {
  it('puts the old priority back', async () => {
    const { engine, workspace, edits } = await open()

    await edits.setPriority(KEY, ROW, 'urgent')
    await workspace.undo()

    expect(engine.setPriority).toHaveBeenLastCalledWith(KEY, 'x', 'mid')
  })

  it('brings a removed quest back', async () => {
    const { engine, workspace, edits } = await open()

    await edits.remove(KEY, ROW)
    await workspace.undo()

    expect(engine.restoreQuest).toHaveBeenCalledWith(KEY, 'x')
  })

  it('moves a quest back where it was', async () => {
    const { engine, workspace, edits } = await open()

    await edits.move(KEY, { ...ROW, parentId: 'old' }, 'new', 'New saga')
    await workspace.undo()

    expect(engine.moveQuest).toHaveBeenLastCalledWith(KEY, 'x', 'old')
  })

  it('goes back one edit at a time, newest first', async () => {
    const { engine, workspace, edits } = await open()

    await edits.setPriority(KEY, ROW, 'urgent')
    await edits.togglePlayNext(KEY, ROW)
    await workspace.undo()

    expect(engine.togglePlayNext).toHaveBeenCalledTimes(2)
    expect(engine.setPriority).toHaveBeenCalledTimes(1)
  })

  it('has nothing to do with nothing done', async () => {
    const { engine, workspace } = await open()

    await workspace.undo()

    expect(engine.setPriority).not.toHaveBeenCalled()
  })

  it('stays in its own realm', async () => {
    const { engine, workspace, edits } = await open({
      listProjects: async () => ({ ok: true, data: [projectRow(KEY), projectRow('b-000002')] }),
      readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: KEY, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } }),
    })
    await edits.setPriority(KEY, ROW, 'urgent')

    await workspace.pick('b-000002')
    await workspace.undo()

    expect(engine.setPriority).toHaveBeenCalledTimes(1)
  })
})

describe('folds', () => {
  it('are kept per realm in the settings', async () => {
    const { engine, workspace } = await open()

    await workspace.toggleFold(KEY, 'saga')
    expect(engine.saveSettings).toHaveBeenLastCalledWith({ folds: { [KEY]: ['saga'] } })

    await workspace.toggleFold(KEY, 'saga')
    expect(workspace.getState().settings.folds[KEY]).toEqual([])
  })
})

describe('what an edit looks like before the reply', () => {
  const view = (): ReadableView => {
    const board = projectView(KEY, {
      ready: [
        { kind: 'saga', quest: quest({ id: 'saga' }), chapters: [quest({ id: 'chapter' })], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false },
        { kind: 'quest', quest: ROW },
      ],
    })
    if (board.kind !== 'readable') throw new Error('readable')

    return board
  }

  it('reaches a chapter inside its saga', () => {
    const [entry] = withPriority('chapter', 'high')(view()).ready

    expect(entry?.kind === 'saga' && entry.chapters[0]?.priority).toBe('high')
  })

  it('takes out a quest and a chapter', () => {
    expect(withoutQuest('x')(view()).ready).toHaveLength(1)
    const [entry] = withoutQuest('chapter')(view()).ready
    expect(entry?.kind === 'saga' && entry.chapters).toEqual([])
  })
})
