// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, ProjectView, QuestFacts, Recipe, Reply } from '../../shared/engine_api'
import { forgetRecipeDetail } from '../features/quests/presentation/state_management/recipe_detail'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, projectView, QUEST_FACTS, quest } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const FIRST = quest({ id: 'first', title: 'First quest', isStar: true })
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }], canStart: 1 })
const HELD = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }], canStart: 1, active: activeQuest({ id: 'held', title: 'The quest in hand', priority: 'urgent', difficulty: 'hard' }) })

const facts = (over: Partial<QuestFacts>) => async (): Promise<Reply<QuestFacts>> => ({ ok: true, data: { ...QUEST_FACTS, ...over } })
const ACTIVE: QuestFacts['active'] = {
  minutes: 43,
  today: 19,
  started: '2026-10-20T22:17:00+02:00',
  understandingMessages: 1,
  improvingMessages: 4,
  filesRead: 33,
  filesChanged: 39,
  lines: { added: 812, removed: 95, since: '1649ade' },
  git: { branch: 'task/held', head: '7a2ecc7 changed the homepage', uncommitted: ['a.md', 'b.md'], uncommittedCount: 2 },
}

const RECIPE: Recipe = {
  phase: 'active',
  stages: [
    { id: 'setOut', mark: 'done' },
    { id: 'understand', mark: 'done' },
    { id: 'build', mark: 'now' },
    { id: 'verify', mark: 'next' },
    { id: 'review', mark: 'next' },
  ],
  goal: 'Fix the docs',
  steps: [
    { text: 'Get it testable', mark: 'now' },
    { text: 'The diagrams', mark: 'next' },
  ],
  doneWhen: [],
  attention: [],
  profile: null,
  checks: [],
  notes: [],
  written: { kind: 'checkpoint', at: '2026-10-26T16:35:00+01:00' },
}

const open = async (view: ProjectView = BOARD, over: Partial<EngineApi> = {}) => {
  window.location.hash = '#/quests'
  const { engine, fire } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, fire, pane: () => screen.getByRole('complementary', { name: t.detail.label }) }
}

const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))

beforeEach(() => {
  window.innerWidth = 1280
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  forgetRecipeDetail()
})

describe('a quest\'s details on the board', () => {
  it('names the branch it will get', async () => {
    const { pane } = await open(BOARD, { readQuestFacts: facts({ branchToBe: 'task/first' }) })

    expect(await within(pane()).findByText('task/first')).toBeTruthy()
  })

  it('keeps the branch it already has', async () => {
    const view = projectView(KEY, { ready: [{ kind: 'quest', quest: { ...FIRST, branch: 'task/mine' } }], canStart: 1 })
    const { pane } = await open(view)

    expect(within(pane()).getByText('task/mine')).toBeTruthy()
  })

  it('says it is made at Start when it can\'t name one', async () => {
    const { pane } = await open()

    expect(await within(pane()).findByText(t.detail.noBranch)).toBeTruthy()
  })

  it('shows what it was filed with, folded', async () => {
    const { pane } = await open(BOARD, { readQuestFacts: facts({ messages: ['Fix the diagrams please'] }) })

    const filed = (await within(pane()).findByText(t.notes.filed(1))).closest('details') as HTMLDetailsElement
    expect(filed.open).toBe(false)
    expect(within(filed).getByText('Fix the diagrams please')).toBeTruthy()
  })

  it('leaves Filed with out when there is nothing', async () => {
    const { pane, engine } = await open()

    await waitFor(() => expect(engine.readQuestFacts).toHaveBeenCalled())
    expect(within(pane()).queryByText(/Filed with/)).toBeNull()
  })

  it('shows the recipe of a quest put back, compact, and opens it up when asked', async () => {
    const recipe = { ...RECIPE, phase: 'paused' as const }
    const { pane, engine } = await open(BOARD, { readQuestFacts: facts({ recipe }) })
    const panel = await within(pane()).findByRole('region', { name: t.recipe.label })

    expect(within(panel).getByText(t.recipe.step(3, 5))).toBeTruthy()
    expect(within(panel).getByText(t.recipe.status.shelved)).toBeTruthy()
    expect(within(panel).getByText(t.recipe.stages.build).closest('li')!.getAttribute('aria-current')).toBe('step')
    expect(within(panel).queryByText('The diagrams')).toBeNull()

    await act(() => void fireEvent.click(within(panel).getByRole('button', { name: t.recipe.details.detailed })))

    expect(within(panel).getByText('Fix the docs')).toBeTruthy()
    expect(within(panel).getByText('The diagrams')).toBeTruthy()
    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ recipeDetail: 'detailed' }))
  })

  it('keeps a plain handoff note whole in the technical recipe', async () => {
    const recipe = { ...RECIPE, phase: 'paused' as const, notes: [{ kind: 'note' as const, heading: null, lines: ['Carry on with the diagrams.'] }] }
    const { pane } = await open(BOARD, { readQuestFacts: facts({ recipe }) })
    const panel = await within(pane()).findByRole('region', { name: t.recipe.label })

    await act(() => void fireEvent.click(within(panel).getByRole('button', { name: t.recipe.details.technical })))

    expect(within(panel).getByText('Carry on with the diagrams.')).toBeTruthy()
  })

  it('has no recipe for a quest never worked on', async () => {
    const { pane, engine } = await open()

    await waitFor(() => expect(engine.readQuestFacts).toHaveBeenCalled())
    expect(within(pane()).queryByRole('region', { name: t.recipe.label })).toBeNull()
  })

  it('follows the quest when another is picked', async () => {
    const second = quest({ id: 'second', title: 'Second quest' })
    const view = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: second }], canStart: 2 })
    const readQuestFacts = vi.fn(facts({}))
    const { workspace } = await open(view, { readQuestFacts })
    await waitFor(() => expect(readQuestFacts).toHaveBeenCalledWith(KEY, 'first'))

    await act(async () => workspace.openQuest(KEY, 'second'))

    await waitFor(() => expect(readQuestFacts).toHaveBeenCalledWith(KEY, 'second'))
  })

  it('leaves the pane standing when they can\'t be read, and says so', async () => {
    const { pane } = await open(BOARD, { readQuestFacts: async () => ({ ok: false, error: { message: "Couldn't read this quest's details." } }) })

    expect(await within(pane()).findByText("Couldn't read this quest's details.")).toBeTruthy()
    expect(within(pane()).getByRole('button', { name: t.actions.startMain })).toBeTruthy()
  })
})

describe('the active quest\'s details', () => {
  const held = (over: Partial<EngineApi> = {}) => open(HELD, { readQuestFacts: vi.fn(facts({ active: ACTIVE })), ...over })
  const showIt = () => press(t.detail.openActive('The quest in hand'))

  it('updates its details when the record changes and keeps them through a failed refresh', async () => {
    const readQuestFacts = vi.fn(facts({ active: ACTIVE }))
    const { pane, fire } = await held({ readQuestFacts })
    await showIt()
    await within(pane()).findByText(t.notes.files(33, 39))
    readQuestFacts.mockImplementation(facts({ active: { ...ACTIVE, filesChanged: 40 } }))
    await act(async () => fire())
    expect(await within(pane()).findByText(t.notes.files(33, 40))).toBeTruthy()
    readQuestFacts.mockResolvedValue({ ok: false, error: { message: 'Could not read the details.' } })
    await act(async () => fire())
    expect(await within(pane()).findByText('Could not read the details.')).toBeTruthy()
    expect(within(pane()).getByText(t.notes.files(33, 40))).toBeTruthy()
    readQuestFacts.mockImplementation(facts({ active: ACTIVE }))
    await act(() => void fireEvent.click(within(pane()).getByRole('button', { name: t.detail.refresh })))
    expect(await within(pane()).findByText(t.notes.files(33, 39))).toBeTruthy()
  })

  it('shows a busy refresh without removing the details already read', async () => {
    const readQuestFacts = vi.fn(facts({ active: ACTIVE }))
    const { pane } = await held({ readQuestFacts })
    await showIt()
    await within(pane()).findByText(t.notes.files(33, 39))
    let finish!: (reply: Reply<QuestFacts>) => void
    readQuestFacts.mockImplementation(() => new Promise(resolve => { finish = resolve }))
    await act(() => void fireEvent.click(within(pane()).getByRole('button', { name: t.detail.refresh })))
    expect((within(pane()).getByRole('button', { name: t.detail.refreshing }) as HTMLButtonElement).disabled).toBe(true)
    expect(within(pane()).getByText(t.notes.files(33, 39))).toBeTruthy()
    await act(async () => finish({ ok: true, data: { ...QUEST_FACTS, active: ACTIVE } }))
    expect(await within(pane()).findByRole('button', { name: t.detail.refresh })).toBeTruthy()
  })

  it('no longer lists task activity, though the step and commits are still read', async () => {
    const readQuestFacts = vi.fn(facts({ active: ACTIVE, activity: {
      step: { id: 'run', at: '2026-11-04T12:00:00Z', finished: null, kind: 'test', subject: 'npm test', status: 'running' },
      commits: [{ id: 'abc1234', at: '2026-11-04T12:03:00Z', message: 'added the activity feed', remotes: ['origin/main'] }], gitUnavailable: false,
    } }))
    const { pane } = await held({ readQuestFacts })
    await showIt()
    await within(pane()).findByText(t.notes.files(33, 39))
    expect(within(pane()).queryByRole('region', { name: 'Task activity' })).toBeNull()
    expect(within(pane()).queryByText('npm test')).toBeNull()
    expect(within(pane()).queryByText('added the activity feed')).toBeNull()
  })

  it('opens from the card', async () => {
    const { pane, engine } = await held()

    await showIt()

    expect(within(pane()).getByRole('heading', { name: 'The quest in hand' })).toBeTruthy()
    await waitFor(() => expect(engine.readQuestFacts).toHaveBeenCalledWith(KEY, 'held'))
  })

  it('shows its time, effort, files and lines', async () => {
    const { pane } = await held()
    await showIt()

    expect(await within(pane()).findByText(t.notes.time('43m', '20 Oct 22:17', '19m'))).toBeTruthy()
    expect(within(pane()).getByText(t.notes.effort(4, 1))).toBeTruthy()
    expect(within(pane()).getByText(t.notes.files(33, 39))).toBeTruthy()
    expect(within(pane()).getByText(t.notes.lines(812, 95, '1649ade'))).toBeTruthy()
  })

  it('shows git, with what isn\'t committed folded', async () => {
    const { pane } = await held()
    await showIt()

    expect(await within(pane()).findByText('7a2ecc7 changed the homepage')).toBeTruthy()
    const list = within(pane()).getByText(t.notes.uncommitted(2)).closest('details') as HTMLDetailsElement
    expect(within(list).getByText('a.md')).toBeTruthy()
  })

  it('counts files it wasn\'t given', async () => {
    const { pane } = await held({ readQuestFacts: facts({ active: { ...ACTIVE!, git: { ...ACTIVE!.git!, uncommitted: ['a.md'], uncommittedCount: 25 } } }) })
    await showIt()

    expect(await within(pane()).findByText(t.flow.more(24))).toBeTruthy()
  })

  it('has no git block without git, and the rest stands', async () => {
    const { pane } = await held({ readQuestFacts: facts({ active: { ...ACTIVE!, git: null, lines: null } }) })
    await showIt()

    await within(pane()).findByText(t.notes.files(33, 39))
    expect(within(pane()).queryByText(t.notes.gitLabel)).toBeNull()
    expect(within(pane()).queryByText(t.notes.linesLabel)).toBeNull()
  })

  it('shows the recipe of the quest in hand with its session, at the depth picked before', async () => {
    const view = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }], canStart: 1, active: activeQuest({ id: 'held', title: 'The quest in hand', priority: 'urgent', difficulty: 'hard', session: { state: 'working', allowance: null } }) })
    const { pane } = await open(view, { readQuestFacts: facts({ active: ACTIVE, recipe: RECIPE }) })
    await showIt()
    const panel = await within(pane()).findByRole('region', { name: t.recipe.label })
    await act(() => void fireEvent.click(within(panel).getByRole('button', { name: t.recipe.details.detailed })))
    cleanup()

    const again = await open(view, { readQuestFacts: facts({ active: ACTIVE, recipe: RECIPE }) })
    await showIt()
    const shown = await within(again.pane()).findByRole('region', { name: t.recipe.label })

    expect(within(shown).getByText(t.recipe.status.brewing)).toBeTruthy()
    expect(within(shown).getByText('Get it testable')).toBeTruthy()
    expect(within(shown).getByText(t.recipe.details.detailed).getAttribute('aria-pressed')).toBe('true')
  })

  it('changes the priority from the pane', async () => {
    const { engine, pane } = await held()
    await showIt()

    await act(() => void fireEvent.click(within(pane()).getByRole('button', { name: t.edit.priorityOf('The quest in hand', t.priority.urgent) })))
    await act(() => void fireEvent.click(screen.getByRole('menuitemradio', { name: new RegExp(t.priority.low) })))

    await waitFor(() => expect(engine.setPriority).toHaveBeenCalledWith(KEY, 'held', 'low'))
  })

  it('measures the lines again every 30 s while it shows, and stops when it goes', async () => {
    const readQuestFacts = vi.fn(facts({ active: ACTIVE }))
    const { pane, workspace } = await open(HELD, { readQuestFacts })
    await showIt()
    await within(pane()).findByText(t.notes.files(33, 39))
    const seen = () => readQuestFacts.mock.calls.filter(call => (call as unknown[])[1] === 'held').length
    const before = seen()

    vi.useFakeTimers()
    await act(async () => workspace.openQuest(KEY, 'first'))
    await act(async () => workspace.openQuest(KEY, 'held'))
    const reopened = seen()
    await act(async () => void vi.advanceTimersByTime(30_000))
    expect(before).toBeGreaterThan(0)
    expect(seen()).toBeGreaterThan(reopened)

    const again = seen()
    await act(async () => workspace.openQuest(KEY, 'first'))
    await act(async () => void vi.advanceTimersByTime(60_000))
    expect(seen()).toBe(again)
  })

  it('goes back to a quest on the board when one is picked', async () => {
    const { pane, workspace } = await held()
    await showIt()

    await act(async () => workspace.openQuest(KEY, 'first'))

    expect(within(pane()).getByRole('heading', { name: 'First quest' })).toBeTruthy()
  })

  it('falls back to the board when the quest in hand has gone', async () => {
    const { pane, workspace } = await held()
    await showIt()

    await act(async () => workspace.adopt(KEY, BOARD))

    expect(within(pane()).getByRole('heading', { name: 'First quest' })).toBeTruthy()
  })
})
