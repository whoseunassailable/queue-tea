import type { ProjectRecord, RealmTime, WorkPeriod } from '../../../../../types'
import { TIME } from '../constants/time'
import { dayKey, mergeMinutes } from './time'

// Copies before merging so reporting never changes the saved evidence.
export const mergePeriods = (periods: WorkPeriod[]): WorkPeriod[] => {
  const merged: WorkPeriod[] = []
  for (const period of [...periods].sort((a, b) => a.start - b.start)) {
    const last = merged.at(-1)
    if (last !== undefined && period.start <= last.end) last.end = Math.max(last.end, period.end)
    else merged.push({ ...period })
  }

  return merged
}

const minutesOf = (periods: WorkPeriod[]): number =>
  mergePeriods(periods).reduce((sum, period) => sum + (period.end - period.start) / TIME.minute, 0)

type Accrual = {
  onQuests: WorkPeriod[]
  elsewhere: WorkPeriod[]
  minutesOnQuests: Record<string, number>
  minutesElsewhere: Record<string, number>
  offsetMinutes: number
}

// Called inside the same record transaction as the existing minute counters.
export const recordRealmTime = (record: ProjectRecord, more: Accrual): ProjectRecord => {
  if (more.onQuests.length === 0 && more.elsewhere.length === 0) return record
  const previous = record.realmTime
  const days: RealmTime['days'] = { ...previous?.days }
  const offset = more.offsetMinutes * TIME.minute
  for (const kind of ['onQuests', 'elsewhere'] as const) {
    for (const period of more[kind]) {
      let start = period.start
      while (start < period.end) {
        const end = Math.min(period.end, (Math.floor((start + offset) / TIME.day) + 1) * TIME.day - offset)
        const day = dayKey(start, more.offsetMinutes)
        const saved = days[day] ?? { onQuests: [], elsewhere: [] }
        days[day] = { ...saved, [kind]: mergePeriods([...saved[kind], { start, end }]) }
        start = end
      }
    }
  }

  return {
    ...record,
    realmTime: {
      days,
      accountedOnQuests: mergeMinutes(previous?.accountedOnQuests ?? {}, more.minutesOnQuests),
      accountedElsewhere: mergeMinutes(previous?.accountedElsewhere ?? {}, more.minutesElsewhere),
    },
  }
}

type TimedRecord = Pick<ProjectRecord, 'tasks' | 'unassignedMinutesByDay' | 'realmTime'>
const rounded = (minutes: number) => Math.round(minutes * 100) / 100

export const realmDayTime = (record: TimedRecord, day: string): { onQuests: number; elsewhere: number } => {
  const rawOnQuests = record.tasks.reduce((sum, task) => sum + (task.minutesByDay[day] ?? 0), 0)
  const rawElsewhere = record.unassignedMinutesByDay[day] ?? 0
  const tracked = record.realmTime
  if (tracked === undefined) return { onQuests: rawOnQuests, elsewhere: rawElsewhere }
  const periods = tracked.days[day] ?? { onQuests: [], elsewhere: [] }
  const onQuests = minutesOf(periods.onQuests)
  const total = minutesOf([...periods.onQuests, ...periods.elsewhere])

  // Old or older-writer totals have no timing evidence; retain them as recorded.
  const earlierOnQuests = Math.max(0, rawOnQuests - (tracked.accountedOnQuests[day] ?? 0))
  const earlierElsewhere = Math.max(0, rawElsewhere - (tracked.accountedElsewhere[day] ?? 0))

  return {
    onQuests: rounded(earlierOnQuests + onQuests),
    elsewhere: rounded(earlierElsewhere + total - onQuests),
  }
}
