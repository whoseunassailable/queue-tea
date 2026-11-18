# Notes: the knowledge graph view

Quest `t-954fad2a`, from the Notes epic note ("Notes Realm — Knowledge & Quest Workspace"). Written 2026-11-17.

## What it is and why

Rohan wants to see how a realm's notes connect, the way Obsidian's graph shows a vault. He chose the view around the open note: the note, what it links to and what links back to it, one or two steps out, where clicking a dot moves the centre there. He also asked for the whole realm as well if the design recommended it, so the view has both: it opens on the area around the note, and one switch shows the whole realm.

The epic sets the bar: notes, quests and meetings as nodes; filter, pan, zoom and open; usable on large realms. A realm holds at most 5,000 notes (`NOTE_LIMITS.notes`), so that is the size the whole-realm map must handle.

## Goals

- A **Graph** view of the open note, beside Write and Read, with two scopes: **Around this note** (1 or 2 steps out, 2 by default) and **Whole realm**.
- Nodes for notes, for quests that notes link to or filed, and for meeting notes, each kind marked so you can tell them apart.
- Lines for `[[note]]` links, quest links and the quests a note filed through BrewQuest.
- Filters, pan, zoom, and a click that opens what was clicked.
- Usable at 5,000 notes: the window never freezes, and panning and zooming stay smooth.
- The loading, empty and failed states from CLAUDE.md.

## Non-goals

- Changing anything from the graph: dragging nodes to save their place, drawing a line to make a link, renaming.
- Saving positions to disk. The layout is worked out again each time; positions are kept in memory for the session only.
- Tags, folders, attachments, bookmarks or links to missing notes as nodes.
- A graph with no note open. Graph sits in the editor's head, which only shows with a note open.
- The Meetings feature. That is quest `t-cfa806e9`; until it lands, a note of type `meeting` is a meeting.
- The inspector panel (option B below). It can come later if Rohan misses seeing the graph while writing.

## Anti-goals

- The window freezing, even briefly, on a big realm.
- A graph that drifts or wobbles while you look at it. It is drawn once it has settled.
- Two ways of drawing a graph side by side.

## Approaches

**Where it lives.**

- **A. A third view of the open note: Write · Read · Graph** (picked). The graph takes the editor's space, so there is room for two steps out, the filters and pan and zoom. It reuses the existing Write and Read toggle, so it needs no new screen or route.
- B. A small panel in the inspector under Backlinks. It's always visible while writing, but about 280 px wide, so in practice it shows one step and pan and zoom are cramped.
- C. Both B and A. Twice the work for a convenience nobody asked for yet.

**What it maps.** Rohan first picked the area around the open note, then asked for the whole realm too if recommended. Picked: **one map with two scopes**. The local view isn't a separate feature; it is the same graph cut down to the steps around the note and laid out on its own.

**How it is laid out and drawn.**

- **1. A force layout from `d3-force` in a background worker, drawn on a canvas** (picked). `d3-force` is small and widely used, and its many-body force uses the Barnes–Hut approximation, which is what keeps 5,000 nodes workable. The worker keeps the window responsive while the layout settles. A canvas draws thousands of dots and lines quickly, where SVG with this many elements pans sluggishly.
- 2. Our own Barnes–Hut layout. No dependency, but a few hundred lines of physics to write and test that `d3-force` already has.
- 3. Rings in SVG for the local view and a separate map for the whole realm. Each part is simpler, but that's two ways of drawing one graph.
- Rejected: a naive force layout that compares every pair of nodes. At 5,000 nodes that is 25 million pairs per step, and the window would freeze.
- Rejected: no physics (notes grouped in a grid by folder). It's fast, but it hides the link structure, which is the reason for the view.

## The design

### Where and how you get there

Below 900 px, where the editor fills the page, the graph fills it too.

The editor's head gets a third button: **Write · Read · Graph**. ⌘G opens Graph, and ⌘E still switches between Write and Read; from Graph, ⌘E goes back to Write. Like Read, the choice stays as you move between notes. An archived note has no Graph button, because archived notes are left out of the graph (`docs/notes.md`, Decisions).

### What it shows

- **Nodes.**
  - **A note** is a circle that grows a little with its number of links.
  - **A meeting note** is a circle in its own colour.
  - **A quest** is a diamond (the app's ◆), with its state: in progress, waiting or sealed are full; done is dimmed; a quest no longer in the queue is grey and dashed, as in the Read view.
  - **The open note** has the gold ring the list uses for its gold bar.
- **Lines.** A line joins two nodes when one links to the other, or when a note links to or filed a quest. Each pair gets one line, however many links there are. Lines are not arrows.
- **Labels.** Around this note, every node shows its title. On the whole realm, titles show once you zoom in far enough, and always for the open note and the node under the pointer or focus.
- **Hover and focus.** The node, its lines and its neighbours stay bright and the rest dims, as in Obsidian.
- **Colours** come from the theme tokens, so light, dark and the night sky all work. The canvas is redrawn when the theme changes.

### The two scopes

- **Around this note**, with **1 step | 2 steps**: the open note sits in the middle, and the layout uses only the nodes within that many steps. Steps follow lines in either direction, so a quest linked from two notes connects them at two steps.
- **Whole realm**: every note that isn't archived, and every quest a note links to or filed. The map opens zoomed to fit, and the open note is in view with its ring. Picking a note in the list (or clicking one on the map) moves the ring there and brings the note into view without laying out again.

### Controls

Above the graph sit the scope switch, the steps switch (shown only around a note), **Filter** and **Fit**.

- **Filter** is a menu. It holds one box per note type (idea, feature, bug, meeting, research, decision, daily, and No type), plus **Quests** and **Done quests**. All are on to start. A filter hides nodes and their lines; it doesn't lay the graph out again. The open note never hides, in either scope. The filters stay while Notes is open, like the scope.
- **Fit** zooms to show every node.

Pan and zoom work as in the Designs editor: the wheel pans, ⌘-wheel or a pinch zooms around the pointer, and dragging the background pans.

### Clicking

- **Clicking a note** opens it, just as picking it in the list does, and Graph stays. Around a note, the centre moves there and the graph is laid out for it. On the whole realm, the ring moves.
- **Clicking a quest** in play opens it in Quests, through the same call quest links use. A done quest isn't a button, since Quests can't open it, so it only shows its title and state.

### Keys and screen readers

The graph takes focus with Tab. The arrow keys move between nodes, to the nearest one in that direction. Enter opens the node, and Esc returns focus to the toggle. A polite status line reads the focused node: "Clinic visit, meeting note, 3 links" or "Write the parser, quest, in progress". The canvas is labelled with a summary, such as "Graph around Gait sensor: 6 notes and 2 quests within 2 steps". The inspector's Links and Backlinks lists stay as the full text route.

### States

- **Loading the notes** is the page's existing state; the graph adds nothing.
- **Laying out.** If it takes longer than the page's 150 ms, the graph area shows the spinner and "Laying out 4,812 notes…", with how far it has got ("About half done"). When the layout has finished, the graph appears.
- **Nothing linked yet** (around a note): the note shows alone, with "Nothing links to or from this note yet." and "Type [[ in Write to link a note or a quest." For the whole realm with no links, the dots show unlinked, with a line saying the same.
- **Filtered to nothing:** "Nothing matches these filters.", with **Show everything**.
- **Couldn't lay it out:** "Couldn't draw the graph." and "Something went wrong while placing the notes. Try again, or switch to Around this note.", with **Try again**. The error itself goes to the log, never to the screen.

### Speed on a big realm

- **The open note counts as you see it.** Its lines come from its current text, as the inspector's Links do, so a link typed a moment ago shows before the save lands. The other notes count as saved.
- **Lines are worked out once** each time the notes change. A pass over the realm maps each title (matched as links already are, ignoring case) to its note, then reads each note's links once and records them both ways. Calling `backlinksOf` for every node would read every note again for each one.
- **The layout runs in a worker** and posts progress. It stops when it settles or after a fixed number of steps, whichever comes first. The whole-realm positions are kept for the session. When notes change, the next layout starts from the kept positions, so the map doesn't jump and settles in fewer steps.
- **Drawing:** pan and zoom only redraw the canvas from the positions. Clicks and hover check each shown node's position. At 5,000 nodes that's well under a millisecond, so no search tree is needed.
- **Targets on Rohan's Mac:** with 5,000 notes and about 10,000 lines, the whole realm is ready within 3 seconds, and pan and zoom stay smooth. Around a note, it appears with no visible wait.

## Architecture

It follows `docs/architecture.md`. Main and the engine API don't change: the window already holds every note and its body (`NotesView.notes`), and the realm's quests.

| Layer | Where | What |
| --- | --- | --- |
| Window rules | `app/renderer/features/notes/domain/` | Building the graph from the notes and quests (nodes, lines, the title index), the steps around a note, the filters, and the layout itself (plain code calling `d3-force`, no DOM) |
| Controller | `app/renderer/features/notes/presentation/state_management/` | Runs the layout in a worker, passes on progress, keeps the session's positions, and turns a failure into the failed state |
| Screens | `app/renderer/features/notes/presentation/widgets/` | The graph view: canvas, controls, pan and zoom, hit testing, keys |
| Page | `notes_page.tsx`, `note_workspace.tsx` | The Write · Read · Graph switch. It replaces the `isReading` flag with one view value, and the flag goes. The scope, steps, filters and kept positions live in the page, not the workspace, because the workspace is rebuilt for each note (`key={open.id}`) and clicking a node opens another note |

- Text goes in `app/renderer/l10n/en.ts` under `notebook`, and the values (steps, the label zoom, step limits, the 150 ms) go in `app/renderer/core/constants/constants.ts`.
- The new dependency is `d3-force` 3.0.0, with `@types/d3-force` 3.0.10 for development.
- **Pinned to the 2021 releases on purpose.** On 2026-11-03, `d3-force` and the three packages it uses (`d3-quadtree`, `d3-dispatch` and `d3-timer`) all got new patch releases within an hour of each other, the first in five years. Until those are looked at, `package.json` pins `d3-force` 3.0.0, and its `overrides` pin `d3-quadtree`, `d3-dispatch` and `d3-timer` to 3.0.1.
- The page's CSP (`default-src 'self'`) already allows a worker bundled with the app.
- jsdom has neither a canvas nor workers. The worker and the canvas drawing are passed in, so component tests can swap them.

## Tests (Tea-DD)

- **Unit**
  - Lines from links, quest links and filed quests, each pair once.
  - Titles matched ignoring case.
  - Archived notes left out.
  - Links to missing notes left out.
  - One and two steps, including through a shared quest.
  - The filters, with the open note never hidden.
  - The same notes give the same layout, with the open note at the centre around a note.
- **Component**
  - Write · Read · Graph and ⌘G, ⌘E.
  - The laying-out, nothing-linked, filtered-to-nothing and failed states, with Try again.
  - A click on a note opens it, and a click on a quest calls the quest opener.
  - Keyboard focus and the status line.
- **End to end**
  - A realm of 5,000 generated notes reaches the drawn whole-realm map within the target.
  - Opening a node from the keyboard opens its note. A node's place on screen isn't known in advance, so clicks are covered by the component test with a fake layout.

Then `npm test`, `npm run typecheck` and `npm run e2e` in `app/`.

## Docs

- `docs/notes.md` gains a "The graph" section, written from this design.
- In the same file, "the graph" comes off the "Not in Notes 1" list.
- The Architecture table and its list of values grow to match.

## Left to the builder

- The force settings (link distance, charge, the step limit), as long as the targets hold and small graphs look like Obsidian's.
- The exact node sizes, the label zoom and the colour for each kind, from the theme tokens.
- How the arrow keys pick "the nearest node in that direction".
- Whether the Filter menu is a popover or a dropdown, following whichever the app already has.
