# Graph Report - queue-tea  (2026-11-02)

## Corpus Check
- 373 files · ~283,306 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 2361 nodes · 8389 edges · 89 communities (83 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 573 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `431b4809`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- engine_api.ts
- vitest
- tasks_api.ts
- t
- en.ts
- quests_page.tsx
- app.tsx
- emptyRecord
- scope.ts
- tasks_controller.ts
- record_source.ts
- fixes.test.ts
- first_run.tsx
- Queue-tea: workspace app
- Queue-tea: design
- register.tsx
- ports.ts
- ref_types
- main.ts
- version.test.mjs
- formatMinutes
- queue_controller.ts
- families.ts
- checkpoints.ts
- band_host.tsx
- view_store.ts
- game.ts
- hoard_page.tsx
- tests/helpers.ts
- palette.ts
- What each screen reads from existing data
- library_api.ts
- quest_flows.ts
- conversation_controller.ts
- opening_api.spec.ts
- session_rhythm.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- project_views.ts
- github_api.ts
- sessions.test.ts
- docs_log_source.ts
- flows.e2e.ts
- package.json
- claude_code.ts
- commit_guard.ts
- settings_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- devDependencies
- Roadmap: the outside review, checked against the code
- File Structure
- git_source.ts
- Queue-tea: workspace app UI design
- Task 7: Split the menu and the band in place
- board.e2e.ts
- app_menu.ts
- scripts
- Shared Types (Task 1 writes them; every task uses them)
- Queue-tea architecture
- edits.e2e.ts
- Queue-tea: panel redesign
- queue.test.ts
- Workspace app, the rest of the road
- Part 3: setting out and coming back
- Part 4: the rest of the screens
- domain/helpers.ts
- commit-chai-n.md
- pages.e2e.ts
- allowance.ts
- Queue-tea
- hierarchy.test.ts
- first_window.e2e.ts
- Part 2: edits
- chai-pter.md
- main.tsx
- file_task.ts
- Repository Rules
- mocha-mockup.md
- tea-dd.md
- electron
- refresh_app.sh
- git_repository.ts
- tsconfig.json
- install_app.sh
- noUpstream

## God Nodes (most connected - your core abstractions)
1. `t` - 70 edges
2. `emptyRecord()` - 63 edges
3. `currentTask()` - 57 edges
4. `Refusal` - 54 edges
5. `vitest` - 51 edges
6. `reply()` - 50 edges
7. `App()` - 49 edges
8. `formatMinutes()` - 49 edges
9. `What each screen reads from existing data` - 49 edges
10. `Reply` - 42 edges

## Surprising Connections (you probably didn't know these)
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `2. Rules` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `Task 1: the mod's half` --references--> `putBack()`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/features/tasks/presentation/state_management/tasks_controller.ts

## Import Cycles
- None detected.

## Communities (89 total, 6 thin omitted)

### Community 0 - "engine_api.ts"
Cohesion: 0.04
Nodes (88): App(), open(), BOARD, FIRST, open(), SAGA, SECOND, ACTIVE (+80 more)

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (66): createLogger(), fileSink(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+58 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.05
Nodes (81): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+73 more)

### Community 3 - "t"
Cohesion: 0.06
Nodes (80): Content(), SheetView(), Answer, ask(), DEFAULT_LOG_PATH, Dialog(), Field(), FieldProps (+72 more)

### Community 4 - "en.ts"
Cohesion: 0.05
Nodes (75): EngineRead, useEngineRead(), LINES_REFRESH_MS, clockTime(), dayAndTime(), dayName(), dayOf(), manaLeft() (+67 more)

### Community 5 - "quests_page.tsx"
Cohesion: 0.05
Nodes (73): HOME_BADGES, HOME_BOARD_ROWS, Dragon(), PriorityTag(), useWindowKeys(), useWindowWidth(), Board(), Glory() (+65 more)

### Community 6 - "app.tsx"
Cohesion: 0.05
Nodes (66): ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), ALL, hrefOf() (+58 more)

### Community 7 - "emptyRecord"
Cohesion: 0.04
Nodes (38): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), realm(), won() (+30 more)

### Community 8 - "scope.ts"
Cohesion: 0.11
Nodes (55): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+47 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.09
Nodes (55): 5. Features, shared resources and the core, Features, Task 11: `tasks`: the task's own cycle, pressOpenApp(), once(), running, findNewCommits(), commitWarning() (+47 more)

### Community 10 - "record_source.ts"
Cohesion: 0.09
Nodes (42): Asked, askedOf(), idOf(), judgementWatch(), broken, setup(), WatchDeps, canRestoreFrom() (+34 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.10
Nodes (32): live(), Order to fix them, Task 9: `conversation` and `message_check`, closeBand(), showBand(), checkMessage(), checkRepositoryImpl(), replyOf() (+24 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.12
Nodes (36): HOLD_FILES_SHOWN, Spinner(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT (+28 more)

### Community 13 - "Queue-tea: workspace app"
Cohesion: 0.05
Nodes (38): Check it, Flavors, Install it, Queue-tea, the workspace app, Run it, Global constraints, Part A: the mod, Part B: the app (+30 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (41): A task's life, Coming back later, Commands, Effort, Errands, Features, Filing a task, Finishing a task (+33 more)

### Community 15 - "register.tsx"
Cohesion: 0.15
Nodes (38): The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check, Task 4: The core (+30 more)

### Community 16 - "ports.ts"
Cohesion: 0.15
Nodes (22): After this plan, Feature-first restructure Implementation Plan, Global Constraints, clearCrashed(), writeBeat(), Ctx, Env, Options (+14 more)

### Community 17 - "ref_types"
Cohesion: 0.18
Nodes (23): drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu(), capital(), grouped() (+15 more)

### Community 18 - "main.ts"
Cohesion: 0.07
Nodes (35): COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, SETTINGS_FILE, WATCH_SETTLE_MS (+27 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.10
Nodes (29): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+21 more)

### Community 20 - "formatMinutes"
Cohesion: 0.14
Nodes (27): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+19 more)

### Community 21 - "queue_controller.ts"
Cohesion: 0.17
Nodes (34): The eight items, Task 10: `tasks`: the queue side, blockTaskUseCase(), setFeatureUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), blockTask(), featureCommand() (+26 more)

### Community 22 - "families.ts"
Cohesion: 0.17
Nodes (30): readChoices(), 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult (+22 more)

### Community 23 - "checkpoints.ts"
Cohesion: 0.14
Nodes (25): 4.1 Home, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), cardNote, HandoffSection, handoffSections() (+17 more)

### Community 24 - "band_host.tsx"
Cohesion: 0.11
Nodes (26): drawCup(), MOOD_COLOR, MOOD_WORD, stillCup(), AIR, body(), CUP_COLUMNS, CUP_ROWS (+18 more)

### Community 25 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 26 - "game.ts"
Cohesion: 0.14
Nodes (24): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+16 more)

### Community 27 - "hoard_page.tsx"
Cohesion: 0.13
Nodes (18): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+10 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.16
Nodes (18): CTX, fakePorts(), makeTask(), memoryHost(), Run, current(), setup(), repo() (+10 more)

### Community 29 - "palette.ts"
Cohesion: 0.15
Nodes (22): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+14 more)

### Community 30 - "What each screen reads from existing data"
Cohesion: 0.18
Nodes (23): Already built, 4.2 Tasks, with a feature in the detail pane, What each screen reads from existing data, blockedText(), blockersOf(), budgetLabel(), BUDGETS, canWaitFor() (+15 more)

### Community 31 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 32 - "quest_flows.ts"
Cohesion: 0.15
Nodes (18): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withoutReview(), withPlayNext(), withPriority() (+10 more)

### Community 33 - "conversation_controller.ts"
Cohesion: 0.21
Nodes (18): Shared resources, Task 5: The shared resources' data and controllers, afterTurn(), conversationState, putBackOnce(), assistantRepositoryOf(), assistantRepositoryImpl(), Reply (+10 more)

### Community 34 - "opening_api.spec.ts"
Cohesion: 0.18
Nodes (16): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+8 more)

### Community 35 - "session_rhythm.ts"
Cohesion: 0.23
Nodes (19): Task 6: `commit_guard` and `errands`, runErrand(), commitGuardState, Errand, ERRAND_NOT_SENT, ErrandKind, errandNote(), errandReply() (+11 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.19
Nodes (18): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+10 more)

### Community 38 - "project_views.ts"
Cohesion: 0.22
Nodes (17): xpOf(), activeOf(), difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+9 more)

### Community 39 - "github_api.ts"
Cohesion: 0.22
Nodes (11): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+3 more)

### Community 40 - "sessions.test.ts"
Cohesion: 0.27
Nodes (11): Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository, HEARTBEAT_MS, parseSession() (+3 more)

### Community 41 - "docs_log_source.ts"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.16
Nodes (8): APP, change(), editTask(), git(), noRequests(), onDisk(), run, stored()

### Community 43 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.28
Nodes (13): appleScriptText(), bringForwardArgv(), claudeLine(), openClaudeArgv(), openVsCode(), script(), shellQuote(), NASTY (+5 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "settings_api.ts"
Cohesion: 0.24
Nodes (14): cleanSettings(), DEFAULT_SETTINGS, isFolds(), isLastProject(), isRealmAccounts(), isScope(), isSky(), isTerminal() (+6 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.12
Nodes (16): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room (read-only), 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+8 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.22
Nodes (14): applyPending(), CHANGES, countToolCall(), createTracker(), merge(), nothing(), once(), Pending (+6 more)

### Community 50 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, @playwright/test (+7 more)

### Community 51 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.15
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 52 - "File Structure"
Cohesion: 0.28
Nodes (13): File Structure, Global Constraints, Queue-tea Implementation Plan, Review Focus, Task 8: The task flow, readGit(), branchSlug(), count() (+5 more)

### Community 53 - "git_source.ts"
Cohesion: 0.38
Nodes (13): commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural(), readDrift() (+5 more)

### Community 54 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 55 - "Task 7: Split the menu and the band in place"
Cohesion: 0.26
Nodes (12): Task 7: Split the menu and the band in place, drawQuestion(), getView(), drawBrew(), DIFFICULTIES, nameNewFeature(), pickBand(), saveFile() (+4 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "app_menu.ts"
Cohesion: 0.27
Nodes (8): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+3 more)

### Community 59 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.22
Nodes (11): Edit, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 4: The git guard, Task 5: Time and effort, Task 6: The docs log (+3 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.18
Nodes (9): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+1 more)

### Community 61 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.20
Nodes (9): plain(), Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API) (+1 more)

### Community 63 - "queue.test.ts"
Cohesion: 0.24
Nodes (8): held(), hold(), Audit: what the menu exposes of the engine, Problems not on the list, Task 10: The panel, the band, the status line and the commands, Task 1: Scaffold, contract and queue order, orderQueue(), suggestion()

### Community 64 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 65 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 66 - "Part 4: the rest of the screens"
Cohesion: 0.22
Nodes (9): chronicle(), mana(), game(), 6. The app: frontend, backend and storage, Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools (+1 more)

### Community 67 - "domain/helpers.ts"
Cohesion: 0.28
Nodes (8): fileNamed(), FILES, frontmatter(), Helper, helperOf(), KINDS, LOGOS, ORDER

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 70 - "allowance.ts"
Cohesion: 0.46
Nodes (6): Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd()

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "hierarchy.test.ts"
Cohesion: 0.25
Nodes (4): ARROWS, CLEAN, DIRTY, recordOf()

### Community 73 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 74 - "Part 2: edits"
Cohesion: 0.29
Nodes (7): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working, FileInput

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 77 - "file_task.ts"
Cohesion: 0.40
Nodes (5): One engine, two hosts, FileResult, fileTaskUseCase(), startTaskUseCase(), newTask()

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "mocha-mockup.md"
Cohesion: 0.50
Nodes (3): How you work, What you don't do, What you report

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "electron"
Cohesion: 0.50
Nodes (3): engine, CHANNELS, electron

### Community 82 - "refresh_app.sh"
Cohesion: 1.00
Nodes (3): refresh(), say(), refresh_app.sh script

## Knowledge Gaps
- **6 isolated node(s):** `@types/node`, `electron-builder`, `jsdom`, `typescript`, `vite` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 670 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `engine_api.ts`, `quest_flows.ts`, `opening_api.spec.ts`, `tasks_api.ts`, `t`, `quests_page.tsx`, `app.tsx`, `github_api.ts`, `emptyRecord`, `record_source.ts`, `package.json`, `claude_code.ts`, `first_run.tsx`, `settings_api.ts`, `app_menu.ts`, `game.ts`, `palette.ts`, `library_api.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `electron-builder`, `jsdom` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `engine_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03724265556326625 - nodes in this community are weakly interconnected._
- **Why does `formatMinutes()` connect `formatMinutes` to `engine_api.ts`, `quest_flows.ts`, `t`, `en.ts`, `quests_page.tsx`, `docs_log_source.ts`, `ref_types`, `File Structure`, `queue_controller.ts`, `band_host.tsx`, `Shared Types (Task 1 writes them; every task uses them)`, `What each screen reads from existing data`, `queue.test.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `currentTask()` (e.g. with `Task 10: The panel, the band, the status line and the commands` and `Task 5: Time and effort`) actually correct?**
  _`currentTask()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.03732303732303732 - nodes in this community are weakly interconnected._