# Daily work time in a Realm

A Realm's daily work time merges its recorded work periods. Task time remains independent. If task 1 runs from 1 pm to 4 pm and task 2 from 2 pm to 5 pm, both retain 3 hours while the Realm shows 4 hours, from 1 pm to 5 pm.

Gaps are excluded. Work from 9 am to 10 am and 2 pm to 3 pm contributes 2 hours. Selecting a task or working on another Realm does not take time away from a running task.

## Where the total appears

**Mana & time** uses the merged Realm time for Today, This week and the comparison with last week. Its per-quest bars and active-quest time keep each task's own minutes. **Chronicle** uses the same Realm calculation. The mod's weekly chart and Usage & time totals also use it.

The chart's **On quests** value merges all timed quest work. **Elsewhere** adds timed work outside quests only where it extends that Realm's timeline, so their sum counts overlaps once. Saved task and Elsewhere counters keep their own values. In Chronicle's **All realms** view, each Realm's independent total is added; simultaneous work in two different Realms can appear in both.

## Recording and recovery

The existing activity clock still determines which gaps count: a prompt, tool start or turn end stamps it, and gaps longer than the configured idle limit are excluded. The default limit remains 15 minutes. This change preserves those task-time rules and also saves the counted gaps as work periods.

When a task returns from Codex, its log timestamps produce the same periods under the existing gap rule. They merge with periods already recorded by Claude. Concurrent requests to return the same Codex task apply its time once.

The periods live in the optional `realmTime` field of the Realm's existing record under `~/.queue-tea/projects/`. Each day holds merged quest and Elsewhere periods, plus counters identifying how much of the existing minute totals those periods represent. Touching periods merge too, so ordinary continuous work does not save one entry per tool call.

Period data and minute counters are saved together under the existing record lock, backup and atomic replacement. Two sessions update the latest saved record. Closing and reopening the app retains the periods. A fresh tracker contributes only gaps between its new stamps; closed time is not added automatically. Malformed saved periods make the record unreadable and use the existing recovery flow.

Realm periods split at midnight using the recording session's local UTC offset. Task counters retain their existing rule for which day receives a gap. Realm reports round the merged duration to two decimal minutes after merging.

## Earlier recorded time

Older records contain daily counters without their start and end times. Their overlaps cannot be reconstructed reliably. The calculation preserves those minutes as recorded, then adds the merged time backed by new periods. Minutes added by an older tracker are preserved in the same way.

As a result, a day containing older time can still include historical double counting. New periods do not rewrite those old numbers or invent a continuous span between a task's start and finish dates.

## Scope

This implements the confirmed Realm daily-total rule. The broader [Q01 design](time-tracking-design.md) also proposes manual tracking controls, new idle classifications, usage accounting and interval corrections; those features are separate work. This change does not add them or change the installed app before integration and deployment.

| Code | Responsibility |
| --- | --- |
| `hooks/shared/time/domain/services/realm_time.ts` | Merge periods, split days, preserve untimed minutes and calculate Realm totals |
| `hooks/shared/effort/domain/services/effort_tracker.ts` | Save periods beside the live clock's existing counters |
| `hooks/features/tasks/domain/usecases/leave_codex.ts` | Import Codex periods within the same record transaction as its task minutes |
| `hooks/shared/records/data/datasources/record_source.ts` | Validate saved period data and keep existing persistence and recovery |
| `app/main/features/chronicle/domain/chronicle.ts` | Shared daily values used by Chronicle and Mana |
| `hooks/shared/time/domain/services/week_stats.ts` | Weekly totals used by the mod |

## Verification

`app/main/features/chronicle/domain/realm_time.spec.ts` covers the 4-hour example, gaps, nested and touching work, independent Realms, Elsewhere overlap, untimed older records, local midnight, idle gaps, malformed data and compact storage. Its persistence tests use real temporary files and the app's host, including concurrent writers and duplicate concurrent Codex returns.

`app/e2e/realm_time.e2e.ts` records synthetic periods through the real tracker, saves them, opens Mana and Chronicle, and checks 4 Realm hours and both 3-hour task bars. It closes and reopens the test app and checks the same saved values again.

Verified on 2026-11-19:

| Command | Result |
| --- | --- |
| In `app/`: `npm_config_offline=true npm test -- --maxWorkers=2` | 2,110 passed; 28 existing opt-in tests skipped |
| In `app/`: `npm run e2e` | 146 passed; 9 existing opt-in tests skipped |
| `claude plugin test .` | 430 passed, 0 failed |
| In `app/`: `npm run typecheck` | Exit 0 |
| `node app/node_modules/typescript/bin/tsc -p .` | Exit 0; generated plugin declarations prepared in this checkout |
| `node tools/check_layers.mjs` | Exit 0 |
| `node --test 'tools/*.test.mjs'` | 42 passed, 0 failed |
| `claude plugin validate .` | Passed with the validator's scope warnings |

The original 8-test regression run printed 6 failed and 2 passed before the implementation, including 360 Realm minutes instead of 240 for the overlapping example. The final focused file has 11 passing tests. The first sandboxed full app run stalled; the completed full run above used the same source outside the sandbox with two workers.
