import type { CalendarEvent } from '../../../../shared/calendar'
import { offsetAt } from '../../../../shared/calendar_time'
import { ownUidOf } from './calendar_file'
import { escapeText, folded } from './ics_text'

const DAY_MS = 86_400_000
const MINUTE = 60_000
export const ICS_PRODID = '-//Rohan Bhande//Queue-tea//EN'

// calendar: the realm's name; here: the Mac's zone, which calendar apps use
// for anything they show with no zone of its own; now: the moment written.
export type IcsExportContext = { calendar: string; here: string; now: number }

const pad = (n: number, width = 2) => String(Math.abs(n)).padStart(width, '0')
const dateOf = (day: string) => day.replace(/-/g, '')
const localOf = (wall: string) => `${wall.replace(/[-:]/g, '')}00`
const stampOf = (ms: number) => `${new Date(ms).toISOString().slice(0, 19).replace(/[-:]/g, '')}Z`
const nextDay = (day: string) => new Date(Date.parse(`${day}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10)
const offsetText = (minutes: number) => `${minutes < 0 ? '-' : '+'}${pad(Math.trunc(Math.abs(minutes) / 60))}${pad(Math.abs(minutes) % 60)}`

// The first minute a zone's offset changes between two moments a day apart.
const changeIn = (from: number, to: number, zone: string): number => {
  const before = offsetAt(from, zone)
  let low = from
  let high = to
  while (high - low > MINUTE) {
    const middle = low + Math.floor((high - low) / 2 / MINUTE) * MINUTE
    if (offsetAt(middle, zone) === before) low = middle
    else high = middle
  }

  return high
}

// A VTIMEZONE for the years the events use, from what this computer knows of
// the zone: one part for each change of offset, so it needs no rules, plus
// the offset the first year starts on. X-LIC-LOCATION names the IANA zone
// for apps that read it. UTC gets one too, rather than a Z, so the event
// comes back in UTC and not in the calendar's zone.
export const vtimezoneOf = (zone: string, fromYear: number, toYear: number): string[] => {
  const start = Date.UTC(fromYear, 0, 1)
  const end = Date.UTC(toYear + 1, 0, 1)
  const changes: { at: number; from: number; to: number }[] = []
  let offset = offsetAt(start, zone)
  for (let day = start; day < end; day += DAY_MS) {
    const next = offsetAt(day + DAY_MS, zone)
    if (next === offset) continue
    changes.push({ at: changeIn(day, day + DAY_MS, zone), from: offset, to: next })
    offset = next
  }
  const first = offsetAt(start, zone)
  const lowest = Math.min(first, ...changes.map(change => change.to))
  const part = (at: number, from: number, to: number) => {
    const kind = to > lowest ? 'DAYLIGHT' : 'STANDARD'

    return [`BEGIN:${kind}`, `DTSTART:${stampOf(at + from * MINUTE).slice(0, 15)}`, `TZOFFSETFROM:${offsetText(from)}`, `TZOFFSETTO:${offsetText(to)}`, `END:${kind}`]
  }

  const opening = part(start, first, first)
  opening[1] = `DTSTART:${fromYear}0101T000000`

  return ['BEGIN:VTIMEZONE', `TZID:${zone}`, `X-LIC-LOCATION:${zone}`, ...opening, ...changes.flatMap(change => part(change.at, change.from, change.to)), 'END:VTIMEZONE']
}

const eventLines = (event: CalendarEvent, now: number): string[] => {
  const { when } = event
  const times =
    when.kind === 'allDay'
      ? [`DTSTART;VALUE=DATE:${dateOf(when.startDay)}`, `DTEND;VALUE=DATE:${dateOf(nextDay(when.endDay))}`]
      : [`DTSTART;TZID=${when.zone}:${localOf(when.start)}`, `DTEND;TZID=${when.zone}:${localOf(when.end)}`]

  return [
    'BEGIN:VEVENT',
    // An imported event keeps the UID it came with, so the app it came from
    // knows it again.
    `UID:${escapeText(event.source?.uid ?? ownUidOf(event.id))}`,
    `DTSTAMP:${stampOf(now)}`,
    ...times,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.place === null ? [] : [`LOCATION:${escapeText(event.place)}`]),
    ...(event.notes === null ? [] : [`DESCRIPTION:${escapeText(event.notes)}`]),
    'END:VEVENT',
  ]
}

const yearOf = (text: string) => Number(text.slice(0, 4))

// The realm's events as an .ics file (RFC 5545) that calendar apps import:
// all-day events as dates, and timed ones on their own zone's clock with
// that zone defined in the file.
export const icsOf = (events: readonly CalendarEvent[], context: IcsExportContext): string => {
  const years = new Map<string, { from: number; to: number }>()
  for (const { when } of events) {
    if (when.kind !== 'timed') continue
    const known = years.get(when.zone)
    years.set(when.zone, { from: Math.min(known?.from ?? Infinity, yearOf(when.start)), to: Math.max(known?.to ?? -Infinity, yearOf(when.end)) })
  }
  const zones = [...years.entries()].sort(([a], [b]) => a.localeCompare(b)).flatMap(([zone, { from, to }]) => vtimezoneOf(zone, from, to))
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${ICS_PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(context.calendar)}`,
    `X-WR-TIMEZONE:${context.here}`,
    ...zones,
    ...events.flatMap(event => eventLines(event, context.now)),
    'END:VCALENDAR',
  ]

  return lines.map(folded).join('')
}
