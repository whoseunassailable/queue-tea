// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'

import type { LayoutInput, Point } from '../../domain/note_graph_layout'
import type { GraphLayoutState, LayoutRun } from './graph_layout'
import { useGraphLayout } from './graph_layout'

afterEach(cleanup)

type Run = { input: LayoutInput; onProgress: (share: number) => void; finish: (points: Map<string, Point>) => void; fail: (error: unknown) => void; cancel: () => void }

// A layout whose progress, result and failure the test hands out itself.
const fakeRun = () => {
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

    return { done, cancel }
  })

  return { run, runs }
}

// Lets every promise callback waiting on a settled run go first.
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

const inputOf = (...ids: string[]): LayoutInput => ({ ids, edges: [], centre: ids[0] ?? null, start: new Map() })

it('shows progress, then the points', async () => {
  const { run, runs } = fakeRun()
  const input = inputOf('a', 'b')
  const { result } = renderHook(() => useGraphLayout(run, input, vi.fn()))

  expect(run).toHaveBeenCalledWith(input, expect.any(Function))
  expect(result.current.state).toEqual({ kind: 'laying', share: 0 })
  act(() => runs[0]!.onProgress(0.5))
  expect(result.current.state).toEqual({ kind: 'laying', share: 0.5 })
  const points = new Map<string, Point>([['a', { x: 0, y: 0 }], ['b', { x: 60, y: 0 }]])
  await act(async () => runs[0]!.finish(points))
  await waitFor(() => expect(result.current.state).toEqual({ kind: 'done', points }))
})

it('cancels the old run when the input changes', async () => {
  const { run, runs } = fakeRun()
  const first = inputOf('a')
  const second = inputOf('b')
  const { result, rerender } = renderHook((input: LayoutInput) => useGraphLayout(run, input, vi.fn()), { initialProps: first })
  rerender(second)

  expect(runs).toHaveLength(2)
  expect(runs[1]!.input).toBe(second)
  expect(runs[0]!.cancel).toHaveBeenCalled()
  await act(async () => {
    runs[0]!.finish(new Map([['a', { x: 5, y: 5 }]]))
    await settle()
  })
  expect(result.current.state).toEqual({ kind: 'laying', share: 0 })
  const points = new Map<string, Point>([['b', { x: 0, y: 0 }]])
  await act(async () => runs[1]!.finish(points))
  await waitFor(() => expect(result.current.state).toEqual({ kind: 'done', points }))
})

it('reads as laying from the first render with a new input', async () => {
  const { run, runs } = fakeRun()
  const first = inputOf('a')
  const second = inputOf('b')
  // act() flushes effects, so only a record of every render shows what the map was given before them.
  const seen: [LayoutInput, GraphLayoutState['kind']][] = []
  const { result, rerender } = renderHook(
    (input: LayoutInput) => {
      const layout = useGraphLayout(run, input, vi.fn())
      seen.push([input, layout.state.kind])
      return layout
    },
    { initialProps: first },
  )
  await act(async () => runs[0]!.finish(new Map([['a', { x: 0, y: 0 }]])))
  await waitFor(() => expect(result.current.state.kind).toBe('done'))
  rerender(second)

  const kinds = seen.filter(([input]) => input === second).map(([, kind]) => kind)
  expect(kinds[0]).toBe('laying')
  expect(kinds).not.toContain('done')
})

it('logs a failure and lays out again on retry', async () => {
  const { run, runs } = fakeRun()
  const input = inputOf('a')
  const log = vi.fn<(text: string) => void>()
  const { result } = renderHook(() => useGraphLayout(run, input, log))
  const error = new Error('boom')
  await act(async () => {
    runs[0]!.fail(error)
    await settle()
  })

  expect(result.current.state).toEqual({ kind: 'failed' })
  expect(log).toHaveBeenCalledTimes(1)
  expect(log.mock.calls[0]![0]).toContain('graph layout')
  expect(log.mock.calls[0]![0]).toContain(error.stack!)
  act(() => result.current.retry())
  expect(run).toHaveBeenCalledTimes(2)
  expect(run).toHaveBeenLastCalledWith(input, expect.any(Function))
  expect(result.current.state).toEqual({ kind: 'laying', share: 0 })
})

it('a run that throws while starting gives the failed state and logs the stack', () => {
  const error = new Error('no worker')
  const run = vi.fn<LayoutRun>(() => {
    throw error
  })
  const log = vi.fn<(text: string) => void>()
  const input = inputOf('a')
  const { result } = renderHook(() => useGraphLayout(run, input, log))

  expect(result.current.state).toEqual({ kind: 'failed' })
  expect(log).toHaveBeenCalledTimes(1)
  expect(log.mock.calls[0]![0]).toContain('graph layout')
  expect(log.mock.calls[0]![0]).toContain(error.stack!)
})

it('does nothing for a null input', () => {
  const { run } = fakeRun()
  renderHook(() => useGraphLayout(run, null, vi.fn()))

  expect(run).not.toHaveBeenCalled()
})

it('shows points that are ready for the input as done, without a run, and a retry then runs', () => {
  const { run } = fakeRun()
  const input = inputOf('a', 'b')
  const ready = new Map<string, Point>([['a', { x: 0, y: 0 }], ['b', { x: 60, y: 0 }]])
  const { result } = renderHook(() => useGraphLayout(run, input, vi.fn(), ready))

  expect(result.current.state).toEqual({ kind: 'done', points: ready })
  expect(run).not.toHaveBeenCalled()
  act(() => result.current.retry())
  expect(run).toHaveBeenCalledWith(input, expect.any(Function))
  expect(result.current.state).toEqual({ kind: 'laying', share: 0 })
})

it('lays out a later input even when the first had ready points', () => {
  const { run } = fakeRun()
  const ready = new Map<string, Point>([['a', { x: 0, y: 0 }]])
  const next = inputOf('a', 'b')
  const { result, rerender } = renderHook((input: LayoutInput) => useGraphLayout(run, input, vi.fn(), ready), { initialProps: inputOf('a') })
  expect(run).not.toHaveBeenCalled()
  rerender(next)

  expect(run).toHaveBeenCalledTimes(1)
  expect(run).toHaveBeenCalledWith(next, expect.any(Function))
  expect(result.current.state).toEqual({ kind: 'laying', share: 0 })
})
