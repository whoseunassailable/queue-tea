# Graph Report - queue-tea  (2026-11-03)

## Corpus Check
- 381 files · ~291,520 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 2427 nodes · 8634 edges · 107 communities (101 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 630 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db2dc96c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App
- vitest
- tasks_api.ts
- preact
- settings_page.tsx
- home_page.tsx
- t
- feedback.e2e.ts
- scope.ts
- tasks_controller.ts
- record_source.ts
- fixes.test.ts
- first_run.tsx
- fakeEngine
- Queue-tea: design
- ref_types
- ports.ts
- menu_frame.tsx
- main.ts
- version.test.mjs
- mana.ts
- backlog_view.tsx
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
- project_views.ts
- opening_api.spec.ts
- quest_edits.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- formatMinutes
- task_input.ts
- formatMinutes
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
- spec.md
- app.tsx
- deps.ts
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
- settings_api.ts
- queue_controller.ts
- newTask
- chai-pter.md
- main.tsx
- quests_edits.spec.tsx
- Repository Rules
- mocha-mockup.md
- tea-dd.md
- quests_page.tsx
- refresh_app.sh
- domain/helpers.ts
- tsconfig.json
- install_app.sh
- emptyRecord
- project_source.ts
- shell.e2e.ts
- assistant_providers.ts
- shell.spec.tsx
- card_note.ts
- Queue-tea: workspace app
- What Rohan sees
- A task's life
- first_window.e2e.ts
- The record
- vitest
- Part 2: edits
- write_handoff.ts
- Part 4: the rest of the screens
- Task Log
- Roadmap: the outside review, checked against the code
- Part B: the app
- workspace-app.md

## God Nodes (most connected - your core abstractions)
1. `t` - 71 edges
2. `emptyRecord()` - 64 edges
3. `currentTask()` - 59 edges
4. `Refusal` - 55 edges
5. `vitest` - 51 edges
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

## Communities (107 total, 6 thin omitted)

### Community 0 - "App"
Cohesion: 0.09
Nodes (21): App(), moodOf(), open(), useHour(), ACTIVE, BOARD, FIRST, HELD (+13 more)

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (64): appIdOf(), Flavor, flavorOf(), createLogger(), fileSink(), stackOf(), attempt(), failed() (+56 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.11
Nodes (50): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+42 more)

### Community 3 - "preact"
Cohesion: 0.07
Nodes (52): EngineRead, useEngineRead(), LINES_REFRESH_MS, Field(), Failed(), Loading(), HELPERS, emptyQuestForm() (+44 more)

### Community 4 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps (+9 more)

### Community 5 - "home_page.tsx"
Cohesion: 0.10
Nodes (36): HOLD_FILES_SHOWN, HOME_BADGES, HOME_BOARD_ROWS, Dragon(), Spinner(), GoldReward(), PriorityTag(), XpReward() (+28 more)

### Community 6 - "t"
Cohesion: 0.13
Nodes (25): Content(), Answer, Empty(), GuildPage(), skillsText(), BookErrors, BookField, BookForm (+17 more)

### Community 7 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (13): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), realm(), won() (+5 more)

### Community 8 - "scope.ts"
Cohesion: 0.10
Nodes (60): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+52 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (63): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once(), running, helperToRemind(), FinishResult, finishTaskUseCase() (+55 more)

### Community 10 - "record_source.ts"
Cohesion: 0.16
Nodes (25): canRestoreFrom(), onDisk(), onDisk(), onDisk(), Data, 7. Acceptance criteria, New fields, backupPath() (+17 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.19
Nodes (14): File Structure, checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS (+6 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.11
Nodes (38): Dialog(), FieldProps, Group(), Pick(), Window, accountsIn(), hasAccounts(), isGone() (+30 more)

### Community 13 - "fakeEngine"
Cohesion: 0.13
Nodes (15): ACTIVE, HOLD, open(), QUEST, started(), BOARD, fail, open() (+7 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "ref_types"
Cohesion: 0.10
Nodes (44): Order to fix them, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core, Task 9: `conversation` and `message_check`, drawCup() (+36 more)

### Community 16 - "ports.ts"
Cohesion: 0.12
Nodes (36): 5. Features, shared resources and the core, Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, pressRestore() (+28 more)

### Community 17 - "menu_frame.tsx"
Cohesion: 0.25
Nodes (16): Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, renderMenu(), grouped(), Els, MenuContext, resolvePane() (+8 more)

### Community 18 - "main.ts"
Cohesion: 0.08
Nodes (32): COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, SETTINGS_FILE, WATCH_SETTLE_MS (+24 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.10
Nodes (30): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+22 more)

### Community 20 - "mana.ts"
Cohesion: 0.24
Nodes (15): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+7 more)

### Community 21 - "backlog_view.tsx"
Cohesion: 0.18
Nodes (29): readChoices(), The eight items, Task 10: `tasks`: the queue side, capital(), markFor(), KEYS, fileFromCommand(), parentFor() (+21 more)

### Community 22 - "families.ts"
Cohesion: 0.19
Nodes (25): 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), TypedVerdict, FeatureFound, findFeatureUseCase(), MoveResult, moveTaskUseCase() (+17 more)

### Community 23 - "checkpoints.ts"
Cohesion: 0.19
Nodes (14): 4.1 Home, FIRST_MESSAGE_LABELS, checkLines(), commandRun(), count(), emptyCheckpoint(), isTestCommand(), lastLine() (+6 more)

### Community 24 - "band_host.tsx"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 25 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 26 - "game.ts"
Cohesion: 0.16
Nodes (23): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+15 more)

### Community 27 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (18): STAGE_SCALE, Coins(), EggArt(), Sky(), StageArt(), ReadView(), FIRST_LEVEL, STAGES (+10 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (33): shouldCheck(), fileTask(), startTask(), CTX, fakePorts(), makeTask(), memoryHost(), Run (+25 more)

### Community 29 - "palette.ts"
Cohesion: 0.14
Nodes (23): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+15 more)

### Community 30 - "What each screen reads from existing data"
Cohesion: 0.16
Nodes (27): questOf(), Audit: what the menu exposes of the engine, Problems not on the list, Already built, 4.9 Back to queue, Blocked…, Move and Remove, What each screen reads from existing data, startTaskUseCase(), blockedTasks() (+19 more)

### Community 31 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 32 - "engine_api.ts"
Cohesion: 0.11
Nodes (27): engine, MEDALS, withoutReview(), askingLine(), stepLine(), Named, QuestFlows, CardProps (+19 more)

### Community 33 - "project_views.ts"
Cohesion: 0.23
Nodes (14): activeOf(), difficultyOf(), entryOf(), minutesOf(), rowOf(), sessionInfoOf(), statusOf(), victoryOf() (+6 more)

### Community 34 - "opening_api.spec.ts"
Cohesion: 0.20
Nodes (14): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+6 more)

### Community 35 - "quest_edits.ts"
Cohesion: 0.36
Nodes (9): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withPlayNext(), withPriority(), QuestEdits (+1 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.18
Nodes (18): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+10 more)

### Community 38 - "formatMinutes"
Cohesion: 0.08
Nodes (51): hrefOf(), GROWS_AT, clockTime(), dayAndTime(), dayName(), dayOf(), manaLeft(), refillTime() (+43 more)

### Community 39 - "task_input.ts"
Cohesion: 0.17
Nodes (25): criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf(), helpersOf(), newQuestOf(), parentOf(), PRIORITIES (+17 more)

### Community 40 - "formatMinutes"
Cohesion: 0.22
Nodes (18): Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHome(), ENTRIES, pressOpenApp(), PRIORITY_COLOR, sum(), total(), drawUsage() (+10 more)

### Community 41 - "board.spec.tsx"
Cohesion: 0.20
Nodes (5): BOARD, FIRST, open(), SAGA, SECOND

### Community 42 - "flows.e2e.ts"
Cohesion: 0.16
Nodes (8): APP, change(), editTask(), git(), noRequests(), onDisk(), run, stored()

### Community 43 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.29
Nodes (12): appleScriptText(), bringForwardArgv(), claudeLine(), openClaudeArgv(), openVsCode(), script(), shellQuote(), NASTY (+4 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.22
Nodes (11): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+3 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.07
Nodes (29): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+21 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.24
Nodes (12): applyPending(), CHANGES, countToolCall(), createTracker(), merge(), nothing(), once(), Pending (+4 more)

### Community 50 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, @playwright/test (+7 more)

### Community 51 - "spec.md"
Cohesion: 0.18
Nodes (7): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Global Constraints, Queue-tea Implementation Plan, Review Focus

### Community 52 - "app.tsx"
Cohesion: 0.07
Nodes (43): ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, ALL, Route, routeOf() (+35 more)

### Community 53 - "deps.ts"
Cohesion: 0.06
Nodes (56): holdCommandOf(), holdKindOf(), Task 8: The task flow, addRow(), capital(), escapeCell(), HEAD, rowLine() (+48 more)

### Community 54 - "flows.spec.tsx"
Cohesion: 0.15
Nodes (11): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+3 more)

### Community 55 - "feedback.spec.tsx"
Cohesion: 0.10
Nodes (11): ACCOUNTS, BOARD, input(), open(), FAILED, NEW_FOLDER, empty(), SETTINGS_PAGE (+3 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "app_menu.ts"
Cohesion: 0.24
Nodes (10): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+2 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+3 more)

### Community 59 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.21
Nodes (12): Edit, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 4: The git guard, Task 5: Time and effort, Task 6: The docs log (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.18
Nodes (9): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+1 more)

### Community 61 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.11
Nodes (53): live(), The core and the app, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, pressMenu(), toggleMenu(), loadContext(), beat() (+45 more)

### Community 64 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 65 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 66 - "test_support.ts"
Cohesion: 0.16
Nodes (16): chronicle(), mana(), questAheadOf(), game(), QUEST, CHRONICLE, GAME, HOARD (+8 more)

### Community 67 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+4 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 70 - "Host"
Cohesion: 0.20
Nodes (13): NOW, record(), Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository (+5 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "settings_api.ts"
Cohesion: 0.24
Nodes (14): cleanSettings(), DEFAULT_SETTINGS, isFolds(), isLastProject(), isRealmAccounts(), isScope(), isSky(), isTerminal() (+6 more)

### Community 73 - "queue_controller.ts"
Cohesion: 0.17
Nodes (22): Features, Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), clearHold(), blockTask(), featureCommand(), moveTask() (+14 more)

### Community 74 - "newTask"
Cohesion: 0.20
Nodes (9): QuestForm, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 1: The helper list and the record field, Task 3: Helper chips in the app, Task 6: Docs, the real session check and every check, newTask() (+1 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 77 - "quests_edits.spec.tsx"
Cohesion: 0.20
Nodes (7): BOARD, CHOICES, FIRST, open(), SAGA, SECOND, BoardEntry

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "mocha-mockup.md"
Cohesion: 0.50
Nodes (3): How you work, What you don't do, What you report

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.06
Nodes (57): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, useWindowKeys(), useWindowWidth(), metaOf(), openRow(), plain(), Row (+49 more)

### Community 82 - "refresh_app.sh"
Cohesion: 1.00
Nodes (3): refresh(), say(), refresh_app.sh script

### Community 83 - "domain/helpers.ts"
Cohesion: 0.28
Nodes (8): fileNamed(), FILES, frontmatter(), Helper, helperOf(), KINDS, LOGOS, HELPER_IDS

### Community 86 - "emptyRecord"
Cohesion: 0.06
Nodes (35): BUNDLE, git(), plist(), run, STAGE, record(), won(), record() (+27 more)

### Community 89 - "project_source.ts"
Cohesion: 0.42
Nodes (6): readProjectPlace(), carryOverRecords(), recordPath(), ProjectPlace, ProjectRepository, parseOffset()

### Community 91 - "assistant_providers.ts"
Cohesion: 0.46
Nodes (4): assistantRepositoryOf(), assistantRepositoryImpl(), Reply, AssistantRepository

### Community 92 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), open(), palette(), SECOND

### Community 93 - "card_note.ts"
Cohesion: 0.36
Nodes (8): 4.4 A task's detail: current, queued and done, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), firstMessage(), latestNote()

### Community 94 - "Queue-tea: workspace app"
Cohesion: 0.11
Nodes (19): Acceptance criteria, Architecture, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release (+11 more)

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

### Community 99 - "vitest"
Cohesion: 0.53
Nodes (4): skyAt(), skyOf(), SkyTime, vitest

### Community 100 - "Part 2: edits"
Cohesion: 0.33
Nodes (6): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 101 - "write_handoff.ts"
Cohesion: 0.47
Nodes (5): factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), checkpointPrompt()

### Community 102 - "Part 4: the rest of the screens"
Cohesion: 0.40
Nodes (5): Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window

### Community 104 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 105 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 107 - "workspace-app.md"
Cohesion: 0.27
Nodes (5): Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

## Knowledge Gaps
- **6 isolated node(s):** `@types/node`, `electron-builder`, `jsdom`, `typescript`, `vite` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 679 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Host` connect `scope.ts` to `vitest`, `record_source.ts`, `ref_types`, `ports.ts`, `tests/helpers.ts`, `library_api.ts`, `opening_api.spec.ts`, `task_input.ts`, `claude_code.ts`, `github_api.ts`, `deps.ts`, `register.tsx`, `Workspace app, the rest of the road`, `Host`, `settings_api.ts`, `emptyRecord`, `project_source.ts`, `Queue-tea: workspace app`, `Part B: the app`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `electron-builder`, `jsdom` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App` be split into smaller, more focused modules?**
  _Cohesion score 0.09425287356321839 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `App`, `vitest`, `t`, `first_run.tsx`, `fakeEngine`, `game.ts`, `palette.ts`, `library_api.ts`, `opening_api.spec.ts`, `board.spec.tsx`, `package.json`, `claude_code.ts`, `github_api.ts`, `deps.ts`, `flows.spec.tsx`, `feedback.spec.tsx`, `app_menu.ts`, `test_support.ts`, `Host`, `settings_api.ts`, `quests_edits.spec.tsx`, `quests_page.tsx`, `emptyRecord`, `shell.spec.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `currentTask()` (e.g. with `Task 10: The panel, the band, the status line and the commands` and `Task 5: Time and effort`) actually correct?**
  _`currentTask()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.03827483196415235 - nodes in this community are weakly interconnected._