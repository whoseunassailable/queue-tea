import type { HelperId, HelperUsage, HelperUsageById } from '../../../../../types'
import { HELPER_IDS, isHelperId } from './helpers'

// One run of a helper, as the Agent tool's call and answer showed it. A run
// that went to the background ends later, so its time and tokens are unknown.
export type HelperRunSeen = { outcome: 'done' | 'failed' | 'background'; ms: number | null; tokens: number | null }

export const emptyUsage = (): HelperUsage => ({ runs: 0, failed: 0, timed: 0, ms: 0, counted: 0, tokens: 0 })

const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

// What the Agent tool's answer says about the run. Claude Code reports the
// run's own duration and tokens on a finished run; an answer without them
// keeps the time measured around the call and marks the tokens unknown.
export const helperRunOf = (answer: unknown, measuredMs: number): HelperRunSeen => {
  const a = isObject(answer) ? answer : {}
  if (a.isError === true || a.deny !== undefined) return { outcome: 'failed', ms: isCount(measuredMs) ? measuredMs : null, tokens: null }
  const out = isObject(a.result) ? a.result : {}
  if (out.status === 'async_launched' || out.isAsync === true) return { outcome: 'background', ms: null, tokens: null }
  const usage = isObject(out.usage) ? out.usage : {}
  const parts = [usage.input_tokens, usage.output_tokens]
  const tokens = isCount(out.totalTokens) ? out.totalTokens : parts.every(isCount) ? (parts as number[]).reduce((s, n) => s + n, 0) : null
  const ms = isCount(out.totalDurationMs) ? out.totalDurationMs : isCount(measuredMs) ? measuredMs : null

  return { outcome: 'done', ms, tokens }
}

// The totals with one more run. Only what was known is added, and `timed` and
// `counted` say how many runs it came from, so an average never counts a run
// whose numbers were unknown.
export const addRun = (usage: HelperUsageById | undefined, helper: HelperId, run: HelperRunSeen): HelperUsageById => {
  const was = usage?.[helper] ?? emptyUsage()
  const ms = run.ms === null ? null : Math.round(run.ms)

  return {
    ...usage,
    [helper]: {
      runs: was.runs + 1,
      failed: was.failed + (run.outcome === 'failed' ? 1 : 0),
      timed: was.timed + (ms === null ? 0 : 1),
      ms: was.ms + (ms ?? 0),
      counted: was.counted + (run.tokens === null ? 0 : 1),
      tokens: was.tokens + (run.tokens === null ? 0 : Math.round(run.tokens)),
    },
  }
}

// Reads a hand-edited field: a helper whose totals don't add up is dropped,
// never the task. Absent, empty or unreadable is no usage.
export const readHelperUsage = (value: unknown): HelperUsageById | undefined => {
  if (!isObject(value)) return undefined
  const kept: HelperUsageById = {}
  for (const [id, u] of Object.entries(value)) {
    if (!isHelperId(id) || !isObject(u)) continue
    const { runs, failed, timed, ms, counted, tokens } = u
    if (![runs, failed, timed, ms, counted, tokens].every(isCount)) continue
    const n = runs as number
    if ((failed as number) > n || (timed as number) > n || (counted as number) > n) continue
    kept[id] = { runs: n, failed: failed as number, timed: timed as number, ms: ms as number, counted: counted as number, tokens: tokens as number }
  }

  return HELPER_IDS.some(id => kept[id] !== undefined) ? kept : undefined
}
