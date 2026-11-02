import type { Deps } from './deps'

// Takes back what a session was asked to do for this task, before it acts.
export const dropRequestsUseCase = (d: Pick<Deps, 'records'>, taskId: string) =>
  d.records.update(r => (r.requests.some(q => q.taskId === taskId) ? { ...r, requests: r.requests.filter(q => q.taskId !== taskId) } : r))
