# Parallel quests: implementation decisions

Implemented as the second part of **Multiple tasks**. The original request includes several active quests, separate branches and terminals, and a branch-tree view beside Quests. The earlier Claude/Codex handoff alone did not satisfy it.

- Every new app-started quest gets its own worktree, including the first. Existing quests retain the original folder. Git starts from main, with master/current-branch fallback for repositories without main.
- Start buttons remain available for other unsealed quests. Home and Quests show all current quests. The mod's menu still operates on one task in its own folder.
- Branches sits beside Quests and shows saved base branches, quest branches, status, platform, folder and saga. Quest/saga links reopen details, and terminal buttons target the quest's folder.
- One project record is shared across worktrees, resolved through Git's common directory. Version 1 migrates to version 2. Time, requests, checkpoints, task logs and Git operations use the session's working folder.
- Rohan still commits, pushes and merges. Merge instructions checks refs, dirtiness, another active task in the destination folder, ancestry and conflicts. It supplies the commands as text.
- Worktrees remain until Rohan removes them, so finishing does not delete a live terminal's folder or an uncommitted task log. Once a finished branch is merged and clean, Merge instructions offers a non-forced removal command. It keeps the branch.
- The post-commit hook skips app rebuilding in linked worktrees. Main-checkout commits still rebuild the installed app.

Behavior is specified in [spec.md](spec.md#parallel-quests-and-branches); app API and navigation are in [workspace-app.md](workspace-app.md#parallel-quests-and-the-branches-tab).
