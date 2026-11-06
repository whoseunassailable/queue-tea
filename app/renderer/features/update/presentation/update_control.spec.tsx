// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'
import type { AppUpdate } from '../../../../shared/update'
import { fakeEngine } from '../../../test_support'
import { UpdateControl } from './update_control'

afterEach(cleanup)
const view = (over: Partial<AppUpdate> = {}): AppUpdate => ({ running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: null, state: { phase: 'idle', commit: null, detail: null }, canRetry: false, canRestart: false, ...over })
const setup = async (data = view()) => {
  const readAppUpdate = vi.fn(async () => ({ ok: true as const, data }))
  const { engine, fire } = fakeEngine({ readAppUpdate })
  render(<UpdateControl engine={engine} />)
  await screen.findByText('v1.5.2')
  return { engine, fire, readAppUpdate }
}
it('shows the running version next to Settings and disables an unavailable update', async () => {
  await setup()
  expect(screen.getByRole('link', { name: 'Settings' }).textContent).toContain('v1.5.2')
  expect((screen.getByRole('button', { name: 'Update' }) as HTMLButtonElement).disabled).toBe(true)
})
it('enables Update when a same-version build can safely restart', async () => {
  const { engine } = await setup(view({ installed: { version: '1.5.2', commit: 'b'.repeat(40) }, state: { phase: 'installed', commit: 'b'.repeat(40), detail: null }, canRestart: true }))
  const button = screen.getByRole('button', { name: 'Update' }) as HTMLButtonElement
  expect(button.disabled).toBe(false)
  await act(() => void fireEvent.click(button)); expect(engine.applyAppUpdate).toHaveBeenCalledOnce()
})
it('shows build progress and a useful retry after failure', async () => {
  const { fire, readAppUpdate, engine } = await setup(view({ state: { phase: 'building', commit: 'b'.repeat(40), detail: null } }))
  expect(screen.getByRole('status').textContent).toContain('Building and testing')
  expect((screen.getByRole('button', { name: 'Update' }) as HTMLButtonElement).disabled).toBe(true)
  readAppUpdate.mockResolvedValue({ ok: true, data: view({ state: { phase: 'failed', commit: 'b'.repeat(40), detail: 'Fix local dependencies, then retry.' }, canRetry: true }) })
  act(fire)
  const retry = await screen.findByRole('button', { name: 'Retry update' }) as HTMLButtonElement
  expect(retry.disabled).toBe(false); expect(screen.getByRole('alert').textContent).toContain('Fix local dependencies')
  await act(() => void fireEvent.click(retry)); expect(engine.applyAppUpdate).toHaveBeenCalledOnce()
})
it('a failed Update press stays on screen until a later read shows the update has moved on', async () => {
  const installed = view({ installed: { version: '1.5.2', commit: 'b'.repeat(40) }, state: { phase: 'installed', commit: 'b'.repeat(40), detail: null }, canRestart: true })
  const readAppUpdate = vi.fn(async () => ({ ok: true as const, data: installed }))
  const applyAppUpdate = vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't read or apply the app update. Try again." } }))
  const { engine, fire } = fakeEngine({ readAppUpdate, applyAppUpdate })
  render(<UpdateControl engine={engine} />)
  await screen.findByText('v1.5.2')
  await act(() => void fireEvent.click(screen.getByRole('button', { name: 'Update' })))
  expect((await screen.findByRole('alert')).textContent).toContain("Couldn't read or apply")
  await act(fire)
  expect(screen.getByRole('alert').textContent).toContain("Couldn't read or apply")
  readAppUpdate.mockResolvedValue({ ok: true, data: view({ state: { phase: 'building', commit: 'c'.repeat(40), detail: null } }) })
  act(fire)
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Building and testing'))
  expect(screen.queryByRole('alert')).toBeNull()
})
it('Update restarts into an installed build while a later push is still building', async () => {
  const { engine } = await setup(view({ installed: { version: '1.5.2', commit: 'b'.repeat(40) }, state: { phase: 'building', commit: 'c'.repeat(40), detail: null }, canRestart: true }))
  const button = screen.getByRole('button', { name: 'Update' }) as HTMLButtonElement
  expect(button.disabled).toBe(false)
  await act(() => void fireEvent.click(button)); expect(engine.applyAppUpdate).toHaveBeenCalledOnce()
})
it('allows a failed status read to be tried again', async () => {
  const { engine } = fakeEngine({ readAppUpdate: vi.fn().mockRejectedValueOnce(new Error('IPC gone')).mockResolvedValue({ ok: true, data: view() }) })
  render(<UpdateControl engine={engine} />)
  const retry = await screen.findByRole('button', { name: 'Retry update' })
  await act(() => void fireEvent.click(retry))
  await waitFor(() => expect(screen.getByText('v1.5.2')).toBeTruthy())
})
