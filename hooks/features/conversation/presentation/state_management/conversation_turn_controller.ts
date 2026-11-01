import type { Allowance } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import type { Ports } from '../../../../core/ports/ports'
import { isStartingFresh, markFreshPending, scheduleFresh, writeHandoff } from '../../../../shared/assistant/presentation/state_management/conversation_controller'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { windowKey } from '../../domain/services/allowance'
import { turnEnd } from '../../domain/services/turn_end'

// The reset window a handoff note was last written for. A reload starts it over.
export const conversationState = { handedOffFor: null as string | null }

// After each turn: does what the end of the turn calls for. Returns the reset
// time a note was last written for.
export const afterTurn = async (
  p: Ports,
  ctx: Ctx,
  reading: { tokens?: number; allowance: Allowance | null },
  handedOffFor: string | null,
): Promise<string | null> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null || isStartingFresh()) return handedOffFor

  const action = turnEnd(reading, ctx, handedOffFor)
  if (action === 'fresh') {
    markFreshPending(true)
    const task = await writeHandoff(p, ctx, current.id)
    if (task === null) markFreshPending(false)
    else scheduleFresh(p, ctx, task)

    return handedOffFor
  }
  if (action === 'note' && reading.allowance !== null) {
    const task = await writeHandoff(p, ctx, current.id)

    return task === null ? handedOffFor : windowKey(reading.allowance.resetsAt)
  }

  return handedOffFor
}
