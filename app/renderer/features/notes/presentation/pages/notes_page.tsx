import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi, ProjectView, Reply } from '../../../../../shared/engine_api'
import { backlinksOf, INBOX, NOTES_FOLDER } from '../../../../../shared/notes'
import type { Note, NoteChange, NoteFiled, NoteInput, NotesView } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW } from '../../../../core/constants/constants'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { Empty, Spinner } from '../../../../core/widgets/states'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { useWindowWidth } from '../../../../core/widgets/window_width'
import { t } from '../../../../l10n/en'
import type { ReadableView } from '../../../workspace/state_management/workspace_store'
import { captureOf, folderNameError, foldersOf, localDay, questLinesOf, whenOf } from '../../domain/notes_view'
import type { FolderGroup } from '../../domain/notes_view'
import { useNotesAsks } from '../state_management/notes_asks'
import { Robot } from '../widgets/brew_quest'
import { NoteWorkspace } from '../widgets/note_workspace'
import type { Held, Layout, NoteActions } from '../widgets/note_workspace'
import '../notes.css'

const DeleteNote = ({ note, linkedFrom, onDelete, onClose }: { note: Note; linkedFrom: string[]; onDelete: (note: Note) => Promise<Answer<unknown>>; onClose: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)
  const submit = async () => {
    if (isSending.current) return
    isSending.current = true
    const answer = await onDelete(note)
    isSending.current = false
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.notebook.deleteTitle(note.title)} onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{t.notebook.deleteLine}</p>
      {linkedFrom.length > 0 && <p class="hint">{t.notebook.linkedFrom(linkedFrom)}</p>}
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.notebook.deleteIt}
        </button>
      </div>
    </Dialog>
  )
}

// Gives every note in a folder a new name. onRename says why it failed, or null.
const RenameFolder = ({ folder, onRename, onClose }: { folder: string; onRename: (to: string) => Promise<string | null>; onClose: () => void }) => {
  const [name, setName] = useState(folder)
  const [error, setError] = useState<string | undefined>(undefined)
  const [failure, setFailure] = useState<string | null>(null)
  const [isSending, setSending] = useState(false)
  const check = () => {
    const found = folderNameError(name)
    setError(found)

    return found === undefined
  }
  const submit = async () => {
    if (isSending || !check()) return
    if (name.trim() === folder) return onClose()
    setSending(true)
    const failed = await onRename(name.trim())
    setSending(false)
    if (failed === null) onClose()
    else setFailure(failed)
  }

  return (
    <Dialog title={t.notebook.renameTitle(folder)} onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{t.notebook.renameLine}</p>
      <Field label={t.notebook.folderName} isRequired value={name} error={error} onInput={setName} onBlur={check} />
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {isSending ? (
            <>
              <Spinner /> {t.notebook.renaming}
            </>
          ) : (
            t.notebook.renameIt
          )}
        </button>
      </div>
    </Dialog>
  )
}

// A folder can't start with a space, so the Pinned group's fold never meets one.
const PINNED = ' pinned'
const keyOf = (group: FolderGroup) => group.folder ?? PINNED

type Props = { engine: EngineApi; realm: ReadableView; isCovered: boolean; onProject: (view: ProjectView) => void; onOpenQuest: (id: string) => void; onSay: (text: string, tone?: 'success' | 'error') => void }

const layoutOf = (width: number): Layout => (width < DETAIL_IS_PAGE_BELOW ? 'narrow' : width < DETAIL_FLOATS_BELOW ? 'mid' : 'wide')

// Moves focus to the note row before or after the focused one.
const stepRows = (list: HTMLElement, by: number) => {
  const rows = [...list.querySelectorAll<HTMLButtonElement>('.nt-item')]
  const at = rows.indexOf(document.activeElement as HTMLButtonElement)
  rows[Math.max(0, Math.min(rows.length - 1, at + by))]?.focus()
}

// A realm's notes: the list on the left, the open note beside it. The notes
// are the realm's own, kept outside its repository; quests filed from them go
// into this realm's queue.
export const NotesPage = ({ engine, realm, isCovered, onProject, onOpenQuest, onSay }: Props) => {
  const read = useEngineRead(engine, () => engine.readNotes(realm.key), [realm.key])
  const [openId, setOpenId] = useState<string | null>(null)
  const [newId, setNewId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [capture, setCapture] = useState('')
  const [isArchivedView, setArchivedView] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Note | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [captureError, setCaptureError] = useState<string | null>(null)
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set())
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [showFailure, setShowFailure] = useState<string | null>(null)
  // Write or Read, kept as you move between notes.
  const [isReading, setReading] = useState(false)
  // Edits that couldn't be saved yet, by note, kept while another note is open.
  const [held, setHeld] = useState<Record<string, Held>>({})
  const search = useRef<HTMLInputElement>(null)
  const captureBox = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLElement>(null)
  // Which field the drawer puts the cursor in when it opens.
  const drawerFocus = useRef<'capture' | 'search'>('capture')
  const saveOpen = useRef<(() => Promise<boolean>) | null>(null)
  const layout = layoutOf(useWindowWidth())
  const quests = useMemo(() => questLinesOf(realm), [realm])
  const where = `~/${NOTES_FOLDER}/${realm.key}/`

  // A change's answer: the notes as they are now, or the reason it failed.
  const act = async <T,>(call: () => Promise<Reply<T>>, viewOf: (data: T) => NotesView): Promise<Answer<T>> => {
    const answer = await ask(engine, call)
    if (answer.ok) read.adopt(viewOf(answer.data))
    setFailure(answer.ok ? null : answer.message)

    return answer
  }

  const create = async (input: NoteInput, isOpening = true): Promise<boolean> => {
    const made = await act(() => engine.createNote(realm.key, input), data => data.view)
    if (!made.ok) return false
    setArchivedView(false)
    if (isOpening) {
      setOpenId(made.data.id)
      setNewId(made.data.id)
      setDrawerOpen(false)
    }

    return true
  }

  // An "Untitled" note in Inbox; main numbers it when the name is taken.
  const newNote = () => void create({ title: t.notebook.untitled, folder: INBOX, body: '' })

  // ↩ adds the idea and stays in the line; ⌘↩ adds it and opens it.
  const jot = (isOpening: boolean) => {
    const input = captureOf(capture)
    setCaptureError(input === null ? t.notebook.captureEmpty : null)
    if (input !== null) void create(input, isOpening).then(isMade => isMade && setCapture(''))
  }

  const pick = (id: string, isFromKeys: boolean) => {
    setOpenId(id)
    setDrawerOpen(false)
    // Picked from the keyboard, the cursor goes on to the note's text.
    if (isFromKeys) requestAnimationFrame(() => document.getElementById('nt-body')?.focus())
  }
  // From ⇧⌘N and the palette, on any screen. A note that has gone by now
  // leaves the first one open, as a deleted note does.
  useNotesAsks(asked => {
    if (asked.kind === 'new') newNote()
    else if (asked.kind === 'open') {
      setArchivedView(false)
      pick(asked.id, true)
    } else {
      const input = captureOf(asked.text)
      if (input !== null) void create(input, asked.isOpening)
    }
  })
  const closeDrawer = () => {
    setDrawerOpen(false)
    requestAnimationFrame(() => document.getElementById('nt-show-list')?.focus())
  }
  const toggleFold = (folder: string, isFolding?: boolean) =>
    setFolded(was => {
      const next = new Set(was)
      if (isFolding ?? !was.has(folder)) next.add(folder)
      else next.delete(folder)

      return next
    })

  // Back at the window, notes edited in another app show.
  useEffect(() => {
    const back = () => read.refresh()
    window.addEventListener('focus', back)

    return () => window.removeEventListener('focus', back)
  }, [read.refresh])
  useEffect(() => {
    if (!isDrawerOpen) return
    ;(drawerFocus.current === 'search' ? search : captureBox).current?.focus()
    drawerFocus.current = 'capture'
  }, [isDrawerOpen])

  useWindowKeys(event => {
    // BrewQuest's sheet and the delete dialog are this page's own cover.
    if (isCovered || !event.metaKey || document.querySelector('[role="dialog"]') !== null) return
    if (event.key !== 'f' && event.key !== 'j') return
    event.preventDefault()
    const field = event.key === 'f' ? search : captureBox
    if (field.current !== null) field.current.focus()
    else {
      drawerFocus.current = event.key === 'f' ? 'search' : 'capture'
      setDrawerOpen(true)
    }
  })

  const actions: NoteActions = {
    onSaved: read.adopt,
    onHeld: (id, edits) => setHeld(was => (edits === null && !(id in was) ? was : Object.fromEntries([...Object.entries(was).filter(([key]) => key !== id), ...(edits === null ? [] : [[id, edits]])]))),
    onOpen: id => setOpenId(id),
    onMake: (title, folder) => void create({ title, folder, body: '' }).then(isMade => isMade && onSay(t.notebook.made(title))),
    onSaveAsNew: (change: NoteChange) => void create({ title: change.title, folder: change.folder, body: change.body, type: change.type }),
    onRenameFolder: setRenaming,
    onArchive: (note, isArchived) =>
      void act(() => engine.archiveNote(realm.key, note.id, isArchived), view => view).then(answer => {
        if (!answer.ok) return
        setArchivedView(false)
        setOpenId(isArchived ? null : note.id)
      }),
    onDelete: setDeleting,
    onFiled: (filed: NoteFiled, count: number) => {
      read.adopt(filed.view)
      onProject(filed.project)
      onSay(t.notebook.brew.filed(count))
    },
    onOpenQuest,
    onOpenLink: url => void ask(engine, () => engine.openLink(url)).then(answer => !answer.ok && onSay(answer.message, 'error')),
    onRefresh: read.refresh,
  }

  if (read.load.status === 'loading') {
    return (
      <main class="page nt">
        <div class="state panel" role="status">
          <Spinner />
          <p class="state-line">{t.loading.notes}</p>
          <p class="hint">{t.notebook.loadingWhere(where)}</p>
        </div>
      </main>
    )
  }
  if (read.load.status === 'failed') {
    return (
      <main class="page nt">
        <div class="state panel" role="alert">
          <p class="nt-fail-mark" aria-hidden="true">
            ✕
          </p>
          <h2 class="state-title">{t.notebook.failedTitle(realm.name)}</h2>
          <p class="state-line">{read.load.message}</p>
          <div class="nt-fail-actions">
            <button type="button" class="btn" onClick={read.retry}>
              {t.failed.tryAgain}
            </button>
            <button type="button" class="nt-link" onClick={() => void ask(engine, () => engine.showNotes(realm.key)).then(answer => setShowFailure(answer.ok ? null : answer.message))}>
              {t.notebook.showInFinder}
            </button>
          </div>
          {showFailure !== null && <p class="field-error">{showFailure}</p>}
        </div>
      </main>
    )
  }

  const view = read.load.data
  const live = view.notes.filter(note => !note.isArchived)
  const archivedCount = view.notes.length - live.length
  const groups = foldersOf(view.notes, query, isArchivedView)
  const first = groups.find(group => !folded.has(keyOf(group)))?.notes[0] ?? groups[0]?.notes[0]
  const open = view.notes.find(note => note.id === openId) ?? first
  const isEmpty = live.length === 0 && !isArchivedView
  const today = localDay(new Date())
  const yesterday = localDay(new Date(Date.now() - 86_400_000))
  const folders = [...new Set(live.map(note => note.folder))].sort()
  const focusId = open?.id ?? first?.id
  // Below 900 px the list is a drawer over the note, unless there's no note.
  const isDrawer = layout === 'narrow' && !isEmpty

  const noteList = (
    <nav
      ref={list}
      class={isDrawer ? 'nt-list panel drawer' : 'nt-list panel'}
      aria-label={t.notebook.title}
      onKeyDown={event => {
        if (event.key !== 'Escape' || !isDrawer) return
        event.stopPropagation()
        closeDrawer()
      }}
    >
      <div class="nt-list-head">
        <h2>
          {isArchivedView ? t.notebook.archivedHeader : t.notebook.title} <span class="sub">{isArchivedView ? archivedCount : live.length}</span>
        </h2>
        {!isArchivedView && (
          <button type="button" class="chip-btn" onClick={newNote}>
            {t.notebook.newNote}
          </button>
        )}
        {isDrawer && (
          <button type="button" class="icon-btn" aria-label={t.notebook.closeList} onClick={closeDrawer}>
            ✕
          </button>
        )}
      </div>
      {!isArchivedView && (
        <form
          class="nt-capture"
          noValidate
          onSubmit={event => {
            event.preventDefault()
            jot(false)
          }}
        >
          <label for="nt-capture" class="sr">
            {t.notebook.capture}
          </label>
          <input
            ref={captureBox}
            id="nt-capture"
            class="input"
            value={capture}
            placeholder={t.notebook.capturePlaceholder}
            aria-invalid={captureError === null ? undefined : 'true'}
            aria-describedby={captureError === null ? undefined : 'nt-capture-error'}
            onInput={event => {
              setCapture((event.target as HTMLInputElement).value)
              setCaptureError(null)
            }}
            onKeyDown={event => {
              if (event.key !== 'Enter' || !event.metaKey) return
              event.preventDefault()
              event.stopPropagation()
              jot(true)
            }}
          />
          {captureError !== null && (
            <p class="field-error" id="nt-capture-error">
              {captureError}
            </p>
          )}
        </form>
      )}
      {isEmpty ? (
        <p class="hint">{t.notebook.captureHint}</p>
      ) : (
        <>
          <label for="nt-search" class="sr">
            {t.notebook.search}
          </label>
          <input
            ref={search}
            id="nt-search"
            type="search"
            class="input"
            value={query}
            placeholder={t.notebook.searchPlaceholder}
            onInput={event => setQuery((event.target as HTMLInputElement).value)}
            onKeyDown={event => {
              if (event.key !== 'Escape' || query === '') return
              event.stopPropagation()
              setQuery('')
            }}
          />
        </>
      )}
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <div
        class="nt-folders"
        onKeyDown={event => {
          const row = (event.target as HTMLElement).closest<HTMLElement>('.nt-item')
          if (row === null || list.current === null) return
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            stepRows(list.current, event.key === 'ArrowDown' ? 1 : -1)
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            toggleFold(row.dataset.folder ?? '', event.key === 'ArrowLeft')
          }
        }}
      >
        {groups.map(group => {
          const key = keyOf(group)
          const isFolded = folded.has(key)
          const name = group.folder ?? t.notebook.pinned

          return (
            <section key={key} class="nt-folder" aria-label={name}>
              <h3>
                <button type="button" class="nt-fold" aria-expanded={!isFolded} onClick={() => toggleFold(key)}>
                  <span aria-hidden="true">{isFolded ? '▸' : '▾'} </span>
                  {name} <span class="sub">{group.notes.length}</span>
                </button>
                {group.folder !== null && group.folder !== INBOX && (
                  <button type="button" class="nt-link nt-rename" aria-label={t.notebook.renameFolderLabel(group.folder)} onClick={() => setRenaming(group.folder)}>
                    {t.notebook.rename}
                  </button>
                )}
              </h3>
              {!isFolded && (
                <ul>
                  {group.notes.map(note => (
                    <li key={note.id}>
                      <button
                        type="button"
                        class={note.id === open?.id ? 'nt-item on' : 'nt-item'}
                        data-folder={key}
                        tabIndex={note.id === focusId ? 0 : -1}
                        aria-current={note.id === open?.id ? 'true' : undefined}
                        onClick={event => pick(note.id, event.detail === 0)}
                      >
                        <span class="nt-item-title">{note.title}</span>
                        <span class="sub">
                          {note.id in held ? <b class="nt-unsaved">{t.notebook.notSavedRow}</b> : whenOf(note.updated, today, yesterday)}
                          {group.folder === null && ` · ${note.folder}`}
                          {note.tags.length > 0 && ` · #${note.tags[0]}`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
      {groups.length === 0 && query.trim() !== '' && (
        <p class="hint">
          {t.notebook.noMatch(query.trim())}{' '}
          <button type="button" class="chip-btn" onClick={() => setQuery('')}>
            {t.notebook.clearSearch}
          </button>
        </p>
      )}
      {groups.length === 0 && query.trim() === '' && isArchivedView && <p class="hint">{t.notebook.noArchived}</p>}
      {view.unreadable.length > 0 && (
        <p class="hint" role="status">
          {t.notebook.unreadable(view.unreadable)}
        </p>
      )}
      {(archivedCount > 0 || isArchivedView) && (
        <div class="nt-list-foot">
          <button type="button" class="nt-link" aria-pressed={isArchivedView} onClick={() => setArchivedView(!isArchivedView)}>
            {isArchivedView ? t.notebook.backToNotes : t.notebook.archived(archivedCount)}
          </button>
        </div>
      )}
    </nav>
  )

  const empty = (
    <div class="state panel nt-empty">
      <Robot size={88} />
      <h2 class="state-title">{t.notebook.emptyTitle(realm.name)}</h2>
      <p class="state-line">{t.notebook.emptyLine}</p>
      <p class="hint">{t.notebook.emptyWhere(view.folder)}</p>
      <p class="nt-empty-actions">
        <button type="button" class="btn primary" onClick={newNote}>
          {t.notebook.newNote}
        </button>
        <span class="sub">{t.notebook.newNoteKeys}</span>
      </p>
    </div>
  )

  return (
    <main class="page nt">
      {read.note !== null && (
        <p class="note panel" role="status">
          {read.note}
        </p>
      )}
      <div class={layout === 'narrow' ? 'nt-grid narrow' : 'nt-grid'}>
        {(!isDrawer || isDrawerOpen) && noteList}
        {isDrawer && isDrawerOpen && <div class="nt-scrim" aria-hidden="true" onClick={closeDrawer} />}
        {isEmpty ? (
          empty
        ) : open !== undefined ? (
          <div class="nt-main">
            <NoteWorkspace key={open.id} engine={engine} realm={realm.key} realmName={realm.name} note={open} notes={view.notes} folders={folders} quests={quests} isNew={open.id === newId} held={held[open.id] ?? null} layout={layout} isReading={isReading} onReading={setReading} onShowList={() => setDrawerOpen(true)} saveRef={saveOpen} actions={actions} />
          </div>
        ) : (
          <Empty title={t.notebook.pickTitle} line={t.notebook.pickLine} />
        )}
      </div>
      {renaming !== null && (
        <RenameFolder
          folder={renaming}
          onRename={async to => {
            // The open note saves first, so moving it can't clash with its own edits.
            if (open?.folder === renaming && saveOpen.current !== null && !(await saveOpen.current())) return t.notebook.openNotSaved
            const answer = await ask(engine, () => engine.renameFolder(realm.key, renaming, to))
            if (!answer.ok) return answer.message
            read.adopt(answer.data)
            setFolded(was => (was.has(renaming) ? new Set([...was].filter(name => name !== renaming).concat(to)) : was))
            onSay(t.notebook.renamed(renaming, to))

            return null
          }}
          onClose={() => setRenaming(null)}
        />
      )}
      {deleting !== null && (
        <DeleteNote
          note={deleting}
          linkedFrom={backlinksOf(view.notes, { ...deleting, isArchived: false }).map(n => n.title)}
          onDelete={async note => {
            const answer = await ask(engine, () => engine.deleteNote(realm.key, note.id))
            if (answer.ok) {
              read.adopt(answer.data)
              setOpenId(null)
            }

            return answer
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </main>
  )
}
