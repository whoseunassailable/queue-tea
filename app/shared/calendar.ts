// A realm's calendar: the events Rohan adds, kept in Calendar.json beside the
// realm's notes, and its quests' due dates, which stay on the quests.
// docs/calendar.md has the file and the rules.
export const CALENDAR_FILE = 'Calendar.json'
export const CALENDAR_FORMAT = 1
export const CALENDAR_LIMITS = { events: 5000, title: 200, place: 200, notes: 5000, spanDays: 366, bytes: 5_000_000 } as const

// A day is YYYY-MM-DD, and a wall time YYYY-MM-DDTHH:MM on a 24-hour clock in
// a zone, an IANA name such as Europe/Lisbon.
//
// An all-day event runs from its first day to its last, both included, on
// whichever clock reads it. A timed one starts and ends at wall times in the
// zone it was made in, so a 9:00 call in Lisbon stays 9:00 in Lisbon when the
// Mac moves to Chicago, where it shows at 3:00.
export type CalendarWhen = { kind: 'allDay'; startDay: string; endDay: string } | { kind: 'timed'; start: string; end: string; zone: string }

export type CalendarEventInput = { title: string; when: CalendarWhen; place: string | null; notes: string | null }
export type CalendarEvent = CalendarEventInput & { id: string }

// unreadable: entries in the file that Queue-tea couldn't read. They stay in
// the file as they are, and every save writes them back.
export type CalendarView = { events: CalendarEvent[]; unreadable: number }

const DAY = /^\d{4}-\d{2}-\d{2}$/
const WALL = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):[0-5]\d$/

// A real day of the calendar: 2026-02-30 isn't one.
export const isDay = (value: unknown): value is string => {
  if (typeof value !== 'string' || !DAY.test(value)) return false
  const at = Date.parse(`${value}T00:00:00Z`)

  return Number.isFinite(at) && new Date(at).toISOString().slice(0, 10) === value
}

export const isWallTime = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  const match = WALL.exec(value)

  return match !== null && isDay(match[1])
}
