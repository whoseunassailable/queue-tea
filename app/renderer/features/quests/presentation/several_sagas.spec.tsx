// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { BoardEntry, Choices, EngineApi, ProjectView, QuestRow } from '../../../../shared/engine_api'
import { App } from '../../../app/app'
import { t } from '../../../l10n/en'
import { fakeEngine, projectView, quest } from '../../../test_support'
import { createWorkspace } from '../../workspace/state_management/workspace_store'

// Sign in is the same work for users and admins; only the criteria differ.
const KEY = 'a-000001'
const USERS = { id: 'users', title: 'Users' }
const ADMINS = { id: 'admins', title: 'Admins' }
const LOGIN = quest({ id: 'login', title: 'Sign in', parents: [USERS, ADMINS], criteria: ['Tests pass'] })
const sagas = (login: QuestRow): BoardEntry[] => [
  { kind: 'saga', quest: quest({ id: 'users', title: 'Users', isStar: true, why: 'mid' }), chapters: [login], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false, shared: [] },
  { kind: 'saga', quest: quest({ id: 'admins', title: 'Admins' }), chapters: [], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false, shared: [{ id: 'login', title: 'Sign in', listedUnder: 'Users' }] },
]
const CHOICES: Choices = { features: [], lone: [], parents: [{ id: 'guests', title: 'Guests', detail: null }], waitFor: [] }

const open = async (login: QuestRow = LOGIN, over: Partial<EngineApi> = {}) => {
  const view: ProjectView = projectView(KEY, { ready: sagas(login), canStart: 3 })
  // An edit comes back with the board as it was, so the pane stays on the chapter.
  const { engine } = fakeEngine({
    readProject: async () => ({ ok: true, data: view }),
    readChoices: async () => ({ ok: true, data: CHOICES }),
    editQuest: vi.fn(async () => ({ ok: true as const, data: view })),
    ...over,
  })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })
  // The line under Admins opens the chapter.
  fireEvent.click(screen.getByRole('button', { name: t.detail.openActive('Sign in') }))

  return engine
}
const dialog = () => screen.getByRole('dialog')
const ticked = (name: string) => (within(dialog()).getByRole('checkbox', { name }) as HTMLInputElement).checked

beforeEach(() => {
  window.location.hash = '#/quests'
})
afterEach(cleanup)

describe('a chapter under two sagas', () => {
  it('stands under the first, names the other, and the other lists it', async () => {
    await open()

    const row = document.querySelector('.qrow.child:not(.shared)')!
    expect(row.querySelector('.qc-title')?.textContent).toBe('Sign in')
    expect(row.querySelector('.qc-sub')?.textContent).toContain(t.quest.alsoPartOf('Admins'))
    expect(document.querySelector('.qrow.shared .qc-sub')?.textContent).toBe(t.quest.listedUnder('Users'))
    await waitFor(() => expect(document.querySelector('.qrow.child:not(.shared)')?.classList.contains('sel')).toBe(true))
  })

  it('in Part of… starts with both ticked, adds another, or goes on its own', async () => {
    const engine = await open()
    fireEvent.click(screen.getByRole('button', { name: t.actions.partOf }))
    await within(dialog()).findByRole('checkbox', { name: 'Guests' })

    expect([ticked('Users'), ticked('Admins'), ticked('Guests')]).toEqual([true, true, false])
    fireEvent.click(within(dialog()).getByRole('checkbox', { name: 'Guests' }))
    expect(within(dialog()).getByText(t.form.moveLine('Sign in', 'Users, Admins and Guests'))).toBeTruthy()
    fireEvent.click(within(dialog()).getByRole('checkbox', { name: t.form.alone }))
    expect([ticked('Users'), ticked('Admins'), ticked('Guests')]).toEqual([false, false, false])
    expect(within(dialog()).getByText(t.form.aloneLine('Sign in'))).toBeTruthy()
    fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.move }))

    await waitFor(() => expect(engine.moveQuest).toHaveBeenCalledWith(KEY, 'login', []))
  })

  it('in Part of… closes without a move when nothing changed', async () => {
    const engine = await open()
    fireEvent.click(screen.getByRole('button', { name: t.actions.partOf }))
    await within(dialog()).findByRole('checkbox', { name: 'Guests' })

    fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.move }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
    expect(engine.moveQuest).not.toHaveBeenCalled()
  })

  it('in its details, a set for each saga starts from the shared criteria', async () => {
    const engine = await open()

    expect((screen.getByRole('radio', { name: t.form.criteriaOne }) as HTMLInputElement).checked).toBe(true)
    fireEvent.click(screen.getByRole('radio', { name: t.form.criteriaEach }))

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'login', { criteria: [], criteriaByParent: { users: ['Tests pass'], admins: ['Tests pass'] } }))
  })

  it('with a set for each, each saga’s box saves only its own, and one set again keeps every line once', async () => {
    const engine = await open({ ...LOGIN, criteria: [], criteriaByParent: [{ parent: USERS, lines: ['Tests pass'] }, { parent: ADMINS, lines: ['Tests pass', 'Admins see the log'] }] })

    expect(screen.getByRole('heading', { name: t.detail.criteriaFor('Admins') })).toBeTruthy()
    const add = screen.getAllByLabelText(t.actions.addCriterion)
    fireEvent.input(add[0]!, { target: { value: 'Users land on home' } })
    fireEvent.keyDown(add[0]!, { key: 'Enter' })
    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'login', { criteriaByParent: { users: ['Tests pass', 'Users land on home'] } }))

    fireEvent.click(screen.getByRole('radio', { name: t.form.criteriaOne }))
    await waitFor(() => expect(engine.editQuest).toHaveBeenLastCalledWith(KEY, 'login', { criteria: ['Tests pass', 'Admins see the log'], criteriaByParent: null }))
  })
})
