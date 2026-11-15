# Graph Report - notes-website-bookmarks-link  (2026-11-14)

## Corpus Check
- 569 files · ~528,867 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3563 nodes · 13027 edges · 147 communities (141 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 698 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `67390723`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- core/logger.ts
- tasks_api.ts
- update_service.ts
- file_task.ts
- pages.e2e.ts
- EngineApi
- time.ts
- realms_api.ts
- tasks_controller.ts
- designs_page.tsx
- shell.spec.tsx
- first_run.tsx
- t
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- emptyRecord
- notes_view.ts
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- vitest
- project_views.ts
- game.ts
- branch_integration.spec.ts
- App
- design_editor.tsx
- checks_api.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- note_attachments.ts
- menu_frame.tsx
- sessions.test.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- hoard_page.tsx
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- detail_api.ts
- designs.spec.tsx
- time.ts
- app.tsx
- failed_record.tsx
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- feedback.e2e.ts
- Queue-tea: panel redesign
- band_host.tsx
- messages.ts
- chronicle_page.tsx
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- helpers_api.spec.ts
- branches.ts
- Queue-tea
- quest_detail.tsx
- notes.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- start_api.spec.ts
- server.ts
- spec.md
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- branch_source.ts
- inspector.tsx
- branch_workflow.e2e.ts
- Architecture
- Designs tab
- register.tsx
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Tea-concile
- Notes
- GitState
- Task Log
- designs.ts
- git_rules.spec.ts
- test_support.ts
- Part B: the app
- Guild helpers on tasks
- app/README.md
- ref_node_path
- Reply
- Part 3: setting out and coming back
- settings.spec.tsx
- .line-check-NZS8Gw/tsconfig.json
- records_controller.ts
- project_views.ts
- ref_node_fs
- Part 2: edits
- flows.spec.tsx
- check_layers.mjs
- mocha-mockup.md
- designs_api.ts
- notes_api.spec.ts
- app_menu.ts
- checks_api.spec.ts
- setup.ts
- Scene
- codex.ts
- branch_api.ts
- judgements.spec.ts
- feedback.spec.tsx
- dependency_setup.ts
- detail.spec.tsx
- Queue-tea: workspace app
- watcher.spec.ts
- Shared Types (Task 1 writes them; every task uses them)
- A task's life
- withDefaults
- projectKey
- shell.e2e.ts
- What Rohan sees
- first_window.e2e.ts
- guild.e2e.ts
- The record
- sky_time.ts
- orderQueue

## God Nodes (most connected - your core abstractions)
1. `t` - 110 edges
2. `Refusal` - 106 edges
3. `vitest` - 99 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `preact` - 66 edges
7. `EngineApi` - 66 edges
8. `currentTask()` - 64 edges
9. `Reply` - 63 edges
10. `scopeOf()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts
- `Keys` --references--> `d()`  [INFERRED]
  docs/spec.md → app/main/features/branches/api/branch_reads.spec.ts
- `What it does` --references--> `d()`  [INFERRED]
  README.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (147 total, 6 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.14
Nodes (26): brewLineOf(), isInPlay(), localDay(), questLineOf(), whenOf(), caretPoint(), changeOf(), groupsOf() (+18 more)

### Community 1 - "core/logger.ts"
Cohesion: 0.05
Nodes (51): FORBIDDEN_GIT, createLogger(), fileSink(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost() (+43 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.09
Nodes (72): COPY_LIMIT, inGameWords(), Refusal, reply(), openMergeFolder(), setBudget(), activeTask(), goBack() (+64 more)

### Community 3 - "update_service.ts"
Cohesion: 0.20
Nodes (10): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, AppUpdate, changedBuild(), UpdatePhase (+2 more)

### Community 4 - "file_task.ts"
Cohesion: 0.23
Nodes (15): Task 2: Filing and editing carry the choice, edited(), editTaskUseCase(), TaskEdit, FileInput, FileResult, fileTaskUseCase(), removeTaskUseCase() (+7 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "EngineApi"
Cohesion: 0.07
Nodes (64): Content(), ask(), EngineRead, useEngineRead(), Dialog(), ReadView(), Empty(), Failed() (+56 more)

### Community 7 - "time.ts"
Cohesion: 0.09
Nodes (38): Ctx, Env, once(), running, Block, withBlock(), BlockResult, blockTaskUseCase() (+30 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.10
Nodes (30): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+22 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (53): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), helperToRemind(), markRemindedUseCase(), noteHelperUseCase(), setReviewUseCase() (+45 more)

### Community 10 - "designs_page.tsx"
Cohesion: 0.09
Nodes (43): colourError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors, NextField (+35 more)

### Community 11 - "shell.spec.tsx"
Cohesion: 0.11
Nodes (18): memoryNotes(), ok(), open(), BOARD, FIRST, key(), open(), palette() (+10 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.11
Nodes (36): HOLD_FILES_SHOWN, Group(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT (+28 more)

### Community 13 - "t"
Cohesion: 0.08
Nodes (41): Answer, HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter() (+33 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 16 - "scope.ts"
Cohesion: 0.13
Nodes (27): projectsFolder(), Logger, readChronicle(), GameDeps, readGame(), readHoard(), isProjectKey(), listProjects() (+19 more)

### Community 17 - "git_source.ts"
Cohesion: 0.18
Nodes (26): File Structure, Task 8: The task flow, SwitchResult, switchToTaskUseCase(), commitsBetween(), diffSince(), git(), lastCommit() (+18 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (59): BUSY_PROBE, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE, SETTINGS_FILE, UPDATE_CHECK_MS (+51 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "emptyRecord"
Cohesion: 0.07
Nodes (32): BUNDLE, git(), plist(), run, STAGE, record(), won(), NOW (+24 more)

### Community 21 - "notes_view.ts"
Cohesion: 0.13
Nodes (27): folderError(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY, isUntitled(), linkOptionsOf(), linkPicksOf() (+19 more)

### Community 22 - "families.ts"
Cohesion: 0.15
Nodes (33): codexOperations(), CodexRefusal, readable(), readChoices(), 4.5 New task, and Add child task inline, errandReply(), checkPrompt(), checkTypedMessage() (+25 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (25): actions(), allQuests(), canRun(), creates(), entry(), filterPalette(), GO_TO, isStatus() (+17 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.09
Nodes (37): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+29 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.18
Nodes (14): CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), commandRun(), count(), isTestCommand(), lastLine(), parseCheckpoint() (+6 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.09
Nodes (29): unixFiles(), projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost(), Run, current() (+21 more)

### Community 29 - "vitest"
Cohesion: 0.13
Nodes (22): click(), one, open(), openReview(), two, view, open(), pending() (+14 more)

### Community 30 - "project_views.ts"
Cohesion: 0.14
Nodes (29): questOf(), Already built, 4.2 Tasks, with a feature in the detail pane, 4.9 Back to queue, Blocked…, Move and Remove, ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase() (+21 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (22): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+14 more)

### Community 32 - "branch_integration.spec.ts"
Cohesion: 0.21
Nodes (26): abandonMerge(), BranchDeps, completeMerge(), prepareMerge(), resolveMergeFile(), runStep(), run, preview() (+18 more)

### Community 33 - "App"
Cohesion: 0.08
Nodes (19): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+11 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.16
Nodes (30): Box, clamp(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf(), mapLayers() (+22 more)

### Community 35 - "checks_api.ts"
Cohesion: 0.18
Nodes (17): executing, runMergeChecks(), CheckDefinition, checksFile(), checksPassed(), discoverChecks(), readChecks(), saveChecks() (+9 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.21
Nodes (16): checkScene(), isComment(), isNumberIn(), isObject(), isText(), Json, layerFault(), lineOf() (+8 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.19
Nodes (18): filePathOf(), formatOf(), noteFiles(), AttachmentInput(), bytesOf(), attachmentError(), attachmentMarkdown(), extensionOf() (+10 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.13
Nodes (47): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+39 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.11
Nodes (27): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+19 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.24
Nodes (18): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+10 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (18): STAGE_SCALE, dayOf(), Coins(), EggArt(), Sky(), StageArt(), FIRST_LEVEL, STAGES (+10 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.09
Nodes (27): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+19 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.15
Nodes (31): The eight items, Task 10: `tasks`: the queue side, setPriorityUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), clearHold(), blockTask(), featureCommand() (+23 more)

### Community 50 - "library_api.ts"
Cohesion: 0.15
Nodes (22): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), DUNE, NOW, addBook() (+14 more)

### Community 51 - "detail_api.ts"
Cohesion: 0.07
Nodes (40): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+32 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf()

### Community 53 - "time.ts"
Cohesion: 0.14
Nodes (20): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+12 more)

### Community 54 - "app.tsx"
Cohesion: 0.05
Nodes (70): ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, ALL, hrefOf(), Route (+62 more)

### Community 55 - "failed_record.tsx"
Cohesion: 0.43
Nodes (6): isLetterKey(), isTyping(), Failed, FailedRecord(), Props, sentenceOf()

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.06
Nodes (59): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), MEDALS, Change, changeEntry(), changeQuests(), dropQuest() (+51 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (17): HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader() (+9 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.17
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (10): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+2 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.20
Nodes (9): plain(), Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API) (+1 more)

### Community 63 - "band_host.tsx"
Cohesion: 0.08
Nodes (45): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand() (+37 more)

### Community 64 - "messages.ts"
Cohesion: 0.13
Nodes (13): BOOKMARK_AGENT, GAME_WORDS, MESSAGES, UPDATE_TEXT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE (+5 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (33): clockTime(), dayName(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex(), weekdayOf() (+25 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 70 - "branches.ts"
Cohesion: 0.13
Nodes (20): freshReview(), messageOf(), requestOf(), taskOf(), commitBranchFiles(), writeReceipt(), BranchState, BranchTip (+12 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.08
Nodes (47): DEFAULT_LOG_PATH, XP_BY_DIFFICULTY, Field(), FieldProps, Pick(), emptyQuestForm(), logPathError(), parentOf() (+39 more)

### Community 73 - "notes.ts"
Cohesion: 0.10
Nodes (33): body(), write(), lineOf(), linkLineOf(), tickedItemsOf(), BrewQuestCard(), BrewSheet(), DIFFICULTIES (+25 more)

### Community 74 - "package.json"
Cohesion: 0.11
Nodes (16): author, description, license, main, name, private, productName, version (+8 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.13
Nodes (12): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification, Merge-check dependency setup (+4 more)

### Community 77 - "start_api.spec.ts"
Cohesion: 0.11
Nodes (16): loadCodexContext(), git(), NOW, run, StartOutcome, Task 1: the file seam, Host, RunResult (+8 more)

### Community 78 - "server.ts"
Cohesion: 0.24
Nodes (9): files, skill(), skills, workflows, CODEX_LIMITS, CODEX_TEXT, CodexContext, QUEUE_TEA_COMMANDS (+1 more)

### Community 79 - "spec.md"
Cohesion: 0.14
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (87): HOME_BADGES, HOME_BOARD_ROWS, Dragon(), GoldReward(), PriorityTag(), XpReward(), Board(), Glory() (+79 more)

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
Cohesion: 0.20
Nodes (19): p, canRestoreFrom(), onDisk(), backupPath(), parseRecord(), readOthers(), readProblem(), readRecord() (+11 more)

### Community 90 - "branch_source.ts"
Cohesion: 0.30
Nodes (13): digest(), gitIn(), graphOf(), headsOf(), pendingGit(), reviewOf(), taskReads(), workingSnapshot() (+5 more)

### Community 91 - "inspector.tsx"
Cohesion: 0.20
Nodes (15): numberError(), copyWithIds(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+7 more)

### Community 92 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 93 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, One engine, two hosts, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "register.tsx"
Cohesion: 0.08
Nodes (86): live(), 5. Features, shared resources and the core, Features, The core and the app, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus (+78 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.25
Nodes (14): Deps, setup(), updateService(), exec, ACTIVE, exec, git(), publishedSource() (+6 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.13
Nodes (16): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+8 more)

### Community 100 - "Tea-concile"
Cohesion: 0.25
Nodes (7): 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "Notes"
Cohesion: 0.11
Nodes (18): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+10 more)

### Community 102 - "GitState"
Cohesion: 0.39
Nodes (5): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, fakeGit()

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "designs.ts"
Cohesion: 0.15
Nodes (16): commentError(), ids(), CommentRow(), CommentsPanel(), Props, Author, CommentInput, DESIGN_FORMAT (+8 more)

### Community 105 - "git_rules.spec.ts"
Cohesion: 0.14
Nodes (16): OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), streamProcess(), argvOf(), nodeUserGit() (+8 more)

### Community 106 - "test_support.ts"
Cohesion: 0.15
Nodes (16): chronicle(), mana(), questAheadOf(), game(), QUEST, CHRONICLE, DESIGNS, GAME (+8 more)

### Community 107 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.20
Nodes (9): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", Where Rohan chooses (+1 more)

### Community 109 - "app/README.md"
Cohesion: 0.24
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_path"
Cohesion: 0.15
Nodes (13): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+5 more)

### Community 111 - "Reply"
Cohesion: 0.14
Nodes (13): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+5 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "settings.spec.tsx"
Cohesion: 0.11
Nodes (12): KNOWN, NEW, open(), TWO, FAILED, NEW_FOLDER, open(), SETTINGS_PAGE (+4 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "records_controller.ts"
Cohesion: 0.13
Nodes (29): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd() (+21 more)

### Community 116 - "project_views.ts"
Cohesion: 0.21
Nodes (16): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), rowOf(), sessionInfoOf() (+8 more)

### Community 117 - "ref_node_fs"
Cohesion: 0.07
Nodes (19): APP, errors, PNG, APP, paste(), APP, errors, noteFiles() (+11 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "flows.spec.tsx"
Cohesion: 0.13
Nodes (13): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+5 more)

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 121 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 122 - "designs_api.ts"
Cohesion: 0.23
Nodes (15): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+7 more)

### Community 123 - "notes_api.spec.ts"
Cohesion: 0.16
Nodes (11): noteFileResponse(), NotesDeps, change(), created(), data(), makeApi(), NOW, revealed (+3 more)

### Community 124 - "app_menu.ts"
Cohesion: 0.24
Nodes (9): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+1 more)

### Community 125 - "checks_api.spec.ts"
Cohesion: 0.20
Nodes (9): d(), cancelMergeChecks(), manifest, packages, run(), state, operation, state (+1 more)

### Community 126 - "setup.ts"
Cohesion: 0.33
Nodes (10): codexSkills(), companionSkills(), helperDefinition(), helperInstructions(), codexConfigArgs(), CodexRuntime, digest(), info() (+2 more)

### Community 127 - "Scene"
Cohesion: 0.26
Nodes (7): commit(), History, historyOf(), redo(), undo(), SaveState, Scene

### Community 128 - "codex.ts"
Cohesion: 0.20
Nodes (9): log, main(), createCodexServer(), Forms, Repository Rules, Visual artifacts, Writing code, @modelcontextprotocol/sdk (+1 more)

### Community 129 - "branch_api.ts"
Cohesion: 0.35
Nodes (7): readBranch(), readBranches(), readMergeWorkspace(), readCommitProgress(), pending, pendingRead(), MergeWorkspace

### Community 130 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 131 - "feedback.spec.tsx"
Cohesion: 0.18
Nodes (6): ACCOUNTS, BOARD, input(), open(), empty(), reply()

### Community 132 - "dependency_setup.ts"
Cohesion: 0.31
Nodes (9): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies() (+1 more)

### Community 133 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 134 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 135 - "watcher.spec.ts"
Cohesion: 0.33
Nodes (6): hasChanged(), log, Stamps, stampsOf(), watchFolders(), WatchOptions

### Community 136 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.31
Nodes (9): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check, ProjectRecord (+1 more)

### Community 137 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 138 - "withDefaults"
Cohesion: 0.22
Nodes (8): Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 1: The helper list and the record field, What's saved, Data, fnv1a(), withDefaults()

### Community 139 - "projectKey"
Cohesion: 0.36
Nodes (7): readProjectPlace(), carryOverRecords(), projectKey(), recordPath(), ProjectPlace, ProjectRepository, parseOffset()

### Community 141 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 142 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 143 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 144 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 145 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

### Community 146 - "orderQueue"
Cohesion: 0.60
Nodes (3): Task 10: The panel, the band, the status line and the commands, orderQueue(), suggestion()

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 992 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `core/logger.ts`, `branch_api.ts`, `judgements.spec.ts`, `update_service.ts`, `detail.spec.tsx`, `feedback.spec.tsx`, `watcher.spec.ts`, `realms_api.ts`, `EngineApi`, `designs_page.tsx`, `shell.spec.tsx`, `first_run.tsx`, `t`, `scope.ts`, `sky_time.ts`, `main.ts`, `emptyRecord`, `notes_view.ts`, `notes_api.ts`, `game.ts`, `branch_integration.spec.ts`, `App`, `design_editor.tsx`, `checks_api.ts`, `designs_api.ts`, `note_attachments.ts`, `sessions.test.ts`, `claude_code.ts`, `library_api.ts`, `detail_api.ts`, `designs.spec.tsx`, `engine_api.ts`, `host.ts`, `messages.ts`, `chronicle_page.tsx`, `helpers_api.spec.ts`, `quest_detail.tsx`, `notes.ts`, `package.json`, `start_api.spec.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `ref_node_child_process`, `GitState`, `designs.ts`, `git_rules.spec.ts`, `test_support.ts`, `ref_node_path`, `Reply`, `settings.spec.tsx`, `ref_node_fs`, `flows.spec.tsx`, `notes_api.spec.ts`, `app_menu.ts`, `checks_api.spec.ts`, `setup.ts`, `Scene`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `codex.ts` to `core/logger.ts`, `A task's life`, `app/README.md`, `start_api.spec.ts`, `setup.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `core/logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0528169014084507 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `core/logger.ts`, `judgements.spec.ts`, `file_task.ts`, `time.ts`, `realms_api.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `tasks_controller.ts`, `cup_mood.ts`, `scope.ts`, `families.ts`, `tests/helpers.ts`, `game.ts`, `branch_integration.spec.ts`, `ui.test.tsx`, `sessions.test.ts`, `4. Screens`, `detail_api.ts`, `time.ts`, `feedback.e2e.ts`, `helpers_api.spec.ts`, `start_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `branch_workflow.e2e.ts`, `notes_api.spec.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._