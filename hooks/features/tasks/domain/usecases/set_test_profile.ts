import type { ProjectRecord, TestProfileId } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import type { TestPick } from '../../../../shared/records/domain/services/test_profile'
import type { Deps } from './deps'

export type ProfileSet =
  | { kind: 'saved'; record: ProjectRecord }
  | { kind: 'rohans'; id: TestProfileId }
  | { kind: 'unreadable' | 'notCurrent' }

// Saves Tea-DD's pick on the task, which may replace its own earlier one.
// Rohan's choice is read again from the record being written: he may have
// just picked one in the app, and his always stands. The task must still be
// this folder's current one, so a stale id never touches another worktree's.
export const setTestProfileUseCase = async (d: Pick<Deps, 'records'>, place: Pick<Ctx, 'cwd' | 'projectPath'>, taskId: string, pick: TestPick): Promise<ProfileSet> => {
  // A field, not a let: TypeScript doesn't follow assignments made in a callback.
  const why: { refused: Exclude<ProfileSet, { kind: 'saved' | 'unreadable' }> | null } = { refused: null }
  const saved = await d.records.update(r => {
    const task = currentTask(r.tasks, place)
    why.refused = task === null || task.id !== taskId ? { kind: 'notCurrent' } : task.testProfile?.by === 'rohan' ? { kind: 'rohans', id: task.testProfile.id } : null
    if (why.refused !== null) return r

    return { ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, testProfile: { id: pick.id, by: 'tea-dd' as const, reason: pick.reason } } : t)) }
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }

  return why.refused ?? { kind: 'saved', record: saved }
}
