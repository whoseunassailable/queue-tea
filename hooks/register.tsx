import type { EngineInterface, Register } from 'claude-code'

import { afterClear, askDone, checkResume, fileFromCommand, flush, loadRecord, openPanel, saveBeforeClear, tick } from './actions'
import { commandRun } from './checkpoint'
import { ERRANDS, errandNote, errandReply, errandUsage, isErrandTurn } from './errand'
import type { ErrandKind } from './errand'
import { afterTurn, commitWarning, onMessage, refreshDrift, shouldCheck, taskLooksDone, taskSection } from './flow'
import { readHead } from './git'
import { isCommitOrPush } from './guard'
import { live } from './live'
import { debug, getView, portsOf, refreshStatus } from './ports'
import { createTracker } from './effort'
import { hostOf } from './host'
import { loadContext, readOptions } from './session'
import { renderBand } from './ui/band'
import { renderPanel } from './ui/panel'
import { isoLocal } from './time'
import { readAllowance } from './usage'
import { currentTask } from './queue'

const GUARD_TEXT = 'Queue-tea: commits and pushes are yours to make.'
const HELD_TEXT = 'Queue-tea: held for the band above the prompt'

// Registers a command, or its `queue-tea-` name when the short one is taken;
// says so in the panel.
async function registerCommand($: EngineInterface, name: string, description: string, argumentHint?: string) {
  const spec = argumentHint === undefined ? { description } : { description, argumentHint }
  try {
    await $.command.register({ name, ...spec })
  } catch (err) {
    debug($, `registering /${name} failed`, err)
    await $.command.register({ name: `queue-tea-${name}`, ...spec })
    await portsOf($).set('notice', `/${name} was taken, so it is /queue-tea-${name} here.`)
  }
}

async function startSession($: EngineInterface) {
  try {
    live.ctx = await loadContext($, live.opts)
    live.tracker = createTracker(live.opts.idleGapMinutes, live.ctx.offsetMinutes)
  } catch (err) {
    debug($, 'loading the project failed', err)
  }
  $.clock.every(150, () => {
    tick($).catch(() => {})
  })
  await loadRecord($)
  await $.tool.register({
    name: 'task_looks_done',
    description:
      'Call when your reply has finished what the current Queue-tea task asked. Rohan is then asked in the panel whether it is done for now.',
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
  await registerCommand($, 'queue-tea', 'Open the Queue-tea panel')
  await registerCommand($, 'done', 'Ask whether the current Queue-tea task is done for now')
  await registerCommand($, 'steep', 'Steep a message for later: file it as a new Queue-tea task, with no check', '<message>')
  await registerCommand($, 'brew', 'Do this now, outside the Queue-tea queue: no task, same branch and conversation', '<request>')
  await registerCommand($, 'instant', 'The same as /brew', '<request>')
  await registerCommand($, 'tea', 'Ask or explain, outside the Queue-tea queue: no task, no changes', '<question>')
  try {
    await checkResume($)
  } catch (err) {
    debug($, 'checking the branch at the start failed', err)
  }
  await refreshStatus($)
  void openPanel($)
}

async function afterEachTurn($: EngineInterface) {
  const wasErrand = live.errand?.isRunning === true
  if (wasErrand) live.errand = null
  live.tracker?.activity(await $.clock.now())
  await flush($)
  if (live.ctx === null) return
  try {
    await commitWarning(portsOf($), live.ctx, live.turnHead)
  } catch (err) {
    debug($, 'looking for new commits failed', err)
  }
  live.turnHead = null
  try {
    await refreshDrift(portsOf($), live.ctx)
  } catch (err) {
    debug($, 'reading the drift failed', err)
  }
  try {
    const usage = await $.session.usage()
    const allowance = readAllowance(usage.rateLimits)
    // An errand's answer stays on screen: a fresh conversation past the size
    // waits for the next turn. The note at the allowance mark does not.
    live.handedOffFor = await afterTurn(
      portsOf($),
      live.ctx,
      { tokens: wasErrand ? undefined : usage.context.tokens, allowance },
      live.handedOffFor,
    )
  } catch (err) {
    debug($, 'the usage check failed', err)
  }
}

async function checkTyped($: EngineInterface, text: string): Promise<'pass' | 'drop'> {
  const ctx = live.ctx
  if (ctx === null) return 'pass'
  const p = portsOf($)
  await p.set('canContinue', false)
  const { verdict, intent, kind } = await onMessage(p, ctx, text)
  live.tracker?.route(kind === 'quick' ? 'project' : 'task')
  if (intent !== null && kind !== 'quick') live.tracker?.intent(intent)

  return verdict
}

// /brew, /instant and /tea: the errand's note goes in the command's context,
// and the words go to Claude as Rohan's own once the command is done (a submit
// from the command's own hook would wait on it). Time goes to the project, as
// after a quick question.
async function runErrand($: EngineInterface, kind: ErrandKind, command: string, args: string) {
  const text = args.trim()
  if (text === '') return { text: errandUsage(command, kind) }
  const record = await getView($, 'record')
  live.errand = { kind, text, isRunning: false }
  live.tracker?.route('project')
  portsOf($).later(async () => {
    try {
      await $.prompt.submit({ text, asUser: true })
    } catch (err) {
      live.errand = null
      debug($, `/${command} failed`, err)
    }
  })

  return { text: errandReply(kind), context: [errandNote(kind, record === null ? null : currentTask(record.tasks))] }
}

export const register: Register = (on, options) => {
  live.opts = readOptions(options as Record<string, unknown>)

  on('session.start', async ($, e, next) => {
    await startSession($)

    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    live.tracker?.activity(await $.clock.now())
    if (!shouldCheck(e)) return next(e)

    return (await checkTyped($, e.text)) === 'pass' ? next(e) : { drop: HELD_TEXT }
  })

  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)
    const section = taskSection(await getView($, 'record'))

    return section === null ? composed : { sections: [...composed.sections, section] }
  })

  on('tool.call', { tool: 'mcp__queue-tea__task_looks_done' }, async ($, e) => {
    if (live.errand?.isRunning === true) {
      return { result: 'This turn is a /brew or /tea errand, outside the task, so Rohan is not asked.' }
    }
    await taskLooksDone(portsOf($), e.checked)

    // A registered tool's result is what the model reads: a string, not a record.
    return { result: 'Rohan is asked in the panel whether the task is done for now.' }
  })

  on('tool.call', async ($, e, next) => {
    live.tracker?.activity(await $.clock.now())
    live.tracker?.toolCall(String(e.tool), e as unknown as Record<string, unknown>)

    return next(e)
  })

  // Each shell command Claude ran, and whether it passed, for the checkpoint.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const result = await next(e)
    if (result.deny === undefined && live.tracker !== null && live.ctx !== null) {
      const out = result.result as { stdout?: string; stderr?: string; interrupted?: boolean } | string | undefined
      const text = typeof out === 'string' ? out : `${out?.stdout ?? ''}\n${out?.stderr ?? ''}`
      const isOk = result.isError !== true && !(typeof out === 'object' && out?.interrupted === true)
      live.tracker.command(commandRun(e.command, isOk, text, isoLocal(await $.clock.now(), live.ctx.offsetMinutes)))
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
    if (isErrandTurn(e, live.errand)) live.errand = { ...live.errand!, isRunning: true }
    if (e.agentId === undefined && live.ctx !== null) {
      try {
        live.turnHead = await readHead(hostOf($), live.ctx.projectPath)
      } catch (err) {
        debug($, 'reading the commit at the turn start failed', err)
        live.turnHead = null
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
    await flush($)

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
        debug($, 'the checkpoint before the clear failed', err)
      }
    }

    return next(e)
  })

  on('command.run', { command: 'queue-tea' }, async $ => {
    await openPanel($, true)

    return { text: 'Queue-tea panel opened.' }
  })

  on('command.run', { command: 'done' }, async $ => {
    const isAsked = await askDone($)
    await openPanel($)

    return { text: isAsked ? 'Asked in the Queue-tea panel.' : 'No Queue-tea task is in progress.' }
  })

  on('command.run', { command: 'queue-tea-done' }, async $ => {
    const isAsked = await askDone($)
    await openPanel($)

    return { text: isAsked ? 'Asked in the Queue-tea panel.' : 'No Queue-tea task is in progress.' }
  })

  on('command.run', { command: 'steep' }, async ($, e) => {
    const text = (e.args ?? '').trim()
    if (text === '') return { text: 'Write the task after the command: /steep <message>' }
    await fileFromCommand($, text)

    return { text: 'Pick its priority in the band above the prompt.' }
  })

  on('command.run', { command: 'queue-tea-steep' }, async ($, e) => {
    const text = (e.args ?? '').trim()
    if (text === '') return { text: 'Write the task after the command: /queue-tea-steep <message>' }
    await fileFromCommand($, text)

    return { text: 'Pick its priority in the band above the prompt.' }
  })

  for (const [name, kind] of Object.entries(ERRANDS)) {
    for (const command of [name, `queue-tea-${name}`]) {
      on('command.run', { command }, ($, e) => runErrand($, kind, command, e.args ?? ''))
    }
  }

  on('ui.render', { component: 'Pane', requestId: 'queue-tea' }, ($, e) => renderPanel($, e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => (await renderBand($, e)) ?? next(e))

  // A guard: when it fails it refuses rather than lets the command through.
  on('tool.call', { tool: 'Bash' }, ($, e, next) =>
    isCommitOrPush(e.command) ? { deny: GUARD_TEXT } : next(e),
  ).catch(($, e, next) => (next.called ? next(e) : { deny: GUARD_TEXT }))

  on('tool.call', { tool: 'Monitor' }, ($, e, next) =>
    e.command !== undefined && isCommitOrPush(e.command) ? { deny: GUARD_TEXT } : next(e),
  ).catch(($, e, next) => (next.called ? next(e) : { deny: GUARD_TEXT }))
}
