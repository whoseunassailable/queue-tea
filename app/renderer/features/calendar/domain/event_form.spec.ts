import { describe, expect, it } from 'vitest'

import { t } from '../../../l10n/en'
import { eventInputOf, formOf, newEventForm, validateEvent, withStartDay } from './event_form'
import type { EventForm } from './event_form'

const HERE = 'America/Chicago'
const FORM: EventForm = { title: 'Call', isAllDay: false, startDay: '2026-12-01', endDay: '2026-12-01', startTime: '09:00', endTime: '10:00', zone: HERE, place: '', notes: '' }

describe('a new event', () => {
  it('starts at the next whole hour today, for an hour', () => {
    const at = Date.parse('2026-11-25T19:44:00Z') // 13:44 in Chicago

    expect(newEventForm('2026-11-25', HERE, at)).toMatchObject({ startDay: '2026-11-25', startTime: '14:00', endDay: '2026-11-25', endTime: '15:00', zone: HERE, isAllDay: false })
  })

  it('runs past midnight when it starts at 23:00', () => {
    const at = Date.parse('2026-11-26T04:10:00Z') // 22:10 in Chicago

    expect(newEventForm('2026-11-25', HERE, at)).toMatchObject({ startDay: '2026-11-25', startTime: '23:00', endDay: '2026-11-26', endTime: '00:00' })
  })

  it('starts at 9:00 on any other day', () => {
    expect(newEventForm('2026-12-03', HERE, Date.parse('2026-11-25T19:44:00Z'))).toMatchObject({ startDay: '2026-12-03', startTime: '09:00', endTime: '10:00' })
  })
})

describe('the sheet’s checks', () => {
  it('takes a whole timed event', () => {
    expect(validateEvent(FORM)).toEqual({})
  })

  it('says which field is missing, by name', () => {
    expect(validateEvent({ ...FORM, title: ' ', startDay: '', endDay: '', startTime: '', endTime: '', zone: '' })).toEqual({
      title: t.form.titleRequired,
      startDay: t.calendar.form.startDayRequired,
      endDay: t.calendar.form.endDayRequired,
      startTime: t.calendar.form.startTimeRequired,
      endTime: t.calendar.form.endTimeRequired,
      zone: t.calendar.form.zoneRequired,
    })
  })

  it("says how to fix a day, a time or a zone it can't read", () => {
    expect(validateEvent({ ...FORM, startDay: '2026-02-30', startTime: '9am', zone: 'Chicago' })).toEqual({ startDay: t.calendar.form.dayBad, startTime: t.calendar.form.timeBad, zone: t.calendar.form.zoneBad })
  })

  it('needs no times or zone for an all-day event', () => {
    expect(validateEvent({ ...FORM, isAllDay: true, startTime: '', endTime: '', zone: '' })).toEqual({})
  })

  it('puts an end before the start on the end', () => {
    expect(validateEvent({ ...FORM, endTime: '08:30' })).toEqual({ endTime: t.calendar.form.endsFirst })
    expect(validateEvent({ ...FORM, isAllDay: true, endDay: '2026-11-30' })).toEqual({ endDay: t.calendar.form.endsFirst })
  })

  it('judges the end in the event’s own zone', () => {
    // 09:00 to 09:30 the same morning is fine on any one clock.
    expect(validateEvent({ ...FORM, zone: 'Asia/Tokyo', endTime: '09:30' })).toEqual({})
  })

  it('holds an event to a year', () => {
    expect(validateEvent({ ...FORM, isAllDay: true, startDay: '2026-01-01', endDay: '2027-01-02' })).toEqual({ endDay: t.calendar.form.tooLong })
  })

  it('keeps place and notes to their lengths', () => {
    expect(validateEvent({ ...FORM, place: 'x'.repeat(201), notes: 'x'.repeat(5001) })).toEqual({ place: t.calendar.form.placeLong, notes: t.calendar.form.notesLong })
  })
})

describe('what the sheet sends and shows', () => {
  it('sends a timed event in its zone, by the zone’s own name, without empty text', () => {
    expect(eventInputOf({ ...FORM, title: ' Call ', zone: 'europe/lisbon', place: '  ', notes: ' Agenda ' })).toEqual({
      title: 'Call',
      when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: 'Europe/Lisbon' },
      place: null,
      notes: 'Agenda',
    })
  })

  it('sends an all-day event as its days', () => {
    expect(eventInputOf({ ...FORM, isAllDay: true, endDay: '2026-12-02' }).when).toEqual({ kind: 'allDay', startDay: '2026-12-01', endDay: '2026-12-02' })
  })

  it('opens an event on its own zone’s clock, and reads back what it sent', () => {
    const event = { id: 'e-1', ...eventInputOf({ ...FORM, zone: 'Europe/Lisbon', place: 'Zoom' }) }

    expect(formOf(event, HERE)).toEqual({ ...FORM, zone: 'Europe/Lisbon', place: 'Zoom' })
    expect(eventInputOf(formOf(event, HERE))).toEqual(eventInputOf({ ...FORM, zone: 'Europe/Lisbon', place: 'Zoom' }))
  })

  it('moves the end with the start, so the event keeps its length', () => {
    expect(withStartDay({ ...FORM, endDay: '2026-12-03' }, '2026-12-05')).toMatchObject({ startDay: '2026-12-05', endDay: '2026-12-07' })
    expect(withStartDay(FORM, '')).toMatchObject({ startDay: '', endDay: '2026-12-01' })
  })
})
