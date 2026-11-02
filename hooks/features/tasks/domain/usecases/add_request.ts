import type { AppRequest } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import type { Block } from '../services/task_rules'
import type { Deps } from './deps'

// Asks an open session to act. The same kind of request is only added once for
// a task, so a second press can't make it act twice.
export const addRequestUseCase = async (d: Pick<Deps, 'records' | 'env'>, ctx: Pick<Ctx, 'offsetMinutes'>, kind: AppRequest['kind'], taskId: string, block?: Block) => {
  const at = isoLocal(await d.env.now(), ctx.offsetMinutes)
  const id = d.env.newId()

  return d.records.update(r =>
    r.requests.some(q => q.kind === kind && q.taskId === taskId)
      ? r
      : { ...r, requests: [...r.requests, { id, kind, taskId, at, ...(block === undefined ? {} : { block }) }] },
  )
}
