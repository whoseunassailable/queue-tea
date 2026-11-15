# Graph Report - add-images-description  (2026-11-15)

## Corpus Check
- 574 files · ~533,098 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3590 nodes · 13133 edges · 135 communities (129 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 698 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4cc00aa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- settings_api.ts
- tasks_api.ts
- update_service.ts
- task_input.ts
- register.tsx
- EngineApi
- time.ts
- realms_api.ts
- tasks_controller.ts
- design_forms.ts
- shell.spec.tsx
- first_run.tsx
- t
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- finish_api.ts
- library_page.tsx
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- branches.spec.tsx
- project_views.ts
- game.ts
- Refusal
- board.spec.tsx
- design_editor.tsx
- mana.ts
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
- settings_page.tsx
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- detail_api.ts
- designs.spec.tsx
- time.ts
- app.tsx
- backlog_view.tsx
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- ports.ts
- codex_source.ts
- Queue-tea: panel redesign
- band_host.tsx
- messages.ts
- chronicle_page.tsx
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- ref_node_fs
- Reply
- Queue-tea
- new_quest_sheet.tsx
- notes.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- Host
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
- board_tools.tsx
- inspector.tsx
- branch_workflow.e2e.ts
- back_api.ts
- Designs tab
- session_rhythm.ts
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Tea-concile
- Notes
- start_api.ts
- Task Log
- designs.ts
- note_bookmarks.ts
- test_support.ts
- Part B: the app
- Guild helpers on tasks
- ref_node_path
- Reply
- Part 3: setting out and coming back
- settings.spec.tsx
- .line-check-NZS8Gw/tsconfig.json
- records_controller.ts
- description_files.spec.tsx
- ref_node_path
- Part 2: edits
- flows.spec.tsx
- check_layers.mjs
- note_history.spec.ts
- designs_api.ts
- Queue-tea, the workspace app
- app_menu.ts
- victory.spec.ts
- setup.ts
- codex.ts
- feedback.spec.tsx
- detail.spec.tsx
- Shared Types (Task 1 writes them; every task uses them)
- A task's life
- What Rohan sees
- The record
- vitest

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
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts
- `Keys` --references--> `d()`  [INFERRED]
  docs/spec.md → app/main/features/branches/api/branch_reads.spec.ts
- `What it does` --references--> `d()`  [INFERRED]
  README.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (135 total, 6 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (73): DETAIL_FLOATS_BELOW, useWindowWidth(), brewLineOf(), folderError(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY (+65 more)

### Community 1 - "settings_api.ts"
Cohesion: 0.10
Nodes (28): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+20 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.16
Nodes (25): inGameWords(), notYet(), edit(), editQuest(), fileQuest(), moveQuest(), removeQuest(), restoreQuest() (+17 more)

### Community 3 - "update_service.ts"
Cohesion: 0.20
Nodes (10): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, AppUpdate, changedBuild(), UpdatePhase (+2 more)

### Community 4 - "task_input.ts"
Cohesion: 0.13
Nodes (30): Drafting a version for the Designs tab, How you work, What you don't do, What you report, criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf() (+22 more)

### Community 5 - "register.tsx"
Cohesion: 0.07
Nodes (60): The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core, drawCup() (+52 more)

### Community 6 - "EngineApi"
Cohesion: 0.07
Nodes (60): ALL, routeOf(), ROUTES, useRoute(), ask(), EngineRead, useEngineRead(), DETAIL_IS_PAGE_BELOW (+52 more)

### Community 7 - "time.ts"
Cohesion: 0.11
Nodes (32): codexOperations(), CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, One engine, two hosts, Ctx, Env (+24 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.07
Nodes (45): projectsFolder(), Asked, askedOf(), idOf(), judgementWatch(), broken, setup(), WatchDeps (+37 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.09
Nodes (53): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, afterEachTurn(), helperToRemind() (+45 more)

### Community 10 - "design_forms.ts"
Cohesion: 0.16
Nodes (18): colourError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, nextFormOf() (+10 more)

### Community 11 - "shell.spec.tsx"
Cohesion: 0.16
Nodes (11): BOARD, FIRST, key(), open(), palette(), SECOND, BOARD, input() (+3 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.14
Nodes (29): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+21 more)

### Community 13 - "t"
Cohesion: 0.11
Nodes (27): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+19 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 16 - "scope.ts"
Cohesion: 0.07
Nodes (51): GAME_WORDS, MESSAGES, graphOf(), headsOf(), pendingGit(), reviewOf(), taskReads(), workingSnapshot() (+43 more)

### Community 17 - "git_source.ts"
Cohesion: 0.17
Nodes (28): File Structure, Task 8: The task flow, SwitchResult, switchToTaskUseCase(), commitsBetween(), diffSince(), git(), lastCommit() (+20 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (59): BUSY_PROBE, COPY_LIMIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE, SETTINGS_FILE (+51 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.20
Nodes (16): addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion(), nextVersion() (+8 more)

### Community 20 - "finish_api.ts"
Cohesion: 0.19
Nodes (12): finishQuest(), keepLog(), Logged, minutesOf(), retryTaskLog(), logged, NOW, run (+4 more)

### Community 21 - "library_page.tsx"
Cohesion: 0.18
Nodes (20): Content(), Answer, Empty(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK (+12 more)

### Community 22 - "families.ts"
Cohesion: 0.18
Nodes (26): 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult, moveTaskUseCase() (+18 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.15
Nodes (25): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf() (+17 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.11
Nodes (28): 4.4 A task's detail: current, queued and done, factsNow(), writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote, HandoffSection, handoffSections() (+20 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.07
Nodes (43): seed(), seed(), seed(), seed(), seed(), seed(), setup(), emptyRecord() (+35 more)

### Community 29 - "branches.spec.tsx"
Cohesion: 0.20
Nodes (14): click(), one, open(), two, view, branchGraph(), branchReview(), FORK (+6 more)

### Community 30 - "project_views.ts"
Cohesion: 0.12
Nodes (40): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+32 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (22): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+14 more)

### Community 32 - "Refusal"
Cohesion: 0.07
Nodes (92): Refusal, reply(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder() (+84 more)

### Community 33 - "board.spec.tsx"
Cohesion: 0.20
Nodes (5): BOARD, FIRST, open(), SAGA, SECOND

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (40): commit(), History, historyOf(), redo(), undo(), Box, clamp(), copyWithIds() (+32 more)

### Community 35 - "mana.ts"
Cohesion: 0.20
Nodes (19): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+11 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.16
Nodes (20): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+12 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.19
Nodes (18): checkScene(), CommentsFile, isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+10 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.18
Nodes (17): noteFileResponse(), filePathOf(), formatOf(), noteFiles(), attachmentError(), extensionOf(), NOTE_ATTACHMENTS, NOTE_FILE_ACCEPT (+9 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.18
Nodes (28): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+20 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.21
Nodes (13): NOW, record(), Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository (+5 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.18
Nodes (24): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+16 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): DEFAULT_LOG_PATH, logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening() (+9 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.14
Nodes (34): Features, The eight items, Task 10: `tasks`: the queue side, fileTask(), clearHold(), blockTask(), featureCommand(), moveTask() (+26 more)

### Community 50 - "library_api.ts"
Cohesion: 0.20
Nodes (20): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+12 more)

### Community 51 - "detail_api.ts"
Cohesion: 0.12
Nodes (23): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), Observation, AT (+15 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf()

### Community 53 - "time.ts"
Cohesion: 0.20
Nodes (17): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+9 more)

### Community 54 - "app.tsx"
Cohesion: 0.04
Nodes (77): ContentProps, MORE_PAGES, SheetProps, TABS, hrefOf(), Route, AUTOSAVE_MS, DRAG_SLOP_PX (+69 more)

### Community 55 - "backlog_view.tsx"
Cohesion: 0.40
Nodes (12): readChoices(), capital(), markFor(), total(), KEYS, pressBlock(), drawBacklog(), drawCurrent() (+4 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.05
Nodes (56): body(), write(), STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt() (+48 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (15): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader(), orderOf(), parse() (+7 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "ports.ts"
Cohesion: 0.11
Nodes (20): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 5. Features, shared resources and the core, 7. Tests, 8. Getting there (+12 more)

### Community 61 - "codex_source.ts"
Cohesion: 0.15
Nodes (6): now, cache, catalog, readCodexSession(), Session, counts

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.20
Nodes (9): plain(), Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API) (+1 more)

### Community 63 - "band_host.tsx"
Cohesion: 0.10
Nodes (34): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, Ask, closeBand(), showBand(), checkMessage() (+26 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.09
Nodes (44): clockTime(), dayAndTime(), dayName(), dayOf(), manaLeft(), refillTime(), NOW, weekdayIndex() (+36 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "ref_node_fs"
Cohesion: 0.04
Nodes (64): FORBIDDEN_GIT, createLogger(), fileSink(), Logger, stackOf(), attempt(), failed(), isForbiddenGit() (+56 more)

### Community 70 - "Reply"
Cohesion: 0.15
Nodes (9): open(), pending(), BOARD, CHOICES, FIRST, open(), SAGA, SECOND (+1 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "new_quest_sheet.tsx"
Cohesion: 0.09
Nodes (51): SheetView(), Dialog(), Field(), FieldProps, Group(), Pick(), Failed(), Loading() (+43 more)

### Community 73 - "notes.ts"
Cohesion: 0.16
Nodes (21): markdown, backlinksOf(), firstParagraphOf(), freeTitle(), isNoteId(), isTitleTaken(), LinkPart, linkPartsOf() (+13 more)

### Community 74 - "package.json"
Cohesion: 0.10
Nodes (16): author, description, license, main, name, private, productName, version (+8 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.14
Nodes (13): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification, Decision and limits (+5 more)

### Community 77 - "Host"
Cohesion: 0.16
Nodes (17): CodexContext, Task 1: the file seam, Host, RunResult, unixFiles(), codexRepositoryOf(), folderOf(), readCodexActivity() (+9 more)

### Community 78 - "server.ts"
Cohesion: 0.26
Nodes (9): files, skill(), skills, workflows, CODEX_LIMITS, CODEX_TEXT, QUEUE_TEA_COMMANDS, HELPER_IDS (+1 more)

### Community 79 - "spec.md"
Cohesion: 0.14
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.06
Nodes (80): ACTIVITY_REFRESH_MS, HOLD_FILES_SHOWN, LINES_REFRESH_MS, isClaudeOut(), Dragon(), Spinner(), GoldReward(), PriorityTag() (+72 more)

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
Cohesion: 0.12
Nodes (28): p, record(), won(), canRestoreFrom(), onDisk(), onDisk(), onDisk(), game() (+20 more)

### Community 90 - "board_tools.tsx"
Cohesion: 0.21
Nodes (13): BoardSection, Filters, Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel() (+5 more)

### Community 91 - "inspector.tsx"
Cohesion: 0.23
Nodes (13): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+5 more)

### Community 92 - "branch_workflow.e2e.ts"
Cohesion: 0.08
Nodes (35): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+27 more)

### Community 93 - "back_api.ts"
Cohesion: 0.35
Nodes (10): activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), realmView(), sealOf(), addRequestUseCase() (+2 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "session_rhythm.ts"
Cohesion: 0.13
Nodes (35): Task 6: `commit_guard` and `errands`, beat(), clearCrashed(), endBeat(), writeBeat(), pressRestore(), registerCommand(), runErrand() (+27 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.23
Nodes (16): UPDATE_TEXT, request(), Deps, setup(), updateService(), exec, ACTIVE, exec (+8 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.13
Nodes (16): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+8 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "Notes"
Cohesion: 0.09
Nodes (22): change(), created(), data(), Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments (+14 more)

### Community 102 - "start_api.ts"
Cohesion: 0.20
Nodes (20): isSessionOpen(), checkStart(), continueIn(), goneSentence(), handOver(), holdOf(), isClaudeWorking(), needFolder() (+12 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "designs.ts"
Cohesion: 0.14
Nodes (18): commentError(), CommentRow(), CommentsPanel(), Props, badgeOf(), Props, Row(), VersionRail() (+10 more)

### Community 105 - "note_bookmarks.ts"
Cohesion: 0.29
Nodes (8): bookmarkOf(), ENTITIES, textOf(), tokenizer(), BOOKMARK_LIMITS, BOOKMARK_URL_LIMIT, bookmarkUrlOf(), NoteBookmark

### Community 106 - "test_support.ts"
Cohesion: 0.15
Nodes (16): chronicle(), mana(), questAheadOf(), QUEST, CHRONICLE, DESIGNS, GAME, helperJob() (+8 more)

### Community 107 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+2 more)

### Community 110 - "ref_node_path"
Cohesion: 0.26
Nodes (10): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+2 more)

### Community 111 - "Reply"
Cohesion: 0.13
Nodes (12): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+4 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "settings.spec.tsx"
Cohesion: 0.09
Nodes (21): App(), moodOf(), open(), useHour(), open(), KNOWN, NEW, open() (+13 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "records_controller.ts"
Cohesion: 0.11
Nodes (33): live(), Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, once(), running, pad(), readAllowance() (+25 more)

### Community 116 - "description_files.spec.tsx"
Cohesion: 0.27
Nodes (7): box(), drop(), open(), pane(), pick(), saved(), quest()

### Community 117 - "ref_node_path"
Cohesion: 0.02
Nodes (64): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+56 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "flows.spec.tsx"
Cohesion: 0.13
Nodes (13): line(), BOARD, held(), hold(), MAIN, OTHER, SEALED, withActive() (+5 more)

### Community 120 - "check_layers.mjs"
Cohesion: 0.30
Nodes (11): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+3 more)

### Community 121 - "note_history.spec.ts"
Cohesion: 0.38
Nodes (5): NOW, versionsToKeep(), NOTE_HISTORY_LIMITS, NoteVersion, Version history

### Community 122 - "designs_api.ts"
Cohesion: 0.20
Nodes (16): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+8 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 125 - "victory.spec.ts"
Cohesion: 0.50
Nodes (3): NOW, record(), won()

### Community 126 - "setup.ts"
Cohesion: 0.33
Nodes (10): codexSkills(), companionSkills(), helperDefinition(), helperInstructions(), codexConfigArgs(), CodexRuntime, digest(), info() (+2 more)

### Community 128 - "codex.ts"
Cohesion: 0.22
Nodes (9): log, main(), loadCodexContext(), createCodexServer(), Forms, Repository Rules, Visual artifacts, Writing code (+1 more)

### Community 131 - "feedback.spec.tsx"
Cohesion: 0.14
Nodes (10): openReview(), ACCOUNTS, BOARD, input(), open(), callbacks(), setup(), empty() (+2 more)

### Community 133 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 136 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.21
Nodes (12): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+4 more)

### Community 137 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 141 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 144 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 145 - "vitest"
Cohesion: 0.21
Nodes (8): memoryNotes(), ok(), skyAt(), skyOf(), SkyTime, versions, note(), vitest

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1002 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `settings_api.ts`, `update_service.ts`, `feedback.spec.tsx`, `detail.spec.tsx`, `EngineApi`, `time.ts`, `realms_api.ts`, `design_forms.ts`, `shell.spec.tsx`, `first_run.tsx`, `t`, `scope.ts`, `main.ts`, `finish_api.ts`, `library_page.tsx`, `branches.spec.tsx`, `game.ts`, `Refusal`, `board.spec.tsx`, `design_editor.tsx`, `designs_api.ts`, `note_attachments.ts`, `sessions.test.ts`, `claude_code.ts`, `library_api.ts`, `detail_api.ts`, `designs.spec.tsx`, `engine_api.ts`, `host.ts`, `codex_source.ts`, `messages.ts`, `chronicle_page.tsx`, `ref_node_fs`, `Reply`, `new_quest_sheet.tsx`, `notes.ts`, `package.json`, `quests_page.tsx`, `designs_api.spec.ts`, `record_source.ts`, `ref_node_child_process`, `start_api.ts`, `note_bookmarks.ts`, `test_support.ts`, `ref_node_path`, `Reply`, `settings.spec.tsx`, `description_files.spec.tsx`, `ref_node_path`, `flows.spec.tsx`, `note_history.spec.ts`, `designs_api.ts`, `app_menu.ts`, `victory.spec.ts`, `setup.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06504065040650407 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `tests/helpers.ts` to `tasks_api.ts`, `time.ts`, `realms_api.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `tasks_controller.ts`, `cup_mood.ts`, `scope.ts`, `finish_api.ts`, `families.ts`, `game.ts`, `Refusal`, `ui.test.tsx`, `sessions.test.ts`, `4. Screens`, `queue_controller.ts`, `band_host.tsx`, `ref_node_fs`, `designs_api.spec.ts`, `record_source.ts`, `branch_workflow.e2e.ts`, `ref_node_path`, `victory.spec.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `settings_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `codex.ts` to `Tea-concile`, `ref_node_fs`, `A task's life`, `Queue-tea, the workspace app`, `setup.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._