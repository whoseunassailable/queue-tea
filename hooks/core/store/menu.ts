import type { MenuView } from '../../../types'
import type { Ports } from '../ports/ports'
import { live } from '../session/live'

// The tea cup's menu: a pane that asks for the keys, which the surface gives
// only over an empty prompt, and that Esc closes while it holds them. Inline
// it opens MENU_ROWS tall above the prompt; docked, MENU_COLUMNS wide.
export const MENU = 'queue-tea'
const MENU_ROWS = 16
const MENU_COLUMNS = 46

export async function openMenu(p: Ports, view: MenuView = 'menu') {
  const name = live.ctx?.projectName ?? 'this project'
  await p.set('menuView', view)
  await p.set('isMenuOpen', true)
  const opened = await p.ui.open({
    id: MENU,
    title: `Queue-tea · ${name}`,
    focus: true,
    closeOnEscape: true,
    rows: MENU_ROWS,
    columns: MENU_COLUMNS,
  })
  if (!opened.isPlaced) p.toast('Queue-tea: the terminal is too narrow for the menu here. Type /queue-tea to open it.')
}

// However it closed (Esc, its close mark, the cup), it opens on the list
// next time.
export async function menuClosed(p: Ports) {
  await p.set('isMenuOpen', false)
  await p.set('menuView', 'menu')
}

export async function closeMenu(p: Ports) {
  await p.ui.close(MENU)
  await menuClosed(p)
}
