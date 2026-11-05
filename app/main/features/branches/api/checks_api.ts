import { randomUUID } from 'node:crypto'
import { realpath, symlink } from 'node:fs/promises'
import { join } from 'node:path'
import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import type { CheckRun, MergeWorkspace, RunChecksRequest } from '../../../../shared/branches'
import type { Reply } from '../../../../shared/engine_api'
import { Refusal, reply } from '../../../core/reply'
import { streamProcess } from '../../../core/stream_process'
import { scopeOf } from '../../tasks/api/scope'
import { BRANCH_LIMITS, BRANCH_TEXT, checkPath } from '../domain/constants'
import { discoverChecks, readChecks, saveChecks } from '../data/checks_source'
import { liveOutput } from '../data/live_output'
import { loadOperation, operationPath, withBranchLock } from '../data/operation_store'
import { workspaceOf, workspacePath } from '../data/merge_workspace'
import type { BranchDeps } from './branch_api'

const executing = new Map<string, AbortController>()
// Reuse installed dependencies only when both manifest and lock match. These
// links live only in the isolated folder and never change the task's files.
const dependencies = async (d: BranchDeps, folder: string, source: string | undefined, subfolder: string, metadata: string) => {
  const work = join(folder, subfolder); const target = join(work, 'node_modules')
  if (await d.host.exists(target) || !source) return
  const installed = join(source, subfolder, 'node_modules')
  if (!(await d.host.exists(installed))) return
  for (const name of ['package.json', 'package-lock.json', 'npm-shrinkwrap.json']) {
    const left = join(work, name); const right = join(source, subfolder, name)
    const [a, b] = await Promise.all([d.host.exists(left), d.host.exists(right)])
    if (a !== b || a && await d.host.read(left) !== await d.host.read(right)) return
  }
  const root = await realpath(folder); const parent = await realpath(work)
  if (parent !== root && !parent.startsWith(root + '/')) throw new Refusal(BRANCH_TEXT.unsafePath)
  const links = await d.host.exists(metadata) ? JSON.parse(await d.host.read(metadata)) as { path: string; target: string }[] : []
  links.push({ path: subfolder === '.' ? 'node_modules' : `${subfolder}/node_modules`, target: await realpath(installed) })
  await d.host.write(metadata, JSON.stringify(links))
  await symlink(await realpath(installed), target, 'dir')
}
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
    const source = (await worktreesRepositoryImpl(d.host, scope.ctx.projectPath).list()).find(w => w.branch === op.source)?.path
    const runs = await readChecks(d, op)
    if (runs.some(run => run.status === 'running')) throw new Refusal(BRANCH_TEXT.busy)
    const controller = new AbortController(); const lockKey = `${scope.key}/${op.id}`
    executing.set(lockKey, controller)
    try {
      for (const choice of selected) {
        if (controller.signal.aborted) break
        const current = await workspaceOf(d, scope.ctx.projectPath, op)
        if (current.approval !== r.approval) throw new Refusal(BRANCH_TEXT.stale)
        await dependencies(d, folder, source, choice!.folder, `${operationPath(d, op.key, op.id)}/dependencies.json`)
        const run: CheckRun = { id: randomUUID(), checkId: choice!.id, name: choice!.name, command: choice!.command, tree, at: d.now(), finished: null, owner: process.pid, status: 'running', output: '', exitCode: null, truncated: false }
        runs.push(run); await saveChecks(d, op, runs)
        const stream = liveOutput(async (output, truncated) => { run.output = output; run.truncated = truncated; await saveChecks(d, op, runs) })
        let result
        try {
          result = await streamProcess(d.log, { argv: ['npm', 'run', choice!.script], cwd: join(folder, choice!.folder), signal: controller.signal, timeoutMs: BRANCH_LIMITS.checksMs, env: { PATH: checkPath(d.home, process.env.PATH), CI: '1', npm_config_offline: 'true', npm_config_update_notifier: 'false' } }, stream.append)
        } finally { await stream.flush() }
        run.finished = d.now(); run.exitCode = result.exitCode
        run.status = controller.signal.aborted || result.exitCode === 130 ? 'cancelled' : result.exitCode === 0 ? 'succeeded' : 'failed'
        if ((await workspaceOf(d, scope.ctx.projectPath, op)).approval !== r.approval) {
          run.status = 'failed'; run.output += '\n' + BRANCH_TEXT.checkChanged
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
