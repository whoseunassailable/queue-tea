import type { ProjectRecord, Task } from '../../../../../types'
import { addRequestUseCase } from '../../../../../hooks/features/tasks/domain/usecases/add_request'
import { leaveCodexUseCase } from '../../../../../hooks/features/tasks/domain/usecases/leave_codex'
import { sendToCodexUseCase } from '../../../../../hooks/features/tasks/domain/usecases/send_to_codex'
import { startParallelTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/start_parallel_task'
import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import { blockedText, isBlocked } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { codexBrief } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { checkNowUseCase } from '../../../../../hooks/shared/checkpoints/domain/usecases/check_now'
import type { GitState } from '../../../../../hooks/shared/git/domain/entities/git_state'
import { holdReason, slugBranch } from '../../../../../hooks/shared/git/domain/services/branch_rules'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import type { ContinueOutcome, GitHold, Handover, Reply, StartCheck, StartOutcome, StartStep } from '../../../../shared/engine_api'
import { COPY_LIMIT } from '../../../core/constants'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { focusCodex, openClaudeCode, openCodex } from '../data/claude_code'
import { holdCommandOf, holdKindOf } from '../domain/hold'
import { platformOf, questIdOf } from '../domain/task_input'
import { isSessionOpen, realmView, scopeOf } from './scope'
import type { Scope, TasksDeps } from './scope'

// A folder that has moved answers git like one that was never a repository,
// and Start would claim the quest with no branch.
const needFolder = async (d: TasksDeps, scope: Scope) => {
  if (!(await d.host.exists(scope.ctx.cwd))) throw new Refusal(MESSAGES.folderGone(scope.ctx.cwd))
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

const stepOf = async (d: TasksDeps, scope: Scope, task: Task, git: GitState): Promise<StartStep> => {
  if (!git.isRepo) return { kind: 'noRepo' }
  const branches = await scope.deps.git.branches()
  if (task.branch !== null && branches.includes(task.branch)) return { kind: 'switch', branch: task.branch }

  return { kind: 'make', branch: slugBranch(task.title, branches), from: (await worktreesRepositoryImpl(d.host, scope.ctx.projectPath).base()).branch }
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
    if (task === undefined || task.state !== 'queued') throw new Refusal(goneSentence(scope.record, id))
    if (isBlocked(task, tasks)) throw new Refusal(MESSAGES.sealedQuest(task.title, blockedText(task, tasks)))

    const git = await scope.deps.git.state()
    const reason = git.isRepo ? null : holdReason(git)

    return reason === null ? { kind: 'clear', step: await stepOf(d, scope, task, git) } : { kind: 'held', hold: await holdOf(scope, git, reason) }
  })

// The session gets the quest through the record, and a session opened now finds
// the request waiting there. The quest has started by this point, so a request
// that fails to save only means Continue in the terminal.
const handOver = async (d: TasksDeps, scope: Scope, taskId: string, started: ProjectRecord): Promise<{ record: ProjectRecord; handover: Handover }> => {
  const isOpen = await isSessionOpen(d, scope.ctx.cwd)
  let record = started
  try {
    const asked = await addRequestUseCase(scope.deps, scope.ctx, 'begin', taskId)
    if (asked !== 'unreadable') record = asked
  } catch (err) {
    d.log.error('asking a session to begin failed', err)
  }

  return { record, handover: isOpen ? { kind: 'session' } : await openClaudeCode(d, scope.ctx.cwd, false) }
}

// Codex opens with the brief; no session is asked, since Claude Code isn't on it.
const toCodex = async (d: TasksDeps, scope: Scope, task: Task): Promise<Handover> => {
  const checked = await checkNowUseCase(scope.deps.git, text => d.log.debug(text), task)

  return openCodex(d, scope.ctx.cwd, task.id, codexBrief(task, scope.ctx.cwd, checked))
}

export const startQuest = (d: TasksDeps, key: unknown, taskId: unknown, platform: unknown): Promise<Reply<StartOutcome>> =>
  reply(d.log, MESSAGES.startQuest, async () => {
    const scope = await scopeOf(d, key)
    await needFolder(d, scope)
    const id = questIdOf(taskId)
    const on = platformOf(platform)
    const result = await startParallelTaskUseCase({ ...scope.deps, worktrees: worktreesRepositoryImpl(d.host, scope.ctx.projectPath) }, scope.ctx, id, on)
    if (result.kind === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
    if (result.kind === 'gone') throw new Refusal(goneSentence(scope.record, id))
    if (result.kind === 'blocked' || result.kind === 'refused') throw new Refusal(inGameWords(result.notice))
    if (result.kind === 'held') return { kind: 'held', hold: await holdOf(scope, await scope.deps.git.state(), result.text) }
    if (result.kind === 'branch_failed') {
      const git = await scope.deps.git.state()

      return { kind: 'held', hold: { kind: 'branch', reason: result.text, branch: git.branch, head: git.head, files: [], fileCount: 0, command: null } }
    }

    const startedScope = await scopeOf(d, key, id)
    const { record, handover } = on === 'codex' ? { record: result.record, handover: await toCodex(d, startedScope, result.task) } : await handOver(d, startedScope, id, result.record)

    const latest = await scope.deps.records.read()

    return {
      kind: 'started',
      view: await realmView(d, scope.key, latest === 'unreadable' ? record : latest),
      branch: result.task.branch,
      notice: result.notice === null ? null : inGameWords(result.notice),
      handover,
    }
  })

// A quest with Codex only brings its terminal forward: Codex can't be found
// running from here, and a second one must not start.
export const openClaude = (d: TasksDeps, key: unknown, taskId?: unknown): Promise<Reply<Handover>> =>
  reply(d.log, MESSAGES.openClaude, async () => {
    const initial = await scopeOf(d, key)
    const task = taskId === undefined ? currentTask(initial.record.tasks) : initial.record.tasks.find(t => t.id === questIdOf(taskId)) ?? null
    if (taskId !== undefined && task?.state !== 'current') throw new Refusal(MESSAGES.notActiveMove)
    const selected = await scopeOf(d, key, task?.id)
    await needFolder(d, selected)
    const { ctx } = selected
    if (task !== null && task.codexSince !== null) return focusCodex(d, ctx.cwd, codexBrief(task, ctx.cwd, null))

    return openClaudeCode(d, ctx.cwd, await isSessionOpen(d, ctx.cwd))
  })

const isClaudeWorking = async (d: TasksDeps, scope: Scope): Promise<boolean> => {
  const sessions = await sessionsRepositoryImpl(d.host, d.home).list()

  return sessions.some(s => (s.workingPath ?? s.projectPath) === scope.ctx.cwd && isFresh(s, d.now()) && s.isTurnRunning)
}

// The quest in hand moves to Codex, refused while Claude Code's turn runs so
// the two never work at once; or comes back to Claude Code with its time on
// Codex, handed over the way Start hands it.
export const continueIn = (d: TasksDeps, key: unknown, taskId: unknown, platform: unknown): Promise<Reply<ContinueOutcome>> =>
  reply(d.log, MESSAGES.continueIn, async () => {
    const scope = await scopeOf(d, key, taskId)
    await needFolder(d, scope)
    const id = questIdOf(taskId)
    const to = platformOf(platform)
    const task = scope.record.tasks.find(t => t.id === id)
    if (task?.state !== 'current') throw new Refusal(MESSAGES.notActiveMove)

    if (to === 'codex') {
      if (await isClaudeWorking(d, scope)) throw new Refusal(MESSAGES.claudeWorking(task.title))
      const saved = await sendToCodexUseCase(scope.deps, scope.ctx, id)
      if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

      return { view: await realmView(d, scope.key, saved), handover: await toCodex(d, scope, saved.tasks.find(t => t.id === id) ?? task), isCodexTimeLost: false }
    }

    const isCodexTimeLost = await leaveCodexUseCase(scope.deps, scope.ctx, id)
    const back = await scope.deps.records.read()
    if (back === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
    const { record, handover } = await handOver(d, scope, id, back)

    return { view: await realmView(d, scope.key, record), handover, isCodexTimeLost }
  })

export const copyText = (d: TasksDeps, text: unknown): Promise<Reply<null>> =>
  reply(d.log, MESSAGES.copyText, async () => {
    if (typeof text !== 'string' || text === '' || text.length > COPY_LIMIT) throw new Refusal(MESSAGES.badValue)
    d.copy(text)

    return null
  })
