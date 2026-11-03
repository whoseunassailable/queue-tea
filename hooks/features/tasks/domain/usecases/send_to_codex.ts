import type { Ctx } from '../../../../core/env/env'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'

// The task in progress goes on in Codex from now. What an open session was
// asked to do for it is taken back, so Claude Code doesn't work on it too.
export const sendToCodexUseCase = async (d: Deps, ctx: Ctx, taskId: string) => {
  const since = isoLocal(await d.env.now(), ctx.offsetMinutes)

  return d.records.update(r => ({
    ...r,
    requests: r.requests.filter(q => q.taskId !== taskId),
    tasks: r.tasks.map(t => (t.id === taskId && t.state === 'current' && t.codexSince === null ? { ...t, codexSince: since } : t)),
  }))
}
