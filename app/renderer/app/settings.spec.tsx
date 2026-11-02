// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, FolderPick, ProjectView, Reply, Settings, SettingsPage } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, projectRow, projectView, quest, SETTINGS_PAGE } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const settings = (over: Partial<Settings>): Reply<Settings> => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {}, ...over } })
const page = (over: Partial<SettingsPage>): Reply<SettingsPage> => ({ ok: true, data: { ...SETTINGS_PAGE, ...over } })
const FAILED: ProjectView = { kind: 'unreadable', key: KEY, name: 'a', reason: "it isn't valid JSON (Unexpected token)", file: '/h/.queue-tea/projects/a-000001.json', isNewer: false, canRestore: true }
const NEW_FOLDER: FolderPick = { path: '/p/demo', name: 'demo', key: 'demo-abc123', isKnown: false, isRepo: true }

const open = async (route: string, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  const { engine, fire } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, fire }
}

const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))
const key = (name: string, over: KeyboardEventInit = {}) => act(() => void fireEvent.keyDown(document.body, { key: name, ...over }))

afterEach(cleanup)

describe('finding Settings', () => {
  it('is in the sidebar', async () => {
    await open('/home')

    expect(screen.getByRole('link', { name: t.nav.settings }).getAttribute('href')).toBe('#/settings')
  })

  it('⌘, opens it', async () => {
    await open('/home')

    await key(',', { metaKey: true })

    await waitFor(() => expect(window.location.hash).toBe('#/settings'))
  })

  it('opens with no realm picked', async () => {
    await open('/settings', { listProjects: async () => ({ ok: true, data: [] }) })

    expect(await screen.findByRole('heading', { name: t.settings.sky })).toBeTruthy()
  })
})

describe('Settings', () => {
  it('sets Calm mode, and the window calms down at once', async () => {
    const { engine } = await open('/settings')

    await act(() => void fireEvent.click(screen.getByRole('switch', { name: t.settings.calm })))

    expect(document.querySelector('.rm')?.className).toContain('calm')
    expect(engine.saveSettings).toHaveBeenCalledWith({ isCalm: true })
  })

  it('keeps the sky and the sky dial as one value', async () => {
    const { engine } = await open('/settings')

    await act(() => void fireEvent.click(within(within(screen.getByRole('main')).getByRole('group', { name: t.settings.skyLabel })).getByRole('button', { name: t.settings.skyNames.night })))

    expect(engine.saveSettings).toHaveBeenCalledWith({ sky: 'night' })
    await waitFor(() => expect(screen.getByRole('button', { name: t.sky.choices.night }).getAttribute('aria-pressed')).toBe('true'))
  })

  it('picks the terminal', async () => {
    const { engine } = await open('/settings')

    await press(t.terminal.iterm)

    expect(engine.saveSettings).toHaveBeenCalledWith({ terminal: 'iterm' })
  })

  it('shows the /config values, marked default with no session', async () => {
    await open('/settings')

    expect(await screen.findByText(`${t.settings.minutes(15)} · ${t.settings.default}`)).toBeTruthy()
  })

  it('shows them plain from a session', async () => {
    await open('/settings', { readSettingsPage: async () => page({ isDefault: false }) })

    expect(await screen.findByText(t.settings.minutes(15))).toBeTruthy()
  })

  it('copies /config', async () => {
    const { engine } = await open('/settings')
    await screen.findByRole('button', { name: t.settings.copyConfig })

    await press(t.settings.copyConfig)

    await waitFor(() => expect(engine.copyText).toHaveBeenCalledWith('/config'))
  })

  it('shows this realm\'s record, and shows it in Finder', async () => {
    const { engine } = await open('/settings')

    await screen.findByText('a-000001.json')
    await press(t.settings.showInFinder)

    await waitFor(() => expect(engine.showRecord).toHaveBeenCalledWith('a-000001'))
  })
})

describe('the task log path in Settings', () => {
  const NOT_SET = { readSettingsPage: async () => page({ realm: { ...SETTINGS_PAGE.realm!, logPath: null } }) }
  const change = async (over: Partial<EngineApi> = {}) => {
    const opened = await open('/settings', { ...NOT_SET, ...over })
    await screen.findByRole('button', { name: t.settings.setNow })
    await press(t.settings.setNow)

    return { ...opened, field: screen.getByLabelText(`${t.finish.path} *`) as HTMLInputElement }
  }

  it('says when one isn\'t set, and offers docs/task_log.md', async () => {
    const { field } = await change()

    expect(field.value).toBe('docs/task_log.md')
  })

  it('starts from the path it has', async () => {
    await open('/settings')
    await screen.findByRole('button', { name: t.settings.change })

    await press(t.settings.change)

    expect((screen.getByLabelText(`${t.finish.path} *`) as HTMLInputElement).value).toBe('notes/log.md')
  })

  it('shows the error under the field as it loses focus', async () => {
    const { field } = await change()

    await act(async () => void fireEvent.input(field, { target: { value: 'docs/' } }))
    await act(async () => void fireEvent.blur(field))

    expect(screen.getByText(t.finish.pathBad)).toBeTruthy()
  })

  it('blocks saving a bad path, with the button still enabled', async () => {
    const { engine, field } = await change()

    await act(async () => void fireEvent.input(field, { target: { value: '  ' } }))
    expect(screen.getByRole<HTMLButtonElement>('button', { name: t.actions.save }).disabled).toBe(false)
    await press(t.actions.save)

    expect(screen.getByText(t.finish.pathRequired)).toBeTruthy()
    expect(engine.setTaskLog).not.toHaveBeenCalled()
  })

  it('saves and closes', async () => {
    const { engine } = await change()

    await press(t.actions.save)

    await waitFor(() => expect(engine.setTaskLog).toHaveBeenCalledWith('a-000001', 'docs/task_log.md'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('stays open with the reason when it can\'t save', async () => {
    await change({ setTaskLog: async () => ({ ok: false, error: { message: "Couldn't save the task log path." } }) })

    await press(t.actions.save)

    expect((await screen.findByRole('alert')).textContent).toBe("Couldn't save the task log path.")
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})

describe('the single-letter keys', () => {
  const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: quest({ id: 'first', title: 'First', isStar: true }) }], canStart: 1, active: null })

  it('stop on Home when switched off', async () => {
    const { engine } = await open('/home', { readSettings: async () => settings({ letterKeys: false, realmAccounts: {} }), readProject: async () => ({ ok: true, data: BOARD }) })

    await key('s')

    expect(engine.checkStart).not.toHaveBeenCalled()
  })

  it('stop on the board when switched off', async () => {
    const { engine } = await open('/quests', { readSettings: async () => settings({ letterKeys: false, realmAccounts: {} }), readProject: async () => ({ ok: true, data: BOARD }) })

    await key('2')
    await key('s')

    expect(engine.setPriority).not.toHaveBeenCalled()
    expect(engine.checkStart).not.toHaveBeenCalled()
  })

  it('leave the ⌘ shortcuts alone', async () => {
    const view = projectView(KEY, { active: activeQuest() })
    const { engine } = await open('/home', { readSettings: async () => settings({ letterKeys: false, realmAccounts: {} }), readProject: async () => ({ ok: true, data: view }) })

    await key('Enter', { metaKey: true })
    await waitFor(() => expect(engine.openClaude).toHaveBeenCalled())
    await key('n', { metaKey: true })

    expect(await screen.findByRole('dialog')).toBeTruthy()
  })

  it('can be switched off from Settings', async () => {
    const { engine } = await open('/settings')

    await act(() => void fireEvent.click(screen.getByRole('switch', { name: t.settings.letters })))

    expect(engine.saveSettings).toHaveBeenCalledWith({ letterKeys: false })
  })
})

describe('first run', () => {
  const none = { listProjects: async () => ({ ok: true as const, data: [] }) }

  it('welcomes you, and says what happens next', async () => {
    await open('/home', none)

    expect(screen.getByRole('heading', { name: t.firstRun.title })).toBeTruthy()
    expect(screen.getByText(t.firstRun.hint)).toBeTruthy()
  })

  it('offers the terminal way too', async () => {
    const { engine } = await open('/home', none)

    expect(screen.getByText('queue-tea open')).toBeTruthy()
    await press(t.flow.copy)

    await waitFor(() => expect(engine.copyText).toHaveBeenCalledWith('queue-tea open'))
  })

  it('says so in the sidebar', async () => {
    await open('/home', none)

    expect(screen.getByText(t.firstRun.noRealms)).toBeTruthy()
  })

  it('stays put when the dialog is cancelled', async () => {
    const { engine } = await open('/home', none)

    await press(t.firstRun.open)

    await waitFor(() => expect(engine.openFolder).toHaveBeenCalled())
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('asks before adding a folder, and says where the record goes', async () => {
    await open('/home', { ...none, openFolder: async () => ({ ok: true, data: NEW_FOLDER }) })

    await press(t.firstRun.open)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(t.addRealm.notYet('demo'))).toBeTruthy()
    expect(within(dialog).getByText(t.addRealm.note)).toBeTruthy()
    expect(within(dialog).queryByText(t.addRealm.noRepo)).toBeNull()
  })

  it('says when the folder is no repository', async () => {
    await open('/home', { ...none, openFolder: async () => ({ ok: true, data: { ...NEW_FOLDER, isRepo: false } }) })

    await press(t.firstRun.open)

    expect(await screen.findByText(t.addRealm.noRepo)).toBeTruthy()
  })

  it('adds it and goes to it', async () => {
    const listProjects = vi.fn<EngineApi['listProjects']>(async () => ({ ok: true, data: [] }))
    const { engine } = await open('/home', { listProjects, openFolder: async () => ({ ok: true, data: NEW_FOLDER }), addProject: vi.fn(async () => ({ ok: true as const, data: 'demo-abc123' })) })
    await press(t.firstRun.open)
    await screen.findByText(t.github.noAccounts)
    listProjects.mockResolvedValue({ ok: true, data: [projectRow('demo-abc123')] })

    await press(t.addRealm.add)

    await waitFor(() => expect(engine.addProject).toHaveBeenCalledWith('/p/demo'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ lastProject: 'demo-abc123' }))
  })

  it('stays open with the reason when it can\'t add', async () => {
    await open('/home', { ...none, openFolder: async () => ({ ok: true, data: NEW_FOLDER }), addProject: async () => ({ ok: false, error: { message: "Couldn't add that realm." } }) })
    await press(t.firstRun.open)
    await screen.findByText(t.github.noAccounts)

    await press(t.addRealm.add)

    expect((await screen.findByRole('alert')).textContent).toBe("Couldn't add that realm.")
  })

  it('goes straight to a realm it already knows', async () => {
    const { engine } = await open('/home', { openFolder: async () => ({ ok: true, data: { ...NEW_FOLDER, key: KEY, isKnown: true } }) })

    await press(t.firstRun.openFolder)

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ lastProject: KEY }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('⌘O opens the dialog', async () => {
    const { engine } = await open('/home')

    await key('o', { metaKey: true })

    await waitFor(() => expect(engine.openFolder).toHaveBeenCalled())
  })

  it('says when the dialog failed', async () => {
    await open('/home', { openFolder: async () => ({ ok: false, error: { message: "Couldn't open that folder." } }) })

    await press(t.firstRun.openFolder)

    expect(await screen.findByText("Couldn't open that folder.")).toBeTruthy()
  })
})

describe('the failed record', () => {
  const failing = (view: ProjectView = FAILED) => ({ readProject: vi.fn(async () => ({ ok: true as const, data: view })) })

  it('says why, with the file, and that nothing can change', async () => {
    await open('/home', failing())

    expect(screen.getByRole('heading', { name: t.failedRecord.title })).toBeTruthy()
    expect(screen.getByText("It isn't valid JSON (Unexpected token).")).toBeTruthy()
    expect(screen.getByText(FAILED.kind === 'unreadable' ? FAILED.file : '')).toBeTruthy()
    expect(screen.getByText(t.failedRecord.noChange('a'), { exact: false })).toBeTruthy()
  })

  it('offers the last good copy only when there is one', async () => {
    await open('/home', failing({ ...FAILED, canRestore: false } as ProjectView))

    expect(screen.queryByRole('button', { name: t.failedRecord.restore })).toBeNull()
    expect(screen.getByRole('button', { name: t.failed.tryAgain })).toBeTruthy()
  })

  it('offers no copy of a newer record, and says why', async () => {
    await open('/home', failing({ ...FAILED, isNewer: true, canRestore: false } as ProjectView))

    expect(screen.getByText(t.failedRecord.newerNote)).toBeTruthy()
  })

  it('puts the copy back, and says where the broken one went', async () => {
    const { engine } = await open('/home', { ...failing(), restoreRealm: vi.fn(async () => ({ ok: true as const, data: 'a.json.broken-2026' })) })

    await press(t.failedRecord.restore)

    await waitFor(() => expect(engine.restoreRealm).toHaveBeenCalledWith(KEY))
    expect(await screen.findByText(t.failedRecord.restored('a.json.broken-2026'))).toBeTruthy()
  })

  it('l and r are the same two buttons', async () => {
    const readProject = vi.fn(async () => ({ ok: true as const, data: FAILED }))
    const { engine } = await open('/home', { readProject })
    const before = readProject.mock.calls.length

    await key('l')
    await waitFor(() => expect(engine.restoreRealm).toHaveBeenCalled())
    await key('r')

    await waitFor(() => expect(readProject.mock.calls.length).toBeGreaterThan(before))
  })

  it('shows the record in Finder, by its key', async () => {
    const { engine } = await open('/home', failing())

    await press(t.settings.showInFinder)

    await waitFor(() => expect(engine.showRecord).toHaveBeenCalledWith(KEY))
  })

  it('stands in for every tab, with the tabs off', async () => {
    await open('/mana', failing())

    expect(screen.getByRole('heading', { name: t.failedRecord.title })).toBeTruthy()
    expect(screen.queryByRole('link', { name: t.nav.quests })).toBeNull()
    expect(screen.getByText(t.nav.quests).getAttribute('aria-disabled')).toBe('true')
  })

  it('leaves the rest of the app to get to', async () => {
    await open('/hoard', failing())

    expect(screen.getByRole('link', { name: t.nav.quests })).toBeTruthy()
  })

  it('says when the copy couldn\'t go back', async () => {
    await open('/home', { ...failing(), restoreRealm: async () => ({ ok: false, error: { message: 'There is no good copy.' } }) })

    await press(t.failedRecord.restore)

    expect(await screen.findByText('There is no good copy.')).toBeTruthy()
  })
})
