import { defaultHelpers } from './helpers'
import type { Difficulty, Priority, Task } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'

export const PRIORITY_ORDER: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']

// Queued tasks only: priority first, then oldest first.
export const orderQueue = (tasks: Task[]): Task[] =>
  tasks
    .filter(t => t.state === 'queued')
    .sort(
      (a, b) =>
        PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority) ||
        Date.parse(a.created) - Date.parse(b.created),
    )

export const suggestion = (tasks: Task[]): Task | null => orderQueue(tasks)[0] ?? null

export const taskFolder = (task: Task, projectPath: string): string => task.worktreePath ?? projectPath

// A terminal only owns the task in its checkout. The app may ask for the
// first active task when no terminal context is supplied.
export const currentTask = (tasks: Task[], place?: Pick<Ctx, 'cwd' | 'projectPath'> | null): Task | null =>
  tasks.find(t => t.state === 'current' && (place == null || taskFolder(t, place.projectPath) === place.cwd)) ?? null

export const newTask = (input: {
  title: string
  priority: Priority
  difficulty: Difficulty
  messages: string[]
  now: string
  id: string
  parentIds?: string[]
}): Task => ({
  id: input.id,
  title: input.title,
  state: 'queued',
  priority: input.priority,
  difficulty: { expected: input.difficulty, actual: null },
  messages: input.messages,
  handoff: null,
  branch: null,
  baseBranch: null,
  startCommit: null,
  blockedBy: [],
  blockedReason: null,
  checkpoint: null,
  created: input.now,
  started: null,
  finished: null,
  minutesByDay: {},
  effort: {
    understandingMessages: 0,
    improvingMessages: 0,
    filesRead: 0,
    filesChanged: 0,
    linesAdded: 0,
    linesRemoved: 0,
    filesTouched: 0,
  },
  files: { read: [], changed: [] },
  parentIds: input.parentIds ?? [],
  description: null,
  criteria: [],
  review: null,
  helpers: defaultHelpers(),
  codexSince: null,
  worktreePath: null,
})

export const setPriority = (tasks: Task[], id: string, priority: Priority): Task[] =>
  tasks.map(t => (t.id === id ? { ...t, priority } : t))

// One list from several, each line once, in the order first met.
const merged = (lists: string[][]): string[] => [...new Set(lists.flat())]

// A task's criteria set for each feature only means something under two or
// more. Under fewer, every set joins its own criteria, so no line is lost.
export const foldCriteria = (task: Task): Task => {
  if (task.criteriaByParent === undefined || task.parentIds.length >= 2) return task
  const { criteriaByParent, ...rest } = task
  const order = [...task.parentIds, ...Object.keys(criteriaByParent).filter(id => !task.parentIds.includes(id))]

  return { ...rest, criteria: merged([task.criteria, ...order.map(id => criteriaByParent[id] ?? [])]) }
}

// Only a queued task can be removed. The tasks under it are no longer part of
// it: on their own, or under the other features they were part of.
export const removeTask = (tasks: Task[], id: string): Task[] => {
  if (!tasks.some(t => t.id === id && t.state === 'queued')) return tasks

  return tasks.map(t =>
    t.id === id ? { ...t, state: 'removed' } : t.parentIds.includes(id) ? foldCriteria({ ...t, parentIds: t.parentIds.filter(p => p !== id) }) : t,
  )
}
