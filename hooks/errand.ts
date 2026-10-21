import type { Task } from '../types'

// An errand: a request Rohan wants done now with /brew (or /instant), or a
// question asked with /tea. It goes to Claude as typed, in this conversation,
// outside the queue: no task, no branch, no clear.
export type ErrandKind = 'brew' | 'tea'

// Waiting to go to Claude, then running until its turn completes.
export type Errand = { kind: ErrandKind; text: string; isRunning: boolean }

export const ERRANDS: Record<string, ErrandKind> = { brew: 'brew', instant: 'brew', tea: 'tea' }

export const errandUsage = (command: string, kind: ErrandKind) =>
  `Write what you want after the command: /${command} <${kind === 'tea' ? 'question' : 'request'}>`

export const errandReply = (kind: ErrandKind) =>
  kind === 'brew' ? 'Brewing now, outside the queue.' : 'Pouring an answer, outside the queue.'

// The note the model reads just before the errand's words, never shown to
// Rohan: the command's context, recorded after its output.
export const errandNote = (kind: ErrandKind, current: Task | null): string => {
  const kept =
    current === null
      ? 'nothing in the queue changes'
      : `the current task "${current.title}", its branch and the queue stay as they are`
  const outside = `It is outside the Queue-tea queue: no task is made and ${kept}, so don't call task_looks_done for it.`

  return kind === 'brew'
    ? `Rohan ran /brew; the request is the next message. Do it now, in this conversation. ${outside} Do the work rather than say how, and check it worked before you answer (for a server: that it is listening, and its URL).`
    : `Rohan ran /tea; the question is the next message. Answer or explain it. ${outside} Read what you need, but change no files.`
}

// The main loop's turn that carries the errand's words.
export const isErrandTurn = (e: { text: string; agentId?: string }, errand: Errand | null): boolean =>
  errand !== null && !errand.isRunning && e.agentId === undefined && e.text === errand.text
