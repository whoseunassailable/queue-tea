import type { MenuItemConstructorOptions } from 'electron'

import type { MenuItem } from '../../shared/engine_api'

type Send = (item: MenuItem) => void

// A single letter must not be a real shortcut, or it would never reach a text
// field. The menu shows it and leaves the key to the window.
const letter = (label: string, key: string, send: Send): MenuItemConstructorOptions => ({ label, accelerator: key, registerAccelerator: false, click: () => send({ kind: 'key', key, isMeta: false }) })

// Pressed in the window the key arrives there first; this is for the mouse.
const command = (label: string, key: string, send: Send): MenuItemConstructorOptions => ({ label, accelerator: `CmdOrCtrl+${key}`, click: () => send({ kind: 'key', key: key.toLowerCase(), isMeta: true }) })

const TABS: readonly (readonly [string, string])[] = [
  ['Home', '1'],
  ['Quests', '2'],
  ['Chronicle', '3'],
  ['Mana & time', '4'],
]

export const appMenu = (appName: string, isDev: boolean, send: Send): MenuItemConstructorOptions[] => [
  {
    label: appName,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { label: 'Settings…', accelerator: 'CmdOrCtrl+,', click: () => send({ kind: 'key', key: ',', isMeta: true }) },
      { label: 'Install command line tool…', click: () => send({ kind: 'installCommand' }) },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: [command('New quest', 'N', send), command('Open folder…', 'O', send), { type: 'separator' }, { label: 'Show record in Finder', click: () => send({ kind: 'showRecord' }) }],
  },
  {
    label: 'Edit',
    submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }, { type: 'separator' }, command('Find', 'F', send)],
  },
  {
    label: 'Quest',
    submenu: [
      letter('Start', 's', send),
      { label: 'Open in Claude Code', accelerator: 'CmdOrCtrl+Enter', registerAccelerator: false, click: () => send({ kind: 'key', key: 'Enter', isMeta: true }) },
      letter('Finish quest…', 'd', send),
      letter('Back to the board', 'b', send),
      { type: 'separator' },
      letter('Yes, finish it…', 'y', send),
      letter('Not yet', 'n', send),
      { type: 'separator' },
      letter('Seal…', 'k', send),
      letter('Unseal', 'u', send),
      letter('Play next', 'f', send),
      letter('Part of…', 'p', send),
      letter('Active saga', 'a', send),
      letter('Time I have', 't', send),
      letter('Remove…', 'x', send),
      { type: 'separator' },
      letter('Check again', 'r', send),
      letter('Use the last good copy', 'l', send),
      letter('Switch to the quest’s branch', 'w', send),
    ],
  },
  {
    label: 'View',
    submenu: [
      ...TABS.map(([label, key]) => command(label, key, send)),
      { type: 'separator' },
      command('Command palette', 'K', send),
      { label: 'Show realms', accelerator: 'Ctrl+Cmd+S', click: () => send({ kind: 'toggleRealms' }) },
      ...(isDev ? ([{ type: 'separator' }, { role: 'reload' }, { role: 'toggleDevTools' }] satisfies MenuItemConstructorOptions[]) : []),
    ],
  },
  { role: 'windowMenu' },
  { role: 'help', submenu: [{ label: 'Keys and commands', click: () => send({ kind: 'key', key: 'k', isMeta: true }) }] },
]
