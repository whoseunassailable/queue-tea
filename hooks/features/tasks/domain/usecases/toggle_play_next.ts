import type { Deps } from './deps'

// Marks a queued task to be suggested before every other, or takes the mark
// off it.
export const togglePlayNextUseCase = (d: Deps, taskId: string) =>
  d.records.update(r => ({ ...r, playNext: r.playNext === taskId ? null : taskId }))
