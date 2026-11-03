import type { HelperId } from '../../../../../types'
import type { Deps } from './deps'

// Adds the helper to the current task's `ran`, once.
export const noteHelperUseCase = (d: Pick<Deps, 'records'>, taskId: string, helper: HelperId) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t =>
      t.id === taskId && t.state === 'current' && !t.helpers.ran.includes(helper)
        ? { ...t, helpers: { ...t.helpers, ran: [...t.helpers.ran, helper] } }
        : t,
    ),
  }))

// Claude has been reminded once for this task.
export const markRemindedUseCase = (d: Pick<Deps, 'records'>, taskId: string) =>
  d.records.update(r => ({ ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, helpers: { ...t.helpers, reminded: true } } : t)) }))
