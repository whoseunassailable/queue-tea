import type { Saved } from '../../../../shared/records/domain/repositories/records_repository'
import type { Deps } from './deps'

export type AddResult = { kind: 'added'; saved: Saved; title: string } | { kind: 'not_waiting' }

// Adds a held message to a task that is still waiting, instead of filing the
// same work twice. The same message is added once. Under way, done or gone,
// nothing changes: the band says so.
export const addMessageUseCase = async (d: Pick<Deps, 'records'>, taskId: string, text: string): Promise<AddResult> => {
  const why: { title: string | null } = { title: null }
  const saved = await d.records.update(r => {
    const task = r.tasks.find(t => t.id === taskId && t.state === 'queued')
    why.title = task?.title ?? null
    if (task === undefined || task.messages.includes(text)) return r

    return { ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, messages: [...t.messages, text] } : t)) }
  })
  if (saved === 'unreadable') return { kind: 'added', saved, title: '' }

  return why.title === null ? { kind: 'not_waiting' } : { kind: 'added', saved, title: why.title }
}
