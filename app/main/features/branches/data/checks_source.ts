import type { CheckChoice, CheckRun, MergeOperation } from '../../../../shared/branches'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_LIMITS } from '../domain/constants'
import { digest, gitIn } from './branch_source'
import { operationPath } from './operation_store'

export type CheckDefinition = CheckChoice & { script: string; definition: string; manifest: string }
export const checksFile = (d: TasksDeps, op: MergeOperation) => `${operationPath(d, op.key, op.id)}/checks.json`
export const discoverChecks = async (d: TasksDeps, folder: string, tree: string): Promise<CheckDefinition[]> => {
  const git = gitIn(d, folder)
  const files = (await git(['ls-tree', '-r', '--name-only', tree])).split('\n').filter(f => /(^|\/)package\.json$/.test(f) && f.split('/').length <= 4 && !f.includes('node_modules/')).slice(0, BRANCH_LIMITS.checkChoices)
  const choices: CheckDefinition[] = []
  for (const manifest of files) {
    const text = await git(['show', `${tree}:${manifest}`])
    let parsed: { scripts?: Record<string, unknown> }
    try { parsed = JSON.parse(text) as typeof parsed } catch (err) { d.log.warn(`Check manifest is unreadable: ${manifest}: ${String(err)}`); continue }
    for (const [script, definition] of Object.entries(parsed.scripts ?? {})) {
      if (!/^(test|check|typecheck|lint|validate|build)(:|$)/.test(script) || typeof definition !== 'string') continue
      const folderName = manifest.includes('/') ? manifest.slice(0, manifest.lastIndexOf('/')) : '.'
      choices.push({ id: digest(manifest + '\0' + script + '\0' + text), name: folderName === '.' ? script : `${folderName}: ${script}`, folder: folderName, manifest, script, definition, command: `npm run ${script} — ${definition}` })
    }
  }
  return choices.slice(0, BRANCH_LIMITS.checkChoices)
}
export const saveChecks = async (d: TasksDeps, op: MergeOperation, runs: CheckRun[]) => {
  const file = checksFile(d, op)
  await d.host.write(file + '.tmp', JSON.stringify(runs))
  const moved = await d.host.move(file + '.tmp', file)
  if (moved.exitCode) throw new Error(`Saving check results failed: ${moved.stderr}`)
}
export const readChecks = async (d: TasksDeps, op: MergeOperation): Promise<CheckRun[]> => {
  const file = checksFile(d, op)
  if (!(await d.host.exists(file))) return []
  const runs = JSON.parse(await d.host.read(file)) as CheckRun[]
  if (!Array.isArray(runs)) throw new Error('Check results have the wrong shape')
  for (const run of runs) {
    if (run.status !== 'running' || run.owner === process.pid) continue
    try { process.kill(run.owner, 0) } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ESRCH') { run.status = 'interrupted'; run.finished = d.now() }
      else d.log.warn(`Check owner could not be inspected: ${String(err)}`)
    }
  }
  return runs
}
export const checksPassed = (runs: CheckRun[], tree: string, choices: CheckChoice[]) => {
  const latest = new Map<string, CheckRun>()
  for (const run of runs) if (run.tree === tree && choices.some(c => c.id === run.checkId)) latest.set(run.checkId, run)
  return choices.length === 0 || latest.size > 0 && [...latest.values()].every(r => r.status === 'succeeded')
}
