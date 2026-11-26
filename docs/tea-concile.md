# Tea-Concile

Tea-Concile is Queue-tea's fifth helper. It is sent to a merge that stopped on conflicts, reads what both quests were for, keeps both where they fit together, and leaves Rohan each choice the two quests made differently. It never commits: Rohan reads the result, runs the checks and approves the merge in Branches.

This page is the audit of the skill it grew from (Q08.1), how the helper works now, and what is left for later quests.

## The skill it grew from (Q08.1)

Before 2.29.0, Tea-concile was a skill (`skills/tea-concile/SKILL.md`), not a helper. Commit Chai-n carried it, and Branches could send any helper to a merge with it.

**What it could do, and still does:**

- Find the merge: the folder Branches prepares under `~/.queue-tea/integrations/<project key>/<operation id>/worktree`, a merge run by hand, or a preview with `git merge-tree` when none is started.
- Work only in that folder, and name the sides by branch rather than ours and theirs.
- Read each side's commits and diff against the merge base before editing.
- Resolve by kind: the higher version number, regenerated lockfiles and generated files, both sides' entries in logs and lists, combined code, and care with deletions, additions on both sides, binaries, symlinks and submodules.
- Ask instead of choosing when the two sides set one thing differently for different reasons.
- Look for breakage git didn't flag, such as a name one side removed and the other uses, and run the project's quick checks.
- Stage the result and hand it back with no unstaged or untracked files.

**What held it back:**

- It never committed, merged or aborted. That stays: the mod's guard refuses those commands, and only Rohan's press in Branches commits.
- It read only the task branch's quest, and only its title, description and criteria. It had nothing about the target's quest, or about other quests that reached the target in the meantime, or about what a quest's checkpoint said was decided or ruled out.
- An open choice was only words in the report. Branches couldn't show it on its file, so Rohan had to match the report to the files himself.
- A resolution that went wrong could only be undone by abandoning the whole merge.
- Conflicts showed only once a merge was prepared.
- Commit Chai-n carried it, so the git helper's job included merges, and any helper could be dragged onto a merge.

**What was reused:** the whole procedure. The helper's definition (`agents/tea-concile.md`) points to the skill for every step and adds only what a helper needs: where its work comes from, the rules it never bends, the list of choices it returns and how it reports. In Codex, where the helper and the skill share the name `$tea-concile`, they become one skill with a section for the helper.

**What the roadmap said that no longer held:** the bench already existed, so "a dedicated interface" was mostly a matter of who stands on it. Most of the merge lifecycle the roadmap asks for was already in Branches ([branch-workflow.md](branch-workflow.md)): merges prepared in their own folder, three-way resolution, checks required before approval, abandoning a merge and recovery after an interruption.

## How it works now

| Commit Chai-n | Tea-Concile |
| --- | --- |
| Branch names, commits and their messages | Merges that stopped on conflicts |
| Pull requests and pushes | Branches that diverged, semantic conflicts |
| Planning a merge, a pull or a push | Reconciling two quests, versions and dependencies |

1. **Before a merge is prepared,** Review work in Branches says which files a merge into the target would conflict in, or that it merges clean. It works this out with `git merge-tree --write-tree`, which needs git 2.38 or later and touches no folder. With an older git it says nothing.
2. **Once the merge is prepared with conflicts,** Tea-Concile stands beside it. Rohan presses it or drags it onto the merge. Only Tea-Concile can be sent to a merge, and the app refuses any other helper.
3. **Its order carries both quests' intent.** Queue-tea adds, from its record: the task branch's quest, the target's quest when the target is a quest branch, and the quests that reached the target after the task branched (by branch, or by a merge Branches made). For each one it gives the title, what it is for, what counts as done, and what its checkpoint says was decided and ruled out. If git can't say which quests landed, the order says so and Tea-Concile reads the commits instead.
4. **It resolves what fits together and stages it.** Where the two quests really disagree, it leaves the file unresolved, may write its recommended combination there unstaged, and lists the choice in a block at the end of its report:

   ````
   ```tea-concile-decisions
   [{ "file": "src/timer.ts", "question": "Fade or blink?", "target": "main blinks the dot", "source": "The task fades it in", "recommend": "source", "why": "The quest says never flash." }]
   ```
   ````

   `recommend` is `target`, `source`, `result` (the combined version it wrote) or `null`. Each field is at most 600 characters.
5. **Branches shows each choice on its file:** the question, what each side does, and its recommendation, whose button becomes the main one. The bench says how many choices are left, and while any are, the bot tilts and dims where its strands join. A list that doesn't read is logged, and the bench says none could be marked.
6. **Any resolution can go back to its conflict** until the merge is committed. Resolved in this merge lists each resolved file with **Put the conflict back**. Git keeps each resolved file's sides in the merge folder's index until the commit, so the app puts them back (`git update-index --unresolve`) and writes the file again: with its markers when both sides have it, or the side that kept it when the other deleted it. That works for a resolution saved in Branches and one Tea-Concile staged with `git add` or `git rm`.
7. **Rohan still decides.** The merge needs its checks to pass on the prepared result before approval, and **Abandon preparation** discards the merge folder's edits. Neither changed.

Tea-Concile can't be turned on for a quest's own work. A quest's helpers are the other four, and Queue-tea drops Tea-Concile from a hand-edited record.

## Child quests

| Child quest | State |
| --- | --- |
| Q08.1 Existing skill audit | Done: this page. |
| Q08.2 Agent definition | Done: `agents/tea-concile.md`, using the skill, with Commit Chai-n's merging work handed over. |
| Q08.3 Helper identity | Done: a rose palette, a pixel-art prop of two strands joining into one on the Guild Hall bot, and a logo. Its idle, working, asking, done, failed and stopped states follow the reconciliation. |
| Q08.4 Guild Hall registration | Done: its card, role, idle line and @-mention, and an order from the Guild Hall. |
| Q08.5 Conflict detection | Done in Review work and on a prepared merge. The Branches board itself doesn't yet badge a branch that would conflict before its review is opened. |
| Q08.6 Quest context retrieval | Done: both quests and the ones that landed, with criteria and checkpoint decisions. |
| Q08.7 Semantic reconciliation | Done in the procedure the helper follows. |
| Q08.8 Interactive conflict review | Done: each choice on its file, with its recommendation. |
| Q08.9 Merge verification | Covered by Branches: approval needs passing checks on the prepared result. Tea-Concile runs Tea-DD's Quick profile in the merge folder. It doesn't record a test profile on the quest. |
| Q08.10 Git recovery | Done: Put the conflict back, beside the existing Abandon preparation. |
| Q08.11 Lifecycle integration | Partly done: Branches sends Tea-Concile and reads its result. Quest completion waits on Q02. |

## What waits on Q02

- **Quest completion after a confirmed merge (Q02.4, Q02.8).** Finishing a quest doesn't check that its branch merged, so Tea-Concile can't hold a quest open until its merge is confirmed. Once finishing checks the merge, a quest whose merge stopped on conflicts can point to Tea-Concile.
- **Realm Git permissions beyond Manual and Assisted (Q02).** Tea-Concile follows the same guard as every helper: it never commits, merges, aborts or pushes, in either mode. A later mode that lets Claude commit would still leave the merge commit to Rohan's approval in Branches unless the mode says otherwise.
- **Branch dependencies (Q02.6).** When a quest records which quest it builds on, the order can name that quest directly, rather than working out which quests landed from git.
