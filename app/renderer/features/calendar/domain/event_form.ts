import { CALENDAR_LIMITS, isDay } from '../../../../shared/calendar'
import type { CalendarEvent, CalendarEventInput } from '../../../../shared/calendar'
import { instantOf, wallOf, zoneNameOf } from '../../../../shared/calendar_time'
import { t } from '../../../l10n/en'
import { titleError } from '../../quests/domain/quest_form'
import { addDays, daysFrom } from './calendar_days'

const HOUR_MS = 3_600_000
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

export type EventForm = { title: string; isAllDay: boolean; startDay: string; endDay: string; startTime: string; endTime: string; zone: string; place: string; notes: string }
export type EventField = 'title' | 'startDay' | 'endDay' | 'startTime' | 'endTime' | 'zone' | 'place' | 'notes'
export type EventErrors = Partial<Record<EventField, string>>
export const EVENT_FIELDS: readonly EventField[] = ['title', 'startDay', 'endDay', 'startTime', 'endTime', 'zone', 'place', 'notes']

// A new event on a day: an hour from the next whole hour when it's today,
// from 9:00 on any other day, in the Mac's zone.
export const newEventForm = (day: string, here: string, nowMs: number): EventForm => {
  const now = wallOf(nowMs, here)
  const startMs = now.slice(0, 10) === day ? instantOf(`${now.slice(0, 13)}:00`, here) + HOUR_MS : instantOf(`${day}T09:00`, here)
  const start = wallOf(startMs, here)
  const end = wallOf(startMs + HOUR_MS, here)

  return { title: '', isAllDay: false, startDay: start.slice(0, 10), endDay: end.slice(0, 10), startTime: start.slice(11), endTime: end.slice(11), zone: here, place: '', notes: '' }
}

// An event as the sheet edits it, on the clock of the zone it was made in.
export const formOf = (event: CalendarEvent, here: string): EventForm => {
  const base = { title: event.title, place: event.place ?? '', notes: event.notes ?? '' }
  const { when } = event
  if (when.kind === 'allDay') return { ...base, isAllDay: true, startDay: when.startDay, endDay: when.endDay, startTime: '09:00', endTime: '10:00', zone: here }

  return { ...base, isAllDay: false, startDay: when.start.slice(0, 10), endDay: when.end.slice(0, 10), startTime: when.start.slice(11), endTime: when.end.slice(11), zone: when.zone }
}

// Moving the start day moves the end with it, so the event keeps its length.
export const withStartDay = (form: EventForm, startDay: string): EventForm =>
  isDay(form.startDay) && isDay(startDay) && isDay(form.endDay) ? { ...form, startDay, endDay: addDays(form.endDay, daysFrom(form.startDay, startDay)) } : { ...form, startDay }

const dayError = (value: string, required: string): string | undefined => (value.trim() === '' ? required : isDay(value.trim()) ? undefined : t.calendar.form.dayBad)
const timeError = (value: string, required: string): string | undefined => (value.trim() === '' ? required : TIME.test(value.trim()) ? undefined : t.calendar.form.timeBad)

// What's wrong with the end once the start reads: before the start, or more than a year after.
const lengthError = (form: EventForm): Pick<EventErrors, 'endDay' | 'endTime'> => {
  if (form.isAllDay) {
    const span = daysFrom(form.startDay.trim(), form.endDay.trim())
    if (span < 0) return { endDay: t.calendar.form.endsFirst }

    return span >= CALENDAR_LIMITS.spanDays ? { endDay: t.calendar.form.tooLong } : {}
  }
  const zone = zoneNameOf(form.zone.trim())
  if (zone === null) return {}
  const length = instantOf(`${form.endDay.trim()}T${form.endTime.trim()}`, zone) - instantOf(`${form.startDay.trim()}T${form.startTime.trim()}`, zone)
  if (length <= 0) return { endTime: t.calendar.form.endsFirst }

  return length > CALENDAR_LIMITS.spanDays * 24 * HOUR_MS ? { endDay: t.calendar.form.tooLong } : {}
}

export const validateEvent = (form: EventForm): EventErrors => {
  const errors: EventErrors = {
    title: titleError(form.title),
    startDay: dayError(form.startDay, t.calendar.form.startDayRequired),
    endDay: dayError(form.endDay, t.calendar.form.endDayRequired),
    ...(form.isAllDay
      ? {}
      : {
          startTime: timeError(form.startTime, t.calendar.form.startTimeRequired),
          endTime: timeError(form.endTime, t.calendar.form.endTimeRequired),
          zone: form.zone.trim() === '' ? t.calendar.form.zoneRequired : zoneNameOf(form.zone.trim()) === null ? t.calendar.form.zoneBad : undefined,
        }),
    place: form.place.trim().length > CALENDAR_LIMITS.place ? t.calendar.form.placeLong : undefined,
    notes: form.notes.trim().length > CALENDAR_LIMITS.notes ? t.calendar.form.notesLong : undefined,
  }
  const readable = Object.entries(errors).every(([field, error]) => error === undefined || field === 'title' || field === 'place' || field === 'notes')
  const all = readable ? { ...errors, ...lengthError(form) } : errors

  return Object.fromEntries(Object.entries(all).filter(([, error]) => error !== undefined))
}

export const eventInputOf = (form: EventForm): CalendarEventInput => ({
  title: form.title.trim(),
  when: form.isAllDay
    ? { kind: 'allDay', startDay: form.startDay.trim(), endDay: form.endDay.trim() }
    : { kind: 'timed', start: `${form.startDay.trim()}T${form.startTime.trim()}`, end: `${form.endDay.trim()}T${form.endTime.trim()}`, zone: zoneNameOf(form.zone.trim()) ?? form.zone.trim() },
  place: form.place.trim() === '' ? null : form.place.trim(),
  notes: form.notes.trim() === '' ? null : form.notes.trim(),
})
