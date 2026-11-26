import type { CalendarEvent, CalendarWhen } from '../../../../../shared/calendar'
import { t } from '../../../../l10n/en'
import type { CalendarItem } from '../../domain/calendar_items'

export type ItemActions = { onEdit: (event: CalendarEvent) => void; onOpenQuest: (id: string) => void; onOpenNote: (id: string) => void }

const timeOf = (wall: string) => wall.slice(11, 16)

const whenOf = (item: Extract<CalendarItem, { kind: 'event' | 'meeting' }>): CalendarWhen => (item.kind === 'event' ? item.event.when : { kind: 'timed', ...item.time })

// When a timed event or meeting happens on the Mac's clock, and on its own when that's another zone's.
export const whenText = (item: Extract<CalendarItem, { kind: 'event' | 'meeting' }>, here: string): string => {
  const when = whenOf(item)
  if (when.kind === 'allDay' || item.start === null || item.end === null) return item.firstDay === item.lastDay ? t.calendar.allDay : `${t.calendar.allDay} · ${t.calendar.days(item.firstDay, item.lastDay)}`
  const end = item.end.slice(0, 10) === item.start.slice(0, 10) ? timeOf(item.end) : t.calendar.endsOn(timeOf(item.end), item.end.slice(0, 10))
  const own = when.zone === here ? '' : ` · ${t.calendar.inZone(timeOf(when.start), timeOf(when.end), when.zone)}`

  return `${t.calendar.span(timeOf(item.start), end)}${own}`
}

// One item as a small button: an event opens its sheet, a due date its quest.
export const ItemChip = ({ item, day, here, actions }: { item: CalendarItem; day: string; here: string; actions: ItemActions }) => {
  if (item.kind === 'due') {
    return (
      <button
        type="button"
        class={`cal-chip due ${item.state}${item.isOverdue ? ' overdue' : ''}`}
        aria-label={t.calendar.openQuest(item.title, item.isOverdue ? t.calendar.overdue : t.calendar.states[item.state])}
        onClick={() => actions.onOpenQuest(item.questId)}
      >
        <span class="cal-tag">{item.isOverdue ? t.calendar.overdue : t.calendar.due}</span>
        <span class="cal-name">{item.title}</span>
      </button>
    )
  }
  // A timed event shows its start on its first day only.
  const start = item.start !== null && item.start.slice(0, 10) === day ? timeOf(item.start) : null
  if (item.kind === 'meeting') {
    return (
      <button type="button" class="cal-chip event meeting" title={`${item.title} · ${whenText(item, here)}`} aria-label={t.meeting.openNote(item.title)} onClick={() => actions.onOpenNote(item.noteId)}>
        {start !== null && <span class="cal-time">{start}</span>}
        <span class="cal-name">{item.title}</span>
      </button>
    )
  }

  return (
    <button type="button" class={`cal-chip event${item.start === null ? ' all-day' : ''}`} title={`${item.event.title} · ${whenText(item, here)}`} aria-label={t.calendar.editEvent(item.event.title)} onClick={() => actions.onEdit(item.event)}>
      {start !== null && <span class="cal-time">{start}</span>}
      <span class="cal-name">{item.event.title}</span>
    </button>
  )
}
