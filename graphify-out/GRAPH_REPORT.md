# Graph Report - main-integration  (2026-11-06)

## Corpus Check
- 508 files · ~395,156 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 3, .pen 1)

## Summary
- 3224 nodes · 11731 edges · 120 communities (112 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 669 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c96e826`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- holdReason
- core/logger.ts
- tasks_api.ts
- update_runner.mjs
- ref_types
- pages.e2e.ts
- t
- edits.e2e.ts
- opening_api.spec.ts
- tasks_controller.ts
- designs_page.tsx
- check_prompt.ts
- first_run.tsx
- t
- Queue-tea: design
- cup_mood.ts
- scope.ts
- Host
- main.ts
- version.test.mjs
- judgements.spec.ts
- queue_controller.ts
- families.ts
- ref_node_os
- palette.ts
- band_host.tsx
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- states.tsx
- project_views.ts
- game.ts
- branch_api.ts
- test_support.ts
- design_editor.tsx
- hoard_page.tsx
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- makeTask
- menu_frame.tsx
- projects_api.spec.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- library_api.ts
- activity.ts
- designs.ts
- ref_types
- app.tsx
- requests_controller.ts
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- workspace_store.ts
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- chronicle_page.tsx
- view_store.ts
- Task
- commit-chai-n.md
- github_api.ts
- mana.ts
- Queue-tea
- quest_detail.tsx
- check_layers.mjs
- package.json
- chai-pter.md
- branch_workflow.e2e.ts
- start_api.spec.ts
- server.spec.ts
- Roadmap: the outside review, checked against the code
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- start_api.ts
- inspector.tsx
- Queue-tea: workspace app
- Architecture
- Designs tab
- Part B: the app
- Queue-tea in Codex
- Branch workflow completion — 5 November 2026
- Part 4: the rest of the screens
- release_guard.d.mts
- Tea-concile
- bundle.ts
- Queue-tea: workspace app UI design
- Task Log
- fixes.test.ts
- shell.e2e.ts
- electron.vite.config.ts
- workspace-app.md
- Guild helpers on tasks
- Queue-tea, the workspace app
- first_window.e2e.ts
- guild.e2e.ts
- Part 2: edits
- main.tsx
- .line-check-NZS8Gw/tsconfig.json
- project_source.ts
- Part A: the mod
- vitest
- shared/codex.test.ts
- dependencies

## God Nodes (most connected - your core abstractions)
1. `t` - 95 edges
2. `Refusal` - 92 edges
3. `vitest` - 80 edges
4. `emptyRecord()` - 79 edges
5. `reply()` - 72 edges
6. `currentTask()` - 64 edges
7. `preact` - 57 edges
8. `scopeOf()` - 54 edges
9. `Reply` - 54 edges
10. `EngineApi` - 54 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Behaviour` --references--> `fileQuest()`  [INFERRED]
  docs/design-tab.md → app/main/features/tasks/api/tasks_api.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts

## Import Cycles
- None detected.

## Communities (120 total, 8 thin omitted)

### Community 0 - "holdReason"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 1 - "core/logger.ts"
Cohesion: 0.06
Nodes (36): createLogger(), Logger, stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+28 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.10
Nodes (50): inGameWords(), Refusal, isSagaWon(), kindOf(), newBadges(), victoryOf(), finishQuest(), keepLog() (+42 more)

### Community 3 - "update_runner.mjs"
Cohesion: 0.09
Nodes (33): UPDATE_TEXT, Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps (+25 more)

### Community 4 - "ref_types"
Cohesion: 0.24
Nodes (12): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Task 2: Filing and editing carry the choice, edited(), editTaskUseCase(), TaskEdit (+4 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "t"
Cohesion: 0.11
Nodes (42): Content(), Answer, ask(), EngineRead, useEngineRead(), ReadView(), Empty(), Loading() (+34 more)

### Community 7 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (70): Features, Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once() (+62 more)

### Community 10 - "designs_page.tsx"
Cohesion: 0.10
Nodes (39): colourError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors, NextField (+31 more)

### Community 11 - "check_prompt.ts"
Cohesion: 0.21
Nodes (13): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+5 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.16
Nodes (26): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+18 more)

### Community 13 - "t"
Cohesion: 0.08
Nodes (33): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+25 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 16 - "scope.ts"
Cohesion: 0.09
Nodes (55): projectsFolder(), GAME_WORDS, MESSAGES, reply(), readPush(), readGame(), readHoard(), readMana() (+47 more)

### Community 17 - "Host"
Cohesion: 0.06
Nodes (55): loadCodexContext(), held(), hold(), File Structure, Queue-tea Implementation Plan, Review Focus, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install (+47 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (52): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+44 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 21 - "queue_controller.ts"
Cohesion: 0.18
Nodes (30): The eight items, Task 10: `tasks`: the queue side, KEYS, setFeatureUseCase(), fileFromCommand(), parentFor(), featureCommand(), moveTask() (+22 more)

### Community 22 - "families.ts"
Cohesion: 0.18
Nodes (30): readChoices(), 4.5 New task, and Add child task inline, What each screen reads from existing data, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult (+22 more)

### Community 23 - "ref_node_os"
Cohesion: 0.08
Nodes (25): BUNDLE, git(), plist(), run, STAGE, NOW, record(), won() (+17 more)

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (22): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+14 more)

### Community 25 - "band_host.tsx"
Cohesion: 0.11
Nodes (43): Order to fix them, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check, Task 4: The core, Task 9: `conversation` and `message_check` (+35 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.08
Nodes (43): AT, COMMIT_ACTIVITY_LIMIT, readActivity(), log, step(), Already built, 4.1 Home, 4.4 A task's detail: current, queued and done (+35 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (41): record(), won(), seed(), seed(), seed(), seed(), seed(), seed() (+33 more)

### Community 29 - "states.tsx"
Cohesion: 0.11
Nodes (32): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), Spinner(), UpdateControl() (+24 more)

### Community 30 - "project_views.ts"
Cohesion: 0.11
Nodes (39): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+31 more)

### Community 31 - "game.ts"
Cohesion: 0.19
Nodes (18): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+10 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (90): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+82 more)

### Community 33 - "test_support.ts"
Cohesion: 0.03
Nodes (105): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+97 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.11
Nodes (46): commit(), History, historyOf(), redo(), undo(), Box, clamp(), copyWithIds() (+38 more)

### Community 35 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (19): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+11 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.13
Nodes (31): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+23 more)

### Community 39 - "makeTask"
Cohesion: 0.10
Nodes (12): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+4 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.18
Nodes (30): Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp(), renderMenu() (+22 more)

### Community 41 - "projects_api.spec.ts"
Cohesion: 0.11
Nodes (23): readCodexSession(), Observation, observeTask(), list(), logged, NOW, put(), putRecord() (+15 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, @playwright/test (+7 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.22
Nodes (20): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+12 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.24
Nodes (14): cleanSettings(), DEFAULT_SETTINGS, isFolds(), isLastProject(), isRealmAccounts(), isScope(), isSky(), isTerminal() (+6 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.12
Nodes (17): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+9 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.22
Nodes (16): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+8 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.ts"
Cohesion: 0.18
Nodes (9): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+1 more)

### Community 52 - "designs.ts"
Cohesion: 0.13
Nodes (19): commentError(), CommentRow(), CommentsPanel(), Props, CardRead, Props, Author, CommentInput (+11 more)

### Community 53 - "ref_types"
Cohesion: 0.07
Nodes (47): codexOperations(), CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, One engine, two hosts, Ctx, Env (+39 more)

### Community 54 - "app.tsx"
Cohesion: 0.09
Nodes (31): ContentProps, MORE_PAGES, SheetProps, TABS, skyAt(), skyOf(), SkyTime, useWindowKeys() (+23 more)

### Community 55 - "requests_controller.ts"
Cohesion: 0.13
Nodes (31): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, shouldFresh(), shouldHandoff(), windowKey(), turnEnd(), afterTurn() (+23 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.08
Nodes (39): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withoutReview(), withPlayNext(), withPriority() (+31 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (17): HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader() (+9 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.18
Nodes (11): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 5. Features, shared resources and the core, 7. Tests, 8. Getting there (+3 more)

### Community 61 - "workspace_store.ts"
Cohesion: 0.08
Nodes (31): AUTOSAVE_MS, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX, GROWS_AT, HOLD_FILES_SHOWN, HOME_BADGES, HOME_BOARD_ROWS (+23 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.09
Nodes (66): live(), The core and the app, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, toggleMenu() (+58 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (34): clockTime(), dayName(), manaLeft(), refillTime(), weekdayIndex(), weekdayOf(), BAR_PX, Column() (+26 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 67 - "Task"
Cohesion: 0.33
Nodes (7): Edit, Task 2: The record, Task 5: Time and effort, Task 7: The message check, Task 3: edits in the window, ProjectRecord, Task

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "github_api.ts"
Cohesion: 0.20
Nodes (12): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+4 more)

### Community 70 - "mana.ts"
Cohesion: 0.13
Nodes (27): readChronicle(), chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf() (+19 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.07
Nodes (54): SheetView(), DEFAULT_LOG_PATH, Dialog(), Field(), FieldProps, Group(), Pick(), Failed() (+46 more)

### Community 73 - "check_layers.mjs"
Cohesion: 0.23
Nodes (13): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+5 more)

### Community 74 - "package.json"
Cohesion: 0.14
Nodes (13): author, description, license, main, name, private, productName, version (+5 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 77 - "start_api.spec.ts"
Cohesion: 0.20
Nodes (3): git(), NOW, run

### Community 78 - "server.spec.ts"
Cohesion: 0.11
Nodes (26): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+18 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.04
Nodes (98): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), dayOf(), isClaudeOut(), NOW, Dragon(), GoldReward() (+90 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 89 - "record_source.ts"
Cohesion: 0.11
Nodes (33): p, canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord(), onDisk(), onDisk() (+25 more)

### Community 90 - "start_api.ts"
Cohesion: 0.20
Nodes (18): checkStart(), continueIn(), copyText(), goneSentence(), handOver(), holdOf(), isClaudeWorking(), needFolder() (+10 more)

### Community 91 - "inspector.tsx"
Cohesion: 0.29
Nodes (8): numberError(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, isFrame(), LIMITS

### Community 92 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 93 - "Architecture"
Cohesion: 0.15
Nodes (13): Architecture, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The Designs tab (+5 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "Part B: the app"
Cohesion: 0.20
Nodes (10): Global constraints, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 7: the project, Task 8: the backend (+2 more)

### Community 96 - "Queue-tea in Codex"
Cohesion: 0.25
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Part 4: the rest of the screens"
Cohesion: 0.20
Nodes (10): chronicle(), mana(), game(), 6. The app: frontend, backend and storage, Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage B: Settings, first run and the failed record (+2 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "bundle.ts"
Cohesion: 0.38
Nodes (6): commitOfProvenance(), isNumber(), Restored, restoredOf(), versionOfPlist(), installedBuild()

### Community 102 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 106 - "electron.vite.config.ts"
Cohesion: 0.33
Nodes (5): esbuild, writeBundle(), electron-vite, @preact/preset-vite, vite

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+3 more)

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
Cohesion: 0.29
Nodes (7): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working, FileInput

### Community 113 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "project_source.ts"
Cohesion: 0.53
Nodes (5): readProjectPlace(), carryOverRecords(), recordPath(), ProjectPlace, parseOffset()

### Community 116 - "Part A: the mod"
Cohesion: 0.33
Nodes (6): Part A: the mod, Task 1: the file seam, Task 2: the new record fields, Task 4: `review`, Task 5: requests, Task 6: Open in Queue-tea app

### Community 117 - "vitest"
Cohesion: 0.07
Nodes (22): hasChanged(), log, Stamps, stampsOf(), watchFolders(), WatchOptions, now, counts (+14 more)

### Community 118 - "shared/codex.test.ts"
Cohesion: 0.40
Nodes (3): codexLog(), NOW, SINCE

### Community 119 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, @modelcontextprotocol/sdk, zod

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 896 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `core/logger.ts`, `update_runner.mjs`, `t`, `designs_page.tsx`, `first_run.tsx`, `t`, `Host`, `judgements.spec.ts`, `ref_node_os`, `palette.ts`, `checkpoints.ts`, `tests/helpers.ts`, `states.tsx`, `game.ts`, `branch_api.ts`, `test_support.ts`, `design_editor.tsx`, `designs_api.ts`, `projects_api.spec.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `designs.ts`, `ref_types`, `app.tsx`, `engine_api.ts`, `host.ts`, `app_menu.ts`, `github_api.ts`, `mana.ts`, `quest_detail.tsx`, `package.json`, `start_api.spec.ts`, `server.spec.ts`, `quests_page.tsx`, `designs_api.spec.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06386066763425254 - nodes in this community are weakly interconnected._
- **Why does `edited()` connect `ref_types` to `Designs tab`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `tasks_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10087719298245613 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `tests/helpers.ts` to `core/logger.ts`, `tasks_controller.ts`, `cup_mood.ts`, `scope.ts`, `judgements.spec.ts`, `families.ts`, `ref_node_os`, `game.ts`, `branch_api.ts`, `ui.test.tsx`, `makeTask`, `projects_api.spec.ts`, `4. Screens`, `ref_types`, `Task`, `mana.ts`, `branch_workflow.e2e.ts`, `start_api.spec.ts`, `server.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `fixes.test.ts`, `vitest`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._