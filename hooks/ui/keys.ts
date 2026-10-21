import type { Task } from '../../types'

export type ActionId =
  | 'start-next'
  | 'check-again'
  | 'switch'
  | 'continue'
  | 'done'
  | 'back'
  | 'block'
  | 'time'
  | 'dismiss'
  | 'close'

export type PaletteItem = { id: ActionId; hotkey: string; label: string; hint: string }

// The panel's keys, one per action. A row's own keys are 1–5 for its
// priority, f for Play next, k for Blocked…, u for Unblock and x for Remove;
// s starts the open row instead of the ★ one, and k blocks it instead of the
// current task.
export const KEYS = {
  'start-next': 's',
  'check-again': 'r',
  switch: 'w',
  continue: 'c',
  done: 'd',
  back: 'b',
  dismiss: 'o',
  close: 'p',
  yes: 'y',
  notYet: 'n',
  remove: 'x',
  retry: 'r',
  playNext: 'f',
  block: 'k',
  unblock: 'u',
  time: 't',
} as const

// What can be done now, for the palette, in the order it lists them.
export const paletteItems = (s: {
  current: Task | null
  next: Task | null
  hasHold: boolean
  hasMismatch: boolean
  canContinue: boolean
  isBusy: boolean
  hasWarning: boolean
  hasBacklog?: boolean
  budget?: string
}): PaletteItem[] => {
  const items: (PaletteItem | null)[] = [
    s.current === null && s.next !== null && !s.hasHold
      ? {
          id: 'start-next',
          hotkey: KEYS['start-next'],
          label: `Start ★ ${s.next.title}`,
          hint: 'Check git, make its branch, then start a fresh conversation',
        }
      : null,
    s.hasHold
      ? { id: 'check-again', hotkey: KEYS['check-again'], label: 'Check again', hint: 'Look at git again and start the held task' }
      : null,
    s.hasMismatch
      ? { id: 'switch', hotkey: KEYS.switch, label: 'Switch branch', hint: "Check out the current task's branch" }
      : null,
    s.current !== null && s.canContinue
      ? { id: 'continue', hotkey: KEYS.continue, label: 'Continue', hint: 'Carry on in a fresh conversation from the handoff note' }
      : null,
    s.current !== null
      ? { id: 'done', hotkey: KEYS.done, label: 'Done', hint: 'Say how hard it was, then log it as done' }
      : null,
    s.current !== null && !s.isBusy
      ? { id: 'back', hotkey: KEYS.back, label: 'Back to queue', hint: 'Save a checkpoint and put this task back in the backlog' }
      : null,
    s.current !== null && !s.isBusy
      ? { id: 'block', hotkey: KEYS.block, label: 'Blocked…', hint: 'Say what it waits for, save a checkpoint and set it aside' }
      : null,
    s.hasBacklog === true
      ? {
          id: 'time',
          hotkey: KEYS.time,
          label: `Time I have: ${s.budget ?? 'any'}`,
          hint: 'Suggest what fits: any, 30m, 1h or 2h',
        }
      : null,
    s.hasWarning
      ? { id: 'dismiss', hotkey: KEYS.dismiss, label: 'Dismiss the warning', hint: 'Hide the line about a commit made during a turn' }
      : null,
    { id: 'close', hotkey: KEYS.close, label: 'Close', hint: 'Back to the board' },
  ]

  return items.filter(item => item !== null)
}
