// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'

import type { Note } from '../../../../../shared/notes'
import { t } from '../../../../l10n/en'
import { fakeEngine, note } from '../../../../test_support'
import { NoteHistory } from './note_history'

afterEach(cleanup)
const versions = [{ id: 'new', savedAt: '2026-11-07T10:00:00Z' }, { id: 'old', savedAt: '2026-11-06T10:00:00Z' }]

it('keeps a restore conflict visible when a different snapshot is selected', async () => {
  const { engine } = fakeEngine({ readNoteHistory: async () => ({ ok: true, data: versions }), readNoteVersion: async () => ({ ok: true, data: note({ stamp: 'older' }) }), restoreNoteVersion: async () => ({ ok: true, data: { kind: 'changed', note: note({ stamp: 'outside' }) } }) })
  render(<NoteHistory engine={engine} realm="demo" note={note()} onClose={() => {}} onRestored={() => {}} onRefresh={() => {}} />)
  await screen.findByLabelText(t.notebook.history.preview)
  await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.history.restore })))
  expect((await screen.findByRole('alert')).textContent).toContain(t.notebook.history.changed)
  await act(async () => void fireEvent.click(within(screen.getByRole('list')).getAllByRole('button')[1]!))
  expect(screen.getByRole('alert').textContent).toContain(t.notebook.history.changed)
  expect((screen.getByRole('button', { name: t.notebook.history.restore }) as HTMLButtonElement).disabled).toBe(true)
})

it('keeps keyboard focus in the sheet when restoring disables the focused button', async () => {
  const { engine } = fakeEngine({ readNoteHistory: async () => ({ ok: true, data: versions }), readNoteVersion: async () => ({ ok: true, data: note({ stamp: 'older' }) }), restoreNoteVersion: () => new Promise(() => {}) })
  render(<NoteHistory engine={engine} realm="demo" note={note()} onClose={() => {}} onRestored={() => {}} onRefresh={() => {}} />)
  const preview = await screen.findByLabelText(t.notebook.history.preview)
  const restore = screen.getByRole('button', { name: t.notebook.history.restore })
  restore.focus()
  fireEvent.click(restore)
  await screen.findByText(t.notebook.history.restoring)
  fireEvent.keyDown(window, { key: 'Tab' })
  expect(document.activeElement).toBe(preview)
})

it('selecting the current version again keeps its preview and cannot restore it', async () => {
  const current = note({ body: 'Current text' })
  const { engine } = fakeEngine({ readNoteHistory: async () => ({ ok: true, data: versions }), readNoteVersion: async () => ({ ok: true, data: current }) })
  render(<NoteHistory engine={engine} realm="demo" note={current} onClose={() => {}} onRestored={() => {}} onRefresh={() => {}} />)
  await screen.findByLabelText(t.notebook.history.preview)
  const selected = within(screen.getByRole('list')).getAllByRole('button')[0]!
  fireEvent.click(selected)
  expect(screen.getByLabelText(t.notebook.history.preview).textContent).toBe('Current text')
  expect((screen.getByRole('button', { name: t.notebook.history.restore }) as HTMLButtonElement).disabled).toBe(true)
})

it('a slow preview cannot replace a different version selected afterward', async () => {
  let finishNew!: (answer: { ok: true; data: Note }) => void
  const readNoteVersion = vi.fn((_realm: string, _id: string, version: string) => version === 'new' ? new Promise<{ ok: true; data: Note }>(resolve => { finishNew = resolve }) : Promise.resolve({ ok: true as const, data: note({ body: 'Older text' }) }))
  const { engine } = fakeEngine({ readNoteHistory: async () => ({ ok: true, data: versions }), readNoteVersion })
  render(<NoteHistory engine={engine} realm="demo" note={note()} onClose={() => {}} onRestored={() => {}} onRefresh={() => {}} />)
  await waitFor(() => expect(readNoteVersion).toHaveBeenCalledWith('demo', note().id, 'new'))
  fireEvent.click(within(screen.getByRole('list')).getAllByRole('button')[1]!)
  expect((await screen.findByLabelText(t.notebook.history.preview)).textContent).toBe('Older text')
  await act(async () => finishNew({ ok: true, data: note({ body: 'Newer text' }) }))
  expect(screen.getByLabelText(t.notebook.history.preview).textContent).toBe('Older text')
})

it('Tab wraps inside the sheet and a failed preview cannot trigger restore with ⌘Enter', async () => {
  const { engine } = fakeEngine({ readNoteHistory: async () => ({ ok: true, data: versions }) })
  render(<NoteHistory engine={engine} realm="demo" note={note()} onClose={() => {}} onRestored={() => {}} onRefresh={() => {}} />)
  await screen.findByRole('alert')
  const buttons = within(screen.getByRole('list')).getAllByRole('button')
  const close = screen.getByRole('button', { name: t.notebook.history.close })
  close.focus()
  fireEvent.keyDown(window, { key: 'Tab' })
  expect(document.activeElement).toBe(buttons[0])
  fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
  expect(document.activeElement).toBe(close)
  fireEvent.keyDown(window, { key: 'Enter', metaKey: true })
  expect(engine.restoreNoteVersion).not.toHaveBeenCalled()
})
