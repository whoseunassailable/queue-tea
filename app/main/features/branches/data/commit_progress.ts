import { randomUUID } from 'node:crypto'
import type { CommitProgress } from '../../../../shared/branches'
import type { TasksDeps } from '../../tasks/api/scope'
import { operationsFolder } from '../domain/constants'
export const writeReceipt = async (d: TasksDeps, file: string, data: unknown) => {
  const temp = `${file}.${randomUUID()}.tmp`
  await d.host.write(temp, JSON.stringify(data))
  const moved = await d.host.move(temp, file)
  if (moved.exitCode) throw new Error(`Saving commit progress failed: ${moved.stderr}`)
}
export const readCommitProgress = async (d: TasksDeps, key: string, taskId: string): Promise<CommitProgress | null> => {
  const folder = operationsFolder(d.home, key); let latest: CommitProgress | null = null
  for (const file of (await d.host.list(folder)).filter(f => /^commit-[a-f0-9]{64}\.json$/.test(f))) {
    const receipt = JSON.parse(await d.host.read(`${folder}/${file}`)) as { taskId?: string; progress?: CommitProgress & { owner?: number } }
    const progress = receipt.progress
    if (receipt.taskId !== taskId || !progress || latest && latest.at > progress.at) continue
    if (progress.status === 'running' && progress.owner !== process.pid) {
      try { if (progress.owner) process.kill(progress.owner, 0) } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ESRCH') progress.status = 'interrupted'
        else d.log.warn(`Commit owner could not be inspected: ${String(err)}`)
      }
    }
    latest = progress
  }
  return latest
}
