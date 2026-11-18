// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import type { NoteType } from '../../../../../shared/notes'
import { NOTE_TYPES } from '../../../../../shared/notes'
import { fakeEngine, note } from '../../../../test_support'
import { questNodeId, SHOW_ALL } from '../../domain/note_graph'
import type { LayoutInput, Point } from '../../domain/note_graph_layout'
import type { QuestLine } from '../../domain/notes_view'
import type { LayoutRun } from '../state_management/graph_layout'
import type { GraphViewBox } from './note_graph_draw'
import { drawGraph } from './note_graph_draw'
import type { GraphSettings } from './note_graph_view'
import { GRAPH_START, keptStart, NoteGraphView } from './note_graph_view'

// Drawing is recorded, not done: a test reads the pan and zoom from the last frame.
vi.mock('./note_graph_draw', async () => ({ ...(await vi.importActual<typeof import('./note_graph_draw')>('./note_graph_draw')), drawGraph: vi.fn() }))

// jsdom's canvas has no 2D context, so the view skips drawing. Every element
// measures 800 × 600, so a fitted view puts the middle of the points at (400, 300).
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, x: 0, y: 0, width: 800, height: 600, right: 800, bottom: 600, toJSON() {} } as DOMRect)
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const A = 'n-00000001'
const B = 'n-00000002'
const C = 'n-00000003'
const D = 'n-00000004'

type Run = { input: LayoutInput; onProgress: (share: number) => void; finish: (points: Map<string, Point>) => void; fail: (error: unknown) => void; cancel: () => void }

// A layout the test finishes or fails itself, or that finishes at once with
// place's points when place is given.
const fakeRun = (place?: (input: LayoutInput) => Map<string, Point>) => {
  const runs: Run[] = []
  const run = vi.fn<LayoutRun>((input, onProgress) => {
    let finish!: Run['finish']
    let fail!: Run['fail']
    const done = new Promise<Map<string, Point>>((resolve, reject) => {
      finish = resolve
      fail = reject
    })
    const cancel = vi.fn()
    runs.push({ input, onProgress, finish, fail, cancel })
    if (place !== undefined) finish(place(input))

    return { done, cancel }
  })

  return { run, runs }
}

// Lets every promise callback waiting on a settled run go first.
const settle = () => act(async () => void (await new Promise(resolve => setTimeout(resolve, 0))))

// Puts target at (0, 0) and up to four others at the compass points around it,
// so with two or four others the fitted view shows target at (400, 300).
const aimedAt = (target: string, ids: readonly string[]): Map<string, Point> => {
  const spots: Point[] = [{ x: 100, y: 0 }, { x: -100, y: 0 }, { x: 0, y: 100 }, { x: 0, y: -100 }]

  return new Map([[target, { x: 0, y: 0 }], ...ids.filter(id => id !== target).map((id, i): [string, Point] => [id, spots[i]!])])
}

const line = (title: string, state: QuestLine['state']): QuestLine => ({ title, state, priority: 'mid', difficulty: 'medium' })

type Props = Parameters<typeof NoteGraphView>[0]
const propsOf = (over: Partial<Props> & Pick<Props, 'notes' | 'open'>): Props => ({
  engine: fakeEngine().engine,
  quests: new Map(),
  settings: GRAPH_START,
  onSettings: vi.fn(),
  kept: { current: keptStart() },
  run: fakeRun().run,
  onOpenNote: vi.fn(),
  onOpenQuest: vi.fn(),
  onLeave: vi.fn(),
  ...over,
})

const realm: GraphSettings = { ...GRAPH_START, scope: 'realm' }
const graphArea = () => screen.getByRole('group', { name: /^Graph (around|of the whole realm)/ })
const statusLines = () => screen.queryAllByRole('status').map(status => status.textContent)
const press = (x: number, y: number, upX = x, upY = y) => {
  const area = graphArea()
  fireEvent.mouseDown(area, { clientX: x, clientY: y, button: 0 })
  if (upX !== x || upY !== y) fireEvent.mouseMove(area, { clientX: upX, clientY: upY, buttons: 1 })
  fireEvent.mouseUp(area, { clientX: upX, clientY: upY, button: 0 })
}

it('shows the spinner and progress while laying out, after 150 ms', () => {
  vi.useFakeTimers()
  const { run, runs } = fakeRun()
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] and [[quest:t-1a2b|Parser]]' })
  const { container } = render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, quests: new Map([['t-1a2b', line('Write the parser', 'active')]]), run })} />)

  act(() => void vi.advanceTimersByTime(100))
  expect(screen.queryByText(/Laying out/)).toBeNull()
  expect(container.querySelector('.spinner')).toBeNull()
  act(() => void vi.advanceTimersByTime(50))
  expect(screen.getByText('Laying out 3 notes…')).toBeTruthy()
  expect(container.querySelector('.spinner')).not.toBeNull()
  act(() => runs[0]!.onProgress(0.5))
  expect(screen.getByText('50% done')).toBeTruthy()
})

it('says a note with no links stands alone', async () => {
  const open = note({ id: A, title: 'Lonely idea' })
  render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Elsewhere' })], open, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
  await settle()

  expect(screen.getByText('Nothing links to or from this note yet.')).toBeTruthy()
  expect(screen.getByText('Type [[ in Write to link a note or a quest.')).toBeTruthy()
  expect(graphArea().getAttribute('aria-label')).toBe('Graph around Lonely idea: 0 notes and 0 quests within 2 steps')
})

it('whole realm with no links shows every note and says so', async () => {
  const open = note({ id: A, title: 'Alpha' })
  const { run, runs } = fakeRun(input => aimedAt(A, input.ids))
  render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Beta' }), note({ id: C, title: 'Cello' })], open, settings: realm, run })} />)
  await settle()

  expect([...runs[0]!.input.ids].sort()).toEqual([A, B, C])
  expect(graphArea().getAttribute('aria-label')).toBe('Graph of the whole realm: 3 notes and 0 quests')
  expect(screen.getByText('No notes in this realm link to each other yet.')).toBeTruthy()
})

it('offers Show everything when the filters hide everything', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] and [[quest:t-1a2b|Parser]]' })
  const settings: GraphSettings = { ...GRAPH_START, filter: { hiddenTypes: new Set<NoteType | 'none'>([...NOTE_TYPES, 'none']), quests: false, doneQuests: true } }
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta', type: 'idea' })], open, quests: new Map([['t-1a2b', line('Write the parser', 'active')]]), settings, run: fakeRun(input => aimedAt(A, input.ids)).run })
  render(<NoteGraphView {...props} />)
  await settle()

  expect(screen.getByText('Nothing matches these filters.')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Show everything' }))
  expect(props.onSettings).toHaveBeenCalledWith({ ...settings, filter: SHOW_ALL })
})

it('shows the failure and lays out again on Try again', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const { run, runs } = fakeRun()
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run })
  render(<NoteGraphView {...props} />)
  const error = new Error('boom')
  runs[0]!.fail(error)
  await settle()

  expect(screen.getByText("Couldn't draw the graph. Something went wrong while placing the notes. Try again, or switch to Around this note.")).toBeTruthy()
  expect(screen.queryByText(/boom/)).toBeNull()
  expect(props.engine.log).toHaveBeenCalledWith('error', expect.stringContaining(error.stack!))
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(run).toHaveBeenCalledTimes(2)
})

it('clicking opens notes and quests in play, and nothing else', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] [[quest:t-1a2b|Parser]] [[quest:t-3c4d|Ship]] [[quest:t-5e6f|Old]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  // t-5e6f isn't in the queue any more.
  const quests = new Map([['t-1a2b', line('Write the parser', 'active')], ['t-3c4d', line('Ship it', 'done')]])
  const pressOn = async (target: string, upX = 400) => {
    cleanup()
    const props = propsOf({ notes, open, quests, run: fakeRun(input => aimedAt(target, input.ids)).run })
    render(<NoteGraphView {...props} />)
    await settle()
    press(400, 300, upX, 300)

    return props
  }

  const onNote = await pressOn(B)
  expect(onNote.onOpenNote).toHaveBeenCalledWith(B)
  expect(onNote.onOpenQuest).not.toHaveBeenCalled()
  const onActive = await pressOn(questNodeId('t-1a2b'))
  expect(onActive.onOpenQuest).toHaveBeenCalledWith('t-1a2b')
  expect(onActive.onOpenNote).not.toHaveBeenCalled()
  for (const target of [questNodeId('t-3c4d'), questNodeId('t-5e6f')]) {
    const props = await pressOn(target)
    expect(props.onOpenNote).not.toHaveBeenCalled()
    expect(props.onOpenQuest).not.toHaveBeenCalled()
  }
  const dragged = await pressOn(B, 404)
  expect(dragged.onOpenNote).not.toHaveBeenCalled()
})

it('a drag pans the graph, and Fit puts it back', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] [[Cello]]' })
  const points = new Map<string, Point>([[B, { x: 0, y: 0 }], [A, { x: -100, y: -100 }], [C, { x: 100, y: 100 }]])
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' }), note({ id: C, title: 'Cello' })], open, run: fakeRun(() => points).run })
  render(<NoteGraphView {...props} />)
  await settle()

  // (600, 100) is background, far from the line the three points sit on.
  press(600, 100, 650, 100)
  press(400, 300)
  expect(props.onOpenNote).not.toHaveBeenCalled()
  press(450, 300)
  expect(props.onOpenNote).toHaveBeenCalledWith(B)
  vi.mocked(props.onOpenNote).mockClear()
  fireEvent.click(screen.getByRole('button', { name: 'Fit' }))
  press(400, 300)
  expect(props.onOpenNote).toHaveBeenCalledWith(B)
})

it('arrow keys move between nodes, Enter opens, Esc leaves', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] [[Cello]]' })
  const points = new Map<string, Point>([[A, { x: 0, y: 0 }], [B, { x: 100, y: 0 }], [C, { x: -100, y: 0 }]])
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' }), note({ id: C, title: 'Cello' })], open, run: fakeRun(() => points).run })
  render(<NoteGraphView {...props} />)
  await settle()
  const area = graphArea()

  act(() => area.focus())
  expect(statusLines()).toContain('Gait sensor, note, 2 links')
  fireEvent.keyDown(area, { key: 'ArrowRight' })
  expect(statusLines()).toContain('Beta, note, 1 link')
  fireEvent.keyDown(area, { key: 'Enter' })
  expect(props.onOpenNote).toHaveBeenCalledWith(B)
  fireEvent.keyDown(area, { key: 'ArrowLeft' })
  expect(statusLines()).toContain('Gait sensor, note, 2 links')
  fireEvent.keyDown(area, { key: 'Escape' })
  expect(props.onLeave).toHaveBeenCalled()
})

it('the summary names the scope and its counts', async () => {
  // Delta is three steps out, past the two the view shows.
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] and [[quest:t-1a2b|Parser]]' })
  const notes = [open, note({ id: B, title: 'Beta', body: '[[Cello]]' }), note({ id: C, title: 'Cello', type: 'bug', body: '[[Delta]]' }), note({ id: D, title: 'Delta' })]
  const props = propsOf({ notes, open, quests: new Map([['t-1a2b', line('Write the parser', 'active')]]), run: fakeRun(input => aimedAt(A, input.ids)).run })
  const { rerender } = render(<NoteGraphView {...props} />)
  await settle()

  expect(graphArea().getAttribute('aria-label')).toBe('Graph around Gait sensor: 2 notes and 1 quest within 2 steps')
  rerender(<NoteGraphView {...props} settings={{ ...GRAPH_START, filter: { ...SHOW_ALL, hiddenTypes: new Set(['bug']) } }} />)
  await settle()
  expect(graphArea().getAttribute('aria-label')).toBe('Graph around Gait sensor: 1 note and 1 quest within 2 steps')
})

it('the map says it is busy while the layout runs, and not once it is done', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const { run, runs } = fakeRun()
  render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run })} />)

  expect(graphArea().getAttribute('aria-busy')).toBe('true')
  await act(async () => runs[0]!.finish(aimedAt(A, runs[0]!.input.ids)))
  await settle()
  expect(graphArea().getAttribute('aria-busy')).toBe('false')
})

it('the scope, steps and filter controls hand the parent the whole next settings', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run: fakeRun(input => aimedAt(A, input.ids)).run })
  const { rerender } = render(<NoteGraphView {...props} />)
  await settle()
  const pressed = (name: string) => screen.getByRole('button', { name }).getAttribute('aria-pressed')

  expect([pressed('Around this note'), pressed('Whole realm'), pressed('1 step'), pressed('2 steps')]).toEqual(['true', 'false', 'false', 'true'])
  fireEvent.click(screen.getByRole('button', { name: 'Whole realm' }))
  expect(props.onSettings).toHaveBeenLastCalledWith({ scope: 'realm', steps: 2, filter: SHOW_ALL })
  fireEvent.click(screen.getByRole('button', { name: '1 step' }))
  expect(props.onSettings).toHaveBeenLastCalledWith({ scope: 'around', steps: 1, filter: SHOW_ALL })

  const filter = screen.getByRole('button', { name: 'Filter' })
  expect([filter.getAttribute('aria-haspopup'), filter.getAttribute('aria-expanded')]).toEqual(['menu', 'false'])
  fireEvent.click(filter)
  expect(filter.getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByRole('menu')).toBeTruthy()
  for (const name of ['Idea', 'Feature', 'Bug', 'Meeting', 'Research', 'Decision', 'Daily', 'No type', 'Quests', 'Done quests']) {
    expect(screen.getByRole('menuitemcheckbox', { name }).getAttribute('aria-checked')).toBe('true')
  }
  // The menu may close on a pick; each pick opens it again if so.
  const pick = (name: string) => {
    if (screen.queryByRole('menu') === null) fireEvent.click(filter)
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name }))
  }
  pick('Meeting')
  expect(props.onSettings).toHaveBeenLastCalledWith({ ...GRAPH_START, filter: { ...SHOW_ALL, hiddenTypes: new Set(['meeting']) } })
  pick('No type')
  expect(props.onSettings).toHaveBeenLastCalledWith({ ...GRAPH_START, filter: { ...SHOW_ALL, hiddenTypes: new Set(['none']) } })
  pick('Quests')
  expect(props.onSettings).toHaveBeenLastCalledWith({ ...GRAPH_START, filter: { ...SHOW_ALL, quests: false } })
  pick('Done quests')
  expect(props.onSettings).toHaveBeenLastCalledWith({ ...GRAPH_START, filter: { ...SHOW_ALL, doneQuests: false } })

  rerender(<NoteGraphView {...props} settings={realm} />)
  expect(screen.queryByRole('button', { name: '1 step' })).toBeNull()
  expect(screen.queryByRole('button', { name: '2 steps' })).toBeNull()
})

it("keeps the whole realm's points, and lays out again from them when notes change", async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  const { run, runs } = fakeRun()
  const props = propsOf({ notes, open, settings: realm, run })
  const { rerender } = render(<NoteGraphView {...props} />)

  expect(runs[0]!.input.centre).toBeNull()
  expect(runs[0]!.input.start).toEqual(new Map())
  const points = new Map<string, Point>([[A, { x: -30, y: 0 }], [B, { x: 30, y: 0 }]])
  runs[0]!.finish(points)
  await settle()
  expect(props.kept.current.points).toEqual(points)
  expect(props.kept.current.input).toBe(runs[0]!.input)

  rerender(<NoteGraphView {...props} notes={[...notes, note({ id: C, title: 'Cello' })]} />)
  expect(run).toHaveBeenCalledTimes(2)
  expect(runs[1]!.input.centre).toBeNull()
  expect(runs[1]!.input.ids).toContain(C)
  expect(runs[1]!.input.start).toEqual(points)
})

it("opening another note on the whole realm doesn't lay out again", async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  const { run } = fakeRun(input => aimedAt(A, input.ids))
  const props = propsOf({ notes, open, settings: realm, run })
  const { rerender } = render(<NoteGraphView {...props} />)
  await settle()

  rerender(<NoteGraphView {...props} open={notes[1]!} />)
  await settle()
  expect(run).toHaveBeenCalledTimes(1)
})

it("the open note's unsaved links count", () => {
  const saved = note({ id: A, title: 'Gait sensor', body: '' })
  const { run, runs } = fakeRun()
  render(<NoteGraphView {...propsOf({ notes: [saved, note({ id: B, title: 'Beta' })], open: { ...saved, body: 'See [[Beta]]' }, run })} />)

  expect(runs[0]!.input.edges).toEqual([{ a: A, b: B }])
  expect(runs[0]!.input.centre).toBe(A)
  expect(runs[0]!.input.start.size).toBe(0)
})

// jsdom has no canvas context, so a fake one lets the (mocked) drawing run and record its frames.
const lastView = (): GraphViewBox => vi.mocked(drawGraph).mock.calls.at(-1)![1].view

it("opening another note on the whole realm in a new mount keeps the map, its pan and zoom, and doesn't lay out again", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  const kept = { current: keptStart() }
  const first = fakeRun(input => aimedAt(A, input.ids))
  render(<NoteGraphView {...propsOf({ notes, open, settings: realm, kept, run: first.run })} />)
  await settle()
  const fitted = lastView()
  // (600, 100) is background, so this drag pans the map.
  press(600, 100, 650, 100)
  const panned = lastView()
  expect(panned).toEqual({ ...fitted, x: fitted.x + 50 })

  cleanup()
  const second = fakeRun(input => aimedAt(A, input.ids))
  render(<NoteGraphView {...propsOf({ notes, open: notes[1]!, settings: realm, kept, run: second.run })} />)
  await settle()

  expect(second.run).not.toHaveBeenCalled()
  expect(lastView()).toEqual(panned)
})

it('a note opened from the map takes the focus on the next mount, and one picked from the list does not', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  const kept = { current: keptStart() }
  const mount = async (shown: typeof open) => {
    render(<NoteGraphView {...propsOf({ notes, open: shown, settings: realm, kept, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
    await settle()
  }

  await mount(open)
  act(() => graphArea().focus())
  fireEvent.keyDown(graphArea(), { key: 'ArrowRight' })
  fireEvent.keyDown(graphArea(), { key: 'Enter' })
  expect(kept.current.isFocused).toBe(true)

  cleanup()
  expect(document.activeElement).toBe(document.body)
  await mount(notes[1]!)
  expect(document.activeElement).toBe(graphArea())
  expect(kept.current.isFocused).toBe(false)

  // A pick from the list leaves isFocused false, so the next mount keeps the focus where it was.
  cleanup()
  await mount(open)
  expect(document.activeElement).not.toBe(graphArea())
})

it("a whole realm mount that was still laying out leaves nothing fitted behind, so the next mount fits the map", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  // What a first mount with nothing kept draws once its layout finishes.
  render(<NoteGraphView {...propsOf({ notes, open, settings: realm, kept: { current: keptStart() }, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
  await settle()
  const fitted = lastView()
  cleanup()

  const kept = { current: keptStart() }
  render(<NoteGraphView {...propsOf({ notes, open, settings: realm, kept, run: fakeRun().run })} />)
  cleanup()
  render(<NoteGraphView {...propsOf({ notes, open: notes[1]!, settings: realm, kept, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
  await settle()

  expect(fitted).not.toEqual({ zoom: 1, x: 0, y: 0 })
  expect(lastView()).toEqual(fitted)
})

// The drawn frames, read after the fact.
const lastFrame = () => vi.mocked(drawGraph).mock.calls.at(-1)![1]

it('a press on the background leaves no node lit and the status line empty', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
  await settle()
  press(600, 100)

  expect(document.activeElement).toBe(graphArea())
  expect(lastFrame().hot).toBeNull()
  expect(statusLines().every(text => text === '')).toBe(true)
})

it('a note opened by a click on the map remounts with no node lit', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]] [[Cello]]' })
  const notes = [open, note({ id: B, title: 'Beta' }), note({ id: C, title: 'Cello' })]
  const kept = { current: keptStart() }
  const props = propsOf({ notes, open, settings: realm, kept, run: fakeRun(input => aimedAt(B, input.ids)).run })
  render(<NoteGraphView {...props} />)
  await settle()
  press(400, 300)
  expect(props.onOpenNote).toHaveBeenCalledWith(B)

  cleanup()
  render(<NoteGraphView {...propsOf({ notes, open: notes[1]!, settings: realm, kept, run: fakeRun(input => aimedAt(B, input.ids)).run })} />)
  await settle()
  expect(document.activeElement).toBe(graphArea())
  expect(lastFrame().hot).toBeNull()
})

it('tabbing into the map lights the open note, and so does the remount after Enter opened a note', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const notes = [open, note({ id: B, title: 'Beta' })]
  const kept = { current: keptStart() }
  const mount = async (shown: typeof open) => {
    render(<NoteGraphView {...propsOf({ notes, open: shown, settings: realm, kept, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
    await settle()
  }
  await mount(open)
  act(() => graphArea().focus())
  expect(lastFrame().hot).toBe(A)
  fireEvent.keyDown(graphArea(), { key: 'ArrowRight' })
  fireEvent.keyDown(graphArea(), { key: 'Enter' })

  cleanup()
  await mount(notes[1]!)
  expect(lastFrame().hot).toBe(B)
})

it('tabbing back into the map after pressing it twice lights the open note', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
  await settle()
  // (600, 100) is background; the second press comes while the map already has the focus.
  press(600, 100)
  press(600, 100)
  act(() => graphArea().blur())
  act(() => graphArea().focus())

  expect(lastFrame().hot).toBe(A)
  expect(statusLines()).toContain('Gait sensor, note, 1 link')
})

it('a layout that throws while starting shows the failure instead of throwing', () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run: vi.fn<LayoutRun>(() => { throw new Error('no worker') }) })
  render(<NoteGraphView {...props} />)

  expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
})

it('the same note with equal content keeps the same graph', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run: fakeRun(input => aimedAt(A, input.ids)).run })
  const { rerender } = render(<NoteGraphView {...props} />)
  await settle()
  const before = lastFrame().graph
  rerender(<NoteGraphView {...props} open={{ ...open }} />)

  expect(lastFrame().graph).toBe(before)
})

it("the same realm's notes in another order don't lay it out again", async () => {
  const [a, b, c] = [note({ id: A, title: 'Gait sensor', body: '[[Beta]]' }), note({ id: B, title: 'Beta', body: '[[Cello]]' }), note({ id: C, title: 'Cello' })]
  const { run } = fakeRun(input => aimedAt(A, input.ids))
  const props = propsOf({ notes: [a, b, c], open: a, settings: realm, run })
  const { rerender } = render(<NoteGraphView {...props} />)
  await settle()
  rerender(<NoteGraphView {...props} notes={[c, b, a]} />)
  await settle()

  expect(run).toHaveBeenCalledTimes(1)
})

const hoverOn = async (target: string, questId: string, quests: Map<string, QuestLine>) => {
  cleanup()
  const open = note({ id: A, title: 'Gait sensor', body: `[[Beta]] [[quest:${questId}|Q]]` })
  render(<NoteGraphView {...propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, quests, run: fakeRun(input => aimedAt(target, input.ids)).run })} />)
  await settle()
  fireEvent.mouseMove(graphArea(), { clientX: 400, clientY: 300 })

  return graphArea().classList.contains('is-over-node')
}

it("the pointer cursor shows over a note a click opens, and not over done quests, missing quests or the open note", async () => {
  const quests = new Map([['t-3c4d', line('Ship it', 'done')]])

  expect(await hoverOn(B, 't-3c4d', quests)).toBe(true)
  expect(await hoverOn(questNodeId('t-3c4d'), 't-3c4d', quests)).toBe(false)
  expect(await hoverOn(questNodeId('t-5e6f'), 't-5e6f', quests)).toBe(false)
  expect(await hoverOn(A, 't-3c4d', quests)).toBe(false)
})

it('Esc on the map leaves without reaching listeners further up', async () => {
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const props = propsOf({ notes: [open, note({ id: B, title: 'Beta' })], open, run: fakeRun(input => aimedAt(A, input.ids)).run })
  render(<NoteGraphView {...props} />)
  await settle()
  const heard = vi.fn()
  window.addEventListener('keydown', heard)
  fireEvent.keyDown(graphArea(), { key: 'Escape' })
  window.removeEventListener('keydown', heard)

  expect(props.onLeave).toHaveBeenCalled()
  expect(heard).not.toHaveBeenCalled()
})

it('a whole realm remount after a line changed lays out from the kept points, shows them meanwhile, and keeps the pan and zoom', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D)
  const [b, c] = [note({ id: B, title: 'Beta' }), note({ id: C, title: 'Cello' })]
  const open = note({ id: A, title: 'Gait sensor', body: '[[Beta]]' })
  const kept = { current: keptStart() }
  render(<NoteGraphView {...propsOf({ notes: [open, b, c], open, settings: realm, kept, run: fakeRun(input => aimedAt(A, input.ids)).run })} />)
  await settle()
  press(600, 100, 650, 100)
  const panned = lastView()
  const keptPoints = kept.current.points

  cleanup()
  const second = fakeRun()
  const moved = { ...open, body: '[[Cello]]' }
  render(<NoteGraphView {...propsOf({ notes: [moved, b, c], open: moved, settings: realm, kept, run: second.run })} />)

  expect(second.runs).toHaveLength(1)
  expect(second.runs[0]!.input.start).toEqual(keptPoints)
  expect(lastFrame().points).toBe(keptPoints)
  expect(lastView()).toEqual(panned)
  await act(async () => second.runs[0]!.finish(aimedAt(A, second.runs[0]!.input.ids)))
  await settle()
  expect(lastView()).toEqual(panned)
})
