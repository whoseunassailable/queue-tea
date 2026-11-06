import type { EngineInterface } from 'claude-code'
import { debug } from '../../core/logger/logger'
import { portsOf } from '../../core/ports/claude_ports'
import type { Ports } from '../../core/ports/ports'
import { live } from '../../core/session/live'
import { QUEUE_TEA_COMMANDS } from '../../core/session/commands'
import { commitGuardState, commitWarning } from '../../features/commit_guard/presentation/state_management/commit_guard_controller'
import { readAllowance } from '../../features/conversation/domain/services/allowance'
import { afterTurn, conversationState } from '../../features/conversation/presentation/state_management/conversation_turn_controller'
import { ERRAND_NOT_SENT, errandReply, errandUsage, startsAsCommand } from '../../features/errands/domain/services/errands'
import type { ErrandKind } from '../../features/errands/domain/services/errands'
import { errandFor, errandState, giveBack, sendErrand } from '../../features/errands/presentation/state_management/errands_controller'
import { onMessage } from '../../features/message_check/presentation/state_management/message_check_controller'
import { followRecord } from '../../features/tasks/presentation/state_management/requests_controller'
import { checkResume, refreshDrift, refreshLines } from '../../features/tasks/presentation/state_management/tasks_controller'
import { refreshStatus } from '../../features/tea_cup/presentation/state_management/tea_cup_controller'
import { isStartingFresh, writeHandoff } from '../../shared/assistant/presentation/state_management/conversation_controller'
import { createTracker } from '../../shared/effort/domain/services/effort_tracker'
import { effortState, flush } from '../../shared/effort/presentation/state_management/effort_controller'
import { currentTask } from '../../shared/records/domain/services/queue_rules'
import { loadRecord } from '../../shared/records/presentation/state_management/records_controller'
import { recordsRepositoryOf } from '../../shared/records/records_providers'
import { HEARTBEAT_MS } from '../../shared/sessions/domain/services/session_rules'
import { isoLocal } from '../../shared/time/domain/services/time'
import { loadContext } from './load_context'
import { beat } from './session_beat'

// A typed /clear saves a checkpoint first only past this size: a smaller
// conversation holds little the turns haven't saved already.
const CLEAR_CHECKPOINT_TOKENS = 20_000

// How often a session looks for what the app changed.
const FOLLOW_MS = 2_000

// Registers a command, or its `queue-tea-` name when the short one is taken;
// says so in the menu.
async function registerCommand($: EngineInterface, name: string, description: string, argumentHint?: string) {
  const spec = argumentHint === undefined ? { description } : { description, argumentHint }
  try {
    await $.command.register({ name, ...spec })
  } catch (err) {
    debug(portsOf($), `registering /${name} failed`, err)
    await $.command.register({ name: `queue-tea-${name}`, ...spec })
    await portsOf($).set('notice', `/${name} was taken, so it is /queue-tea-${name} here.`)
  }
}

export async function startSession($: EngineInterface) {
  try {
    live.ctx = await loadContext($, live.opts)
    effortState.tracker = createTracker(live.opts.idleGapMinutes, live.ctx.offsetMinutes)
  } catch (err) {
    debug(portsOf($), 'loading the project failed', err)
  }
  $.clock.every(150, () => {
    // A frame the spinner misses is not worth a log.
    tick(portsOf($)).catch(() => {})
  })
  await loadRecord(portsOf($))
  await $.tool.register({
    name: 'task_looks_done',
    description:
      'Call when your reply has finished what the current Queue-tea task asked. Rohan is then asked in the Queue-tea menu whether it is done for now.',
    inputSchema: {
      type: 'object',
      properties: {
        checked: {
          type: 'string',
          description:
            'Optional. One line on what you checked before calling, such as the tests you ran and what they showed. Shown to Rohan beside the question.',
        },
      },
    },
    isDeferred: false,
  })
  for (const command of QUEUE_TEA_COMMANDS) {
    await registerCommand($, command.name, command.description, 'argumentHint' in command ? command.argumentHint : undefined)
  }
  try {
    await checkResume(portsOf($))
  } catch (err) {
    debug(portsOf($), 'checking the branch at the start failed', err)
  }
  await refreshStatus(portsOf($))
  await beat(portsOf($))
  $.clock.every(HEARTBEAT_MS, () => {
    // beat logs its own failures.
    void beat(portsOf($))
  })
  $.clock.every(FOLLOW_MS, () => {
    const ctx = live.ctx
    if (ctx === null) return
    followRecord(portsOf($), ctx).catch(err => debug(portsOf($), "following the app's changes failed", err))
  })
}

export async function afterEachTurn($: EngineInterface) {
  const wasErrand = errandState.errand?.isRunning === true
  if (wasErrand) errandState.errand = null
  live.isTurnRunning = false
  effortState.tracker?.activity(await $.clock.now())
  await flush(portsOf($))
  await beat(portsOf($))
  if (live.ctx === null) return
  try {
    await commitWarning(portsOf($), live.ctx, commitGuardState.turnHead)
  } catch (err) {
    debug(portsOf($), 'looking for new commits failed', err)
  }
  commitGuardState.turnHead = null
  try {
    await refreshDrift(portsOf($), live.ctx)
  } catch (err) {
    debug(portsOf($), 'reading the drift failed', err)
  }
  try {
    await refreshLines(portsOf($), live.ctx)
  } catch (err) {
    debug(portsOf($), 'measuring the change failed', err)
  }
  try {
    const usage = await $.session.usage()
    const allowance = readAllowance(usage.rateLimits)
    // An errand's answer stays on screen: a fresh conversation past the size
    // waits for the next turn. The note at the allowance mark does not.
    conversationState.handedOffFor = await afterTurn(
      portsOf($),
      live.ctx,
      { tokens: wasErrand ? undefined : usage.context.tokens, allowance },
      conversationState.handedOffFor,
    )
  } catch (err) {
    debug(portsOf($), 'the usage check failed', err)
  }
}

export async function checkTyped($: EngineInterface, text: string): Promise<'pass' | 'drop'> {
  const ctx = live.ctx
  if (ctx === null) return 'pass'
  const p = portsOf($)
  await p.set('canContinue', false)
  const { verdict, intent, kind } = await onMessage(p, ctx, text)
  // A held message counts once it is sent on from the band.
  if (verdict === 'pass') {
    effortState.tracker?.route(kind === 'quick' ? 'project' : 'task')
    if (intent !== null && kind !== 'quick') effortState.tracker?.intent(intent)
  }

  return verdict
}

// /brew, /instant and /tea: the errand's note goes in the command's context,
// and the words go to Claude as Rohan's own once the command is done. Words
// that start with / are not sent; they go back in the prompt box once the
// command is done with it.
export async function runErrand($: EngineInterface, kind: ErrandKind, command: string, args: string) {
  const text = args.trim()
  if (text === '') return { text: errandUsage(command, kind) }
  if (startsAsCommand(text)) {
    portsOf($).later(async () => {
      await giveBack(portsOf($), command, text)
    })

    return { text: ERRAND_NOT_SENT }
  }
  const note = await errandFor(portsOf($), kind, text)
  sendErrand(portsOf($), text, command)

  return { text: errandReply(kind), context: [note] }
}

// Puts the record's last good copy in place of the one that can't be read,
// keeping the broken file beside it, then reads it as at a session's start.
export async function pressRestore(p: Ports) {
  const ctx = live.ctx
  if (ctx === null) return
  try {
    const stamp = isoLocal(await p.now(), ctx.offsetMinutes).slice(0, 19).replace(/:/g, '-')
    const restored = await recordsRepositoryOf(p, ctx).restore(stamp)
    if (typeof restored === 'object') {
      p.toast(`Queue-tea: back to the last good copy. The broken record is kept as ${restored.keptAt.split('/').pop()}`)
    }
  } catch (err) {
    debug(p, 'restoring the record failed', err)
  }
  await loadRecord(p)
  if ((await p.get('load')) === 'ready') await checkResume(p)
}

// After a /clear: the record again, and Continue when the clear wasn't one
// Queue-tea made to start a conversation of its own.
export async function afterClear(p: Ports) {
  await loadRecord(p)
  if (!isStartingFresh()) await checkResume(p)
  await beat(p)
}

// Before a /clear Rohan types during a task: a checkpoint, so the clear loses
// nothing. The clear goes ahead whatever happens.
export async function saveBeforeClear(p: Ports) {
  const ctx = live.ctx
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks, ctx)
  if (ctx === null || current === null || isStartingFresh()) return
  const tokens = (await p.session.usage()).context.tokens
  if (tokens === undefined || tokens < CLEAR_CHECKPOINT_TOKENS) return

  await p.set('busy', 'Saving a checkpoint before the clear…')
  try {
    await flush(p)
    await writeHandoff(p, ctx, current.id)
  } finally {
    await p.set('busy', null)
  }
}

export async function tick(p: Ports) {
  const isWaiting = (await p.get('load')) === 'loading' || (await p.get('isChecking')) || (await p.get('busy')) !== null
  if (isWaiting) await p.set('spin', (await p.get('spin')) + 1)
}
