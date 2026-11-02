// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, FolderPick, InstalledCommand, MenuItem, Opened, Reply } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, projectRow, projectView, SETTINGS_PAGE } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const OTHER = 'b-000002'
const KNOWN: FolderPick = { path: '/p/b', name: 'b', key: OTHER, isKnown: true, isRepo: true }
const NEW: FolderPick = { path: '/p/demo', name: 'demo', key: 'demo-abc123', isKnown: false, isRepo: true }
const TWO = { listProjects: async () => ({ ok: true as const, data: [projectRow(KEY, { name: 'a' }), projectRow(OTHER, { name: 'b' })] }) }

const open = async (route: string, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  let heard: ((opened: Opened) => void) | null = null
  let menu: ((item: MenuItem) => void) | null = null
  const { engine } = fakeEngine({
    ...TWO,
    onOpened: listener => {
      heard = listener

      return () => {}
    },
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

  return { engine, workspace, arrive: (opened: Opened) => act(async () => heard?.(opened)), menu: (item: MenuItem) => act(async () => menu?.(item)) }
}

const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))

afterEach(cleanup)

describe('a link to a realm it knows', () => {
  it('selects it', async () => {
    const { engine, arrive } = await open('/home')

    await arrive({ kind: 'folder', pick: KNOWN })

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ lastProject: OTHER }))
  })

  it('tags it Detected in the sidebar', async () => {
    const { arrive } = await open('/home')

    await arrive({ kind: 'folder', pick: KNOWN })

    expect(within(screen.getByRole('button', { name: /^b/ })).getByText(new RegExp(t.status.detected))).toBeTruthy()
    expect(within(screen.getByRole('button', { name: /^a/ })).queryByText(new RegExp(t.status.detected))).toBeNull()
  })

  it('moves the tag to the next realm opened', async () => {
    const { arrive } = await open('/home')

    await arrive({ kind: 'folder', pick: KNOWN })
    await arrive({ kind: 'folder', pick: { ...KNOWN, key: KEY } })

    expect(within(screen.getByRole('button', { name: /^b/ })).queryByText(new RegExp(t.status.detected))).toBeNull()
  })
})

describe('a link to a folder it doesn\'t know', () => {
  it('asks first, and adds nothing on the link\'s word', async () => {
    const { engine, arrive } = await open('/home')

    await arrive({ kind: 'folder', pick: NEW })

    expect(within(screen.getByRole('dialog')).getByText(t.addRealm.notYet('demo'))).toBeTruthy()
    expect(engine.addProject).not.toHaveBeenCalled()
  })

  it('tags the realm once it\'s added', async () => {
    const listProjects = vi.fn<EngineApi['listProjects']>(TWO.listProjects)
    const addProject = vi.fn(async () => ({ ok: true as const, data: 'demo-abc123' }))
    const { arrive } = await open('/home', { listProjects, addProject })
    await arrive({ kind: 'folder', pick: NEW })
    listProjects.mockResolvedValue({ ok: true, data: [projectRow(KEY), projectRow('demo-abc123', { name: 'demo' })] })

    await press(t.addRealm.add)

    await waitFor(() => expect(within(screen.getByRole('button', { name: /^demo/ })).getByText(new RegExp(t.status.detected))).toBeTruthy())
  })

  it('leaves everything alone on Cancel', async () => {
    const { engine, arrive } = await open('/home')
    await arrive({ kind: 'folder', pick: NEW })

    await press(t.actions.cancel)

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(engine.addProject).not.toHaveBeenCalled()
  })
})

describe('what can go wrong', () => {
  it('says so for a bad link', async () => {
    const { arrive } = await open('/home')

    await arrive({ kind: 'failed', message: "That link doesn't name a folder." })

    expect(screen.getByText("That link doesn't name a folder.")).toBeTruthy()
  })
})

describe('what arrived before the window was listening', () => {
  it('is picked up at the start', async () => {
    const { engine } = await open('/home', { takeOpened: async () => ({ ok: true, data: [{ kind: 'folder', pick: KNOWN }] }) })

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ lastProject: OTHER }))
  })

  it('says so if it can\'t be read', async () => {
    await open('/home', { takeOpened: async () => ({ ok: false, error: { message: "Couldn't open that folder." } }) })

    expect(await screen.findByText("Couldn't open that folder.")).toBeTruthy()
  })
})

describe('the Judgement notification', () => {
  it('opens that realm on Home, where the question is', async () => {
    const asked = projectView(OTHER, { active: activeQuest({ title: 'The quest', review: { at: 'now', checked: null } }) })
    const { arrive } = await open('/quests', { readProject: async key => ({ ok: true, data: key === OTHER ? asked : projectView(key) }) })

    await arrive({ kind: 'judgement', key: OTHER })

    await waitFor(() => expect(window.location.hash).toBe('#/home'))
    expect(await screen.findByRole('heading', { name: t.judgement.ask('The quest') })).toBeTruthy()
  })
})

describe('installing the command', () => {
  const installed = (command: InstalledCommand | null) => ({ readSettingsPage: async () => ({ ok: true as const, data: { ...SETTINGS_PAGE, command } }) })

  it('offers it in Settings', async () => {
    const { engine } = await open('/settings')

    await screen.findByText('b-000002.json')
    await press(t.settings.install)

    await waitFor(() => expect(engine.installCommand).toHaveBeenCalled())
    expect(await screen.findByText(t.settings.installed('/usr/local/bin/queue-tea'))).toBeTruthy()
  })

  it('says where it is once it\'s there', async () => {
    await open('/settings', installed({ path: '/usr/local/bin/queue-tea', needsPath: false }))

    expect(await screen.findByText('/usr/local/bin/queue-tea')).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.settings.install })).toBeNull()
  })

  it('says when its folder needs adding to the PATH', async () => {
    const path: Reply<InstalledCommand> = { ok: true, data: { path: '/h/.local/bin/queue-tea', needsPath: true } }
    await open('/settings', { installCommand: async () => path })

    await screen.findByText('b-000002.json')
    await press(t.settings.install)

    expect(await screen.findByText(t.settings.installedPath('/h/.local/bin/queue-tea'))).toBeTruthy()
  })

  it('says why not when it can\'t', async () => {
    await open('/settings', { installCommand: async () => ({ ok: false, error: { message: "There's already a queue-tea here." } }) })

    await screen.findByText('b-000002.json')
    await press(t.settings.install)

    expect(await screen.findByText("There's already a queue-tea here.")).toBeTruthy()
  })

  it('runs from the menu too', async () => {
    const { engine, menu } = await open('/home')

    await menu({ kind: 'installCommand' })

    await waitFor(() => expect(engine.installCommand).toHaveBeenCalled())
  })

  it('explains the link the tea cup uses', async () => {
    await open('/settings')

    expect(await screen.findByText(t.settings.linkLine)).toBeTruthy()
  })
})
