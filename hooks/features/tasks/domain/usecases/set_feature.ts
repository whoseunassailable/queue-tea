import { parentOf } from '../../../../shared/backlog/domain/services/families'
import type { Saved } from '../../../../shared/records/domain/repositories/records_repository'
import type { Deps } from './deps'

// Makes a task the active feature, or none with null. Only an open task on
// its own can be one. Says what happened, in plain words.
export const setFeatureUseCase = async (d: Deps, taskId: string | null): Promise<{ said: string; saved: Saved }> => {
  let said = ''
  const saved = await d.records.update(r => {
    if (taskId === null) {
      said = r.feature === null ? 'No feature was active.' : 'No active feature now.'

      return { ...r, feature: null }
    }
    const task = r.tasks.find(t => t.id === taskId)
    const above = task === undefined ? null : parentOf(task, r.tasks)
    if (task === undefined || (task.state !== 'queued' && task.state !== 'current')) {
      said = 'That task is no longer open.'

      return r
    }
    if (above !== null) {
      said = `${task.title} is part of ${above.title}; make that the feature instead.`

      return r
    }
    said = `Active feature: ${task.title}. New tasks that belong to it are offered under it.`

    return { ...r, feature: taskId }
  })

  return { said, saved }
}
