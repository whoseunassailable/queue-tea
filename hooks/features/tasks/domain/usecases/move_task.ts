import type { ProjectRecord, Task } from '../../../../../types'
import { parentOf, parentRefusal, setParent } from '../../../../shared/backlog/domain/services/families'
import type { Deps } from './deps'

export type MoveResult =
  | { kind: 'refused'; notice: string; record: ProjectRecord }
  | { kind: 'moved'; task: Task | undefined; parent: Task | null; record: ProjectRecord }
  | { kind: 'unreadable' }

// Files a task under a feature, or on its own with null. Refused, saying why,
// when it would nest deeper than one level.
export const moveTaskUseCase = async (d: Deps, taskId: string, parentId: string | null): Promise<MoveResult> => {
  let refused = null as string | null
  const saved = await d.records.update(r => {
    refused = parentId === null ? null : parentRefusal(r.tasks, taskId, parentId)

    return refused === null ? { ...r, tasks: setParent(r.tasks, taskId, parentId) } : r
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (refused !== null) return { kind: 'refused', notice: refused, record: saved }
  const task = saved.tasks.find(t => t.id === taskId)

  return { kind: 'moved', task, parent: task === undefined ? null : parentOf(task, saved.tasks), record: saved }
}
