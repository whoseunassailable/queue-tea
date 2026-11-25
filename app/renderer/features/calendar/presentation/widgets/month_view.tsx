import { CALENDAR_MONTH_ITEMS } from '../../../../core/constants/constants'
import { t } from '../../../../l10n/en'
import { monthWeeksOf } from '../../domain/calendar_days'
import { itemsOn } from '../../domain/calendar_items'
import type { CalendarItem } from '../../domain/calendar_items'
import { ItemChip } from './calendar_item'
import type { ItemActions } from './calendar_item'

type Props = { anchor: string; today: string; here: string; items: CalendarItem[]; actions: ItemActions; onAdd: (day: string) => void; onMore: (day: string) => void }

// The month's weeks, Monday first. A day shows its first few items; the rest
// wait in the agenda, one press away.
export const MonthView = ({ anchor, today, here, items, actions, onAdd, onMore }: Props) => {
  const month = anchor.slice(0, 7)

  return (
    <div class="cal-month panel" role="grid" aria-label={t.calendar.monthTitle(anchor)}>
      <div class="cal-row cal-head" role="row">
        {t.calendar.weekdays.map(name => (
          <span key={name} class="cal-weekday" role="columnheader">
            {name}
          </span>
        ))}
      </div>
      {monthWeeksOf(anchor).map(week => (
        <div key={week[0]} class="cal-row" role="row">
          {week.map(day => {
            const on = itemsOn(items, day)
            const shown = on.length > CALENDAR_MONTH_ITEMS ? on.slice(0, CALENDAR_MONTH_ITEMS - 1) : on
            const hidden = on.length - shown.length

            return (
              <div key={day} role="gridcell" class={`cal-day${day.slice(0, 7) === month ? '' : ' out'}${day === today ? ' today' : ''}`} aria-current={day === today ? 'date' : undefined}>
                <button type="button" class="cal-date" aria-label={t.calendar.addOn(day)} onClick={() => onAdd(day)}>
                  {Number(day.slice(8, 10))}
                </button>
                {shown.map(item => (
                  <ItemChip key={item.key} item={item} day={day} here={here} actions={actions} />
                ))}
                {hidden > 0 && (
                  <button type="button" class="cal-more" aria-label={t.calendar.moreOn(hidden, day)} onClick={() => onMore(day)}>
                    {t.calendar.more(hidden)}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
