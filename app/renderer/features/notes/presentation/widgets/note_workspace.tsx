import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import { backlinksOf, INBOX, linksOf, noteTitled } from '../../../../../shared/notes'
import type { Note, NoteChange, NoteFiled, NotesView } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { NOTE_AUTOSAVE_MS, NOTE_PICKER_ROWS } from '../../../../core/constants/constants'
import { Field } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { folderError, linkOptionsOf, linkQueryAt, questLineOf, tagsError, tagsOf, titleError, withLink } from '../../domain/notes_view'
import type { QuestLine } from '../../domain/notes_view'
import { BrewQuestCard, BrewSheet } from './brew_quest'

type SaveState = { kind: 'saved'; at?: string } | { kind: 'dirty' } | { kind: 'saving' } | { kind: 'failed'; message: string } | { kind: 'changed'; note: Note | null }

// A note's edits that couldn't be saved yet, kept while another note is open.
export type Held = { change: NoteChange; stamp: string }

export type NoteActions = {
  onSaved: (view: NotesView) => void
  onHeld: (id: string, held: Held | null) => void
  onOpen: (id: string) => void
  onMake: (title: string, folder: string) => void
  onSaveAsNew: (change: NoteChange) => void
  onArchive: (note: Note, isArchived: boolean) => void
  onDelete: (note: Note) => void
  onFiled: (filed: NoteFiled, count: number) => void
  onOpenQuest: (id: string) => void
  onRefresh: () => void
}

type Props = { engine: EngineApi; realm: string; note: Note; notes: readonly Note[]; quests: Map<string, QuestLine>; isNew: boolean; held: Held | null; actions: NoteActions }

const changeOf = (note: Note): NoteChange => ({ title: note.title, folder: note.folder, tags: note.tags, body: note.body })
const isSame = (a: NoteChange, b: NoteChange | null) => b !== null && a.title === b.title && a.folder === b.folder && a.body === b.body && a.tags.join('\n') === b.tags.join('\n')

const SaveLine = ({ save, onRetry }: { save: SaveState; onRetry: () => void }) => {
  if (save.kind === 'failed') {
    return (
      <p class="nt-save failed" role="alert">
        {save.message}{' '}
        <button type="button" class="chip-btn" onClick={onRetry}>
          {t.failed.tryAgain}
        </button>
      </p>
    )
  }
  if (save.kind === 'saving') {
    return (
      <p class="nt-save" role="status">
        <Spinner /> {t.notebook.saving}
      </p>
    )
  }

  return (
    <p class="nt-save" role="status">
      {save.kind === 'saved' ? (save.at === undefined ? t.notebook.saved : t.notebook.savedAt(save.at)) : save.kind === 'dirty' ? t.notebook.unsaved : ''}
    </p>
  )
}

// One note, open: its editor, what it links to and from, and BrewQuest. Every
// change saves itself a moment after typing stops, over the file it was read
// from; a file changed meanwhile stops the saving and asks what to keep.
export const NoteWorkspace = ({ engine, realm, note, notes, quests, isNew, held, actions }: Props) => {
  const start = held?.change ?? changeOf(note)
  const [draft, setDraft] = useState<NoteChange>(start)
  const [titleText, setTitleText] = useState(start.title)
  const [folderText, setFolderText] = useState(start.folder)
  const [tagsText, setTagsText] = useState(start.tags.join(', '))
  const [errors, setErrors] = useState<{ title?: string; folder?: string; tags?: string }>({})
  const [save, setSave] = useState<SaveState>({ kind: 'saved' })
  const [picker, setPicker] = useState<{ start: number; query: string; index: number } | null>(null)
  const [isBrewing, setBrewing] = useState(false)
  const stamp = useRef(held?.stamp ?? note.stamp)
  // Kept edits aren't on disk yet, so the first save writes them.
  const onDisk = useRef<NoteChange | null>(held === null ? changeOf(note) : null)
  const latest = useRef(draft)
  latest.current = draft
  const isHeld = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const running = useRef<Promise<boolean> | null>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const titleBox = useRef<HTMLInputElement>(null)
  const caret = useRef<number | null>(null)
  const isLive = !note.isArchived

  const flush = async (): Promise<boolean> => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    if (running.current !== null) await running.current
    const sent = latest.current
    if (isHeld.current) return false
    if (isSame(sent, onDisk.current)) {
      setSave({ kind: 'saved' })

      return true
    }
    const run = (async () => {
      setSave({ kind: 'saving' })
      const answer = await ask(engine, () => engine.saveNote(realm, note.id, sent, stamp.current))
      if (!answer.ok) {
        setSave({ kind: 'failed', message: answer.message })

        return false
      }
      if (answer.data.kind === 'changed') {
        isHeld.current = true
        setSave({ kind: 'changed', note: answer.data.note })

        return false
      }
      stamp.current = answer.data.note.stamp
      onDisk.current = sent
      actions.onSaved(answer.data.view)
      actions.onHeld(note.id, null)
      setSave(isSame(latest.current, sent) ? { kind: 'saved', at: answer.data.note.updated.slice(11, 16) } : { kind: 'dirty' })

      return true
    })()
    running.current = run
    const isSaved = await run
    running.current = null
    if (isSaved && !isSame(latest.current, onDisk.current)) schedule()

    return isSaved
  }

  const schedule = () => {
    if (isHeld.current) return
    if (timer.current !== null) clearTimeout(timer.current)
    setSave(was => (was.kind === 'saving' ? was : { kind: 'dirty' }))
    timer.current = setTimeout(() => void flush(), NOTE_AUTOSAVE_MS)
  }

  const change = (patch: Partial<NoteChange>) => {
    latest.current = { ...latest.current, ...patch }
    setDraft(latest.current)
    schedule()
  }

  const adopt = (from: Note) => {
    const next = changeOf(from)
    latest.current = next
    onDisk.current = next
    stamp.current = from.stamp
    isHeld.current = false
    setDraft(next)
    setTitleText(from.title)
    setFolderText(from.folder)
    setTagsText(from.tags.join(', '))
    setErrors({})
    setSave({ kind: 'saved' })
  }

  // Leaving the note saves what's left. What can't be saved stays with the
  // page, so opening the note again brings the edits back.
  // Closing the window saves too: the save is sent before the page goes.
  useEffect(() => {
    const closing = () => void flush()
    window.addEventListener('beforeunload', closing)

    return () => window.removeEventListener('beforeunload', closing)
  }, [])
  useEffect(() => {
    if (held !== null) schedule()

    return () =>
      void flush().then(isSaved => {
        if (!isSaved) actions.onHeld(note.id, { change: latest.current, stamp: stamp.current })
      })
  }, [])
  useLayoutEffect(() => {
    if (isNew) titleBox.current?.select()
  }, [])
  // The file changed some other way (archived, quests filed, read again): with
  // nothing unsaved here, show it. With something unsaved, the next save asks.
  useEffect(() => {
    if (note.stamp !== stamp.current && save.kind === 'saved' && isSame(latest.current, onDisk.current)) adopt(note)
  }, [note.stamp])
  useLayoutEffect(() => {
    if (caret.current === null || area.current === null) return
    area.current.setSelectionRange(caret.current, caret.current)
    caret.current = null
  })

  const commitTitle = () => {
    const error = titleError(titleText, notes, note.id)
    setErrors(was => ({ ...was, title: error }))
    if (error === undefined && titleText.trim() !== latest.current.title) change({ title: titleText.trim() })
  }
  const commitFolder = () => {
    const error = folderError(folderText)
    setErrors(was => ({ ...was, folder: error }))
    if (error !== undefined) return
    const folder = folderText.trim() === '' ? INBOX : folderText.trim()
    setFolderText(folder)
    if (folder !== latest.current.folder) change({ folder })
  }
  const commitTags = () => {
    const error = tagsError(tagsText)
    setErrors(was => ({ ...was, tags: error }))
    if (error === undefined && tagsOf(tagsText).join('\n') !== latest.current.tags.join('\n')) change({ tags: tagsOf(tagsText) })
  }

  const options = picker === null ? [] : linkOptionsOf(notes, picker.query, note.id, NOTE_PICKER_ROWS)
  const lookAtCaret = () => {
    const box = area.current
    if (box === null || box.selectionStart !== box.selectionEnd) return setPicker(null)
    const found = linkQueryAt(box.value, box.selectionStart)
    setPicker(found === null ? null : { ...found, index: 0 })
  }
  const link = (title: string) => {
    const box = area.current
    if (box === null || picker === null) return
    const linked = withLink(box.value, picker.start, box.selectionStart, title)
    caret.current = linked.caret
    setPicker(null)
    change({ body: linked.body })
  }
  const pickerKeys = (event: KeyboardEvent) => {
    if (picker === null) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setPicker(null)
    } else if (options.length > 0 && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : options.length - 1
      setPicker({ ...picker, index: (picker.index + step) % options.length })
    } else if (options.length > 0 && (event.key === 'Enter' || event.key === 'Tab')) {
      event.preventDefault()
      link(options[picker.index]!.title)
    }
  }

  const brew = async () => {
    if (await flush()) setBrewing(true)
  }

  const shown: Note = { ...note, ...draft }
  const backlinks = backlinksOf(notes, shown)

  return (
    <div class="nt-open">
      <section class="nt-editor panel" aria-label={t.notebook.body}>
        {!isLive && <p class="nt-banner">{t.notebook.archivedLine}</p>}
        {save.kind === 'changed' && (
          <div class="nt-banner" role="alert">
            <b>{t.notebook.changedTitle}</b>
            <span>{save.note === null ? t.notebook.goneLine : t.notebook.changedLine}</span>
            <span class="nt-banner-actions">
              {save.note === null ? (
                <button type="button" class="btn primary" onClick={() => actions.onSaveAsNew(latest.current)}>
                  {t.notebook.keepMine}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    class="btn primary"
                    onClick={() => {
                      if (save.note === null) return
                      stamp.current = save.note.stamp
                      onDisk.current = null
                      isHeld.current = false
                      void flush()
                    }}
                  >
                    {t.notebook.keepMine}
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => {
                      if (save.note === null) return
                      adopt(save.note)
                      actions.onRefresh()
                    }}
                  >
                    {t.notebook.loadTheirs}
                  </button>
                  <button type="button" class="btn" onClick={() => actions.onSaveAsNew(latest.current)}>
                    {t.notebook.keepAsNew}
                  </button>
                </>
              )}
            </span>
          </div>
        )}
        <div class="form-field nt-title">
          <label for="nt-title">{t.notebook.noteTitle} *</label>
          <input
            ref={titleBox}
            id="nt-title"
            class="input"
            value={titleText}
            readOnly={!isLive}
            aria-invalid={errors.title === undefined ? undefined : 'true'}
            aria-describedby={errors.title === undefined ? undefined : 'nt-title-error'}
            onInput={event => setTitleText((event.target as HTMLInputElement).value)}
            onBlur={commitTitle}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                // Esc puts the saved title back.
                event.stopPropagation()
                setTitleText(latest.current.title)
                setErrors(was => ({ ...was, title: undefined }))
              }
              if (event.key !== 'Enter') return
              event.preventDefault()
              area.current?.focus()
            }}
          />
          {errors.title !== undefined && (
            <p class="field-error" id="nt-title-error">
              {errors.title}
            </p>
          )}
        </div>
        <div class="nt-body">
          <label for="nt-body" class="nt-hidden">
            {t.notebook.body}
          </label>
          <textarea
            ref={area}
            id="nt-body"
            class="nt-text"
            value={draft.body}
            readOnly={!isLive}
            placeholder={t.notebook.bodyPlaceholder}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={picker !== null}
            aria-controls="nt-picker"
            aria-activedescendant={picker !== null && options.length > 0 ? `nt-pick-${picker.index}` : undefined}
            onInput={event => {
              change({ body: (event.target as HTMLTextAreaElement).value })
              lookAtCaret()
            }}
            onKeyDown={pickerKeys}
            onClick={lookAtCaret}
            onKeyUp={event => {
              if (event.key.startsWith('Arrow') && picker === null) lookAtCaret()
            }}
            onBlur={() => setPicker(null)}
          />
          {picker !== null && (
            <ul class="nt-picker panel" id="nt-picker" role="listbox" aria-label={t.notebook.linkPicker}>
              {options.length === 0 && <li class="nt-picker-none">{t.notebook.noLinkMatch(picker.query)}</li>}
              {options.map((option, i) => (
                <li
                  key={option.id}
                  id={`nt-pick-${i}`}
                  role="option"
                  aria-selected={i === picker.index}
                  class={i === picker.index ? 'on' : undefined}
                  onMouseDown={event => {
                    event.preventDefault()
                    link(option.title)
                  }}
                >
                  {option.title}
                  <span class="sub"> · {option.folder}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div class="nt-foot">
          <SaveLine save={save} onRetry={() => void flush()} />
          {isLive && <BrewQuestCard onBrew={() => void brew()} />}
        </div>
      </section>
      <aside class="nt-inspector panel" aria-label={t.notebook.inspector}>
        {isLive ? (
          <>
            <Field label={t.notebook.folder} value={folderText} error={errors.folder} onInput={setFolderText} onBlur={commitFolder} onEnter={commitFolder} />
            <Field label={t.notebook.tags} value={tagsText} error={errors.tags} onInput={setTagsText} onBlur={commitTags} onEnter={commitTags} />
            <p class="hint">{t.notebook.tagsHint}</p>
          </>
        ) : (
          <p class="sub">
            {note.folder}
            {note.tags.length > 0 && ` · ${note.tags.map(tag => `#${tag}`).join(' ')}`}
          </p>
        )}
        <h3>{t.notebook.quests}</h3>
        {note.quests.length === 0 && <p class="hint">{t.notebook.noQuests}</p>}
        <ul class="nt-links">
          {note.quests.map(quest => {
            const line = questLineOf(quests, quest.id)

            return (
              <li key={quest.id}>
                {line.title === null ? (
                  <span class="sub">{t.notebook.goneQuest}</span>
                ) : (
                  <button type="button" class="nt-link" aria-label={t.notebook.openQuest(line.title)} onClick={() => actions.onOpenQuest(quest.id)}>
                    {line.title}
                  </button>
                )}
                <span class={`nt-state ${line.state}`}>{t.notebook.questState[line.state]}</span>
              </li>
            )
          })}
        </ul>
        <h3>{t.notebook.links}</h3>
        {linksOf(draft.body).length === 0 && <p class="hint">{t.notebook.noLinks}</p>}
        <ul class="nt-links">
          {linksOf(draft.body).map(title => {
            const target = noteTitled(notes, title)

            return (
              <li key={title}>
                {target === undefined ? (
                  <>
                    <span class="nt-broken">{t.notebook.broken(title)}</span>
                    {isLive && (
                      <button type="button" class="chip-btn" onClick={() => actions.onMake(title, draft.folder)}>
                        {t.notebook.makeIt}
                      </button>
                    )}
                  </>
                ) : (
                  <button type="button" class="nt-link" onClick={() => actions.onOpen(target.id)}>
                    {target.title}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
        <h3>{t.notebook.backlinks}</h3>
        {backlinks.length === 0 && <p class="hint">{t.notebook.noBacklinks}</p>}
        <ul class="nt-links">
          {backlinks.map(other => (
            <li key={other.id}>
              <button type="button" class="nt-link" onClick={() => actions.onOpen(other.id)}>
                {other.title}
              </button>
            </li>
          ))}
        </ul>
        <div class="nt-inspector-actions">
          {isLive ? (
            <button type="button" class="btn" onClick={() => void flush().then(isSaved => isSaved && actions.onArchive(note, true))}>
              {t.notebook.archive}
            </button>
          ) : (
            <>
              <button type="button" class="btn" onClick={() => actions.onArchive(note, false)}>
                {t.notebook.restore}
              </button>
              <button type="button" class="btn" onClick={() => actions.onDelete(note)}>
                {t.notebook.deleteForever}
              </button>
            </>
          )}
        </div>
      </aside>
      {isBrewing && <BrewSheet engine={engine} realm={realm} note={shown} quests={quests} onFiled={actions.onFiled} onRefresh={actions.onRefresh} onClose={() => setBrewing(false)} />}
    </div>
  )
}
