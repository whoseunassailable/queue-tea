// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ActiveQuest, BoardEntry, EngineApi, ProjectView, Settings } from '../../../../shared/engine_api'
import { App } from '../../../app/app'
import { t } from '../../../l10n/en'
import { activeQuest, fakeEngine, projectView, quest } from '../../../test_support'
import { createWorkspace } from '../../workspace/state_management/workspace_store'

const KEY = 'a-000001'
const one = (id: string, title: string, over: Parameters<typeof quest>[0] | object = {}): BoardEntry => ({ kind: 'quest', quest: quest({ id, title, ...over }) })
const MAIN = one('first', 'First quest', { isStar: true, why: 'urgent', priority: 'urgent' })
const OTHER = one('second', 'Second quest')
const PAUSED = one('paused', 'Paused quest', { branch: 'task/paused' })
const SEALED = one('stuck', 'Stuck quest', { sealedBecause: 'waiting for the clinic' })
const BOARD = projectView(KEY, { ready: [MAIN, OTHER, PAUSED], sealed: [SEALED], canStart: 3, sealedCount: 1 }) as Extract<ProjectView, { kind: 'readable' }>
const inHand = (quests: ActiveQuest[]): ProjectView => ({ ...BOARD, active: quests[0] ?? null, activeQuests: quests, session: { state: 'open', allowance: null } })
const MANA = activeQuest({ id: 'mana', title: 'Mana tracking' })
const RECIPE = activeQuest({ id: 'recipe', title: 'Recipe panel', priority: 'mid' })

const SETTINGS: Settings = { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} }

const open = async (view: ProjectView, over: Partial<EngineApi> = {}) => {
  const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace }
}
const remembering = (homeNav: Settings['homeNav']): Partial<EngineApi> => ({ readSettings: async () => ({ ok: true, data: { ...SETTINGS, homeNav } }) })

const press = (name: string | RegExp | HTMLElement) => act(() => void fireEvent.click(name instanceof HTMLElement ? name : screen.getByRole('button', { name })))
const button = (name: string | RegExp) => screen.getByRole<HTMLButtonElement>('button', { name })
const key = (name: string) => act(() => void fireEvent.keyDown(document.body, { key: name }))
const group = (label: string, count: number) => button(t.home.group(label, count))
const titleInDetails = (title: string) => screen.queryByRole('button', { name: t.actions.editTitle(title) })

beforeEach(() => {
  window.location.hash = '#/home'
})
afterEach(cleanup)

describe('picking a quest on Home', () => {
  it('shows the quest in hand that was clicked, then the waiting one clicked next', async () => {
    await open(inHand([MANA, RECIPE]))
    expect(screen.getByRole('heading', { name: 'Mana tracking', level: 1 })).toBeTruthy()

    await press(t.home.pick('Recipe panel'))
    expect(screen.getByRole('heading', { name: 'Recipe panel', level: 1 })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Mana tracking', level: 1 })).toBeNull()

    await press(t.home.pick('Second quest'))
    expect(titleInDetails('Second quest')).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Recipe panel', level: 1 })).toBeNull()
    expect(button(t.home.pick('Second quest')).getAttribute('aria-current')).toBe('true')
  })

  it('shows a sealed quest with Unseal, and no Start on its card', async () => {
    await open(BOARD)
    await press(group(t.home.groups.sealed, 1))

    await press(t.home.pick('Stuck quest'))

    expect(button(t.actions.unseal)).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.home.startNamed('Stuck quest') })).toBeNull()
  })

  it('opens on Next up with nothing in hand', async () => {
    await open(BOARD)

    expect(titleInDetails('First quest')).toBeTruthy()
  })
})

describe('Next up', () => {
  it('stands above every quest in hand, ready to start', async () => {
    const many = Array.from({ length: 8 }, (_, i) => activeQuest({ id: `a${i}`, title: `Active ${i}` }))
    const { engine } = await open(inHand(many))

    const start = button(t.actions.startNamed('First quest'))
    expect(start.compareDocumentPosition(button(t.home.pick('Active 0'))) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await press(t.home.nextUpCodex('First quest'))

    await waitFor(() => expect(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex'))
  })

  it('offers the first quest that can start when nothing has the ★', async () => {
    await open(projectView(KEY, { ready: [SEALED, OTHER], canStart: 1 }))

    expect(screen.getByText(t.quest.noneLine('Second quest'))).toBeTruthy()
    expect(button(t.home.startNext('Second quest')).textContent).toBe(t.home.startNamed('Second quest'))
  })
})

describe('groups', () => {
  it('fold and unfold, each with its count', async () => {
    await open(inHand([MANA]))
    expect(group(t.home.groups.active, 1).getAttribute('aria-expanded')).toBe('true')
    expect(group(t.home.groups.ready, 3).getAttribute('aria-expanded')).toBe('true')
    expect(group(t.home.groups.sealed, 1).getAttribute('aria-expanded')).toBe('false')

    await press(group(t.home.groups.active, 1))

    expect(screen.queryByRole('button', { name: t.home.pick('Mana tracking') })).toBeNull()
    expect(button(t.home.pick('First quest'))).toBeTruthy()
    await press(group(t.home.groups.active, 1))
    expect(button(t.home.pick('Mana tracking'))).toBeTruthy()
  })

  it('show 60 cards, then the rest when asked', async () => {
    const ready = Array.from({ length: 70 }, (_, i) => one(`q${i}`, `Quest ${i}`))
    await open(projectView(KEY, { ready, canStart: 70 }))

    expect(screen.getAllByRole('button', { name: /^Show Quest / })).toHaveLength(60)
    await press(t.home.more(10))

    expect(screen.getAllByRole('button', { name: /^Show Quest / })).toHaveLength(70)
  })
})

describe('quick actions', () => {
  it('Pause puts a quest in hand back on the board', async () => {
    const putBackQuest = vi.fn<EngineApi['putBackQuest']>(async () => ({ ok: true, data: { view: inHand([MANA]), went: 'asked', missedCheckpoint: null, isCodexTimeLost: false } }))
    const { engine } = await open(inHand([MANA, RECIPE]), { putBackQuest })

    await press(t.home.pauseNamed('Recipe panel'))

    await waitFor(() => expect(engine.putBackQuest).toHaveBeenCalledWith(KEY, 'recipe', null))
  })

  it('Start starts a waiting quest, and Resume one that keeps its branch', async () => {
    const { engine } = await open(inHand([MANA]))
    expect(button(t.home.resumeNamed('Paused quest')).textContent).toBe(t.home.resume)

    await press(t.home.startNamed('Second quest'))
    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'))
    // It's picked, so its details follow it into hand.
    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ homeNav: { [KEY]: { open: 'second', folded: ['sealed'] } } }))
  })

  it('offers no Pause on a quest asking whether it is done', async () => {
    await open(inHand([activeQuest({ id: 'asks', title: 'Asks', review: { at: 'now', checked: null } })]))

    expect(screen.queryByRole('button', { name: t.home.pauseNamed('Asks') })).toBeNull()
    expect(screen.getByRole('heading', { name: t.judgement.ask('Asks') })).toBeTruthy()
  })
})

describe('search and filters', () => {
  it('narrow every group, and say when nothing matches', async () => {
    await open(inHand([MANA, RECIPE]))
    const box = screen.getByRole('searchbox', { name: t.filters.search })

    await act(() => void fireEvent.input(box, { target: { value: 'recipe' } }))
    expect(button(t.home.pick('Recipe panel'))).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.home.pick('Mana tracking') })).toBeNull()
    expect(screen.queryByRole('button', { name: t.home.pick('Second quest') })).toBeNull()

    await act(() => void fireEvent.input(box, { target: { value: 'nothing like it' } }))
    expect(screen.getByText(t.filters.noMatch('nothing like it'), { exact: false })).toBeTruthy()
    await press(t.filters.clearSearch)
    expect(button(t.home.pick('Second quest'))).toBeTruthy()
  })
})

describe('what Home remembers', () => {
  it('opens on the quest and the groups as they were left', async () => {
    await open(inHand([MANA]), remembering({ [KEY]: { open: 'second', folded: ['active'] } }))

    expect(titleInDetails('Second quest')).toBeTruthy()
    expect(group(t.home.groups.active, 1).getAttribute('aria-expanded')).toBe('false')
  })

  it('falls back to the first quest in hand when the one it remembers has gone', async () => {
    await open(inHand([MANA]), remembering({ [KEY]: { open: 'gone', folded: [] } }))

    expect(screen.getByRole('heading', { name: 'Mana tracking', level: 1 })).toBeTruthy()
  })

  it('saves the pick and the folds a moment after the last change', async () => {
    const { engine } = await open(BOARD)

    await press(t.home.pick('Second quest'))
    await press(group(t.home.groups.ready, 3))

    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ homeNav: { [KEY]: { open: 'second', folded: ['ready', 'sealed'] } } }))
    expect(engine.saveSettings).toHaveBeenCalledTimes(1)
  })
})

describe('a narrow window', () => {
  afterEach(() => {
    window.innerWidth = 1280
  })

  it('floats the details over the list, with a way to close them', async () => {
    window.innerWidth = 1000
    await open(BOARD)
    expect(titleInDetails('First quest')).toBeNull()

    await press(t.home.pick('Second quest'))
    expect(titleInDetails('Second quest')).toBeTruthy()
    await press(t.narrow.closeDetail)
    expect(titleInDetails('Second quest')).toBeNull()
  })

  it('gives the details a page of their own, with the way back to Home', async () => {
    window.innerWidth = 700
    await open(BOARD)

    await press(t.home.pick('Second quest'))
    expect(screen.queryByRole('button', { name: t.home.pick('First quest') })).toBeNull()
    await press(t.home.back)
    expect(button(t.home.pick('First quest'))).toBeTruthy()
  })
})

describe('keys on Home', () => {
  it('s starts the quest picked', async () => {
    const { engine } = await open(BOARD)
    await press(t.home.pick('Second quest'))

    await key('s')
    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'))
  })

  it('k asks to seal the waiting quest picked', async () => {
    await open(BOARD)
    await press(t.home.pick('Second quest'))

    await key('k')

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(within(screen.getByRole('dialog')).getByText('Second quest', { exact: false })).toBeTruthy()
  })

  it('d and b act on the quest in hand that is picked', async () => {
    const putBackQuest = vi.fn<EngineApi['putBackQuest']>(async () => ({ ok: true, data: { view: inHand([MANA]), went: 'asked', missedCheckpoint: null, isCodexTimeLost: false } }))
    const { engine } = await open(inHand([MANA, RECIPE]), { putBackQuest })
    await press(t.home.pick('Recipe panel'))

    await key('b')

    await waitFor(() => expect(engine.putBackQuest).toHaveBeenCalledWith(KEY, 'recipe', null))
  })
})
