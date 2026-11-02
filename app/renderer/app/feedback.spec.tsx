// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Book, EngineApi, FolderPick, GithubLoginCode, GithubView, LibraryView, Reply, Settings } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, GAME, projectRow, projectView, quest, SETTINGS_PAGE } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: quest({ id: 'first', title: 'Fix the docs', isStar: true, xp: 25 }) }], canStart: 1 })
const ACCOUNTS: GithubView = { kind: 'ready', accounts: [{ login: 'first-account', isActive: true, isWorking: true }, { login: 'second-account', isActive: false, isWorking: true }] }
const settings = (over: Partial<Settings>): Reply<Settings> => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {}, ...over } })

const open = async (route: string, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: BOARD }), readGithub: async () => ({ ok: true, data: ACCOUNTS }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace }
}

const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))
const input = (label: string | RegExp, value: string) => act(() => void fireEvent.input(screen.getByLabelText(label), { target: { value } }))
const hud = () => document.querySelector('.hud') as HTMLElement
// An account in the open dialog, once gh has answered.
const pick = async (name: string | RegExp) => {
  const radio = await within(screen.getByRole('dialog')).findByRole('radio', { name })
  act(() => void fireEvent.click(radio))
}

beforeEach(() => {
  window.innerWidth = 1280
})
afterEach(cleanup)

describe('the HUD', () => {
  it('leaves mana out until it\'s known, so nothing looks like a button that isn\'t', async () => {
    await open('/home', { readGame: async () => ({ ok: true, data: { ...GAME, allowance: null } }) })

    expect(within(hud()).getByRole('button', { name: t.github.connect })).toBeTruthy()
    expect(within(hud()).queryByText(/mana/i)).toBeNull()
  })

  it('shows mana once it is', async () => {
    await open('/home', { readGame: async () => ({ ok: true, data: { ...GAME, allowance: { percent: 62, resetsAt: null } } }) })

    expect(within(hud()).getByText(t.hud.mana(38, null))).toBeTruthy()
  })

  it('makes the chips that go somewhere real links', async () => {
    await open('/home')

    expect(within(hud()).getByRole('link', { name: /^Level 2/ }).getAttribute('href')).toBe('#/hoard')
    expect(within(hud()).getByRole('link', { name: t.hud.streakLink(GAME.streak, GAME.bestStreak) }).getAttribute('href')).toBe('#/chronicle')
    expect(within(hud()).getByRole('link', { name: t.hud.goldLink(GAME.gold) }).getAttribute('href')).toBe('#/hoard')
  })

  it('says what the quest ahead does for your level', async () => {
    await open('/home', { readGame: async () => ({ ok: true, data: { ...GAME, xpIntoLevel: 190, xpToNextLevel: 200, level: 2 } }) })

    expect(within(hud()).getByText(t.hud.levelsUp('Fix the docs', 3))).toBeTruthy()
  })

  it('counts the quest in hand first', async () => {
    const view = projectView(KEY, { active: activeQuest({ title: 'The quest in hand', xp: 50 }) })
    await open('/home', { readProject: async () => ({ ok: true, data: view }), readGame: async () => ({ ok: true, data: { ...GAME, xpIntoLevel: 190, xpToNextLevel: 200 } }) })

    expect(within(hud()).getByText(t.hud.levelsUp('The quest in hand', 3))).toBeTruthy()
  })

  it('warns when the streak is still to keep today', async () => {
    await open('/home', { readProject: async () => ({ ok: true, data: projectView(KEY) }), readGame: async () => ({ ok: true, data: { ...GAME, streak: 4, wonToday: false, xpIntoLevel: 20, xpToNextLevel: 200 } }) })

    expect(within(hud()).getByText(t.hud.keepStreak(4))).toBeTruthy()
    expect(document.querySelector('.hud-chip.risk')).toBeTruthy()
  })

  it('shows on the bar what the quest ahead would add', async () => {
    await open('/home')

    expect(document.querySelector('.bar .gain')).toBeTruthy()
  })
})

describe('keeping realms apart in Settings', () => {
  it('asks only for the realm you\'re in', async () => {
    const readSettingsPage = vi.fn(async () => ({ ok: true as const, data: SETTINGS_PAGE }))
    await open('/settings', { readSettingsPage })

    await waitFor(() => expect(readSettingsPage).toHaveBeenCalledWith(KEY))
  })

  it('names it, and lists no other', async () => {
    await open('/settings')

    expect(await screen.findByRole('heading', { name: t.settings.thisRealm('a') })).toBeTruthy()
    expect(screen.queryByText('b-000002.json')).toBeNull()
  })

  it('reads again when you change realm', async () => {
    const readSettingsPage = vi.fn(async () => ({ ok: true as const, data: SETTINGS_PAGE }))
    const { workspace } = await open('/settings', { readSettingsPage, listProjects: async () => ({ ok: true, data: [projectRow(KEY), projectRow('b-000002')] }) })

    await act(async () => workspace.pick('b-000002'))

    await waitFor(() => expect(readSettingsPage).toHaveBeenCalledWith('b-000002'))
  })

  it('leaves the section out with no realm picked', async () => {
    await open('/settings', { readSettingsPage: async () => ({ ok: true, data: { ...SETTINGS_PAGE, realm: null } }), listProjects: async () => ({ ok: true, data: [] }) })

    await screen.findByRole('heading', { name: t.settings.claude })
    expect(screen.queryByText(t.settings.setNow)).toBeNull()
  })

  it('refuses a log path that leaves the realm, under the field', async () => {
    const { engine } = await open('/settings', { readSettingsPage: async () => ({ ok: true, data: { ...SETTINGS_PAGE, realm: { ...SETTINGS_PAGE.realm!, logPath: null } } }) })
    await screen.findByRole('button', { name: t.settings.setNow })
    await press(t.settings.setNow)

    await input(`${t.finish.path} *`, '../other-realm/log.md')
    await press(t.actions.save)

    expect(screen.getByText(t.finish.pathOutside)).toBeTruthy()
    expect(engine.setTaskLog).not.toHaveBeenCalled()
  })
})

describe('an empty board', () => {
  const empty = { readProject: async () => ({ ok: true as const, data: projectView(KEY) }) }

  it('offers a way to fill it, on the board', async () => {
    await open('/quests', empty)

    expect(screen.getByText(t.empty.boardLine, { exact: false })).toBeTruthy()
  })

  it('offers a way to fill it, on Home', async () => {
    await open('/home', empty)

    await press(t.empty.fileOne)

    expect(await screen.findByRole('dialog')).toBeTruthy()
  })

  it('doesn\'t call a realm your first when you\'ve won elsewhere', async () => {
    await open('/home', empty)

    expect(screen.getByText(t.empty.noVictoriesHere)).toBeTruthy()
    expect(screen.queryByText(t.empty.noVictories)).toBeNull()
  })

  it('still welcomes a first victory when there are none anywhere', async () => {
    await open('/home', { ...empty, readGame: async () => ({ ok: true, data: { ...GAME, victories: 0 } }) })

    expect(screen.getByText(t.empty.noVictories)).toBeTruthy()
  })

  it('shows no such offer on a board with quests', async () => {
    await open('/home')

    expect(screen.queryByRole('button', { name: t.empty.fileOne })).toBeNull()
  })
})

describe('connecting a realm to GitHub', () => {
  it('offers it where mana was, as a real button', async () => {
    await open('/home')

    expect(within(hud()).getByRole('button', { name: t.github.connect })).toBeTruthy()
  })

  it('shows the account once it\'s connected', async () => {
    await open('/home', { readSettings: async () => settings({ realmAccounts: { [KEY]: 'first-account' } }) })

    expect(within(hud()).getByRole('button', { name: t.github.connected('first-account') })).toBeTruthy()
  })

  it('keeps it to this realm', async () => {
    await open('/home', { readSettings: async () => settings({ realmAccounts: { 'b-000002': 'first-account' } }) })

    expect(within(hud()).getByRole('button', { name: t.github.connect })).toBeTruthy()
  })

  it('lists the accounts, and saves the one picked for this realm', async () => {
    const { engine } = await open('/home')
    await press(t.github.connect)

    await pick(/second-account/)
    await press(t.actions.save)

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: { [KEY]: 'second-account' } }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('keeps other realms\' accounts when saving', async () => {
    const { engine } = await open('/home', { readSettings: async () => settings({ realmAccounts: { 'b-000002': 'first-account' } }) })
    await press(t.github.connect)
    await pick(/second-account/)
    await press(t.actions.save)

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: { 'b-000002': 'first-account', [KEY]: 'second-account' } }))
  })

  it('can disconnect', async () => {
    const { engine } = await open('/home', { readSettings: async () => settings({ realmAccounts: { [KEY]: 'first-account' } }) })
    await press(t.github.connected('first-account'))

    await pick(t.github.none)
    await press(t.actions.save)

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: {} }))
  })

  it('says when a connected account has gone from gh, and offers another', async () => {
    await open('/home', { readSettings: async () => settings({ realmAccounts: { [KEY]: 'gone-account' } }) })

    await press(t.github.connected('gone-account'))

    expect(await screen.findByText(t.github.gone('gone-account'))).toBeTruthy()
    expect(within(screen.getByRole('dialog')).getByRole('radio', { name: /first-account/ })).toBeTruthy()
    expect(within(screen.getByRole('dialog')).queryByRole('radio', { checked: true })).toBeNull()
  })

  it('marks an account whose sign-in lapsed', async () => {
    await open('/home', { readGithub: async () => ({ ok: true, data: { kind: 'ready', accounts: [{ login: 'first-account', isActive: true, isWorking: false }] } }) })

    await press(t.github.connect)

    expect(await screen.findByText(t.github.lapsed, { exact: false })).toBeTruthy()
  })

  it('says what to do when gh isn\'t installed', async () => {
    await open('/home', { readGithub: async () => ({ ok: true, data: { kind: 'missing' } }) })

    await press(t.github.connect)

    expect(await screen.findByText(t.github.missing)).toBeTruthy()
    expect(screen.getByText('brew install gh')).toBeTruthy()
  })

  it('offers adding the first account when there are none', async () => {
    await open('/home', { readGithub: async () => ({ ok: true, data: { kind: 'ready', accounts: [] } }) })

    await press(t.github.connect)

    expect(await screen.findByRole('button', { name: t.github.add })).toBeTruthy()
    expect(screen.getByText(t.github.noAccounts)).toBeTruthy()
  })

  it('says when the accounts can\'t be read, with a way to try again', async () => {
    const readGithub = vi.fn(async (): Promise<Reply<GithubView>> => ({ ok: false, error: { message: "Couldn't read your GitHub accounts." } }))
    await open('/home', { readGithub })

    await press(t.github.connect)

    expect(await screen.findByText("Couldn't read your GitHub accounts.")).toBeTruthy()
    await press(t.failed.tryAgain)
    await waitFor(() => expect(readGithub).toHaveBeenCalledTimes(2))
  })
})

describe('adding a GitHub account', () => {
  const CODE: GithubLoginCode = { code: '100F-29B8', url: 'https://github.com/login/device' }
  const signingIn = (over: Partial<EngineApi> = {}) =>
    open('/home', { startGithubLogin: vi.fn(async () => ({ ok: true as const, data: CODE })), awaitGithubLogin: vi.fn(() => new Promise<never>(() => {})), ...over })

  const startIt = async () => {
    await press(t.github.connect)
    await screen.findByRole('dialog')
    await press(t.github.add)
  }

  it('shows the code, and says to sign in as the account you want', async () => {
    await signingIn()

    await startIt()

    expect(await screen.findByText('100F-29B8')).toBeTruthy()
    expect(screen.getByText(t.github.signInAs)).toBeTruthy()
  })

  it('copies the code and opens GitHub', async () => {
    const { engine } = await signingIn()
    await startIt()
    await screen.findByText('100F-29B8')

    await press(t.github.openIt)

    await waitFor(() => expect(engine.copyText).toHaveBeenCalledWith('100F-29B8'))
    await waitFor(() => expect(engine.openGithubLogin).toHaveBeenCalled())
  })

  it('shows it waiting', async () => {
    await signingIn()
    await startIt()

    expect(await screen.findByText(t.github.waiting)).toBeTruthy()
  })

  it('picks the new account when it comes in', async () => {
    let finish: (reply: Reply<{ view: GithubView; added: string | null }>) => void = () => {}
    const awaitGithubLogin = vi.fn(() => new Promise<Reply<{ view: GithubView; added: string | null }>>(done => (finish = done)))
    await signingIn({ awaitGithubLogin })
    await startIt()
    await screen.findByText('100F-29B8')

    await act(async () => finish({ ok: true, data: { view: ACCOUNTS, added: 'second-account' } }))

    await waitFor(() => expect((within(screen.getByRole('dialog')).getByRole('radio', { name: /second-account/ }) as HTMLInputElement).checked).toBe(true))
  })

  it('cancels the sign-in when you leave', async () => {
    const { engine } = await signingIn()
    await startIt()
    await screen.findByText('100F-29B8')

    await press(t.actions.cancel)

    await waitFor(() => expect(engine.cancelGithubLogin).toHaveBeenCalled())
  })

  it('says why it couldn\'t start', async () => {
    await signingIn({ startGithubLogin: async () => ({ ok: false, error: { message: "GitHub's sign-in didn't start." } }) })

    await startIt()

    expect(await screen.findByText("GitHub's sign-in didn't start.")).toBeTruthy()
  })
})

describe('GitHub in Settings', () => {
  it('lists the accounts, with a button to add one', async () => {
    await open('/settings')

    expect(await screen.findByText('first-account')).toBeTruthy()
    expect(screen.getByText('second-account')).toBeTruthy()
    expect(screen.getByRole('button', { name: t.github.add })).toBeTruthy()
  })

  it('shows and changes this realm\'s account', async () => {
    await open('/settings', { readSettings: async () => settings({ realmAccounts: { [KEY]: 'first-account' } }) })

    await screen.findByRole('button', { name: t.github.changeFor('a') })
    await press(t.github.changeFor('a'))

    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
})

describe('a new realm', () => {
  const NEW: FolderPick = { path: '/p/demo', name: 'demo', key: 'demo-abc123', isKnown: false, isRepo: true }
  const addRealm = async (over: Partial<EngineApi> = {}) => {
    const opened = await open('/home', { openFolder: async () => ({ ok: true, data: NEW }), addProject: vi.fn(async () => ({ ok: true as const, data: 'demo-abc123' })), ...over })
    await press(t.firstRun.openFolder)

    return { ...opened, dialog: await screen.findByRole('dialog') }
  }

  it('asks which account, listing what\'s available', async () => {
    const { dialog } = await addRealm()

    expect(await within(dialog).findByRole('radio', { name: /first-account/ })).toBeTruthy()
    expect(within(dialog).getByRole('radio', { name: /second-account/ })).toBeTruthy()
    expect(within(dialog).getByRole('radio', { name: t.github.none })).toBeTruthy()
  })

  it('won\'t add until it\'s answered, with the error under the choice', async () => {
    const { engine, dialog } = await addRealm()
    await within(dialog).findByRole('radio', { name: /first-account/ })

    await press(t.addRealm.add)

    expect(screen.getByText(t.github.pickOne)).toBeTruthy()
    expect(engine.addProject).not.toHaveBeenCalled()
  })

  it('saves the account for the new realm', async () => {
    const { engine } = await addRealm()
    await pick(/second-account/)

    await press(t.addRealm.add)

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: { 'demo-abc123': 'second-account' } }))
  })

  it('adds with no account when that\'s the answer, and saves none', async () => {
    const { engine } = await addRealm()
    await pick(t.github.none)

    await press(t.addRealm.add)

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(engine.addProject).toHaveBeenCalled()
    expect(engine.saveSettings).not.toHaveBeenCalledWith(expect.objectContaining({ realmAccounts: expect.anything() }))
  })

  it('doesn\'t hold you up with no accounts to pick from', async () => {
    const { engine } = await addRealm({ readGithub: async () => ({ ok: true, data: { kind: 'ready', accounts: [] } }) })
    await screen.findByText(t.github.noAccounts)

    await press(t.addRealm.add)

    await waitFor(() => expect(engine.addProject).toHaveBeenCalled())
  })

  it('doesn\'t hold you up with gh not installed', async () => {
    const { engine } = await addRealm({ readGithub: async () => ({ ok: true, data: { kind: 'missing' } }) })
    await screen.findByText(t.github.missing)

    await press(t.addRealm.add)

    await waitFor(() => expect(engine.addProject).toHaveBeenCalled())
  })
})

describe('the Library', () => {
  const book = (over: Partial<Book> & { id: string }): Book => ({ title: over.id, author: null, totalPages: 400, firstPage: 0, page: 0, started: '2026-11-01', finished: null, log: [], ...over })
  const shelf = (over: Partial<LibraryView> = {}): LibraryView => ({ reading: [], finished: [], finishedCount: 0, pagesRead: 0, pagesThisWeek: 0, pagesToday: 0, ...over })
  const reply = (over: Partial<LibraryView> = {}) => vi.fn(async () => ({ ok: true as const, data: shelf(over) }))
  const DUNE = book({ id: 'dune', title: 'Dune', author: 'Frank Herbert', page: 100 })

  it('is in the sidebar, with no realm needed', async () => {
    await open('/home', { readLibrary: reply(), listProjects: async () => ({ ok: true, data: [] }) })

    expect(screen.getByRole('link', { name: t.nav.library }).getAttribute('href')).toBe('#/library')
  })

  it('says what to do with an empty shelf', async () => {
    await open('/library', { readLibrary: reply() })

    expect(await screen.findByText(t.library.empty)).toBeTruthy()
  })

  it('shows how far through a book you are', async () => {
    await open('/library', { readLibrary: reply({ reading: [DUNE] }) })

    expect(await screen.findByRole('heading', { name: 'Dune' })).toBeTruthy()
    expect(screen.getByText('Frank Herbert')).toBeTruthy()
    expect(screen.getByText(t.library.progress(25, 300))).toBeTruthy()
    expect(screen.getByRole('img', { name: t.library.percent(25) })).toBeTruthy()
  })

  it('shows what you\'ve read', async () => {
    await open('/library', { readLibrary: reply({ reading: [DUNE], finishedCount: 3, pagesRead: 1200, pagesThisWeek: 80, pagesToday: 20 }) })

    expect(await screen.findByText(t.library.stats(3, 1200))).toBeTruthy()
    expect(screen.getByText(t.library.pace(20, 80))).toBeTruthy()
  })

  it('lists finished books with when', async () => {
    await open('/library', { readLibrary: reply({ finished: [book({ id: 'done', title: 'Emma', page: 400, finished: '2026-10-20' })], finishedCount: 1 }) })

    expect(await screen.findByText('Emma')).toBeTruthy()
    expect(screen.getByText(t.library.finishedOn('20 Oct', 400))).toBeTruthy()
  })

  it('saves the page you\'ve reached', async () => {
    const setBookPage = vi.fn(async () => ({ ok: true as const, data: shelf({ reading: [{ ...DUNE, page: 150 }] }) }))
    await open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage })
    const page = (await screen.findByLabelText(t.library.pageOf('Dune'))) as HTMLInputElement

    await act(async () => void fireEvent.input(page, { target: { value: '150' } }))
    await act(async () => void fireEvent.blur(page))

    await waitFor(() => expect(setBookPage).toHaveBeenCalledWith('dune', 150))
    expect(await screen.findByText(t.library.progress(38, 250))).toBeTruthy()
  })

  it('saves nothing when the page hasn\'t moved', async () => {
    const setBookPage = vi.fn(async () => ({ ok: true as const, data: shelf() }))
    await open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage })
    const page = await screen.findByLabelText(t.library.pageOf('Dune'))

    await act(async () => void fireEvent.blur(page))

    expect(setBookPage).not.toHaveBeenCalled()
  })

  it('keeps what you typed and says why when it can\'t save', async () => {
    await open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage: async () => ({ ok: false, error: { message: "Couldn't save that." } }) })
    const page = (await screen.findByLabelText(t.library.pageOf('Dune'))) as HTMLInputElement

    await act(async () => void fireEvent.input(page, { target: { value: '150' } }))
    await act(async () => void fireEvent.blur(page))

    expect(await screen.findByText("Couldn't save that.")).toBeTruthy()
    expect(page.value).toBe('150')
  })

  it('shows the page saved elsewhere', async () => {
    const readLibrary = reply({ reading: [DUNE] })
    await open('/library', { readLibrary, addBook: vi.fn(async () => ({ ok: true as const, data: shelf({ reading: [{ ...DUNE, page: 220 }] }) })) })
    await screen.findByLabelText(t.library.pageOf('Dune'))

    await press(t.library.add)
    await input(`${t.form.title} *`, 'Dune')
    await input(`${t.library.totalPages} *`, '412')
    await press(t.library.addIt)

    await waitFor(() => expect((screen.getByLabelText(t.library.pageOf('Dune')) as HTMLInputElement).value).toBe('220'))
  })

  it('says under the field when the page is past the end, and saves nothing', async () => {
    const setBookPage = vi.fn(async () => ({ ok: true as const, data: shelf() }))
    await open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage })
    const page = await screen.findByLabelText(t.library.pageOf('Dune'))

    await act(async () => void fireEvent.input(page, { target: { value: '401' } }))
    await act(async () => void fireEvent.blur(page))

    expect(screen.getByText(t.library.badPage(400))).toBeTruthy()
    expect(setBookPage).not.toHaveBeenCalled()
  })

  it('marks a book finished', async () => {
    const finishBook = vi.fn(async () => ({ ok: true as const, data: shelf() }))
    await open('/library', { readLibrary: reply({ reading: [DUNE] }), finishBook })

    await screen.findByRole('heading', { name: 'Dune' })
    await press(t.library.finish('Dune'))

    await waitFor(() => expect(finishBook).toHaveBeenCalledWith('dune'))
  })

  it('takes a book off the shelf, asking first', async () => {
    const removeBook = vi.fn(async () => ({ ok: true as const, data: shelf() }))
    await open('/library', { readLibrary: reply({ reading: [DUNE] }), removeBook })
    await screen.findByRole('heading', { name: 'Dune' })

    await press(t.library.remove('Dune'))
    expect(removeBook).not.toHaveBeenCalled()
    await press(t.library.removeIt)

    await waitFor(() => expect(removeBook).toHaveBeenCalledWith('dune'))
  })

  describe('adding a book', () => {
    const sheet = async (over: Partial<EngineApi> = {}) => {
      const opened = await open('/library', { readLibrary: reply(), addBook: vi.fn(async () => ({ ok: true as const, data: shelf({ reading: [DUNE] }) })), ...over })
      await screen.findByText(t.library.empty)
      await press(t.library.add)

      return opened
    }

    it('checks each field as it loses focus', async () => {
      await sheet()

      await act(async () => void fireEvent.blur(screen.getByLabelText(`${t.form.title} *`)))
      expect(screen.getByText(t.form.titleRequired)).toBeTruthy()

      await act(async () => void fireEvent.blur(screen.getByLabelText(`${t.library.totalPages} *`)))
      expect(screen.getByText(t.library.pagesRequired)).toBeTruthy()
    })

    it('checks everything on submit, with the button enabled', async () => {
      const { engine } = await sheet()

      expect(screen.getByRole<HTMLButtonElement>('button', { name: t.library.addIt }).disabled).toBe(false)
      await press(t.library.addIt)

      expect(screen.getByText(t.form.titleRequired)).toBeTruthy()
      expect(screen.getByText(t.library.pagesRequired)).toBeTruthy()
      expect(engine.addBook).not.toHaveBeenCalled()
    })

    it('keeps the button still under the mouse, so an error can\'t make the press miss', async () => {
      await sheet()

      expect(fireEvent.mouseDown(screen.getByRole('button', { name: t.library.addIt }))).toBe(false)
      expect(fireEvent.mouseDown(screen.getByLabelText(`${t.form.title} *`))).toBe(true)
    })

    it('refuses pages that aren\'t a number, in plain words', async () => {
      await sheet()

      await input(`${t.library.totalPages} *`, 'lots')
      await press(t.library.addIt)

      expect(screen.getByText(t.library.pagesBad)).toBeTruthy()
    })

    it('refuses a page past the end', async () => {
      await sheet()

      await input(`${t.library.totalPages} *`, '100')
      await input(t.library.startPage, '101')
      await press(t.library.addIt)

      expect(screen.getByText(t.library.badPage(100))).toBeTruthy()
    })

    it('adds the book and closes', async () => {
      const { engine } = await sheet()

      await input(`${t.form.title} *`, 'Dune')
      await input(t.library.author, 'Frank Herbert')
      await input(`${t.library.totalPages} *`, '412')
      await input(t.library.startPage, '30')
      await press(t.library.addIt)

      await waitFor(() => expect(engine.addBook).toHaveBeenCalledWith({ title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 30 }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    })

    it('stays open with the reason when it can\'t save', async () => {
      await sheet({ addBook: async () => ({ ok: false, error: { message: "Couldn't save that." } }) })

      await input(`${t.form.title} *`, 'Dune')
      await input(`${t.library.totalPages} *`, '412')
      await press(t.library.addIt)

      expect((await screen.findByRole('alert')).textContent).toBe("Couldn't save that.")
    })
  })

  it('says when the shelf can\'t be read', async () => {
    await open('/library', { readLibrary: async () => ({ ok: false, error: { message: "Your library file can't be read." } }) })

    expect((await screen.findByRole('alert')).textContent).toContain("Your library file can't be read.")
  })

  it('can be reached from the palette', async () => {
    await open('/home', { readLibrary: reply() })

    await act(() => void fireEvent.keyDown(document.body, { key: 'k', metaKey: true }))

    expect(screen.getByRole('option', { name: /Library/ })).toBeTruthy()
  })
})
