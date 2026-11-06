import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'

import { isText } from '../../../../../shared/designs'
import type { CommentInput, DesignComment, Layer, Problem, Scene, TextLayer } from '../../../../../shared/designs'
import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX, NUDGE_PX, ZOOM_RANGE } from '../../../../core/constants/constants'
import { Dialog } from '../../../../core/widgets/dialog'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { useWindowWidth } from '../../../../core/widgets/window_width'
import { t } from '../../../../l10n/en'
import { commit, historyOf, redo, undo } from '../../domain/history'
import type { History } from '../../domain/history'
import { DESIGN_FRAME, duplicateLayer, handlesOf, layerOf, moveBy, parentOf, pathTo, placeOf, removeLayer, resizeBox, stepFrom, updateLayer } from '../../domain/scene_edits'
import type { Box, Handle } from '../../domain/scene_edits'
import { useAutosave } from '../state_management/use_autosave'
import type { SaveState } from '../state_management/use_autosave'
import { CommentsPanel } from './comments_panel'
import { Inspector } from './inspector'
import { SceneView, textStyle } from './scene_view'

type Gesture =
  | { kind: 'pan'; cx: number; cy: number; x: number; y: number }
  | { kind: 'move'; id: string; cx: number; cy: number; start: Scene; moved: boolean }
  | { kind: 'resize'; id: string; handle: Handle; cx: number; cy: number; start: Scene; box: Box }

type View = { zoom: number; x: number; y: number }

const clampZoom = (zoom: number) => Math.min(ZOOM_RANGE.high, Math.max(ZOOM_RANGE.low, zoom))

export const isTyping = (target: EventTarget | null) => target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"]') !== null

const elementOf = (root: HTMLElement | null, id: string): HTMLElement | null => [...(root?.querySelectorAll<HTMLElement>('[data-layer]') ?? [])].find(el => el.dataset.layer === id) ?? null

// Where the selection sits, in the parent's space; a text's height is what it
// measures on screen, since it grows with what it says.
const boxOf = (scene: Scene, id: string, root: HTMLElement | null): Box | null => {
  if (id === DESIGN_FRAME) return { x: 0, y: 0, width: scene.width, height: scene.height }
  const layer = layerOf(scene, id)
  if (layer === null) return null
  const height = typeof layer.height === 'number' && !isText(layer) ? layer.height : (elementOf(root, id)?.offsetHeight ?? layer.height ?? 40)

  return { x: layer.x, y: layer.y, width: layer.width, height }
}

const withBox = (scene: Scene, id: string, box: Box): Scene => {
  if (id === DESIGN_FRAME) return updateLayer(scene, id, { width: box.width, height: box.height })
  const layer = layerOf(scene, id)
  if (layer !== null && isText(layer)) return updateLayer(scene, id, { x: box.x, width: box.width })

  return updateLayer(scene, id, box)
}

const Selection = ({ scene, id, root }: { scene: Scene; id: string; root: HTMLElement | null }) => {
  const [, remeasure] = useState(0)
  const box = boxOf(scene, id, root)
  // A text's height is only known once it's drawn.
  useLayoutEffect(() => {
    if (id !== DESIGN_FRAME && boxOf(scene, id, root)?.height !== box?.height) remeasure(n => n + 1)
  })
  if (box === null) return null
  const at = id === DESIGN_FRAME ? { x: 0, y: 0 } : (placeOf(scene, id) ?? { x: 0, y: 0 })
  const layer = id === DESIGN_FRAME ? null : layerOf(scene, id)

  return (
    <div class="dz-sel" style={{ left: `${at.x}px`, top: `${at.y}px`, width: `${box.width}px`, height: `${box.height}px` }}>
      {handlesOf(id, layer).map(handle => (
        <span key={handle} class={`dz-handle h-${handle}`} data-handle={handle} />
      ))}
      <span class="dz-size">
        {Math.round(box.width)} × {Math.round(box.height)}
      </span>
    </div>
  )
}

// Typing into a text in place, in its own font, at the canvas's zoom.
const TextEdit = ({ layer, at, onDone }: { layer: TextLayer; at: { x: number; y: number }; onDone: (text: string) => void }) => {
  const [value, setValue] = useState(layer.text)
  const box = useRef<HTMLTextAreaElement>(null)
  const isDone = useRef(false)
  const done = (text: string) => {
    if (isDone.current) return
    isDone.current = true
    onDone(text)
  }
  useLayoutEffect(() => {
    box.current?.focus()
    box.current?.select()
  }, [])
  useLayoutEffect(() => {
    const el = box.current
    if (el === null) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  })

  return (
    <textarea
      ref={box}
      class="dz-textedit"
      aria-label={layer.name}
      style={{ left: `${at.x}px`, top: `${at.y}px`, width: `${layer.width}px`, ...textStyle(layer) }}
      value={value}
      onInput={event => setValue((event.target as HTMLTextAreaElement).value)}
      onBlur={() => done(value)}
      onKeyDown={event => {
        if (event.key === 'Escape' || (event.key === 'Enter' && event.metaKey)) {
          event.preventDefault()
          event.stopPropagation()
          done(value)
        }
      }}
    />
  )
}

const saveLine = (state: SaveState, isWaiting: boolean): string => {
  if (state.kind === 'failed') return t.designs.saveFailed
  if (state.kind === 'changed') return t.designs.changedOnDisk
  if (state.kind === 'saving' || isWaiting) return t.designs.saving

  return state.kind === 'saved' ? t.designs.savedAt(state.at) : t.designs.upToDate
}

export type EditorProps = {
  engine: EngineApi
  realm: string
  folder: string
  label: string
  id: string
  scene: Scene
  stamp: string
  comments: DesignComment[]
  commentsProblem: Problem | null
  onBack: () => void
  onReload: () => void
  onCopied: (name: string) => void
  onAddComment: (input: CommentInput) => Promise<Answer<unknown>>
  onSetComment: (id: string, isResolved: boolean) => Promise<Answer<unknown>>
}

export const DesignEditor = ({ engine, realm, folder, label, id, scene: first, stamp, comments, commentsProblem, onBack, onReload, onCopied, onAddComment, onSetComment }: EditorProps) => {
  const [history, setHistory] = useState<History>(() => historyOf(first))
  const [draft, setDraft] = useState<Scene | null>(null)
  const scene = draft ?? history.present
  const [picked, setPicked] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [view, setView] = useState<View>({ zoom: 1, x: 32, y: 32 })
  const [panel, setPanel] = useState<'inspector' | 'comments' | null>(null)
  const [dialog, setDialog] = useState<'failed' | 'changed' | null>(null)
  const [copyFailure, setCopyFailure] = useState<string | null>(null)
  const save = useAutosave(engine, realm, folder, id, stamp)
  const isNarrow = useWindowWidth() < DETAIL_IS_PAGE_BELOW
  const viewport = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const isSpace = useRef(false)

  // A selection undone out of the design is no selection.
  const layer = picked !== null && picked !== DESIGN_FRAME ? layerOf(scene, picked) : null
  const selected = picked === DESIGN_FRAME || layer !== null ? picked : null

  const change = (next: Scene) => {
    const after = commit(history, next)
    if (after === history) return
    setHistory(after)
    save.schedule(after.present)
  }
  const step = (move: (h: History) => History) => {
    const after = move(history)
    if (after === history) return
    setHistory(after)
    save.schedule(after.present)
  }

  useEffect(() => {
    if (save.state.kind === 'failed' || save.state.kind === 'changed') setDialog(save.state.kind)
  }, [save.state.kind])

  const fit = () => {
    const box = viewport.current?.getBoundingClientRect()
    if (box === undefined) return
    const zoom = clampZoom(Math.min((box.width - 64) / scene.width, (box.height - 64) / scene.height, 1))
    setView({ zoom, x: Math.max(16, (box.width - scene.width * zoom) / 2), y: Math.max(16, (box.height - scene.height * zoom) / 2) })
  }
  useLayoutEffect(fit, [])

  // Zooms keeping the point under (cx, cy) still; the viewport's middle by default.
  const zoomTo = (zoom: number, cx?: number, cy?: number) => {
    const box = viewport.current?.getBoundingClientRect()
    const px = cx ?? (box?.width ?? 0) / 2
    const py = cy ?? (box?.height ?? 0) / 2
    setView(v => {
      const next = clampZoom(zoom)

      return { zoom: next, x: px - ((px - v.x) * next) / v.zoom, y: py - ((py - v.y) * next) / v.zoom }
    })
  }

  // A wheel is a pan, or a zoom with ⌘ or a pinch. It has to be able to stop
  // the page scrolling, so it can't be a passive listener.
  const latestWheel = useRef<(event: WheelEvent) => void>(() => {})
  latestWheel.current = event => {
    event.preventDefault()
    if (event.ctrlKey || event.metaKey) {
      const box = viewport.current!.getBoundingClientRect()
      zoomTo(view.zoom * Math.exp(-event.deltaY * 0.01), event.clientX - box.left, event.clientY - box.top)
    } else setView(v => ({ ...v, x: v.x - event.deltaX, y: v.y - event.deltaY }))
  }
  useEffect(() => {
    const el = viewport.current
    const heard = (event: WheelEvent) => latestWheel.current(event)
    el?.addEventListener('wheel', heard, { passive: false })

    return () => el?.removeEventListener('wheel', heard)
  }, [])

  useEffect(() => {
    const up = (event: KeyboardEvent) => {
      if (event.key === ' ') isSpace.current = false
    }
    window.addEventListener('keyup', up)

    return () => window.removeEventListener('keyup', up)
  }, [])

  const duplicate = () => {
    if (layer === null) return
    const copied = duplicateLayer(scene, layer.id)
    if (copied === null) return
    change(copied.scene)
    setPicked(copied.id)
  }
  const remove = () => {
    if (layer === null) return
    change(removeLayer(scene, layer.id))
    setPicked(parentOf(scene, layer.id))
  }

  useWindowKeys(event => {
    if (document.querySelector('[role="dialog"]') !== null || isTyping(event.target)) return
    const key = event.key.toLowerCase()
    if (event.metaKey) {
      const zoomKeys: Record<string, () => void> = { '=': () => zoomTo(view.zoom * 1.25), '+': () => zoomTo(view.zoom * 1.25), '-': () => zoomTo(view.zoom / 1.25), '0': () => zoomTo(1) }
      if (key === 'z') step(event.shiftKey ? redo : undo)
      else if (key === 'd') duplicate()
      else if (zoomKeys[key] !== undefined) zoomKeys[key]()
      else return
      event.preventDefault()

      return
    }
    if (event.ctrlKey || event.altKey) return
    if (event.shiftKey && event.code === 'Digit1') {
      event.preventDefault()
      fit()

      return
    }
    // The rest act on the canvas, not on a button or a link that has focus.
    if (event.target !== viewport.current && event.target !== document.body) return
    const nudge = event.shiftKey ? NUDGE_PX.big : NUDGE_PX.small
    const arrows: Record<string, [number, number]> = { arrowleft: [-nudge, 0], arrowright: [nudge, 0], arrowup: [0, -nudge], arrowdown: [0, nudge] }
    if (key === ' ') isSpace.current = true
    else if (key === 'tab') setPicked(stepFrom(scene, layer?.id ?? null, event.shiftKey))
    else if (key === 'escape') setPicked(layer === null ? null : parentOf(scene, layer.id))
    else if (key === 'enter' && layer !== null && isText(layer)) setEditing(layer.id)
    else if ((key === 'backspace' || key === 'delete') && layer !== null) remove()
    else if (arrows[key] !== undefined && layer !== null) change(moveBy(scene, layer.id, ...arrows[key]))
    else return
    event.preventDefault()
  })

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 && event.button !== 1) return
    viewport.current?.focus({ preventScroll: true })
    const target = event.target as HTMLElement
    const capture = () => viewport.current?.setPointerCapture?.(event.pointerId)
    if (isSpace.current || event.button === 1) {
      gesture.current = { kind: 'pan', cx: event.clientX, cy: event.clientY, x: view.x, y: view.y }
      capture()

      return
    }
    const handle = target.closest<HTMLElement>('[data-handle]')?.dataset.handle as Handle | undefined
    const box = selected === null ? null : boxOf(scene, selected, stage.current)
    if (handle !== undefined && selected !== null && box !== null) {
      gesture.current = { kind: 'resize', id: selected, handle, cx: event.clientX, cy: event.clientY, start: scene, box }
      capture()

      return
    }
    const hit = target.closest<HTMLElement>('[data-layer]')?.dataset.layer
    if (hit !== undefined) {
      // Inside what's selected, the selection moves; double-click goes deeper.
      const path = pathTo(scene.nodes, hit)?.map(l => l.id) ?? []
      const moving = selected !== null && path.includes(selected) ? selected : hit
      setPicked(moving)
      gesture.current = { kind: 'move', id: moving, cx: event.clientX, cy: event.clientY, start: scene, moved: false }
      capture()

      return
    }
    setPicked(target.closest('.dz-scene, .dz-frame-name') !== null ? DESIGN_FRAME : null)
  }

  const onPointerMove = (event: PointerEvent) => {
    const g = gesture.current
    if (g === null) return
    if (g.kind === 'pan') {
      setView(v => ({ ...v, x: g.x + event.clientX - g.cx, y: g.y + event.clientY - g.cy }))

      return
    }
    const dx = (event.clientX - g.cx) / view.zoom
    const dy = (event.clientY - g.cy) / view.zoom
    if (g.kind === 'move') {
      if (!g.moved && Math.hypot(event.clientX - g.cx, event.clientY - g.cy) < DRAG_SLOP_PX) return
      g.moved = true
      setDraft(moveBy(g.start, g.id, dx, dy))
    } else setDraft(withBox(g.start, g.id, resizeBox(g.box, g.handle, dx, dy, event.shiftKey)))
  }

  const onPointerUp = () => {
    gesture.current = null
    if (draft !== null) change(draft)
    setDraft(null)
  }

  const onDoubleClick = (event: MouseEvent) => {
    // The first click captured the pointer, so the event's target is the
    // canvas: what's under the pointer is the layer that was clicked.
    const under = document.elementFromPoint(event.clientX, event.clientY) ?? (event.target as Element)
    const hit = under.closest<HTMLElement>('[data-layer]')?.dataset.layer
    if (hit === undefined) return
    setPicked(hit)
    const found = layerOf(scene, hit)
    if (found !== null && isText(found)) setEditing(hit)
  }

  const editingLayer = editing === null ? null : layerOf(scene, editing)
  const saveMine = async () => {
    setCopyFailure(null)
    const answer = await ask(engine, () => engine.saveDesignCopy(realm, folder, id, history.present))
    if (!answer.ok) {
      setCopyFailure(answer.message)

      return
    }
    onCopied(history.present.name)
    onReload()
  }

  const ownComments = comments.filter(c => c.design === id)
  const open = ownComments.filter(c => c.resolved === null && c.sentTo === null).length
  const inspector = <Inspector scene={scene} selected={selected} onChange={patch => selected !== null && change(updateLayer(scene, selected, patch))} onDuplicate={duplicate} onRemove={remove} />
  const commentsPanel = <CommentsPanel scene={scene} designId={id} comments={ownComments} problem={commentsProblem} about={layer as Layer | null} onAdd={onAddComment} onSet={onSetComment} />

  return (
    <div class={`dz-editor${isNarrow ? ' narrow' : ''}`}>
      <div class="dz-ed-top panel">
        <button type="button" class="link-btn" onClick={onBack}>
          {t.designs.back(label)}
        </button>
        <h1>{scene.name}</h1>
        <button type="button" class={`dz-save s-${save.state.kind}`} onClick={() => (save.state.kind === 'failed' || save.state.kind === 'changed') && setDialog(save.state.kind)} aria-live="polite">
          {saveLine(save.state, save.hasPending())}
        </button>
        <span class="dz-tools">
          <button type="button" class="icon-btn" aria-label={t.designs.undo} disabled={history.past.length === 0} onClick={() => step(undo)}>
            ↶
          </button>
          <button type="button" class="icon-btn" aria-label={t.designs.redo} disabled={history.future.length === 0} onClick={() => step(redo)}>
            ↷
          </button>
          <button type="button" class="icon-btn" aria-label={t.designs.zoomOut} onClick={() => zoomTo(view.zoom / 1.25)}>
            −
          </button>
          <button type="button" class="dz-zoom" onClick={fit} aria-label={t.designs.fit}>
            {t.designs.zoom(view.zoom)}
          </button>
          <button type="button" class="icon-btn" aria-label={t.designs.zoomIn} onClick={() => zoomTo(view.zoom * 1.25)}>
            +
          </button>
          {isNarrow && (
            <>
              <button type="button" class={`chip-btn${panel === 'inspector' ? ' on' : ''}`} onClick={() => setPanel(panel === 'inspector' ? null : 'inspector')}>
                {t.designs.inspector}
              </button>
              <button type="button" class={`chip-btn${panel === 'comments' ? ' on' : ''}`} onClick={() => setPanel(panel === 'comments' ? null : 'comments')}>
                {t.designs.commentsButton(open)}
              </button>
            </>
          )}
        </span>
      </div>
      <div class="dz-ed-body">
        <div
          ref={viewport}
          class="dz-viewport panel"
          tabIndex={0}
          role="application"
          aria-label={t.designs.canvas(scene.name)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDblClick={onDoubleClick}
        >
          <div ref={stage} class="dz-stage" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`, '--z': view.zoom }}>
            <span class="dz-frame-name">
              {scene.name} {scene.width} × {scene.height}
            </span>
            <SceneView scene={scene} editing={editing} />
            {selected !== null && editing === null && <Selection scene={scene} id={selected} root={stage.current} />}
            {editingLayer !== null && isText(editingLayer) && (
              <TextEdit
                layer={editingLayer}
                at={placeOf(scene, editingLayer.id) ?? { x: 0, y: 0 }}
                onDone={text => {
                  setEditing(null)
                  viewport.current?.focus({ preventScroll: true })
                  if (text !== editingLayer.text) change(updateLayer(scene, editingLayer.id, { text }))
                }}
              />
            )}
          </div>
          <p class="dz-hint">{editing === null ? t.designs.hint : t.designs.editingText}</p>
        </div>
        {!isNarrow && (
          <aside class="dz-side">
            {inspector}
            {commentsPanel}
          </aside>
        )}
        {isNarrow && panel !== null && (
          <aside class="dz-float panel">
            <button type="button" class="icon-btn dz-float-x" aria-label={t.designs.close} onClick={() => setPanel(null)}>
              ✕
            </button>
            {panel === 'inspector' ? inspector : commentsPanel}
          </aside>
        )}
      </div>
      {dialog === 'failed' && save.state.kind === 'failed' && (
        <Dialog
          title={t.designs.saveFailedTitle(scene.name)}
          onCancel={() => setDialog(null)}
          onSubmit={() => {
            setDialog(null)
            void save.flush()
          }}
        >
          <p class="form-line">{save.state.message}</p>
          <p class="form-line">{t.designs.saveFailedKeep}</p>
          <div class="sheet-actions">
            <button type="button" class="btn" onClick={() => setDialog(null)}>
              {t.designs.keepEditing}
            </button>
            <button type="submit" class="btn primary">
              {t.failed.tryAgain}
            </button>
          </div>
        </Dialog>
      )}
      {dialog === 'changed' && (
        <Dialog title={t.designs.changedTitle(scene.name)} onCancel={() => setDialog(null)} onSubmit={() => void saveMine()}>
          <p class="form-line">{t.designs.changedLine(scene.name)}</p>
          <p class="form-line">{t.designs.changedChoice(scene.name)}</p>
          {copyFailure !== null && (
            <p class="form-banner" role="alert">
              {copyFailure}
            </p>
          )}
          <div class="sheet-actions">
            <button type="button" class="btn" onClick={onReload}>
              {t.designs.loadNew}
            </button>
            <button type="submit" class="btn primary">
              {t.designs.saveMine}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
