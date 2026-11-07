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
  it('History shows loading, an empty history, and returns focus when closed with Esc', async () => {
    const readNoteHistory = vi.fn().mockImplementationOnce(never).mockResolvedValue(ok([]))
    await open({ ...memoryNotes([note()]), readNoteHistory })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.history.open })))
    expect((await screen.findByText(t.notebook.history.loading)).closest('[role="status"]')).toBeTruthy()
    await act(async () => void fireEvent.keyDown(window, { key: 'Escape' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(screen.getByRole('button', { name: t.notebook.history.open }))
    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.history.open })))
    await waitFor(() => expect(readNoteHistory).toHaveBeenCalledTimes(2))
    expect(await screen.findByText(t.notebook.history.empty)).toBeTruthy()
    expect(readNoteHistory).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('button', { name: t.notebook.history.restore })).toBeNull()
  })

  it('saves pending edits before History opens, previews safely, and restores an older version', async () => {
    const notes = memoryNotes([note({ body: 'Before typing', stamp: 'initial' })])
    const older = note({ body: '<img src=x onerror=alert(1)>\nEarlier words', stamp: 'earlier' })
    const version = { id: 'old', savedAt: '2026-11-06T10:00:00Z' }
    const readNoteHistory = vi.fn(async () => ok([version]))
    const restoreNoteVersion = vi.fn(async () => {
      const saved = await notes.saveNote(KEY, older.id, older)
      return saved
    })
    await open({ ...notes, readNoteHistory, readNoteVersion: async () => ok(older), restoreNoteVersion })
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('Pending words')
    await press(t.notebook.history.open)
    expect(notes.saveNote).toHaveBeenCalledWith(KEY, older.id, expect.objectContaining({ body: 'Pending words' }), 'initial')
    const sheet = within(await screen.findByRole('dialog'))
    const preview = await sheet.findByLabelText(t.notebook.history.preview)
    expect(preview.textContent).toBe(older.body)
    expect(preview.querySelector('img')).toBeNull()
    await press(t.notebook.history.restore)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(restoreNoteVersion).toHaveBeenCalledWith(KEY, older.id, 'old', 's-1')
    expect(body().value).toBe(older.body)
    expect(screen.getByText(t.notebook.history.restored)).toBeTruthy()
  })

  it('retries a failed history read and a failed preview, then reports a failed restore and retries it', async () => {
    const older = note({ body: 'Older', stamp: 'old' })
    const version = { id: 'old', savedAt: '2026-11-06T10:00:00Z' }
    const readNoteHistory = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'History could not be read.' } }).mockResolvedValue(ok([version]))
    const readNoteVersion = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Preview could not be read.' } }).mockResolvedValue(ok(older))
    const restoreNoteVersion = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Restore failed.' } }).mockImplementation(never)
    await open({ ...memoryNotes([note()]), readNoteHistory, readNoteVersion, restoreNoteVersion })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(t.notebook.history.open)
    expect((await screen.findByRole('alert')).textContent).toContain('History could not be read.')
    await press(t.failed.tryAgain)
    expect((await screen.findByRole('alert')).textContent).toContain('Preview could not be read.')
    await press(t.failed.tryAgain)
    await screen.findByLabelText(t.notebook.history.preview)
    await press(t.notebook.history.restore)
    expect((await screen.findByRole('alert')).textContent).toContain('Restore failed.')
    await press(t.notebook.history.restore)
    expect(screen.getByText(t.notebook.history.restoring).closest('[role="status"]')).toBeTruthy()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('a restore conflict keeps the current text and asks for another review before restoring', async () => {
    const older = note({ body: 'Older', stamp: 'old' })
    const restoreNoteVersion = vi.fn(async () => ok({ kind: 'changed' as const, note: note({ body: 'Changed outside', stamp: 'outside' }) }))
    await open({ ...memoryNotes([note({ body: 'Current' })]), readNoteHistory: async () => ok([{ id: 'old', savedAt: '2026-11-06T10:00:00Z' }]), readNoteVersion: async () => ok(older), restoreNoteVersion })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(t.notebook.history.open)
    const sheet = within(await screen.findByRole('dialog'))
    await sheet.findByLabelText(t.notebook.history.preview)
    await press(t.notebook.history.restore)
    expect((await screen.findByRole('alert')).textContent).toContain(t.notebook.history.changed)
    expect(body().value).toBe('Current')
    expect((screen.getByRole('button', { name: t.notebook.history.restore }) as HTMLButtonElement).disabled).toBe(true)
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
  })

  it('is the seventh tab, and says what it is reading while the notes load', async () => {
    await open({ readNotes: never })

    expect(screen.getByRole('link', { name: t.nav.notes }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByText(t.loading.notes).closest('[role="status"]')).toBeTruthy()
  })

  it('says why the notes could not be read, and reads them again', async () => {
    const notes = memoryNotes([note()])
    const readNotes = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: "Couldn't read this realm's notes." } }).mockImplementation(notes.readNotes)
    await open({ ...notes, readNotes })

    expect((await screen.findByRole('alert')).textContent).toContain("Couldn't read this realm's notes.")
    await press(t.failed.tryAgain)
    expect(await screen.findByDisplayValue('Bug Bounty Helper')).toBeTruthy()
  })

  it('with no notes yet, says where they will live, and a jotted line becomes one', async () => {
    const notes = memoryNotes([])
    await open(notes)

    expect(await screen.findByText(t.notebook.emptyTitle('a'))).toBeTruthy()
    expect(screen.getByText(t.notebook.emptyWhere(FOLDER))).toBeTruthy()
    expect(screen.getByText(t.notebook.captureHint)).toBeTruthy()
    const capture = screen.getByLabelText(t.notebook.capture) as HTMLInputElement
    await act(async () => void fireEvent.submit(capture.closest('form')!))
    expect(document.getElementById(capture.getAttribute('aria-describedby')!)?.textContent).toBe(t.notebook.captureEmpty)

    fireEvent.input(capture, { target: { value: 'Try a [[graph]] view' } })
    await act(async () => void fireEvent.submit(capture.closest('form')!))
    expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Try a graph view', folder: 'Inbox', body: 'Try a [[graph]] view' })
    await waitFor(() => expect(capture.value).toBe(''))

    fireEvent.input(capture, { target: { value: 'Open this one' } })
    await act(async () => void fireEvent.keyDown(capture, { key: 'Enter', metaKey: true }))
    expect(await screen.findByDisplayValue('Open this one')).toBeTruthy()
  })

  it('⌘J puts the cursor in the capture line, and ⌘F in search', async () => {
    await open(memoryNotes([note()]))
    await screen.findByDisplayValue('Bug Bounty Helper')

    fireEvent.keyDown(window, { key: 'j', metaKey: true })
    expect(document.activeElement).toBe(screen.getByLabelText(t.notebook.capture))
    fireEvent.keyDown(window, { key: 'f', metaKey: true })
    expect(document.activeElement).toBe(screen.getByLabelText(t.notebook.search))
  })

  it('a title another note has is refused under the field, and Esc puts the saved one back', async () => {
    await open(memoryNotes([note({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]))
    const title = (await screen.findByDisplayValue('Alpha')) as HTMLInputElement

    fireEvent.input(title, { target: { value: 'beta' } })
    fireEvent.blur(title)
    expect(document.getElementById(title.getAttribute('aria-describedby')!)?.textContent).toBe(t.notebook.titleTaken('beta'))
    fireEvent.keyDown(title, { key: 'Escape' })
    expect(title.value).toBe('Alpha')
    expect(title.getAttribute('aria-invalid')).toBeNull()
  })

  it('edits that could not be saved come back when the note is opened again', async () => {
    const notes = memoryNotes([note({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })])
    const saveNote = vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't save this note." } }))
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Alpha')

    write('Words not yet saved')
    await press(/^Beta/)
    await screen.findByDisplayValue('Beta')
    expect(await screen.findByText(t.notebook.notSavedRow)).toBeTruthy()
    await press(/^Alpha/)

    expect(body().value).toBe('Words not yet saved')
  })

  it('opens the newest note, and saves what is typed a moment after typing stops', async () => {
    const notes = memoryNotes([note({ id: 'old', title: 'Old', updated: '2026-11-01T00:00:00' }), note({ id: 'new', title: 'New', updated: '2026-11-06T00:00:00' })])
    await open(notes)
    await screen.findByDisplayValue('New')

    write('Hello')
    expect(screen.getByText(t.notebook.unsaved)).toBeTruthy()
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'new', { title: 'New', folder: 'Ideas', type: null, isPinned: false, tags: [], body: 'Hello' }, 's-1'), { timeout: 2000 })
    expect(await screen.findByText(/^Saved/)).toBeTruthy()
  })

  it('typing back to what is saved needs no save, and says Saved', async () => {
    const notes = memoryNotes([note({ body: 'Same' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    write('Samex')
    write('Same')
    expect(await screen.findByText(/^Saved/, {}, { timeout: 2000 })).toBeTruthy()
    expect(notes.saveNote).not.toHaveBeenCalled()
  })

  it('a blank title shows its error under the field and is never saved', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    const title = (await screen.findByDisplayValue('Bug Bounty Helper')) as HTMLInputElement

    fireEvent.input(title, { target: { value: '  ' } })
    fireEvent.blur(title)

    expect(document.getElementById(title.getAttribute('aria-describedby')!)?.textContent).toBe('Title is required.')
    write('Still saves the text')
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalled(), { timeout: 2000 })
    expect(notes.saveNote.mock.calls[0]![2].title).toBe('Bug Bounty Helper')
  })

  it('when the file changed outside, stops and asks which version to keep', async () => {
    const theirs = note({ body: 'Their words', stamp: 's-theirs' })
    const notes = memoryNotes([note()])
    const saveNote = vi.fn(async () => ok({ kind: 'changed' as const, note: theirs }))
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')

    write('My words')
    expect(await screen.findByText(t.notebook.changedTitle, {}, { timeout: 2000 })).toBeTruthy()
    await press(t.notebook.loadTheirs)

    expect(body().value).toBe('Their words')
    expect(screen.queryByText(t.notebook.changedTitle)).toBeNull()
  })

  it('a failed save says so where the saving happens, and tries again', async () => {
    const notes = memoryNotes([note()])
    const saveNote = vi.fn().mockResolvedValueOnce({ ok: false, error: { message: "Couldn't save this note. Your text is still here. Try again." } }).mockImplementation(notes.saveNote)
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')

    write('Words')
    expect((await screen.findByText(/Couldn't save this note/, {}, { timeout: 2000 })).closest('[role="alert"]')).toBeTruthy()
    await press(t.failed.tryAgain)
    expect(await screen.findByText(/^Saved/)).toBeTruthy()
  })

  it('typing [[ offers the realm’s other notes, and Enter links one', async () => {
    await open(memoryNotes([note({ id: 'here', title: 'Here', updated: '2026-11-08' }), note({ id: 'plan', title: 'Plan', folder: 'Research' }), note({ id: 'other', title: 'Other' })]))
    await screen.findByDisplayValue('Here')

    write('See [[pl')
    const picker = screen.getByRole('listbox', { name: t.notebook.linkPicker })
    expect(within(picker).getAllByRole('option').map(option => [...option.children].map(part => part.textContent))).toEqual([['Plan', 'Research']])
    fireEvent.keyDown(body(), { key: 'Enter' })

    expect(body().value).toBe('See [[Plan]]')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('shows links, broken links with a way to make the note, and backlinks', async () => {
    const notes = memoryNotes([note({ id: 'here', title: 'Here', body: '[[Plan]] and [[Missing]]', updated: '2026-11-08' }), note({ id: 'plan', title: 'Plan' }), note({ id: 'fan', title: 'Fan', body: 'I like [[here]]' })])
    await open(notes)
    await screen.findByDisplayValue('Here')

    const about = screen.getByRole('complementary', { name: t.notebook.inspector })
    expect(within(about).getByRole('button', { name: 'Plan' })).toBeTruthy()
    expect(within(about).getByText(t.notebook.broken('Missing'))).toBeTruthy()
    expect(within(about).getByRole('button', { name: 'Fan' })).toBeTruthy()
    await press(t.notebook.makeIt)
    expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Missing', folder: 'Ideas', body: '' })
  })

  it('BrewQuest drafts quests from the checklist, checks them, and files only what you keep', async () => {
    const notes = memoryNotes([note({ body: 'A helper.\n\n- [ ] Scan\n- [ ] Report\n- [x] Done' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await screen.findByRole('dialog', { name: t.notebook.brew.sheet('Bug Bounty Helper') })
    expect((within(sheet).getByLabelText(`${t.notebook.brew.parent} *`) as HTMLInputElement).value).toBe('Bug Bounty Helper')
    const second = within(sheet).getByLabelText(`${t.notebook.brew.questTitle(2)} *`)
    fireEvent.input(second, { target: { value: '' } })
    fireEvent.blur(second)
    expect(within(sheet).getByText(t.notebook.brew.questTitleRequired)).toBeTruthy()

    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
    fireEvent.click(within(sheet).getByLabelText(t.notebook.brew.include(2)))
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(2) })))

    expect(notes.fileNoteQuests).toHaveBeenCalledWith(KEY, 'n-00000001', { parent: { kind: 'new', title: 'Bug Bounty Helper' }, quests: [{ title: 'Scan', priority: 'mid', difficulty: 'medium', item: 'Scan' }] })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(await screen.findByText(t.notebook.brew.filed(2))).toBeTruthy()
    expect(screen.getByRole('button', { name: t.notebook.openQuest('Scan') })).toBeTruthy()
    expect(screen.getByText(t.notebook.questState.waiting)).toBeTruthy()
  })

  it('BrewQuest says why filing failed, in its sheet, locks what went in, and tries again for the rest', async () => {
    const notes = memoryNotes([note({ body: '- [ ] Scan\n- [ ] Report' })])
    // The first quest goes in before the queue fails, as main links each one as it's filed.
    const fileNoteQuests = vi.fn().mockImplementationOnce(async (key: string, id: string, proposal: QuestProposal) => {
      await notes.fileNoteQuests(key, id, { ...proposal, quests: proposal.quests.slice(0, 1) })

      return { ok: false, error: { message: "Couldn't file the quests." } }
    }).mockImplementation(notes.fileNoteQuests)
    await open({ ...notes, fileNoteQuests })
    await screen.findByDisplayValue('Bug Bounty Helper')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await screen.findByRole('dialog')
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))

    expect((await within(sheet).findByRole('alert')).textContent).toBe("Couldn't file the quests.")
    // The parent and the first quest went in; both lock.
    expect(await within(sheet).findAllByText(t.notebook.brew.filedRow)).toHaveLength(2)
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.tryAgain })))
    expect(fileNoteQuests.mock.calls[1]![2].quests.map((q: { title: string }) => q.title)).toEqual(['Report'])
  })

  it('archives a note, and deletes it forever only from Archived, after asking', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    await press(t.notebook.archiveNote)
    await waitFor(() => expect(notes.archiveNote).toHaveBeenCalledWith(KEY, 'n-00000001', true))
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: t.notebook.archived(1) })))
    await act(async () => void fireEvent.click(await screen.findByRole('button', { name: /Bug Bounty Helper/ })))
    expect(screen.getByText(t.notebook.archivedLine)).toBeTruthy()
    await press(t.notebook.deleteForever)
    const dialog = screen.getByRole('dialog', { name: t.notebook.deleteTitle('Bug Bounty Helper') })
    expect(document.activeElement?.textContent).toBe(t.actions.cancel)
    await act(async () => void fireEvent.click(within(dialog).getByRole('button', { name: t.notebook.deleteIt })))

    expect(notes.deleteNote).toHaveBeenCalledWith(KEY, 'n-00000001')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('⌘E turns the note over to Read: Markdown drawn, HTML shown as text, and a box ticked saves the Markdown', async () => {
    const md = ['# Plan', '', 'See [[Other|the other]], [[Missing]] and [site](https://example.com). <img src=x onerror=alert(1)>', '', '- [ ] Scan', '- [x] Done', '', '> [!warning] Careful', '> Mind the gap', '', '| a | b |', '|---|---|', '| 1 | 2 |', '', '```', '<b>code</b>', '```', '', '![pic](https://example.com/p.png)'].join('\n')
    const notes = memoryNotes([note({ id: 'here', title: 'Here', body: md, updated: '2026-11-08' }), note({ id: 'other', title: 'Other' })])
    const openLink = vi.fn(async () => ok(null))
    await open({ ...notes, openLink })
    await screen.findByDisplayValue('Here')

    fireEvent.keyDown(window, { key: 'e', metaKey: true })
    const read = document.querySelector('.nt-read')!
    expect(screen.queryByRole('combobox', { name: t.notebook.body })).toBeNull()
    expect(within(read as HTMLElement).getByRole('heading', { name: 'Plan' })).toBeTruthy()
    expect(read.querySelector('table td')?.textContent).toBe('1')
    expect(within(read as HTMLElement).getByText('Careful')).toBeTruthy()
    expect(read.querySelector('pre code')?.textContent).toBe('<b>code</b>')
    expect(read.querySelector('img, b')).toBeNull()
    expect(read.textContent).toContain('<img src=x onerror=alert(1)>')

    await act(async () => void fireEvent.click(within(read as HTMLElement).getByRole('link', { name: 'site' })))
    expect(openLink).toHaveBeenCalledWith('https://example.com')
    await act(async () => void fireEvent.click(within(read as HTMLElement).getByRole('link', { name: /pic/ })))
    expect(openLink).toHaveBeenLastCalledWith('https://example.com/p.png')

    fireEvent.click(within(read as HTMLElement).getByLabelText(t.notebook.taskBox('Scan')))
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalled(), { timeout: 2000 })
    expect(notes.saveNote.mock.calls[0]![2].body).toContain('- [x] Scan')

    await press('the other')
    expect(await screen.findByDisplayValue('Other')).toBeTruthy()
    expect(screen.getByRole('button', { name: t.notebook.read }).getAttribute('aria-pressed')).toBe('true')
  })

  it('an archived note reads, with its boxes not tickable and no Write', async () => {
    await open(memoryNotes([note({ body: '- [ ] Scan', isArchived: true })]))
    await press(await screen.findByRole('button', { name: t.notebook.archived(1) }).then(b => b.textContent!))
    await press(/^Bug Bounty Helper/)

    expect((screen.getByLabelText(t.notebook.taskBox('Scan')) as HTMLInputElement).disabled).toBe(true)
    expect(screen.queryByRole('button', { name: t.notebook.write })).toBeNull()
  })

  it('search narrows the list, and says what to try when nothing matches', async () => {
    await open(memoryNotes([note({ id: 'a', title: 'Alpha', tags: ['security'] }), note({ id: 'b', title: 'Beta' })]))
    await screen.findByRole('button', { name: /Beta/ })
    const search = screen.getByLabelText(t.notebook.search)

    fireEvent.input(search, { target: { value: '#security' } })
    expect(screen.queryByRole('button', { name: /^Beta/ })).toBeNull()
    fireEvent.input(search, { target: { value: 'zzz' } })
    expect(screen.getByText(t.notebook.noMatch('zzz'))).toBeTruthy()
  })

  it('below 900 px the note fills the page, and Notes opens the list as a drawer that Esc and picking close', async () => {
    window.innerWidth = 700
    await open(memoryNotes([note({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]))
    await screen.findByDisplayValue('Alpha')
    expect(screen.queryByLabelText(t.notebook.search)).toBeNull()

    await press(t.notebook.showList)
    expect(document.activeElement).toBe(screen.getByLabelText(t.notebook.capture))
    fireEvent.keyDown(screen.getByLabelText(t.notebook.capture), { key: 'Escape' })
    expect(screen.queryByLabelText(t.notebook.search)).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: t.notebook.showList })))

    await press(t.notebook.showList)
    await press(/^Beta/)
    expect(await screen.findByDisplayValue('Beta')).toBeTruthy()
    expect(screen.queryByLabelText(t.notebook.search)).toBeNull()
  })

  it('from 900 to 1,179 px the inspector floats behind Details, and Esc puts it away', async () => {
    window.innerWidth = 1000
    await open(memoryNotes([note()]))
    await screen.findByDisplayValue('Bug Bounty Helper')
    expect(screen.queryByRole('complementary', { name: t.notebook.inspector })).toBeNull()

    await press(t.notebook.details)
    const about = screen.getByRole('complementary', { name: t.notebook.inspector })
    fireEvent.keyDown(within(about).getByLabelText(t.notebook.tags), { key: 'Escape' })
    expect(screen.queryByRole('complementary', { name: t.notebook.inspector })).toBeNull()
  })

  it('⇧⌘N from another screen opens Notes on a new Untitled note in Inbox', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    await act(async () => void (window.location.hash = '#/quests'))
    await waitFor(() => expect(screen.queryByLabelText(t.notebook.search)).toBeNull())

    await act(async () => void fireEvent.keyDown(window, { key: 'N', metaKey: true, shiftKey: true }))

    await waitFor(() => expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Untitled', folder: 'Inbox', body: '' }))
    expect(await screen.findByDisplayValue('Untitled')).toBeTruthy()
    expect(window.location.hash).toBe('#/notes')
  })

  it('folders fold, and the arrow keys move between notes and fold them', async () => {
    await open(memoryNotes([note({ id: 'a', title: 'Alpha', folder: 'Inbox', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta', folder: 'Inbox' }), note({ id: 'c', title: 'Gamma', folder: 'Research' })]))
    await screen.findByDisplayValue('Alpha')
    const alpha = screen.getByRole('button', { name: /^Alpha/ })

    expect(alpha.tabIndex).toBe(0)
    expect(screen.getByRole('button', { name: /^Beta/ }).tabIndex).toBe(-1)
    alpha.focus()
    fireEvent.keyDown(alpha, { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toMatch(/^Beta/)
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    expect(screen.queryByRole('button', { name: /^Beta/ })).toBeNull()
    expect(screen.getByRole('button', { name: /Inbox/ }).getAttribute('aria-expanded')).toBe('false')
    await press(/Inbox/)
    expect(screen.getByRole('button', { name: /^Beta/ })).toBeTruthy()
  })

  it('a note that can’t be read shows where it was looking, with Try again and Show in Finder', async () => {
    const notes = memoryNotes([note()])
    const readNotes = vi.fn().mockResolvedValue({ ok: false, error: { message: "Queue-tea couldn't open this realm's folder." } })
    const showNotes = vi.fn(async () => ok(null))
    await open({ ...notes, readNotes, showNotes })

    expect(await screen.findByText(t.notebook.failedTitle('a'))).toBeTruthy()
    await press(t.notebook.showInFinder)
    expect(showNotes).toHaveBeenCalledWith(KEY)
  })

  it('BrewQuest’s card counts what it can do, and the inspector shows the saga after filing', async () => {
    const notes = memoryNotes([note({ body: '- [ ] Scan\n- [ ] Report' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    expect(screen.getByText(t.notebook.brew.canBe(2))).toBeTruthy()

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText(t.notebook.brew.fromLine(1))).toBeTruthy()
    expect(within(sheet).getByText(t.notebook.brew.totalWithParent(3, 'a', 2))).toBeTruthy()
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))

    await waitFor(() => expect(screen.getByText(t.notebook.brew.allFiled(3))).toBeTruthy())
    expect(screen.getByText(t.notebook.saga(0, 2))).toBeTruthy()
  })
})
