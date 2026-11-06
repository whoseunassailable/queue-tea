# Queue-tea: workspace app

- **Date:** 2026-10-27
- **State:** being built. Parts 1 to 5 are done on `task/workspace-app`: the mod's side, every screen, every edit, a quest from Start to Finish, and an app you can install ([plan-workspace-app.md](plan-workspace-app.md), [plan-workspace-app-2.md](plan-workspace-app-2.md)). Windows is next, once there's a Windows machine. Updated 2026-10-28: the look is now Jade Peaks, with a game layer (sections 2.1 and 2.2 of the design). Updated 2026-11-02: Rohan wants Windows too, after the Mac. Updated 2026-11-03: any quest can run on OpenAI's Codex CLI in place of Claude Code ([Codex](#codex-a-quest-without-claude-code)), phase 1 of Multiple tasks; phase 2 adds parallel worktrees and Branches ([details](plan-parallel-quests.md)). Updated 2026-11-05: a Designs tab after Quests, for a realm's design versions and comments ([The Designs tab](#the-designs-tab), [design-tab.md](design-tab.md)). Updated 2026-11-06: each helper in the Guild Hall takes an order ([The Guild Hall's helpers](#the-guild-halls-helpers)).
- **Where it came from:** sub-project 1 of the Queue-tea 2.0 plan (the workspace app, phases 1–2 of the pasted 2.0 plan). The screens, components and look are in [workspace-app-design.md](workspace-app-design.md), decided on 2026-10-27. Mockups: https://claude.ai/artifact/H8HpWsfTcZYz5Y1kJBQtUB (private).

## What it is

A desktop app beside Claude Code, for the Mac first and Windows after it. It shows every project Queue-tea knows, with its queue, its current task and its history. It also does the queue's own work: filing, priority, features, blocking, starting a task on its branch, and finishing it with the task-log row. Claude Code opens only for the work itself.

The terminal mod keeps working as it does today. The app and the mod read and write the same record, through the same engine code.

**It works when** Rohan can run a day from the app without typing a Queue-tea command: see what's next across projects, start ★ (the branch is made and Claude Code is told or opened), answer Review, and finish with the log row. A session open in that project sees every change.

## In this release

- **Screens:** Home, Quests (the ranked list in state sections, with a detail pane), a quest's and a saga's detail, New quest, Start with the git hold, Judgement, Done and the victory, Back to the board, Seal…, Move, Remove, Chronicle, Mana & time, Hoard and badges, Settings, the Library, the Guild Hall (each helper takes an order and works on it there; which helpers Claude uses on a quest is still turned on per quest), first run, the failed record, the command palette and the narrow window. They are drawn and measured in sections 3–5 of the design. On screen they use the game's words (section 2.2 of the design); the engine and the record keep their own.
- **The look:** Jade Peaks. A sky behind every screen follows the clock: morning, day and evening on light panels, the lantern night on dark ones. Settings can fix the sky to one time of day and has Calm mode, which stops every animation.
- **The game layer:** XP, levels, a lóng that grows from egg to elder, a day streak, gold and seven badges. All of it is worked out from the record.
- **New record fields:** `description`, `criteria` and `review` on every task, and `requests` on the record. Each task also gets `helpers`, the helpers Claude uses on it, which Rohan turns on or off per quest (Tea-DD is on by default), and `codexSince`, when the quest went to Codex.
- **Codex in place of Claude Code:** **Start in Codex** beside Start, and **Continue in Codex** and **Continue in Claude Code** on the active quest, for when Claude's 5-hour allowance runs out. Claude Code stays the default.
- **In the mod:** session files, handling the app's requests, setting `review`, and an "Open in Queue-tea app" entry in the tea-cup menu.
- **Opening the app on a project:** a `queue-tea` command line tool and a `queue-tea://` URL.

## Not in this release

- **The Board tab.** It comes with tasks side by side (sub-project 4), when In progress and Review can hold several cards.
- **The other 2.0 sub-projects:** Tea Leaves and Obsi-tea (3), tasks side by side in worktrees (4, planned in [plan-parallel-quests.md](plan-parallel-quests.md)) and lifecycle hardening (5). No placeholders for any of them.
- **Windows.** It comes after the Mac (see Decisions).
- **A phone or web app.** The window talks to the engine through one typed API, so HTTP can sit behind it later.
- **Also left out:** a menu-bar cup, notarisation, and updates from anywhere but this Mac's own pushes to main.
- **From the game:** a shop to spend gold, naming the dragon, and quests or rewards from the helpers.
- **Commit, Push, Merge and Pull buttons, ever.** Git commands appear only as text to copy (criterion 3 of the design).

## Decisions

| Question | Decision | Why |
| --- | --- | --- |
| Where it runs | A native Mac app | Rohan's pick over a browser app or a pane in Claude Code Desktop |
| Which shell | Electron, TypeScript end to end, a Preact window | One engine shared with the mod; SwiftUI would need the engine rewritten or bridged |
| Windows | After the Mac, kept possible throughout | Rohan wants both (2 Nov). The window carries over with Electron, but there's no Windows machine to test on yet. Nothing Mac-only sits outside `hooks/core/host/claude_host.ts` and `app/main/core/platform/`, and the record's save and lock go through `Host` methods, so Windows is new code in those two places. It also needs its own terminals, installer, window buttons and Ctrl shortcuts |
| Control | Full control in the app | The app edits the record, runs the git check, makes branches, finishes tasks and writes the task log; Claude Code opens only for the work |
| Phone | Later, kept possible | The engine sits behind one typed API |
| Tasks layout | The ranked list in state sections; the Board later | Keeps the ★ order and families together, and fits a narrow window |
| Look | Jade Peaks, from 28 Oct; Tea House before that | Rohan wanted a fun, game-style app with dragons and living, colourful backgrounds. The day takes its feel from Liyue in Genshin Impact; the night is a lantern-and-aurora sky. The art is original |
| Game layer | Full: XP, levels, a growing dragon, streak, gold, badges, quests | Rohan's pick on 28 Oct. Worked out from the record, so nothing new is stored and the engine doesn't change |
| Sky | Follows the clock; Settings can fix it | Rohan's ask: a pink morning, a blue day and so on, with the night on dark panels |
| Guild Hall (the Tea Room) | In: each helper takes an order and works on it in the picked realm; helpers are still turned on per quest in the quest's panel | It carries the character, and a helper can be put to work without opening a terminal |
| Single-letter keys | The terminal's letters, off inside text fields, a switch in Settings | Same muscle memory in both places |
| Description and criteria | On every task, collapsed when empty | Any task becomes a feature once it has children |
| VS Code | Open the folder, copy `claude`, toast "Paste it in VS Code's terminal" | The Claude Code extension (2.1.311) can't start a terminal from outside VS Code; its `vscode://anthropic.claude-code/open` URL opens the graphical panel |
| The rest | The suggested answers in section 8 of the design | Rohan took them all on 2026-10-27 |
| Build and install | **New in this spec:** a local build signed ad hoc, from one npm script, copied to /Applications | One user; notarisation and downloaded updates would be work with no reader. An Apple Silicon Mac won't run an unsigned app, so it can't be less than ad hoc |
| Updating an open app | Added 2026-11-03. Each successful push to main is built, tested and swapped in under the open app, which restarts itself when you're away from it with nothing half done, back on the same screen and in the same place. A new major version asks first if you're using the window | Rohan asked that an update never stop his work unless it's a big one. Restarting is the only way to run new code: the open app can't reload its own files |
| Codex | Added 2026-11-03. Any quest can start on Codex, or move to it and back. Claude Code keeps the first button; a hint names Codex when Claude's allowance is used up | Rohan's 5-hour allowance runs out partway through quests. Codex has no Queue-tea mod, so its own sandbox stands in for the git guard |

## Architecture

### Where the code lives

The app takes the same shape as the mod, on both sides of the window. [architecture.md](architecture.md) has the rules and the picture.

```
app/
├── package.json              its own dependencies (node_modules/ is already gitignored)
├── tsconfig.json             doesn't resolve claude-code
├── shared/engine_api.ts      the typed interface between the window and main
├── main/                     the backend
│   ├── core/                 a Node host (fs/promises, execFile), logger, the records watcher, platform/
│   ├── features/<feature>/api/   one handler per call: validates input, runs the use case, returns data or an error
│   └── main.ts               windows, menus, and the providers that wire it all
├── preload/                  hands the engine API to the window through contextBridge
└── renderer/                 the frontend: the Preact window
    ├── app/                  the root and the router
    ├── config/routing/routes.ts   every route
    ├── core/                 api/ (the one base file for replies), constants/, widgets/ (panel, chip, HUD, sky, dragon)
    ├── l10n/                 every string the user reads
    └── features/<screen>/    data/ (its API calls), domain/, presentation/ (pages, state_management, widgets)
```

The app's tests are `*.spec.ts(x)` and run with Vitest, because `claude plugin test .` runs every `*.test.ts(x)` under the plugin folder.

### One engine, two hosts

The app's main process imports the `domain` folders of `hooks/shared/` and `hooks/features/`, and the git and record data in `hooks/shared/git/data/` and `hooks/shared/records/data/`, and runs them with a Node `Host` (`fs/promises` and `execFile`), the same shape as `hooks/core/host/`. So the app writes the record through the same code as the mod:

- the lock, a `.lock` folder made with `mkdir`, which works across processes;
- the `.bak` copy;
- the atomic replace.

`updateRecord` reads, changes and writes inside the lock, so the app and a session writing at once can't lose each other's change.

The use cases return what happened and never touch view state, so a backend handler runs the same `startTaskUseCase`, `finishTaskUseCase` or `fileTaskUseCase` as the mod's controllers, with repositories built over its own `Host`. Nothing those folders reach imports Claude Code. The rest of `hooks/shared/` does, through `core/ports/`: its controllers, the providers files and the assistant repository stay the mod's. `tools/check_layers.mjs` keeps the `domain` folders clean, and the app's tsconfig doesn't resolve `claude-code`, so importing anything else from the mod fails the app's type check. That is the guard that keeps the line.

### The engine API

Main gives the window one typed interface. It covers the reads (projects, a record, sessions, git facts, a diff) and the operations. The window never touches a file or a process. It's IPC now, and the same interface can sit behind HTTP later.

Edits are optimistic. The window changes in the same frame, main writes within 300 ms, and a failed write reverts the change with a message (section 2.3 of the design, under Motion; the rule holds in Jade Peaks too).

### Watching for changes

Main watches the folders `~/.queue-tea/projects` and `~/.queue-tea/sessions`, not single files: the atomic replace swaps the file, so a watch on the file goes stale. Because `fs.watch` on macOS can drop or repeat events, every event is checked against the file's `mtimeMs`. A changed record is reloaded and sent to the window, its changed rows flash, and a field being edited keeps its text (section 4.16 of the design).

### Updating while open

`tools/install_app.sh` copies the new build in beside the open app and swaps it in by renaming, never by writing over files: macOS kills an app whose open files change under it, and a renamed bundle keeps everything the open app has already read.

Every 30 seconds a packaged app compares the version in its bundle's `Info.plist`, and the commit in its `provenance.json`, with its own. When they differ, the rules in `main/features/update/domain/update_watch.ts` decide:

| Situation | What the app does |
| --- | --- |
| No window of ours has the keyboard, and nothing is half done | Restarts behind what you're using (`open -g`, then `showInactive`) |
| You're using the window, minor or patch version | Waits |
| You're using the window, new major version, and nothing is half done | Asks once: Restart now, or Later. Later waits like a minor one |

Half done means a dialog is open, a text field holds the keyboard, an engine call that changes something is still running, or a helper is at work on an order from the Guild Hall. Calls that only read (`list-`, `read-`, `check-`) don't count: the window rereads every 30 seconds, so they would hold an update off for good. Before it exits, the app writes the window's screen and bounds to `restart.json` in its settings folder. The new copy reads it once, deletes it and opens the window there. With no window open, the new copy opens none until the Dock icon is clicked.

The app never restarts while an install is swapping a new copy in. A later push that is still queued or building, or whose build failed, doesn't hold a restart back: that build touches nothing installed until its own swap.

The sidebar's **Settings** row shows the running version as `vX.Y.Z`, with its commit in a tooltip. **Update** beside it restarts into the installed copy when nothing is half done. After a failed build it reads **Retry update** and builds the same push again.

### Sessions: the mod tells the app where Claude Code is

The mod writes `~/.queue-tea/sessions/<session id>.json` at session start, as each turn starts and ends, and every 30 s, and removes it at session end. Its shape is in section 6 of the design. A file whose heartbeat is older than 90 s counts as no session, which covers a session that crashed; the next session to start removes such files. With several fresh files for one project, the pill shows "several sessions".

### Requests: the app asks a session to act

The record gets `requests: { id, kind: 'begin' | 'putBack', taskId, at, block? }[]`. `block` is what a `putBack` seals the task on, because the session writes the checkpoint first.

- **Start, with a session open in that project.** The app claims the task and makes or switches the branch itself, through the same use case as the mod. Then it adds a `begin` request, so the session sends Claude the task's first message, the same one the mod sends when it starts a task itself.
- **Back to queue, with a session open.** The app adds a `putBack` request. The session writes Claude's checkpoint and puts the task back. Until then the app shows "Saving a checkpoint…" (criterion 19 of the design), with Put it back now for when the session is busy or has gone. If a `begin` is still waiting, Claude hasn't started, so the request is dropped and the task goes back at once.
- **How the mod handles them.** It checks the record's `mtimeMs` every 2 s and reloads it on a change. It acts only at a safe point, meaning no turn running and an empty prompt box; otherwise it offers Continue in the terminal. It removes a request under the lock as it takes it, so with two sessions only one acts. A `begin` for a task that is no longer current is dropped.
- **Start, with no session.** The app opens the terminal chosen in Settings, running `claude` in the project. The `begin` request waits in the record, and the mod sends the first message when the session starts.
- **Back to queue, with no session.** The app puts the task back at once, keeps its branch, start commit, time and priority, and says Claude's checkpoint wasn't written (today's wording).

### Review

`task_looks_done` also sets `task.review = { at, checked }`. The app sees the change within 2 s and shows the Review card with its "Claude checked" line. Yes opens Done; Not yet clears `review`. When the app is in the background, a macOS notification says "Claude says <title> looks done", and clicking it opens Review.

### Opening on a project

- `queue-tea open [path]` is installed from the app's menu (Install command line tool…) or Settings. It goes in the first of `/usr/local/bin`, `/opt/homebrew/bin` and `~/.local/bin` the app can write to, and never replaces a file that isn't its own.
- `queue-tea://open?path=<path>` is the app's URL scheme, claimed by the prod build only.
- The tea-cup menu in the terminal gets "Open in Queue-tea app", which opens that URL for the session's project.

The command only builds that URL, so there is one way in. Each of the three selects the project and tags it Detected. A link can come from any web page, so it can only select a realm or open Add realm, which asks first; nothing is written on a link's word.

### Terminals

Settings offers Terminal (the default), iTerm2 and VS Code.

- **Terminal and iTerm2:** a new window running `claude` in the project, opened through `osascript`.
- **VS Code:** the folder opened with `open -a "Visual Studio Code"`, `claude` copied to the clipboard, and the toast "Paste it in VS Code's terminal". Not `code`, because an app opened from the Finder doesn't get the shell's `PATH`.

Open in Claude Code never starts a second session: with one open it only brings the chosen terminal forward. The choice is kept in the app's settings, with Terminal as the default.

### Codex: a quest without Claude Code

Two engine API calls carry it. What Codex is told, its guard and how its time is counted are in the spec ([Codex in place of Claude Code](spec.md#codex-in-place-of-claude-code), [the git guard](spec.md#the-git-guard), [Time](spec.md#time)).

- **`startQuest(key, taskId, platform)`.** `platform` is `'claude'` (the main Start button) or `'codex'` (**Start in Codex**); anything else is refused with "Pick Claude Code or Codex." For `'codex'`, the git check and the branch are the same as for Claude. Then main adds no `begin` request: it writes the brief to `~/.queue-tea/briefs/<task id>.md` and opens the chosen terminal on `cd '<quest folder>' && codex --sandbox workspace-write --ask-for-approval on-request "$(cat '<brief file>')"`. The brief comes from a file because text typed through AppleScript would break its quotes and lines. VS Code opens the folder and gets that whole line copied, with the toast "The Codex line is copied: paste it in VS Code's terminal".
- **`continueIn(key, taskId, platform)`** moves the active quest and returns `{ view, handover, isCodexTimeLost }`. A quest that is no longer active is refused: "That quest is no longer the active one, so nothing moved."
  - **To `'codex'`** (**Continue in Codex**): refused while that quest's session is working, with "Claude Code is still working on <title>. Wait for its turn to end, or stop it with Esc in its terminal, then try again. Nothing has changed." Otherwise the quest's waiting requests are dropped, `codexSince` is set, and Codex opens with a fresh brief. **Open Codex again** is the same call on a quest already with Codex: `codexSince` keeps its first time, and a new Codex opens, for when its window was closed.
  - **To `'claude'`** (**Continue in Claude Code**): Codex's time is added, `codexSince` goes back to null, and the quest is handed over as Start hands it: a `begin` request, and a terminal running `claude` when no session is open.

**Show Codex** is `openClaude` on a quest with Codex. It only brings the chosen terminal forward: the app can't see whether Codex is still running, and a second Codex must not start. If bringing the terminal forward fails, the recovery command opens Codex with the quest's brief. Bringing VS Code forward copies nothing and shows no paste hint.

Finish, Back to the board and Seal on a quest with Codex read Codex's log before they save. Back to the board asks no session for a checkpoint and puts the quest back at once. `FinishOutcome`, `BackOutcome` and `ContinueOutcome` carry `isCodexTimeLost`; when it is true, the toast says "Couldn't read Codex's log, so this quest's time on Codex wasn't added."

### Parallel quests and the Branches tab

Quests and Home show all current quests. Start and Start in Codex stay available for queued, unsealed quests, even with others active. Each new start creates its own worktree from main, keeping the original folder untouched. Existing current quests keep their original folder. The Branches tab sits after Quests and Designs: base branch → quest cards, with platform, status, worktree folder, saga and terminal controls. The keyboard tabs are Home ⌘1, Quests ⌘2, Designs ⌘3, Branches ⌘4, Chronicle ⌘5 and Mana & time ⌘6.

`ProjectView.activeQuests` holds every active card and its folder's session; `active` remains the primary quest for Home shortcuts. `branches` includes queued, active and finished quests with saved branches. `openClaude(key, taskId)` addresses the selected quest. `readMerge(key, taskId)` checks local merge readiness and returns commands as text. Merge instructions shows loading, errors with retry, conflicts, readiness or already merged status. No Git commit, push or merge runs from the app.

The full behavior and safe folder retention are in [Parallel quests and branches](spec.md#parallel-quests-and-branches). The implementation decisions are recorded in [plan-parallel-quests.md](plan-parallel-quests.md).

### The Designs tab

Added 2026-11-05. Designs sits between Quests and Branches at `/designs` and opens with ⌘3. It shows the selected realm's design versions, newest first, from `docs/designs/` in the realm's own folder, so git keeps their history. A version's designs open in an editor that moves, resizes and restyles their layers and saves as you go. Each design has its comments, and **Next version…** files the open ones as a quest for Claude to draft the next version from. The tab never starts Claude Code.

The window reaches the files only through the engine API, by realm key, version folder and design id; main checks each against its pattern and builds the paths. The last good copy of each file is kept outside the realm, under `~/.queue-tea/designs/`, so it never counts as an uncommitted file. The file format, screens, states and limits are in [design-tab.md](design-tab.md).

### The Guild Hall's helpers

Added 2026-11-06. Each helper's card takes an order for the realm picked in the sidebar, and a helper dragged onto a merge with conflicts in Branches resolves them. The screen is section 4.13 of the design. Five engine API calls carry it:

- **`sendHelper(key, helper, order)`** checks the helper and the order: trimmed, not empty and at most 4,000 characters. The helper works in the worktree of the realm's quest under way, or in the realm's folder when no quest has one. A folder that has gone, or a helper still on its last order, is refused with a message and nothing starts. Otherwise main runs `claude -p --agent queue-tea:<helper> --output-format stream-json --verbose -- <order>` in that folder and returns at once.
- **`concileMerge(key, helper, operationId)`** sends a helper to a merge prepared in Branches whose stage is still conflicts; any other stage is refused with "This merge has no conflicts left to resolve." The helper runs the same way, in that merge's own folder, with a fixed order: resolve the conflicts with the Tea-concile skill, stage every resolved file and never commit. Its job carries the merge's id (`merge`), so Branches knows which helper is on which merge. While it works the merge's buttons wait, the merge is reread every 350 ms and once more when it ends, and its answer stays under the bench. Rohan still reads the diff, runs the checks and approves the merge.
- **`onHelpers(listener)`** hears every change. Main reads Claude Code's output line by line: each tool call becomes the bubble's line and counts a step ("Reading timer.ts…"), thinking shows "Thinking…" without counting one, and the final result is the answer.
- **`stopHelper(helper)`** ends the run. The card then says "Stopped. Nothing after that step was done."
- **`readHelpers()`** returns each helper's latest order, read when the Guild Hall opens.

When an order fails, the card says why: the queue-tea plugin isn't installed in Claude Code, `claude` can't be found, the order ran 30 minutes and was stopped, or anything else, which asks Rohan to check that Claude Code is signed in. Main keeps the orders in memory only, so a restart forgets them, and an update waits while any helper is at work.

## Data

Section 6 of the design lists every field: what each screen reads, the new fields with their defaults, the session file and the app's own settings. The rules:

- The record writes version 2. Version 1 loads with null worktree paths; newer unsupported versions remain unreadable.
- New fields get their defaults in `withDefaults` and `parseRecord`.
- Fields one side doesn't know survive the other side's read-modify-write. `parseRecord` already keeps unknown top-level fields; tasks must keep theirs too, with a test for both.
- Not saved anywhere: the git hold, Time I have, the selection and the search.
- **One realm's data stays in that realm.** Settings reads only the realm you're in. A task log path can't leave its realm's folder: the engine refuses it for the mod and the app alike. The level, gold and streak are yours rather than a project's, so they run across realms and hold no project data; Chronicle's All realms is a choice you make.
- **GitHub accounts stay in `gh`.** The app lists what `gh` knows and adds one by running `gh`'s own web sign-in, then puts your terminal's account back. It never holds a token. Which account a realm belongs to is `realmAccounts` in the app's settings, by realm key, in no record or repository. Connecting a realm names its account; it changes nothing about how git pushes.
- **Books live in `~/.queue-tea/library.json`,** apart from every record, shared by every flavor of the app. A file that doesn't read is left alone and never overwritten.
- Game numbers are never stored. Pure functions in a `game` feature's `domain/services` work them out from every record and return them through the engine API, following the rules in section 2.2 of the design.

## Errors and edge cases

| Case | What happens |
| --- | --- |
| A record doesn't read | Section 4.15 of the design: the reason from `whyUnreadable`, Use the last good copy only when the `.bak` reads, and nothing in that project changes until it reads. Other projects keep working |
| A write fails | The change reverts and says so |
| The app and a session write at once | The lock takes them one at a time; each reads the other's write first |
| A session crashed and left its file | Its heartbeat goes stale after 90 s, and the app treats it as no session |
| The app quits mid-operation | Each operation is one locked write, so the record is either before or after it |
| Uncommitted work, unpushed commits, a deleted branch, not a git repository | Section 4.6 of the design |
| The record changes while a sheet is open | The sheet stays and keeps its text; the list behind it reloads |
| Continue in Codex while Claude Code's turn runs | Refused with nothing changed; the toast says why and offers Try again |
| Codex's log can't be read | The quest still finishes, goes back or moves; the toast says its time on Codex wasn't added |
| The Codex brief can't be written | The open-failed card, as when a terminal won't open. Its line to copy carries the brief itself, so it works without the file |

## Testing

- **The mod.** 346 tests pass with part 5, and they keep passing as the app is built. New tests, in the style of `tests/unit/`, cover the session file, requests and `review`.
- **The app's units.** Vitest `*.spec.ts(x)`: the window's components, and main's API run on a Host held in memory, as the mod's tests do.
- **End to end.** Playwright's Electron driver against a temporary `HOME` with fixture records. The runs: file a task, change priority, Start through a git hold and then past it, Review then Done with the log row, and Back to queue with no session.
- **The plugin folder.** After `npm install` in `app/`, `claude plugin test .` still finds only the mod's tests. If it picks up files from `app/node_modules`, the app moves out of the plugin folder.
- **The game rules.** `game.spec.ts` runs XP, levels, stages, the streak, gold and every badge over fixture records, including a finish at 03:30 and a streak across midnight.
- **The design's own checks:** no Commit, Push, Merge or Pull button in the DOM; the screenshot diff across the four times of day; contrast at each time; and nothing animating under Reduce Motion or Calm mode.

## Acceptance criteria

The screens' criteria are 1–28 in section 7 of the design. These cover the rest:

1. The mod's tests pass, and their assertions weren't edited in the restructure.
2. The app's type check fails if main or the window imports a file that imports `claude-code`.
3. A record written by the app reads in the mod, and the other way round, and each keeps the fields it doesn't know.
4. With a session open and idle, a `begin` request is handled within 3 s. While a turn runs it isn't handled, and the terminal offers Continue.
5. A session file appears at session start, is refreshed every 30 s and is removed at session end. The app treats one older than 90 s as no session.
6. Start with no session opens the chosen terminal running `claude` in the project, and the new session sends the task's first message.
7. `queue-tea open <path>`, `queue-tea://open?path=` and the tea-cup menu's entry each open the app on that project.
8. The app never runs `git commit`, `push`, `merge` or `pull`. A test checks every command the Host runs.
9. The game reads the records and never writes them: running the game rules over a copy of `~/.queue-tea/projects` leaves every file byte-for-byte the same.

## Build order, for the plan

1. The engine moves in `hooks/`, with no change in behaviour.
2. The mod: session files, requests, `review`, the tea-cup entry.
3. The app's shell: window, sidebar, the engine API, watching, the sky and the HUD, with Home and Quests read-only. The game rules come here, since the HUD needs them.
4. Edits: priority, New quest, Part of and Move, Seal…, Play next, Remove, Undo.
5. Start, Judgement, Done with the victory, and Back to the board, with the terminals.
6. Chronicle, Mana & time, Hoard and badges, Settings (with the sky and Calm mode), the Guild Hall, first run, the failed record, the palette and the narrow window.
7. The build, the `queue-tea` tool, the URL scheme and the notification.

## Checked

- **The mod can send the first message at session start.** Requests are handled from a timer and never inside a hook, so a submit isn't refused. Seen on 2 Nov in a real Claude Code 2.1.316 session: the file appeared in 0.9 s, the `begin` request was taken at 2.9 s, Claude answered the first message, and the file went when the session ended.
- **`claude plugin test .` doesn't reach into `app/node_modules`.** The test count was the same after `npm install`, so the app stays in the plugin folder.
