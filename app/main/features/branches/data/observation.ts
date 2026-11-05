import type { Task, TaskActivity } from '../../../../../types'
import { activityEntries, finishActivity, toolActivity } from '../../../../../hooks/shared/activity/domain/services/activity'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import type { BranchState } from '../../../../shared/branches'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_LIMITS } from '../domain/constants'

type Observation = { state: BranchState; seenAt: number | null; steps: TaskActivity[] }
type CodexEvent = { timestamp?: string; type?: string; payload?: Record<string, unknown> }
const observations = new Map<string, { modified: number; since: number; cwd: unknown; value: Observation }>()

// Passive, local JSONL adapter. Only explicit tool calls/results are evidence;
// assistant prose is never turned into a successful command or passing check.
export const codexEvents = (text: string, since: number, now: number): Observation => {
  const steps = new Map<string, TaskActivity>()
  let seenAt: number | null = null; let running = false; let complete = false
  for (const line of text.split('\n')) {
    let row: CodexEvent
    try { row = JSON.parse(line) as CodexEvent } catch { continue /* Codex may be writing the final line. */ }
    const at = Date.parse(row?.timestamp ?? '')
    if (!Number.isFinite(at) || at < since || at > now + 1000) continue
    const p = row.payload
    if (!p) continue
    seenAt = Math.max(seenAt ?? 0, at)
    if (row.type === 'event_msg' && p.type === 'task_started') { running = true; complete = false }
    if (row.type === 'event_msg' && (p.type === 'task_complete' || p.type === 'turn_aborted')) { running = false; complete = p.type === 'task_complete' }
    if (row.type !== 'response_item') continue
    if (p.type === 'message' && p.role === 'assistant' && p.phase === 'final_answer') { running = false; complete = true }
    if (p.type === 'function_call' && typeof p.call_id === 'string' && (p.name === 'exec_command' || p.name === 'shell_command' || p.name === 'shell')) {
      let input: Record<string, unknown>
      try { input = JSON.parse(String(p.arguments)) as Record<string, unknown> } catch { continue /* Incomplete arguments provide no evidence. */ }
      const command = typeof input.cmd === 'string' ? input.cmd : typeof input.command === 'string' ? input.command : null
      if (!command) continue
      const step = toolActivity('Bash', { command }, `codex-${p.call_id}`, new Date(at).toISOString())
      if (step) steps.set(p.call_id, step)
      running = true; complete = false
    }
    if (p.type === 'function_call_output' && typeof p.call_id === 'string' && steps.has(p.call_id)) {
      const output = typeof p.output === 'string' ? p.output : JSON.stringify(p.output)
      // The exec runner's explicit exit code is the result. A session ID alone
      // means a background process, so keep it running until its result arrives.
      const match = /(?:Process exited with code|Exit code:)\s*(\d+)/.exec(output ?? '')
      const step = steps.get(p.call_id)!
      if (match) steps.set(p.call_id, finishActivity(step, { result: { stdout: output, exitCode: Number(match[1]) } }, new Date(at).toISOString()))
      else steps.set(p.call_id, { ...step, output: (output ?? '').slice(0, BRANCH_LIMITS.output), truncated: (output?.length ?? 0) > BRANCH_LIMITS.output })
    }
  }
  return { seenAt, state: complete ? 'review' : running && seenAt !== null && now - seenAt < BRANCH_LIMITS.recentMs ? 'working' : 'unobserved', steps: [...steps.values()].slice(-100) }
}

export const observeTask = async (d: TasksDeps, root: string, task: Task): Promise<Observation> => {
  const steps = activityEntries(task.activity)
  if (task.state !== 'current') return { state: task.state === 'done' ? 'review' : 'queued', steps, seenAt: null }
  const folder = task.worktreePath ?? root
  if (task.codexSince) {
    const since = Date.parse(task.codexSince); const now = d.now()
    let newest: Observation = { state: 'unobserved', seenAt: null, steps }
    try {
      const start = Math.max(since - 86_400_000, now - BRANCH_LIMITS.codexDays * 86_400_000)
      for (let day = Math.floor(start / 86_400_000) * 86_400_000; day <= now + 86_400_000; day += 86_400_000) {
        const dir = `${d.home}/.codex/sessions/${new Date(day).toISOString().slice(0, 10).replace(/-/g, '/')}`
        for (const name of (await d.host.list(dir)).filter(n => n.endsWith('.jsonl'))) {
          const file = `${dir}/${name}`
          const modified = (await d.host.modifiedAt(file)) ?? 0
          if (modified < since) continue
          let cached = observations.get(file)
          if (!cached || cached.modified !== modified || cached.since !== since) {
            const text = await d.host.read(file)
            let cwd: unknown
            try { cwd = (JSON.parse(text.split('\n', 1)[0]!) as CodexEvent).payload?.cwd } catch { continue /* Partly written metadata cannot identify a task. */ }
            cached = { modified, since, cwd, value: codexEvents(text, since, now) }
            if (observations.size >= 128) observations.delete(observations.keys().next().value!)
            observations.set(file, cached)
          }
          if (cached.cwd !== folder) continue
          const observed = cached.value
          const state = observed.state === 'working' && now - (observed.seenAt ?? 0) >= BRANCH_LIMITS.recentMs ? 'unobserved' : observed.state
          if ((observed.seenAt ?? 0) > (newest.seenAt ?? 0)) newest = { ...observed, state, steps: [...steps, ...observed.steps].slice(-200) }
        }
      }
    } catch (err) { d.log.warn(`Codex observation unavailable: ${err instanceof Error ? err.stack : String(err)}`) }
    return newest
  }
  const sessions = (await sessionsRepositoryImpl(d.host, d.home).list()).filter(s => (s.workingPath ?? s.projectPath) === folder && isFresh(s, d.now()))
  const seenAt = sessions.length ? Math.max(...sessions.map(s => s.heartbeat)) : null
  const state: BranchState = sessions.some(s => s.isTurnRunning) ? 'working' : sessions.some(s => s.cup.mood === 'attention') ? 'needsYou' : task.review ? 'review' : 'paused'
  return { state, seenAt, steps }
}
