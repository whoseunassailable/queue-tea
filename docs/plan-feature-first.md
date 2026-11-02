# Feature-first restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `hooks/` from 28 flat files into the feature-first, MVVM shape of `docs/architecture.md`, with nothing changing for the person using Queue-tea.

**Architecture:** Three layers per feature, `shared/` for what two features need, `core/` for what everything needs, `app/` to compose them. Today's `flow.ts` functions keep their names and signatures as controllers, so the tests keep working; their decisions move down into use cases that return results, and their screen writes stay in the controller. `Ports` stays the one object a controller gets, and `<feature>_providers.ts` builds repositories from it.

**Tech Stack:** TypeScript and TSX against the `claude-code` API, `claude plugin test`, Node for the layer check. No new dependencies.

**Spec:** [architecture.md](architecture.md)

## Global Constraints

- **Nothing changes for the user.** Every string, key, band and order of events stays. Copy code and its comments across; don't rewrite them.
- **Tests keep their assertions.** Only their imports and file paths change, plus new stubs in `fakePorts` where `Ports` grows.
- **The gates, after every task, all from the worktree's root:**
  1. `claude plugin test .`: `0 fail`, and at least as many passing as the task before (296 today, plus the tests this plan adds).
  2. `npx -y -p typescript@5.9 tsc -p .`: no output.
  3. `claude plugin validate .`: `Validation passed with warnings`, one warning (`CLAUDE.md at the plugin root`), and `declares state:` still lists all 28 `queue-tea.*` keys.
  4. `node tools/check_layers.mjs`: exits 0 (from Task 2 on).
- **Work only in the worktree** at `../queue-tea-feature-first`. The installed Queue-tea runs from the main folder, so a half-moved tree there could stop the mod, and its commit guard, at the next load.
- **Claude can't commit.** The mod's guard refuses it. A task's last step hands Rohan the commit command, starting with `! `. Messages are short and lower-case, and have no AI attribution.
- **A move finishes in its task.** No re-export files and no copies. Everything that imported the old path imports the new one before the task ends.
- **`register.tsx`'s `on(...)` calls keep their order.** The guard's position among the `tool.call` hooks matters.
- **Module-level state stays single:** the `once` set, `filing`, `isFreshPending`. Never build these inside a providers file, which runs per call.
- **File names are snake_case; functions keep their names.** A controller function keeps its name, parameters and return value unless a table below says otherwise.

## Review Focus

Nothing in today's tests exercises these. Each gets its test before the code around it moves.

1. **`git commit` through the real hooks.** Today only the matching rule is tested. With the mod loaded, a Bash or Monitor `git commit` must be refused, also when a hook fails. If a move loses this, Claude can commit. Task 1.
2. **The status line after a key press.** It updates from inside `portsOf`, which this restructure rewires. If the wiring is forgotten it stops updating and nothing fails. Task 1.
3. **Back to queue pressed twice, and its "Saving a checkpoint…" line.** Controllers now own both: one checkpoint, and `busy` cleared even when writing fails. Task 1.
4. **An import cycle at load.** Splitting 28 files into about a hundred makes a cycle likely, and a module read before it's initialised stops the mod loading. Task 2.
5. **The cup's `module` path.** It's a string relative to its file, which no type check sees. A wrong one is only found at load. Task 2.

---

### Task 0: A clean start (Rohan runs these)

Nothing moves until these are done. Run from the main folder, in order.

- [ ] **Step 1: Commit the docs**

```
! git commit -m "added workspace app spec and ui design docs"
! git add CLAUDE.md docs/architecture.md docs/plan-feature-first.md && git commit -m "added repository rules, architecture and restructure plan"
```

- [ ] **Step 2: Commit the /brew fix on its own branch**

```
! git switch -c task/brew-slash-words
! git add README.md docs/spec.md hooks/actions.ts hooks/errand.ts hooks/register.tsx tests/errand.test.ts tests/ui.test.tsx && git commit -m "stopped errand words that start with a slash and gave them back"
```

- [ ] **Step 3: Make the worktree**

```
! git worktree add ../queue-tea-feature-first -b task/feature-first-restructure
```

Expected: `git status --short` is empty in both folders.

- [ ] **Step 4: Run the first three gates in the worktree.** Expected: 296 pass, as today.

---

### Task 1: Pin what the tests don't cover yet

These pass on today's code. They exist so a later task can't lose the behaviour unnoticed.

**Files:**
- Modify: `tests/ui.test.tsx`, `tests/features.test.ts`

- [ ] **Step 1: Add the tests, in `tests/ui.test.tsx` beside the other tests that load the mod**

  - `the mod refuses a commit Claude tries through Bash`: a `tool.call` for `Bash` with `git commit -m x` answers `{ deny: 'Queue-tea: commits and pushes are yours to make.' }`.
  - `the mod refuses a push through Monitor`: the same for `Monitor` with `git push`.
  - `the mod lets an ordinary command through`: `git status` isn't denied.
  - `the status line follows the record`: after a key press changes the record, the last `ui.status` text is `statusText(...)` of the new current task. Replace the `ui.status` stub at line 117 with one that records its text.

- [ ] **Step 2: Add to `tests/features.test.ts`**

  - `Back to queue pressed twice writes one checkpoint`: `await Promise.all([putBack(ports, CTX), putBack(ports, CTX)])` gives one `'queued'` and one `'none'`, and `done.toasts` has one entry.
  - `busy shows while the checkpoint is written, and clears when it fails`: with an `ask.fork` that reads `view.busy` and then throws, `view.busy` was `'Saving a checkpoint…'` during it and is `null` after, and the task is back in the queue.

- [ ] **Step 3: Run gates 1–3.** Expected: `302 pass`, `0 fail`.

- [ ] **Step 4: Hand Rohan the commit**

```
! git add tests/ui.test.tsx tests/features.test.ts && git commit -m "added tests for the guard's hooks, the status line and back to queue"
```

---

### Task 2: The layer check

**Files:**
- Create: `tools/check_layers.mjs`, `tools/check_layers.test.mjs`

**Interfaces:**
- Produces: `checkLayers(root: string): string[]`, exported, one plain-worded problem per string. Run as a script, it prints them and exits 1 when there are any.

`.mjs` keeps it out of `claude plugin test` (which runs `*.test.ts(x)`) and out of the type check.

- [ ] **Step 1: Write the tests.** Each builds a small tree in a temp folder and calls `checkLayers`.

  - `a domain file importing a data file is reported`; the same for `claude-code`, and for `core/host`.
  - `a domain file may import its own domain, shared domain and core/env`.
  - `a controller importing claude-code, data/ or an *_impl file is reported`.
  - `a feature importing another feature is reported`, from every layer.
  - `shared importing a feature is reported`; `core importing shared/x/data is reported`; `core importing shared/x/domain/entities is allowed`.
  - `a file outside core, data, views, widgets, app and register.tsx importing claude-code is reported`.
  - `a new file importing a flat legacy file is reported`; `a flat legacy file may import anything`.
  - `an import cycle is reported, naming its files`, counting value imports only, since `import type` is erased.
  - `a module="./x.tsx" naming no file is reported`; `one naming a file passes`.
  - `hooks/flow.ts on the legacy list passes; once LEGACY is empty it is reported`.
  - `a folder on LEGACY_READERS may import a legacy file`.

- [ ] **Step 2: Run `node --test tools/`.** Expected: FAIL, `checkLayers` not found.

- [ ] **Step 3: Implement it.** Read imports with a regex over `from '…'` and `import('…')`, noting `import type`. Keep `const LEGACY = new Set([...])` listing today's flat files, and an empty `const LEGACY_READERS = new Set([])`; each later task removes the names it empties.

- [ ] **Step 4: Run `node --test tools/` and `node tools/check_layers.mjs`.** Expected: all pass, and no problems on today's tree. If it finds a cycle in today's code, list it in a `KNOWN_CYCLES` set with a comment, to be emptied by the task that moves those files.

- [ ] **Step 5: Run gates 1–3, then hand Rohan the commit**

```
! git add tools && git commit -m "added the layer check"
```

---

### Task 3: Entities and pure rules

Nothing here has side effects, so the imports are the whole job.

**Files, moved with `git mv`:**

| From | To |
|---|---|
| `hooks/time.ts` | `hooks/shared/time/domain/services/time.ts` |
| `hooks/queue.ts` | `hooks/shared/records/domain/services/queue_rules.ts` |
| `hooks/plan.ts` | `hooks/shared/backlog/domain/services/ranking.ts` |
| `hooks/family.ts` | `hooks/shared/backlog/domain/services/families.ts` |
| `hooks/checkpoint.ts` | `hooks/shared/checkpoints/domain/services/checkpoints.ts` |
| `hooks/ui/handoff.ts` | `hooks/shared/checkpoints/domain/services/card_note.ts` |
| `hooks/effort.ts` | `hooks/shared/effort/domain/services/effort_tracker.ts` |
| `hooks/usage.ts` | `hooks/features/conversation/domain/services/allowance.ts` |

**Types out of `types/index.d.ts`:**

| To | Types |
|---|---|
| `hooks/shared/records/domain/entities/model.ts` | `Priority`, `Difficulty`, `TaskState`, `Intent`, `Effort`, `CommandRun`, `GitFacts`, `Checkpoint`, `Task`, `ProjectRecord`, `ParentPick`, `OtherProject`, `LoadError` |
| `hooks/shared/git/domain/entities/git_state.ts` | `GitState` |
| `hooks/shared/time/domain/entities/allowance.ts` | `Allowance` |
| `hooks/shared/assistant/domain/entities/check_answer.ts` | `CheckAnswer` |
| `hooks/core/store/band.ts` | `Band`, `MenuView` |
| `hooks/core/env/env.ts` | `Options`, `Ctx`, and new `Env = { now: () => Promise<number>; newId: () => string; log: (text: string) => void }` |

`types/index.d.ts` keeps only `declare module 'claude-code'`, importing the types it names.

**Also:**
- `firstObject` moves from `check.ts` to `hooks/shared/checkpoints/domain/services/first_object.ts`, which ends `checkpoint.ts`'s reach into Claude Code.
- `formatAge` moves from `ui/status.ts` to `shared/time/domain/services/time.ts`.

- [ ] **Step 1: Update the test imports to the new paths, then run gate 1.** Expected: FAIL, modules not found.
- [ ] **Step 2: Move the files and types, and update every import in `hooks/`.** Remove the emptied names from `LEGACY`.
- [ ] **Step 3: Run all four gates.** Expected: pass. Check that `declares state:` still has 28 keys, which proves `types/index.d.ts` still resolves.
- [ ] **Step 4: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the entities and pure rules into shared"
```

---

### Task 4: The core

**Files:**

| Create | Takes |
|---|---|
| `hooks/core/host/host.ts`, `claude_host.ts` | `Host`, `RunResult`; `hostOf` |
| `hooks/core/ports/ports.ts` | `Ports` and `View` from `flow.ts`, `Ask` from `check.ts` |
| `hooks/core/ports/claude_ports.ts` | `portsOf`, `askOf` |
| `hooks/core/store/view_store.ts` | the atoms, `getView`, `setView` |
| `hooks/core/store/band_queue.ts` | `showBand`, `closeBand` |
| `hooks/core/store/menu.ts` | `MENU`, `MENU_ROWS`, `MENU_COLUMNS`, `openMenu`, `closeMenu`, `menuClosed` |
| `hooks/core/logger/logger.ts` | `debug` |
| `hooks/core/session/options.ts`, `live.ts`, `once.ts` | `readOptions`; `live` with only `opts` and `ctx`; `once` |
| `hooks/core/widgets/text.ts` | `cut` |

**Interfaces:**
- Produces, `Ports`, which grows so controllers never need `$`:

```ts
export type Ports = Env & {
  host: Host; ask: Ask
  clear: () => Promise<void>
  submit: (text: string, asUser?: boolean) => Promise<void>
  toast: (text: string) => void
  status: (text: string | undefined) => void
  later: (work: () => Promise<void>) => void
  get: <K extends keyof View>(key: K) => Promise<View[K]>
  set: <K extends keyof View>(key: K, value: View[K]) => Promise<void>
  ui: { open: (spec: MenuSpec) => Promise<{ isPlaced: boolean }>; close: (id: string) => Promise<void> }
  prompt: {
    read: () => Promise<{ text: string }>
    fill: (text: string) => Promise<{ isFilled: boolean }>
    send: (text: string) => Promise<{ drop?: unknown }>
  }
  session: { usage: () => Promise<SessionUsage>; append: (note: string) => Promise<void> }
}
```

- `MenuSpec = Parameters<EngineInterface['ui']['open']>[0]` and `SessionUsage = Awaited<ReturnType<EngineInterface['session']['usage']>>`, in `ports.ts`.
- Produces: `onViewChange(fn: (p: Ports) => Promise<void>): void` in `claude_ports.ts`. `set` calls it for `record`, `isChecking` and `allowance`, the old `STATUS_KEYS`, which keeps `core/` from importing the status line.
- Produces: `openMenu(p, name, view?)`, `closeMenu(p)`, `menuClosed(p)` now take `Ports`.

`live.tracker`, `handedOffFor`, `turnHead` and `errand` stay on a temporary `hooks/live.ts` until Tasks 5, 6 and 9 give each an owner.

- [ ] **Step 1: Add `ui`, `prompt` and `session` stubs to `fakePorts` in `tests/helpers.ts`, and point every test import of a moved name at `core/`.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the files, and repoint `flow.ts`, `actions.ts`, `register.tsx`, `ports.ts` and `ui/`.** What's left in `hooks/ports.ts` is `readCup(p, isTurnRunning)` and `refreshStatus(p)`, now taking `Ports`: `read($, atom)` becomes `p.get(key)`, which still redraws its reader, so callers pass `portsOf($)`.
- [ ] **Step 3: In `register.tsx`, call `onViewChange(refreshStatus)` where `register` starts.**
- [ ] **Step 4: Run all four gates.** Expected: pass, including `the status line follows the record`.
- [ ] **Step 5: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the host, ports, store and session into core"
```

---

### Task 5: The shared resources' data and controllers

**Interfaces, each file in that resource's `domain/repositories/`:**

```ts
type RecordsRepository = {
  read: () => Promise<ProjectRecord | 'unreadable'>
  update: (fn: (r: ProjectRecord) => ProjectRecord) => Promise<ProjectRecord | 'unreadable'>
  problem: () => Promise<LoadError | null>
  restore: (stamp: string) => Promise<{ record: ProjectRecord; keptAt: string } | 'readable' | 'no-copy'>
  others: (title: (r: ProjectRecord) => string | null) => Promise<OtherProject[]>
}
type GitRepository = {
  state: () => Promise<GitState>; facts: () => Promise<GitFacts | null>
  head: () => Promise<{ commit: string; branch: string | null } | null>
  branches: () => Promise<string[]>
  make: (branch: string) => Promise<void>; switchTo: (branch: string) => Promise<void>
  diffSince: (commit: string) => Promise<{ linesAdded: number; linesRemoved: number; filesTouched: number }>
  drift: (task: Task) => Promise<string[]>
  commitsBetween: (from: string, to: string) => Promise<string[]>
}
type AssistantRepository = {
  fork: (prompt: string) => Promise<Reply>   // Reply: shared/assistant/domain/entities/reply.ts
  clear: () => Promise<void>
  submit: (text: string, asUser?: boolean) => Promise<void>
}
```

`Reply = { isAnswered: true; text: string } | { isAnswered: false; reason: string }`, so `domain/` doesn't name the engine's type. Each `*_providers.ts` exports a builder, `recordsRepositoryOf(p: Ports, ctx: Ctx)`, `gitRepositoryOf(p, ctx)` and `assistantRepositoryOf(p)`, the only places that name an `*Impl`.

**Files:**

| Create | Takes |
|---|---|
| `hooks/shared/records/data/datasources/record_source.ts` | all of `record.ts` |
| `hooks/shared/records/data/repositories/records_repository_impl.ts`, `records_providers.ts` | new, over `record_source` |
| `hooks/shared/records/presentation/state_management/records_controller.ts` | `change`, `changeTask`, `markUnreadable` from `flow.ts`; `loadRecord`, `changeRecord` from `actions.ts` |
| `hooks/shared/git/domain/services/branch_rules.ts` | the pure functions: `parseStatus`, `holdReason`, `branchSlug`, `slugBranch`, `parseShortstat`, `parseStatusPaths` |
| `hooks/shared/git/data/datasources/git_source.ts`, `data/repositories/git_repository_impl.ts`, `git_providers.ts` | the rest of `git.ts`; new |
| `hooks/shared/assistant/data/repositories/assistant_repository_impl.ts`, `assistant_providers.ts` | new, over `Ports` |
| `hooks/shared/assistant/domain/usecases/write_handoff.ts` | the decisions in `writeHandoff` |
| `hooks/shared/assistant/presentation/state_management/conversation_controller.ts` | `writeHandoff`, `checkNow`, `freshConversation`, `scheduleFresh`, `isStartingFresh`, `isFreshPending`, `HANDOFF_FAILED` |
| `hooks/shared/effort/presentation/state_management/effort_controller.ts` | `flush`, and `tracker` from `live` |

**Interfaces:**
- Produces: `writeHandoffUseCase(d: { records; git; assistant; env }, ctx, task): Promise<{ kind: 'written'; task: Task; record: ProjectRecord } | { kind: 'not_written'; reason: string } | { kind: 'unreadable' }>`. The controller logs the reason, shows `HANDOFF_FAILED` and sets the record view.
- Produces: `markFreshPending(isPending: boolean): void` from the conversation controller, for `afterTurn`.
- Produces: `loadRecord(p: Ports)`, `flush(p: Ports)`, which take `Ports` from here on.
- Produces: `effortState: { tracker: Tracker | null }`, in the effort controller. Later features use it where they used `live.tracker`.

- [ ] **Step 1: Point every test import of a moved name at its new path.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the files. In `flow.ts` and `actions.ts`, call the moved functions from their new homes.**
- [ ] **Step 3: Run all four gates.** Expected: pass. Empty `LEGACY` of `record.ts`, `git.ts`.
- [ ] **Step 4: Hand Rohan the commit**

```
! git add -A && git commit -m "added the shared repositories and their controllers"
```

---

### Task 6: `commit_guard` and `errands`

**Files:**

| Create, under `hooks/features/` | Takes |
|---|---|
| `commit_guard/domain/services/commit_guard.ts` | all of `guard.ts` |
| `commit_guard/domain/usecases/find_new_commits.ts` | the reading part of `commitWarning` |
| `commit_guard/presentation/state_management/commit_guard_controller.ts` | `commitWarning(p, ctx, before)`, `pressDismissWarning(p)`, `turnHead` from `live` |
| `errands/domain/services/errands.ts` | all of `errand.ts` |
| `errands/presentation/state_management/errands_controller.ts` | `errandFor`, `giveBack`, `sendErrand`, `brewNow`, `errand` from `live`, taking `Ports` |

**Interfaces:**
- Produces: `findNewCommits(git: GitRepository, before: { commit: string; branch: string | null } | null): Promise<string[] | null>`. Keep the `catch` for a commit that isn't a descendant, and its comment.
- Produces: `brewNow(p, text)` calls `closeMenu(p)` from `core/store/menu.ts`.

- [ ] **Step 1: Point `tests/guard.test.ts` and `tests/errand.test.ts` at the new paths, and the `commitWarning` calls in `tests/` at the controller.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the files, and update `register.tsx`, `actions.ts` and `ui/menu.tsx`.** The guard's `on(...)` calls don't move.
- [ ] **Step 3: Run all four gates.** Expected: pass, including the guard tests from Task 1.
- [ ] **Step 4: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the commit guard and errands into features"
```

---

### Task 7: Split the menu and the band in place

`renderMenu` is one 700-line function, and its views share the locals around it. This task only cuts it into functions, in the same files, so the moves after it are mechanical.

**Files:**
- Create: `hooks/core/widgets/menu_context.ts`, `hooks/core/widgets/format.ts`
- Move: `hooks/ui/keys.ts` to `hooks/core/widgets/keys.ts`, since views in features need it
- Modify: `hooks/ui/menu.tsx`, `hooks/ui/band.tsx`

**Interfaces:**
- Produces: `MenuContext`, the object every view draws from: `{ p: Ports; els; cols: number; now: number; today: string; offset: number; name: string; record; tasks; current; top: RenderElement; tag: (p: Priority) => RenderElement; bar: (color: Color, text: string) => RenderElement }`, plus any other local more than one view reads.
- Produces, in `format.ts`: `PRIORITY_COLOR`, `capital`, `total`, `sum`, `grouped`, `markFor`, moved from `ui/menu.tsx`.
- Produces, in `ui/menu.tsx`: `drawBacklog`, `drawCurrent`, `drawBlocking`, `drawParenting`, `drawHistory`, `drawUsage`, `drawSettings`, `drawHelp`, `drawBrew`, `drawHome`, each `(c: MenuContext) => Promise<RenderElement>`. `familyButtons` takes `c`.
- Produces, in `ui/band.tsx`: `drawFileBand`, `drawUnsureBand`, `drawDifficultyBand`, `drawDocsPathBand`, one per `Band` kind.

- [ ] **Step 1: Cut `renderMenu` and `drawQuestion` into those functions, reading per-view values inside each.** A view that calls `getView` while drawing keeps doing so through `c.p.get`, so it still redraws on a change.
- [ ] **Step 2: Run all four gates.** Expected: pass, with `tests/ui.test.tsx` unchanged.
- [ ] **Step 3: Hand Rohan the commit**

```
! git add -A && git commit -m "split the menu and the band into a function per view"
```

---

### Task 8: `tea_cup`, `history`, `settings` and the Brew view

**Files:**

| Create, under `hooks/features/` | Takes |
|---|---|
| `tea_cup/domain/services/cup_mood.ts` | `cupOf`, `cupArt` and their types from `ui/cup.ts` |
| `tea_cup/presentation/views/teacup.tsx` | `ui/teacup.tsx` |
| `tea_cup/presentation/widgets/status_line.ts` | `statusText` |
| `tea_cup/presentation/state_management/tea_cup_controller.ts` | `readCup(p, isTurnRunning)`, `refreshStatus(p)`, which empties `hooks/ports.ts` |
| `history/domain/services/week_stats.ts` | `doneThisWeek`, `finishedTasks`, `weekChart`, `weekMinutes`, `weekOf`, `weekLine` |
| `history/presentation/views/history_view.tsx` | `drawHistory` |
| `settings/presentation/views/settings_view.tsx` | `drawSettings` |
| `errands/presentation/views/brew_view.tsx` | `drawBrew` |

- [ ] **Step 1: Point `tests/cup.test.ts`, `status.test.ts` and `features.test.ts` at the new paths.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the files. Change `module="./teacup.tsx"` in `ui/band.tsx` to the literal relative path of the new file.** The engine reads that literal off the source, so a variable is refused.
- [ ] **Step 3: Check `register.tsx`'s `onViewChange` now passes the moved `refreshStatus`.**
- [ ] **Step 4: Run all four gates.** Expected: pass; gate 4 confirms the `module` path resolves. Delete `hooks/ports.ts`.
- [ ] **Step 5: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the tea cup, history and settings into features"
```

---

### Task 9: `conversation` and `message_check`

**Files:**

| Create, under `hooks/features/` | Takes |
|---|---|
| `conversation/domain/services/turn_end.ts` | the choice in `afterTurn` |
| `conversation/presentation/state_management/conversation_turn_controller.ts` | `afterTurn(p, ctx, reading, handedOffFor)`, `handedOffFor` from `live` |
| `conversation/presentation/views/usage_view.tsx` | `drawUsage` |
| `message_check/domain/services/check_prompt.ts` | `checkPrompt`, `parseCheckAnswer`, `shouldCheck` |
| `message_check/domain/repositories/check_repository.ts`, `data/repositories/check_repository_impl.ts`, `message_check_providers.ts` | `checkMessage` over `Ask` |
| `message_check/domain/usecases/check_typed_message.ts` | the decision in `onMessage` |
| `message_check/presentation/state_management/message_check_controller.ts` | `onMessage`, `sendHeld`, `dropHeld`, `sendQuick`, `cancelHeld`, `sendOn`, `unsureToNew` |
| `message_check/presentation/widgets/unsure_band.tsx` | `drawUnsureBand` |

**Interfaces:**
- Produces: `turnEnd(reading, ctx, handedOffFor): 'none' | 'fresh' | 'note'`. It's pure, and the controller does the rest with `writeHandoff` and `scheduleFresh`, keeping `markFreshPending(true)` before the note, so `afterTurn twice before the fresh conversation starts writes one note and clears once` still passes.
- Produces: `type TypedVerdict = { kind: 'same' | 'quick'; intent: Intent } | { kind: 'new'; band: Band; intent: Intent } | { kind: 'unsure'; band: Band; intent: Intent | null; wasChecked: boolean }`, from `checkTypedMessage(check: CheckRepository, ctx, record, text)`.
- `onMessage` keeps its return value. It sets `isChecking` true before the use case and false in a `finally`, and `showBand` stays in the controller.
- `unsureToNew` needs `guessParent`, which is in `shared/backlog`, so it needs nothing from `tasks`.

- [ ] **Step 1: Point `tests/check.test.ts`, `usage.test.ts` and the `onMessage` and `afterTurn` calls in `tests/` at the new paths.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the files, then delete `check.ts`.**
- [ ] **Step 3: Run all four gates.** Expected: pass.
- [ ] **Step 4: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the conversation and message check into features"
```

---

### Task 10: `tasks`: the queue side

**Use cases, in `hooks/features/tasks/domain/usecases/`:**

`Deps = { records: RecordsRepository; git: GitRepository; taskLog: TaskLogRepository; env: Env }`, built by `tasksDepsOf(p, ctx)` in `tasks_providers.ts`. `Saved = ProjectRecord | 'unreadable'`.

| File | Signature | Returns |
|---|---|---|
| `file_task.ts` | `fileTaskUseCase(d, input)` | `{ kind: 'filed'; task: Task; parent: Task \| null; record } \| { kind: 'refused'; notice: string } \| { kind: 'unreadable' }`; lets a write failure throw |
| `block_task.ts` | `blockTaskUseCase(d, taskId, block)` | `{ kind: 'refused'; notice: string } \| { kind: 'is_current' } \| { kind: 'none' } \| { kind: 'saved'; saved: Saved }` |
| `unblock_task.ts`, `toggle_play_next.ts`, `set_priority.ts` | `(d, taskId, …)` | `Saved` |
| `remove_task.ts` | `removeTaskUseCase(d, taskId)` | `Saved` |
| `move_task.ts` | `moveTaskUseCase(d, taskId, parentId)` | `{ kind: 'refused'; notice: string } \| { kind: 'moved'; task: Task \| undefined; parent: Task \| null; record } \| { kind: 'unreadable' }` |
| `set_feature.ts` | `setFeatureUseCase(d, taskId)` | `{ said: string; saved: Saved }` |
| `find_feature.ts` | `findFeatureUseCase(d, args)` | `{ kind: 'say'; text: string } \| { kind: 'set'; taskId: string \| null }` |

**Files:**

| Create, under `hooks/features/tasks/` | Takes |
|---|---|
| `presentation/state_management/filing_controller.ts` | `fileTask`, `filing`, `pickBand`, `saveFile`, `nameNewFeature`, `fileFromCommand`, `parentFor` |
| `presentation/state_management/queue_controller.ts` | `blockTask`, `unblockTask`, `togglePlayNext`, `removeQueued`, `moveTask`, `setFeature`, `featureCommand`; `pressBlock`, `pressCancelBlock`, `pressBlockWith`, `pressUnblock`, `pressPlayNext`, `pressRemove`, `pressPartOf`, `pressCancelPartOf`, `pressPartOfWith`, `pressFeature`, `pressClearFeature`, `pressPriority`, `pressRow`, `pressFold`, `pressBudget`, `runFeature` |
| `presentation/views/backlog_view.tsx`, `blocking_view.tsx`, `parenting_view.tsx` | `drawBacklog`, `drawBlocking`, `drawParenting` |
| `presentation/widgets/family_buttons.tsx`, `file_band.tsx` | `familyButtons`, `drawFileBand` |
| `tasks_providers.ts` | new |

`fileTask` calls `startTask`, which moves in Task 11. Until then it imports it from `hooks/flow.ts`, so add `features/tasks` to a `LEGACY_READERS` entry in the checker. Task 11 removes it.

- [ ] **Step 1: Point the `fileTask`, `blockTask`, `unblockTask`, `togglePlayNext`, `removeQueued`, `moveTask`, `setFeature` and `featureCommand` calls in `tests/` at the controllers.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the use cases, moving decisions down and leaving every `p.set`, `p.toast` and `showBand` in the controller, in today's order.** A use case gets `Deps`, never `Ports`.
- [ ] **Step 3: Create the controllers, views and widgets.**
- [ ] **Step 4: Run all four gates.** Expected: pass, including `Save twice files one task` and `two sessions filing at once`.
- [ ] **Step 5: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the queue side of tasks into a feature"
```

---

### Task 11: `tasks`: the task's own cycle

**Use cases, same folder and `Deps`:**

| File | Signature | Returns |
|---|---|---|
| `start_task.ts` | `startTaskUseCase(d, ctx, taskId)` | see below |
| `finish_task.ts` | `finishTaskUseCase(d, ctx, taskId, actual)` | `{ kind: 'unreadable' } \| { kind: 'skipped' } \| { kind: 'saved'; record; askPath: boolean; logFailedAt: string \| null }` |
| `save_docs_path.ts` | `saveDocsPathUseCase(d, ctx, taskId, path)` | `{ kind: 'unreadable' } \| { kind: 'saved'; record; logFailedAt: string \| null }` |
| `put_back.ts` | `putBackUseCase(d, taskId, block)` | `Saved` |
| `switch_to_task.ts` | `switchToTaskUseCase(d, branch)` | `{ kind: 'switched' } \| { kind: 'uncommitted'; text: string }` |

```ts
type StartResult =
  | { kind: 'unreadable' }
  | { kind: 'gone' }                                  // clears a hold on it
  | { kind: 'blocked'; notice: string }
  | { kind: 'held'; text: string }
  | { kind: 'refused'; notice: string }               // lost the claim; clears a hold on it
  | { kind: 'branch_failed'; text: string; notice: string | null; record: ProjectRecord }
  | { kind: 'started'; task: Task; notice: string | null; record: ProjectRecord }
```

**Files:**

| Create, under `hooks/features/tasks/` | Takes |
|---|---|
| `domain/repositories/task_log_repository.ts`, `data/datasources/docs_log_source.ts`, `data/repositories/task_log_repository_impl.ts` | `docslog.ts` |
| `presentation/state_management/tasks_controller.ts` | `startTask`, `finishTask`, `finishDocs`, `putBack`, `continueTask`, `switchToTask`, `taskLooksDone`, `taskSection`, `refreshDrift`, `refreshLines`, `checkResume`, `askDone`; `pressStart`, `pressStartFromBacklog`, `pressStartNext`, `pressBackToQueue`, `pressCheckAgain`, `pressContinue`, `pressSwitch`, `pressDoneYes`, `pressDoneNotYet`, `saveDifficulty`, `saveDocsPath` |
| `presentation/views/current_view.tsx` | `drawCurrent` |
| `presentation/widgets/difficulty_band.tsx`, `docs_path_band.tsx` | those bands |

**Behaviour to keep:**
- `once` wraps `startTask`, `finishTask`, `finishDocs` and `putBack` in the controller, with today's keys.
- `putBack` sets `busy`, calls `writeHandoff` in a `try`, clears `busy` in the `finally`, and only then calls the use case.
- The one visible difference allowed: today the record view shows the claimed task during the moment the branch is made. The controller now sets it once the use case returns. A task's end state is the same, and git takes milliseconds there.

- [ ] **Step 1: Point the rest of the `flow` imports in `tests/`, and `tests/docslog.test.ts`, at the new paths.** Run gate 1. Expected: FAIL, modules not found.
- [ ] **Step 2: Create the use cases, the task log and `tasks_controller.ts`.** Remove the `LEGACY_READERS` entry from Task 10.
- [ ] **Step 3: Create the views and widgets.**
- [ ] **Step 4: Run all four gates.** Expected: pass, including `Start pressed twice makes one branch and clears once`, `finishing twice…` and the Back to queue tests from Task 1.
- [ ] **Step 5: Hand Rohan the commit**

```
! git add -A && git commit -m "moved the task cycle into the tasks feature"
```

---

### Task 12: `app/`, and the end of the flat files

**Files:**

| Create, under `hooks/app/` | Takes |
|---|---|
| `menu/menu_frame.tsx` | `renderMenu`: the loading and failed states, building `MenuContext`, choosing the view |
| `menu/home_view.tsx`, `menu/help_view.tsx` | `drawHome`, `drawHelp` and `HELP_COMMANDS` |
| `menu/menu_controller.ts` | `toggleMenu`, `pressMenu` |
| `band/band_host.tsx` | `renderBand`, `drawCup`, `stillCup`, choosing the question |
| `session/load_context.ts` | `loadContext` from `session.ts` |
| `session/session_rhythm.ts` | `startSession`, `afterEachTurn`, `checkTyped`, `runErrand` from `register.tsx`; `tick`, `afterClear`, `saveBeforeClear`, `pressRestore` from `actions.ts` |

- [ ] **Step 1: Move the test files.** `tests/helpers.ts` stays.

| To | Files |
|---|---|
| `tests/unit/shared/records/` | `record`, `queue` |
| `tests/unit/shared/backlog/` | `plan`, `family`, `hierarchy` |
| `tests/unit/shared/git/` | `git`, `branch` |
| `tests/unit/shared/` | `checkpoint`, `effort`, `time` |
| `tests/unit/tasks/` | `flow`, `block`, `features`, `fixes`, `docslog` |
| `tests/unit/` | one folder per feature for `guard`, `errand`, `check`, `usage`, `cup`, `status`, `session` |
| `tests/view/` | `ui` |

- [ ] **Step 2: Run gate 1.** Expected: the same count as before the move. A lower count means a file was lost.
- [ ] **Step 3: Create the `app/` files. `register.tsx` keeps its `on(...)` calls in today's order, calling `app/session/` and the controllers, with `portsOf($)` built at each hook.**
- [ ] **Step 4: Delete `flow.ts`, `actions.ts`, `live.ts`, `session.ts`, `ui/`, and any file now empty. Empty `LEGACY` and `KNOWN_CYCLES`.** `hooks/` holds only `hooks.json`, `register.tsx`, `app/`, `core/`, `shared/`, `features/`.
- [ ] **Step 5: Run all four gates.** Expected: pass. The test count is the Task 11 count.
- [ ] **Step 6: Hand Rohan the commit**

```
! git add -A && git commit -m "added the app layer and removed the flat files"
```

---

### Task 13: Docs, then the real thing

**Files:**
- Modify: `CLAUDE.md`, `docs/architecture.md`, `docs/workspace-app.md`, `README.md`

- [ ] **Step 1: `CLAUDE.md`:** the folder table names `register.tsx`, `app/`, `core/`, `shared/`, `features/` and `tools/`; add `node tools/check_layers.mjs` and `tsc` to how to check work; point to `docs/architecture.md`.
- [ ] **Step 2: `docs/architecture.md`:** change State to built, and bring section 5 in line with any file that ended up elsewhere.
- [ ] **Step 3: `docs/workspace-app.md`:**
  - "Where the code lives" takes section 6 of the architecture doc.
  - "One engine, two hosts" drops the three moves, which are done, and imports `shared/` and `features/*/domain`.
  - `hooks/ops.ts` and `app/main/game.ts` become their real homes.
  - Criterion 1 changes from "none of them was edited" to "their assertions weren't edited".
- [ ] **Step 4: Run all four gates in the worktree, then `node --test tools/`.**
- [ ] **Step 5: Hand Rohan the commit**

```
! git add -A && git commit -m "brought the docs in line with the restructure"
```

- [ ] **Step 6: Rohan tries it in the main folder**

```
! git worktree remove ../queue-tea-feature-first
! git switch task/feature-first-restructure
```

Start a new session there, then check by hand what no test can:
- the cup animates, and the menu opens from it;
- `/queue-tea`, `/steep hello` and `/brew` work;
- a task starts on its branch, and Back to queue saves a checkpoint;
- the band files a message;
- Claude's `git commit` is refused.

If any of it fails, `git switch task/workspace-app-docs` puts the old mod back at once.

---

## After this plan

Two parts of the agreed design are separate pieces of work, each with its own short plan: rebuilding the canvas mockups from shared Sky, Dragon, Sidebar and HUD components, and the `app/` itself.
