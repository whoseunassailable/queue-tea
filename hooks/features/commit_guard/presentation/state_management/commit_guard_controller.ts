import type { ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { gitRepositoryOf } from '../../../../shared/git/git_providers'
import { recordsRepositoryOf } from '../../../../shared/records/records_providers'
import { gitModeOf } from '../../../../shared/records/domain/services/git_mode'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { applySaved } from '../../../../shared/records/presentation/state_management/records_controller'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import { checkProposal } from '../../domain/services/commit_proposal'
import { findNewCommits } from '../../domain/usecases/find_new_commits'
import { proposeCommitUseCase } from '../../domain/usecases/propose_commit'
import { GUARD_TEXT, PROPOSAL_TEXT } from '../constants/commit_guard_text'

// The commit the running turn started on. A reload starts it over.
export const commitGuardState = { turnHead: null as { commit: string; branch: string | null } | null }

// After a turn: names the commits that appeared during it.
export const commitWarning = async (
  p: Ports,
  ctx: Ctx,
  before: { commit: string; branch: string | null } | null,
): Promise<string | null> => {
  const commits = await findNewCommits(gitRepositoryOf(p, ctx), before)
  if (commits === null) return null

  const named = commits.length === 1 ? `a commit appeared: ${commits[0]}` : `${commits.length} commits appeared, newest ${commits[0]}`
  const text = `During the last turn ${named}. Queue-tea stops Claude's commits, so check it was yours.`
  await p.set('warning', text)
  p.toast(`Queue-tea: ${named}`)

  return text
}

export async function pressDismissWarning(p: Ports) {
  await p.set('warning', null)
}

// The refusal names what Claude can do instead; with no record, the plain one.
export const guardText = (record: ProjectRecord | null): string => GUARD_TEXT[record === null ? 'manual' : gitModeOf(record)]

// The propose_commit tool: saves Claude's proposal on the current task for
// Branches to show. Returns what Claude reads; it never throws.
export const proposeCommit = async (p: Ports, input: unknown): Promise<string> => {
  const ctx = live.ctx
  const record = await p.get('record')
  const current = record === null || ctx === null ? null : currentTask(record.tasks, ctx)
  if (ctx === null || current === null) return PROPOSAL_TEXT.noTask
  const checked = checkProposal(input)
  if (typeof checked === 'string') return PROPOSAL_TEXT.problems[checked]
  try {
    const at = isoLocal(await p.now(), ctx.offsetMinutes)
    const proposed = await proposeCommitUseCase({ records: recordsRepositoryOf(p, ctx), git: gitRepositoryOf(p, ctx) }, current.id, checked, at)
    if (proposed.kind !== 'saved') return PROPOSAL_TEXT[proposed.kind]
    await applySaved(p, ctx, proposed.record)

    return PROPOSAL_TEXT.saved(checked.files.length)
  } catch (err) {
    debug(p, 'saving the commit proposal failed', err)

    return PROPOSAL_TEXT.failed
  }
}
