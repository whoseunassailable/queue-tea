import type { Allowance, Difficulty, ParentPick, Priority, Task } from '../../types'
import type { Progress } from '../../hooks/shared/backlog/domain/services/families'

// The one typed interface between the window and main. It is IPC now, and the
// same shape can sit behind HTTP later. The engine keeps its own words here;
// the screens use the game's.

export type AppError = { message: string }
export type Reply<T> = { ok: true; data: T } | { ok: false; error: AppError }

export type SessionState = 'none' | 'open' | 'working' | 'needsYou' | 'several'
export type SessionInfo = { state: SessionState; allowance: Allowance | null }

export type ProjectStatus =
  | { kind: 'needsYou' }
  | { kind: 'working' }
  | { kind: 'current'; title: string }
  | { kind: 'waiting'; count: number; title: string | null }
  | { kind: 'nothing' }

export type ProjectRow =
  | { kind: 'readable'; key: string; name: string; path: string; waiting: number; status: ProjectStatus; session: SessionState }
  | { kind: 'unreadable'; key: string; name: string }

export type QuestRow = {
  id: string
  title: string
  priority: Priority
  difficulty: Difficulty
  xp: number
  estimateMinutes: number
  waitedMs: number
  // The ★ row's reason, as the ranking wrote it.
  why: string | null
  isStar: boolean
  isPlayNext: boolean
  parentId: string | null
  sealedBecause: string | null
  branch: string | null
  created: string
  description: string | null
  criteria: string[]
}

export type BoardEntry =
  | { kind: 'quest'; quest: QuestRow }
  | { kind: 'saga'; quest: QuestRow; chapters: QuestRow[]; progress: Progress; hasStar: boolean }

export type ActiveQuest = {
  id: string
  title: string
  priority: Priority
  difficulty: Difficulty
  xp: number
  branch: string | null
  minutes: number
  started: string | null
  isBoss: boolean
  improvingMessages: number
  filesChanged: number
  review: Task['review']
}

export type VictoryRow = { id: string; title: string; finished: string; minutes: number; xp: number }

export type ProjectView =
  | {
      kind: 'readable'
      key: string
      name: string
      path: string
      session: SessionInfo
      active: ActiveQuest | null
      ready: BoardEntry[]
      sealed: BoardEntry[]
      canStart: number
      sealedCount: number
      activeSaga: string | null
      activeSagaId: string | null
      victories: VictoryRow[]
      victoryCount: number
    }
  | { kind: 'unreadable'; key: string; name: string; isNewer: boolean; canRestore: boolean }

export type BadgeId = 'firstFlame' | 'tenTales' | 'dragonSlayer' | 'sagasEnd' | 'earlyBird' | 'nightOwl' | 'weekOfFire'
export type Badge = { id: BadgeId; need: number; have: number; earnedOn: string | null }
export type Stage = 'egg' | 'hatchling' | 'young' | 'adult' | 'elder'

export type GameState = {
  victories: number
  xp: number
  gold: number
  level: number
  xpIntoLevel: number
  xpToNextLevel: number
  stage: Stage
  streak: number
  bestStreak: number
  badges: Badge[]
}

// What the HUD draws: the game, and the mana from the newest session.
export type GameView = GameState & { allowance: Allowance | null }

export type SkyChoice = 'auto' | 'morning' | 'day' | 'evening' | 'night'
// Folds are the sagas folded, by realm.
export type Settings = { sky: SkyChoice; isCalm: boolean; lastProject: string | null; folds: Record<string, string[]> }

// What a form offers: the sagas to file under, the lone quests that can become
// one, and for one quest what it can move under or wait for.
export type QuestChoice = { id: string; title: string; detail: string | null }
export type Choices = { features: QuestChoice[]; lone: QuestChoice[]; parents: QuestChoice[]; waitFor: QuestChoice[] }

export type NewQuest = { title: string; priority: Priority; difficulty: Difficulty; parent: ParentPick; description: string | null; criteria: string[] }
export type Seal = { waitFor: string } | { reason: string }
export type QuestEdit = { title?: string; description?: string | null; criteria?: string[]; difficulty?: Difficulty }

export type EngineApi = {
  listProjects: () => Promise<Reply<ProjectRow[]>>
  readProject: (key: string) => Promise<Reply<ProjectView>>
  readGame: () => Promise<Reply<GameView>>
  readSettings: () => Promise<Reply<Settings>>
  saveSettings: (patch: Partial<Settings>) => Promise<Reply<Settings>>
  readChoices: (key: string, taskId: string | null) => Promise<Reply<Choices>>
  setPriority: (key: string, taskId: string, priority: Priority) => Promise<Reply<ProjectView>>
  togglePlayNext: (key: string, taskId: string) => Promise<Reply<ProjectView>>
  fileQuest: (key: string, quest: NewQuest) => Promise<Reply<ProjectView>>
  moveQuest: (key: string, taskId: string, parentId: string | null) => Promise<Reply<ProjectView>>
  sealQuest: (key: string, taskId: string, seal: Seal) => Promise<Reply<ProjectView>>
  unsealQuest: (key: string, taskId: string) => Promise<Reply<ProjectView>>
  removeQuest: (key: string, taskId: string) => Promise<Reply<ProjectView>>
  restoreQuest: (key: string, taskId: string) => Promise<Reply<ProjectView>>
  editQuest: (key: string, taskId: string, edit: QuestEdit) => Promise<Reply<ProjectView>>
  setActiveSaga: (key: string, taskId: string | null) => Promise<Reply<ProjectView>>
  onChange: (listener: () => void) => () => void
  log: (level: 'warn' | 'error', text: string) => void
}

export const CHANNELS = {
  listProjects: 'engine:list-projects',
  readProject: 'engine:read-project',
  readGame: 'engine:read-game',
  readSettings: 'engine:read-settings',
  saveSettings: 'engine:save-settings',
  readChoices: 'engine:read-choices',
  setPriority: 'engine:set-priority',
  togglePlayNext: 'engine:toggle-play-next',
  fileQuest: 'engine:file-quest',
  moveQuest: 'engine:move-quest',
  sealQuest: 'engine:seal-quest',
  unsealQuest: 'engine:unseal-quest',
  removeQuest: 'engine:remove-quest',
  restoreQuest: 'engine:restore-quest',
  editQuest: 'engine:edit-quest',
  setActiveSaga: 'engine:set-active-saga',
  changed: 'engine:changed',
  log: 'engine:log',
} as const
