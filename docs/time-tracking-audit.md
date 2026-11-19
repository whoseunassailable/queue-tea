# Time and mana tracking: audit (Q01.1)

What Queue-tea measures today, where it keeps it, and where the numbers go wrong. Written on 2026-11-19 from the code on `main` at `9bf562b` and the records under `~/.queue-tea/projects/`. It is the starting point for Q01.2 to Q01.9; nothing here changes behaviour.

The next step is the [proposed interval and attribution design](time-tracking-design.md), which covers persistence, overlapping sessions, manual work, usage and corrections.

## What is measured

### 1. The session's activity clock

The only clock that produces quest time. Each Claude Code session with the mod keeps one, from session start until it ends.

- **What stamps it:** a typed prompt, the start of every tool call Claude makes, and the end of each main turn. Nothing else does: no keypress, no command run in another terminal, no edit in another program.
- **How a gap counts:** the time between two stamps counts in full when it is at most the idle gap (15 minutes by default, `idleGapMinutes` in the plugin options), and counts **nothing** when it is longer. A 14-minute gap adds 14 minutes; a 16-minute gap adds 0.
- **Where it goes:** to the day of the later stamp, on one of two counters:
  - the current task's minutes for that day, when a task is current for the session's folder, it is not with Codex, and the last checked message was not judged a quick question;
  - otherwise the realm's "Elsewhere" minutes for that day.
- **When it is saved:** the minutes wait in memory and are written into the record at the end of each turn, at session end, before a `/clear` during a task, and before the queue or the current task changes.

| Part | Where |
| --- | --- |
| Gap rule, day keys | `hooks/shared/time/domain/services/time.ts` (`accrue`, `dayKey`, `addMinutes`) |
| The tracker and how its minutes land | `hooks/shared/effort/domain/services/effort_tracker.ts` (`createTracker`, `applyPending`) |
| Writing to the record | `hooks/shared/effort/presentation/state_management/effort_controller.ts` (`flush`) |
| What stamps it | `hooks/register.tsx` (`prompt.submit`, `tool.call`), `hooks/app/session/session_rhythm.ts` (`afterEachTurn`, `checkTyped`) |
| Callers of `flush` | `session_rhythm.ts`, `register.tsx` (`session.end`), `tasks_controller.ts`, `queue_controller.ts`, `requests_controller.ts` |

### 2. Codex time

When a task comes back from Codex, Queue-tea reads Codex's log for the moments since it went and counts them with the same gap rule, onto the task. While the task is with Codex, any Claude Code session in its folder counts to Elsewhere instead. (`hooks/features/tasks/domain/usecases/leave_codex.ts`)

### 3. Activity steps

Every tool call Claude makes during a task is saved on the task as a step with its start and finish times (read, edit, write, command, test), beside the branch steps the app adds when a quest starts. These have accurate timestamps, but nothing turns them into time. (`hooks/shared/activity/`)

### 4. The time budget

"Time I have" on the app's board is a number of minutes per realm, held in the app's memory only and lost on quit. It ranks the board; it is not tracked time. (`app/main/features/projects/data/budgets.ts`)

### 5. Mana

Mana is **Claude Code's 5-hour allowance**, and only that: `100 − percent used`, taken from the newest session that reported its rate limits (`session.measure` and after each turn). It is the same number for every realm and quest, since the allowance belongs to the account.

- No timer touches it. The roadmap's worry, "mana should not decrease because a timer is running", already holds today.
- What is missing is the other side: **AI usage per quest is never recorded.** Each turn reads the conversation's tokens and the allowance for the handoff rules, and none of it is kept per quest.
- The Mana page shows the allowance beside this week's minutes, the active quest's minutes, its message counts (understanding, improving), files read and changed by Claude, and lines changed since the task's first commit.
- XP and gold come from a victory's difficulty only, never from time.

| Part | Where |
| --- | --- |
| Reading the allowance | `hooks/register.tsx` (`session.measure`), `readAllowance` |
| The Mana page's data | `app/main/features/mana/api/mana_api.ts`, `app/main/features/mana/domain/mana.ts` |
| Mana left and refill time | `app/renderer/core/domain/format.ts` (`manaLeft`, `refillTime`) |
| Day and week totals | `app/main/features/chronicle/domain/chronicle.ts` (`dayTimeOf`, `totalOf`) |

## Where it is kept

| What | Where | Survives a restart? |
| --- | --- | --- |
| Minutes per task per day | the record, `tasks[].minutesByDay` | yes, as day totals only |
| Elsewhere minutes per day | the record, `unassignedMinutesByDay` | yes, as day totals only |
| Minutes since the last save | the session's memory | no |
| The last stamp and where minutes go (task or Elsewhere) | the session's memory | no; a new session starts with no last stamp |
| Activity steps | the record, `tasks[].activity` | yes, with timestamps |
| Which session is live, its allowance | `~/.queue-tea/sessions/<id>.json`, beat every 30 s, stale after 90 s | yes |
| Time budget | the app's memory | no |

The record keeps **totals, not intervals**. Once minutes are saved, nobody can tell when they happened, which session they came from, or whether two of them overlapped. That alone rules out Q01.7's reconciliation and Q01.9's corrections on the current data.

## Gaps

Each has a way to see it. The record checks use the one-liner at the end.

### G1. Work outside Claude Code counts nothing

Only Claude Code events stamp the clock. Editing in another program, running the app, testing by hand on a phone, reading docs or running commands in a separate terminal leave no stamp.

**See it:** start a task, send one message, then work in another editor and terminal for 40 minutes and send a second message. The task gains 0 minutes for those 40, because the gap is over 15.

### G2. A gap over the limit counts zero, not the limit

The rule throws the whole gap away. Rohan reading a long answer for 16 minutes, or watching a 20-minute end-to-end run, adds nothing; the same at 14 minutes adds 14.

**Seen in the record:** "Notes: website bookmarks with link previews", 2026-11-14: 180 steps, one 426-minute gap between them, 55 minutes recorded for the day.

### G3. A long tool call counts zero

The stamp is taken when a tool call starts, not when it ends. A test run, build or install that takes more than 15 minutes leaves a gap over the limit, so Claude's longest working stretches count nothing.

**See it:** during a task, have Claude run a foreground command that takes over 15 minutes, such as the app's full end-to-end suite. The task gains nothing for that call.

### G4. Time sticks to Elsewhere after a quick question

A typed message judged a quick question sends the session's time to Elsewhere "until the next task message". Only a typed message judged to belong to the task sends it back. These do not:

- a `/clear`, which keeps the same clock and its setting;
- the task message Queue-tea itself sends at the start of a task or after a handoff, since the mod never sees its own messages;
- slash commands, held messages and messages with attachments, which are not checked.

**Seen in the record:** queue-tea, 2026-11-17: four quests logged 324 steps between them and got 0.1 minutes in all, while Elsewhere got 286 minutes. One of them, "Notes: backup, export and restore", ran 136 steps from 02:09 to 04:18 (83 commands, 42 test runs), so most of those two hours had gaps under 15 minutes and were counted, just not on the quest. The steps prove each quest was current for its session's folder, which leaves this routing, or a task with Codex, as the only ways its minutes could reach Elsewhere. The session opened with "is this task done?", which reads as a quick question, then went on through two `/clear`s and Queue-tea's own task messages; its later "continue"s should have sent time back unless they were held for the band. Which verdicts the checker gave is not logged, so the trigger is likely but not confirmed. A real-session probe (a quick question, a `/clear`, then work) would confirm it.

### G5. Parallel sessions add up

Each session counts its own clock, and day and week totals add every task and Elsewhere together. Two quests worked in two worktrees for the same hour show two hours. Two sessions in the same worktree both count onto the same task.

**Seen in the record:** queue-tea, 2026-11-18: "Notes: knowledge graph view" and "Designs: approve a version, and go to the next design" overlap by 54 minutes of activity. Gait-feedback, 2026-11-12: 95 minutes of overlap across its quests that day.

The code audited here has no overlap rule, so its Realm total can be larger than elapsed work time. Rohan clarified Q01.7 on 2026-11-19: a Realm's daily total merges its work periods, while task measurements remain separate. That rule is implemented on this task branch; [daily work time in a Realm](realm-work-time.md) describes it. The observations in this audit still refer to the original `main` revision above.

### G6. Errands count on the quest

`/brew`, `/tea` and `/instant` are "outside the queue", but the clock does not know it: their tool calls stamp it like any other, and the minutes go to the current task (or Elsewhere, under G4). Only the activity steps skip errands.

**See it:** this audit was written in a `/brew` errand in the Q01 worktree. Its minutes land on Q01.

### G7. A session that ends abruptly loses its unsaved minutes

Minutes are saved at the end of each turn and at session end. A session killed mid-turn without its end hook running (a crash, or the terminal window closed) loses the minutes of that turn.

### G8. Idle time inside the limit counts as work

Up to 15 minutes of each gap counts whatever happened in it: Rohan away from the desk, waiting for Claude, or reading. Time Claude spends working, time Rohan spends working and time nobody works are one number.

### G9. No kinds of time

There is no AI, manual, review or waiting split. Steps already tell some of it apart (a test step is verification, a turn running is Claude working), but nothing uses them for time.

### G10. Smaller ones

- A gap that crosses midnight goes wholly to the later day.
- The time budget is forgotten on quit.
- Mana is account-wide and comes from whichever session reported last; a stale one is marked as last seen.

## What each child quest starts from

| Child | Starts from |
| --- | --- |
| Q01.2 Terminal session tracking | The session file already ties a session to a folder and so to a quest; nothing ties a plain terminal to one (G1). |
| Q01.3 Manual development tracking | No signal exists outside Claude Code (G1). Needs a new source: the app's own activity, file changes in the worktree, or an explicit "working" toggle. |
| Q01.4 Idle detection | The idle gap exists, but it drops the whole gap instead of stopping the clock (G2, G3) and counts idle time under it (G8). |
| Q01.5 Session persistence | Totals survive; the last stamp, the routing and unsaved minutes do not (G4, G7). |
| Q01.6 Mana recalculation | Mana is already free of timers. Missing: AI usage per quest, kept beside time and effort. |
| Q01.7 Concurrent activity | Needs intervals in the record before any rule can be applied (G5). |
| Q01.8 Quest analytics | Needs kinds of time (G9) and intervals. Expected vs actual difficulty already exists on victories. |
| Q01.9 Manual corrections | Needs intervals to correct; a day total can only be overwritten. |

The common thread: Q01.5, Q01.7, Q01.8 and Q01.9 all need the record to keep **intervals** (start, end, quest, kind, source) instead of only day totals. Day totals can then be worked out from them for every reader that uses them today: the board's ranking, the tea cup, the Chronicle, the Mana page, the log row and the finish view.

## Checking the record

Per day, each quest's recorded minutes beside the span of its activity steps, and how much the quests' spans overlap (offset for US Central time):

```sh
node -e '
const r = require(process.env.HOME + "/.queue-tea/projects/queue-tea-a60ae6.json")
const day = process.argv[1]
const rows = r.tasks.filter(t => t.minutesByDay?.[day]).map(t => {
  const at = (t.activity || []).flatMap(a => [a.at, a.finished]).filter(Boolean).map(Date.parse)
    .filter(ms => new Date(ms - 6 * 3600e3).toISOString().startsWith(day)).sort((a, b) => a - b)
  return { title: t.title, minutes: Math.round(t.minutesByDay[day]), start: at[0], end: at.at(-1) }
})
let overlap = 0
for (const [i, a] of rows.entries()) for (const b of rows.slice(i + 1))
  if (a.start && b.start) overlap += Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start))
for (const x of rows) console.log(x.minutes + "m", x.start ? Math.round((x.end - x.start) / 6e4) + "m of steps" : "no steps", x.title)
console.log("Elsewhere", Math.round(r.unassignedMinutesByDay[day] ?? 0) + "m", "· overlap", Math.round(overlap / 6e4) + "m")
' 2026-11-18
```
