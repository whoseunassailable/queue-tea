import type { Difficulty, Task } from '../../../../../types'

export const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

export type Block = { waitFor: string } | { reason: string }

export const withBlock = (t: Task, block: Block | undefined): Task =>
  block === undefined
    ? t
    : 'waitFor' in block
      ? { ...t, blockedBy: t.blockedBy.includes(block.waitFor) ? t.blockedBy : [...t.blockedBy, block.waitFor] }
      : { ...t, blockedReason: block.reason }

// The file a task log path names, or null when it would leave the project. One
// project's log never lands in another, however the path is written.
export const logFileIn = (projectPath: string, logPath: string): string | null => {
  const root = projectPath.replace(/\/+$/, '')
  const parts: string[] = []
  for (const part of (logPath.startsWith('/') ? logPath : `${root}/${logPath}`).split('/')) {
    if (part === '..') parts.pop()
    else if (part !== '' && part !== '.') parts.push(part)
  }
  const file = `/${parts.join('/')}`

  return file.startsWith(`${root}/`) ? file : null
}
