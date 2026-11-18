# Notes knowledge graph view Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Graph view to the open note in Notes. It shows the notes and quests around the note (1 or 2 steps out) or the whole realm, with filters, pan and zoom, and click or keyboard to open.

**Architecture:**
- Plain window rules in `app/renderer/features/notes/domain/` build the graph from the notes the window already holds, and lay it out with `d3-force`.
- A controller in `presentation/state_management/` runs that layout in a Web Worker and keeps the whole realm's points for the session.
- A canvas widget draws the graph and handles pan, zoom, clicks and keys.
- The page swaps its `isReading` flag for one `NoteMode` value: Write, Read or Graph.
- Main and the engine API don't change.

**Tech Stack:** Preact, TypeScript, `d3-force` 3.0.0, Canvas 2D, Web Worker (Vite `new URL(…, import.meta.url)`), Vitest with jsdom, Playwright for Electron.

**Spec:** `docs/superpowers/specs/2026-11-17-notes-knowledge-graph-design.md`

## Global Constraints

- **Nobody but Rohan commits or pushes.** At the end, hand him the commit with the subject `added a knowledge graph view to Notes`, a minor feature. The post-commit hook sets the version, so don't touch it.
- **Tea-DD (`queue-tea:tea-dd`) writes and runs each task's tests.** The test steps below say what they must assert, and Tea-DD writes them in the house style next to the code (`*.spec.ts(x)`).
- **Only `app/` and docs change.** Main, preload and `app/shared/engine_api.ts` stay as they are.
- **Text the user reads** goes in `app/renderer/l10n/en.ts`, as `notebook.graph` (the button) and `notebook.graphView` (everything else). **Values** go in `app/renderer/core/constants/constants.ts`.
- **Dependencies:** `d3-force` pinned at exactly `3.0.0`, and `@types/d3-force` at exactly `3.0.10` as a dev dependency. `package.json` `overrides` pin `d3-quadtree`, `d3-dispatch` and `d3-timer` to `3.0.1`. All four packages got new releases on 2026-11-03, the first in five years, so they stay on the 2021 ones.
- **Failures:** every failure is logged with its stack through `engine.log('error', …)`, never `console.log`, and the screen never shows an error's text. Per-frame drawing never logs.
- **States:** loading, empty, filtered-to-nothing and failed follow the root `CLAUDE.md`. The copy is in Task 4.
- **The old way goes:** `isReading` and `onReading` are removed, not kept beside `NoteMode`.
- **After code changes,** run `graphify update .` from the repository root.

## Review Focus

1. **A note that links to itself** (`[[Its own title]]`): the expected result is no line from the note to itself and no crash. The test is in Task 1.
2. **A quest link to a quest no longer in the queue:** the quest still shows, as "Quest not in the queue", and clicking it does nothing. The tests are in Tasks 1 and 4.
3. **Opening another note while a layout is still running:** the old layout is cancelled, so its points never draw over the new graph. The test is in Task 3.
4. **A whole realm where no note links to another:** every note still shows, positions stay finite, and a line says so. The test is in Task 4.
5. **Notes changing while Graph is open** (a re-read on focus, or a save): the whole realm is laid out again starting from the kept points, so the map doesn't jump. The test is in Task 4.

---

### Task 1: The graph from the notes

**Files:**
- Create: `app/renderer/features/notes/domain/note_graph.ts`
- Test: `app/renderer/features/notes/domain/note_graph.spec.ts`

**Interfaces:**
- **Consumes:**
  - from `app/shared/notes`: `Note`, `NoteType`, `linksOf`, `questLinksOf`, `noteTitled`
  - from `./notes_view`: `QuestLine`, `QuestState`, `questLineOf`
- **Produces:**
  ```ts
  export type GraphNodeKind = 'note' | 'meeting' | 'quest'
  // title is null only for a quest that isn't in the queue and has no title.
  export type GraphNode = { id: string; kind: GraphNodeKind; title: string | null; noteType: NoteType | null; questState: QuestState | null; links: number }
  export type GraphEdge = { a: string; b: string } // a < b, one per pair
  export type NoteGraph = { nodes: Map<string, GraphNode>; edges: GraphEdge[]; neighbours: Map<string, Set<string>> }
  export type GraphSteps = 1 | 2
  export type GraphFilter = { hiddenTypes: ReadonlySet<NoteType | 'none'>; quests: boolean; doneQuests: boolean }
  export const SHOW_ALL: GraphFilter // nothing hidden
  export const questNodeId = (questId: string): string // `quest/${questId}`; a note id can't hold '/', so the ids never clash
  export const questIdOfNode = (nodeId: string): string | null
  export const noteGraphOf = (notes: readonly Note[], quests: Map<string, QuestLine>): NoteGraph
  export const aroundOf = (graph: NoteGraph, centre: string, steps: GraphSteps): NoteGraph
  export const shownIdsOf = (graph: NoteGraph, filter: GraphFilter, openId: string): Set<string>
  ```

- [ ] **Step 1: Tea-DD writes the failing tests**

  Use the `note()` helper the Notes specs already use.

  - `joins two notes once, whichever way and however often they link`: A has `[[B]] [[B]]`, and B has `[[A]]`. Expect `edges` to equal `[{ a: idA, b: idB }]` (ids sorted), and each node's `links` to be 1.
  - `matches a title ignoring case`: `[[threat MODEL]]` joins the note titled "Threat model".
  - `ignores a link to itself`: A has `[[A]]`. Expect `edges` to be `[]` and `nodes.get(idA)!.links` to be 0.
  - `leaves out archived notes, missing notes and attachment links`:
    - An archived note isn't in `nodes`.
    - `[[Nowhere]]` and `[[table.csv]]` add no node and no edge.
  - `adds each linked or filed quest once, with its state and title`:
    - The body has `[[quest:t-1a2b|Parser]]`, and `note.quests` is `[{ id: 't-1a2b', item: null }, { id: 't-3c4d', item: 'Ship' }]`.
    - The lines map has t-1a2b as `{ title: 'Write the parser', state: 'active' }`, and t-3c4d isn't in it.
    - Expect node `quest/t-1a2b` with kind `'quest'`, title 'Write the parser' and questState `'active'`.
    - Expect node `quest/t-3c4d` with title `null` and questState `'gone'`.
    - Expect 2 edges.
  - `marks a meeting note`: a note with `type: 'meeting'` has kind `'meeting'` and noteType `'meeting'`.
  - `keeps one step or two steps around a note, through a shared quest too`:
    - A links quest Q, B links quest Q, and B links C.
    - `aroundOf(g, A, 1)` has the node ids {A, Q}.
    - `aroundOf(g, A, 2)` has {A, Q, B}.
    - Its edges are only those between kept nodes, and `links` counts only kept neighbours.
  - `hides by type, quests and done quests, but never the open note`:
    - `hiddenTypes {'meeting'}` hides meeting notes except the open one when it is a meeting.
    - `'none'` hides untyped notes.
    - `quests: false` hides every quest.
    - `doneQuests: false` hides only quests whose state is `'done'`.

- [ ] **Step 2: Run them and check they fail.** Run `npx vitest run renderer/features/notes/domain/note_graph.spec.ts` from `app/`. They should fail because `./note_graph` doesn't exist.

- [ ] **Step 3: Implement `note_graph.ts`.**
  - Build one map from lower-cased title to note, for live notes only. Read each note's `linksOf` and `questLinksOf` once, plus `note.quests`.
  - Don't call `backlinksOf` per node. It reads every note again for each one.
  - Self-links and archived or missing targets are dropped.
  - `aroundOf` is a breadth-first walk over `neighbours`.

- [ ] **Step 4: Run them and check they pass,** with the same command.

### Task 2: The layout, hit testing and the pinned dependency

**Files:**
- Modify: `app/package.json` and `app/package-lock.json`, through npm only.
- Modify: `app/renderer/core/constants/constants.ts`, adding the `GRAPH_*` values below.
- Create: `app/renderer/features/notes/domain/note_graph_layout.ts`
- Test: `app/renderer/features/notes/domain/note_graph_layout.spec.ts`

**Interfaces:**
- **Consumes:** `GraphEdge` from Task 1.
- **Produces:**
  ```ts
  export type Point = { x: number; y: number }
  // start: kept points to begin from; centre: pinned at (0, 0), or null for the whole realm.
  export type LayoutInput = { ids: string[]; edges: GraphEdge[]; centre: string | null; start: Map<string, Point> }
  export const layoutOf = (input: LayoutInput, onProgress?: (share: number) => void): Map<string, Point>
  export const nodeAt = (points: Map<string, Point>, shown: ReadonlySet<string>, at: Point, reach: number): string | null
  export type Direction = 'up' | 'down' | 'left' | 'right'
  export const nextNode = (points: Map<string, Point>, shown: ReadonlySet<string>, from: string, direction: Direction): string | null
  ```
- **Constants**, which the builder may tune as long as the spec's targets hold:
  - `GRAPH_LINK_DISTANCE = 60`
  - `GRAPH_CHARGE = -120`
  - `GRAPH_GRAVITY = 0.04`
  - `GRAPH_WARM_ALPHA = 0.3`
  - `GRAPH_PROGRESS_TICKS = 20`

- [ ] **Step 1: Add the dependency, pinned.**
  1. From `app/`, run `npm install --save-exact d3-force@3.0.0`.
  2. Run `npm install --save-dev --save-exact @types/d3-force@3.0.10`.
  3. Add `"overrides": { "d3-quadtree": "3.0.1", "d3-dispatch": "3.0.1", "d3-timer": "3.0.1" }` to `package.json`, then run `npm install`.
  4. Check with `npm ls d3-force d3-quadtree d3-dispatch d3-timer`. Every line should show 3.0.0 or 3.0.1, never 3.0.2.

- [ ] **Step 2: Tea-DD writes the failing tests.**
  - `lays out the same graph the same way twice`: two `layoutOf` calls on the same input are deep-equal. d3-force v3's default random source is seeded.
  - `pins the centre note at the middle`: `points.get(centre)` equals `{ x: 0, y: 0 }`.
  - `gives every node a finite place, linked or not`: a graph with 50 linked and 50 unlinked nodes gives 100 points, all with finite x and y.
  - `reports progress rising to 1`: the shares passed to `onProgress` only go up, and the last one is `1`.
  - `finds the shown node within reach, and nothing beyond it or hidden`:
    - The points are a (0,0) and b (30,0).
    - `nodeAt(…, {x: 4, y: 0}, 10)` is `'a'`.
    - `{x: 15, y: 0}` gives `null`.
    - With `a` not shown, `{x: 4, y: 0}` gives `null`.
  - `moves to the nearest node in a direction`:
    - From (0,0), with p (10,0), q (30,1), r (−5,0) and s (2,20): `'right'` gives p, `'left'` gives r, `'down'` gives s (y grows downward), and `'up'` gives `null`.

- [ ] **Step 3: Run them and check they fail,** with `npx vitest run renderer/features/notes/domain/note_graph_layout.spec.ts`.

- [ ] **Step 4: Implement `note_graph_layout.ts`.** Use `forceSimulation(nodes).stop()` with:
  - `forceLink(edges).id(n => n.id).distance(GRAPH_LINK_DISTANCE)`
  - `forceManyBody().strength(GRAPH_CHARGE)`
  - `forceX(0)` and `forceY(0)` with `.strength(GRAPH_GRAVITY)`

  Then:
  - Start nodes from `input.start` where there is a point there. Pin the centre with `fx = fy = 0`.
  - Start `alpha` at `GRAPH_WARM_ALPHA` when at least half the ids have a start point, and at 1 otherwise.
  - Tick until `alpha() < alphaMin()`. The total is `Math.ceil(Math.log(alphaMin / alpha) / Math.log(1 - alphaDecay))`.
  - Report `ticks / total` every `GRAPH_PROGRESS_TICKS` ticks, and `1` at the end.

  For `nextNode`:
  - A candidate lies in the 90° cone around the direction. Its offset along that direction is greater than 0 and at least as large as the offset across it.
  - Pick the closest candidate by straight-line distance.

- [ ] **Step 5: Run them and check they pass.**

### Task 3: Running the layout off the window

**Files:**
- Create: `app/renderer/features/notes/presentation/state_management/note_graph.worker.ts`
- Create: `app/renderer/features/notes/presentation/state_management/graph_layout.ts`
- Test: `app/renderer/features/notes/presentation/state_management/graph_layout.spec.ts`

**Interfaces:**
- **Consumes:** `LayoutInput`, `Point` and `layoutOf` from Task 2.
- **Produces:**
  ```ts
  export type LayoutMessage = { kind: 'progress'; share: number } | { kind: 'done'; points: Map<string, Point> } | { kind: 'failed'; detail: string }
  export type LayoutRun = (input: LayoutInput, onProgress: (share: number) => void) => { done: Promise<Map<string, Point>>; cancel: () => void }
  export const workerLayout: LayoutRun // one Worker per run, terminated on done, failure or cancel
  export type GraphLayoutState = { kind: 'laying'; share: number } | { kind: 'done'; points: Map<string, Point> } | { kind: 'failed' }
  // input must keep its identity until the graph changes (callers memoise it); null means nothing to lay out.
  export const useGraphLayout = (run: LayoutRun, input: LayoutInput | null, log: (text: string) => void): { state: GraphLayoutState; retry: () => void }
  ```

- [ ] **Step 1: Tea-DD writes the failing tests.** They use a fake `LayoutRun` with promises the test controls. jsdom has no Worker, so `workerLayout` itself is covered by Task 6's end-to-end test.
  - `shows progress, then the points`: the state goes `laying 0`, then `laying 0.5` after the fake reports 0.5, then `done` with the fake's points.
  - `cancels the old run when the input changes`:
    - Two inputs are given one after the other, and the first run's `cancel` is called.
    - When the first run's promise resolves afterwards, the state doesn't change.
  - `logs a failure and lays out again on retry`:
    - The run rejects with `new Error('boom')`.
    - The state is `failed`, and `log` was called once with text containing `graph layout` and the error's stack.
    - `retry()` calls the run again.
  - `does nothing for a null input`: the run isn't called.

- [ ] **Step 2: Run them and check they fail,** with `npx vitest run renderer/features/notes/presentation/state_management/graph_layout.spec.ts`.

- [ ] **Step 3: Implement the worker and `graph_layout.ts`.**
  - **The worker:**
    - It runs `layoutOf` inside `try`/`catch`.
    - It posts `progress` messages, then `done`.
    - On an exception it posts `failed` with `error.stack ?? String(error)`, because the worker can't reach `engine.log`.
  - **`workerLayout`:** it creates the worker with `new Worker(new URL('./note_graph.worker.ts', import.meta.url), { type: 'module' })`, and rejects on `failed` or on the worker's `error` event.
  - **The hook:** a cancelled run's late result is dropped, with a one-line comment saying why that's safe.

- [ ] **Step 4: Run them and check they pass.**

### Task 4: The graph view

**Files:**
- Create: `app/renderer/features/notes/presentation/widgets/note_graph_view.tsx`, holding the controls, canvas, states, pan and zoom, pointer and keys.
- Create: `app/renderer/features/notes/presentation/widgets/note_graph_draw.ts`, holding the canvas drawing and the theme colours.
- Modify: `app/renderer/l10n/en.ts`, adding `notebook.graph`, `notebook.graphKeys` and `notebook.graphView`.
- Modify: `app/renderer/core/constants/constants.ts`
- Modify: the stylesheet that holds the `.nt-mode` rules, adding `.nt-graph*`.
- Test: `app/renderer/features/notes/presentation/widgets/note_graph_view.spec.tsx`

**Interfaces:**
- **Consumes:** Tasks 1 to 3; `Loading` and `Failed` from `core/widgets/states`; `QuestLine` and `isInPlay` from `notes_view`; `EngineApi`.
- **Produces:**
  ```ts
  export type GraphScope = 'around' | 'realm'
  export type GraphSettings = { scope: GraphScope; steps: GraphSteps; filter: GraphFilter }
  export const GRAPH_START: GraphSettings // { scope: 'around', steps: 2, filter: SHOW_ALL }
  // open is the open note as shown, with its unsaved text; kept holds the whole realm's points for the session.
  type Props = { engine: EngineApi; notes: readonly Note[]; open: Note; quests: Map<string, QuestLine>; settings: GraphSettings; onSettings: (next: GraphSettings) => void; kept: MutableRef<Map<string, Point>>; run?: LayoutRun; onOpenNote: (id: string) => void; onOpenQuest: (id: string) => void; onLeave: () => void }
  export const NoteGraphView: (props: Props) => JSX.Element
  ```
  `run` defaults to `workerLayout`.
- **Constants:**
  - `GRAPH_SPINNER_MS = 150`
  - `GRAPH_LABEL_ZOOM = 1.5`
  - `GRAPH_HIT_PX = 10`
  - `GRAPH_LABEL_CHARS = 40`
  - `GRAPH_ZOOM_MIN = 0.05`
  - `GRAPH_ZOOM_MAX = 4`
  - `GRAPH_DRAG_PX = 3`
- **Copy, exactly,** under `t.notebook`:
  ```ts
  graph: 'Graph', graphKeys: '⌘G',
  graphView: {
    around: 'Around this note', realm: 'Whole realm', steps: 'Steps out', oneStep: '1 step', twoSteps: '2 steps',
    filter: 'Filter', fit: 'Fit', quests: 'Quests', doneQuests: 'Done quests', noType: 'No type',
    laying: (count: number) => `Laying out ${count.toLocaleString('en')} notes…`,
    progress: (share: number) => `${Math.round(share * 100)}% done`,
    alone: 'Nothing links to or from this note yet.', aloneHint: 'Type [[ in Write to link a note or a quest.',
    unlinked: 'No notes in this realm link to each other yet.',
    filteredOut: 'Nothing matches these filters.', showAll: 'Show everything',
    failed: 'Couldn\'t draw the graph. Something went wrong while placing the notes. Try again, or switch to Around this note.',
    summaryAround: (title: string, notes: number, quests: number, steps: number) => `Graph around ${title}: ${notes} notes and ${quests} quests within ${steps} ${steps === 1 ? 'step' : 'steps'}`,
    summaryRealm: (notes: number, quests: number) => `Graph of the whole realm: ${notes.toLocaleString('en')} notes and ${quests} quests`,
    noteLine: (title: string, type: string | null, links: number) => `${title}, ${type === null ? 'note' : `${type} note`}, ${links} ${links === 1 ? 'link' : 'links'}`,
    questLine: (title: string, state: string) => `${title}, quest, ${state}`,
    goneQuest: 'Quest not in the queue',
  },
  ```
  - The counts in the summaries leave out the open note.
  - Type names come from `t.notebook.types`. Quest state words reuse the ones the Read view shows.
  - `graph` stays the button label, so the view's own text lives under `graphView`.

- [ ] **Step 1: Tea-DD writes the failing tests.**
  - **Setup:** jsdom gives the canvas no 2D context, so the widget skips drawing when `getContext('2d')` is `null`. The tests stub the canvas's `getBoundingClientRect` to 800 × 600 and pass a fake `run` with fixed points.
  - `shows the spinner and progress while laying out, after 150 ms`: with fake timers, nothing shows at 100 ms. At 150 ms the page shows "Laying out 3 notes…", and "50% done" once the fake reports 0.5.
  - `says a note with no links stands alone`: the note shows with "Nothing links to or from this note yet." and the hint.
  - `whole realm with no links shows every note and says so`: on the realm scope with 3 unlinked notes, the summary reads "Graph of the whole realm: 2 notes and 0 quests", and "No notes in this realm link to each other yet." shows.
  - `offers Show everything when the filters hide everything`:
    - The settings hide every type and quests.
    - "Nothing matches these filters." shows.
    - Clicking **Show everything** calls `onSettings` with `filter: SHOW_ALL`.
  - `shows the failure and lays out again on Try again`:
    - The fake run rejects.
    - The `failed` copy shows, and `engine.log` was called with `'error'`.
    - **Try again** calls the run again.
  - `clicking opens notes and quests in play, and nothing else`:
    - The fake points are chosen so a click at a known canvas spot hits a node.
    - A note calls `onOpenNote(id)`. An active quest calls `onOpenQuest('t-1a2b')`.
    - A done quest and a gone quest call nothing.
    - A drag of more than 3 px over a node opens nothing.
  - `arrow keys move between nodes, Enter opens, Esc leaves`:
    - After focus, ArrowRight makes the status line read the `noteLine` for the node on the right.
    - Enter calls `onOpenNote`, and Esc calls `onLeave`.
  - `the summary names the scope and its counts`: on the around scope, the summary is `summaryAround('Gait sensor', 2, 1, 2)`.
  - `keeps the whole realm's points, and lays out again from them when notes change`:
    - The realm scope stores the fake's points in `kept.current`.
    - Re-rendering with one more note calls the run with `input.start` holding those points.
  - `opening another note on the whole realm doesn't lay out again`: re-rendering with a different `open` keeps the run's call count at 1.
  - `the open note's unsaved links count`: the saved copy of `open` in `notes` has no links, but `open.body` has `[[B]]`. The run's `input.edges` holds the edge to B.

- [ ] **Step 2: Run them and check they fail,** with `npx vitest run renderer/features/notes/presentation/widgets/note_graph_view.spec.tsx`.

- [ ] **Step 3: Implement the widget and the drawing.**
  - **The input.**
    - Around a note: the input is `aroundOf(noteGraphOf(notes with open swapped in, quests), open.id, settings.steps)`, with centre `open.id` and an empty start.
    - The whole realm: the input is the full graph, with centre `null` and `start = kept.current`.
    - `useMemo` the input so that on the whole realm it doesn't depend on `open.id`.
  - **After a layout:**
    - Fit to the points after the first `done`.
    - On the whole realm, save the points to `kept.current`, and pan the open note into view if it lies outside.
  - **Pan and zoom** follow `design_editor.tsx` lines 150 to 214: zoom around the pointer, the wheel pans, ⌘ or a pinch zooms, through a non-passive wheel listener. Dragging the background pans too.
  - **Drawing.** `drawGraph(ctx, frame)` draws:
    - lines, then nodes: circles for notes, a meeting colour for meeting notes, and diamonds for quests (dimmed when done, grey and dashed when gone)
    - the open note's gold ring
    - labels, as the spec sets them, cut at `GRAPH_LABEL_CHARS` with "…"
    - the hover and focus dimming

    It scales for `devicePixelRatio`. `graphColoursOf(element)` reads the theme tokens through `getComputedStyle`, and the canvas redraws when they change.
  - **Accessibility.** The canvas wrapper is focusable, with `role="group"` and the summary as its `aria-label`. A `role="status"` line reads the focused node.

- [ ] **Step 4: Run them and check they pass.**

### Task 5: Write · Read · Graph in the page

**Files:**
- Modify: `app/renderer/features/notes/presentation/pages/notes_page.tsx`. Line 140 is `isReading`, and line 518 passes the props.
- Modify: `app/renderer/features/notes/presentation/widgets/note_workspace.tsx`
  - line 47: Props
  - line 159: the signature
  - line 191: `isShowingRead`
  - lines 394–401: ⌘E
  - lines 439–447: the toggle
  - line 535: the body
- Test: the Notes specs that cover the Write and Read toggle (Tea-DD finds them), plus new cases.

**Interfaces:**
- **Consumes:** `NoteGraphView`, `GraphSettings` and `GRAPH_START` from Task 4, and `Point` from Task 2.
- **Produces:** `export type NoteMode = 'write' | 'read' | 'graph'` in `note_workspace.tsx`. The workspace's Props lose `isReading` and `onReading`, and gain `mode: NoteMode; onMode: (mode: NoteMode) => void; graph: GraphSettings; onGraph: (next: GraphSettings) => void; kept: MutableRef<Map<string, Point>>`.

- [ ] **Step 1: Tea-DD writes the failing tests.** `vi.mock` the `graph_layout` module so `workerLayout` is a fake.
  - `Write, Read and Graph switch the view, and the choice stays on the next note`.
  - `⌘G opens Graph, and ⌘E goes back to Write from Graph`. ⌘E from Read still goes to Write, and from Write to Read.
  - `an archived note shows Read and has no Graph button`.
  - `clicking a note in the graph opens it and stays in Graph`: the list highlights the new note, and the Graph button is still pressed.
  - `the graph's scope and filters stay while moving between notes`.
  - `a new realm starts with no kept points`.

- [ ] **Step 2: Run them and check they fail,** with `npx vitest run renderer/features/notes`.

- [ ] **Step 3: Implement.**
  - **`notes_page.tsx`:**
    - `useState<NoteMode>('write')` replaces `isReading`.
    - Add `useState<GraphSettings>(GRAPH_START)` and `useRef(new Map<string, Point>())`. The ref is reset when `realm.key` changes.
  - **`note_workspace.tsx`:**
    - The view in force is `isLive ? mode : 'read'`.
    - The toggle gets a third button, `t.notebook.graph`, with the title `t.notebook.graphKeys`. It only shows when `isLive`, as the toggle does today.
    - ⌘E goes to `'read'` from `'write'`, and to `'write'` otherwise.
    - ⌘G sets `'graph'` when `isLive`.
    - In `'graph'`, the body renders `NoteGraphView` with `open = shown`, `onOpenNote = actions.onOpen`, `onOpenQuest = actions.onOpenQuest` and `onLeave` focusing the Graph button.
    - The inspector and BrewQuest's card stay as they are under Read.
    - Delete every `isReading` and `onReading`.

- [ ] **Step 4: Run them and check they pass,** then run `npm test` and `npm run typecheck` in `app/`. Both should pass.

### Task 6: End to end, the docs and the final checks

**Files:**
- Create: `app/e2e/note_graph.e2e.ts`
- Modify: `docs/notes.md`

**Interfaces:**
- **Consumes:** everything above. Use the setup from `app/e2e/notes.e2e.ts`: a temporary HOME, the realm record, notes written into `.queue-tea/notes/<key>/`, and the `stage` flavor.

- [ ] **Step 1: Tea-DD writes the end-to-end tests.** In `beforeAll`, write 5,000 notes "Note 0" to "Note 4999". Note i links `[[Note (i+1) % 5000]]` and `[[Note (i*7) % 5000]]`, which gives about 10,000 lines.
  - `Graph shows the notes around the open note`: after ⌘7 and ⌘G, the summary starts "Graph around".
  - `the whole realm of 5,000 notes is drawn within 3 seconds`:
    - Click **Whole realm** and time how long until the group's label reads "Graph of the whole realm: 4,999 notes and 0 quests".
    - Expect under 3,000 ms.
  - `a node opened from the keyboard opens its note`: focus the graph, press ArrowRight and then Enter. The **Title** field changes to that note's title.
  - The page logs no `pageerror` throughout.

- [ ] **Step 2: Build and run the end-to-end tests,** under `caffeinate -i npm run e2e` from `app/` (a sleeping display hangs the screenshots). Expect every test in every file to pass, including the new one. If the 3-second test fails, tune `GRAPH_*` in Task 2 or lower the number of ticks for large graphs, and say so in the hand-over.

- [ ] **Step 3: Update `docs/notes.md`.**
  - Add a "## The graph" section before "Not in Notes 1". Write it from the spec's design, in the doc's own voice.
  - Remove "the graph, " from the "Not in Notes 1" list at line 320.
  - Add rows to the Architecture table for `note_graph.ts`, `note_graph_layout.ts`, `graph_layout.ts` and `note_graph_view.tsx`.
  - Add the `GRAPH_*` values to its list of values.

- [ ] **Step 4: Run the final checks.**
  - In `app/`: `npm test`, `npm run typecheck` and `caffeinate -i npm run e2e` should all pass.
  - From the repository root: `graphify update .`.
  - `git status` should show only the files this plan names, plus graphify's output.

- [ ] **Step 5: Hand Rohan the commit.** List the changed files, and give him the subject `added a knowledge graph view to Notes`. Don't commit.
