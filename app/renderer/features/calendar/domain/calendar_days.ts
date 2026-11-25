import { wallOf } from '../../../../shared/calendar_time'

// Days as YYYY-MM-DD, counted in UTC so no zone can move them. Weeks start on
// Monday, as everywhere else in the app.
const DAY_MS = 86_400_000

export type CalendarMode = 'month' | 'week' | 'agenda'
export const CALENDAR_MODES: readonly CalendarMode[] = ['month', 'week', 'agenda']
// The agenda shows four weeks at a time.
export const AGENDA_DAYS = 28

const numberOf = (day: string): number => Date.parse(`${day}T00:00:00Z`) / DAY_MS
const dayOfNumber = (n: number): string => new Date(n * DAY_MS).toISOString().slice(0, 10)

export const addDays = (day: string, n: number): string => dayOfNumber(numberOf(day) + n)
export const daysFrom = (from: string, to: string): number => numberOf(to) - numberOf(from)

// 0 for Monday to 6 for Sunday.
export const weekdayIndex = (day: string): number => (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7
export const weekStartOf = (day: string): string => addDays(day, -weekdayIndex(day))
export const weekOf = (day: string): string[] => Array.from({ length: 7 }, (_, i) => addDays(weekStartOf(day), i))

export const monthStartOf = (day: string): string => `${day.slice(0, 7)}-01`

// The same day of another month, or that month's last when it's shorter:
// a month after 31 Jan is 28 Feb.
export const addMonths = (day: string, n: number): string => {
  const months = Number(day.slice(0, 4)) * 12 + Number(day.slice(5, 7)) - 1 + n
  const year = Math.floor(months / 12)
  const month = months - year * 12
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return new Date(Date.UTC(year, month, Math.min(Number(day.slice(8, 10)), last))).toISOString().slice(0, 10)
}

// The month's whole weeks, Monday to Sunday, as rows of seven days.
export const monthWeeksOf = (day: string): string[][] => {
  const first = weekStartOf(monthStartOf(day))
  const last = addDays(monthStartOf(addMonths(monthStartOf(day), 1)), -1)
  const weeks: string[][] = []
  for (let start = first; start <= last; start = addDays(start, 7)) weeks.push(weekOf(start))

  return weeks
}

// The first and last day a view shows.
export const rangeOf = (mode: CalendarMode, anchor: string): { first: string; last: string } => {
  if (mode === 'week') return { first: weekStartOf(anchor), last: addDays(weekStartOf(anchor), 6) }
  if (mode === 'agenda') return { first: anchor, last: addDays(anchor, AGENDA_DAYS - 1) }
  const weeks = monthWeeksOf(anchor)

  return { first: weeks[0]![0]!, last: weeks[weeks.length - 1]![6]! }
}

// Where Previous and Next go: a month, a week, or the agenda's four weeks.
export const stepOf = (mode: CalendarMode, anchor: string, by: -1 | 1): string => {
  if (mode === 'month') return addMonths(monthStartOf(anchor), by)

  return addDays(anchor, by * (mode === 'week' ? 7 : AGENDA_DAYS))
}

export const todayIn = (zone: string, nowMs: number): string => wallOf(nowMs, zone).slice(0, 10)
