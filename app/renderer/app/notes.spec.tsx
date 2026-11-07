// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, Reply } from '../../shared/engine_api'
import { NOTE_TYPES } from '../../shared/notes'
import type { Note, NoteChange, NoteFiled, NoteInput, NotesView, QuestProposal } from '../../shared/notes'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { fakeEngine, note, projectView, quest } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const FOLDER = '/Users/me/.queue-tea/notes/a-000001'
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })
const never = <T,>() => new Promise<T>(() => {})

// The notes a test works on, changed as main would change them.
const memoryNotes = (start: Note[]) => {
  let notes = start
  let n = 0
  const view = (): NotesView => ({ notes, unreadable: [], folder: FOLDER })

  return {
    readNotes: vi.fn(async () => ok(view())),
    createNote: vi.fn(async (_key: string, input: NoteInput) => {
      n += 1
      const made = note({ id: `n-new${n}`, ...input, stamp: `new-${n}`, updated: '2026-11-07T12:00:00+01:00' })
      notes = [made, ...notes]

      return ok({ view: view(), id: made.id })
    }),
    saveNote: vi.fn(async (_key: string, id: string, change: NoteChange) => {
      n += 1
      const saved = { ...notes.find(one => one.id === id)!, ...change, stamp: `s-${n}` }
      notes = notes.map(one => (one.id === id ? saved : one))

      return ok({ kind: 'saved' as const, view: view(), note: saved, relinked: 0 })
    }),
    archiveNote: vi.fn(async (_key: string, id: string, isArchived: boolean) => {
      notes = notes.map(one => (one.id === id ? { ...one, isArchived, stamp: `a-${id}` } : one))

      return ok(view())
    }),
    renameFolder: vi.fn(async (_key: string, from: string, to: string) => {
      n += 1
      notes = notes.map(one => (one.folder === from ? { ...one, folder: to, stamp: `r-${n}-${one.id}` } : one))

      return ok(view())
    }),
    deleteNote: vi.fn(async (_key: string, id: string) => {
      notes = notes.filter(one => one.id !== id)

      return ok(view())
    }),
    fileNoteQuests: vi.fn(async (key: string, id: string, proposal: QuestProposal): Promise<Reply<NoteFiled>> => {
      const parent = proposal.parent.kind === 'new' && !notes.find(one => one.id === id)!.quests.some(q => q.item === null) ? [{ id: 't-parent', item: null }] : []
      notes = notes.map(one => (one.id === id ? { ...one, quests: [...one.quests, ...parent, ...proposal.quests.map(q => ({ id: `t-${q.item}`, item: q.item }))], stamp: `filed-${one.quests.length}` } : one))

      return ok({ view: view(), project: projectView(key, { ready: proposal.quests.map(q => ({ kind: 'quest' as const, quest: quest({ id: `t-${q.item}`, title: q.title }) })) }) })
    }),
  }
}

const open = async (over: Partial<EngineApi> = {}) => {
  window.location.hash = '#/notes'
  const { engine } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return engine
}

const press = (name: string | RegExp) => act(async () => void fireEvent.click(screen.getByRole('button', { name })))
const body = () => screen.getByLabelText(t.notebook.body, { selector: 'textarea' }) as HTMLTextAreaElement
const write = (text: string) => {
  const box = body()
  box.focus()
  fireEvent.input(box, { target: { value: text, selectionStart: text.length, selectionEnd: text.length } })
}

afterEach(() => {
  cleanup()
  window.innerWidth = 1280
})

describe('the Notes page', () => {
  })

  it.each(NOTE_TYPES)('starts an empty note from the %s template and saves its type', async type => {
    const notes = memoryNotes([note({ title: 'My note', folder: 'Plans' })])
    await open(notes)
    await screen.findByDisplayValue('My note')

    const templates = screen.getByRole('group', { name: t.notebook.templatesLabel })
    await act(async () => void fireEvent.click(within(templates).getByRole('button', { name: t.notebook.types[type] })))

    expect(body().value).toBe(t.notebook.templates[type])
    expect((screen.getByLabelText(t.notebook.type) as HTMLSelectElement).value).toBe(type)
    expect((screen.getByLabelText(t.notebook.folder) as HTMLInputElement).value).toBe('Plans')
    expect(screen.queryByRole('group', { name: t.notebook.templatesLabel })).toBeNull()
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ type, folder: 'Plans', body: t.notebook.templates[type] }), 's-1'), { timeout: 2000 })
  })

  it('changing or clearing the type keeps existing text and the folder', async () => {
    const notes = memoryNotes([note({ type: 'idea', body: 'Keep my words', folder: 'Plans' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    expect(screen.queryByRole('group', { name: t.notebook.templatesLabel })).toBeNull()
    const type = screen.getByLabelText(t.notebook.type)

    fireEvent.change(type, { target: { value: 'bug' } })
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ type: 'bug', body: 'Keep my words', folder: 'Plans' }), 's-1'), { timeout: 2000 })
    fireEvent.change(type, { target: { value: '' } })
    await waitFor(() => expect(notes.saveNote).toHaveBeenLastCalledWith(KEY, 'n-00000001', expect.objectContaining({ type: null, body: 'Keep my words', folder: 'Plans' }), expect.any(String)), { timeout: 2000 })
    expect(body().value).toBe('Keep my words')
    expect(screen.queryByRole('group', { name: t.notebook.templatesLabel })).toBeNull()
  })

  it('pins at once into Pinned, folds that group, and unpins back to its folder', async () => {
    const notes = memoryNotes([note(), note({ id: 'other', title: 'Other', folder: 'Ideas' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    await press(t.notebook.pin)
    expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ isPinned: true }), 's-1')
    const pinned = await screen.findByRole('region', { name: t.notebook.pinned })
    expect(within(pinned).getByRole('button', { name: /^Bug Bounty Helper/ }).textContent).toContain('Ideas')
    expect(screen.getAllByRole('button', { name: /^Bug Bounty Helper/ })).toHaveLength(1)
    await press(/^Pinned 1/)
    expect(within(pinned).queryByRole('button', { name: /^Bug Bounty Helper/ })).toBeNull()
    await press(/^Pinned 1/)
    await press(t.notebook.unpin)

    await waitFor(() => expect(screen.queryByRole('region', { name: t.notebook.pinned })).toBeNull())
    expect(within(screen.getByRole('region', { name: 'Ideas' })).getByRole('button', { name: /^Bug Bounty Helper/ })).toBeTruthy()
  })

  it('a failed pin save keeps the text and offers Retry', async () => {
    const notes = memoryNotes([note({ body: 'Keep this' })])
    const saveNote = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Could not save the pin.' } }).mockImplementation(notes.saveNote)
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')

    await press(t.notebook.pin)
    expect((await screen.findByRole('alert')).textContent).toContain('Could not save the pin.')
    expect(body().value).toBe('Keep this')
    await press(t.failed.tryAgain)
    expect(await screen.findByRole('region', { name: t.notebook.pinned })).toBeTruthy()
  })

  it('saves the open note before renaming its folder and adopts the new folder for later edits', async () => {
    const notes = memoryNotes([note({ folder: 'Ideas' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('Unsaved words')
    await press(t.notebook.renameFolderLabel('Ideas'))
    const dialog = screen.getByRole('dialog', { name: t.notebook.renameTitle('Ideas') })
    fireEvent.input(within(dialog).getByLabelText(`${t.notebook.folderName} *`), { target: { value: 'Plans' } })
    await act(async () => void fireEvent.submit(dialog))

    expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ body: 'Unsaved words' }), 's-1')
    await waitFor(() => expect(notes.renameFolder).toHaveBeenCalledWith(KEY, 'Ideas', 'Plans'))
    expect(notes.saveNote.mock.invocationCallOrder[0]).toBeLessThan(notes.renameFolder.mock.invocationCallOrder[0]!)
    await waitFor(() => expect((screen.getByLabelText(t.notebook.folder) as HTMLInputElement).value).toBe('Plans'))
    write('Later words')
    await waitFor(() => expect(notes.saveNote).toHaveBeenLastCalledWith(KEY, 'n-00000001', expect.objectContaining({ body: 'Later words', folder: 'Plans' }), expect.stringMatching(/^r-/)), { timeout: 2000 })
  })

  it('checks folder names on blur and submit, and does not rename Inbox', async () => {
    const notes = memoryNotes([note(), note({ id: 'inbox', title: 'Inbox note', folder: 'Inbox' })])
    await open(notes)
    await screen.findByDisplayValue('Inbox note')
    expect(screen.queryByRole('button', { name: t.notebook.renameFolderLabel('Inbox') })).toBeNull()
    await press(t.notebook.renameFolderLabel('Ideas'))
    const dialog = screen.getByRole('dialog')
    const field = within(dialog).getByLabelText(`${t.notebook.folderName} *`)
    fireEvent.input(field, { target: { value: 'a/b' } })
    fireEvent.blur(field)
    expect(within(dialog).getByText(t.notebook.folderSlash)).toBeTruthy()
    fireEvent.input(field, { target: { value: ' ' } })
    await act(async () => void fireEvent.submit(dialog))
    expect(within(dialog).getByText(t.notebook.folderRequired)).toBeTruthy()
    expect(notes.renameFolder).not.toHaveBeenCalled()
  })

  it('can rename a folder whose notes are all pinned', async () => {
    const notes = memoryNotes([note({ isPinned: true })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    await press(t.notebook.renameFolderLabel('Ideas'))
    const dialog = screen.getByRole('dialog')
    fireEvent.input(within(dialog).getByLabelText(`${t.notebook.folderName} *`), { target: { value: 'Plans' } })
    await act(async () => void fireEvent.submit(dialog))

    await waitFor(() => expect(notes.renameFolder).toHaveBeenCalledWith(KEY, 'Ideas', 'Plans'))
    expect(await screen.findByDisplayValue('Plans')).toBeTruthy()
    expect(within(screen.getByRole('region', { name: t.notebook.pinned })).getByRole('button', { name: /^Bug Bounty Helper/ }).textContent).toContain('Plans')
  })

  it('leaves the rename dialog open when saving the open note fails', async () => {
    const notes = memoryNotes([note()])
    const saveNote = vi.fn(async () => ({ ok: false as const, error: { message: 'Cannot save.' } }))
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('Keep these unsaved words')
    await press(t.notebook.renameFolderLabel('Ideas'))
    const dialog = screen.getByRole('dialog')
    fireEvent.input(within(dialog).getByLabelText(`${t.notebook.folderName} *`), { target: { value: 'Plans' } })
    await act(async () => void fireEvent.submit(dialog))

    expect((await within(dialog).findByRole('alert')).textContent).toBe(t.notebook.openNotSaved)
    expect(notes.renameFolder).not.toHaveBeenCalled()
    expect(body().value).toBe('Keep these unsaved words')
  })

  it('shows a failed rename in its dialog and lets the same request be retried', async () => {
    const notes = memoryNotes([note()])
    const renameFolder = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Could not rename.' } }).mockImplementation(notes.renameFolder)
    await open({ ...notes, renameFolder })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(t.notebook.renameFolderLabel('Ideas'))
    const dialog = screen.getByRole('dialog')
    fireEvent.input(within(dialog).getByLabelText(`${t.notebook.folderName} *`), { target: { value: 'Plans' } })
    await act(async () => void fireEvent.submit(dialog))
    expect((await within(dialog).findByRole('alert')).textContent).toBe('Could not rename.')
    await act(async () => void fireEvent.submit(dialog))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(screen.getByRole('region', { name: 'Plans' })).toBeTruthy()
