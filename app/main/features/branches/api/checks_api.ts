import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import type { CheckRun, MergeWorkspace, RunChecksRequest } from '../../../../shared/branches'
import type { Reply } from '../../../../shared/engine_api'
import { Refusal, reply } from '../../../core/reply'
import { streamProcess } from '../../../core/stream_process'
import { scopeOf } from '../../tasks/api/scope'
import { BRANCH_LIMITS, BRANCH_TEXT, checkPath } from '../domain/constants'
import { discoverChecks, readChecks, saveChecks } from '../data/checks_source'
import { CheckStopped, DependencySetupRequired, inspectDependencies } from '../data/dependency_setup'
import { liveOutput } from '../data/live_output'
import { loadOperation, withBranchLock } from '../data/operation_store'
import { workspaceOf, workspacePath } from '../data/merge_workspace'
import type { BranchDeps } from './branch_api'

const executing = new Map<string, AbortController>()
export const runMergeChecks = (d: BranchDeps, key: unknown, input: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const scope = await scopeOf(d, key); const r = input as RunChecksRequest | null
  if (!r || typeof r.approval !== 'string' || !Array.isArray(r.checkIds) || !r.checkIds.length || !r.checkIds.every(id => typeof id === 'string')) throw new Refusal(BRANCH_TEXT.checkSelection)
  return withBranchLock(d, scope.key, async () => {
    const op = await loadOperation(d, scope.key, r.operationId)
    const workspace = await workspaceOf(d, scope.ctx.projectPath, op)
    if (!workspace.approval || r.approval !== workspace.approval || !workspace.operation.tree) throw new Refusal(BRANCH_TEXT.stale)
    const folder = workspacePath(d, op); const tree = workspace.operation.tree
    const choices = await discoverChecks(d, folder, tree)
    const selected = [...new Set(r.checkIds)].map(id => choices.find(c => c.id === id))
    if (selected.some(c => !c)) throw new Refusal(BRANCH_TEXT.stale)
    const runs = await readChecks(d, op)
    if (runs.some(run => run.status === 'running')) throw new Refusal(BRANCH_TEXT.busy)
    const controller = new AbortController(); const lockKey = `${scope.key}/${op.id}`
    executing.set(lockKey, controller)
    try {
      for (const choice of selected) {
        if (controller.signal.aborted) break
        const current = await workspaceOf(d, scope.ctx.projectPath, op)
        if (current.approval !== r.approval) throw new Refusal(BRANCH_TEXT.stale)
        const run: CheckRun = { id: randomUUID(), checkId: choice!.id, name: choice!.name, command: choice!.command, tree, at: d.now(), finished: null, owner: process.pid, status: 'running', output: '', exitCode: null, truncated: false }
        runs.push(run); await saveChecks(d, op, runs)
        const stream = liveOutput(async (output, truncated) => { run.output = output; run.truncated = truncated; await saveChecks(d, op, runs) })
        const active = () => {
          if (controller.signal.aborted) throw new CheckStopped('cancelled')
          if (d.now() - run.at >= BRANCH_LIMITS.checksMs) throw new CheckStopped('failed')
        }
        try {
          await inspectDependencies(d, folder, choice!.folder, active)
          active()
          if ((await workspaceOf(d, scope.ctx.projectPath, op)).approval !== r.approval) throw new Refusal(BRANCH_TEXT.checkChanged)
          active()
          const result = await streamProcess(d.log, { argv: ['npm', 'run', choice!.script], cwd: join(folder, choice!.folder), signal: controller.signal, timeoutMs: Math.max(1, BRANCH_LIMITS.checksMs - (d.now() - run.at)), env: { PATH: checkPath(d.home, process.env.PATH), CI: '1', npm_config_offline: 'true', npm_config_update_notifier: 'false' } }, stream.append)
          run.exitCode = result.exitCode
          run.status = controller.signal.aborted ? 'cancelled' : result.exitCode === 0 ? 'succeeded' : 'failed'
          if (result.timedOut) stream.append('\n' + BRANCH_TEXT.checkTimeout)
          if (!result.exitCode) active()
        } catch (err) {
          if (controller.signal.aborted) { run.status = 'cancelled'; stream.append(BRANCH_TEXT.checkCancelled) }
          else if (err instanceof CheckStopped) { run.status = err.status; stream.append(err.message) }
          else if (err instanceof DependencySetupRequired) { run.status = 'setupRequired'; stream.append(err.message) }
          else {
            d.log.error('Preparing or running a merge check failed', err)
            run.status = 'failed'; stream.append(err instanceof Refusal ? err.message : BRANCH_TEXT.checkPreparationFailed)
          }
        } finally { await stream.flush() }
        run.finished = d.now()
        try {
          if ((await workspaceOf(d, scope.ctx.projectPath, op)).approval !== r.approval) {
            run.status = 'failed'; run.output += '\n' + BRANCH_TEXT.checkChanged
          }
        } catch (err) {
          d.log.error('Verifying the tree after a merge check failed', err)
          run.status = 'failed'; run.output += '\n' + BRANCH_TEXT.checkPreparationFailed
        }
        await saveChecks(d, op, runs)
      }
    } finally { executing.delete(lockKey) }
    return workspaceOf(d, scope.ctx.projectPath, op)
  })
})
export const cancelMergeChecks = (d: BranchDeps, key: unknown, id: unknown): Promise<Reply<null>> => reply(d.log, BRANCH_TEXT.action, async () => {
  const scope = await scopeOf(d, key); const op = await loadOperation(d, scope.key, id)
  executing.get(`${scope.key}/${op.id}`)?.abort()
  return null
})
