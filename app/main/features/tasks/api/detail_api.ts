import type { Task } from '../../../../../types'
import { cardNote } from '../../../../../hooks/shared/checkpoints/domain/services/card_note'
import { slugBranch } from '../../../../../hooks/shared/git/domain/services/branch_rules'
import { dayKey } from '../../../../../hooks/shared/time/domain/services/time'
import type { ActiveFacts, ManaLines, QuestFacts, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { questIdOf } from '../domain/task_input'
import { scopeOf } from './scope'
import type { Scope, TasksDeps } from './scope'

const SHORT_COMMIT = 7

// Each of these is a line on a pane. Git failing here says nothing about the
// quest, so the line is left out and the rest stands.
const quietly = async <T>(d: TasksDeps, what: string, read: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await read()
  } catch (err) {
    d.log.warn(`${what} failed: ${err instanceof Error ? err.message : String(err)}`)

    return fallback
  }
}

// Measured now, uncommitted work included.
export const linesSince = (d: TasksDeps, { deps }: Scope, since: string | null): Promise<ManaLines | null> =>
  since === null
    ? Promise.resolve(null)
    : quietly(
        d,
        'measuring the lines',
        async () => {
          const diff = await deps.git.diffSince(since)

          return { added: diff.linesAdded, removed: diff.linesRemoved, since: since.slice(0, SHORT_COMMIT) }
        },
        null,
      )

const gitOf = (d: TasksDeps, { deps }: Scope): Promise<ActiveFacts['git']> =>
  quietly(
    d,
    'reading git',
    async () => {
      const facts = await deps.git.facts()
      if (facts === null) return null

      return { branch: facts.branch, head: facts.head, uncommitted: facts.uncommitted, uncommittedCount: (await deps.git.state()).uncommitted }
    },
    null,
  )

const activeOf = async (d: TasksDeps, scope: Scope, task: Task): Promise<ActiveFacts> => ({
  minutes: Object.values(task.minutesByDay).reduce((sum, m) => sum + m, 0),
  today: task.minutesByDay[dayKey(d.now(), d.offsetMinutes())] ?? 0,
  started: task.started,
  understandingMessages: task.effort.understandingMessages,
  improvingMessages: task.effort.improvingMessages,
  filesRead: task.effort.filesRead,
  filesChanged: task.effort.filesChanged,
  lines: await linesSince(d, scope, task.startCommit),
  git: await gitOf(d, scope),
})

// The name Start would give it. A branch that has gone counts as none, as it
// does for Start.
const branchToBe = (d: TasksDeps, { deps }: Scope, task: Task): Promise<string | null> =>
  task.state !== 'queued'
    ? Promise.resolve(null)
    : quietly(
        d,
        'naming the branch',
        async () => {
          if (!(await deps.git.state()).isRepo) return null
          const branches = await deps.git.branches()

          return task.branch !== null && branches.includes(task.branch) ? null : slugBranch(task.title, branches)
        },
        null,
      )

export const readQuestFacts = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<QuestFacts>> =>
  reply(d.log, MESSAGES.readQuestFacts, async () => {
    const scope = await scopeOf(d, key, taskId)
    const id = questIdOf(taskId)
    const task = scope.record.tasks.find(t => t.id === id)
    if (task === undefined) throw new Refusal(MESSAGES.badQuest)

    return {
      note: cardNote(task),
      messages: task.messages,
      branchToBe: await branchToBe(d, scope, task),
      active: task.state === 'current' ? await activeOf(d, scope, task) : null,
    }
  })
