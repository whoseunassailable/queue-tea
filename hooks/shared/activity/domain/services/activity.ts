import type { Task, TaskStep } from '../../../../../types'
import { isTestCommand } from '../../../checkpoints/domain/services/checkpoints'
import { mergePeriods } from '../../../time/domain/services/realm_time'
import { STEP_SUBJECT_LIMIT, WAITING_LIMIT } from '../constants/step_limits'

const KINDS: TaskStep['kind'][] = ['branchCreated', 'branchSwitched', 'read', 'edit', 'write', 'command', 'test']
const STATUSES: TaskStep['status'][] = ['running', 'succeeded', 'failed', 'blocked']

// The first line, trimmed, cut to the limit with an ellipsis.
export const stepSubject = (text: string): string => {
  const line = text.trim().split('\n')[0]!.trim()

  return line.length > STEP_SUBJECT_LIMIT ? `${line.slice(0, STEP_SUBJECT_LIMIT - 1)}…` : line
}

const isTime = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value))

// A step read from disk, where it is hand-editable, or from an older record's
// step log, whose entries carry output and an excerpt mark. Only a step's own
// fields are kept; anything malformed is no step.
export const stepOf = (raw: unknown): TaskStep | null => {
  if (raw === null || typeof raw !== 'object') return null
  const s = raw as Partial<TaskStep>
  if (typeof s.id !== 'string' || s.id === '' || !isTime(s.at) || !(s.finished === null || isTime(s.finished)) ||
    !KINDS.includes(s.kind!) || !STATUSES.includes(s.status!) || typeof s.subject !== 'string') return null

  return {
    id: s.id, at: s.at, finished: s.finished, kind: s.kind!, status: s.status!, subject: stepSubject(s.subject),
    ...(typeof s.backgroundId === 'string' && s.backgroundId !== '' ? { backgroundId: s.backgroundId } : {}),
  }
}

const isWaiting = (step: TaskStep): boolean => step.status === 'running' && step.backgroundId !== undefined

export const waitingOf = (raw: unknown): TaskStep[] =>
  Array.isArray(raw) ? raw.flatMap(entry => [stepOf(entry)].filter((s): s is TaskStep => s !== null && isWaiting(s))).slice(-WAITING_LIMIT) : []

// What an older record's step log leaves: its latest step as the step, and
// the background shells it still waited on. The rest, output included, goes.
export const fromOldLog = (raw: unknown): Pick<Task, 'step' | 'waiting'> => {
  const steps = (Array.isArray(raw) ? raw : []).map(stepOf).filter((s): s is TaskStep => s !== null)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
  const step = steps.at(-1)
  const waiting = steps.filter(isWaiting).slice(-WAITING_LIMIT)

  return { ...(step === undefined ? {} : { step }), ...(waiting.length === 0 ? {} : { waiting }) }
}

// The step started last of those given, or null for none.
export const latestStep = (...steps: (TaskStep | null | undefined)[]): TaskStep | null =>
  steps.reduce<TaskStep | null>((late, s) => s == null || (late !== null && Date.parse(late.at) > Date.parse(s.at)) ? late : s, null)

// A finished check's span joins the quest's testing time. Merging keeps a step
// saved twice, or two checks running at once, from counting twice.
const checked = (task: Task, step: TaskStep): Pick<Task, 'testPeriods'> => {
  const start = Date.parse(step.at)
  const end = step.kind === 'test' && step.finished !== null ? Date.parse(step.finished) : NaN

  return end > start ? { testPeriods: mergePeriods([...task.testPeriods ?? [], { start, end }]) } : {}
}

// A step that starts becomes the task's step. A background shell's end that
// arrives later is not what the task is on now, so it changes the line only
// when it still is the task's step; either way it stops waiting.
export const keepStep = (task: Task, step: TaskStep): Task => {
  const waited = waitingOf(task.waiting)
  const isLate = waited.some(w => w.id === step.id) && task.step?.id !== step.id
  const waiting = [...waited.filter(w => w.id !== step.id), ...(isWaiting(step) ? [step] : [])].slice(-WAITING_LIMIT)
  const kept: Task = { ...task, ...(isLate ? {} : { step }), waiting, ...checked(task, step) }
  if (waiting.length === 0) delete kept.waiting

  return kept
}

export const toolStep = (tool: string, input: Record<string, unknown>, id: string, at: string): TaskStep | null => {
  const kind = tool === 'Bash' ? (isTestCommand(String(input.command ?? '')) ? 'test' : 'command')
    : tool === 'Read' ? 'read' : tool === 'Edit' || tool === 'NotebookEdit' ? 'edit' : tool === 'Write' ? 'write' : null
  const subject = tool === 'Bash' ? input.command : tool === 'NotebookEdit' ? input.notebook_path : input.file_path
  if (kind === null || typeof subject !== 'string' || subject.trim() === '') return null

  return { id, at, finished: null, kind, status: 'running', subject: stepSubject(subject) }
}

// How the tool's call ended. Its output is read for the exit code and a
// background shell's id, and never kept.
export const finishStep = (step: TaskStep, result: { deny?: unknown; isError?: boolean; result?: unknown }, at: string): TaskStep => {
  const out = result.result
  const shell = out !== null && typeof out === 'object' ? out as { interrupted?: boolean; exitCode?: number; exit_code?: number; backgroundTaskId?: string } : null
  const failed = result.isError === true || shell?.interrupted === true || (shell?.exitCode ?? shell?.exit_code ?? 0) !== 0
  const pending = !failed && result.deny === undefined && typeof shell?.backgroundTaskId === 'string'

  return {
    ...step,
    finished: pending ? null : at,
    status: result.deny !== undefined ? 'blocked' : failed ? 'failed' : pending ? 'running' : 'succeeded',
    ...(pending ? { backgroundId: shell!.backgroundTaskId } : {}),
  }
}

// GetTask reports the eventual result of a background shell. A failed poll
// says nothing about the command itself, so it leaves that step waiting.
export const finishBackgroundStep = (step: TaskStep, result: unknown, at: string): TaskStep => {
  if (result === null || typeof result !== 'object') return step
  const task = result as { taskId?: string; status?: string; result?: { content?: unknown; isError?: boolean } }
  if (task.taskId !== step.backgroundId) return step
  if (task.status === 'completed') {
    if (!Array.isArray(task.result?.content) || typeof task.result.isError !== 'boolean') return step

    return finishStep(step, { isError: task.result.isError }, at)
  }
  if (task.status === 'failed' || task.status === 'cancelled') return finishStep(step, { isError: true }, at)

  return step
}

// The background shells a task notification says have ended. One delivery may
// carry several; anything not a shell's end, such as a Monitor event, is skipped.
export type Notified = { id: string; isOk: boolean }
const ENDED = ['completed', 'failed', 'killed']
export const notifiedEnds = (text: string): Notified[] =>
  [...text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g)].flatMap(([, body]) => {
    const tag = (name: string) => body!.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? ''
    const id = tag('task-id')
    const status = tag('status')
    if (id === '' || !ENDED.includes(status)) return []

    return [{ id, isOk: status === 'completed' && !/exit code [1-9]/.test(tag('summary')) }]
  })

// The waiting step a background shell's id names, if the task waits on it.
export const waitingFor = (task: Task, backgroundId: string): TaskStep | undefined =>
  waitingOf(task.waiting).find(s => s.backgroundId === backgroundId)

// Ends the task's waiting steps that a notification names, keeping the span.
export const finishNotified = (task: Task, ends: Notified[], at: string): Task =>
  ends.reduce((t, end) => {
    const step = waitingFor(t, end.id)

    return step === undefined ? t : keepStep(t, finishStep(step, { isError: !end.isOk }, at))
  }, task)
