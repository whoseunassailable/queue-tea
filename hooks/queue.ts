import type { Difficulty, Priority, Task } from '../types'

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

export const currentTask = (tasks: Task[]): Task | null =>
  tasks.find(t => t.state === 'current') ?? null

export const newTask = (input: {
  title: string
  priority: Priority
  difficulty: Difficulty
  messages: string[]
  now: string
  id: string
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
})

export const setPriority = (tasks: Task[], id: string, priority: Priority): Task[] =>
  tasks.map(t => (t.id === id ? { ...t, priority } : t))

// Only a queued task can be removed.
export const removeTask = (tasks: Task[], id: string): Task[] =>
  tasks.map(t => (t.id === id && t.state === 'queued' ? { ...t, state: 'removed' } : t))
