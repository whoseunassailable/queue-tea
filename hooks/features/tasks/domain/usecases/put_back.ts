import type { Ctx } from '../../../../core/env/env'
import type { Saved } from '../../../../shared/records/domain/repositories/records_repository'
import { withBlock } from '../services/task_rules'
import type { Block } from '../services/task_rules'
import type { Deps } from './deps'
import { leaveCodexUseCase } from './leave_codex'

// The current task goes back in the backlog, keeping its branch, start commit
// and time, its time on Codex added, so Start later goes on where it stopped.
// With `block`, it goes back blocked.
export const putBackUseCase = async (d: Deps, ctx: Ctx, taskId: string, block: Block | undefined): Promise<{ saved: Saved; isCodexTimeLost: boolean }> => {
  const isCodexTimeLost = await leaveCodexUseCase(d, ctx, taskId)
  const saved = await d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && t.state === 'current' ? withBlock({ ...t, state: 'queued', review: null }, block) : t)),
  }))

  return { saved, isCodexTimeLost }
}
