import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import type { MutableRef } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import { backlinksOf, INBOX, linksOf, NOTE_TYPES, noteTitled, noteTypeOf, proposalOf, questLinkOf, questLinksOf } from '../../../../../shared/notes'
import type { Note, NoteChange, NoteFiled, NoteQuest, NotesView, NoteType } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { NOTE_AUTOSAVE_MS, NOTE_PICKER_QUEST_ROWS, NOTE_PICKER_ROWS } from '../../../../core/constants/constants'
import { dayOf } from '../../../../core/domain/format'
import { Field } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { t } from '../../../../l10n/en'
import { brewLineOf, folderError, toggleTaskAt, isInPlay, linkLineOf, linkQueryAt, localDay, questLineOf, tagsError, tagsOf, templateChange, titleError, whenOf, withLink, linkPicksOf } from '../../domain/notes_view'
import type { QuestLine } from '../../domain/notes_view'
import { BrewQuestCard, BrewSheet } from './brew_quest'
import { ReadView } from './read_view'
import { NoteHistory } from './note_history'

type SaveState = { kind: 'saved'; at?: string; relinked?: number } | { kind: 'dirty' } | { kind: 'saving' } | { kind: 'failed'; message: string } | { kind: 'changed'; note: Note | null }

// A note's edits that couldn't be saved yet, kept while another note is open.
export type Held = { change: NoteChange; stamp: string }

export type NoteActions = {
  onSaved: (view: NotesView) => void
  onHeld: (id: string, held: Held | null) => void
  onOpen: (id: string) => void
  onMake: (title: string, folder: string) => void
  onSaveAsNew: (change: NoteChange) => void
  onArchive: (note: Note, isArchived: boolean) => void
  onRenameFolder: (folder: string) => void
  onDelete: (note: Note) => void
  onFiled: (filed: NoteFiled, count: number) => void
  onOpenQuest: (id: string) => void
  onOpenLink: (url: string) => void
  onRefresh: () => void
}

// wide: three panes. mid: the inspector floats, behind Details. narrow: the
// list is a drawer too, behind Notes.
export type Layout = 'wide' | 'mid' | 'narrow'

// saveRef: how the page saves the open note before it moves notes itself.
type Props = { engine: EngineApi; realm: string; realmName: string; note: Note; notes: readonly Note[]; folders: string[]; quests: Map<string, QuestLine>; isNew: boolean; held: Held | null; layout: Layout; isReading: boolean; onReading: (isReading: boolean) => void; onShowList: () => void; saveRef: MutableRef<(() => Promise<boolean>) | null>; actions: NoteActions }

const PICKER_WIDTH = 320

const changeOf = (note: Note): NoteChange => ({ title: note.title, folder: note.folder, type: note.type, isPinned: note.isPinned, tags: note.tags, body: note.body })
const isSame = (a: NoteChange, b: NoteChange | null) => b !== null && a.title === b.title && a.folder === b.folder && a.type === b.type && a.isPinned === b.isPinned && a.body === b.body && a.tags.join('\n') === b.tags.join('\n')

// Where the caret sits in a text area, from its top-left: the text up to it is
// laid out in a hidden copy with the same box and type, and a mark measured.
const caretPoint = (box: HTMLTextAreaElement, at: number): { top: number; left: number } => {
  const style = getComputedStyle(box)
  const copy = document.createElement('div')
  for (const name of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderLeftWidth', 'boxSizing', 'width'] as const) copy.style[name] = style[name]
  Object.assign(copy.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', top: '0', left: '0' })
  copy.textContent = box.value.slice(0, at)
  const mark = document.createElement('span')
  mark.textContent = '​'
  copy.append(mark)
  document.body.append(copy)
  const line = Number.parseFloat(style.lineHeight) || 24
  const point = { top: box.offsetTop + mark.offsetTop - box.scrollTop + line, left: box.offsetLeft + mark.offsetLeft }
  copy.remove()

  return point
}

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
  const said = save.kind === 'saved' ? (save.at === undefined ? t.notebook.saved : save.relinked ? t.notebook.savedRelinked(save.at, save.relinked) : t.notebook.savedAt(save.at)) : save.kind === 'dirty' ? t.notebook.unsaved : t.notebook.notSavedChanged

  return (
    <p class={save.kind === 'saved' ? 'nt-save saved' : 'nt-save'} role="status">
      {said}
    </p>
  )
}

// A parent filed from the note, with the quests filed under it after it.
type QuestGroup = { parent: NoteQuest | null; children: NoteQuest[] }
const groupsOf = (quests: readonly NoteQuest[]): QuestGroup[] =>
  quests.reduce<QuestGroup[]>((groups, quest) => {
    if (quest.item === null) return [...groups, { parent: quest, children: [] }]
    const last = groups.at(-1)
    if (last === undefined) return [{ parent: null, children: [quest] }]

    return [...groups.slice(0, -1), { ...last, children: [...last.children, quest] }]
  }, [])

const QuestItem = ({ id, quests, onOpen }: { id: string; quests: Map<string, QuestLine>; onOpen: (id: string) => void }) => {
  const line = questLineOf(quests, id)

  return (
    <li class="nt-quest">
      {line.title === null ? (
        <span class="sub">{t.notebook.goneQuest}</span>
      ) : !isInPlay(quests, id) ? (
        // Quests can't open a done quest, so it's not a button.
        <span>{line.title}</span>
      ) : (
        <button type="button" class="nt-link" aria-label={t.notebook.openQuest(line.title)} onClick={() => onOpen(id)}>
          {line.title}
        </button>
      )}
      <span class="nt-quest-meta">
        <span class={`nt-state ${line.state}`}>{t.notebook.questState[line.state]}</span>
        {line.priority !== null && line.difficulty !== null && <span class="sub">{t.notebook.questMeta(t.priority[line.priority], t.difficulty[line.difficulty])}</span>}
      </span>
    </li>
  )
}

const QuestList = ({ note, quests, onOpen }: { note: Note; quests: Map<string, QuestLine>; onOpen: (id: string) => void }) => (
  <ul class="nt-links">
    {groupsOf(note.quests).map(group =>
      group.parent !== null && group.children.length > 0 ? (
        <li key={group.parent.id} class="nt-saga">
          <ul class="nt-links">
            <QuestItem id={group.parent.id} quests={quests} onOpen={onOpen} />
          </ul>
          <span class="nt-state saga">{t.notebook.saga(group.children.filter(child => questLineOf(quests, child.id).state === 'done').length, group.children.length)}</span>
          <ul class="nt-links nt-under">
            {group.children.map(child => (
              <QuestItem key={child.id} id={child.id} quests={quests} onOpen={onOpen} />
            ))}
          </ul>
        </li>
      ) : (
        [group.parent, ...group.children].filter((q): q is NoteQuest => q !== null).map(quest => <QuestItem key={quest.id} id={quest.id} quests={quests} onOpen={onOpen} />)
      ),
    )}
  </ul>
)

// One note, open: its editor, what it links to and from, and BrewQuest. Every
// change saves itself a moment after typing stops, over the file it was read
// from; a file changed meanwhile stops the saving and asks what to keep.
export const NoteWorkspace = ({ engine, realm, realmName, note, notes, folders, quests, isNew, held, layout, isReading, onReading, onShowList, saveRef, actions }: Props) => {
  const start = held?.change ?? changeOf(note)
  const [draft, setDraft] = useState<NoteChange>(start)
  const [titleText, setTitleText] = useState(start.title)
  const [folderText, setFolderText] = useState(start.folder)
  const [tagsText, setTagsText] = useState(start.tags.join(', '))
  const [errors, setErrors] = useState<{ title?: string; folder?: string; tags?: string }>({})
  // Opened, a note says when it was last saved.
  const [save, setSave] = useState<SaveState>(held === null ? { kind: 'saved', at: note.updated.slice(11, 16) } : { kind: 'dirty' })
  const [picker, setPicker] = useState<{ start: number; query: string; index: number; top: number; left: number } | null>(null)
  const [isBrewing, setBrewing] = useState(false)
  const [historyNote, setHistoryNote] = useState<Note | null>(null)
  const [isOpeningHistory, setOpeningHistory] = useState(false)
  const [isRestored, setRestored] = useState(false)
  const [isDetailsOpen, setDetailsOpen] = useState(false)
  const stamp = useRef(held?.stamp ?? note.stamp)
  // Kept edits aren't on disk yet, so the first save writes them.
  const onDisk = useRef<NoteChange | null>(held === null ? changeOf(note) : null)
  const latest = useRef(draft)
  latest.current = draft
  const isHeld = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const running = useRef<Promise<boolean> | null>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const bodyBox = useRef<HTMLDivElement>(null)
  const titleBox = useRef<HTMLInputElement>(null)
  const detailsButton = useRef<HTMLButtonElement>(null)
  const historyButton = useRef<HTMLButtonElement>(null)
  const caret = useRef<number | null>(null)
  const isLive = !note.isArchived
  const isFloating = layout !== 'wide'
  // An archived note can't be edited, so it always reads.
  const isShowingRead = isReading || !isLive

  const flush = async (): Promise<boolean> => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    if (running.current !== null) await running.current
    const sent = latest.current
    if (isHeld.current) return false
    if (isSame(sent, onDisk.current)) {
      setSave(was => (was.kind === 'saved' ? was : { kind: 'saved' }))

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
      setSave(isSame(latest.current, sent) ? { kind: 'saved', at: answer.data.note.updated.slice(11, 16), relinked: answer.data.relinked } : { kind: 'dirty' })

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
    setRestored(false)
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
    setSave({ kind: 'saved', at: from.updated.slice(11, 16) })
  }

  useEffect(() => {
    saveRef.current = flush

    return () => {
      saveRef.current = null
    }
  })
  // Closing the window saves too: the save is sent before the page goes.
  useEffect(() => {
    const closing = () => void flush()
    window.addEventListener('beforeunload', closing)

    return () => window.removeEventListener('beforeunload', closing)
  }, [])
  // Leaving the note saves what's left. What can't be saved stays with the
  // page, so opening the note again brings the edits back.
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

  const picks = picker === null ? { notes: [], quests: [] } : linkPicksOf(notes, quests, picker.query, note.id, NOTE_PICKER_ROWS, NOTE_PICKER_QUEST_ROWS)
  // One list, notes then quests; link is what goes after the [[.
  const options = [
    ...picks.notes.map(option => ({ key: option.id, link: option.title, title: option.title, folder: option.folder, state: null, label: undefined })),
    ...picks.quests.map(option => ({ key: option.id, link: questLinkOf(option.id, option.title), title: option.title, folder: null, state: option.state, label: t.notebook.pickQuest(option.title, t.notebook.questStateSaid[option.state]) })),
  ]
  const lookAtCaret = () => {
    const box = area.current
    if (box === null || box.selectionStart !== box.selectionEnd) return setPicker(null)
    const found = linkQueryAt(box.value, box.selectionStart)
    if (found === null) return setPicker(null)
    const point = caretPoint(box, box.selectionStart)
    // Moved left when it would run out of the editor.
    const left = Math.max(0, Math.min(point.left, (bodyBox.current?.clientWidth ?? PICKER_WIDTH) - PICKER_WIDTH))
    setPicker(was => ({ ...found, index: was?.start === found.start ? Math.min(was.index, NOTE_PICKER_ROWS - 1) : 0, top: point.top, left }))
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
      link(options[Math.min(picker.index, options.length - 1)]!.link)
    }
  }

  // The template's text goes in, and the cursor under its first line.
  const startFrom = (type: NoteType) => {
    const patch = templateChange(type, latest.current.title, notes, note.id, localDay(new Date()))
    if (patch.title !== undefined) setTitleText(patch.title)
    caret.current = (patch.body ?? '').indexOf('\n') + 1
    change(patch)
    requestAnimationFrame(() => area.current?.focus())
  }
  const togglePin = () => {
    change({ isPinned: !latest.current.isPinned })
    void flush()
  }

  const brew = async () => {
    if (await flush()) setBrewing(true)
  }
  const openHistory = async () => {
    setOpeningHistory(true)
    // Typing while a save is pending can schedule another one. Drain it before
    // taking the stamp against which a later restore will be checked.
    let isSaved = await flush()
    while (isSaved && !isSame(latest.current, onDisk.current)) isSaved = await flush()
    if (isSaved) setHistoryNote({ ...note, ...latest.current, stamp: stamp.current })
    setOpeningHistory(false)
  }
  const closeHistory = () => {
    setHistoryNote(null)
    historyButton.current?.focus()
  }
  const closeDetails = () => {
    setDetailsOpen(false)
    detailsButton.current?.focus()
  }
  // Esc puts the floating inspector away, wherever the focus is; fields that
  // use Esc themselves keep it from coming here. ⌘E turns Write and Read over.
  useWindowKeys(event => {
    if (document.querySelector('[role="dialog"]') !== null) return
    if (event.key === 'Escape' && isDetailsOpen) closeDetails()
    else if (event.key === 'e' && event.metaKey && isLive) {
      event.preventDefault()
      setPicker(null)
      onReading(!isReading)
    }
  })

  const shown: Note = { ...note, ...draft }
  const backlinks = backlinksOf(notes, shown)
  const links = linksOf(draft.body)
  const questLinks = questLinksOf(draft.body)
  const today = localDay(new Date())
  const yesterday = localDay(new Date(Date.now() - 86_400_000))
  const brewLine = brewLineOf(shown, proposalOf(shown, id => isInPlay(quests, id)))

  return (
    <div class={isFloating ? 'nt-open floats' : 'nt-open'}>
      <section class="nt-editor panel" aria-label={t.notebook.body}>
        <header class="nt-head">
          {layout === 'narrow' && (
            <button type="button" id="nt-show-list" class="chip-btn" onClick={onShowList}>
              {t.notebook.showList}
            </button>
          )}
          <span class="nt-head-folder sub">
            <span aria-hidden="true">▭ </span>
            {draft.folder}
            {draft.type !== null && ` · ${t.notebook.types[draft.type]}`}
            {draft.isPinned && ` · ${t.notebook.pinned}`}
          </span>
          {isLive && (
            <span class="nt-mode" role="group" aria-label={t.notebook.viewAs}>
              <button type="button" class={isReading ? 'nt-mode-btn' : 'nt-mode-btn on'} aria-pressed={!isReading} title={t.notebook.modeKeys} onClick={() => onReading(false)}>
                {t.notebook.write}
              </button>
              <button type="button" class={isReading ? 'nt-mode-btn on' : 'nt-mode-btn'} aria-pressed={isReading} title={t.notebook.modeKeys} onClick={() => onReading(true)}>
                {t.notebook.read}
              </button>
            </span>
          )}
          <SaveLine save={save} onRetry={() => void flush()} />
          <button ref={historyButton} type="button" class="chip-btn" disabled={isOpeningHistory} onClick={() => void openHistory()}>{t.notebook.history.open}</button>
          {isFloating && (
            <button ref={detailsButton} type="button" class="chip-btn" aria-expanded={isDetailsOpen} aria-controls="nt-inspector" onClick={() => (isDetailsOpen ? closeDetails() : setDetailsOpen(true))}>
              {t.notebook.details}
            </button>
          )}
        </header>
        {isRestored && <p class="hint" role="status">{t.notebook.history.restored}</p>}
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
          <label for="nt-title" class="sr">
            {t.notebook.noteTitle} *
          </label>
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
        {isShowingRead ? (
          <ReadView body={draft.body} notes={notes} quests={quests} isLive={isLive} onToggle={index => change({ body: toggleTaskAt(latest.current.body, index) })} onOpenNote={actions.onOpen} onOpenQuest={actions.onOpenQuest} onOpenLink={actions.onOpenLink} />
        ) : (
          <div class="nt-body" ref={bodyBox}>
            <label for="nt-body" class="sr">
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
              aria-activedescendant={picker !== null && options.length > 0 ? `nt-pick-${Math.min(picker.index, options.length - 1)}` : undefined}
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
              <div class="nt-picker panel" style={{ top: `${picker.top}px`, left: `${picker.left}px` }}>
                <p class="nt-picker-head sub">
                  <span>{t.notebook.pickerHead(picker.query)}</span>
                  <span>{t.notebook.pickerCount(picks.notes.length, picks.quests.length)}</span>
                </p>
                <ul id="nt-picker" role="listbox" aria-label={t.notebook.linkPicker}>
                  {options.length === 0 && <li class="nt-picker-none">{t.notebook.noLinkMatch(picker.query)}</li>}
                  {options.map((option, i) => (
                    <li
                      key={option.key}
                      id={`nt-pick-${i}`}
                      role="option"
                      aria-selected={i === Math.min(picker.index, options.length - 1)}
                      aria-label={option.label}
                      class={[option.state !== null && 'quest', i === Math.min(picker.index, options.length - 1) && 'on'].filter(Boolean).join(' ') || undefined}
                      onMouseDown={event => {
                        event.preventDefault()
                        link(option.link)
                      }}
                    >
                      <span>{option.title}</span>
                      {option.state === null ? <span class="sub">{option.folder}</span> : <span class={`nt-state ${option.state}`}>{t.notebook.questState[option.state]}</span>}
                    </li>
                  ))}
                </ul>
                <p class="nt-picker-keys sub" aria-hidden="true">
                  {t.notebook.pickerKeys}
                </p>
              </div>
            )}
          </div>
        )}
        {isLive && !isShowingRead && draft.body === '' && draft.type === null && (
          <div class="nt-templates" role="group" aria-label={t.notebook.templatesLabel}>
            <span class="sub">{t.notebook.templatesLabel}</span>
            {NOTE_TYPES.map(type => (
              <button key={type} type="button" class="chip-btn" onClick={() => startFrom(type)}>
                {t.notebook.types[type]}
              </button>
            ))}
          </div>
        )}
        {isLive && (
          <footer class="nt-foot">
            <BrewQuestCard line={brewLine} onBrew={() => void brew()} />
          </footer>
        )}
      </section>
      {(!isFloating || isDetailsOpen) && (
        <aside
          id="nt-inspector"
          class={isFloating ? 'nt-inspector panel floating' : 'nt-inspector panel'}
          aria-label={t.notebook.inspector}
        >
          {isLive ? (
            <>
              <Field label={t.notebook.folder} value={folderText} error={errors.folder} list="nt-folders" onInput={setFolderText} onBlur={commitFolder} onEnter={commitFolder} />
              {note.isPinned && note.folder !== INBOX && !notes.some(other => !other.isArchived && !other.isPinned && other.folder === note.folder) && (
                <button type="button" class="nt-link" aria-label={t.notebook.renameFolderLabel(note.folder)} onClick={() => actions.onRenameFolder(note.folder)}>
                  {t.notebook.renameIt}
                </button>
              )}
              <datalist id="nt-folders">
                {folders.map(folder => (
                  <option key={folder} value={folder} />
                ))}
              </datalist>
              <div class="form-field">
                <label for="nt-type">{t.notebook.type}</label>
                <select id="nt-type" class="input" value={draft.type ?? ''} onChange={event => change({ type: noteTypeOf((event.target as HTMLSelectElement).value) })}>
                  <option value="">{t.notebook.noType}</option>
                  {NOTE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {t.notebook.types[type]}
                    </option>
                  ))}
                </select>
              </div>
              <Field label={t.notebook.tags} value={tagsText} error={errors.tags} onInput={setTagsText} onBlur={commitTags} onEnter={commitTags} />
              <p class="hint">{t.notebook.tagsHint}</p>
            </>
          ) : (
            <p class="sub">
              {note.folder}
              {note.type !== null && ` · ${t.notebook.types[note.type]}`}
              {note.tags.length > 0 && ` · ${note.tags.map(tag => `#${tag}`).join(' ')}`}
            </p>
          )}
          <h3>
            {t.notebook.quests} {note.quests.length > 0 && <span class="sub">{note.quests.length}</span>}
          </h3>
          {note.quests.length === 0 && <p class="hint">{t.notebook.noQuests}</p>}
          <QuestList note={note} quests={quests} onOpen={actions.onOpenQuest} />
          <h3>
            {t.notebook.links} {links.length + questLinks.length > 0 && <span class="sub">{links.length + questLinks.length}</span>}
          </h3>
          {links.length + questLinks.length === 0 && <p class="hint">{t.notebook.noLinks}</p>}
          <ul class="nt-links">
            {links.map(title => {
              const target = noteTitled(notes, title)

              return (
                <li key={title} class="nt-linked">
                  {target === undefined ? (
                    <>
                      <span class="nt-broken">
                        <span aria-hidden="true">? </span>
                        {title}
                      </span>
                      <span class="sub">
                        <span class="sr">{t.notebook.broken(title)}</span>{' '}
                        <span aria-hidden="true">{t.notebook.noLinkWithTitle} </span>
                        {isLive && (
                          <button type="button" class="nt-link" onClick={() => actions.onMake(title, draft.folder)}>
                            {t.notebook.makeIt}
                          </button>
                        )}
                      </span>
                    </>
                  ) : (
                    <button type="button" class="nt-link" onClick={() => actions.onOpen(target.id)}>
                      <span aria-hidden="true">▤ </span>
                      {target.title}
                    </button>
                  )}
                </li>
              )
            })}
            {questLinks.map(id => (
              <QuestItem key={id} id={id} quests={quests} onOpen={actions.onOpenQuest} />
            ))}
          </ul>
          <h3>
            {t.notebook.backlinks} {backlinks.length > 0 && <span class="sub">{backlinks.length}</span>}
          </h3>
          {backlinks.length === 0 && <p class="hint">{t.notebook.noBacklinks}</p>}
          <ul class="nt-links">
            {backlinks.map(other => (
              <li key={other.id} class="nt-linked">
                <button type="button" class="nt-link" onClick={() => actions.onOpen(other.id)}>
                  <span aria-hidden="true">↳ </span>
                  {other.title}
                </button>
                {linkLineOf(other.body, shown.title) !== null && <span class="sub nt-excerpt">{linkLineOf(other.body, shown.title)}</span>}
              </li>
            ))}
          </ul>
          <div class="nt-inspector-foot">
            <p class="sub">{t.notebook.dates(dayOf(note.created), whenOf(note.updated, today, yesterday))}</p>
            <div class="nt-inspector-actions">
              {isLive ? (
                <>
                  <button type="button" class="btn" onClick={togglePin}>
                    {draft.isPinned ? t.notebook.unpin : t.notebook.pin}
                  </button>
                  <button type="button" class="btn" onClick={() => void flush().then(isSaved => isSaved && actions.onArchive(note, true))}>
                    {t.notebook.archiveNote}
                  </button>
                </>
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
          </div>
        </aside>
      )}
      {isBrewing && <BrewSheet engine={engine} realm={realm} realmName={realmName} note={shown} quests={quests} onFiled={actions.onFiled} onRefresh={actions.onRefresh} onClose={() => setBrewing(false)} />}
      {historyNote !== null && <NoteHistory engine={engine} realm={realm} note={historyNote} onClose={closeHistory} onRefresh={actions.onRefresh} onRestored={saved => {
        adopt(saved.note)
        actions.onSaved(saved.view)
        actions.onHeld(note.id, null)
        setRestored(true)
        closeHistory()
      }} />}
    </div>
  )
}
