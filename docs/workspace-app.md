# Queue-tea: workspace app

- **Date:** 2026-10-27
- **State:** being built. Parts 1 to 5 are done on `task/workspace-app`: the mod's side, every screen, every edit, a quest from Start to Finish, and an app you can install ([plan-workspace-app.md](plan-workspace-app.md), [plan-workspace-app-2.md](plan-workspace-app-2.md)). Windows is next, once there's a Windows machine. Updated 2026-10-28: the look is now Jade Peaks, with a game layer (sections 2.1 and 2.2 of the design). Updated 2026-11-02: Rohan wants Windows too, after the Mac.
- **Where it came from:** sub-project 1 of the Queue-tea 2.0 plan (the workspace app, phases 1–2 of the pasted 2.0 plan). The screens, components and look are in [workspace-app-design.md](workspace-app-design.md), decided on 2026-10-27. Mockups: https://claude.ai/artifact/H8HpWsfTcZYz5Y1kJBQtUB (private).

## What it is

A desktop app beside Claude Code, for the Mac first and Windows after it. It shows every project Queue-tea knows, with its queue, its current task and its history. It also does the queue's own work: filing, priority, features, blocking, starting a task on its branch, and finishing it with the task-log row. Claude Code opens only for the work itself.

The terminal mod keeps working as it does today. The app and the mod read and write the same record, through the same engine code.

**It works when** Rohan can run a day from the app without typing a Queue-tea command: see what's next across projects, start ★ (the branch is made and Claude Code is told or opened), answer Review, and finish with the log row. A session open in that project sees every change.

## In this release

- **Screens:** Home, Quests (the ranked list in state sections, with a detail pane), a quest's and a saga's detail, New quest, Start with the git hold, Judgement, Done and the victory, Back to the board, Seal…, Move, Remove, Chronicle, Mana & time, Hoard and badges, Settings, the Library, the Guild Hall (read-only; helpers are turned on per quest, not in the hall), first run, the failed record, the command palette and the narrow window. They are drawn and measured in sections 3–5 of the design. On screen they use the game's words (section 2.2 of the design); the engine and the record keep their own.
- **The look:** Jade Peaks. A sky behind every screen follows the clock: morning, day and evening on light panels, the lantern night on dark ones. Settings can fix the sky to one time of day and has Calm mode, which stops every animation.
- **The game layer:** XP, levels, a lóng that grows from egg to elder, a day streak, gold and seven badges. All of it is worked out from the record.
- **New record fields:** `description`, `criteria` and `review` on every task, and `requests` on the record. Each task also gets `helpers`, the helpers Claude uses on it, which Rohan turns on or off per quest (Tea-DD is on by default).
- **In the mod:** session files, handling the app's requests, setting `review`, and an "Open in Queue-tea app" entry in the tea-cup menu.
- **Opening the app on a project:** a `queue-tea` command line tool and a `queue-tea://` URL.

## Not in this release

- **The Board tab.** It comes with tasks side by side (sub-project 4), when In progress and Review can hold several cards.
- **The other 2.0 sub-projects:** helpers handed work from the Guild Hall (2), Tea Leaves and Obsi-tea (3), tasks side by side in worktrees (4) and lifecycle hardening (5). No placeholders for any of them.
- **Windows.** It comes after the Mac (see Decisions).
- **A phone or web app.** The window talks to the engine through one typed API, so HTTP can sit behind it later.
- **Also left out:** a menu-bar cup, notarisation and auto-update.
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
| Guild Hall (the Tea Room) | In, read-only; helpers are turned on per quest, not in the hall | Cheap, carries the character, and teaches the @-mentions that work today |
| Single-letter keys | The terminal's letters, off inside text fields, a switch in Settings | Same muscle memory in both places |
| Description and criteria | On every task, collapsed when empty | Any task becomes a feature once it has children |
| VS Code | Open the folder, copy `claude`, toast "Paste it in VS Code's terminal" | The Claude Code extension (2.1.311) can't start a terminal from outside VS Code; its `vscode://anthropic.claude-code/open` URL opens the graphical panel |
| The rest | The suggested answers in section 8 of the design | Rohan took them all on 2026-10-27 |
| Build and install | **New in this spec:** a local build signed ad hoc, from one npm script, copied to /Applications | One user; notarisation and auto-update would be work with no reader. An Apple Silicon Mac won't run an unsigned app, so it can't be less than ad hoc |

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

## Data

Section 6 of the design lists every field: what each screen reads, the new fields with their defaults, the session file and the app's own settings. The rules:

- The record stays at version 1.
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
