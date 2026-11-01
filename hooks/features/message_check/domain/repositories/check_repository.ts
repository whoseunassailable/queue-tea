import type { CheckAnswer } from '../../../../shared/assistant/domain/entities/check_answer'

// Asks whether a typed message belongs to the current task.
export type CheckRepository = {
  check: (prompt: string, timeoutMs: number) => Promise<CheckAnswer | null>
}
