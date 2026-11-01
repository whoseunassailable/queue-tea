import type { ProjectRecord, Task } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { dayKey } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'

const totalMinutes = (t: Task) => Object.values(t.minutesByDay).reduce((a, b) => a + b, 0)

// Writes the finished task's row in the task log. Returns the path when that
// failed, so the screen can say so; the task stays done either way.
export const logRow = async (d: Deps, ctx: Ctx, record: ProjectRecord, taskId: string, logPath: string): Promise<string | null> => {
  const task = record.tasks.find(t => t.id === taskId)
  if (task === undefined || task.finished === null) return null
  const row = {
    title: task.title,
    priority: task.priority,
    expected: task.difficulty.expected,
    actual: task.difficulty.actual ?? task.difficulty.expected,
    minutes: totalMinutes(task),
    branch: task.branch,
  }
  try {
    await d.taskLog.add(logPath, row, dayKey(Date.parse(task.finished), ctx.offsetMinutes))

    return null
  } catch (err) {
    d.env.log(`writing the docs log failed: ${err instanceof Error ? err.message : String(err)}`)

    return logPath
  }
}
