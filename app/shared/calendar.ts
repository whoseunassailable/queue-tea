// A realm's calendar: the events Rohan adds, kept in Calendar.json beside the
// realm's notes, and its quests' due dates, which stay on the quests.
// docs/calendar.md has the file and the rules.
export const CALENDAR_FILE = 'Calendar.json'
// The newest format this Queue-tea reads and writes. A file is written as 2
// only when it holds imported events, so an older Queue-tea, which reads 1,
// refuses it rather than saving their sources away.
export const CALENDAR_FORMAT = 2
export const CALENDAR_PLAIN_FORMAT = 1
export const CALENDAR_LIMITS = { events: 5000, title: 200, place: 200, notes: 5000, spanDays: 366, bytes: 5_000_000 } as const
// An .ics file read for import: 20 MB at most, about ten years of a busy calendar.
export const ICS_LIMITS = { bytes: 20_000_000, fileName: 100 } as const

// A day is YYYY-MM-DD, and a wall time YYYY-MM-DDTHH:MM on a 24-hour clock in
// a zone, an IANA name such as Europe/Lisbon.
//
// An all-day event runs from its first day to its last, both included, on
// whichever clock reads it. A timed one starts and ends at wall times in the
// zone it was made in, so a 9:00 call in Lisbon stays 9:00 in Lisbon when the
// Mac moves to Chicago, where it shows at 3:00.
export type CalendarWhen = { kind: 'allDay'; startDay: string; endDay: string } | { kind: 'timed'; start: string; end: string; zone: string }

export type CalendarEventInput = { title: string; when: CalendarWhen; place: string | null; notes: string | null }

// Where an imported event came from: the file's name, the calendar's own name
// and the app that wrote it when the file gives them, the event's UID there,
// and when it came in (an ISO moment in UTC). An event added here has none.
// docs/calendar-ics.md has the rules.
export type CalendarSource = { file: string; calendar: string | null; app: string | null; uid: string; importedAt: string }
export const SOURCE_LIMITS = { file: 255, calendar: 200, app: 100, uid: 1000 } as const

export type CalendarEvent = CalendarEventInput & { id: string; source?: CalendarSource }

// unreadable: entries in the file that Queue-tea couldn't read. They stay in
// the file as they are, and every save writes them back.
export type CalendarView = { events: CalendarEvent[]; unreadable: number }

// An .ics file read for import, before anything is saved. Each event says
// whether it is new here, changes one imported before (matched by its UID),
// or is here already as the file has it. skipped: what the file holds that
// Queue-tea can't import, and why.
export type ImportStatus = 'new' | 'update' | 'same'
export type ImportItem = { event: CalendarEventInput; source: CalendarSource }
export type ImportSkipReason = 'repeats' | 'cancelled' | 'noStart' | 'noLength' | 'badTime' | 'tooLong' | 'zone' | 'twice'
// detail: the time zone a 'zone' skip couldn't read.
export type ImportSkip = { title: string | null; reason: ImportSkipReason; detail: string | null }
export type CalendarImportPreview = { file: string; calendar: string | null; app: string | null; items: (ImportItem & { status: ImportStatus })[]; skipped: ImportSkip[] }
export type CalendarImport = { view: CalendarView; added: number; updated: number; same: number }
export type CalendarExport = { file: string; events: number }

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
