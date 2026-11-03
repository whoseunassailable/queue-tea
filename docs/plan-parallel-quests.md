# Plan: several quests in progress, each in its own worktree

Phase 2 of Multiple tasks, and sub-project 4 of Queue-tea 2.0 ("tasks side by side in worktrees" in [workspace-app.md](workspace-app.md)). Not built and not designed in full: this page holds Rohan's wish, what is decided and Mocha Mockup's design so far, so it can be filed as its own quest. Rohan commits; Queue-tea and Claude never do.

Phase 1, built on 2026-11-03, lets the quest in hand run on Claude Code or on Codex and move between them. It is in [spec.md](spec.md#codex-in-place-of-claude-code) and [workspace-app.md](workspace-app.md#codex-a-quest-without-claude-code). Phase 1 keeps one quest in progress per realm; phase 2 is where that changes.

**File it with:**

```
/steep Several quests in progress, each in its own worktree
```

## What Rohan wants

- main is the main branch.
- Working on a quest, say auto-update, makes its own branch, and the realm shows that branch attached to main.
- Picking another quest, say a settings option, makes another branch and opens another new terminal. Everything is new.
- When a quest is done, it merges back into main.
- A new view next to Quests shows which quests are being worked on and the branch tree so far. Selecting a quest or a saga there reopens it.

The picture, for two quests at once:

```
main ──┬── auto-update       its own folder, its own terminal, worked on by Claude Code
       │
       └── settings option   its own folder, its own terminal, worked on by Codex

When a quest is done, its branch goes back into main. Rohan runs that step himself.
```

## Decided

- **Each extra quest gets a git worktree** at `~/.queue-tea/worktrees/<project key>/<branch name without task/>`. The project key is the record file's name: this repository's record is `~/.queue-tea/projects/queue-tea-a60ae6.json`, so a quest on `task/settings-option` gets `~/.queue-tea/worktrees/queue-tea-a60ae6/settings-option`.
- **Its own branch, made from main,** the base branch.
- **Its own terminal and session,** Claude Code or Codex, as in phase 1.

## The design so far

Mocha Mockup's, not yet taken by Rohan.

- **The record says which folder each quest in progress uses.** "The task for this folder" replaces the one-current-task rule. That rule is in about 35 places today: 36 calls to `currentTask()` in 20 files under `hooks/` and `app/`, tests left out.
- **A Claude Code session in a worktree finds the project's record through git's common dir** (`git rev-parse --git-common-dir`), and works only on its own quest. Today a session finds its project with `git rev-parse --show-toplevel` (`hooks/shared/records/data/datasources/project_source.ts`), which in a worktree gives the worktree's own folder, and with it a record of its own.
- **Requests go to the session in that quest's folder,** not to any session in the realm.
- **Each quest counts its own time,** even when two run at once.
- **The record moves to version 2,** so older copies of Queue-tea leave it alone. They already refuse a newer record: the failed state says to update Queue-tea and offers no copy ([spec.md](spec.md#when-things-go-wrong)).
- **A finished quest's worktree is tidied** with `git worktree remove` when it is clean. It is never forced, and the branch is kept.
- **This repository's post-commit hook skips the app rebuild in a linked worktree.** Today `tools/hooks/post-commit` runs `app/tools/refresh_app.sh` after every commit, which builds the app of the folder it runs in and installs it over `/Applications/Queue-tea.app`. A commit in a worktree would install that worktree's build.
- **A second quest starts from the app only.** The mod's menu keeps its one Start.

### What phase 1 leaves for this phase

Found while writing this plan, from the phase 1 code:

- Codex's time is read from Codex sessions run in the project's folder (`hooks/shared/codex/data/datasources/codex_log_source.ts`). A quest in a worktree needs its sessions read by the worktree's folder.
- Codex's brief tells it to stay in the project's folder, and the line that opens it `cd`s there (`app/main/features/tasks/api/start_api.ts`, `app/main/core/platform/mac.ts`). Both need the quest's folder.
- [workspace-app.md](workspace-app.md) holds the Board tab back until In progress and Review can hold several cards, which is this phase. The new view and the Board are best designed together.

## Still open

1. **Merging back into main.** Rohan's rule is that Queue-tea never commits, pushes or merges, and the app has no Merge button (criterion 3 of [workspace-app-design.md](workspace-app-design.md)). So "merges back" would mean Queue-tea checks the merge and hands Rohan the commands to run, the way Commit Chai-n does. To confirm with Rohan.
2. **Does the first quest keep the project's own folder, or does every quest get a worktree?** Rohan's description reads as every quest new: its own branch, its own terminal. The decided part gives a worktree only to each extra quest.
   - Keeping the first quest in the project's folder changes nothing while one quest runs, and a session already open there carries on as it does today.
   - A worktree for every quest leaves the project's folder on main and treats every quest alike, which is closer to what Rohan described.
3. **The new view.** Its name on screen, what the branch tree shows, and what reopening a quest or a saga does (bring its terminal forward, or open a new one) are not drawn yet. Mocha Mockup draws them once 1 and 2 are answered.

## Steps, once the open questions are answered

A suggested order. Each step keeps the mod's and the app's tests passing and adds its own.

- [ ] The new view and the answers to the open questions, drawn in [workspace-app-design.md](workspace-app-design.md)
- [ ] Record version 2: the folder each quest in progress uses. A version 1 record reads as one quest in the project's folder
- [ ] "The task for this folder" in place of the one-current-task rule, in the places that use `currentTask()`
- [ ] A session in a worktree finds the project's record through git's common dir and works only on its quest
- [ ] Worktrees: make one from main, open the chosen terminal in it, tidy it when the quest is finished and the worktree is clean
- [ ] Requests, time and Codex's log by the quest's folder
- [ ] The app: start a second quest, and the new view
- [ ] Merging back: the check, and the commands for Rohan to copy
- [ ] The post-commit hook skips the app rebuild in a linked worktree
- [ ] [spec.md](spec.md), [workspace-app.md](workspace-app.md), and the glossary's "Current task: at most one", which stops being true here
