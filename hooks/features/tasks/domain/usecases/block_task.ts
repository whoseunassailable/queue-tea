import type { ProjectRecord } from '../../../../../types'
import { wouldLoop } from '../../../../shared/backlog/domain/services/ranking'
import type { Saved } from '../../../../shared/records/domain/repositories/records_repository'
import { withBlock } from '../services/task_rules'
import type { Block } from '../services/task_rules'
import type { Deps } from './deps'

export type BlockResult = { kind: 'refused'; notice: string } | { kind: 'is_current' } | { kind: 'none' } | { kind: 'saved'; saved: Saved }

// Sets a queued task to wait for another, or to be blocked for a reason. A
// wait that would loop is refused; the current task has to go back first.
export const blockTaskUseCase = async (d: Deps, record: ProjectRecord | null, taskId: string, block: Block): Promise<BlockResult> => {
  const task = record?.tasks.find(t => t.id === taskId)
  if (record === null || task === undefined) return { kind: 'none' }
  if ('waitFor' in block && wouldLoop(record.tasks, taskId, block.waitFor)) {
    return { kind: 'refused', notice: 'That would make the two tasks wait for each other.' }
  }
  if (task.state === 'current') return { kind: 'is_current' }

  return {
    kind: 'saved',
    saved: await d.records.update(r => ({
      ...r,
      playNext: r.playNext === taskId ? null : r.playNext,
      tasks: r.tasks.map(t => (t.id === taskId && t.state === 'queued' ? withBlock(t, block) : t)),
    })),
  }
}
