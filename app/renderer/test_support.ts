import { vi } from 'vitest'

import type { ActiveQuest, ChronicleView, DayTime, EngineApi, GameView, HoardView, LibraryView, ManaView, ProjectRow, ProjectView, QuestFacts, QuestRow, Reply, SettingsPage, Victory, VictoryLine } from '../shared/engine_api'

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

export const QUEST_FACTS: QuestFacts = { note: null, messages: [], branchToBe: null, active: null }

export const SETTINGS_PAGE: SettingsPage = {
  options: { idleGapMinutes: 15, freshAtTokens: 100_000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
  isDefault: true,
  realm: { key: 'a-000001', name: 'a', path: '/p/a-000001', file: 'a-000001.json', hasCopy: true, logPath: 'notes/log.md', isReadable: true },
  command: null,
}

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

// An engine held in memory. A test swaps any call, and `fire` plays a change.
export const fakeEngine = (over: Partial<EngineApi> = {}) => {
  const listeners = new Set<() => void>()
  const engine: EngineApi = {
    listProjects: async () => ({ ok: true, data: [projectRow('a-000001')] }),
    readProject: async key => ({ ok: true, data: projectView(key) }),
    readGame: async () => ({ ok: true, data: GAME }),
    readHoard: async () => ({ ok: true, data: HOARD }),
    readChronicle: vi.fn(async () => ({ ok: true as const, data: CHRONICLE })),
    readMana: vi.fn(async () => ({ ok: true as const, data: MANA })),
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
    checkStart: vi.fn(async () => ({ ok: true as const, data: { kind: 'clear' as const, step: { kind: 'make' as const, branch: 'task/first', from: 'main' } } })),
    startQuest: vi.fn(async (key: string) => ({ ok: true as const, data: { kind: 'started' as const, view: projectView(key), branch: 'task/first', notice: null, handover: { kind: 'session' as const } } })),
    openClaude: vi.fn(async () => ({ ok: true as const, data: { kind: 'opened' as const, terminal: 'terminal' as const } })),
    notYet: vi.fn(reply),
    finishQuest: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: VICTORY } })),
    retryTaskLog: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), logPath: 'docs/task_log.md', logFailedAt: null } })),
    putBackQuest: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), went: 'back' as const, missedCheckpoint: null } })),
    putBackNow: vi.fn(async (key: string) => ({ ok: true as const, data: { view: projectView(key), went: 'back' as const, missedCheckpoint: { lastAt: null } } })),
    copyText: vi.fn(async () => ({ ok: true as const, data: null })),
    onChange: listener => {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    onMenu: () => () => {},
    onOpened: () => () => {},
    log: vi.fn(),
    ...over,
  }

  return { engine, fire: () => listeners.forEach(listener => listener()) }
}
