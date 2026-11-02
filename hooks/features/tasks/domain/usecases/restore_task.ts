import type { Deps } from './deps'

// Undoes a removal. Only a plain task has an Undo: removing a feature asks
// first, because the tasks under it are set free.
export const restoreTaskUseCase = (d: Pick<Deps, 'records'>, taskId: string) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && t.state === 'removed' ? { ...t, state: 'queued' } : t)),
  }))
