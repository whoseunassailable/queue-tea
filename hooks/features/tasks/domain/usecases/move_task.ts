import type { ProjectRecord, Task } from '../../../../../types'
import { homeOf, parentsRefusal, setParents } from '../../../../shared/backlog/domain/services/families'
import type { Deps } from './deps'

export type MoveResult =
  | { kind: 'refused'; notice: string; record: ProjectRecord }
  | { kind: 'moved'; task: Task | undefined; parent: Task | null; record: ProjectRecord }
  | { kind: 'unreadable' }

// Files a task under the features given, in their order, or on its own with
// none. Refused, saying why, when it would nest deeper than one level. A
// feature it is already under is kept even when it could no longer take it.
export const moveTaskUseCase = async (d: Deps, taskId: string, parentIds: string[]): Promise<MoveResult> => {
  let refused = null as string | null
  const saved = await d.records.update(r => {
    const was = r.tasks.find(t => t.id === taskId)?.parentIds ?? []
    refused = parentsRefusal(r.tasks, taskId, parentIds.filter(id => !was.includes(id)))

    return refused === null ? { ...r, tasks: setParents(r.tasks, taskId, parentIds) } : r
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (refused !== null) return { kind: 'refused', notice: refused, record: saved }
  const task = saved.tasks.find(t => t.id === taskId)

  return { kind: 'moved', task, parent: task === undefined ? null : homeOf(task, saved.tasks), record: saved }
}
