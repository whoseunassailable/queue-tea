# Workspace app, the rest of the road

**Goal:** Rohan runs a day from the app without typing a Queue-tea command (the spec's "It works when").

**Spec:** `docs/workspace-app.md` and `docs/workspace-app-design.md`. Part 1 is `docs/plan-workspace-app.md`.

**The constraints of part 1 still hold:** Mac first, nothing Mac-only outside `claude_host.ts` and `app/main/core/platform/`, no Commit, Push, Merge or Pull button, game numbers never stored, work in `../queue-tea-app`, and Rohan makes every commit and files every task.

## The road

| Part | What it adds | Build step | Needs first | State |
|---|---|---|---|---|
| 2 | Edits: priority, New quest, Part of and Move, Seal…, Play next, Remove, Undo, sagas folding | 4 | part 1 | **committed** |
| 3 | Start with the git hold, Judgement, Finish quest with the victory, Back to the board, the terminals, sealing the active quest | 5 | part 2 | **committed** |
| 4 | Chronicle, Mana & time, Hoard and badges, Settings with Calm mode, the terminal choice and the letter-keys switch, Guild Hall, first run, the failed record, Time I have, search and filters, drag to move, filling a description from the checkpoint, Home's drift line, the branch mismatch with Switch, the commit warning, the palette, the menu bar, the narrow window. | 6 | part 3 | **built** |
| 5 | The packaged app, the `queue-tea` tool, the `queue-tea://` scheme, the notification, and the current quest's detail pane with its checkpoint card, which was in no build step | 7 | part 4 | **built** |
| — | After the first install: realm separation, the HUD, GitHub accounts, the Library | new | part 5 | **built, not committed** |
| 6 | Windows: `Host` file calls and paths, terminals, installer, window buttons, Ctrl shortcuts | new | part 5 and a Windows machine | next, once there's a Windows machine |

Rohan's own steps stand beside these: finish the hand try-out, merge the restructure and part 1, and file the app with `/steep`. The app's live sessions only appear once the mod's half is merged, so part 3 can be built before that but not tried by hand before it.

Each part gets its detail when the one before it lands, because each is shaped by what the last one built.

---

## Part 2: edits

**State:** built and committed on 2 Nov 2026 (`7f147f3`, `9355527`), not pushed. 341 mod tests, 203 app tests and 21 end-to-end checks pass, the last run twice over.

**What the real app taught:** keys pressed straight after changing rows acted on the row before, and a dialog's first key could be missed, because an ordinary effect only runs after painting. The component tests couldn't see it, as their tooling flushes effects. `useWindowKeys` in `core/widgets/window_keys.ts` is now the one way to listen for keys: it attaches as the screen commits and always calls the newest handler.

**Architecture:** one handler per call in `app/main/features/tasks/api/`, each validating its input and running the mod's own use case over the Node host. Every edit returns the realm's fresh view. The window changes in the same frame, and a failed write reverts and says so.

**Copy:** forms follow `CLAUDE.md`, which outranks the design where they differ: the submit button stays enabled, and pressing it shows the errors.

### Review focus

1. **A record that stops reading while an edit is on its way.** The chip reverts, the record isn't touched, and the toast says why. Test in task 2.
2. **A quest that went from the board since the row was drawn**, because a session started or removed it. The edit changes nothing and the row goes on the next read. Test in task 2.
3. **A refresh arriving between the click and the reply.** It can't paint the old value back over the chip. Test in task 3.
4. **Single-letter keys while typing a title.** They type. Test in task 5.
5. **A saga removed while the sheet offers it.** The engine refuses, and the refusal shows under Part of with the sheet still open. Test in task 4.

### Task 1: the engine's three additions

**Files:** `hooks/features/tasks/domain/usecases/edit_task.ts`, `restore_task.ts`, `file_task.ts`; `tests/unit/tasks/edit.test.ts`

**Produces:** `editTaskUseCase(d, taskId, edit: TaskEdit)`; `TaskEdit = { title?, description?, criteria?, difficulty? }`; `restoreTaskUseCase(d, taskId)`; `FileInput` gains optional `description` and `criteria`.

- [x] Only an open task can be edited, and only a removed one restored.

### Task 2: the backend

**Files:** `app/main/features/tasks/api/tasks_api.ts`, `tasks_api.spec.ts`, `app/main/features/tasks/domain/task_input.ts`, `app/shared/engine_api.ts`, `app/preload/preload.ts`, `app/main/main.ts`, `app/main/core/reply.ts`, `app/main/core/messages.ts`

**Produces:** on `EngineApi`: `setPriority`, `togglePlayNext`, `fileQuest`, `moveQuest`, `sealQuest`, `unsealQuest`, `removeQuest`, `restoreQuest`, `editQuest`, `setActiveSaga`, each returning `Reply<ProjectView>`; `readChoices(key, taskId): Reply<Choices>`. A `Refusal` in `reply.ts` carries a sentence for the user without logging an error.

- [x] Tests over a temporary folder, one for each call, with review focus 1 and 2, and a run of every use case that checks the mod still reads what the app wrote.

### Task 3: edits in the window

**Files:** `app/renderer/features/workspace/state_management/workspace_store.ts`, `app/renderer/core/widgets/toasts.tsx`, `app/renderer/features/quests/domain/edits.ts`

**Produces:** `workspace.run(edit: Edit)`, where an `Edit` holds the same-frame change, the call, its undo and its toast text; `workspace.undo()`; `workspace.dismiss(id)`.

- [x] Tests: the chip changes before the reply; a failed write reverts and says so; ⌘Z restores; review focus 3.

### Task 4: the forms

**Files:** `app/renderer/core/widgets/dialog.tsx`, `field.tsx`, `app/renderer/features/quests/domain/quest_form.ts`, `presentation/widgets/new_quest_sheet.tsx`, `seal_dialog.tsx`, `move_dialog.tsx`, `remove_dialog.tsx`

- [x] Each field validates on blur; submit validates all, shows the errors under the fields and blocks. Required fields carry `*`, and the error is "Title is required."
- [x] With an active saga, New quest won't add until Part of is answered. "New saga…" makes its title required.
- [x] Filing never starts a quest. A plain quest is removed at once with Undo; a saga asks first.

### Task 5: the board and the detail pane

**Files:** `presentation/widgets/priority_control.tsx`, `quest_row.tsx`, `quest_detail.tsx`, `add_chapter.tsx`, `presentation/pages/quests_page.tsx`, `presentation/state_management/quest_keys.ts`

- [x] Rows carry the priority control, and sagas fold, with a folded saga holding the ★ showing "★ <chapter> · <why>". Folds are kept in the settings.
- [x] Keys: ↑ ↓, ← →, 1–5, f, k, u, p, a, x and ⌫, off inside text fields. ⌘N and ⌘Z everywhere.
- [x] In the detail pane: title, difficulty, description and criteria edit in place.

### Task 6: seen working

**Files:** `app/e2e/edits.e2e.ts`

- [x] On the real app with a temporary `HOME`: change a priority and see the record change within 300 ms, file a quest and a chapter, seal and unseal, move one under a saga, remove and undo, and watch a broken record revert a chip.

**Commit point:** the app can edit.

---

## Part 3: setting out and coming back

**State:** built and committed on 2 Nov 2026 (`ceea4a7`, `fed7c12`), not pushed. 345 mod tests, 408 app tests and 36 end-to-end checks pass, the last run twice over. Nothing here can be tried by hand on live sessions until the mod's half is merged.

**Seen in a real session:** Claude Code 2.1.316 running this mod took a `putBack` carrying a seal within 8 s of starting: the quest went back sealed and the request left the record. That session had no conversation, so no checkpoint was written; a checkpoint and a seal together are covered by tests only.

**What the real app taught:** `npm run e2e` needs the Mac awake. A display that sleeps stops the window painting, so screenshots hang and every test after them fails, in a way that looks like the app. `caffeinate -dimsu npm run e2e` keeps it honest.

**Goal:** from Home or Quests, start the main quest through the git check, hand it to Claude Code, answer Judgement, finish with the victory, or take a quest back to the board or seal it, without touching the terminal.

**Architecture:** main keeps running the mod's use cases over the Node host. Start is two calls, so each ◌ line is true: `checkStart` reads git and says what Start would do, and `startQuest` claims, branches and hands over. `checkStart` changes nothing, so Check again is simply `checkStart` again. What a session has been asked to do is read from the record's `requests`, so it survives a restart and needs no state in the window. The flows in the window live in `quest_flows.ts`, beside `quest_edits.ts`, and what a flow is doing is view state per realm, as the design asks of the hold.

**Decisions made here:**

- **A sealed put-back carries its seal.** `AppRequest` gains an optional `block`, because a session writes the checkpoint before it puts the quest back, and the seal has to go back with it. The mod's half isn't merged, so this changes nothing anyone has.
- **VS Code opens with `open -a`, not `code`.** An app started from the Finder doesn't get the shell's `PATH`, so `code` wouldn't be found once the app is installed. The spec's Terminals section is updated.
- **Open in Claude Code doesn't start a second session.** With a session open, it brings the chosen terminal forward. With none, it opens a new window, which is the only time it runs `claude`.
- **The terminal choice is stored in the settings now**, with Terminal as the default; the Settings screen that changes it comes with part 4.
- **Back before Claude has begun skips the checkpoint.** With a `begin` still waiting, no conversation has happened, so the request is dropped and the quest goes back at once.
- **The game can't cost a finish.** The victory is worked out after the record and the log row are written, from the records as they are now, and a failure there only means a toast in place of the panel.

### Review focus

1. **A project path with a space, a quote, a `$` or a backtick.** The line given to the terminal stays one safe command. Test in task 2.
2. **A project folder that has moved.** Git would answer "not a repository" and Start would claim the quest with no branch; it refuses in plain words instead. Test in task 3.
3. **The session ending while a checkpoint is awaited.** The request stays, the card says no session is open, and Put it back now works. Tests in tasks 4 and 6.
4. **The quest finished or put back elsewhere while the Finish sheet is open.** The refusal shows in the sheet and the record is untouched. Test in task 4.
5. **A second press on Start or Finish** while the first runs, with a double click or ⌘↩ twice: one branch, one log row, one victory. Test in task 5.

### Task 1: the mod's half

**Files:** `types/index.d.ts`, `hooks/features/tasks/domain/usecases/add_request.ts`, `drop_requests.ts`, `hooks/features/tasks/presentation/state_management/requests_controller.ts`, `tests/unit/tasks/requests.test.ts`

**Produces:** `AppRequest.block?: Block`; `addRequestUseCase(d, kind, taskId, block?)`, which adds nothing when the same kind already waits for that quest; `dropRequestsUseCase(d, taskId)`.

- [x] Tests first: adding twice leaves one; dropping leaves other quests' requests; a `putBack` carrying a seal puts the quest back sealed.

### Task 2: the terminals

**Files:** `app/main/core/platform/mac.ts`, `mac.spec.ts`, `app/main/features/tasks/data/claude_code.ts`, `claude_code.spec.ts`, `app/main/features/settings/api/settings_api.ts`

**Produces:** `shellQuote(text)`, `claudeLine(path)`, `openClaudeArgv(terminal, path)`, `bringForwardArgv(terminal, path)`; `openClaudeCode(d, path, isSessionOpen): Promise<Handover>`; `Settings.terminal: 'terminal' | 'iterm' | 'vscode'`, default `'terminal'`.

- [x] Tests: review focus 1 for each terminal; VS Code copies `claude`; a failed launch gives the name and the line to copy; with a session open nothing runs `claude`.

### Task 3: Start in main

**Files:** `app/main/features/tasks/api/start_api.ts`, `start_api.spec.ts`, `app/main/features/tasks/domain/hold.ts`, `app/shared/engine_api.ts`, `app/preload/preload.ts`, `app/main/main.ts`, `app/main/core/messages.ts`

**Produces:** `checkStart(key, taskId): Reply<StartCheck>`; `startQuest(key, taskId): Reply<StartOutcome>`; `openClaude(key): Reply<Handover>`; `copyText(text): Reply<null>`; `holdCommand(git)`, `holdKind(git)`.

- [x] Tests on real git in a temporary folder: uncommitted files and unpushed commits write nothing and make no branch, and the text equals `holdReason()`; a first start makes `task/<slug>` from the branch it left; a put-back quest returns to its own branch; a deleted branch says so; not a repository still starts; a `begin` is added with a session and with none; review focus 2.

### Task 4: Judgement, Finish and Back in main

**Files:** `app/main/features/tasks/api/finish_api.ts`, `back_api.ts`, their specs, `app/main/features/game/domain/services/victory.ts`, `victory.spec.ts`, `app/main/features/projects/domain/project_views.ts`

**Produces:** `finishQuest(key, taskId, actual, logPath): Reply<FinishOutcome>`; `retryTaskLog(key, taskId, path): Reply<LogOutcome>`; `notYet(key, taskId): Reply<ProjectView>`; `putBackQuest(key, taskId, seal): Reply<BackOutcome>`; `putBackNow(key, taskId): Reply<BackOutcome>`; `victoryOf(records, path, taskId, offsetMinutes, nowMs): Victory`; `ActiveQuest.asking`, `ActiveQuest.criteria`, `ProjectView.docsLogPath`, status `judgement`.

- [x] Tests: the record ends done with the actual difficulty and lines, and the log has its row; the first finish takes the path; a failed log leaves the quest done and Try again adds the row once; a level-up and a new badge are reported; a failure in the game gives no panel and still a finish; review focus 3 and 4; Back before `begin` was taken; Back with no session reports the last checkpoint.

### Task 5: the flows in the window

**Files:** `app/renderer/features/workspace/state_management/workspace_store.ts`, `app/renderer/features/quests/presentation/state_management/quest_flows.ts`, `quest_keys.ts`, `quest_flows.spec.ts`, `app/renderer/l10n/en.ts`, `app/renderer/test_support.ts`

**Produces:** `workspace.setFlow(key, flow)`, `workspace.adopt(key, view)`, `workspace.showVictory(victory)`, `workspace.noteFor(questId, text)`; `questFlows(engine, workspace)`; keys s, d, b, c and ⌘↩, y, n, r and Esc.

- [x] Tests: each ◌ line shows in turn; a hold keeps Check again and Cancel; review focus 5; a second realm keeps its own hold.

### Task 6: the cards and sheets

**Files:** `presentation/widgets/flow_card.tsx`, `judgement_card.tsx`, `finish_sheet.tsx`, `victory_panel.tsx`, `copy_line.tsx`, `active_card.tsx`, `seal_dialog.tsx`, `quest_detail.tsx`, `home_page.tsx`, `quests_page.tsx`, `app.tsx`, `sidebar.tsx`, `flows.spec.tsx`

- [x] Forms follow `CLAUDE.md`: the path is required when there isn't one, and its error shows under it on blur and on submit.
- [x] No button reads Commit, Push, Merge or Pull, checked in the DOM. A git command shows as text beside a copy button with no such word on it.
- [x] The victory closes with Esc or a click on the sky, and the board's keys still work behind it. In Calm mode no coins fall.
- [x] Tests for what the user sees on each card, and review focus 3.

### Task 7: seen working

**Files:** `app/e2e/flows.e2e.ts`

- [x] On the real app with a temporary `HOME`, a real git repository and a stand-in `osascript` on the `PATH`, so no terminal really opens: Start through a git hold and past it, onto the branch; Judgement then Finish with the log row and the victory; Back with no session; seal the active quest; a `begin` and a `putBack` with a session file in place; the first finish asking for the path.

**Commit point:** the app can run a quest from start to finish.

---

## Part 4: the rest of the screens

**State:** built and committed on 2 Nov 2026. 346 mod tests, 678 app tests and 69 end-to-end checks passed at the end of this part, the last six times running. The mod changed in one place, the session file's `warning`, which is covered by its tests and not yet seen in a real session.

**What the real app taught:**

- **The board only changes when main answers, so a key pressed faster than that is working from old numbers.** Three quick presses of `t` each stepped on from the same value. The steps now build on each other.
- **A narrowed saga still has to tell the truth about itself.** With only one chapter matching, the detail pane and Remove both counted one chapter. They now read the whole saga.
- **Letters found in order aren't a match worth leading with.** "hoard" highlighted Back to the board, which couldn't run, so Return did nothing. Sections now go by their best match.
- **Mapping Return for the board took it from the focused button**, which keyboard users rely on. It now stays with the button.
- **The two end-to-end failures that weren't the app:** a test standing in for a session has to wait for the app's write, as it edits without the lock; and a toast from the test before can pass a check early, so the record is what gets read.

**Goal:** every screen in the design's sections 4.10 to 4.18 exists, and the board has its tools.

**Architecture:** a page is a feature in the window and, where it reads something new, a feature in main: `app/main/features/<feature>/` holds a pure `domain` and one `api` file, as `game` does. A page that isn't about one realm (Hoard, Guild Hall, Settings) renders before the realm checks in `Content`. Every page reads through one hook, `useEngineRead`, so loading, done and failed look the same everywhere and old data stays on screen during a refresh. What's view state stays view state: the week, Time I have, the search and the filters are per realm and never saved.

**Decisions made here:**

- **The commit warning needs the mod.** It lives in the session's memory, where the app can't see it, so the session file gains `warning`. It is the only change to the mod in this part.
- **The Install command row waits for part 5.** The design says no placeholders, and the tool doesn't exist until then.
- **A folder is only ever chosen in main's dialog**, and the window passes back the path it was given, checked again before a record is written.
- **Finder is reached by realm key, never by a path from the window.** A window that could name any path could reveal anything.
- **Guild Hall reads the helpers from `agents/*.md` at build time.** A description's first sentence only names the helper, so the card shows the rest.
- **Time I have lives in main's memory**, because every edit hands back a fresh board that must rank by it too. It is written nowhere and resets on quit.
- **Still missing after this part:** the current quest's own detail pane (design 4.4, with the checkpoint card and live lines). It was in no build step, so it's now on the road in part 5.
- **Also left out, as the design's pane resizing and window memory:** the sidebar and detail pane are fixed widths, and the window's size and position aren't remembered yet. Neither is on the road's list; they go with part 5's packaging if they earn it.

### Review focus

1. **A week with no time at all, and a day with time but no victories.** The chart doesn't divide by zero, and the summary says so. Test in stage A.
2. **A broken record on an app-wide page.** Hoard, Chronicle's All realms and Settings still show the realms that read. Tests in stages A and B.
3. **Use the last good copy on a newer record.** Never offered, and refused in main if asked anyway: an older copy would lose the newer work. Test in stage B.
4. **Open folder on a folder inside a repository, or one that already has a record.** The record is keyed on the repository's top folder, and a known one is selected rather than overwritten. Test in stage B.
5. **The Task log path set from Settings** follows the same rules as the Finish sheet. Test in stage B.
6. **Search and a saga.** A chapter that matches keeps its saga on screen, and the fold doesn't hide it. Test in stage C.
7. **Dragging a quest onto itself, a chapter, or a saga that refuses.** The refusal shows and nothing moves. Test in stage C.
8. **⌘K's actions when one can't run.** It shows dim with its reason and Return does nothing. Test in stage D.
9. **Letter keys off.** They stop on every page, and the ⌘ shortcuts don't. Test in stage B.

### Stage A: the pages that only read

**Files:** `app/main/features/chronicle/`, `app/main/features/mana/`, `app/main/features/game/api/game_api.ts`; `app/renderer/features/chronicle/`, `mana/`, `hoard/`, `guild/`; `core/widgets/week_chart.tsx`, `core/api/use_engine_read.ts`, `config/routing/routes.ts`, `features/workspace/presentation/widgets/sidebar.tsx`, `app/renderer/app/app.tsx`; `app/e2e/pages.e2e.ts`

**Produces:** `readChronicle(scope, day): Reply<ChronicleView>`; `readMana(key): Reply<ManaView>`; `readHoard(): Reply<HoardView>`; `useEngineRead(engine, read, deps)`; routes `/chronicle`, `/mana`, `/hoard`, `/guild`; tabs ⌘1 to ⌘4.

- [x] Tests: the week's sums and who was harder or easier, over fixture records; last week for the empty state; a chapter of the record with no time; review focus 1 and 2; gold by realm lists a realm with no victories; the helpers parse from the real `agents/*.md`.

**Commit point:** the app can look back.

### Stage B: Settings, first run and the failed record

**Files:** `app/main/features/settings/api/`, `app/main/features/projects/api/`, `app/renderer/features/settings/`, `features/first_run/`, `features/workspace/presentation/widgets/failed_record.tsx`; `app/e2e/settings.e2e.ts`

**Produces:** `readSettingsPage()`, `setTaskLog(key, path)`, `showRecord(key | null)`, `openFolder()`, `addProject(path)`, `restoreRecord(key)`; `Settings.letterKeys`, `Settings.chronicleScope`; `ProjectView` unreadable gains `reason` and `file`.

- [x] Forms follow `CLAUDE.md`. Review focus 2, 3, 4, 5 and 9.

**Commit point:** the app can be set up and put right.

### Stage C: the board's tools

**Files:** `presentation/widgets/time_control.tsx`, `search_box.tsx`, `filters_popover.tsx`, `domain/search.ts`, `quest_row.tsx`, `move_dialog.tsx`, `quest_detail.tsx`, `home_page.tsx`, `app/main/features/tasks/api/live_api.ts`, `hooks/shared/sessions/`

**Produces:** `readProject(key, budget)`; `readLive(key): Reply<LiveFacts>`; `switchBranch(key)`; `SessionFile.warning`; `QuestRow.goal` and `QuestRow.acceptance`.

- [x] Review focus 6 and 7, and search over 500 quests within 50 ms.

**Commit point:** the board has its tools.

### Stage D: the palette, the menu bar and the narrow window

**Files:** `app/renderer/features/palette/`, `app/main/core/app_menu.ts`, `app/renderer/core/theme/app.css`, `presentation/pages/quest_page.tsx`

**Produces:** ⌘K; the menu bar, whose Task menu sends the window the same keys; the breakpoints at 1180 and 900 px.

- [x] Review focus 8. ⌘K opens within 100 ms. Every Task menu action has a key.

**Commit point:** part 4 is done.

---

## Part 5: an app you can install

**State:** built and committed on 2 Nov 2026 (`dede80f`, `69bd19a`, not pushed), and installed. 346 mod tests, 784 app tests and 78 end-to-end checks pass, the last five times running, and 7 more on the built app itself.

**Seen for real:** a link launching the built app from cold through macOS, with `open -a` on a temporary home, landing on the right realm with a space and an accent in its path. An app that only `open-url` could start can't be tested any other way, because the test driver isn't there yet when it fires.

**Not seen yet:** the install itself, since `npm run install-app` replaces an app on your Mac and is yours to run; `queue-tea open` and the tea cup through the registered link, which need that install; and macOS showing the banner, which may first ask for permission. The tests stand in for showing it, and everything that decides to show it and what a click does are the real ones.

**What the real app taught:**

- **A merged config can't take something away.** The stage build's empty `protocols` was merged with prod's, so it still claimed `queue-tea://`. The claim now sits only in the prod file, and a test reads the built app's own `Info.plist`.
- **This build tool's ad hoc option does nothing.** It skipped signing and reported nothing as wrong. `afterPack` signs the app, and a test verifies the signature on the built bundle.
- **Everything the window needs is bundled**, so the app's runtime dependencies were 434 stray files in the build. They're dev dependencies now.
- **A check that crashes can look like a check that passes.** Taking the guard off the notification threw inside a `try`, which also meant no notification, so the test still passed. It now fails if anything was logged.

**Goal:** Queue-tea is an app in /Applications that opens on a project from the terminal, from the tea cup or from a link, and taps you on the shoulder when Claude says a quest looks done.

**Architecture:** the mod's tea cup already opens `queue-tea://open?path=`, so the link is the one way in: `queue-tea open` is a small shell script that builds it. Main turns a link into a picked folder through the same code as Open folder, and hands it to the window, which asks for it at start-up too, so a link that launched the app isn't lost. The notification is worked out in main from the same scan of the records, because it has to work for a realm the window isn't showing.

**Decisions made here:**

- **A link can only select or ask.** It can come from any web page, so a known realm is selected and an unknown one opens Add realm, which asks first. Nothing is written on a link's word.
- **Only the prod build claims `queue-tea://`.** Dev and stage install side by side, and two apps can't own one scheme.
- **The tool never replaces a file that isn't its own.** `/usr/local/bin` often needs an admin, so it goes in the first of `/usr/local/bin`, `/opt/homebrew/bin` and `~/.local/bin` it can write to, and says so when that last one isn't on your `PATH`.
- **The build is signed ad hoc.** An Apple Silicon Mac won't run an unsigned app, and a real certificate is the notarisation the spec left out.
- **Copying to /Applications is a script you run**, because it replaces an app on your Mac and registers the link. The build itself goes to `app/dist`.

### Review focus

1. **A link with no path, a relative path, a folder that isn't there, or a path with spaces and accents.** Nothing happens that the window doesn't show, and the path comes through whole. Test in stage B.
2. **A link that launches the app.** It arrives before the window exists, and still lands. Test in stage B.
3. **`review` set on a realm that isn't selected, on a window in the background, or already set when the app opens.** The first two notify once; the last doesn't. Test in stage B.
4. **A `queue-tea` already on the `PATH` that isn't ours.** It's left alone, and the app says so. Test in stage B.
5. **The packaged app reaching what only exists in development**: the helpers' art, the fonts, the flavor, the log folder. Test in stage C, on the built app.

### Stage A: the quest in hand, in full

**Files:** `app/main/features/tasks/api/detail_api.ts`, `app/renderer/features/quests/presentation/widgets/active_detail.tsx`, `quest_notes.tsx`, `quest_detail.tsx`, `active_card.tsx`, `quests_page.tsx`

**Produces:** `readQuestFacts(key, taskId): Reply<QuestFacts>`: the checkpoint or handoff note, what it was filed with, the branch it will get, and for the active quest its time, effort, files, lines and git.

- [x] Tests: a checkpoint with its sections, a plain note, none; a branch name that's taken; the lines refreshing every 30 s while the pane shows; git that can't be read leaves the rest standing.

**Commit point:** nothing about a quest is hidden.

### Stage B: the ways in

**Files:** `app/main/features/opening/`, `app/main/features/notify/`, `app/main/main.ts`, `app/main/core/app_menu.ts`, `features/workspace/state_management/workspace_store.ts`, `sidebar.tsx`, `settings_page.tsx`, `app/e2e/opening.e2e.ts`

**Produces:** `pathFromUrl(url)`; `takeOpened(): Reply<Opened[]>`, `onOpened(listener)`; `installCommand(): Reply<InstalledCommand>`; the Detected tag; `judgementWatch(deps)`.

- [x] Review focus 1 to 4. The tool is tested by running it, with a stand-in `open`.

**Commit point:** the app opens on a project.

### Stage C: the build

**Files:** `app/electron-builder.yml`, `app/package.json`, `app/tools/install_app.sh`, `app/e2e/packaged.e2e.ts`, `app/README.md`

**Produces:** `npm run package`, `npm run package:stage`, `npm run install-app`.

- [x] The built app launches, on a temporary `HOME`, as prod, with its art, and refuses a commit. Review focus 5.

**Commit point:** part 5 is done.

---

## After the first install

**State:** built on 2 Nov 2026 from Rohan's notes on the installed app, not yet committed.

**What was checked first, on a copy of the real records:** nothing had crossed between projects. Neither record names the other, and queue-tea has no task log. Settings listed both realms' logs together, which read as if one was set to the other. The board is empty because queue-tea has no open tasks: the app was built through `/brew`, which files nothing.

**Decisions made here:**

- **A realm's log stays in that realm.** Nothing stopped `../Gait-feedback/docs/task_log.md` being given as a path, so the engine now refuses a log outside the project, for the mod and the app alike. This is the one change to the mod.
- **Settings shows the realm you're in.** Its record and task log, not a list of every realm's, and main sends only that one.
- **The level is yours, not a project's.** XP, gold and the streak stay across realms, as numbers with no project data in them. Chronicle's All realms stays as a choice you make, defaulting to This realm.
- **The HUD is for going on.** Mana shows only when it's known. The bar shows what the quest in hand will add, and the line under it always names the next thing worth doing. Chips that go somewhere are links, and they look like it.
- **GitHub accounts stay in `gh`.** The app holds no tokens: it lists what `gh` knows, and adding one runs `gh`'s own sign-in. Which account a realm belongs to is kept in the app's settings, outside every record and repository.
- **Connecting a realm names its account; it doesn't change git.** It shows on the realm and in Settings. Pushing goes on as it does today.
- **Books live in `~/.queue-tea/library.json`**, apart from every record, so no project sees them and every flavor of the app shares them.

### Review focus

1. **A log path that escapes:** `..`, an absolute path elsewhere, a path that leaves and comes back. Refused in the engine, in main and in the form.
2. **`gh` not installed, signed out, or found only on the Finder's short `PATH`.** The page says what to do; the app can't see it on a shell's `PATH`, so it looks where Homebrew puts it.
3. **Sign-in cancelled, timed out, or a second one started.** The process doesn't outlive the dialog, and only one runs.
4. **A realm connected to an account later removed from `gh`.** It says so and offers another, rather than showing a name that no longer works.
5. **A page number past the end, a book of 0 pages, or a broken library file.** The form says so; a broken file is kept and never overwritten.

### What the building found

- **A press could miss its button.** Pressing a form's button took focus from the field, the field's error appeared, and the button moved out from under the mouse. Component tests have no layout, so only the real app showed it. Fixed in the dialog, for every form.
- **A book's first page isn't today's reading.** Adding a book you're part way through counted every page as today. A book now keeps where it came in, and the same pages never count twice.
- **`gh auth status` goes out to GitHub,** so the accounts are read when a dialog opens, not on every record change, and a timeout isn't taken for a lapsed sign-in.
- **Tested against the real `gh` once:** the list, a real one-time code, and a cancel that left the sign-in as it was and nothing running. Finishing a real second sign-in is Rohan's to try.
