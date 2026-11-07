// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, MenuItem, ProjectView, Reply } from '../../shared/engine_api'
import type { NotesView } from '../../shared/notes'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, note, NOTES, projectRow, projectView, quest } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const FIRST = quest({ id: 'first', title: 'Fix the docs', isStar: true, why: 'mid' })
const SECOND = quest({ id: 'second', title: 'Other quest' })
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }], canStart: 2 })

const open = async (route: string, view: ProjectView = BOARD, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  let menu: ((item: MenuItem) => void) | null = null
  const { engine, fire } = fakeEngine({
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

  return { engine, workspace, fire, menu: (item: MenuItem) => act(() => menu?.(item)) }
}

const key = (name: string, over: KeyboardEventInit = {}) => act(() => void fireEvent.keyDown(document.body, { key: name, ...over }))
const palette = () => key('k', { metaKey: true })
const type = (text: string) => act(() => void fireEvent.input(screen.getByRole('combobox', { name: t.palette.placeholder }), { target: { value: text } }))
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

describe('notes from any screen through the palette', () => {
  const one = note({ id: 'sensor', title: 'Sensor diary', body: 'Pressure readings at noon.' })
  const view: NotesView = { ...NOTES, notes: [note({ id: 'first-note', title: 'First note', updated: '2026-11-08' }), one] }
  const readNotes = async () => ({ ok: true as const, data: view })

  it('reads notes only while open, finds text, and Return opens the chosen note', async () => {
    const { engine } = await open('/home', BOARD, { readNotes: vi.fn(readNotes) })
    expect(engine.readNotes).not.toHaveBeenCalled()
    await palette()
    await type('pressure')
    const found = await screen.findByRole('option', { name: /Sensor diary/ })
    expect(found.textContent).toContain('Pressure readings at noon.')
    expect(engine.readNotes).toHaveBeenCalledWith(KEY)
    await key('Enter')
    expect(await screen.findByDisplayValue('Sensor diary')).toBeTruthy()
    expect(window.location.hash).toBe('#/notes')
  })

  it('⌘↩ also opens a matched note', async () => {
    await open('/settings', BOARD, { readNotes })
    await palette()
    await type('sensor')
    await screen.findByRole('option', { name: /Sensor diary/ })
    await key('Enter', { metaKey: true })
    expect(await screen.findByDisplayValue('Sensor diary')).toBeTruthy()
  })

  it('opens the selected note when Notes is already showing another one', async () => {
    await open('/notes', BOARD, { readNotes })
    await screen.findByDisplayValue('First note')
    await palette()
    await type('sensor')
    const found = await screen.findByRole('option', { name: /Sensor diary/ })
    await act(() => void fireEvent.click(found))
    expect(await screen.findByDisplayValue('Sensor diary')).toBeTruthy()
  })

  it('New note in the palette opens an Untitled note in Inbox from Settings', async () => {
    const made = note({ title: 'Untitled', folder: 'Inbox' })
    const { engine } = await open('/settings', BOARD, { createNote: vi.fn(async () => ({ ok: true as const, data: { view: { ...NOTES, notes: [made] }, id: made.id } })) })
    await palette()
    await type('new note')
    expect(screen.getByRole('option', { name: /New note⇧⌘N/ })).toBeTruthy()
    await key('Enter')
    await waitFor(() => expect(engine.createNote).toHaveBeenCalledWith(KEY, { title: 'Untitled', folder: 'Inbox', body: '' }))
    expect(await screen.findByDisplayValue('Untitled')).toBeTruthy()
  })

  it('Jot saves to Inbox and stays on the current screen, with Open in its toast', async () => {
    const made = note({ title: 'Buy oat milk', folder: 'Inbox' })
    let saved = false
    const { engine } = await open('/home', BOARD, {
      readNotes: async () => ({ ok: true, data: { ...NOTES, notes: saved ? [made] : [] } }),
      createNote: vi.fn(async () => { saved = true; return { ok: true as const, data: { view: { ...NOTES, notes: [made] }, id: made.id } } }),
    })
    await palette()
    await type('Buy oat milk')
    await act(() => void fireEvent.click(screen.getByRole('option', { name: /Jot "Buy oat milk"/ })))
    await waitFor(() => expect(engine.createNote).toHaveBeenCalledWith(KEY, { title: 'Buy oat milk', folder: 'Inbox', body: '' }))
    expect(window.location.hash).toBe('#/home')
    const openButton = await screen.findByRole('button', { name: 'Open' })
    await act(() => void fireEvent.click(openButton))
    expect(await screen.findByDisplayValue('Buy oat milk')).toBeTruthy()
  })

  it('⌘↩ on Jot creates and opens the note', async () => {
    const made = note({ title: 'Buy oat milk', folder: 'Inbox' })
    await open('/home', BOARD, { createNote: async () => ({ ok: true, data: { view: { ...NOTES, notes: [made] }, id: made.id } }) })
    await palette()
    await type('Buy oat milk')
    await act(() => void fireEvent.mouseEnter(screen.getByRole('option', { name: /Jot "Buy oat milk"/ })))
    await key('Enter', { metaKey: true })
    expect(await screen.findByDisplayValue('Buy oat milk')).toBeTruthy()
  })

  it('a failed Jot keeps the words for Try again', async () => {
    const createNote = vi.fn<EngineApi['createNote']>()
      .mockResolvedValueOnce({ ok: false, error: { message: 'Could not save. Try again.' } })
      .mockResolvedValueOnce({ ok: true, data: { view: NOTES, id: 'made' } })
    await open('/home', BOARD, { createNote })
    await palette()
    await type('Buy oat milk')
    await act(() => void fireEvent.click(screen.getByRole('option', { name: /Jot "Buy oat milk"/ })))
    const retry = await screen.findByRole('button', { name: 'Try again' })
    await act(() => void fireEvent.click(retry))
    await waitFor(() => expect(createNote).toHaveBeenCalledTimes(2))
    expect(createNote.mock.calls[1]).toEqual([KEY, { title: 'Buy oat milk', folder: 'Inbox', body: '' }])
    expect(window.location.hash).toBe('#/home')
  })

  it('a pending notes read never takes Return away from creating a quest', async () => {
    await open('/home', BOARD, { readNotes: () => new Promise<Reply<NotesView>>(() => {}) })
    await palette()
    await type('Buy oat milk')
    expect(screen.getByText(t.palette.readingNotes)).toBeTruthy()
    await key('Enter')
    expect(await screen.findByRole('heading', { name: t.form.newTitle('a') })).toBeTruthy()
  })

  it('arrow keys pass the reading row in both directions', async () => {
    await open('/home', BOARD, { readNotes: () => new Promise<Reply<NotesView>>(() => {}) })
    await palette()
    await type('docs')
    const box = screen.getByRole('combobox', { name: t.palette.placeholder })
    const rows = screen.getAllByRole('option')
    const reading = rows.findIndex(row => row.textContent === t.palette.readingNotes)
    const previous = rows[reading - 1]!
    await act(() => void fireEvent.mouseEnter(previous))
    await key('ArrowDown')
    expect(box.getAttribute('aria-activedescendant')).toBe('palette-create')
    await key('ArrowUp')
    expect(box.getAttribute('aria-activedescendant')).toBe(previous.id)
  })

  it('a failed read opens Notes with a way to retry', async () => {
    const { engine } = await open('/home', BOARD, { readNotes: vi.fn(async () => ({ ok: false as const, error: { message: 'Could not read. Try again.' } })) })
    await palette()
    await type('sensor')
    const failed = await screen.findByRole('option', { name: t.palette.notesFailed })
    await act(() => void fireEvent.click(failed))
    expect(window.location.hash).toBe('#/notes')
    expect(await screen.findByRole('button', { name: t.failed.tryAgain })).toBeTruthy()
    expect(engine.readNotes).toHaveBeenCalledTimes(2)
  })

  it('with no realm, no notes are read and no note can be created', async () => {
    const { engine } = await open('/guild', BOARD, { listProjects: async () => ({ ok: true, data: [] }) })
    await palette()
    await type('new note')
    expect(engine.readNotes).not.toHaveBeenCalled()
    expect(screen.queryByRole('option', { name: /New note⇧⌘N/ })).toBeNull()
    expect(screen.queryByRole('option', { name: /Jot/ })).toBeNull()
  })

  it('a query without a note match says how to make one', async () => {
    await open('/home', BOARD, { readNotes })
    await palette()
    await type('missing words')
    expect(await screen.findByText('No notes match. Try other words, or jot this idea into Inbox.')).toBeTruthy()
    expect(screen.getByRole('option', { name: /Jot "missing words"/ })).toBeTruthy()
  })

  it('keeps readable notes available when some files cannot be read', async () => {
    await open('/home', BOARD, { readNotes: async () => ({ ok: true, data: { ...view, unreadable: ['broken.md'] } }) })
    await palette()
    await type('sensor')
    expect(await screen.findByRole('option', { name: /Sensor diary/ })).toBeTruthy()
    expect(screen.getByRole('option', { name: "Some note files couldn't be read. Open Notes to see which." })).toBeTruthy()
  })

  it('a failed refresh says the shown notes are from the last read', async () => {
    const read = vi.fn<EngineApi['readNotes']>().mockResolvedValueOnce({ ok: true, data: view }).mockResolvedValue({ ok: false, error: { message: 'Could not refresh.' } })
    const { fire } = await open('/home', BOARD, { readNotes: read })
    await palette()
    await type('sensor')
    await screen.findByRole('option', { name: /Sensor diary/ })
    await act(async () => fire())
    expect(await screen.findByRole('option', { name: "Couldn't refresh your notes. Showing the last read. Open Notes to try again." })).toBeTruthy()
    expect(screen.getByRole('option', { name: /Sensor diary/ })).toBeTruthy()
  })

  it('changing realms clears the previous notes while the next realm loads', async () => {
    const { workspace } = await open('/home', BOARD, {
      listProjects: async () => ({ ok: true, data: [projectRow(KEY), projectRow('b-000002')] }),
      readProject: async key => ({ ok: true, data: projectView(key) }),
      readNotes: key => key === KEY ? readNotes() : new Promise<Reply<NotesView>>(() => {}),
    })
    await act(async () => workspace.pick(KEY))
    await palette()
    await type('sensor')
    await screen.findByRole('option', { name: /Sensor diary/ })
    await act(async () => workspace.pick('b-000002'))
    await type('sensor')
    expect(screen.queryByRole('option', { name: /Sensor diary/ })).toBeNull()
    expect(screen.getByText(t.palette.readingNotes)).toBeTruthy()
  })

  it('a jotted note’s Open action returns to the realm where it was saved', async () => {
    const made = note({ title: 'Buy oat milk', folder: 'Inbox' })
    let saved = false
    const { workspace } = await open('/home', BOARD, {
      listProjects: async () => ({ ok: true, data: [projectRow(KEY), projectRow('b-000002')] }),
      readProject: async key => ({ ok: true, data: projectView(key) }),
      readNotes: async key => ({ ok: true, data: { ...NOTES, notes: key === KEY ? (saved ? [note({ id: 'newer', title: 'Newer note', updated: '2026-11-08' }), made] : []) : [note({ title: 'Other realm note' })] } }),
      createNote: async () => { saved = true; return { ok: true, data: { view: { ...NOTES, notes: [made] }, id: made.id } } },
    })
    await act(async () => workspace.pick(KEY))
    await palette()
    await type('Buy oat milk')
    await act(() => void fireEvent.click(screen.getByRole('option', { name: /Jot "Buy oat milk"/ })))
    const openButton = await screen.findByRole('button', { name: 'Open' })
    await act(async () => workspace.pick('b-000002'))
    await act(() => void (window.location.hash = '#/notes'))
    await screen.findByDisplayValue('Other realm note')
    await act(() => void fireEvent.click(openButton))
    expect(await screen.findByDisplayValue('Buy oat milk')).toBeTruthy()
    expect(workspace.getState().selected).toBe(KEY)
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
