# Plan: the board, recoverable tasks and checkpoints

Round 2 of Queue-tea, from ChatGPT's review (2026-10-20). Three changes, built in this order. Each step keeps the 143 tests passing and adds its own. Rohan commits; Claude never does.

When a step is built, tick it here, so a fresh conversation can carry on from this file. [spec.md](spec.md) is updated last, to describe what was built.

## 1. The board: Backlog, In progress, Blocked, Done

The panel's sections, top to bottom: **In progress**, **Backlog** (was Up next), **Blocked**, **Done this week**, then **Other projects**. In progress stays first so its buttons stay at the top.

- **Blocked.** A queued task is blocked while it waits for another task that is not done yet (`blockedBy`, task ids), or while it has a reason Rohan typed (`blockedReason`). A blocker that is done or removed stops blocking. A blocked task is never suggested and has no Start. Making a wait that would loop (A waits for B, B waits for A) is refused.
- **Blocked…** (key `k`) on an open row, or on the current task: a small view lists the tasks it can wait for, and has a reason field. On the current task it also puts the task back with a checkpoint, the way Back to queue does. **Unblock** (`u`) clears both.
- **Play next** (`f`) on an open row: that task is suggested before every other, whatever its priority. One at a time; starting it clears it. Pressing it again takes it off.
- **The suggestion (★)** among the tasks that aren't blocked: Play next first; then, when a time is set, the tasks that fit it; then by priority, where a task takes the highest priority of the tasks waiting for it; then the one that unblocks more tasks; then the oldest. With a time set and nothing fitting, the shortest comes first. A dim line under ★ says why ("urgent · unblocks Fix the login · fits 30m").
- **Estimate.** The time a task needs, from its expected difficulty: the middle value of this project's finished tasks of that difficulty, once there are three; before that, light 30m, medium 1h 30m, hard 4h. A task put back counts its time so far off (never under 10m). Shown as "~30m"; 30m or less is marked "short".
- **Time I have** (`t`): any, 30m, 1h, 2h. For this session only.
- **Other projects:** each other project with waiting tasks, one dim line: "example-app · 3 waiting · ★ Fix the login". Read from the other record files when the panel loads.

- [ ] Types, record defaults for old records (`blockedBy`, `blockedReason`, `baseBranch`, `checkpoint`, `playNext`)
- [ ] `hooks/plan.ts`: blocked, effective priority, estimate, ranking with reasons, loop check (tests)
- [ ] Flow and actions: block, unblock, Play next, time, Blocked on the current task (tests)
- [ ] Panel: the four sections, the blocking view, keys, palette (tests)
- [ ] Other projects (tests)

## 2. Recoverable tasks

- **Before starting:** the git check as before (nothing uncommitted, nothing unpushed, a pushed branch, no detached HEAD).
- **On starting:** the task records the branch it was made from (`baseBranch`) and the full commit it started from (`startCommit`).
- **A put-back task whose branch is gone** starts again on a new branch from here, with a new start commit, and the panel says so.
- **Drift**, checked at a session's start, after a clear, after each turn and before Continue, local git only:
  - the task's branch is gone
  - the branch no longer holds its start commit (a rebase or a reset)
  - the base branch has commits the task's branch doesn't
  - another branch is checked out (as before, with Switch)
- **Recovery:** whenever a conversation opens on a current task that Queue-tea didn't start itself (a new session, a restart after a crash, a `/clear`), the panel shows the checkpoint and **Continue**. A `/clear` Rohan types during a task first saves a checkpoint, when the conversation holds enough to save (20,000 tokens or more).
- **Later:** a git worktree per task, so tasks can run side by side.

- [ ] `startCommit` in full, `baseBranch`, the gone-branch restart (tests)
- [ ] `hooks/drift.ts` and its lines in the panel (tests)
- [ ] Continue after a clear Queue-tea didn't make; the checkpoint before a typed `/clear` (tests)

## 3. Checkpoints in place of the handoff note

A task's `checkpoint` has two parts:

- **Written by Claude** at a handoff (the conversation size, the allowance mark, Back to queue, Blocked, a typed `/clear`), as JSON: goal, acceptance criteria, changes made, decisions, approaches rejected, what remains, blockers, the next exact action.
- **Seen by Queue-tea** after every turn, with no model call: the files Claude changed, the last 15 shell commands with whether each passed (tests marked), the branch, the last commit and the files not committed.

On Continue, Queue-tea checks the repository first (branch, last commit, uncommitted files, drift) and puts what it found in the first message beside the checkpoint, with: compare the two, rerun the checks the checkpoint relies on, say what differs, then do the next action. Claude is told a check passed only when Queue-tea saw it pass. A reply that isn't JSON is kept as a plain note, as before.

- [ ] Tracker: shell commands and their results; facts after each turn (tests)
- [ ] `hooks/checkpoint.ts`: the prompt, parsing, the first message with what was checked (tests)
- [ ] The checkpoint card in the panel (tests)
- [ ] spec.md, README, validate, type check, tests
