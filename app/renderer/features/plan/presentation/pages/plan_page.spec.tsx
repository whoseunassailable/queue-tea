// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, PlanChanged, ProjectView, Reply } from '../../../../../shared/engine_api'
import type { PlanChange } from '../../../../../shared/plan'
import { App } from '../../../../app/app'
import { t } from '../../../../l10n/en'
import { activeQuest, fakeEngine, projectView, quest } from '../../../../test_support'
import { createWorkspace } from '../../../workspace/state_management/workspace_store'
import { planView } from '../../test_fixtures'

const KEY = 'a-000001'
const p = t.plan
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })

// The realm as the Quests page reads it: the same quests the plan shows.
const VIEW: Partial<Extract<ProjectView, { kind: 'readable' }>> = {
  ready: [{ kind: 'quest', quest: quest({ id: 'invoice', title: 'Send invoices' }) }],
  sealed: [{ kind: 'quest', quest: quest({ id: 'remind', title: 'Payment reminders' }) }],
  activeQuests: [activeQuest({ id: 'login', title: 'Fix login' })],
  canStart: 1,
}

const open = async (hash: string, over: Partial<EngineApi> = {}) => {
  window.location.hash = hash
  const changePlan = vi.fn(async (key: string, _change: PlanChange) => ok<PlanChanged>({ view: projectView(key, VIEW), realm: planView(key).realms[0]!, undo: [] }))
  const { engine } = fakeEngine({ readProject: async key => ok(projectView(key, VIEW)), changePlan, ...over })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })
  await screen.findByRole('heading', { level: 1, name: p.title })

  return { engine, changePlan: (over.changePlan ?? changePlan) as typeof changePlan }
}

const rowOf = (title: string) => screen.getByRole('button', { name: p.row.open(title) }).closest('li') as HTMLElement

afterEach(() => {
  cleanup()
  window.location.hash = ''
})

describe('the backlog', () => {
  it('opens on ⌘9, nested saga, quest and child quest, with its effort points', async () => {
    window.location.hash = '#/home'
    const { engine } = fakeEngine({ readProject: async key => ok(projectView(key, VIEW)) })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })

    await act(() => void fireEvent.keyDown(document.body, { key: '9', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/plan'))
    expect(await screen.findByRole('heading', { level: 1, name: p.title })).toBeTruthy()
    expect(screen.getByRole('link', { name: t.nav.plan }).getAttribute('aria-current')).toBe('page')

    expect(rowOf('Billing saga').className).toContain('d0')
    expect(rowOf('Send invoices').className).toContain('d1')
    expect(rowOf('Invoice PDF').className).toContain('d2')
    expect(screen.queryByRole('button', { name: p.row.open('Write docs') })).toBeNull()
    expect(screen.getByText(p.summary(5, 7, 2))).toBeTruthy()
    expect(within(rowOf('Payment reminders')).getByText(p.row.waitsFor('Send invoices'))).toBeTruthy()
  })

  it('filters by search and saves the view, which reopens as it was saved', async () => {
    const { engine } = await open('#/plan')
    const search = screen.getByRole('searchbox', { name: p.search })

    await act(() => void fireEvent.input(search, { target: { value: 'invoice' } }))
    expect(screen.queryByRole('button', { name: p.row.open('Payment reminders') })).toBeNull()

    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.views.save })))
    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.views.saveIt })))
    expect(screen.getByText(p.views.nameRequired)).toBeTruthy()
    await act(() => void fireEvent.input(screen.getByLabelText(/^View name/), { target: { value: 'Invoicing' } }))
    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.views.saveIt })))
    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ planViews: [expect.objectContaining({ name: 'Invoicing', search: 'invoice' })] }))

    await act(() => void fireEvent.input(search, { target: { value: '' } }))
    expect(screen.getByRole('button', { name: p.row.open('Payment reminders') })).toBeTruthy()
    expect(screen.getByRole('button', { name: p.views.update })).toBeTruthy()

    const views = screen.getByRole('combobox', { name: p.views.open }) as HTMLSelectElement
    const id = [...views.options].find(o => o.text === 'Invoicing')!.value
    await act(() => void fireEvent.change(views, { target: { value: '' } }))
    await act(() => void fireEvent.change(views, { target: { value: id } }))
    expect((screen.getByRole('searchbox', { name: p.search }) as HTMLInputElement).value).toBe('invoice')
    expect(screen.queryByRole('button', { name: p.row.open('Payment reminders') })).toBeNull()
  })

  it('ranks with Alt and an arrow, among the quests beside it', async () => {
    const { changePlan } = await open('#/plan')

    await act(() => void fireEvent.keyDown(screen.getByRole('button', { name: p.row.drag('Payment reminders') }), { key: 'ArrowDown', altKey: true }))

    // Past Fix login: the victory after it stays last.
    await waitFor(() => expect(changePlan).toHaveBeenCalledWith(KEY, { kind: 'rank', id: 'remind', before: 'docs' }))
  })

  it('changes the picked quests together, and asks before archiving them', async () => {
    const { changePlan } = await open('#/plan')

    await act(() => void fireEvent.click(screen.getByRole('checkbox', { name: p.row.pick('Payment reminders') })))
    await act(() => void fireEvent.click(screen.getByRole('checkbox', { name: p.row.pick('Fix login') })))
    const bar = screen.getByRole('region', { name: p.bulk.label })
    expect(within(bar).getByText(p.bulk.picked(2, 'a'))).toBeTruthy()

    await act(() => void fireEvent.change(within(bar).getByLabelText(p.bulk.priority), { target: { value: 'high' } }))
    await waitFor(() => expect(changePlan).toHaveBeenCalledWith(KEY, { kind: 'bulk', ids: ['remind', 'login'], op: { kind: 'priority', priority: 'high' } }))

    await act(() => void fireEvent.click(within(bar).getByRole('button', { name: p.bulk.archive })))
    const dialog = screen.getByRole('dialog', { name: p.bulk.archiveTitle(2) })
    expect(changePlan).not.toHaveBeenCalledWith(KEY, expect.objectContaining({ op: { kind: 'archive' } }))
    await act(() => void fireEvent.click(within(dialog).getByRole('button', { name: p.bulk.archiveYes })))
    await waitFor(() => expect(changePlan).toHaveBeenCalledWith(KEY, { kind: 'bulk', ids: ['remind', 'login'], op: { kind: 'archive' } }))
  })

  it('adds a child quest, checking its title first', async () => {
    const { changePlan } = await open('#/plan')

    await act(() => void fireEvent.click(within(rowOf('Send invoices')).getByRole('button', { name: p.child.add })))
    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.child.addIt })))
    expect(screen.getByText(p.child.required)).toBeTruthy()
    expect(changePlan).not.toHaveBeenCalled()

    await act(() => void fireEvent.input(screen.getByLabelText(/^Child quest title/), { target: { value: 'Reminder emails' } }))
    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.child.addIt })))
    await waitFor(() => expect(changePlan).toHaveBeenCalledWith(KEY, { kind: 'childQuest', parentId: 'invoice', title: 'Reminder emails' }))
  })

  it('sizes a quest in its pane, and shows what it waits for', async () => {
    const { changePlan } = await open('#/plan')

    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.row.open('Payment reminders') })))
    const pane = screen.getByRole('complementary', { name: p.pane.label })
    expect(within(pane).getByRole('button', { name: p.pane.inspect('Send invoices') }).closest('li')?.textContent).toContain(p.link.dependsOn)

    await act(() => void fireEvent.click(within(pane).getByRole('button', { name: '3' })))
    await waitFor(() => expect(changePlan).toHaveBeenCalledWith(KEY, { kind: 'bulk', ids: ['remind'], op: { kind: 'points', points: 3 } }))

    const tag = within(pane).getByLabelText(p.pane.addTag)
    await act(() => void fireEvent.input(tag, { target: { value: 'not a tag!' } }))
    await act(() => void fireEvent.blur(tag))
    expect(within(pane).getByText(p.pane.tagError)).toBeTruthy()

    await act(() => void fireEvent.click(within(pane).getByRole('button', { name: p.pane.addLink })))
    expect(within(pane).getByText(p.pane.linkRequired)).toBeTruthy()

    await act(() => void fireEvent.click(within(pane).getByRole('button', { name: p.pane.inspect('Send invoices') })))
    expect(within(screen.getByRole('complementary', { name: p.pane.label })).getByRole('heading', { name: 'Send invoices' })).toBeTruthy()
  })

  it('says why the record refused a change, in the words it came with', async () => {
    const changePlan = vi.fn(async () => ({ ok: false as const, error: { message: 'Payment reminders can’t be filed under itself.' } }))
    await open('#/plan', { changePlan })

    await act(() => void fireEvent.keyDown(screen.getByRole('button', { name: p.row.drag('Payment reminders') }), { key: 'ArrowDown', altKey: true }))

    expect(await screen.findByText('Payment reminders can’t be filed under itself.')).toBeTruthy()
  })
})

describe('the quest board', () => {
  it('shows the backlog’s statuses as columns, on the Plan tab', async () => {
    await open('#/plan/board')

    expect(screen.getByRole('link', { name: t.nav.plan }).getAttribute('aria-current')).toBe('page')
    expect(within(screen.getByRole('group', { name: p.column(p.status.ready, 2) })).getByRole('button', { name: p.row.open('Send invoices') })).toBeTruthy()
    expect(within(screen.getByRole('group', { name: p.column(p.status.blocked, 1) })).getByRole('button', { name: p.pane.inspect('Send invoices') })).toBeTruthy()
    expect(screen.getByRole('group', { name: p.column(p.status.active, 1) })).toBeTruthy()
    expect(screen.getByRole('group', { name: p.column(p.status.done, 1) })).toBeTruthy()

    await act(() => void fireEvent.click(screen.getByRole('button', { name: p.lanes.saga })))
    expect(screen.getByRole('region', { name: 'Billing saga' })).toBeTruthy()
    expect(screen.getByRole('region', { name: p.noSaga })).toBeTruthy()
  })

  it('refuses a move with what to do, and holds Active to its WIP limit', async () => {
    const { engine } = await open('#/plan/board')

    await act(() => void fireEvent.change(screen.getByLabelText(p.moveTo('Payment reminders')), { target: { value: 'ready' } }))
    expect(await screen.findByText(p.refuse.stillWaits('Payment reminders', 'Send invoices'))).toBeTruthy()

    await act(() => void fireEvent.change(screen.getByLabelText(p.wip), { target: { value: '1' } }))
    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ wipLimits: { [KEY]: 1 } }))
    expect(screen.getByText(p.wipOf(1, 1))).toBeTruthy()

    await act(() => void fireEvent.change(screen.getByLabelText(p.moveTo('Send invoices')), { target: { value: 'active' } }))
    expect(await screen.findByText(p.refuse.wip(1))).toBeTruthy()
    expect(engine.startQuest).not.toHaveBeenCalled()
  })

  it('seals a quest through the same dialog the Quests page uses', async () => {
    await open('#/plan/board')

    await act(() => void fireEvent.change(screen.getByLabelText(p.moveTo('Send invoices')), { target: { value: 'blocked' } }))

    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
})
