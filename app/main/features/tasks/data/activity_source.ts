import type { Task } from '../../../../../types'
import type { Host } from '../../../../../hooks/core/host/host'
import type { QuestActivity } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'

export const COMMIT_ACTIVITY_LIMIT = 20

// The step the quest is on, as saved, and its commits. Read only local refs:
// no fetch, push, or terminal process is started. A ref containing a commit is
// evidence of local tracking state, not a live remote.
export const readActivity = async (host: Host, log: Logger, path: string, task: Task): Promise<QuestActivity> => {
  const activity: QuestActivity = { step: task.step ?? null, commits: [], gitUnavailable: false }
  if (task.branch === null || task.startCommit === null) return activity
  if (!/^[\da-f]{7,64}$/i.test(task.startCommit)) return { ...activity, gitUnavailable: true }
  try {
    const ran = await host.run(['git', 'log', `--max-count=${COMMIT_ACTIVITY_LIMIT}`, '--format=%H%x00%cI%x00%s', '--end-of-options', `${task.startCommit}..refs/heads/${task.branch}`, '--'], path)
    if (ran.exitCode !== 0) throw new Error(ran.stderr)
    for (const line of ran.stdout.split('\n').filter(Boolean)) {
      const [id, at, message] = line.split('\0')
      if (id === undefined || at === undefined || message === undefined || !/^[\da-f]{40,64}$/i.test(id) || !Number.isFinite(Date.parse(at))) continue
      const refs = await host.run(['git', 'for-each-ref', `--contains=${id}`, '--format=%(refname)', 'refs/remotes/'], path)
      if (refs.exitCode !== 0) log.warn(`reading tracking branches failed: ${refs.stderr}`)
      activity.commits.push({ id, at, message, remotes: refs.exitCode === 0 ? refs.stdout.split('\n').filter(ref => ref.startsWith('refs/remotes/') && !ref.endsWith('/HEAD')).map(ref => ref.slice('refs/remotes/'.length)) : null })
    }
  } catch (err) {
    log.error('reading quest activity from git failed', err)
    activity.gitUnavailable = true
  }

  return activity
}
