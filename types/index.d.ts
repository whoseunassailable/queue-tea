export type Priority = 'urgent' | 'high' | 'mid' | 'okay' | 'low'
export type Difficulty = 'light' | 'medium' | 'hard'
export type TaskState = 'queued' | 'current' | 'done' | 'removed'
export type Intent = 'understanding' | 'improving'

export type Effort = {
  understandingMessages: number
  improvingMessages: number
  filesRead: number
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  filesTouched: number
}

// One shell command Claude ran during a task, as Queue-tea saw it.
export type CommandRun = { command: string; isOk: boolean; isTest: boolean; at: string; summary: string }

// What git said when Queue-tea last looked.
export type GitFacts = { branch: string | null; head: string | null; uncommitted: string[] }

// What a fresh conversation needs to carry a task on. Claude writes the first
// part at a handoff; Queue-tea fills `seen` itself after every turn.
export type Checkpoint = {
  written: string | null
  goal: string
  acceptance: string[]
  changes: string[]
  decisions: string[]
  rejected: string[]
  remaining: string[]
  blockers: string[]
  nextAction: string
  seen: { at: string; files: string[]; commands: CommandRun[]; git: GitFacts | null } | null
}

export type Task = {
  id: string
  title: string
  state: TaskState
  priority: Priority
  difficulty: { expected: Difficulty; actual: Difficulty | null }
  messages: string[]
  handoff: { text: string; written: string } | null
  branch: string | null
  baseBranch: string | null
  startCommit: string | null
  blockedBy: string[]
  blockedReason: string | null
  checkpoint: Checkpoint | null
  created: string
  started: string | null
  finished: string | null
  minutesByDay: Record<string, number>
  effort: Effort
  files: { read: string[]; changed: string[] }
  // The feature this task is part of; null for a task on its own. One level
  // deep: a task with tasks under it is part of none.
  parentId: string | null
}

export type ProjectRecord = {
  version: 1
  project: { name: string; path: string }
  docsLogPath: string | null
  playNext: string | null
  // The feature Rohan is working within, whose tasks new work is offered
  // under; null for none. Set and cleared only by Rohan.
  feature: string | null
  tasks: Task[]
  unassignedMinutesByDay: Record<string, number>
}

export type GitState = {
  isRepo: boolean
  branch: string | null
  isDetached: boolean
  head: string | null
  uncommitted: number
  unpushed: number
  hasUpstream: boolean
}

export type CheckAnswer = {
  kind: 'same' | 'new' | 'quick' | 'unsure'
  intent: Intent
  title?: string
  difficulty?: Difficulty
  // For new work: the id of the feature it is part of, 'none' or 'unsure'.
  parent?: string
}

// What a new task is filed under: nothing, a task already there, or a new
// feature filed with it.
export type ParentPick = { kind: 'none' } | { kind: 'task'; id: string } | { kind: 'new'; title: string }

export type Band =
  | { kind: 'none' }
  | {
      kind: 'file'
      text: string
      title: string
      priority: Priority
      difficulty: Difficulty
      intent: Intent
      // The features offered and the one picked; null while Rohan is asked.
      // Left out when there is nothing to offer: the task goes on its own.
      parent?: ParentPick | null
      choices?: string[]
    }
  | { kind: 'unsure'; text: string; intent: Intent; didCheckRun: boolean }
  | { kind: 'difficulty'; taskId: string; picked: Difficulty }
  | { kind: 'docsPath'; taskId: string; suggested: string }

// Another project's queue, one line in the panel.
export type OtherProject = { name: string; waiting: number; next: string | null }

export type Allowance = { percent: number; resetsAt: string | null }

// Which of the tea cup's menu views shows.
export type MenuView = 'menu' | 'brew' | 'backlog' | 'current' | 'history' | 'usage' | 'settings' | 'help'

export type Options = {
  idleGapMinutes: number
  freshAtTokens: number
  handoffAtPercent: number
  checkTimeoutSeconds: number
}

export type Ctx = {
  cwd: string
  projectPath: string
  projectName: string
  file: string
  offsetMinutes: number
  options: Options
}

declare module 'claude-code' {
  interface PluginState {
    'queue-tea': {
      record: ProjectRecord | null
      load: 'loading' | 'ready' | 'failed'
      hold: { taskId: string; text: string } | null
      band: Band
      bandQueue: Band[]
      isAskingDone: boolean
      isChoosingNext: boolean
      openRow: string | null
      isChecking: boolean
      allowance: Allowance | null
      notice: string | null
      spin: number
      canContinue: boolean
      mismatch: string | null
      checked: string | null
      busy: string | null
      warning: string | null
      blocking: string | null
      budget: number | null
      drift: string[]
      lines: { taskId: string; added: number; removed: number } | null
      others: OtherProject[]
      menuView: MenuView
      isMenuOpen: boolean
      isCupStill: boolean
      parenting: string | null
      openParents: string[]
    }
  }
}
