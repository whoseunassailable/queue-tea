import type { Options } from '../env/env'

const DEFAULTS: Options = { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 }

const positive = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback

// The userConfig values, each a positive number or its default.
export const readOptions = (options: Record<string, unknown>): Options => ({
  idleGapMinutes: positive(options.idleGapMinutes, DEFAULTS.idleGapMinutes),
  freshAtTokens: positive(options.freshAtTokens, DEFAULTS.freshAtTokens),
  handoffAtPercent: positive(options.handoffAtPercent, DEFAULTS.handoffAtPercent),
  checkTimeoutSeconds: positive(options.checkTimeoutSeconds, DEFAULTS.checkTimeoutSeconds),
})
