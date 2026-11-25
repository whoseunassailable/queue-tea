import { useLayoutEffect, useRef } from 'preact/hooks'

import { CALENDAR_HOUR_PX, CALENDAR_OPEN_HOUR } from '../../../../core/constants/constants'
import { t } from '../../../../l10n/en'
import { weekOf } from '../../domain/calendar_days'
import { isTimed, itemsOn, lanesOf, minutesOn } from '../../domain/calendar_items'
import type { CalendarItem } from '../../domain/calendar_items'
import { ItemChip } from './calendar_item'
import type { ItemActions } from './calendar_item'

type Props = { anchor: string; today: string; now: string; here: string; items: CalendarItem[]; actions: ItemActions; onAdd: (day: string) => void }

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const px = (minutes: number) => (minutes / 60) * CALENDAR_HOUR_PX

// Seven days of hours. All-day events and due dates sit in a row above; timed
// events sit at their hours on the Mac's clock, side by side where they overlap.
export const WeekView = ({ anchor, today, now, here, items, actions, onAdd }: Props) => {
  const scroller = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (scroller.current !== null) scroller.current.scrollTop = CALENDAR_OPEN_HOUR * CALENDAR_HOUR_PX
  }, [])
  const days = weekOf(anchor)
  const nowMinutes = Number(now.slice(11, 13)) * 60 + Number(now.slice(14, 16))

  return (
    <div class="cal-week panel">
      <div class="cal-week-head">
        <span class="cal-gutter" />
        {days.map(day => (
          <button key={day} type="button" class={`cal-week-day${day === today ? ' today' : ''}`} aria-current={day === today ? 'date' : undefined} aria-label={t.calendar.addOn(day)} onClick={() => onAdd(day)}>
            {t.calendar.dayName(day)}
          </button>
        ))}
      </div>
      <div class="cal-week-all" role="group" aria-label={t.calendar.allDayRow}>
        <span class="cal-gutter">{t.calendar.allDay}</span>
        {days.map(day => (
          <div key={day} class="cal-week-cell">
            {itemsOn(items, day)
              .filter(item => !isTimed(item))
              .map(item => (
                <ItemChip key={item.key} item={item} day={day} here={here} actions={actions} />
              ))}
          </div>
        ))}
      </div>
      <div class="cal-week-scroll" ref={scroller}>
        <div class="cal-week-grid" style={{ height: `${px(24 * 60)}px` }}>
          <div class="cal-gutter cal-hours">
            {HOURS.map(hour => (
              <span key={hour} class="cal-hour" style={{ top: `${px(hour * 60)}px` }}>
                {hour === 0 ? '' : `${String(hour).padStart(2, '0')}:00`}
              </span>
            ))}
          </div>
          {days.map(day => {
            const placed = lanesOf(
              itemsOn(items, day)
                .filter(isTimed)
                .map(item => ({ item, ...minutesOn(item, day) })),
            )

            return (
              <div key={day} class={`cal-week-col${day === today ? ' today' : ''}`} role="group" aria-label={t.calendar.dayName(day)}>
                {placed.map(({ item, from, to, lane, lanes }) => (
                  <div key={item.key} class="cal-block" style={{ top: `${px(from)}px`, height: `${px(to - from)}px`, left: `${(lane / lanes) * 100}%`, width: `${100 / lanes}%` }}>
                    <ItemChip item={item} day={day} here={here} actions={actions} />
                  </div>
                ))}
                {day === today && <span class="cal-now" style={{ top: `${px(nowMinutes)}px` }} title={t.calendar.now} aria-hidden="true" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
