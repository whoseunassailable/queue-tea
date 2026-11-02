import type { AppRequest, ProjectRecord } from '../../../../../types'
import type { Deps } from './deps'

export type TakeResult = { kind: 'unreadable' } | { kind: 'gone' } | { kind: 'taken'; request: AppRequest; record: ProjectRecord }

// Removes a request under the lock, so with two sessions only one gets it.
export const takeRequestUseCase = async (d: Pick<Deps, 'records'>, id: string): Promise<TakeResult> => {
  let taken: AppRequest | null = null
  const saved = await d.records.update(r => {
    taken = r.requests.find(q => q.id === id) ?? null

    return taken === null ? r : { ...r, requests: r.requests.filter(q => q.id !== id) }
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }

  return taken === null ? { kind: 'gone' } : { kind: 'taken', request: taken, record: saved }
}
