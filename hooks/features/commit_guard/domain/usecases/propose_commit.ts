import type { ProjectRecord } from '../../../../../types'
import type { GitRepository } from '../../../../shared/git/domain/repositories/git_repository'
import type { RecordsRepository } from '../../../../shared/records/domain/repositories/records_repository'
import { gitModeOf } from '../../../../shared/records/domain/services/git_mode'
import type { ProposalInput } from '../services/commit_proposal'

export type Proposed = { kind: 'saved'; record: ProjectRecord } | { kind: 'unreadable' | 'noHead' | 'manual' | 'notCurrent' }

// Saves the proposal on the task with the commit it was made on. The mode and
// the task are read again from the record being written: Rohan may have just
// switched the realm to Manual or finished the task in the app.
export const proposeCommitUseCase = async (
  d: { records: RecordsRepository; git: GitRepository },
  taskId: string,
  proposal: ProposalInput,
  at: string,
): Promise<Proposed> => {
  const head = await d.git.head()
  if (head === null) return { kind: 'noHead' }
  // A field, not a let: TypeScript doesn't follow assignments made in a callback.
  const why: { refused: 'manual' | 'notCurrent' | null } = { refused: null }
  const saved = await d.records.update(r => {
    why.refused = null
    if (gitModeOf(r) === 'manual') why.refused = 'manual'
    else if (!r.tasks.some(t => t.id === taskId && t.state === 'current')) why.refused = 'notCurrent'
    if (why.refused !== null) return r

    return { ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, commitProposal: { ...proposal, head: head.commit, at } } : t)) }
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }

  return why.refused === null ? { kind: 'saved', record: saved } : { kind: why.refused }
}
