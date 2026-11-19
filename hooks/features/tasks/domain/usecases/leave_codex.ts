import type { Ctx } from '../../../../core/env/env'
import { mergeMinutes, minutesOfStamps, periodsOfStamps } from '../../../../shared/time/domain/services/time'
import { recordRealmTime } from '../../../../shared/time/domain/services/realm_time'
import type { WorkPeriod } from '../../../../../types'
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
  let periods: WorkPeriod[] = []
  let isTimeLost = false
  try {
    const stamps = await d.codex.activitySince(taskFolder(task!, ctx.projectPath), Date.parse(since), await d.env.now())
    byDay = minutesOfStamps(stamps, ctx.options.idleGapMinutes, ctx.offsetMinutes)
    periods = periodsOfStamps(stamps, ctx.options.idleGapMinutes)
  } catch (err) {
    d.env.log(`reading Codex's log failed: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`)
    isTimeLost = true
  }
  await d.records.update(r => {
    if (!r.tasks.some(t => t.id === taskId && t.codexSince === since)) return r
    const tracked = recordRealmTime(r, { onQuests: periods, elsewhere: [], minutesOnQuests: byDay, minutesElsewhere: {}, offsetMinutes: ctx.offsetMinutes })

    return {
      ...tracked,
      tasks: r.tasks.map(t => (t.id === taskId ? { ...t, codexSince: null, minutesByDay: mergeMinutes(t.minutesByDay, byDay) } : t)),
    }
  })

  return isTimeLost
}
