# Workspace app, part 1: the first window

**State:** built on 2 Nov 2026, not yet committed. Every box below is done; 334 mod tests, 105 app tests and 8 end-to-end checks pass.

**Goal:** a Queue-tea window on the Mac that shows every project's real queue, read-only, in the Jade Peaks look, with the mod ready to talk to it.

**Architecture:** the mod gains session files, requests and `review`. The app in `app/` is Electron with a Preact window; its main process runs the mod's own `domain` code and record and git data over a Node `Host`. See `docs/architecture.md`, section 6.

**Tech stack:** Electron, Preact, electron-vite, TypeScript, Vitest, Testing Library, Playwright's Electron driver.

**Spec:** `docs/workspace-app.md` and `docs/workspace-app-design.md`. This plan covers the engine seam and steps 2 and 3 of the spec's build order. Steps 4 to 7 and Windows each get their own plan once this one lands; they need what this one builds, and a plan written now would guess at it.

## Global constraints

- **Mac first, Windows kept possible.** Rohan wants both; the Mac ships first because there is no Windows machine to test on yet. Nothing Mac-only sits outside `hooks/core/host/claude_host.ts` and `app/main/core/platform/`.
- **Never in the app:** a Commit, Push, Merge or Pull button, or a run of those git commands.
- **The record stays at version 1.** New fields have defaults, and fields one side doesn't know survive the other side's write.
- **Game numbers are never stored.**
- **Work in the worktree** at `../queue-tea-app`, branch `task/workspace-app`. The installed mod runs from the main folder, so a half-built tree there could stop the mod and its commit guard.
- **The queue is left alone.** The app work reached this plan through `/brew`. Filing it is Rohan's, through `/steep`.
- **Rohan makes every commit.** The commit points below are where a commit makes sense.

**The gates, from the worktree's root, after every task:** `claude plugin test .`, `npx -y -p typescript@5.9 tsc -p .`, `claude plugin validate .`, `node tools/check_layers.mjs`. For the app, from `app/`: `npm test` and `npm run typecheck`.

## Review focus

1. **A record written by a newer mod while the app is open.** The app shows it as unreadable, says why, and leaves it untouched. Test in task 8.
2. **A session that crashed.** Its file stays; after 90 s the app treats it as no session. Test in task 3.
3. **A request for a task that is no longer current.** The mod drops it and sends nothing. Test in task 5.
4. **`.brew-repro-tmp-*`, `.bak`, `.lock` and `.broken-*` files beside the records.** Never listed as projects. Test in task 8.
5. **A record that changes while the app reads it.** The atomic replace means a read sees the old or new file whole; a failed read of one project leaves the others on screen. Test in task 8.

---

## Part A: the mod

### Task 1: the file seam

**Files:** `hooks/core/host/host.ts`, `hooks/core/host/claude_host.ts`, `hooks/shared/records/data/datasources/record_source.ts`, `tests/helpers.ts`

**Produces:** on `Host`: `move(from, to)`, `makeDir(path)` (fails when it exists), `makeDirs(path)`, `removeDir(path)`, `remove(path)`, each returning `RunResult`; `modifiedAt(path): Promise<number | null>`; `open(url): Promise<RunResult>`. `unixFiles(run)` in `host.ts` builds the first five from `run`.

- [x] `record_source.ts` calls these instead of `mv`, `mkdir` and `rmdir`, with no change in behaviour.
- [x] `memoryHost` uses `unixFiles`, so every assertion on `mem.runs` stays as it is.

### Task 2: the new record fields

**Files:** `types/index.d.ts`, `record_source.ts`, `tests/helpers.ts`, `tests/unit/shared/records/record.test.ts`

**Produces:** `Task.description: string | null`, `Task.criteria: string[]`, `Task.review: { at: string; checked: string | null } | null`, `ProjectRecord.requests: AppRequest[]`, `AppRequest = { id: string; kind: 'begin' | 'putBack'; taskId: string; at: string }`.

- [x] Tests: an old record reads with the defaults; an unknown field on a task and on the record survives `updateRecord`.

### Task 3: session files

**Files:** `hooks/shared/sessions/` with `domain/entities/session_file.ts`, `domain/services/session_rules.ts`, `domain/repositories/sessions_repository.ts`, `data/datasources/session_source.ts`, `data/repositories/sessions_repository_impl.ts`, `presentation/state_management/sessions_controller.ts`, `sessions_providers.ts`; `hooks/app/session/session_rhythm.ts`, `hooks/register.tsx`

**Produces:** `SessionFile`, the shape in section 6 of the design; `isFresh(file, nowMs)` with `HEARTBEAT_MS = 30_000` and `STALE_MS = 90_000`; `sessionsPath(home)`; `readSessions(host, home)`; `writeSessionFile`, `removeSessionFile`.

- [x] Written at session start, after each turn and every 30 s; removed at session end. A /clear changes the id, so the old file goes too.
- [x] Tests: the file's shape; `isFresh` at 90 s and past it; an unreadable session file is skipped.
- [x] Also written as a turn starts, and the next session clears files that crashed sessions left. A real session showed both were needed.

### Task 4: `review`

**Files:** `tasks_controller.ts`, a new use case `features/tasks/domain/usecases/set_review.ts`, `finish_task.ts`, `put_back.ts`

- [x] `task_looks_done` sets `task.review`. Yes, Not yet, Done and Back to queue clear it. A record change that clears it from the app also closes the mod's question.
- [x] Tests for each.

### Task 5: requests

**Files:** `features/tasks/domain/usecases/take_request.ts`, `features/tasks/presentation/state_management/requests_controller.ts`, `session_rhythm.ts`, `register.tsx`

**Produces:** `takeRequestUseCase(deps, id)`, which removes a request under the lock and returns whether this session got it; `handleRequests(p, ctx)`.

- [x] The tick checks the record's `modifiedAt` every 2 s and reloads on a change.
- [x] A request is handled only with no turn running and an empty prompt box. Otherwise the terminal offers Continue.
- [x] Tests: `begin` sends the first message; `begin` for a task no longer current is dropped; nothing happens mid-turn; `putBack` puts back with a checkpoint; two sessions can't both take one.

### Task 6: Open in Queue-tea app

**Files:** `hooks/app/menu/home_view.tsx`, `menu_controller.ts`, `tests/view/ui.test.tsx`

- [x] A menu entry opens `queue-tea://open?path=<encoded path>` through `host.open`. If nothing opens, the menu says the app isn't installed.

**Commit point:** the mod is ready for the app.

---

## Part B: the app

### Task 7: the project

**Files:** `app/package.json`, `app/tsconfig*.json`, `app/electron.vite.config.ts`, `app/vitest.config.ts`, `app/.gitignore`, `app/README.md`

- [x] After `npm install`, `claude plugin test .` from the root still finds the same tests. If it reaches `app/node_modules`, stop: the spec moves the app out of the plugin folder.
- [x] `app/tools/check_engine_line.spec.ts`: a file importing `claude-code` fails the app's type check.

### Task 8: the backend

**Files:** `app/main/core/` (`node_host.ts`, `logger.ts`, `flavor.ts`, `constants.ts`, `settings.ts`, `watcher.ts`, `platform/`), `app/main/features/projects/api/`, `app/main/features/game/`, `app/main/main.ts`, `app/preload/preload.ts`, `app/shared/engine_api.ts`

**Produces:** `EngineApi` with `listProjects()`, `readProject(key)`, `readGame()`, `readSettings()`, `saveSettings(patch)`, and an `onChange` push. Every reply is `{ ok: true, data } | { ok: false, error: { message } }`.

- [x] Tests over a temporary folder: review focus 1, 4 and 5; dropped and repeated watch events are checked against `mtimeMs`.

### Task 9: the game rules

**Files:** `app/main/features/game/domain/services/game.ts`, `game.spec.ts`

**Produces:** `gameOf(records, offsetMinutes): GameState`, from section 2.2 of the design.

- [x] Tests: the 27 Oct figures (120 XP, level 2, Hatchling, 120 gold, streak 1, best 3, First Flame and Night Owl); a finish at 03:30; a streak across midnight; every badge; running over a copy of the records leaves each file byte for byte the same.

### Task 10: the window's frame

**Files:** `app/renderer/` with `app/`, `config/routing/routes.ts`, `core/api/`, `core/constants/`, `core/widgets/`, `l10n/en.ts`

- [x] `core/api/engine_client.ts` is the one file that turns a reply into data or a plain error.
- [x] The sky follows section 2.1, with `skyAt(hour)` tested at each boundary. Calm mode and Reduce Motion stop every loop.
- [x] The sidebar, tabs, sky dial and HUD. Loading, partly loaded, empty and failed states for each.

### Task 11: Home and Quests, read-only

**Files:** `app/renderer/features/home/`, `app/renderer/features/quests/`

- [x] The backlog order equals `groupBacklog(rankBacklog(record, budget), …)`, and the ★ line is `why`, character for character.
- [x] No button reads Commit, Push, Merge or Pull.
- [x] Other screens aren't built yet, so their tabs aren't shown: no placeholders (decision 14 of the design).

### Task 12: seen working

**Files:** `app/e2e/first_window.e2e.ts`, `app/playwright.config.ts`

- [x] Playwright's Electron driver, on a temporary `HOME` with fixture records: the sidebar lists the projects and hides the dot-file, Home and Quests show the record, and changing the record on disk updates the window.
- [x] Screenshots at the four times of day, looked at by eye.

**Commit point:** the first window.
