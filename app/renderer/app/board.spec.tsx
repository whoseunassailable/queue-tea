// @vitest-environment jsdom
import { act, cleanup, createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { BoardEntry, EngineApi, LiveFacts, ProjectView, Reply } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { activeQuest, fakeEngine, projectView, quest } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const FIRST = quest({ id: 'first', title: 'First quest', isStar: true, why: 'mid', priority: 'high' })
const SECOND = quest({ id: 'second', title: 'Second quest', branch: 'task/needle', priority: 'low' })
const SAGA: BoardEntry = { kind: 'saga', quest: quest({ id: 'saga', title: 'The saga' }), chapters: [quest({ id: 'hay', title: 'Hay', parentId: 'saga' }), quest({ id: 'pin', title: 'Pin', parentId: 'saga' })], progress: { done: 0, total: 2, current: 0, blocked: 0 }, hasStar: false }
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }, SAGA], canStart: 5 })

const open = async (route: string, view: ProjectView = BOARD, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  const { engine, fire } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, fire }
}

const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))
const key = (name: string, over: KeyboardEventInit = {}) => act(() => void fireEvent.keyDown(document.body, { key: name, ...over }))
const search = (text: string) => act(() => void fireEvent.input(screen.getByRole('searchbox', { name: t.filters.search }), { target: { value: text } }))
const titles = () => [...document.querySelectorAll('.board-list .qc-title')].map(el => el.textContent)
const live = (over: Partial<LiveFacts>): (() => Promise<Reply<LiveFacts>>) => async () => ({ ok: true, data: { drift: [], mismatch: null, warning: null, ...over } })

afterEach(cleanup)

describe('search on the board', () => {
  it('narrows the board as you type', async () => {
    await open('/quests')

    await search('second')

    expect(titles()).toEqual(['Second quest'])
  })

  it('finds a quest by its branch', async () => {
    await open('/quests')

    await search('needle')

    expect(titles()).toEqual(['Second quest'])
  })

  it('marks what matched', async () => {
    await open('/quests')

    await search('sec')

    expect(document.querySelector('.board-list mark')?.textContent).toBe('Sec')
  })

  it('keeps a saga for a chapter that matches, and unfolds it', async () => {
    await open('/quests', BOARD, { readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: { [KEY]: ['saga'] }, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true } }) })
    expect(titles()).not.toContain('Pin')

    await search('pin')

    expect(titles()).toEqual(['The saga', 'Pin'])
  })

  it('still counts all of a saga\'s chapters in its detail', async () => {
    const { workspace } = await open('/quests')
    await act(async () => workspace.openQuest(KEY, 'saga'))

    await search('pin')

    expect(screen.getByRole('heading', { name: t.detail.chapters(2) })).toBeTruthy()
  })

  it('still counts all of a saga\'s chapters when removing it', async () => {
    const { workspace } = await open('/quests')
    await act(async () => workspace.openQuest(KEY, 'saga'))
    await search('pin')

    await press(t.actions.remove)

    expect(within(await screen.findByRole('dialog')).getByText(t.form.removeLine(2))).toBeTruthy()
  })

  it('says when nothing matches, and clears', async () => {
    await open('/quests')

    await search('zebra')

    expect(screen.getByText(t.filters.noMatch('zebra'))).toBeTruthy()
    await press(t.filters.clearSearch)
    expect(titles()).toContain('First quest')
  })

  it('Esc in the box clears it', async () => {
    await open('/quests')
    await search('second')

    await act(() => void fireEvent.keyDown(screen.getByRole('searchbox', { name: t.filters.search }), { key: 'Escape' }))

    expect(titles()).toContain('First quest')
  })

  it('⌘F goes to the box', async () => {
    await open('/quests')

    await key('f', { metaKey: true })

    expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: t.filters.search }))
  })

  it('moves the keys on to what\'s left', async () => {
    const { engine } = await open('/quests')
    await search('second')
    ;(document.activeElement as HTMLElement | null)?.blur()

    await key('s')

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'))
  })

  it('each realm keeps its own search', async () => {
    const { workspace } = await open('/quests')
    await search('second')

    await act(async () => workspace.pick('b-000002'))
    await act(async () => workspace.pick(KEY))

    expect((screen.getByRole('searchbox', { name: t.filters.search }) as HTMLInputElement).value).toBe('second')
  })
})

describe('filters', () => {
  it('filters by priority, and clears', async () => {
    await open('/quests')

    await press(t.filters.title)
    await act(() => void fireEvent.click(within(screen.getByRole('group', { name: t.filters.title })).getByRole('checkbox', { name: t.priority.low })))

    expect(titles()).toEqual(['Second quest'])
    await press(t.filters.clearAll)
    expect(titles()).toContain('First quest')
  })

  it('keeps to a section', async () => {
    await open('/quests')

    await press(t.filters.title)
    await act(() => void fireEvent.click(screen.getByRole('checkbox', { name: t.filters.sections.sealed })))

    expect(document.querySelector('.board-list')).toBeNull()
  })

  it('offers Fits Time I have only with a time set', async () => {
    await open('/quests')
    await press(t.filters.title)
    expect(screen.queryByRole('checkbox', { name: t.filters.fitsTime })).toBeNull()

    cleanup()
    await open('/quests', { ...(BOARD as Extract<ProjectView, { kind: 'readable' }>), budget: 60 })
    await press(t.filters.title)
    expect(screen.getByRole('checkbox', { name: t.filters.fitsTime })).toBeTruthy()
  })
})

describe('Time I have', () => {
  it('steps through its choices from the board', async () => {
    const { engine } = await open('/quests')

    await press(t.board.timeLabel('any'))

    await waitFor(() => expect(engine.setTimeBudget).toHaveBeenCalledWith(KEY, 30))
  })

  it('takes the board main hands back', async () => {
    const short = projectView(KEY, { budget: 30, ready: [{ kind: 'quest', quest: { ...SECOND, isStar: true } }], canStart: 1 })
    await open('/quests', BOARD, { setTimeBudget: async () => ({ ok: true, data: short }) })

    await press(t.board.timeLabel('any'))

    await waitFor(() => expect(titles()).toEqual(['Second quest']))
    expect(screen.getByRole('button', { name: t.board.timeLabel('30m') })).toBeTruthy()
  })

  it('t steps it', async () => {
    const { engine } = await open('/quests')

    await key('t')

    await waitFor(() => expect(engine.setTimeBudget).toHaveBeenCalledWith(KEY, 30))
  })

  it('shows on Home too', async () => {
    const { engine } = await open('/home')

    await key('t')

    await waitFor(() => expect(engine.setTimeBudget).toHaveBeenCalled())
  })

  it('says when it could not change', async () => {
    await open('/quests', BOARD, { setTimeBudget: async () => ({ ok: false, error: { message: "Couldn't change Time I have." } }) })

    await press(t.board.timeLabel('any'))

    expect(await screen.findByText("Couldn't change Time I have.")).toBeTruthy()
  })
})

describe('dragging a quest', () => {
  const row = (title: string) => within(document.querySelector('.board-list') as HTMLElement).getByText(title).closest('.qrow') as HTMLElement

  const drag = async (from: string, to: string) => {
    await act(() => void fireEvent.dragStart(row(from)))
    await act(() => void fireEvent.dragOver(row(to)))
    await act(() => void fireEvent.drop(row(to)))
  }

  it('shows where it would land', async () => {
    await open('/quests')

    await act(() => void fireEvent.dragStart(row('First quest')))
    await act(() => void fireEvent.dragOver(row('The saga')))

    expect(row('The saga').className).toContain('drop')
  })

  it('allows a drop only on another row', async () => {
    await open('/quests')
    await act(() => void fireEvent.dragStart(row('First quest')))

    const other = createEvent.dragOver(row('The saga'))
    const same = createEvent.dragOver(row('First quest'))
    await act(() => void fireEvent(row('The saga'), other))
    await act(() => void fireEvent(row('First quest'), same))

    expect(other.defaultPrevented).toBe(true)
    expect(same.defaultPrevented).toBe(false)
  })

  it('asks first, with the saga already picked', async () => {
    const { engine } = await open('/quests')

    await drag('First quest', 'The saga')

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(t.form.moveLine('First quest', 'The saga'))).toBeTruthy()
    expect(engine.moveQuest).not.toHaveBeenCalled()
  })

  it('moves it once you say so', async () => {
    const { engine } = await open('/quests')
    await drag('First quest', 'The saga')
    await screen.findByRole('dialog')

    await press(t.actions.move)

    await waitFor(() => expect(engine.moveQuest).toHaveBeenCalledWith(KEY, 'first', 'saga'))
  })

  it('shows a refusal and moves nothing', async () => {
    await open('/quests', BOARD, { moveQuest: async () => ({ ok: false, error: { message: 'Hay is part of a saga, so its chapters go under that.' } }) })
    await drag('First quest', 'Hay')
    await screen.findByRole('dialog')

    await press(t.actions.move)

    expect(await screen.findByText('Hay is part of a saga, so its chapters go under that.')).toBeTruthy()
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('does nothing dropped on itself', async () => {
    await open('/quests')

    await drag('First quest', 'First quest')

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('forgets the drag when it ends elsewhere', async () => {
    await open('/quests')
    await act(() => void fireEvent.dragStart(row('First quest')))
    await act(() => void fireEvent.dragOver(row('The saga')))

    await act(() => void fireEvent.dragEnd(row('First quest')))

    expect(row('The saga').className).not.toContain('drop')
  })
})

describe('filling a quest in from its checkpoint', () => {
  const FILLED = quest({ id: 'first', title: 'First quest', isStar: true, goal: 'Fix the docs site', acceptance: ['Docs build', 'Links work'] })
  const view = projectView(KEY, { ready: [{ kind: 'quest', quest: FILLED }], canStart: 1 })

  it('fills the description from the goal', async () => {
    const { engine } = await open('/quests', view)

    await press(t.detail.useGoal)

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: 'Fix the docs site' }))
  })

  it('fills the criteria from the acceptance criteria', async () => {
    const { engine } = await open('/quests', view)

    await press(t.detail.useAcceptance(2))

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { criteria: ['Docs build', 'Links work'] }))
  })

  it('offers neither once they are filled', async () => {
    const done = quest({ ...FILLED, description: 'Mine', criteria: ['Mine'] })
    await open('/quests', projectView(KEY, { ready: [{ kind: 'quest', quest: done }], canStart: 1 }))

    expect(screen.queryByRole('button', { name: t.detail.useGoal })).toBeNull()
    expect(screen.queryByRole('button', { name: t.detail.useAcceptance(2) })).toBeNull()
  })

  it('offers neither with no checkpoint', async () => {
    await open('/quests')

    expect(screen.queryByRole('button', { name: t.detail.useGoal })).toBeNull()
  })
})

describe('Home\'s live lines', () => {
  const held = projectView(KEY, { active: activeQuest() })

  it('shows drift under the card', async () => {
    await open('/home', held, { readLive: live({ drift: ['The branch task/x is gone.'] }) })

    expect(await screen.findByText('The branch task/x is gone.', { exact: false })).toBeTruthy()
  })

  it('shows the branch mismatch with Switch', async () => {
    const { engine } = await open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: null } }) })

    await screen.findByText(t.live.mismatch('main', 'task/x'))
    await press(t.live.switch)

    await waitFor(() => expect(engine.switchBranch).toHaveBeenCalledWith(KEY))
  })

  it('w switches', async () => {
    const { engine } = await open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: null } }) })
    await screen.findByText(t.live.mismatch('main', 'task/x'))

    await key('w')

    await waitFor(() => expect(engine.switchBranch).toHaveBeenCalled())
  })

  it('offers no Switch with work uncommitted, and says what to do', async () => {
    await open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: '2 files not committed' } }) })

    expect(await screen.findByText(t.live.mismatchHeld('main', 'task/x'))).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.live.switch })).toBeNull()
  })

  it('says a refused switch out loud', async () => {
    await open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: null } }), switchBranch: async () => ({ ok: false, error: { message: '1 file not committed: commit or stash first, then Switch.' } }) })
    await screen.findByText(t.live.mismatch('main', 'task/x'))

    await press(t.live.switch)

    expect(await screen.findByText('1 file not committed: commit or stash first, then Switch.')).toBeTruthy()
  })

  it('shows the commit warning, and OK dismisses it', async () => {
    await open('/home', held, { readLive: live({ warning: 'During the last turn a commit appeared.' }) })

    expect(await screen.findByText('During the last turn a commit appeared.')).toBeTruthy()
    await press(t.actions.ok)

    expect(screen.queryByText('During the last turn a commit appeared.')).toBeNull()
  })

  it('o dismisses it, and a new warning still shows', async () => {
    const readLive = vi.fn(live({ warning: 'First warning.' }))
    const { fire } = await open('/home', held, { readLive })
    await screen.findByText('First warning.')

    await key('o')
    expect(screen.queryByText('First warning.')).toBeNull()

    readLive.mockImplementation(live({ warning: 'Second warning.' }))
    await act(async () => fire())
    expect(await screen.findByText('Second warning.')).toBeTruthy()
  })

  it('shows the warning with no quest active', async () => {
    await open('/home', projectView(KEY), { readLive: live({ warning: 'A commit appeared.' }) })

    expect(await screen.findByText('A commit appeared.')).toBeTruthy()
  })

  it('leaves the card alone when git can\'t be read', async () => {
    await open('/home', held, { readLive: async () => ({ ok: false, error: { message: "Couldn't check git for the active quest." } }) })

    expect(screen.getByRole('button', { name: t.actions.finish })).toBeTruthy()
    expect(await screen.findByText("Couldn't check git for the active quest.")).toBeTruthy()
  })
})
