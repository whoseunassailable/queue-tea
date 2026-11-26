import type { HelperId, Task, TestProfileId } from '../../../../../types'
import { onlyHelpers } from './helpers'

// When a helper runs. Automatic: on for every new quest, at the level the
// change needs. Conditional: only when it is on for the quest and the change
// has the stage it does. Manual: only when Rohan starts it, never from a
// quest's brief. docs/helper-policies.md says the same in prose.
export type Invocation = 'automatic' | 'conditional' | 'manual'

export const HELPER_POLICIES: Record<HelperId, Invocation> = {
  'mocha-mockup': 'conditional',
  'tea-dd': 'automatic',
  'chai-pter': 'conditional',
  'commit-chai-n': 'conditional',
}

// The helpers a profile has no stage for. A Quick change (only how it looks,
// its text or its order) goes classify, implement, Quick checks, review: it
// needs no design and no docs pass, and its checks are light enough for
// Claude to run without a Tea-DD run. Every other profile keeps what is on.
const SKIPPED_AT: Record<TestProfileId, readonly HelperId[]> = {
  quick: ['mocha-mockup', 'tea-dd', 'chai-pter'],
  standard: [],
  deep: [],
  critical: [],
  release: [],
}

// Which of the quest's helpers run, and which its profile skips. Before a
// profile is picked, everything that is on runs; the brief asks for the pick
// first, so a Quick change sheds its helpers before any of them starts.
export type HelperRoute = { run: HelperId[]; skipped: HelperId[] }

export const routeHelpers = (t: Pick<Task, 'helpers' | 'testProfile'>): HelperRoute => {
  const on = onlyHelpers(t.helpers.on)
  const skip = t.testProfile === undefined ? [] : SKIPPED_AT[t.testProfile.id]

  return { run: on.filter(id => !skip.includes(id)), skipped: on.filter(id => skip.includes(id)) }
}

export const isQuickRoute = (t: Pick<Task, 'testProfile'>): boolean => t.testProfile?.id === 'quick'
