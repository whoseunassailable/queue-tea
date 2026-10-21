import type { EngineInterface } from 'claude-code'

import type { Difficulty, Priority, ProjectRecord } from '../types'
import { applyPending } from './effort'
import {
  blockTask,
  closeBand,
  continueTask,
  fileTask,
  finishDocs,
  finishTask,
  isStartingFresh,
  putBack,
  refreshDrift,
  removeQueued,
  sendHeld as sendHeldOn,
  showBand,
  startTask,
  switchToTask,
  togglePlayNext,
  unblockTask,
  writeHandoff,
} from './flow'
import type { Block, View } from './flow'
import { readFacts, readGit } from './git'
import { hostOf } from './host'
import { live } from './live'
import { nextBudget, suggest } from './plan'
import { debug, getView, portsOf } from './ports'
import { currentTask, setPriority } from './queue'
import { readOthers, readRecord, updateRecord } from './record'
import { isoLocal } from './time'

// A typed /clear saves a checkpoint first only past this size: a smaller
// conversation holds little the turns haven't saved already.
const CLEAR_CHECKPOINT_TOKENS = 20_000

// What the hooks, the panel and the band do. Each takes `$` and acts through
// the same ports.

export async function loadRecord($: EngineInterface) {
  const p = portsOf($)
  const ctx = live.ctx
  if (ctx === null) {
    await p.set('load', 'failed')

    return
  }
  await p.set('load', 'loading')
  try {
    const record = await readRecord(hostOf($), ctx.file, ctx.projectName, ctx.projectPath)
    if (record === 'unreadable') {
      await p.set('load', 'failed')

      return
    }
    await p.set('record', record)
    await p.set('load', 'ready')
  } catch (err) {
    debug($, 'reading the record failed', err)
    await p.set('load', 'failed')

    return
  }
  try {
    await p.set('others', await readOthers(hostOf($), ctx.file, r => suggest(r, null)?.title ?? null))
  } catch (err) {
    debug($, "reading the other projects' records failed", err)
  }
}

async function changeRecord($: EngineInterface, fn: (r: ProjectRecord) => ProjectRecord) {
  const p = portsOf($)
  const ctx = live.ctx
  if (ctx === null) return
  try {
    const saved = await updateRecord(hostOf($), ctx.file, fn, ctx.projectName, ctx.projectPath)
    if (saved === 'unreadable') await p.set('load', 'failed')
    else await p.set('record', saved)
  } catch (err) {
    debug($, 'writing the record failed', err)
  }
}

// Writes what the tracker gathered since the last flush into the record,
// and, with a task current, what git says now into its checkpoint.
export async function flush($: EngineInterface) {
  const tracker = live.tracker
  const ctx = live.ctx
  if (tracker === null || ctx === null) return
  const pending = tracker.take()
  const record = await getView($, 'record')
  let seen: { at: string; git: Awaited<ReturnType<typeof readFacts>> } | undefined
  if (record !== null && currentTask(record.tasks) !== null) {
    try {
      seen = { at: isoLocal(await $.clock.now(), ctx.offsetMinutes), git: await readFacts(hostOf($), ctx.projectPath) }
    } catch (err) {
      debug($, 'reading git for the checkpoint failed', err)
    }
  }
  await changeRecord($, r => applyPending(r, pending, seen))
}

// At a session's start with a current task: offer Continue, and Switch when
// another branch is checked out.
export async function checkResume($: EngineInterface) {
  const p = portsOf($)
  const ctx = live.ctx
  const record = await getView($, 'record')
  const current = record === null ? null : currentTask(record.tasks)
  if (ctx === null || current === null) return

  await p.set('canContinue', true)
  if (current.branch === null) return
  const git = await readGit(hostOf($), ctx.projectPath)
  if (git.isRepo && git.branch !== current.branch) {
    await p.set('mismatch', `You're on ${git.branch ?? 'a detached HEAD'}; this task is on ${current.branch}.`)
  }
  await refreshDrift(p, ctx)
}

// After a /clear: the record again, and Continue when the clear wasn't one
// Queue-tea made to start a conversation of its own.
export async function afterClear($: EngineInterface) {
  await loadRecord($)
  if (!isStartingFresh()) await checkResume($)
}

// Before a /clear Rohan types during a task: a checkpoint, so the clear loses
// nothing. The clear goes ahead whatever happens.
export async function saveBeforeClear($: EngineInterface) {
  const p = portsOf($)
  const ctx = live.ctx
  const record = await getView($, 'record')
  const current = record === null ? null : currentTask(record.tasks)
  if (ctx === null || current === null || isStartingFresh()) return
  const tokens = (await $.session.usage()).context.tokens
  if (tokens === undefined || tokens < CLEAR_CHECKPOINT_TOKENS) return

  await p.set('busy', 'Saving a checkpoint before the clear…')
  try {
    await flush($)
    await writeHandoff(p, ctx, current.id)
  } finally {
    await p.set('busy', null)
  }
}

export async function tick($: EngineInterface) {
  const isWaiting =
    (await getView($, 'load')) === 'loading' || (await getView($, 'isChecking')) || (await getView($, 'busy')) !== null
  if (isWaiting) await portsOf($).set('spin', (await getView($, 'spin')) + 1)
}

// With `focus`, the panel takes the keys so its hotkeys work at once (only
// over an empty prompt; otherwise it opens without them).
export async function openPanel($: EngineInterface, focus = false) {
  const name = live.ctx?.projectName ?? 'this project'
  await $.ui.open(focus ? { id: 'queue-tea', title: `Queue-tea · ${name}`, focus } : { id: 'queue-tea', title: `Queue-tea · ${name}` })
}

export async function pressStart($: EngineInterface, taskId: string) {
  await portsOf($).set('isPaletteOpen', false)
  if (live.ctx !== null) await startTask(portsOf($), live.ctx, taskId)
}

// Starts the task marked ★.
export async function pressStartNext($: EngineInterface) {
  const record = await getView($, 'record')
  const next = record === null ? null : suggest(record, await getView($, 'budget'))
  if (next !== null) await pressStart($, next.id)
}

// Opens the blocking view for a task: what it waits for, or a reason.
export async function pressBlock($: EngineInterface, taskId: string) {
  const p = portsOf($)
  await p.set('isPaletteOpen', false)
  await p.set('blocking', taskId)
}

export async function pressCancelBlock($: EngineInterface) {
  await portsOf($).set('blocking', null)
}

export async function pressBlockWith($: EngineInterface, taskId: string, block: Block) {
  if (live.ctx === null) return
  await flush($)
  await blockTask(portsOf($), live.ctx, taskId, block)
}

export async function pressUnblock($: EngineInterface, taskId: string) {
  if (live.ctx !== null) await unblockTask(portsOf($), live.ctx, taskId)
}

export async function pressPlayNext($: EngineInterface, taskId: string) {
  if (live.ctx !== null) await togglePlayNext(portsOf($), live.ctx, taskId)
}

// Steps "Time I have" through any, 30m, 1h and 2h.
export async function pressBudget($: EngineInterface) {
  await portsOf($).set('budget', nextBudget(await getView($, 'budget')))
}

// Puts the current task back in Up next, its time so far written first.
export async function pressBackToQueue($: EngineInterface) {
  const p = portsOf($)
  await p.set('isPaletteOpen', false)
  if (live.ctx === null) return
  await flush($)
  await putBack(p, live.ctx)
}

export async function pressPalette($: EngineInterface) {
  await portsOf($).set('isPaletteOpen', !(await getView($, 'isPaletteOpen')))
}

export async function pressDismissWarning($: EngineInterface) {
  await portsOf($).set('warning', null)
}

export async function pressCheckAgain($: EngineInterface) {
  const hold = await getView($, 'hold')
  if (hold !== null && live.ctx !== null) await startTask(portsOf($), live.ctx, hold.taskId)
}

export async function pressContinue($: EngineInterface) {
  const p = portsOf($)
  await p.set('isPaletteOpen', false)
  await p.set('canContinue', false)
  if (live.ctx !== null) await continueTask(p, live.ctx)
}

export async function pressSwitch($: EngineInterface) {
  const p = portsOf($)
  await p.set('isPaletteOpen', false)
  if (live.ctx === null) return
  try {
    const result = await switchToTask(p, live.ctx)
    if (result === 'switched') await p.set('mismatch', null)
    else await p.set('notice', `${result}: commit or stash first, then Switch.`)
  } catch (err) {
    debug($, 'switching branches failed', err)
    await p.set('notice', "Couldn't switch branches. Try again.")
  }
}

export async function pressDoneYes($: EngineInterface) {
  const p = portsOf($)
  const record = await getView($, 'record')
  const current = record === null ? null : currentTask(record.tasks)
  await p.set('isPaletteOpen', false)
  await p.set('isAskingDone', false)
  await p.set('checked', null)
  if (current !== null) {
    await showBand(p, { kind: 'difficulty', taskId: current.id, picked: current.difficulty.expected })
  }
}

export async function pressDoneNotYet($: EngineInterface) {
  const p = portsOf($)
  await p.set('isAskingDone', false)
  await p.set('checked', null)
}

export async function pressRow($: EngineInterface, taskId: string) {
  const open = await getView($, 'openRow')
  await portsOf($).set('openRow', open === taskId ? null : taskId)
}

export async function pressPriority($: EngineInterface, taskId: string, priority: Priority) {
  await changeRecord($, r => ({ ...r, tasks: setPriority(r.tasks, taskId, priority) }))
}

export async function pressRemove($: EngineInterface, taskId: string) {
  if (live.ctx !== null) await removeQueued(portsOf($), live.ctx, taskId)
}

// The band: a held message, the can't-tell choice, the difficulty at the end
// of a task, and the docs log's path.

export async function pickBand($: EngineInterface, patch: Partial<{ priority: Priority; difficulty: Difficulty }>) {
  const band = await getView($, 'band')
  const p = portsOf($)
  if (band.kind === 'file') await p.set('band', { ...band, ...patch })
  if (band.kind === 'difficulty' && patch.difficulty !== undefined) {
    await p.set('band', { ...band, picked: patch.difficulty })
  }
}

export async function saveFile($: EngineInterface) {
  const band = await getView($, 'band')
  if (band.kind !== 'file' || live.ctx === null) return
  await fileTask(portsOf($), live.ctx, band)
}

// Sends a held message on to Claude after all.
export async function sendHeld($: EngineInterface) {
  const intent = await sendHeldOn(portsOf($))
  if (intent !== null) live.tracker?.intent(intent)
}

export async function unsureToNew($: EngineInterface) {
  const band: View['band'] = await getView($, 'band')
  if (band.kind !== 'unsure') return
  await portsOf($).set('band', {
    kind: 'file',
    text: band.text,
    title: band.text.slice(0, 60),
    priority: 'mid',
    difficulty: 'medium',
    intent: band.intent,
  })
}

export async function saveDifficulty($: EngineInterface) {
  const band = await getView($, 'band')
  if (band.kind !== 'difficulty' || live.ctx === null) return
  const p = portsOf($)
  await closeBand(p)
  await finishTask(p, live.ctx, band.taskId, band.picked)
}

export async function saveDocsPath($: EngineInterface, value: string) {
  const band = await getView($, 'band')
  if (band.kind !== 'docsPath' || live.ctx === null) return
  await finishDocs(portsOf($), live.ctx, band.taskId, value.trim() === '' ? band.suggested : value.trim())
}

export async function fileFromCommand($: EngineInterface, text: string) {
  await portsOf($).set('isPaletteOpen', false)
  await showBand(portsOf($), {
    kind: 'file',
    text,
    title: text.slice(0, 60),
    priority: 'mid',
    difficulty: 'medium',
    intent: 'improving',
  })
}

export async function askDone($: EngineInterface): Promise<boolean> {
  const record = await getView($, 'record')
  if (record === null || currentTask(record.tasks) === null) return false
  await portsOf($).set('isAskingDone', true)

  return true
}
