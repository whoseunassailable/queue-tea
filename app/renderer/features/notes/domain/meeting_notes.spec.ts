import { describe, expect, it } from 'vitest'

import { NO_MEETING } from '../../../../shared/meetings'
import type { Meeting } from '../../../../shared/meetings'
import { t } from '../../../l10n/en'
import { note } from '../../../test_support'
import { attendeesIn, followUpOf, linkIn, meetingFormOf, meetingOfForm, meetingWhenOf, sectionsOf, validateMeeting, withDay } from './meeting_notes'
import type { MeetingForm } from './meeting_notes'

const HERE = 'America/Chicago'
const f = t.meeting.form
const c = t.calendar.form
const MEETING: Meeting = { attendees: ['Ana', 'Sam'], link: 'https://zoom.us/j/1', time: { start: '2026-12-01T15:00', end: '2026-12-01T15:30', zone: 'Europe/Lisbon' } }
const form = (over: Partial<MeetingForm> = {}): MeetingForm => ({ day: '2026-12-01', startTime: '09:00', endTime: '09:30', zone: HERE, link: '', attendees: '', ...over })

describe('the sections of a meeting note', () => {
  it('reads the template as empty', () => {
    expect(sectionsOf(t.notebook.templates.meeting)).toEqual({ agenda: [], decisions: [], actions: [] })
  })

  it('reads agenda and decision items, and action items with whether they are done', () => {
    const body = ['## Agenda', '', '- Budget', '1. Hiring', '- [ ] Ask about rooms', '', '## Notes', '- not on the agenda', '', '### Decisions:', '* Ship on Friday', '', '## Action items', '- [ ] Ana sends the deck', '- [x] Book the room', '- a plain line is not an action', '- [ ] '].join('\n')

    expect(sectionsOf(body)).toEqual({
      agenda: ['Budget', 'Hiring', 'Ask about rooms'],
      decisions: ['Ship on Friday'],
      actions: [
        { text: 'Ana sends the deck', isDone: false },
        { text: 'Book the room', isDone: true },
      ],
    })
  })

  it('knows other names for the action items, ignoring case, and skips fenced code', () => {
    const body = '# Next steps\n\n```\n- [ ] not a task\n## Decisions\n```\n- [ ] Real one\n\n# DECISION\n- Go'

    expect(sectionsOf(body)).toEqual({ agenda: [], decisions: ['Go'], actions: [{ text: 'Real one', isDone: false }] })
  })
})

describe('a follow-up meeting', () => {
  const body = '## Agenda\n\n- Budget\n\n## Action items\n\n- [ ] Ana sends the deck\n- [x] Book the room\n- [ ] Sam checks the dates'

  it('keeps the folder, attendees and call link, drops the time, and puts the open actions on its agenda', () => {
    const made = followUpOf(note({ title: 'Weekly sync', folder: 'Meetings', type: 'meeting', meeting: MEETING, body }), [])

    expect(made).toEqual({
      title: 'Weekly sync follow-up',
      folder: 'Meetings',
      type: 'meeting',
      meeting: { ...MEETING, time: null },
      body: t.meeting.followUpBody('Weekly sync', ['Ana sends the deck', 'Sam checks the dates']),
    })
    expect(made.body.startsWith('Follows [[Weekly sync]].\n\n## Agenda\n\n- Ana sends the deck\n- Sam checks the dates\n- \n')).toBe(true)
    expect(sectionsOf(made.body)).toEqual({ agenda: ['Ana sends the deck', 'Sam checks the dates'], decisions: [], actions: [] })
  })

  it('numbers its title when that one is taken, and a follow-up of a follow-up keeps one suffix', () => {
    const taken = [note({ id: 'n-2', title: 'Weekly sync follow-up' })]

    expect(followUpOf(note({ title: 'Weekly sync', meeting: NO_MEETING }), taken).title).toBe('Weekly sync follow-up 2')
    expect(followUpOf(note({ title: 'Weekly sync follow-up', meeting: NO_MEETING }), taken).title).toBe('Weekly sync follow-up 2')
    expect(followUpOf(note({ title: 'Weekly sync follow-up 2', meeting: NO_MEETING }), taken).body).toContain('Follows [[Weekly sync follow-up 2]].')
  })

  it('keeps a long title within the limit', () => {
    expect(followUpOf(note({ title: 'x'.repeat(200), meeting: NO_MEETING }), []).title.length).toBeLessThanOrEqual(200)
  })
})

describe('when a meeting happens', () => {
  it("is on the Mac's clock, with its own zone's times beside it", () => {
    expect(meetingWhenOf(MEETING.time!, HERE)).toEqual({ day: '2026-12-01', span: t.calendar.span('09:00', '09:30'), own: t.calendar.inZone('15:00', '15:30', 'Europe/Lisbon') })
    expect(meetingWhenOf({ start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: HERE }, HERE).own).toBeNull()
  })

  it('says the day it ends when that is another day here', () => {
    expect(meetingWhenOf({ start: '2026-12-02T09:00', end: '2026-12-02T10:00', zone: 'Asia/Tokyo' }, HERE)).toMatchObject({ day: '2026-12-01', span: t.calendar.span('18:00', '19:00') })
    expect(meetingWhenOf({ start: '2026-12-01T05:30', end: '2026-12-01T06:30', zone: 'Europe/Lisbon' }, HERE).span).toBe(t.calendar.span('23:30', t.calendar.endsOn('00:30', '2026-12-01')))
  })
})

describe('the meeting sheet', () => {
  it('starts from the meeting, or from the Mac’s zone with nothing set', () => {
    expect(meetingFormOf(MEETING, HERE)).toEqual({ day: '2026-12-01', startTime: '15:00', endTime: '15:30', zone: 'Europe/Lisbon', link: 'https://zoom.us/j/1', attendees: 'Ana\nSam' })
    expect(meetingFormOf(NO_MEETING, HERE)).toEqual({ day: '', startTime: '', endTime: '', zone: HERE, link: '', attendees: '' })
  })

  it('fills the half hour from 9:00 when a day is picked with no times, and keeps times that are there', () => {
    expect(withDay(meetingFormOf(NO_MEETING, HERE), '2026-12-03')).toMatchObject({ day: '2026-12-03', startTime: '09:00', endTime: '09:30' })
    expect(withDay(form({ startTime: '14:00', endTime: '15:00' }), '2026-12-04')).toMatchObject({ day: '2026-12-04', startTime: '14:00', endTime: '15:00' })
    expect(withDay(form({ startTime: '', endTime: '' }), '')).toMatchObject({ day: '', startTime: '', endTime: '' })
  })

  it('takes attendees one per line or with commas', () => {
    expect(attendeesIn('Ana Lima\n\n  Sam ,Bo <bo@example.com>\n')).toEqual(['Ana Lima', 'Sam', 'Bo <bo@example.com>'])
  })

  it('reads a link pasted without https as a web address', () => {
    expect(linkIn(' zoom.us/j/123 ')).toBe('https://zoom.us/j/123')
    expect(linkIn('https://meet.google.com/x')).toBe('https://meet.google.com/x')
    expect(linkIn('')).toBe('')
  })

  it('needs nothing at all, and with no day it skips the times', () => {
    expect(validateMeeting(meetingFormOf(NO_MEETING, HERE))).toEqual({})
    expect(validateMeeting(form({ day: '', startTime: 'nonsense', zone: '' }))).toEqual({})
  })

  it('with a day, needs both times and a known zone, the end after the start', () => {
    expect(validateMeeting(form({ startTime: '', endTime: '' }))).toEqual({ startTime: c.startTimeRequired, endTime: c.endTimeRequired })
    expect(validateMeeting(form({ startTime: '9am' }))).toEqual({ startTime: c.timeBad })
    expect(validateMeeting(form({ day: '2026-02-30' }))).toEqual({ day: c.dayBad })
    expect(validateMeeting(form({ zone: '' }))).toEqual({ zone: c.zoneRequired })
    expect(validateMeeting(form({ zone: 'Mars/Olympus' }))).toEqual({ zone: c.zoneBad })
    expect(validateMeeting(form({ startTime: '10:00', endTime: '09:00' }))).toEqual({ endTime: c.endsFirst })
    expect(validateMeeting(form({ startTime: '10:00', endTime: '10:00' }))).toEqual({ endTime: c.endsFirst })
  })

  it('checks the link and the attendees', () => {
    expect(validateMeeting(form({ link: 'javascript:alert(1)' }))).toEqual({ link: f.linkBad })
    expect(validateMeeting(form({ link: 'https://' }))).toEqual({ link: f.linkBad })
    expect(validateMeeting(form({ link: 'teams.microsoft.com/l/x' }))).toEqual({})
    expect(validateMeeting(form({ attendees: 'x'.repeat(101) }))).toEqual({ attendees: f.attendeeLong })
    expect(validateMeeting(form({ attendees: Array.from({ length: 51 }, (_, i) => `P${i}`).join('\n') }))).toEqual({ attendees: f.tooManyAttendees })
    expect(validateMeeting(form({ attendees: [...Array.from({ length: 50 }, (_, i) => `P${i}`), 'p0'].join('\n') }))).toEqual({})
    expect(validateMeeting(form({ attendees: 'Ana <ana@example>' }))).toEqual({ attendees: f.emailBad })
    expect(validateMeeting(form({ attendees: 'ana@@example.com' }))).toEqual({ attendees: f.emailBad })
    expect(validateMeeting(form({ attendees: 'Ana Lima <ana@example.com>\nsam@example.org\nBo' }))).toEqual({})
  })

  it('makes the meeting the form describes', () => {
    expect(meetingOfForm(form({ link: 'zoom.us/j/9', attendees: 'Ana, ana\nSam', zone: 'europe/lisbon' }))).toEqual({ attendees: ['Ana', 'Sam'], link: 'https://zoom.us/j/9', time: { start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'Europe/Lisbon' } })
    expect(meetingOfForm(form({ day: '', link: '', attendees: '' }))).toEqual(NO_MEETING)
  })
})
