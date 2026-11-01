import type { Difficulty, ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'
import { logRow } from './log_row'

export type FinishResult =
  | { kind: 'unreadable' }
  | { kind: 'skipped' }
  | { kind: 'saved'; record: ProjectRecord; askPath: boolean; logFailedAt: string | null }

// Marks the task done with its change size, then logs it. With no log path
// yet, nothing is logged and the path is asked for.
export const finishTaskUseCase = async (d: Deps, ctx: Ctx, taskId: string, actual: Difficulty): Promise<FinishResult> => {
  const record = await d.records.read()
  if (record === 'unreadable') return { kind: 'unreadable' }
  const before = record.tasks.find(t => t.id === taskId) ?? null
  if (before === null || before.state === 'done') return { kind: 'skipped' }
  let diff = { linesAdded: 0, linesRemoved: 0, filesTouched: 0 }
  if (before.startCommit) {
    try {
      diff = await d.git.diffSince(before.startCommit)
    } catch (err) {
      d.env.log(`measuring the change failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const finished = isoLocal(await d.env.now(), ctx.offsetMinutes)
  const saved = await d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t =>
      t.id === taskId
        ? { ...t, state: 'done', finished, difficulty: { ...t.difficulty, actual }, effort: { ...t.effort, ...diff } }
        : t,
    ),
  }))
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (saved.docsLogPath === null) return { kind: 'saved', record: saved, askPath: true, logFailedAt: null }

  return { kind: 'saved', record: saved, askPath: false, logFailedAt: await logRow(d, ctx, saved, taskId, saved.docsLogPath) }
}
