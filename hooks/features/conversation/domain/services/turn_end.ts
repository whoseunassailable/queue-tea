import type { Allowance } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { shouldFresh, shouldHandoff } from './allowance'

// What the end of a turn calls for: a fresh conversation past the size, or a
// handoff note once per reset window at the allowance mark.
export const turnEnd = (
  reading: { tokens?: number; allowance: Allowance | null },
  ctx: Ctx,
  handedOffFor: string | null,
): 'none' | 'fresh' | 'note' => {
  if (shouldFresh(reading.tokens, ctx.options.freshAtTokens)) return 'fresh'
  const a = reading.allowance

  return a !== null && shouldHandoff(a.percent, ctx.options.handoffAtPercent, handedOffFor, a.resetsAt) ? 'note' : 'none'
}
