import { CALENDAR_LIMITS, isDay, isWallTime, SOURCE_LIMITS } from '../../../../shared/calendar'
import type { CalendarEventInput, CalendarWhen, ImportItem, ImportSkip, ImportSkipReason } from '../../../../shared/calendar'
import { instantOf, wallOf } from '../../../../shared/calendar_time'
import { Refusal } from '../../../core/reply'
import { eventInputOf } from './calendar_file'
import { blocksOf, firstLine, unescapeText } from './ics_text'
import type { IcsBlock, IcsLine } from './ics_text'
import { ianaOf, instantInBlock, localMsOf } from './ics_zones'

const DAY_MS = 86_400_000
const MINUTE = 60_000

// What an .ics file holds for a calendar here: its events as Queue-tea keeps
// them, each with where it came from, and what can't come in and why.
export type IcsRead = { calendar: string | null; app: string | null; items: ImportItem[]; skipped: ImportSkip[] }
// file: the file's name; here: the Mac's zone; now: the moment of the import;
// untitled: the title for an event that has none.
export type IcsContext = { file: string; here: string; now: number; untitled: string }

type Clock = { kind: 'utc' } | { kind: 'floating' } | { kind: 'zone'; tzid: string }
type Stamp = { kind: 'date'; day: string } | { kind: 'time'; wall: string; seconds: number; clock: Clock }
// How a calendar's times are read: the zones it defines, and the zone for
// times in UTC or with no zone, the calendar's own or else the Mac's.
type Reader = { timezones: ReadonlyMap<string, IcsBlock>; fallback: string }
class Skip {
  constructor(
    readonly reason: ImportSkipReason,
    readonly detail: string | null = null,
  ) {}
}

const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10)
const cut = (text: string, limit: number) => (text.length > limit ? `${text.slice(0, limit - 1)}…` : text)
const textIn = (block: IcsBlock, name: string): string | null => {
  const line = firstLine(block, name)
  const text = line === undefined ? '' : unescapeText(line.value).trim()

  return text === '' ? null : text
}

// 20261203, or 20261126T150000 with Z for UTC, a TZID, or neither for a
// floating time that reads on whatever clock is near.
const stampOf = (line: IcsLine): Stamp => {
  const value = line.value.trim()
  const date = /^(\d{4})(\d{2})(\d{2})$/.exec(value)
  if (date !== null || line.params.VALUE?.toUpperCase() === 'DATE') {
    const day = date === null ? '' : `${date[1]}-${date[2]}-${date[3]}`
    if (!isDay(day)) throw new Skip('badTime')

    return { kind: 'date', day }
  }
  const time = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/i.exec(value)
  const wall = time === null ? '' : `${time[1]}-${time[2]}-${time[3]}T${time[4]}:${time[5]}`
  if (time === null || !isWallTime(wall)) throw new Skip('badTime')
  const clock: Clock = time[7] !== undefined ? { kind: 'utc' } : line.params.TZID !== undefined ? { kind: 'zone', tzid: line.params.TZID } : { kind: 'floating' }

  return { kind: 'time', wall, seconds: Number(time[6] ?? 0), clock }
}

// The zone a time keeps to here: its own when Queue-tea knows it by name,
// else the calendar's. null for UTC and floating times, which take the calendar's.
const namedZoneOf = (stamp: Extract<Stamp, { kind: 'time' }>, reader: Reader): string | null => (stamp.clock.kind === 'zone' ? ianaOf(stamp.clock.tzid, reader.timezones) : null)

const momentOf = (stamp: Extract<Stamp, { kind: 'time' }>, reader: Reader): number => {
  const { clock } = stamp
  const extra = stamp.seconds * 1000
  if (clock.kind === 'utc') return Date.parse(`${stamp.wall}:00Z`) + extra
  if (clock.kind === 'floating') return instantOf(stamp.wall, reader.fallback) + extra
  const zone = ianaOf(clock.tzid, reader.timezones)
  if (zone !== null) return instantOf(stamp.wall, zone) + extra
  // A zone with no name Queue-tea knows: its VTIMEZONE says what its clock was.
  const block = reader.timezones.get(clock.tzid.trim())
  const local = localMsOf(stamp.wall.replace(/[-:]/g, ''))
  const moment = block === undefined || local === null ? null : instantInBlock(local, block)
  if (moment === null) throw new Skip('zone', cut(clock.tzid.trim(), 80))

  return moment + extra
}

// A time on the event's own clock: as written when that's its zone, so 02:30
// on a night the clocks skip stays as written, and read across otherwise.
const wallIn = (stamp: Extract<Stamp, { kind: 'time' }>, zone: string, reader: Reader): string => (namedZoneOf(stamp, reader) === zone ? stamp.wall : wallOf(momentOf(stamp, reader), zone))

// P1W, P2D, PT1H30M, P1DT12H: weeks and days on the calendar, then the rest exactly.
const durationOf = (value: string): { days: number; ms: number } => {
  const match = /^\+?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i.exec(value.trim())
  if (match === null || value.trim().length <= 2) throw new Skip('badTime')
  const [weeks, days, hours, minutes, seconds] = match.slice(1).map(part => Number(part ?? 0))

  return { days: weeks! * 7 + days!, ms: ((hours! * 60 + minutes!) * 60 + seconds!) * 1000 }
}

const whenOf = (event: IcsBlock, reader: Reader): CalendarWhen => {
  const startLine = firstLine(event, 'DTSTART')
  if (startLine === undefined) throw new Skip('noStart')
  const start = stampOf(startLine)
  const endLine = firstLine(event, 'DTEND')
  const end = endLine === undefined ? null : stampOf(endLine)
  const duration = firstLine(event, 'DURATION')
  if (start.kind === 'date') {
    let last = start.day
    if (end !== null) {
      if (end.kind !== 'date') throw new Skip('badTime')
      // DTEND is the day after the last; some files repeat the first.
      last = end.day > start.day ? addDays(end.day, -1) : start.day
    } else if (duration !== undefined) last = addDays(start.day, Math.max(1, durationOf(duration.value).days) - 1)
    if ((Date.parse(`${last}T00:00:00Z`) - Date.parse(`${start.day}T00:00:00Z`)) / DAY_MS >= CALENDAR_LIMITS.spanDays) throw new Skip('tooLong')

    return { kind: 'allDay', startDay: start.day, endDay: last }
  }
  const zone = namedZoneOf(start, reader) ?? reader.fallback
  const from = wallIn(start, zone, reader)
  let to: string
  if (end !== null) {
    if (end.kind !== 'time') throw new Skip('badTime')
    to = wallIn(end, zone, reader)
  } else if (duration !== undefined) {
    const { days, ms } = durationOf(duration.value)
    const later = `${addDays(from.slice(0, 10), days)}${from.slice(10)}`
    to = wallOf(instantOf(later, zone) + ms, zone)
  } else throw new Skip('noLength')
  const length = instantOf(to, zone) - instantOf(from, zone)
  if (length < MINUTE) throw new Skip('noLength')
  if (length > CALENDAR_LIMITS.spanDays * DAY_MS) throw new Skip('tooLong')

  return { kind: 'timed', start: from, end: to, zone }
}

// The app that wrote the file, from its PRODID: "-//Google Inc//Google
// Calendar 70.9054//EN" is Google Calendar.
// Apple's names the system ("-//Apple Inc.//macOS 15.1//EN"), so it's known by name.
const KNOWN_APPS: readonly [RegExp, string][] = [
  [/\/\/Apple Inc\.?\/\//i, 'Apple Calendar'],
  [/\/\/Google Inc\.?\/\//i, 'Google Calendar'],
  [/Microsoft.*(Outlook|Exchange)/i, 'Outlook'],
]

export const appOf = (prodid: string | null): string | null => {
  if (prodid === null) return null
  const known = KNOWN_APPS.find(([pattern]) => pattern.test(prodid))
  if (known !== undefined) return known[1]
  const parts = prodid.split('//').filter(part => part.trim() !== '' && part.trim() !== '-' && !/^[A-Za-z]{2}$/.test(part.trim()))
  const words = (parts.at(-1) ?? '').replace(/^.*NONSGML\s+/i, '').split(/\s+/).filter(word => word !== '')
  while (words.length > 1 && (/\d/.test(words.at(-1)!) || /^MIMEDIR$/i.test(words.at(-1)!))) words.pop()
  const app = words.join(' ').trim()

  return app === '' ? null : cut(app, SOURCE_LIMITS.app)
}

// A stand-in UID for an event that has none, from what it is, so the same
// file read twice finds the same events.
const hashOf = (text: string): string => {
  let hash = 0x811c9dc5
  for (const char of text) hash = Math.imul(hash ^ char.codePointAt(0)!, 0x01000193) >>> 0

  return hash.toString(16).padStart(8, '0')
}

const uidOf = (event: IcsBlock): string => {
  const uid = unescapeText(firstLine(event, 'UID')?.value ?? '').trim()
  if (uid !== '' && uid.length <= SOURCE_LIMITS.uid) return uid

  return `no-uid-${hashOf(`${uid}\n${firstLine(event, 'DTSTART')?.value ?? ''}\n${firstLine(event, 'SUMMARY')?.value ?? ''}`)}`
}

// The event as Calendar.json keeps it, checked as the window's would be, so
// the preview and the import compare the same thing.
const storedOf = (event: CalendarEventInput): CalendarEventInput => {
  try {
    return eventInputOf(event)
  } catch (err) {
    if (err instanceof Refusal) throw new Skip('badTime')
    throw err
  }
}

const isRepeating = (event: IcsBlock) => event.lines.some(line => line.name === 'RRULE' || line.name === 'RDATE' || line.name === 'RECURRENCE-ID')

// The events of an .ics file, or null when it isn't a calendar at all.
// Repeating events wait for their own quest (t-d4cec95d), so they're named
// among what can't come in, as are cancelled ones and times that don't read.
export const readIcs = (text: string, context: IcsContext): IcsRead | null => {
  const calendars = blocksOf(text).filter(block => block.name === 'VCALENDAR')
  if (calendars.length === 0) return null
  const timezones = new Map(calendars.flatMap(calendar => calendar.blocks.filter(block => block.name === 'VTIMEZONE').map(block => [firstLine(block, 'TZID')?.value.trim() ?? '', block] as const)))
  const first = calendars[0]!
  const calendarName = textIn(first, 'X-WR-CALNAME')
  const calendar = calendarName === null ? null : cut(calendarName.replace(/[\r\n]+/g, ' '), SOURCE_LIMITS.calendar)
  const app = appOf(firstLine(first, 'PRODID')?.value ?? null)
  const ownZone = textIn(first, 'X-WR-TIMEZONE')
  const reader: Reader = { timezones, fallback: (ownZone === null ? null : ianaOf(ownZone, timezones)) ?? context.here }
  const importedAt = new Date(context.now).toISOString()
  const file = cut(context.file.replace(/[\r\n]+/g, ' ').trim() || 'calendar.ics', SOURCE_LIMITS.file)

  const items: (ImportItem & { sequence: number })[] = []
  const skipped: ImportSkip[] = []
  for (const event of calendars.flatMap(calendar => calendar.blocks.filter(block => block.name === 'VEVENT'))) {
    const summary = textIn(event, 'SUMMARY')
    const title = summary === null ? null : cut(summary.replace(/[\r\n]+/g, ' '), CALENDAR_LIMITS.title)
    try {
      if (textIn(event, 'STATUS')?.toUpperCase() === 'CANCELLED') throw new Skip('cancelled')
      if (isRepeating(event)) throw new Skip('repeats')
      const when = whenOf(event, reader)
      const place = textIn(event, 'LOCATION')
      const notes = textIn(event, 'DESCRIPTION')
      const uid = uidOf(event)
      const sequence = Number(firstLine(event, 'SEQUENCE')?.value ?? 0) || 0
      const item = { event: storedOf({ title: title ?? context.untitled, when, place: place === null ? null : cut(place, CALENDAR_LIMITS.place), notes: notes === null ? null : cut(notes, CALENDAR_LIMITS.notes) }), source: { file, calendar, app, uid, importedAt }, sequence }
      // The same event twice: the later version, by SEQUENCE, else the last.
      const earlier = items.findIndex(one => one.source.uid === uid)
      if (earlier === -1) items.push(item)
      else {
        const [kept, dropped] = items[earlier]!.sequence > sequence ? [items[earlier]!, item] : [item, items[earlier]!]
        items[earlier] = kept
        skipped.push({ title: dropped.event.title, reason: 'twice', detail: null })
      }
    } catch (err) {
      if (!(err instanceof Skip)) throw err
      skipped.push({ title, reason: err.reason, detail: err.detail })
    }
  }

  return { calendar, app, items: items.map(({ event, source }) => ({ event, source })), skipped }
}
