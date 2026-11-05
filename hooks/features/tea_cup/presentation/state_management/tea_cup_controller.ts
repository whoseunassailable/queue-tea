import { live } from '../../../../core/session/live'
import type { Ports } from '../../../../core/ports/ports'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { cupOf } from '../../domain/services/cup_mood'
import type { Cup } from '../../domain/services/cup_mood'
import { statusText } from '../widgets/status_line'

// The status line, from the current task, the check and the allowance.
export async function refreshStatus(p: Ports) {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks, live.ctx)
  const minutes = current === null ? 0 : Object.values(current.minutesByDay).reduce((a, b) => a + b, 0)
  p.status(statusText(current, minutes, await p.get('allowance'), await p.get('isChecking')))
}

// The tea cup's mood, from the same values the menu shows. Read while
// drawing, it redraws the cup when one of them changes.
export async function readCup(p: Ports, isTurnRunning: boolean): Promise<Cup> {
  return cupOf({
    place: live.ctx,
    load: await p.get('load'),
    record: await p.get('record'),
    band: await p.get('band'),
    isAskingDone: await p.get('isAskingDone'),
    hold: await p.get('hold'),
    mismatch: await p.get('mismatch'),
    canContinue: await p.get('canContinue'),
    warning: await p.get('warning'),
    isChecking: await p.get('isChecking'),
    busy: await p.get('busy'),
    isTurnRunning,
    budget: await p.get('budget'),
    now: await p.now(),
  })
}
