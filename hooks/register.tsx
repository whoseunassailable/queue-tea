import { conversationState, afterTurn } from './features/conversation/presentation/state_management/conversation_turn_controller'
import { errandState, errandFor, giveBack, sendErrand } from './features/errands/presentation/state_management/errands_controller'
import { commitGuardState, commitWarning } from './features/commit_guard/presentation/state_management/commit_guard_controller'
import { gitRepositoryOf } from './shared/git/git_providers'
import { effortState, flush } from './shared/effort/presentation/state_management/effort_controller'
import { onViewChange, portsOf } from './core/ports/claude_ports'
import type { EngineInterface, Register } from 'claude-code'

import { afterClear, saveBeforeClear, tick, toggleMenu } from './actions'
import { askDone, checkResume, refreshDrift, refreshLines, taskLooksDone, taskSection } from './features/tasks/presentation/state_management/tasks_controller'
import { fileFromCommand } from './features/tasks/presentation/state_management/filing_controller'
import { runFeature } from './features/tasks/presentation/state_management/queue_controller'
import { loadRecord } from './shared/records/presentation/state_management/records_controller'
import { MENU, menuClosed, openMenu } from './core/store/menu'
import { commandRun } from './shared/checkpoints/domain/services/checkpoints'
import { ERRAND_NOT_SENT, ERRANDS, errandReply, errandUsage, isErrandTurn, startsAsCommand } from './features/errands/domain/services/errands'
import type { ErrandKind } from './features/errands/domain/services/errands'
import { onMessage } from './features/message_check/presentation/state_management/message_check_controller'
import { shouldCheck } from './features/message_check/domain/services/check_prompt'
import { isCommitOrPush } from './features/commit_guard/domain/services/commit_guard'
import { live } from './core/session/live'
import { debug } from './core/logger/logger'
import { getView } from './core/store/view_store'
import { refreshStatus } from './features/tea_cup/presentation/state_management/tea_cup_controller'
import { createTracker } from './shared/effort/domain/services/effort_tracker'
import { loadContext } from './session'
import { readOptions } from './core/session/options'
import { renderBand } from './ui/band'
import { renderMenu } from './ui/menu'
import { isoLocal } from './shared/time/domain/services/time'
import { readAllowance } from './features/conversation/domain/services/allowance'

const GUARD_TEXT = 'Queue-tea: commits and pushes are yours to make.'
const HELD_TEXT = 'Queue-tea: held for the band above the prompt'

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

async function startSession($: EngineInterface) {
  try {
    live.ctx = await loadContext($, live.opts)
    effortState.tracker = createTracker(live.opts.idleGapMinutes, live.ctx.offsetMinutes)
  } catch (err) {
    debug(portsOf($), 'loading the project failed', err)
  }
  $.clock.every(150, () => {
    tick($).catch(() => {})
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
  await registerCommand($, 'queue-tea', 'Open the Queue-tea menu')
  await registerCommand($, 'done', 'Ask whether the current Queue-tea task is done for now')
  await registerCommand($, 'steep', 'Steep a message for later: file it as a new Queue-tea task, with no check', '<message>')
  await registerCommand($, 'brew', 'Do this now, outside the Queue-tea queue: no task, same branch and conversation', '<request>')
  await registerCommand($, 'instant', 'The same as /brew', '<request>')
  await registerCommand($, 'tea', 'Ask or explain, outside the Queue-tea queue: no task, no changes', '<question>')
  await registerCommand($, 'feature', 'Show, set or clear the Queue-tea feature new tasks are offered under', '<task title> | off')
  try {
    await checkResume(portsOf($))
  } catch (err) {
    debug(portsOf($), 'checking the branch at the start failed', err)
  }
  await refreshStatus(portsOf($))
}

async function afterEachTurn($: EngineInterface) {
  const wasErrand = errandState.errand?.isRunning === true
  if (wasErrand) errandState.errand = null
  effortState.tracker?.activity(await $.clock.now())
  await flush(portsOf($))
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

async function checkTyped($: EngineInterface, text: string): Promise<'pass' | 'drop'> {
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
async function runErrand($: EngineInterface, kind: ErrandKind, command: string, args: string) {
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

export const register: Register = (on, options) => {
  live.opts = readOptions(options as Record<string, unknown>)
  onViewChange(refreshStatus)

  on('session.start', async ($, e, next) => {
    await startSession($)

    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    effortState.tracker?.activity(await $.clock.now())
    if (!shouldCheck(e)) return next(e)

    return (await checkTyped($, e.text)) === 'pass' ? next(e) : { drop: HELD_TEXT }
  })

  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)
    const section = taskSection(await getView($, 'record'))

    return section === null ? composed : { sections: [...composed.sections, section] }
  })

  on('tool.call', { tool: 'mcp__queue-tea__task_looks_done' }, async ($, e) => {
    if (errandState.errand?.isRunning === true) {
      return { result: 'This turn is a /brew or /tea errand, outside the task, so Rohan is not asked.' }
    }
    await taskLooksDone(portsOf($), e.checked)

    // A registered tool's result is what the model reads: a string, not a record.
    return { result: 'Rohan is asked in the Queue-tea menu whether the task is done for now.' }
  })

  on('tool.call', async ($, e, next) => {
    effortState.tracker?.activity(await $.clock.now())
    effortState.tracker?.toolCall(String(e.tool), e as unknown as Record<string, unknown>)

    return next(e)
  })

  // Each shell command Claude ran, and whether it passed, for the checkpoint.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const result = await next(e)
    if (result.deny === undefined && effortState.tracker !== null && live.ctx !== null) {
      const out = result.result as { stdout?: string; stderr?: string; interrupted?: boolean } | string | undefined
      const text = typeof out === 'string' ? out : `${out?.stdout ?? ''}\n${out?.stderr ?? ''}`
      const isOk = result.isError !== true && !(typeof out === 'object' && out?.interrupted === true)
      effortState.tracker.command(commandRun(e.command, isOk, text, isoLocal(await $.clock.now(), live.ctx.offsetMinutes)))
    }

    return result
  })

  on('session.measure', async ($, e, next) => {
    const allowance = readAllowance(e.rateLimits)
    if (allowance !== null) await portsOf($).set('allowance', allowance)

    return next(e)
  })

  // The commit a turn starts on, to name any commit that appears during it,
  // and whether the turn is an errand's.
  on('turn.start', async ($, e, next) => {
    if (isErrandTurn(e, errandState.errand)) errandState.errand = { ...errandState.errand!, isRunning: true }
    if (e.agentId === undefined && live.ctx !== null) {
      try {
        commitGuardState.turnHead = await gitRepositoryOf(portsOf($), live.ctx).head()
      } catch (err) {
        debug(portsOf($), 'reading the commit at the turn start failed', err)
        commitGuardState.turnHead = null
      }
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    // A subagent's end is not the main conversation's turn.
    if (e.agentId !== undefined) return next(e)
    await afterEachTurn($)

    return next(e)
  })

  on('session.end', async ($, e, next) => {
    await flush(portsOf($))

    return next(e)
  })

  // A /clear goes on under a new session id with the view's values started
  // over and no session.start, so the record is read again here.
  on('classic.SessionStart', async ($, e, next) => {
    if (e.source === 'clear') await afterClear($)

    return next(e)
  })

  // A /clear Rohan types during a task saves a checkpoint first.
  on('command.run', { command: 'clear' }, async ($, e, next) => {
    if (e.origin.kind === 'composer') {
      try {
        await saveBeforeClear($)
      } catch (err) {
        debug(portsOf($), 'the checkpoint before the clear failed', err)
      }
    }

    return next(e)
  })

  on('command.run', { command: 'queue-tea' }, async $ => {
    await openMenu(portsOf($))

    return { text: 'Queue-tea menu opened.' }
  })

  on('command.run', { command: 'done' }, async $ => {
    const isAsked = await askDone(portsOf($))
    await openMenu(portsOf($), 'current')

    return { text: isAsked ? 'Asked in the Queue-tea menu.' : 'No Queue-tea task is in progress.' }
  })

  on('command.run', { command: 'queue-tea-done' }, async $ => {
    const isAsked = await askDone(portsOf($))
    await openMenu(portsOf($), 'current')

    return { text: isAsked ? 'Asked in the Queue-tea menu.' : 'No Queue-tea task is in progress.' }
  })

  on('command.run', { command: 'steep' }, async ($, e) => {
    const text = (e.args ?? '').trim()
    if (text === '') return { text: 'Write the task after the command: /steep <message>' }
    await fileFromCommand(portsOf($), text)

    return { text: 'Pick its priority in the band above the prompt.' }
  })

  on('command.run', { command: 'queue-tea-steep' }, async ($, e) => {
    const text = (e.args ?? '').trim()
    if (text === '') return { text: 'Write the task after the command: /queue-tea-steep <message>' }
    await fileFromCommand(portsOf($), text)

    return { text: 'Pick its priority in the band above the prompt.' }
  })

  for (const command of ['feature', 'queue-tea-feature']) {
    on('command.run', { command }, async ($, e) => ({ text: await runFeature(portsOf($), e.args ?? '') }))
  }

  for (const [name, kind] of Object.entries(ERRANDS)) {
    for (const command of [name, `queue-tea-${name}`]) {
      on('command.run', { command }, ($, e) => runErrand($, kind, command, e.args ?? ''))
    }
  }

  on('ui.render', { component: 'Pane', requestId: MENU }, ($, e) => renderMenu($, e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => (await renderBand($, e)) ?? next(e))

  // The menu closed, by Esc, its close mark or the cup: nothing else changes.
  on('ui.close', async ($, e, next) => {
    if (e.id === MENU) await menuClosed(portsOf($))

    return next(e)
  })

  // A click on the tea cup opens or closes the menu.
  on('ui.message', async ($, e, next) => {
    const data = e.data as { kind?: unknown } | null
    if (e.element === 'cup' && typeof data === 'object' && data?.kind === 'press') await toggleMenu($)

    return next(e)
  })

  // The cup's surface module failed: from now on it is drawn still.
  on('ui.fault', async ($, e, next) => {
    if (e.element === 'cup') {
      debug(portsOf($), `the tea cup failed (${e.phase})`, e.reason)
      await portsOf($).set('isCupStill', true)
    }

    return next(e)
  })

  // A guard: when it fails it refuses rather than lets the command through.
  on('tool.call', { tool: 'Bash' }, ($, e, next) =>
    isCommitOrPush(e.command) ? { deny: GUARD_TEXT } : next(e),
  ).catch(($, e, next) => (next.called ? next(e) : { deny: GUARD_TEXT }))

  on('tool.call', { tool: 'Monitor' }, ($, e, next) =>
    e.command !== undefined && isCommitOrPush(e.command) ? { deny: GUARD_TEXT } : next(e),
  ).catch(($, e, next) => (next.called ? next(e) : { deny: GUARD_TEXT }))
}
