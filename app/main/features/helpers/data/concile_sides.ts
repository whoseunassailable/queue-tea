import type { Task } from '../../../../../types'
import type { MergeOperation } from '../../../../shared/branches'
import { ancestor, gitIn } from '../../branches/data/branch_source'
import { operationsOf } from '../../branches/data/operation_store'
import { isOid } from '../../branches/domain/git_rules'
import type { Scope, TasksDeps } from '../../tasks/api/scope'
import type { ConcileSides } from '../domain/concile_brief'

// The quests that reached the merge's target after its task branched: their
// branch is now part of the target but wasn't at the merge base, or Branches
// merged them into the target since then. Newest first.
const landedQuests = async (d: TasksDeps, scope: Scope, op: MergeOperation, others: Task[]): Promise<Task[]> => {
  const root = scope.ctx.projectPath
  const git = gitIn(d, root)
  const base = (await git(['merge-base', op.targetHead, op.sourceHead])).trim()
  // Its type says string, so the guard leaves nothing to print when it fails.
  if (!isOid(base)) throw new Error('merge-base gave no commit')
  const reached = new Set(
    (await git(['for-each-ref', `--merged=${op.targetHead}`, `--no-merged=${base}`, '--format=%(refname:strip=2)', 'refs/heads/'])).split('\n').map(line => line.trim()).filter(Boolean),
  )
  const merged = new Set<string>()
  for (const other of await operationsOf(d, scope.key)) {
    if (other.stage !== 'merged' || other.target !== op.target || other.taskId === op.taskId || other.commit === null) continue
    if ((await ancestor(d, root, other.commit, op.targetHead)) && !(await ancestor(d, root, other.commit, base))) merged.add(other.taskId)
  }
  d.log.debug(`tea-concile: ${reached.size} branches and ${merged.size} merges reached ${op.target} since ${base.slice(0, 7)}`)

  return others
    .filter(task => merged.has(task.id) || (task.branch !== null && task.branch !== op.target && reached.has(task.branch)))
    .sort((a, b) => (b.finished ?? b.started ?? b.created).localeCompare(a.finished ?? a.started ?? a.created))
}

// Both sides of a merge as Queue-tea's record knows them, for Tea-Concile's
// order. A failure to read git only leaves out the quests that landed: the
// order says so and Tea-Concile reads the commits instead.
export const concileSides = async (d: TasksDeps, scope: Scope, op: MergeOperation): Promise<ConcileSides> => {
  const tasks = scope.record.tasks.filter(task => task.state !== 'removed')
  const sourceQuest = tasks.find(task => task.id === op.taskId) ?? null
  const targetQuest = tasks.find(task => task.id !== op.taskId && task.branch === op.target) ?? null
  const others = tasks.filter(task => task.id !== op.taskId && task.id !== targetQuest?.id)
  let landed: Task[] | null
  try {
    landed = await landedQuests(d, scope, op, others)
  } catch (err) {
    d.log.warn(`tea-concile: couldn't tell which quests reached ${op.target}: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`)
    landed = null
  }

  return { source: op.source, target: op.target, sourceQuest, targetQuest, landed }
}
