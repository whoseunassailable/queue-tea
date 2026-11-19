// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import type { CanvasNode, CanvasView, NoteCanvas } from '../../../../../shared/note_canvas'
import { App } from '../../../../app/app'
import { CANVAS_STEP_PX } from '../../../../core/constants/constants'
import { t } from '../../../../l10n/en'
import { fakeEngine, note, projectView, quest } from '../../../../test_support'
import { createWorkspace } from '../../../workspace/state_management/workspace_store'

const KEY = 'a-000001'
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })
const c = t.notebook.canvas
const NOTES = [note({ id: 'n-a', title: 'Alpha', folder: 'Ideas', body: 'The first idea,\n\nin two lines.' }), note({ id: 'n-b', title: 'Beta', folder: 'Ideas' })]
const card = (id: string, over: Partial<CanvasNode> = {}): CanvasNode => ({ id, type: 'file', file: 'n-a.md', x: 0, y: 0, width: 280, height: 160, ...over })
const BOARD: NoteCanvas = { nodes: [card('a'), card('b', { file: 'n-b.md', x: 400 })], edges: [{ id: 'ab', fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left' }] }

const open = async (canvas: NoteCanvas = BOARD, over: Partial<EngineApi> = {}) => {
  window.location.hash = '#/notes'
  const { engine } = fakeEngine({
    readNotes: async () => ok({ notes: NOTES, unreadable: [], folder: '/n' }),
    readProject: async key => ok(projectView(key, { ready: [{ kind: 'quest', quest: quest({ id: 't-1', title: 'Write the parser' }) }] })),
    readCanvas: vi.fn(async () => ok<CanvasView>({ canvas, stamp: 'c-1' })),
    ...over,
  })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })
  await screen.findByDisplayValue('Alpha')
  await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.open })))

  return engine
}

const board = () => screen.findByRole('region', { name: /^Canvas: / })
const cardNamed = (name: string) => screen.getByRole('group', { name })
// What the board saved last, once the autosave has run.
const saved = async (engine: EngineApi): Promise<NoteCanvas> => {
  await waitFor(() => expect(engine.saveCanvas).toHaveBeenCalled(), { timeout: 2000 })

  return vi.mocked(engine.saveCanvas).mock.calls.at(-1)![1]
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('the canvas', () => {
  it('opens from the list, shows its cards and lines, and a picked note goes back to the editor', async () => {
    await open()

    expect((await board()).getAttribute('aria-label')).toBe(c.board(2, 1))
    expect(within(cardNamed(c.noteCard('Alpha'))).getByText('The first idea, in two lines.')).toBeTruthy()
    expect(screen.getByRole('button', { name: c.line(c.noteCard('Alpha'), c.noteCard('Beta')) })).toBeTruthy()
    expect(screen.getByRole('button', { name: c.open }).getAttribute('aria-pressed')).toBe('true')

    await act(async () => void fireEvent.click(within(cardNamed(c.noteCard('Beta'))).getByRole('button', { name: c.openNote('Beta') })))
    expect(await screen.findByDisplayValue('Beta')).toBeTruthy()
    expect(screen.queryByRole('region', { name: /^Canvas: / })).toBeNull()
  })

  it('says it is reading, then that a failed read went wrong, and reads again', async () => {
    let answer: (reply: Reply<CanvasView>) => void = () => {}
    const readCanvas = vi.fn(() => new Promise<Reply<CanvasView>>(done => (answer = done)))
    await open(BOARD, { readCanvas })

    expect(screen.getByText(c.reading).closest('[role="status"]')).toBeTruthy()
    await act(async () => answer({ ok: false, error: { message: "Canvas.canvas isn't a canvas Queue-tea can read." } }))
    expect((await screen.findByRole('alert')).textContent).toContain("Canvas.canvas isn't a canvas Queue-tea can read.")

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.failed.tryAgain })))
    await act(async () => answer(ok({ canvas: { nodes: [], edges: [] }, stamp: null })))
    expect(await screen.findByText(c.empty)).toBeTruthy()
  })

  it('adds a note or a quest in play from one list, and the quest card shows its live state', async () => {
    const engine = await open({ nodes: [], edges: [] })
    await board()

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.addCard })))
    const dialog = screen.getByRole('dialog', { name: c.addCardTitle })
    fireEvent.input(within(dialog).getByLabelText(c.find), { target: { value: 'pars' } })
    await act(async () => void fireEvent.click(within(dialog).getByRole('button', { name: t.notebook.pickQuest('Write the parser', t.notebook.questStateSaid.waiting) })))
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.addCard })))
    fireEvent.input(within(screen.getByRole('dialog')).getByLabelText(c.find), { target: { value: 'nothing like it' } })
    expect(within(screen.getByRole('dialog')).getByText(c.noMatch('nothing like it'))).toBeTruthy()
    fireEvent.input(within(screen.getByRole('dialog')).getByLabelText(c.find), { target: { value: 'alp' } })
    await act(async () => void fireEvent.submit(within(screen.getByRole('dialog')).getByLabelText(c.find).closest('form')!))

    const quest = cardNamed(c.questCard('Write the parser'))
    expect(within(quest).getByText(t.notebook.questState.waiting)).toBeTruthy()
    expect(cardNamed(c.noteCard('Alpha'))).toBeTruthy()
    expect((await saved(engine)).nodes.map(({ type, text, file }) => ({ type, text, file }))).toEqual([
      { type: 'text', text: '[[quest:t-1|Write the parser]]', file: undefined },
      { type: 'file', text: undefined, file: 'n-a.md' },
    ])
    expect(vi.mocked(engine.saveCanvas).mock.calls.at(-1)![2]).toBe('c-1')
  })

  it('checks a web link under its field on blur and on Add, then adds it as a link card', async () => {
    const engine = await open({ nodes: [], edges: [] })
    await board()
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.addLink })))
    const dialog = screen.getByRole('dialog', { name: c.addLinkTitle })
    const field = within(dialog).getByLabelText(`${c.webLink} *`)

    await act(async () => void fireEvent.click(within(dialog).getByRole('button', { name: c.add })))
    expect(within(dialog).getByText(c.linkRequired)).toBeTruthy()
    fireEvent.input(field, { target: { value: 'example.com' } })
    fireEvent.blur(field)
    expect(within(dialog).getByText(c.linkBad)).toBeTruthy()
    fireEvent.input(field, { target: { value: ' https://example.com/post ' } })
    await act(async () => void fireEvent.click(within(dialog).getByRole('button', { name: c.add })))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(await within(cardNamed(c.linkCard('example.com'))).findByText('Example page')).toBeTruthy()
    expect((await saved(engine)).nodes[0]).toMatchObject({ type: 'link', url: 'https://example.com/post' })
  })

  it('moves, resizes and removes a card from the keyboard, and its lines go with it', async () => {
    const engine = await open()
    await board()
    const alpha = cardNamed(c.noteCard('Alpha'))
    alpha.focus()

    fireEvent.keyDown(alpha, { key: 'ArrowRight' })
    fireEvent.keyDown(alpha, { key: 'ArrowDown', shiftKey: true })
    fireEvent.keyDown(alpha, { key: 'ArrowRight', altKey: true })
    expect((await saved(engine)).nodes[0]).toMatchObject({ x: CANVAS_STEP_PX, y: 4 * CANVAS_STEP_PX, width: 280 + CANVAS_STEP_PX, height: 160 })

    vi.mocked(engine.saveCanvas).mockClear()
    await act(async () => void fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'Delete' }))
    expect(screen.getByText(c.removed(c.noteCard('Alpha')))).toBeTruthy()
    expect(await saved(engine)).toEqual({ nodes: [BOARD.nodes[1]], edges: [] })
  })

  it('drags a card by the mouse and saves once it is let go', async () => {
    const engine = await open()
    await board()
    const beta = cardNamed(c.noteCard('Beta'))

    fireEvent.mouseDown(within(beta).getByText('Ideas'), { button: 0, clientX: 10, clientY: 10 })
    fireEvent.mouseMove(window, { clientX: 60, clientY: 40 })
    expect(beta.style.left).toBe('450px')
    expect(engine.saveCanvas).not.toHaveBeenCalled()
    fireEvent.mouseUp(window, { clientX: 60, clientY: 40 })

    expect((await saved(engine)).nodes[1]).toMatchObject({ x: 450, y: 30 })
  })

  it('connects two cards with Connect, refuses a second line between them, and a focused line goes with Delete', async () => {
    const engine = await open({ nodes: BOARD.nodes, edges: [] })
    await board()

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.connectLabel(c.noteCard('Alpha')) })))
    expect(screen.getByText(c.connecting(c.noteCard('Alpha')))).toBeTruthy()
    await act(async () => void fireEvent.keyDown(cardNamed(c.noteCard('Beta')), { key: 'Enter' }))
    expect(screen.getByText(c.connected(c.noteCard('Alpha'), c.noteCard('Beta')))).toBeTruthy()
    expect((await saved(engine)).edges).toEqual([expect.objectContaining({ fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left' })])

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.connectLabel(c.noteCard('Beta')) })))
    await act(async () => void fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'Enter' }))
    expect(screen.getByText(c.notConnected)).toBeTruthy()

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.connectLabel(c.noteCard('Beta')) })))
    await act(async () => void fireEvent.keyDown(screen.getByRole('region', { name: /^Canvas: / }), { key: 'Escape' }))
    expect(screen.queryByText(c.connecting(c.noteCard('Beta')))).toBeNull()

    vi.mocked(engine.saveCanvas).mockClear()
    await act(async () => void fireEvent.keyDown(screen.getByRole('button', { name: c.line(c.noteCard('Alpha'), c.noteCard('Beta')) }), { key: 'Delete' }))
    expect((await saved(engine)).edges).toEqual([])
  })

  it('shows quests, files, text, groups and missing notes as they are', async () => {
    await open({
      nodes: [
        card('g', { type: 'group', label: 'Week 1', file: undefined }),
        card('q', { type: 'text', text: '[[quest:t-0dd|Old quest]]', file: undefined }),
        card('m', { file: 'n-gone.md' }),
        card('x', { type: 'text', text: 'Just a thought', file: undefined }),
        card('i', { file: 'attachments/ab.png' }),
        card('o', { file: 'Projects/plan.md' }),
      ],
      edges: [],
    })
    await board()

    expect(within(cardNamed(c.groupCard('Week 1'))).getByText('Week 1')).toBeTruthy()
    expect(within(cardNamed(c.questCard('Old quest'))).getByText(t.notebook.questState.gone)).toBeTruthy()
    expect(within(cardNamed(c.missingCard)).getByText(c.missingNote)).toBeTruthy()
    expect(within(cardNamed(c.textCard)).getByText('Just a thought')).toBeTruthy()
    expect(await within(cardNamed(c.fileCard('ab.png'))).findByRole('img', { name: 'ab.png' })).toBeTruthy()
    expect(screen.getByText(c.otherCard('Projects/plan.md'))).toBeTruthy()
  })

  it('asks which board to keep when the file changed outside, and each choice does what it says', async () => {
    const theirs: CanvasView = { canvas: { nodes: [card('z', { file: 'n-b.md' })], edges: [] }, stamp: 'c-theirs' }
    const saveCanvas = vi.fn(async () => ok({ kind: 'changed' as const, view: theirs }))
    await open(BOARD, { saveCanvas })
    await board()
    await act(async () => void fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'ArrowLeft' }))

    expect((await screen.findByRole('alert', {}, { timeout: 2000 })).textContent).toContain(c.changedTitle)
    expect(screen.getByText(t.notebook.notSavedChanged)).toBeTruthy()
    saveCanvas.mockImplementation(async () => ok({ kind: 'saved' as const, stamp: 'c-3' }) as never)
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.keepMine })))
    expect(saveCanvas.mock.calls.at(-1)).toEqual([KEY, expect.objectContaining({ nodes: [expect.objectContaining({ id: 'a', x: -CANVAS_STEP_PX }), BOARD.nodes[1]] }), 'c-theirs'])
    expect(screen.queryByText(c.changedTitle)).toBeNull()

    saveCanvas.mockImplementation(async () => ok({ kind: 'changed' as const, view: theirs }) as never)
    await act(async () => void fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'ArrowLeft' }))
    const loadTheirs = await screen.findByRole('button', { name: t.notebook.loadTheirs }, { timeout: 2000 })
    await act(async () => void fireEvent.click(loadTheirs))
    expect(screen.getByRole('region', { name: c.board(1, 0) })).toBeTruthy()
    expect(cardNamed(c.noteCard('Beta'))).toBeTruthy()
  })

  it('keeps a board that could not be saved when a note is opened, and saves it on coming back', async () => {
    const saveCanvas = vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't save the canvas. Your board is still here. Try again." } }))
    await open(BOARD, { saveCanvas })
    await board()
    await act(async () => void fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'Delete' }))
    expect(await screen.findByText(/Couldn't save the canvas/, {}, { timeout: 2000 })).toBeTruthy()

    await act(async () => void fireEvent.click(within(screen.getByRole('navigation', { name: t.notebook.title })).getByRole('button', { name: /^Beta/ })))
    await screen.findByDisplayValue('Beta')
    saveCanvas.mockImplementation(async () => ok({ kind: 'saved' as const, stamp: 'c-2' }) as never)
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: c.open })))

    expect((await board()).getAttribute('aria-label')).toBe(c.board(1, 0))
    await waitFor(() => expect(saveCanvas.mock.calls.at(-1)).toEqual([KEY, { nodes: [BOARD.nodes[1]], edges: [] }, 'c-1']), { timeout: 2000 })
  })
})
