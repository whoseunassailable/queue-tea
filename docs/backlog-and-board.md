# The Plan tab: backlog and quest board

Added 2026-11-26, in 2.28.0. This is Q11 of the workspace evolution roadmap, parts Q11.1 to Q11.11. It brings backlog planning in the style of Jira to Queue-tea, in Queue-tea's own words: **Realm**, **Saga**, **Quest**, **Child Quest** and **Effort points**.

The first half is the design, written the way Mocha Mockup reports one. The second half says how the tab works, for whoever uses or changes it.

## Design

### Goal

Rohan plans a realm's work before he starts it: what comes next, how big each piece is, what waits on what. The Quests page shows the board one quest at a time and starts work. The Plan tab is where he orders and sizes the backlog, edits many quests at once and sees the work as columns. It reuses the Quests page's flows and quest navigation, so it is a view of the same quests, not a second tracker.

### Limits

- **Old records still load.** Every new field is optional on the task. A record without them reads exactly as before, the record version stays 2, and the mod's own read-modify-write keeps the new fields (tested in `plan_api.spec.ts`).
- **The engine knows one level of families.** Sagas hold quests through `parentIds`. A third level has to fit beside that, not replace it.
- **Effort points are not time.** Points are a size on the 1, 2, 3, 5, 8, 13, 21 scale. Measured minutes stay in Mana & time and are never derived from points.
- **One quest at a time.** The board can only start a quest the way the Quests page does, through its flows, so the rules for starting, sealing and finishing stay in one place.
- **Parallel work.** Q05 (tokens and global styles), Q06 (home and quest navigation) and Q07 (the recipe panel) run beside this. The tab uses their tokens and navigation and keeps its styles in its own `plan.css`.

### Options

1. **A new planning record beside the realm's record.** Clean to design, but every quest would live in two places, and the mod would never see a rank or a tag. Rejected: two sources of truth.
2. **Extend the Quests page.** No new tab, but the page is already dense and is Q06's to change tonight. Rejected: it would collide with Q06 and crowd the board.
3. **A Plan tab over the same record (picked).** Optional fields on each task, one engine call to read every realm's plan and one to change it, and board moves through the existing flows. It costs a few fields and a new tab, and risks little: nothing old changes meaning.

### The data

On a task, all optional (`types/index.d.ts`):

| Field | Holds | Notes |
| --- | --- | --- |
| `rank` | A number, lowest first | Per container: a quest's place among the quests beside it. Unranked quests follow in the ★ order. |
| `tags` | Up to 10 tags | Lower case; letters, digits, `.`, `_` and `-`; up to 24 characters. |
| `points` | One of 1, 2, 3, 5, 8, 13, 21 | Effort points. Absent means not estimated. |
| `parentQuest` | The id of a quest | Makes this a **Child Quest** of that quest. It keeps the parent's sagas in `parentIds`. |
| `links` | `{ kind: 'relates' or 'duplicates', id }` | Depends on and blocks are not stored here: they are the existing `blockedBy`, read from either end. |

The hierarchy is three deep at most: Saga, then Quest, then Child Quest. A `parentQuest` that points at a saga, at a removed or missing quest, at itself, or at a quest that is a child itself, reads as none, so a broken record can never loop.

In the app's settings: `planViews`, the saved views, at most 20; and `wipLimits`, a WIP limit by realm key, 1 to 20.

### The engine API

- **`readPlan()`** reads every realm's quests as the Plan tab shows them, with how many realms couldn't be read.
- **`changePlan(key, change)`** makes one change to one realm and returns the realm's project view, its plan and the snapshots Undo needs. A change is `rank`, `bulk` (priority, difficulty, points, add or remove a tag, move, archive, rank to top or bottom), `link`, `childQuest` or `restore`. A change that breaks a rule is refused with a message and the file is left as it was.

### Screens

The tab is the last in the top bar, **Plan**, on ⌘9. It has two views, **Backlog** (`#/plan`) and **Quest board** (`#/plan/board`).

```
┌ Plan ─────────────────────────────── [ Backlog | Quest board ] ┐
├ [Search the backlog………] [Filters (2)] Clear all  [Saved views ▾] [Save as view]
│ 5 quests · 7 effort points · 2 not estimated
├─────────────────────────────────────────────┬──────────────────┤
│ ☐ ⋮⋮ ▾ Billing saga         Saga   Ready   │ In queue-tea      │
│ ☐ ⋮⋮ ▾   ★ Send invoices    Ready  Mid 5 pt│ Payment reminders │
│ ☐ ⋮⋮       Invoice PDF      Child  Mid 2 pt│ Effort points     │
│ ☐ ⋮⋮   Payment reminders    Blocked High    │ [1 2 3 5 8 13 21] │
│          waits for Send invoices            │ Tags · Links      │
│ ☐ ⋮⋮   Fix login            Active Urgent   │ Depends on Send…  │
└─────────────────────────────────────────────┴──────────────────┘
```

The quest board has a column for each status, Ready, Blocked, Active, Review and Done, with lanes across them by **Saga**, **Realm** or **Priority**, or none.

### States

- **Loading:** "Reading your backlog…".
- **Failed:** the read's message with **Try again**. A later refresh that fails keeps the plan on screen and shows the message above it.
- **Empty:** "Nothing to plan yet", with how to file a quest.
- **No match:** "No quests match these filters." with **Clear filters**.
- **Some realms unreadable:** a line says how many were left out; the rest show.
- **Busy:** while a change is on its way, the bulk bar's and the pane's buttons wait.
- **Done:** every change ends in the app's toast, with **Undo**; a refusal ends in a toast that says why and what to do.

### Keys and focus

- ⌘9 opens Plan. ⌘Z undoes the last Plan change, as it does any other edit.
- Each row's order is: its pick box, its rank handle, its fold toggle, its title (which opens the pane), then **Add child quest**.
- With the rank handle focused, Alt+Up and Alt+Down move the quest among the quests beside it.
- On the board, each card's **Move … to** menu reaches every column, so the keyboard can do whatever a drag can, and gets the same refusals.

### Acceptance criteria

1. Q11.1: a saga, its quests and their child quests show nested, three deep at most, and old records load unchanged.
2. Q11.2: dragging a row, or Alt with an arrow, saves its new place; it can't leave the quests beside it, and the order survives a restart.
3. Q11.3: status, difficulty, realm, priority and tags filter together, any value within a kind and every kind at once, with search on titles and tags.
4. Q11.4: picked quests change priority, difficulty, points, tags, place or rank together, in one write, or not at all; archiving asks first.
5. Q11.5: Depends on, Blocks, Relates to and Duplicates show on both quests; a wait that would loop, or that points at a victory, is refused.
6. Q11.6: a saved view reopens with the same filters, search and lanes; it can be updated and deleted.
7. Q11.7: the board's columns are the backlog's statuses.
8. Q11.8: lanes by saga, realm or priority keep the filters.
9. Q11.9: a move that has no flow, or that a rule forbids, is refused with what to do.
10. Q11.10: a WIP limit per realm stops a start past it, and shows "2 in hand, over the limit of 1" when the count is already over.
11. Q11.11: a blocked card shows what it waits for and why it was sealed, and pressing a wait opens that quest in the pane.

### Open questions

- **Should a drag be able to refile a quest into another saga?** Picked answer: no. A drag only reorders; **Move to** in the bulk bar refiles. Jira allows both, but a drop that silently changes a quest's saga is easy to do by mistake.
- **Should the board show sagas as cards?** Picked answer: no. A saga is a container; the board shows quests and child quests, and **Saga** lanes show the sagas.
- **Where does the WIP limit live?** Picked answer: per realm in the app's settings, not in the record, since it's how Rohan likes to work rather than a fact about the realm's work.

## How it works

### The backlog

The backlog shows the realm open in the sidebar, or the realms ticked under **Realm** in **Filters**. Each realm is its own group.

- **Order.** Ranked quests come first, lowest rank first, then the rest in the ★ order the Quests page uses. Ranking renumbers every quest beside the one moved, from 0, so the order saved is the order shown. A quest can only be dragged among the quests beside it: dropping it elsewhere says "A quest can only be dragged among the quests beside it. Use Move to file it somewhere else."
- **Context rows.** A filter that matches a child quest still shows its saga and its parent quest, dimmed, so it is clear where it stands.
- **Summary.** The line over the backlog counts the matching quests and their effort points, sagas aside, and how many aren't estimated.
- **Add child quest.** A quest that isn't a saga, a child itself or a victory offers it. The new child quest takes its parent's priority and sagas. Its title is required, up to 200 characters.

### Bulk edits

Ticking a quest's box picks it. Picks stay in one realm, so every bulk change is one write to one record: picking in another realm starts again there. The bar offers **Priority**, **Difficulty**, **Effort points**, **Move to** (on its own, into a saga, or under a quest as its child), a **Tag** to add or remove, **Rank to top**, **Rank to bottom** and **Archive**.

Archive asks first: "They leave the board and the backlog. Quests under them stay, on their own. Undo puts everything back." It refuses a quest in hand or in review. Archive removes a quest the way the Quests page does, and its child quests stay, on their own.

A change any picked quest can't take refuses the whole change, with the reason, and nothing is written. For example, a victory's plan can't change, a quest with quests under it can't go under another quest, a child quest can't have child quests of its own, and a child quest, or a quest with child quests, can't become a saga. Moving a quest takes its child quests with it.

### The pane

Pressing a quest's title opens its pane beside the backlog or board.

- **Effort points:** a size from the scale, or **None**. Under it, the time spent so far, from Mana & time, so the two are never mixed up.
- **Tags:** add one, or take one off. A tag that doesn't fit the rules says so as you leave the field.
- **Links:** every link, from both ends, with a button that opens the other quest. Add one with **Link** and **Quest**. A wait that would make a loop, or that waits on a victory, is refused.
- **Child quests:** each one, with its status.
- **Open in Quests** opens the quest on the Quests page, switching realm first if it's in another.

### The quest board

The board shows quests and child quests, not sagas. Done shows the 12 newest victories and points to the Chronicle for the rest.

Moves go through the Quests page's own flows, so the board can never do what Quests can't:

| From → to | Does |
| --- | --- |
| Ready → Active | **Start**, as on the Quests page |
| Ready → Blocked | Opens the **Seal…** dialog |
| Blocked → Ready | **Unseal**, only once nothing it waits for is still open |
| Active or Review → Ready | **Back to the board** |
| Active or Review → Blocked | Seals the quest in hand |
| Active or Review → Done | Opens the **Finish quest…** sheet |
| Review → Active | **Not yet** |

Anything else is refused with what to do. A quest only goes to Review when Claude says it looks done, a victory stays in the Chronicle, a sealed quest has to go to Ready before it starts, and a quest in another realm says to open that realm first.

**WIP limit** sits in the Active column's head, per realm, from 1 to 20 or none. At the limit, starting another is refused: "Active is at its limit of 1. Finish or put back a quest, or raise the limit." Already over it, the count turns red. Under it, the head says how many quests in hand have their own folder (worktree).

### For developers

- Shared rules and guards: `app/shared/plan.ts`. Main: `app/main/features/plan/` (`domain/plan_view.ts` reads, `domain/plan_changes.ts` applies a change and works out its undo, `api/plan_api.ts` is the engine API). Window: `app/renderer/features/plan/` (`domain/` is pure: the tree, the board's moves, saved views).
- Undo diffs every task a change touched into snapshots, and `restore` puts them back, a new child quest included.
- Tests: `main/features/plan/**/*.spec.ts`, `renderer/features/plan/**/*.spec.ts(x)` and the settings spec.

## Not in this release

Q11.12 to Q11.19 come next: Expeditions, Milestones, the Adventure map, effort analytics, velocity, the cross-Realm dashboard, backlog health and templates. The fields above leave room for them: points for velocity and analytics, links and ranks for the map.
