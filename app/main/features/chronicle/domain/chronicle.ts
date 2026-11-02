import type { Difficulty, ProjectRecord, Task } from '../../../../../types'
import { dayKey } from '../../../../../hooks/shared/time/domain/services/time'
import { finishedTasks, weekOf } from '../../../../../hooks/shared/time/domain/services/week_stats'
import type { ChronicleWeek, DayTime, VictoryLine } from '../../../../shared/engine_api'
import { xpOf } from '../../game/domain/services/game'

const RANK: Record<Difficulty, number> = { light: 0, medium: 1, hard: 2 }
const DAY_MS = 86_400_000

// The day before, by the calendar: the text holds no time zone to get wrong.
export const dayBefore = (day: string): string => dayKey(Date.parse(`${day}T00:00:00Z`) - DAY_MS, 0)

const minutesOf = (task: Task): number => Object.values(task.minutesByDay).reduce((sum, m) => sum + m, 0)

export const dayTimeOf = (records: ProjectRecord[], day: string): DayTime => ({
  day,
  onQuests: records.reduce((sum, r) => sum + r.tasks.reduce((all, t) => all + (t.minutesByDay[day] ?? 0), 0), 0),
  elsewhere: records.reduce((sum, r) => sum + (r.unassignedMinutesByDay[day] ?? 0), 0),
})

export const totalOf = (days: DayTime[]): number => days.reduce((sum, d) => sum + d.onQuests + d.elsewhere, 0)

const lineOf = (record: ProjectRecord, task: Task): VictoryLine => {
  const actual = task.difficulty.actual ?? task.difficulty.expected

  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    realm: record.project.name,
    realmPath: record.project.path,
    started: task.started,
    finished: task.finished!,
    minutes: minutesOf(task),
    expected: task.difficulty.expected,
    actual,
    xp: xpOf(actual),
    improvingMessages: task.effort.improvingMessages,
    filesRead: task.effort.filesRead,
    filesChanged: task.effort.filesChanged,
    linesAdded: task.effort.linesAdded,
    linesRemoved: task.effort.linesRemoved,
    filesTouched: task.effort.filesTouched,
    branch: task.branch,
    startCommit: task.startCommit,
  }
}

const winsIn = (records: ProjectRecord[], week: string[]): VictoryLine[] =>
  records
    .flatMap(r => finishedTasks(r.tasks).map(t => lineOf(r, t)))
    .filter(line => week.includes(line.finished.slice(0, 10)))
    .sort((a, b) => Date.parse(b.finished) - Date.parse(a.finished))

// One week of what happened, from the records as they are. `day` is any day in
// the week. Only read: nothing here is kept.
export const chronicleOf = (records: ProjectRecord[], day: string, today: string): ChronicleWeek => {
  const week = weekOf(day)
  const days = week.map(d => dayTimeOf(records, d))
  const victories = winsIn(records, week)
  const lastWeek = weekOf(dayBefore(week[0]!))
  const onQuests = days.reduce((sum, d) => sum + d.onQuests, 0)
  const elsewhere = days.reduce((sum, d) => sum + d.elsewhere, 0)
  const moved = (line: VictoryLine) => RANK[line.actual] - RANK[line.expected]

  return {
    days,
    victories,
    minutes: onQuests + elsewhere,
    onQuests,
    elsewhere,
    asExpected: victories.filter(v => moved(v) === 0).length,
    harder: victories.filter(v => moved(v) > 0).length,
    easier: victories.filter(v => moved(v) < 0).length,
    xp: victories.reduce((sum, v) => sum + v.xp, 0),
    lastWeek: { victories: winsIn(records, lastWeek).length, minutes: totalOf(lastWeek.map(d => dayTimeOf(records, d))) },
    hasAny: records.some(r => finishedTasks(r.tasks).length > 0),
    isThisWeek: weekOf(today)[0] === week[0],
  }
}
