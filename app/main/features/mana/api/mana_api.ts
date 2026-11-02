import { readOptions } from '../../../../../hooks/core/session/options'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { dayKey } from '../../../../../hooks/shared/time/domain/services/time'
import type { ManaView, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { reply } from '../../../core/reply'
import { sessionsIn } from '../../projects/domain/project_views'
import { linesSince } from '../../tasks/api/detail_api'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { allowanceOf, manaOf } from '../domain/mana'

export const readMana = (d: TasksDeps, key: unknown): Promise<Reply<ManaView>> =>
  reply(d.log, MESSAGES.readMana, async () => {
    const scope = await scopeOf(d, key)
    const now = d.now()
    const sessions = await sessionsRepositoryImpl(d.host, d.home).list()
    const here = sessionsIn(sessions, scope.ctx.projectPath, now)[0]

    return {
      ...manaOf(scope.record, dayKey(now, d.offsetMinutes())),
      realm: scope.ctx.projectName,
      allowance: allowanceOf(sessions, now),
      options: here?.options ?? readOptions({}),
      lines: await linesSince(d, scope, currentTask(scope.record.tasks)?.startCommit ?? null),
    }
  })
