import { branchGraph, branchReview, mergeWorkspace } from './features/branches/test_fixtures'
import { vi } from 'vitest'

import type { DesignsView } from '../shared/designs'
import type { ActiveQuest, ChronicleView, DayTime, EngineApi, GameView, HelperJob, HoardView, LibraryView, ManaView, ProjectRow, ProjectView, QuestFacts, QuestRow, Reply, SettingsPage, Victory, VictoryLine } from '../shared/engine_api'
import type { Note, NotesView } from '../shared/notes'

export const quest = (over: Partial<QuestRow> & { id: string }): QuestRow => ({
  title: over.id,
  priority: 'mid',
  difficulty: 'medium',
  xp: 25,
  estimateMinutes: 90,
  waitedMs: 86_400_000 * 6,
  why: null,
  isStar: false,
  isPlayNext: false,
  parentId: null,
  sealedBecause: null,
  branch: null,
  created: '2026-10-20T09:00:00+02:00',
  description: null,
  criteria: [],
  fits: null,
  goal: null,
  acceptance: [],
  helpers: ['tea-dd'],
  ...over,
})

export const activeQuest = (over: Partial<ActiveQuest> = {}): ActiveQuest => ({
  id: 'active',
  title: 'Active one',
  priority: 'high',
  difficulty: 'hard',
  xp: 50,
  branch: 'task/active',
  minutes: 14,
  started: '2026-10-27T16:00:00+01:00',
  isBoss: false,
  improvingMessages: 1,
  filesChanged: 2,
  review: null,
  criteria: [],
  helpers: ['tea-dd'],
  asking: null,
  codexSince: null,
  worktreePath: null,
  baseBranch: null,
  parentId: null,
  ...over,
})

export const VICTORY: Victory = {
  kind: 'quest',
  title: 'Active one',
  actual: 'hard',
  expected: 'hard',
  xp: 50,
  gold: 50,
  level: 2,
  didLevelUp: false,
  xpIntoLevel: 70,
  xpToNextLevel: 200,
  nextLevelAt: 300,
  hoard: 170,
  stage: 'hatchling',
  newBadges: [],
}

export const projectRow = (key: string, over: Partial<Extract<ProjectRow, { kind: 'readable' }>> = {}): ProjectRow => ({
  kind: 'readable',
  key,
  name: key.split('-')[0]!,
  path: `/p/${key}`,
  waiting: 0,
  status: { kind: 'nothing' },
  session: 'none',
  ...over,
})

export const projectView = (key: string, over: Partial<Extract<ProjectView, { kind: 'readable' }>> = {}): ProjectView => ({
  kind: 'readable',
  key,
  name: key.split('-')[0]!,
  path: `/p/${key}`,
  session: { state: 'none', allowance: null },
  active: null,
  activeQuests: over.activeQuests ?? (over.active ? [over.active] : []),
  branches: [],
  ready: [],
  sealed: [],
  canStart: 0,
  sealedCount: 0,
  activeSaga: null,
  activeSagaId: null,
  victories: [],
  victoryCount: 0,
  docsLogPath: 'docs/task_log.md',
  budget: null,
  ...over,
})

export const GAME: GameView = {
  victories: 5,
  xp: 120,
  gold: 120,
  level: 2,
  xpIntoLevel: 20,
  xpToNextLevel: 200,
  stage: 'hatchling',
  streak: 1,
  bestStreak: 3,
  wonToday: true,
  badges: [{ id: 'firstFlame', need: 1, have: 1, earnedOn: '2026-10-20' }],
  allowance: { percent: 62, resetsAt: null },
}

const { allowance: _allowance, ...GAME_ONLY } = GAME
export const HOARD: HoardView = { game: GAME_ONLY, realms: [{ key: 'a-000001', name: 'queue-tea', victories: 4, gold: 95 }, { key: 'b-000002', name: 'Gait-feedback', victories: 1, gold: 25 }], unreadable: 0 }

const WEEK = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25']
const empty = (day: string): DayTime => ({ day, onQuests: 0, elsewhere: 0 })

export const victoryLine = (over: Partial<VictoryLine> = {}): VictoryLine => ({
  id: 'won',
  title: 'Short branch names',
  priority: 'urgent',
  realm: 'queue-tea',
  realmPath: '/p/a-000001',
  started: '2026-10-22T15:58:00+02:00',
  finished: '2026-10-22T16:23:00+02:00',
  minutes: 25,
  expected: 'hard',
  actual: 'medium',
  xp: 25,
  improvingMessages: 6,
  filesRead: 2,
  filesChanged: 16,
  linesAdded: 958,
  linesRemoved: 799,
  filesTouched: 27,
  branch: 'task/short-branch',
  startCommit: 'c1fc0351234',
  ...over,
})

export const CHRONICLE: ChronicleView = {
  days: WEEK.map((day, i) => (i === 3 ? { day, onQuests: 54, elsewhere: 77 } : empty(day))),
  victories: [victoryLine()],
  minutes: 131,
  onQuests: 54,
  elsewhere: 77,
  asExpected: 0,
  harder: 0,
  easier: 1,
  xp: 25,
  lastWeek: { victories: 2, minutes: 300 },
  hasAny: true,
  isThisWeek: true,
  unreadable: 0,
}

export const QUEST_FACTS: QuestFacts = { note: null, messages: [], branchToBe: null, active: null, activity: { steps: [], commits: [], gitUnavailable: false } }

export const SETTINGS_PAGE: SettingsPage = {
  options: { idleGapMinutes: 15, freshAtTokens: 100_000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
  isDefault: true,
  realm: { key: 'a-000001', name: 'a', path: '/p/a-000001', file: 'a-000001.json', hasCopy: true, logPath: 'notes/log.md', isReadable: true },
  command: null,
}

export const DESIGNS: DesignsView = { versions: [], coming: [] }

export const NOTES: NotesView = { notes: [], unreadable: [], folder: '/Users/me/.queue-tea/notes/a-000001' }

export const note = (over: Partial<Note> = {}): Note => ({ id: 'n-00000001', title: 'Bug Bounty Helper', folder: 'Ideas', type: null, isPinned: false, tags: [], created: '2026-11-07T10:00:00+01:00', updated: '2026-11-07T10:00:00+01:00', isArchived: false, quests: [], body: '', stamp: 's-1', ...over })

export const LIBRARY: LibraryView = { reading: [], finished: [], finishedCount: 0, pagesRead: 0, pagesThisWeek: 0, pagesToday: 0 }

export const MANA: ManaView = {
  realm: 'queue-tea',
  today: { day: '2026-10-27', onQuests: 19, elsewhere: 118 },
  days: WEEK.map((day, i) => (i === 0 ? { day, onQuests: 19, elsewhere: 118 } : empty(day))),
  weekMinutes: 137,
  lastWeekMinutes: 354,
  victories: 0,
  inProgress: 1,
  active: { title: 'The boss', isBoss: true, minutes: 43, understandingMessages: 0, improvingMessages: 4, filesRead: 33, filesChanged: 39 },
  byQuest: [{ title: 'The boss', minutes: 19 }],
  elsewhere: 118,
  allowance: { percent: 62, resetsAt: null, seenAt: Date.parse('2026-10-27T17:48:00'), isStale: false },
  options: { idleGapMinutes: 15, freshAtTokens: 100_000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
  lines: { added: 812, removed: 95, since: '1649ade' },
}

const reply = async (key: string): Promise<Reply<ProjectView>> => ({ ok: true, data: projectView(key) })

export const helperJob = (over: Partial<HelperJob> = {}): HelperJob => ({
  helper: 'tea-dd',
  realm: 'a-000001',
  folder: '/p/a-000001',
  order: 'Write tests for the timer',
  merge: null,
  status: 'working',
  doing: null,
  steps: 0,
  reply: null,
  error: null,
  started: Date.parse('2026-10-27T17:50:00Z'),
  finished: null,
  ...over,
})

// An engine held in memory. A test swaps any call, and `fire` plays a change.
export const fakeEngine = (over: Partial<EngineApi> = {}) => {
  const listeners = new Set<() => void>()
  const helperListeners = new Set<(jobs: HelperJob[]) => void>()
  const engine: EngineApi = {
    readAppUpdate: async () => ({ ok: true, data: { running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: null, state: { phase: 'idle', commit: null, detail: null }, canRetry: false, canRestart: false } }),
    applyAppUpdate: vi.fn(async () => ({ ok: true as const, data: { running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: null, state: { phase: 'idle' as const, commit: null, detail: null }, canRetry: false, canRestart: false } })),
    listProjects: async () => ({ ok: true, data: [projectRow('a-000001')] }),
    readProject: async key => ({ ok: true, data: projectView(key) }),
    readGame: async () => ({ ok: true, data: GAME }),
    readHoard: async () => ({ ok: true, data: HOARD }),
    readChronicle: vi.fn(async () => ({ ok: true as const, data: CHRONICLE })),
    readMana: vi.fn(async () => ({ ok: true as const, data: MANA })),
    readDesigns: vi.fn(async () => ({ ok: true as const, data: DESIGNS })),
    readDesignVersion: vi.fn(async (_key: string, folder: string) => ({ ok: true as const, data: { folder, label: folder, designs: [], comments: [], commentsProblem: null, uncommitted: 0 } })),
    readDesign: vi.fn(async () => ({ ok: false as const, error: { message: 'No design in this test.' } })),
    saveDesign: vi.fn(async () => ({ ok: true as const, data: { kind: 'saved' as const, stamp: 'saved', at: 0 } })),
    saveDesignCopy: vi.fn(async () => ({ ok: true as const, data: 'copy' })),
    restoreDesignFile: vi.fn(async () => ({ ok: true as const, data: null })),
    addDesignComment: vi.fn(async () => ({ ok: true as const, data: [] })),
    setDesignComment: vi.fn(async () => ({ ok: true as const, data: [] })),
    sendDesignComments: vi.fn(async () => ({ ok: true as const, data: null })),
    showDesigns: vi.fn(async () => ({ ok: true as const, data: null })),
    readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } }),
    saveSettings: vi.fn(async patch => ({ ok: true as const, data: { sky: 'day' as const, isCalm: false, lastProject: null, folds: {}, terminal: 'terminal' as const, chronicleScope: 'realm' as const, letterKeys: true, realmAccounts: {}, ...patch } })),
    readSettingsPage: async () => ({ ok: true, data: SETTINGS_PAGE }),
    setTaskLog: vi.fn(async () => ({ ok: true as const, data: null })),
    showRecord: vi.fn(async () => ({ ok: true as const, data: null })),
    openFolder: vi.fn(async () => ({ ok: true as const, data: null })),
    addProject: vi.fn(async (path: string) => ({ ok: true as const, data: path })),
    restoreRealm: vi.fn(async () => ({ ok: true as const, data: 'kept.json' })),
    installCommand: vi.fn(async () => ({ ok: true as const, data: { path: '/usr/local/bin/queue-tea', needsPath: false } })),
    readGithub: vi.fn(async () => ({ ok: true as const, data: { kind: 'ready' as const, accounts: [] } })),
    startGithubLogin: vi.fn(async () => ({ ok: true as const, data: { code: 'AAAA-BBBB', url: 'https://github.com/login/device' } })),
    openGithubLogin: vi.fn(async () => ({ ok: true as const, data: null })),
    awaitGithubLogin: vi.fn(async () => ({ ok: true as const, data: { view: { kind: 'ready' as const, accounts: [] }, added: null } })),
    cancelGithubLogin: vi.fn(async () => ({ ok: true as const, data: null })),
    readLibrary: vi.fn(async () => ({ ok: true as const, data: LIBRARY })),
    addBook: vi.fn(async () => ({ ok: true as const, data: LIBRARY })),
    setBookPage: vi.fn(async () => ({ ok: true as const, data: LIBRARY })),
    finishBook: vi.fn(async () => ({ ok: true as const, data: LIBRARY })),
    removeBook: vi.fn(async () => ({ ok: true as const, data: LIBRARY })),
    readNotes: vi.fn(async () => ({ ok: true as const, data: NOTES })),
    showNotes: vi.fn(async () => ({ ok: true as const, data: null })),
    openLink: vi.fn(async () => ({ ok: true as const, data: null })),
    createNote: vi.fn(async () => ({ ok: true as const, data: { view: NOTES, id: 'n-00000001' } })),
    saveNote: vi.fn(async (_key: string, id: string, change: Pick<Note, 'title' | 'folder' | 'tags' | 'body'>) => ({ ok: true as const, data: { kind: 'saved' as const, view: NOTES, note: note({ id, ...change, stamp: 's-2' }), relinked: 0 } })),
    archiveNote: vi.fn(async () => ({ ok: true as const, data: NOTES })),
    renameFolder: vi.fn(async () => ({ ok: true as const, data: NOTES })),
    deleteNote: vi.fn(async () => ({ ok: true as const, data: NOTES })),
    fileNoteQuests: vi.fn(async (key: string) => ({ ok: true as const, data: { view: NOTES, project: projectView(key) } })),
    takeOpened: async () => ({ ok: true, data: [] }),
    readChoices: async () => ({ ok: true, data: { features: [], lone: [], parents: [], waitFor: [] } }),
    setPriority: vi.fn(reply),
    togglePlayNext: vi.fn(reply),
    fileQuest: vi.fn(reply),
    moveQuest: vi.fn(reply),
    sealQuest: vi.fn(reply),
    unsealQuest: vi.fn(reply),
    removeQuest: vi.fn(reply),
    restoreQuest: vi.fn(reply),
    editQuest: vi.fn(reply),
    setActiveSaga: vi.fn(reply),
    setTimeBudget: vi.fn(reply),
    readQuestFacts: vi.fn(async () => ({ ok: true as const, data: QUEST_FACTS })),
    readLive: vi.fn(async () => ({ ok: true as const, data: { drift: [], mismatch: null, warning: null } })),
    switchBranch: vi.fn(async () => ({ ok: true as const, data: null })),
    readBranches: vi.fn(async () => ({ ok: true as const, data: { ...branchGraph(), tasks: [] } })),
    readBranch: vi.fn(async () => ({ ok: true as const, data: branchReview() })),
    readMergeWorkspace: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    prepareMerge: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    resolveMergeFile: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    completeMerge: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    abandonMerge: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    runMergeChecks: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    cancelMergeChecks: vi.fn(async () => ({ ok: true as const, data: null })),
    openMergeFolder: vi.fn(async () => ({ ok: true as const, data: null })),
    commitBranchFiles: vi.fn(async () => ({ ok: true as const, data: branchReview() })),
    readPush: vi.fn(async () => ({ ok: false as const, error: { message: 'Remote unavailable.' } })),
    pushMerge: vi.fn(async () => ({ ok: true as const, data: mergeWorkspace() })),
    checkStart: vi.fn(async () => ({ ok: true as const, data: { kind: 'clear' as const, step: { kind: 'make' as const, branch: 'task/first', from: 'main' } } })),
    startQuest: vi.fn(async (key: string) => ({ ok: true as const, data: { kind: 'started' as const, view: projectView(key), branch: 'task/first', notice: null, handover: { kind: 'session' as const } } })),
    openClaude: vi.fn(async () => ({ ok: true as const, data: { kind: 'opened' as const, terminal: 'terminal' as const } })),
    continueIn: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), handover: { kind: 'opened' as const, terminal: 'terminal' as const }, isCodexTimeLost: false } })),
    notYet: vi.fn(reply),
    finishQuest: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: VICTORY, isCodexTimeLost: false } })),
    retryTaskLog: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), logPath: 'docs/task_log.md', logFailedAt: null } })),
    putBackQuest: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), went: 'back' as const, missedCheckpoint: null, isCodexTimeLost: false } })),
    putBackNow: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), went: 'back' as const, missedCheckpoint: { lastAt: null }, isCodexTimeLost: false } })),
    copyText: vi.fn(async () => ({ ok: true as const, data: null })),
    readHelpers: async () => ({ ok: true, data: [] }),
    sendHelper: vi.fn(async (key: string, helper: HelperJob['helper'], order: string) => ({ ok: true as const, data: helperJob({ realm: key, helper, order }) })),
    concileMerge: vi.fn(async (key: string, helper: HelperJob['helper'], operationId: string) => ({ ok: true as const, data: helperJob({ realm: key, helper, merge: operationId, order: 'Resolve the conflicts' }) })),
    stopHelper: vi.fn(async () => ({ ok: true as const, data: null })),
    onHelpers: listener => {
      helperListeners.add(listener)

      return () => helperListeners.delete(listener)
    },
    onChange: listener => {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    onMenu: () => () => {},
    onOpened: () => () => {},
    log: vi.fn(),
    ...over,
  }

  return { engine, fire: () => listeners.forEach(listener => listener()), tellHelpers: (jobs: HelperJob[]) => helperListeners.forEach(listener => listener(jobs)) }
}
