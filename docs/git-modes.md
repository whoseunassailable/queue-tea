# Git modes

Added 2026-11-20 for Q02, Git lifecycle and merge management. Each realm has a Git mode that sets what Claude may do towards a commit. Rohan picks it in the app under **Settings › This realm › Git mode**. Either way, Rohan makes every commit, merge and push.

| Mode | What Claude does | What Rohan does |
| --- | --- | --- |
| **Manual** | Never commits. Hands Rohan the commands to run. | Runs them in a terminal, or commits, merges and pushes from Branches. |
| **Assisted** (the default) | Never commits. Proposes each commit, its files and message, with the `propose_commit` tool. | Opens the quest in Branches, where the commit form already holds the proposal. Edits it and presses **Commit selected files**. |

A record from before Git modes has no mode and works as Assisted. The roadmap's Autonomous mode, where Claude commits on the quest branch by itself, is left out: Rohan's own rule is that Claude never commits or pushes unless he asks in that request. It can come back if he changes that rule.

## How it works

- **The record.** The realm's record keeps the mode (`gitMode`) and, on each task, Claude's latest proposal (`commitProposal`): the message, the files, the commit the branch was on, and when. A new proposal replaces the last one.
- **The mod.** The git guard refuses every commit and push in both modes. In an Assisted realm its refusal and Claude's brief point Claude to `propose_commit`. The tool refuses in a Manual realm, when no task is current here, and when the input is wrong. It also refuses any message that credits Claude, such as a `Co-Authored-By` line, "Generated with Claude Code" or "proposed by Claude", because Rohan's commits never say who drafted them.
- **The app.** A quest's review in Branches carries the proposal only in an Assisted realm, and only while the branch is still on the commit it was made on. It keeps just the proposed files that are still changed. The form fills in once. A newer proposal replaces it only while the message is empty or still the last proposal's unedited text, so Rohan's own edits are never overwritten. A line under the files says the commit was proposed and that nothing is committed until he presses the button.

## What blocked Git before (Q02.1)

| Where | What it said or did | Now |
| --- | --- | --- |
| The mod's git guard (`hooks/register.tsx`, `commit_guard.ts`) | Refused every commit, push, merge, rebase, cherry-pick, revert, pull and am. | Still refuses them; the wording follows the mode. |
| Claude's brief (`tasks_text.ts`) | "Never commit or push: Rohan does." | Adds `propose_commit` in an Assisted realm. |
| Commit Chai-n (`agents/commit-chai-n.md`) | Hands Rohan the commands. | Proposes with `propose_commit` in an Assisted realm, and never credits Claude in a message. |
| Codex's brief (`checkpoints_text.ts`) and its skills | Never commit. | Unchanged: Codex has no Queue-tea tools for proposing. |
| Tea-Concile's order from Branches (`messages.ts`) | Resolve and stage, never commit. | Unchanged: Rohan approves the merge in Branches. |
| The app's process runner (`isForbiddenGit`) | Refuses commit, push, merge and pull for anything but Branches' own approved steps. | Unchanged. |
| Installed skills, such as finishing a development branch | Tell Claude to commit. | Claude meets the guard; in an Assisted realm the refusal names the tool to use instead. |
| `spec.md`, `workspace-app.md`, `workspace-app-design.md` | Said the app never commits, merges or pushes. | Corrected: Branches does, when Rohan presses the button. |

## What Branches already covers, and what's left

Branches ([branch-workflow.md](branch-workflow.md)) already covers most of the roadmap's lifecycle: the review of changes, selected-file commits, merges prepared in a separate folder, conflicts and their three-way resolution, checks on the prepared result, a separate push, recovery after an interrupted merge, and a quest shown as merged only once Git confirms it.

Left for their own child quests:

1. **Finishing checks the merge (Q02.4, Q02.8).** Finishing a quest doesn't check that its branch merged, so a quest can be done but unmerged. Finishing could warn, or wait for a confirmed merge.
2. **The mod's start check (Q02.7).** Starting a task in the mod waits on uncommitted or unpushed work and offers only **Check again**. It could say where to commit (Branches) or offer to start in a worktree as the app does.
3. **Branch dependencies (Q02.6).** A quest records its branch and its base, but not which other quest's branch it builds on.
4. **Quest intent for Tea-Concile (Q02.9, with Q08.6).** Tea-Concile's order from Branches doesn't carry the two quests' descriptions and criteria.
