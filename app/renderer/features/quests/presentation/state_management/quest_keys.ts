import type { Priority } from '../../../../../../types'
import { useWindowKeys } from '../../../../core/widgets/window_keys'

export type QuestKey =
  | { kind: 'up' | 'down' | 'fold' | 'unfold' | 'playNext' | 'seal' | 'unseal' | 'partOf' | 'activeSaga' | 'remove' }
  | { kind: 'start' | 'finish' | 'back' | 'open' | 'yes' | 'notYet' | 'checkAgain' | 'cancel' }
  | { kind: 'priority'; priority: Priority }

const PRIORITY_KEYS: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']

const LETTERS: Record<string, QuestKey['kind']> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'fold',
  ArrowRight: 'unfold',
  f: 'playNext',
  k: 'seal',
  u: 'unseal',
  p: 'partOf',
  a: 'activeSaga',
  x: 'remove',
  Backspace: 'remove',
  s: 'start',
  d: 'finish',
  b: 'back',
  c: 'open',
  y: 'yes',
  n: 'notYet',
  r: 'checkAgain',
  Escape: 'cancel',
}

// A press inside a text field is typing, never a command.
export const isTyping = (target: EventTarget | null): boolean => {
  const element = target as HTMLElement | null

  return element !== null && (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName ?? '') || element.isContentEditable === true)
}

// What a key does on the board, or null when it does nothing there. The
// letters are the terminal's own.
export const questKeyOf = (event: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey'>): QuestKey | null => {
  if (event.key === 'Enter' && event.metaKey) return { kind: 'open' }
  if (event.metaKey || event.ctrlKey || event.altKey) return null
  const priority = PRIORITY_KEYS[Number(event.key) - 1]
  if (priority !== undefined) return { kind: 'priority', priority }
  const kind = LETTERS[event.key]

  return kind === undefined ? null : ({ kind } as QuestKey)
}

// A page answers false for a key it has no use for, so that key keeps its
// ordinary job, such as an arrow scrolling Home.
export const useQuestKeys = (isOn: boolean, onKey: (key: QuestKey) => boolean | void) => {
  useWindowKeys(event => {
    if (!isOn || isTyping(event.target)) return
    const key = questKeyOf(event)
    if (key !== null && onKey(key) !== false) event.preventDefault()
  })
}
