import type { MenuView } from '../../../types'
import { debug } from '../../core/logger/logger'
import type { Ports } from '../../core/ports/ports'
import { live } from '../../core/session/live'
import { closeMenu, openMenu } from '../../core/store/menu'
import { readCup } from '../../features/tea_cup/presentation/state_management/tea_cup_controller'

// The cup: opens the menu where something waits, or closes it.
export async function toggleMenu(p: Ports) {
  if (await p.get('isMenuOpen')) await closeMenu(p)
  else await openMenu(p, (await readCup(p, false)).view)
}

const NO_APP = "Couldn't open the Queue-tea app. It may not be installed yet."

// Opens the workspace app on this session's project.
export async function pressOpenApp(p: Ports) {
  if (live.ctx === null) return
  try {
    const opened = await p.host.open(`queue-tea://open?path=${encodeURIComponent(live.ctx.projectPath)}`)
    if (opened.exitCode !== 0) await p.set('notice', NO_APP)
  } catch (err) {
    debug(p, 'opening the app failed', err)
    await p.set('notice', NO_APP)
  }
}

// Moving to another view leaves a Blocked… or Part of… question unanswered.
export async function pressMenu(p: Ports, view: MenuView) {
  await p.set('blocking', null)
  await p.set('parenting', null)
  await p.set('menuView', view)
}
