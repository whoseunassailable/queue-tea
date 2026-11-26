import type { Difficulty, Intent } from '../../../../../types'

export type CheckAnswer = {
  // command: an operational ask (run, push, open, show), neither a change nor work to queue.
  kind: 'same' | 'new' | 'quick' | 'command' | 'unsure'
  intent: Intent
  title?: string
  difficulty?: Difficulty
  // For new work: the id of the feature it is part of, 'none' or 'unsure'.
  parent?: string
}
