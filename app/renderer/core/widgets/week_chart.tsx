import type { DayTime } from '../../../shared/engine_api'
import { dayName, formatMinutes, weekdayOf } from '../domain/format'
import { t } from '../../l10n/en'

const BAR_PX = { full: 140, mini: 90 } as const

const dayTotal = (day: DayTime): number => day.onQuests + day.elsewhere

const Column = ({ day, most, size }: { day: DayTime; most: number; size: keyof typeof BAR_PX }) => {
  const height = (minutes: number) => `${(minutes / most) * BAR_PX[size]}px`

  return (
    <span class="col">
      {day.elsewhere > 0 && <span class="seg-out" style={{ height: height(day.elsewhere) }} />}
      {day.onQuests > 0 && <span class="seg-in" style={{ height: height(day.onQuests) }} />}
    </span>
  )
}

const totalText = (day: DayTime): string => (dayTotal(day) === 0 ? '—' : formatMinutes(dayTotal(day)))

// The busiest day is full height. An empty week has nothing to measure against,
// and its bars simply aren't drawn.
const mostOf = (days: DayTime[]): number => Math.max(1, ...days.map(dayTotal))

export const Legend = () => (
  <div class="legend">
    <span>
      <i class="in" />
      {t.chronicle.onQuests}
    </span>
    <span>
      <i class="out" />
      {t.chronicle.elsewhere}
    </span>
  </div>
)

type WeekProps = { days: DayTime[]; picked: string | null; label: string; onPick: (day: string) => void }

export const WeekChart = ({ days, picked, label, onPick }: WeekProps) => {
  const most = mostOf(days)

  return (
    <div class="chart" role="group" aria-label={label}>
      {days.map(day => (
        <button key={day.day} type="button" class={day.day === picked ? 'day sel' : 'day'} aria-label={`${dayName(day.day)}: ${totalText(day)}`} aria-pressed={day.day === picked} onClick={() => onPick(day.day)}>
          <Column day={day} most={most} size="full" />
          <span class="day-lbl">{dayName(day.day)}</span>
          <span class="day-total">{totalText(day)}</span>
        </button>
      ))}
    </div>
  )
}

export const MiniChart = ({ days }: { days: DayTime[] }) => {
  const most = mostOf(days)

  return (
    <div class="mini-chart">
      {days.map(day => (
        <div key={day.day} class="day">
          <Column day={day} most={most} size="mini" />
          <span class="day-lbl">{weekdayOf(day.day)}</span>
          <span class="day-total">{totalText(day)}</span>
        </div>
      ))}
    </div>
  )
}
