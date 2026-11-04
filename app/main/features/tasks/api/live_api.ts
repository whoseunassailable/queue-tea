import { switchToTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/switch_to_task'
import { BUDGETS } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { holdReason } from '../../../../../hooks/shared/git/domain/services/branch_rules'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import type { LiveFacts, ProjectView, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { setBudget } from '../../projects/data/budgets'
import { sessionsIn } from '../../projects/domain/project_views'
import { realmView, scopeOf } from './scope'
import type { Scope, TasksDeps } from './scope'

const mismatchOf = async ({ deps }: Scope, branch: string): Promise<LiveFacts['mismatch']> => {
  const git = await deps.git.state()
  if (!git.isRepo || git.branch === branch || !(await deps.git.branches()).includes(branch)) return null

  return { on: git.branch, branch, uncommitted: git.uncommitted > 0 ? holdReason({ ...git, unpushed: 0, hasUpstream: true }) : null }
}

// What has moved under the quest in hand, from local git, and the session's
// commit warning.
export const readLive = (d: TasksDeps, key: unknown): Promise<Reply<LiveFacts>> =>
  reply(d.log, MESSAGES.readLive, async () => {
    const initial = await scopeOf(d, key)
    const scope = await scopeOf(d, key, currentTask(initial.record.tasks)?.id)
    const sessions = sessionsIn(await sessionsRepositoryImpl(d.host, d.home).list(), scope.ctx.cwd, d.now())
    const warning = sessions.find(s => s.warning != null)?.warning ?? null
    const current = currentTask(scope.record.tasks)
    if (current === null) return { drift: [], mismatch: null, warning }

    return { drift: await scope.deps.git.drift(current), mismatch: current.branch === null ? null : await mismatchOf(scope, current.branch), warning }
  })

export const switchBranch = (d: TasksDeps, key: unknown): Promise<Reply<null>> =>
  reply(d.log, MESSAGES.switchBranch, async () => {
    const initial = await scopeOf(d, key)
    const scope = await scopeOf(d, key, currentTask(initial.record.tasks)?.id)
    const branch = currentTask(scope.record.tasks)?.branch ?? null
    if (branch === null) throw new Refusal(MESSAGES.noBranch)
    const result = await switchToTaskUseCase(scope.deps, branch)
    if (result.kind === 'uncommitted') throw new Refusal(MESSAGES.switchHeld(result.text))

    return null
  })

export const setTimeBudget = (d: TasksDeps, key: unknown, budget: unknown): Promise<Reply<ProjectView>> =>
  reply(d.log, MESSAGES.setTimeBudget, async () => {
    const scope = await scopeOf(d, key)
    if (!BUDGETS.includes(budget as number | null)) throw new Refusal(MESSAGES.badValue)
    setBudget(scope.key, budget as number | null)

    return realmView(d, scope.key, scope.record)
  })
