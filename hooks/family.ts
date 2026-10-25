import type { ParentPick, ProjectRecord, Task } from '../types'
import { isBlocked } from './plan'
import type { Ranked } from './plan'

// Features and their tasks: a task can be filed under another, one level
// deep, and the backlog shows each feature with its tasks under it. Pure; the
// flow, the message check and the menu call it.

const isOpen = (t: Task) => t.state === 'queued' || t.state === 'current'

// At most this many features are offered when a task is filed.
const MAX_CHOICES = 5

// The task a task is part of; null when it is on its own or its feature was
// removed.
export const parentOf = (task: Task, tasks: Task[]): Task | null => {
  if (task.parentId === null) return null
  const parent = tasks.find(t => t.id === task.parentId)

  return parent === undefined || parent.state === 'removed' ? null : parent
}

// The tasks filed under a task, the removed ones left out.
export const childrenOf = (task: Task, tasks: Task[]): Task[] =>
  tasks.filter(t => t.parentId === task.id && t.state !== 'removed')

export type Progress = { done: number; total: number; current: number; blocked: number }

export const progressOf = (parent: Task, tasks: Task[]): Progress => {
  const children = childrenOf(parent, tasks)

  return {
    done: children.filter(t => t.state === 'done').length,
    total: children.length,
    current: children.filter(t => t.state === 'current').length,
    blocked: children.filter(t => t.state === 'queued' && isBlocked(t, tasks)).length,
  }
}

// "2/5 done ▰▰▱▱▱", then what is in progress and blocked.
export const progressText = (p: Progress): string => {
  const filled = p.total === 0 ? 0 : Math.round((p.done / p.total) * 5)

  return [
    `${p.done}/${p.total} done ${'▰'.repeat(filled)}${'▱'.repeat(5 - filled)}`,
    ...(p.current > 0 ? ['1 in progress'] : []),
    ...(p.blocked > 0 ? [`${p.blocked} blocked`] : []),
  ].join(' · ')
}

// The active feature, while it is open and on its own.
export const activeFeature = (record: Pick<ProjectRecord, 'tasks' | 'feature'>): Task | null => {
  const task = record.feature === null ? undefined : record.tasks.find(t => t.id === record.feature)

  return task !== undefined && isOpen(task) && parentOf(task, record.tasks) === null ? task : null
}

// Why `childId` can't be filed under `parentId`, in plain words; null when it
// can. The child may be one not saved yet.
export const parentRefusal = (tasks: Task[], childId: string, parentId: string): string | null => {
  const parent = tasks.find(t => t.id === parentId)
  const child = tasks.find(t => t.id === childId)
  if (parent === undefined || !isOpen(parent)) return 'That feature is no longer open.'
  if (childId === parentId) return "A task can't be part of itself."
  const above = parentOf(parent, tasks)
  if (above !== null) return `${parent.title} is part of ${above.title}, so its tasks go under that.`
  if (child !== undefined && childrenOf(child, tasks).length > 0) {
    return `${child.title} has tasks of its own, so it can't be part of another.`
  }

  return null
}

// The features a task can be moved under: every open task that would take
// it, but the one it is under now.
export const parentChoices = (tasks: Task[], taskId: string): Task[] => {
  const task = tasks.find(t => t.id === taskId)

  return tasks.filter(t => t.id !== task?.parentId && parentRefusal(tasks, taskId, t.id) === null)
}

export const setParent = (tasks: Task[], taskId: string, parentId: string | null): Task[] =>
  tasks.map(t => (t.id === taskId ? { ...t, parentId } : t))

// The features a new task is offered under: the active feature, the current
// task (or the feature it is part of), then the other open features, newest
// first.
export const filingCandidates = (record: Pick<ProjectRecord, 'tasks' | 'feature'>): Task[] => {
  const tasks = record.tasks
  const current = tasks.find(t => t.state === 'current') ?? null
  const features = tasks
    .filter(t => isOpen(t) && childrenOf(t, tasks).some(isOpen))
    .sort((a, b) => Date.parse(b.created) - Date.parse(a.created))
  const offered: Task[] = []
  for (const t of [activeFeature(record), current === null ? null : (parentOf(current, tasks) ?? current), ...features]) {
    if (t !== null && isOpen(t) && parentOf(t, tasks) === null && !offered.includes(t)) offered.push(t)
  }

  return offered.slice(0, MAX_CHOICES)
}

// The open tasks on their own that are not offered as features, newest
// first. The message check is shown them too: a broad task with nothing
// under it yet ("Fix the documentation") can take the first piece of it.
export const loneTasks = (record: Pick<ProjectRecord, 'tasks' | 'feature'>): Task[] => {
  const offered = filingCandidates(record)

  return record.tasks
    .filter(t => isOpen(t) && parentOf(t, record.tasks) === null && !offered.includes(t))
    .sort((a, b) => Date.parse(b.created) - Date.parse(a.created))
    .slice(0, MAX_CHOICES)
}

const words =(text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `

// The open tasks on their own that a message names: by id, or by the whole
// of a title of two words or more.
export const namedTasks = (text: string, tasks: Task[]): Task[] => {
  const said = words(text)
  const lower = text.toLowerCase()

  return tasks.filter(t => {
    if (!isOpen(t) || parentOf(t, tasks) !== null) return false
    const title = words(t.title)

    return lower.includes(t.id.toLowerCase()) || (title.trim().includes(' ') && said.includes(title))
  })
}

export type ParentGuess = { parent: ParentPick | null; choices: string[] }

// Where a new task goes, before Rohan says. A feature the message names is
// picked; two named, or no clear sign, and Rohan is asked (parent null);
// otherwise the check's answer, with on its own when it gives none. With an
// active feature, only the check's "none" leaves Rohan unasked: the feature
// is never taken for granted. A task on its own the check ties the work to
// is offered and picked; when the check can't tell, those it was shown are
// offered. `said` is the check's answer, undefined when it gave none, null
// when no check ran. Null when there is nothing to offer.
export const guessParent = (
  record: Pick<ProjectRecord, 'tasks' | 'feature'>,
  text: string,
  said: string | undefined | null,
): ParentGuess | null => {
  const candidates = filingCandidates(record)
  const named = namedTasks(text, record.tasks)
  const lone = loneTasks(record)
  const tied = lone.filter(t => t.id === said)
  const choices = [...new Set([...named, ...tied, ...candidates, ...(said === 'unsure' ? lone : [])].map(t => t.id))]
  if (choices.length === 0) return null

  if (named.length === 1) return { parent: { kind: 'task', id: named[0]!.id }, choices }
  if (named.length > 1) return { parent: null, choices: named.map(t => t.id) }
  if (said != null && [...tied, ...candidates].some(t => t.id === said)) return { parent: { kind: 'task', id: said }, choices }
  const isAsked = said === 'unsure' || (activeFeature(record) !== null && said !== 'none')

  return { parent: isAsked ? null : { kind: 'none' }, choices }
}

// A feature with the backlog rows of its tasks: those that can start, in the
// order Start ★ takes them, and those that are blocked. The feature itself is
// among them while it is queued.
export type Group = { parent: Task; rows: Ranked[]; blocked: Task[]; hasStar: boolean }

export type Entry = { kind: 'task'; row: Ranked } | { kind: 'blocked'; task: Task } | { kind: 'group'; group: Group }

// The feature a backlog row is shown under: its own, or itself when tasks are
// under it; null on its own.
const groupOf = (task: Task, tasks: Task[]): Task | null =>
  parentOf(task, tasks) ?? (childrenOf(task, tasks).length > 0 ? task : null)

// The backlog with each feature's tasks under it. A feature stands where the
// first of its tasks stands in the order, so the order of what can start is
// kept; a feature with nothing that can start stands among the blocked.
export const groupBacklog = (ranked: Ranked[], blocked: Task[], tasks: Task[]): { ready: Entry[]; blocked: Entry[] } => {
  const groups = new Map<string, Group>()
  const ready: Entry[] = []
  const stuck: Entry[] = []
  const place = (parent: Task, into: Entry[]): Group => {
    const known = groups.get(parent.id)
    if (known !== undefined) return known
    const group: Group = { parent, rows: [], blocked: [], hasStar: false }
    groups.set(parent.id, group)
    into.push({ kind: 'group', group })

    return group
  }

  ranked.forEach((row, i) => {
    const parent = groupOf(row.task, tasks)
    if (parent === null) {
      ready.push({ kind: 'task', row })

      return
    }
    const group = place(parent, ready)
    group.rows.push(row)
    if (i === 0) group.hasStar = true
  })
  for (const task of blocked) {
    const parent = groupOf(task, tasks)
    if (parent === null) stuck.push({ kind: 'blocked', task })
    else place(parent, stuck).blocked.push(task)
  }

  return { ready, blocked: stuck }
}
