import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi, ProjectView, Reply } from '../../../../../shared/engine_api'
import { backlinksOf, INBOX } from '../../../../../shared/notes'
import type { Note, NoteChange, NoteFiled, NoteInput, NotesView } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { DETAIL_IS_PAGE_BELOW } from '../../../../core/constants/constants'
import { dayAndTime } from '../../../../core/domain/format'
import { Dialog } from '../../../../core/widgets/dialog'
import { ReadView } from '../../../../core/widgets/read_view'
import { Empty } from '../../../../core/widgets/states'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { useWindowWidth } from '../../../../core/widgets/window_width'
import { t } from '../../../../l10n/en'
import type { ReadableView } from '../../../workspace/state_management/workspace_store'
import { captureOf, foldersOf, questLinesOf, untitledIn } from '../../domain/notes_view'
import { NoteWorkspace } from '../widgets/note_workspace'
import type { Held, NoteActions } from '../widgets/note_workspace'
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

type Props = { engine: EngineApi; realm: ReadableView; isCovered: boolean; onProject: (view: ProjectView) => void; onOpenQuest: (id: string) => void; onSay: (text: string) => void }

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
  const [captureError, setCaptureError] = useState<string | null>(null)
  // Edits that couldn't be saved yet, by note, kept while another note is open.
  const [held, setHeld] = useState<Record<string, Held>>({})
  const search = useRef<HTMLInputElement>(null)
  const captureBox = useRef<HTMLInputElement>(null)
  const isNarrow = useWindowWidth() < DETAIL_IS_PAGE_BELOW
  const quests = useMemo(() => questLinesOf(realm), [realm])

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
    }

    return true
  }

  // ↩ adds the idea and stays in the line; ⌘↩ adds it and opens it.
  const jot = (isOpening: boolean) => {
    const input = captureOf(capture)
    setCaptureError(input === null ? t.notebook.captureEmpty : null)
    if (input !== null) void create(input, isOpening).then(isMade => isMade && setCapture(''))
  }

  // Back at the window, notes edited in another app show.
  useEffect(() => {
    const back = () => read.refresh()
    window.addEventListener('focus', back)

    return () => window.removeEventListener('focus', back)
  }, [read.refresh])

  const notes = read.load.status === 'ready' ? read.load.data.notes : []
  const newNote = () => void create({ title: untitledIn(notes), folder: notes.find(n => n.id === openId)?.folder ?? INBOX, body: '' })

  useWindowKeys(event => {
    // BrewQuest's sheet and the delete dialog are this page's own cover.
    if (isCovered || !event.metaKey || document.querySelector('[role="dialog"]') !== null) return
    if (event.shiftKey && event.key.toLowerCase() === 'n') {
      event.preventDefault()
      newNote()
    } else if (event.key === 'f') {
      event.preventDefault()
      search.current?.focus()
    } else if (event.key === 'j') {
      event.preventDefault()
      captureBox.current?.focus()
    }
  })

  const actions: NoteActions = {
    onSaved: read.adopt,
    onHeld: (id, edits) => setHeld(was => (edits === null && !(id in was) ? was : Object.fromEntries([...Object.entries(was).filter(([key]) => key !== id), ...(edits === null ? [] : [[id, edits]])]))),
    onOpen: id => setOpenId(id),
    onMake: (title, folder) => void create({ title, folder, body: '' }).then(isMade => isMade && onSay(t.notebook.made(title))),
    onSaveAsNew: (change: NoteChange) => void create({ title: change.title, folder: change.folder, body: change.body }),
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
    onRefresh: read.refresh,
  }

  return (
    <main class="page nt">
      <ReadView read={read} line={t.loading.notes}>
        {view => {
          const live = view.notes.filter(note => !note.isArchived)
          const archivedCount = view.notes.length - live.length
          const groups = foldersOf(view.notes, query, isArchivedView)
          const first = groups[0]?.notes[0]
          const open = view.notes.find(note => note.id === openId) ?? (isNarrow ? undefined : first)
          const isListShown = !isNarrow || open === undefined

          return (
            <>
              {view.unreadable.length > 0 && (
                <p class="note panel" role="status">
                  {t.notebook.unreadable(view.unreadable)}
                </p>
              )}
              <div class={isNarrow ? 'nt-grid narrow' : 'nt-grid'}>
                {isListShown && (
                  <nav class="nt-list panel" aria-label={t.notebook.title}>
                    {!isArchivedView && (
                      <form
                        class="nt-capture"
                        noValidate
                        onSubmit={event => {
                          event.preventDefault()
                          jot(false)
                        }}
                      >
                        <label for="nt-capture" class="nt-hidden">
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
                    <label for="nt-search" class="nt-hidden">
                      {t.notebook.search}
                    </label>
                    <input ref={search} id="nt-search" type="search" class="input" value={query} placeholder={t.notebook.searchPlaceholder} onInput={event => setQuery((event.target as HTMLInputElement).value)}
                      onKeyDown={event => {
                        if (event.key !== 'Escape' || query === '') return
                        event.stopPropagation()
                        setQuery('')
                      }}
                    />
                    {failure !== null && (
                      <p class="form-banner" role="alert">
                        {failure}
                      </p>
                    )}
                    <div class="nt-list-actions">
                      {!isArchivedView && (
                        <button type="button" class="btn primary" onClick={newNote}>
                          {t.notebook.newNote}
                        </button>
                      )}
                      {(archivedCount > 0 || isArchivedView) && (
                        <button type="button" class="chip-btn" aria-pressed={isArchivedView} onClick={() => setArchivedView(!isArchivedView)}>
                          {isArchivedView ? t.notebook.backToNotes : t.notebook.archived(archivedCount)}
                        </button>
                      )}
                    </div>
                    {groups.map(group => (
                      <section key={group.folder} class="nt-folder" aria-label={group.folder}>
                        <h2>
                          {group.folder} <span class="sub">{group.notes.length}</span>
                        </h2>
                        <ul>
                          {group.notes.map(note => (
                            <li key={note.id}>
                              <button type="button" class={note.id === open?.id ? 'nt-item on' : 'nt-item'} aria-current={note.id === open?.id ? 'true' : undefined} onClick={() => setOpenId(note.id)}>
                                <span class="nt-item-title">{note.title}</span>
                                <span class="sub">
                                  {note.id in held ? <b class="nt-unsaved">{t.notebook.notSavedRow}</b> : dayAndTime(note.updated)}
                                  {note.tags.length > 0 && ` · #${note.tags[0]}`}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                    {groups.length === 0 && query.trim() !== '' && (
                      <p class="hint">
                        {t.notebook.noMatch(query.trim())}{' '}
                        <button type="button" class="chip-btn" onClick={() => setQuery('')}>
                          {t.notebook.clearSearch}
                        </button>
                      </p>
                    )}
                    {groups.length === 0 && query.trim() === '' && isArchivedView && <p class="hint">{t.notebook.noArchived}</p>}
                  </nav>
                )}
                {open !== undefined ? (
                  <div class="nt-main">
                    {isNarrow && (
                      <button type="button" class="chip-btn nt-back" onClick={() => setOpenId(null)}>
                        ← {t.notebook.allNotes}
                      </button>
                    )}
                    <NoteWorkspace key={open.id} engine={engine} realm={realm.key} note={open} notes={view.notes} quests={quests} isNew={open.id === newId} held={held[open.id] ?? null} actions={actions} />
                  </div>
                ) : (
                  !isNarrow && (live.length === 0 && !isArchivedView ? <Empty title={t.notebook.emptyTitle(realm.name)} line={t.notebook.emptyLine(view.folder)} /> : <Empty title={t.notebook.pickTitle} line={t.notebook.pickLine} />)
                )}
              </div>
              {isNarrow && open === undefined && live.length === 0 && !isArchivedView && <Empty title={t.notebook.emptyTitle(realm.name)} line={t.notebook.emptyLine(view.folder)} />}
            </>
          )
        }}
      </ReadView>
      {deleting !== null && (
        <DeleteNote
          note={deleting}
          linkedFrom={read.load.status === 'ready' ? backlinksOf(read.load.data.notes, { ...deleting, isArchived: false }).map(n => n.title) : []}
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
