import type { MenuView } from '../../../types'
import type { Ports } from '../../core/ports/ports'
import { closeMenu, openMenu } from '../../core/store/menu'
import { readCup } from '../../features/tea_cup/presentation/state_management/tea_cup_controller'

// The cup: opens the menu where something waits, or closes it.
export async function toggleMenu(p: Ports) {
  if (await p.get('isMenuOpen')) await closeMenu(p)
  else await openMenu(p, (await readCup(p, false)).view)
}

// Moving to another view leaves a Blocked… or Part of… question unanswered.
export async function pressMenu(p: Ports, view: MenuView) {
  await p.set('blocking', null)
  await p.set('parenting', null)
  await p.set('menuView', view)
}
