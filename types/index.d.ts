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

// The step a task is on: what Claude or Codex is doing now, or did last, as
// one line. It keeps no command output. A background shell keeps its id
// until its end is reported.
export type TaskStep = {
  id: string
  at: string
  finished: string | null
  kind: 'branchCreated' | 'branchSwitched' | 'read' | 'edit' | 'write' | 'command' | 'test'
  status: 'running' | 'succeeded' | 'failed' | 'blocked'
  subject: string
  backgroundId?: string
}

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

export type HelperId = 'commit-chai-n' | 'mocha-mockup' | 'chai-pter' | 'tea-dd'
export type TaskHelpers = { on: HelperId[]; ran: HelperId[]; reminded: boolean }

// How much checking a quest's change gets, from a look at the screen to the
// whole suite. Tea-DD picks one with a reason; Rohan's pick always stands.
export type TestProfileId = 'quick' | 'standard' | 'deep' | 'critical' | 'release'
export type TestProfile = { id: TestProfileId; by: 'tea-dd'; reason: string } | { id: TestProfileId; by: 'rohan' }

// What Queue-tea may do with git in a realm. Manual: Rohan does it all.
// Assisted: Claude proposes a commit, Rohan approves it in the app's Branches.
export type GitMode = 'manual' | 'assisted'

// A commit Claude proposed for Rohan to approve in Branches. head is the
// branch's commit when it was proposed, so a later commit makes it stale.
export type CommitProposal = { message: string; files: string[]; head: string; at: string }

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
  // The features this task is part of, in the order they were picked; empty
  // for a task on its own. The first is where its row stands in the backlog.
  // One level deep: a task with tasks under it is part of none. Older records
  // kept one `parentId`, read as a list of one.
  parentIds: string[]
  // What the task is for and how to tell it's finished. Any task can become a
  // feature, so every task has them. `criteria` holds what counts under every
  // feature it is part of.
  description: string | null
  criteria: string[]
  // A set of criteria for each feature, by the feature's id, when a task under
  // two or more was given a set for each; absent while one set serves them
  // all. A set stays when the task leaves that feature, so moving it back
  // brings the set back.
  criteriaByParent?: Record<string, string[]>
  // Set when Claude says the task looks done, cleared by Rohan's answer.
  review: { at: string; checked: string | null } | null
  // The step it is on now; absent before its first. Older records kept every
  // step, with its output, in `activity`, which is dropped when they are read.
  step?: TaskStep
  // Background shells still running, so a background check's time counts as
  // testing when its end arrives. At most ten; absent for none.
  waiting?: TaskStep[]
  // Which helpers Claude works with on this task, which have run, and whether Claude has had its one reminder at done.
  helpers: TaskHelpers
  // When the task went to the Codex CLI; null while Claude Code has it. Codex
  // runs without the mod, so its time is read from Codex's log when it leaves.
  codexSince: string | null
  // The task's own checkout. Older tasks keep using the project's folder.
  worktreePath: string | null
  // The latest commit Claude proposed in an Assisted realm; absent for none.
  commitProposal?: CommitProposal
  // Absent until Tea-DD or Rohan picks one, and in older records.
  testProfile?: TestProfile
  // When the quest's checks ran, merged, and how many of its clock minutes fell
  // inside them; the rest is building time. Absent before any check finished.
  testPeriods?: WorkPeriod[]
  minutesInChecks?: number
  // The day it's due, as YYYY-MM-DD on Rohan's own calendar; absent for none
  // and in older records. The realm calendar shows it on that day.
  due?: string
  // Planning, from the app's Plan tab. Each is absent in older records and is
  // read defensively, so a hand-edited value that doesn't read counts as none.
  // Its place among the quests beside it in the backlog, lowest first; absent
  // until it is dragged, when it follows the ranked ones in the ★ order.
  rank?: number
  // Labels to filter by, each once.
  tags?: string[]
  // Effort points: Rohan's estimate of its size, never minutes. Measured time
  // stays in `minutesByDay`.
  points?: number
  // The quest this is a child quest of. Its sagas stay in `parentIds`, so the
  // quest board still lists it under them; the Plan backlog nests it here.
  parentQuest?: string
  // Relates to and duplicates. Depends on and blocks are `blockedBy`, read
  // from either end.
  links?: QuestLink[]
}

export type QuestLinkKind = 'relates' | 'duplicates'
export type QuestLink = { kind: QuestLinkKind; id: string }

// Who works on a task in progress.
export type Platform = 'claude' | 'codex'

// What the app asks an open session to do. The session removes it under the
// lock as it takes it, so with two sessions only one acts. A putBack can carry
// what the task goes back blocked on.
export type AppRequest = { id: string; kind: 'begin' | 'putBack'; taskId: string; at: string; block?: { waitFor: string } | { reason: string } }

export type WorkPeriod = { start: number; end: number }

// Merged periods for Realm totals, independent of the tasks' minute counters.
// Accounted minutes distinguish timed work from older totals without periods.
export type RealmTime = {
  days: Record<string, { onQuests: WorkPeriod[]; elsewhere: WorkPeriod[] }>
  accountedOnQuests: Record<string, number>
  accountedElsewhere: Record<string, number>
}

export type ProjectRecord = {
  version: 1 | 2
  project: { name: string; path: string }
  docsLogPath: string | null
  playNext: string | null
  // The feature Rohan is working within, whose tasks new work is offered
  // under; null for none. Set and cleared only by Rohan.
  feature: string | null
  tasks: Task[]
  unassignedMinutesByDay: Record<string, number>
  realmTime?: RealmTime
  requests: AppRequest[]
  // Absent in records made before Git modes: read as 'assisted'.
  gitMode?: GitMode
}

// What a new task is filed under: nothing, a task already there, a new
// feature filed with it, or two or more of those at once (`title` names the
// new feature filed with them, null for none).
export type ParentPick =
  | { kind: 'none' }
  | { kind: 'task'; id: string }
  | { kind: 'new'; title: string }
  | { kind: 'several'; ids: string[]; title: string | null }

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

// Why the record can't be read, and whether its last good copy can take its place.
// Why the record can't be read, and, when the usual Try again won't do, what to do.
export type LoadError = { reason: string; canRestore: boolean; fix?: string }

export type Allowance = { percent: number; resetsAt: string | null }

// Which of the tea cup's menu views shows.
export type MenuView = 'menu' | 'brew' | 'backlog' | 'current' | 'history' | 'usage' | 'settings' | 'help'

declare module 'claude-code' {
  interface PluginState {
    'queue-tea': {
      record: ProjectRecord | null
      load: 'loading' | 'ready' | 'failed'
      loadError: LoadError | null
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
