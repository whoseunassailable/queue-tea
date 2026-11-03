# Guild helpers on tasks: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to carry out this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let Rohan choose, for each quest, which of the four helpers Claude works with. Tea-DD is on by default, and Claude is reminded once at "done" if Tea-DD or Commit Chai-n is on but hasn't run.

**Architecture:** A `helpers` field on each task in the record holds three things: the helpers turned on, the helpers that have run, and whether Claude has had its reminder. The app sets the "on" list through the existing new-quest and edit-quest path. The mod reads the field every turn, to add one instruction line for each helper that is on, and at `task_looks_done`, to remind once. A new `tool.call` hook on the `Agent` tool notes each helper run.

**Tech stack:** TypeScript. The mod uses the Claude Code plugin engine and its test kit (`claude-code/testing`). The app uses Electron, Preact and Vitest with Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-03-guild-helpers-on-tasks-design.md`

## Global constraints

- **Never commit or push.** Rohan does both. Each task ends when its checks pass. After Task 6, Commit Chai-n (`queue-tea:commit-chai-n`) prepares the commit and hands Rohan the commands. Suggested subject: `added helpers on each quest` (a small feature, so MINOR).
- **The four helper ids, in this order:** `commit-chai-n`, `mocha-mockup`, `chai-pter`, `tea-dd`. They are defined once, in `hooks/shared/records/domain/services/helpers.ts`, and every other place imports them.
- **The default for a new task, and for a task read without the field:** `{ on: ['tea-dd'], ran: [], reminded: false }`.
- **Every call that can fail runs in a try/catch.** A record write logs through `debug(p, '<what failed>', err)` in the mod (as `saveReview` does in `tasks_controller.ts`). In the app it goes through `workspace.run`, which already shows the failure. The app never shows an exception's text.
- **Text the user or Claude reads is never typed into a component or controller.** In the app it goes in `app/renderer/l10n/en.ts`. In the mod it goes in the new `hooks/features/tasks/presentation/constants/tasks_text.ts`.
- **Layers:** a view asks its controller, the controller runs a use case, and business rules stay plain code. `node tools/check_layers.mjs` must pass.
- **The window may import pure rules from the mod.** `app/renderer/core/domain/format.ts:2` already does.
- **Mod test fixtures start with no helpers on.** `makeTask` in `tests/helpers.ts` gets `helpers: { on: [], ran: [], reminded: false }`, so existing exact-text tests keep passing. New tests set `helpers` explicitly.
- After the code changes, run `graphify update .`.

## Review focus

These failure modes are the ones most likely to bite, most likely first. Each has a test in the task named.

1. **Two quick clicks on two different chips.** Both choices are saved; the second click must not undo the first. Tested in Task 3, "two quick clicks keep both".
2. **A failed save leaves the chips on what is saved.** It shouldn't show a choice that wasn't written. Tested in Task 3, "a failed save puts the chip back".
3. **A task with a partial `helpers` field, for example one with only `on`.** It reads with the missing parts filled from the default. Tested in Task 1, "a partial helpers field is filled in".
4. **An `Agent` call whose `subagent_type` is missing, not a string, or another agent's.** It is ignored, and the call goes ahead. Tested in Task 5, "other agents and odd input are ignored".
5. **If saving the reminder mark fails, Claude must not be reminded on every call forever.** The mod asks Rohan instead, with the didn't-run line. Tested in Task 5, "a failed reminder save asks Rohan instead".

---

### Task 1: The helper list and the record field

**Files:**
- Create: `hooks/shared/records/domain/services/helpers.ts`
- Modify: `types/index.d.ts` (the `Task` type, around line 50-66)
- Modify: `hooks/shared/records/domain/services/queue_rules.ts` (`newTask`, lines 20-58)
- Modify: `hooks/shared/records/data/datasources/record_source.ts` (`withDefaults`, lines 55-66)
- Modify: `tests/helpers.ts` (`makeTask`)
- Test: `tests/unit/shared/records/record.test.ts`

**Interfaces:**
- Produces, in `types/index.d.ts`:
  - `export type HelperId = 'commit-chai-n' | 'mocha-mockup' | 'chai-pter' | 'tea-dd'`
  - `export type TaskHelpers = { on: HelperId[]; ran: HelperId[]; reminded: boolean }`
  - `Task.helpers: TaskHelpers`
- Produces, in `helpers.ts`:
  - `HELPER_IDS: readonly HelperId[]`
  - `isHelperId(value: unknown): value is HelperId`
  - `defaultHelpers(): TaskHelpers`, which returns a fresh object each call
  - `onlyHelpers(ids: readonly HelperId[]): HelperId[]`, which drops repeats and returns the ids in `HELPER_IDS` order

- [ ] **Step 1: Write the failing tests** in `record.test.ts`:
  - `'an older task without helpers reads with Tea-DD on'`: `parseRecord` of a record whose task has no `helpers` gives `tasks[0].helpers` equal to `{ on: ['tea-dd'], ran: [], reminded: false }`.
  - `'a partial helpers field is filled in'`: a task with `helpers: { on: ['chai-pter'] }` reads as `{ on: ['chai-pter'], ran: [], reminded: false }`.
  - `'a new task starts with Tea-DD on'`: `newTask({...}).helpers` equals the default.
  - `'onlyHelpers drops repeats and keeps the list order'`: `onlyHelpers(['tea-dd', 'commit-chai-n', 'tea-dd'])` equals `['commit-chai-n', 'tea-dd']`.
  - `'isHelperId knows only the four'`: true for `'tea-dd'`, false for `'general-purpose'`, `''`, `3` and `null`.
- [ ] **Step 2: Run them and confirm they fail.** Run `claude plugin test .` and expect these five to fail: `helpers.ts` doesn't exist yet and `helpers` is undefined.
- [ ] **Step 3: Implement.**
  - Write `helpers.ts`.
  - Add the two types and `Task.helpers` to `types/index.d.ts`, with a one-line comment: "Which helpers Claude works with on this task, which have run, and whether Claude has had its one reminder at done."
  - In `newTask`, set `helpers: defaultHelpers()`.
  - In `withDefaults`, after the `...t` spread, set `helpers: { ...defaultHelpers(), ...t.helpers }`, so a partial field is filled in.
  - In `makeTask`, set `helpers: { on: [], ran: [], reminded: false }`.
- [ ] **Step 4: Typecheck.** Run `npx -y -p typescript@5.9 tsc -p .`. Add `helpers` wherever a full `Task` literal now fails to compile: `app/main/features/tasks/api/fixtures.ts` gets `helpers: { on: ['tea-dd'], ran: [], reminded: false }`, and so does any spec the compiler names.
- [ ] **Step 5: Run the tests and confirm they pass.** `claude plugin test .` should show everything passing.

### Task 2: Filing and editing carry the choice

**Files:**
- Modify: `hooks/features/tasks/domain/usecases/file_task.ts` (`FileInput`, and the task built at lines 34-45)
- Modify: `hooks/features/tasks/domain/usecases/edit_task.ts` (`TaskEdit`, `edited`)
- Modify: `app/shared/engine_api.ts`: `QuestRow` (line ~43), `ActiveQuest` (line ~56), `NewQuest` (line 206), `QuestEdit` (line 227)
- Modify: `app/main/features/tasks/domain/task_input.ts` (`newQuestOf`, `questEditOf`)
- Modify: `app/main/features/projects/domain/project_views.ts` (`questOf`, line ~73; `activeOf`, line ~112)
- Modify: `app/renderer/test_support.ts` (`quest`, `activeQuest`)
- Test: `tests/unit/tasks/edit.test.ts`, `app/main/features/tasks/api/tasks_api.spec.ts`

**Interfaces:**
- Consumes: `HelperId`, `defaultHelpers`, `isHelperId` and `onlyHelpers` from Task 1.
- Produces:
  - `FileInput.helpers?: HelperId[]` and `TaskEdit.helpers?: HelperId[]`. Both set only `task.helpers.on`, keeping `ran` and `reminded`.
  - `NewQuest.helpers: HelperId[]` and `QuestEdit.helpers?: HelperId[]`.
  - `QuestRow.helpers: HelperId[]` and `ActiveQuest.helpers: HelperId[]`, both the task's `on` list.
  - `helpersOf(value: unknown): HelperId[]` in `task_input.ts`. It throws `new Refusal(MESSAGES.badValue)` for anything that isn't an array of known ids, and returns `onlyHelpers(...)`.

- [ ] **Step 1: Write the failing tests.**
  - In `edit.test.ts`:
    - `'filing without helpers gives Tea-DD on'`
    - `'filing with helpers saves them as the on list'`: `['commit-chai-n']` in gives `helpers.on` of `['commit-chai-n']`.
    - `'editing helpers keeps what ran and the reminder'`: seed a queued task with `{ on: ['tea-dd'], ran: ['tea-dd'], reminded: true }`, edit with `helpers: []`, and expect `{ on: [], ran: ['tea-dd'], reminded: true }`.
    - `'a finished task keeps its helpers'`: an edit on a `done` task changes nothing.
  - In `tasks_api.spec.ts`:
    - In the filing describe: `'files with the helpers chosen, once each, in list order'`. `quest({ helpers: ['tea-dd', 'commit-chai-n', 'tea-dd'] })` gives a task on disk with `helpers.on` of `['commit-chai-n', 'tea-dd']`.
    - Add rows to the `it.each` refusal table at line ~163: `[{ helpers: ['general-purpose'] }, "That value isn't one Queue-tea can use. Pick another."]` and `[{ helpers: 'tea-dd' }, same message]`.
    - In the editing describe: `'edits the helpers'`. `api.editQuest(deps, KEY, id, { helpers: ['chai-pter'] })` gives `helpers.on` of `['chai-pter']` on disk, and the returned view's quest row has `helpers: ['chai-pter']`.
    - The spec's `quest()` input builder gets `helpers: ['tea-dd']` by default.
- [ ] **Step 2: Run them and confirm they fail.** Run `claude plugin test .`, then `npm test -- tasks_api` in `app/`, and expect the new tests to fail.
- [ ] **Step 3: Implement.**
  - **Mod use cases:** pass `helpers` through as the interfaces describe.
  - **Engine API:** add the fields. `tasks_api.ts` already spreads the checked quest into `fileTaskUseCase` and passes the checked edit to `editTaskUseCase`, so it needs no change.
  - **Main process check:** `newQuestOf` sets `helpers: v.helpers === undefined ? defaultHelpers().on : helpersOf(v.helpers)`. `questEditOf` adds `helpers` only when it is given.
  - **Project views:** set `helpers: task.helpers.on` in both builders.
  - **App test fixtures:** `test_support.ts` gets `helpers: ['tea-dd']` on both fixtures.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `claude plugin test .`, then `npm test` and `npm run typecheck` in `app/`.

### Task 3: Helper chips in the app

**Files:**
- Create: `app/renderer/features/quests/presentation/widgets/helper_toggles.tsx`
- Modify: `app/renderer/features/guild/domain/helpers.ts`. Replace `ORDER` (line 8) with `HELPER_IDS` from Task 1, and type `Helper.id` as `HelperId`.
- Modify: `app/renderer/features/quests/domain/quest_form.ts`. `QuestForm` gets `helpers: HelperId[]`, `emptyQuestForm` sets `helpers: ['tea-dd']`, and `questOf` passes it on.
- Modify: `app/renderer/features/quests/presentation/widgets/new_quest_sheet.tsx`. Add a `Group` labelled `t.form.helpers`, holding `HelperToggles`, after the Difficulty group.
- Modify: `app/renderer/features/quests/presentation/widgets/quest_detail.tsx`. After the criteria block (line ~236), add `<h3>{t.helpers.label}</h3>` and the chips.
- Modify: `app/renderer/features/quests/presentation/widgets/active_detail.tsx`. Add the same block after `d-chips`.
- Modify: `app/renderer/features/quests/presentation/state_management/quest_edits.ts`. Widen the `edit` parameter `quest: QuestRow` to `quest: Pick<QuestRow, 'id'>`, so the task in progress can be edited.
- Modify: `app/renderer/features/guild/presentation/pages/guild_page.tsx`. Add `<p>{t.guild.where}</p>` under `t.guild.line`, and change the "Read-only" comment to say the page teaches the helpers and where they're turned on.
- Modify: `app/renderer/l10n/en.ts`:
  - `helpers: { label: 'Helpers', use: (name: string) => \`Use ${name} on this quest\` }`
  - `form.helpers: 'Helpers'`
  - `guild.where: 'Turn helpers on for each quest in its panel, or when you add it.'`
- Modify: `app/renderer/core/theme/jade_peaks.css`. Add `.helper-chips` (a wrapping row with a gap) and `.helper-chip` (a pill in the helper's kind colour, dimmed when `aria-pressed="false"`). Follow `.rm .m-class` at line 426 and reuse its `--m` and `--mb` colours for each helper kind.
- Test: `app/renderer/features/quests/presentation/quests_edits.spec.tsx`, `app/renderer/app/pages.spec.tsx`

**Interfaces:**
- Consumes: `QuestRow.helpers`, `ActiveQuest.helpers`, `NewQuest.helpers` and `QuestEdit.helpers` from Task 2, and `HELPER_IDS` from Task 1.
- Produces: `HelperToggles({ on, onChange }: { on: readonly HelperId[]; onChange: (on: HelperId[]) => Promise<unknown> | void })`.
  - It renders `<div class="helper-chips" role="group" aria-label={t.helpers.label}>`.
  - Inside is one `<button type="button" class="helper-chip {kind}" aria-pressed={...} aria-label={t.helpers.use(name)}>` for each entry in `HELPERS`, holding the logo `<img alt="">` and the name.
  - It keeps a local `pending: HelperId[] | null` and shows `pending ?? on`. A click works out the next list from what is shown, in `HELPER_IDS` order, sets `pending`, awaits `onChange` and then clears `pending`. So two quick clicks both count, and a failed save shows the saved `on` again.
  - On the sheet, `onChange` just sets the form.

- [ ] **Step 1: Write the failing tests** in `quests_edits.spec.tsx`.
  - In `describe('New quest')`:
    - `'files with Tea-DD on unless changed'`: type a title, press "Use Commit Chai-n on this quest" and "Use Tea-DD on this quest", then Add. `engine.fileQuest` is called with `expect.objectContaining({ helpers: ['commit-chai-n'] })`.
  - In a new `describe('helper chips')`:
    - `'show what the quest has on'`: a quest row with `helpers: ['tea-dd']` shows the Tea-DD chip with `aria-pressed="true"` and the other three with `"false"`.
    - `'a click saves the quest's helpers'`: press the Commit Chai-n chip, and `engine.editQuest` is called with `(KEY, 'first', { helpers: ['commit-chai-n', 'tea-dd'] })`.
    - `'two quick clicks keep both'`: `editQuest` resolves only after both presses. The second call is `{ helpers: ['commit-chai-n', 'chai-pter', 'tea-dd'] }`.
    - `'a failed save puts the chip back'`: `editQuest` returns `{ ok: false, error: { message: 'Could not save.' } }`. The chip ends at `aria-pressed="false"` and the toast text 'Could not save.' shows.
    - `'the quest in hand has them too'`: with an active quest, its detail panel's chip saves through `engine.editQuest` with the active quest's id.
  - In `pages.spec.tsx`, next to the guild test at line ~317:
    - `'the Guild Hall says where helpers are turned on'`: the text `t.guild.where` is on the page.
- [ ] **Step 2: Run them and confirm they fail.** Run `npm test -- quests_edits pages` in `app/`, and expect the new tests to fail.
- [ ] **Step 3: Implement.** Build the widget and wire it into the sheet and both panels, as the interfaces describe.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `npm test`, `npm run typecheck`, then `node tools/check_layers.mjs` from the repository root.

### Task 4: The turn's instruction and the first message

**Files:**
- Create: `hooks/features/tasks/presentation/constants/tasks_text.ts`
- Modify: `hooks/features/tasks/presentation/state_management/tasks_controller.ts` (`taskSection`, lines 28-37)
- Modify: `hooks/shared/checkpoints/domain/services/checkpoints.ts` (`firstMessage`, line 190)
- Test: `tests/unit/tasks/flow.test.ts`, `tests/unit/shared/checkpoint.test.ts`

**Interfaces:**
- Produces, in `tasks_text.ts`:
  - `TASK_LINE(title: string): string`. The existing sentence, word for word: `The current Queue-tea task is "${title}". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.`
  - `HELPER_NAMES: Record<HelperId, string>`: Commit Chai-n, Mocha Mockup, Chai-pter, Tea-DD.
  - `HELPER_LINES: readonly (readonly [HelperId, string])[]`, in workflow order: mocha-mockup, tea-dd, chai-pter, commit-chai-n. The text is the spec's table, copied verbatim.
  - `ASKED`: `'Rohan is asked in the Queue-tea menu whether the task is done for now.'`, moved from `register.tsx:62`.
  - `REMIND(name: string)`: `` `${name} is on for this task and hasn't run yet. Run it, then call task_looks_done again.` ``
  - `DIDNT_RUN(name: string)`: `` `${name} is on and didn't run.` ``

- [ ] **Step 1: Write the failing tests.**
  - In `flow.test.ts`, next to the compose-section test at line 253:
    - `'the compose section adds a line for each helper that is on, in work order'`: a current task with `on: ['commit-chai-n', 'tea-dd']` gives text `[TASK_LINE(title), tea-dd's line, commit-chai-n's line].join('\n')`.
    - `'with no helpers on, the compose section is the task line alone'`.
    - The existing exact-text test stays unchanged and passes.
  - In `checkpoint.test.ts`, next to line 103:
    - `'firstMessage carries the description and criteria'`: `makeTask({ title: 'New', messages: ['do it'], description: 'Why', criteria: ['One', 'Two'] })` gives `'Task: New\n\nDescription: Why\n\nAcceptance criteria:\n- One\n- Two\n\ndo it'`.
    - The existing test at line 103 still gives `'Task: New\n\ndo it'`.
- [ ] **Step 2: Run them and confirm they fail.** Run `claude plugin test .`.
- [ ] **Step 3: Implement.**
  - `taskSection` builds its text from `TASK_LINE` plus the `HELPER_LINES` entries whose id is in `current.helpers.on`, joined by `'\n'`.
  - `firstMessage` sets `parts` to the title, then `Description: …` when the description isn't null, then the criteria block when there are criteria, then `...task.messages`.
- [ ] **Step 4: Run the tests and confirm they pass.** `claude plugin test .` should show everything passing.

### Task 5: Noting helper runs and the reminder at done

**Files:**
- Create: `hooks/features/tasks/domain/usecases/helpers_run.ts`
- Modify: `hooks/features/tasks/domain/services/task_rules.ts`. Add `helperToRemind`.
- Modify: `hooks/features/tasks/presentation/state_management/tasks_controller.ts` (`taskLooksDone`, line 92; add `noteHelperRun`)
- Modify: `hooks/register.tsx`. The `task_looks_done` hook (lines 56-63) returns the controller's text, and there is a new `Agent` hook.
- Test: `tests/unit/tasks/flow.test.ts`, `tests/view/ui.test.tsx`

**Interfaces:**
- Consumes: `Task.helpers` (Task 1), and `HELPER_NAMES`, `ASKED`, `REMIND` and `DIDNT_RUN` (Task 4).
- Produces:
  - `helperToRemind(task: Task): HelperId | null`, a pure function. It returns the first of `'tea-dd'` then `'commit-chai-n'` that is in `on` and not in `ran`.
  - `noteHelperUseCase(d: Pick<Deps, 'records'>, taskId: string, helper: HelperId)`, which adds `helper` to that task's `ran` once, only while the task is `current`. Also `markRemindedUseCase(d: Pick<Deps, 'records'>, taskId: string)`, which sets `reminded: true`. Both use `d.records.update`, as `setReviewUseCase` does.
  - `noteHelperRun(p: Ports, agent: unknown): Promise<void>`. It does nothing unless `agent` is a string `queue-tea:<id>` with `isHelperId(id)`, `live.ctx` is set and a task is current. The write runs in try/catch, and a failure is logged with `debug`.
  - `taskLooksDone(p: Ports, checked?: unknown): Promise<string>`, which now returns the tool's result text:
    - **Something to remind, and `reminded` is false:** save the mark, then return `REMIND(name)` without setting `isAskingDone`.
    - **The mark fails to save:** log it, then ask Rohan as below.
    - **Something to remind, and already reminded (or the save failed):** cut `checked` to 300 characters, append `' ' + DIDNT_RUN(name)`, ask as today and return `ASKED`.
    - **Nothing to remind:** behave as today and return `ASKED`.
  - In `register.tsx`, add `on('tool.call', { tool: 'Agent' }, async ($, e, next) => { … })`. When `errandState.errand?.isRunning !== true`, it awaits `noteHelperRun(portsOf($), (e as { subagent_type?: unknown }).subagent_type)`, and it always returns `next(e)`.

- [ ] **Step 1: Write the failing tests** in `flow.test.ts`. Reuse `withRecord` (line 33) and `fakePorts`.
  - `'helperToRemind picks Tea-DD, then Commit Chai-n, and never the other two'`. Four cases:
    - `on: ['tea-dd']`, `ran: []` gives `'tea-dd'`
    - `on: ['tea-dd', 'commit-chai-n']`, `ran: ['tea-dd']` gives `'commit-chai-n'`
    - `on: ['mocha-mockup', 'chai-pter']` gives `null`
    - `on: ['tea-dd']`, `ran: ['tea-dd']` gives `null`
  - `'task_looks_done reminds once, then asks Rohan with the didn't-run line'`: a current task with `on: ['tea-dd']`.
    - The first call returns `REMIND('Tea-DD')`, `view.isAskingDone` isn't true, and on disk `reminded` is true.
    - The second call, `taskLooksDone(ports, 'ran it')`, returns `ASKED`, `view.isAskingDone` is true, and `view.checked` is `"ran it Tea-DD is on and didn't run."`.
  - `'a long checked line still ends with the didn't-run line'`: 400 characters of `checked` give a `view.checked` that ends with `DIDNT_RUN('Tea-DD')`.
  - `'a failed reminder save asks Rohan instead'`: make the record write fail (as the existing failed-write tests in this file do). One call returns `ASKED`, `isAskingDone` is true, and one log line is written.
  - `'noteHelperRun notes a helper once'`: two calls with `'queue-tea:tea-dd'` give `ran: ['tea-dd']`.
  - `'other agents and odd input are ignored'`: `'general-purpose'`, `'queue-tea:nobody'`, `undefined` and `42` leave `ran` empty and write nothing.
- [ ] **Step 2: Write the failing engine-level tests** in `ui.test.tsx`.
  - `'a Tea-DD run through the Agent tool counts at done'`: start a session with a current task where `helpers.on` is `['tea-dd']`. Call `$.tool.call({ tool: 'Agent', subagent_type: 'queue-tea:tea-dd' } as never)`. Then `task_looks_done`'s result contains `'Rohan is asked'`.
  - `'a helper run during /brew does not count'`: reuse the errand setup at `tests/view/ui.test.tsx:1090-1115`. During the errand turn, call the Agent tool as above. Once the errand is over, `task_looks_done`'s result contains `"hasn't run yet"`.
- [ ] **Step 3: Run them and confirm they fail.** Run `claude plugin test .`.
- [ ] **Step 4: Implement.** Follow the interfaces above, and keep `saveReview`'s try/catch shape.
- [ ] **Step 5: Run the tests and confirm they pass.** Run `claude plugin test .`, `npx -y -p typescript@5.9 tsc -p .` and `node tools/check_layers.mjs`.

### Task 6: Docs, the real session check and every check

**Files:**
- Modify: `docs/workspace-app-design.md`:
  - **§4.13:** drop "(read-only)" from the heading, and add one line saying helpers are turned on per quest.
  - **§4.4:** add a "Helpers" row of four chips to the queued and in-progress detail panels.
  - **§4.5:** add a "Helpers" line to the new-task sheet, with Tea-DD pressed.
- Modify: `docs/workspace-app.md`. Wherever it describes the task record's fields or the quest detail, add `helpers` in one sentence.

- [ ] **Step 1: Update the docs.** Hand the two docs to Chai-pter (`queue-tea:chai-pter`) with the spec, or edit them directly. The sketches use plain words, with no code names.
- [ ] **Step 2: Run the real session check.** Follow the memory note "Real session probe": run this worktree's mod in a real Claude Code session under a pty, with a current task where Tea-DD is on, and ask Claude to run Tea-DD on a trivial file. It passes when the record's task shows `helpers.ran` containing `tea-dd`. If it doesn't, the `Agent` hook's tool name or `subagent_type` field is wrong: fix that before anything else.
- [ ] **Step 3: Run every check.**
  - **The mod, from the repository root:** `claude plugin test .`, `npx -y -p typescript@5.9 tsc -p .`, `claude plugin validate .`, `node tools/check_layers.mjs` and `node --test 'tools/*.test.mjs'`.
  - **The app, from inside `app/`:** `npm test`, `npm run typecheck`, and `caffeinate -d npm run e2e` (the Mac must stay awake).

  All must pass.
- [ ] **Step 4: Update the knowledge graph.** Run `graphify update .`.
- [ ] **Step 5: Prepare the commit.** Have Commit Chai-n prepare the commit for Rohan, with subject `added helpers on each quest`. Don't run `git commit` yourself.
