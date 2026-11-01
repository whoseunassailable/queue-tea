import type { Difficulty, Priority } from '../../../../../types'

export type DocsRow = {
  title: string
  priority: Priority
  expected: Difficulty
  actual: Difficulty
  minutes: number
  branch: string | null
}

// The project's log of finished tasks.
export type TaskLogRepository = {
  add: (logPath: string, row: DocsRow, day: string) => Promise<void>
}
