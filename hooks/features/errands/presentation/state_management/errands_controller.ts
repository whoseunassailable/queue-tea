import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { closeMenu } from '../../../../core/store/menu'
import { effortState } from '../../../../shared/effort/presentation/state_management/effort_controller'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { ERRAND_NOT_SENT, errandNote, startsAsCommand } from '../../domain/services/errands'
import type { Errand, ErrandKind } from '../../domain/services/errands'

// A /brew or /tea errand on its way or running. A reload starts it over.
export const errandState = { errand: null as Errand | null }

// A /brew or /tea errand on its way: time goes to the project, as after a
// quick question. Answers the note Claude reads before the words.
export async function errandFor(p: Ports, kind: ErrandKind, text: string): Promise<string> {
  const record = await p.get('record')
  errandState.errand = { kind, text, isRunning: false }
  effortState.tracker?.route('project')

  return errandNote(kind, record === null ? null : currentTask(record.tasks))
}

// An errand's words that did not reach Claude go back in the prompt box as
// the command that sends them, when nothing has been typed there since;
// appended, so a box the mod can't read is never written over. Answers
// whether they went back.
export async function giveBack(p: Ports, command: string, text: string): Promise<boolean> {
  const box = await p.prompt.read()
  if (box.text !== '') return false

  return (await p.prompt.fill(`/${command} ${text}`)).isFilled
}

// The errand's words go to Claude as Rohan's once the caller is done (a
// submit from a command's own hook would wait on it). Words that do not
// enter, refused or dropped, are not lost: Rohan is told, and they go back.
export function sendErrand(p: Ports, text: string, command: string) {
  p.later(async () => {
    let failure: unknown = null
    try {
      failure = (await p.prompt.send(text)).drop ?? null
    } catch (err) {
      failure = err
    }
    if (failure === null) return
    errandState.errand = null
    debug(p, `/${command} failed`, failure)
    const isBack = await giveBack(p, command, text).catch(() => false)
    p.toast(`Queue-tea: /${command} did not reach Claude. ${isBack ? 'It is back in the prompt to send again.' : 'Send it again.'}`)
  })
}

// Brew now: the /brew errand. With no command row to carry its note, the
// note goes in as a row only Claude reads. The menu closes so the answer
// shows.
export async function brewNow(p: Ports, text: string) {
  const request = text.trim()
  if (request === '') return
  await closeMenu(p)
  if (startsAsCommand(request)) {
    p.toast(`Queue-tea: ${ERRAND_NOT_SENT}`)
    await giveBack(p, 'brew', request)

    return
  }
  const note = await errandFor(p, 'brew', request)
  await p.session.append(note)
  sendErrand(p, request, 'brew')
}
