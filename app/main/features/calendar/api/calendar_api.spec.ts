import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { CalendarEventInput, CalendarView } from '../../../../shared/calendar'
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

  return calendarApi({ host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, log, newId: () => `e-${(ids += 1)}` })
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-calendar-')))
  file = join(home, '.queue-tea/notes', KEY, 'Calendar.json')
  ids = 0
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
    await write({ format: 2, events: [] })

    expect(refused(await api.readCalendar(KEY))).toBe(MESSAGES.newerCalendar(file))
    expect(refused(await api.removeCalendarEvent(KEY, 'e-1'))).toBe(MESSAGES.newerCalendar(file))
  })

  it('keeps the last good copy beside it before each write', async () => {
    data(await api.saveCalendarEvent(KEY, null, CALL))
    data(await api.saveCalendarEvent(KEY, null, TRIP))

    expect(JSON.parse(await readFile(`${file}.bak`, 'utf8')).events).toHaveLength(1)
  })
})
