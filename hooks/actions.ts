import { loadRecord, changeRecord } from './shared/records/presentation/state_management/records_controller'
import { flush } from './shared/effort/presentation/state_management/effort_controller'
import { closeMenu, openMenu } from './core/store/menu'
import type { EngineInterface } from 'claude-code'

import type { Difficulty, ParentPick, Priority, MenuView } from '../types'
import { guessParent } from './shared/backlog/domain/services/families'
import { blockTask, continueTask, featureCommand, fileTask, finishDocs, finishTask, moveTask, putBack, refreshDrift, refreshLines, removeQueued, setFeature, startTask, switchToTask, togglePlayNext, unblockTask } from './flow'
import { isStartingFresh, writeHandoff } from './shared/assistant/presentation/state_management/conversation_controller'
import { closeBand, showBand } from './core/store/band_queue'
import type { Block } from './flow'
import { readGit } from './shared/git/data/datasources/git_source'
import { hostOf } from './core/host/claude_host'
import { live } from './core/session/live'
import { nextBudget, suggest } from './shared/backlog/domain/services/ranking'
import { debug } from './core/logger/logger'
import { getView } from './core/store/view_store'
import { portsOf } from './core/ports/claude_ports'
import { readCup } from './features/tea_cup/presentation/state_management/tea_cup_controller'
import { currentTask, setPriority } from './shared/records/domain/services/queue_rules'
import { restoreRecord } from './shared/records/data/datasources/record_source'
import { isoLocal } from './shared/time/domain/services/time'

// A typed /clear saves a checkpoint first only past this size: a smaller
// conversation holds little the turns haven't saved already.
const CLEAR_CHECKPOINT_TOKENS = 20_000

// What the hooks, the menu and the band do. Each takes `$` and acts through
// the same ports.

// Puts the record's last good copy in place of the one that can't be read,
// keeping the broken file beside it, then reads it as at a session's start.
export async function pressRestore($: EngineInterface) {
  const p = portsOf($)
  const ctx = live.ctx
  if (ctx === null) return
  try {
    const stamp = isoLocal(await $.clock.now(), ctx.offsetMinutes).slice(0, 19).replace(/:/g, '-')
    const restored = await restoreRecord(hostOf($), ctx.file, stamp)
    if (typeof restored === 'object') {
      p.toast(`Queue-tea: back to the last good copy. The broken record is kept as ${restored.keptAt.split('/').pop()}`)
    }
  } catch (err) {
    debug(portsOf($), 'restoring the record failed', err)
  }
  await loadRecord(portsOf($))
  if ((await getView($, 'load')) === 'ready') await checkResume($)
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
  await refreshLines(p, ctx)
}

// After a /clear: the record again, and Continue when the clear wasn't one
// Queue-tea made to start a conversation of its own.
export async function afterClear($: EngineInterface) {
  await loadRecord(portsOf($))
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
    await flush(portsOf($))
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

// The cup: opens the menu where something waits, or closes it.
export async function toggleMenu($: EngineInterface) {
  if (await getView($, 'isMenuOpen')) await closeMenu(portsOf($))
  else await openMenu(portsOf($), (await readCup(portsOf($), false)).view)
}

// Moving to another view leaves a Blocked… or Part of… question unanswered.
export async function pressMenu($: EngineInterface, view: MenuView) {
  await portsOf($).set('blocking', null)
  await portsOf($).set('parenting', null)
  await portsOf($).set('menuView', view)
}

export async function pressStart($: EngineInterface, taskId: string) {
  if (live.ctx !== null) await startTask(portsOf($), live.ctx, taskId)
}

// Start from the backlog, then show the task where its hold or branch shows.
export async function pressStartFromBacklog($: EngineInterface, taskId: string) {
  await pressStart($, taskId)
  await portsOf($).set('menuView', 'current')
}

// Starts the task marked ★.
export async function pressStartNext($: EngineInterface) {
  const record = await getView($, 'record')
  const next = record === null ? null : suggest(record, await getView($, 'budget'))
  if (next !== null) await pressStart($, next.id)
}

// Opens the blocking view for a task: what it waits for, or a reason.
export async function pressBlock($: EngineInterface, taskId: string) {
  await portsOf($).set('parenting', null)
  await portsOf($).set('blocking', taskId)
}

export async function pressCancelBlock($: EngineInterface) {
  await portsOf($).set('blocking', null)
}

export async function pressBlockWith($: EngineInterface, taskId: string, block: Block) {
  if (live.ctx === null) return
  await flush(portsOf($))
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
  if (live.ctx === null) return
  await flush(portsOf($))
  await putBack(p, live.ctx)
}

export async function pressCheckAgain($: EngineInterface) {
  const hold = await getView($, 'hold')
  if (hold !== null && live.ctx !== null) await startTask(portsOf($), live.ctx, hold.taskId)
}

export async function pressContinue($: EngineInterface) {
  const p = portsOf($)
  await p.set('canContinue', false)
  if (live.ctx !== null) await continueTask(p, live.ctx)
}

export async function pressSwitch($: EngineInterface) {
  const p = portsOf($)
  if (live.ctx === null) return
  try {
    const result = await switchToTask(p, live.ctx)
    if (result === 'switched') await p.set('mismatch', null)
    else await p.set('notice', `${result}: commit or stash first, then Switch.`)
  } catch (err) {
    debug(portsOf($), 'switching branches failed', err)
    await p.set('notice', "Couldn't switch branches. Try again.")
  }
}

export async function pressDoneYes($: EngineInterface) {
  const p = portsOf($)
  const record = await getView($, 'record')
  const current = record === null ? null : currentTask(record.tasks)
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
  await changeRecord(portsOf($), r => ({ ...r, tasks: setPriority(r.tasks, taskId, priority) }))
}

export async function pressRemove($: EngineInterface, taskId: string) {
  if (live.ctx !== null) await removeQueued(portsOf($), live.ctx, taskId)
}

// Shows a feature's tasks under it in the backlog, or folds them away.
export async function pressFold($: EngineInterface, parentId: string) {
  const open = await getView($, 'openParents')
  await portsOf($).set('openParents', open.includes(parentId) ? open.filter(id => id !== parentId) : [...open, parentId])
}

// Opens the Part of… view for a task: the features it can go under.
export async function pressPartOf($: EngineInterface, taskId: string) {
  await portsOf($).set('blocking', null)
  await portsOf($).set('parenting', taskId)
}

export async function pressCancelPartOf($: EngineInterface) {
  await portsOf($).set('parenting', null)
}

export async function pressPartOfWith($: EngineInterface, taskId: string, parentId: string | null) {
  if (live.ctx !== null) await moveTask(portsOf($), live.ctx, taskId, parentId)
}

// Makes a task the active feature, or, pressed on the active one, none.
export async function pressFeature($: EngineInterface, taskId: string) {
  const p = portsOf($)
  if (live.ctx === null) return
  const record = await getView($, 'record')
  p.toast(`Queue-tea: ${await setFeature(p, live.ctx, record?.feature === taskId ? null : taskId)}`)
}

export async function pressClearFeature($: EngineInterface) {
  const p = portsOf($)
  if (live.ctx !== null) p.toast(`Queue-tea: ${await setFeature(p, live.ctx, null)}`)
}

// /feature, answered in the command's reply.
export async function runFeature($: EngineInterface, args: string): Promise<string> {
  return live.ctx === null ? 'Queue-tea has no project here.' : featureCommand(portsOf($), live.ctx, args)
}

// The band: a held message, the can't-tell choice, the difficulty at the end
// of a task, and the docs log's path.

export async function pickBand(
  $: EngineInterface,
  patch: Partial<{ priority: Priority; difficulty: Difficulty; parent: ParentPick }>,
) {
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

// The name of the new feature a held message goes under.
export async function nameNewFeature($: EngineInterface, title: string) {
  const band = await getView($, 'band')
  if (band.kind === 'file') await portsOf($).set('band', { ...band, parent: { kind: 'new', title: title.trim() } })
}

// What a message filed with no check is offered under: a feature it names,
// or, with a feature active, the question.
async function parentFor($: EngineInterface, text: string) {
  const record = await getView($, 'record')

  return record === null ? null : guessParent(record, text, null)
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
  await showBand(portsOf($), {
    kind: 'file',
    text,
    title: text.slice(0, 60),
    priority: 'mid',
    difficulty: 'medium',
    intent: 'improving',
    ...(await parentFor($, text)),
  })
}

export async function askDone($: EngineInterface): Promise<boolean> {
  const record = await getView($, 'record')
  if (record === null || currentTask(record.tasks) === null) return false
  await portsOf($).set('isAskingDone', true)

  return true
}
