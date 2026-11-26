import type { HelperId } from '../../../../../types'
import { addRun } from '../../../../shared/records/domain/services/helper_usage'
import type { HelperRunSeen } from '../../../../shared/records/domain/services/helper_usage'
import type { Deps } from './deps'

// One helper run on the current task: its totals grow by the run, and a run
// that didn't fail adds the helper to `ran`, once. A failed or missing helper
// never counts as run, so done still asks for it.
export const noteHelperUseCase = (d: Pick<Deps, 'records'>, taskId: string, helper: HelperId, run: HelperRunSeen) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t =>
      t.id !== taskId || t.state !== 'current'
        ? t
        : {
            ...t,
            helpers: run.outcome === 'failed' || t.helpers.ran.includes(helper) ? t.helpers : { ...t.helpers, ran: [...t.helpers.ran, helper] },
            helperUsage: addRun(t.helperUsage, helper, run),
          },
    ),
  }))

// Claude has been reminded once for this task.
export const markRemindedUseCase = (d: Pick<Deps, 'records'>, taskId: string) =>
  d.records.update(r => ({ ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, helpers: { ...t.helpers, reminded: true } } : t)) }))
