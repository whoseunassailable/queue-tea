import { expect, test } from 'claude-code/testing'

import { HELPER_POLICIES, isQuickRoute, routeHelpers } from '../../../../hooks/shared/records/domain/services/helper_policy'
import { HELPER_IDS } from '../../../../hooks/shared/records/domain/services/helpers'
import { addRun, emptyUsage, helperRunOf } from '../../../../hooks/shared/records/domain/services/helper_usage'
import type { HelperId, TestProfile } from '../../../../types'

const ALL: HelperId[] = ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd']
const task = (on: HelperId[], testProfile?: TestProfile) => ({ helpers: { on, ran: [], reminded: false }, ...(testProfile === undefined ? {} : { testProfile }) })

test('every helper has an invocation policy, and Tea-DD is the one that runs by default', () => {
  expect(Object.keys(HELPER_POLICIES).sort()).toEqual([...HELPER_IDS].sort())
  expect(HELPER_IDS.filter(id => HELPER_POLICIES[id] === 'automatic')).toEqual(['tea-dd'])
})

test('a Notes reorder at Quick runs no design, docs or Tea-DD cycle, only the review', () => {
  const route = routeHelpers(task(ALL, { id: 'quick', by: 'tea-dd', reason: 'Notes moves to fourth' }))

  expect(route).toEqual({ run: ['commit-chai-n'], skipped: ['mocha-mockup', 'chai-pter', 'tea-dd'] })
})

test('before a profile, and at every profile above Quick, whatever is on runs', () => {
  expect(routeHelpers(task(ALL))).toEqual({ run: ALL, skipped: [] })
  for (const id of ['standard', 'deep', 'critical', 'release'] as const) {
    expect(routeHelpers(task(ALL, { id, by: 'rohan' }))).toEqual({ run: ALL, skipped: [] })
  }
})

test('a helper that is off is neither run nor skipped', () => {
  expect(routeHelpers(task(['tea-dd'], { id: 'quick', by: 'rohan' }))).toEqual({ run: [], skipped: ['tea-dd'] })
  expect(routeHelpers(task([], { id: 'quick', by: 'rohan' }))).toEqual({ run: [], skipped: [] })
})

test('the Quick route follows the profile, whoever picked it', () => {
  expect(isQuickRoute(task(ALL, { id: 'quick', by: 'rohan' }))).toBe(true)
  expect(isQuickRoute(task(ALL, { id: 'standard', by: 'tea-dd', reason: 'x' }))).toBe(false)
  expect(isQuickRoute(task(ALL))).toBe(false)
})

test("a finished run keeps Claude Code's own duration and tokens", () => {
  expect(helperRunOf({ result: { status: 'completed', totalDurationMs: 41_000, totalTokens: 18_200 } }, 43_000)).toEqual({ outcome: 'done', ms: 41_000, tokens: 18_200 })
  expect(helperRunOf({ result: { usage: { input_tokens: 900, output_tokens: 100 } } }, 5_000)).toEqual({ outcome: 'done', ms: 5_000, tokens: 1_000 })
})

test('a run whose answer has no usage keeps the measured time and marks the tokens unknown', () => {
  expect(helperRunOf({ result: 'All 12 tests pass.' }, 7_000)).toEqual({ outcome: 'done', ms: 7_000, tokens: null })
  expect(helperRunOf({ result: { usage: { input_tokens: 900 } } }, 7_000)).toEqual({ outcome: 'done', ms: 7_000, tokens: null })
  expect(helperRunOf(undefined, Number.NaN)).toEqual({ outcome: 'done', ms: null, tokens: null })
})

test('an error or a refusal is a failed run; a background launch has no time or tokens yet', () => {
  expect(helperRunOf({ isError: true, result: 'Agent type not found' }, 300)).toEqual({ outcome: 'failed', ms: 300, tokens: null })
  expect(helperRunOf({ deny: 'no' }, 0)).toEqual({ outcome: 'failed', ms: 0, tokens: null })
  expect(helperRunOf({ result: { status: 'async_launched', agentId: 'a1' } }, 50)).toEqual({ outcome: 'background', ms: null, tokens: null })
})

test('totals add only what was known, and count how many runs it came from', () => {
  let usage = addRun(undefined, 'tea-dd', { outcome: 'done', ms: 1_000.4, tokens: 500 })
  usage = addRun(usage, 'tea-dd', { outcome: 'background', ms: null, tokens: null })
  usage = addRun(usage, 'tea-dd', { outcome: 'failed', ms: 200, tokens: null })
  usage = addRun(usage, 'chai-pter', { outcome: 'done', ms: 3_000, tokens: 1_200 })

  expect(usage).toEqual({
    'tea-dd': { runs: 3, failed: 1, timed: 2, ms: 1_200, counted: 1, tokens: 500 },
    'chai-pter': { runs: 1, failed: 0, timed: 1, ms: 3_000, counted: 1, tokens: 1_200 },
  })
  expect(emptyUsage()).toEqual({ runs: 0, failed: 0, timed: 0, ms: 0, counted: 0, tokens: 0 })
})
