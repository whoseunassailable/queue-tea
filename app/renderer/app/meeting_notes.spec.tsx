// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { hereZone } from '../../shared/calendar_time'
import type { EngineApi, Reply } from '../../shared/engine_api'
import { NO_MEETING } from '../../shared/meetings'
import type { Meeting } from '../../shared/meetings'
import type { Note, NoteChange, NoteInput, NotesView } from '../../shared/notes'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { fakeEngine, note } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const FOLDER = '/Users/me/.queue-tea/notes/a-000001'
const m = t.meeting
const f = t.meeting.form
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })
// The window's own zone, so the card shows the meeting's times as they are.
const HERE = hereZone()
const BODY = '## Agenda\n\n- Budget\n- Hiring\n\n## Notes\n\n\n## Decisions\n\n- Ship on Friday\n\n## Action items\n\n- [ ] Ana sends the deck\n- [x] Book the room\n- [ ] Sam checks the dates'
const SYNC = note({ id: 'n-sync', title: 'Weekly sync', folder: 'Meetings', type: 'meeting', body: BODY })

// The notes a test works on, changed as main would change them.
const memoryNotes = (start: Note[]) => {
  let notes = start
  let n = 0
  const view = (): NotesView => ({ notes, unreadable: [], folder: FOLDER })

  return {
    readNotes: vi.fn(async () => ok(view())),
    createNote: vi.fn(async (_key: string, input: NoteInput) => {
      n += 1
      const made = note({ id: `n-new${n}`, ...input, meeting: input.meeting ?? NO_MEETING, stamp: `new-${n}` })
      notes = [made, ...notes]

      return ok({ view: view(), id: made.id })
    }),
    saveNote: vi.fn(async (_key: string, id: string, change: NoteChange) => {
      n += 1
      const saved = { ...notes.find(one => one.id === id)!, ...change, stamp: `s-${n}` }
      notes = notes.map(one => (one.id === id ? saved : one))

      return ok({ kind: 'saved' as const, view: view(), note: saved, relinked: 0 })
    }),
  }
}

const open = async (over: Partial<EngineApi> = {}) => {
  window.location.hash = '#/notes'
  const { engine } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return engine
}
const card = () => within(screen.getByRole('region', { name: m.card }))
const sheet = () => within(screen.getByRole('dialog', { name: f.title }))
const field = (label: string) => sheet().getByLabelText(new RegExp(`^${label}`)) as HTMLInputElement | HTMLTextAreaElement
const type = (label: string, value: string) => fireEvent.input(field(label), { target: { value } })
const leave = (label: string) => fireEvent.blur(field(label))

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('a meeting note', () => {
  it('shows a details card under the title of a Meeting note, and none on other notes', async () => {
    await open(memoryNotes([SYNC]))
    await screen.findByDisplayValue('Weekly sync')

    expect(card().getByText(m.noDetails)).toBeTruthy()
    expect(card().getByText(m.counts(2, 1, 2, 3))).toBeTruthy()
    expect(card().getByRole('button', { name: m.addDetails })).toBeTruthy()

    fireEvent.change(screen.getByLabelText(t.notebook.type), { target: { value: 'idea' } })
    await waitFor(() => expect(screen.queryByRole('region', { name: m.card })).toBeNull())
  })

  it('a new note from the Meeting template has Agenda, Notes, Decisions and Action items', () => {
    expect(t.notebook.templates.meeting).toBe('## Agenda\n\n- \n\n## Notes\n\n\n## Decisions\n\n- \n\n## Action items\n\n- [ ] ')
  })

  it('adds the time, call link and attendees, checking each field when it is left and all of them on Save', async () => {
    const notes = memoryNotes([SYNC])
    await open(notes)
    await screen.findByDisplayValue('Weekly sync')
    await act(async () => void fireEvent.click(card().getByRole('button', { name: m.addDetails })))

    // The times and zone appear once there is a day.
    expect(sheet().queryByLabelText(new RegExp(`^${f.startTime}`))).toBeNull()
    type(f.day, '2026-12-01')
    expect(field(f.startTime).value).toBe('09:00')
    expect(field(f.endTime).value).toBe('09:30')
    expect(field(f.zone).value).toBe(HERE)

    type(f.link, 'javascript:alert(1)')
    expect(sheet().queryByText(f.linkBad)).toBeNull()
    leave(f.link)
    expect(sheet().getByText(f.linkBad)).toBeTruthy()

    type(f.endTime, '08:00')
    type(f.attendees, 'Ana <ana@example>')
    await act(async () => void fireEvent.click(sheet().getByRole('button', { name: f.save })))
    expect(sheet().getByText(t.calendar.form.endsFirst)).toBeTruthy()
    expect(sheet().getByText(f.emailBad)).toBeTruthy()
    expect(notes.saveNote).not.toHaveBeenCalled()

    type(f.link, 'zoom.us/j/123456789')
    type(f.endTime, '10:00')
    type(f.attendees, 'Ana Lima <ana@example.com>\nSam, sam')
    expect(sheet().queryByText(f.linkBad)).toBeNull()
    await act(async () => void fireEvent.click(sheet().getByRole('button', { name: f.save })))

    const meeting: Meeting = { attendees: ['Ana Lima <ana@example.com>', 'Sam'], link: 'https://zoom.us/j/123456789', time: { start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: HERE } }
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-sync', expect.objectContaining({ type: 'meeting', body: BODY, meeting }), SYNC.stamp))
    expect(screen.queryByRole('dialog', { name: f.title })).toBeNull()
    expect(card().getByText(m.when('2026-12-01', t.calendar.span('09:00', '10:00')))).toBeTruthy()
    expect(card().getByText('Ana Lima <ana@example.com>, Sam')).toBeTruthy()
    expect(card().getByRole('button', { name: m.edit })).toBeTruthy()
  })

  it('opens the call in the browser from Join', async () => {
    const openLink = vi.fn(async () => ok(null))
    await open({ ...memoryNotes([{ ...SYNC, meeting: { attendees: ['Ana'], link: 'https://meet.google.com/abc-defg-hij', time: null } }]), openLink })
    await screen.findByDisplayValue('Weekly sync')

    expect(card().getByText(m.noTime)).toBeTruthy()
    await act(async () => void fireEvent.click(card().getByRole('button', { name: m.joinLabel(m.join.meet, 'Weekly sync') })))
    expect(openLink).toHaveBeenCalledWith('https://meet.google.com/abc-defg-hij')
  })

  it("shows a meeting in another zone on the Mac's clock, with its own times beside it", async () => {
    const zone = HERE === 'Asia/Tokyo' ? 'Europe/Lisbon' : 'Asia/Tokyo'
    await open(memoryNotes([{ ...SYNC, meeting: { ...NO_MEETING, time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone } } }]))
    await screen.findByDisplayValue('Weekly sync')

    expect(card().getByText(t.calendar.inZone('09:00', '09:30', zone))).toBeTruthy()
  })

  it('clears the details when every field is emptied', async () => {
    const notes = memoryNotes([{ ...SYNC, meeting: { attendees: ['Ana'], link: 'https://zoom.us/j/1', time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: HERE } } }])
    await open(notes)
    await screen.findByDisplayValue('Weekly sync')
    await act(async () => void fireEvent.click(card().getByRole('button', { name: m.edit })))
    for (const label of [f.day, f.link, f.attendees]) type(label, '')
    await act(async () => void fireEvent.click(sheet().getByRole('button', { name: f.save })))

    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-sync', expect.objectContaining({ meeting: NO_MEETING }), SYNC.stamp))
    expect(card().getByText(m.noDetails)).toBeTruthy()
  })

  it('Cancel leaves the meeting as it was', async () => {
    const notes = memoryNotes([SYNC])
    await open(notes)
    await screen.findByDisplayValue('Weekly sync')
    await act(async () => void fireEvent.click(card().getByRole('button', { name: m.addDetails })))
    type(f.link, 'https://zoom.us/j/1')
    await act(async () => void fireEvent.click(sheet().getByRole('button', { name: t.actions.cancel })))

    expect(screen.queryByRole('dialog', { name: f.title })).toBeNull()
    expect(card().getByText(m.noDetails)).toBeTruthy()
    expect(notes.saveNote).not.toHaveBeenCalled()
  })

  it('makes a follow-up meeting with the same people and call, and the open action items on its agenda', async () => {
    const meeting: Meeting = { attendees: ['Ana', 'Sam'], link: 'https://zoom.us/j/1', time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: HERE } }
    const notes = memoryNotes([{ ...SYNC, meeting }])
    await open(notes)
    await screen.findByDisplayValue('Weekly sync')
    await act(async () => void fireEvent.click(card().getByRole('button', { name: m.followUp })))

    await waitFor(() =>
      expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Weekly sync follow-up', folder: 'Meetings', type: 'meeting', meeting: { ...meeting, time: null }, body: m.followUpBody('Weekly sync', ['Ana sends the deck', 'Sam checks the dates']) }),
    )
    expect(await screen.findByDisplayValue('Weekly sync follow-up')).toBeTruthy()
    expect(await screen.findByText(m.madeFollowUp('Weekly sync follow-up'))).toBeTruthy()
    expect(card().getByText(m.noTime)).toBeTruthy()
    expect(card().getByText(m.counts(2, 0, 0, 0))).toBeTruthy()
  })

  it('a follow-up keeps the words typed a moment before', async () => {
    const notes = memoryNotes([SYNC])
    await open(notes)
    await screen.findByDisplayValue('Weekly sync')
    const box = screen.getByLabelText(t.notebook.body, { selector: 'textarea' }) as HTMLTextAreaElement
    const typed = `${BODY}\n- [ ] Bo writes the notes`
    box.focus()
    fireEvent.input(box, { target: { value: typed, selectionStart: typed.length, selectionEnd: typed.length } })
    await act(async () => void fireEvent.click(card().getByRole('button', { name: m.followUp })))

    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-sync', expect.objectContaining({ body: typed }), SYNC.stamp))
    await waitFor(() => expect(notes.createNote).toHaveBeenCalledWith(KEY, expect.objectContaining({ body: m.followUpBody('Weekly sync', ['Ana sends the deck', 'Sam checks the dates', 'Bo writes the notes']) })))
  })
})
