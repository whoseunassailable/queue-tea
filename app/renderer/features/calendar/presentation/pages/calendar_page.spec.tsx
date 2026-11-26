// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CalendarEvent, CalendarExport, CalendarImport, CalendarImportPreview, CalendarSource, CalendarView } from '../../../../../shared/calendar'
import type { EngineApi, ProjectView, Reply } from '../../../../../shared/engine_api'
import { App } from '../../../../app/app'
import { t } from '../../../../l10n/en'
import type { NotesView } from '../../../../../shared/notes'
import { activeQuest, fakeEngine, note, projectView, quest, QUEST_FACTS } from '../../../../test_support'
import { createWorkspace } from '../../../workspace/state_management/workspace_store'
import { CalendarPage } from './calendar_page'

const KEY = 'a-000001'
const HERE = 'America/Chicago'
// Wednesday 25 November 2026, 13:44 in Chicago.
const NOW = Date.parse('2026-11-25T19:44:00Z')
const c = t.calendar
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })

const CALL: CalendarEvent = { id: 'e-1', title: 'Call with Ana', when: { kind: 'timed', start: '2026-11-26T15:00', end: '2026-11-26T15:30', zone: 'Europe/Lisbon' }, place: 'Zoom', notes: null }
const TRIP: CalendarEvent = { id: 'e-2', title: 'Lisbon trip', when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-05' }, place: null, notes: null }
const realmWith = (over: Parameters<typeof projectView>[1] = {}) => projectView(KEY, over) as Extract<ProjectView, { kind: 'readable' }>
const REALM = realmWith({
  ready: [{ kind: 'quest', quest: quest({ id: 't-ship', title: 'Ship the parser', due: '2026-11-27' }) }],
  activeQuests: [activeQuest({ id: 't-late', title: 'Fix the login', due: '2026-11-20' })],
})

const open = async ({ events = [CALL, TRIP], realm = REALM, over = {} }: { events?: CalendarEvent[]; realm?: Extract<ProjectView, { kind: 'readable' }>; over?: Partial<EngineApi> } = {}) => {
  const { engine } = fakeEngine({ readCalendar: vi.fn(async () => ok<CalendarView>({ events, unreadable: 0 })), ...over })
  const onOpenQuest = vi.fn()
  const onSay = vi.fn()
  const onOpenNote = vi.fn()
  await act(async () => void render(<CalendarPage engine={engine} realm={realm} onOpenQuest={onOpenQuest} onOpenNote={onOpenNote} onSay={onSay} nowMs={() => NOW} zone={() => HERE} />))

  return { engine, onOpenQuest, onOpenNote, onSay }
}
const dayCell = (day: string) => screen.getByRole('button', { name: c.addOn(day) }).closest('[role="gridcell"]') as HTMLElement
const fill = (label: string, value: string) => fireEvent.input(screen.getByLabelText(new RegExp(`^${label}`)), { target: { value } })

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('the month', () => {
  it("opens on this month, with events and due dates on their days on the Mac's clock", async () => {
    await open()

    expect(await screen.findByRole('heading', { name: 'November 2026' })).toBeTruthy()
    expect(screen.getByText(c.clock(HERE))).toBeTruthy()
    // 15:00 in Lisbon is 09:00 in Chicago.
    expect(within(dayCell('2026-11-26')).getByRole('button', { name: c.editEvent('Call with Ana') }).textContent).toBe('09:00Call with Ana')
    expect(within(dayCell('2026-11-27')).getByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })).toBeTruthy()
    expect(within(dayCell('2026-11-20')).getByRole('button', { name: c.openQuest('Fix the login', c.overdue) })).toBeTruthy()
    for (const day of ['2026-12-03', '2026-12-04', '2026-12-05']) expect(within(dayCell(day)).getByRole('button', { name: c.editEvent('Lisbon trip') })).toBeTruthy()
    expect(dayCell('2026-11-25').getAttribute('aria-current')).toBe('date')
  })

  it('pages to the next month and back to today', async () => {
    await open()
    await screen.findByRole('heading', { name: 'November 2026' })

    fireEvent.click(screen.getByRole('button', { name: c.next.month }))
    expect(screen.getByRole('heading', { name: 'December 2026' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: c.previous.month }))
    fireEvent.click(screen.getByRole('button', { name: c.previous.month }))
    expect(screen.getByRole('heading', { name: 'October 2026' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: c.today }))
    expect(screen.getByRole('heading', { name: 'November 2026' })).toBeTruthy()
  })

  it('shows a busy day’s first items and sends the rest to the agenda', async () => {
    const busy = ['A', 'B', 'C', 'D'].map((title, i): CalendarEvent => ({ id: `e-${i + 10}`, title, when: { kind: 'allDay', startDay: '2026-11-30', endDay: '2026-11-30' }, place: null, notes: null }))
    await open({ events: busy })
    await screen.findByRole('heading', { name: 'November 2026' })

    expect(within(dayCell('2026-11-30')).getAllByRole('button', { name: /^Edit / })).toHaveLength(2)
    fireEvent.click(within(dayCell('2026-11-30')).getByRole('button', { name: c.moreOn(2, '2026-11-30') }))

    expect(screen.getByRole('button', { name: c.modes.agenda }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('heading', { name: c.dayName('2026-11-30') })).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /^Edit / })).toHaveLength(4)
  })

  it('opens a due date’s quest', async () => {
    const { onOpenQuest } = await open()

    fireEvent.click(await screen.findByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) }))

    expect(onOpenQuest).toHaveBeenCalledWith('t-ship')
  })
})

describe('the week and the agenda', () => {
  it('puts a timed event at its hour, and all-day items above', async () => {
    await open({ events: [CALL, { ...TRIP, when: { kind: 'allDay', startDay: '2026-11-24', endDay: '2026-11-24' } }] })
    await screen.findByRole('heading', { name: 'November 2026' })
    fireEvent.click(screen.getByRole('button', { name: c.modes.week }))

    expect(screen.getByRole('heading', { name: '23 – 29 Nov 2026' })).toBeTruthy()
    const thursday = screen.getByRole('group', { name: c.dayName('2026-11-26') })
    const block = within(thursday).getByRole('button', { name: c.editEvent('Call with Ana') }).parentElement!
    expect(block.style.top).toBe(`${9 * 44}px`)
    expect(block.style.height).toBe('22px')
    expect(within(screen.getByRole('group', { name: c.allDayRow })).getByRole('button', { name: c.editEvent('Lisbon trip') })).toBeTruthy()
    expect(within(screen.getByRole('group', { name: c.allDayRow })).getByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })).toBeTruthy()
  })

  it("lists four weeks by day, with overdue quests first and an event's own zone beside the Mac's", async () => {
    await open()
    await screen.findByRole('heading', { name: 'November 2026' })
    fireEvent.click(screen.getByRole('button', { name: c.modes.agenda }))

    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings).toEqual(['25 Nov – 22 Dec 2026', c.overdueGroup, c.dayName('2026-11-26'), c.dayName('2026-11-27'), c.dayName('2026-12-03'), c.dayName('2026-12-04'), c.dayName('2026-12-05')])
    expect(screen.getByText(`09:00 – 09:30 · ${c.inZone('15:00', '15:30', 'Europe/Lisbon')}`)).toBeTruthy()
    expect(screen.getByText('Zoom')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: c.next.agenda }))
    expect(screen.getByText(c.emptyRange)).toBeTruthy()
  })
})

describe('adding, changing and removing events', () => {
  it('adds an event on a day, with every field checked before it is sent', async () => {
    const { engine, onSay } = await open()
    fireEvent.click(await screen.findByRole('button', { name: c.addOn('2026-12-01') }))

    const sheet = screen.getByRole('dialog', { name: c.form.add })
    expect((screen.getByLabelText(/^Starts/) as HTMLInputElement).value).toBe('2026-12-01')
    expect((screen.getByLabelText(/^Start time/) as HTMLInputElement).value).toBe('09:00')
    expect((screen.getByLabelText(/^Time zone/) as HTMLInputElement).value).toBe(HERE)
    fireEvent.click(within(sheet).getByRole('button', { name: c.form.addIt }))
    expect(screen.getByText(t.form.titleRequired)).toBeTruthy()
    expect(engine.saveCalendarEvent).not.toHaveBeenCalled()

    fill('Title', 'Dentist')
    fill('End time', '08:00')
    fireEvent.blur(screen.getByLabelText(/^End time/))
    expect(screen.getByText(c.form.endsFirst)).toBeTruthy()
    fill('End time', '09:45')
    fill('Place', 'Main St')
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: c.form.addIt })))

    expect(engine.saveCalendarEvent).toHaveBeenCalledWith(KEY, null, { title: 'Dentist', when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:45', zone: HERE }, place: 'Main St', notes: null })
    expect(onSay).toHaveBeenCalledWith(c.saved('Dentist'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(within(dayCell('2026-12-01')).getByRole('button', { name: c.editEvent('Dentist') })).toBeTruthy()
  })

  it('adds an all-day event without times', async () => {
    const { engine } = await open()
    fireEvent.click(await screen.findByRole('button', { name: c.newEvent }))
    fill('Title', 'Holiday')
    fireEvent.click(screen.getByLabelText(c.form.allDay))
    expect(screen.queryByLabelText(/^Start time/)).toBeNull()
    fill('Starts', '2026-12-24')
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.form.addIt })))

    expect(engine.saveCalendarEvent).toHaveBeenCalledWith(KEY, null, expect.objectContaining({ when: { kind: 'allDay', startDay: '2026-12-24', endDay: '2026-12-24' } }))
  })

  it("keeps the sheet open with the engine's reason when a save is refused", async () => {
    await open({ over: { saveCalendarEvent: vi.fn(async () => ({ ok: false as const, error: { message: 'Pick a time zone from the list, such as America/Chicago.' } })) } })
    fireEvent.click(await screen.findByRole('button', { name: c.newEvent }))
    fill('Title', 'Call')
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.form.addIt })))

    expect((await screen.findByRole('alert')).textContent).toBe('Pick a time zone from the list, such as America/Chicago.')
    expect(screen.getByRole('dialog', { name: c.form.add })).toBeTruthy()
  })

  it('changes an event on its own zone’s clock, keeping its id', async () => {
    const { engine } = await open()
    fireEvent.click(await screen.findByRole('button', { name: c.editEvent('Call with Ana') }))

    expect(screen.getByRole('dialog', { name: c.form.edit })).toBeTruthy()
    expect((screen.getByLabelText(/^Start time/) as HTMLInputElement).value).toBe('15:00')
    expect((screen.getByLabelText(/^Time zone/) as HTMLInputElement).value).toBe('Europe/Lisbon')
    fill('Title', 'Call with Ana and Rui')
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.form.save })))

    expect(engine.saveCalendarEvent).toHaveBeenCalledWith(KEY, 'e-1', { title: 'Call with Ana and Rui', when: CALL.when, place: 'Zoom', notes: null })
  })

  it('removes an event after asking', async () => {
    const { engine, onSay } = await open()
    fireEvent.click((await screen.findAllByRole('button', { name: c.editEvent('Lisbon trip') }))[0]!)
    fireEvent.click(screen.getByRole('button', { name: c.form.remove }))

    expect(screen.getByRole('dialog', { name: c.removeTitle('Lisbon trip') })).toBeTruthy()
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.removeIt })))

    expect(engine.removeCalendarEvent).toHaveBeenCalledWith(KEY, 'e-2')
    expect(onSay).toHaveBeenCalledWith(c.removed('Lisbon trip'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

describe('every state', () => {
  it('says it is reading, then shows the month', async () => {
    let answer: (reply: Reply<CalendarView>) => void = () => {}
    await open({ over: { readCalendar: vi.fn(() => new Promise<Reply<CalendarView>>(done => (answer = done))) } })

    expect(screen.getByText(t.loading.calendar)).toBeTruthy()
    await act(async () => answer(ok({ events: [], unreadable: 0 })))
    expect(await screen.findByRole('heading', { name: 'November 2026' })).toBeTruthy()
  })

  it('offers a first event when there is nothing to show', async () => {
    await open({ events: [], realm: realmWith() })

    expect(await screen.findByRole('heading', { name: c.emptyTitle })).toBeTruthy()
    // The second New event button is the one in the empty state.
    fireEvent.click(screen.getAllByRole('button', { name: c.newEvent })[1]!)
    expect(screen.getByRole('dialog', { name: c.form.add })).toBeTruthy()
    expect((screen.getByLabelText(/^Starts/) as HTMLInputElement).value).toBe('2026-11-25')
  })

  it('says why it failed, and tries again', async () => {
    const readCalendar = vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't read this realm's calendar." } }))
    await open({ over: { readCalendar } })

    expect(await screen.findByText("Couldn't read this realm's calendar.")).toBeTruthy()
    readCalendar.mockResolvedValueOnce({ ok: true, data: { events: [CALL], unreadable: 0 } } as never)
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.failed.tryAgain })))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'November 2026' })).toBeTruthy())
  })

  it("says when some of the file couldn't be read, and shows the rest", async () => {
    await open({ over: { readCalendar: vi.fn(async () => ok<CalendarView>({ events: [CALL], unreadable: 2 })) } })

    expect(await screen.findByText(c.unreadable(2))).toBeTruthy()
    expect(screen.getByRole('button', { name: c.editEvent('Call with Ana') })).toBeTruthy()
  })
})

describe('importing and exporting .ics files', () => {
  const f = c.files
  const SOURCE: CalendarSource = { file: 'Work.ics', calendar: 'Work', app: 'Google Calendar', uid: 'review@google.com', importedAt: '2026-11-25T19:00:00.000Z' }
  // 14:00 in Lisbon on Monday 30 November is 08:00 in Chicago.
  const REVIEW: CalendarEvent = { id: 'e-3', title: 'Design review', when: { kind: 'timed', start: '2026-11-30T14:00', end: '2026-11-30T15:00', zone: 'Europe/Lisbon' }, place: 'Room 2', notes: null, source: SOURCE }
  const { id: _, source: __, ...reviewInput } = REVIEW
  const PREVIEW: CalendarImportPreview = {
    file: 'Work.ics',
    calendar: 'Work',
    app: 'Google Calendar',
    items: [
      { event: reviewInput, source: SOURCE, status: 'new' },
      { event: { title: 'Lisbon trip', when: TRIP.when, place: null, notes: null }, source: { ...SOURCE, uid: 'e-2@queue-tea' }, status: 'same' },
    ],
    skipped: [
      { title: 'Weekly sync', reason: 'repeats', detail: null },
      { title: null, reason: 'zone', detail: 'Mars/Olympus' },
    ],
  }

  it('shows what a file would bring in, imports the new and changed events, and says so', async () => {
    const importCalendarEvents = vi.fn(async () => ok<CalendarImport>({ view: { events: [CALL, TRIP, REVIEW], unreadable: 0 }, added: 1, updated: 0, same: 0 }))
    const { engine, onSay } = await open({ over: { readCalendarImport: vi.fn(async () => ok<CalendarImportPreview | null>(PREVIEW)), importCalendarEvents } })
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.import })))

    const sheet = await screen.findByRole('dialog', { name: f.title('Work.ics') })
    expect(engine.readCalendarImport).toHaveBeenCalledWith(KEY)
    expect(within(sheet).getByText(f.from('Work', 'Google Calendar')!)).toBeTruthy()
    expect(within(sheet).getByText(f.counts(1, 0, 1))).toBeTruthy()
    expect(within(sheet).getByText(`${c.dayName('2026-11-30')}, 14:00 – 15:00 · Europe/Lisbon`)).toBeTruthy()
    expect(within(sheet).getByText(f.leftOut(2))).toBeTruthy()
    expect(within(sheet).getByText(f.reasons.repeats, { exact: false })).toBeTruthy()
    expect(within(sheet).getByText(f.untitled)).toBeTruthy()
    expect(within(sheet).getByText(f.zoneNamed('Mars/Olympus'), { exact: false })).toBeTruthy()
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: f.importIt(1) })))

    expect(importCalendarEvents).toHaveBeenCalledWith(KEY, [{ event: reviewInput, source: SOURCE }])
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(onSay).toHaveBeenCalledWith(f.imported(1, 0))
    expect(within(dayCell('2026-11-30')).getByRole('button', { name: c.editImported('Design review', 'Work') })).toBeTruthy()
  })

  it('says when everything in the file is here already, and closes without importing', async () => {
    const preview = { ...PREVIEW, items: PREVIEW.items.map(item => ({ ...item, status: 'same' as const })), skipped: [] }
    const { engine } = await open({ over: { readCalendarImport: vi.fn(async () => ok<CalendarImportPreview | null>(preview)) } })
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.import })))

    expect(await screen.findByText(f.nothingNew)).toBeTruthy()
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: f.close })))
    expect(engine.importCalendarEvents).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it("keeps the sheet open with the engine's reason when an import is refused", async () => {
    const importCalendarEvents = vi.fn(async () => ({ ok: false as const, error: { message: 'Importing these would put more than 5,000 events on this calendar.' } }))
    await open({ over: { readCalendarImport: vi.fn(async () => ok<CalendarImportPreview | null>(PREVIEW)), importCalendarEvents } })
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.import })))
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.importIt(1) })))

    expect((await screen.findByRole('alert')).textContent).toBe('Importing these would put more than 5,000 events on this calendar.')
    expect(screen.getByRole('dialog', { name: f.title('Work.ics') })).toBeTruthy()
  })

  it('says it is reading the file, does nothing when the dialog is cancelled, and tries again after a failure', async () => {
    let answer: (reply: Reply<CalendarImportPreview | null>) => void = () => {}
    const readCalendarImport = vi.fn(() => new Promise<Reply<CalendarImportPreview | null>>(done => (answer = done)))
    await open({ over: { readCalendarImport } })
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.import })))

    expect(screen.getByRole('status').textContent).toContain(f.reading)
    expect((screen.getByRole('button', { name: f.export }) as HTMLButtonElement).disabled).toBe(true)
    await act(async () => answer(ok(null)))
    await waitFor(() => expect(screen.queryByText(f.reading)).toBeNull())
    expect(screen.queryByRole('dialog')).toBeNull()

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: f.import })))
    await act(async () => answer({ ok: false, error: { message: "Notes.ics isn't a calendar file Queue-tea can read." } }))
    const failed = await screen.findByRole('dialog', { name: f.readFailed })
    expect(within(failed).getByRole('alert').textContent).toBe("Notes.ics isn't a calendar file Queue-tea can read.")
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.failed.tryAgain })))
    expect(readCalendarImport).toHaveBeenCalledTimes(3)
  })

  it("exports the realm's events under its name, and says where they went", async () => {
    const exportCalendar = vi.fn(async () => ok<CalendarExport | null>({ file: 'a.ics', events: 2 }))
    const { onSay } = await open({ over: { exportCalendar } })
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.export })))

    expect(exportCalendar).toHaveBeenCalledWith(KEY, REALM.name)
    await waitFor(() => expect(onSay).toHaveBeenCalledWith(f.exported(2, 'a.ics')))
  })

  it('says there is nothing to export before asking where to put it', async () => {
    const { engine, onSay } = await open({ events: [], realm: realmWith() })
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: f.export })))

    expect(onSay).toHaveBeenCalledWith(f.nothingToExport)
    expect(engine.exportCalendar).not.toHaveBeenCalled()
  })

  it('shows where an imported event came from: in the agenda and in its sheet', async () => {
    await open({ events: [CALL, REVIEW] })
    await screen.findByRole('heading', { name: 'November 2026' })
    fireEvent.click(screen.getByRole('button', { name: c.modes.agenda }))

    expect(screen.getByText(`Room 2 · ${c.fromTag('Work')}`)).toBeTruthy()
    expect(screen.getByRole('button', { name: c.editImported('Design review', 'Work') }).getAttribute('title')).toContain(c.fromTag('Work'))
    fireEvent.click(screen.getByRole('button', { name: c.editImported('Design review', 'Work') }))
    expect(screen.getByText(c.sourceLine('2026-11-25', 'Work.ics', 'Work', 'Google Calendar'))).toBeTruthy()
    expect(screen.getByText(c.sourceHint)).toBeTruthy()
    expect(screen.queryByText(c.fromTag('Zoom'))).toBeNull()
  })
})

describe('meeting notes', () => {
  // Monday 30 November, 16:00 to 16:45 in Lisbon: 10:00 to 10:45 in Chicago.
  const REVIEW = note({ id: 'n-review', title: 'Design review', type: 'meeting', meeting: { attendees: ['Ana'], link: 'https://zoom.us/j/1', time: { start: '2026-11-30T16:00', end: '2026-11-30T16:45', zone: 'Europe/Lisbon' } } })
  const notesOf = (...notes: ReturnType<typeof note>[]): Reply<NotesView> => ok({ notes, unreadable: [], folder: '/n' })

  it('puts a Meeting note with a time on its day, and opens the note', async () => {
    const { onOpenNote } = await open({ over: { readNotes: vi.fn(async () => notesOf(REVIEW, note({ id: 'n-plain', title: 'No time', type: 'meeting' }))) } })
    await screen.findByRole('heading', { name: 'November 2026' })

    const chip = within(dayCell('2026-11-30')).getByRole('button', { name: t.meeting.openNote('Design review') })
    expect(chip.textContent).toBe('10:00Design review')
    expect(screen.queryByRole('button', { name: t.meeting.openNote('No time') })).toBeNull()
    fireEvent.click(chip)
    expect(onOpenNote).toHaveBeenCalledWith('n-review')
  })

  it('lists a meeting in the agenda with its call and its own zone beside the Mac\'s', async () => {
    await open({ over: { readNotes: vi.fn(async () => notesOf(REVIEW)) } })
    await screen.findByRole('heading', { name: 'November 2026' })
    fireEvent.click(screen.getByRole('button', { name: c.modes.agenda }))

    expect(screen.getByText(`10:00 – 10:45 · ${c.inZone('16:00', '16:45', 'Europe/Lisbon')}`)).toBeTruthy()
    expect(screen.getByText(`${t.meeting.calendarTag} · ${t.meeting.calls.zoom}`)).toBeTruthy()
  })

  it('shows the calendar while it reads the notes, then adds the meetings', async () => {
    let answer: (reply: Reply<NotesView>) => void = () => {}
    await open({ over: { readNotes: vi.fn(() => new Promise<Reply<NotesView>>(done => (answer = done))) } })
    await screen.findByRole('heading', { name: 'November 2026' })

    expect(screen.getByRole('status').textContent).toContain(t.meeting.readingNotes)
    expect(screen.getByRole('button', { name: c.editEvent('Call with Ana') })).toBeTruthy()
    await act(async () => answer(notesOf(REVIEW)))
    expect(await screen.findByRole('button', { name: t.meeting.openNote('Design review') })).toBeTruthy()
    expect(screen.queryByText(t.meeting.readingNotes)).toBeNull()
  })

  it("says when the notes can't be read, keeps the events, and tries again", async () => {
    const readNotes = vi.fn(async (): Promise<Reply<NotesView>> => ({ ok: false, error: { message: "Couldn't read the notes." } }))
    await open({ over: { readNotes } })

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain(t.meeting.notesFailed)
    expect(screen.getByRole('button', { name: c.editEvent('Call with Ana') })).toBeTruthy()
    readNotes.mockResolvedValueOnce(notesOf(REVIEW))
    await act(async () => void fireEvent.click(within(alert).getByRole('button', { name: t.failed.tryAgain })))
    await waitFor(() => expect(screen.getByRole('button', { name: t.meeting.openNote('Design review') })).toBeTruthy())
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('a realm with only a meeting shows it, not the empty state', async () => {
    await open({ events: [], realm: realmWith(), over: { readNotes: vi.fn(async () => notesOf(REVIEW)) } })

    expect(await screen.findByRole('button', { name: t.meeting.openNote('Design review') })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: c.emptyTitle })).toBeNull()
  })
})

describe('in the app', () => {
  afterEach(() => vi.useRealTimers())

  it('opens on ⌘8, and a due date opens its quest on the board', async () => {
    // Only the clock is faked, so the month shown holds the due date.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    window.location.hash = '#/home'
    const readQuestFacts = vi.fn(async () => ok(QUEST_FACTS))
    const { engine } = fakeEngine({ readProject: async key => ok(projectView(key, { ready: [{ kind: 'quest', quest: quest({ id: 't-ship', title: 'Ship the parser', due: '2026-11-27' }) }], canStart: 1 })), readQuestFacts })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })

    await act(() => void fireEvent.keyDown(document.body, { key: '8', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/calendar'))
    expect(await screen.findByRole('heading', { name: c.title })).toBeTruthy()

    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })))

    await waitFor(() => expect(window.location.hash).toBe('#/quests'))
    await waitFor(() => expect(readQuestFacts).toHaveBeenCalledWith(KEY, 't-ship'))
  })

  it('a meeting on the calendar opens its note in Notes', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    window.location.hash = '#/home'
    const review = note({ id: 'n-review', title: 'Design review', type: 'meeting', meeting: { attendees: [], link: null, time: { start: '2026-11-30T10:00', end: '2026-11-30T10:30', zone: 'America/Chicago' } } })
    const others = note({ id: 'n-other', title: 'Another note' })
    const { engine } = fakeEngine({ readNotes: vi.fn(async () => ok<NotesView>({ notes: [others, review], unreadable: [], folder: '/n' })) })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })
    await act(() => void fireEvent.keyDown(document.body, { key: '8', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/calendar'))
    await screen.findByRole('heading', { name: c.title })

    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: t.meeting.openNote('Design review') })))

    await waitFor(() => expect(window.location.hash).toBe('#/notes'))
    await waitFor(() => expect((screen.getByLabelText(`${t.notebook.noteTitle} *`) as HTMLInputElement).value).toBe('Design review'))
  })
})
