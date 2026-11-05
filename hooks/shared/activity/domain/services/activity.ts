import type { Task, TaskActivity } from '../../../../../types'
import { isTestCommand } from '../../../checkpoints/domain/services/checkpoints'

export const ACTIVITY_LIMIT = 200
export const ACTIVITY_TEXT_LIMIT = 8_000
const KINDS: TaskActivity['kind'][] = ['branchCreated', 'branchSwitched', 'read', 'edit', 'write', 'command', 'test']
const STATUSES: TaskActivity['status'][] = ['running', 'succeeded', 'failed', 'blocked']

// Activity is optional in old records. A malformed entry must not stop the
// queue from loading, and text from disk obeys the same limits as tool output.
export const activityEntries = (value: unknown): TaskActivity[] => {
  if (!Array.isArray(value)) return []

  return value.slice(-ACTIVITY_LIMIT).flatMap(raw => {
    if (raw === null || typeof raw !== 'object') return []
    const entry = raw as Partial<TaskActivity>
    if (typeof entry.id !== 'string' || entry.id === '' || typeof entry.at !== 'string' || !Number.isFinite(Date.parse(entry.at)) ||
      !(entry.finished === null || typeof entry.finished === 'string' && Number.isFinite(Date.parse(entry.finished))) ||
      !KINDS.includes(entry.kind!) || !STATUSES.includes(entry.status!) || typeof entry.subject !== 'string' || typeof entry.output !== 'string') return []

    return [{ ...entry, subject: entry.subject.slice(0, ACTIVITY_TEXT_LIMIT), output: entry.output.slice(-ACTIVITY_TEXT_LIMIT),
      truncated: entry.truncated === true || entry.subject.length > ACTIVITY_TEXT_LIMIT || entry.output.length > ACTIVITY_TEXT_LIMIT } as TaskActivity]
  })
}

export const keepActivity = (task: Task, entry: TaskActivity): Task => ({
  ...task,
  activity: [...activityEntries(task.activity).filter(step => step.id !== entry.id), entry]
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .slice(-ACTIVITY_LIMIT),
})

export const toolActivity = (tool: string, input: Record<string, unknown>, id: string, at: string): TaskActivity | null => {
  const kind = tool === 'Bash' ? (isTestCommand(String(input.command ?? '')) ? 'test' : 'command')
    : tool === 'Read' ? 'read' : tool === 'Edit' || tool === 'NotebookEdit' ? 'edit' : tool === 'Write' ? 'write' : null
  const subject = tool === 'Bash' ? input.command : tool === 'NotebookEdit' ? input.notebook_path : input.file_path
  if (kind === null || typeof subject !== 'string' || subject.trim() === '') return null

  return { id, at, finished: null, kind, status: 'running', subject: subject.slice(0, ACTIVITY_TEXT_LIMIT), output: '', truncated: subject.length > ACTIVITY_TEXT_LIMIT }
}

// Only shell output is retained; file reads and edits must not duplicate file
// contents in the record. Renderers display this as text, never terminal HTML.
export const finishActivity = (entry: TaskActivity, result: { deny?: unknown; isError?: boolean; result?: unknown }, at: string): TaskActivity => {
  const out = result.result
  const shell = out !== null && typeof out === 'object' ? out as { stdout?: unknown; stderr?: unknown; interrupted?: boolean; exitCode?: number; exit_code?: number; backgroundTaskId?: string } : null
  const failed = result.isError === true || shell?.interrupted === true || (shell?.exitCode ?? shell?.exit_code ?? 0) !== 0
  const pending = !failed && result.deny === undefined && typeof shell?.backgroundTaskId === 'string'
  const output = entry.kind === 'command' || entry.kind === 'test'
    ? typeof out === 'string' ? out : [shell?.stdout, shell?.stderr].filter((value): value is string => typeof value === 'string' && value !== '').join('\n')
    : ''

  return {
    ...entry,
    finished: pending ? null : at,
    status: result.deny !== undefined ? 'blocked' : failed ? 'failed' : pending ? 'running' : 'succeeded',
    output: output.slice(-ACTIVITY_TEXT_LIMIT),
    truncated: entry.truncated || output.length > ACTIVITY_TEXT_LIMIT,
    ...(pending ? { backgroundId: shell!.backgroundTaskId } : {}),
  }
}

// GetTask reports the eventual result of a background shell. A failed poll
// says nothing about the command itself, so it leaves that step awaiting.
export const finishBackgroundActivity = (entry: TaskActivity, result: unknown, at: string): TaskActivity => {
  if (result === null || typeof result !== 'object') return entry
  const task = result as { taskId?: string; status?: string; result?: { content?: { type: string; text?: string }[]; isError?: boolean }; error?: { message?: string } }
  if (task.taskId !== entry.backgroundId) return entry
  if (task.status === 'completed') {
    if (!Array.isArray(task.result?.content) || typeof task.result.isError !== 'boolean') return entry

    return finishActivity(entry, { isError: task.result.isError, result: task.result.content.filter(part => part.type === 'text').map(part => part.text ?? '').join('\n') }, at)
  }
  if (task.status === 'failed' || task.status === 'cancelled') return finishActivity(entry, { isError: true, result: task.error?.message ?? '' }, at)

  return entry
}
