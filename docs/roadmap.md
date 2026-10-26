# Roadmap: the outside review, checked against the code

Done 2026-10-26, at commit 341ea59 (added new grok-bots). An outside review proposed six stages: reliability, smarter filing, task and feature management, context and recovery, effort, polish. This page sorts its ideas into what Queue-tea already does, what this pass fixes, and what comes later. 276 tests passed before the pass.

When an item is built, tick it here, so a fresh conversation can carry on from this file.

## Already built

| The review asked for | Where it is |
| --- | --- |
| Connect the engine's features to the menu | All five items in [parity-audit.md](parity-audit.md) are done |
| Say why a task is suggested | The dim line under ★ (`rankBacklog`, `hooks/plan.ts`) |
| Show what blocks a task and what it unblocks | Blocked…, the Blocked section, "unblocks …" in the ★ line |
| Priority apart from readiness | A blocked task is never suggested and has no Start |
| Time-budget planning | Time I have (`t`) |
| Estimates from past work | `typicalMinutes`: the middle value of this project's finished tasks, once there are three |
| Feature progress, moving tasks between features | "1/3 done ▰▰▱▱▱", Part of… (`hooks/family.ts`) |
| Short, collision-safe branch names | `slugBranch` (`hooks/git.ts`) |
| Branch drift | `readDrift`, shown under the current task |
| Structured checkpoints | Goal, acceptance criteria, changes, decisions, approaches rejected, what remains, blockers, next action (`hooks/checkpoint.ts`) |
| Tests run apart from tests recommended | "A check counts as passed only when Queue-tea saw it pass" (`firstMessage`) |
| Compare the checkpoint with the repository on resume | `checkLines`, in the first message |
| Keep the task when the handoff fails | Back to queue goes ahead and says the checkpoint wasn't saved |
| A commit that slipped past the guard | The commit warning after a turn |
| Helpers for git, design, docs and tests | `agents/` |
| Help for the commands and keys | The menu's Help view |

## This pass

- [x] 1. Start claims the task in the record before it touches git, so two sessions can't both start one.
- [x] 2. A fresh conversation that fails to open offers Continue, instead of leaving the task with no way back.
- [x] 3. An unreadable record says why, and can go back to the last copy that read.
- [x] 4. Two sessions writing the record at once don't undo each other.

## Next: smarter filing

- [ ] Edit the title in the band before Save. Today it is only shown.
- [ ] Rename a queued task.
- [ ] At filing, say when a waiting task looks the same, and offer to add the message to it.
- [ ] Add a message to a queued task.
- [ ] When a feature's last task is done, offer to finish the feature.

## Later

- [ ] Expected against actual in History: difficulty and estimated time beside what it took.
- [ ] Mark tasks that have waited untouched for days.
- [ ] A command that says the current task, its branch and ★ in one reply, and a way to search tasks.
- [ ] A still cup for those who want no animation.
- [ ] One shape for what the helpers are handed and what they report back.
- [ ] The weekly board, as its own project ([spec.md](spec.md#what-the-board-will-need)).

## Not planned

- Tasks nested deeper than one level. The review agrees: the menu gets hard to move around, and the record more complex.
- Raising a task's priority by its age alone. The queue order is priority, then oldest first; a task already takes the priority of the tasks waiting for it.
