<p align="center"><img src=".claude-plugin/icon.png" width="160" alt="Queue-tea"></p>

# Queue-tea

A Claude Code mod that keeps one task in progress per project and the rest in a priority queue. It gives each task its own git branch, starts every task in a fresh conversation, and records the time and effort that went into each one.

## What it does

- **Sorts every message you type.** A short model check decides whether the message continues the current task, is new work, is a quick side question, or can't be told apart. New work is held back, and a band above the prompt asks for its priority (urgent, high, mid, okay, low) and difficulty (light, medium, hard).
- **One task at a time, under a tea cup.** A small animated tea cup sits above the prompt and shows what Queue-tea is doing: idle (z's), brewing (steam), needs you (a blinking !), or done (twinkles), with a line saying what. Click it (in the fullscreen terminal), press its **Menu** button, or type `/queue-tea` for its menu: **Brew now**, **Backlog** (the suggested task marked ★), **Current task**, **History**, **Usage & time** and **Settings**. Keys `1`–`6` pick an entry, `m` goes back to the list, and Esc closes it. Each action has a key (`d` done, `b` back to queue, `s` start…).
- **Back to queue.** The current task can go back in Up next with a handoff note; starting it again goes back to its branch.
- **A branch per task.** Before a task starts, nothing may be uncommitted or unpushed. The task then gets `task/<short-title>`, made from the branch you're on.
- **You commit and push.** Claude's `git commit`, `git push` and anything else that commits are refused. If a commit still appears during a turn, the menu names it and the cup asks for you.
- **Short conversations, so the 5-hour allowance lasts.** Each task starts after `/clear`. Past 100,000 tokens, Claude writes a handoff note (overview, what changed, current state with the last commit and tests run, decisions, next steps) and the task carries on in a fresh conversation. At 90% of the allowance, a handoff note is written so nothing is lost.
- **A record of the work.** Each task's dates, active time per day, messages that were understanding or improving, files read and changed, and lines added and removed are kept in `~/.queue-tea/projects/`. Records from before the rename, in `~/.queue-tie/projects/`, are copied there the first time it starts, and the old folder is left as it was. Finished tasks also get a row in a task log inside the project, at `docs/task_log.md` unless you pick another path.

## Commands

| Command | Does |
| --- | --- |
| `/queue-tea` | Opens the tea cup's menu with its keys |
| `/done` | Asks whether the current task is done for now |
| `/steep <message>` | Steeps it for later: files the message as a new task, with no check |
| `/brew <request>` | Does it now, outside the queue: no check, no task, same branch and conversation |
| `/instant <request>` | The same as `/brew` |
| `/tea <question>` | Answers or explains, outside the queue: no check, no task, no files changed |

`/brew` (or **Brew now** in the menu) is for work you want right away without filing it, such as `/brew get the dev server running and tell me its URL`. The current task stays current, and its branch and conversation stay as they are. Claude is told to do the work and check that it worked, not just describe it. The commit and push guard still applies. Time spent goes to the project, as with a quick question. A fresh conversation that is due waits until the next turn, so the answer stays on screen.

## Settings

Change these in `/config`.

| Setting | Default |
| --- | --- |
| Idle gap that stops the clock | 15 minutes |
| Conversation size that starts a fresh one | 100,000 tokens |
| Allowance use that writes a handoff note | 90% |
| Message check time limit | 10 seconds |

## Install

At the prompt of a terminal session:

```
/plugin marketplace add whoseunassailable/queue-tea
/plugin install queue-tea@queue-tea
```

Pick the user scope so it loads in every project.

To work on it, install from your clone instead, so an edit reaches a session on `/reload-plugins`:

```
/plugin marketplace add <path to your clone>
/plugin install queue-tea@queue-tea
```

## Develop

```
claude plugin test .
claude plugin validate .
```

The design is in [docs/spec.md](docs/spec.md) and the build plan in [docs/plan.md](docs/plan.md).

## License

MIT. See [LICENSE](LICENSE).
