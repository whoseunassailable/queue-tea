import { liveOutput } from '../data/live_output'
import { writeReceipt } from '../data/commit_progress'
import { argvOf } from '../data/user_git'
import type { CommitProgress } from '../../../../shared/branches'
import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import type { BranchReview, CommitRequest } from '../../../../shared/branches'
import type { Reply } from '../../../../shared/engine_api'
import { Refusal, reply } from '../../../core/reply'
import { scopeOf } from '../../tasks/api/scope'
import { BRANCH_LIMITS, BRANCH_TEXT, operationsFolder } from '../domain/constants'
import { isFile } from '../domain/git_rules'
import { gitIn, headOf, reviewOf } from '../data/branch_source'
import { withBranchLock } from '../data/operation_store'
import { freshReview, messageOf, requestOf, taskOf } from './branch_api'
import type { BranchDeps } from './branch_api'

export const commitBranchFiles = (d: BranchDeps, key: unknown, input: unknown): Promise<Reply<BranchReview>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const initial = await scopeOf(d, key); const request = requestOf(input); const r = input as CommitRequest
  const message = messageOf(r.message)
  if (!Array.isArray(r.files) || !r.files.length || r.files.length > 1000 || !r.files.every(isFile)) throw new Refusal(BRANCH_TEXT.invalid)
  return withBranchLock(d, initial.key, async () => {
    const scope = await scopeOf(d, key); const task = taskOf(scope, request.taskId)
    // This receipt makes a repeated click/IPC delivery idempotent. It is saved
    // before committing, so a crash cannot silently create a second commit.
    if (!/^[a-f0-9]{64}$/.test(request.fingerprint)) throw new Refusal(BRANCH_TEXT.invalid)
    const receipt = `${operationsFolder(d.home, scope.key)}/commit-${request.fingerprint}.json`
    if (await d.host.exists(receipt)) {
      const previous = JSON.parse(await d.host.read(receipt)) as { before: string; taskId: string; failed?: boolean }
      if (previous.taskId !== task.id) throw new Refusal(BRANCH_TEXT.invalid)
      const head = await headOf(d, scope.ctx.projectPath, task.branch!)
      if (head !== previous.before) return reviewOf(d, scope, task, request.target)
      if (!previous.failed) throw new Refusal(BRANCH_TEXT.receipt)
    }
    const review = await freshReview(d, scope, request, true)
    const files = new Set(r.files)
    if (r.files.some(path => !review.files.some(f => f.path === path || f.previous === path))) throw new Refusal(BRANCH_TEXT.stale)
    for (const file of review.files) {
      if (file.previous && files.has(file.path)) files.add(file.previous)
      if (file.status[0] !== ' ' && file.status[0] !== '?' && !files.has(file.path)) throw new Refusal(BRANCH_TEXT.staged)
    }
    const worktrees = await worktreesRepositoryImpl(d.host, scope.ctx.projectPath).list()
    const source = worktrees.find(w => w.branch === task.branch)?.path
    if (!source || source !== (task.worktreePath ?? scope.ctx.projectPath)) throw new Refusal(BRANCH_TEXT.missing)
    const git = gitIn(d, source)
    await git(['--literal-pathspecs', 'add', '--', ...files])
    // A new tracked file needs staging before commit --only can include it.
    // All staging is limited to the user's selection.
    const action = { kind: 'commitFiles' as const, message, files: [...files] }
    const progress: CommitProgress & { owner: number } = { owner: process.pid, command: `git ${argvOf(action).join(' ')}`, message, at: d.now(), finished: null, status: 'running', output: '', truncated: false, exitCode: null }
    const receiptData = { before: review.sourceHead, taskId: task.id, files: [...files], message, failed: false, progress }
    const save = () => writeReceipt(d, receipt, receiptData)
    await save()
    const stream = liveOutput(async (output, truncated) => { progress.output = output; progress.truncated = truncated; await save() })
    let result
    try { result = await d.userGit(source, action, stream.append) } catch (err) {
      await stream.flush(); progress.status = 'interrupted'; progress.finished = d.now(); await save(); throw err
    } finally { await stream.flush() }
    progress.finished = d.now(); progress.exitCode = result.exitCode
    progress.status = result.exitCode === 0 ? 'succeeded' : 'failed'
    progress.output ||= (result.stdout + result.stderr).slice(-BRANCH_LIMITS.output)
    receiptData.failed = result.exitCode !== 0
    await save()
    if (result.exitCode !== 0) {
      d.log.error(`source commit failed: ${result.stderr}`)
      throw new Refusal(BRANCH_TEXT.action)
    }
    return reviewOf(d, await scopeOf(d, key), task, request.target)
  })
})
