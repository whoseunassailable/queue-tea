// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'
import type { Reply } from '../../../shared/engine_api'
import { fakeEngine } from '../../test_support'
import { useEngineRead, type EngineRead } from './use_engine_read'

const pending = <T,>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}
const ok = (data: string): Reply<string> => ({ ok: true, data })
afterEach(cleanup)

const open = async () => {
  const { engine, fire } = fakeEngine()
  const requests: ReturnType<typeof pending<Reply<string>>>[] = []
  const read = vi.fn((_target: string) => { const request = pending<Reply<string>>(); requests.push(request); return request.promise })
  let state!: EngineRead<string>
  const Page = ({ target }: { target: string }) => {
    state = useEngineRead(engine, () => read(target), [target])
    return <div>{state.load.status === 'ready' ? state.load.data : state.load.status}</div>
  }
  let page!: ReturnType<typeof render>
  await act(() => { page = render(<Page target="main" />) })
  return { engine, fire, requests, read, state: () => state, page, target: async (target: string) => act(() => page.rerender(<Page target={target} />)) }
}

it('coalesces slow polls and event bursts into one trailing read and shows each completed result', async () => {
  const h = await open()
  await act(() => { for (let n = 0; n < 50; n++) { h.state().refresh(); h.fire() } })
  expect(h.read).toHaveBeenCalledTimes(1)
  await act(async () => h.requests[0]!.resolve(ok('running output')))
  await vi.waitFor(() => expect(h.state().load).toEqual({ status: 'ready', data: 'running output' }))
  expect(h.state().isRefreshing).toBe(true)
  expect(h.read).toHaveBeenCalledTimes(2)
  await act(async () => h.requests[1]!.resolve(ok('succeeded exit 0')))
  await vi.waitFor(() => expect(h.state().load).toEqual({ status: 'ready', data: 'succeeded exit 0' }))
  expect(h.state().isRefreshing).toBe(false)
  expect(h.read).toHaveBeenCalledTimes(2)
})

it('discards an old parameter result and reads the latest parameters once', async () => {
  const h = await open()
  await h.target('stage')
  await h.target('release')
  expect(h.read).toHaveBeenCalledTimes(1)
  await act(async () => h.requests[0]!.resolve(ok('old main')))
  expect(h.state().load.status).toBe('loading')
  expect(h.read).toHaveBeenCalledTimes(2)
  expect(h.read).toHaveBeenLastCalledWith('release')
  await act(async () => h.requests[1]!.resolve(ok('release result')))
  await vi.waitFor(() => expect(h.state().load).toEqual({ status: 'ready', data: 'release result' }))
})

it('adopts a mutation reply without allowing an older read or queued poll to overwrite it', async () => {
  const h = await open()
  await act(() => { h.state().refresh(); h.state().adopt('new approval') })
  await act(async () => h.requests[0]!.resolve(ok('old approval')))
  expect(h.state().load).toEqual({ status: 'ready', data: 'new approval' })
  expect(h.state().isRefreshing).toBe(false)
  expect(h.read).toHaveBeenCalledTimes(1)
  await act(() => h.state().refresh())
  expect(h.read).toHaveBeenCalledTimes(2)
})

it('keeps a refresh requested after adoption, while still bounding the old outstanding read', async () => {
  const h = await open()
  await act(() => { h.state().adopt('mutation'); h.fire(); h.state().refresh() })
  expect(h.read).toHaveBeenCalledTimes(1)
  await act(async () => h.requests[0]!.resolve(ok('old')))
  expect(h.state().load).toEqual({ status: 'ready', data: 'mutation' })
  expect(h.read).toHaveBeenCalledTimes(2)
  await act(async () => h.requests[1]!.resolve(ok('fresh')))
  await vi.waitFor(() => expect(h.state().load).toEqual({ status: 'ready', data: 'fresh' }))
})

it('drops pending work and unsubscribes when the view unmounts', async () => {
  const h = await open()
  await act(() => { h.state().refresh(); h.page.unmount(); h.fire() })
  await act(async () => h.requests[0]!.resolve(ok('late')))
  expect(h.read).toHaveBeenCalledTimes(1)
})

it('retains data after a failed refresh, then clears the error after retry', async () => {
  const h = await open()
  await act(async () => h.requests[0]!.resolve(ok('retained')))
  await act(() => h.state().refresh())
  await act(async () => h.requests[1]!.resolve({ ok: false, error: { message: 'Try again' } }))
  expect(h.state().load).toEqual({ status: 'ready', data: 'retained' })
  await vi.waitFor(() => expect(h.state().note).toBe('Try again'))
  await act(() => h.state().retry())
  await act(async () => h.requests[2]!.resolve(ok('recovered')))
  await vi.waitFor(() => expect(h.state().load).toEqual({ status: 'ready', data: 'recovered' }))
  expect(h.state().note).toBeNull()
})
