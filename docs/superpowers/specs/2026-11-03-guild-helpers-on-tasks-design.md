# Guild helpers on tasks

Date: 2026-11-03. Task: "Fix guild hall" (t-741bc6cd). Status: design approved in chat, spec waiting for review.

## Why

The Guild Hall shows Queue-tea's four helpers (Commit Chai-n, Mocha Mockup, Chai-pter, Tea-DD), but nothing in a project uses them. Rohan wants to choose, for each task, which helpers Claude works with, so the code comes out the way he wants it written: tested, and following the project's architecture. Tea-DD should be on for most tasks but can be turned off. The others are optional. Commit Chai-n prepares the commits once the acceptance criteria are met and the tests pass.

## Decisions

- **The choice belongs to each task.** It is made on the new-quest sheet and can be changed later on any quest, queued or in progress. There is no default per project yet.
- **A helper that is on is an instruction to Claude, with one reminder.** Nothing blocks a task for good. When Claude says a task looks done and Tea-DD or Commit Chai-n is on but hasn't run, Claude is reminded once. On the second try Rohan is asked as usual and told which helper didn't run.
- **No "hand it to a helper now" button.** The toggles replace it.
- **Board rows and the active card stay as they are.** Tea-DD is on for almost every task, so a mark on every row would be noise.

## What's saved

Each task in the record gets one new field, `helpers`:

| Part       | What it holds                                                                              | Default      |
| ---------- | ------------------------------------------------------------------------------------------ | ------------ |
| `on`       | The helpers this task uses, by id: `commit-chai-n`, `mocha-mockup`, `chai-pter`, `tea-dd` | `['tea-dd']` |
| `ran`      | The helpers Claude has called during this task                                             | `[]`         |
| `reminded` | Whether Claude has had its one reminder at "done"                                          | `false`      |

- The four ids live in one list in the mod's shared domain. The mod, the app's main process check and the Guild Hall page all read that list. The Guild Hall's own copy (`ORDER` in `app/renderer/features/guild/domain/helpers.ts`) is removed in favour of it.
- A task read from a record written before this change gets the default when the record is parsed (`withDefaults` in `record_source.ts`). So does every new task, whether it is filed from the app or from `/steep` (`queue_rules.ts`).
- A finished task keeps what it had, the same way it keeps its description.

## Where Rohan chooses

Three places show the four helpers as small toggle chips, each with its logo and name. A chip saves on click, the way the priority control does:

1. **The new-quest sheet.** Tea-DD starts pressed. The choice is sent with the new quest.
2. **The detail panel of a queued quest.**
3. **The detail panel of the task in progress.** A change here reaches Claude on its next reply.

Each chip is a toggle button with `aria-pressed` and an accessible name such as "Use Tea-DD on this quest". If saving fails, the panel shows the failure the same way a failed description edit does, and the chip goes back to what is saved.

The Guild Hall page gets one line telling Rohan that helpers are turned on for each quest in its panel, and on the new-quest sheet.

## How the choice reaches the record

It goes the same way the description and criteria already go:

- **The engine API.** `NewQuest` gets `helpers: HelperId[]`. `QuestEdit` gets an optional `helpers`. Only `on` is ever sent: `ran` and `reminded` are the mod's to write.
- **The main process check.** `task_input.ts` checks `helpers` the way it checks `criteria`. It must be an array whose every entry is one of the four ids, and repeated ids are dropped. Anything else is refused with the existing "bad value" message.
- **The use cases.** `fileTaskUseCase` and `editTaskUseCase` pass `helpers` on to the task's `on`.
- **The views.** `QuestRow` and `ActiveQuest` get `helpers: HelperId[]` (the `on` list) so the panels can show the chips.

## How Claude uses them (the mod)

**The turn's instruction.** `taskSection` in `tasks_controller.ts` is rebuilt on every turn. It gains one line for each helper that is on:

| Helper        | Line added to the instruction                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mocha Mockup  | Before writing code, work out the design with Mocha Mockup (`queue-tea:mocha-mockup`).                                                                         |
| Tea-DD        | Have Tea-DD (`queue-tea:tea-dd`) write and run the tests for each feature or fix.                                                                              |
| Chai-pter     | When behaviour changes, have Chai-pter (`queue-tea:chai-pter`) update the docs.                                                                                |
| Commit Chai-n | Once the acceptance criteria are met and the tests pass, have Commit Chai-n (`queue-tea:commit-chai-n`) prepare the commits, before calling task_looks_done. |

These lines, and the existing instruction text in that file, move into the mod's text constants, as the house rules ask when a file is next changed.

**The first message.** `firstMessage` in `checkpoints.ts` adds the task's description and acceptance criteria after the title, when they are set:

```
Task: Fix guild hall

Description: The guild hall are the internal customized skills…

Acceptance criteria:
- …
```

## The reminder at "done"

**Noting a helper run.** A new hook on `tool.call` for the `Agent` tool reads the call's `subagent_type`. When that is `queue-tea:<id>` for one of the four helpers, and a task is in progress, and the turn is not a `/brew` or `/tea` errand, it adds the id to the task's `ran` under the record's lock, then lets the call go ahead. If the save fails, the error is logged with its stack and the helper call still runs. The worst that can happen is one extra reminder.

**At task_looks_done.** A pure rule, `helperToRemind(task)`, returns the first of Tea-DD and Commit Chai-n (in that order) that is in `on` and not in `ran`, or nothing.

- **Something to remind and `reminded` is false:** set `reminded` to true and return, as the tool's result: "Tea-DD is on for this task and hasn't run yet. Run it, then call task_looks_done again." Rohan is not asked.
- **Something to remind and `reminded` is already true:** ask Rohan as usual, with "Tea-DD is on and didn't run." added to the line he sees beside the question (the `checked` text).
- **Nothing to remind:** behave exactly as today.

Mocha Mockup and Chai-pter never trigger the reminder, because a small task may need neither a design nor docs.

The one-time reminder means that if the `Agent` hook ever fails to notice helper calls (for example because the tool is renamed), Rohan sees a warning line instead of a task that can never be marked done.

## Errors

- Each new record write (the toggle, noting a run, setting `reminded`) goes through the existing record update, inside a try/catch. The error is logged with its stack, and a plain message goes to the screen or the log.
- The main process check refuses bad input before anything is written.
- The app never shows an exception's text.

## Tests

| What                                                    | Kind               | Where                            |
| ------------------------------------------------------- | ------------------ | -------------------------------- |
| Checking `helpers` in new and edited quests             | Unit (Vitest)      | `app/main/features/tasks/api/tasks_api.spec.ts` |
| Old records and new tasks get Tea-DD on                 | Unit               | `tests/` (mod)                   |
| Editing `helpers` on queued, current and finished tasks | Unit               | `tests/` (mod)                   |
| The instruction lines for each helper that is on        | Unit               | `tests/` (mod)                   |
| First message with and without description and criteria | Unit              | `tests/` (mod)                   |
| `helperToRemind` and the remind-once rule               | Unit               | `tests/` (mod)                   |
| Noting a run, ignoring other agents and errands         | Unit (test kit)    | `tests/` (mod)                   |
| Chips on the new-quest sheet                            | Component (Vitest) | `app/renderer/features/quests/presentation/quests_edits.spec.tsx` |
| Chips in both panels, saving, failure                   | Component (Vitest) | `app/renderer/features/quests/presentation/quests_edits.spec.tsx` |
| The Guild Hall's new line                               | Component (Vitest) | `app/renderer/app/pages.spec.tsx` |
| A real session notices a helper call                    | Real session probe | by hand, under a pty             |

Then everything runs: `claude plugin test .`, `npx -y -p typescript@5.9 tsc -p .`, `claude plugin validate .`, `node tools/check_layers.mjs` and `node --test 'tools/*.test.mjs'` for the mod; `npm test`, `npm run typecheck` and `npm run e2e` in `app/` for the app.

## Acceptance criteria

- The new-quest sheet and the detail panels of queued quests and of the task in progress show four helper toggles. Tea-DD is on by default, and the choice is saved on the task and still there after a reload.
- The main process refuses a helper id it doesn't know.
- Tasks from older records, and tasks filed with `/steep`, have Tea-DD on.
- Claude's instruction on every turn names each helper that is on and when to use it. A change on the task in progress reaches Claude on its next reply.
- Claude's first message for a task includes its description and acceptance criteria.
- `task_looks_done` reminds Claude once when Tea-DD or Commit Chai-n is on and hasn't run. The second call asks Rohan, with a line naming the helper.
- Helper calls during `/brew` or `/tea` don't count as runs for the task.
- The Guild Hall page says where helpers are turned on.
- Every check listed under Tests passes for the mod and the app.

## Out of scope

- A default set of helpers for each project (approach B). Add it if choosing per task gets tedious.
- Reminders for Mocha Mockup or Chai-pter.
- A "hand it to a helper now" button, and helper marks on board rows or the active card.
- Helper toggles in the terminal's tea-cup menu.
