import { describe, expect, it, vi } from 'vitest'

import type { Reply } from '../../../../shared/engine_api'
import type { ProjectView } from '../../../../shared/engine_api'
import { fakeEngine, projectRow, projectView } from '../../../test_support'
import { createWorkspace } from './workspace_store'

const fail = (message: string) => ({ ok: false as const, error: { message } })

describe('the workspace', () => {
  it('opens the only realm there is', async () => {
    const { engine } = fakeEngine()
    const workspace = createWorkspace(engine)

    await workspace.start()

    expect(workspace.getState()).toMatchObject({ selected: 'a-000001', project: { status: 'ready' }, game: { status: 'ready' } })
  })

  it('opens the last realm used', async () => {
    const { engine } = fakeEngine({
      listProjects: async () => ({ ok: true, data: [projectRow('a-000001'), projectRow('b-000002')] }),
      readSettings: async () => ({ ok: true, data: { sky: 'auto', isCalm: false, lastProject: 'b-000002', folds: {}, terminal: 'terminal' } }),
    })
    const workspace = createWorkspace(engine)

    await workspace.start()

    expect(workspace.getState().selected).toBe('b-000002')
  })

  it('with several realms and no memory, lets the list ask', async () => {
    const { engine } = fakeEngine({ listProjects: async () => ({ ok: true, data: [projectRow('a-000001'), projectRow('b-000002')] }) })
    const workspace = createWorkspace(engine)

    await workspace.start()

    expect(workspace.getState()).toMatchObject({ selected: null, project: { status: 'none' } })
  })

  it('a first load that fails shows the failed state, and Try again recovers', async () => {
    let isDown = true
    const { engine } = fakeEngine({ listProjects: async () => (isDown ? fail('plain') : { ok: true, data: [projectRow('a-000001')] }) })
    const workspace = createWorkspace(engine)

    await workspace.start()
    expect(workspace.getState().projects).toEqual({ status: 'failed', message: 'plain' })

    isDown = false
    await workspace.refresh()
    expect(workspace.getState().projects.status).toBe('ready')
  })

  it('a refresh that fails keeps what is on screen and says so', async () => {
    let isDown = false
    const { engine, fire } = fakeEngine({ readProject: async key => (isDown ? fail('plain') : { ok: true, data: projectView(key) }) })
    const workspace = createWorkspace(engine)
    await workspace.start()

    isDown = true
    fire()

    await vi.waitFor(() => expect(workspace.getState().note).toBe('plain'))
    expect(workspace.getState().project.status).toBe('ready')
  })

  it('a change on disk reads everything again', async () => {
    const readGame = vi.fn(fakeEngine().engine.readGame)
    const { engine, fire } = fakeEngine({ readGame })
    const workspace = createWorkspace(engine)
    await workspace.start()

    fire()

    await vi.waitFor(() => expect(readGame).toHaveBeenCalledTimes(2))
  })

  it('a slow read of the old realm cannot paint over a switch', async () => {
    let finishSlow: (reply: Reply<ProjectView>) => void = () => {}
    const { engine } = fakeEngine({
      listProjects: async () => ({ ok: true, data: [projectRow('a-000001'), projectRow('b-000002')] }),
      readProject: key => (key === 'a-000001' ? new Promise(done => (finishSlow = done)) : Promise.resolve({ ok: true, data: projectView(key) })),
    })
    const workspace = createWorkspace(engine)
    await workspace.start()

    const slow = workspace.pick('a-000001')
    await workspace.pick('b-000002')
    finishSlow({ ok: true, data: projectView('a-000001') })
    await slow

    const { project } = workspace.getState()
    expect(project.status === 'ready' && project.data.key).toBe('b-000002')
  })

  it('remembers a picked realm and a picked sky', async () => {
    const { engine } = fakeEngine({ listProjects: async () => ({ ok: true, data: [projectRow('a-000001'), projectRow('b-000002')] }) })
    const workspace = createWorkspace(engine)
    await workspace.start()

    await workspace.pick('b-000002')
    await workspace.setSky('night')

    expect(engine.saveSettings).toHaveBeenCalledWith({ lastProject: 'b-000002' })
    expect(workspace.getState().settings.sky).toBe('night')
  })

  it('a setting that fails to save says so', async () => {
    const { engine } = fakeEngine({ saveSettings: async () => fail('not saved') })
    const workspace = createWorkspace(engine)
    await workspace.start()

    await workspace.setSky('night')

    expect(workspace.getState().note).toBe('not saved')
  })

  it('each realm keeps its own open quest', async () => {
    const { engine } = fakeEngine()
    const workspace = createWorkspace(engine)

    workspace.openQuest('a-000001', 'x')
    workspace.openQuest('b-000002', 'y')

    expect(workspace.getState().openQuests).toEqual({ 'a-000001': 'x', 'b-000002': 'y' })
  })
})
