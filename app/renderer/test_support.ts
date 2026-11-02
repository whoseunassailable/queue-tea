import { vi } from 'vitest'

import type { ActiveQuest, EngineApi, GameView, ProjectRow, ProjectView, QuestRow, Reply, Victory } from '../shared/engine_api'

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
  badges: [{ id: 'firstFlame', need: 1, have: 1, earnedOn: '2026-10-20' }],
  allowance: { percent: 62, resetsAt: null },
}

const reply = async (key: string): Promise<Reply<ProjectView>> => ({ ok: true, data: projectView(key) })

// An engine held in memory. A test swaps any call, and `fire` plays a change.
export const fakeEngine = (over: Partial<EngineApi> = {}) => {
  const listeners = new Set<() => void>()
  const engine: EngineApi = {
    listProjects: async () => ({ ok: true, data: [projectRow('a-000001')] }),
    readProject: async key => ({ ok: true, data: projectView(key) }),
    readGame: async () => ({ ok: true, data: GAME }),
    readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal' } }),
    saveSettings: vi.fn(async patch => ({ ok: true as const, data: { sky: 'day' as const, isCalm: false, lastProject: null, folds: {}, terminal: 'terminal' as const, ...patch } })),
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
    log: vi.fn(),
    ...over,
  }

  return { engine, fire: () => listeners.forEach(listener => listener()) }
}
