import type { Difficulty, Intent } from '../../../../../types'

export type CheckAnswer = {
  kind: 'same' | 'new' | 'quick' | 'unsure'
  intent: Intent
  title?: string
  difficulty?: Difficulty
  // For new work: the id of the feature it is part of, 'none' or 'unsure'.
  parent?: string
}
