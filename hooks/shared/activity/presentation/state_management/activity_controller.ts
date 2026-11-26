import type { TaskStep } from '../../../../../types'
import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { change } from '../../../records/presentation/state_management/records_controller'
import { currentTask } from '../../../records/domain/services/queue_rules'
import { isoLocal } from '../../../time/domain/services/time'
import { finishBackgroundStep, finishNotified, finishStep, keepStep, notifiedEnds, toolStep, waitingFor } from '../../domain/services/activity'

// Capture the task and context before awaiting the tool. Its result must never
// land on a different task if the user switches while the command is running.
export const beginActivity = async (p: Ports, tool: string, input: Record<string, unknown>) => {
  try {
    const ctx = live.ctx
    if (ctx === null) return null
    const record = await p.get('record')
    const background = tool === 'GetTask' && typeof input.taskId === 'string'
    const task = record === null ? null : background
      ? record.tasks.find(t => waitingFor(t, String(input.taskId)) !== undefined) ?? null
      : currentTask(record.tasks, ctx)
    if (task === null) return null
    const step = background ? waitingFor(task, String(input.taskId))!
      : toolStep(tool, input, p.newId(), isoLocal(await p.now(), ctx.offsetMinutes))
    if (step === null) return null
    const save = (s: TaskStep) => change(p, ctx, r => ({ ...r, tasks: r.tasks.map(t => t.id === task.id ? keepStep(t, s) : t) }))
    if (!background) await save(step)

    return async (result: { deny?: unknown; isError?: boolean; result?: unknown }) => {
      try {
        const at = isoLocal(await p.now(), ctx.offsetMinutes)
        const ended = background ? finishBackgroundStep(step, result.result, at) : finishStep(step, result, at)
        if (ended !== step) await save(ended)
      } catch (err) {
        debug(p, 'saving a finished step failed', err)
      }
    }
  } catch (err) {
    debug(p, 'saving a started step failed', err)

    return null
  }
}

// A background shell ends when its notification arrives, not when Claude next
// reads it, so a background check counts as testing before this turn's minutes
// are flushed. Writes only when a waiting step matches.
export const finishNotifiedActivity = async (p: Ports, text: string) => {
  try {
    const ctx = live.ctx
    const ends = notifiedEnds(text)
    const record = ctx === null || ends.length === 0 ? null : await p.get('record')
    if (ctx === null || record === null) return
    const at = isoLocal(await p.now(), ctx.offsetMinutes)
    if (record.tasks.every(t => finishNotified(t, ends, at) === t)) return
    await change(p, ctx, r => ({ ...r, tasks: r.tasks.map(t => finishNotified(t, ends, at)) }))
  } catch (err) {
    debug(p, 'finishing a background step failed', err)
  }
}
