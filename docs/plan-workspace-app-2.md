# Workspace app, the rest of the road

**Goal:** Rohan runs a day from the app without typing a Queue-tea command (the spec's "It works when").

**Spec:** `docs/workspace-app.md` and `docs/workspace-app-design.md`. Part 1 is `docs/plan-workspace-app.md`.

**The constraints of part 1 still hold:** Mac first, nothing Mac-only outside `claude_host.ts` and `app/main/core/platform/`, no Commit, Push, Merge or Pull button, game numbers never stored, work in `../queue-tea-app`, and Rohan makes every commit and files every task.

## The road

| Part | What it adds | Build step | Needs first | State |
|---|---|---|---|---|
| 2 | Edits: priority, New quest, Part of and Move, Seal…, Play next, Remove, Undo, sagas folding | 4 | part 1 | **committed** |
| 3 | Start with the git hold, Judgement, Finish quest with the victory, Back to the board, the terminals, sealing the active quest | 5 | part 2 | **built** |
| 4 | Chronicle, Mana & time, Hoard and badges, Settings with Calm mode, the terminal choice and the letter-keys switch, Guild Hall, first run, the failed record, Time I have, search and filters, drag to move, filling a description from the checkpoint, Home's drift line, the branch mismatch with Switch, the commit warning, the palette, the menu bar, the narrow window | 6 | part 3 | next |
| 5 | The packaged app, the `queue-tea` tool, the `queue-tea://` scheme, the notification | 7 | part 4 | after that |
| 6 | Windows: `Host` file calls and paths, terminals, installer, window buttons, Ctrl shortcuts | new | part 5 and a Windows machine | last |

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

**State:** built on 2 Nov 2026, not yet committed. 345 mod tests, 408 app tests and 36 end-to-end checks pass, the last run twice over. Nothing here can be tried by hand on live sessions until the mod's half is merged.

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
