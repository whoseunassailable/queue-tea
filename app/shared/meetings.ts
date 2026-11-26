// A meeting note: a note typed Meeting, with the facts that need checking kept
// in its front matter: who comes, the call's link, and when it happens.
// The agenda, decisions and action items are sections of its Markdown body.
// docs/meetings.md has the format and the rules.
import { isWallTime } from './calendar'
import { instantOf, zoneNameOf } from './calendar_time'

// start and end are wall times on the clock of zone, as a calendar event's are:
// a 15:00 call in Lisbon stays 15:00 in Lisbon when the Mac moves.
export type MeetingTime = { start: string; end: string; zone: string }
export type Meeting = { attendees: string[]; link: string | null; time: MeetingTime | null }
export const NO_MEETING: Meeting = { attendees: [], link: null, time: null }

export const MEETING_LIMITS = { attendees: 50, attendee: 100, link: 2048, hours: 24 } as const

// The front matter keys, one value each, so Obsidian shows every one as a
// property: attendees as a list and the times as dates and times.
export const MEETING_KEYS = { attendees: 'attendees', link: 'meeting-link', start: 'meeting-start', end: 'meeting-end', zone: 'meeting-zone' } as const

// Which call a link opens, by its host. Any other web link is a plain call link.
export const CALL_KINDS = ['meet', 'zoom', 'teams', 'web'] as const
export type CallKind = (typeof CALL_KINDS)[number]

const isUnder = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

const urlOf = (value: string): URL | null => {
  try {
    return new URL(value)
  } catch {
    // Not a URL at all: the caller treats it as no link.
    return null
  }
}

// A link a meeting can hold: a web address with a host. The window and main
// both check with this, so they agree on what saves.
export const meetingLinkOf = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const link = value.trim()
  if (link === '' || link.length > MEETING_LIMITS.link) return null
  const url = urlOf(link)

  return url !== null && (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname !== '' ? link : null
}

export const callKindOf = (link: string): CallKind => {
  const host = urlOf(link)?.hostname.toLowerCase() ?? ''
  if (host === 'meet.google.com') return 'meet'
  if (isUnder(host, 'zoom.us') || isUnder(host, 'zoom.com') || isUnder(host, 'zoomgov.com')) return 'zoom'
  if (isUnder(host, 'teams.microsoft.com') || isUnder(host, 'teams.live.com')) return 'teams'

  return 'web'
}

// When a meeting happens, if its three parts read: two wall times in a zone
// this computer knows, the end after the start and within a day of it.
export const meetingTimeOf = (start: unknown, end: unknown, zone: unknown): MeetingTime | null => {
  const named = zoneNameOf(zone)
  if (!isWallTime(start) || !isWallTime(end) || named === null) return null
  const length = instantOf(end, named) - instantOf(start, named)

  return length > 0 && length <= MEETING_LIMITS.hours * 3_600_000 ? { start, end, zone: named } : null
}

// An attendee is a name, an email or both, on one line.
export const cleanAttendee = (value: string): string => value.replace(/\s+/g, ' ').trim()

// The attendees as a file or another app may have written them: a list, or
// one line with commas. Empty names go, repeats go, and each is cut to size.
export const attendeesOf = (value: unknown): string[] => {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  const names = raw.filter((name): name is string => typeof name === 'string').map(name => cleanAttendee(name).slice(0, MEETING_LIMITS.attendee)).filter(name => name !== '')

  return names.filter((name, i) => names.findIndex(other => other.toLowerCase() === name.toLowerCase()) === i).slice(0, MEETING_LIMITS.attendees)
}

export const hasMeeting = (meeting: Meeting): boolean => meeting.attendees.length > 0 || meeting.link !== null || meeting.time !== null

export const sameMeeting = (a: Meeting, b: Meeting): boolean =>
  a.link === b.link && a.attendees.join('\n') === b.attendees.join('\n') && a.time?.start === b.time?.start && a.time?.end === b.time?.end && a.time?.zone === b.time?.zone
