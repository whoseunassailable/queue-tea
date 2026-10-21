import type { CommandRun, GitFacts, Intent, ProjectRecord, Task } from '../types'
import { noteSeen } from './checkpoint'
import { currentTask } from './queue'
import { accrue, addMinutes, dayKey } from './time'

const READS: Record<string, string> = { Read: 'file_path', Grep: 'path', Glob: 'path' }
const CHANGES: Record<string, string> = { Edit: 'file_path', Write: 'file_path', NotebookEdit: 'notebook_path' }

const once = (list: string[], path: unknown) =>
  typeof path === 'string' && path !== '' && !list.includes(path) ? [...list, path] : list

// The files a tool call read or changed, each path once.
export const countToolCall = (
  files: Task['files'],
  tool: string,
  input: Record<string, unknown>,
): Task['files'] => {
  const read = READS[tool]
  const changed = CHANGES[tool]
  if (read !== undefined) return { ...files, read: once(files.read, input[read]) }
  if (changed !== undefined) return { ...files, changed: once(files.changed, input[changed]) }

  return files
}

export type Pending = {
  minutes: Record<string, number>
  projectMinutes: Record<string, number>
  files: Task['files']
  understanding: number
  improving: number
  commands: CommandRun[]
}

const nothing = (): Pending => ({
  minutes: {},
  projectMinutes: {},
  files: { read: [], changed: [] },
  understanding: 0,
  improving: 0,
  commands: [],
})

// What happened since the last flush: time between activity, files touched by
// tool calls, and the kind of each message.
export const createTracker = (gapMinutes: number, offsetMinutes: number) => {
  let last: number | null = null
  let pending = nothing()
  let to: 'task' | 'project' = 'task'

  return {
    activity: (nowMs: number) => {
      const minutes = accrue(last, nowMs, gapMinutes)
      const day = dayKey(nowMs, offsetMinutes)
      if (minutes > 0 && to === 'task') pending.minutes = addMinutes(pending.minutes, day, minutes)
      if (minutes > 0 && to === 'project') pending.projectMinutes = addMinutes(pending.projectMinutes, day, minutes)
      last = nowMs
    },
    // After a quick question time goes to the project, until the next task message.
    route: (where: 'task' | 'project') => {
      to = where
    },
    toolCall: (tool: string, input: Record<string, unknown>) => {
      pending.files = countToolCall(pending.files, tool, input)
    },
    command: (run: CommandRun) => {
      pending.commands.push(run)
    },
    intent: (intent: Intent) => {
      if (intent === 'understanding') pending.understanding += 1
      else pending.improving += 1
    },
    take: (): Pending => {
      const taken = pending
      pending = nothing()

      return taken
    },
  }
}

export type Tracker = ReturnType<typeof createTracker>

const merge = (byDay: Record<string, number>, more: Record<string, number>) =>
  Object.entries(more).reduce((sum, [day, minutes]) => addMinutes(sum, day, minutes), byDay)

// Adds what the tracker took to the current task, or its minutes to the
// project when no task is current. With `seen`, the task's checkpoint also
// gets the commands, the files changed and what git says now.
export const applyPending = (
  record: ProjectRecord,
  pending: Pending,
  seen?: { at: string; git: GitFacts | null },
): ProjectRecord => {
  const current = currentTask(record.tasks)
  const unassigned = merge(record.unassignedMinutesByDay, pending.projectMinutes)
  if (current === null) {
    return { ...record, unassignedMinutesByDay: merge(unassigned, pending.minutes) }
  }

  const files = {
    read: pending.files.read.reduce(once, current.files.read),
    changed: pending.files.changed.reduce(once, current.files.changed),
  }
  const counted: Task = {
    ...current,
    minutesByDay: merge(current.minutesByDay, pending.minutes),
    files,
    effort: {
      ...current.effort,
      filesRead: files.read.length,
      filesChanged: files.changed.length,
      understandingMessages: current.effort.understandingMessages + pending.understanding,
      improvingMessages: current.effort.improvingMessages + pending.improving,
    },
  }
  const task =
    seen === undefined
      ? counted
      : noteSeen(counted, { at: seen.at, files: pending.files.changed, commands: pending.commands, git: seen.git })

  return { ...record, unassignedMinutesByDay: unassigned, tasks: record.tasks.map(t => (t.id === task.id ? task : t)) }
}
