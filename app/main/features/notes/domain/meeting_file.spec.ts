import { describe, expect, it } from 'vitest'

import { attendeesOf, callKindOf, hasMeeting, meetingLinkOf, meetingTimeOf, NO_MEETING, sameMeeting } from '../../../../shared/meetings'
import type { Meeting } from '../../../../shared/meetings'
import { noteText, parseNote } from './note_file'
import type { NoteFile } from './note_file'

const MEETING: Meeting = {
  attendees: ['Ana Lima <ana@example.com>', 'Sam'],
  link: 'https://zoom.us/j/123456789?pwd=abc',
  time: { start: '2026-12-01T15:00', end: '2026-12-01T15:30', zone: 'Europe/Lisbon' },
}
const file = (over: Partial<NoteFile> = {}): NoteFile => ({ title: 'Weekly sync', folder: 'Meetings', type: 'meeting', isPinned: false, tags: [], meeting: NO_MEETING, created: 'c', updated: 'u', isArchived: false, quests: [], aliases: [], body: '## Agenda\n\n- Budget', rest: [], ...over })

describe('a meeting in a note file', () => {
  it('writes each part as its own property after the tags, and reads it back', () => {
    const text = noteText(file({ meeting: MEETING }))

    expect(text).toContain('tags: []\nattendees: ["Ana Lima <ana@example.com>","Sam"]\nmeeting-link: "https://zoom.us/j/123456789?pwd=abc"\nmeeting-start: "2026-12-01T15:00"\nmeeting-end: "2026-12-01T15:30"\nmeeting-zone: "Europe/Lisbon"\ncreated:')
    expect(parseNote(text, 'n-1', 'file-time')).toEqual(file({ meeting: MEETING }))
  })

  it('leaves the keys out of a note with no meeting, so older files read and write as before', () => {
    const text = noteText(file())

    expect(text).not.toMatch(/^(attendees|meeting-[a-z]+):/m)
    expect(parseNote('---\ntitle: "Old"\ntype: "meeting"\n---\nBody', 'old', 'file-time').meeting).toEqual(NO_MEETING)
  })

  it('writes only the parts that are set', () => {
    const text = noteText(file({ meeting: { ...NO_MEETING, link: 'https://meet.google.com/abc-defg-hij' } }))

    expect(text).toMatch(/^meeting-link: /m)
    expect(text).not.toMatch(/^(attendees|meeting-start|meeting-end|meeting-zone):/m)
  })

  it('reads the plain YAML that Obsidian writes for the same properties', () => {
    const raw = '---\ntitle: Weekly sync\ntype: meeting\nattendees:\n  - Ana Lima\n  - "Sam"\nmeeting-link: https://teams.microsoft.com/l/meetup-join/abc\nmeeting-start: 2026-12-01T09:00\nmeeting-end: 2026-12-01T10:00\nmeeting-zone: America/Chicago\n---\nBody'

    expect(parseNote(raw, 'n-1', 'file-time')).toMatchObject({
      type: 'meeting',
      meeting: { attendees: ['Ana Lima', 'Sam'], link: 'https://teams.microsoft.com/l/meetup-join/abc', time: { start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: 'America/Chicago' } },
      rest: [],
    })
  })

  it('keeps values it cannot read in the file as they were, until a new value is saved over them', () => {
    const raw = '---\ntitle: "Sync"\nmeeting-link: "ftp://files.example.com"\nmeeting-start: "next tuesday"\nmeeting-end: "2026-12-01T10:00"\nmeeting-zone: "Mars/Olympus"\ncssclass: wide\n---\nBody'
    const read = parseNote(raw, 'n-1', 'file-time')

    expect(read.meeting).toEqual(NO_MEETING)
    expect(read.rest).toEqual(['cssclass: wide', 'meeting-link: "ftp://files.example.com"', 'meeting-start: "next tuesday"', 'meeting-end: "2026-12-01T10:00"', 'meeting-zone: "Mars/Olympus"'])
    const kept = noteText(read)
    expect(kept).toContain('meeting-link: "ftp://files.example.com"')
    expect(kept).toContain('meeting-zone: "Mars/Olympus"')

    const replaced = noteText({ ...read, meeting: MEETING })
    for (const key of ['meeting-link', 'meeting-start', 'meeting-end', 'meeting-zone']) expect(replaced.match(new RegExp(`^${key}:`, 'gm'))).toHaveLength(1)
    expect(replaced).not.toContain('ftp://')
    expect(replaced).toContain('cssclass: wide')
    expect(parseNote(replaced, 'n-1', 'file-time').meeting).toEqual(MEETING)
  })

  it('takes attendees written as one line with commas, dropping repeats and empty names', () => {
    expect(parseNote('---\nattendees: Ana, sam,  , Sam, Bo\n---\n', 'n', 't').meeting.attendees).toEqual(['Ana', 'sam', 'Bo'])
  })
})

describe('meeting links', () => {
  it('are web addresses with a host, trimmed', () => {
    expect(meetingLinkOf('  https://zoom.us/j/1  ')).toBe('https://zoom.us/j/1')
    expect(meetingLinkOf('http://intranet.example/call')).toBe('http://intranet.example/call')
    for (const bad of ['', 'zoom.us/j/1', 'javascript:alert(1)', 'mailto:ana@example.com', 'file:///etc/passwd', `https://x.example/${'a'.repeat(2048)}`, 42, null]) expect(meetingLinkOf(bad)).toBeNull()
  })

  it.each([
    ['https://meet.google.com/abc-defg-hij', 'meet'],
    ['https://us02web.zoom.us/j/123?pwd=x', 'zoom'],
    ['https://zoom.us/j/123', 'zoom'],
    ['https://acme.zoomgov.com/j/1', 'zoom'],
    ['https://teams.microsoft.com/l/meetup-join/19%3a', 'teams'],
    ['https://teams.live.com/meet/123', 'teams'],
    ['https://whereby.com/team', 'web'],
    ['https://zoom.us.evil.example/j/1', 'web'],
    ['https://notzoom.us/j/1', 'web'],
  ])('%s opens %s', (link, kind) => {
    expect(callKindOf(link)).toBe(kind)
  })
})

describe('meeting times', () => {
  it('are two wall times in a zone this computer knows, the end after the start and within a day', () => {
    expect(meetingTimeOf('2026-12-01T09:00', '2026-12-01T09:30', 'america/chicago')).toEqual({ start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'America/Chicago' })
    expect(meetingTimeOf('2026-12-01T23:30', '2026-12-02T00:30', 'UTC')).toMatchObject({ end: '2026-12-02T00:30' })
    expect(meetingTimeOf('2026-12-01T09:30', '2026-12-01T09:30', 'UTC')).toBeNull()
    expect(meetingTimeOf('2026-12-01T10:00', '2026-12-01T09:00', 'UTC')).toBeNull()
    expect(meetingTimeOf('2026-12-01T09:00', '2026-12-02T09:01', 'UTC')).toBeNull()
    expect(meetingTimeOf('2026-12-01', '2026-12-01T09:30', 'UTC')).toBeNull()
    expect(meetingTimeOf('2026-12-01T09:00', '2026-12-01T09:30', 'Nowhere/City')).toBeNull()
  })
})

describe('attendees', () => {
  it('keep 50 different names of up to 100 characters each', () => {
    const many = Array.from({ length: 60 }, (_, i) => `Person ${i}`)

    expect(attendeesOf(many)).toHaveLength(50)
    expect(attendeesOf(['x'.repeat(120)])).toEqual(['x'.repeat(100)])
    expect(attendeesOf(['  Ana   Lima ', 'ANA LIMA', 7, ''])).toEqual(['Ana Lima'])
  })
})

describe('telling meetings apart', () => {
  it('a meeting with any part set has details, and two are the same only when every part is', () => {
    expect(hasMeeting(NO_MEETING)).toBe(false)
    expect(hasMeeting({ ...NO_MEETING, attendees: ['Ana'] })).toBe(true)
    expect(sameMeeting(MEETING, { ...MEETING, attendees: [...MEETING.attendees] })).toBe(true)
    expect(sameMeeting(MEETING, { ...MEETING, time: { ...MEETING.time!, zone: 'UTC' } })).toBe(false)
    expect(sameMeeting(MEETING, { ...MEETING, link: null })).toBe(false)
    expect(sameMeeting(NO_MEETING, { ...NO_MEETING })).toBe(true)
  })
})
