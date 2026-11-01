import type { Priority } from '../../../../../types'
import { setPriority } from '../../../../shared/records/domain/services/queue_rules'
import type { Deps } from './deps'

export const setPriorityUseCase = (d: Deps, taskId: string, priority: Priority) =>
  d.records.update(r => ({ ...r, tasks: setPriority(r.tasks, taskId, priority) }))
