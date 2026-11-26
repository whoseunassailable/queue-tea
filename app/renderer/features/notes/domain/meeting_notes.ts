import { isDay } from '../../../../shared/calendar'
import { wallIn, zoneNameOf } from '../../../../shared/calendar_time'
import { attendeesOf, cleanAttendee, MEETING_LIMITS, meetingLinkOf, meetingTimeOf } from '../../../../shared/meetings'
import type { Meeting, MeetingTime } from '../../../../shared/meetings'
import { freeTitle, NOTE_LIMITS } from '../../../../shared/notes'
import type { Note, NoteInput } from '../../../../shared/notes'
import { t } from '../../../l10n/en'

// What a meeting note's body holds under the template's headings: the agenda
// and decisions as list items, the action items as checklist lines.
export type ActionItem = { text: string; isDone: boolean }
export type MeetingSections = { agenda: string[]; decisions: string[]; actions: ActionItem[] }
type Section = keyof MeetingSections

const HEADING = /^#{1,6}\s+(.+?)\s*#*\s*$/
const CHECK = /^\s*[-*+] \[([ xX])\] (.*)$/
const ITEM = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/
const FENCE = /^\s*(```|~~~)/

const sectionOf = (heading: string): Section | null => {
  const name = heading.replace(/[:：]\s*$/, '').trim().toLowerCase()
  const found = (Object.entries(t.meeting.sections) as [Section, readonly string[]][]).find(([, names]) => names.includes(name))

  return found?.[0] ?? null
}

// The agenda, decisions and action items, read from the headings that hold
// them. A heading of another name ends a section; lines in fenced code and
// empty items, as the template leaves them, aren't counted.
export const sectionsOf = (body: string): MeetingSections => {
  const sections: MeetingSections = { agenda: [], decisions: [], actions: [] }
  let at: Section | null = null
  let isCode = false
  for (const line of body.split('\n')) {
    if (FENCE.test(line)) isCode = !isCode
    if (isCode) continue
    const heading = HEADING.exec(line)
    if (heading !== null) {
      at = sectionOf(heading[1]!)
      continue
    }
    if (at === null) continue
    const check = CHECK.exec(line)
    if (at === 'actions') {
      if (check !== null && check[2]!.trim() !== '') sections.actions.push({ text: check[2]!.trim(), isDone: check[1] !== ' ' })
      continue
    }
    const item = (check?.[2] ?? ITEM.exec(line)?.[1] ?? '').trim()
    if (item !== '') sections[at].push(item)
  }

  return sections
}

// The next meeting in a series: same folder, attendees and call link, no time
// yet, and the action items still open on its agenda, with a link back.
export const followUpOf = (note: Pick<Note, 'title' | 'folder' | 'body' | 'meeting'>, notes: readonly Note[]): NoteInput => {
  const base = note.title.replace(/ follow-up(?: \d+)?$/, '')
  const title = freeTitle(notes, t.meeting.followUpTitle(base.slice(0, NOTE_LIMITS.title - t.meeting.followUpTitle('').length)))
  const open = sectionsOf(note.body).actions.filter(action => !action.isDone).map(action => action.text)

  return { title, folder: note.folder, type: 'meeting', body: t.meeting.followUpBody(note.title, open), meeting: { ...note.meeting, time: null } }
}

// When a meeting happens on the Mac's clock, and on its own when that's another zone's.
export const meetingWhenOf = (time: MeetingTime, here: string): { day: string; span: string; own: string | null } => {
  const start = wallIn(time.start, time.zone, here)
  const end = wallIn(time.end, time.zone, here)
  const endText = end.slice(0, 10) === start.slice(0, 10) ? end.slice(11) : t.calendar.endsOn(end.slice(11), end.slice(0, 10))

  return { day: start.slice(0, 10), span: t.calendar.span(start.slice(11), endText), own: time.zone === here ? null : t.calendar.inZone(time.start.slice(11), time.end.slice(11), time.zone) }
}

// The meeting sheet's fields, as typed.
export type MeetingForm = { day: string; startTime: string; endTime: string; zone: string; link: string; attendees: string }
export type MeetingField = keyof MeetingForm
export type MeetingErrors = Partial<Record<MeetingField, string>>
export const MEETING_FIELDS: readonly MeetingField[] = ['day', 'startTime', 'endTime', 'zone', 'link', 'attendees']

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
// Text on both sides of an @ makes an attendee an email, which has to be one.
const LOOKS_LIKE_EMAIL = /\S@\S/
const EMAIL = /(^|[\s<(])[^\s<>()@]+@[^\s<>()@]+\.[^\s<>()@]{2,}($|[\s>)])/

// A meeting with no time starts on the Mac's zone, ready for one.
export const meetingFormOf = (meeting: Meeting, here: string): MeetingForm => ({
  day: meeting.time?.start.slice(0, 10) ?? '',
  startTime: meeting.time?.start.slice(11) ?? '',
  endTime: meeting.time?.end.slice(11) ?? '',
  zone: meeting.time?.zone ?? here,
  link: meeting.link ?? '',
  attendees: meeting.attendees.join('\n'),
})

// Picking a day for a meeting with no times gives it the half hour from 9:00.
export const withDay = (form: MeetingForm, day: string): MeetingForm =>
  form.startTime === '' && form.endTime === '' && day !== '' ? { ...form, day, startTime: '09:00', endTime: '09:30' } : { ...form, day }

export const attendeesIn = (text: string): string[] => text.split(/[\n,]/).map(cleanAttendee).filter(name => name !== '')

// A link pasted without its scheme, as invites often show it, is a web address.
export const linkIn = (text: string): string => {
  const link = text.trim()

  return link === '' || /^[a-z][a-z0-9+.-]*:/i.test(link) ? link : `https://${link}`
}

const timeError = (value: string, required: string): string | undefined => (value.trim() === '' ? required : TIME.test(value.trim()) ? undefined : t.calendar.form.timeBad)

const whenErrors = (form: MeetingForm): MeetingErrors => {
  const day = form.day.trim()
  if (day === '') return {}
  const errors: MeetingErrors = {
    day: isDay(day) ? undefined : t.calendar.form.dayBad,
    startTime: timeError(form.startTime, t.calendar.form.startTimeRequired),
    endTime: timeError(form.endTime, t.calendar.form.endTimeRequired),
    zone: form.zone.trim() === '' ? t.calendar.form.zoneRequired : zoneNameOf(form.zone.trim()) === null ? t.calendar.form.zoneBad : undefined,
  }
  if (Object.values(errors).some(error => error !== undefined)) return errors

  return meetingTimeOf(`${day}T${form.startTime.trim()}`, `${day}T${form.endTime.trim()}`, form.zone.trim()) === null ? { endTime: t.calendar.form.endsFirst } : {}
}

const attendeesError = (text: string): string | undefined => {
  const names = attendeesIn(text)
  if (names.some(name => name.length > MEETING_LIMITS.attendee)) return t.meeting.form.attendeeLong
  // Repeats are dropped on save, so only different names count.
  if (new Set(names.map(name => name.toLowerCase())).size > MEETING_LIMITS.attendees) return t.meeting.form.tooManyAttendees

  return names.some(name => LOOKS_LIKE_EMAIL.test(name) && !EMAIL.test(name)) ? t.meeting.form.emailBad : undefined
}

export const validateMeeting = (form: MeetingForm): MeetingErrors => {
  const errors: MeetingErrors = {
    ...whenErrors(form),
    link: form.link.trim() === '' || meetingLinkOf(linkIn(form.link)) !== null ? undefined : t.meeting.form.linkBad,
    attendees: attendeesError(form.attendees),
  }

  return Object.fromEntries(Object.entries(errors).filter(([, error]) => error !== undefined))
}

// The meeting a checked form describes.
export const meetingOfForm = (form: MeetingForm): Meeting => {
  const day = form.day.trim()

  return {
    attendees: attendeesOf(attendeesIn(form.attendees)),
    link: meetingLinkOf(linkIn(form.link)),
    time: day === '' ? null : meetingTimeOf(`${day}T${form.startTime.trim()}`, `${day}T${form.endTime.trim()}`, form.zone.trim()),
  }
}
