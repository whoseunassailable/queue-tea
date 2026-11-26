# Stabilization audit (Q04)

Quest `t-5cd3289d`, from the note "Queue-Tea — Workspace Evolution & Development Intelligence". Checked on 2026-11-25 against `main` at `925a3cd` (v2.15.0).

This covers Q04.1 to Q04.5 and sets the baseline for Q04.8. Nothing here is fixed yet. Each fix goes through its own quest (Q04.6), and filing or reopening those quests is Rohan's job, through `/steep` or the menu.

**How it was checked.** The realm's record (`~/.queue-tea/projects/queue-tea-a60ae6.json`, 60 quests) was compared with git. For each quest: whether its branch has commits that aren't on `main`, whether its worktree still exists, and whether any uncommitted file in that worktree differs from `main`. Changes to `graphify-out/` were counted apart from the rest.

## Q04.1 What's open

The record has 33 quests done, 19 queued, 4 current and 4 removed.

### Current

| ID | Quest | What the code says |
| --- | --- | --- |
| `t-c53df8b7` | BrewQuest: drag onto a note to start | Merged and pushed in `d7a3d28`, review recorded on 2026-11-18. Only Rohan's confirmation is left. |
| `t-f16bd217` | Fix merge check dependency setup | The fix is on `main` in `6739072` and written up in `docs/merge-check-dependencies.md`. The quest has no review, so its four criteria haven't been checked against that commit. |
| `t-6a009062` | Q03 — Tea-DD adaptive testing system | On `main` in `2f42cc9` and `0c0d4fe`. The review passed on `0c0d4fe`. Left: Rohan confirms it's done, and decides about the stray remote tag `v1.3.0`. |
| `t-5cd3289d` | Q04 — this audit | |

### Queued

| ID | Quest | Notes |
| --- | --- | --- |
| `t-bfdab635` | Task activity: show the current step, stop saving every command | Priority high. See Q04.4: this one is urgent. |
| `t-086339d3` | Open Terminal button (for running task) | Probably already covered. See Q04.3. |
| `t-f1c3d894` | Multiple parents | Not built: a quest still has a single parent. |
| `t-5e764412` | Realm calendar and due dates | Calendar group. None of it is built, and its parent quest `t-fc38cde7` was removed. |
| `t-cfa806e9` | Meetings, agendas and follow-up notes | Calendar group |
| `t-b4038d01` | Calendar import and export with ICS | Calendar group |
| `t-f42cae61` | Google Calendar sync | Calendar group |
| `t-d4cec95d` | Reminders, recurrence and a today agenda | Calendar group |
| `t-094bf430` | BrewQuest: animation states | Not built. Q09.2 is meant to reuse it. |
| `t-17b5786f` | Q02 follow-ups and note_graph e2e budget fix | Five items, listed only in its first message. See Q04.3. |
| `t-c81e3340` | Queue-Tea — Workspace Evolution (the saga) | Parent of Q01 to Q12 |
| `t-ec539f75` … `t-dcc899be` | Q05 to Q12 | Not started. Their children get written up when each one starts. |

### Removed

| ID | Quest | Where its scope went |
| --- | --- | --- |
| `t-71d363e3` | Replace the panel with an animated tea-cup menu | No description. Later menu work replaced it. |
| `t-cc9b4a1c` | Notes | Notes section `t-c3f28665` and the Notes quests. Its "calendar on the side" criterion lives on in `t-5e764412`. |
| `t-33f03870` | Bug-bounty helper | Dropped, and nothing carries it. Its criteria are still on the record if it comes back. |
| `t-fc38cde7` | Notes Realm — Knowledge & Quest Workspace | The planning parent. Removing it left the calendar group without a parent. |

## Q04.2 Where the record and the code disagree

### Marked done, but the code was never committed

Three finished quests left a whole feature uncommitted in their worktrees. Their branches count as merged because they have no commits that aren't on `main`, so nothing in the app points at them. The work exists only in those folders. **Remove folder** on the Branches page refuses a folder with changes, so it can't delete them by accident.

| ID | Quest | Worktree | What's there |
| --- | --- | --- | --- |
| `t-d36aebb3` | Settings option | `settings-option` | A **Rules for Claude** panel on each realm's Settings page that shows, adds and removes the rules in the realm's `CLAUDE.md`. 13 files changed (+169 −21), 13 new files (1,952 lines), an e2e test. |
| `t-18e2940d` | Feature workflow | `feature-workflow` | A **How to** page in the sidebar between Library and Settings, with walk-throughs, and a **New in Queue-tea** dialog after an update. 28 files changed (+435 −34), 8 new files (757 lines), an e2e test. |
| `t-7eca5b2a` | BrewQuest: read the note with Claude and draft smarter quests | `brewquest-read-note-claude` | Claude reads the note and drafts quests, with a details view. 16 files changed (+308 −32, one of them the mod's task filing), 7 new files (445 lines), an e2e test. |

### Marked done, with a commit left off `main`

| Branch | Commit | State |
| --- | --- | --- |
| `task/new-quests-add-below` | `fadd0f4` added child-task button inside quest cards | Built again on `main`: quest rows have the add-child button. The branch can go. |
| `task/version-number` | `e06a016` fs | Built again on `main` in `06936a4` (update runner, push-triggered update). Only `docs/version-number-validation.md` and a few doc edits never reached `main`. Rohan decides whether they're worth keeping before the branch goes. |

### Still current, already on `main`

`t-c53df8b7`, `t-f16bd217` and `t-6a009062`, listed under Q04.1.

### The task log on `main` stops at 2026-11-06

`docs/task_log.md` on `main` has no rows after 2026-11-06. The 22 quests finished since then each left their row uncommitted in their own worktree. The row is written into the quest's folder when the quest finishes. Finishing comes after the merge, so nothing ever commits it. The spec says "A dirty task log is work to commit too", but no step does.

### Records close to the size that breaks them

| Record | Size | Largest quest's saved activity |
| --- | --- | --- |
| Queue-tea | 3.50 MB | Q02: 200 steps, 0.58 MB |
| Gait-feedback | 3.77 MB | 200 steps, 0.56 MB |

A record over about 4 MB stops loading. That happened to Gait-feedback on 2026-11-12. Every long quest adds about 0.4 to 0.6 MB, even with the 200-step cap.

### graphify's cache is tracked by git

290 files under `graphify-out/cache/` are tracked, and every session adds or changes some of them. 21 of the 24 finished quests' worktrees are "changed" only because of that cache and the unsaved task-log row, so **Remove folder** refuses all of them. The new free-space feature (`925a3cd`) can clear their build folders but can't remove them.

## Q04.3 Overlaps and duplicates

Nothing below should be deleted. Each line keeps the original ID, so its scope can be traced.

| Quest | Overlaps with | Proposal |
| --- | --- | --- |
| `t-086339d3` Open Terminal button | **Open in Claude Code** on the running quest's card (since `fed7c12`, 2026-11-02, the day before the quest was filed), which brings that quest's session forward | Rohan checks it does what was meant, then closes it as covered |
| `t-f1c3d894` Multiple parents | Q11's quest hierarchy (`t-6f7bd0e2`) | Make it a child of Q11 and keep its own criteria |
| `t-094bf430` BrewQuest: animation states | Q09.2 Character states | Make it a child of Q09 (`t-580fbf0b`) |
| `t-c53df8b7` BrewQuest: drag onto a note | Q09.3 Interactive companion | Finish it now. Q09.3 starts from it. |
| `t-7eca5b2a` BrewQuest: read the note with Claude | Q09.4 to Q09.10 | Recover its code first (Q04.5), then Q09 builds on it |
| `t-17b5786f` Q02 follow-ups | Q02 (done) and Q08.6 | Split it: the note_graph e2e budget, Q02.4 with Q02.8, Q02.7 and Q02.6 stay together. Q02.9 joins Q08 (`t-b40c9a00`) as Q08.6. |
| Calendar group (5 quests) | Q11 planning, for quest due dates only | Give them a parent again, a Notes calendar saga, so they stop floating. Keep due dates in `t-5e764412`, and Q11 reuses it. |
| `t-cc9b4a1c` Notes (removed) | Notes section and the calendar group | Nothing to do. Its scope is carried, as listed under Removed. |

## Q04.4 What blocks what

Stabilization should follow this order. Each item is a blocker for what comes after it.

1. **Record size, `t-bfdab635`.** It blocks every quest in both realms. The Queue-tea record has room for one or two more long quests before it stops loading. Raise it to urgent and do it first.
2. **Recover the three uncommitted features.** Q05, Q06 and Q07 rework the same screens (Settings, the sidebar, Notes), and `main` has already changed 12 of 13, 21 of 28 and 12 of 16 of the files they touch. Every week makes the port harder, and their worktrees can't be freed until they're done. The BrewQuest one also blocks Q09.
3. **Task-log rows reach `main`.** Until they do, Q04.7's documentation and Q04.8's release evidence rest on a log that's missing three weeks.
4. **Stop tracking graphify's cache.** This lets **Remove folder** work for the 21 worktrees that hold no real changes. Do it when few branches are open: a branch that changed a cache file will conflict with the deletion when it merges.
5. **Close what's already on `main`:** `t-c53df8b7`, `t-f16bd217` once its criteria are checked, and `t-6a009062`. Q03's test profiles are already what every later quest runs.
6. **Split `t-17b5786f`.** Its Q02.9 item blocks Q08.6.

## Q04.5 The unfinished features: what's done and what's left

| Feature | Done | Left in the screens, engine or wiring | Checks it still needs |
| --- | --- | --- | --- |
| Rules for Claude panel (`t-d36aebb3`) | Reading, adding and removing rules in a realm's `CLAUDE.md`, the panel, its tests and an e2e test | Port onto `main`: the Settings page, engine API, preload, main, messages and strings have all changed since 2026-11-06. The checkpoint's remaining steps were never done: read Tea-DD's report and run e2e. | Deep, because it adds an engine API and writes files in a realm, plus the rules e2e test |
| How to page and New in Queue-tea (`t-18e2940d`) | The page, its walk-throughs, the dialog after an update, the route and sidebar entry, tests and an e2e test | Port onto `main`: routes, the sidebar, the app frame, settings and workspace state have all changed since 2026-11-05. Its walk-throughs stop at the 1.3.0 era and the app is now 2.15, so the list and the "new since 1.3.0" trigger need a fresh look. Its checks passed in that session but were never recorded. | Deep, because it adds a route, an engine API and a stored setting, plus the how-to e2e test |
| BrewQuest drafting with Claude (`t-7eca5b2a`) | Claude drafting from the note, the rules for proposals, the details view, a change to the mod's filing, tests and an e2e test | Port onto `main`: BrewQuest's widget changed under it with the drag quest. There's no checkpoint or review, so test it against its criterion: goals, tasks and dependencies found, parents spotted, difficulty, priority and effort proposed, doubts flagged, nothing filed before approval. | Deep, because it reaches Notes and the mod's task filing and runs a process, plus the BrewQuest e2e test |

## Q04.8 The baseline

Stable means:

- `main` passes Deep (`node --test 'tools/*.test.mjs'`, `npm test` in `app/`, and every row above it) and Release (`npm run test:codex`, then `caffeinate -i npm run e2e`)
- every quest marked done has its code on `main`, and every current quest's work is in its branch
- no realm record is over 2 MB
- the task log on `main` lists every finished quest

The starting point, before any of the fixes above: Tea-DD's Deep run on `925a3cd` on 2026-11-25, recorded below. E2E isn't in it: the full run is long and needs the Mac awake, and Q04.8 runs it at the end.

Run on 2026-11-25 at 13:31, on Node 23.3.0 and TypeScript 5.9.3. Two separate runs gave the same counts.

| Check | Where | Result | Time |
| --- | --- | --- | --- |
| `npx -y -p typescript@5.9 tsc -p .` | root | Passed, no errors | 2 s |
| `node tools/check_layers.mjs` | root | Passed | under 1 s |
| `claude plugin test .` | root | 517 passed, none failed or skipped, in 34 files | 10 s |
| `claude plugin validate .` | root | Passed with 1 warning: the root `CLAUDE.md` isn't loaded as plugin context. That's expected, because it's the repository's rules, not the plugin's. | 2 s |
| `node --test 'tools/*.test.mjs'` | root | 42 passed, none failed or skipped, in 3 files | 5 s |
| `npm run typecheck` | `app/` | Passed, no errors | 4 s |
| `npm test` | `app/` | 2,306 passed and 32 skipped, none failed. Of the 113 files, 110 passed and 3 were skipped. | 42 s |

**Not run by default.** The 32 skipped tests are the git integration tests: merges and branches in `branch_integration.spec.ts` (22), the app update in `tools/refresh_app.spec.ts` (9), and `tools/build_context.spec.ts` (1). They run only with `QUEUE_TEA_GIT_TESTS=1`, and no npm script sets it, so neither Deep nor Critical ever reaches them. They're the tests for the areas Critical exists to protect. Before Q04.8 counts as stable, run `QUEUE_TEA_GIT_TESTS=1 npm test` in `app/`, and then either add them to the Critical row in `CLAUDE.md` or give them a script of their own.
