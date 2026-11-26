// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, Reply } from '../../shared/engine_api'
import { NO_MEETING } from '../../shared/meetings'
import { checklistDraftOf } from '../../shared/brew_draft'
import type { BrewDraft, DraftQuest, RealmQuest } from '../../shared/brew_draft'
import { isOwnQuest, NOTE_TYPES } from '../../shared/notes'
import type { Note, NoteChange, NoteFiled, NoteInput, NoteQuest, NotesExport, NotesRestore, NotesView, QuestProposal } from '../../shared/notes'
import type { LayoutInput, Point } from '../features/notes/domain/note_graph_layout'
import type { LayoutRun } from '../features/notes/presentation/state_management/graph_layout'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { fakeEngine, note, projectRow, projectView, quest } from '../test_support'
import { App } from './app'

// The graph is laid out at once, with no worker: the centre (or the first note
// for the whole realm) at (0, 0), and the others, by id, at (100, 0),
// (-100, 0), (0, 100) and (0, -100). Every layout asked for is kept, newest last.
const layouts = vi.hoisted((): LayoutInput[] => [])
vi.mock('../features/notes/presentation/state_management/graph_layout', async () => {
  const actual = await vi.importActual<typeof import('../features/notes/presentation/state_management/graph_layout')>('../features/notes/presentation/state_management/graph_layout')
  const spots: Point[] = [{ x: 100, y: 0 }, { x: -100, y: 0 }, { x: 0, y: 100 }, { x: 0, y: -100 }]
  const workerLayout: LayoutRun = input => {
    layouts.push(input)
    const centre = input.centre ?? input.ids[0]!
    const others = input.ids.filter(id => id !== centre).sort()
    const points = new Map<string, Point>([[centre, { x: 0, y: 0 }], ...others.map((id, i): [string, Point] => [id, spots[i] ?? { x: 0, y: 100 * i }])])

    return { done: Promise.resolve(points), cancel: () => {} }
  }

  return { ...actual, workerLayout }
})

const KEY = 'a-000001'
const FOLDER = '/Users/me/.queue-tea/notes/a-000001'
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })
const never = <T,>() => new Promise<T>(() => {})

// The notes a test works on, changed as main would change them.
const memoryNotes = (start: Note[]) => {
  let notes = start
  let n = 0
  // The quests filed so far, all still waiting, so BrewQuest's checklist draft sees their parents open.
  const realm: RealmQuest[] = []
  const filedQuest = (id: string, title: string) => realm.push({ id, title, state: 'queued', parentIds: [], priority: 'mid', description: null })
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
      const current = notes.find(one => one.id === id)!
      const linked: NoteQuest[] = []
      const filed: { id: string; title: string }[] = []
      for (const group of proposal.groups) {
        let under = group.parent.kind === 'task' ? group.parent.id : null
        if (group.parent.kind === 'new') {
          const own = current.quests.find(isOwnQuest)
          under = own?.id ?? 't-parent'
          if (own === undefined) {
            linked.push(group.key === undefined ? { id: 't-parent', item: null } : { id: 't-parent', item: null, key: group.key, under: null })
            filedQuest('t-parent', group.parent.title)
          }
        }
        for (const q of group.quests) {
          const questId = `t-${q.key ?? q.item}`
          linked.push(q.key === undefined ? { id: questId, item: q.item } : { id: questId, item: q.item, key: q.key, under })
          filed.push({ id: questId, title: q.title })
          filedQuest(questId, q.title)
        }
      }
      notes = notes.map(one => (one.id === id ? { ...one, quests: [...one.quests, ...linked], stamp: `filed-${one.quests.length}` } : one))

      return ok({ view: view(), project: projectView(key, { ready: filed.map(q => ({ kind: 'quest' as const, quest: quest({ id: q.id, title: q.title }) })) }), waitsLeftOut: 0 })
    }),
    // Main falls back to the checklist when Claude can't read; here it always does.
    draftNoteQuests: vi.fn(async (_key: string, id: string) => ok(checklistDraftOf('d-test0001', notes.find(one => one.id === id)!, realm))),
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

// BrewQuest's sheet once its draft is in: it opens reading, and reviews when the read comes back.
const brewSheet = async (name?: string) => {
  const sheet = await screen.findByRole('dialog', name === undefined ? {} : { name })
  await waitFor(() => expect(within(sheet).queryByText(t.notebook.brew.reading)).toBeNull())

  return sheet
}
const press = (name: string | RegExp) => act(async () => void fireEvent.click(screen.getByRole('button', { name })))
const body = () => screen.getByLabelText(t.notebook.body, { selector: 'textarea' }) as HTMLTextAreaElement
const write = (text: string) => {
  const box = body()
  box.focus()
  fireEvent.input(box, { target: { value: text, selectionStart: text.length, selectionEnd: text.length } })
}

const brewTransfer = () => {
  const data = new Map<string, string>()

  return {
    get types() { return [...data.keys()] },
    files: [],
    effectAllowed: 'uninitialized',
    dropEffect: 'none',
    setData: (type: string, value: string) => data.set(type, value),
    getData: (type: string) => data.get(type) ?? '',
  }
}

const dragBrew = () => {
  const dataTransfer = brewTransfer()
  const robot = screen.getByLabelText('Drag BrewQuest onto a note')
  fireEvent.dragStart(robot, { dataTransfer })

  return { robot, dataTransfer }
}

// The robot on the card in the editor's foot, and the one in the review sheet.
const cardMood = () => screen.getByLabelText('Drag BrewQuest onto a note').querySelector('svg')!.getAttribute('data-mood')
const sheetMood = (sheet: HTMLElement) => sheet.querySelector('svg[data-mood]')!.getAttribute('data-mood')

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  window.innerWidth = 1280
})

describe('the Notes page', () => {
  it('pages a large list, keeps a keyboard entry on each page, and searches beyond that page', async () => {
    const notes = Array.from({ length: 205 }, (_, i) => note({ id: `n-${i}`, title: `Idea ${i}`, body: i === 204 ? 'A hidden needle' : '' }))
    await open(memoryNotes(notes))
    await screen.findByDisplayValue('Idea 0')
    const list = screen.getByRole('navigation', { name: 'Notes' })
    expect(list.querySelectorAll('.nt-item')).toHaveLength(100)
    await press('Next notes')
    expect(list.querySelectorAll('.nt-item')).toHaveLength(100)
    const entry = list.querySelector<HTMLButtonElement>('.nt-item[tabindex="0"]')!
    expect(entry.textContent).toContain('Idea 100')
    await waitFor(() => expect(document.activeElement).toBe(entry))
    await act(async () => void fireEvent.keyDown(entry, { key: 'ArrowDown' }))
    expect(document.activeElement?.textContent).toContain('Idea 101')
    await press('Next notes')
    expect(list.querySelectorAll('.nt-item')).toHaveLength(5)
    await press('Previous notes')
    expect(list.querySelectorAll('.nt-item')).toHaveLength(100)
    expect(list.querySelector('.nt-item')?.textContent).toContain('Idea 100')
    await act(async () => void fireEvent.input(screen.getByLabelText(t.notebook.search), { target: { value: 'needle' } }))
    expect(list.querySelectorAll('.nt-item')).toHaveLength(1)
    expect(within(list).getByRole('button', { name: /^Idea 204/ })).toBeTruthy()
    expect(within(list).queryByRole('button', { name: 'Next notes' })).toBeNull()
    await act(async () => void fireEvent.input(screen.getByLabelText(t.notebook.search), { target: { value: '' } }))
    expect(list.querySelector('.nt-item')?.textContent).toContain('Idea 0')
  })

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
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ type, folder: 'Plans', body: t.notebook.templates[type] }), 's-1'))
  })

  it('changing or clearing the type keeps existing text and the folder', async () => {
    const notes = memoryNotes([note({ type: 'idea', body: 'Keep my words', folder: 'Plans' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    expect(screen.queryByRole('group', { name: t.notebook.templatesLabel })).toBeNull()
    const type = screen.getByLabelText(t.notebook.type)

    fireEvent.change(type, { target: { value: 'bug' } })
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ type: 'bug', body: 'Keep my words', folder: 'Plans' }), 's-1'))
    fireEvent.change(type, { target: { value: '' } })
    await waitFor(() => expect(notes.saveNote).toHaveBeenLastCalledWith(KEY, 'n-00000001', expect.objectContaining({ type: null, body: 'Keep my words', folder: 'Plans' }), expect.any(String)))
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
    await waitFor(() => expect(notes.saveNote).toHaveBeenLastCalledWith(KEY, 'n-00000001', expect.objectContaining({ body: 'Later words', folder: 'Plans' }), expect.stringMatching(/^r-/)))
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
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'new', { title: 'New', folder: 'Ideas', type: null, isPinned: false, tags: [], meeting: NO_MEETING, body: 'Hello' }, 's-1'))
    expect(await screen.findByText(/^Saved/)).toBeTruthy()
  })

  it('typing back to what is saved needs no save, and says Saved', async () => {
    const notes = memoryNotes([note({ body: 'Same' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    write('Samex')
    write('Same')
    expect(await screen.findByText(/^Saved/)).toBeTruthy()
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
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalled())
    expect(notes.saveNote.mock.calls[0]![2].title).toBe('Bug Bounty Helper')
  })

  it('when the file changed outside, stops and asks which version to keep', async () => {
    const theirs = note({ body: 'Their words', stamp: 's-theirs' })
    const notes = memoryNotes([note()])
    const saveNote = vi.fn(async () => ok({ kind: 'changed' as const, note: theirs }))
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')

    write('My words')
    expect(await screen.findByText(t.notebook.changedTitle)).toBeTruthy()
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
    expect((await screen.findByText(/Couldn't save this note/)).closest('[role="alert"]')).toBeTruthy()
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

  it('offers notes then quests with their states, and the keyboard inserts a quest id and title', async () => {
    await open({
      ...memoryNotes([note({ id: 'here', title: 'Here', updated: '2026-11-08' }), note({ id: 'plan', title: 'Plan' })]),
      readProject: async key => ok(projectView(key, {
        ready: [{ kind: 'quest', quest: quest({ id: 't-abc', title: 'Plan' }) }],
        victories: [{ id: 't-def', title: 'Plan done', finished: '', minutes: 1, xp: 1 }],
      })),
    })
    await screen.findByDisplayValue('Here')
    write('See [[pl')
    const options = within(screen.getByRole('listbox')).getAllByRole('option')
    expect(options.map(option => option.textContent)).toEqual(['PlanIdeas', `Plan${t.notebook.questState.waiting}`])
    expect(options[1]!.getAttribute('aria-label')).toBe(t.notebook.pickQuest('Plan', 'waiting'))
    fireEvent.keyDown(body(), { key: 'ArrowDown' })
    expect(body().getAttribute('aria-activedescendant')).toBe(options[1]!.id)
    fireEvent.keyDown(body(), { key: 'Tab' })
    expect(body().value).toBe('See [[quest:t-abc|Plan]]')
    expect(screen.queryByRole('listbox')).toBeNull()
    const about = screen.getByRole('complementary', { name: t.notebook.inspector })
    expect(within(about).getByRole('button', { name: t.notebook.openQuest('Plan') })).toBeTruthy()
    expect(within(about).queryByRole('button', { name: t.notebook.makeIt })).toBeNull()
    await act(async () => void fireEvent.click(within(about).getByRole('button', { name: t.notebook.openQuest('Plan') })))
    expect(window.location.hash).toBe('#/quests')
    expect((await screen.findByRole('complementary', { name: t.detail.label })).textContent).toContain('Plan')
  })

  it('clicking a quest in the picker inserts it, and Escape leaves the typed text', async () => {
    await open({
      ...memoryNotes([note()]),
      readProject: async key => ok(projectView(key, { ready: [{ kind: 'quest', quest: quest({ id: 't-abc', title: 'Write parser' }) }] })),
    })
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('[[Write')
    fireEvent.keyDown(body(), { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(body().value).toBe('[[Write')
    write('[[Write ')
    fireEvent.mouseDown(screen.getByRole('option', { name: t.notebook.pickQuest('Write parser', 'waiting') }))
    expect(body().value).toBe('[[quest:t-abc|Write parser]]')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('updates quest links in the inspector and Read when the queue changes, and never makes a missing quest into a note', async () => {
    window.location.hash = '#/notes'
    let view = projectView(KEY, { ready: [{ kind: 'quest', quest: quest({ id: 't-abc', title: 'Current title' }) }] })
    const { engine, fire } = fakeEngine({ ...memoryNotes([note({ body: '[[quest:t-abc|Written title]]' })]), readProject: async () => ok(view) })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(t.notebook.read)
    const about = screen.getByRole('complementary', { name: t.notebook.inspector })
    const read = screen.getByRole('article')
    expect(within(about).getByRole('button', { name: t.notebook.openQuest('Current title') })).toBeTruthy()
    expect(within(read).getByRole('button', { name: t.notebook.openQuestLink('Current title', 'waiting') })).toBeTruthy()

    view = projectView(KEY, { sealed: [{ kind: 'quest', quest: quest({ id: 't-abc', title: 'Renamed title' }) }] })
    await act(async () => void fire())
    expect(await within(about).findByRole('button', { name: t.notebook.openQuest('Renamed title') })).toBeTruthy()
    expect(within(read).getByRole('button', { name: t.notebook.openQuestLink('Renamed title', 'sealed') })).toBeTruthy()

    view = projectView(KEY, { victories: [{ id: 't-abc', title: 'Finished title', finished: '', minutes: 1, xp: 1 }] })
    await act(async () => void fire())
    expect(await within(read).findByText('Finished title')).toBeTruthy()
    expect(within(read).queryByRole('button')).toBeNull()
    expect(within(about).queryByRole('button', { name: /in Quests/ })).toBeNull()
    expect(within(about).getByText(t.notebook.questState.done)).toBeTruthy()

    view = projectView(KEY)
    await act(async () => void fire())
    expect(await within(read).findByText('Written title')).toBeTruthy()
    expect(within(about).getByText(t.notebook.goneQuest)).toBeTruthy()
    expect(within(about).queryByRole('button', { name: t.notebook.makeIt })).toBeNull()
    expect(within(read).queryByRole('button')).toBeNull()
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

  it('BrewQuest shows live targets during its drag and reviews the note it lands on', async () => {
    const notes = memoryNotes([note(), note({ id: 'n-other', title: 'Release plan', body: '- [ ] Ship' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    const editor = screen.getByRole('region', { name: t.notebook.body })
    const row = within(screen.getByRole('navigation', { name: t.notebook.title })).getByRole('button', { name: /Release plan/ })
    const { robot, dataTransfer } = dragBrew()
    expect(dataTransfer.effectAllowed).toBe('copy')
    expect(dataTransfer.types).not.toContain('text/plain')
    expect(editor.getAttribute('data-brew-target')).toBe('true')
    expect(row.getAttribute('data-brew-target')).toBe('true')
    expect(screen.getAllByText('Drop to review quests')).toHaveLength(3)
    expect(fireEvent.dragOver(row, { dataTransfer })).toBe(false)
    expect(dataTransfer.dropEffect).toBe('copy')
    expect(row.getAttribute('data-brew-over')).toBe('true')
    fireEvent(row, new MouseEvent('dragleave', { bubbles: true, relatedTarget: row.firstElementChild }))
    expect(row.getAttribute('data-brew-over')).toBe('true')
    await act(async () => void fireEvent.drop(row, { dataTransfer }))
    fireEvent.dragEnd(robot)

    const sheet = await brewSheet(t.notebook.brew.sheet('Release plan'))
    expect(cardMood()).toBe('idle')
    expect((within(sheet).getByLabelText(`${t.notebook.brew.questTitle(1)} *`) as HTMLInputElement).value).toBe('Ship')
    expect(screen.getByLabelText(`${t.notebook.noteTitle} *`)).toHaveProperty('value', 'Release plan')
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
    expect(notes.saveNote).not.toHaveBeenCalled()
    expect(document.querySelector('[data-brew-target]')).toBeNull()
    await press(t.actions.cancel)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: t.notebook.brew.turn }))
  })

  it.each(['write', 'read', 'graph'] as const)('BrewQuest saves the latest text before reviewing a drop in %s', async mode => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('- [ ] A freshly typed quest')
    if (mode !== 'write') await press(t.notebook[mode])
    const { dataTransfer } = dragBrew()
    const target = mode === 'write' ? body() : screen.getByRole('region', { name: t.notebook.body })
    await act(async () => void fireEvent.drop(target, { dataTransfer }))

    const sheet = await brewSheet(t.notebook.brew.sheet('Bug Bounty Helper'))
    expect((within(sheet).getByLabelText(`${t.notebook.brew.questTitle(1)} *`) as HTMLInputElement).value).toBe('A freshly typed quest')
    expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ body: '- [ ] A freshly typed quest' }), expect.any(String))
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
  })

  it('BrewQuest leaves notes and quests alone after an invalid drop or a cancelled drag', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    const original = body().value
    const editor = screen.getByRole('region', { name: t.notebook.body })
    const { robot, dataTransfer } = dragBrew()
    await act(async () => void fireEvent.drop(screen.getByRole('complementary', { name: t.notebook.inspector }), { dataTransfer }))
    expect(document.querySelector('[data-brew-target]')).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()

    const cancelled = dragBrew()
    fireEvent.dragOver(editor, { dataTransfer: cancelled.dataTransfer })
    fireEvent.dragEnd(robot)
    expect(document.querySelector('[data-brew-target]')).toBeNull()
    await act(async () => void fireEvent.drop(editor, { dataTransfer: cancelled.dataTransfer }))
    const unrelated = brewTransfer()
    unrelated.setData('text/plain', 'unrelated text')
    dragBrew()
    expect(fireEvent.dragOver(editor, { dataTransfer: unrelated })).toBe(true)
    await act(async () => void fireEvent.drop(editor, { dataTransfer: unrelated }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(body().value).toBe(original)
    expect(notes.saveNote).not.toHaveBeenCalled()
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
    expect(notes.createNote).not.toHaveBeenCalled()
    expect(notes.archiveNote).not.toHaveBeenCalled()
  })

  it('BrewQuest stops a drop when saving fails and keeps the open note and its edits', async () => {
    const notes = memoryNotes([note(), note({ id: 'n-other', title: 'Release plan' })])
    const saveNote = vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't save. Your text is still here." } }))
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('Keep this unsaved text')
    const { dataTransfer } = dragBrew()
    const row = within(screen.getByRole('navigation', { name: t.notebook.title })).getByRole('button', { name: /Release plan/ })
    await act(async () => void fireEvent.drop(row, { dataTransfer }))

    expect((await screen.findByRole('alert')).textContent).toContain("Couldn't save.")
    expect(screen.getByLabelText(`${t.notebook.noteTitle} *`)).toHaveProperty('value', 'Bug Bounty Helper')
    expect(body().value).toBe('Keep this unsaved text')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
  })

  it('BrewQuest refuses archived notes and a drag from another realm', async () => {
    const notes = memoryNotes([note(), note({ id: 'n-archived', title: 'Old plan', isArchived: true })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    const { dataTransfer } = dragBrew()
    // The MIME type alone cannot make an outside drag into this realm's robot.
    dataTransfer.setData(dataTransfer.types[0]!, 'another-realm')
    await act(async () => void fireEvent.drop(body(), { dataTransfer }))
    expect(screen.queryByRole('dialog')).toBeNull()
    const active = dragBrew()
    await press(t.notebook.archived(1))
    const archived = within(screen.getByRole('navigation', { name: t.notebook.title })).getByRole('button', { name: /Old plan/ })
    expect(archived.hasAttribute('data-brew-target')).toBe(false)
    await act(async () => void fireEvent.drop(archived, { dataTransfer: active.dataTransfer }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(notes.saveNote).not.toHaveBeenCalled()
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
  })

  it('BrewQuest drafts quests from the checklist, checks them, and files only what you keep', async () => {
    const notes = memoryNotes([note({ body: 'A helper.\n\n- [ ] Scan\n- [ ] Report\n- [x] Done' })])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await brewSheet(t.notebook.brew.sheet('Bug Bounty Helper'))
    expect((within(sheet).getByLabelText(`${t.notebook.brew.parent} *`) as HTMLInputElement).value).toBe('Bug Bounty Helper')
    const second = within(sheet).getByLabelText(`${t.notebook.brew.questTitle(2)} *`)
    fireEvent.input(second, { target: { value: '' } })
    fireEvent.blur(second)
    expect(within(sheet).getByText(t.notebook.brew.questTitleRequired)).toBeTruthy()

    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
    fireEvent.click(within(sheet).getByLabelText(t.notebook.brew.include(2)))
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(2) })))

    expect(notes.fileNoteQuests).toHaveBeenCalledWith(KEY, 'n-00000001', { groups: [{ parent: { kind: 'new', title: 'Bug Bounty Helper' }, quests: [{ title: 'Scan', priority: 'mid', difficulty: 'medium', item: 'Scan' }] }] })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(await screen.findByText(t.notebook.brew.filed(2))).toBeTruthy()
    expect(screen.getByRole('button', { name: t.notebook.openQuest('Scan') })).toBeTruthy()
    expect(screen.getByText(t.notebook.questState.waiting)).toBeTruthy()
  })

  it('BrewQuest says why filing failed, in its sheet, locks what went in, and tries again for the rest', async () => {
    const notes = memoryNotes([note({ body: '- [ ] Scan\n- [ ] Report' })])
    // The first quest goes in before the queue fails, as main links each one as it's filed.
    const fileNoteQuests = vi.fn().mockImplementationOnce(async (key: string, id: string, proposal: QuestProposal) => {
      await notes.fileNoteQuests(key, id, { groups: proposal.groups.map(group => ({ ...group, quests: group.quests.slice(0, 1) })) })

      return { ok: false, error: { message: "Couldn't file the quests." } }
    }).mockImplementation(notes.fileNoteQuests)
    await open({ ...notes, fileNoteQuests })
    await screen.findByDisplayValue('Bug Bounty Helper')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await brewSheet()
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))

    expect((await within(sheet).findByRole('alert')).textContent).toBe("Couldn't file the quests.")
    expect(sheetMood(sheet)).toBe('error')
    // The parent and the first quest went in; both lock.
    expect(await within(sheet).findAllByText(t.notebook.brew.filedRow)).toHaveLength(2)
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.tryAgain })))
    expect((fileNoteQuests.mock.calls[1]![2] as QuestProposal).groups.flatMap(group => group.quests.map(q => q.title))).toEqual(['Report'])
  })

  it('BrewQuest reads with Claude, shows what it read, and files the review as you changed it', async () => {
    const notes = memoryNotes([note({ body: 'Count terminal time.\n\n- [ ] Scan logs' })])
    const id = 'd-claude01'
    const quest = (n: number, over: Partial<DraftQuest> = {}): DraftQuest => ({ key: `${id}.q${n}`, title: `Quest ${n}`, summary: `For ${n}.`, priority: 'mid', difficulty: 'medium', points: 3, criteria: [`Works ${n}`], waitsFor: [], sources: [{ noteId: 'n-00000001', title: 'Bug Bounty Helper', quote: 'Count terminal time.', isFound: true }], doubts: [], match: null, item: null, ...over })
    const draft: BrewDraft = {
      id,
      by: 'claude',
      understood: 'Track time in the terminal.',
      groups: [
        { key: `${id}.g1`, parent: { kind: 'existing', id: 't-old', title: 'Sidebar polish', why: 'It is part of the sidebar work.' }, quests: [quest(1, { doubts: ['Which terminals?'] }), quest(2, { title: 'Polish the sidebar', match: { id: 't-old2', title: 'Polish sidebar', state: 'queued', kind: 'same', why: '', by: 'title' } })] },
        { key: `${id}.g2`, parent: { kind: 'new', title: 'Terminal time', why: '' }, quests: [quest(3, { waitsFor: [`${id}.q1`], sources: [{ noteId: 'n-00000001', title: 'Bug Bounty Helper', quote: 'Not in the note', isFound: false }] })] },
      ],
      questions: ['Count idle time too?'],
      missing: [],
      read: { notes: [{ id: 'n-00000001', title: 'Bug Bounty Helper' }], files: ['CLAUDE.md', 'README.md'] },
      trouble: null,
      learned: ['He turned down 1 quest, such as "Old".'],
    }
    let answer: (draft: BrewDraft) => void = () => {}
    const draftNoteQuests = vi.fn(() => new Promise<Reply<BrewDraft>>(done => void (answer = value => done(ok(value)))))
    window.location.hash = '#/notes'
    const { engine, tellBrewing } = fakeEngine({ ...notes, draftNoteQuests })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })
    await screen.findByDisplayValue('Bug Bounty Helper')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await screen.findByRole('dialog', { name: t.notebook.brew.sheet('Bug Bounty Helper') })
    expect(within(sheet).getByText(t.notebook.brew.reading)).toBeTruthy()
    await waitFor(() => expect(draftNoteQuests).toHaveBeenCalledWith(KEY, 'n-00000001', { mode: 'claude', withLinked: true }))
    act(() => tellBrewing({ key: KEY, noteId: 'n-00000001', doing: { kind: 'reading', target: 'CLAUDE.md' }, steps: 2 }))
    expect(within(sheet).getByText(t.notebook.brew.readingSteps(2), { exact: false })).toBeTruthy()
    await act(async () => answer(draft))

    expect(await within(sheet).findByText(t.notebook.brew.understood('Track time in the terminal.'))).toBeTruthy()
    expect(within(sheet).getByText(t.notebook.brew.readWhat(1, 2))).toBeTruthy()
    expect(within(within(sheet).getByRole('region', { name: t.notebook.brew.decide })).getByText('Count idle time too?')).toBeTruthy()
    expect(within(sheet).getByRole('region', { name: t.notebook.brew.groupUnder('Sidebar polish') })).toBeTruthy()
    // The quest already in the realm starts left out; Keep both puts it back.
    expect((within(sheet).getByLabelText(t.notebook.brew.include(2)) as HTMLInputElement).checked).toBe(false)
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.keepBoth })))
    expect((within(sheet).getByLabelText(t.notebook.brew.include(2)) as HTMLInputElement).checked).toBe(true)
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.skipIt })))

    fireEvent.change(within(sheet).getByLabelText(t.notebook.brew.points(1)), { target: { value: '8' } })
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.details(1) })))
    expect((within(sheet).getByLabelText(t.notebook.brew.summary(1)) as HTMLTextAreaElement).value).toBe('For 1.')
    expect(within(sheet).getByText('Which terminals?')).toBeTruthy()
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.details(3) })))
    expect(within(sheet).getByText(t.notebook.brew.notFound, { exact: false })).toBeTruthy()
    expect(within(sheet).getByText(t.notebook.brew.waits(['Quest 1']))).toBeTruthy()

    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))

    expect(notes.fileNoteQuests).toHaveBeenCalledTimes(1)
    const sent = notes.fileNoteQuests.mock.calls[0]![2] as QuestProposal
    expect(sent.groups.map(group => [group.key, group.parent, group.quests.map(q => [q.key, q.points, q.waitsFor])])).toEqual([
      [`${id}.g1`, { kind: 'task', id: 't-old' }, [[`${id}.q1`, 8, []]]],
      [`${id}.g2`, { kind: 'new', title: 'Terminal time' }, [[`${id}.q3`, 3, [`${id}.q1`]]]],
    ])
    expect(sent.draft).toEqual({ id, by: 'claude', proposed: 3, rejected: [], merged: 0, reused: 1, changed: [{ title: 'Quest 1', field: 'points', from: '3', to: '8' }] })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('BrewQuest falls back to the checklist when you ask, stopping the read, and says why when Claude couldn’t read', async () => {
    const notes = memoryNotes([note({ body: '- [ ] Scan' })])
    const draftNoteQuests = vi.fn(async (_key: string, id: string, ask: { mode: string }) => {
      const checklist = checklistDraftOf('d-test0002', notes.readNotes.mock.results.length > 0 ? note({ id, body: '- [ ] Scan' }) : note({ id }), [], ask.mode === 'claude' ? "The app couldn't find Claude Code, so this is the checklist." : null)

      return ask.mode === 'claude' && draftNoteQuests.mock.calls.length === 1 ? never<Reply<BrewDraft>>() : ok(checklist)
    })
    const engine = await open({ ...notes, draftNoteQuests })
    await screen.findByDisplayValue('Bug Bounty Helper')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.notebook.brew.turn })))
    const sheet = await screen.findByRole('dialog')
    await waitFor(() => expect(draftNoteQuests).toHaveBeenCalledTimes(1))
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.useChecklist })))
    expect(engine.stopNoteDraft).toHaveBeenCalledWith(KEY)
    expect(draftNoteQuests.mock.calls[1]![2]).toEqual({ mode: 'checklist', withLinked: true })
    expect(await within(sheet).findByText(t.notebook.brew.intro)).toBeTruthy()
    expect(within(sheet).queryByRole('status', { name: '' })).toBeNull()

    fireEvent.click(within(sheet).getByLabelText(t.notebook.brew.withLinked))
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.readAgain })))
    expect(draftNoteQuests.mock.calls[2]![2]).toEqual({ mode: 'claude', withLinked: false })
    expect(await within(sheet).findByText("The app couldn't find Claude Code, so this is the checklist.")).toBeTruthy()
    expect(within(sheet).getByLabelText(`${t.notebook.brew.questTitle(1)} *`)).toBeTruthy()
  })

  it('BrewQuest’s robot perks up while the pointer is over its card, and settles when it leaves', async () => {
    await open(memoryNotes([note({ body: '- [ ] Scan' })]))
    await screen.findByDisplayValue('Bug Bounty Helper')
    expect(cardMood()).toBe('idle')
    const robot = screen.getByLabelText('Drag BrewQuest onto a note')
    fireEvent.mouseOver(robot)
    expect(cardMood()).toBe('hover')
    fireEvent.mouseLeave(robot.parentElement!)
    expect(cardMood()).toBe('idle')
  })

  it('BrewQuest thinks while the note saves before its review, and is upset when saving fails', async () => {
    const notes = memoryNotes([note()])
    let finish!: (answer: Awaited<ReturnType<EngineApi['saveNote']>>) => void
    const saveNote = vi.fn<EngineApi['saveNote']>(() => new Promise(resolve => { finish = resolve }))
    await open({ ...notes, saveNote })
    await screen.findByDisplayValue('Bug Bounty Helper')
    write('- [ ] Scan')
    await press(t.notebook.brew.turn)
    expect(saveNote).toHaveBeenCalled()
    expect(cardMood()).toBe('thinking')

    await act(async () => finish({ ok: false, error: { message: "Couldn't save. Your text is still here." } }))
    expect((await screen.findByRole('alert')).textContent).toContain("Couldn't save.")
    expect(cardMood()).toBe('error')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('BrewQuest works while filing, cheers on its card once the quests are in, and is puzzled by a note with nothing left', async () => {
    const notes = memoryNotes([note({ body: '- [ ] Scan\n- [ ] Report' })])
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    const fileNoteQuests = vi.fn(async (key: string, id: string, proposal: QuestProposal) => {
      await gate

      return notes.fileNoteQuests(key, id, proposal)
    })
    await open({ ...notes, fileNoteQuests })
    await screen.findByDisplayValue('Bug Bounty Helper')

    await press(t.notebook.brew.turn)
    const sheet = await brewSheet(t.notebook.brew.sheet('Bug Bounty Helper'))
    expect(sheetMood(sheet)).toBe('idle')
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))
    expect(sheetMood(sheet)).toBe('working')

    await act(async () => release())
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(cardMood()).toBe('success')

    await press(t.notebook.brew.turn)
    const nothing = await brewSheet(t.notebook.brew.sheet('Bug Bounty Helper'))
    expect(within(nothing).getByText(t.notebook.brew.nothing)).toBeTruthy()
    expect(sheetMood(nothing)).toBe('confused')
  })

  it('BrewQuest is puzzled when a drag ends without reaching a note, and nothing changes', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    const { robot } = dragBrew()
    expect(cardMood()).toBe('hover')
    fireEvent.dragEnd(robot)
    expect(cardMood()).toBe('confused')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(notes.saveNote).not.toHaveBeenCalled()
    expect(notes.fileNoteQuests).not.toHaveBeenCalled()
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
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalled())
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
    const sheet = await brewSheet()
    expect(within(sheet).getByText(t.notebook.brew.fromLine(1))).toBeTruthy()
    expect(within(sheet).getByText(t.notebook.brew.totalWithParent(3, 'a', 2))).toBeTruthy()
    await act(async () => void fireEvent.click(within(sheet).getByRole('button', { name: t.notebook.brew.file(3) })))

    await waitFor(() => expect(screen.getByText(t.notebook.brew.allFiled(3))).toBeTruthy())
    expect(screen.getByText(t.notebook.saga(0, 2))).toBeTruthy()
  })

  it('a link pasted in Read goes in at the end on a line of its own, saves, and reads as a bookmark card', async () => {
    const notes = memoryNotes([note({ body: 'Reading list' })])
    const openLink = vi.fn(async () => ok(null))
    await open({ ...notes, openLink })
    await screen.findByDisplayValue('Bug Bounty Helper')
    fireEvent.keyDown(window, { key: 'e', metaKey: true })

    await act(async () => void fireEvent.paste(document.querySelector('.nt-read')!, { clipboardData: { files: [], getData: () => 'https://example.com/post' } }))
    await waitFor(() => expect(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', expect.objectContaining({ body: 'Reading list\n\nhttps://example.com/post\n\n' }), 's-1'))
    const card = await screen.findByRole('link', { name: t.notebook.openBookmark('Example page', 'example.com') })
    await act(async () => void fireEvent.click(card))
    expect(openLink).toHaveBeenCalledWith('https://example.com/post')
  })

  describe('Write, Read and Graph', () => {
    // jsdom's canvas has no 2D context, so the graph isn't drawn, and every
    // element measures 800 × 600: a fitted graph with notes at (100, 0) and
    // (-100, 0) puts the centre at (400, 300) and the note at (100, 0) at (500, 300).
    beforeEach(() => {
      layouts.length = 0
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, x: 0, y: 0, width: 800, height: 600, right: 800, bottom: 600, toJSON() {} } as DOMRect)
    })
    afterEach(() => vi.restoreAllMocks())

    const toggle = () => within(screen.getByRole('group', { name: t.notebook.viewAs }))
    const mode = () => [t.notebook.write, t.notebook.read, t.notebook.graph].map(name => toggle().getByRole('button', { name }).getAttribute('aria-pressed'))
    const graph = () => screen.queryByRole('group', { name: /^Graph (around|of the whole realm)/ })
    const row = (title: string) => within(screen.getByRole('region', { name: 'Ideas' })).getByRole('button', { name: new RegExp(`^${title}`) })
    // Lets the layout's answer, already settled, reach the view.
    const settle = () => act(async () => void (await new Promise(resolve => setTimeout(resolve, 0))))

    it('Write, Read and Graph switch the view, and the choice stays on the next note', async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' }), note({ id: 'c', title: 'Cello', body: 'See [[Alpha]]' })]))
      await screen.findByDisplayValue('Alpha')
      expect(toggle().getByRole('button', { name: t.notebook.graph }).getAttribute('title')).toBe(t.notebook.graphKeys)
      expect(mode()).toEqual(['true', 'false', 'false'])

      await press(t.notebook.graph)
      await settle()
      expect(mode()).toEqual(['false', 'false', 'true'])
      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph around Alpha/)
      expect(screen.queryByLabelText(t.notebook.body, { selector: 'textarea' })).toBeNull()
      expect(screen.getByDisplayValue('Alpha')).toBeTruthy()
      const about = screen.getByRole('complementary', { name: t.notebook.inspector })
      expect(within(about).getByRole('button', { name: 'Beta' })).toBeTruthy()
      expect(within(about).getByRole('button', { name: 'Cello' })).toBeTruthy()

      await press(t.notebook.read)
      expect(mode()).toEqual(['false', 'true', 'false'])
      expect(screen.getByRole('article')).toBeTruthy()
      expect(graph()).toBeNull()

      await press(t.notebook.graph)
      await act(async () => void fireEvent.click(row('Beta')))
      expect(await screen.findByDisplayValue('Beta')).toBeTruthy()
      await settle()
      expect(mode()).toEqual(['false', 'false', 'true'])
      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph around Beta/)

      await press(t.notebook.write)
      expect(mode()).toEqual(['true', 'false', 'false'])
      expect(graph()).toBeNull()
      expect(body().value).toBe('')
    })

    it('⌘G opens Graph, and ⌘E goes back to Write from Graph', async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]))
      await screen.findByDisplayValue('Alpha')

      fireEvent.keyDown(window, { key: 'g', metaKey: true })
      await settle()
      expect(mode()).toEqual(['false', 'false', 'true'])
      expect(graph()).toBeTruthy()

      fireEvent.keyDown(window, { key: 'e', metaKey: true })
      expect(mode()).toEqual(['true', 'false', 'false'])
      expect(body().value).toBe('[[Beta]]')

      fireEvent.keyDown(window, { key: 'e', metaKey: true })
      expect(mode()).toEqual(['false', 'true', 'false'])
      expect(screen.getByRole('article')).toBeTruthy()

      fireEvent.keyDown(window, { key: 'e', metaKey: true })
      expect(mode()).toEqual(['true', 'false', 'false'])
      expect(body().value).toBe('[[Beta]]')

      fireEvent.keyDown(window, { key: 'e', metaKey: true })
      fireEvent.keyDown(window, { key: 'g', metaKey: true })
      await settle()
      expect(mode()).toEqual(['false', 'false', 'true'])
      expect(graph()).toBeTruthy()
    })

    it('an archived note shows Read and has no Graph button', async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), note({ id: 'old', title: 'Old plan', body: '- [ ] Scan', isArchived: true })]))
      await screen.findByDisplayValue('Alpha')
      // Graph was the choice when the archived note opened.
      await press(t.notebook.graph)

      await act(async () => void fireEvent.click(await screen.findByRole('button', { name: t.notebook.archived(1) })))
      await act(async () => void fireEvent.click(await screen.findByRole('button', { name: /^Old plan/ })))
      expect(await screen.findByText(t.notebook.archivedLine)).toBeTruthy()
      expect(screen.getByRole('article')).toBeTruthy()
      expect(graph()).toBeNull()
      expect(screen.queryByRole('button', { name: t.notebook.write })).toBeNull()
      expect(screen.queryByRole('button', { name: t.notebook.graph })).toBeNull()

      fireEvent.keyDown(window, { key: 'g', metaKey: true })
      await settle()
      expect(graph()).toBeNull()
      expect(screen.getByRole('article')).toBeTruthy()
    })

    it('clicking a note in the graph opens it and stays in Graph', async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', body: '[[Beta]] [[Cello]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' }), note({ id: 'c', title: 'Cello' })]))
      await screen.findByDisplayValue('Alpha')
      await press(t.notebook.graph)
      await settle()

      // Alpha is in the middle, Beta at (100, 0) and Cello at (-100, 0).
      const area = graph()!
      fireEvent.mouseDown(area, { clientX: 500, clientY: 300, button: 0 })
      fireEvent.mouseUp(area, { clientX: 500, clientY: 300, button: 0 })

      expect(await screen.findByDisplayValue('Beta')).toBeTruthy()
      expect(row('Beta').getAttribute('aria-current')).toBe('true')
      expect(row('Alpha').getAttribute('aria-current')).toBeNull()
      await settle()
      expect(mode()).toEqual(['false', 'false', 'true'])
      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph around Beta/)
    })

    it('a new empty note made while in Graph shows the map and no template chips', async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]))
      await screen.findByDisplayValue('Alpha')
      await press(t.notebook.graph)
      await settle()

      await act(async () => void fireEvent.keyDown(window, { key: 'N', metaKey: true, shiftKey: true }))
      await settle()

      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph around Untitled/)
      expect(mode()).toEqual(['false', 'false', 'true'])
      expect(screen.queryByRole('group', { name: t.notebook.templatesLabel })).toBeNull()
    })

    it("the graph's scope and filters stay while moving between notes", async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]))
      await screen.findByDisplayValue('Alpha')
      await press(t.notebook.graph)
      await settle()
      await press(t.notebook.graphView.oneStep)
      await press(t.notebook.graphView.filter)
      await act(async () => void fireEvent.click(screen.getByRole('menuitemcheckbox', { name: t.notebook.graphView.quests })))
      await press(t.notebook.graphView.realm)
      await settle()

      await act(async () => void fireEvent.click(row('Beta')))
      expect(await screen.findByDisplayValue('Beta')).toBeTruthy()
      await settle()
      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph of the whole realm/)
      expect(screen.getByRole('button', { name: t.notebook.graphView.realm }).getAttribute('aria-pressed')).toBe('true')
      await press(t.notebook.graphView.filter)
      expect(screen.getByRole('menuitemcheckbox', { name: t.notebook.graphView.quests }).getAttribute('aria-checked')).toBe('false')

      await press(t.notebook.graphView.around)
      await settle()
      expect(screen.getByRole('button', { name: t.notebook.graphView.oneStep }).getAttribute('aria-pressed')).toBe('true')
      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph around Beta: .* within 1 step$/)
    })

    it('a new realm starts with no kept points', async () => {
      window.location.hash = '#/notes'
      const notesOf = (key: string): NotesView => ({
        // The same ids in both realms, as each realm numbers its own notes; the second has one more.
        notes:
          key === KEY
            ? [note({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]
            : [note({ id: 'a', title: 'Other alpha', body: '[[Other beta]] [[Other cello]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Other beta' }), note({ id: 'c', title: 'Other cello' })],
        unreadable: [],
        folder: FOLDER,
      })
      const { engine } = fakeEngine({ listProjects: async () => ok([projectRow(KEY), projectRow('b-000002')]), readNotes: async (key: string) => ok(notesOf(key)) })
      const workspace = createWorkspace(engine)
      await act(async () => {
        render(<App workspace={workspace} engine={engine} />)
        await workspace.start()
      })
      await act(async () => workspace.pick(KEY))
      await screen.findByDisplayValue('Alpha')
      await press(t.notebook.graph)
      await press(t.notebook.graphView.realm)
      await settle()
      expect(graph()?.getAttribute('aria-label')).toMatch(/^Graph of the whole realm/)
      expect(layouts.filter(input => input.centre === null)).toHaveLength(1)

      await act(async () => workspace.pick('b-000002'))
      expect(await screen.findByDisplayValue('Other alpha')).toBeTruthy()
      const before = layouts.length
      await press(t.notebook.graph)
      await press(t.notebook.graphView.realm)
      await settle()
      expect(layouts.slice(before).find(input => input.centre === null)?.start).toEqual(new Map())
    })

    it('Esc in the graph puts the focus on the Graph button', async () => {
      await open(memoryNotes([note({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), note({ id: 'b', title: 'Beta' })]))
      await screen.findByDisplayValue('Alpha')
      await press(t.notebook.graph)
      await settle()

      const area = graph()!
      act(() => area.focus())
      fireEvent.keyDown(area, { key: 'Escape' })
      expect(document.activeElement).toBe(toggle().getByRole('button', { name: t.notebook.graph }))
      expect(mode()).toEqual(['false', 'false', 'true'])
    })
  })
})

describe('daily notes and the journal', () => {
  // Today is pinned, on this computer's clock, so nothing hangs on the real date.
  const TODAY = '2026-11-20'
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 20, 12))
  })

  const list = () => within(screen.getByRole('navigation', { name: t.notebook.title }))
  const dayField = () => screen.getByLabelText(`${t.notebook.day} *`) as HTMLInputElement
  const titleField = () => screen.getByLabelText(`${t.notebook.noteTitle} *`) as HTMLInputElement

  it('Today makes today’s note in Journal from the daily template, and pressing it again opens that note with no second note', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')

    await press(t.notebook.todayNoteLabel(TODAY))
    expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: TODAY, folder: 'Journal', type: 'daily', body: t.notebook.templates.daily })
    await waitFor(() => expect(titleField().value).toBe(TODAY))
    expect(body().value).toBe(t.notebook.templates.daily)
    await waitFor(() => expect(document.activeElement).toBe(body()))

    await press(/^Bug Bounty Helper/)
    await waitFor(() => expect(titleField().value).toBe('Bug Bounty Helper'))
    await press(t.notebook.todayNoteLabel(TODAY))
    await waitFor(() => expect(titleField().value).toBe(TODAY))
    expect(notes.createNote).toHaveBeenCalledTimes(1)
  })

  it('the Journal lists the days newest first by month, each with its weekday, and no Rename', async () => {
    await open(memoryNotes([
      note({ id: 'd1', title: '2026-11-03', folder: 'Journal' }),
      note({ id: 'd2', title: '2026-11-20', folder: 'Journal' }),
      note({ id: 'd3', title: '2026-10-31', folder: 'Ideas' }),
      note({ id: 'plan', title: 'Plan', folder: 'Journal' }),
      note({ id: 'old', title: '2026-11-01', folder: 'Journal', isArchived: true }),
    ]))
    await screen.findByDisplayValue('2026-10-31')

    await press(t.notebook.journal(3))

    expect(list().getByRole('heading', { level: 2 }).textContent).toBe(`${t.notebook.journalHeader} 3`)
    expect(list().getAllByRole('region').map(group => [group.getAttribute('aria-label'), within(group).getAllByRole('button', { name: /^2026-/ }).map(row => row.textContent)])).toEqual([
      ['Nov 2026', ['2026-11-20Fri 20 Nov', '2026-11-03Tue 3 Nov']],
      ['Oct 2026', ['2026-10-31Sat 31 Oct']],
    ])
    expect(list().queryByRole('button', { name: /^Plan/ })).toBeNull()
    expect(list().queryByRole('button', { name: t.notebook.renameFolderLabel('Nov 2026') })).toBeNull()
    expect(list().queryByText(t.notebook.rename)).toBeNull()
    expect(list().queryByRole('button', { name: t.notebook.newNote })).toBeNull()
    expect(list().queryByLabelText(t.notebook.capture)).toBeNull()
  })

  it('an empty Journal says how to start it, and a cleared Day shows Day is required. on blur and on submit, making nothing', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(t.notebook.journal(0))
    expect(list().getByText(t.notebook.noJournal)).toBeTruthy()
    expect(dayField().value).toBe(TODAY)

    fireEvent.input(dayField(), { target: { value: '' } })
    fireEvent.blur(dayField())
    expect(document.getElementById('nt-day-error')?.textContent).toBe(t.notebook.dayRequired)
    expect(dayField().getAttribute('aria-invalid')).toBe('true')
    expect(dayField().getAttribute('aria-describedby')).toContain('nt-day-error')

    fireEvent.input(dayField(), { target: { value: '2026-11-18' } })
    fireEvent.blur(dayField())
    expect(screen.queryByText(t.notebook.dayRequired)).toBeNull()
    fireEvent.input(dayField(), { target: { value: '' } })
    await press(t.notebook.openDay)
    expect(screen.getByText(t.notebook.dayRequired)).toBeTruthy()
    expect(notes.createNote).not.toHaveBeenCalled()
  })

  it('Open day opens a day that is there, makes one that is not, and stays in the Journal', async () => {
    const notes = memoryNotes([note({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), note({ id: 'd', title: '2026-11-02', folder: 'Journal', body: 'Monday words' })])
    await open(notes)
    await screen.findByDisplayValue('Alpha')
    await press(t.notebook.journal(1))

    fireEvent.input(dayField(), { target: { value: '2026-11-02' } })
    await press(t.notebook.openDay)
    await waitFor(() => expect(titleField().value).toBe('2026-11-02'))
    expect(body().value).toBe('Monday words')
    expect(notes.createNote).not.toHaveBeenCalled()

    fireEvent.input(dayField(), { target: { value: '2026-11-18' } })
    await press(t.notebook.openDay)
    expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: '2026-11-18', folder: 'Journal', type: 'daily', body: t.notebook.templates.daily })
    await waitFor(() => expect(titleField().value).toBe('2026-11-18'))
    expect(list().getByRole('heading', { level: 2 }).textContent).toBe(`${t.notebook.journalHeader} 2`)
    expect(within(list().getByRole('region', { name: 'Nov 2026' })).getAllByRole('button', { name: /^2026-/ }).map(row => row.textContent)).toEqual(['2026-11-18Wed 18 Nov', '2026-11-02Mon 2 Nov'])
    expect(list().getByRole('button', { name: t.notebook.backToNotes })).toBeTruthy()
  })

  it('a Daily template note’s own text, with {{date}} put in, starts a new day', async () => {
    const notes = memoryNotes([note({ id: 'tpl', title: 'daily template', folder: 'Journal', body: '# {{date}}\n\n- [ ] Plan {{ title }}' })])
    await open(notes)
    await screen.findByDisplayValue('daily template')

    await press(t.notebook.todayNoteLabel(TODAY))

    expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: TODAY, folder: 'Journal', type: 'daily', body: `# ${TODAY}\n\n- [ ] Plan ${TODAY}` })
    await waitFor(() => expect(body().value).toBe(`# ${TODAY}\n\n- [ ] Plan ${TODAY}`))
  })

  it('Edit the daily template makes it in Journal when it is missing, opens it when it is there, and shows the notes', async () => {
    const notes = memoryNotes([note()])
    await open(notes)
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(t.notebook.journal(0))

    await press(t.notebook.editDailyTemplate)
    expect(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Daily template', folder: 'Journal', body: t.notebook.templates.daily })
    await waitFor(() => expect(titleField().value).toBe('Daily template'))
    expect(list().getByRole('heading', { level: 2 }).textContent).toBe(`${t.notebook.title} 2`)
    expect(within(list().getByRole('region', { name: 'Journal' })).getByRole('button', { name: /^Daily template/ })).toBeTruthy()

    await press(/^Bug Bounty Helper/)
    await waitFor(() => expect(titleField().value).toBe('Bug Bounty Helper'))
    await press(t.notebook.journal(0))
    await press(t.notebook.editDailyTemplate)
    await waitFor(() => expect(titleField().value).toBe('Daily template'))
    expect(notes.createNote).toHaveBeenCalledTimes(1)
    expect(list().getByRole('button', { name: t.notebook.newNote })).toBeTruthy()
  })

  it('the foot counts Journal and Archived, each opens its list, Back to notes returns, and Archived has no Today', async () => {
    await open(memoryNotes([
      note({ id: 'a', title: 'Alpha', updated: '2026-11-08' }),
      note({ id: 'd', title: '2026-11-19', folder: 'Journal' }),
      note({ id: 'x', title: '2026-11-01', isArchived: true }),
      note({ id: 'y', title: 'Gone', isArchived: true }),
    ]))
    await screen.findByDisplayValue('Alpha')
    const foot = () => list().getAllByRole('button', { name: /^(Journal \(|Archived \(|Back to notes)/ }).map(button => button.textContent)

    expect(foot()).toEqual([t.notebook.journal(1), t.notebook.archived(2)])
    await press(t.notebook.archived(2))
    expect(list().getByRole('heading', { level: 2 }).textContent).toBe(`${t.notebook.archivedHeader} 2`)
    expect(foot()).toEqual([t.notebook.backToNotes])
    expect(screen.queryByRole('button', { name: t.notebook.todayNoteLabel(TODAY) })).toBeNull()

    await press(t.notebook.backToNotes)
    expect(foot()).toEqual([t.notebook.journal(1), t.notebook.archived(2)])
    await press(t.notebook.journal(1))
    expect(list().getByRole('heading', { level: 2 }).textContent).toBe(`${t.notebook.journalHeader} 1`)
    expect(foot()).toEqual([t.notebook.backToNotes])
    expect(screen.getByRole('button', { name: t.notebook.todayNoteLabel(TODAY) })).toBeTruthy()

    await press(t.notebook.backToNotes)
    expect(list().getByRole('heading', { level: 2 }).textContent).toBe(`${t.notebook.title} 2`)
    expect(list().getByLabelText(t.notebook.capture)).toBeTruthy()
  })
})

describe('Export notes and Restore from backup', () => {
  const b = t.notebook.backup
  const FOLDER_NAME = 'Notes backup a-000001 2026-11-17'
  const exportDone = (over: Partial<NotesExport> = {}) => ok<NotesExport | null>({ folder: FOLDER_NAME, notes: 3, files: 2, skipped: [], ...over })
  const restoreDone = (over: Partial<NotesRestore> = {}) => ok<NotesRestore | null>({ view: { notes: [note()], unreadable: [], folder: FOLDER }, added: 0, renamed: 0, same: 0, toHistory: 0, files: 0, skipped: [], ...over })
  const failure = (message: string) => ({ ok: false as const, error: { message } })
  const link = (name: string) => screen.getByRole('button', { name }) as HTMLButtonElement

  it('an export says how many notes and files went into which folder, and that History stays behind', async () => {
    const exportNotes = vi.fn(async () => exportDone())
    await open({ ...memoryNotes([note()]), exportNotes })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.export)

    const dialog = await screen.findByRole('dialog', { name: b.exportedTitle })
    expect(exportNotes).toHaveBeenCalledWith(KEY)
    expect(within(dialog).getByText(b.exported(3, 2, FOLDER_NAME))).toBeTruthy()
    expect(within(dialog).getByText(b.historyStays)).toBeTruthy()
    expect(within(dialog).queryByText(b.leftOut(1))).toBeNull()
    expect(within(dialog).queryByRole('listitem')).toBeNull()
    await act(async () => void fireEvent.click(within(dialog).getByRole('button', { name: b.close })))
    expect(screen.queryByRole('dialog')).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(link(b.export)))
  })

  it('an export that left files out lists each with why', async () => {
    const skipped = [
      { path: 'huge.pdf', reason: 'size' as const },
      { path: 'Locked.md', reason: 'unreadable' as const },
    ]
    await open({ ...memoryNotes([note()]), exportNotes: vi.fn(async () => exportDone({ notes: 2, files: 1, skipped })) })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.export)

    const dialog = await screen.findByRole('dialog', { name: b.exportedTitle })
    expect(within(dialog).getByText(b.exported(2, 1, FOLDER_NAME))).toBeTruthy()
    expect(within(dialog).getByText(b.leftOut(2))).toBeTruthy()
    expect(within(dialog).getAllByRole('listitem').map(item => item.textContent)).toEqual([`huge.pdf: ${b.reasons.size}`, `Locked.md: ${b.reasons.unreadable}`])
  })

  it('a restore shows only the lines that are not zero, and the list shows the notes it brought back', async () => {
    const back = note({ id: 'n-back', title: 'From the backup', stamp: 'b-1' })
    const restoreNotes = vi.fn(async () => restoreDone({ view: { notes: [note(), back], unreadable: [], folder: FOLDER }, added: 2, renamed: 1, toHistory: 1, files: 3 }))
    await open({ ...memoryNotes([note()]), restoreNotes })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.restore)

    const dialog = await screen.findByRole('dialog', { name: b.restoredTitle })
    expect(restoreNotes).toHaveBeenCalledWith(KEY)
    expect([...dialog.querySelectorAll('p.form-line')].map(line => line.textContent)).toEqual([b.added(2, 3), b.renamed(1), b.toHistory(1)])
    expect(within(dialog).queryByText(b.nothingNew)).toBeNull()
    expect(screen.getByRole('button', { name: /From the backup/ })).toBeTruthy()
  })

  it('a restore of notes that are all here already says so in one line', async () => {
    await open({ ...memoryNotes([note()]), restoreNotes: vi.fn(async () => restoreDone({ same: 4 })) })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.restore)

    const dialog = await screen.findByRole('dialog', { name: b.restoredTitle })
    expect([...dialog.querySelectorAll('p.form-line')].map(line => line.textContent)).toEqual([b.nothingNew])
  })

  it('a restore that left items out lists each with why, under what it did bring back', async () => {
    const skipped = [
      { path: 'attachments/abc.png', reason: 'damaged' as const },
      { path: 'table.csv', reason: 'taken' as const },
    ]
    await open({ ...memoryNotes([note()]), restoreNotes: vi.fn(async () => restoreDone({ same: 2, skipped })) })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.restore)

    const dialog = await screen.findByRole('dialog', { name: b.restoredTitle })
    expect([...dialog.querySelectorAll('p.form-line')].map(line => line.textContent)).toEqual([b.same(2), b.leftOut(2)])
    expect(within(dialog).getAllByRole('listitem').map(item => item.textContent)).toEqual([`attachments/abc.png: ${b.reasons.damaged}`, `table.csv: ${b.reasons.taken}`])
  })

  it('a cancelled folder picker opens no dialog and leaves both links ready', async () => {
    const notes = memoryNotes([note()])
    const exportNotes = vi.fn(async () => ok<NotesExport | null>(null))
    const restoreNotes = vi.fn(async () => ok<NotesRestore | null>(null))
    await open({ ...notes, exportNotes, restoreNotes })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.export)
    await waitFor(() => expect([link(b.export).disabled, link(b.restore).disabled]).toEqual([false, false]))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(b.exporting)).toBeNull()

    await press(b.restore)
    await waitFor(() => expect([link(b.export).disabled, link(b.restore).disabled]).toEqual([false, false]))
    expect(exportNotes).toHaveBeenCalledTimes(1)
    expect(restoreNotes).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(b.restoring)).toBeNull()
  })

  it('while one works, a line with a spinner says so and both links wait', async () => {
    await open({ ...memoryNotes([note()]), exportNotes: never })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.export)

    expect(screen.getByText(b.exporting).closest('[role="status"]')?.querySelector('.spinner')).toBeTruthy()
    expect([link(b.export).disabled, link(b.restore).disabled]).toEqual([true, true])
  })

  it('a failed export says why in its dialog, and Try again asks again', async () => {
    const message = 'Nothing was saved. Check that the disk is connected, has free space and lets you save there, then try again.'
    const exportNotes = vi.fn().mockResolvedValueOnce(failure(message)).mockResolvedValueOnce(exportDone())
    await open({ ...memoryNotes([note()]), exportNotes })
    await screen.findByDisplayValue('Bug Bounty Helper')
    await press(b.export)

    const failed = await screen.findByRole('dialog', { name: b.exportFailed })
    expect(within(failed).getByRole('alert').textContent).toBe(message)
    await act(async () => void fireEvent.click(within(failed).getByRole('button', { name: t.failed.tryAgain })))
    expect(exportNotes).toHaveBeenCalledTimes(2)
    expect(await screen.findByRole('dialog', { name: b.exportedTitle })).toBeTruthy()
  })

  it('a failed restore says why, re-reads the notes it may have added, and Close puts it away', async () => {
    const notes = memoryNotes([note()])
    const message = 'Restoring stopped. Notes already restored are kept; trying again adds only the rest.'
    await open({ ...notes, restoreNotes: vi.fn(async () => failure(message)) })
    await screen.findByDisplayValue('Bug Bounty Helper')
    const reads = notes.readNotes.mock.calls.length
    await press(b.restore)

    const failed = await screen.findByRole('dialog', { name: b.restoreFailed })
    expect(within(failed).getByRole('alert').textContent).toBe(message)
    expect(notes.readNotes.mock.calls.length).toBeGreaterThan(reads)
    await act(async () => void fireEvent.click(within(failed).getByRole('button', { name: b.close })))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('a realm with no notes yet still offers both, and says there is nothing to export', async () => {
    await open({ ...memoryNotes([]), exportNotes: vi.fn(async () => failure('This realm has no notes to export yet.')) })
    await screen.findByText(t.notebook.emptyTitle('a'))

    expect([link(b.export).disabled, link(b.restore).disabled]).toEqual([false, false])
    await press(b.export)
    expect(within(await screen.findByRole('dialog', { name: b.exportFailed })).getByRole('alert').textContent).toBe('This realm has no notes to export yet.')
  })
})
