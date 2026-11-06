import { randomUUID } from 'node:crypto'
import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import type { BranchGraph, BranchReview, CompleteRequest, MergeOperation, MergeRequest, MergeWorkspace, ResolveRequest } from '../../../../shared/branches'
import type { Reply } from '../../../../shared/engine_api'
import { Refusal, reply } from '../../../core/reply'
import { questIdOf } from '../../tasks/domain/task_input'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps, Scope } from '../../tasks/api/scope'
import { BRANCH_LIMITS, BRANCH_TEXT } from '../domain/constants'
import { isBranch } from '../domain/git_rules'
import { ancestor, gitIn, graphOf, headOf, reviewOf } from '../data/branch_source'
import { conflictEntries, safeResolutionPath, workspaceOf, workspacePath } from '../data/merge_workspace'
import { loadOperation, operationsOf, saveOperation, withBranchLock } from '../data/operation_store'
import { argvOf } from '../data/user_git'
import { readCommitProgress } from '../data/commit_progress'
import { liveOutput } from '../data/live_output'
import type { UserGit, UserGitAction } from '../data/user_git'

export type BranchDeps = TasksDeps & { userGit: UserGit; reveal?: (path: string) => void; published?: (repo: string, remote: string, branch: string, commit: string) => Promise<void> }
export const requestOf = (input: unknown): MergeRequest => {
  const r = input as Partial<MergeRequest> | null
  if (!r || !isBranch(r.target) || typeof r.fingerprint !== 'string') throw new Refusal(BRANCH_TEXT.invalid)
  return { taskId: questIdOf(r.taskId), target: r.target, fingerprint: r.fingerprint, idleConfirmed: r.idleConfirmed === true }
}
export const taskOf = (scope: Scope, id: unknown) => {
  const task = scope.record.tasks.find(t => t.id === questIdOf(id))
  if (!task?.branch) throw new Refusal(BRANCH_TEXT.missing)
  return task
}
export const messageOf = (input: unknown): string => {
  if (typeof input !== 'string' || !input.trim() || input.length > BRANCH_LIMITS.message || input.includes('\0')) throw new Refusal(BRANCH_TEXT.message)
  return input.trim()
}
export const freshReview = async (d: TasksDeps, scope: Scope, request: MergeRequest, allowDirty = false) => {
  if (!request.idleConfirmed) throw new Refusal(BRANCH_TEXT.idle)
  const review = await reviewOf(d, scope, taskOf(scope, request.taskId), request.target)
  if (review.fingerprint !== request.fingerprint) throw new Refusal(BRANCH_TEXT.stale)
  if (review.blocked && !(allowDirty && (review.blocked === BRANCH_TEXT.dirty || review.blocked === BRANCH_TEXT.noMerge))) throw new Refusal(review.blocked)
  return review
}
export const runStep = async (d: BranchDeps, op: MergeOperation, cwd: string, action: UserGitAction) => {
  const event = { at: d.now(), command: `git ${argvOf(action).map(a => /\s/.test(a) ? JSON.stringify(a) : a).join(' ')}`, status: 'running' as const, output: '' }
  op.events.push(event)
  await saveOperation(d, op)
  const index = op.events.length - 1
  const stream = liveOutput(async (output, truncated) => {
    op.events[index] = { ...event, output, truncated }
    await saveOperation(d, op)
  })
  let result
  try { result = await d.userGit(cwd, action, stream.append) } catch (err) {
    await stream.flush(); op.events[index] = { ...op.events[index]!, status: 'failed', finished: d.now() }; await saveOperation(d, op); throw err
  } finally { await stream.flush() }
  const streamed = op.events[index]!
  op.events[index] = { ...streamed, finished: d.now(), exitCode: result.exitCode, status: result.exitCode === 0 ? 'succeeded' : 'failed', output: streamed.output || (result.stdout + result.stderr).slice(-BRANCH_LIMITS.output) }
  await saveOperation(d, op)
  return result
}
export const readBranches = (d: TasksDeps, key: unknown): Promise<Reply<BranchGraph>> => reply(d.log, BRANCH_TEXT.read, async () => graphOf(d, await scopeOf(d, key)))
export const readBranch = (d: TasksDeps, key: unknown, id: unknown, target: unknown): Promise<Reply<BranchReview>> => reply(d.log, BRANCH_TEXT.read, async () => {
  const scope = await scopeOf(d, key); const task = taskOf(scope, id)
  const selected = target === null || target === undefined ? task.baseBranch ?? 'main' : target
  if (!isBranch(selected)) throw new Refusal(BRANCH_TEXT.invalid)
  const review = await reviewOf(d, scope, task, selected)
  review.commitProgress = await readCommitProgress(d, scope.key, task.id)
  const ops = await operationsOf(d, scope.key)
  review.operation = ops.find(o => o.taskId === task.id && o.target === selected && o.stage !== 'abandoned') ?? null
  return review
})
export const readMergeWorkspace = (d: TasksDeps, key: unknown, id: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.read, async () => {
  const scope = await scopeOf(d, key)
  return workspaceOf(d, scope.ctx.projectPath, await loadOperation(d, scope.key, id))
})

export const prepareMerge = (d: BranchDeps, key: unknown, input: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const initial = await scopeOf(d, key); const request = requestOf(input)
  return withBranchLock(d, initial.key, async () => {
    const scope = await scopeOf(d, key)
    const review = await freshReview(d, scope, request)
    const retained = (await operationsOf(d, scope.key)).find(o => o.target === request.target && !['merged', 'abandoned'].includes(o.stage))
    if (retained) {
      if (retained.taskId === request.taskId && retained.sourceHead === review.sourceHead && retained.targetHead === review.targetHead) return workspaceOf(d, scope.ctx.projectPath, retained)
      throw new Refusal(BRANCH_TEXT.reserved)
    }
    const op: MergeOperation = { version: 1, id: randomUUID(), key: scope.key, taskId: request.taskId, source: review.source, target: review.target, sourceHead: review.sourceHead, targetHead: review.targetHead,
      created: d.now(), stage: 'preparing', tree: null, commit: null, message: null, events: [], published: null }
    await saveOperation(d, op)
    const folder = workspacePath(d, op)
    try {
      await gitIn(d, scope.ctx.projectPath)(['worktree', 'add', '--detach', folder, op.targetHead])
      await runStep(d, op, folder, { kind: 'prepare', source: op.sourceHead })
      const workspace = await workspaceOf(d, scope.ctx.projectPath, op)
      await saveOperation(d, workspace.operation)
      return workspace
    } catch (err) {
      op.stage = 'failed'; await saveOperation(d, op); throw err
    }
  })
})

export const resolveMergeFile = (d: BranchDeps, key: unknown, input: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const initial = await scopeOf(d, key); const r = input as ResolveRequest | null
  if (!r || typeof r.path !== 'string' || !['base', 'target', 'source', 'edited'].includes(r.choice)) throw new Refusal(BRANCH_TEXT.invalid)
  return withBranchLock(d, initial.key, async () => {
    const saved = await loadOperation(d, initial.key, r.operationId)
    const workspace = await workspaceOf(d, initial.ctx.projectPath, saved); const op = workspace.operation
    if (op.stage !== 'conflicts') throw new Refusal(BRANCH_TEXT.stale)
    const file = workspace.conflicts.find(f => f.path === r.path)
    if (!file) throw new Refusal(BRANCH_TEXT.invalid)
    const folder = workspacePath(d, op); const git = gitIn(d, folder)
    const path = await safeResolutionPath(folder, file.path)
    if (r.choice === 'edited') {
      if (!file.editable || typeof r.text !== 'string' || r.text.length > BRANCH_LIMITS.conflict || /^(<{7}|={7}|>{7}|\|{7})( |$)/m.test(r.text)) throw new Refusal(BRANCH_TEXT.unresolved)
      await d.host.write(path, r.text)
      await git(['--literal-pathspecs', 'add', '--', file.path])
    } else {
      const stage = { base: 1, target: 2, source: 3 }[r.choice]
      const entry = conflictEntries(await git(['ls-files', '-u', '-z'])).find(e => e.path === file.path && e.stage === stage)
      if (!entry) await git(['--literal-pathspecs', 'rm', '-f', '--', file.path])
      else {
        if (!['100644', '100755'].includes(entry.mode)) throw new Refusal(BRANCH_TEXT.unsafePath)
        await git(['update-index', '--add', '--cacheinfo', `${entry.mode},${entry.oid},${entry.path}`])
        await git(['--literal-pathspecs', 'checkout-index', '-f', '--', file.path])
      }
    }
    op.events.push({ at: d.now(), command: `Resolved ${file.path} (${r.choice})`, status: 'succeeded', output: '' })
    const next = await workspaceOf(d, initial.ctx.projectPath, op)
    await saveOperation(d, next.operation)
    return next
  })
})

export const completeMerge = (d: BranchDeps, key: unknown, input: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const initial = await scopeOf(d, key); const r = input as CompleteRequest | null
  if (!r || typeof r.approval !== 'string') throw new Refusal(BRANCH_TEXT.invalid)
  const message = messageOf(r.message)
  return withBranchLock(d, initial.key, async () => {
    const scope = await scopeOf(d, key)
    const workspace = await workspaceOf(d, scope.ctx.projectPath, await loadOperation(d, scope.key, r.operationId))
    const op = workspace.operation
    if (op.stage === 'merged') return workspace // Retry after a lost response is harmless.
    if (!workspace.approval || workspace.approval !== r.approval) throw new Refusal(BRANCH_TEXT.stale)
    if (!r.idleConfirmed) throw new Refusal(BRANCH_TEXT.idle)
    if (!workspace.checksCurrent) throw new Refusal(BRANCH_TEXT.checksRequired)
    const check = async () => {
      const fresh = await scopeOf(d, key)
      const review = await reviewOf(d, fresh, taskOf(fresh, op.taskId), op.target)
      if (review.source !== op.source || review.sourceHead !== op.sourceHead || review.targetHead !== op.targetHead) throw new Refusal(BRANCH_TEXT.stale)
      if (review.blocked) throw new Refusal(review.blocked)
    }
    await check()
    if (!op.commit) {
      const approvedTree = op.tree
      op.stage = 'committing'; op.message = message; await saveOperation(d, op)
      const result = await runStep(d, op, workspacePath(d, op), { kind: 'commit', message })
      if (result.exitCode !== 0) throw new Refusal(BRANCH_TEXT.action)
      const recovered = await workspaceOf(d, scope.ctx.projectPath, op)
      if (!recovered.operation.commit) throw new Refusal(BRANCH_TEXT.action)
      Object.assign(op, recovered.operation)
      await saveOperation(d, op)
      // Commit hooks may change files or amend the result. Such changes need
      // their own review before the destination can move.
      if (op.tree !== approvedTree || recovered.approval === null) return recovered
    }
    // A hook may have taken time. Recheck ownership, writers and both heads
    // before applying, leaving the prepared merge intact on any refusal.
    await check()
    const checkouts = await worktreesRepositoryImpl(d.host, scope.ctx.projectPath).list()
    const destination = checkouts.find(w => w.branch === op.target)?.path
    if (destination) {
      if ((await gitIn(d, destination)(['symbolic-ref', '--short', 'HEAD'])).trim() !== op.target) throw new Refusal(BRANCH_TEXT.stale)
      const result = await runStep(d, op, destination, { kind: 'apply', commit: op.commit! })
      if (result.exitCode !== 0) throw new Refusal(BRANCH_TEXT.action)
    } else {
      // Compare-and-swap: never overwrite a target that moved after approval.
      await gitIn(d, scope.ctx.projectPath)(['update-ref', `refs/heads/${op.target}`, op.commit!, op.targetHead])
      op.events.push({ at: d.now(), command: `Updated ${op.target} to ${op.commit}`, status: 'succeeded', output: '' })
    }
    if (!(await ancestor(d, scope.ctx.projectPath, op.commit!, await headOf(d, scope.ctx.projectPath, op.target)))) throw new Refusal(BRANCH_TEXT.action)
    op.stage = 'merged'; await saveOperation(d, op)
    return workspaceOf(d, scope.ctx.projectPath, op)
  })
})

export const abandonMerge = (d: BranchDeps, key: unknown, id: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const scope = await scopeOf(d, key)
  return withBranchLock(d, scope.key, async () => {
    const workspace = await workspaceOf(d, scope.ctx.projectPath, await loadOperation(d, scope.key, id)); const op = workspace.operation
    if (op.stage === 'merged') throw new Refusal(BRANCH_TEXT.invalid)
    const folder = workspacePath(d, op)
    if (!op.commit && await d.host.exists(folder)) {
      const pending = await d.host.run(['git', 'rev-parse', '-q', '--verify', 'MERGE_HEAD'], folder)
      if (pending.exitCode === 0 && (await runStep(d, op, folder, { kind: 'abort' })).exitCode !== 0) throw new Refusal(BRANCH_TEXT.action)
    }
    op.stage = 'abandoned'; await saveOperation(d, op)
    // The isolated folder is retained. No task branch or worktree is deleted.
    return { operation: op, conflicts: [], diff: '', truncated: false, approval: null }
  })
})

export const openMergeFolder = (d: BranchDeps, key: unknown, id: unknown): Promise<Reply<null>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const scope = await scopeOf(d, key)
  const op = await loadOperation(d, scope.key, id)
  const folder = workspacePath(d, op)
  if (!d.reveal || !(await d.host.exists(folder))) throw new Refusal(BRANCH_TEXT.missing)
  d.reveal(folder)
  return null
})
