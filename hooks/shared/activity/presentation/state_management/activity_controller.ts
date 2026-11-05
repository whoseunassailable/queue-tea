import type { TaskActivity } from '../../../../../types'
import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { change } from '../../../records/presentation/state_management/records_controller'
import { currentTask } from '../../../records/domain/services/queue_rules'
import { isoLocal } from '../../../time/domain/services/time'
import { activityEntries, finishActivity, finishBackgroundActivity, keepActivity, toolActivity } from '../../domain/services/activity'

// Capture the task and context before awaiting the tool. Its result must never
// land on a different task if the user switches while the command is running.
export const beginActivity = async (p: Ports, tool: string, input: Record<string, unknown>) => {
  try {
    const ctx = live.ctx
    if (ctx === null) return null
    const record = await p.get('record')
    const background = tool === 'GetTask' && typeof input.taskId === 'string'
    const task = record === null ? null : background
      ? record.tasks.find(t => activityEntries(t.activity).some(step => step.backgroundId === input.taskId && step.status === 'running')) ?? null
      : currentTask(record.tasks, ctx)
    if (task === null) return null
    const entry = background ? activityEntries(task.activity).find(step => step.backgroundId === input.taskId && step.status === 'running')!
      : toolActivity(tool, input, p.newId(), isoLocal(await p.now(), ctx.offsetMinutes))
    if (entry === null) return null
    const save = (step: TaskActivity) => change(p, ctx, r => ({ ...r, tasks: r.tasks.map(t => t.id === task.id ? keepActivity(t, step) : t) }))
    if (!background) await save(entry)

    return async (result: { deny?: unknown; isError?: boolean; result?: unknown }) => {
      try {
        const at = isoLocal(await p.now(), ctx.offsetMinutes)
        const completed = background ? finishBackgroundActivity(entry, result.result, at) : finishActivity(entry, result, at)
        if (completed !== entry) await save(completed)
      } catch (err) {
        debug(p, 'saving a completed activity failed', err)
      }
    }
  } catch (err) {
    debug(p, 'saving a started activity failed', err)

    return null
  }
}
