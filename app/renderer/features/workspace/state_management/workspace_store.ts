import { useEffect, useState } from 'preact/hooks'
import type { Platform } from '../../../../../types'

import type { ActiveQuest, EngineApi, GameView, GitHold, ProjectRow, ProjectView, Reply, Settings, SkyChoice, TerminalChoice, Victory } from '../../../../shared/engine_api'
import { ask } from '../../../core/api/engine_client'
import type { Answer } from '../../../core/api/engine_client'
import { SAVED_MS, TOASTS_SHOWN, UNDO_DEPTH } from '../../../core/constants/constants'
import { t } from '../../../l10n/en'
import type { BoardView } from '../../quests/domain/search'

export type ReadableView = Extract<ProjectView, { kind: 'readable' }>

export type Toast = {
  id: number
  tone: 'info' | 'success' | 'warning' | 'error'
  text: string
  action?: { label: string; run: () => void }
  // A badge: it stays longer, and Esc closes it.
  isLong?: boolean
}

// One change to a realm. The preview shows in the same frame; the call is the
// truth when it answers. A form that shows its own errors asks to stay quiet.
export type Edit = {
  key: string
  questId?: string
  preview?: (view: ReadableView) => ReadableView
  call: () => Promise<Reply<ProjectView>>
  said?: string
  undo?: { said: string; call: () => Promise<Reply<ProjectView>> }
  isQuiet?: boolean
}

// What a realm's quest is in the middle of. Not saved anywhere: it is the
// window's own, per realm.
export type QuestFlow =
  | { kind: 'working'; questId: string; title: string; line: string }
  | { kind: 'held'; questId: string; title: string; hold: GitHold; isChecking: boolean; platform: Platform }
  | { kind: 'refused'; questId: string; title: string; message: string; platform: Platform }
  | { kind: 'openFailed'; terminal: TerminalChoice; command: string }

export type Won = { victory: Victory; logPath: string | null }

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
  toasts: Toast[]
  // The quest whose chip shows ✓ for a moment.
  savedQuest: string | null
  flows: Record<string, QuestFlow>
  // The victory panel, until it's closed.
  won: Won | null
  // What a quest's detail pane should say, by quest.
  questNotes: Record<string, string>
  // The board's search and filters, by realm.
  boards: Record<string, BoardView>
  // The realm the app was last opened on from outside it.
  detected: string | null
}

const INITIAL: WorkspaceState = {
  projects: { status: 'loading' },
  project: { status: 'none' },
  game: { status: 'loading' },
  settings: { sky: 'auto', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} },
  selected: null,
  openQuests: {},
  note: null,
  toasts: [],
  savedQuest: null,
  flows: {},
  won: null,
  questNotes: {},
  boards: {},
  detected: null,
}

// Old data stays while a refresh runs. It gives way to the failed state only
// when there is nothing to show.
const nextLoad = <T>(was: Load<T> | { status: 'none' }, answer: Answer<T>): { load: Load<T>; failedOver: string | null } => {
  if (answer.ok) return { load: { status: 'ready', data: answer.data }, failedOver: null }
  if (was.status === 'ready') return { load: was, failedOver: answer.message }

  return { load: { status: 'failed', message: answer.message }, failedOver: null }
}

// The quest a session has just put back, as it was asked to.
const wentBack = (was: WorkspaceState['project'], now: WorkspaceState['project']): ActiveQuest | null => {
  if (was.status !== 'ready' || now.status !== 'ready' || was.data.kind !== 'readable' || now.data.kind !== 'readable' || was.data.key !== now.data.key) return null

  return was.data.active?.asking === 'putBack' && now.data.active === null ? was.data.active : null
}

export const createWorkspace = (engine: EngineApi) => {
  let state = INITIAL
  const listeners = new Set<() => void>()
  // The newest read of a realm wins, so a slow one can't paint over a switch.
  let readNumber = 0
  // While an edit is on its way, a read can only show the old value.
  let editsOnTheWay = 0
  let toastNumber = 0
  const undos: { key: string; said: string; call: Edit['call'] }[] = []

  const set = (patch: Partial<WorkspaceState>) => {
    state = { ...state, ...patch }
    for (const listener of listeners) listener()
  }

  const loadProject = async (key: string) => {
    readNumber += 1
    const number = readNumber
    const answer = await ask(engine, () => engine.readProject(key))
    if (number !== readNumber || editsOnTheWay > 0) return
    const was = state.project
    const { load, failedOver } = nextLoad(was, answer)
    set({ project: load, ...(failedOver === null ? {} : { note: failedOver }) })
    const back = wentBack(was, load)
    if (back !== null) say({ tone: 'success', text: t.flow.backOnBoard(back.title) })
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

  const dismiss = (id: number) => set({ toasts: state.toasts.filter(toast => toast.id !== id) })

  const say = (toast: Omit<Toast, 'id'>) => {
    toastNumber += 1
    set({ toasts: [...state.toasts, { ...toast, id: toastNumber }].slice(-TOASTS_SHOWN) })
  }

  const isShowing = (key: string) => state.selected === key

  // A view main handed back. Whatever read began before it is out of date.
  const adopt = (key: string, view: ProjectView) => {
    if (!isShowing(key)) return
    readNumber += 1
    set({ project: { status: 'ready', data: view } })
  }

  const withoutKey = <T>(from: Record<string, T>, key: string): Record<string, T> => Object.fromEntries(Object.entries(from).filter(([k]) => k !== key))

  const showSaved = (questId: string) => {
    set({ savedQuest: questId })
    setTimeout(() => {
      if (state.savedQuest === questId) set({ savedQuest: null })
    }, SAVED_MS)
  }

  const run = async (edit: Edit): Promise<Answer<ProjectView>> => {
    const before = state.project
    if (edit.preview !== undefined && isShowing(edit.key) && before.status === 'ready' && before.data.kind === 'readable') {
      set({ project: { status: 'ready', data: edit.preview(before.data) } })
    }
    editsOnTheWay += 1
    const answer = await ask(engine, edit.call)
    editsOnTheWay -= 1
    if (!answer.ok) {
      if (isShowing(edit.key) && edit.preview !== undefined) set({ project: before })
      if (edit.isQuiet !== true) say({ tone: 'error', text: answer.message, action: { label: t.failed.tryAgain, run: () => void run(edit) } })

      return answer
    }

    if (isShowing(edit.key)) {
      // A read that began before this write is out of date when it lands.
      readNumber += 1
      set({ project: { status: 'ready', data: answer.data } })
    }
    if (edit.questId !== undefined) showSaved(edit.questId)
    const { undo } = edit
    if (undo !== undefined) {
      undos.push({ key: edit.key, ...undo })
      if (undos.length > UNDO_DEPTH) undos.shift()
    }
    if (edit.said !== undefined) {
      say({ tone: 'success', text: edit.said, ...(undo === undefined ? {} : { action: { label: t.edit.undo, run: () => void undoLast(edit.key) } }) })
    }

    return answer
  }

  // The newest undo for this realm.
  const undoLast = async (key: string) => {
    const at = undos.findLastIndex(entry => entry.key === key)
    if (at === -1) return
    const [entry] = undos.splice(at, 1)
    await run({ key, call: entry!.call, said: entry!.said })
  }

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
    // A setting shows at once; a failed save says so in the note.
    changeSettings: (patch: Partial<Settings>) => {
      set({ settings: { ...state.settings, ...patch } })

      return remember(patch)
    },
    // One realm's account, leaving every other realm's as it is.
    setRealmAccount: (key: string, login: string | null) => {
      const others = withoutKey(state.settings.realmAccounts, key)
      const realmAccounts = login === null ? others : { ...others, [key]: login }
      set({ settings: { ...state.settings, realmAccounts } })

      return remember({ realmAccounts })
    },
    openQuest: (key: string, questId: string) => set({ openQuests: { ...state.openQuests, [key]: questId } }),
    closeQuest: (key: string) => set({ openQuests: withoutKey(state.openQuests, key) }),
    setFlow: (key: string, flow: QuestFlow | null) => set({ flows: flow === null ? withoutKey(state.flows, key) : { ...state.flows, [key]: flow } }),
    showWon: (won: Won | null) => set({ won }),
    noteFor: (questId: string, text: string | null) => set({ questNotes: text === null ? withoutKey(state.questNotes, questId) : { ...state.questNotes, [questId]: text } }),
    setDetected: (key: string) => set({ detected: key }),
    setBoard: (key: string, board: BoardView) => set({ boards: { ...state.boards, [key]: board } }),
    adopt,
    run,
    undo: async () => {
      if (state.selected !== null) await undoLast(state.selected)
    },
    dismiss,
    dismissBadges: () => set({ toasts: state.toasts.filter(toast => toast.isLong !== true) }),
    say,
    toggleFold: async (key: string, questId: string) => {
      const folded = state.settings.folds[key] ?? []
      const next = folded.includes(questId) ? folded.filter(id => id !== questId) : [...folded, questId]
      const folds = { ...state.settings.folds, [key]: next }
      set({ settings: { ...state.settings, folds } })
      await remember({ folds })
    },
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
