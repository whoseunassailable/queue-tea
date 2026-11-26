# Home dashboard and quest navigation (Q06)

Added 2026-11-26 for Q06, the home dashboard and quest navigation redesign, in the saga "Queue-Tea — Workspace Evolution & Development Intelligence". Mocha Mockup, Chai-pter and Tea-DD aren't runnable as agents in the session that built this, so their steps were followed by hand: Mocha Mockup's options and states for the design, Chai-pter's order for this page, and Tea-DD's **Deep** profile for the tests, because the quest adds a stored settings field that old files must still read. The drawing for pen.dev is [home-dashboard.pen](home-dashboard.pen): the wide window, the two narrow ones and the states.

## Goal

Home is where Rohan picks up work. Clicking any quest on it, active or waiting, shows that quest's details on the right, and the next quest to start is on screen without scrolling past every active quest.

Rohan's note of 18 November names the two problems this fixes: an active quest's card opened nothing, and with several active quests he had to scroll a long way to reach the waiting ones or start one.

## Limits

- **One realm at a time.** Home shows the realm picked in the sidebar, so the sidebar is the Realm filter. The list's heading names the realm instead of every card repeating it.
- **The window.** The detail pane sits beside the list from 1,180 px wide, floats over it below that, and becomes its own page below 900 px, the same breakpoints as Quests (`DETAIL_FLOATS_BELOW`, `DETAIL_IS_PAGE_BELOW`).
- **Quest states and their rules stay the engine's.** Start and Start in Codex stay available for any queued quest that isn't sealed, even with others active, and a start in progress disables them. A quest put back on the board keeps its branch, so starting it again resumes it there.
- **Old settings files still read.** What Home remembers is a new optional field in the app's settings; a file without it, or with a damaged one, reads as before.
- **Other quests running tonight.** Shared styles and tokens are Q05's, the recipe panel Q07's, and the Quests page's backlog views Q11's. Home reuses the quest widgets as they are (the active card, Judgement card, flow card, quest details, active details, search and filters) and keeps its own styles in `features/home/presentation/home.css`.
- **Pixel-art identity.** The dragon's lair and Glory stay on Home.

## Options

| | 1. Master-detail list with groups (recommended) | 2. Cards that expand in place | 3. Home sends clicks to Quests |
|---|---|---|---|
| What it is | A compact list in Active, Up next and Sealed groups on the left; the picked quest's details on the right, scrolling on their own | Today's layout, with each card opening its details under itself | Today's layout; a click opens the quest on the Quests page |
| Details beside the list | Yes | No: they push the rest down | Yes, on another page |
| Reaching the next quest | Next up at the top, groups fold | Worse: an open card adds to the scroll | Unchanged: still below every active card |
| Cost | A new page layout, reusing the existing detail widgets | Small | Smallest |
| Risk | Home's tests and keys change | The scroll problem grows | Home stays a long feed; Quests belongs to Q11 tonight |

**Recommended: option 1.** It is the only one that answers both of Rohan's problems, and it reuses the detail widgets Quests already uses, so a quest reads the same from both pages.

## Design

### Wide window (1,280 × 900, sidebar open)

```
┌ list column (flex 1 1 440) ───────────────────────────┐  ┌ detail column (flex 1 1 380, max 460) ────┐
│ ┌ lair, compact (180 px): dragon · plaque ──────────┐ │  │ sticky to the top, scrolls on its own     │
│ └───────────────────────────────────────────────────┘ │  │ ┌ Active quest · In progress · 43m ─────┐ │
│ ┌ Next up ─────────────────────────────────────────┐ │  │ │ Mana tracking overhaul                │ │
│ │ ★ Fix the documentation          {Urgent} +40 XP │ │  │ │ task/mana-tracking · Hard             │ │
│ │ ★ urgent · Hard · ~3h 46m                        │ │  │ │ Claude Code is working on it          │ │
│ │ [[Start ★ Fix the documentation]] [Start in Codex]│ │  │ │ [[Open terminal]] [Finish quest…] …   │ │
│ └──────────────────────────────────────────────────┘ │  │ └───────────────────────────────────────┘ │
│ [⌕ Search quests                       ] [Filters]   │  │ ┌ Quest details ────────────────────────┐ │
│ Gait-feedback · 3 active · 6 can start · 2 sealed    │  │ │ priority, helpers, test profile, due, │ │
│ ▾ Active · 3                                         │  │ │ time, effort, files, notes            │ │
│ ┃ Mana tracking overhaul        {High}   ⏱ 43m      │  │ └───────────────────────────────────────┘ │
│ ┃ In progress · Claude Code working      [Pause]     │  │                                           │
│ │ Recipe panel                  {High}   ⏱ 12m      │  │                                           │
│ │ Judgement: is it done?                             │  │                                           │
│ ▾ Up next · 6 can start            Time I have: any  │  │                                           │
│ │ ★ Fix the documentation       {Urgent}  [Start]    │  │                                           │
│ │ ▸ Notes saga  ▰▰▱▱▱ 2 of 5     {High}              │  │                                           │
│ │ Calendar export               {Mid}     [Resume]   │  │                                           │
│ │ [Show 60 more]                                     │  │                                           │
│ ▸ Sealed · 2                                         │  │                                           │
│ ┌ Glory ───────────────────────────────────────────┐ │  │                                           │
└───────────────────────────────────────────────────────┘  └───────────────────────────────────────────┘
```

- **Next up** (Q06.8) is the highest-ranked quest that can start now: the board's ★ if it isn't sealed, else the first quest on the board that isn't a saga. It has Start ★ and Start in Codex. With nothing in hand it reads "No active quest" with "Next up: …" and the session's line, as Home's Now card did. While a start is under way, held or refused, the flow card stands in its place.
- **The list** (Q06.3–Q06.5) holds three groups. Each header is a button with its count that folds or unfolds the group (Active and Up next open, Sealed folded, at first). A card shows the title, priority, progress (minutes so far for an active quest, chapters done for a saga, the estimate otherwise) and status (the session line, Judgement, With Codex, Can start, Resume on its branch, or why it's sealed). A saga's chapters fold under it with the same folds as Quests.
- **Quick actions** (Q06.6): an active card has Pause, which is Back to the board; a queued card has Start, or Resume when it has a branch. A saga, a sealed quest, a Judgement and a quest waiting for its checkpoint have none. Their names carry the quest's title ("Pause Mana tracking overhaul"), so the detail pane's own buttons keep theirs.
- **Search and filters** (Q06.7) are the Quests page's: words in the title or branch, priority, difficulty, state (On the board, Active, Judgement, Sealed, Victories), the active saga and Time I have. They narrow every group, and the counts follow. Nothing matching says so, with Clear search. Home keeps its own search, so narrowing Home leaves Quests as it was.
- **The detail pane** (Q06.1, Q06.2) shows the picked quest. An active quest shows its card (the Judgement card when it asks) with its actions, and its details below it, as Quests shows them; a queued or sealed quest shows the same quest details pane as Quests, with Start, Seal and the rest. Picking another quest replaces it at once, so it never shows the last one's details. The line that Claude's allowance is used up shows here, on the quest it is about.
- **What Home remembers** (Q06.9): the picked quest and which groups are folded, per realm, in the app's settings, saved a moment after the last change. A remembered quest that has gone falls back to the first active quest, else Next up, else the first in the list.
- **Hundreds of quests** (Q06.10): each group shows 60 cards, then Show 60 more. Picking a quest further down shows enough of its group to hold it.

### Narrow window

- **900 to 1,179 px:** the list takes the width; picking a quest opens the details floating over its right side, with ✕ to close it.
- **Below 900 px:** the details are a page of their own with ‹ Home to go back.

### States

| State | What Home shows |
|---|---|
| Loading the realm | The app's own "Reading your quests…" with its spinner, before Home draws |
| Refreshing | The list as it was, and the realm's own "still reading" note |
| No quests at all | No Next up; the Active group says no quest is active; Up next shows the empty board with New quest |
| Nothing active | "No active quest" with "Next up: …" in the Active group |
| A start in progress, held or refused | The flow card in Next up's place, as before |
| Everything sealed | Up next says every quest is sealed |
| Nothing matches the search | One line saying so, with Clear search |
| Details can't be read | The detail pane's own failed line with Try again, as on Quests |

### Keys

The quest keys still work when Settings allows letters, and Tab moves through the list's buttons in order.

| Key | On Home |
|---|---|
| ↑ ↓ | Pick the quest above or below, in the open groups |
| Return | Open the details (narrow window) |
| Esc | Close the floating details (narrow window) |
| s | Start the picked quest if it can start, else Next up |
| c, ⌘↩, d, b, y, n | Act on the picked active quest, else the first active one |
| k | Seal the picked quest |
| t, w, o, r, Esc | As before |

## Acceptance criteria

1. Clicking an active, queued or sealed quest on Home shows that quest's details on the right, and clicking another replaces them.
2. With many active quests, Next up and its Start are on screen without scrolling, and the Up next group is reachable by folding Active.
3. Each group folds and unfolds on its own, and the counts in its header match what it holds.
4. Pause and Start or Resume on a card do what Back to the board and Start do, and a sealed quest offers no Start.
5. Search and the filters narrow every group, and nothing matching says so.
6. The picked quest and the folded groups are as they were after leaving Home and after a restart, and a quest that has gone falls back.
7. Five hundred quests render, filter and change selection within the budget in the speed test.

## Open questions

- **Realm on each card?** The roadmap lists Realm on the compact card. Home shows one realm, so it is named once over the list. A cross-realm Home could come with Q11.
- **Is the dragon too small?** The lair is drawn at about half its old height so the list starts higher. If it reads as too small, Q05 can size it with the shared tokens.
- **Should arrows still scroll Home?** They now move the selection, as on Quests. The list scrolls to keep the picked card in view.

## What Q06 builds

| Child | Built |
|---|---|
| Q06.1 Selection | Yes: any card picks its quest, and the arrows move the pick |
| Q06.2 Shared details panel | Yes: the active card and details, or the quest details, as on Quests |
| Q06.3 Master-detail | Yes, with the floating and paged narrow windows |
| Q06.4 Collapsible groups | Yes: Active, Up next and Sealed. A quest put back with its branch shows Resume in Up next rather than a group of its own |
| Q06.5 Compact cards | Yes: title, priority, progress and status. Realm is the list's heading |
| Q06.6 Quick actions | Yes: Pause, Start and Resume |
| Q06.7 Search and filters | Yes: words, priority, difficulty, state, the active saga and Time I have. Realm is the sidebar |
| Q06.8 Suggested next quest | Yes: Next up |
| Q06.9 Persistent navigation | Yes: the pick and the folds, per realm, in the settings file |
| Q06.10 Large backlogs | Yes: 60 cards a group at a time, and a 500-quest speed test |

The code is in `app/renderer/features/home/`: `domain/dashboard.ts` groups, narrows and picks, `presentation/widgets/` holds the compact cards, the groups, Next up and the detail pane, and `presentation/home.css` Home's own styles. `homeNav` in the app's settings is checked by `cleanSettings` in `app/main/features/settings/api/settings_api.ts`, which drops a realm's entry it can't read and keeps the rest.

