import type { CommentInput, DesignComment, DesignRead, DesignSave, DesignsView, NextVersion, Scene, VersionView } from './designs'
import type { BranchGraph, BranchReview, CommitRequest, CompleteRequest, MergeRequest, MergeWorkspace, PushPreview, ResolveRequest, RunChecksRequest } from './branches'
import type { Allowance, AppRequest, Difficulty, HelperId, ParentPick, Platform, Priority, Task, TaskActivity } from '../../types'
import type { Options } from '../../hooks/core/env/env'
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
  // Whether it fits Time I have; null with no time set.
  fits: boolean | null
  // What the checkpoint can fill the description and criteria with.
  goal: string | null
  acceptance: string[]
  // The helpers Claude is asked to use on it.
  helpers: HelperId[]
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
  helpers: HelperId[]
  // What an open session has been asked to do and hasn't yet.
  asking: AppRequest['kind'] | null
  // When it went to Codex; null while Claude Code has it.
  codexSince: string | null
  worktreePath: string | null
  baseBranch: string | null
  parentId: string | null
  session?: SessionInfo
}

export type BranchQuest = {
  id: string
  title: string
  branch: string
  baseBranch: string | null
  path: string
  state: 'queued' | 'current' | 'done'
  platform: Platform | null
  parent: { id: string; title: string } | null
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
      activeQuests: ActiveQuest[]
      branches: BranchQuest[]
      ready: BoardEntry[]
      sealed: BoardEntry[]
      canStart: number
      sealedCount: number
      activeSaga: string | null
      activeSagaId: string | null
      victories: VictoryRow[]
      victoryCount: number
      docsLogPath: string | null
      // Time I have, in minutes; null for any.
      budget: number | null
    }
  | { kind: 'unreadable'; key: string; name: string; reason: string; file: string; isNewer: boolean; canRestore: boolean }

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
  // Whether today already counts, or the streak is still to be kept.
  wonToday: boolean
  badges: Badge[]
}

// What the HUD draws: the game, and the mana from the newest session.
export type GameView = GameState & { allowance: Allowance | null }

// unreadable counts the records left out because they can't be read.
export type HoardView = { game: GameState; realms: { key: string; name: string; victories: number; gold: number }[]; unreadable: number }

export type DayTime = { day: string; onQuests: number; elsewhere: number }

export type VictoryLine = {
  id: string
  title: string
  priority: Priority
  realm: string
  realmPath: string
  started: string | null
  finished: string
  minutes: number
  expected: Difficulty
  actual: Difficulty
  xp: number
  improvingMessages: number
  filesRead: number
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  filesTouched: number
  branch: string | null
  startCommit: string | null
}

export type ChronicleWeek = {
  days: DayTime[]
  victories: VictoryLine[]
  minutes: number
  onQuests: number
  elsewhere: number
  asExpected: number
  harder: number
  easier: number
  xp: number
  lastWeek: { victories: number; minutes: number }
  hasAny: boolean
  isThisWeek: boolean
}
export type ChronicleView = ChronicleWeek & { unreadable: number }

export type ManaActive = { title: string; isBoss: boolean; minutes: number; understandingMessages: number; improvingMessages: number; filesRead: number; filesChanged: number }
export type ManaLines = { added: number; removed: number; since: string }
export type ManaAllowance = Allowance & { seenAt: number; isStale: boolean }
export type ManaWeek = {
  today: DayTime
  days: DayTime[]
  weekMinutes: number
  lastWeekMinutes: number
  victories: number
  inProgress: number
  active: ManaActive | null
  byQuest: { title: string; minutes: number }[]
  elsewhere: number
}
export type ManaView = ManaWeek & { realm: string; allowance: ManaAllowance | null; options: Options; lines: ManaLines | null }

export type SkyChoice = 'auto' | 'morning' | 'day' | 'evening' | 'night'
export type TerminalChoice = 'terminal' | 'iterm' | 'vscode'
// Folds are the sagas folded, by realm.
export type ChronicleScope = 'realm' | 'all'
// realmAccounts says which GitHub account each realm belongs to, by realm.
export type Settings = { sky: SkyChoice; isCalm: boolean; lastProject: string | null; folds: Record<string, string[]>; terminal: TerminalChoice; chronicleScope: ChronicleScope; letterKeys: boolean; realmAccounts: Record<string, string> }

// What the Settings page shows beside the app's own settings.
export type RealmLine = { key: string; name: string; path: string; file: string; hasCopy: boolean; logPath: string | null; isReadable: boolean }
// realm is the one you're in; null with none picked.
export type SettingsPage = { options: Options; isDefault: boolean; realm: RealmLine | null; command: InstalledCommand | null }

// Where the queue-tea command went. needsPath is when that folder may not be on
// the PATH, so the shell wouldn't find it.
export type InstalledCommand = { path: string; needsPath: boolean }

// A folder picked in the dialog, at the top of its repository if it has one.
export type FolderPick = { path: string; name: string; key: string; isKnown: boolean; isRepo: boolean }

// What brought the app forward: a link to a folder, or a Judgement notification.
export type Opened = { kind: 'folder'; pick: FolderPick } | { kind: 'judgement'; key: string } | { kind: 'failed'; message: string }

// What a form offers: the sagas to file under, the lone quests that can become
// one, and for one quest what it can move under or wait for.
export type QuestChoice = { id: string; title: string; detail: string | null }
export type Choices = { features: QuestChoice[]; lone: QuestChoice[]; parents: QuestChoice[]; waitFor: QuestChoice[] }

export type NewQuest = { title: string; priority: Priority; difficulty: Difficulty; parent: ParentPick; description: string | null; criteria: string[]; helpers: HelperId[] }
export type Seal = { waitFor: string } | { reason: string }

// What a quest carries, for its detail pane. active is only set for the quest
// in hand; a figure that can't be had is null and the rest stands.
export type QuestNote = { title: string; written: string; text: string; sections: { heading: string; lines: string[] }[] | null }
export type ActiveFacts = {
  minutes: number
  today: number
  started: string | null
  understandingMessages: number
  improvingMessages: number
  filesRead: number
  filesChanged: number
  lines: ManaLines | null
  git: { branch: string | null; head: string | null; uncommitted: string[]; uncommittedCount: number } | null
}
export type QuestActivity = {
  steps: TaskActivity[]
  commits: { id: string; at: string; message: string; remotes: string[] | null }[]
  gitUnavailable: boolean
}
export type QuestFacts = { note: QuestNote | null; messages: string[]; branchToBe: string | null; active: ActiveFacts | null; activity: QuestActivity }

// What has moved under the quest in hand.
export type LiveFacts = { drift: string[]; mismatch: { on: string | null; branch: string; uncommitted: string | null } | null; warning: string | null }
export type QuestEdit = { title?: string; description?: string | null; criteria?: string[]; difficulty?: Difficulty; helpers?: HelperId[] }

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
export type ContinueOutcome = { view: ProjectView; handover: Handover; isCodexTimeLost: boolean }

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
// isCodexTimeLost: Codex's log couldn't be read, so its time wasn't added.
export type FinishOutcome = LogOutcome & { minutes: number; victory: Victory | null; isCodexTimeLost: boolean }

// Asked: an open session writes the checkpoint, then the quest goes back. Back:
// it has gone. missedCheckpoint is set when Claude's checkpoint wasn't written,
// with when the last one was.
export type BackOutcome = { view: ProjectView; went: 'asked' | 'back'; missedCheckpoint: { lastAt: string | null } | null; isCodexTimeLost: boolean }

// The accounts gh knows. isWorking is false when a sign-in has lapsed. The app
// never holds a token: they stay in gh.
export type GithubAccount = { login: string; isActive: boolean; isWorking: boolean }
export type GithubView = { kind: 'missing' } | { kind: 'ready'; accounts: GithubAccount[] }
export type GithubLoginCode = { code: string; url: string }
export type GithubAdded = { view: GithubView; added: string | null }

// A book on the shelf. log holds the page you'd reached, one entry a day.
// firstPage is where you were when it came onto the shelf: read, but not today.
export type Book = { id: string; title: string; author: string | null; totalPages: number; firstPage: number; page: number; started: string; finished: string | null; log: { day: string; page: number }[] }
export type BookInput = { title: string; author: string | null; totalPages: number; page: number }
export type Library = { version: 1; books: Book[] }
export type LibraryView = { reading: Book[]; finished: Book[]; finishedCount: number; pagesRead: number; pagesThisWeek: number; pagesToday: number }

// What a menu bar item asks of the window. Most are the key that does the same.
export type MenuItem = { kind: 'key'; key: string; isMeta: boolean } | { kind: 'showRecord' } | { kind: 'toggleRealms' } | { kind: 'installCommand' }

// The longest order a helper takes, checked by the form and again by main.
export const HELPER_ORDER_CHARS = 4_000

// A helper at work on an order from the Guild Hall: what it is doing now, then
// what it answered. Main keeps the latest one per helper while the app runs.
export type HelperDoingKind = 'reading' | 'editing' | 'writing' | 'running' | 'step' | 'searching' | 'browsing' | 'asking' | 'skill' | 'planning' | 'thinking' | 'working'
export type HelperDoing = { kind: HelperDoingKind; target: string | null }
export type HelperJob = {
  helper: HelperId
  realm: string
  folder: string
  order: string
  // The merge it was sent to resolve, or null for an order from the Guild Hall.
  merge: string | null
  status: 'working' | 'done' | 'failed' | 'stopped'
  doing: HelperDoing | null
  steps: number
  reply: string | null
  error: string | null
  started: number
  finished: number | null
}

export type EngineApi = {
  listProjects: () => Promise<Reply<ProjectRow[]>>
  readProject: (key: string) => Promise<Reply<ProjectView>>
  readGame: () => Promise<Reply<GameView>>
  readHoard: () => Promise<Reply<HoardView>>
  readChronicle: (scope: string | null, day: string | null) => Promise<Reply<ChronicleView>>
  readMana: (key: string) => Promise<Reply<ManaView>>
  readDesigns: (key: string) => Promise<Reply<DesignsView>>
  readDesignVersion: (key: string, folder: string) => Promise<Reply<VersionView>>
  readDesign: (key: string, folder: string, id: string) => Promise<Reply<DesignRead>>
  saveDesign: (key: string, folder: string, id: string, scene: Scene, stamp: string) => Promise<Reply<DesignSave>>
  saveDesignCopy: (key: string, folder: string, id: string, scene: Scene) => Promise<Reply<string>>
  restoreDesignFile: (key: string, folder: string, file: string) => Promise<Reply<null>>
  addDesignComment: (key: string, folder: string, comment: CommentInput) => Promise<Reply<DesignComment[]>>
  setDesignComment: (key: string, folder: string, id: string, isResolved: boolean) => Promise<Reply<DesignComment[]>>
  sendDesignComments: (key: string, folder: string, next: NextVersion) => Promise<Reply<null>>
  showDesigns: (key: string) => Promise<Reply<null>>
  readSettings: () => Promise<Reply<Settings>>
  saveSettings: (patch: Partial<Settings>) => Promise<Reply<Settings>>
  readSettingsPage: (key: string | null) => Promise<Reply<SettingsPage>>
  setTaskLog: (key: string, path: string) => Promise<Reply<null>>
  showRecord: (key: string) => Promise<Reply<null>>
  openFolder: () => Promise<Reply<FolderPick | null>>
  addProject: (path: string) => Promise<Reply<string>>
  restoreRealm: (key: string) => Promise<Reply<string>>
  installCommand: () => Promise<Reply<InstalledCommand>>
  readGithub: () => Promise<Reply<GithubView>>
  startGithubLogin: () => Promise<Reply<GithubLoginCode>>
  openGithubLogin: () => Promise<Reply<null>>
  awaitGithubLogin: () => Promise<Reply<GithubAdded>>
  cancelGithubLogin: () => Promise<Reply<null>>
  readLibrary: () => Promise<Reply<LibraryView>>
  addBook: (book: BookInput) => Promise<Reply<LibraryView>>
  setBookPage: (id: string, page: number) => Promise<Reply<LibraryView>>
  finishBook: (id: string) => Promise<Reply<LibraryView>>
  removeBook: (id: string) => Promise<Reply<LibraryView>>
  // What arrived before the window was listening.
  takeOpened: () => Promise<Reply<Opened[]>>
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
  setTimeBudget: (key: string, budget: number | null) => Promise<Reply<ProjectView>>
  readLive: (key: string) => Promise<Reply<LiveFacts>>
  readQuestFacts: (key: string, taskId: string) => Promise<Reply<QuestFacts>>
  switchBranch: (key: string) => Promise<Reply<null>>
  readBranches: (key: string) => Promise<Reply<BranchGraph>>
  readBranch: (key: string, taskId: string, target: string | null) => Promise<Reply<BranchReview>>
  readMergeWorkspace: (key: string, operationId: string) => Promise<Reply<MergeWorkspace>>
  prepareMerge: (key: string, request: MergeRequest) => Promise<Reply<MergeWorkspace>>
  resolveMergeFile: (key: string, request: ResolveRequest) => Promise<Reply<MergeWorkspace>>
  completeMerge: (key: string, request: CompleteRequest) => Promise<Reply<MergeWorkspace>>
  abandonMerge: (key: string, operationId: string) => Promise<Reply<MergeWorkspace>>
  runMergeChecks: (key: string, request: RunChecksRequest) => Promise<Reply<MergeWorkspace>>
  cancelMergeChecks: (key: string, operationId: string) => Promise<Reply<null>>
  openMergeFolder: (key: string, operationId: string) => Promise<Reply<null>>
  commitBranchFiles: (key: string, request: CommitRequest) => Promise<Reply<BranchReview>>
  readPush: (key: string, operationId: string, remote: string) => Promise<Reply<PushPreview>>
  pushMerge: (key: string, preview: PushPreview) => Promise<Reply<MergeWorkspace>>
  checkStart: (key: string, taskId: string) => Promise<Reply<StartCheck>>
  startQuest: (key: string, taskId: string, platform: Platform) => Promise<Reply<StartOutcome>>
  openClaude: (key: string, taskId?: string) => Promise<Reply<Handover>>
  continueIn: (key: string, taskId: string, platform: Platform) => Promise<Reply<ContinueOutcome>>
  notYet: (key: string, taskId: string) => Promise<Reply<ProjectView>>
  finishQuest: (key: string, taskId: string, actual: Difficulty, logPath: string | null) => Promise<Reply<FinishOutcome>>
  retryTaskLog: (key: string, taskId: string, path: string) => Promise<Reply<LogOutcome>>
  putBackQuest: (key: string, taskId: string, seal: Seal | null) => Promise<Reply<BackOutcome>>
  putBackNow: (key: string, taskId: string) => Promise<Reply<BackOutcome>>
  copyText: (text: string) => Promise<Reply<null>>
  readHelpers: () => Promise<Reply<HelperJob[]>>
  sendHelper: (key: string, helper: HelperId, order: string) => Promise<Reply<HelperJob>>
  concileMerge: (key: string, helper: HelperId, operationId: string) => Promise<Reply<HelperJob>>
  stopHelper: (helper: HelperId) => Promise<Reply<null>>
  onHelpers: (listener: (jobs: HelperJob[]) => void) => () => void
  onChange: (listener: () => void) => () => void
  onMenu: (listener: (item: MenuItem) => void) => () => void
  onOpened: (listener: (opened: Opened) => void) => () => void
  log: (level: 'warn' | 'error', text: string) => void
}

export const CHANNELS = {
  listProjects: 'engine:list-projects',
  readProject: 'engine:read-project',
  readGame: 'engine:read-game',
  readHoard: 'engine:read-hoard',
  readChronicle: 'engine:read-chronicle',
  readMana: 'engine:read-mana',
  readDesigns: 'engine:read-designs',
  readDesignVersion: 'engine:read-design-version',
  readDesign: 'engine:read-design',
  saveDesign: 'engine:save-design',
  saveDesignCopy: 'engine:save-design-copy',
  restoreDesignFile: 'engine:restore-design-file',
  addDesignComment: 'engine:add-design-comment',
  setDesignComment: 'engine:set-design-comment',
  sendDesignComments: 'engine:send-design-comments',
  showDesigns: 'engine:show-designs',
  readSettings: 'engine:read-settings',
  saveSettings: 'engine:save-settings',
  readSettingsPage: 'engine:read-settings-page',
  setTaskLog: 'engine:set-task-log',
  showRecord: 'engine:show-record',
  openFolder: 'engine:open-folder',
  addProject: 'engine:add-project',
  restoreRealm: 'engine:restore-realm',
  installCommand: 'engine:install-command',
  readGithub: 'engine:read-github',
  startGithubLogin: 'engine:start-github-login',
  openGithubLogin: 'engine:open-github-login',
  awaitGithubLogin: 'engine:await-github-login',
  cancelGithubLogin: 'engine:cancel-github-login',
  readLibrary: 'engine:read-library',
  addBook: 'engine:add-book',
  setBookPage: 'engine:set-book-page',
  finishBook: 'engine:finish-book',
  removeBook: 'engine:remove-book',
  takeOpened: 'engine:take-opened',
  opened: 'engine:opened',
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
  setTimeBudget: 'engine:set-time-budget',
  readLive: 'engine:read-live',
  readQuestFacts: 'engine:read-quest-facts',
  switchBranch: 'engine:switch-branch',
  readBranches: 'engine:read-branches',
  readBranch: 'engine:read-branch',
  readMergeWorkspace: 'engine:read-merge-workspace',
  prepareMerge: 'engine:prepare-merge',
  resolveMergeFile: 'engine:resolve-merge-file',
  completeMerge: 'engine:complete-merge',
  abandonMerge: 'engine:abandon-merge',
  runMergeChecks: 'engine:run-merge-checks',
  cancelMergeChecks: 'engine:cancel-merge-checks',
  openMergeFolder: 'engine:open-merge-folder',
  commitBranchFiles: 'engine:commit-branch-files',
  readPush: 'engine:read-push',
  pushMerge: 'engine:push-merge',
  checkStart: 'engine:check-start',
  startQuest: 'engine:start-quest',
  openClaude: 'engine:open-claude',
  continueIn: 'engine:continue-in',
  notYet: 'engine:not-yet',
  finishQuest: 'engine:finish-quest',
  retryTaskLog: 'engine:retry-task-log',
  putBackQuest: 'engine:put-back-quest',
  putBackNow: 'engine:put-back-now',
  copyText: 'engine:copy-text',
  readHelpers: 'engine:read-helpers',
  sendHelper: 'engine:send-helper',
  concileMerge: 'engine:concile-merge',
  stopHelper: 'engine:stop-helper',
  helpers: 'engine:helpers',
  changed: 'engine:changed',
  menu: 'engine:menu',
  log: 'engine:log',
} as const
