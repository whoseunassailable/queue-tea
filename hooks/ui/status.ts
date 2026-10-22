import type { Allowance, Task } from '../../types'
import { formatMinutes } from '../time'

export const statusText = (
  task: Task | null,
  minutes: number,
  allowance: Allowance | null,
  isChecking: boolean,
): string | undefined => {
  if (isChecking) return 'Queue-tea: checking your message…'
  if (task === null) return undefined
  const used = allowance === null ? '' : ` · 5h ${Math.round(allowance.percent)}%`

  return `Queue-tea: ${task.title} · ${formatMinutes(minutes)}${used}`
}

const DAY = 86_400_000

// The days Monday to Sunday of the week that holds `today`, as `YYYY-MM-DD`.
export const weekOf = (today: string): string[] => {
  const ms = Date.parse(`${today}T00:00:00Z`)
  const monday = ms - ((new Date(ms).getUTCDay() + 6) % 7) * DAY

  return Array.from({ length: 7 }, (_, i) => new Date(monday + i * DAY).toISOString().slice(0, 10))
}

// This week's finished tasks, the latest first.
export const doneThisWeek = (tasks: Task[], today: string): Task[] => {
  const days = weekOf(today)

  return tasks
    .filter(t => t.state === 'done' && t.finished !== null && days.includes(t.finished.slice(0, 10)))
    .sort((a, b) => Date.parse(b.finished!) - Date.parse(a.finished!))
}

// Every finished task, the latest first.
export const finishedTasks = (tasks: Task[]): Task[] =>
  tasks
    .filter(t => t.state === 'done' && t.finished !== null)
    .sort((a, b) => Date.parse(b.finished!) - Date.parse(a.finished!))

// Minutes per day of the week, Monday first, tasks and project time together.
export const weekMinutes = (tasks: Task[], unassigned: Record<string, number>, today: string): number[] =>
  weekOf(today).map(day => tasks.reduce((sum, t) => sum + (t.minutesByDay[day] ?? 0), unassigned[day] ?? 0))

export const weekLine = (tasks: Task[], unassigned: Record<string, number>, today: string): string => {
  const minutes = weekMinutes(tasks, unassigned, today).reduce((a, b) => a + b, 0)

  return `${doneThisWeek(tasks, today).length} done · ${formatMinutes(minutes)}`
}

const BARS = '▁▂▃▄▅▆▇█'
const DAY_LETTERS = 'MTWTFSS'

// One bar per day, Monday to Sunday, the busiest day full height; a day with
// no time is blank. "M ▃  T ▆  W ▁  T █  F    S    S  "
export const weekChart = (minutesByDay: number[]): string => {
  const most = Math.max(0, ...minutesByDay)

  return minutesByDay
    .map((m, i) => {
      const bar = m <= 0 || most === 0 ? ' ' : BARS[Math.max(0, Math.ceil((m / most) * BARS.length) - 1)]

      return `${DAY_LETTERS[i]} ${bar}`
    })
    .join('  ')
}

// Cuts a text to `width` cells with an ellipsis.
export const cut = (text: string, width: number): string => {
  const chars = [...text]
  if (width <= 0) return ''

  return chars.length <= width ? text : `${chars.slice(0, Math.max(0, width - 1)).join('')}…`
}

export const formatAge = (ms: number): string => {
  const minutes = Math.max(0, Math.floor(ms / 60_000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)

  return hours < 48 ? `${hours}h` : `${Math.floor(hours / 24)}d`
}
