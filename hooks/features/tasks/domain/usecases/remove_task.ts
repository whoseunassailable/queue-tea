import { removeTask } from '../../../../shared/records/domain/services/queue_rules'
import type { Deps } from './deps'

// Removes a queued task. The tasks under it are then on their own, and it is
// no longer the active feature.
export const removeTaskUseCase = (d: Deps, taskId: string) =>
  d.records.update(r => {
    const tasks = removeTask(r.tasks, taskId)

    return tasks === r.tasks ? r : { ...r, feature: r.feature === taskId ? null : r.feature, tasks }
  })
