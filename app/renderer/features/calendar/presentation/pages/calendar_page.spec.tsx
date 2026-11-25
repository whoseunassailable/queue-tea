// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CalendarEvent, CalendarView } from '../../../../../shared/calendar'
import type { EngineApi, ProjectView, Reply } from '../../../../../shared/engine_api'
import { App } from '../../../../app/app'
import { t } from '../../../../l10n/en'
import { activeQuest, fakeEngine, projectView, quest, QUEST_FACTS } from '../../../../test_support'
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
  await act(async () => void render(<CalendarPage engine={engine} realm={realm} onOpenQuest={onOpenQuest} onSay={onSay} nowMs={() => NOW} zone={() => HERE} />))

  return { engine, onOpenQuest, onSay }
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
})
