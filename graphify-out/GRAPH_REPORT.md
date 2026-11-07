# Graph Report - notes-workspace  (2026-11-07)

## Corpus Check
- 520 files · ~407,701 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3332 nodes · 12171 edges · 118 communities (111 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 675 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d63372c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- core/logger.ts
- tasks_api.ts
- update_runner.mjs
- ref_types
- pages.e2e.ts
- designs_page.tsx
- env.ts
- opening_api.spec.ts
- tasks_controller.ts
- designs.ts
- check_prompt.ts
- first_run.tsx
- t
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- judgements.spec.ts
- backlog_view.tsx
- families.ts
- ref_types
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
- sessions.test.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- activity.ts
- designs.spec.tsx
- time.ts
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
- docs_log_source.ts
- commit-chai-n.md
- detail_api.ts
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
- parseRecord
- worktrees_repository_impl.ts
- inspector.tsx
- Queue-tea: workspace app
- Architecture
- Designs tab
- Part B: the app
- Queue-tea in Codex
- Branch workflow completion — 5 November 2026
- projects_api.spec.ts
- release_guard.d.mts
- Tea-concile
- opening_api.spec.ts
- GitState
- Task Log
- checkpoint.test.ts
- codex_providers.ts
- flow.test.ts
- Guild helpers on tasks
- Queue-tea, the workspace app
- ref_node_path
- helpers_api.ts
- orderQueue
- main.tsx
- .line-check-NZS8Gw/tsconfig.json
- Review Focus
- electron
- ref_node_fs

## God Nodes (most connected - your core abstractions)
1. `t` - 100 edges
2. `Refusal` - 96 edges
3. `vitest` - 84 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `currentTask()` - 64 edges
7. `preact` - 60 edges
8. `Reply` - 58 edges
9. `EngineApi` - 58 edges
10. `scopeOf()` - 56 edges

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

## Communities (118 total, 7 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.06
Nodes (66): jsonOr(), NoteFile, OWNED, parseNote(), questsOf(), tagsOf(), textOf(), body() (+58 more)

### Community 1 - "core/logger.ts"
Cohesion: 0.05
Nodes (44): createLogger(), Logger, stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+36 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.09
Nodes (71): inGameWords(), Refusal, changeOf(), Loaded, NotesApi, NotesDeps, proposedOf(), same() (+63 more)

### Community 3 - "update_runner.mjs"
Cohesion: 0.09
Nodes (32): run, Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps (+24 more)

### Community 4 - "ref_types"
Cohesion: 0.24
Nodes (10): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Task 2: Filing and editing carry the choice, edited(), editTaskUseCase(), TaskEdit (+2 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "designs_page.tsx"
Cohesion: 0.08
Nodes (48): ask(), EngineRead, useEngineRead(), DETAIL_IS_PAGE_BELOW, THUMB_BOX, ReadView(), BRANCH_POLL_MS, HELPER_DRAG (+40 more)

### Community 7 - "env.ts"
Cohesion: 0.13
Nodes (28): pressOpenApp(), clearCrashed(), writeBeat(), Ctx, Env, Options, MenuSpec, Ports (+20 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.38
Nodes (9): canWrite(), installCommand(), commandFileIn(), findCommand(), isOurs(), needsPath(), COMMAND_MARK, COMMAND_SCRIPT (+1 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (47): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once(), running (+39 more)

### Community 10 - "designs.ts"
Cohesion: 0.11
Nodes (29): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+21 more)

### Community 11 - "check_prompt.ts"
Cohesion: 0.13
Nodes (17): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+9 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.15
Nodes (28): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+20 more)

### Community 13 - "t"
Cohesion: 0.09
Nodes (28): fileNamed(), FILES, frontmatter(), Helper, helperOf(), HELPERS, KINDS, LOGOS (+20 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.13
Nodes (22): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+14 more)

### Community 16 - "scope.ts"
Cohesion: 0.08
Nodes (57): projectsFolder(), GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame(), readHoard() (+49 more)

### Community 17 - "git_source.ts"
Cohesion: 0.21
Nodes (23): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+15 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (60): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+52 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "judgements.spec.ts"
Cohesion: 0.33
Nodes (8): Asked, askedOf(), idOf(), judgementWatch(), broken, setup(), WatchDeps, Scanned

### Community 21 - "backlog_view.tsx"
Cohesion: 0.21
Nodes (23): readChoices(), The eight items, capital(), markFor(), total(), KEYS, pressBlock(), pressBudget() (+15 more)

### Community 22 - "families.ts"
Cohesion: 0.10
Nodes (43): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), rowOf(), sessionInfoOf(), statusOf() (+35 more)

### Community 23 - "ref_types"
Cohesion: 0.08
Nodes (26): APP, onDisk(), SEED, stored(), titled(), BUNDLE, git(), plist() (+18 more)

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (22): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+14 more)

### Community 25 - "band_host.tsx"
Cohesion: 0.18
Nodes (23): Order to fix them, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand(), showBand(), cancelHeld() (+15 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.11
Nodes (19): chronicle(), mana(), game(), 6. The app: frontend, backend and storage, After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus (+11 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.16
Nodes (19): 4.4 A task's detail: current, queued and done, CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointPrompt() (+11 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (32): CTX, fakePorts(), makeTask(), memoryHost(), Run, current(), setup(), setup() (+24 more)

### Community 29 - "states.tsx"
Cohesion: 0.10
Nodes (32): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), setup(), UpdateControl() (+24 more)

### Community 30 - "project_views.ts"
Cohesion: 0.15
Nodes (31): questOf(), Already built, 4.2 Tasks, with a feature in the detail pane, What each screen reads from existing data, ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase() (+23 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (23): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+15 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (86): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+78 more)

### Community 33 - "test_support.ts"
Cohesion: 0.03
Nodes (102): App(), open(), BOARD, FIRST, open(), SAGA, SECOND, click() (+94 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (40): commit(), History, historyOf(), redo(), undo(), Box, clamp(), copyWithIds() (+32 more)

### Community 35 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (19): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+11 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.05
Nodes (51): held(), hold(), Edit, Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record (+43 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.12
Nodes (34): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+26 more)

### Community 39 - "makeTask"
Cohesion: 0.07
Nodes (22): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+14 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.17
Nodes (31): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+23 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.18
Nodes (16): Part A: the mod, Task 2: the new record fields, Task 3: session files, Task 4: `review`, Task 5: requests, Task 6: Open in Queue-tea app, readSessions(), removeSessionFile() (+8 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, @modelcontextprotocol/sdk (+9 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.21
Nodes (21): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+13 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.11
Nodes (22): GithubDeps, login(), accountsOf(), GhAccount, gitProtocolOf(), isGithubLogin(), rawAccounts(), cleanSettings() (+14 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.06
Nodes (34): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+26 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.14
Nodes (32): Task 10: `tasks`: the queue side, blockTaskUseCase(), removeTaskUseCase(), setPriorityUseCase(), fileFromCommand(), fileTask(), parentFor(), clearHold() (+24 more)

### Community 50 - "library_api.ts"
Cohesion: 0.20
Nodes (20): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+12 more)

### Community 51 - "activity.ts"
Cohesion: 0.12
Nodes (18): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+10 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.17
Nodes (8): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), VersionView

### Community 53 - "time.ts"
Cohesion: 0.09
Nodes (33): Block, withBlock(), BlockResult, Deps, FinishResult, finishTaskUseCase(), markRemindedUseCase(), noteHelperUseCase() (+25 more)

### Community 54 - "app.tsx"
Cohesion: 0.08
Nodes (39): Content(), ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), skyAt() (+31 more)

### Community 55 - "requests_controller.ts"
Cohesion: 0.13
Nodes (28): Shared resources, Task 5: The shared resources' data and controllers, File Structure, Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey() (+20 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.06
Nodes (56): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest() (+48 more)

### Community 58 - "host.ts"
Cohesion: 0.22
Nodes (13): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, parse(), Seen, seenIn() (+5 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "workspace_store.ts"
Cohesion: 0.07
Nodes (37): AUTOSAVE_MS, DEFAULT_LOG_PATH, DETAIL_FLOATS_BELOW, DRAG_SLOP_PX, HOLD_FILES_SHOWN, HOME_BADGES, HOME_BOARD_ROWS, NOTE_AUTOSAVE_MS (+29 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.10
Nodes (69): live(), 5. Features, shared resources and the core, Features, The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, drawCup() (+61 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.23
Nodes (10): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (33): clockTime(), dayName(), manaLeft(), NOW, weekdayIndex(), weekdayOf(), BAR_PX, Column() (+25 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "detail_api.ts"
Cohesion: 0.26
Nodes (13): readCodexSession(), Observation, observeTask(), activeOf(), branchToBe(), gitOf(), linesSince(), quietly() (+5 more)

### Community 70 - "mana.ts"
Cohesion: 0.24
Nodes (15): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+7 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.08
Nodes (60): SheetView(), Answer, Dialog(), Field(), FieldProps, Group(), Pick(), Failed() (+52 more)

### Community 73 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

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
Cohesion: 0.18
Nodes (4): git(), NOW, run, seed()

### Community 78 - "server.spec.ts"
Cohesion: 0.09
Nodes (33): log, main(), loadCodexContext(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions() (+25 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.11
Nodes (13): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Global Constraints, Parallel quests: implementation decisions, Queue-tea Implementation Plan, Review Focus (+5 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (92): GROWS_AT, dayOf(), isClaudeOut(), refillTime(), Dragon(), Spinner(), GoldReward(), PriorityTag() (+84 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 89 - "parseRecord"
Cohesion: 0.06
Nodes (44): canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord(), active(), NOW, onDisk() (+36 more)

### Community 91 - "inspector.tsx"
Cohesion: 0.23
Nodes (13): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+5 more)

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
Cohesion: 0.22
Nodes (9): Global constraints, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 7: the project, Task 9: the game rules (+1 more)

### Community 96 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "opening_api.spec.ts"
Cohesion: 0.28
Nodes (5): openedFromUrl(), OpeningDeps, logged, run, pathFromUrl()

### Community 102 - "GitState"
Cohesion: 0.39
Nodes (5): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, fakeGit()

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "checkpoint.test.ts"
Cohesion: 0.42
Nodes (5): checkLines(), count(), checkNowUseCase(), GitRepository, REPLY

### Community 105 - "codex_providers.ts"
Cohesion: 0.44
Nodes (5): codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl(), CodexRepository

### Community 106 - "flow.test.ts"
Cohesion: 0.31
Nodes (7): CLEAN, DIRTY, doneSetup(), FILE_INPUT, helpersOf(), stored(), withRecord()

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+3 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_path"
Cohesion: 0.11
Nodes (18): APP, FIRST, record(), recordFile(), replaceRecord(), esbuild, writeBundle(), currentProvenance() (+10 more)

### Community 111 - "helpers_api.ts"
Cohesion: 0.48
Nodes (6): checkPath(), HelpersApi, HelpersDeps, lineReader(), orderOf(), isHelperId()

### Community 112 - "orderQueue"
Cohesion: 0.38
Nodes (5): Audit: what the menu exposes of the engine, Problems not on the list, Task 10: The panel, the band, the status line and the commands, orderQueue(), suggestion()

### Community 113 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "Review Focus"
Cohesion: 0.29
Nodes (7): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet

### Community 116 - "electron"
Cohesion: 0.50
Nodes (3): engine, CHANNELS, electron

### Community 117 - "ref_node_fs"
Cohesion: 0.07
Nodes (15): APP, event(), plantClaude(), APP, errors, noteFiles(), notesDir(), APP (+7 more)

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 920 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `update_runner.mjs` to `note_workspace.tsx`, `core/logger.ts`, `designs_page.tsx`, `designs.ts`, `first_run.tsx`, `t`, `scope.ts`, `judgements.spec.ts`, `ref_types`, `palette.ts`, `states.tsx`, `game.ts`, `branch_api.ts`, `test_support.ts`, `design_editor.tsx`, `designs_api.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `activity.ts`, `designs.spec.tsx`, `app.tsx`, `engine_api.ts`, `host.ts`, `app_menu.ts`, `chronicle_page.tsx`, `quest_detail.tsx`, `package.json`, `start_api.spec.ts`, `server.spec.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `parseRecord`, `projects_api.spec.ts`, `opening_api.spec.ts`, `GitState`, `ref_node_path`, `ref_node_fs`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06049213943950786 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `server.spec.ts` to `core/logger.ts`, `Tea-concile`, `Queue-tea, the workspace app`, `Queue-tea: design`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `core/logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.054274084124830396 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `core/logger.ts` to `env.ts`, `opening_api.spec.ts`, `scope.ts`, `git_source.ts`, `Part 2: edits`, `tests/helpers.ts`, `makeTask`, `sessions.test.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `activity.ts`, `register.tsx`, `docs_log_source.ts`, `start_api.spec.ts`, `server.spec.ts`, `designs_api.spec.ts`, `parseRecord`, `worktrees_repository_impl.ts`, `Queue-tea: workspace app`, `Part B: the app`, `codex_providers.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._