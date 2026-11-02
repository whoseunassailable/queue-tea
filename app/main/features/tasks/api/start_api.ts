import type { ProjectRecord, Task } from '../../../../../types'
import { addRequestUseCase } from '../../../../../hooks/features/tasks/domain/usecases/add_request'
import { startTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/start_task'
import { blockedText, isBlocked } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import type { GitState } from '../../../../../hooks/shared/git/domain/entities/git_state'
import { holdReason, slugBranch } from '../../../../../hooks/shared/git/domain/services/branch_rules'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import type { GitHold, Handover, Reply, StartCheck, StartOutcome, StartStep } from '../../../../shared/engine_api'
import { COPY_LIMIT } from '../../../core/constants'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { openClaudeCode } from '../data/claude_code'
import { holdCommandOf, holdKindOf } from '../domain/hold'
import { questIdOf } from '../domain/task_input'
import { isSessionOpen, realmView, scopeOf } from './scope'
import type { Scope, TasksDeps } from './scope'

// A folder that has moved answers git like one that was never a repository,
// and Start would claim the quest with no branch.
const needFolder = async (d: TasksDeps, scope: Scope) => {
  if (!(await d.host.exists(scope.ctx.projectPath))) throw new Refusal(MESSAGES.folderGone(scope.ctx.projectPath))
}

const holdOf = async (scope: Scope, git: GitState, reason: string): Promise<GitHold> => ({
  kind: holdKindOf(git),
  reason,
  branch: git.branch,
  head: git.head,
  files: git.uncommitted > 0 ? ((await scope.deps.git.facts())?.uncommitted ?? []) : [],
  fileCount: git.uncommitted,
  command: holdCommandOf(git),
})

const stepOf = async (scope: Scope, task: Task, git: GitState): Promise<StartStep> => {
  if (!git.isRepo) return { kind: 'noRepo' }
  const branches = await scope.deps.git.branches()
  if (task.branch !== null && branches.includes(task.branch)) return { kind: 'switch', branch: task.branch }

  return { kind: 'make', branch: slugBranch(task.title, branches), from: git.branch }
}

const goneSentence = (record: ProjectRecord, taskId: string): string => {
  const other = currentTask(record.tasks)
  const task = record.tasks.find(t => t.id === taskId)

  return other === null || task === undefined || other.id === taskId ? MESSAGES.questGone : MESSAGES.startedFirst(other.title, task.title)
}

// What Start would do, changing nothing: the hold, or the step to name while
// it runs. Check again is this call again.
export const checkStart = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<StartCheck>> =>
  reply(d.log, MESSAGES.checkStart, async () => {
    const scope = await scopeOf(d, key)
    await needFolder(d, scope)
    const id = questIdOf(taskId)
    const { tasks } = scope.record
    const task = tasks.find(t => t.id === id)
    if (task === undefined || task.state !== 'queued' || currentTask(tasks) !== null) throw new Refusal(goneSentence(scope.record, id))
    if (isBlocked(task, tasks)) throw new Refusal(MESSAGES.sealedQuest(task.title, blockedText(task, tasks)))

    const git = await scope.deps.git.state()
    const reason = holdReason(git)

    return reason === null ? { kind: 'clear', step: await stepOf(scope, task, git) } : { kind: 'held', hold: await holdOf(scope, git, reason) }
  })

// The session gets the quest through the record, and a session opened now finds
// the request waiting there. The quest has started by this point, so a request
// that fails to save only means Continue in the terminal.
const handOver = async (d: TasksDeps, scope: Scope, taskId: string, started: ProjectRecord): Promise<{ record: ProjectRecord; handover: Handover }> => {
  const isOpen = await isSessionOpen(d, scope.ctx.projectPath)
  let record = started
  try {
    const asked = await addRequestUseCase(scope.deps, scope.ctx, 'begin', taskId)
    if (asked !== 'unreadable') record = asked
  } catch (err) {
    d.log.error('asking a session to begin failed', err)
  }

  return { record, handover: isOpen ? { kind: 'session' } : await openClaudeCode(d, scope.ctx.projectPath, false) }
}

export const startQuest = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<StartOutcome>> =>
  reply(d.log, MESSAGES.startQuest, async () => {
    const scope = await scopeOf(d, key)
    await needFolder(d, scope)
    const id = questIdOf(taskId)
    const result = await startTaskUseCase(scope.deps, scope.ctx, id)
    if (result.kind === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
    if (result.kind === 'gone') throw new Refusal(goneSentence(scope.record, id))
    if (result.kind === 'blocked' || result.kind === 'refused') throw new Refusal(inGameWords(result.notice))
    if (result.kind === 'held') return { kind: 'held', hold: await holdOf(scope, await scope.deps.git.state(), result.text) }
    if (result.kind === 'branch_failed') {
      const git = await scope.deps.git.state()

      return { kind: 'held', hold: { kind: 'branch', reason: result.text, branch: git.branch, head: git.head, files: [], fileCount: 0, command: null } }
    }

    const { record, handover } = await handOver(d, scope, id, result.record)

    return {
      kind: 'started',
      view: await realmView(d, scope.key, record),
      branch: result.task.branch,
      notice: result.notice === null ? null : inGameWords(result.notice),
      handover,
    }
  })

export const openClaude = (d: TasksDeps, key: unknown): Promise<Reply<Handover>> =>
  reply(d.log, MESSAGES.openClaude, async () => {
    const { ctx } = await scopeOf(d, key)

    return openClaudeCode(d, ctx.projectPath, await isSessionOpen(d, ctx.projectPath))
  })

export const copyText = (d: TasksDeps, text: unknown): Promise<Reply<null>> =>
  reply(d.log, MESSAGES.copyText, async () => {
    if (typeof text !== 'string' || text === '' || text.length > COPY_LIMIT) throw new Refusal(MESSAGES.badValue)
    d.copy(text)

    return null
  })
