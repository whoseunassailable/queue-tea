import type { Platform, Task } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { blockedText, isBlocked } from '../../../../shared/backlog/domain/services/ranking'
import type { WorktreesRepository } from '../../../../shared/git/domain/repositories/worktrees_repository'
import { slugBranch } from '../../../../shared/git/domain/services/branch_rules'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'
import type { StartResult } from './start_task'
import { startTaskUseCase } from './start_task'

type ParallelDeps = Deps & { worktrees: WorktreesRepository }

// The app starts each new quest in its own worktree. Existing checkouts and
// uncommitted work in them do not block another quest or change underneath it.
export const startParallelTaskUseCase = async (d: ParallelDeps, ctx: Ctx, taskId: string, platform: Platform): Promise<StartResult> => {
  const record = await d.records.read()
  if (record === 'unreadable') return { kind: 'unreadable' }
  const task = record.tasks.find(t => t.id === taskId)
  if (task?.state !== 'queued') return { kind: 'gone' }
  if (isBlocked(task, record.tasks)) return { kind: 'blocked', notice: `${task.title} is blocked: ${blockedText(task, record.tasks)}. Unblock it first.` }
  if (!(await d.git.state()).isRepo) return startTaskUseCase(d, ctx, taskId, platform)

  const [base, branches, checkouts] = await Promise.all([d.worktrees.base(), d.git.branches(), d.worktrees.list()])
  const resumed = task.branch !== null && branches.includes(task.branch)
  const existing = resumed ? checkouts.find(w => w.branch === task.branch) : undefined
  // A legacy task can resume in the project's checkout. Another task there
  // must first release it; no branch is ever checked out over somebody's work.
  if (existing && existing.path !== task.worktreePath && existing.path !== ctx.projectPath) {
    return { kind: 'held', text: 'This branch is already open in another folder. Open that checkout or put its quest back before trying again.' }
  }
  const key = ctx.file.slice(ctx.file.lastIndexOf('/') + 1).replace(/\.json$/, '')
  const started = isoLocal(await d.env.now(), ctx.offsetMinutes)
  let claimed: Task | null = null
  let refusal: string | null = null
  const saved = await d.records.update(r => {
    const fresh = r.tasks.find(t => t.id === taskId)
    if (fresh?.state !== 'queued') { refusal = 'That quest was already started or removed.'; return r }
    if (isBlocked(fresh, r.tasks)) { refusal = 'That quest is blocked. Unblock it first.'; return r }
    const branch = resumed ? task.branch! : slugBranch(fresh.title, [...branches, ...r.tasks.flatMap(t => t.branch === null ? [] : [t.branch])])
    const folder = existing?.path ?? fresh.worktreePath ?? `${ctx.home}/.queue-tea/worktrees/${key}/${branch.replace(/^task\//, '')}`
    if (r.tasks.some(t => t.state === 'current' && (t.worktreePath ?? ctx.projectPath) === folder)) {
      refusal = 'Another quest is already using this checkout. Put it back first.'
      return r
    }
    claimed = { ...fresh, state: 'current', branch, baseBranch: resumed ? fresh.baseBranch ?? base.branch : base.branch, startCommit: resumed ? fresh.startCommit : base.commit, worktreePath: folder === ctx.projectPath ? null : folder, started: fresh.started ?? started, review: null, codexSince: platform === 'codex' ? started : null }

    return { ...r, version: 2, playNext: r.playNext === taskId ? null : r.playNext, tasks: r.tasks.map(t => t.id === taskId ? claimed! : t) }
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (refusal !== null || claimed === null) return { kind: 'refused', notice: refusal ?? 'The quest could not be started. Try again.', record: saved }
  const startedTask = claimed as Task
  try {
    if (existing === undefined) await d.worktrees.create(startedTask.worktreePath!, startedTask.branch!, base.branch, !resumed)
  } catch (err) {
    d.env.log(`making the quest worktree failed: ${err instanceof Error ? err.stack ?? err.message : String(err)}`)
    const undone = await d.records.update(r => ({ ...r, playNext: record.playNext === taskId && r.playNext === null ? taskId : r.playNext, tasks: r.tasks.map(t => t.id === taskId && t.worktreePath === startedTask.worktreePath && t.state === 'current' ? { ...t, state: 'queued', branch: task.branch, baseBranch: task.baseBranch, startCommit: task.startCommit, worktreePath: task.worktreePath, started: task.started, codexSince: null } : t) }))

    return { kind: 'branch_failed', text: 'The quest folder could not be created. Check its branch and folder, then try again.', notice: null, record: undone }
  }

  return { kind: 'started', task: startedTask, record: saved, notice: task.branch !== null && !resumed ? `${task.branch} was gone, so this task starts again on ${startedTask.branch}, made from ${base.branch}.` : null }
}
