import type { MutableRef } from 'preact/hooks'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import type { Note, NoteType } from '../../../../../shared/notes'
import { NOTE_TYPES } from '../../../../../shared/notes'
import { GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_HIT_PX, GRAPH_LABEL_ZOOM, GRAPH_SPINNER_MS, GRAPH_ZOOM_MAX, GRAPH_ZOOM_MIN } from '../../../../core/constants/constants'
import { Failed, Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { GraphFilter, GraphNode, GraphSteps } from '../../domain/note_graph'
import { aroundOf, noteGraphOf, questIdOfNode, SHOW_ALL, shownIdsOf } from '../../domain/note_graph'
import type { Direction, LayoutInput, Point } from '../../domain/note_graph_layout'
import { nextNode, nodeAt } from '../../domain/note_graph_layout'
import type { QuestLine } from '../../domain/notes_view'
import { isInPlay } from '../../domain/notes_view'
import type { LayoutRun } from '../state_management/graph_layout'
import { useGraphLayout, workerLayout } from '../state_management/graph_layout'
import type { GraphViewBox } from './note_graph_draw'
import { drawGraph, graphColoursOf } from './note_graph_draw'

export type GraphScope = 'around' | 'realm'
export type GraphSettings = { scope: GraphScope; steps: GraphSteps; filter: GraphFilter }
export const GRAPH_START: GraphSettings = { scope: 'around', steps: 2, filter: SHOW_ALL }

// What the whole realm keeps across the remounts that opening a note causes: its layout and input, its pan and zoom,
// and whether the map opened the note (so the next mount takes the focus).
export type GraphKept = { input: LayoutInput | null; points: Map<string, Point>; view: GraphViewBox | null; isFocused: boolean; isByMouse: boolean }
export const keptStart = (): GraphKept => ({ input: null, points: new Map(), view: null, isFocused: false, isByMouse: false })

// open is the open note as shown, with its unsaved text.
type Props = {
  engine: EngineApi
  notes: readonly Note[]
  open: Note
  quests: Map<string, QuestLine>
  settings: GraphSettings
  onSettings: (next: GraphSettings) => void
  kept: MutableRef<GraphKept>
  run?: LayoutRun
  onOpenNote: (id: string) => void
  onOpenQuest: (id: string) => void
  onLeave: () => void
}

const KEYS: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
const clampZoom = (zoom: number) => Math.min(GRAPH_ZOOM_MAX, Math.max(GRAPH_ZOOM_MIN, zoom))

// Two inputs that place the same nodes and lines lay out alike, so the second
// keeps the first's identity and no new layout starts.
const isSameLayout = (a: LayoutInput, b: LayoutInput) =>
  a.centre === b.centre && a.ids.length === b.ids.length && a.edges.length === b.edges.length && a.ids.every((id, i) => id === b.ids[i]) && a.edges.every((edge, i) => edge.a === b.edges[i]!.a && edge.b === b.edges[i]!.b)

const lineOf = (node: GraphNode): string =>
  node.kind === 'quest'
    ? t.notebook.graphView.questLine(node.title ?? t.notebook.graphView.goneQuest, t.notebook.questStateSaid[node.questState ?? 'gone'])
    : t.notebook.graphView.noteLine(node.title ?? '', node.noteType === null ? null : t.notebook.types[node.noteType].toLowerCase(), node.links)

type Drag = { x: number; y: number; view: GraphViewBox; isPan: boolean }

export const NoteGraphView = ({ engine, notes, open, quests, settings, onSettings, kept, run = workerLayout, onOpenNote, onOpenQuest, onLeave }: Props) => {
  const area = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  // undefined until asked; null where there is no 2D canvas (the tests' jsdom).
  const context = useRef<CanvasRenderingContext2D | null | undefined>(undefined)
  const drag = useRef<Drag | null>(null)
  // Set while a focus comes from the mouse, which picks no node.
  const isMouseFocus = useRef(false)
  const isFitted = useRef(settings.scope === 'realm' && kept.current.view !== null)
  const [view, setView] = useState<GraphViewBox>(settings.scope === 'realm' && kept.current.view !== null ? kept.current.view : { zoom: 1, x: 0, y: 0 })
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [isPanning, setPanning] = useState(false)
  const [isSlow, setSlow] = useState(false)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [, setRedraw] = useState(0)
  const { scope, steps, filter } = settings

  // The open note counts as it is on screen; the rest as saved.
  const questIds = open.quests.map(quest => quest.id).join(',')
  // noteGraphOf reads only these fields of open, so the list names them instead of open itself.
  const graph = useMemo(() => noteGraphOf(notes.some(note => note.id === open.id) ? notes.map(note => (note.id === open.id ? open : note)) : [...notes, open], quests), [notes, open.id, open.title, open.body, open.type, open.isArchived, questIds, quests])
  const local = useMemo(() => (scope === 'around' ? aroundOf(graph, open.id, steps) : graph), [graph, scope, steps, open.id])
  const lastInput = useRef<LayoutInput | null>(kept.current.input)
  const input = useMemo(() => {
    const next: LayoutInput = { ids: [...local.nodes.keys()].sort(), edges: [...local.edges].sort((x, y) => (x.a < y.a ? -1 : x.a > y.a ? 1 : x.b < y.b ? -1 : x.b > y.b ? 1 : 0)), centre: scope === 'around' ? open.id : null, start: scope === 'realm' ? kept.current.points : new Map() }
    if (lastInput.current === null || !isSameLayout(lastInput.current, next)) lastInput.current = next

    return lastInput.current
  }, [local, scope, open.id])
  const ready = scope === 'realm' && input === kept.current.input && kept.current.points.size > 0 ? kept.current.points : null
  const layout = useGraphLayout(run, input, text => engine.log('error', text), ready)
  const state = layout.state
  // A whole realm laid out again keeps its old map on screen until the new one is ready.
  const points = state.kind === 'done' ? state.points : scope === 'realm' && kept.current.points.size > 0 ? kept.current.points : null
  const shown = useMemo(() => shownIdsOf(local, filter, open.id), [local, filter, open.id])

  const fit = (at: Map<string, Point> | null = points) => {
    const box = area.current?.getBoundingClientRect()
    if (box === undefined || at === null) return
    let [left, top, right, bottom] = [Infinity, Infinity, -Infinity, -Infinity]
    for (const id of shown) {
      const point = at.get(id)
      if (point === undefined) continue
      ;[left, top, right, bottom] = [Math.min(left, point.x), Math.min(top, point.y), Math.max(right, point.x), Math.max(bottom, point.y)]
    }
    if (left === Infinity) return
    const zoom = clampZoom(Math.min(1, (box.width - 2 * GRAPH_FIT_PX) / (right - left), (box.height - 2 * GRAPH_FIT_PX) / (bottom - top)))
    setView({ zoom, x: box.width / 2 - ((left + right) / 2) * zoom, y: box.height / 2 - ((top + bottom) / 2) * zoom })
  }

  // Pans the open note to the middle when it lies outside the view.
  const bringIntoView = (at: Map<string, Point>) => {
    const box = area.current?.getBoundingClientRect()
    const point = at.get(open.id)
    if (box === undefined || point === undefined) return
    setView(v => {
      const [x, y] = [point.x * v.zoom + v.x, point.y * v.zoom + v.y]
      const isInside = x >= GRAPH_FIT_PX && x <= box.width - GRAPH_FIT_PX && y >= GRAPH_FIT_PX && y <= box.height - GRAPH_FIT_PX

      return isInside ? v : { ...v, x: box.width / 2 - point.x * v.zoom, y: box.height / 2 - point.y * v.zoom }
    })
  }

  // Around a note every layout is fitted; the whole realm only its first, so the map doesn't jump.
  useEffect(() => {
    if (state.kind !== 'done') return
    if (scope === 'realm') {
      kept.current.input = input
      kept.current.points = state.points
    }
    if (scope === 'around' || !isFitted.current) fit(state.points)
    else bringIntoView(state.points)
    isFitted.current = scope === 'realm'
  }, [state])
  useEffect(() => {
    if (scope === 'realm' && isFitted.current) kept.current.view = view
  }, [view, scope])
  // A note the map opened brings its new mount's focus back to the map.
  useEffect(() => {
    if (!kept.current.isFocused) return
    kept.current.isFocused = false
    isMouseFocus.current = kept.current.isByMouse
    area.current?.focus({ preventScroll: true })
    isMouseFocus.current = false // no focus event fires when the map already has the focus
  }, [])
  useEffect(() => {
    if (scope === 'realm' && state.kind === 'done') bringIntoView(state.points)
  }, [open.id])

  useEffect(() => {
    if (state.kind !== 'laying') return setSlow(false)
    const timer = setTimeout(() => setSlow(true), GRAPH_SPINNER_MS)

    return () => clearTimeout(timer)
  }, [state.kind])

  // The canvas follows the area's size and the theme's colours.
  useEffect(() => {
    const redraw = () => setRedraw(n => n + 1)
    const theme = new MutationObserver(redraw)
    const root = area.current?.closest('.rm')
    if (root) theme.observe(root, { attributes: true, attributeFilter: ['class'] })
    // jsdom has no ResizeObserver; the app's Chromium always does.
    const size = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(redraw)
    if (area.current) size?.observe(area.current)

    return () => {
      theme.disconnect()
      size?.disconnect()
    }
  }, [])

  const hot = hovered ?? focused
  useEffect(() => {
    const element = canvas.current
    if (element === null) return
    if (context.current === undefined) context.current = element.getContext('2d')
    const ctx = context.current
    if (ctx === null) return
    const box = element.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    const [width, height] = [Math.round(box.width * ratio), Math.round(box.height * ratio)]
    if (element.width !== width || element.height !== height) [element.width, element.height] = [width, height]
    const isLabelled = scope === 'around' || view.zoom >= GRAPH_LABEL_ZOOM
    drawGraph(ctx, { width: box.width, height: box.height, ratio, view, graph: local, points: points ?? new Map(), shown, openId: open.id, hot, goneQuest: t.notebook.graphView.goneQuest, isLabelled, colours: graphColoursOf(element) })
  })

  // A wheel pans, or zooms around the pointer with ⌘ or a pinch. It has to
  // stop the page scrolling, so it can't be a passive listener.
  const latestWheel = useRef<(event: WheelEvent) => void>(() => {})
  latestWheel.current = event => {
    event.preventDefault()
    if (!(event.ctrlKey || event.metaKey)) return setView(v => ({ ...v, x: v.x - event.deltaX, y: v.y - event.deltaY }))
    const box = area.current!.getBoundingClientRect()
    const [px, py] = [event.clientX - box.left, event.clientY - box.top]
    setView(v => {
      const zoom = clampZoom(v.zoom * Math.exp(-event.deltaY * 0.01))

      return { zoom, x: px - ((px - v.x) * zoom) / v.zoom, y: py - ((py - v.y) * zoom) / v.zoom }
    })
  }
  useEffect(() => {
    const element = area.current
    const heard = (event: WheelEvent) => latestWheel.current(event)
    element?.addEventListener('wheel', heard, { passive: false })

    return () => element?.removeEventListener('wheel', heard)
  }, [])

  const nodeUnder = (clientX: number, clientY: number): string | null => {
    const box = area.current?.getBoundingClientRect()
    if (box === undefined || points === null) return null

    return nodeAt(points, shown, { x: (clientX - box.left - view.x) / view.zoom, y: (clientY - box.top - view.y) / view.zoom }, GRAPH_HIT_PX / view.zoom)
  }

  // A note opens; a quest only while it's in play, since Quests can't open a done one.
  const openNode = (id: string, isByMouse = false) => {
    const questId = questIdOfNode(id)
    if (questId === null) {
      if (id !== open.id) {
        kept.current.isFocused = true
        kept.current.isByMouse = isByMouse
        onOpenNote(id)
      }
    } else if (isInPlay(quests, questId)) onOpenQuest(questId)
  }

  // Whether a click on the node opens something.
  const opensOf = (id: string) => {
    const questId = questIdOfNode(id)

    return questId === null ? id !== open.id : isInPlay(quests, questId)
  }

  // The press is a pan once it moves past GRAPH_DRAG_PX, and a click otherwise.
  const latestMove = useRef<(event: MouseEvent) => void>(() => {})
  latestMove.current = event => {
    const start = drag.current
    if (start === null) return
    const [dx, dy] = [event.clientX - start.x, event.clientY - start.y]
    if (!start.isPan && Math.hypot(dx, dy) <= GRAPH_DRAG_PX) return
    if (!start.isPan) {
      start.isPan = true
      setPanning(true)
    }
    setView({ ...start.view, x: start.view.x + dx, y: start.view.y + dy })
  }
  const latestUp = useRef<(event: MouseEvent) => void>(() => {})
  latestUp.current = event => {
    const start = drag.current
    drag.current = null
    window.removeEventListener('mousemove', onWindowMove)
    window.removeEventListener('mouseup', onWindowUp)
    setPanning(false)
    if (start === null || start.isPan) return
    const id = nodeUnder(event.clientX, event.clientY)
    if (id !== null) openNode(id, true)
  }
  const onWindowMove = useRef((event: MouseEvent) => latestMove.current(event)).current
  const onWindowUp = useRef((event: MouseEvent) => latestUp.current(event)).current
  useEffect(
    () => () => {
      window.removeEventListener('mousemove', onWindowMove)
      window.removeEventListener('mouseup', onWindowUp)
    },
    [],
  )

  const onMouseDown = (event: MouseEvent) => {
    // The buttons laid over the map are pressed, not panned.
    if (event.button !== 0 || (event.target as Element).closest('button') !== null) return
    isMouseFocus.current = true
    area.current?.focus({ preventScroll: true })
    isMouseFocus.current = false // no focus event fires when the map already has the focus
    drag.current = { x: event.clientX, y: event.clientY, view, isPan: false }
    window.addEventListener('mousemove', onWindowMove)
    window.addEventListener('mouseup', onWindowUp)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const from = focused ?? open.id
    if (KEYS[event.key] !== undefined) {
      if (points !== null) setFocused(nextNode(points, shown, from, KEYS[event.key]!) ?? from)
    } else if (event.key === 'Enter') openNode(from)
    else if (event.key === 'Escape') {
      event.stopPropagation()
      onLeave()
    }
    else return
    event.preventDefault()
  }

  // The filter menu closes on a click outside it or on Esc.
  const menu = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!isMenuOpen) return undefined
    const away = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const heard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('mousedown', away)
    window.addEventListener('keydown', heard)

    return () => {
      window.removeEventListener('mousedown', away)
      window.removeEventListener('keydown', heard)
    }
  }, [isMenuOpen])

  const toggleType = (type: NoteType | 'none') => {
    const hiddenTypes = new Set(filter.hiddenTypes)
    if (!hiddenTypes.delete(type)) hiddenTypes.add(type)
    onSettings({ ...settings, filter: { ...filter, hiddenTypes } })
  }
  const choices: { key: string; label: string; isOn: boolean; onToggle: () => void }[] = [
    ...[...NOTE_TYPES, 'none' as const].map(type => ({ key: type, label: type === 'none' ? t.notebook.graphView.noType : t.notebook.types[type], isOn: !filter.hiddenTypes.has(type), onToggle: () => toggleType(type) })),
    { key: 'quests', label: t.notebook.graphView.quests, isOn: filter.quests, onToggle: () => onSettings({ ...settings, filter: { ...filter, quests: !filter.quests } }) },
    { key: 'doneQuests', label: t.notebook.graphView.doneQuests, isOn: filter.doneQuests, onToggle: () => onSettings({ ...settings, filter: { ...filter, doneQuests: !filter.doneQuests } }) },
  ]

  const others = [...shown].filter(id => id !== open.id)
  const questCount = (scope === 'around' ? others : [...shown]).filter(id => questIdOfNode(id) !== null).length
  const summary = scope === 'around' ? t.notebook.graphView.summaryAround(open.title, others.length - questCount, questCount, steps) : t.notebook.graphView.summaryRealm(shown.size - questCount, questCount)
  const focusedNode = focused !== null && shown.has(focused) ? graph.nodes.get(focused) : undefined
  const isDone = state.kind === 'done'
  const pressedOf = (isOn: boolean) => (isOn ? 'nt-mode-btn on' : 'nt-mode-btn')

  return (
    <div class="nt-graph">
      <div class="nt-graph-bar">
        <span class="nt-mode" role="group" aria-label={t.notebook.graphView.scope}>
          {(['around', 'realm'] as const).map(choice => (
            <button key={choice} type="button" class={pressedOf(scope === choice)} aria-pressed={scope === choice} onClick={() => onSettings({ ...settings, scope: choice })}>
              {t.notebook.graphView[choice]}
            </button>
          ))}
        </span>
        {scope === 'around' && (
          <span class="nt-mode" role="group" aria-label={t.notebook.graphView.steps}>
            {([1, 2] as const).map(choice => (
              <button key={choice} type="button" class={pressedOf(steps === choice)} aria-pressed={steps === choice} onClick={() => onSettings({ ...settings, steps: choice })}>
                {choice === 1 ? t.notebook.graphView.oneStep : t.notebook.graphView.twoSteps}
              </button>
            ))}
          </span>
        )}
        <span class="prio" ref={menu}>
          <button type="button" class="btn" aria-haspopup="menu" aria-expanded={isMenuOpen ? 'true' : 'false'} onClick={() => setMenuOpen(!isMenuOpen)}>
            {t.notebook.graphView.filter} <span aria-hidden="true">▾</span>
          </button>
          {isMenuOpen && (
            <span class="prio-menu nt-graph-menu" role="menu">
              {choices.map(choice => (
                <button key={choice.key} type="button" role="menuitemcheckbox" aria-checked={choice.isOn ? 'true' : 'false'} class="prio-item" onClick={choice.onToggle}>
                  <span aria-hidden="true">{choice.isOn ? '✓' : ' '}</span>
                  {choice.label}
                </button>
              ))}
            </span>
          )}
        </span>
        <button type="button" class="btn" onClick={() => fit()}>
          {t.notebook.graphView.fit}
        </button>
      </div>
      <div
        ref={area}
        class={`nt-graph-area${isPanning ? ' is-panning' : hovered !== null && opensOf(hovered) ? ' is-over-node' : ''}`}
        role="group"
        aria-label={summary}
        aria-busy={state.kind === 'laying'}
        tabIndex={0}
        onMouseDown={onMouseDown}
        onMouseMove={event => drag.current === null && setHovered(nodeUnder(event.clientX, event.clientY))}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => {
          if (!isMouseFocus.current && focused === null) setFocused(open.id)
          isMouseFocus.current = false
        }}
        onBlur={() => setFocused(null)}
        onKeyDown={onKeyDown}
      >
        <canvas ref={canvas} aria-hidden="true" />
        <p class="nt-graph-said" role="status" aria-live="polite">
          {focusedNode === undefined ? '' : lineOf(focusedNode)}
        </p>
        <div class="nt-graph-over">
          {state.kind === 'laying' && isSlow && (
            <Loading line={t.notebook.graphView.laying(input.ids.length)}>{state.share > 0 && <p class="state-line">{t.notebook.graphView.progress(state.share)}</p>}</Loading>
          )}
          {state.kind === 'failed' && <Failed message={t.notebook.graphView.failed} onRetry={layout.retry} />}
          {isDone && local.edges.length === 0 && scope === 'around' && (
            <div class="state panel">
              <p class="state-line">{t.notebook.graphView.alone}</p>
              <p class="state-line">{t.notebook.graphView.aloneHint}</p>
            </div>
          )}
          {isDone && local.edges.length === 0 && scope === 'realm' && <p class="state panel state-line">{t.notebook.graphView.unlinked}</p>}
          {isDone && shown.size <= 1 && local.nodes.size > 1 && (
            <div class="state panel">
              <p class="state-line">{t.notebook.graphView.filteredOut}</p>
              <button type="button" class="btn" onClick={() => onSettings({ ...settings, filter: SHOW_ALL })}>
                {t.notebook.graphView.showAll}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
