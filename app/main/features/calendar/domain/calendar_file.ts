import { CALENDAR_FORMAT, CALENDAR_LIMITS, CALENDAR_PLAIN_FORMAT, isDay, isWallTime, SOURCE_LIMITS } from '../../../../shared/calendar'
import type { CalendarEvent, CalendarEventInput, CalendarSource, CalendarWhen, ImportItem, ImportStatus } from '../../../../shared/calendar'
import { instantOf, zoneNameOf } from '../../../../shared/calendar_time'
import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'

const DAY_MS = 86_400_000
const EVENT_ID = /^e-[a-z0-9]{1,40}$/

// What Calendar.json holds. kept: entries Queue-tea couldn't read, written
// back as they came, so a hand edit gone wrong is never lost.
export type CalendarFile = { events: CalendarEvent[]; kept: unknown[] }

export const emptyCalendar = (): CalendarFile => ({ events: [], kept: [] })

export const isEventId = (value: unknown): value is string => typeof value === 'string' && EVENT_ID.test(value)

const textOf = (value: unknown, limit: number, tooLong: string): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') throw new Refusal(MESSAGES.badValue)
  const text = value.trim()
  if (text.length > limit) throw new Refusal(tooLong)

  return text === '' ? null : text
}

const titleOf = (value: unknown): string => {
  const title = typeof value === 'string' ? value.trim().replace(/[\r\n]+/g, ' ') : ''
  if (title === '') throw new Refusal(MESSAGES.titleRequired)
  if (title.length > CALENDAR_LIMITS.title) throw new Refusal(MESSAGES.titleTooLong)

  return title
}

const daysBetween = (from: string, to: string) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS

const whenOf = (value: unknown): CalendarWhen => {
  const v = (value ?? {}) as Record<string, unknown>
  if (v.kind === 'allDay') {
    if (!isDay(v.startDay) || !isDay(v.endDay)) throw new Refusal(MESSAGES.eventDayBad)
    const span = daysBetween(v.startDay, v.endDay)
    if (span < 0) throw new Refusal(MESSAGES.eventEndsFirst)
    if (span >= CALENDAR_LIMITS.spanDays) throw new Refusal(MESSAGES.eventTooLong)

    return { kind: 'allDay', startDay: v.startDay, endDay: v.endDay }
  }
  if (v.kind === 'timed') {
    if (!isWallTime(v.start) || !isWallTime(v.end)) throw new Refusal(MESSAGES.eventTimeBad)
    const zone = zoneNameOf(v.zone)
    if (zone === null) throw new Refusal(MESSAGES.eventZoneBad)
    const length = instantOf(v.end, zone) - instantOf(v.start, zone)
    if (length <= 0) throw new Refusal(MESSAGES.eventEndsFirst)
    if (length > CALENDAR_LIMITS.spanDays * DAY_MS) throw new Refusal(MESSAGES.eventTooLong)

    return { kind: 'timed', start: v.start, end: v.end, zone }
  }
  throw new Refusal(MESSAGES.badValue)
}

// An event as the window sent it, checked again here: the sheet's checks are
// for the person typing, these are for the file.
export const eventInputOf = (value: unknown): CalendarEventInput => {
  const v = (value ?? {}) as Record<string, unknown>

  return {
    title: titleOf(v.title),
    when: whenOf(v.when),
    place: textOf(v.place, CALENDAR_LIMITS.place, MESSAGES.eventPlaceLong),
    notes: textOf(v.notes, CALENDAR_LIMITS.notes, MESSAGES.eventNotesLong),
  }
}

const lineOf = (value: unknown, limit: number): string | null => {
  if (typeof value !== 'string') return null
  const text = value.trim().replace(/[\r\n]+/g, ' ')

  return text === '' || text.length > limit ? null : text
}

// Where an imported event came from, checked like the rest of it. The file
// and the UID are needed; the calendar's name and the app may be missing.
export const sourceOf = (value: unknown): CalendarSource => {
  const v = (value ?? {}) as Record<string, unknown>
  const file = lineOf(v.file, SOURCE_LIMITS.file)
  const uid = typeof v.uid === 'string' && v.uid.trim() !== '' && v.uid.length <= SOURCE_LIMITS.uid ? v.uid.trim() : null
  const importedAt = typeof v.importedAt === 'string' && Number.isFinite(Date.parse(v.importedAt)) ? new Date(Date.parse(v.importedAt)).toISOString() : null
  const optional = (field: unknown, limit: number) => (field === null || field === undefined ? null : (lineOf(field, limit) ?? undefined))
  const calendar = optional(v.calendar, SOURCE_LIMITS.calendar)
  const app = optional(v.app, SOURCE_LIMITS.app)
  if (file === null || uid === null || importedAt === null || calendar === undefined || app === undefined) throw new Refusal(MESSAGES.badValue)

  return { file, calendar, app, uid, importedAt }
}

const eventOf = (value: unknown): CalendarEvent | null => {
  const v = (value ?? {}) as Record<string, unknown>
  if (!isEventId(v.id)) return null
  try {
    const event = { id: v.id, ...eventInputOf(v) }

    return v.source === undefined ? event : { ...event, source: sourceOf(v.source) }
  } catch {
    return null
  }
}

// Calendar.json as Queue-tea reads it: unreadable when it isn't a calendar at
// all, newer when a later Queue-tea wrote it. Either way it's left as it is.
export const parseCalendar = (text: string): CalendarFile | 'unreadable' | 'newer' => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return 'unreadable'
  }
  const file = (parsed ?? {}) as { format?: unknown; events?: unknown }
  if (typeof parsed !== 'object' || Array.isArray(parsed) || !Number.isInteger(file.format) || !Array.isArray(file.events)) return 'unreadable'
  if ((file.format as number) > CALENDAR_FORMAT) return 'newer'
  if ((file.format as number) < 1) return 'unreadable'
  const events: CalendarEvent[] = []
  const kept: unknown[] = []
  const ids = new Set<string>()
  for (const entry of file.events) {
    const event = eventOf(entry)
    // A second event with an id already read is kept as it came, not lost.
    if (event === null || ids.has(event.id)) kept.push(entry)
    else {
      ids.add(event.id)
      events.push(event)
    }
  }

  return { events, kept }
}

// Format 2 only when an event came from a file: an older Queue-tea then
// leaves the file alone instead of saving its sources away.
export const calendarText = (file: CalendarFile): string => {
  const format = file.events.some(event => event.source !== undefined) ? CALENDAR_FORMAT : CALENDAR_PLAIN_FORMAT

  return `${JSON.stringify({ format, events: [...file.events, ...file.kept] }, null, 2)}\n`
}

// Earliest first, so the file reads in order when opened by hand.
const startOf = (event: CalendarEvent): number => (event.when.kind === 'allDay' ? Date.parse(`${event.when.startDay}T00:00:00Z`) : instantOf(event.when.start, event.when.zone))
const inOrder = (events: CalendarEvent[]) => [...events].sort((a, b) => startOf(a) - startOf(b) || a.id.localeCompare(b.id))

export const withEvent = (file: CalendarFile, event: CalendarEvent): CalendarFile => ({
  ...file,
  events: inOrder([...file.events.filter(e => e.id !== event.id), event]),
})

export const withoutEvent = (file: CalendarFile, id: string): CalendarFile => ({ ...file, events: file.events.filter(e => e.id !== id) })

// An event's UID in an .ics file Queue-tea wrote. Read back, it finds the
// event it was, so importing your own export changes nothing.
export const OWN_UID_HOST = 'queue-tea'
export const ownUidOf = (id: string) => `${id}@${OWN_UID_HOST}`
const OWN_UID = /^(e-[a-z0-9]{1,40})@queue-tea$/

// The event an imported one is: the one imported before with the same UID,
// or the event here that a Queue-tea UID names.
export const matchOf = (file: CalendarFile, uid: string): CalendarEvent | undefined => {
  const earlier = file.events.find(event => event.source?.uid === uid)
  if (earlier !== undefined) return earlier
  const own = OWN_UID.exec(uid)

  return own === null ? undefined : file.events.find(event => event.id === own[1] && event.source === undefined)
}

const contentOf = (event: CalendarEventInput) => JSON.stringify([event.title, event.when, event.place, event.notes])

export const importStatusOf = (file: CalendarFile, item: ImportItem): ImportStatus => {
  const match = matchOf(file, item.source.uid)
  if (match === undefined) return 'new'

  return contentOf(match) === contentOf(item.event) ? 'same' : 'update'
}

// Imported events joined to the calendar: a new one gets an id, one already
// here takes the file's version and keeps its id, and one here as the file
// has it is left alone. The source says where its words came from last.
export const withImported = (file: CalendarFile, items: readonly ImportItem[], newId: (file: CalendarFile) => string): { file: CalendarFile; added: number; updated: number; same: number } => {
  let next = file
  const counts = { added: 0, updated: 0, same: 0 }
  for (const item of items) {
    const match = matchOf(next, item.source.uid)
    if (match === undefined) {
      next = withEvent(next, { id: newId(next), ...item.event, source: item.source })
      counts.added += 1
    } else if (contentOf(match) === contentOf(item.event)) counts.same += 1
    else {
      next = withEvent(next, { id: match.id, ...item.event, source: item.source })
      counts.updated += 1
    }
  }

  return { file: next, ...counts }
}
