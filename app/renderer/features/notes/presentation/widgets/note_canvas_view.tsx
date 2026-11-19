import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import type { MutableRef } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import { bookmarkUrlOf } from '../../../../../shared/note_bookmarks'
import type { CanvasNode, CanvasView, NoteCanvas } from '../../../../../shared/note_canvas'
import type { Note } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { CANVAS_DRAG_PX, CANVAS_EXCERPT, CANVAS_FIT_PX, CANVAS_STEP_PX, CANVAS_ZOOM_MAX, CANVAS_ZOOM_MIN, NOTE_AUTOSAVE_MS, NOTE_PICKER_QUEST_ROWS, NOTE_PICKER_ROWS } from '../../../../core/constants/constants'
import { AttachmentInput } from '../../../../core/widgets/attachment_input'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { NoteAttachment } from '../../../../core/widgets/note_attachment'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { boundsOf, cardOf, linePathOf, withCard, withLine, withoutCard, withoutLine, withPlace } from '../../domain/note_canvas'
import type { Card, NewCard, Point } from '../../domain/note_canvas'
import { isInPlay, linkPicksOf, questLineOf } from '../../domain/notes_view'
import type { QuestLine } from '../../domain/notes_view'
import { NoteBookmark } from './note_bookmark'
import { SaveLine } from './note_workspace'
import type { Layout } from './note_workspace'

// screen = world × zoom + (x, y)
type Box = { zoom: number; x: number; y: number }
// What the page keeps while Notes is open: where the board was looked at,
// and a board that couldn't be saved yet, so leaving it loses nothing.
export type CanvasKept = { box: Box | null; held: { canvas: NoteCanvas; stamp: string | null } | null }
export const canvasKeptStart = (): CanvasKept => ({ box: null, held: null })

type Save = { kind: 'saved'; at?: string } | { kind: 'dirty' } | { kind: 'saving' } | { kind: 'failed'; message: string } | { kind: 'changed'; view: CanvasView }
type Drag = { kind: 'pan' | 'move' | 'resize'; node: CanvasNode | null; x: number; y: number; box: Box; isMoving: boolean }

type Props = {
  engine: EngineApi
  realm: string
  notes: readonly Note[]
  quests: Map<string, QuestLine>
  layout: Layout
  kept: MutableRef<CanvasKept>
  onShowList: () => void
  onOpenNote: (id: string) => void
  onOpenQuest: (id: string) => void
  onOpenLink: (url: string) => void
}

// Sixteen hex digits, as Obsidian names cards and lines.
const newId = () => [...crypto.getRandomValues(new Uint8Array(8))].map(byte => byte.toString(16).padStart(2, '0')).join('')
const clampZoom = (zoom: number) => Math.min(CANVAS_ZOOM_MAX, Math.max(CANVAS_ZOOM_MIN, zoom))
const timeNow = () => new Date().toTimeString().slice(0, 5)
const STEPS: Record<string, Point> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } }
// A press on a card's own controls works them and never drags the card.
const isControl = (target: EventTarget | null) => target instanceof Element && target.closest('button, a, input, iframe') !== null
const leafOf = (path: string) => path.split('/').at(-1) ?? path

// Picks a note or a quest in play, as the [[ picker ranks them.
const AddCard = ({ notes, quests, onAdd, onClose }: { notes: readonly Note[]; quests: Map<string, QuestLine>; onAdd: (card: NewCard) => void; onClose: () => void }) => {
  const [query, setQuery] = useState('')
  const picks = linkPicksOf(notes, quests, query, '', NOTE_PICKER_ROWS, NOTE_PICKER_QUEST_ROWS)
  const options: { key: string; title: string; said: string; sub: string; card: NewCard }[] = [
    ...picks.notes.map(note => ({ key: note.id, title: note.title, said: t.notebook.canvas.pickNote(note.title, note.folder), sub: note.folder, card: { kind: 'note' as const, id: note.id } })),
    ...picks.quests.map(quest => ({ key: quest.id, title: quest.title, said: t.notebook.pickQuest(quest.title, t.notebook.questStateSaid[quest.state]), sub: t.notebook.questState[quest.state], card: { kind: 'quest' as const, id: quest.id, title: quest.title } })),
  ]
  const add = (card: NewCard) => {
    onAdd(card)
    onClose()
  }

  return (
    <Dialog title={t.notebook.canvas.addCardTitle} onCancel={onClose} onSubmit={() => options[0] !== undefined && add(options[0].card)}>
      <div class="form-field">
        <label for="nc-find">{t.notebook.canvas.find}</label>
        <input id="nc-find" type="search" class="input" value={query} placeholder={t.notebook.canvas.findPlaceholder} autoComplete="off" onInput={event => setQuery((event.target as HTMLInputElement).value)} />
      </div>
      {options.length === 0 ? (
        <p class="hint">{t.notebook.canvas.noMatch(query.trim())}</p>
      ) : (
        <ul class="nc-picks">
          {options.map(option => (
            <li key={option.key}>
              <button type="button" class="nc-pick" aria-label={option.said} onClick={() => add(option.card)}>
                <span>{option.title}</span>
                <span class="sub">{option.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
      </div>
    </Dialog>
  )
}

const linkError = (text: string): string | undefined => (text.trim() === '' ? t.notebook.canvas.linkRequired : bookmarkUrlOf(text) === null ? t.notebook.canvas.linkBad : undefined)

const AddLink = ({ onAdd, onClose }: { onAdd: (card: NewCard) => void; onClose: () => void }) => {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const submit = () => {
    const found = linkError(text)
    setError(found)
    if (found !== undefined) return
    onAdd({ kind: 'link', url: text.trim() })
    onClose()
  }

  return (
    <Dialog title={t.notebook.canvas.addLinkTitle} onCancel={onClose} onSubmit={submit}>
      <Field label={t.notebook.canvas.webLink} isRequired value={text} error={error} onInput={setText} onBlur={() => setError(linkError(text))} />
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.notebook.canvas.add}
        </button>
      </div>
    </Dialog>
  )
}

// The realm's board: note, quest, image and web-link cards, moved, resized
// and joined by lines. It saves itself a moment after each change, over the
// file it read; a file changed meanwhile stops the saving and asks what to keep.
export const NoteCanvasView = ({ engine, realm, notes, quests, layout, kept, onShowList, onOpenNote, onOpenQuest, onOpenLink }: Props) => {
  const read = useEngineRead(engine, () => engine.readCanvas(realm), [realm])
  const held = useRef(kept.current.held).current
  const [canvas, setCanvas] = useState<NoteCanvas | null>(held?.canvas ?? null)
  const latest = useRef(canvas)
  // The board as its file holds it; null while kept edits aren't on disk.
  const onDisk = useRef<NoteCanvas | null>(null)
  const stamp = useRef<string | null>(held?.stamp ?? null)
  const [save, setSave] = useState<Save>(held === null ? { kind: 'saved' } : { kind: 'dirty' })
  const isHeld = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const running = useRef<Promise<boolean> | null>(null)
  const [box, setBox] = useState<Box>(kept.current.box ?? { zoom: 1, x: 0, y: 0 })
  const isFitted = useRef(kept.current.box !== null)
  const area = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const [isDragging, setDragging] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [lineOn, setLineOn] = useState<string | null>(null)
  const [said, setSaid] = useState('')
  const [adding, setAdding] = useState<'card' | 'link' | null>(null)
  const addCardButton = useRef<HTMLButtonElement>(null)
  const addLinkButton = useRef<HTMLButtonElement>(null)

  const show = (next: NoteCanvas) => {
    latest.current = next
    setCanvas(next)
  }

  const flush = async (): Promise<boolean> => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    if (running.current !== null) await running.current
    const sent = latest.current
    if (isHeld.current || sent === null) return false
    if (sent === onDisk.current) {
      setSave(was => (was.kind === 'saved' ? was : { kind: 'saved' }))

      return true
    }
    const run = (async () => {
      setSave({ kind: 'saving' })
      const answer = await ask(engine, () => engine.saveCanvas(realm, sent, stamp.current))
      if (!answer.ok) {
        setSave({ kind: 'failed', message: answer.message })

        return false
      }
      if (answer.data.kind === 'changed') {
        isHeld.current = true
        setSave({ kind: 'changed', view: answer.data.view })

        return false
      }
      stamp.current = answer.data.stamp
      onDisk.current = sent
      setSave(latest.current === sent ? { kind: 'saved', at: timeNow() } : { kind: 'dirty' })

      return true
    })()
    running.current = run
    const isSaved = await run
    running.current = null
    if (isSaved && latest.current !== onDisk.current) schedule()

    return isSaved
  }

  const schedule = () => {
    if (isHeld.current) return
    if (timer.current !== null) clearTimeout(timer.current)
    setSave(was => (was.kind === 'saving' ? was : { kind: 'dirty' }))
    timer.current = setTimeout(() => void flush(), NOTE_AUTOSAVE_MS)
  }

  const change = (next: NoteCanvas) => {
    show(next)
    schedule()
  }

  const adopt = (view: CanvasView) => {
    latest.current = view.canvas
    onDisk.current = view.canvas
    stamp.current = view.stamp
    isHeld.current = false
    setCanvas(view.canvas)
    setSave({ kind: 'saved' })
  }

  // The first read shows; a later one (the window back in front, say) shows
  // only when nothing here is unsaved. With something unsaved, the next save asks.
  useEffect(() => {
    if (read.load.status !== 'ready') return
    const view = read.load.data
    if (latest.current === null || (view.stamp !== stamp.current && latest.current === onDisk.current && !isHeld.current && running.current === null)) adopt(view)
  }, [read.load])
  useEffect(() => {
    const back = () => read.refresh()
    window.addEventListener('focus', back)

    return () => window.removeEventListener('focus', back)
  }, [read.refresh])
  // Leaving the board saves what's left; what can't be saved stays with the page.
  useEffect(() => {
    kept.current.held = null
    if (held !== null) schedule()
    const closing = () => void flush()
    window.addEventListener('beforeunload', closing)

    return () => {
      window.removeEventListener('beforeunload', closing)
      void flush().then(isSaved => {
        if (!isSaved && latest.current !== null && latest.current !== onDisk.current) kept.current.held = { canvas: latest.current, stamp: stamp.current }
      })
    }
  }, [])
  useEffect(() => {
    kept.current.box = box
  }, [box])

  const fit = (nodes: readonly CanvasNode[]) => {
    const rect = area.current?.getBoundingClientRect()
    if (rect === undefined || rect.width === 0) return
    const bounds = boundsOf(nodes)
    if (bounds === null) return setBox({ zoom: 1, x: rect.width / 2, y: rect.height / 2 })
    const zoom = clampZoom(Math.min(1, (rect.width - 2 * CANVAS_FIT_PX) / (bounds.right - bounds.left), (rect.height - 2 * CANVAS_FIT_PX) / (bounds.bottom - bounds.top)))
    setBox({ zoom, x: rect.width / 2 - ((bounds.left + bounds.right) / 2) * zoom, y: rect.height / 2 - ((bounds.top + bounds.bottom) / 2) * zoom })
  }
  // Fitted once, when the board first shows; after that it stays where it was left.
  useLayoutEffect(() => {
    if (canvas === null || isFitted.current) return
    isFitted.current = true
    fit(canvas.nodes)
  }, [canvas !== null])

  const zoomBy = (factor: number, at?: Point) => {
    const rect = area.current?.getBoundingClientRect()
    const [px, py] = at === undefined ? [(rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2] : [at.x, at.y]
    setBox(v => {
      const zoom = clampZoom(v.zoom * factor)

      return { zoom, x: px - ((px - v.x) * zoom) / v.zoom, y: py - ((py - v.y) * zoom) / v.zoom }
    })
  }
  // A wheel pans, or zooms around the pointer with ⌘ or a pinch. It has to
  // stop the page scrolling, so it can't be a passive listener.
  const latestWheel = useRef<(event: WheelEvent) => void>(() => {})
  latestWheel.current = event => {
    event.preventDefault()
    if (!(event.ctrlKey || event.metaKey)) return setBox(v => ({ ...v, x: v.x - event.deltaX, y: v.y - event.deltaY }))
    const rect = area.current!.getBoundingClientRect()
    zoomBy(Math.exp(-event.deltaY * 0.01), { x: event.clientX - rect.left, y: event.clientY - rect.top })
  }
  useEffect(() => {
    const element = area.current
    const heard = (event: WheelEvent) => latestWheel.current(event)
    element?.addEventListener('wheel', heard, { passive: false })

    return () => element?.removeEventListener('wheel', heard)
  }, [canvas !== null])

  const cardOfId = (id: string) => latest.current?.nodes.find(node => node.id === id)
  const nameOf = (node: CanvasNode | undefined): string => {
    if (node === undefined) return ''
    const card = cardOf(node)
    if (card.kind === 'note') {
      const note = notes.find(one => one.id === card.id)

      return note === undefined ? t.notebook.canvas.missingCard : t.notebook.canvas.noteCard(note.title)
    }
    if (card.kind === 'quest') return t.notebook.canvas.questCard(questLineOf(quests, card.id).title ?? card.shown)
    if (card.kind === 'link') return t.notebook.canvas.linkCard(new URL(card.url).host)
    if (card.kind === 'file') return t.notebook.canvas.fileCard(leafOf(card.path))
    if (card.kind === 'group') return t.notebook.canvas.groupCard(card.label)

    return card.kind === 'text' ? t.notebook.canvas.textCard : t.notebook.canvas.unknownCard
  }
  const focusCard = (id: string) => requestAnimationFrame(() => document.getElementById(`nc-card-${id}`)?.focus())

  // Where the middle of the board's window is, in the board's own units.
  const viewCentre = (): Point => {
    const rect = area.current?.getBoundingClientRect()

    return { x: ((rect?.width ?? 0) / 2 - box.x) / box.zoom, y: ((rect?.height ?? 0) / 2 - box.y) / box.zoom }
  }
  const add = (card: NewCard) => {
    if (latest.current === null) return
    const id = newId()
    change(withCard(latest.current, id, card, viewCentre()))
    focusCard(id)
  }
  const remove = (id: string) => {
    if (latest.current === null) return
    setSaid(t.notebook.canvas.removed(nameOf(cardOfId(id))))
    if (connecting === id) setConnecting(null)
    change(withoutCard(latest.current, id))
    area.current?.focus()
  }
  const removeLine = (id: string) => {
    if (latest.current === null) return
    setLineOn(null)
    change(withoutLine(latest.current, id))
    area.current?.focus()
  }
  const join = (fromId: string, toId: string) => {
    if (latest.current === null) return
    const next = withLine(latest.current, newId(), fromId, toId)
    setConnecting(null)
    if (next === latest.current) return setSaid(t.notebook.canvas.notConnected)
    setSaid(t.notebook.canvas.connected(nameOf(cardOfId(fromId)), nameOf(cardOfId(toId))))
    change(next)
  }
  // A note opens, as picking it in the list does; a quest only while it's in play.
  const open = (node: CanvasNode) => {
    const card = cardOf(node)
    if (card.kind === 'note' && notes.some(note => note.id === card.id)) onOpenNote(card.id)
    else if (card.kind === 'quest' && isInPlay(quests, card.id)) onOpenQuest(card.id)
    else if (card.kind === 'link') onOpenLink(card.url)
  }
  // A click on a card picks it, or joins it to the card waiting for a line.
  const pick = (id: string) => {
    if (connecting !== null) join(connecting, id)
    focusCard(id)
  }

  const latestMove = useRef<(event: MouseEvent) => void>(() => {})
  latestMove.current = event => {
    const start = drag.current
    if (start === null || latest.current === null) return
    const [dx, dy] = [event.clientX - start.x, event.clientY - start.y]
    if (!start.isMoving && Math.hypot(dx, dy) <= CANVAS_DRAG_PX) return
    if (!start.isMoving) {
      start.isMoving = true
      setDragging(true)
    }
    if (start.kind === 'pan' || start.node === null) return setBox({ ...start.box, x: start.box.x + dx, y: start.box.y + dy })
    const [wx, wy] = [dx / start.box.zoom, dy / start.box.zoom]
    const node = start.node
    show(withPlace(latest.current, node.id, start.kind === 'move' ? { x: node.x + wx, y: node.y + wy } : { width: node.width + wx, height: node.height + wy }))
  }
  const latestUp = useRef<() => void>(() => {})
  latestUp.current = () => {
    const start = drag.current
    drag.current = null
    window.removeEventListener('mousemove', onWindowMove)
    window.removeEventListener('mouseup', onWindowUp)
    setDragging(false)
    if (start === null) return
    // Moves save once, when the card is let go.
    if (start.isMoving) return start.kind === 'pan' ? undefined : schedule()
    if (start.node !== null) pick(start.node.id)
  }
  const onWindowMove = useRef((event: MouseEvent) => latestMove.current(event)).current
  const onWindowUp = useRef(() => latestUp.current()).current
  useEffect(
    () => () => {
      window.removeEventListener('mousemove', onWindowMove)
      window.removeEventListener('mouseup', onWindowUp)
    },
    [],
  )
  const press = (event: MouseEvent, kind: Drag['kind'], node: CanvasNode | null) => {
    if (event.button !== 0 || drag.current !== null) return
    event.stopPropagation()
    if (isControl(event.target)) return
    // No text selection or picture drag while dragging; the card takes focus on release.
    event.preventDefault()
    drag.current = { kind, node, x: event.clientX, y: event.clientY, box, isMoving: false }
    window.addEventListener('mousemove', onWindowMove)
    window.addEventListener('mouseup', onWindowUp)
  }

  const cardKeys = (event: KeyboardEvent, id: string) => {
    const node = cardOfId(id)
    if (event.target !== event.currentTarget || node === undefined || latest.current === null) return
    const step = STEPS[event.key]
    if (step !== undefined && !event.metaKey) {
      event.preventDefault()
      const by = CANVAS_STEP_PX * (event.shiftKey ? 4 : 1)
      change(withPlace(latest.current, id, event.altKey ? { width: node.width + step.x * by, height: node.height + step.y * by } : { x: node.x + step.x * by, y: node.y + step.y * by }))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (connecting === null) open(node)
      else join(connecting, id)
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      remove(id)
    }
  }

  const bar = (
    <header class="nt-head">
      {layout === 'narrow' && (
        <button type="button" id="nt-show-list" class="chip-btn" onClick={onShowList}>
          {t.notebook.showList}
        </button>
      )}
      <h2 class="nc-title">{t.notebook.canvas.title}</h2>
      {canvas !== null && <SaveLine save={save.kind === 'changed' ? { kind: 'changed', note: null } : save} onRetry={() => void flush()} />}
    </header>
  )

  if (canvas === null) {
    return (
      <section class="nt-editor panel nc" aria-label={t.notebook.canvas.title}>
        {bar}
        {read.load.status === 'failed' ? (
          <div class="state" role="alert">
            <h2 class="state-title">{t.notebook.canvas.readFailed}</h2>
            <p class="state-line">{read.load.message}</p>
            <div class="nt-fail-actions">
              <button type="button" class="btn" onClick={read.retry}>
                {t.failed.tryAgain}
              </button>
              <button type="button" class="nt-link" onClick={() => void ask(engine, () => engine.showNotes(realm))}>
                {t.notebook.showInFinder}
              </button>
            </div>
          </div>
        ) : (
          <div class="state" role="status">
            <Spinner />
            <p class="state-line">{t.notebook.canvas.reading}</p>
          </div>
        )}
      </section>
    )
  }

  const byId = new Map(canvas.nodes.map(node => [node.id, node]))
  const lines = canvas.edges.flatMap(edge => {
    const [from, to] = [byId.get(edge.fromNode), byId.get(edge.toNode)]

    return from === undefined || to === undefined ? [] : [{ edge, path: linePathOf(from, to, edge), said: t.notebook.canvas.line(nameOf(from), nameOf(to)) }]
  })
  const lineShown = lines.find(line => line.edge.id === lineOn)
  // Groups sit behind the cards they hold.
  const ordered = [...canvas.nodes.filter(node => node.type === 'group'), ...canvas.nodes.filter(node => node.type !== 'group')]

  const body = (node: CanvasNode, card: Card) => {
    if (card.kind === 'note') {
      const note = notes.find(one => one.id === card.id)
      if (note === undefined) return <p class="sub">{t.notebook.canvas.missingNote}</p>

      return (
        <>
          <button type="button" class="nt-link nc-card-title" aria-label={t.notebook.canvas.openNote(note.title)} onClick={() => onOpenNote(note.id)}>
            {note.title}
          </button>
          <span class="sub">
            {note.folder}
            {note.type !== null && ` · ${t.notebook.types[note.type]}`}
            {note.isArchived && ` · ${t.notebook.canvas.archived}`}
          </span>
          <p class="nc-excerpt">{note.body.replace(/\s+/g, ' ').trim().slice(0, CANVAS_EXCERPT)}</p>
        </>
      )
    }
    if (card.kind === 'quest') {
      const line = questLineOf(quests, card.id)

      return (
        <>
          {line.title !== null && isInPlay(quests, card.id) ? (
            <button type="button" class="nt-link nc-card-title" aria-label={t.notebook.openQuestLink(line.title, t.notebook.questStateSaid[line.state])} onClick={() => onOpenQuest(card.id)}>
              {line.title}
            </button>
          ) : (
            <span class={line.title === null ? 'nc-card-title nt-broken' : 'nc-card-title'}>{line.title ?? card.shown}</span>
          )}
          <span class="nt-quest-meta">
            <span class={`nt-state ${line.state}`}>{t.notebook.questState[line.state]}</span>
            {line.priority !== null && line.difficulty !== null && <span class="sub">{t.notebook.questMeta(t.priority[line.priority], t.difficulty[line.difficulty])}</span>}
          </span>
        </>
      )
    }
    if (card.kind === 'link') return <NoteBookmark engine={engine} url={card.url} onOpenLink={onOpenLink} />
    if (card.kind === 'file') return <NoteAttachment engine={engine} realm={realm} path={card.path} name={leafOf(card.path)} embedded />
    if (card.kind === 'text') return <p class="nc-text">{card.text}</p>
    if (card.kind === 'group') return null

    return <p class="sub">{t.notebook.canvas.otherCard(card.text || node.type)}</p>
  }

  return (
    <section class="nt-editor panel nc" aria-label={t.notebook.canvas.title}>
      {bar}
      {read.note !== null && (
        <p class="hint" role="status">
          {read.note}
        </p>
      )}
      {save.kind === 'changed' && (
        <div class="nt-banner" role="alert">
          <b>{t.notebook.canvas.changedTitle}</b>
          <span>{t.notebook.canvas.changedLine}</span>
          <span class="nt-banner-actions">
            <button
              type="button"
              class="btn primary"
              onClick={() => {
                stamp.current = save.view.stamp
                onDisk.current = null
                isHeld.current = false
                void flush()
              }}
            >
              {t.notebook.keepMine}
            </button>
            <button type="button" class="btn" onClick={() => adopt(save.view)}>
              {t.notebook.loadTheirs}
            </button>
          </span>
        </div>
      )}
      <div class="nc-tools" role="toolbar" aria-label={t.notebook.canvas.title}>
        <button ref={addCardButton} type="button" class="chip-btn" onClick={() => setAdding('card')}>
          {t.notebook.canvas.addCard}
        </button>
        <button ref={addLinkButton} type="button" class="chip-btn" onClick={() => setAdding('link')}>
          {t.notebook.canvas.addLink}
        </button>
        <span class="nc-zoom">
          <button type="button" class="chip-btn" onClick={() => fit(canvas.nodes)}>
            {t.notebook.canvas.fit}
          </button>
          <button type="button" class="icon-btn" aria-label={t.notebook.canvas.zoomOut} onClick={() => zoomBy(1 / 1.25)}>
            −
          </button>
          <span class="sub" aria-hidden="true">
            {Math.round(box.zoom * 100)}%
          </span>
          <button type="button" class="icon-btn" aria-label={t.notebook.canvas.zoomIn} onClick={() => zoomBy(1.25)}>
            +
          </button>
        </span>
      </div>
      <AttachmentInput engine={engine} realm={realm} id={null} onFile={async file => add({ kind: 'file', path: file.path })}>
        <div
          ref={area}
          class={isDragging ? 'nc-board is-dragging' : 'nc-board'}
          tabIndex={-1}
          role="region"
          aria-label={t.notebook.canvas.board(canvas.nodes.length, lines.length)}
          aria-describedby="nc-keys"
          onMouseDown={event => {
            setLineOn(null)
            press(event, 'pan', null)
          }}
          onKeyDown={event => {
            if (event.key !== 'Escape' || connecting === null) return
            event.stopPropagation()
            const from = connecting
            setConnecting(null)
            setSaid('')
            focusCard(from)
          }}
        >
          <div class="nc-world" style={{ transform: `translate(${box.x}px, ${box.y}px) scale(${box.zoom})` }}>
            <svg class="nc-lines">
              <defs>
                <marker id="nc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
              </defs>
              {lines.map(({ edge, path, said: label }) => (
                <g
                  key={edge.id}
                  class={edge.id === lineOn ? 'nc-line on' : 'nc-line'}
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                  aria-keyshortcuts="Delete"
                  onFocus={() => setLineOn(edge.id)}
                  onMouseDown={event => {
                    event.stopPropagation()
                    event.preventDefault()
                    ;(event.currentTarget as SVGGElement).focus()
                  }}
                  onKeyDown={event => {
                    if (event.key !== 'Delete' && event.key !== 'Backspace') return
                    event.preventDefault()
                    removeLine(edge.id)
                  }}
                >
                  <path class="nc-line-hit" d={path.d} />
                  <path class="nc-line-stroke" d={path.d} marker-end={path.isArrowTo ? 'url(#nc-arrow)' : undefined} marker-start={path.isArrowFrom ? 'url(#nc-arrow)' : undefined} />
                </g>
              ))}
            </svg>
            {lineShown !== undefined && (
              <button
                type="button"
                class="icon-btn nc-line-remove"
                style={{ left: `${lineShown.path.mid.x}px`, top: `${lineShown.path.mid.y}px` }}
                aria-label={t.notebook.canvas.removeLine}
                tabIndex={-1}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={() => removeLine(lineShown.edge.id)}
              >
                ✕
              </button>
            )}
            {ordered.map(node => {
              const card = cardOf(node)
              const name = nameOf(node)

              return (
                <div
                  key={node.id}
                  id={`nc-card-${node.id}`}
                  class={[`nc-card ${card.kind}`, connecting === node.id && 'is-from'].filter(Boolean).join(' ')}
                  style={{ left: `${node.x}px`, top: `${node.y}px`, width: `${node.width}px`, height: `${node.height}px` }}
                  tabIndex={0}
                  role="group"
                  aria-label={name}
                  onMouseDown={event => press(event, 'move', node)}
                  onKeyDown={event => cardKeys(event, node.id)}
                >
                  <div class="nc-card-head">
                    {card.kind === 'group' && <span class="nc-group-label">{card.label}</span>}
                    <span class="nc-card-actions">
                      <button type="button" class="chip-btn" aria-label={t.notebook.canvas.connectLabel(name)} aria-pressed={connecting === node.id} onClick={() => {
                        setConnecting(node.id)
                        setSaid(t.notebook.canvas.connecting(name))
                      }}>
                        {t.notebook.canvas.connect}
                      </button>
                      <button type="button" class="chip-btn" aria-label={t.notebook.canvas.removeLabel(name)} onClick={() => remove(node.id)}>
                        {t.notebook.canvas.remove}
                      </button>
                    </span>
                  </div>
                  <div class="nc-card-body">{body(node, card)}</div>
                  <span class="nc-resize" aria-hidden="true" onMouseDown={event => press(event, 'resize', node)} />
                </div>
              )
            })}
          </div>
          {canvas.nodes.length === 0 && (
            <div class="nc-empty">
              <p class="state-title">{t.notebook.canvas.empty}</p>
              <p class="hint">{t.notebook.canvas.emptyLine}</p>
            </div>
          )}
          <p class="nc-said" role="status" aria-live="polite">
            {connecting !== null ? t.notebook.canvas.connecting(nameOf(cardOfId(connecting))) : said}
          </p>
        </div>
      </AttachmentInput>
      <p class="hint" id="nc-keys">
        {t.notebook.canvas.cardKeys}
      </p>
      {adding === 'card' && (
        <AddCard
          notes={notes}
          quests={quests}
          onAdd={add}
          onClose={() => {
            setAdding(null)
            addCardButton.current?.focus()
          }}
        />
      )}
      {adding === 'link' && (
        <AddLink
          onAdd={add}
          onClose={() => {
            setAdding(null)
            addLinkButton.current?.focus()
          }}
        />
      )}
    </section>
  )
}
