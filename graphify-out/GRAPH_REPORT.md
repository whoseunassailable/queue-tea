# Graph Report - queue-tea  (2026-11-03)

## Corpus Check
- 385 files · ~293,770 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 2453 nodes · 8691 edges · 114 communities (107 shown, 7 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 633 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e69b75a8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- detail.spec.tsx
- vitest
- tasks_api.ts
- workspace_store.ts
- en.ts
- quests_page.tsx
- t
- feedback.e2e.ts
- scope.ts
- tasks_controller.ts
- record_source.ts
- fixes.test.ts
- first_run.tsx
- App
- Queue-tea: design
- ref_types
- ports.ts
- git_source.ts
- main.ts
- version.test.mjs
- File Structure
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
- engine_api.ts
- docs_log_source.ts
- opening_api.spec.ts
- quest_flows.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- formatMinutes
- queue_rules.ts
- menu_frame.tsx
- board.spec.tsx
- flows.e2e.ts
- package.json
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- devDependencies
- Roadmap: the outside review, checked against the code
- app.tsx
- ref_types
- flows.spec.tsx
- feedback.spec.tsx
- board.e2e.ts
- app_menu.ts
- scripts
- Shared Types (Task 1 writes them; every task uses them)
- Queue-tea architecture
- edits.e2e.ts
- Queue-tea: panel redesign
- register.tsx
- Workspace app, the rest of the road
- Part 3: setting out and coming back
- test_support.ts
- Guild helpers on tasks
- commit-chai-n.md
- pages.e2e.ts
- Host
- Queue-tea
- emptyRecord
- session_rhythm.ts
- Task 3: Helper chips in the app
- chai-pter.md
- main.tsx
- quests_edits.spec.tsx
- Repository Rules
- mocha-mockup.md
- tea-dd.md
- search.ts
- refresh_app.sh
- current_view.tsx
- tsconfig.json
- install_app.sh
- judgements.spec.ts
- project_source.ts
- board_tools.tsx
- projects_api.spec.ts
- shell.spec.tsx
- Architecture
- Queue-tea: workspace app
- What Rohan sees
- A task's life
- first_window.e2e.ts
- The record
- watcher.spec.ts
- Part 2: edits
- detail_api.ts
- Queue-tea: workspace app UI design
- Task Log
- GitState
- Part B: the app
- update_watch.ts
- 2. Visual direction
- Queue-tea, the workspace app
- Part A: the mod
- Plan: the board, recoverable tasks and checkpoints
- preload.ts
- Keeping usage down

## God Nodes (most connected - your core abstractions)
1. `t` - 71 edges
2. `emptyRecord()` - 64 edges
3. `currentTask()` - 59 edges
4. `Refusal` - 55 edges
5. `vitest` - 53 edges
6. `reply()` - 50 edges
7. `App()` - 49 edges
8. `formatMinutes()` - 49 edges
9. `What each screen reads from existing data` - 49 edges
10. `Reply` - 43 edges

## Surprising Connections (you probably didn't know these)
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `2. Rules` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `Tests` --references--> `helperToRemind()`  [INFERRED]
  docs/superpowers/specs/2026-11-03-guild-helpers-on-tasks-design.md → hooks/features/tasks/domain/services/task_rules.ts

## Import Cycles
- None detected.

## Communities (114 total, 7 thin omitted)

### Community 0 - "detail.spec.tsx"
Cohesion: 0.25
Nodes (5): ACTIVE, BOARD, FIRST, HELD, QUEST_FACTS

### Community 1 - "vitest"
Cohesion: 0.05
Nodes (52): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+44 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.09
Nodes (66): inGameWords(), Refusal, reply(), activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest() (+58 more)

### Community 3 - "workspace_store.ts"
Cohesion: 0.10
Nodes (24): DEFAULT_LOG_PATH, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, GROWS_AT, HOME_BADGES, HOME_BOARD_ROWS, PET_MS, SAVED_MS (+16 more)

### Community 4 - "en.ts"
Cohesion: 0.08
Nodes (33): fileNamed(), FILES, frontmatter(), Helper, helperOf(), HELPERS, KINDS, LOGOS (+25 more)

### Community 5 - "quests_page.tsx"
Cohesion: 0.06
Nodes (72): LINES_REFRESH_MS, dayAndTime(), dayOf(), Dragon(), Spinner(), GoldReward(), PriorityTag(), XpReward() (+64 more)

### Community 6 - "t"
Cohesion: 0.09
Nodes (46): Content(), Answer, ask(), Field(), ReadView(), Empty(), Failed(), Loading() (+38 more)

### Community 7 - "feedback.e2e.ts"
Cohesion: 0.08
Nodes (19): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), realm(), won() (+11 more)

### Community 8 - "scope.ts"
Cohesion: 0.11
Nodes (41): projectsFolder(), Logger, GAME_WORDS, MESSAGES, readChronicle(), GameDeps, readGame(), readHoard() (+33 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (72): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, Task 6: Docs, the real session check and every check, One engine, two hosts (+64 more)

### Community 10 - "record_source.ts"
Cohesion: 0.21
Nodes (21): canRestoreFrom(), onDisk(), onDisk(), onDisk(), Task 1: The helper list and the record field, Data, 7. Acceptance criteria, New fields (+13 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.19
Nodes (14): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+6 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.10
Nodes (43): HOLD_FILES_SHOWN, Dialog(), FieldProps, Group(), Pick(), accountsIn(), hasAccounts(), isGone() (+35 more)

### Community 13 - "App"
Cohesion: 0.32
Nodes (15): App(), open(), open(), open(), open(), open(), open(), open() (+7 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.12
Nodes (17): Errands, Helpers, Not included, Priority and difficulty, Queue-tea: design, Settings, Testing, The docs log (+9 more)

### Community 15 - "ref_types"
Cohesion: 0.08
Nodes (49): Order to fix them, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check, Task 4: The core, Task 9: `conversation` and `message_check` (+41 more)

### Community 16 - "ports.ts"
Cohesion: 0.10
Nodes (33): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 9: Keeping usage down, Ctx, Env, Options, MenuSpec (+25 more)

### Community 17 - "git_source.ts"
Cohesion: 0.28
Nodes (18): commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural(), readDrift() (+10 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (52): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+44 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.10
Nodes (29): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+21 more)

### Community 20 - "File Structure"
Cohesion: 0.15
Nodes (18): held(), hold(), File Structure, Global Constraints, Queue-tea Implementation Plan, Review Focus, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install (+10 more)

### Community 21 - "queue_controller.ts"
Cohesion: 0.21
Nodes (28): The eight items, Task 10: `tasks`: the queue side, fileFromCommand(), parentFor(), blockTask(), featureCommand(), moveTask(), pressBlock() (+20 more)

### Community 22 - "families.ts"
Cohesion: 0.18
Nodes (26): 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult, moveTaskUseCase(), activeFeature() (+18 more)

### Community 23 - "checkpoints.ts"
Cohesion: 0.18
Nodes (15): Already built, How Claude uses them (the mod), 4.1 Home, FIRST_MESSAGE_LABELS, checkLines(), commandRun(), count(), firstMessage() (+7 more)

### Community 24 - "band_host.tsx"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 25 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 26 - "game.ts"
Cohesion: 0.10
Nodes (31): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+23 more)

### Community 27 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (20): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+12 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.10
Nodes (28): Task 1: the file seam, unixFiles(), removeTaskUseCase(), removeTask(), CTX, fakePorts(), makeTask(), memoryHost() (+20 more)

### Community 29 - "palette.ts"
Cohesion: 0.10
Nodes (34): useWindowKeys(), actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore() (+26 more)

### Community 30 - "What each screen reads from existing data"
Cohesion: 0.12
Nodes (39): xpOf(), activeOf(), difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+31 more)

### Community 31 - "library_api.ts"
Cohesion: 0.23
Nodes (18): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+10 more)

### Community 32 - "engine_api.ts"
Cohesion: 0.10
Nodes (19): KNOWN, NEW, TWO, FAILED, NEW_FOLDER, Window, SETTINGS_PAGE, EngineApi (+11 more)

### Community 33 - "docs_log_source.ts"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 34 - "opening_api.spec.ts"
Cohesion: 0.25
Nodes (12): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+4 more)

### Community 35 - "quest_flows.ts"
Cohesion: 0.12
Nodes (24): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withoutReview(), withPlayNext(), withPriority() (+16 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.10
Nodes (15): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+7 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.18
Nodes (18): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+10 more)

### Community 38 - "formatMinutes"
Cohesion: 0.11
Nodes (35): EngineRead, useEngineRead(), clockTime(), dayName(), manaLeft(), refillTime(), weekdayIndex(), weekdayOf() (+27 more)

### Community 39 - "queue_rules.ts"
Cohesion: 0.18
Nodes (15): Task 10: The panel, the band, the status line and the commands, Task 2: Filing and editing carry the choice, edited(), editTaskUseCase(), TaskEdit, defaultHelpers(), isHelperId(), onlyHelpers() (+7 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (34): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+26 more)

### Community 41 - "board.spec.tsx"
Cohesion: 0.20
Nodes (5): BOARD, FIRST, SAGA, SECOND, LiveFacts

### Community 42 - "flows.e2e.ts"
Cohesion: 0.16
Nodes (8): APP, change(), editTask(), git(), noRequests(), onDisk(), run, stored()

### Community 43 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.22
Nodes (15): appleScriptText(), bringForwardArgv(), claudeLine(), openClaudeArgv(), openVsCode(), script(), shellQuote(), NASTY (+7 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.12
Nodes (25): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.10
Nodes (23): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+15 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.22
Nodes (14): applyPending(), CHANGES, countToolCall(), createTracker(), merge(), nothing(), once(), Pending (+6 more)

### Community 50 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, @playwright/test (+7 more)

### Community 51 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.18
Nodes (7): Audit: what the menu exposes of the engine, Problems not on the list, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 52 - "app.tsx"
Cohesion: 0.07
Nodes (47): ContentProps, moodOf(), MORE_PAGES, SheetProps, SheetView(), TABS, useHour(), ALL (+39 more)

### Community 53 - "ref_types"
Cohesion: 0.16
Nodes (14): Block, withBlock(), BlockResult, Deps, FinishResult, logRow(), totalMinutes(), putBackUseCase() (+6 more)

### Community 54 - "flows.spec.tsx"
Cohesion: 0.11
Nodes (15): BOARD, MAIN, OTHER, SEALED, withActive(), ACTIVE, HOLD, QUEST (+7 more)

### Community 55 - "feedback.spec.tsx"
Cohesion: 0.15
Nodes (9): ACCOUNTS, BOARD, input(), started(), empty(), projectView(), reply(), GithubLoginCode (+1 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "app_menu.ts"
Cohesion: 0.26
Nodes (9): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+1 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+3 more)

### Community 59 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.33
Nodes (7): Edit, Task 2: The record, Task 5: Time and effort, Task 7: The message check, Task 3: edits in the window, ProjectRecord, Task

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 5. Features, shared resources and the core, 7. Tests, 8. Getting there (+2 more)

### Community 61 - "edits.e2e.ts"
Cohesion: 0.12
Nodes (6): APP, onDisk(), SEED, stored(), titled(), APP

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.10
Nodes (50): Shared resources, The core and the app, Task 12: `app/`, and the end of the flat files, Task 5: The shared resources' data and controllers, drawCup(), renderBand(), stillCup(), pressOpenApp() (+42 more)

### Community 64 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 65 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 66 - "test_support.ts"
Cohesion: 0.16
Nodes (12): CHRONICLE, GAME, HOARD, LIBRARY, MANA, victoryLine(), WEEK, ChronicleView (+4 more)

### Community 67 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", What's saved (+3 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 70 - "Host"
Cohesion: 0.11
Nodes (28): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+20 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "emptyRecord"
Cohesion: 0.13
Nodes (15): record(), won(), NOW, record(), won(), record(), seed(), seed() (+7 more)

### Community 73 - "session_rhythm.ts"
Cohesion: 0.22
Nodes (21): live(), Features, Task 6: `commit_guard` and `errands`, runErrand(), commitWarning(), conversationState, Errand, ERRAND_NOT_SENT (+13 more)

### Community 74 - "Task 3: Helper chips in the app"
Cohesion: 0.67
Nodes (3): QuestForm, Task 3: Helper chips in the app, HelperId

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 77 - "quests_edits.spec.tsx"
Cohesion: 0.20
Nodes (7): BOARD, CHOICES, FIRST, SAGA, SECOND, BoardEntry, Choices

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "mocha-mockup.md"
Cohesion: 0.50
Nodes (3): How you work, What you don't do, What you report

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "search.ts"
Cohesion: 0.19
Nodes (14): BoardSection, BoardView, EMPTY_BOARD, filterEntries(), Filters, hasFilters(), isFiltering(), matchesText() (+6 more)

### Community 82 - "refresh_app.sh"
Cohesion: 1.00
Nodes (3): refresh(), say(), refresh_app.sh script

### Community 83 - "current_view.tsx"
Cohesion: 0.36
Nodes (10): readChoices(), capital(), markFor(), KEYS, pressPartOf(), drawCurrent(), familyButtons(), childrenOf() (+2 more)

### Community 86 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 89 - "project_source.ts"
Cohesion: 0.24
Nodes (10): readProjectPlace(), carryOverRecords(), recordPath(), projectRepositoryImpl(), ProjectPlace, ProjectRepository, projectRepositoryOf(), parseOffset() (+2 more)

### Community 90 - "board_tools.tsx"
Cohesion: 0.26
Nodes (11): Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel(), PRIORITIES, SearchAndFilters() (+3 more)

### Community 91 - "projects_api.spec.ts"
Cohesion: 0.22
Nodes (7): listProjects(), list(), logged, NOW, put(), putRecord(), read()

### Community 92 - "shell.spec.tsx"
Cohesion: 0.18
Nodes (9): BOARD, FIRST, key(), palette(), SECOND, input(), noop(), projectRow() (+1 more)

### Community 93 - "Architecture"
Cohesion: 0.20
Nodes (10): Architecture, Opening on a project, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The engine API, Updating while open (+2 more)

### Community 94 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 95 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 96 - "A task's life"
Cohesion: 0.29
Nodes (7): A task's life, Coming back later, Features, Filing a task, Finishing a task, Putting a task back, Starting a task

### Community 97 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 98 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 99 - "watcher.spec.ts"
Cohesion: 0.33
Nodes (6): hasChanged(), log, Stamps, stampsOf(), watchFolders(), WatchOptions

### Community 100 - "Part 2: edits"
Cohesion: 0.33
Nodes (6): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 101 - "detail_api.ts"
Cohesion: 0.54
Nodes (7): activeOf(), branchToBe(), gitOf(), linesSince(), quietly(), readQuestFacts(), dayKey()

### Community 102 - "Queue-tea: workspace app UI design"
Cohesion: 0.29
Nodes (8): options(), 1. Summary, 3. Information architecture, 5. Components, 6. Data, 8. Decisions, New files outside the record, Queue-tea: workspace app UI design

### Community 104 - "GitState"
Cohesion: 0.57
Nodes (3): holdCommandOf(), holdKindOf(), GitState

### Community 105 - "Part B: the app"
Cohesion: 0.22
Nodes (9): Global constraints, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 7: the project, Task 9: the game rules (+1 more)

### Community 106 - "update_watch.ts"
Cohesion: 0.53
Nodes (4): majorOf(), setup(), updateWatch(), WatchDeps

### Community 108 - "2. Visual direction"
Cohesion: 0.33
Nodes (6): 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.40
Nodes (5): Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "Part A: the mod"
Cohesion: 0.40
Nodes (5): Part A: the mod, Task 2: the new record fields, Task 4: `review`, Task 5: requests, Task 6: Open in Queue-tea app

### Community 111 - "Plan: the board, recoverable tasks and checkpoints"
Cohesion: 0.50
Nodes (4): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints

### Community 113 - "Keeping usage down"
Cohesion: 0.67
Nodes (3): Keeping usage down, Telling the mod a task looks done, What the mod itself costs

## Knowledge Gaps
- **6 isolated node(s):** `@types/node`, `electron-builder`, `jsdom`, `typescript`, `vite` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 685 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Host` connect `claude_code.ts` to `Workspace app, the rest of the road`, `vitest`, `opening_api.spec.ts`, `docs_log_source.ts`, `Host`, `scope.ts`, `Part B: the app`, `tasks_controller.ts`, `record_source.ts`, `github_api.ts`, `ref_types`, `ports.ts`, `git_source.ts`, `project_source.ts`, `tests/helpers.ts`, `register.tsx`, `Queue-tea: workspace app`, `library_api.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `electron-builder`, `jsdom` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.04868686868686869 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `test_support.ts` to `detail.spec.tsx`, `vitest`, `t`, `first_run.tsx`, `game.ts`, `palette.ts`, `library_api.ts`, `engine_api.ts`, `quest_flows.ts`, `board.spec.tsx`, `package.json`, `claude_code.ts`, `github_api.ts`, `app.tsx`, `flows.spec.tsx`, `feedback.spec.tsx`, `app_menu.ts`, `Host`, `emptyRecord`, `quests_edits.spec.tsx`, `search.ts`, `judgements.spec.ts`, `projects_api.spec.ts`, `shell.spec.tsx`, `watcher.spec.ts`, `GitState`, `update_watch.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `currentTask()` (e.g. with `Task 10: The panel, the band, the status line and the commands` and `Task 5: Time and effort`) actually correct?**
  _`currentTask()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `tasks_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09225225225225225 - nodes in this community are weakly interconnected._