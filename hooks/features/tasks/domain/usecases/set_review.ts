import type { Task } from '../../../../../types'
import type { Deps } from './deps'

// Marks the current task as waiting for Rohan's answer, or clears the mark.
export const setReviewUseCase = (d: Pick<Deps, 'records'>, taskId: string, review: Task['review']) =>
  d.records.update(r => ({ ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, review } : t)) }))
