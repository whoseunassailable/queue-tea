# Graph Report - queue-tea  (2026-11-06)

## Corpus Check
- 496 files · ~388,617 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 3, .pen 1)

## Summary
- 3166 nodes · 11500 edges · 117 communities (110 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 663 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2f0f820`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- holdReason
- ref_node_fs
- tasks_api.ts
- update_runner.mjs
- ref_types
- ref_node_path
- preact
- edits.e2e.ts
- opening_api.spec.ts
- tasks_controller.ts
- activity.spec.ts
- fixes.test.ts
- first_run.tsx
- t
- Queue-tea: design
- teacup.tsx
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- judgements.spec.ts
- queue_controller.ts
- families.ts
- fakeEngine
- palette.ts
- band_host.tsx
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- app.tsx
- ranking.ts
- game.ts
- branch_api.ts
- createWorkspace
- design_editor.tsx
- engine_api.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- makeTask
- menu_frame.tsx
- sessions.test.ts
- flows.e2e.ts
- package.json
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- library_api.ts
- activity.ts
- designs.spec.tsx
- ref_types
- helpers_api.spec.ts
- File Structure
- board.e2e.ts
- quest_flows.spec.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- project_views.ts
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- flows.spec.tsx
- quests_edits.spec.tsx
- Shared Types (Task 1 writes them; every task uses them)
- commit-chai-n.md
- board_tools.tsx
- mana.ts
- Queue-tea
- quest_detail.tsx
- check_layers.mjs
- feedback.spec.tsx
- chai-pter.md
- branch_workflow.e2e.ts
- start_api.spec.ts
- Repository Rules
- Roadmap: the outside review, checked against the code
- tea-dd.md
- quests_page.tsx
- projects_api.spec.ts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- start_task.ts
- board.spec.tsx
- currentTask
- Architecture
- Designs tab
- Part B: the app
- detail.spec.tsx
- Branch workflow completion — 5 November 2026
- test_support.ts
- release_guard.d.mts
- Tea-concile
- shell.spec.tsx
- Queue-tea: workspace app UI design
- Task Log
- A task's life
- shell.e2e.ts
- What Rohan sees
- workspace-app.md
- Guild helpers on tasks
- Queue-tea, the workspace app
- first_window.e2e.ts
- guild.e2e.ts
- Part 2: edits
- The record
- .line-check-NZS8Gw/tsconfig.json
- Host
- ref_node_os

## God Nodes (most connected - your core abstractions)
1. `t` - 95 edges
2. `Refusal` - 92 edges
3. `vitest` - 78 edges
4. `emptyRecord()` - 78 edges
5. `reply()` - 72 edges
6. `currentTask()` - 62 edges
7. `preact` - 57 edges
8. `scopeOf()` - 54 edges
9. `Reply` - 54 edges
10. `EngineApi` - 54 edges

## Surprising Connections (you probably didn't know these)
- `Behaviour` --references--> `fileQuest()`  [INFERRED]
  docs/design-tab.md → app/main/features/tasks/api/tasks_api.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `2. Rules` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts

## Import Cycles
- None detected.

## Communities (117 total, 7 thin omitted)

### Community 0 - "holdReason"
Cohesion: 0.22
Nodes (11): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+3 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.05
Nodes (44): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+36 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.08
Nodes (72): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+64 more)

### Community 3 - "update_runner.mjs"
Cohesion: 0.13
Nodes (23): Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity (+15 more)

### Community 4 - "ref_types"
Cohesion: 0.19
Nodes (17): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Task 2: Filing and editing carry the choice, edited(), editTaskUseCase(), TaskEdit (+9 more)

### Community 5 - "ref_node_path"
Cohesion: 0.09
Nodes (16): APP, task(), TODAY, won(), writeBundle(), counts, currentProvenance(), git() (+8 more)

### Community 6 - "preact"
Cohesion: 0.09
Nodes (45): ask(), EngineRead, useEngineRead(), ReadView(), Window, BRANCH_POLL_MS, HELPER_DRAG, MERGE_POLL_MS (+37 more)

### Community 7 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (64): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once(), running (+56 more)

### Community 10 - "activity.spec.ts"
Cohesion: 0.24
Nodes (10): AT, COMMIT_ACTIVITY_LIMIT, readActivity(), log, step(), ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, activityEntries() (+2 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.11
Nodes (32): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), closeBand(), showBand(), checkMessage() (+24 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.12
Nodes (35): HOLD_FILES_SHOWN, Spinner(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT (+27 more)

### Community 13 - "t"
Cohesion: 0.11
Nodes (28): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+20 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "teacup.tsx"
Cohesion: 0.50
Nodes (4): Seg, look(), State, TeaCup()

### Community 16 - "scope.ts"
Cohesion: 0.08
Nodes (64): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), cancelMergeChecks(), readPush(), readCodexSession() (+56 more)

### Community 17 - "git_source.ts"
Cohesion: 0.18
Nodes (28): File Structure, Task 8: The task flow, What each screen reads from existing data, SwitchResult, switchToTaskUseCase(), commitsBetween(), diffSince(), git() (+20 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (68): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+60 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.15
Nodes (17): fixtures, addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion() (+9 more)

### Community 20 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 21 - "queue_controller.ts"
Cohesion: 0.13
Nodes (39): The eight items, Task 10: `tasks`: the queue side, KEYS, blockTaskUseCase(), setFeatureUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand() (+31 more)

### Community 22 - "families.ts"
Cohesion: 0.17
Nodes (30): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult, moveTaskUseCase() (+22 more)

### Community 23 - "fakeEngine"
Cohesion: 0.15
Nodes (18): click(), one, open(), openReview(), two, view, open(), branchGraph() (+10 more)

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (23): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+15 more)

### Community 25 - "band_host.tsx"
Cohesion: 0.04
Nodes (80): live(), Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check, Task 4: The core, drawCup() (+72 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.11
Nodes (31): 4.1 Home, 4.4 A task's detail: current, queued and done, findNewCommits(), factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES() (+23 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (34): fileTask(), startTask(), emptyRecord(), CTX, fakePorts(), makeTask(), memoryHost(), Run (+26 more)

### Community 29 - "app.tsx"
Cohesion: 0.04
Nodes (91): App(), ContentProps, moodOf(), MORE_PAGES, SheetProps, SheetView(), TABS, useHour() (+83 more)

### Community 30 - "ranking.ts"
Cohesion: 0.18
Nodes (20): Already built, 4.2 Tasks, with a feature in the detail pane, budgetLabel(), BUDGETS, canWaitFor(), DEFAULT_MINUTES, effectivePriority(), estimateMinutes() (+12 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (22): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+14 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (84): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+76 more)

### Community 33 - "createWorkspace"
Cohesion: 0.13
Nodes (11): KNOWN, NEW, open(), TWO, FAILED, NEW_FOLDER, open(), createWorkspace() (+3 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.06
Nodes (83): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+75 more)

### Community 35 - "engine_api.ts"
Cohesion: 0.04
Nodes (62): engine, STAGE_SCALE, Coins(), EggArt(), MEDALS, StageArt(), FIRST_LEVEL, STAGES (+54 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.11
Nodes (32): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+24 more)

### Community 39 - "makeTask"
Cohesion: 0.06
Nodes (29): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+21 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.17
Nodes (32): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+24 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.27
Nodes (11): Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository, HEARTBEAT_MS, parseSession() (+3 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "package.json"
Cohesion: 0.04
Nodes (43): author, description, devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans (+35 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.22
Nodes (19): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexPasteLine(), openLineArgv(), openVsCode(), script() (+11 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.15
Nodes (21): GithubApi, accountsOf(), codeOf(), GhAccount, gitProtocolOf(), isGithubLogin(), rawAccounts(), cleanSettings() (+13 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.19
Nodes (16): statusText(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+8 more)

### Community 50 - "library_api.ts"
Cohesion: 0.20
Nodes (20): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+12 more)

### Community 51 - "activity.ts"
Cohesion: 0.18
Nodes (11): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+3 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.17
Nodes (8): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), VersionView

### Community 53 - "ref_types"
Cohesion: 0.08
Nodes (38): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Ctx, Env, Options, MenuSpec, Ports (+30 more)

### Community 54 - "helpers_api.spec.ts"
Cohesion: 0.16
Nodes (11): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+3 more)

### Community 55 - "File Structure"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "quest_flows.spec.ts"
Cohesion: 0.13
Nodes (12): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+4 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (15): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader(), orderOf(), parse() (+7 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "project_views.ts"
Cohesion: 0.21
Nodes (17): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+9 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.09
Nodes (75): 5. Features, shared resources and the core, Features, Shared resources, The core and the app, Task 12: `app/`, and the end of the flat files, Task 5: The shared resources' data and controllers, Task 6: `commit_guard` and `errands`, Task 9: Keeping usage down (+67 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.26
Nodes (9): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+1 more)

### Community 65 - "flows.spec.tsx"
Cohesion: 0.14
Nodes (12): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+4 more)

### Community 66 - "quests_edits.spec.tsx"
Cohesion: 0.10
Nodes (12): open(), one(), saga(), BOARD, CHOICES, FIRST, open(), SAGA (+4 more)

### Community 67 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.15
Nodes (16): Edit, Global Constraints, Queue-tea Implementation Plan, Review Focus, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches (+8 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "board_tools.tsx"
Cohesion: 0.12
Nodes (24): BoardSection, BoardView, EMPTY_BOARD, filterEntries(), Filters, hasFilters(), isFiltering(), matchesText() (+16 more)

### Community 70 - "mana.ts"
Cohesion: 0.18
Nodes (18): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+10 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.07
Nodes (65): Content(), Answer, DEFAULT_LOG_PATH, XP_BY_DIFFICULTY, Dialog(), Field(), FieldProps, Group() (+57 more)

### Community 73 - "check_layers.mjs"
Cohesion: 0.23
Nodes (13): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+5 more)

### Community 74 - "feedback.spec.tsx"
Cohesion: 0.17
Nodes (7): ACCOUNTS, BOARD, input(), open(), empty(), reply(), GithubLoginCode

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.26
Nodes (13): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+5 more)

### Community 77 - "start_api.spec.ts"
Cohesion: 0.17
Nodes (5): git(), NOW, onDisk(), run, seed()

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.04
Nodes (115): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft() (+107 more)

### Community 82 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (17): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+9 more)

### Community 89 - "record_source.ts"
Cohesion: 0.16
Nodes (24): p, canRestoreFrom(), Task 1: The helper list and the record field, What's saved, Data, 7. Acceptance criteria, New fields, backupPath() (+16 more)

### Community 90 - "start_task.ts"
Cohesion: 0.33
Nodes (11): ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase(), keepActivity(), blockedText(), blockersOf(), isBlocked() (+3 more)

### Community 91 - "board.spec.tsx"
Cohesion: 0.18
Nodes (6): BOARD, FIRST, open(), SAGA, SECOND, LiveFacts

### Community 92 - "currentTask"
Cohesion: 0.27
Nodes (9): Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), askDone(), currentTask(), orderQueue(), removeTask(), setPriority() (+1 more)

### Community 93 - "Architecture"
Cohesion: 0.09
Nodes (22): Architecture, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, One engine, two hosts (+14 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 96 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "test_support.ts"
Cohesion: 0.17
Nodes (15): chronicle(), mana(), game(), CHRONICLE, DESIGNS, GAME, helperJob(), HOARD (+7 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), open(), palette(), SECOND

### Community 102 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 106 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+2 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 111 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 112 - "Part 2: edits"
Cohesion: 0.33
Nodes (6): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 113 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "Host"
Cohesion: 0.14
Nodes (16): Task 1: the file seam, Host, RunResult, unixFiles(), folderOf(), readCodexActivity(), CodexRepository, readProjectPlace() (+8 more)

### Community 117 - "ref_node_os"
Cohesion: 0.09
Nodes (17): fileOf(), NOW, run, seed(), active(), logged, NOW, onDisk() (+9 more)

## Knowledge Gaps
- **7 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 880 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ref_node_fs` to `tasks_api.ts`, `update_runner.mjs`, `ref_node_path`, `preact`, `activity.spec.ts`, `first_run.tsx`, `t`, `judgements.spec.ts`, `fakeEngine`, `palette.ts`, `app.tsx`, `game.ts`, `branch_api.ts`, `createWorkspace`, `design_editor.tsx`, `designs_api.ts`, `makeTask`, `package.json`, `claude_code.ts`, `library_api.ts`, `designs.spec.tsx`, `helpers_api.spec.ts`, `quest_flows.spec.ts`, `host.ts`, `app_menu.ts`, `flows.spec.tsx`, `quests_edits.spec.tsx`, `board_tools.tsx`, `quest_detail.tsx`, `feedback.spec.tsx`, `start_api.spec.ts`, `quests_page.tsx`, `projects_api.spec.ts`, `designs_api.spec.ts`, `board.spec.tsx`, `detail.spec.tsx`, `test_support.ts`, `shell.spec.tsx`, `ref_node_os`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.04995004995004995 - nodes in this community are weakly interconnected._
- **Why does `Queue-tea: design` connect `Queue-tea: design` to `A task's life`, `The record`, `What Rohan sees`, `workspace-app.md`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `tasks_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07802639127940333 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `Host` to `ref_node_fs`, `opening_api.spec.ts`, `activity.spec.ts`, `scope.ts`, `git_source.ts`, `band_host.tsx`, `Part 2: edits`, `tests/helpers.ts`, `branch_api.ts`, `sessions.test.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `ref_types`, `File Structure`, `register.tsx`, `start_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `Architecture`, `Part B: the app`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._