import type { MenuItemConstructorOptions } from 'electron'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '../../shared/engine_api'
import { appMenu } from './app_menu'

const menu = (isDev = false, send: (item: MenuItem) => void = () => {}) => appMenu('Queue-tea', isDev, send)

const items = (label: string, template = menu()): MenuItemConstructorOptions[] => (template.find(top => top.label === label)?.submenu ?? []) as MenuItemConstructorOptions[]
const named = (top: string, label: string, template = menu()) => items(top, template).find(item => item.label === label)
const click = (item: MenuItemConstructorOptions | undefined) => (item?.click as (() => void) | undefined)?.()

describe('the menu bar', () => {
  it('has the menus the design lists', () => {
    expect(menu().map(top => top.label ?? top.role)).toEqual(['Queue-tea', 'File', 'Edit', 'Quest', 'View', 'windowMenu', 'help'])
  })

  it('gives every Quest action a key', () => {
    for (const item of items('Quest').filter(entry => entry.type !== 'separator')) {
      expect(item.accelerator, item.label).toBeTruthy()
    }
  })

  it('never registers a single letter, or it could not be typed', () => {
    const letters = items('Quest').filter(entry => typeof entry.accelerator === 'string' && entry.accelerator.length === 1)

    expect(letters.length).toBeGreaterThan(10)
    for (const item of letters) expect(item.registerAccelerator, item.label).toBe(false)
  })

  it('has no item that runs git', () => {
    const labels = menu().flatMap(top => (top.submenu as MenuItemConstructorOptions[] | undefined)?.map(item => item.label ?? '') ?? [])

    for (const label of labels) expect(label).not.toMatch(/\b(commit|push|merge|pull)\b/i)
  })

  it('sends a letter to the window as a key', () => {
    const send = vi.fn()

    click(named('Quest', 'Start', menu(false, send)))

    expect(send).toHaveBeenCalledWith({ kind: 'key', key: 's', isMeta: false })
  })

  it('sends a ⌘ command as the same key', () => {
    const send = vi.fn()

    click(named('File', 'New quest', menu(false, send)))

    expect(send).toHaveBeenCalledWith({ kind: 'key', key: 'n', isMeta: true })
  })

  it('asks the window to show the record, since only it knows which realm', () => {
    const send = vi.fn()

    click(named('File', 'Show record in Finder', menu(false, send)))

    expect(send).toHaveBeenCalledWith({ kind: 'showRecord' })
  })

  it('numbers the tabs ⌘1 to ⌘6, with Designs third', () => {
    const tabs = items('View').filter(item => /^CmdOrCtrl\+\d$/.test(String(item.accelerator)))

    expect(tabs.map(item => [item.label, item.accelerator])).toEqual([
      ['Home', 'CmdOrCtrl+1'],
      ['Quests', 'CmdOrCtrl+2'],
      ['Designs', 'CmdOrCtrl+3'],
      ['Branches', 'CmdOrCtrl+4'],
      ['Chronicle', 'CmdOrCtrl+5'],
      ['Mana & time', 'CmdOrCtrl+6'],
    ])
  })

  it('leaves Reload and the developer tools out of a real build', () => {
    expect(items('View', menu(false)).some(item => item.role === 'toggleDevTools')).toBe(false)
    expect(items('View', menu(true)).some(item => item.role === 'toggleDevTools')).toBe(true)
  })
})
