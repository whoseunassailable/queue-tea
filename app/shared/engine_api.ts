import type { Allowance, AppRequest, Difficulty, ParentPick, Priority, Task } from '../../types'
import type { Progress } from '../../hooks/shared/backlog/domain/services/families'

// The one typed interface between the window and main. It is IPC now, and the
// same shape can sit behind HTTP later. The engine keeps its own words here;
// the screens use the game's.

export type AppError = { message: string }
export type Reply<T> = { ok: true; data: T } | { ok: false; error: AppError }

export type SessionState = 'none' | 'open' | 'working' | 'needsYou' | 'several'
export type SessionInfo = { state: SessionState; allowance: Allowance | null }

export type ProjectStatus =
  | { kind: 'judgement' }
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
  criteria: string[]
  // What an open session has been asked to do and hasn't yet.
  asking: AppRequest['kind'] | null
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
      docsLogPath: string | null
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
export type TerminalChoice = 'terminal' | 'iterm' | 'vscode'
// Folds are the sagas folded, by realm.
export type Settings = { sky: SkyChoice; isCalm: boolean; lastProject: string | null; folds: Record<string, string[]>; terminal: TerminalChoice }

// What a form offers: the sagas to file under, the lone quests that can become
// one, and for one quest what it can move under or wait for.
export type QuestChoice = { id: string; title: string; detail: string | null }
export type Choices = { features: QuestChoice[]; lone: QuestChoice[]; parents: QuestChoice[]; waitFor: QuestChoice[] }

export type NewQuest = { title: string; priority: Priority; difficulty: Difficulty; parent: ParentPick; description: string | null; criteria: string[] }
export type Seal = { waitFor: string } | { reason: string }
export type QuestEdit = { title?: string; description?: string | null; criteria?: string[]; difficulty?: Difficulty }

// What keeps a quest from starting. The reason is the engine's own sentence,
// and a command is only ever text to copy.
export type HoldKind = 'uncommitted' | 'unpushed' | 'neverPushed' | 'detached' | 'branch'
export type GitHold = { kind: HoldKind; reason: string; branch: string | null; head: string | null; files: string[]; fileCount: number; command: string | null }

// What Start is about to do, so its working line is true.
export type StartStep = { kind: 'noRepo' } | { kind: 'switch'; branch: string } | { kind: 'make'; branch: string; from: string | null }
export type StartCheck = { kind: 'held'; hold: GitHold } | { kind: 'clear'; step: StartStep }

// How the quest reached Claude Code. Failed keeps the line to copy.
export type Handover = { kind: 'session' } | { kind: 'opened'; terminal: TerminalChoice } | { kind: 'failed'; terminal: TerminalChoice; command: string }
export type StartOutcome = { kind: 'held'; hold: GitHold } | { kind: 'started'; view: ProjectView; branch: string | null; notice: string | null; handover: Handover }

// What a win earned. Worked out after the win is saved.
export type VictoryKind = 'quest' | 'boss' | 'saga'
export type Victory = {
  kind: VictoryKind
  title: string
  actual: Difficulty
  expected: Difficulty
  xp: number
  gold: number
  level: number
  didLevelUp: boolean
  xpIntoLevel: number
  xpToNextLevel: number
  nextLevelAt: number
  hoard: number
  stage: Stage
  newBadges: BadgeId[]
}

// logFailedAt is the path when the row couldn't be written; the win stands.
export type LogOutcome = { view: ProjectView; logPath: string | null; logFailedAt: string | null }
export type FinishOutcome = LogOutcome & { minutes: number; victory: Victory | null }

// Asked: an open session writes the checkpoint, then the quest goes back. Back:
// it has gone. missedCheckpoint is set when Claude's checkpoint wasn't written,
// with when the last one was.
export type BackOutcome = { view: ProjectView; went: 'asked' | 'back'; missedCheckpoint: { lastAt: string | null } | null }

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
  checkStart: (key: string, taskId: string) => Promise<Reply<StartCheck>>
  startQuest: (key: string, taskId: string) => Promise<Reply<StartOutcome>>
  openClaude: (key: string) => Promise<Reply<Handover>>
  notYet: (key: string, taskId: string) => Promise<Reply<ProjectView>>
  finishQuest: (key: string, taskId: string, actual: Difficulty, logPath: string | null) => Promise<Reply<FinishOutcome>>
  retryTaskLog: (key: string, taskId: string, path: string) => Promise<Reply<LogOutcome>>
  putBackQuest: (key: string, taskId: string, seal: Seal | null) => Promise<Reply<BackOutcome>>
  putBackNow: (key: string, taskId: string) => Promise<Reply<BackOutcome>>
  copyText: (text: string) => Promise<Reply<null>>
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
  checkStart: 'engine:check-start',
  startQuest: 'engine:start-quest',
  openClaude: 'engine:open-claude',
  notYet: 'engine:not-yet',
  finishQuest: 'engine:finish-quest',
  retryTaskLog: 'engine:retry-task-log',
  putBackQuest: 'engine:put-back-quest',
  putBackNow: 'engine:put-back-now',
  copyText: 'engine:copy-text',
  changed: 'engine:changed',
  log: 'engine:log',
} as const
