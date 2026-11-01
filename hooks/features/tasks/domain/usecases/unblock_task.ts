import type { Deps } from './deps'

// Clears what blocks a task: its waits and its reason.
export const unblockTaskUseCase = (d: Deps, taskId: string) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId ? { ...t, blockedBy: [], blockedReason: null } : t)),
  }))
