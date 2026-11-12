import { createHash } from 'node:crypto'
import type { Task } from '../../../../../types'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import type { BranchGraph, BranchReview, ChangedFile } from '../../../../shared/branches'
import { Refusal } from '../../../core/reply'
import type { Scope, TasksDeps } from '../../tasks/api/scope'
import { BRANCH_LIMITS, BRANCH_TEXT } from '../domain/constants'
import { isBranch, parseLog, parseStatus } from '../domain/git_rules'
import { observeTask } from './observation'

export const digest = (text: string) => createHash('sha256').update(text).digest('hex')
export const gitIn = (d: TasksDeps, cwd: string) => async (args: string[]) => {
  const r = await d.host.run(['git', '--no-optional-locks', ...args], cwd)
  if (r.exitCode !== 0) throw new Error(`git ${args[0]} failed (${r.exitCode}): ${r.stderr}`)
  return r.stdout
}
export const headOf = async (d: TasksDeps, root: string, branch: string): Promise<string> => {
  if (!isBranch(branch)) throw new Refusal(BRANCH_TEXT.invalid)
  const r = await d.host.run(['git', 'rev-parse', '--verify', `refs/heads/${branch}^{commit}`], root)
  if (r.exitCode !== 0) throw new Refusal(BRANCH_TEXT.missing)
  return r.stdout.trim()
}
export const ancestor = async (d: TasksDeps, root: string, a: string, b: string) => {
  const r = await d.host.run(['git', 'merge-base', '--is-ancestor', a, b], root)
  if (r.exitCode > 1) throw new Error(`ancestry failed: ${r.stderr}`)
  return r.exitCode === 0
}
export const headsOf = async (d: TasksDeps, root: string) => (await gitIn(d, root)(['for-each-ref', '--format=%(refname:strip=2)%00%(objectname)', 'refs/heads/'])).trim().split('\n').filter(Boolean).map(line => {
  const [branch = '', head = ''] = line.split('\0'); return { branch, head }
})
export const pendingGit = async (d: TasksDeps, path: string) => {
  const git = gitIn(d, path)
  for (const name of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply']) {
    const file = (await git(['rev-parse', '--path-format=absolute', '--git-path', name])).trim()
    if (await d.host.exists(file)) return true
  }
  return false
}
// A graph can span hundreds of retained tasks. Bound the disk/Git work while
// keeping result order stable. A failure stops workers from taking more tasks.
const taskReads = async <T, R>(items: T[], read: (item: T) => Promise<R>): Promise<R[]> => {
  const result: R[] = []; let next = 0; let stopped = false
  const workers = await Promise.allSettled(Array.from({ length: Math.min(items.length, BRANCH_LIMITS.graphWorkers) }, async () => {
    while (!stopped && next < items.length) {
      const index = next++
      try { result[index] = await read(items[index]!) }
      catch (err) { stopped = true; throw err }
    }
  }))
  for (const worker of workers) if (worker.status === 'rejected') throw worker.reason
  return result
}
export const graphOf = async (d: TasksDeps, scope: Scope): Promise<BranchGraph> => {
  const root = scope.ctx.projectPath; const git = gitIn(d, root)
  const allHeads = await headsOf(d, root)
  const integration = allHeads.find(h => h.branch === 'main')?.branch ?? allHeads.find(h => h.branch === 'master')?.branch ?? allHeads[0]?.branch ?? ''
  const relevant = new Set([integration, ...scope.record.tasks.filter(t => t.state !== 'removed').flatMap(t => [t.branch, t.baseBranch])])
  const heads = allHeads.filter(h => relevant.has(h.branch))
  const commits = heads.length ? parseLog(await git(['log', '--topo-order', `--max-count=${BRANCH_LIMITS.graph}`, '--format=%H%x00%P%x00%s', ...heads.map(h => `refs/heads/${h.branch}`), '--'])) : []
  const checkouts = await worktreesRepositoryImpl(d.host, root).list()
  const tasks = await taskReads(scope.record.tasks.filter(t => t.branch && t.state !== 'removed'), async task => {
    const head = heads.find(h => h.branch === task.branch)?.head ?? null
    const base = heads.find(h => h.branch === task.baseBranch)?.head ?? null
    const observation = await observeTask(d, root, task)
    const forkResult = head && base ? await d.host.run(['git', 'merge-base', base, head], root) : null
    const merged = !!head && !!base && head !== task.startCommit && await ancestor(d, root, head, base)
    const folder = checkouts.find(w => w.branch === task.branch)?.path
    const changed = folder ? parseStatus(await gitIn(d, folder)(['status', '--porcelain=v1', '-z', '--untracked-files=all'])).length : null
    return { id: task.id, title: task.title, branch: task.branch!, base: task.baseBranch, head, fork: forkResult?.exitCode === 0 ? forkResult.stdout.trim() : null,
      merged, state: merged ? 'merged' as const : observation.state, latest: observation.steps.at(-1)?.subject ?? null, seenAt: observation.seenAt,
      changed, commits: head && base ? Number((await git(['rev-list', '--count', `${base}..${head}`])).trim()) : null }
  })
  return { at: d.now(), integration, heads, commits, tasks, limited: commits.length === BRANCH_LIMITS.graph }
}

// A fingerprint includes the complete diff and untracked contents, not just
// status letters. Editing an already-dirty file invalidates the review too.
export const workingSnapshot = async (d: TasksDeps, path: string, files: ChangedFile[]) => {
  const git = gitIn(d, path)
  const diff = await git(['diff', '--no-ext-diff', '--no-textconv', '--binary', 'HEAD', '--'])
  const untracked: string[] = []
  for (const file of files.filter(f => f.status === '??')) {
    const hash = await git(['hash-object', '--', file.path])
    untracked.push(`${file.path}\0${hash}`)
  }
  return { diff, fingerprint: digest(JSON.stringify(files) + diff + untracked.join('\0')) }
}
export const reviewOf = async (d: TasksDeps, scope: Scope, task: Task, target: string): Promise<BranchReview> => {
  const root = scope.ctx.projectPath; const git = gitIn(d, root)
  if (!task.branch || target === task.branch) throw new Refusal(BRANCH_TEXT.invalid)
  const [sourceHead, targetHead, heads, checkouts, observation] = await Promise.all([
    headOf(d, root, task.branch), headOf(d, root, target), headsOf(d, root), worktreesRepositoryImpl(d.host, root).list(), observeTask(d, root, task),
  ])
  const source = checkouts.find(w => w.branch === task.branch)?.path
  const destination = checkouts.find(w => w.branch === target)?.path
  const files = source ? parseStatus(await gitIn(d, source)(['status', '--porcelain=v1', '-z', '--untracked-files=all'])) : []
  const working = source ? await workingSnapshot(d, source, files) : { diff: '', fingerprint: '' }
  const targetStatus = destination ? await gitIn(d, destination)(['status', '--porcelain=v1', '-z', '--untracked-files=all']) : ''
  const targetTask = scope.record.tasks.find(t => t.id !== task.id && t.state === 'current' && (t.worktreePath ?? root) === destination)
  const targetWorking = targetTask && (await observeTask(d, root, targetTask)).state === 'working'
  const sessionWriter = (await sessionsRepositoryImpl(d.host, d.home).list()).some(s => isFresh(s, d.now()) && s.isTurnRunning && [source, destination].includes(s.workingPath ?? s.projectPath))
  const sourcePending = source ? await pendingGit(d, source) : false
  const targetPending = destination ? await pendingGit(d, destination) : false
  const merged = await ancestor(d, root, sourceHead, targetHead)
  let untrackedDiff = ''
  if (source) for (const file of files.filter(f => f.status === '??')) {
    const result = await d.host.run(['git', 'diff', '--no-index', '--no-ext-diff', '--no-textconv', '--', '/dev/null', file.path], source)
    if (result.exitCode > 1) throw new Error(`reading untracked diff failed: ${result.stderr}`)
    untrackedDiff += result.stdout
  }
  const diff = await git(['diff', '--no-ext-diff', '--no-textconv', `${targetHead}...${sourceHead}`, '--']) + working.diff + untrackedDiff
  const blocked = observation.state === 'working' || targetWorking || sessionWriter ? BRANCH_TEXT.writer : sourcePending || targetPending ? BRANCH_TEXT.pending : files.length || targetStatus ? BRANCH_TEXT.dirty : merged ? BRANCH_TEXT.noMerge : null
  return { taskId: task.id, source: task.branch, target, targets: heads.map(h => h.branch).filter(b => b !== task.branch), sourceHead, targetHead,
    fingerprint: digest(sourceHead + targetHead + working.fingerprint + targetStatus), files, diff: diff.slice(0, BRANCH_LIMITS.diff), truncated: diff.length > BRANCH_LIMITS.diff,
    commits: parseLog(await git(['log', '--format=%H%x00%P%x00%s', `${targetHead}..${sourceHead}`, '--'])), steps: observation.steps, state: observation.state, blocked, merged, operation: null,
    remotes: (await git(['remote'])).trim().split('\n').filter(Boolean) }
}
