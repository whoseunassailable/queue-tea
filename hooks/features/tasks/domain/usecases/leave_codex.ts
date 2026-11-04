import type { Ctx } from '../../../../core/env/env'
import { mergeMinutes, minutesOfStamps } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'
import { taskFolder } from '../../../../shared/records/domain/services/queue_rules'

// A task coming back from Codex gets the minutes Codex's log shows since it
// went, under the idle gap, and Claude Code has it again. When the log can't
// be read the task still comes back, without that time; true says so.
export const leaveCodexUseCase = async (d: Deps, ctx: Ctx, taskId: string): Promise<boolean> => {
  const record = await d.records.read()
  const task = record === 'unreadable' ? null : record.tasks.find(t => t.id === taskId)
  const since = task?.codexSince ?? null
  if (since === null) return false

  let byDay: Record<string, number> = {}
  let isTimeLost = false
  try {
    const stamps = await d.codex.activitySince(taskFolder(task!, ctx.projectPath), Date.parse(since), await d.env.now())
    byDay = minutesOfStamps(stamps, ctx.options.idleGapMinutes, ctx.offsetMinutes)
  } catch (err) {
    d.env.log(`reading Codex's log failed: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`)
    isTimeLost = true
  }
  await d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && t.codexSince === since ? { ...t, codexSince: null, minutesByDay: mergeMinutes(t.minutesByDay, byDay) } : t)),
  }))

  return isTimeLost
}
