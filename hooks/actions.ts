import { checkResume } from './features/tasks/presentation/state_management/tasks_controller'
import { loadRecord } from './shared/records/presentation/state_management/records_controller'
import { flush } from './shared/effort/presentation/state_management/effort_controller'
import { closeMenu, openMenu } from './core/store/menu'
import type { EngineInterface } from 'claude-code'

import type { MenuView } from '../types'
import { isStartingFresh, writeHandoff } from './shared/assistant/presentation/state_management/conversation_controller'
import { hostOf } from './core/host/claude_host'
import { live } from './core/session/live'
import { debug } from './core/logger/logger'
import { getView } from './core/store/view_store'
import { portsOf } from './core/ports/claude_ports'
import { readCup } from './features/tea_cup/presentation/state_management/tea_cup_controller'
import { currentTask } from './shared/records/domain/services/queue_rules'
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
  if ((await getView($, 'load')) === 'ready') await checkResume(portsOf($))
}

// After a /clear: the record again, and Continue when the clear wasn't one
// Queue-tea made to start a conversation of its own.
export async function afterClear($: EngineInterface) {
  await loadRecord(portsOf($))
  if (!isStartingFresh()) await checkResume(portsOf($))
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
