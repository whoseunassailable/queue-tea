import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import type { GitFacts } from '../../../../../types'
import { gitRepositoryOf } from '../../../git/git_providers'
import { currentTask } from '../../../records/domain/services/queue_rules'
import { changeRecord } from '../../../records/presentation/state_management/records_controller'
import { isoLocal } from '../../../time/domain/services/time'
import { applyPending } from '../../domain/services/effort_tracker'
import type { Tracker } from '../../domain/services/effort_tracker'

// What the session has gathered since the last flush. A reload starts it over.
export const effortState = { tracker: null as Tracker | null }

// Writes what the tracker gathered since the last flush into the record,
// and, with a task current, what git says now into its checkpoint.
export async function flush(p: Ports) {
  const tracker = effortState.tracker
  const ctx = live.ctx
  if (tracker === null || ctx === null) return
  const taken = tracker.take()
  const record = await p.get('record')
  let seen: { at: string; git: GitFacts | null } | undefined
  if (record !== null && currentTask(record.tasks) !== null) {
    try {
      seen = { at: isoLocal(await p.now(), ctx.offsetMinutes), git: await gitRepositoryOf(p, ctx).facts() }
    } catch (err) {
      debug(p, 'reading git for the checkpoint failed', err)
    }
  }
  await changeRecord(p, r => applyPending(r, taken, seen))
}
