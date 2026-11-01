import type { Difficulty, Task } from '../../../../../types'

export const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

export type Block = { waitFor: string } | { reason: string }

export const withBlock = (t: Task, block: Block | undefined): Task =>
  block === undefined
    ? t
    : 'waitFor' in block
      ? { ...t, blockedBy: t.blockedBy.includes(block.waitFor) ? t.blockedBy : [...t.blockedBy, block.waitFor] }
      : { ...t, blockedReason: block.reason }
