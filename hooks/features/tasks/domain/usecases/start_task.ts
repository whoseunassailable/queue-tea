import type { Platform, ProjectRecord, Task } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { blockedText, isBlocked } from '../../../../shared/backlog/domain/services/ranking'
import { holdReason, slugBranch } from '../../../../shared/git/domain/services/branch_rules'
import type { Saved } from '../../../../shared/records/domain/repositories/records_repository'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'

const NOT_A_REPO = 'Not a git repository, so no branches are made'

export type StartResult =
  | { kind: 'unreadable' }
  | { kind: 'gone' }
  | { kind: 'blocked'; notice: string }
  | { kind: 'held'; text: string }
  | { kind: 'refused'; notice: string; record: ProjectRecord }
  | { kind: 'branch_failed'; text: string; notice: string | null; record: Saved }
  | { kind: 'started'; task: Task; notice: string | null; record: ProjectRecord }

// The git check, then the claim, then the branch.
export const startTaskUseCase = async (d: Deps, ctx: Ctx, taskId: string, platform: Platform = 'claude'): Promise<StartResult> => {
  const record = await d.records.read()
  if (record === 'unreadable') return { kind: 'unreadable' }
  const task = record.tasks.find(t => t.id === taskId)
  if (task === undefined || task.state !== 'queued' || currentTask(record.tasks) !== null) return { kind: 'gone' }
  if (isBlocked(task, record.tasks)) {
    return { kind: 'blocked', notice: `${task.title} is blocked: ${blockedText(task, record.tasks)}. Unblock it first.` }
  }

  const git = await d.git.state()
  const reason = holdReason(git)
  if (reason !== null) return { kind: 'held', text: reason }

  // A task put back in the queue goes on on its own branch; one whose branch
  // is gone starts again on a new one from here.
  let branch: string | null = null
  let isResumed = false
  if (git.isRepo) {
    const branches = await d.git.branches()
    isResumed = task.branch !== null && branches.includes(task.branch)
    branch = isResumed ? task.branch! : slugBranch(task.title, branches)
  }
  // The commit in full, so a rebase or a reset of the branch can be told.
  const head = git.isRepo && !isResumed ? ((await d.git.head())?.commit ?? git.head) : null
  const started = isoLocal(await d.env.now(), ctx.offsetMinutes)

  // The task is claimed before git is touched, against the record as it is
  // now: another session may have started a task since it was read.
  let refused = null as string | null
  let before = task
  const saved = await d.records.update(r => {
    const fresh = r.tasks.find(t => t.id === taskId)
    const other = currentTask(r.tasks)
    refused =
      fresh === undefined || (fresh.state !== 'queued' && fresh.state !== 'current')
        ? `${task.title} is no longer in the backlog.`
        : other !== null
          ? other.id === taskId
            ? `${task.title} was started already, maybe in another session.`
            : `${other.title} was started first, maybe in another session, so ${task.title} waits in the backlog.`
          : isBlocked(fresh, r.tasks)
            ? `${task.title} is blocked: ${blockedText(fresh, r.tasks)}. Unblock it first.`
            : null
    if (refused !== null || fresh === undefined) return r
    before = fresh

    return {
      ...r,
      playNext: r.playNext === taskId ? null : r.playNext,
      tasks: r.tasks.map(t =>
        t.id !== taskId
          ? t
          : {
              ...t,
              state: 'current',
              codexSince: platform === 'codex' ? started : null,
              started: t.started ?? started,
              branch,
              baseBranch: isResumed ? t.baseBranch : git.isRepo ? git.branch : null,
              startCommit: isResumed ? t.startCommit : head,
            },
      ),
    }
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (refused !== null) return { kind: 'refused', notice: refused, record: saved }

  if (branch === null) return { kind: 'started', task: saved.tasks.find(t => t.id === taskId)!, notice: NOT_A_REPO, record: saved }

  const notice = task.branch !== null && !isResumed ? `${task.branch} was gone, so this task starts again on ${branch}, made from ${git.branch}.` : null
  try {
    if (isResumed && git.branch !== branch) await d.git.switchTo(branch)
    else if (!isResumed) await d.git.make(branch)
  } catch (err) {
    d.env.log(`${isResumed ? 'switching to' : 'making'} ${branch} failed: ${err instanceof Error ? err.message : String(err)}`)
    // The claim is taken back, so the task waits as it was.
    const wasNext = record.playNext === taskId
    const verb = isResumed ? 'switch to' : 'make'
    let undone: Saved
    try {
      undone = await d.records.update(r => ({
        ...r,
        playNext: wasNext && r.playNext === null ? taskId : r.playNext,
        tasks: r.tasks.map(t =>
          t.id === taskId && t.state === 'current'
            ? {
                ...t,
                state: 'queued',
                codexSince: null,
                started: before.started,
                branch: before.branch,
                baseBranch: before.baseBranch,
                startCommit: before.startCommit,
              }
            : t,
        ),
      }))
    } catch (undoErr) {
      // The file keeps the claim, so the task shows as current. Check again
      // would find it not queued and only clear the line, so it isn't offered.
      d.env.log(`taking back ${task.title} failed: ${undoErr instanceof Error ? (undoErr.stack ?? undoErr.message) : String(undoErr)}`)

      return { kind: 'refused', notice: `Couldn't ${verb} the branch ${branch} or put ${task.title} back in the queue. Press Back to queue to try again.`, record: saved }
    }

    return { kind: 'branch_failed', text: `Couldn't ${verb} the branch ${branch}. Check again to retry.`, notice, record: undone }
  }

  return { kind: 'started', task: saved.tasks.find(t => t.id === taskId)!, notice, record: saved }
}
