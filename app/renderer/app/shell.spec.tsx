// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { EngineApi, MenuItem, ProjectView } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, projectRow, projectView, quest } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const FIRST = quest({ id: 'first', title: 'Fix the docs', isStar: true, why: 'mid' })
const SECOND = quest({ id: 'second', title: 'Other quest' })
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }], canStart: 2 })

const open = async (route: string, view: ProjectView = BOARD, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  let menu: ((item: MenuItem) => void) | null = null
  const { engine } = fakeEngine({
    readProject: async () => ({ ok: true, data: view }),
    onMenu: listener => {
      menu = listener

      return () => {}
    },
    ...over,
  })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, menu: (item: MenuItem) => act(() => menu?.(item)) }
}

const key = (name: string, over: KeyboardEventInit = {}) => act(() => void fireEvent.keyDown(document.body, { key: name, ...over }))
const palette = () => key('k', { metaKey: true })
const type = (text: string) => act(() => void fireEvent.input(screen.getByRole('combobox'), { target: { value: text } }))
const options = () => screen.getAllByRole('option').map(option => option.textContent)
const resize = (width: number) =>
  act(() => {
    window.innerWidth = width
    window.dispatchEvent(new Event('resize'))
  })

beforeEach(() => {
  window.innerWidth = 1280
})
afterEach(cleanup)

describe('the command palette', () => {
  it('⌘K opens it, on the input', async () => {
    await open('/home')

    await palette()

    expect(document.activeElement).toBe(screen.getByRole('combobox'))
    expect(options()[0]).toContain(t.actions.startNamed('Fix the docs'))
  })

  it('⌘K works from a page with no realm', async () => {
    await open('/guild', projectView(KEY), { listProjects: async () => ({ ok: true, data: [] }) })

    await palette()

    expect(screen.getByRole('dialog', { name: t.palette.label })).toBeTruthy()
  })

  it('Esc closes it and hands the keys back', async () => {
    const { engine } = await open('/home')
    await palette()

    await key('Escape')
    expect(screen.queryByRole('dialog')).toBeNull()

    await key('s')
    await waitFor(() => expect(engine.checkStart).toHaveBeenCalled())
  })

  it('takes the board\'s letters as typing while it\'s open', async () => {
    const { engine } = await open('/home')
    await palette()

    await act(() => void fireEvent.keyDown(screen.getByRole('combobox'), { key: 's' }))
    await key('s')

    expect(engine.checkStart).not.toHaveBeenCalled()
  })

  it('Return runs what\'s highlighted', async () => {
    const { engine } = await open('/home')
    await palette()

    await key('Enter')

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'))
    expect(screen.queryByRole('dialog', { name: t.palette.label })).toBeNull()
  })

  it('↓ moves the highlight, and Return follows it', async () => {
    await open('/home')
    await palette()

    await key('ArrowDown')
    await key('Enter')

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('heading', { name: t.form.newTitle('a') })).toBeTruthy()
  })

  it('finds a quest as you type, and opens it on the board', async () => {
    const { workspace } = await open('/home')
    await palette()

    await type('other')
    await key('Enter')

    expect(window.location.hash).toBe('#/quests')
    expect(workspace.getState().openQuests[KEY]).toBe('second')
  })

  it('⌘↩ starts the quest', async () => {
    const { engine } = await open('/home')
    await palette()

    await type('other')
    await key('Enter', { metaKey: true })

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'))
  })

  it('shows what can\'t run dim with its reason, and Return does nothing', async () => {
    const { engine } = await open('/home')
    await palette()

    await type('back to')

    const option = screen.getByRole('option', { name: new RegExp(t.actions.back) })
    expect(option.getAttribute('aria-disabled')).toBe('true')
    expect(option.textContent).toContain(t.palette.noActive)
    await key('Enter')
    expect(engine.putBackQuest).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: t.palette.label })).toBeTruthy()
  })

  it('offers to file what it can\'t find', async () => {
    await open('/home')
    await palette()

    await type('zebra crossing')
    await key('Enter')

    expect((within(await screen.findByRole('dialog')).getByLabelText(`${t.form.title} *`) as HTMLInputElement).value).toBe('zebra crossing')
  })

  it('goes to a page', async () => {
    await open('/home')
    await palette()

    await type('hoard')
    await key('Enter')

    await waitFor(() => expect(window.location.hash).toBe('#/hoard'))
  })

  it('goes to another realm', async () => {
    const { engine } = await open('/home', BOARD, { listProjects: async () => ({ ok: true, data: [projectRow(KEY), projectRow('b-000002', { name: 'beta' })] }) })
    await palette()

    await type('beta')
    await key('Enter')

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ lastProject: 'b-000002' }))
  })

  it('a click runs an option', async () => {
    await open('/home')
    await palette()

    await act(() => void fireEvent.click(screen.getByRole('option', { name: /Hoard/ })))

    await waitFor(() => expect(window.location.hash).toBe('#/hoard'))
  })
})

describe('the menu bar', () => {
  it('runs a letter as the key would', async () => {
    const { engine, menu } = await open('/home')

    await menu({ kind: 'key', key: 's', isMeta: false })

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalled())
  })

  it('still runs a letter with the letter keys off, as it isn\'t a key press', async () => {
    const { engine, menu } = await open('/home', BOARD, { readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: false, realmAccounts: {} } }) })

    await menu({ kind: 'key', key: 's', isMeta: false })

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalled())
  })

  it('runs a ⌘ command', async () => {
    const { menu } = await open('/home')

    await menu({ kind: 'key', key: 'k', isMeta: true })

    expect(screen.getByRole('dialog', { name: t.palette.label })).toBeTruthy()
  })

  it('shows the realm\'s record in Finder', async () => {
    const { engine, menu } = await open('/home')

    await menu({ kind: 'showRecord' })

    await waitFor(() => expect(engine.showRecord).toHaveBeenCalledWith(KEY))
  })

  it('does nothing for the record with no realm picked', async () => {
    const { engine, menu } = await open('/home', BOARD, { listProjects: async () => ({ ok: true, data: [] }) })

    await menu({ kind: 'showRecord' })

    expect(engine.showRecord).not.toHaveBeenCalled()
  })
})

describe('a narrower window', () => {
  it('keeps the detail pane beside the list at full width', async () => {
    await open('/quests')

    expect(document.querySelector('.detail')).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.narrow.closeDetail })).toBeNull()
  })

  it('below 1180 px, opens the detail over the list when a row is pressed', async () => {
    await open('/quests')
    await resize(1000)
    expect(document.querySelector('.detail')).toBeNull()

    await act(() => void fireEvent.click(screen.getByRole('button', { name: /^Other quest/ })))

    expect(document.querySelector('.quests.floating .detail')).toBeTruthy()
    expect(document.querySelector('.qlist')).toBeTruthy()
  })

  it('✕ closes it, and so does Esc', async () => {
    await open('/quests')
    await resize(1000)
    await act(() => void fireEvent.click(screen.getByRole('button', { name: /^Other quest/ })))

    await act(() => void fireEvent.click(screen.getByRole('button', { name: t.narrow.closeDetail })))
    expect(document.querySelector('.detail')).toBeNull()

    await act(() => void fireEvent.click(screen.getByRole('button', { name: /^Other quest/ })))
    await key('Escape')
    expect(document.querySelector('.detail')).toBeNull()
  })

  it('Return opens the detail of the row selected', async () => {
    await open('/quests')
    await resize(1000)

    await key('Enter')

    expect(document.querySelector('.detail')).toBeTruthy()
  })

  it('leaves Return on a focused button to press that button', async () => {
    await open('/quests')
    const start = screen.getByRole('button', { name: t.actions.startMain })

    expect(fireEvent.keyDown(start, { key: 'Enter' })).toBe(true)
  })

  it('below 900 px, the detail is a page of its own with a way back', async () => {
    await open('/quests')
    await resize(800)
    await act(() => void fireEvent.click(screen.getByRole('button', { name: /^Other quest/ })))

    expect(document.querySelector('.detail')).toBeTruthy()
    expect(document.querySelector('.qlist')).toBeNull()

    await act(() => void fireEvent.click(screen.getByRole('button', { name: t.narrow.back })))

    expect(document.querySelector('.qlist')).toBeTruthy()
    expect(document.querySelector('.detail')).toBeNull()
  })

  it('below 900 px, the tabs become a menu', async () => {
    await open('/home')
    await resize(800)

    const menu = screen.getByRole('combobox', { name: t.narrow.section }) as HTMLSelectElement
    expect(menu.value).toBe('/home')

    await act(() => void fireEvent.change(menu, { target: { value: '/quests' } }))

    await waitFor(() => expect(window.location.hash).toBe('#/quests'))
  })

  it('below 900 px, the realms come back on request', async () => {
    await open('/home')
    await resize(800)
    expect(document.querySelector('.rm')?.className).not.toContain('side-open')

    await act(() => void fireEvent.click(screen.getByRole('button', { name: t.narrow.showRealms })))

    expect(document.querySelector('.rm')?.className).toContain('side-open')
  })

  it('⌃⌘S brings them back too, and picking a realm puts them away', async () => {
    const { workspace } = await open('/home')
    await resize(800)

    await key('s', { metaKey: true, ctrlKey: true })
    expect(document.querySelector('.rm')?.className).toContain('side-open')

    await act(async () => workspace.pick(KEY))
    await act(() => void fireEvent.click(screen.getByRole('button', { name: /^a/ })))

    expect(document.querySelector('.rm')?.className).not.toContain('side-open')
  })
})

describe('the active quest behind the palette', () => {
  it('offers its own actions first', async () => {
    await open('/home', projectView(KEY, { active: activeQuest({ title: 'The boss' }) }))

    await palette()

    expect(options()[0]).toContain(t.actions.openClaude)
  })
})
