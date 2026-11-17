# Graph Report - notes-daily-notes-journal  (2026-11-17)

## Corpus Check
- 575 files · ~535,897 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3603 nodes · 13181 edges · 125 communities (119 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 702 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cc261e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- settings_api.ts
- tasks_api.ts
- checks_api.ts
- task_input.ts
- band_host.tsx
- EngineApi
- time.ts
- realms_api.ts
- tasks_controller.ts
- hud.tsx
- shell.spec.tsx
- first_run.tsx
- engine_api.ts
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- brew_quest.tsx
- library_page.tsx
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 4: the rest of the screens
- checkpoints.ts
- tests/helpers.ts
- branches.spec.tsx
- project_views.ts
- game.ts
- Refusal
- App
- design_editor.tsx
- project_views.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- note_attachments.ts
- menu_frame.tsx
- detail_api.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- helpers_api.spec.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- codex_events.ts
- branch_workflow.e2e.ts
- start_api.spec.ts
- app.tsx
- activity.spec.ts
- board.e2e.ts
- hoard_page.tsx
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- ref_node_fs
- Queue-tea: panel redesign
- check_repository_impl.ts
- messages.ts
- chronicle_page.tsx
- view_store.ts
- vitest
- commit-chai-n.md
- ref_node_fs
- Queue-tea: workspace app
- Queue-tea
- new_quest_sheet.tsx
- notes.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- pages.e2e.ts
- card_note.ts
- Plan: the board, recoverable tasks and checkpoints
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- first_window.e2e.ts
- record_source.ts
- Merge-check dependency setup
- codex_source.ts
- Architecture
- main.tsx
- Designs tab
- session_rhythm.ts
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- mocha-mockup.md
- Notes
- Refusal
- Task Log
- Part 5: an app you can install
- Roadmap: the outside review, checked against the code
- test_support.ts
- Part B: the app
- Guild helpers on tasks
- workspace-app.md
- ref_node_path
- Reply
- Part 3: setting out and coming back
- settings.spec.tsx
- .line-check-NZS8Gw/tsconfig.json
- env.ts
- description_files.spec.tsx
- realms_api.spec.ts
- Part 2: edits
- flows.spec.tsx
- check_layers.mjs
- Queue-tea, the workspace app
- detail.spec.tsx
- Shared Types (Task 1 writes them; every task uses them)
- fakeEngine

## God Nodes (most connected - your core abstractions)
1. `t` - 111 edges
2. `Refusal` - 106 edges
3. `vitest` - 100 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `EngineApi` - 68 edges
7. `preact` - 66 edges
8. `Reply` - 64 edges
9. `currentTask()` - 64 edges
10. `App()` - 58 edges

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

## Communities (125 total, 6 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.10
Nodes (46): brewLineOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY (+38 more)

### Community 1 - "settings_api.ts"
Cohesion: 0.07
Nodes (42): Logger, OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), streamProcess(), nodeUserGit() (+34 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.23
Nodes (19): notYet(), edit(), editQuest(), fileQuest(), moveQuest(), removeQuest(), restoreQuest(), sealQuest() (+11 more)

### Community 3 - "checks_api.ts"
Cohesion: 0.10
Nodes (29): d(), executing, runMergeChecks(), manifest, packages, run(), state, CheckDefinition (+21 more)

### Community 4 - "task_input.ts"
Cohesion: 0.16
Nodes (27): criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf(), helpersOf(), newQuestOf(), parentOf(), PLATFORMS (+19 more)

### Community 5 - "band_host.tsx"
Cohesion: 0.11
Nodes (40): live(), Order to fix them, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core, Task 9: `conversation` and `message_check` (+32 more)

### Community 6 - "EngineApi"
Cohesion: 0.07
Nodes (52): EngineRead, useEngineRead(), DEFAULT_LOG_PATH, ReadView(), Window, BRANCH_POLL_MS, CHECK_CLOCK_MS, HELPER_DRAG (+44 more)

### Community 7 - "time.ts"
Cohesion: 0.11
Nodes (22): codexOperations(), CodexRefusal, readable(), ctx, setup(), errandReply(), Block, DIFFICULTIES (+14 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.12
Nodes (27): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+19 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (67): Features, Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), once(), running, markFor() (+59 more)

### Community 10 - "hud.tsx"
Cohesion: 0.10
Nodes (33): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), GROWS_AT, UPDATE_POLL_MS (+25 more)

### Community 11 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), open(), palette(), SECOND

### Community 12 - "first_run.tsx"
Cohesion: 0.12
Nodes (35): HOLD_FILES_SHOWN, accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+27 more)

### Community 13 - "engine_api.ts"
Cohesion: 0.06
Nodes (54): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), HELPERS, Change, changeEntry(), changeQuests(), dropQuest() (+46 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.11
Nodes (26): Audit: what the menu exposes of the engine, Problems not on the list, AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt (+18 more)

### Community 16 - "scope.ts"
Cohesion: 0.12
Nodes (26): projectsFolder(), GAME_WORDS, MESSAGES, UPDATE_TEXT, GameDeps, isProjectKey(), listProjects(), ProjectsDeps (+18 more)

### Community 17 - "git_source.ts"
Cohesion: 0.10
Nodes (40): File Structure, Task 8: The task flow, addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE (+32 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (74): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+66 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "brew_quest.tsx"
Cohesion: 0.15
Nodes (20): isInPlay(), lineOf(), questLineOf(), tickedItemsOf(), BrewQuestCard(), BrewSheet(), DIFFICULTIES, Errors (+12 more)

### Community 21 - "library_page.tsx"
Cohesion: 0.11
Nodes (27): Answer, BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError(), FORM (+19 more)

### Community 22 - "families.ts"
Cohesion: 0.14
Nodes (33): readChoices(), 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, checkPrompt(), DIFFICULTIES, INTENTS, KINDS, checkTypedMessage() (+25 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (24): PALETTE_SNIPPET, actions(), allQuests(), creates(), entry(), filterPalette(), GO_TO, isStatus() (+16 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.08
Nodes (40): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf() (+32 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.40
Nodes (5): Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window

### Community 27 - "checkpoints.ts"
Cohesion: 0.16
Nodes (15): 4.1 Home, CODEX_RULES(), checkLines(), commandRun(), count(), isTestCommand(), lastLine(), parseCheckpoint() (+7 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.05
Nodes (53): record(), seed(), seed(), seed(), seed(), seed(), seed(), putBack() (+45 more)

### Community 29 - "branches.spec.tsx"
Cohesion: 0.19
Nodes (14): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+6 more)

### Community 30 - "project_views.ts"
Cohesion: 0.15
Nodes (28): Already built, What each screen reads from existing data, ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase(), keepActivity(), blockedTasks() (+20 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (22): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+14 more)

### Community 32 - "Refusal"
Cohesion: 0.08
Nodes (78): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), prepareMerge(), readBranch(), readBranches() (+70 more)

### Community 33 - "App"
Cohesion: 0.08
Nodes (21): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+13 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.04
Nodes (118): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), THUMB_BOX, useWindowWidth() (+110 more)

### Community 35 - "project_views.ts"
Cohesion: 0.23
Nodes (15): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+7 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.05
Nodes (57): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+49 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.15
Nodes (22): filePathOf(), formatOf(), noteFiles(), NoteBookmark(), markdown, Props, ReadView(), tokenizer() (+14 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (35): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+27 more)

### Community 41 - "detail_api.ts"
Cohesion: 0.12
Nodes (30): readCodexSession(), Observation, observeTask(), readGame(), readMana(), allowanceOf(), sessionsIn(), activeOf() (+22 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.05
Nodes (62): main(), appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv() (+54 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.11
Nodes (42): The eight items, Task 10: `tasks`: the queue side, Task 10: The panel, the band, the status line and the commands, KEYS, blockTaskUseCase(), removeTaskUseCase(), setPriorityUseCase(), togglePlayNextUseCase() (+34 more)

### Community 50 - "library_api.ts"
Cohesion: 0.07
Nodes (53): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+45 more)

### Community 51 - "codex_events.ts"
Cohesion: 0.28
Nodes (7): codexEvents, commandOf(), parse(), Row, textOf(), finishActivity(), toolActivity()

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "start_api.spec.ts"
Cohesion: 0.18
Nodes (4): git(), NOW, onDisk(), run

### Community 54 - "app.tsx"
Cohesion: 0.05
Nodes (68): Content(), ContentProps, MORE_PAGES, SheetProps, TABS, AUTOSAVE_MS, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW (+60 more)

### Community 55 - "activity.spec.ts"
Cohesion: 0.27
Nodes (7): AT, log, step(), ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, KINDS, STATUSES

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (20): STAGE_SCALE, dayOf(), Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL (+12 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (15): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader(), orderOf(), parse() (+7 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "ref_node_fs"
Cohesion: 0.04
Nodes (27): APP, at, errors, fileTitled(), notesDir(), APP, event(), plantClaude() (+19 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "check_repository_impl.ts"
Cohesion: 0.27
Nodes (10): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, parseCheckAnswer(), checkRepositoryOf(), CheckAnswer, answered() (+2 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (37): clockTime(), dayName(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex(), weekdayOf() (+29 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "vitest"
Cohesion: 0.27
Nodes (7): skyAt(), skyOf(), SkyTime, game(), QUEST, Data, vitest

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "ref_node_fs"
Cohesion: 0.05
Nodes (40): log, createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+32 more)

### Community 70 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "new_quest_sheet.tsx"
Cohesion: 0.08
Nodes (63): SheetView(), ask(), AttachmentInput(), bytesOf(), Props, State, Dialog(), Field() (+55 more)

### Community 73 - "notes.ts"
Cohesion: 0.20
Nodes (19): body(), write(), backlinksOf(), firstParagraphOf(), freeTitle(), isNoteId(), isTitleTaken(), JOURNAL (+11 more)

### Community 74 - "package.json"
Cohesion: 0.14
Nodes (13): author, description, license, main, name, private, productName, version (+5 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 77 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 78 - "card_note.ts"
Cohesion: 0.39
Nodes (7): 4.4 A task's detail: current, queued and done, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote()

### Community 79 - "Plan: the board, recoverable tasks and checkpoints"
Cohesion: 0.29
Nodes (4): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (75): HOME_BADGES, HOME_BOARD_ROWS, Dragon(), GoldReward(), PriorityTag(), XpReward(), Board(), Glory() (+67 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 89 - "record_source.ts"
Cohesion: 0.09
Nodes (37): p, loadCodexContext(), canRestoreFrom(), active(), logged, NOW, onDisk(), run (+29 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "codex_source.ts"
Cohesion: 0.33
Nodes (4): CodexObservation, cache, catalog, Session

### Community 92 - "Architecture"
Cohesion: 0.13
Nodes (15): Architecture, Files in a quest's description, One engine, two hosts, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is (+7 more)

### Community 93 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 94 - "Designs tab"
Cohesion: 0.15
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "session_rhythm.ts"
Cohesion: 0.11
Nodes (57): The core and the app, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, drawCup(), renderBand(), stillCup(), toggleMenu(), loadContext() (+49 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.09
Nodes (30): Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity (+22 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 101 - "Notes"
Cohesion: 0.11
Nodes (18): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+10 more)

### Community 102 - "Refusal"
Cohesion: 0.11
Nodes (49): inGameWords(), Refusal, reply(), openMergeFolder(), readChronicle(), HelpersApi, activeTask(), goBack() (+41 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Part 5: an app you can install"
Cohesion: 0.40
Nodes (5): Part 5: an app you can install, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build

### Community 105 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 106 - "test_support.ts"
Cohesion: 0.13
Nodes (19): chronicle(), mana(), open(), pending(), CHRONICLE, DESIGNS, GAME, helperJob() (+11 more)

### Community 107 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", What's saved (+2 more)

### Community 110 - "ref_node_path"
Cohesion: 0.11
Nodes (17): APP, errors, noteFiles(), notesDir(), esbuild, writeBundle(), currentProvenance(), git() (+9 more)

### Community 111 - "Reply"
Cohesion: 0.13
Nodes (12): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+4 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.13
Nodes (15): After the first install, Part 3: setting out and coming back, Review focus, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main (+7 more)

### Community 113 - "settings.spec.tsx"
Cohesion: 0.08
Nodes (19): ACCOUNTS, BOARD, input(), open(), KNOWN, NEW, open(), TWO (+11 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "env.ts"
Cohesion: 0.08
Nodes (52): 5. Features, shared resources and the core, Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, Ctx (+44 more)

### Community 116 - "description_files.spec.tsx"
Cohesion: 0.29
Nodes (6): box(), drop(), open(), pane(), pick(), saved()

### Community 117 - "realms_api.spec.ts"
Cohesion: 0.06
Nodes (26): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+18 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.33
Nodes (6): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "flows.spec.tsx"
Cohesion: 0.14
Nodes (11): BOARD, held(), hold(), MAIN, OTHER, SEALED, VICTORY, ProjectRow (+3 more)

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 133 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 136 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.16
Nodes (15): Read, Edit, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 4: The git guard, Task 5: Time and effort (+7 more)

### Community 145 - "fakeEngine"
Cohesion: 0.16
Nodes (12): memoryNotes(), ok(), open(), versions, callbacks(), line(), setup(), fakeEngine() (+4 more)

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1005 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `checks_api.ts`, `detail.spec.tsx`, `EngineApi`, `time.ts`, `shell.spec.tsx`, `first_run.tsx`, `engine_api.ts`, `scope.ts`, `fakeEngine`, `main.ts`, `library_page.tsx`, `palette.ts`, `notes_api.ts`, `branches.spec.tsx`, `game.ts`, `Refusal`, `App`, `design_editor.tsx`, `designs_api.spec.ts`, `note_attachments.ts`, `claude_code.ts`, `helpers_api.spec.ts`, `library_api.ts`, `start_api.spec.ts`, `activity.spec.ts`, `host.ts`, `ref_node_fs`, `messages.ts`, `chronicle_page.tsx`, `ref_node_fs`, `new_quest_sheet.tsx`, `notes.ts`, `package.json`, `quests_page.tsx`, `record_source.ts`, `ref_node_child_process`, `Refusal`, `test_support.ts`, `ref_node_path`, `Reply`, `settings.spec.tsx`, `description_files.spec.tsx`, `realms_api.spec.ts`, `flows.spec.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0977891156462585 - nodes in this community are weakly interconnected._
- **Why does `Notes` connect `Notes` to `note_workspace.tsx`, `notes_api.ts`, `ref_node_fs`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `settings_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07265306122448979 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `tests/helpers.ts` to `time.ts`, `realms_api.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `tasks_controller.ts`, `cup_mood.ts`, `scope.ts`, `families.ts`, `game.ts`, `Refusal`, `ui.test.tsx`, `designs_api.spec.ts`, `helpers_api.spec.ts`, `4. Screens`, `library_api.ts`, `branch_workflow.e2e.ts`, `start_api.spec.ts`, `ref_node_fs`, `record_source.ts`, `realms_api.spec.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._