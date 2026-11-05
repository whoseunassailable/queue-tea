import type { Task, TaskActivity } from '../../../../../types'
import { activityEntries } from '../../../../../hooks/shared/activity/domain/services/activity'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import type { BranchState } from '../../../../shared/branches'
import type { TasksDeps } from '../../tasks/api/scope'
import { readCodexSession } from './codex_source'
export { codexEvents } from './codex_events'

type Observation = { state: BranchState; seenAt: number | null; steps: TaskActivity[] }
export const observeTask = async (d: TasksDeps, root: string, task: Task): Promise<Observation> => {
  const steps = activityEntries(task.activity)
  const folder = task.worktreePath ?? root
  let codex: Awaited<ReturnType<typeof readCodexSession>> = { state: 'unobserved', seenAt: null, steps: [] }
  if (task.started || task.codexSince) {
    try { codex = await readCodexSession(d, folder, Date.parse(task.codexSince ?? task.started!)) }
    catch (err) { d.log.error('Reading Codex activity failed', err) }
  }
  const until = task.finished ? Date.parse(task.finished) : Infinity
  const history = [...steps, ...codex.steps.filter(s => Date.parse(s.at) <= until)].sort((a, b) => Date.parse(a.at) - Date.parse(b.at)).slice(-200)
  if (task.state !== 'current') return { state: task.state === 'done' ? 'review' : 'queued', steps: history, seenAt: codex.seenAt }
  if (task.codexSince) return { ...codex, steps: history }
  const sessions = (await sessionsRepositoryImpl(d.host, d.home).list()).filter(s => (s.workingPath ?? s.projectPath) === folder && isFresh(s, d.now()))
  const seenAt = sessions.length ? Math.max(...sessions.map(s => s.heartbeat)) : null
  const state: BranchState = sessions.some(s => s.isTurnRunning) ? 'working' : sessions.some(s => s.cup.mood === 'attention') ? 'needsYou' : task.review ? 'review' : 'paused'
  return { state, seenAt, steps: history }
}
