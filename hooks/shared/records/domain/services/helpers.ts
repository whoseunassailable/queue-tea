import type { HelperId, TaskHelpers } from '../../../../../types'

// One list that the mod, the app's main-process check and the Guild Hall all read.
export const HELPER_IDS: readonly HelperId[] = ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd', 'tea-concile']

// The helpers a quest can work with. Tea-Concile isn't one: it is sent to a
// merge with conflicts in Branches, not turned on for a quest's own work.
export const QUEST_HELPER_IDS: readonly HelperId[] = HELPER_IDS.filter(id => id !== 'tea-concile')

export const isHelperId = (value: unknown): value is HelperId =>
  HELPER_IDS.includes(value as HelperId)

export const isQuestHelperId = (value: unknown): value is HelperId =>
  QUEST_HELPER_IDS.includes(value as HelperId)

export const defaultHelpers = (): TaskHelpers => ({ on: ['tea-dd'], ran: [], reminded: false })

// Reads a hand-edited helpers field: anything that isn't a list falls back.
export const readHelpers = (value: unknown): TaskHelpers => {
  const h = (value ?? {}) as { on?: unknown; ran?: unknown; reminded?: unknown }
  const list = (v: unknown, fallback: HelperId[]) => (Array.isArray(v) ? onlyHelpers(v.filter(isHelperId)) : fallback)

  return { on: list(h.on, defaultHelpers().on).filter(isQuestHelperId), ran: list(h.ran, []), reminded: h.reminded === true }
}

export const onlyHelpers = (ids: readonly HelperId[]): HelperId[] =>
  HELPER_IDS.filter(id => ids.includes(id))
