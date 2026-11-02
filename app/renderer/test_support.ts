import { vi } from 'vitest'

import type { EngineApi, GameView, ProjectRow, ProjectView, QuestRow, Reply } from '../shared/engine_api'

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
    readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {} } }),
    saveSettings: vi.fn(async patch => ({ ok: true as const, data: { sky: 'day' as const, isCalm: false, lastProject: null, folds: {}, ...patch } })),
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
    onChange: listener => {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    log: vi.fn(),
    ...over,
  }

  return { engine, fire: () => listeners.forEach(listener => listener()) }
}
