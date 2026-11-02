# Workspace app, the rest of the road

**Goal:** Rohan runs a day from the app without typing a Queue-tea command (the spec's "It works when").

**Spec:** `docs/workspace-app.md` and `docs/workspace-app-design.md`. Part 1 is `docs/plan-workspace-app.md`.

**The constraints of part 1 still hold:** Mac first, nothing Mac-only outside `claude_host.ts` and `app/main/core/platform/`, no Commit, Push, Merge or Pull button, game numbers never stored, work in `../queue-tea-app`, and Rohan makes every commit and files every task.

## The road

| Part | What it adds | Build step | Needs first | State |
|---|---|---|---|---|
| 2 | Edits: priority, New quest, Part of and Move, Seal…, Play next, Remove, Undo, sagas folding | 4 | part 1 | **built** |
| 3 | Start with the git hold, Judgement, Finish quest with the victory, Back to the board, the terminals, sealing the active quest | 5 | part 2 | next |
| 4 | Chronicle, Mana & time, Hoard and badges, Settings with Calm mode and the letter-keys switch, Guild Hall, first run, the failed record, Time I have, search and filters, drag to move, filling a description from the checkpoint, the palette, the menu bar, the narrow window | 6 | part 3 | after that |
| 5 | The packaged app, the `queue-tea` tool, the `queue-tea://` scheme, the notification | 7 | part 4 | after that |
| 6 | Windows: `Host` file calls and paths, terminals, installer, window buttons, Ctrl shortcuts | new | part 5 and a Windows machine | last |

Rohan's own steps stand beside these: finish the hand try-out, merge the restructure and part 1, and file the app with `/steep`. The app's live sessions only appear once the mod's half is merged, so part 3 can be built before that but not tried by hand before it.

Each part gets its detail when the one before it lands, because each is shaped by what the last one built.

---

## Part 2: edits

**State:** built on 2 Nov 2026, not yet committed. 341 mod tests, 203 app tests and 21 end-to-end checks pass, the last run twice over.

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
