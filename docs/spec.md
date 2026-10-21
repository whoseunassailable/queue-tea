# Queue-tea: design

A Claude Code mod that keeps one task in progress per project and the rest in a priority queue, makes each task's git branch, starts every task in a fresh conversation, and records the time and effort that went into each one.

- **Date:** 2026-10-20
- **State:** built; installed at the user scope from this folder on 2026-10-20. The panel redesign and the features from ChatGPT's review (Back to queue, the fuller handoff note, the "Claude checked" line, the commit warning) were added the same day
- **Next:** make this folder a git repository (Rohan makes the first commit)
- **Later, as its own project:** the weekly board, which reads what Queue-tea records (see [What the board will need](#what-the-board-will-need))

## Why

Rohan works on several projects with Claude Code and wants to:

- remember which tasks are waiting, in which order, without keeping notes
- see what was finished and when
- keep each task on its own branch, committed and pushed by Rohan alone
- keep conversations short, so the 5-hour usage allowance lasts

## Not included

- Switching to another task before the current one is done. An urgent task waits at the front of the queue.
- Reopening a finished task. Coming back to it files a new task.
- Time spent outside Claude Code, such as in the editor. The mod cannot see it.
- The weekly board. It is a separate project with its own spec.

## Words used here

| Word | Means |
| --- | --- |
| Project | One git repository, taken at its top folder. A repository with an app, a server and a website in separate folders is one project. A folder that is not a git repository is a project too, without branches |
| Task | One piece of work: a feature, a fix, a clean-up |
| Current task | The one task being worked on in a project. There is at most one |
| Queue | The project's waiting tasks, in priority order |
| Handoff note | What a fresh conversation needs to carry on a task, under five headings: Overview, What changed, Current state (branch, last commit, what is uncommitted, tests run), Decisions, Next steps |
| Record | The file on the Mac that holds a project's tasks, time and effort |
| Docs log | The table of finished tasks written into the project itself |

## The pieces

Each piece has one job, and only it touches its own data.

| Piece | Its job |
| --- | --- |
| Record | Reads and writes the project's record file. Nothing else touches the file |
| Message check | Before each typed message reaches Claude: same task, new task, quick question or can't tell; understanding or improving; for a new task, a title and a difficulty guess |
| Task flow | The queue order; starting and finishing tasks; the git check and the branch; the handoff note and the fresh conversation |
| Display | The panel, the band above the prompt, the status line, the commands |
| Git guard | Refuses every command of Claude's that commits or pushes |
| Docs log | Adds a finished task's row to the project's docs log |

## Priority and difficulty

- **Priority:** urgent, high, mid, okay, low, in that order.
- **Difficulty:** light, medium, hard. A task has two: the one expected when it is filed (guessed by the message check, changeable), and the one it turned out to be (picked when it is done).
- **Queue order:** priority first, then oldest first within a priority.

## A task's life

A task is **queued**, then **current**, then **done**. A queued task can also be **removed**, and a current one put **back in the queue**.

### Filing a task

A message the check judges new is held back: Claude never sees it. The band above the prompt shows the title, the priority buttons and the difficulty with the guess picked. **Save** queues it and a toast says "Queued: <title> (high)". **Same task** sends the message to Claude after all.

When nothing is current, the saved task starts straight away.

### Starting a task

This happens when nothing is current and a task is filed, or when Rohan picks the next task from the panel.

1. **Git check.** Nothing may be uncommitted and the branch must have no commits that haven't been pushed. A branch that has never been pushed, or a repository with no remote, counts as not pushed. When the check fails, the panel says what is left ("3 files not committed · 2 commits not pushed") with **Check again**, and the task waits. The mod never commits or pushes.
2. **Branch.** It makes `task/<short-title>` from the branch checked out now (the last task's branch) and switches to it. A taken name gets `-2`, `-3` and so on. It notes the commit the task started from. A task that was put back in the queue switches to its own branch instead, and keeps its start commit and start date.
3. **Fresh conversation.** It clears the conversation (`/clear`) and sends the first message: the task's title and the messages filed with it.

### Finishing a task

1. Claude tells the mod when a reply looks like it finished what the task asked (see [Telling the mod a task looks done](#telling-the-mod-a-task-looks-done)). The panel asks "Is <task> done for now?" with **Yes** and **Not yet**. `/done` asks the same at any time.
2. After **Yes**, the band asks for the difficulty it turned out to be, with the expected one picked.
3. The mod measures the change in git, writes the task to the record and adds its row to the docs log. The docs log row is an uncommitted change, so it goes into the commit Rohan makes next.
4. The panel shows the whole queue with each task's priority and difficulty, the top row marked as the suggestion. Rohan presses a task and **Start**, which runs [Starting a task](#starting-a-task) from the git check.

### Putting a task back

**Back to queue** in the panel puts the current task back in Up next. The mod first asks Claude for a handoff note and saves it with the task; then the task is queued again with its branch, start commit, time and priority kept, and the panel asks for the next task. When the note can't be written, the task is still put back and the panel says so. Starting it later runs the git check, switches to its branch, and sends the first message with the note.

### Coming back later

A session that opens in a project with a current task shows that task in the panel with **Continue**. Continue sends the first message from the latest handoff note and the task's messages. When the checked-out branch is not the task's branch, the panel says so and offers **Switch**. Switch works only when nothing is uncommitted; otherwise the panel says what is uncommitted and leaves it to Rohan.

## The message check

- **Checks:** every message Rohan types. Not slash commands, and not messages the mod sends itself.
- **How:** one short model question over the conversation as it stands (`$.model.fork`), so most of it is served from the prompt cache. The answer is a small JSON object.
- **Answers:**

  | Answer | What happens |
  | --- | --- |
  | Same task | The message goes to Claude |
  | New task | Held back; [Filing a task](#filing-a-task) |
  | Quick question | A side question that isn't work to queue ("what does this error mean?"). It goes to Claude and is not filed |
  | Can't tell | The band shows **Same task**, **New task** and **Quick question** |

- **Also answers:** understanding or improving, for every message; a short title and a difficulty guess for a new task.
- **With nothing current:** a message that is work becomes a new task; a quick question goes through.
- **While it runs:** the status line says "Queue-tea: checking your message…".
- **When it fails** (a model error, or no answer within 10 seconds): the can't-tell buttons, with a line saying the check didn't run. It never guesses. The error goes to the debug log.
- **`/steep <message>`** files the message as a new task with no check.
- **`/brew <request>`** (or `/instant`) and **`/tea <question>`** skip the check: the words go to Claude as Rohan's own, in this conversation, with no task, branch change or clear. See [Errands](#errands).

### Errands

An errand is work Rohan wants done now without filing it (`/brew`, `/instant`) or a question Rohan wants answered (`/tea`).

- **What Claude reads:** the command leaves a hidden note before the words. It says this is outside the queue, that the current task, its branch and the queue stay as they are, and not to call `task_looks_done`. For `/brew`, it says to do the work rather than describe it and to check it worked (for a server: that it is listening, and its URL). For `/tea`, it says to change no files.
- **During its turn:** a `task_looks_done` call asks nothing. A fresh conversation past the size waits for the next turn; the handoff note at the allowance mark is still written.
- **Time:** goes to the project, as after a quick question, until the next task message.
- **Guards:** unchanged. Claude's commits and pushes are still refused.

## Keeping usage down

Every reply re-reads the whole conversation, so a long conversation makes each message use more of the 5-hour allowance. Conversations are kept short:

1. **A fresh conversation for every task** ([Starting a task](#starting-a-task)).
2. **A fresh conversation by size, mid-task.** After each turn the mod reads the conversation's size (`$.session.usage()`). Past 100,000 tokens, it asks Claude for a handoff note (`$.model.fork`), saves it with the task, clears the conversation and sends the first message from the note. Same branch, no git check. The question names the five headings and gives what git says at that moment (branch, last commit, files not committed), so the note's Current state need not guess.
3. **The allowance on show.** The five-hour window's use and reset time, from the rate-limit readings, in the panel and the status line: "5h: 62% · resets 16:40".
4. **A handoff note at 90% of the allowance**, written straight away, so a limit reached partway through a task loses nothing; work carries on from the note after the reset.

When the handoff note cannot be written, the conversation is not cleared. The status line says so and the mod tries again after the next reply.

### What the mod itself costs

- The message check: one small call per typed message, its conversation part mostly read from the cache.
- A handoff note: one call when a conversation is cleared mid-task.
- Telling the mod a task looks done adds no call ([below](#telling-the-mod-a-task-looks-done)).

### Telling the mod a task looks done

The mod registers a tool for Claude (`$.tool.register`, listed from the start) and adds a short section to the system prompt saying when to call it: when a reply has finished what the current task asked. Calling it opens the "done for now?" question in the panel. This costs no extra model call, which a check after every reply would.

The tool takes one optional argument, `checked`: a line on what Claude checked before calling ("ran the tests: 143 pass"). The panel shows it under the question as "Claude checked: …".

## What Rohan sees

### The panel

It opens by itself at the start of a session when the terminal is wide enough to seat it, and `/queue-tea` opens it at any time, with the keys. It is drawn like a terminal board, its sections stacked so it fits beside the chat. Top to bottom, with made-up tasks:

```
Queue-tea · example-app            5h: 62% · resets 16:40
 ▶ In progress (1)                                (orange)
  [high] Add dark mode
  Medium · task/add-dark-mode · 1h 12m
d: Done  b: Back to queue
 ○ Up next (2)                                    (grey)
★ [urgent] Fix the login timeout
  Hard · waited 2h
  [low] Tidy the settings page
  Light · waited 1d
 ✓ Done this week (3) · 6h 40m                    (green)
✓ Write the onboarding text · done 3h
M ▃  T ▆  W ▁  T █  F    S    S
p: actions · tab move · enter press · esc back to the chat
```

- **Header:** "Queue-tea · <project>" with the allowance on the right.
- **Lines under it, while they apply:** a warning about a commit made during a turn (with **OK**), the message check running, work in progress ("Saving a handoff note…"), a notice.
- **In progress:** a solid bar, then the current task's priority tag (coloured by priority), its title cut with "…" to fit, and a dim line: expected difficulty, branch, time so far. Then, while they apply:
  - the git check's hold, with **Check again**; a branch mismatch, with **Switch**;
  - "Is this done for now?" with **Yes** and **Not yet**, and "Claude checked: …" when Claude said;
  - the handoff card and **Continue** (below);
  - **Done**, which goes straight to the difficulty band, and **Back to queue**.

  With nothing current: "No task in progress." and **Start ★ <task>**.
- **Up next:** a grey bar with the count, then the queue in order. Each row: ★ on the suggestion, the priority tag, the title; a dim line with the expected difficulty, how long it has waited, and for a task put back its branch and time so far. Pressing a row opens **Start** (while nothing is current), the five priorities and **Remove**.
- **Done this week:** a green bar with the count and the week's time, this week's finished tasks, latest first, five at most ("done 3h"), and the week chart: one bar a day, Monday to Sunday, the busiest day full height, a day with no time blank.
- **Key hints:** one dim line. Hotkeys work only while the panel has the keys; when it hasn't, the line says how to give them to it (ctrl+x tab, or a click).

#### The handoff card

Shown with **Continue**: the latest handoff note in a frame, with when it was written, as numbered sections (1 Overview, 2 What changed, 3 Current state, 4 Decisions, 5 Next steps). Points under Next steps are drawn as ☐, under What changed as ✓. A note in an older shape is split at its own headings ("Done:", "Left:"); a note with fewer than two headings is shown as plain text.

#### Keys and the palette

| Key | Does |
| --- | --- |
| `s` | Start: the open row, or ★ when no row is open |
| `d` | Done: the difficulty band |
| `y` / `n` | Yes / Not yet, to "Is this done for now?" |
| `b` | Back to queue |
| `c` | Continue |
| `w` | Switch to the task's branch |
| `r` | Check again; Try again when the record can't be read |
| `1`–`5` | The open row's priority, urgent to low |
| `x` | Remove the open row |
| `o` | Dismiss the commit warning |
| `p` | The palette, and back to the board |

The palette lists only what can be done now, each with its key and a dim line saying what it does, and a **New task** field that files what is typed (the band then asks for its priority). While it is open it takes the board's place, so no key does two things.

States:

| State | Shows |
| --- | --- |
| Loading | A turning character (the terminal has no circular spinner) and "Reading your queue…" |
| Empty | "Nothing queued yet. Tell me what you're working on and it becomes the first task." |
| Failed | What went wrong in plain words ("Couldn't read your task record") with **Try again**. The error goes to the debug log |
| Working | A turning character and what is happening: "Checking your message…", "Saving a handoff note…" |

### The band above the prompt

Only while it needs Rohan: filing a new task, the can't-tell choice, the difficulty at the end of a task.

### The status line

"Queue-tea: <task> · 1h 12m · 5h 62%", or "Queue-tea: checking your message…" while the check runs.

### Commands

| Command | Does |
| --- | --- |
| `/queue-tea` | Opens the panel and gives it the keys (when the prompt is empty) |
| `/done` | Asks whether the current task is done for now |
| `/steep <message>` | Files the message as a new task, no check |
| `/brew <request>` | Does it now, outside the queue (see [Errands](#errands)) |
| `/instant <request>` | The same as `/brew` |
| `/tea <question>` | Answers or explains, outside the queue, changing no files |

## The record

### Where

One file per project: `~/.queue-tea/projects/<folder>-<hash>.json`, where `<folder>` is the repository's top folder name and `<hash>` six characters from its full path, so two repositories with the same folder name (two `frontend` folders) don't share a file. It sits outside every repository and is never committed. Records from before the rename to Queue-tea, in `~/.queue-tie/projects/`, are copied over the first time `~/.queue-tea/projects/` is missing; the old folder is left as it was.

### Writing it

The mod reads the file again just before each write and changes only the task it is working on, so two sessions in the same project don't undo each other. A write never leaves a half-written file behind.

### What a task holds

- id, title, priority, expected and actual difficulty
- state: queued, current, done, removed
- the messages filed with it, and its latest handoff note with its date
- its branch and the commit it started from
- created, started and finished dates
- time, per day
- effort (below)

An example with made-up values:

```json
{
  "project": { "name": "example-app", "path": "/Users/example/projects/example-app" },
  "docsLogPath": "docs/task_log.md",
  "tasks": [
    {
      "id": "t-0001",
      "title": "Retry button on the scan page",
      "state": "done",
      "priority": "high",
      "difficulty": { "expected": "light", "actual": "medium" },
      "messages": ["The scan page needs a retry button when Bluetooth is off"],
      "handoff": null,
      "branch": "task/retry-button-scan-page",
      "startCommit": "a1b2c3d",
      "created": "2026-10-21T09:12:00+02:00",
      "started": "2026-10-21T09:13:00+02:00",
      "finished": "2026-10-21T11:02:00+02:00",
      "minutesByDay": { "2026-10-21": 84 },
      "effort": {
        "understandingMessages": 3,
        "improvingMessages": 7,
        "filesRead": 12,
        "filesChanged": 4,
        "linesAdded": 160,
        "linesRemoved": 38
      }
    }
  ],
  "unassignedMinutesByDay": { "2026-10-21": 9 }
}
```

### Time

The time between two moments of activity (a message of Rohan's, a turn of Claude's starting or ending, a tool call) counts when the gap is 15 minutes or less, and not at all when it is longer. It goes to the current task, by day, so a week adds up across days. Quick questions, and anything while no task is current, count toward the project (`unassignedMinutesByDay`) and no task.

### Effort

- Understanding and improving messages, from the message check.
- Files read and files changed by Claude, counted from Claude's tool calls, each file once.
- Lines added and removed and files touched, from git when the task is done: the task's start commit against the files as they are, uncommitted work included. New files that git does not track yet are not counted.

## The docs log

- **Where:** set per project in the record (`docsLogPath`). The first time a task is finished in a project, the band asks for it, suggesting `docs/task_log.md`.
- **Holds:** titles and numbers about the work only; never message text, never anything from a recording.
- **Shape:** newest first, one heading per date. An example with made-up values:

```markdown
# Task Log

Every task finished in this project, newest first. Written by Queue-tea.

## 2026-10-21

| Task | Priority | Difficulty | Time | Branch |
| --- | --- | --- | --- | --- |
| Retry button on the scan page | High | Light → Medium | 1h 24m | `task/retry-button-scan-page` |
```

## The git guard

Refuses Claude's shell commands that commit or push, side effects included:

- `git commit` (and `--amend`), `git push` (and `--force`, `--tags`)
- `git merge`, `git rebase`, `git cherry-pick`, `git revert`
- `gh repo create --push`, `gh pr merge`

It finds them inside chained commands (`cd x && git commit`) and with `git -C <path>`. Claude is told "Queue-tea: commits and pushes are yours to make." When the guard itself fails, it refuses. It matches command spellings, so it catches the usual forms but not every possible one. The mod's own git work (status, branches, the diff) runs as its own processes and is not blocked.

Because the guard can miss a spelling, the mod also looks after each turn: it notes the commit checked out when a turn starts, and when the turn ends on the same branch with new commits on top, a toast and a warning line in the panel name them ("During the last turn a commit appeared: 1a2b3c4 …"). A commit Rohan makes in another terminal during a turn is named too; the line asks him to check it was his. A change of branch is not counted.

## When things go wrong

| Case | What happens |
| --- | --- |
| Not a git repository | Queue, time and effort work; the panel says "Not a git repository, so no branches are made" |
| Branch never pushed, or no remote | Counts as not pushed: "This branch has never been pushed", with **Check again** |
| Detached HEAD | The panel says so and the task waits |
| Branch name taken | `-2`, `-3` and so on |
| Handoff note not written | No clear; the status line says so; tried again after the next reply |
| Record cannot be read or written | The panel's failed state with **Try again**; nothing is cleared or started until it works |
| Two sessions in one project | They share the record; the panel reads it again after each turn |

## Settings

| Setting | Default |
| --- | --- |
| Idle gap that stops the clock | 15 minutes |
| Conversation size that starts a fresh one | 100,000 tokens |
| Allowance use that writes a handoff note | 90% |
| Message check time limit | 10 seconds |
| Docs log path | asked per project, `docs/task_log.md` suggested |

The first four are `userConfig` options, changeable in `/config`.

## What the board will need

The board is a separate project. Everything it shows comes from the record files, so the record already holds:

- every project, by name and path
- each task's dates, priority, both difficulties, branch and state
- minutes per day, per task and unassigned, so any week adds up
- effort: understanding and improving messages, files read and changed, lines added and removed

## Testing

- **`claude plugin test`**, with git, the model and the clock faked:
  - queue order
  - each git check result
  - each message check answer, and the check failing or timing out
  - the guard refusing each command listed above, and allowing `git status`, `git log`, `git diff`
  - the 15-minute time rule across days
  - the record's read-again-then-write
  - the panel's loading, empty and failed states, drawn on the terminal and desktop surfaces
- **`claude plugin validate`** and a type check.
- **A live try** in a throwaway git repository: file tasks, see the band and the panel, finish one, start the next, cross the conversation size.

## Where it lives

- **Source:** `~/Documents/projects/personal_projects/queue-tea/`, its own git repository, committed by Rohan, and on GitHub at https://github.com/whoseunassailable/queue-tea (public, MIT).
- **Installed** for Rohan's user from that folder as a local marketplace, so it loads in every project and every new session, and `/reload-plugins` picks up edits to the folder.
- **Built** in the session's mods folder first, where it reloads on every change, then moved here.

## To confirm while building

- `$.fs` can write under `~/.queue-tea/`, outside the project folder. Confirmed: the records are written there.
- The write that never leaves a half-written file. Built: a temporary file, then `mv -f` over the record.
- The panel opens by itself only where the terminal seats it beside the chat.
