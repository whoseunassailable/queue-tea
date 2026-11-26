import { callKindOf } from '../../../../../shared/meetings'
import { t } from '../../../../l10n/en'
import { addDays, AGENDA_DAYS } from '../../domain/calendar_days'
import { itemsOn } from '../../domain/calendar_items'
import type { CalendarItem } from '../../domain/calendar_items'
import { ItemChip, sourceName, whenText } from './calendar_item'
import type { ItemActions } from './calendar_item'

type Props = { anchor: string; today: string; here: string; items: CalendarItem[]; actions: ItemActions }

const Line = ({ item, day, here, actions }: { item: CalendarItem; day: string; here: string; actions: ItemActions }) => (
  <li class="cal-line">
    <span class="cal-when">{item.kind === 'due' ? t.calendar.states[item.state] : whenText(item, here)}</span>
    <ItemChip item={item} day={day} here={here} actions={actions} />
    {item.kind === 'event' && (item.event.place !== null || item.event.source !== undefined) && (
      <span class="sub">{[item.event.place, item.event.source === undefined ? null : t.calendar.fromTag(sourceName(item.event.source))].filter(part => part !== null).join(' · ')}</span>
    )}
    {item.kind === 'meeting' && <span class="sub">{item.link === null ? t.meeting.calendarTag : `${t.meeting.calendarTag} · ${t.meeting.calls[callKindOf(item.link)]}`}</span>}
  </li>
)

// Four weeks, day by day, with only the days that hold something. When the
// weeks include today, quests already past their due date come first.
export const AgendaView = ({ anchor, today, here, items, actions }: Props) => {
  const last = addDays(anchor, AGENDA_DAYS - 1)
  const overdue = anchor <= today && today <= last ? items.filter(item => item.kind === 'due' && item.isOverdue && item.day < anchor) : []
  const days = Array.from({ length: AGENDA_DAYS }, (_, i) => addDays(anchor, i))
    .map(day => ({ day, on: itemsOn(items, day) }))
    .filter(({ on }) => on.length > 0)

  if (overdue.length === 0 && days.length === 0) return <p class="panel panel-pad hint cal-none">{t.calendar.emptyRange}</p>

  return (
    <div class="cal-agenda panel panel-pad">
      {overdue.length > 0 && (
        <section aria-labelledby="cal-overdue">
          <h2 id="cal-overdue" class="cal-agenda-day overdue">
            {t.calendar.overdueGroup}
          </h2>
          <ul class="cal-lines">
            {overdue.map(item => (
              <Line key={item.key} item={item} day={today} here={here} actions={actions} />
            ))}
          </ul>
        </section>
      )}
      {days.map(({ day, on }) => (
        <section key={day} aria-labelledby={`cal-${day}`}>
          <h2 id={`cal-${day}`} class={`cal-agenda-day${day === today ? ' today' : ''}`}>
            {t.calendar.dayName(day)}
            {day === today && <span class="sub"> · {t.calendar.today}</span>}
          </h2>
          <ul class="cal-lines">
            {on.map(item => (
              <Line key={item.key} item={item} day={day} here={here} actions={actions} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
