// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { BoardEntry, Choices, EngineApi, ProjectView } from '../../../../shared/engine_api'
import { App } from '../../../app/app'
import { t } from '../../../l10n/en'
import { fakeEngine, projectView, quest } from '../../../test_support'
import { createWorkspace } from '../../workspace/state_management/workspace_store'

const KEY = 'a-000001'
const FIRST = quest({ id: 'first', title: 'First quest', isStar: true, why: 'mid', priority: 'mid' })
const SECOND = quest({ id: 'second', title: 'Second quest', priority: 'high' })
const SAGA: BoardEntry = { kind: 'saga', quest: quest({ id: 'saga', title: 'The saga' }), chapters: [quest({ id: 'chapter', title: 'A chapter', parentId: 'saga' })], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false }
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }, SAGA], canStart: 4 })
const CHOICES: Choices = {
  features: [{ id: 'saga', title: 'The saga', detail: '0/1 done' }],
  lone: [{ id: 'second', title: 'Second quest', detail: null }],
  parents: [{ id: 'saga', title: 'The saga', detail: '0/1 done' }],
  waitFor: [{ id: 'second', title: 'Second quest', detail: null }],
}

const open = async (over: Partial<EngineApi> = {}, view: ProjectView = BOARD) => {
  const { engine } = fakeEngine({
    readProject: async () => ({ ok: true, data: view }),
    readChoices: async () => ({ ok: true, data: CHOICES }),
    ...over,
  })
  const workspace = createWorkspace(engine)
  // Inside act, so the page's effects have run and its keys are listening.
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace }
}

const key = (name: string, over: KeyboardEventInit = {}) => fireEvent.keyDown(document.body, { key: name, ...over })
const dialog = () => screen.getByRole('dialog')

beforeEach(() => {
  window.location.hash = '#/quests'
})
afterEach(cleanup)

describe('the priority chip', () => {
  it('opens its five choices and saves the one picked', async () => {
    const { engine } = await open()

    fireEvent.click(screen.getAllByRole('button', { name: t.edit.priorityOf('Second quest', 'High') })[0]!)
    fireEvent.click(screen.getByRole('menuitemradio', { name: /Urgent/ }))

    expect(engine.setPriority).toHaveBeenCalledWith(KEY, 'second', 'urgent')
  })

  it('picking the same priority writes nothing', async () => {
    const { engine } = await open()

    fireEvent.click(screen.getAllByRole('button', { name: t.edit.priorityOf('Second quest', 'High') })[0]!)
    fireEvent.click(screen.getByRole('menuitemradio', { name: /High/ }))

    expect(engine.setPriority).not.toHaveBeenCalled()
  })
})

describe('the keys on the board', () => {
  it('move the selection and act on it', async () => {
    const { engine } = await open()

    key('ArrowDown')
    await waitFor(() => expect(document.querySelector('.qrow.sel .qc-title')?.textContent).toBe('Second quest'))

    key('1')
    expect(engine.setPriority).toHaveBeenCalledWith(KEY, 'second', 'urgent')

    key('f')
    expect(engine.togglePlayNext).toHaveBeenCalledWith(KEY, 'second')
  })

  it('x removes a plain quest at once, with Undo offered', async () => {
    const { engine } = await open()

    key('x')

    expect(engine.removeQuest).toHaveBeenCalledWith(KEY, 'first')
    await waitFor(() => expect(screen.getByRole('button', { name: t.edit.undo })).toBeTruthy())
  })

  it('⌘Z undoes the last edit', async () => {
    const { engine } = await open()
    key('x')
    await waitFor(() => expect(screen.getByRole('button', { name: t.edit.undo })).toBeTruthy())

    key('z', { metaKey: true })

    await waitFor(() => expect(engine.restoreQuest).toHaveBeenCalledWith(KEY, 'first'))
  })

  it('letters type normally inside a text field', async () => {
    const { engine } = await open()
    const box = screen.getByRole('textbox', { name: t.actions.addCriterion })

    fireEvent.keyDown(box, { key: 'x' })
    fireEvent.keyDown(box, { key: '1' })

    expect(engine.removeQuest).not.toHaveBeenCalled()
    expect(engine.setPriority).not.toHaveBeenCalled()
  })

  it('stay out of the way while a sheet is open', async () => {
    const { engine } = await open()
    key('k')
    await waitFor(() => expect(dialog()).toBeTruthy())

    key('x')

    expect(engine.removeQuest).not.toHaveBeenCalled()
  })
})

describe('sagas', () => {
  it('fold, and the fold survives in the settings', async () => {
    const { engine } = await open()

    fireEvent.click(screen.getByRole('button', { name: t.actions.fold('The saga') }))

    await waitFor(() => expect(screen.queryByText('A chapter')).toBe(null))
    expect(engine.saveSettings).toHaveBeenCalledWith({ folds: { [KEY]: ['saga'] } })
  })

  it('a folded saga holding the ★ still shows it', async () => {
    const star = quest({ id: 'star', title: 'Star chapter', isStar: true, why: 'urgent', parentId: 'saga' })
    const view = projectView(KEY, { canStart: 1, ready: [{ ...SAGA, chapters: [star], hasStar: true } as BoardEntry] })
    await open({ readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: { [KEY]: ['saga'] }, terminal: 'terminal' } }) }, view)

    expect(document.querySelector('.qrow .qc-title')?.textContent).toBe('The saga')
    expect(screen.getByText('★ Star chapter · urgent')).toBeTruthy()
  })

  it('take a chapter inline, which counts as the pick', async () => {
    const { engine } = await open()

    fireEvent.click(screen.getByRole('button', { name: t.actions.addChapter }))
    const box = screen.getByLabelText(t.form.chapterHint('The saga'))
    fireEvent.input(box, { target: { value: 'One more' } })
    fireEvent.keyDown(box, { key: 'Enter' })

    await waitFor(() => expect(engine.fileQuest).toHaveBeenCalled())
    expect(engine.fileQuest).toHaveBeenCalledWith(KEY, expect.objectContaining({ title: 'One more', parent: { kind: 'task', id: 'saga' } }))
  })

  it('a blank chapter says what is wrong and files nothing', async () => {
    const { engine } = await open()

    fireEvent.click(screen.getByRole('button', { name: t.actions.addChapter }))
    fireEvent.keyDown(screen.getByLabelText(t.form.chapterHint('The saga')), { key: 'Enter' })

    await waitFor(() => expect(screen.getByText(t.form.titleRequired)).toBeTruthy())
    expect(engine.fileQuest).not.toHaveBeenCalled()
  })
})

describe('New quest', () => {
  const openSheet = async (over: Partial<EngineApi> = {}, view: ProjectView = BOARD) => {
    const opened = await open(over, view)
    fireEvent.click(screen.getAllByRole('button', { name: t.actions.newQuest })[0]!)
    await waitFor(() => expect(within(dialog()).getByLabelText(`${t.form.title} *`)).toBeTruthy())

    return opened
  }
  const title = () => within(dialog()).getByLabelText(`${t.form.title} *`)
  const submit = () => fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.add }))

  it('opens with ⌘N too', async () => {
    await open()

    key('n', { metaKey: true })

    await waitFor(() => expect(dialog()).toBeTruthy())
  })

  it('shows a required title as soon as the field is left', async () => {
    await openSheet()

    fireEvent.blur(title())

    await waitFor(() => expect(within(dialog()).getByText(t.form.titleRequired)).toBeTruthy())
    expect(title().getAttribute('aria-invalid')).toBe('true')
  })

  it('leaves the button enabled, and pressing it shows every error and saves nothing', async () => {
    const { engine } = await openSheet({}, projectView(KEY, { activeSaga: 'The saga', activeSagaId: 'saga' }))
    const button = within(dialog()).getByRole('button', { name: t.actions.add }) as HTMLButtonElement

    expect(button.disabled).toBe(false)
    submit()

    await waitFor(() => expect(within(dialog()).getByText(t.form.titleRequired)).toBeTruthy())
    expect(within(dialog()).getByText(t.form.pickPart)).toBeTruthy()
    expect(engine.fileQuest).not.toHaveBeenCalled()
  })

  it('with an active saga, waits for Part of to be answered', async () => {
    const { engine } = await openSheet({}, projectView(KEY, { activeSaga: 'The saga', activeSagaId: 'saga' }))
    fireEvent.input(title(), { target: { value: 'New one' } })

    submit()
    await waitFor(() => expect(within(dialog()).getByText(t.form.pickPart)).toBeTruthy())
    expect(engine.fileQuest).not.toHaveBeenCalled()

    fireEvent.click(within(dialog()).getByRole('radio', { name: /The saga/ }))
    submit()
    await waitFor(() => expect(engine.fileQuest).toHaveBeenCalledWith(KEY, expect.objectContaining({ parent: { kind: 'task', id: 'saga' } })))
  })

  it('New saga makes its title required', async () => {
    const { engine } = await openSheet()
    fireEvent.input(title(), { target: { value: 'New one' } })
    fireEvent.click(within(dialog()).getByRole('radio', { name: t.form.newSaga }))

    submit()

    await waitFor(() => expect(within(dialog()).getByText(t.form.sagaRequired)).toBeTruthy())
    expect(engine.fileQuest).not.toHaveBeenCalled()
  })

  it('files the quest, closes, and says so', async () => {
    const { engine } = await openSheet()
    fireEvent.input(title(), { target: { value: 'New one' } })

    submit()

    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
    expect(engine.fileQuest).toHaveBeenCalledWith(KEY, expect.objectContaining({ title: 'New one', priority: 'mid', difficulty: 'medium', parent: { kind: 'none' } }))
    expect(screen.getByText(t.edit.queued('New one', 'Mid', null))).toBeTruthy()
  })

  it('stays open and shows the failure when the save fails', async () => {
    await openSheet({ fileQuest: async () => ({ ok: false, error: { message: 'That saga is no longer open. Pick again.' } }) })
    fireEvent.input(title(), { target: { value: 'New one' } })

    submit()

    await waitFor(() => expect(within(dialog()).getByRole('alert').textContent).toContain('That saga is no longer open.'))
    expect((title() as HTMLInputElement).value).toBe('New one')
  })

  it('shows a loading line, then a way back, when the choices fail', async () => {
    await openSheet({ readChoices: async () => ({ ok: false, error: { message: 'Could not read.' } }) })

    expect(within(dialog()).getByRole('alert').textContent).toContain('Could not read.')
  })

  it('Esc cancels', async () => {
    await openSheet()

    key('Escape')

    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
  })
})

describe('Seal…', () => {
  const openSeal = async (over: Partial<EngineApi> = {}) => {
    const opened = await open(over)
    fireEvent.click(screen.getByRole('button', { name: t.actions.seal }))
    await waitFor(() => expect(within(dialog()).getByText(t.form.sealAsk('First quest'))).toBeTruthy())

    return opened
  }
  const submit = () => fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.sealIt }))

  it('lists only what it may wait for, and seals with the pick', async () => {
    const { engine } = await openSeal()

    fireEvent.click(await within(dialog()).findByRole('radio', { name: 'Second quest' }))
    submit()

    await waitFor(() => expect(engine.sealQuest).toHaveBeenCalledWith(KEY, 'first', { waitFor: 'second' }))
    expect(within(document.body).queryAllByRole('radio', { name: 'The saga' })).toEqual([])
  })

  it('seals with a reason', async () => {
    const { engine } = await openSeal()

    fireEvent.input(within(dialog()).getByLabelText(t.form.reason), { target: { value: 'waiting for the clinic' } })
    submit()

    await waitFor(() => expect(engine.sealQuest).toHaveBeenCalledWith(KEY, 'first', { reason: 'waiting for the clinic' }))
  })

  it('wants one or the other', async () => {
    const { engine } = await openSeal()

    submit()

    await waitFor(() => expect(within(dialog()).getByText(t.form.sealRequired)).toBeTruthy())
    expect(engine.sealQuest).not.toHaveBeenCalled()
  })

  it('a filter with no match says what to try', async () => {
    await openSeal()

    fireEvent.input(await within(dialog()).findByLabelText(t.form.filter), { target: { value: 'zzz' } })

    await waitFor(() => expect(within(dialog()).getByText(t.form.noFilterMatch)).toBeTruthy())
  })

  it('Unseal shows on a sealed quest', async () => {
    const view = projectView(KEY, { sealedCount: 1, sealed: [{ kind: 'quest', quest: quest({ id: 's', title: 'Stuck', sealedBecause: 'later' }) }] })
    const { engine } = await open({}, view)

    fireEvent.click(screen.getByRole('button', { name: t.actions.unseal }))

    expect(engine.unsealQuest).toHaveBeenCalledWith(KEY, 's')
  })
})

describe('Part of…', () => {
  const openMove = async (over: Partial<EngineApi> = {}) => {
    const opened = await open(over)
    fireEvent.click(screen.getByRole('button', { name: t.actions.partOf }))
    await within(dialog()).findByRole('radio', { name: /The saga/ })

    return opened
  }
  const submit = () => fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.move }))

  it('asks first, saying what stays the same', async () => {
    const { engine } = await openMove()

    fireEvent.click(within(dialog()).getByRole('radio', { name: /The saga/ }))

    await waitFor(() => expect(within(dialog()).getByText(t.form.moveLine('First quest', 'The saga'))).toBeTruthy())
    expect(engine.moveQuest).not.toHaveBeenCalled()

    submit()
    await waitFor(() => expect(engine.moveQuest).toHaveBeenCalledWith(KEY, 'first', 'saga'))
  })

  it('wants a pick', async () => {
    const { engine } = await openMove()

    submit()

    await waitFor(() => expect(within(dialog()).getByText(t.form.pickMove)).toBeTruthy())
    expect(engine.moveQuest).not.toHaveBeenCalled()
  })

  it('a refused move shows the sentence and stays open', async () => {
    await openMove({ moveQuest: async () => ({ ok: false, error: { message: "First quest has chapters of its own, so it can't be part of another saga." } }) })

    fireEvent.click(within(dialog()).getByRole('radio', { name: /The saga/ }))
    submit()

    await waitFor(() => expect(within(dialog()).getByText("First quest has chapters of its own, so it can't be part of another saga.")).toBeTruthy())
  })
})

describe('Remove…', () => {
  it('a saga asks first, saying what happens to its chapters', async () => {
    const { engine } = await open()
    fireEvent.click(screen.getByText('The saga'))
    await waitFor(() => expect(document.querySelector('.detail .title-btn')?.textContent).toBe('The saga'))

    fireEvent.click(screen.getByRole('button', { name: t.actions.remove }))

    await waitFor(() => expect(within(dialog()).getByText(t.form.removeLine(1))).toBeTruthy())
    expect(engine.removeQuest).not.toHaveBeenCalled()

    fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.removeIt }))
    await waitFor(() => expect(engine.removeQuest).toHaveBeenCalledWith(KEY, 'saga'))
  })
})

describe('the detail pane', () => {
  it('changes the title on click, and refuses a blank one', async () => {
    const { engine } = await open()

    fireEvent.click(screen.getByRole('button', { name: t.actions.editTitle('First quest') }))
    const box = within(document.querySelector('.detail') as HTMLElement).getByLabelText(`${t.form.title} *`)
    fireEvent.input(box, { target: { value: '   ' } })
    fireEvent.blur(box)
    await waitFor(() => expect(screen.getByText(t.form.titleRequired)).toBeTruthy())
    expect(engine.editQuest).not.toHaveBeenCalled()

    fireEvent.input(box, { target: { value: 'Better title' } })
    fireEvent.keyDown(box, { key: 'Enter' })
    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { title: 'Better title' }))
  })

  it('a change on disk leaves a description being typed alone', async () => {
    let title = 'First quest'
    const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: projectView(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: { ...FIRST, title } }] }) }) })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })
    const box = screen.getByRole('textbox', { name: t.detail.description }) as HTMLTextAreaElement
    fireEvent.input(box, { target: { value: 'Half a thought' } })

    title = 'Renamed in a session'
    await act(() => workspace.refresh())

    expect(screen.getByRole('button', { name: t.actions.editTitle('Renamed in a session') })).toBeTruthy()
    expect((screen.getByRole('textbox', { name: t.detail.description }) as HTMLTextAreaElement).value).toBe('Half a thought')
  })

  it('saves the description when the field is left', async () => {
    const { engine } = await open()
    const box = screen.getByRole('textbox', { name: t.detail.description })

    fireEvent.input(box, { target: { value: 'Why it matters' } })
    fireEvent.blur(box)

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: 'Why it matters' }))
  })

  it('adds and removes a criterion', async () => {
    const view = projectView(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: { ...FIRST, criteria: ['Old one'] } }] })
    const { engine } = await open({ editQuest: vi.fn(async () => ({ ok: true as const, data: view })) }, view)
    const box = screen.getByRole('textbox', { name: t.actions.addCriterion })

    fireEvent.input(box, { target: { value: 'New one' } })
    fireEvent.keyDown(box, { key: 'Enter' })
    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { criteria: ['Old one', 'New one'] }))

    fireEvent.click(screen.getByRole('button', { name: t.actions.removeCriterion('Old one') }))
    await waitFor(() => expect(engine.editQuest).toHaveBeenLastCalledWith(KEY, 'first', { criteria: [] }))
  })

  it('makes a quest the active saga and turns it off', async () => {
    const { engine } = await open()
    fireEvent.click(screen.getByRole('button', { name: t.actions.makeSaga }))
    expect(engine.setActiveSaga).toHaveBeenCalledWith(KEY, 'first')
    cleanup()

    const again = await open({}, projectView(KEY, { canStart: 1, activeSaga: 'First quest', activeSagaId: 'first', ready: [{ kind: 'quest', quest: FIRST }] }))
    fireEvent.click(screen.getByRole('button', { name: t.actions.sagaOff }))
    expect(again.engine.setActiveSaga).toHaveBeenCalledWith(KEY, null)
  })

  it('no button reads Commit, Push, Merge or Pull, with the sheets open too', async () => {
    await open()
    fireEvent.click(screen.getAllByRole('button', { name: t.actions.newQuest })[0]!)
    await waitFor(() => expect(dialog()).toBeTruthy())

    const words = [...document.querySelectorAll('button, a')].map(el => (el.textContent ?? '').toLowerCase())

    expect(words.filter(word => /\b(commit|push|merge|pull)\b/.test(word))).toEqual([])
  })
})
