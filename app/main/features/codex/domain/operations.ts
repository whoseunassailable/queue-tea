import { errandNote, errandReply } from '../../../../../hooks/features/errands/domain/services/errands'
import type { ErrandKind } from '../../../../../hooks/features/errands/domain/services/errands'
import { helperToRemind } from '../../../../../hooks/features/tasks/domain/services/task_rules'
import { fileTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/file_task'
import { findFeatureUseCase } from '../../../../../hooks/features/tasks/domain/usecases/find_feature'
import { setFeatureUseCase } from '../../../../../hooks/features/tasks/domain/usecases/set_feature'
import { currentTask, orderQueue } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import { isoLocal } from '../../../../../hooks/shared/time/domain/services/time'
import type { HelperId, ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../../hooks/core/env/env'
import type { Deps } from '../../../../../hooks/features/tasks/domain/usecases/deps'
import { CODEX_TEXT } from './constants'

export class CodexRefusal extends Error {}
export type CodexContext = { ctx: Ctx; deps: Deps }

const readable = (record: ProjectRecord | 'unreadable'): ProjectRecord => {
  if (record === 'unreadable') throw new CodexRefusal(CODEX_TEXT.unreadable)

  return record
}

// The server is bound to one working folder. No tool accepts arbitrary paths.
export const codexOperations = ({ ctx, deps }: CodexContext) => {
  const queue = async () => {
    const record = readable(await deps.records.read())

    return { project: record.project, workingFolder: ctx.cwd, current: currentTask(record.tasks, ctx), feature: record.tasks.find(t => t.id === record.feature) ?? null, queued: orderQueue(record.tasks) }
  }

  const errand = async (kind: ErrandKind, request: string) => {
    const record = readable(await deps.records.read())

    return { text: errandReply(kind), instructions: errandNote(kind, currentTask(record.tasks, ctx)), request }
  }

  const steep = async (message: string, title?: string, parentId?: string) => {
    const result = await fileTaskUseCase(deps, ctx, { text: message, title: title ?? message.slice(0, 60), priority: 'mid', difficulty: 'medium', intent: 'improving', parent: parentId === undefined ? { kind: 'none' } : { kind: 'task', id: parentId } })
    if (result.kind === 'unreadable') throw new CodexRefusal(CODEX_TEXT.unreadable)
    if (result.kind === 'refused') throw new CodexRefusal(result.notice)

    return { text: CODEX_TEXT.queued, task: result.task }
  }

  const feature = async (args: string) => {
    readable(await deps.records.read())
    const found = await findFeatureUseCase(deps, args)
    if (found.kind === 'say') return { text: found.text }
    const result = await setFeatureUseCase(deps, found.taskId)
    readable(result.saved)

    return { text: result.said }
  }

  // Resolve the task and write under the same record lock. A stale helper or
  // review request must not affect a replacement task or another worktree.
  const review = async (taskId: string, checked: string) => {
    const at = isoLocal(await deps.env.now(), ctx.offsetMinutes)
    let text: string = CODEX_TEXT.review
    readable(await deps.records.update(record => {
      const task = currentTask(record.tasks, ctx)
      if (task === null || task.id !== taskId) throw new CodexRefusal(CODEX_TEXT.noTask)
      const helper = helperToRemind(task)
      const remind = helper !== null && !task.helpers.reminded
      if (remind) text = `${helper} is enabled and has not run. Use its skill, then call task_looks_done again. If it cannot run, say why in checked.`
      const summary = [checked, ...(helper !== null && !remind ? [`${helper} did not run.`] : [])].filter(Boolean).join(' ')

      return { ...record, tasks: record.tasks.map(t => t.id !== taskId ? t : remind ? { ...t, helpers: { ...t.helpers, reminded: true } } : { ...t, review: { at, checked: summary || null } }) }
    }))

    return { text }
  }

  const helperFinished = async (taskId: string, helper: HelperId) => {
    readable(await deps.records.update(record => {
      const task = currentTask(record.tasks, ctx)
      if (task === null || task.id !== taskId) throw new CodexRefusal(CODEX_TEXT.noTask)

      return { ...record, tasks: record.tasks.map(t => t.id !== taskId || t.helpers.ran.includes(helper) ? t : { ...t, helpers: { ...t.helpers, ran: [...t.helpers.ran, helper] } }) }
    }))

    return { text: `Recorded ${helper} on ${taskId}.` }
  }

  return { queue, errand, steep, feature, review, helperFinished }
}
