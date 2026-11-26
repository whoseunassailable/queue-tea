import { mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import { NO_MEETING } from '../../../../shared/meetings'
import type { Meeting } from '../../../../shared/meetings'
import type { NoteChange, NotesView } from '../../../../shared/notes'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import { notesApi } from './notes_api'
import type { NotesDeps } from './notes_api'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-11-25T12:00:00Z')
const MEETING: Meeting = {
  attendees: ['Ana Lima <ana@example.com>', 'Sam'],
  link: 'https://meet.google.com/abc-defg-hij',
  time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'America/Chicago' },
}

let home: string
let dir: string
let ids: number
let api: ReturnType<typeof notesApi>

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = <T>(answer: Reply<T>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const change = (over: Partial<NoteChange> = {}): NoteChange => ({ title: 'Weekly sync', folder: 'Meetings', type: 'meeting', isPinned: false, tags: [], meeting: NO_MEETING, body: '## Agenda\n\n- Budget', ...over })
const only = (view: NotesView, id: string) => view.notes.find(n => n.id === id)!
const makeApi = () => {
  const log = createLogger('dev', () => {})
  const host = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
  const deps: NotesDeps = { host, home, now: () => NOW, offsetMinutes: () => -360, log, newId: () => `t-${(ids += 1)}`, newNoteId: () => `n-${(ids += 1)}`, terminal: async () => 'terminal', copy: () => {}, prepareCodex: async () => [], reveal: () => {} }

  return notesApi(deps)
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-meetings-')))
  dir = join(home, '.queue-tea/notes', KEY)
  ids = 0
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify(emptyRecord('demo', '/p/demo')))
  api = makeApi()
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('meeting notes on disk', () => {
  it('makes a meeting note with its details, and reads them after reopening', async () => {
    const { id, view } = data(await api.createNote(KEY, change({ meeting: MEETING })))

    expect(only(view, id).meeting).toEqual(MEETING)
    expect(await readFile(join(dir, `${id}.md`), 'utf8')).toContain('attendees: ["Ana Lima <ana@example.com>","Sam"]\nmeeting-link: "https://meet.google.com/abc-defg-hij"\nmeeting-start: "2026-12-01T09:00"\nmeeting-end: "2026-12-01T09:30"\nmeeting-zone: "America/Chicago"\n')
    expect(only(data(await makeApi().readNotes(KEY)), id).meeting).toEqual(MEETING)
  })

  it('a note made with no meeting has none, and writes none', async () => {
    const { id, view } = data(await api.createNote(KEY, { title: 'Plan', folder: 'Ideas', type: null, isPinned: false, tags: [], body: '' }))

    expect(only(view, id).meeting).toEqual(NO_MEETING)
    expect(await readFile(join(dir, `${id}.md`), 'utf8')).not.toMatch(/^(attendees|meeting-[a-z]+):/m)
  })

  it('saves new details over the old ones, and clearing them takes the keys out of the file', async () => {
    const { id, view } = data(await api.createNote(KEY, change({ meeting: MEETING })))
    const moved: Meeting = { attendees: ['Bo'], link: 'https://zoom.us/j/1', time: { start: '2026-12-02T15:00', end: '2026-12-02T16:00', zone: 'Europe/Lisbon' } }
    const saved = data(await api.saveNote(KEY, id, change({ meeting: moved }), only(view, id).stamp))
    if (saved.kind !== 'saved') throw new Error('should save')

    expect(saved.note.meeting).toEqual(moved)
    const cleared = data(await api.saveNote(KEY, id, change({ meeting: NO_MEETING }), saved.note.stamp))
    if (cleared.kind !== 'saved') throw new Error('should save')
    expect(cleared.note.meeting).toEqual(NO_MEETING)
    expect(await readFile(join(dir, `${id}.md`), 'utf8')).not.toMatch(/^(attendees|meeting-[a-z]+):/m)
  })

  it('a save that leaves the meeting out keeps the one in the file', async () => {
    const { id, view } = data(await api.createNote(KEY, change({ meeting: MEETING })))
    const { meeting: _left, ...withoutMeeting } = change({ body: 'Changed' })
    const saved = data(await api.saveNote(KEY, id, withoutMeeting, only(view, id).stamp))
    if (saved.kind !== 'saved') throw new Error('should save')

    expect(saved.note).toMatchObject({ body: 'Changed', meeting: MEETING })
  })

  it('keeps what Obsidian added beside the details, and the details Queue-tea could not read', async () => {
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'n-ob.md'), '---\ntitle: Planning\ntype: meeting\nattendees:\n  - Ana\nmeeting-link: not a link\nlocation: Room 4\n---\nBody')
    const read = only(data(await api.readNotes(KEY)), 'n-ob')
    expect(read.meeting).toEqual({ attendees: ['Ana'], link: null, time: null })

    data(await api.saveNote(KEY, 'n-ob', change({ title: 'Planning', meeting: { ...read.meeting, attendees: ['Ana', 'Bo'] }, body: 'Body' }), read.stamp))
    const text = await readFile(join(dir, 'n-ob.md'), 'utf8')
    expect(text).toContain('attendees: ["Ana","Bo"]')
    expect(text).toContain('location: Room 4')
    expect(text).toContain('meeting-link: not a link')
  })

  it('restoring an older version brings back its details', async () => {
    const { id, view } = data(await api.createNote(KEY, change({ meeting: MEETING })))
    const first = data(await api.readNoteHistory(KEY, id))[0]!
    const saved = data(await api.saveNote(KEY, id, change({ meeting: NO_MEETING }), only(view, id).stamp))
    if (saved.kind !== 'saved') throw new Error('should save')
    const restored = data(await api.restoreNoteVersion(KEY, id, first.id, saved.note.stamp))
    if (restored.kind !== 'saved') throw new Error('should restore')

    expect(restored.note.meeting).toEqual(MEETING)
  })
})

describe('checking a meeting as the sheet does', () => {
  it('refuses a link, time or attendee list the sheet would not save, and writes nothing', async () => {
    const tooMany = Array.from({ length: 51 }, (_, i) => `Person ${i}`)

    expect(refused(await api.createNote(KEY, change({ meeting: { ...NO_MEETING, link: 'javascript:alert(1)' } })))).toBe(MESSAGES.badMeetingLink)
    expect(refused(await api.createNote(KEY, change({ meeting: { ...NO_MEETING, time: { start: '2026-12-01T10:00', end: '2026-12-01T09:00', zone: 'UTC' } } })))).toBe(MESSAGES.badMeetingTime)
    expect(refused(await api.createNote(KEY, change({ meeting: { ...NO_MEETING, time: { start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: 'Mars/Olympus' } } })))).toBe(MESSAGES.badMeetingTime)
    expect(refused(await api.createNote(KEY, change({ meeting: { ...NO_MEETING, attendees: ['x'.repeat(101)] } })))).toBe(MESSAGES.meetingAttendeeLong)
    expect(refused(await api.createNote(KEY, change({ meeting: { ...NO_MEETING, attendees: tooMany } })))).toBe(MESSAGES.meetingTooManyAttendees)
    expect(refused(await api.createNote(KEY, change({ meeting: { ...NO_MEETING, attendees: 'Ana' as unknown as string[] } })))).toBe(MESSAGES.badValue)
    expect(refused(await api.createNote(KEY, change({ meeting: 'tomorrow' as unknown as Meeting })))).toBe(MESSAGES.badValue)
    expect(await readdir(join(home, '.queue-tea'))).not.toContain('notes')
  })

  it('saves attendees trimmed and once each, and the zone by its own name', async () => {
    const given: Meeting = { attendees: ['  Ana  Lima ', 'ana lima', '', ...Array.from({ length: 49 }, (_, i) => `P${i}`)], link: ' https://zoom.us/j/1 ', time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'europe/lisbon' } }
    const { id, view } = data(await api.createNote(KEY, change({ meeting: given })))

    expect(only(view, id).meeting).toEqual({ attendees: ['Ana Lima', ...Array.from({ length: 49 }, (_, i) => `P${i}`)], link: 'https://zoom.us/j/1', time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'Europe/Lisbon' } })
  })
})
