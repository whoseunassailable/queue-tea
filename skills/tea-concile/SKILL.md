---
name: tea-concile
description: Use when a merge has conflicts and Rohan asks Claude to resolve them - the Queue-tea app's Branches page shows Resolve conflicts or Conflicting files, git reports CONFLICT, "both modified" or unmerged paths, or files hold <<<<<<< markers - including version numbers, package-lock.json, task logs, generated files and code both branches changed.
---

# Tea-concile

Resolve a merge so the result does what **both** branches meant, then hand it back for review. Rohan approves and commits the merge; Queue-tea's guard refuses `git commit`, `git merge` (and `--continue`/`--abort`) anyway.

## 1. Find the merge

- **Prepared by the app (the usual case).** Branches → Review work → Prepare merge for review leaves a real merge, stopped before its commit, in `~/.queue-tea/integrations/<project key>/<operation id>/worktree`. Find the waiting ones with `grep -l '"stage": "conflicts"' ~/.queue-tea/integrations/*/*.json`; each record names `source` (the task branch), `target` (e.g. `main`) and `taskId`. More than one: ask which `source → target`. If Claude Code refuses to edit there, ask Rohan to type `/add-dir <that worktree>`.
- **Run by hand:** the folder where `git rev-parse -q --verify MERGE_HEAD` succeeds.
- **Not started:** preview with `git merge-tree --write-tree --name-only --no-messages <target> <source>` (every line after the first is a conflicted file), plan the resolution, and ask Rohan to press Review work, then Prepare merge for review, in Branches. Never start a merge yourself.

Work only in that merge folder: never in the task's own worktree, the main checkout or another task's folder. There, **ours / stage 2 / HEAD is the target**, **theirs / stage 3 / MERGE_HEAD is the task branch**. Call them by branch name when you report.

## 2. Read both intents before editing

For each file in `git diff --name-only --diff-filter=U`, with `B=$(git merge-base HEAD MERGE_HEAD)`:

- `git log --format='%h %s' $B..HEAD -- <file>` and `$B..MERGE_HEAD -- <file>`: why each side changed it.
- `git diff $B HEAD -- <file>` and `git diff $B MERGE_HEAD -- <file>`: each change on its own, clearer than the markers.
- The task: in `~/.queue-tea/projects/<project key>.json`, the task whose `id` is the record's `taskId`; its `title`, `description` and `criteria` say what the task branch is for.

## 3. Resolve by kind

| What conflicts | Resolution |
| --- | --- |
| A version number (`"version"` in `plugin.json`, `package.json`, the first two in `package-lock.json`; `version =` in `pyproject.toml`/`Cargo.toml`) | The higher semver of the two sides, the same in every version file. Queue-tea's post-commit hook leaves merge commits alone, so this number ships |
| A lockfile's dependency entries | Resolve the manifest first, then regenerate (`npm install --package-lock-only` in that folder; ask first, it reaches the network). Never hand-merge hashes. Only the version lines conflict: the row above |
| Generated files (`graphify-out/`, builds, snapshots) | Take the target's side, then regenerate with the project's command (`graphify update .`) |
| Append-only logs (task log, changelog) | Every new entry from both sides, in date order, no duplicates |
| Lists: imports, exports, routes, constants, text keys, config | Both additions, deduplicated, in the file's own order |
| Code both sides changed | Work out what each wanted and write code that does both. One side refactored or renamed and the other changed behaviour: put the behaviour change into the refactored code |
| Deleted on one side, changed on the other | If the deletion replaced the code (its commits moved it elsewhere), carry the change to the new place and `git rm` the old file. Otherwise ask |
| Added on both sides | One file when they serve the same purpose; otherwise ask |
| Binary, symlink, submodule | Don't edit. `git checkout --ours -- <file>` (target) or `--theirs` (task) only when the intent is plain; otherwise ask |

**Ask instead of choosing** when the two sides set one thing to different values for different reasons (a timeout, a wording, a colour), or when you can't tell from the commits and the task what a side meant. Show both versions and your recommendation, leave that file unresolved, and resolve the rest.

## 4. Find what git didn't flag

Clean hunks can still break together: one side removed or renamed a function, type field or text key that the other side's new code uses. For each name removed in `git diff $B HEAD` or `git diff $B MERGE_HEAD`, grep the merged files for uses. Then run the project's quick checks in the merge folder, the ones its CLAUDE.md lists (for Queue-tea: `npm run typecheck` in `app/`, `npx -y -p typescript@5.9 tsc -p .` and `node tools/check_layers.mjs` at the root). No `node_modules` there: say the checks couldn't run; don't install. The app runs the full configured checks before approval.

## 5. Hand it back

1. No markers left: `grep -nE '^(<{7}|={7}|>{7}|\|{7})( |$)' <files>` prints nothing.
2. Stage each resolved file, and anything else you changed (a regenerated lockfile or graph, a fix from step 4), with `git add -- <file>`. Delete any files your checks created. `git status --porcelain` must show no unstaged or untracked lines: the app won't offer approval while one remains.
3. Tell Rohan the next step: in Branches, read the merge's diff, run its checks and press **Merge `<source>` into `<target>`**. For a merge run by hand, give `git -C '<folder>' commit --no-edit` to paste, with no leading `!`.

## Report

Per file: what the target did, what the task did, how you combined them, and whether it was a judgment call. Then the open questions, each check you ran with its result, and the next step.

## Common mistakes

| Mistake | Instead |
| --- | --- |
| Taking one whole side to clear the markers | It silently drops the other branch's work: combine them |
| Swapping ours and theirs | In the app's folder, ours is the target and theirs is the task branch |
| Editing the task's own folder or the main checkout | Only the merge folder |
| Hand-merging lockfile hashes or `graph.json` | Regenerate them |
| Leaving test output or an unstaged fix | Stage your changes and delete what checks created |
