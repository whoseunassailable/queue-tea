import type { Intent } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import type { Ports } from '../../../../core/ports/ports'
import { closeBand, showBand } from '../../../../core/store/band_queue'
import type { CheckAnswer } from '../../../../shared/assistant/domain/entities/check_answer'
import { guessParent } from '../../../../shared/backlog/domain/services/families'
import { effortState } from '../../../../shared/effort/presentation/state_management/effort_controller'
import { checkTypedMessage } from '../../domain/usecases/check_typed_message'
import type { TypedVerdict } from '../../domain/usecases/check_typed_message'
import { checkRepositoryOf } from '../../message_check_providers'

// Runs the check on a typed message and puts up its band, if it needs one.
export const onMessage = async (
  p: Ports,
  ctx: Ctx,
  text: string,
): Promise<{ verdict: 'pass' | 'drop'; intent: Intent | null; kind: CheckAnswer['kind'] | null }> => {
  const record = await p.get('record')
  if (record === null) return { verdict: 'pass', intent: null, kind: null }

  await p.set('isChecking', true)
  let verdict: TypedVerdict
  try {
    verdict = await checkTypedMessage(checkRepositoryOf(p), ctx, record, text)
  } finally {
    await p.set('isChecking', false)
  }

  if (verdict.kind === 'new') {
    await showBand(p, verdict.band)

    return { verdict: 'drop', intent: verdict.intent, kind: 'new' }
  }
  if (verdict.kind === 'unsure') {
    await showBand(p, verdict.band)

    return { verdict: 'drop', intent: verdict.intent, kind: verdict.wasChecked ? 'unsure' : null }
  }

  return { verdict: 'pass', intent: verdict.intent, kind: verdict.kind }
}

// Sends a held message on to Claude after all, as Rohan's own, and puts up the
// next band. Returns the message's intent for the effort count.
export const sendHeld = async (p: Ports): Promise<Intent | null> => {
  const band = await p.get('band')
  if (band.kind !== 'file' && band.kind !== 'unsure') return null
  await closeBand(p)
  await p.submit(band.text, true)

  return band.intent
}

// Drops a held message: Claude never sees it and nothing is filed. Puts up
// the next band, and returns the message so it can go back in the prompt box.
export const dropHeld = async (p: Ports): Promise<string | null> => {
  const band = await p.get('band')
  if (band.kind !== 'file' && band.kind !== 'unsure') return null
  await closeBand(p)

  return band.text
}

async function sendOn(p: Ports, to: 'task' | 'project') {
  const band = await p.get('band')
  if (band.kind !== 'file' && band.kind !== 'unsure') return
  effortState.tracker?.route(to)
  if (to === 'task') effortState.tracker?.intent(band.intent)
  await sendHeld(p)
}

// Sends a held message on to Claude after all, as the current task's. Where
// its time goes is set before it is sent, so its turn counts there.
export async function sendAsTask(p: Ports) {
  await sendOn(p, 'task')
}

// Sends a held message on as a quick question: its time goes to the project
// and it isn't counted, as when the check answers quick.
export async function sendQuick(p: Ports) {
  await sendOn(p, 'project')
}

// Cancel: the held message is neither sent nor filed. It goes back in the
// prompt box when nothing has been typed there since; appended, so a box the
// mod can't read is never written over.
export async function cancelHeld(p: Ports) {
  const text = await dropHeld(p)
  if (text === null) return
  const box = await p.prompt.read()
  if (box.text === '') await p.prompt.fill(text)
}

export async function unsureToNew(p: Ports) {
  const band = await p.get('band')
  if (band.kind !== 'unsure') return
  const record = await p.get('record')
  await p.set('band', {
    kind: 'file',
    text: band.text,
    title: band.text.slice(0, 60),
    priority: 'mid',
    difficulty: 'medium',
    intent: band.intent,
    ...(record === null ? null : guessParent(record, band.text, null)),
  })
}
