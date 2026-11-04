import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import type { MergeCheck, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { questIdOf } from '../domain/task_input'
import { scopeOf } from './scope'
import type { TasksDeps } from './scope'

const quote = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`

// Checks only: merge-tree writes no index or working files. The user runs the
// commands, including any eventual commit and removal of a clean worktree.
export const readMerge = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<MergeCheck>> =>
  reply(d.log, MESSAGES.readMerge, async () => {
    const scope = await scopeOf(d, key)
    const task = scope.record.tasks.find(t => t.id === questIdOf(taskId))
    if (!task || !task.branch) throw new Refusal(MESSAGES.badQuest)
    const blocked = (message: string): MergeCheck => ({ kind: 'blocked', message, command: null, cleanup: null })
    if (!task.baseBranch) return blocked(MESSAGES.mergeNoBase)
    const root = scope.ctx.projectPath
    const git = (args: string[], cwd = root) => d.host.run(['git', ...args], cwd)
    const branch = `refs/heads/${task.branch}`
    const base = `refs/heads/${task.baseBranch}`
    const refs = await Promise.all([git(['show-ref', '--verify', '--quiet', branch]), git(['show-ref', '--verify', '--quiet', base])])
    if (refs.some(r => r.exitCode !== 0)) return blocked(MESSAGES.mergeMissing)
    const checkouts = await worktreesRepositoryImpl(d.host, root).list()
    const target = checkouts.find(w => w.branch === task.baseBranch)?.path ?? root
    const source = checkouts.find(w => w.branch === task.branch)?.path
    const statuses = await Promise.all([...new Set([target, ...(source ? [source] : [])])].map(path => git(['status', '--porcelain'], path)))
    if (statuses.some(r => r.exitCode !== 0)) throw new Error('Could not read merge folders')
    if (statuses.some(r => r.stdout.trim() !== '')) return blocked(MESSAGES.mergeDirty)
    const merged = await git(['merge-base', '--is-ancestor', branch, base])
    if (merged.exitCode > 1) throw new Error('Could not check branch ancestry')
    const cleanup = task.state === 'done' && task.worktreePath && source === task.worktreePath
      ? `git -C ${quote(root)} worktree remove ${quote(task.worktreePath)}` : null
    if (merged.exitCode === 0) return { kind: 'merged', message: MESSAGES.mergeDone, command: null, cleanup }
    if (scope.record.tasks.some(t => t.id !== task.id && t.state === 'current' && (t.worktreePath ?? root) === target)) return blocked(MESSAGES.mergeBusy)
    const simulated = await git(['merge-tree', '--write-tree', base, branch])
    if (simulated.exitCode > 1) throw new Error(`Merge check failed: ${simulated.stderr}`)
    const switchBase = checkouts.some(w => w.branch === task.baseBranch) ? '' : `git -C ${quote(target)} switch ${quote(task.baseBranch)}\n`
    return { kind: simulated.exitCode === 0 ? 'ready' : 'conflicts', message: simulated.exitCode === 0 ? MESSAGES.mergeReady : MESSAGES.mergeConflicts, command: `${switchBase}git -C ${quote(target)} merge --no-ff ${quote(branch)}`, cleanup: null }
  })
