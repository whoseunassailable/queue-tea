import { mkdir, mkdtemp, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { CalendarEventInput, CalendarImportPreview, CalendarView } from '../../../../shared/calendar'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import { calendarApi } from './calendar_api'

const KEY = 'demo-abc123'
const CALL: CalendarEventInput = { title: 'Call with Ana', when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'Europe/Lisbon' }, place: null, notes: null }
const TRIP: CalendarEventInput = { title: 'Lisbon trip', when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-06' }, place: 'Lisbon', notes: 'Pack the adapter.' }

let home: string
let file: string
let ids: number
let api: ReturnType<typeof calendarApi>
// What the dialogs answer: the file picked to import, and where an export goes.
let picked: string | null
let savedTo: string | null
let asked: string[]
let sizeSeen: number | null

const data = (answer: Reply<CalendarView>): CalendarView => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = (answer: Reply<CalendarView>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const onDisk = async () => JSON.parse(await readFile(file, 'utf8'))
const makeApi = () => {
  const log = createLogger('dev', () => {})

  return calendarApi({
    host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })),
    home,
    log,
    newId: () => `e-${(ids += 1)}`,
    now: () => Date.parse('2026-11-26T10:00:00Z'),
    zone: () => 'America/New_York',
    pickIcsFile: async () => picked,
    sizeOf: async path => sizeSeen ?? (await stat(path)).size,
    chooseIcsSave: async name => {
      asked.push(name)

      return savedTo
    },
  })
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-calendar-')))
  file = join(home, '.queue-tea/notes', KEY, 'Calendar.json')
  ids = 0
  picked = null
  savedTo = null
  asked = []
  sizeSeen = null
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify(emptyRecord('demo', '/p/demo')))
  api = makeApi()
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('a realm calendar on disk', () => {
  it('starts empty, and writes nothing to find that out', async () => {
    expect(data(await api.readCalendar(KEY))).toEqual({ events: [], unreadable: 0 })
    await expect(readFile(file, 'utf8')).rejects.toThrow()
  })

  it("keeps events beside the realm's notes, earliest first, and reads them back after a restart", async () => {
    data(await api.saveCalendarEvent(KEY, null, TRIP))
    data(await api.saveCalendarEvent(KEY, null, CALL))

    expect((await onDisk()).format).toBe(1)
    expect((await onDisk()).events.map((e: { title: string }) => e.title)).toEqual(['Call with Ana', 'Lisbon trip'])
    expect(data(await makeApi().readCalendar(KEY)).events).toEqual([
      { id: 'e-2', ...CALL },
      { id: 'e-1', ...TRIP },
    ])
  })

  it('changes an event in place, keeping its id', async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))
    const view = data(await api.saveCalendarEvent(KEY, 'e-1', { ...CALL, title: 'Call with Ana and Rui', place: 'Zoom' }))

    expect(view.events).toEqual([{ id: 'e-1', ...CALL, title: 'Call with Ana and Rui', place: 'Zoom' }])
  })

  it('removes an event, and says so when it is already gone', async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))

    expect(data(await api.removeCalendarEvent(KEY, 'e-1')).events).toEqual([])
    expect(refused(await api.removeCalendarEvent(KEY, 'e-1'))).toBe(MESSAGES.eventGone)
    expect(refused(await api.saveCalendarEvent(KEY, 'e-1', CALL))).toBe(MESSAGES.eventGone)
  })

  it('keeps the zone by its own name, and trims what it was sent', async () => {
    const view = data(await api.saveCalendarEvent(KEY, null, { ...CALL, title: '  Call\nwith Ana ', when: { ...CALL.when, zone: 'europe/lisbon' } as CalendarEventInput['when'], place: '  ', notes: ' Bring the notes ' }))

    expect(view.events[0]).toMatchObject({ title: 'Call with Ana', when: { zone: 'Europe/Lisbon' }, place: null, notes: 'Bring the notes' })
  })

  it('refuses a realm it does not know', async () => {
    expect(refused(await api.readCalendar('../other'))).toBe(MESSAGES.unknownProject)
    expect(refused(await api.saveCalendarEvent('ghost-abc123', null, CALL))).toBe(MESSAGES.unknownProject)
  })

  it('saves two quick changes one after the other, so neither is lost', async () => {
    await Promise.all([api.saveCalendarEvent(KEY, null, CALL), api.saveCalendarEvent(KEY, null, TRIP)])

    expect(data(await api.readCalendar(KEY)).events).toHaveLength(2)
  })
})

describe('what an event may say', () => {
  const refusal = async (over: Partial<CalendarEventInput> & Record<string, unknown>) => refused(await api.saveCalendarEvent(KEY, null, { ...CALL, ...over }))

  it('needs a title of 200 characters or fewer', async () => {
    expect(await refusal({ title: '  ' })).toBe(MESSAGES.titleRequired)
    expect(await refusal({ title: 'x'.repeat(201) })).toBe(MESSAGES.titleTooLong)
  })

  it('needs real days and times, in a zone Intl knows', async () => {
    expect(await refusal({ when: { kind: 'allDay', startDay: '2026-02-30', endDay: '2026-03-01' } })).toBe(MESSAGES.eventDayBad)
    expect(await refusal({ when: { kind: 'timed', start: '2026-12-01T25:00', end: '2026-12-01T26:00', zone: 'UTC' } })).toBe(MESSAGES.eventTimeBad)
    expect(await refusal({ when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: 'Mars/Base' } })).toBe(MESSAGES.eventZoneBad)
    expect(await refusal({ when: { kind: 'weekly' } as unknown as CalendarEventInput['when'] })).toBe(MESSAGES.badValue)
  })

  it('needs the end after the start, and no more than a year between them', async () => {
    expect(await refusal({ when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-02' } })).toBe(MESSAGES.eventEndsFirst)
    expect(await refusal({ when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:00', zone: 'UTC' } })).toBe(MESSAGES.eventEndsFirst)
    expect(await refusal({ when: { kind: 'allDay', startDay: '2026-01-01', endDay: '2027-01-02' } })).toBe(MESSAGES.eventTooLong)
    expect(data(await api.saveCalendarEvent(KEY, null, { ...CALL, when: { kind: 'allDay', startDay: '2026-01-01', endDay: '2027-01-01' } })).events).toHaveLength(1)
    expect(data(await api.saveCalendarEvent(KEY, null, { ...CALL, when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-03' } })).events).toHaveLength(2)
  })

  it('reads a time the clocks repeat as its first: 1:30 to 1:15 the night Chicago goes back ends first', async () => {
    const night = (start: string, end: string) => ({ ...CALL, when: { kind: 'timed' as const, start: `2026-11-01T${start}`, end: `2026-11-01T${end}`, zone: 'America/Chicago' } })

    expect(refused(await api.saveCalendarEvent(KEY, null, night('01:30', '01:15')))).toBe(MESSAGES.eventEndsFirst)
    expect(data(await api.saveCalendarEvent(KEY, null, night('00:30', '02:30'))).events).toHaveLength(1)
  })

  it('keeps a place to 200 characters and notes to 5,000', async () => {
    expect(await refusal({ place: 'x'.repeat(201) })).toBe(MESSAGES.eventPlaceLong)
    expect(await refusal({ notes: 'x'.repeat(5001) })).toBe(MESSAGES.eventNotesLong)
    expect(await refusal({ place: 7 as unknown as string })).toBe(MESSAGES.badValue)
  })
})

describe('a hand-edited Calendar.json', () => {
  const write = async (value: unknown) => {
    await mkdir(join(home, '.queue-tea/notes', KEY), { recursive: true })
    await writeFile(file, typeof value === 'string' ? value : JSON.stringify(value))
  }

  it('keeps the events it cannot read, and writes them back untouched', async () => {
    const broken = { id: 'e-9', title: 'Half typed', when: { kind: 'timed', start: '2026-12-01T09' } }
    await write({ format: 1, events: [{ id: 'e-7', ...TRIP }, broken, { id: 'e-7', ...CALL }] })

    expect(data(await api.readCalendar(KEY))).toEqual({ events: [{ id: 'e-7', ...TRIP }], unreadable: 2 })
    data(await api.saveCalendarEvent(KEY, null, CALL))

    expect((await onDisk()).events).toContainEqual(broken)
    expect((await onDisk()).events).toContainEqual({ id: 'e-7', ...CALL })
    expect(data(await api.readCalendar(KEY)).unreadable).toBe(2)
  })

  it('leaves a file that is not a calendar as it is', async () => {
    for (const text of ['{ not json', '[]', JSON.stringify({ events: [] }), JSON.stringify({ format: 1, events: {} })]) {
      await write(text)

      expect(refused(await api.readCalendar(KEY))).toBe(MESSAGES.badCalendarFile(file))
      expect(refused(await api.saveCalendarEvent(KEY, null, CALL))).toBe(MESSAGES.badCalendarFile(file))
      expect(await readFile(file, 'utf8')).toBe(text)
    }
  })

  it('leaves a file a newer Queue-tea wrote as it is', async () => {
    await write({ format: 3, events: [] })

    expect(refused(await api.readCalendar(KEY))).toBe(MESSAGES.newerCalendar(file))
    expect(refused(await api.removeCalendarEvent(KEY, 'e-1'))).toBe(MESSAGES.newerCalendar(file))
  })

  it('keeps the last good copy beside it before each write', async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))
    data(await api.saveCalendarEvent(KEY, null, TRIP))

    expect(JSON.parse(await readFile(`${file}.bak`, 'utf8')).events).toHaveLength(1)
  })
})

describe('importing and exporting .ics files', () => {
  const answer = <T>(reply: Reply<T>): T => {
    if (!reply.ok) throw new Error(`should succeed: ${reply.error.message}`)

    return reply.data
  }
  const refusedOf = <T>(reply: Reply<T>): string => {
    if (reply.ok) throw new Error('should be refused')

    return reply.error.message
  }
  const ics = (...events: string[]) =>
    `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Google Inc//Google Calendar 70.9054//EN\r\nX-WR-CALNAME:Work\r\n${events.map(event => `BEGIN:VEVENT\r\n${event}END:VEVENT\r\n`).join('')}END:VCALENDAR\r\n`
  const REVIEW = 'UID:review@google.com\r\nDTSTART;TZID=Europe/Lisbon:20261202T140000\r\nDTEND;TZID=Europe/Lisbon:20261202T150000\r\nSUMMARY:Review\r\n'
  const WEEKLY = 'UID:weekly@google.com\r\nDTSTART;VALUE=DATE:20261201\r\nRRULE:FREQ=WEEKLY\r\nSUMMARY:Weekly\r\n'
  const pick = async (text: string, name = 'Work.ics') => {
    picked = join(home, name)
    await writeFile(picked, text)
  }
  const preview = async () => {
    const read = answer(await api.readCalendarImport(KEY))
    if (read === null) throw new Error('should read a file')

    return read
  }
  const importAll = async (read: CalendarImportPreview) => answer(await api.importCalendarEvents(KEY, read.items.map(({ event, source }) => ({ event, source }))))

  it('reads a picked file against the calendar and writes nothing until told to', async () => {
    await pick(ics(REVIEW, WEEKLY))
    const read = await preview()

    expect(read).toMatchObject({ file: 'Work.ics', calendar: 'Work', app: 'Google Calendar', skipped: [{ title: 'Weekly', reason: 'repeats', detail: null }] })
    expect(read.items).toEqual([
      {
        event: { title: 'Review', when: { kind: 'timed', start: '2026-12-02T14:00', end: '2026-12-02T15:00', zone: 'Europe/Lisbon' }, place: null, notes: null },
        source: { file: 'Work.ics', calendar: 'Work', app: 'Google Calendar', uid: 'review@google.com', importedAt: '2026-11-26T10:00:00.000Z' },
        status: 'new',
      },
    ])
    await expect(readFile(file, 'utf8')).rejects.toThrow()
  })

  it("does nothing when the dialog is cancelled, and opens none for a realm it doesn't know", async () => {
    expect(answer(await api.readCalendarImport(KEY))).toBeNull()
    picked = join(home, 'never-read.ics')
    expect(refusedOf(await api.readCalendarImport('ghost-abc123'))).toBe(MESSAGES.unknownProject)
  })

  it("refuses a file that isn't a calendar, or is over 20 MB, by its name", async () => {
    await pick('Name,Start\nLunch,2026-12-01', 'lunches.csv')
    expect(refusedOf(await api.readCalendarImport(KEY))).toBe(MESSAGES.notCalendarFile('lunches.csv'))
    await pick(ics(REVIEW), 'Everything.ics')
    sizeSeen = 20_000_001
    expect(refusedOf(await api.readCalendarImport(KEY))).toBe(MESSAGES.icsTooBig('Everything.ics'))
  })

  it('adds the events with where they came from, and writes format 2 so an older Queue-tea leaves them be', async () => {
    await pick(ics(REVIEW))
    const done = await importAll(await preview())

    expect(done).toMatchObject({ added: 1, updated: 0, same: 0 })
    expect(done.view.events).toEqual([{ id: 'e-1', title: 'Review', when: { kind: 'timed', start: '2026-12-02T14:00', end: '2026-12-02T15:00', zone: 'Europe/Lisbon' }, place: null, notes: null, source: { file: 'Work.ics', calendar: 'Work', app: 'Google Calendar', uid: 'review@google.com', importedAt: '2026-11-26T10:00:00.000Z' } }])
    expect((await onDisk()).format).toBe(2)
    expect(data(await makeApi().readCalendar(KEY)).events).toEqual(done.view.events)
  })

  it('updates an event imported before in place, and leaves one that has not changed', async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))
    await pick(ics(REVIEW))
    await importAll(await preview())
    await pick(ics(REVIEW.replace('SUMMARY:Review', 'SUMMARY:Design review'), 'UID:new@google.com\r\nDTSTART;VALUE=DATE:20261205\r\nSUMMARY:Party\r\n'))
    const read = await preview()

    expect(read.items.map(item => [item.event.title, item.status])).toEqual([['Design review', 'update'], ['Party', 'new']])
    const done = await importAll(read)
    expect(done).toMatchObject({ added: 1, updated: 1, same: 0 })
    expect(done.view.events.map(event => [event.id, event.title])).toEqual([['e-1', 'Call with Ana'], ['e-2', 'Design review'], ['e-3', 'Party']])
    expect((await importAll(await preview())).same).toBe(2)
  })

  it('keeps where an event came from when it is edited, so importing again still finds it', async () => {
    await pick(ics(REVIEW))
    await importAll(await preview())
    const edited = data(await api.saveCalendarEvent(KEY, 'e-1', { title: 'Review, moved', when: { kind: 'timed', start: '2026-12-02T16:00', end: '2026-12-02T17:00', zone: 'Europe/Lisbon' }, place: null, notes: null }))

    expect(edited.events[0]?.source?.uid).toBe('review@google.com')
    expect((await preview()).items[0]?.status).toBe('update')
  })

  it("exports the realm's events to the file chosen, named for the realm, and reads its own export back unchanged", async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))
    data(await api.saveCalendarEvent(KEY, null, TRIP))
    savedTo = join(home, 'Demo realm.ics')
    const done = answer(await api.exportCalendar(KEY, 'Demo: realm/2026'))

    expect(asked).toEqual(['Demo realm 2026.ics'])
    expect(done).toEqual({ file: 'Demo realm.ics', events: 2 })
    const text = await readFile(savedTo, 'utf8')
    expect(text).toContain('X-WR-CALNAME:Demo realm 2026\r\n')
    expect(text).toContain('UID:e-1@queue-tea\r\n')
    picked = savedTo
    const read = await preview()
    expect(read.items.map(item => item.status)).toEqual(['same', 'same'])
    expect((await importAll(read)).view.events).toEqual([
      { id: 'e-1', ...CALL },
      { id: 'e-2', ...TRIP },
    ])
    expect((await onDisk()).format).toBe(1)
  })

  it('writes nothing when the save dialog is cancelled, and says when there is nothing to export', async () => {
    expect(refusedOf(await api.exportCalendar(KEY, 'Demo'))).toBe(MESSAGES.nothingToExportCalendar)
    data(await api.saveCalendarEvent(KEY, null, CALL))
    expect(answer(await api.exportCalendar(KEY, '  ..  '))).toBeNull()
    expect(asked).toEqual(['Calendar.ics'])
  })

  it('checks events sent back from the window again, and changes nothing when one fails', async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))
    await pick(ics(REVIEW))
    const [item] = (await preview()).items
    const bad = [{ event: item!.event, source: item!.source }, { event: { ...item!.event, title: '' }, source: item!.source }]

    expect(refusedOf(await api.importCalendarEvents(KEY, bad))).toBe(MESSAGES.titleRequired)
    expect(refusedOf(await api.importCalendarEvents(KEY, [{ event: item!.event, source: { ...item!.source, uid: '' } }]))).toBe(MESSAGES.badValue)
    expect(refusedOf(await api.importCalendarEvents(KEY, 'all of them'))).toBe(MESSAGES.badValue)
    expect(data(await api.readCalendar(KEY)).events).toHaveLength(1)
  })

  it('refuses an import that would take the calendar past 5,000 events, before and at the import', async () => {
    const events = Array.from({ length: 5000 }, (_, i) => ({ id: `e-x${i}`, ...TRIP }))
    await mkdir(join(home, '.queue-tea/notes', KEY), { recursive: true })
    await writeFile(file, JSON.stringify({ format: 1, events }))
    await pick(ics(REVIEW))

    expect(refusedOf(await api.readCalendarImport(KEY))).toBe(MESSAGES.importTooMany)
    await writeFile(file, JSON.stringify({ format: 1, events: events.slice(1) }))
    const read = await preview()
    await writeFile(file, JSON.stringify({ format: 1, events }))
    expect(refusedOf(await api.importCalendarEvents(KEY, read.items.map(({ event, source }) => ({ event, source }))))).toBe(MESSAGES.importTooMany)
    expect(data(await api.readCalendar(KEY)).events).toHaveLength(5000)
  })
})
