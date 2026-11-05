import { randomUUID } from 'node:crypto'
import type { MergeOperation } from '../../../../shared/branches'
import { Refusal } from '../../../core/reply'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_TEXT, operationsFolder } from '../domain/constants'
import { isBranch, isOid } from '../domain/git_rules'

const validId = (id: unknown): id is string => typeof id === 'string' && /^[a-f0-9-]{36}$/.test(id)
export const operationPath = (d: TasksDeps, key: string, id: string) => `${operationsFolder(d.home, key)}/${id}`
export const saveOperation = async (d: TasksDeps, op: MergeOperation) => {
  const file = `${operationPath(d, op.key, op.id)}.json`; const temp = `${file}.${randomUUID()}.tmp`
  await d.host.write(temp, JSON.stringify(op, null, 2))
  const moved = await d.host.move(temp, file)
  if (moved.exitCode) throw new Error(`saving merge operation: ${moved.stderr}`)
}
export const loadOperation = async (d: TasksDeps, key: string, id: unknown): Promise<MergeOperation> => {
  if (!validId(id)) throw new Refusal(BRANCH_TEXT.invalid)
  const op = JSON.parse(await d.host.read(`${operationPath(d, key, id)}.json`)) as MergeOperation
  if (op.version !== 1 || op.key !== key || op.id !== id || !isBranch(op.source) || !isBranch(op.target) || !isOid(op.sourceHead) || !isOid(op.targetHead)) throw new Refusal(BRANCH_TEXT.invalid)
  return op
}
export const operationsOf = async (d: TasksDeps, key: string) => {
  const names = (await d.host.list(operationsFolder(d.home, key))).filter(n => validId(n.replace(/\.json$/, '')) && n.endsWith('.json'))
  const ops = await Promise.all(names.map(n => loadOperation(d, key, n.slice(0, -5))))
  return ops.sort((a, b) => b.created - a.created)
}
const inFlight = new Set<string>()
// Directory creation is atomic across windows/processes. A crash leaves its
// owner PID; only a confirmed-dead owner can be released automatically.
export const withBranchLock = async <T>(d: TasksDeps, key: string, work: () => Promise<T>): Promise<T> => {
  const folder = operationsFolder(d.home, key); const lock = `${folder}/operation.lock`
  if (inFlight.has(folder)) throw new Refusal(BRANCH_TEXT.busy)
  inFlight.add(folder)
  let owned = false
  try {
    if ((await d.host.makeDirs(folder)).exitCode) throw new Error('creating integrations folder failed')
    let made = await d.host.makeDir(lock)
    if (made.exitCode !== 0) {
      const recovery = `${folder}/recovery.lock`
      if ((await d.host.makeDir(recovery)).exitCode) throw new Refusal(BRANCH_TEXT.busy)
      try {
        // Re-read under a separate recovery lock: two processes must not both
        // remove a dead lock and accidentally release the other's new lock.
        let pid: number
        try { pid = Number(await d.host.read(`${lock}/pid`)) } catch { throw new Refusal(BRANCH_TEXT.busy) /* An owner still creating its PID is live. */ }
        if (!Number.isInteger(pid) || pid <= 0) throw new Refusal(BRANCH_TEXT.busy)
        try { process.kill(pid, 0); throw new Refusal(BRANCH_TEXT.busy) } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'ESRCH') throw new Refusal(BRANCH_TEXT.busy)
        }
        await d.host.remove(`${lock}/pid`)
        if ((await d.host.removeDir(lock)).exitCode) throw new Refusal(BRANCH_TEXT.busy)
      } finally {
        if ((await d.host.removeDir(recovery)).exitCode) d.log.warn('Could not release the branch recovery lock')
      }
      made = await d.host.makeDir(lock)
    }
    if (made.exitCode) throw new Refusal(BRANCH_TEXT.busy)
    owned = true
    await d.host.write(`${lock}/pid`, String(process.pid))
    return await work()
  } finally {
    if (owned) {
      const removed = await d.host.remove(`${lock}/pid`)
      const dir = await d.host.removeDir(lock)
      if (removed.exitCode || dir.exitCode) d.log.warn('Could not release the branch operation lock')
    }
    inFlight.delete(folder)
  }
}
