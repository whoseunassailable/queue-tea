import { describe, expect, it } from 'vitest'

import type { CalendarEvent } from '../../../../shared/calendar'
import { instantOf, zoneNameOf } from '../../../../shared/calendar_time'
import { importStatusOf } from './calendar_file'
import { icsOf, vtimezoneOf } from './ics_export'
import { appOf, readIcs } from './ics_import'
import type { IcsContext } from './ics_import'
import { blocksOf, escapeText, folded, lineOf, unescapeText } from './ics_text'
import { WINDOWS_ZONES } from './ics_zones'

const NOW = Date.parse('2026-11-26T10:00:00Z')
const HERE: IcsContext = { file: 'Work.ics', here: 'America/New_York', now: NOW, untitled: 'Untitled event' }
const calendarOf = (body: string, head = '') => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${head}${body}END:VCALENDAR\r\n`
const eventOf = (...lines: string[]) => `BEGIN:VEVENT\r\n${lines.map(line => `${line}\r\n`).join('')}END:VEVENT\r\n`
const read = (text: string, context: Partial<IcsContext> = {}) => {
  const answer = readIcs(text, { ...HERE, ...context })
  if (answer === null) throw new Error('should read as a calendar')

  return answer
}
const whenOf = (text: string, context: Partial<IcsContext> = {}) => read(text, context).items.map(item => item.event.when)
const bytes = (text: string) => new TextEncoder().encode(text).length

// Outlook names Windows zones and defines them with yearly rules.
const CENTRAL = [
  'BEGIN:VTIMEZONE',
  'TZID:Central Standard Time',
  'BEGIN:STANDARD',
  'DTSTART:16011104T020000',
  'RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0600',
  'END:STANDARD',
  'BEGIN:DAYLIGHT',
  'DTSTART:16010311T020000',
  'RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3',
  'TZOFFSETFROM:-0600',
  'TZOFFSETTO:-0500',
  'END:DAYLIGHT',
  'END:VTIMEZONE',
]
  .map(line => `${line}\r\n`)
  .join('')

describe('the text of an .ics file', () => {
  it('unfolds lines that go on with a space or a tab, with CRLF, LF or a BOM', () => {
    const [calendar] = blocksOf('﻿BEGIN:VCALENDAR\nX-WR-CALNAME:Long\r\n  name\r\n\t that goes on\nEND:VCALENDAR')

    expect(calendar?.lines).toEqual([{ name: 'X-WR-CALNAME', params: {}, value: 'Long name that goes on' }])
  })

  it('reads parameters, with colons and semicolons inside quotes', () => {
    expect(lineOf('dtstart;tzid="Zone: one; two";VALUE=DATE-TIME:20261201T090000')).toEqual({ name: 'DTSTART', params: { TZID: 'Zone: one; two', VALUE: 'DATE-TIME' }, value: '20261201T090000' })
    expect(lineOf('no colon here')).toBeNull()
  })

  it('nests components, and passes over an END that closes nothing', () => {
    const [calendar] = blocksOf('BEGIN:VCALENDAR\nEND:VALARM\nBEGIN:VEVENT\nBEGIN:VALARM\nEND:VALARM\nSUMMARY:One\nEND:VEVENT\nEND:VCALENDAR')

    expect(calendar?.blocks.map(block => [block.name, block.blocks.map(inner => inner.name), block.lines.length])).toEqual([['VEVENT', ['VALARM'], 1]])
  })

  it('escapes and unescapes text', () => {
    const text = 'Lunch, then a walk; bring\\the map\nand water'

    expect(escapeText(text)).toBe('Lunch\\, then a walk\\; bring\\\\the map\\nand water')
    expect(unescapeText(escapeText(text))).toBe(text)
    expect(unescapeText('Line one\\NLine two')).toBe('Line one\nLine two')
  })

  it('folds at 75 bytes without splitting a character, and ends each line with CRLF', () => {
    const line = `DESCRIPTION:${'ação '.repeat(40)}`
    const text = folded(line)
    const parts = text.split('\r\n').slice(0, -1)

    expect(text.endsWith('\r\n')).toBe(true)
    expect(parts.every(part => bytes(part) <= 75)).toBe(true)
    expect(parts.slice(1).every(part => part.startsWith(' '))).toBe(true)
    expect(parts.map((part, i) => (i === 0 ? part : part.slice(1))).join('')).toBe(line)
  })
})

describe('reading an .ics file', () => {
  it("reads Google Calendar's export: zoned times, all-day days and UTC times on the calendar's own zone", () => {
    const answer = read(
      calendarOf(
        eventOf('DTSTART;TZID=Europe/Lisbon:20261201T090000', 'DTEND;TZID=Europe/Lisbon:20261201T093000', 'UID:abc123@google.com', 'SUMMARY:Call with Ana', 'LOCATION:Café\\, Rua Augusta', 'DESCRIPTION:Bring the\\nnotes') +
          eventOf('DTSTART;VALUE=DATE:20261203', 'DTEND;VALUE=DATE:20261207', 'UID:trip@google.com', 'SUMMARY:Lisbon trip') +
          eventOf('DTSTART:20261202T150000Z', 'DTEND:20261202T160000Z', 'UID:standup@google.com', 'SUMMARY:Standup'),
        'PRODID:-//Google Inc//Google Calendar 70.9054//EN\r\nX-WR-CALNAME:Work\r\nX-WR-TIMEZONE:Europe/Lisbon\r\n',
      ),
    )

    expect(answer.calendar).toBe('Work')
    expect(answer.app).toBe('Google Calendar')
    expect(answer.skipped).toEqual([])
    expect(answer.items.map(item => item.event)).toEqual([
      { title: 'Call with Ana', when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'Europe/Lisbon' }, place: 'Café, Rua Augusta', notes: 'Bring the\nnotes' },
      { title: 'Lisbon trip', when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-06' }, place: null, notes: null },
      { title: 'Standup', when: { kind: 'timed', start: '2026-12-02T15:00', end: '2026-12-02T16:00', zone: 'Europe/Lisbon' }, place: null, notes: null },
    ])
    expect(answer.items[0]?.source).toEqual({ file: 'Work.ics', calendar: 'Work', app: 'Google Calendar', uid: 'abc123@google.com', importedAt: '2026-11-26T10:00:00.000Z' })
  })

  it("reads Outlook's Windows zone names as the zones they are", () => {
    const answer = read(calendarOf(CENTRAL + eventOf('DTSTART;TZID="Central Standard Time":20261201T140000', 'DTEND;TZID="Central Standard Time":20261201T150000', 'UID:040000008200E0', 'SUMMARY:Review'), 'PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN\r\n'))

    expect(answer.app).toBe('Outlook')
    expect(answer.items[0]?.event.when).toEqual({ kind: 'timed', start: '2026-12-01T14:00', end: '2026-12-01T15:00', zone: 'America/Chicago' })
  })

  it('knows every Windows zone in its table', () => {
    for (const [windows, zone] of Object.entries(WINDOWS_ZONES)) expect(zoneNameOf(zone), windows).not.toBeNull()
  })

  it("reads a zone at the end of a path, and one the file's VTIMEZONE names", () => {
    const named = 'BEGIN:VTIMEZONE\r\nTZID:Berlin time\r\nX-LIC-LOCATION:Europe/Berlin\r\nEND:VTIMEZONE\r\n'
    const text = calendarOf(named + eventOf('DTSTART;TZID=/mozilla.org/20050126_1/Asia/Tokyo:20261201T090000', 'DTEND;TZID=/mozilla.org/20050126_1/Asia/Tokyo:20261201T100000', 'UID:a') + eventOf('DTSTART;TZID=Berlin time:20261201T090000', 'DTEND;TZID=Berlin time:20261201T100000', 'UID:b'))

    expect(whenOf(text).map(when => (when.kind === 'timed' ? when.zone : null))).toEqual(['Asia/Tokyo', 'Europe/Berlin'])
  })

  it("reads a zone it doesn't know by name from its VTIMEZONE, summer and winter, on the calendar's zone", () => {
    const own = CENTRAL.replace('TZID:Central Standard Time', 'TZID:Head office')
    const text = calendarOf(own + eventOf('DTSTART;TZID=Head office:20260701T090000', 'DTEND;TZID=Head office:20260701T100000', 'UID:summer') + eventOf('DTSTART;TZID=Head office:20261201T090000', 'DTEND;TZID=Head office:20261201T100000', 'UID:winter'))

    // 9:00 in Chicago is 10:00 in New York, summer and winter alike.
    expect(whenOf(text)).toEqual([
      { kind: 'timed', start: '2026-07-01T10:00', end: '2026-07-01T11:00', zone: 'America/New_York' },
      { kind: 'timed', start: '2026-12-01T10:00', end: '2026-12-01T11:00', zone: 'America/New_York' },
    ])
  })

  it("reads a time with no zone on the calendar's zone, else on this Mac's", () => {
    const floating = eventOf('DTSTART:20261202T150000', 'DTEND:20261202T160000', 'UID:f')

    expect(whenOf(calendarOf(floating, 'X-WR-TIMEZONE:Asia/Tokyo\r\n'))).toEqual([{ kind: 'timed', start: '2026-12-02T15:00', end: '2026-12-02T16:00', zone: 'Asia/Tokyo' }])
    expect(whenOf(calendarOf(floating, 'X-WR-TIMEZONE:Nowhere/Special\r\n'))).toEqual([{ kind: 'timed', start: '2026-12-02T15:00', end: '2026-12-02T16:00', zone: 'America/New_York' }])
    expect(whenOf(calendarOf(eventOf('DTSTART:20261202T150000Z', 'DTEND:20261202T160000Z', 'UID:u')))).toEqual([{ kind: 'timed', start: '2026-12-02T10:00', end: '2026-12-02T11:00', zone: 'America/New_York' }])
  })

  it('keeps a time on the night the clocks change as written', () => {
    expect(whenOf(calendarOf(eventOf('DTSTART;TZID=America/New_York:20260308T013000', 'DTEND;TZID=America/New_York:20260308T033000', 'UID:d')))).toEqual([{ kind: 'timed', start: '2026-03-08T01:30', end: '2026-03-08T03:30', zone: 'America/New_York' }])
  })

  it('reads lengths given as a DURATION, and all-day events with no end as one day', () => {
    const text = calendarOf(
      eventOf('DTSTART;TZID=Europe/Lisbon:20261201T230000', 'DURATION:PT1H30M', 'UID:a') +
        eventOf('DTSTART;VALUE=DATE:20261201', 'DURATION:P3D', 'UID:b') +
        eventOf('DTSTART;VALUE=DATE:20261201', 'UID:c') +
        eventOf('DTSTART;VALUE=DATE:20261201', 'DTEND;VALUE=DATE:20261201', 'UID:d'),
    )

    expect(whenOf(text)).toEqual([
      { kind: 'timed', start: '2026-12-01T23:00', end: '2026-12-02T00:30', zone: 'Europe/Lisbon' },
      { kind: 'allDay', startDay: '2026-12-01', endDay: '2026-12-03' },
      { kind: 'allDay', startDay: '2026-12-01', endDay: '2026-12-01' },
      { kind: 'allDay', startDay: '2026-12-01', endDay: '2026-12-01' },
    ])
  })

  it("names what it can't bring in, and why", () => {
    const text = calendarOf(
      eventOf('DTSTART;VALUE=DATE:20261201', 'RRULE:FREQ=WEEKLY', 'UID:1', 'SUMMARY:Weekly') +
        eventOf('DTSTART;VALUE=DATE:20261201', 'STATUS:CANCELLED', 'UID:2', 'SUMMARY:Called off') +
        eventOf('UID:3', 'SUMMARY:No start') +
        eventOf('DTSTART:20261201T090000', 'UID:4', 'SUMMARY:No end') +
        eventOf('DTSTART:20261301T090000', 'DTEND:20261301T100000', 'UID:5', 'SUMMARY:Month 13') +
        eventOf('DTSTART;VALUE=DATE:20260101', 'DTEND;VALUE=DATE:20270201', 'UID:6', 'SUMMARY:Year and more') +
        eventOf('DTSTART;TZID=Mars/Olympus:20261201T090000', 'DTEND;TZID=Mars/Olympus:20261201T100000', 'UID:7', 'SUMMARY:On Mars') +
        eventOf('DTSTART:20261201T100000', 'DTEND:20261201T090000', 'UID:8', 'SUMMARY:Ends first') +
        eventOf('DTSTART;VALUE=DATE:20261201', 'RECURRENCE-ID;VALUE=DATE:20261208', 'UID:1', 'SUMMARY:One week moved'),
    )

    expect(read(text).items).toEqual([])
    expect(read(text).skipped).toEqual([
      { title: 'Weekly', reason: 'repeats', detail: null },
      { title: 'Called off', reason: 'cancelled', detail: null },
      { title: 'No start', reason: 'noStart', detail: null },
      { title: 'No end', reason: 'noLength', detail: null },
      { title: 'Month 13', reason: 'badTime', detail: null },
      { title: 'Year and more', reason: 'tooLong', detail: null },
      { title: 'On Mars', reason: 'zone', detail: 'Mars/Olympus' },
      { title: 'Ends first', reason: 'noLength', detail: null },
      { title: 'One week moved', reason: 'repeats', detail: null },
    ])
  })

  it('keeps one copy of an event the file has twice: the later SEQUENCE, else the last', () => {
    const text = calendarOf(
      eventOf('DTSTART;VALUE=DATE:20261201', 'UID:x', 'SEQUENCE:2', 'SUMMARY:Moved') +
        eventOf('DTSTART;VALUE=DATE:20261130', 'UID:x', 'SEQUENCE:1', 'SUMMARY:First') +
        eventOf('DTSTART;VALUE=DATE:20261201', 'UID:y', 'SUMMARY:Draft') +
        eventOf('DTSTART;VALUE=DATE:20261202', 'UID:y', 'SUMMARY:Final'),
    )

    expect(read(text).items.map(item => item.event.title)).toEqual(['Moved', 'Final'])
    expect(read(text).skipped).toEqual([
      { title: 'First', reason: 'twice', detail: null },
      { title: 'Draft', reason: 'twice', detail: null },
    ])
  })

  it('gives an event with no UID one from what it is, the same each time, and an untitled one a title', () => {
    const text = calendarOf(eventOf('DTSTART;VALUE=DATE:20261201'))
    const first = read(text).items[0]!

    expect(first.source.uid).toMatch(/^no-uid-[0-9a-f]{8}$/)
    expect(read(text).items[0]?.source.uid).toBe(first.source.uid)
    expect(first.event.title).toBe('Untitled event')
  })

  it('cuts a title, a place and notes that run long, rather than leave the event out', () => {
    const answer = read(calendarOf(eventOf('DTSTART;VALUE=DATE:20261201', 'UID:l', `SUMMARY:${'t'.repeat(300)}`, `LOCATION:${'p'.repeat(300)}`, `DESCRIPTION:${'n'.repeat(6000)}`)))
    const event = answer.items[0]!.event

    expect([event.title.length, event.place?.length, event.notes?.length]).toEqual([200, 200, 5000])
    expect(event.title.endsWith('…')).toBe(true)
  })

  it("isn't a calendar without a VCALENDAR", () => {
    expect(readIcs('Name,Start\nLunch,2026-12-01', HERE)).toBeNull()
    expect(readIcs('', HERE)).toBeNull()
  })

  it.each([
    ['-//Apple Inc.//macOS 15.1//EN', 'Apple Calendar'],
    ['-//Microsoft Corporation//Microsoft Exchange Server 2010//EN', 'Outlook'],
    ['-//Fastmail/2020.5/EN', 'Fastmail/2020.5/EN'],
    ['-//Mozilla.org/NONSGML Mozilla Calendar V1.1//EN', 'Mozilla Calendar'],
    ['-//Rohan Bhande//Queue-tea//EN', 'Queue-tea'],
  ])('names the app that wrote %s as %s', (prodid, app) => {
    expect(appOf(prodid)).toBe(app)
  })
})

describe('writing an .ics file', () => {
  const EVENTS: CalendarEvent[] = [
    { id: 'e-1', title: 'Call with Ana, then lunch; café', when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'Europe/Lisbon' }, place: 'Rua Augusta, Lisboa', notes: `Bring the notes\n${'and more '.repeat(20)}to come` },
    { id: 'e-2', title: 'Lisbon trip', when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-06' }, place: null, notes: null },
    { id: 'e-3', title: 'Release', when: { kind: 'timed', start: '2026-03-08T01:30', end: '2026-03-08T03:30', zone: 'America/New_York' }, place: null, notes: null },
    { id: 'e-4', title: 'Server window', when: { kind: 'timed', start: '2026-12-02T23:00', end: '2026-12-03T01:00', zone: 'UTC' }, place: null, notes: null },
    { id: 'e-5', title: 'Standup', when: { kind: 'timed', start: '2026-12-02T09:30', end: '2026-12-02T09:45', zone: 'Asia/Tokyo' }, place: null, notes: null, source: { file: 'Work.ics', calendar: 'Work', app: 'Google Calendar', uid: 'standup@google.com', importedAt: '2026-11-01T00:00:00.000Z' } },
  ]
  const text = icsOf(EVENTS, { calendar: 'Demo, realm', here: 'America/New_York', now: NOW })
  const lines = text.split('\r\n')

  it('writes CRLF lines of 75 bytes or fewer, with the calendar named', () => {
    expect(text.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(text.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/)
    expect(lines.every(line => bytes(line) <= 75)).toBe(true)
    expect(lines.slice(0, 7)).toEqual(['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rohan Bhande//Queue-tea//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Demo\\, realm', 'X-WR-TIMEZONE:America/New_York'])
  })

  it("writes all-day events as days ending the day after, and timed ones on their zone's clock", () => {
    expect(lines).toContain('DTSTART;VALUE=DATE:20261203')
    expect(lines).toContain('DTEND;VALUE=DATE:20261207')
    expect(lines).toContain('DTSTART;TZID=Europe/Lisbon:20261201T090000')
    expect(lines).toContain('DTSTART;TZID=UTC:20261202T230000')
    expect(lines).toContain('SUMMARY:Call with Ana\\, then lunch\\; café')
  })

  it("keeps an imported event's UID, and names its own events so they're known again", () => {
    expect(lines).toContain('UID:e-1@queue-tea')
    expect(lines).toContain('UID:standup@google.com')
  })

  it('defines each zone it uses once, with its changes for the years the events use', () => {
    expect(lines.filter(line => line === 'BEGIN:VTIMEZONE')).toHaveLength(4)
    expect(vtimezoneOf('America/New_York', 2026, 2026)).toEqual([
      'BEGIN:VTIMEZONE',
      'TZID:America/New_York',
      'X-LIC-LOCATION:America/New_York',
      ...['BEGIN:STANDARD', 'DTSTART:20260101T000000', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0500', 'END:STANDARD'],
      ...['BEGIN:DAYLIGHT', 'DTSTART:20260308T020000', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'END:DAYLIGHT'],
      ...['BEGIN:STANDARD', 'DTSTART:20261101T020000', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'END:STANDARD'],
      'END:VTIMEZONE',
    ])
    // Summer in Sydney is when the year starts.
    expect(vtimezoneOf('Australia/Sydney', 2026, 2026).slice(3, 5)).toEqual(['BEGIN:DAYLIGHT', 'DTSTART:20260101T000000'])
  })

  it('reads back as the same events, so importing an export changes nothing', () => {
    const answer = read(text, { file: 'Demo.ics' })

    expect(answer.skipped).toEqual([])
    expect(answer.items.map(item => item.event)).toEqual(EVENTS.map(({ id: _, source: __, ...event }) => event))
    expect(answer.items.map(item => importStatusOf({ events: EVENTS, kept: [] }, item))).toEqual(['same', 'same', 'same', 'same', 'same'])
  })

  it('defines its zones well enough for an app that knows none of them by name', () => {
    const renamed = text.replace(/America\/New_York/g, 'Eastern custom').replace(/Europe\/Lisbon/g, 'Lisbon custom').replace(/Asia\/Tokyo/g, 'Tokyo custom').replace(/X-LIC-LOCATION:[^\r]*\r\n/g, '')
    const moments = (when: CalendarEvent['when']) => (when.kind === 'timed' ? [instantOf(when.start, when.zone), instantOf(when.end, when.zone)] : [when.startDay, when.endDay])

    expect(whenOf(renamed, { here: 'Europe/Paris' }).map(moments)).toEqual(EVENTS.map(event => moments(event.when)))
  })
})
