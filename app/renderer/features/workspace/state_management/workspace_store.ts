import { useEffect, useState } from 'preact/hooks'

import type { EngineApi, GameView, ProjectRow, ProjectView, Settings, SkyChoice } from '../../../../shared/engine_api'
import { ask } from '../../../core/api/engine_client'
import type { Answer } from '../../../core/api/engine_client'

// A view that waits for something is always in one of these.
export type Load<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'failed'; message: string }

export type WorkspaceState = {
  projects: Load<ProjectRow[]>
  project: Load<ProjectView> | { status: 'none' }
  game: Load<GameView>
  settings: Settings
  selected: string | null
  // The quest open in the detail pane, kept per realm.
  openQuests: Record<string, string>
  // A refresh failed while older data stays on screen.
  note: string | null
}

const INITIAL: WorkspaceState = {
  projects: { status: 'loading' },
  project: { status: 'none' },
  game: { status: 'loading' },
  settings: { sky: 'auto', isCalm: false, lastProject: null },
  selected: null,
  openQuests: {},
  note: null,
}

// Old data stays while a refresh runs. It gives way to the failed state only
// when there is nothing to show.
const nextLoad = <T>(was: Load<T> | { status: 'none' }, answer: Answer<T>): { load: Load<T>; failedOver: string | null } => {
  if (answer.ok) return { load: { status: 'ready', data: answer.data }, failedOver: null }
  if (was.status === 'ready') return { load: was, failedOver: answer.message }

  return { load: { status: 'failed', message: answer.message }, failedOver: null }
}

export const createWorkspace = (engine: EngineApi) => {
  let state = INITIAL
  const listeners = new Set<() => void>()
  // The newest read of a realm wins, so a slow one can't paint over a switch.
  let readNumber = 0

  const set = (patch: Partial<WorkspaceState>) => {
    state = { ...state, ...patch }
    for (const listener of listeners) listener()
  }

  const loadProject = async (key: string) => {
    readNumber += 1
    const number = readNumber
    const answer = await ask(engine, () => engine.readProject(key))
    if (number !== readNumber) return
    const { load, failedOver } = nextLoad(state.project, answer)
    set({ project: load, ...(failedOver === null ? {} : { note: failedOver }) })
  }

  const loadGame = async () => {
    const { load, failedOver } = nextLoad(state.game, await ask(engine, () => engine.readGame()))
    set({ game: load, ...(failedOver === null ? {} : { note: failedOver }) })
  }

  const select = async (key: string) => {
    if (key !== state.selected) set({ selected: key, project: { status: 'loading' } })
    await loadProject(key)
  }

  const remember = async (patch: Partial<Settings>) => {
    const answer = await ask(engine, () => engine.saveSettings(patch))
    if (answer.ok) set({ settings: answer.data })
    else set({ note: answer.message })
  }

  // The last realm used, or the only one; with several and no memory, the
  // list asks.
  const firstChoice = (rows: ProjectRow[]): string | null => {
    const known = rows.find(r => r.key === state.settings.lastProject)
    if (known !== undefined) return known.key

    return rows.length === 1 ? rows[0]!.key : null
  }

  const loadProjects = async () => {
    const answer = await ask(engine, () => engine.listProjects())
    const { load, failedOver } = nextLoad(state.projects, answer)
    set({ projects: load, ...(failedOver === null ? { note: null } : { note: failedOver }) })
    if (load.status !== 'ready') return

    const selected = state.selected
    if (selected !== null && load.data.some(r => r.key === selected)) await loadProject(selected)
    else {
      const choice = firstChoice(load.data)
      if (choice !== null) await select(choice)
      else set({ selected: null, project: { status: 'none' } })
    }
  }

  const refresh = () => Promise.all([loadProjects(), loadGame()]).then(() => undefined)

  return {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    start: async () => {
      const settings = await ask(engine, () => engine.readSettings())
      if (settings.ok) set({ settings: settings.data })
      else set({ note: settings.message })
      await refresh()

      return engine.onChange(() => void refresh())
    },
    refresh,
    pick: async (key: string) => {
      await select(key)
      await remember({ lastProject: key })
    },
    setSky: (sky: SkyChoice) => remember({ sky }),
    openQuest: (key: string, questId: string) => set({ openQuests: { ...state.openQuests, [key]: questId } }),
  }
}

export type Workspace = ReturnType<typeof createWorkspace>

export const useWorkspace = (workspace: Workspace): WorkspaceState => {
  const [state, setState] = useState(workspace.getState())
  useEffect(() => {
    setState(workspace.getState())

    return workspace.subscribe(() => setState(workspace.getState()))
  }, [workspace])

  return state
}
