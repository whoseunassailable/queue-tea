# Helper policies

When each helper runs, how a quest's test profile decides which ones it needs, what happens when one fails, and what Queue-tea measures about them. The helpers themselves are described in [Helpers](spec.md#helpers); the profiles in [Test profiles](spec.md#test-profiles).

## When each helper runs

Rohan turns helpers on per quest with the **Helpers** chips in the quest pane. A new quest has Tea-DD on and the others off. The chips say which helpers a quest may use; the test profile says which of those it needs.

| Helper | Policy | When it runs |
| --- | --- | --- |
| Tea-DD (`queue-tea:tea-dd`) | Automatic | On by default. Writes and runs the tests at the quest's profile, from Standard up. At Quick, Claude runs the Quick checks itself |
| Mocha Mockup (`queue-tea:mocha-mockup`) | Conditional | Only when turned on, and only from Standard up: the design comes before the code |
| Chai-pter (`queue-tea:chai-pter`) | Conditional | Only when turned on, and only from Standard up, once behaviour changes |
| Commit Chai-n (`queue-tea:commit-chai-n`) | Conditional | Only when turned on, at every profile: it prepares the commits once the acceptance criteria are met and the tests pass |
| Tea-concile (`queue-tea:tea-concile`) | Manual | A skill, not a subagent. Only when a merge stops on conflicts and Rohan asks Claude to resolve them ([Helpers](../README.md#helpers)) |

The policies live in `hooks/shared/records/domain/services/helper_policy.ts` (`HELPER_POLICIES`), with the table of which helpers each profile skips (`SKIPPED_AT`). Rohan can still @-mention any helper, or give it an order in the Guild Hall, whatever its policy.

## Routing by profile

A quest's brief, which Claude reads on every reply, carries one line for each helper it should use, in work order: Mocha Mockup, Tea-DD, Chai-pter, Commit Chai-n.

1. **Classify first.** While a quest has a helper on and no profile yet, the brief starts with: "First classify the change: pick its test profile (set_test_profile says which is which) and record it before you design or write code, so only the helpers it needs run." The `set_test_profile` description carries the five profiles, so Claude can pick one without starting Tea-DD.
2. **Quick sheds the planning helpers.** At Quick (only how it looks, its text or its order), the brief drops the lines for Mocha Mockup, Tea-DD and Chai-pter and says: "This is a Quick change: implement it, run the Quick checks yourself (the type check, and the changed files' own tests or a look at the screen, as the project's CLAUDE.md names them), then review." It names the helpers that are on but skipped, and asks Claude to fix a doc line that names what changed, such as a label or an order. Commit Chai-n keeps its line when it is on.
3. **Anything bigger keeps them all.** From Standard up, every helper that is on keeps its line.
4. **Moving up brings them back.** When a Quick change reaches further, Claude records a higher profile and the skipped helpers' lines return on its next reply.

So moving Notes to the fourth place in the navigation goes classify, implement, Quick checks, review: no Mocha Mockup, Chai-pter or full Tea-DD run, even with those chips pressed.

The same rule decides the done reminder: at Quick, Tea-DD isn't asked for when Claude calls `task_looks_done`. A profile Rohan picks routes the same way as one Tea-DD picks, and the answer to `set_test_profile` names the helpers the new profile skips.

## When a helper fails

A helper counts as run only when its Agent call comes back without an error and without being refused. A call that fails, is refused, or throws doesn't count, so the done reminder still asks for it.

- **The reminder.** When Claude calls `task_looks_done` with every acceptance criterion answered ([Telling the mod a task looks done](spec.md#telling-the-mod-a-task-looks-done)) and a helper the profile needs hasn't run, the tool answers once: "Tea-DD is on for this task and hasn't run yet. Run it, then call task_looks_done again. If it failed or can't run here, say why in checked when you call again."
- **After one reminder,** Rohan is asked whether the task is done, and the menu's "Claude checked: …" line ends with "Tea-DD is on and didn't run." Nothing is marked done without him.
- **A helper that isn't installed,** or is turned away, fails its Agent call, so it is handled the same way: one reminder, then Rohan decides.
- **A helper sent to the background** counts as run when it starts, since Claude reads its result later.

A helper call made during a `/brew` or `/tea` errand isn't counted against the quest.

On Codex, Codex records a helper's run itself with `helper_finished`, and its done reminder follows the same profile rule ([Helpers and companion skills](codex-integration.md#helpers-and-companion-skills)). Those runs aren't measured.

## What is measured

Each Queue-tea helper call made for the current quest adds to that quest's `helperUsage` in the record, by helper:

- `runs`: every call, failed ones included
- `failed`: the ones that errored or were refused
- `timed` and `ms`: how many had a duration, and their total in milliseconds. Claude Code's own duration is used when its answer has one; otherwise Queue-tea's clock from the call to its answer. A background run has none
- `counted` and `tokens`: how many reported tokens, and their total. Claude Code's total is used when its answer has one, else input plus output tokens. When neither is there, the run isn't counted, so `tokens` is never a guess

Averages come from these: `ms / timed` and `tokens / counted`. A hand-edited `helperUsage` that doesn't add up (more failed, timed or counted runs than runs) is dropped for that helper when the record is read. The field is absent until a helper runs. There is no view of it yet; the dashboard is still to come (Q10.12 in the roadmap).

## Which model runs what

- **The message check** forks the session's own model, so most of the prompt comes from its cache. When there is nothing to fork from, it asks `claude-haiku-5-5` instead ([The message check](spec.md#the-message-check)).
- **The handoff note** forks the session's model.
- **Helpers** run on the session's model. Their agent files set no `model`, so none is switched for a lighter one yet.
