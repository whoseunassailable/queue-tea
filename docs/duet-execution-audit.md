# Duet execution audit

Audit of how Queue-tea hands a quest to Claude Code (or Codex) and decides it looks done, from the source on `main` at `4cf1ab7`, 2026-11-26. It answers quest `t-a9fd9ee9`, filed from the note "Queue-Tea — UI Stabilization, Planning Redesign & Duet Optimization".

"Duet" is not a name in the code. Here it means the pair that works a quest: the Queue-tea mod, which writes the brief, the first message, the helper lines and the done question, and the Claude Code or Codex session that reads them and does the work.

## Root cause

Duet treats a quest as one message to start from and a question to ask at the end. Nothing in between keeps the requirements in view or checks the result against them.

1. **The running mod is 80 commits old.** Claude Code loads Queue-tea from the main checkout (`~/Documents/projects/personal_projects/queue-tea`), and that checkout is on `task/guild-helpers-at-work` at `06936a4` (2026-11-06). It has no test profiles, no helper routing by profile, no Tea-Concile and no BrewQuest helper, and its Tea-DD and Commit Chai-n files are older. Every quest since then ran under the old brief and old helpers, whatever `main` says. You can see it in this session: the record holds "Standard, chosen by Rohan", yet the brief has no test-profile line, and Tea-Concile is missing from the session's helpers.
2. **The requirements arrive once.** The acceptance criteria are in the first message only. The brief Claude reads on every reply carries the title, the git rule and the helper lines, not the criteria. When a long quest's conversation is compacted, the criteria go with it.
3. **The product intent is cut twice before it arrives.** A quest filed from a note gets BrewQuest's summary and, when BrewQuest gives them, a few quoted lines. It also gets "From the note … in Notes." with no path, so Claude can't open the note. A child quest gets its own criteria and any it takes on for its parent, but never the parent's description or the parent's own criteria. In this epic, "Queue-Tea behaves as one cohesive app, not a set of separate features" reaches no child quest.
4. **Nothing asks Claude to look before it builds.** Only Mocha Mockup's instructions say to read the spec, the design docs and the code a change touches. Mocha Mockup is off on every new quest, and all seven quests under this epic have Tea-DD alone, the Plan rebuild included.
5. **The done question counted attendance, not results.** `task_looks_done` checked only that Tea-DD and Commit Chai-n had run, reminded once, and then asked Rohan. The brief told Claude to call it "when a reply of yours has finished what it asked", so any reply that produced code could end in "looks done". Fixed in this quest: see [What changed](#what-changed).

## The review points

**How Duet interprets quest descriptions.** It doesn't interpret them. `firstMessage` (`hooks/shared/checkpoints/domain/services/checkpoints.ts`) pastes the title, the description, the criteria sets and the quest's messages, after a clear, as the first user message. No step restates the goal or the criteria back before work starts. The only place Claude is asked to write the acceptance points in its own words is the checkpoint at a handoff (`checkpointPrompt`, same file).

**How requirements and completion criteria reach the model.** Once, in that first message, from `criteriaSetsOf` (`hooks/shared/backlog/domain/services/families.ts`). Until this quest the brief (`taskSection` in `hooks/features/tasks/presentation/state_management/tasks_controller.ts`) never repeated them. Codex gets the same first message after its rules (`codexBrief`) and no brief at all.

**Whether enough Realm and architectural context is given.** Queue-tea adds none of its own. Claude Code loads the CLAUDE.md files, which hold the repository's rules, and that is all. The brief doesn't point at `docs/architecture.md`, the spec, the app's design docs or the knowledge graph. It doesn't name the parent quest, and it doesn't link the note a quest came from.

**Whether existing components and patterns are inspected first.** Only when Mocha Mockup is on and Claude runs it. The brief has no "read what exists first" line of its own, and `helper-policies.md` sets Mocha Mockup to off for a new quest.

**Whether the right helpers are invoked.** Helpers are chosen by hand, per quest, with the chips in the quest pane. A new quest has Tea-DD alone. Nothing picks Mocha Mockup for a quest that changes a screen, or Chai-pter for one that changes behaviour. The note's ideal pipeline lists "Tea-Concile: architecture review", but Tea-Concile reconciles merges. No helper reviews architecture.

**Whether helper output shapes the implementation.** Queue-tea can't tell. Claude writes each helper's prompt itself, so a helper sees the quest's description and criteria only when Claude passes them on. When the Agent call returns, Queue-tea records that the helper ran, with its time and tokens (`noteHelperRun`), not what it said or whether Claude followed it. The done reminder covers Tea-DD and Commit Chai-n only (`helperToRemind` in `hooks/features/tasks/domain/services/task_rules.ts`). A Mocha Mockup or Chai-pter that never ran goes unremarked.

**Whether model capabilities are used correctly.** This is not a cause. Helpers set no model, so they run on the session's model. A quest's difficulty or profile doesn't change the model or the effort. The message check forks the session model, or falls back to Haiku (`hooks/core/ports/claude_ports.ts`). The gap is in what the model is given and asked to check, not in which model reads it.

**Whether Duet validates the result against the original requirements.** It didn't. `task_looks_done` took an optional line of free text and never looked at the criteria (`taskLooksDone` in `tasks_controller.ts`, `review` in `app/main/features/codex/domain/operations.ts`). Queue-tea does record the shell commands it sees, including which ones were checks and whether they passed. But it saves them at the end of a turn (`turn.complete` in `hooks/register.tsx`), so a call in the middle of a turn can't rely on them yet, and the done gate doesn't use them.

## What changed

The done question now asks about results, in the mod and in Codex alike.

- **The criteria stay in view.** The brief Claude reads on every reply lists the quest's acceptance criteria, numbered straight through its own set and each feature's set, and says that code written doesn't meet a criterion: a check that passed, or what Claude saw, does. A quest without criteria keeps the old line.
- **`task_looks_done` takes an answer for each criterion.** Its new `criteria` input is one entry per criterion, in the brief's order, each with `met` and `evidence`. The rule (`criteriaAnswer` in `hooks/features/tasks/domain/services/task_rules.ts`) turns the call back when an entry is missing, has no evidence, or the count doesn't match. It turns it back every time, saves nothing, and lists the criteria with the numbers that are missing. Rohan is not asked.
- **Rohan sees the count.** Once every criterion is answered, the line beside the question starts with a summary, such as "Criteria: 2 of 3 met. Not met: 3 (no e2e on this Mac)." An unmet criterion with a reason still reaches Rohan: stopping short is allowed when it says why.
- **The helper reminder comes after.** Tea-DD and Commit Chai-n are reminded once, as before, but only once the criteria are answered.
- **Codex shares the rule and the wording.** Its `done` and `task_looks_done` tools take the same `criteria` input (`app/main/features/codex/data/server.ts`), and its review (`app/main/features/codex/domain/operations.ts`) calls the same rule and builds the same refusal and summary.

The gate makes Claude account for every criterion, but it can't tell real evidence from hollow evidence: "wrote it" still passes the check. Rohan judges the evidence. No evidence is stored on the record, only the summary in the review line.

## What's left, and where it belongs

| Gap | Where it belongs |
| --- | --- |
| The running mod is 80 commits old | Rohan: switch the main checkout to `main` (it has uncommitted graphify cache deletions to clear or keep first). A mod that updates itself is the open "Installed mod reads main checkout" problem |
| The parent's description and criteria never reach a child quest | A small follow-up: add the parent's title, description and own criteria to the first message and the brief |
| A quest from a note doesn't link the note | The same follow-up: put the note's path in the description BrewQuest writes |
| Helpers are picked by hand, Mocha Mockup is off by default, and a helper's output isn't tracked | "Fix helper orchestration" (`t-fdaae7bd`) |
| The done gate doesn't see whether a check passed this turn | Read the effort tracker's commands for the turn so far, not the record's. Left out here, because the record only has them after the turn ends |
