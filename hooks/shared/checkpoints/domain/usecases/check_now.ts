import type { Task } from '../../../../../types'
import type { GitRepository } from '../../../git/domain/repositories/git_repository'
import { checkLines } from '../services/checkpoints'

// What the repository says now, beside the task's checkpoint; null for a
// task with nothing saved yet, or when git can't be read.
export const checkNowUseCase = async (git: GitRepository, log: (text: string) => void, task: Task): Promise<string[] | null> => {
  if (task.handoff === null && task.checkpoint === null) return null
  try {
    const now = await git.facts()
    const drift = now === null ? [] : await git.drift(task)

    return checkLines(task, now, drift)
  } catch (err) {
    log(`checking the repository failed: ${err instanceof Error ? err.message : String(err)}`)

    return null
  }
}
