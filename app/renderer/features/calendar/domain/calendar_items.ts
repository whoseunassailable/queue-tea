import type { CalendarEvent } from '../../../../shared/calendar'
import { wallIn } from '../../../../shared/calendar_time'
import type { ProjectView, QuestRow } from '../../../../shared/engine_api'
import type { MeetingTime } from '../../../../shared/meetings'
import type { Note } from '../../../../shared/notes'
import { addDays, daysFrom } from './calendar_days'

type Realm = Extract<ProjectView, { kind: 'readable' }>

// A quest with a due date is still in play: on the board, sealed, or active.
// Finished quests leave the calendar with their due date.
export type DueState = 'waiting' | 'sealed' | 'active'

// What a view draws. A timed event's start and end are wall times on the
// Mac's clock; firstDay and lastDay are the days it touches there. A meeting
// is a Meeting note with a time, which opens the note; time is on its own clock.
export type CalendarItem =
  | { kind: 'event'; key: string; event: CalendarEvent; firstDay: string; lastDay: string; start: string | null; end: string | null }
  | { kind: 'due'; key: string; questId: string; title: string; state: DueState; day: string; isOverdue: boolean }
  | { kind: 'meeting'; key: string; noteId: string; title: string; time: MeetingTime; link: string | null; firstDay: string; lastDay: string; start: string; end: string }

const MINUTES_IN_DAY = 24 * 60

export const eventItemOf = (event: CalendarEvent, here: string): CalendarItem => {
  const { when } = event
  if (when.kind === 'allDay') return { kind: 'event', key: event.id, event, firstDay: when.startDay, lastDay: when.endDay, start: null, end: null }
  const start = wallIn(when.start, when.zone, here)
  const end = wallIn(when.end, when.zone, here)
  const firstDay = start.slice(0, 10)
  // An event that ends at midnight is over before the next day starts.
  const endDay = end.slice(11) === '00:00' ? addDays(end.slice(0, 10), -1) : end.slice(0, 10)

  return { kind: 'event', key: event.id, event, firstDay, lastDay: endDay < firstDay ? firstDay : endDay, start, end }
}

const questsOf = (realm: Realm): { quest: Pick<QuestRow, 'id' | 'title' | 'due'>; state: DueState }[] => [
  ...realm.activeQuests.map(quest => ({ quest, state: 'active' as const })),
  ...[...realm.ready, ...realm.sealed].flatMap(entry => [entry.quest, ...(entry.kind === 'saga' ? entry.chapters : [])]).map(quest => ({ quest, state: quest.sealedBecause === null ? ('waiting' as const) : ('sealed' as const) })),
]

export const dueItemsOf = (realm: Realm, today: string): CalendarItem[] => {
  const seen = new Set<string>()

  return questsOf(realm).flatMap(({ quest, state }) => {
    if (quest.due === null || seen.has(quest.id)) return []
    seen.add(quest.id)

    return [{ kind: 'due' as const, key: `due-${quest.id}`, questId: quest.id, title: quest.title, state, day: quest.due, isOverdue: quest.due < today }]
  })
}

// The realm's live Meeting notes that have a time, on the Mac's clock.
export const meetingItemsOf = (notes: readonly Note[], here: string): CalendarItem[] =>
  notes.flatMap(note => {
    const { time } = note.meeting
    if (note.isArchived || note.type !== 'meeting' || time === null) return []
    const start = wallIn(time.start, time.zone, here)
    const end = wallIn(time.end, time.zone, here)
    const firstDay = start.slice(0, 10)
    const endDay = end.slice(11) === '00:00' ? addDays(end.slice(0, 10), -1) : end.slice(0, 10)

    return [{ kind: 'meeting' as const, key: `meeting-${note.id}`, noteId: note.id, title: note.title, time, link: note.meeting.link, firstDay, lastDay: endDay < firstDay ? firstDay : endDay, start, end }]
  })

export const itemsOf = (events: CalendarEvent[], realm: Realm, here: string, today: string, notes: readonly Note[] = []): CalendarItem[] => [
  ...events.map(event => eventItemOf(event, here)),
  ...dueItemsOf(realm, today),
  ...meetingItemsOf(notes, here),
]

export const firstDayOf = (item: CalendarItem): string => (item.kind === 'due' ? item.day : item.firstDay)
const lastDayOf = (item: CalendarItem): string => (item.kind === 'due' ? item.day : item.lastDay)
export type TimedItem = Extract<CalendarItem, { kind: 'event' | 'meeting' }> & { start: string; end: string }
export const isTimed = (item: CalendarItem): item is TimedItem => (item.kind === 'event' && item.start !== null) || item.kind === 'meeting'

// All-day events first, then due dates, then the timed ones by when they start.
const rank = (item: CalendarItem) => (item.kind === 'due' ? 1 : item.start === null ? 0 : 2)
const titleOf = (item: CalendarItem) => (item.kind === 'event' ? item.event.title : item.title)
const startOf = (item: CalendarItem) => (item.kind === 'due' ? item.day : (item.start ?? item.firstDay))
const compare = (a: CalendarItem, b: CalendarItem) => rank(a) - rank(b) || (a.kind !== 'due' && b.kind !== 'due' ? startOf(a).localeCompare(startOf(b)) : 0) || titleOf(a).localeCompare(titleOf(b))

export const itemsOn = (items: CalendarItem[], day: string): CalendarItem[] => items.filter(item => firstDayOf(item) <= day && day <= lastDayOf(item)).sort(compare)

export const touches = (item: CalendarItem, first: string, last: string): boolean => firstDayOf(item) <= last && lastDayOf(item) >= first

// Where a timed event sits on one day of the week grid, in minutes from
// midnight. A part on another day is cut at the day's edges.
export const minutesOn = (item: { start: string; end: string }, day: string): { from: number; to: number } => {
  const at = (wall: string) => daysFrom(day, wall.slice(0, 10)) * MINUTES_IN_DAY + Number(wall.slice(11, 13)) * 60 + Number(wall.slice(14, 16))

  return { from: Math.max(0, at(item.start)), to: Math.min(MINUTES_IN_DAY, at(item.end)) }
}

// Side by side where they overlap: each event gets a lane, and every event in
// a run of overlapping ones knows how many lanes the run has.
export type Placed<T> = { item: T; from: number; to: number; lane: number; lanes: number }
// The shortest a block is drawn, so a five-minute call can still be read.
const SHORTEST = 20

export const lanesOf = <T>(spans: { item: T; from: number; to: number }[]): Placed<T>[] => {
  const sorted = [...spans].sort((a, b) => a.from - b.from || b.to - a.to)
  const placed: Placed<T>[] = []
  let run: Placed<T>[] = []
  let runEnd = -1
  const close = () => {
    const lanes = Math.max(1, ...run.map(p => p.lane + 1))
    for (const p of run) p.lanes = lanes
    run = []
  }
  for (const span of sorted) {
    const to = Math.max(span.to, span.from + SHORTEST)
    if (span.from >= runEnd) {
      close()
      runEnd = -1
    }
    const free = [...Array(run.length + 1).keys()].find(lane => run.every(p => p.lane !== lane || p.to <= span.from))!
    const one = { item: span.item, from: span.from, to, lane: free, lanes: 1 }
    run.push(one)
    placed.push(one)
    runEnd = Math.max(runEnd, to)
  }
  close()

  return placed
}
