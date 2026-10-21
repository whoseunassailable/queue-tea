import type { Allowance } from '../types'

// The five-hour window of the rate-limit readings.
export const readAllowance = (
  rateLimits: readonly { kind: string; percentUsed: number; resetsAt?: string }[],
): Allowance | null => {
  const window = rateLimits.find(r => r.kind === 'five_hour')

  return window === undefined ? null : { percent: window.percentUsed, resetsAt: window.resetsAt ?? null }
}

const pad = (n: number) => String(n).padStart(2, '0')

export const formatAllowance = (a: Allowance, offsetMinutes: number): string => {
  const used = `5h: ${Math.round(a.percent)}%`
  if (a.resetsAt === null) return used
  const local = new Date(Date.parse(a.resetsAt) + offsetMinutes * 60_000)

  return `${used} · resets ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`
}

export const shouldFresh = (tokens: number | undefined, freshAt: number): boolean =>
  tokens !== undefined && tokens > freshAt

// What a reset window is known by; one with no reset time is `unknown`.
export const windowKey = (resetsAt: string | null): string => resetsAt ?? 'unknown'

// Once per reset window, when the allowance's use reaches the mark.
export const shouldHandoff = (
  percent: number,
  mark: number,
  alreadyForReset: string | null,
  resetsAt: string | null,
): boolean => percent >= mark && alreadyForReset !== windowKey(resetsAt)
