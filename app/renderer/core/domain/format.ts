import type { Allowance } from '../../../../types'
import { formatSpan } from '../../../../hooks/shared/backlog/domain/services/ranking'
import { formatAge, formatMinutes } from '../../../../hooks/shared/time/domain/services/time'
import { t } from '../../l10n/en'

export { formatAge, formatMinutes, formatSpan }

// A record's times keep the local time they were written in, so they read
// straight from the text: "2026-10-20T22:17:00+02:00" is 20 Oct 22:17.
export const dayOf = (iso: string): string => {
  const month = t.months[Number(iso.slice(5, 7)) - 1] ?? ''

  return `${Number(iso.slice(8, 10))} ${month}`
}

export const dayAndTime = (iso: string): string => `${dayOf(iso)} ${iso.slice(11, 16)}`

export const manaLeft = (allowance: Allowance): number => Math.max(0, Math.min(100, Math.round(100 - allowance.percent)))

// When the mana refills, on this computer's clock; null when it can't be read.
export const refillTime = (allowance: Allowance): string | null => {
  if (allowance.resetsAt === null) return null
  const at = new Date(allowance.resetsAt)
  if (Number.isNaN(at.getTime())) return null

  return `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`
}

// Claude's allowance is used up until it resets; unknown counts as not.
export const isClaudeOut = (allowance: Allowance | null, nowMs: number): boolean =>
  allowance !== null && allowance.percent >= 100 && (allowance.resetsAt === null || Date.parse(allowance.resetsAt) > nowMs)

// Monday first, from a `YYYY-MM-DD` day: the text holds no time zone to get wrong.
const weekdayIndex = (day: string): number => (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7

export const weekdayOf = (day: string): string => t.weekdays[weekdayIndex(day)] ?? ''

export const dayName = (day: string): string => `${weekdayOf(day)} ${dayOf(day)}`

// A moment on this computer's clock.
export const clockTime = (ms: number): string => {
  const at = new Date(ms)

  return `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`
}
