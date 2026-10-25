import type { Difficulty, Priority, ProjectRecord, Task } from '../types'
import { PRIORITY_ORDER } from './queue'
import { formatMinutes } from './time'

// What decides the order of the backlog: what blocks what, how long a task
// needs, and which one to suggest. Pure; the panel and the flow call it.

const DEFAULT_MINUTES: Record<Difficulty, number> = { light: 30, medium: 90, hard: 240 }
export const SHORT_MINUTES = 30
const LEAST_MINUTES = 10

// "30m", "1h", "1h 30m": whole hours without their "0m".
export const formatSpan = (m: number): string => (m >= 60 && m % 60 === 0 ? `${m / 60}h` : formatMinutes(m))

const isOpen = (t: Task) => t.state === 'queued' || t.state === 'current'
const total = (t: Task) => Object.values(t.minutesByDay).reduce((a, b) => a + b, 0)

// The unfinished tasks a task waits for. One done or removed stops blocking.
export const blockersOf = (task: Task, tasks: Task[]): Task[] =>
  task.blockedBy
    .map(id => tasks.find(t => t.id === id))
    .filter((t): t is Task => t !== undefined && isOpen(t))

export const isBlocked = (task: Task, tasks: Task[]): boolean =>
  task.blockedReason !== null || blockersOf(task, tasks).length > 0

// Why a task is blocked, in plain words.
export const blockedText = (task: Task, tasks: Task[]): string => {
  const waits = blockersOf(task, tasks)

  return [
    ...(task.blockedReason === null ? [] : [task.blockedReason]),
    ...(waits.length === 0 ? [] : [`waits for ${waits.map(t => t.title).join(', ')}`]),
  ].join(' · ')
}

// True when `taskId` waiting for `blockerId` would close a loop: the blocker
// already waits, directly or not, for the task.
export const wouldLoop = (tasks: Task[], taskId: string, blockerId: string): boolean => {
  const seen = new Set<string>()
  const stack = [blockerId]
  while (stack.length > 0) {
    const id = stack.pop()!
    if (id === taskId) return true
    if (seen.has(id)) continue
    seen.add(id)
    stack.push(...(tasks.find(t => t.id === id)?.blockedBy ?? []))
  }

  return false
}

// The unfinished tasks that wait for this one, directly or not.
export const waitingFor = (task: Task, tasks: Task[]): Task[] => {
  const found: Task[] = []
  const seen = new Set([task.id])
  const stack = [task.id]
  while (stack.length > 0) {
    const id = stack.pop()!
    for (const t of tasks) {
      if (isOpen(t) && t.blockedBy.includes(id) && !seen.has(t.id)) {
        seen.add(t.id)
        found.push(t)
        stack.push(t.id)
      }
    }
  }

  return found
}

// A task's priority, raised to the highest of the tasks waiting for it.
export const effectivePriority = (task: Task, tasks: Task[]): Priority =>
  [task, ...waitingFor(task, tasks)]
    .map(t => t.priority)
    .reduce((best, p) => (PRIORITY_ORDER.indexOf(p) < PRIORITY_ORDER.indexOf(best) ? p : best))

// The usual time for a difficulty here: the middle value of this project's
// finished tasks of that difficulty, once there are three.
export const typicalMinutes = (tasks: Task[], difficulty: Difficulty): number => {
  const done = tasks
    .filter(t => t.state === 'done' && (t.difficulty.actual ?? t.difficulty.expected) === difficulty)
    .map(total)
    .filter(m => m > 0)
    .sort((a, b) => a - b)
  if (done.length < 3) return DEFAULT_MINUTES[difficulty]
  const mid = Math.floor(done.length / 2)

  return done.length % 2 === 1 ? done[mid]! : Math.round((done[mid - 1]! + done[mid]!) / 2)
}

// The time a task still needs: the usual time for its expected difficulty,
// less the time it already had.
export const estimateMinutes = (task: Task, tasks: Task[]): number =>
  Math.max(LEAST_MINUTES, typicalMinutes(tasks, task.difficulty.expected) - total(task))

export type Ranked = {
  task: Task
  estimate: number
  isShort: boolean
  fits: boolean | null
  priority: Priority
  unblocks: Task[]
  why: string
}

// The tasks that can start, in the order to take them. The first is the
// suggestion: Play next, then what fits the time Rohan has, then priority
// (raised by the tasks waiting), then what unblocks more, then a feature's
// own tasks before the feature, then the oldest. With a time set and nothing
// fitting, the shortest come first.
export const rankBacklog = (record: Pick<ProjectRecord, 'tasks' | 'playNext'>, budget: number | null): Ranked[] => {
  const tasks = record.tasks
  // Features with tasks still open under them.
  const leading = new Set(tasks.filter(t => t.parentId !== null && isOpen(t)).map(t => t.parentId))
  const rows = tasks
    .filter(t => t.state === 'queued' && !isBlocked(t, tasks))
    .map(task => {
      const estimate = estimateMinutes(task, tasks)

      return {
        task,
        estimate,
        isShort: estimate <= SHORT_MINUTES,
        fits: budget === null ? null : estimate <= budget,
        priority: effectivePriority(task, tasks),
        unblocks: waitingFor(task, tasks),
        why: '',
      }
    })
  const isNext = (r: Ranked) => Number(r.task.id === record.playNext)
  const rank = (r: Ranked) => PRIORITY_ORDER.indexOf(r.priority)
  rows.sort(
    (a, b) =>
      isNext(b) - isNext(a) ||
      Number(b.fits === true) - Number(a.fits === true) ||
      (a.fits === false && b.fits === false ? a.estimate - b.estimate : 0) ||
      rank(a) - rank(b) ||
      b.unblocks.length - a.unblocks.length ||
      Number(leading.has(a.task.id)) - Number(leading.has(b.task.id)) ||
      Date.parse(a.task.created) - Date.parse(b.task.created),
  )

  return rows.map(r => ({ ...r, why: whyOf(r, record.playNext, budget) }))
}

const whyOf = (r: Ranked, playNext: string | null, budget: number | null): string => {
  if (r.task.id === playNext) return 'you chose Play next'
  const first = r.unblocks[0]

  return [
    r.priority === r.task.priority ? r.priority : `${r.priority}, from what waits for it`,
    ...(first === undefined ? [] : [`unblocks ${first.title}${r.unblocks.length > 1 ? ` +${r.unblocks.length - 1}` : ''}`]),
    ...(budget === null ? [] : [r.fits ? `fits ${formatSpan(budget)}` : `nothing fits ${formatSpan(budget)}; the shortest`]),
  ].join(' · ')
}

// The suggestion (★), or null when nothing can start.
export const suggest = (record: Pick<ProjectRecord, 'tasks' | 'playNext'>, budget: number | null): Task | null =>
  rankBacklog(record, budget)[0]?.task ?? null

// Queued tasks that are blocked, oldest first.
export const blockedTasks = (tasks: Task[]): Task[] =>
  tasks
    .filter(t => t.state === 'queued' && isBlocked(t, tasks))
    .sort((a, b) => Date.parse(a.created) - Date.parse(b.created))

// The tasks `taskId` can be set to wait for: unfinished, not itself, not one
// that would close a loop, not one it already waits for.
export const canWaitFor = (tasks: Task[], taskId: string): Task[] =>
  tasks.filter(
    t =>
      isOpen(t) &&
      t.id !== taskId &&
      !(tasks.find(x => x.id === taskId)?.blockedBy.includes(t.id) ?? false) &&
      !wouldLoop(tasks, taskId, t.id),
  )

// The choices for "Time I have", in the order `t` steps through them.
export const BUDGETS: readonly (number | null)[] = [null, 30, 60, 120]

export const nextBudget = (budget: number | null): number | null =>
  BUDGETS[(BUDGETS.indexOf(budget) + 1) % BUDGETS.length] ?? null

export const budgetLabel = (budget: number | null): string => (budget === null ? 'any' : formatSpan(budget))
