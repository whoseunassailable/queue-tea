// The menu's keys, one per action. On the list, 1–7 pick an entry; in a
// view, m goes back to the list. A row's own keys are 1–5 for its priority,
// f for Play next, k for Blocked…, u for Unblock, p for Part of…, a for
// Active feature and x for Remove; s starts the open row instead of the ★
// one, and k, p and a act on it instead of the current task.
export const KEYS = {
  'start-next': 's',
  'check-again': 'r',
  switch: 'w',
  continue: 'c',
  done: 'd',
  back: 'b',
  dismiss: 'o',
  yes: 'y',
  notYet: 'n',
  remove: 'x',
  retry: 'r',
  playNext: 'f',
  block: 'k',
  unblock: 'u',
  time: 't',
  menu: 'm',
  partOf: 'p',
  feature: 'a',
} as const
