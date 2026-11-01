import type { GitFacts, Task } from '../../../../../types'
import type { GitState } from '../entities/git_state'

// The project's repository.
export type GitRepository = {
  state: () => Promise<GitState>
  facts: () => Promise<GitFacts | null>
  head: () => Promise<{ commit: string; branch: string | null } | null>
  branches: () => Promise<string[]>
  make: (branch: string) => Promise<void>
  switchTo: (branch: string) => Promise<void>
  diffSince: (commit: string) => Promise<{ linesAdded: number; linesRemoved: number; filesTouched: number }>
  drift: (task: Task) => Promise<string[]>
  commitsBetween: (from: string, to: string) => Promise<string[]>
}
