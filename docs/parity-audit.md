# Audit: what the menu exposes of the engine

Done 2026-10-22, at commit fc0ae3f (added animated menu). It compares the tea-cup menu (`hooks/ui/menu.tsx`, `band.tsx`, `cup.ts`) with the engine (`hooks/flow.ts`, `actions.ts`, `plan.ts`) and [plan-board-recovery.md](plan-board-recovery.md). No code was changed. 200 tests pass and `claude plugin validate` passes.

Line numbers are as of fc0ae3f. When a gap is fixed, tick it here so a fresh conversation can carry on from this file.

## The eight items

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Cancel an intercepted message | Missing, in both the engine and the band | `band.tsx:148-151` has only Save and Same task; `band.tsx:161-165` has only Same task, New task and Quick question |
| 2 | Block / Unblock | Built, but not connected: no button, rather than a broken one. Neither the old panel nor the menu ever had one | `blockTask`, `unblockTask` at `flow.ts:597-627`; `pressBlock`, `pressBlockWith`, `pressUnblock` at `actions.ts:256-272`. Keys `k` and `u` are defined in `keys.ts`, but no UI file calls these |
| 3 | Play next | Built, but not connected | `togglePlayNext` at `flow.ts:631-634`; `pressPlayNext` at `actions.ts:274-276`. Key `f` is defined but unused |
| 4 | Time I have | Built, but not connected | `pressBudget` at `actions.ts:279-281`. Key `t` is defined but unused |
| 5 | Smart ranking | Partial: it only decides what Start ★ starts | `rankBacklog` (`plan.ts:111`) is used only by `suggest` (`plan.ts:155`). The menu (`menu.tsx:95`) and the cup (`cup.ts:79`) use `orderQueue` |
| 6 | Other projects | Partial: read, never shown | The `others` view is filled (`ports.ts:32`); no UI file reads it |
| 7 | Branch drift | Partial: worked out, never shown | `readDrift` sets `drift` (`flow.ts:646`); no UI file reads it |
| 8 | History and usage | Partial | Usage always shows +0 −0 lines for the current task |

## Problems not on the list

- **The Continue card never appears after a successful handoff.** The card reads only `task.handoff` (`menu.tsx:322`), but a successful handoff saves a checkpoint and sets `handoff` to null (`flow.ts:459-464`).
- **Start ★ can start a different task from the one it names.** The label shows the top of `orderQueue` (`menu.tsx:362`), while pressing it starts what `suggest` ranks first (`actions.ts:251`).
- **Quick question does the same as Same task.** Both buttons run `sendHeld` (`band.tsx:162`, `band.tsx:164`).

## Order to fix them

The task data and the Git safeguards stay as they are throughout. The tea-cup icon and popover redesign wait until these are done.

- [x] 1. Cancel in the band and the engine. Fix Quick question in the same change, since both are in `band.tsx`. Done: `dropHeld` (flow.ts), `cancelHeld` and `sendQuick` (actions.ts), a Cancel button on both bands. A held message was also counted twice, at the check and again on Same task; it is now counted once, when sent (register.tsx).
- [x] 2. The Continue card reads the checkpoint, not only `handoff`. Done: `cardNote` (ui/handoff.ts) draws the checkpoint's sections. `latestNote` (checkpoint.ts) picks the note for the card and the first message alike; before, a plain note written after a checkpoint was ignored by the first message.
- [x] 3. Block/Unblock, Play next and Time I have get their buttons, and the menu and cup switch to `rankBacklog`, all in one change. Done in menu.tsx and cup.ts: the Backlog is ranked, each row shows its estimate, ★ has a line saying why, blocked tasks have their own section, and Blocked… asks what the task waits for or why. Start ★ and the cup now name the task `pressStartNext` starts. Play next and Time I have change only `rankBacklog`'s order, so adding them without the switch would make the Start ★ label and `pressStartNext` disagree more often. The switch also fixes the mismatch above.
- [x] 4. Show other projects and branch drift. Done in menu.tsx: Other projects at the foot of the Backlog, the drift lines under the current task in the warning colour.
- [x] 5. Usage shows the current task's real line counts. Done: `refreshLines` (flow.ts) measures them from the start commit at a session's start and after each turn, into a `lines` view value marked with the task's id; Usage leaves them out until measured.
