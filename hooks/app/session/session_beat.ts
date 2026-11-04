import type { Ctx } from '../../core/env/env'
import { debug } from '../../core/logger/logger'
import type { Ports } from '../../core/ports/ports'
import { live } from '../../core/session/live'
import { readCup } from '../../features/tea_cup/presentation/state_management/tea_cup_controller'
import { currentTask } from '../../shared/records/domain/services/queue_rules'
import { isFresh } from '../../shared/sessions/domain/services/session_rules'
import { sessionsRepositoryOf } from '../../shared/sessions/sessions_providers'

// What sessions that crashed left behind, gone at the next session's start.
const clearCrashed = async (p: Ports, ctx: Ctx, now: number): Promise<void> => {
  const sessions = sessionsRepositoryOf(p, ctx)
  for (const session of await sessions.list()) {
    if (!isFresh(session, now)) await sessions.remove(session.id)
  }
}

const writeBeat = async (p: Ports, ctx: Ctx): Promise<void> => {
  const sessions = sessionsRepositoryOf(p, ctx)
  const id = await p.session.id()
  const now = await p.now()
  if (live.sessionId === null) await clearCrashed(p, ctx, now)
  // A /clear goes on under a new id, so the old file goes.
  if (live.sessionId !== null && live.sessionId !== id) await sessions.remove(live.sessionId)
  live.sessionId = id
  live.startedAt ??= now
  const record = await p.get('record')
  const cup = await readCup(p, live.isTurnRunning)
  await sessions.write({
    id,
    projectPath: ctx.projectPath,
    workingPath: ctx.cwd,
    recordFile: ctx.file,
    currentTaskId: record === null ? null : (currentTask(record.tasks, ctx)?.id ?? null),
    isTurnRunning: live.isTurnRunning,
    cup: { mood: cup.mood, line: cup.line },
    allowance: await p.get('allowance'),
    warning: await p.get('warning'),
    options: ctx.options,
    heartbeat: now,
    startedAt: live.startedAt,
  })
}

// Tells the app where this session is. The app does without it for a beat, so
// a failure is logged and work carries on.
export async function beat(p: Ports): Promise<void> {
  if (live.ctx === null) return
  try {
    await writeBeat(p, live.ctx)
  } catch (err) {
    debug(p, 'writing the session file failed', err)
  }
}

export async function endBeat(p: Ports): Promise<void> {
  if (live.ctx === null || live.sessionId === null) return
  try {
    await sessionsRepositoryOf(p, live.ctx).remove(live.sessionId)
    live.sessionId = null
  } catch (err) {
    debug(p, 'removing the session file failed', err)
  }
}
