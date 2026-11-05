import type { ProjectRecord, Task } from '../../../../../types'
import type { SessionFile } from '../../../../../hooks/shared/sessions/domain/entities/session_file'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import { doneThisWeek, weekOf } from '../../../../../hooks/shared/time/domain/services/week_stats'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import type { ManaActive, ManaAllowance, ManaWeek } from '../../../../shared/engine_api'
import { dayBefore, dayTimeOf, totalOf } from '../../chronicle/domain/chronicle'

const minutesIn = (task: Task, days: string[]): number => days.reduce((sum, d) => sum + (task.minutesByDay[d] ?? 0), 0)

const activeOf = (task: Task): ManaActive => ({
  title: task.title,
  isBoss: task.priority === 'urgent',
  minutes: Object.values(task.minutesByDay).reduce((sum, m) => sum + m, 0),
  understandingMessages: task.effort.understandingMessages,
  improvingMessages: task.effort.improvingMessages,
  filesRead: task.effort.filesRead,
  filesChanged: task.effort.filesChanged,
})

export const manaOf = (record: ProjectRecord, today: string): ManaWeek => {
  const week = weekOf(today)
  const lastWeek = weekOf(dayBefore(week[0]!))
  const days = week.map(day => dayTimeOf([record], day))
  const current = currentTask(record.tasks)

  return {
    today: dayTimeOf([record], today),
    days,
    weekMinutes: totalOf(days),
    lastWeekMinutes: totalOf(lastWeek.map(day => dayTimeOf([record], day))),
    victories: doneThisWeek(record.tasks, today).length,
    inProgress: record.tasks.filter(t => t.state === 'current').length,
    active: current === null ? null : activeOf(current),
    byQuest: record.tasks
      .map(task => ({ title: task.title, minutes: minutesIn(task, week) }))
      .filter(row => row.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes),
    elsewhere: days.reduce((sum, d) => sum + d.elsewhere, 0),
  }
}

// The newest word on the allowance: a live session's, or the last one seen.
export const allowanceOf = (sessions: SessionFile[], nowMs: number): ManaAllowance | null => {
  const newest = sessions.filter(s => s.allowance !== null).sort((a, b) => b.heartbeat - a.heartbeat)[0]
  if (newest?.allowance == null) return null

  return { ...newest.allowance, seenAt: newest.heartbeat, isStale: !isFresh(newest, nowMs) }
}
