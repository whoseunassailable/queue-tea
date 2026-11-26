# The recipe panel

Q07 of the workspace evolution roadmap asks for a recipe that says what Queue-tea is doing now, and keeps the full plan for when Rohan asks. This note records what the pane showed before, the design chosen, and how each part works. The designs are in the Designs tab as **Recipe panel 1** (`docs/designs/recipe-panel-1/`). The code is `recipeOf` in `app/main/features/tasks/domain/recipe.ts` and `RecipePanel` in `app/renderer/features/quests/presentation/widgets/recipe_panel.tsx`.

## What the pane showed before (Q07.1)

A started quest's detail pane drew `QuestNotes`: the task activity line, then the checkpoint card open in full, then the messages filed with the quest. The card listed all eight checkpoint sections (Goal, Acceptance criteria, Changes made, Decisions, Approaches rejected, Remaining, Blockers, Next action) as numbered blocks, or a handoff note's five. Nothing said which stage the quest was at, and a blocker sat sixth in the list, below the decisions.

Two kinds of information were mixed together:

- **Progress**: the stage, whether Claude is working, what is next, and anything that needs Rohan.
- **Diagnostics**: the decisions, the approaches dropped, the files read and every check Claude ran.

The recipe keeps the first in view and puts the second one press away.

## Options

1. **Work the recipe out from the record (chosen).** The stages come from what Queue-tea already saw: files read, edits, checks, a looks-done. Steps and notes come from the checkpoint or handoff note. Nothing new is stored, so every record, old ones included, has a recipe as soon as it starts. The cost is that a stage is inferred, so a quest that edits before it reads shows Build without Understand.
2. **Have Claude keep a stage list.** A new tool and a stored field. Stages would be exact, but Claude would have to keep them up to date, and old records would have none.
3. **Fold the old card.** Close the checkpoint card by default. That is the smallest change, but it still shows no stage or progress, and a blocker would hide in the fold.

## What the recipe shows

```
┌ RECIPE · STEP 3 OF 5 ───────────────── ● Brewing ┐
│ ▮▮▮▮▮▮▮▮▮▮▯▯▯▯▯▯▯▯▯▯                             │
│ Blocked  Needs the staging key                   │  only when something needs Rohan
│ ( Compact ) ( Detailed ) ( Technical )           │
│ ✓ Set out on the branch                          │
│ ✓ Understand the problem                         │
│ ▶ Build the change                               │
│ ○ Verify the change                              │
│ ○ Review & complete                              │
│ Verification: Deep · Unit and integration tests  │
│   · 2 checks passed                              │
└──────────────────────────────────────────────────┘
```

It sits in the pane under the quest's title, above its facts, on the quest in hand and on any quest that has been started. A quest never started, with no note to carry on from, has no recipe.

### The stages (Q07.2, Q07.3, Q07.5)

Five stages, or six when Mocha Mockup is on the quest:

| Stage | Reached when the record shows |
| --- | --- |
| **Set out on the branch** | the quest has started |
| **Understand the problem** | files read, understanding messages, or a read step |
| **Design the solution** | Mocha Mockup has run (only with Mocha on the quest) |
| **Build the change** | files changed, an edit or write step, or changes in the checkpoint |
| **Verify the change** | a timed check, a test step, or a check in the checkpoint |
| **Review & complete** | Claude said the quest looks done |

The stage shown is the furthest one reached, with one exception while the quest is in hand: the latest step can pull it back. An edit after the checks shows **Build the change** again, since Claude is fixing what a check found; a check shows **Verify the change**. Reads and other commands leave it where it was. The step shown counts in the header ("Step 3 of 5") and the bar, where the stage in hand counts as half. A finished quest shows every stage ticked.

The pane reads the record again whenever it changes, so the stage moves as the work does.

### What it says the quest is doing

| Shown | When |
| --- | --- |
| **Brewing** | Claude Code is running a turn on it |
| **Waiting for your next message** | a session is open between turns |
| **Waiting on you** | Claude said it looks done, or the session waits on Rohan |
| **With Codex** | Codex has it |
| **Paused · no Claude Code session is open** | it is in hand with no session |
| **Paused · back in the queue** | it was put back |
| **Complete** | it is done |

### What needs Rohan (Q07.6)

Above the depth chips, at every depth: Claude's looks-done ("Claude says this quest looks done. Check it, then answer on its card."), each blocker from the checkpoint, and each line under a handoff heading that asks Rohan something (Blockers, Questions, Needs you, Decide). None of these can be reached only through Technical.

### Depths (Q07.4)

- **Compact**, the default: the header, what needs Rohan, the stages and the verification line.
- **Detailed** adds the goal, the steps (done from Changes made, the one in hand from Next action, the rest from Remaining), **Done when** from the acceptance criteria, and which note they came from.
- **Technical** adds the decisions, the approaches rejected, the files changed, a handoff note's sections under their own headings (or the note whole when it has none), and each check with its result and time.

The stages stay at every depth, so opening the detail never loses where the quest is.

### Verification (Q07.8)

One line: the Tea-DD profile and its scope, with a tally of the checks seen ("Verification: Deep · Unit and integration tests · 2 checks passed"). With no profile yet it says "Verification: Tea-DD picks a profile when it tests". Each check, at its latest run, is listed in Technical. The profile itself is still picked in the pane's **Test profile** control.

### The depth Rohan picks (Q07.7)

A press on a chip shows that depth at once and saves it as `recipeDetail` in the app's settings, so it holds across restarts and for every quest. While it saves the line says "Keeping this choice…". If the save fails, the depth still shows, with "Shown now, but not kept for next time." and **Try again**. A settings file from before the recipe reads as compact, and a value other than `compact`, `detailed` or `technical` is refused.

## Keys and screen readers

The chips are buttons in a group named "How much of the recipe to show", each with `aria-pressed`, so Tab reaches them and Space or Return presses one. The bar is a `progressbar` named "Stage 3 of 5". The stage in hand carries `aria-current="step"`, and each stage and step has its mark (Done, Now, Next) as text for screen readers. On a narrow window the header and lines wrap.

## Tea-DD profile

Deep: the change adds a shared engine API type and a stored settings field that old files must read, and it reaches the engine and the window. So it runs `node tools/check_layers.mjs`, `node --test 'tools/*.test.mjs'`, `npm run typecheck` and `npm test`.

## Done and left

All eight child quests are in this change. One gap is left in Q07.6: a commit Claude proposed that waits in Branches is not in the recipe's "needs you" list yet, because telling whether it is still current needs the branch's head, which the quest's facts don't read.

## Open questions

- **Should Understand be skipped when a quest edits before it reads?** The recipe shows it ticked once Build is reached. Suggested answer: keep it, since a stage list that drops lines would make "Step 3 of 5" jump.
- **Should the depth be kept for each quest?** Suggested answer: no. One depth for all quests is what "remember the preferred level of detail" asks, and a per-quest choice would be one more thing to set.
