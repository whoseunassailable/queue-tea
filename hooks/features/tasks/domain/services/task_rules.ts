import type { Difficulty, HelperId, Task } from '../../../../../types'
import { criteriaSetsOf } from '../../../../shared/backlog/domain/services/families'
import { routeHelpers } from '../../../../shared/records/domain/services/helper_policy'

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

// The helper Claude must run before asking Rohan: Tea-DD first, then Commit
// Chai-n, of those the quest's route runs. A Quick change skips Tea-DD, since
// Claude runs its checks itself.
export const helperToRemind = (t: Task): HelperId | null => {
  const { run } = routeHelpers(t)

  return (['tea-dd', 'commit-chai-n'] as const).find(id => run.includes(id) && !t.helpers.ran.includes(id)) ?? null
}

// Claude's account of the acceptance criteria at the done question: one entry
// per criterion, in the brief's order, each saying whether it is met and what
// shows it. Writing the code is not evidence, so a call that leaves one out is
// turned back every time. The count must match too: answers are matched by
// position, so a stale list would shift every answer onto the wrong criterion.
export type CriteriaAnswer =
  | { kind: 'none' }
  | { kind: 'refused'; lines: string[]; given: number; missing: number[] }
  | { kind: 'answered'; total: number; unmet: { n: number; why: string }[] }

export const criteriaAnswer = (task: Task, tasks: Task[], answers: unknown): CriteriaAnswer => {
  const lines = criteriaSetsOf(task, tasks).flatMap(set => set.lines)
  if (lines.length === 0) return { kind: 'none' }
  const given = Array.isArray(answers) ? (answers as unknown[]) : []
  const read = lines.map((_, i) => entryOf(given[i]))
  const missing = read.flatMap((entry, i) => (entry === null ? [i + 1] : []))
  if (missing.length > 0 || given.length !== lines.length) return { kind: 'refused', lines, given: given.length, missing }

  return { kind: 'answered', total: lines.length, unmet: read.flatMap((entry, i) => (entry === null || entry.met ? [] : [{ n: i + 1, why: entry.evidence }])) }
}

const entryOf = (value: unknown): { met: boolean; evidence: string } | null => {
  if (typeof value !== 'object' || value === null) return null
  const { met, evidence } = value as Record<string, unknown>

  return typeof met === 'boolean' && typeof evidence === 'string' && evidence.trim() !== '' ? { met, evidence: evidence.trim() } : null
}
