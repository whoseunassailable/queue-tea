# Graph Report - notes-knowledge-graph-view  (2026-11-17)

## Corpus Check
- 588 files · ~553,512 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3732 nodes · 13499 edges · 149 communities (142 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 728 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cc261e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- settings_api.ts
- Refusal
- opening_api.spec.ts
- services/helpers.ts
- note_graph_view.tsx
- new_quest_sheet.tsx
- env.ts
- scope.ts
- tasks_controller.ts
- notes.spec.tsx
- EngineApi
- first_run.tsx
- ask
- Queue-tea: design
- cup_mood.ts
- engine_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- record_source.ts
- constants/constants.ts
- helper_card.tsx
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Workspace app, the rest of the road
- checkpoints.ts
- tests/helpers.ts
- ui.test.tsx
- notes.spec.tsx
- project_views.ts
- Refusal
- app_menu.ts
- design_editor.tsx
- notes_api.spec.ts
- Notes: the knowledge graph view
- Task 3: Entities and pure rules
- designs_api.ts
- note_attachments.ts
- menu_frame.tsx
- sessions.test.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- designs.e2e.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- detail_api.ts
- designs.spec.tsx
- design_forms.ts
- hud.tsx
- projects_api.spec.ts
- board.e2e.ts
- engine_api.ts
- host.ts
- detail.spec.tsx
- Queue-tea architecture
- designs.ts
- Queue-tea: panel redesign
- description_files.spec.tsx
- messages.ts
- t
- view_store.ts
- chronicle_page.tsx
- commit-chai-n.md
- helpers_api.spec.ts
- docs_log_source.ts
- Queue-tea
- settings_page.tsx
- bundle.spec.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- Host
- Part 3: setting out and coming back
- Roadmap: the outside review, checked against the code
- tea-dd.md
- note_history.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- start_api.spec.ts
- branch_workflow.e2e.ts
- dependency_setup.ts
- Queue-tea: workspace app
- Merge-check dependency setup
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
- Queue-tea, the workspace app
- judgements.spec.ts
- test_support.ts
- Part B: the app
- Guild helpers on tasks
- workspace-app.md
- main.tsx
- quest_flows.spec.ts
- tasks_api.spec.ts
- shell.spec.tsx
- .line-check-NZS8Gw/tsconfig.json
- ports.ts
- App
- finish_api.spec.ts
- Part 2: edits
- flows.spec.tsx
- check_layers.mjs
- pages.e2e.ts
- fakeEngine
- ref_node_os
- core/logger.ts
- victory.spec.ts
- server.spec.ts
- fixes.test.ts
- Shared Types (Task 1 writes them; every task uses them)
- A task's life
- notes_page.tsx
- note_bookmarks.ts
- shell.e2e.ts
- time.ts
- detail_api.ts
- overrides
- What Rohan sees
- assistant_providers.ts
- The record
- feedback.spec.tsx
- board.spec.tsx
- Part 4: the rest of the screens
- Scene
- worktrees_repository_impl.ts
- ref_node_path
- notes.e2e.ts
- ref_node_fs
- sky_time.ts
- Plan: the board, recoverable tasks and checkpoints

## God Nodes (most connected - your core abstractions)
1. `t` - 112 edges
2. `Refusal` - 106 edges
3. `vitest` - 105 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `EngineApi` - 70 edges
7. `preact` - 68 edges
8. `Reply` - 64 edges
9. `currentTask()` - 64 edges
10. `App()` - 58 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts
- `Keys` --references--> `d()`  [INFERRED]
  docs/spec.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (149 total, 7 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.08
Nodes (57): body(), write(), NOTE_PICKER_QUEST_ROWS, dayOf(), brewLineOf(), folderError(), FolderGroup, folderNameError() (+49 more)

### Community 1 - "settings_api.ts"
Cohesion: 0.12
Nodes (25): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+17 more)

### Community 2 - "Refusal"
Cohesion: 0.09
Nodes (68): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+60 more)

### Community 3 - "opening_api.spec.ts"
Cohesion: 0.20
Nodes (14): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+6 more)

### Community 4 - "services/helpers.ts"
Cohesion: 0.07
Nodes (31): Drafting a version for the Designs tab, How you work, What you don't do, What you report, fileNamed(), FILES, frontmatter(), helperOf() (+23 more)

### Community 5 - "note_graph_view.tsx"
Cohesion: 0.07
Nodes (49): GRAPH_LABEL_CHARS, aroundOf(), GraphFilter, GraphNode, GraphNodeKind, graphOf(), GraphSteps, nextNode() (+41 more)

### Community 6 - "new_quest_sheet.tsx"
Cohesion: 0.09
Nodes (42): Field(), FieldProps, Group(), Pick(), NextVersionSheet(), Change, changeEntry(), changeQuests() (+34 more)

### Community 7 - "env.ts"
Cohesion: 0.08
Nodes (47): codexOperations(), CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, One engine, two hosts, Ctx, Env (+39 more)

### Community 8 - "scope.ts"
Cohesion: 0.08
Nodes (57): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+49 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (54): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 1: The helper list and the record field, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, helperToRemind() (+46 more)

### Community 10 - "notes.spec.tsx"
Cohesion: 0.11
Nodes (19): GraphEdge, LayoutInput, layoutOf(), Point, GraphLayoutState, LAYING, LayoutMessage, LayoutRun (+11 more)

### Community 11 - "EngineApi"
Cohesion: 0.07
Nodes (42): dayAndTime(), AttachmentInput(), bytesOf(), Props, State, NoteAttachment(), Props, State (+34 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.09
Nodes (45): TOAST_ACTION_MS, TOAST_MS, Spinner(), Item(), Toasts(), accountsIn(), hasAccounts(), isGone() (+37 more)

### Community 13 - "ask"
Cohesion: 0.09
Nodes (49): Content(), ask(), EngineRead, useEngineRead(), ReadView(), Failed(), Loading(), BRANCH_POLL_MS (+41 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (24): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+16 more)

### Community 16 - "engine_api.ts"
Cohesion: 0.08
Nodes (36): Answer, NextForm, Props, withoutReview(), stepLine(), Named, QuestFlows, DIFFICULTIES (+28 more)

### Community 17 - "git_source.ts"
Cohesion: 0.16
Nodes (28): Task 8: The task flow, Already built, SwitchResult, switchToTaskUseCase(), commitsBetween(), diffSince(), git(), lastCommit() (+20 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (51): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+43 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "record_source.ts"
Cohesion: 0.15
Nodes (25): p, canRestoreFrom(), game(), What's saved, Data, 7. Acceptance criteria, backupPath(), fnv1a() (+17 more)

### Community 21 - "constants/constants.ts"
Cohesion: 0.06
Nodes (35): ACTIVITY_REFRESH_MS, AUTOSAVE_MS, DRAG_SLOP_PX, GRAPH_CHARGE, GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_GRAVITY, GRAPH_HIT_PX (+27 more)

### Community 22 - "helper_card.tsx"
Cohesion: 0.14
Nodes (18): HelperBench(), nameOf(), Props, Report(), Helper, HELPERS, folderName(), orderError() (+10 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.13
Nodes (28): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+20 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.09
Nodes (50): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+42 more)

### Community 26 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.11
Nodes (30): 4.4 A task's detail: current, queued and done, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote (+22 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.09
Nodes (33): record(), won(), seed(), emptyRecord(), CTX, fakePorts(), makeTask(), memoryHost() (+25 more)

### Community 29 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 30 - "notes.spec.tsx"
Cohesion: 0.18
Nodes (9): layouts, memoryNotes(), ok(), open(), BOARD, input(), noop(), projectRow() (+1 more)

### Community 31 - "project_views.ts"
Cohesion: 0.07
Nodes (51): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+43 more)

### Community 32 - "Refusal"
Cohesion: 0.08
Nodes (86): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+78 more)

### Community 33 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.13
Nodes (40): Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf() (+32 more)

### Community 35 - "notes_api.spec.ts"
Cohesion: 0.20
Nodes (9): NotesDeps, change(), created(), data(), makeApi(), NOW, revealed, NoteChange (+1 more)

### Community 36 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.17
Nodes (20): checkScene(), CommentsFile, isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+12 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.22
Nodes (14): filePathOf(), formatOf(), noteFiles(), attachmentError(), extensionOf(), NOTE_ATTACHMENTS, NOTE_FILE_ACCEPT, NOTE_FILE_LIMIT (+6 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (36): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+28 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.20
Nodes (13): NOW, record(), Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository (+5 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.25
Nodes (18): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+10 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.10
Nodes (20): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+12 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.07
Nodes (90): readChoices(), The eight items, Task 10: `tasks`: the queue side, 4.2 Tasks, with a feature in the detail pane, 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, What each screen reads from existing data, checkPrompt() (+82 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "detail_api.ts"
Cohesion: 0.12
Nodes (16): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+8 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf()

### Community 53 - "design_forms.ts"
Cohesion: 0.12
Nodes (22): Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, nextFormOf(), numberError() (+14 more)

### Community 54 - "hud.tsx"
Cohesion: 0.07
Nodes (49): ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, ALL, hrefOf(), Route (+41 more)

### Community 55 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.12
Nodes (19): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+11 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (15): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader(), orderOf(), parse() (+7 more)

### Community 59 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "designs.ts"
Cohesion: 0.12
Nodes (30): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+22 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.25
Nodes (7): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, Where to change it

### Community 63 - "description_files.spec.tsx"
Cohesion: 0.29
Nodes (6): box(), drop(), open(), pane(), pick(), saved()

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "t"
Cohesion: 0.05
Nodes (76): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, GROWS_AT, HOME_BADGES, HOME_BOARD_ROWS, Dragon(), GoldReward(), PriorityTag() (+68 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (35): clockTime(), dayName(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex(), weekdayOf() (+27 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "helpers_api.spec.ts"
Cohesion: 0.08
Nodes (24): attempt(), failed(), isForbiddenGit(), nodeHost(), host, log, ProcessRequest, DONE (+16 more)

### Community 70 - "docs_log_source.ts"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): DEFAULT_LOG_PATH, logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening() (+9 more)

### Community 73 - "bundle.spec.ts"
Cohesion: 0.31
Nodes (8): commitOfProvenance(), isNumber(), relaunchArgv(), Restored, restoredOf(), run, versionOfPlist(), installedBuild()

### Community 74 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 77 - "Host"
Cohesion: 0.13
Nodes (20): loadCodexContext(), Task 1: the file seam, Host, unixFiles(), taskLogRepositoryImpl(), codexRepositoryOf(), folderOf(), readCodexActivity() (+12 more)

### Community 78 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "note_history.tsx"
Cohesion: 0.23
Nodes (14): useWindowKeys(), isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, menuKey(), PRIORITY_KEYS (+6 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.10
Nodes (19): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+11 more)

### Community 89 - "start_api.spec.ts"
Cohesion: 0.17
Nodes (5): git(), NOW, onDisk(), run, seed()

### Community 90 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 91 - "dependency_setup.ts"
Cohesion: 0.25
Nodes (9): CheckStopped, dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote() (+1 more)

### Community 92 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 93 - "Merge-check dependency setup"
Cohesion: 0.33
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 94 - "Designs tab"
Cohesion: 0.18
Nodes (11): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+3 more)

### Community 95 - "register.tsx"
Cohesion: 0.09
Nodes (67): 5. Features, shared resources and the core, Features, The core and the app, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, toggleMenu(), loadContext(), beat() (+59 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.12
Nodes (25): UPDATE_TEXT, Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps (+17 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "Notes"
Cohesion: 0.10
Nodes (20): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+12 more)

### Community 102 - "GitState"
Cohesion: 0.29
Nodes (4): Task 3: Reading git and making branches, GitState, GitRepository, fakeGit()

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 105 - "judgements.spec.ts"
Cohesion: 0.33
Nodes (8): Asked, askedOf(), idOf(), judgementWatch(), broken, setup(), WatchDeps, Scanned

### Community 106 - "test_support.ts"
Cohesion: 0.13
Nodes (19): chronicle(), mana(), open(), pending(), CHRONICLE, DESIGNS, GAME, helperJob() (+11 more)

### Community 107 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+2 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.15
Nodes (3): Global Constraints, Parallel quests: implementation decisions, Queue-tea Implementation Plan

### Community 110 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 111 - "quest_flows.spec.ts"
Cohesion: 0.13
Nodes (12): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+4 more)

### Community 112 - "tasks_api.spec.ts"
Cohesion: 0.25
Nodes (5): logged, NOW, onDisk(), seed(), stored()

### Community 113 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), open(), palette(), SECOND

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "ports.ts"
Cohesion: 0.10
Nodes (40): Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, File Structure, Task 9: Keeping usage down, MenuSpec (+32 more)

### Community 116 - "App"
Cohesion: 0.09
Nodes (20): App(), moodOf(), open(), useHour(), KNOWN, NEW, open(), TWO (+12 more)

### Community 117 - "finish_api.spec.ts"
Cohesion: 0.05
Nodes (32): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+24 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "flows.spec.tsx"
Cohesion: 0.13
Nodes (13): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+5 more)

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 121 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 122 - "fakeEngine"
Cohesion: 0.13
Nodes (21): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+13 more)

### Community 123 - "ref_node_os"
Cohesion: 0.06
Nodes (18): APP, FIRST, record(), recordFile(), replaceRecord(), APP, event(), plantClaude() (+10 more)

### Community 124 - "core/logger.ts"
Cohesion: 0.10
Nodes (25): createLogger(), fileSink(), stackOf(), OutputSink, ProcessResult, running, log, stopProcesses() (+17 more)

### Community 125 - "victory.spec.ts"
Cohesion: 0.50
Nodes (3): NOW, record(), won()

### Community 126 - "server.spec.ts"
Cohesion: 0.11
Nodes (26): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+18 more)

### Community 127 - "fixes.test.ts"
Cohesion: 0.06
Nodes (62): live(), Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet (+54 more)

### Community 128 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.31
Nodes (9): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check, ProjectRecord (+1 more)

### Community 129 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 130 - "notes_page.tsx"
Cohesion: 0.08
Nodes (40): Dialog(), Empty(), useWindowWidth(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK (+32 more)

### Community 131 - "note_bookmarks.ts"
Cohesion: 0.36
Nodes (6): bookmarkOf(), ENTITIES, textOf(), BOOKMARK_LIMITS, BOOKMARK_URL_LIMIT, NoteBookmark

### Community 133 - "time.ts"
Cohesion: 0.21
Nodes (16): applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending, READS (+8 more)

### Community 134 - "detail_api.ts"
Cohesion: 0.21
Nodes (15): readCodexSession(), Observation, observeTask(), activeOf(), branchToBe(), gitOf(), linesSince(), quietly() (+7 more)

### Community 135 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

### Community 136 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 137 - "assistant_providers.ts"
Cohesion: 0.52
Nodes (3): assistantRepositoryImpl(), Reply, AssistantRepository

### Community 138 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 139 - "feedback.spec.tsx"
Cohesion: 0.17
Nodes (7): ACCOUNTS, BOARD, input(), open(), empty(), reply(), GithubLoginCode

### Community 140 - "board.spec.tsx"
Cohesion: 0.10
Nodes (12): BOARD, FIRST, open(), SAGA, SECOND, BOARD, CHOICES, FIRST (+4 more)

### Community 141 - "Part 4: the rest of the screens"
Cohesion: 0.40
Nodes (5): Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window

### Community 142 - "Scene"
Cohesion: 0.33
Nodes (6): commit(), History, historyOf(), redo(), undo(), Scene

### Community 144 - "ref_node_path"
Cohesion: 0.10
Nodes (16): APP, errors, esbuild, writeBundle(), counts, currentProvenance(), git(), releaseProblem() (+8 more)

### Community 146 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 147 - "ref_node_fs"
Cohesion: 0.12
Nodes (15): codexArgs(), NASTY, run, hasChanged(), log, Stamps, stampsOf(), watchFolders() (+7 more)

### Community 148 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

### Community 149 - "Plan: the board, recoverable tasks and checkpoints"
Cohesion: 0.50
Nodes (4): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints

## Knowledge Gaps
- **7 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1055 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `fakeEngine` to `note_workspace.tsx`, `settings_api.ts`, `notes_page.tsx`, `note_bookmarks.ts`, `opening_api.spec.ts`, `note_graph_view.tsx`, `new_quest_sheet.tsx`, `env.ts`, `scope.ts`, `notes.spec.tsx`, `feedback.spec.tsx`, `board.spec.tsx`, `ask`, `Scene`, `first_run.tsx`, `ref_node_path`, `engine_api.ts`, `ref_node_fs`, `sky_time.ts`, `helper_card.tsx`, `notes_api.ts`, `tests/helpers.ts`, `notes.spec.tsx`, `project_views.ts`, `Refusal`, `app_menu.ts`, `design_editor.tsx`, `notes_api.spec.ts`, `designs_api.ts`, `note_attachments.ts`, `sessions.test.ts`, `claude_code.ts`, `library_api.ts`, `detail_api.ts`, `designs.spec.tsx`, `design_forms.ts`, `hud.tsx`, `projects_api.spec.ts`, `host.ts`, `detail.spec.tsx`, `designs.ts`, `description_files.spec.tsx`, `messages.ts`, `t`, `chronicle_page.tsx`, `helpers_api.spec.ts`, `bundle.spec.ts`, `package.json`, `designs_api.spec.ts`, `start_api.spec.ts`, `ref_node_child_process`, `GitState`, `judgements.spec.ts`, `test_support.ts`, `quest_flows.spec.ts`, `tasks_api.spec.ts`, `shell.spec.tsx`, `App`, `finish_api.spec.ts`, `flows.spec.tsx`, `ref_node_os`, `core/logger.ts`, `victory.spec.ts`, `server.spec.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0807909604519774 - nodes in this community are weakly interconnected._
- **Why does `d()` connect `core/logger.ts` to `Refusal`, `What Rohan sees`, `Queue-tea: panel redesign`, `Queue-tea`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `settings_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11586452762923351 - nodes in this community are weakly interconnected._
- **Why does `Queue-tea: design` connect `Queue-tea: design` to `What Rohan sees`, `A task's life`, `The record`, `workspace-app.md`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._