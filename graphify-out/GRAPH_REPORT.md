# Graph Report - main-integration  (2026-11-18)

## Corpus Check
- 593 files · ~564,367 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3789 nodes · 13681 edges · 146 communities (139 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 732 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21b4c8bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- core/logger.ts
- finish_api.spec.ts
- Refusal
- designs_api.spec.ts
- check_prompt.ts
- new_quest_sheet.tsx
- ref_types
- opening_api.ts
- tasks_controller.ts
- note_graph_layout.ts
- worktrees_repository_impl.ts
- first_run.tsx
- engine_api.ts
- Queue-tea: design
- band_host.tsx
- Reply
- git_source.ts
- main.ts
- version.test.mjs
- brew_quest.tsx
- app.tsx
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- test_support.ts
- checkpoints.ts
- tests/helpers.ts
- board_tools.tsx
- vitest
- sessions.test.ts
- branch_api.ts
- createWorkspace
- design_editor.tsx
- design_forms.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- start_api.spec.ts
- menu_frame.tsx
- dependency_setup.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- flows.spec.tsx
- compilerOptions
- Notes: the knowledge graph view
- queue_controller.ts
- library_api.ts
- activity.spec.ts
- branch_workflow.e2e.ts
- t
- hud.tsx
- 4. Screens
- board.e2e.ts
- server.spec.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- ref_node_fs
- Queue-tea: panel redesign
- game.ts
- messages.ts
- chronicle_page.tsx
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- inspector.tsx
- Queue-tea
- workspace_store.ts
- setup.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- pages.e2e.ts
- card_note.ts
- designs.ts
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- record_source.ts
- Merge-check dependency setup
- update.ts
- Architecture
- judgements.spec.ts
- Designs tab
- session_rhythm.ts
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- file_task.ts
- Notes
- scope.ts
- Task Log
- Workspace app, the rest of the road
- Shared Types (Task 1 writes them; every task uses them)
- settings_page.tsx
- Part A: the mod
- Guild helpers on tasks
- workspace-app.md
- ref_node_path
- EngineApi
- Part 3: setting out and coming back
- .line-check-NZS8Gw/tsconfig.json
- requests_controller.ts
- app_menu.ts
- @playwright/test
- Part 2: edits
- presentation/widgets/read_view.tsx
- check_layers.mjs
- first_window.e2e.ts
- designs.spec.tsx
- Queue-tea, the workspace app
- codex_providers.ts
- note_bookmarks.ts
- daily_notes.e2e.ts
- Tea-concile
- queue_rules.ts
- feedback.spec.tsx
- description_files.spec.tsx
- settings.spec.tsx
- Repository Rules
- detail.spec.tsx
- notes_backup.e2e.ts
- .accept
- opening.spec.tsx
- write_handoff.ts
- git_repository.ts
- assistant_providers.ts
- note_attachments.e2e.ts
- notes.e2e.ts
- sky_time.ts
- overrides
- NoteMode
- notes.spec.tsx

## God Nodes (most connected - your core abstractions)
1. `t` - 113 edges
2. `Refusal` - 108 edges
3. `vitest` - 106 edges
4. `emptyRecord()` - 81 edges
5. `reply()` - 74 edges
6. `EngineApi` - 71 edges
7. `preact` - 69 edges
8. `Reply` - 65 edges
9. `currentTask()` - 64 edges
10. `ask()` - 59 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (146 total, 7 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (67): brewLineOf(), captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderNameError(), foldersOf() (+59 more)

### Community 1 - "core/logger.ts"
Cohesion: 0.04
Nodes (62): appIdOf(), Flavor, flavorOf(), createLogger(), fileSink(), Logger, stackOf(), attempt() (+54 more)

### Community 2 - "finish_api.spec.ts"
Cohesion: 0.09
Nodes (20): record(), won(), NOW, record(), won(), seed(), active(), NOW (+12 more)

### Community 3 - "Refusal"
Cohesion: 0.12
Nodes (44): inGameWords(), Refusal, setTaskLog(), finishQuest(), keepLog(), Logged, minutesOf(), notYet() (+36 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 5 - "check_prompt.ts"
Cohesion: 0.20
Nodes (14): File Structure, checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS (+6 more)

### Community 6 - "new_quest_sheet.tsx"
Cohesion: 0.08
Nodes (45): Field(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError(), FORM (+37 more)

### Community 7 - "ref_types"
Cohesion: 0.08
Nodes (47): Ctx, Env, Options, Block, withBlock(), addRequestUseCase(), BlockResult, blockTaskUseCase() (+39 more)

### Community 8 - "opening_api.ts"
Cohesion: 0.10
Nodes (29): projectsFolder(), canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn() (+21 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.09
Nodes (40): Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), shouldCheck(), helperToRemind() (+32 more)

### Community 10 - "note_graph_layout.ts"
Cohesion: 0.10
Nodes (24): GRAPH_CHARGE, GRAPH_GRAVITY, GRAPH_LINK_DISTANCE, GRAPH_PROGRESS_TICKS, GRAPH_THETA, GRAPH_TICKS, GRAPH_WARM_ALPHA, GraphEdge (+16 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.11
Nodes (37): FieldProps, Group(), Pick(), Props, accountsIn(), hasAccounts(), isGone(), isKnown() (+29 more)

### Community 13 - "engine_api.ts"
Cohesion: 0.06
Nodes (47): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+39 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "band_host.tsx"
Cohesion: 0.07
Nodes (54): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawCup(), drawQuestion(), MOOD_COLOR, MOOD_WORD (+46 more)

### Community 16 - "Reply"
Cohesion: 0.15
Nodes (11): BOARD, FIRST, key(), open(), palette(), SECOND, open(), pending() (+3 more)

### Community 17 - "git_source.ts"
Cohesion: 0.25
Nodes (20): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+12 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (74): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+66 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "brew_quest.tsx"
Cohesion: 0.25
Nodes (10): lineOf(), tickedItemsOf(), BrewSheet(), DIFFICULTIES, Errors, parentError(), PRIORITIES, questTitleError() (+2 more)

### Community 21 - "app.tsx"
Cohesion: 0.10
Nodes (38): Content(), ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, Dialog(), Failed() (+30 more)

### Community 22 - "families.ts"
Cohesion: 0.07
Nodes (84): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+76 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (25): actions(), allQuests(), canRun(), creates(), entry(), filterPalette(), GO_TO, isStatus() (+17 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.06
Nodes (74): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+66 more)

### Community 26 - "test_support.ts"
Cohesion: 0.11
Nodes (20): App(), moodOf(), open(), useHour(), chronicle(), mana(), open(), game() (+12 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.19
Nodes (13): CODEX_RULES(), codexBrief(), commandRun(), isTestCommand(), lastLine(), parseCheckpoint(), strings(), text() (+5 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (39): seed(), seed(), FIRST_MESSAGE_LABELS, emptyRecord(), CTX, fakePorts(), makeTask(), memoryHost() (+31 more)

### Community 29 - "board_tools.tsx"
Cohesion: 0.12
Nodes (24): BoardSection, BoardView, EMPTY_BOARD, filterEntries(), Filters, hasFilters(), isFiltering(), matchesText() (+16 more)

### Community 30 - "vitest"
Cohesion: 0.14
Nodes (20): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+12 more)

### Community 31 - "sessions.test.ts"
Cohesion: 0.21
Nodes (13): NOW, record(), Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository (+5 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.06
Nodes (97): streamProcess(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+89 more)

### Community 33 - "createWorkspace"
Cohesion: 0.07
Nodes (22): BOARD, FIRST, open(), SAGA, SECOND, open(), open(), BOARD (+14 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.14
Nodes (35): Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf() (+27 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.10
Nodes (28): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+20 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.14
Nodes (22): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+14 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.12
Nodes (34): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+26 more)

### Community 39 - "start_api.spec.ts"
Cohesion: 0.12
Nodes (14): git(), NOW, onDisk(), run, seed(), Task 1: the file seam, Host, unixFiles() (+6 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (35): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+27 more)

### Community 41 - "dependency_setup.ts"
Cohesion: 0.33
Nodes (8): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies()

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.18
Nodes (24): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+16 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "flows.spec.tsx"
Cohesion: 0.11
Nodes (19): BOARD, held(), hold(), MAIN, OTHER, SEALED, withActive(), ACTIVE (+11 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.12
Nodes (38): Features, The eight items, Task 10: `tasks`: the queue side, togglePlayNextUseCase(), unblockTaskUseCase(), fileTask(), clearHold(), blockTask() (+30 more)

### Community 50 - "library_api.ts"
Cohesion: 0.15
Nodes (22): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), DUNE, NOW, addBook() (+14 more)

### Community 51 - "activity.spec.ts"
Cohesion: 0.24
Nodes (11): AT, COMMIT_ACTIVITY_LIMIT, readActivity(), log, step(), ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, activityEntries() (+3 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "t"
Cohesion: 0.13
Nodes (20): fileNamed(), FILES, frontmatter(), Helper, helperOf(), HELPERS, KINDS, LOGOS (+12 more)

### Community 54 - "hud.tsx"
Cohesion: 0.11
Nodes (30): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), isStreakAtRisk(), laterHook() (+22 more)

### Community 55 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.spec.ts"
Cohesion: 0.19
Nodes (12): loadCodexContext(), CODEX_LIMITS, CODEX_TEXT, CodexContext, codexOperations(), CodexRefusal, readable(), QUEUE_TEA_COMMANDS (+4 more)

### Community 58 - "host.ts"
Cohesion: 0.09
Nodes (32): OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), checkPath(), HelpersApi, HelpersDeps (+24 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "ref_node_fs"
Cohesion: 0.06
Nodes (20): APP, event(), plantClaude(), APP, paste(), APP, errors, APP (+12 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "game.ts"
Cohesion: 0.09
Nodes (37): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+29 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.12
Nodes (31): clockTime(), dayName(), manaLeft(), weekdayIndex(), weekdayOf(), BAR_PX, Column(), dayTotal() (+23 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "File Structure"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.06
Nodes (63): failed(), GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_LABEL_ZOOM, GRAPH_SPINNER_MS, GRAPH_ZOOM_MAX (+55 more)

### Community 70 - "inspector.tsx"
Cohesion: 0.21
Nodes (14): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+6 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "workspace_store.ts"
Cohesion: 0.06
Nodes (37): ACTIVITY_REFRESH_MS, AUTOSAVE_MS, DEFAULT_LOG_PATH, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX, GROWS_AT, HOLD_FILES_SHOWN (+29 more)

### Community 73 - "setup.ts"
Cohesion: 0.19
Nodes (18): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+10 more)

### Community 74 - "package.json"
Cohesion: 0.10
Nodes (18): author, description, license, main, name, private, productName, version (+10 more)

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

### Community 79 - "designs.ts"
Cohesion: 0.26
Nodes (8): commit(), History, historyOf(), redo(), undo(), DESIGN_FORMAT, FrameLayer, Scene

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.06
Nodes (78): dayAndTime(), dayOf(), isClaudeOut(), refillTime(), NOW, Dragon(), GoldReward(), PriorityTag() (+70 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.16
Nodes (15): NotesDeps, change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE (+7 more)

### Community 89 - "record_source.ts"
Cohesion: 0.13
Nodes (30): p, host, log, canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord() (+22 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.33
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "update.ts"
Cohesion: 0.20
Nodes (10): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, AppUpdate, changedBuild(), UpdatePhase (+2 more)

### Community 92 - "Architecture"
Cohesion: 0.09
Nodes (23): Acceptance criteria, Architecture, Build order, for the plan, Checked, Decisions, Files in a quest's description, In this release, Not in this release (+15 more)

### Community 93 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "session_rhythm.ts"
Cohesion: 0.07
Nodes (86): live(), The core and the app, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files (+78 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.26
Nodes (14): Deps, setup(), updateService(), exec, ACTIVE, exec, git(), publishedSource() (+6 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 100 - "file_task.ts"
Cohesion: 0.19
Nodes (17): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Task 2: Filing and editing carry the choice, The Guild Hall's helpers, edited(), editTaskUseCase() (+9 more)

### Community 101 - "Notes"
Cohesion: 0.10
Nodes (20): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+12 more)

### Community 102 - "scope.ts"
Cohesion: 0.07
Nodes (67): GAME_WORDS, MESSAGES, reply(), codexEvents, CodexObservation, Row, now, cache (+59 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Workspace app, the rest of the road"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 105 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.24
Nodes (10): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+2 more)

### Community 106 - "settings_page.tsx"
Cohesion: 0.19
Nodes (16): logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps (+8 more)

### Community 107 - "Part A: the mod"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", What's saved (+2 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.14
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 110 - "ref_node_path"
Cohesion: 0.09
Nodes (19): esbuild, writeBundle(), exec, APP, check(), run, run, SCRIPT (+11 more)

### Community 111 - "EngineApi"
Cohesion: 0.05
Nodes (80): Answer, ask(), EngineRead, useEngineRead(), THUMB_BOX, AttachmentInput(), bytesOf(), Props (+72 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "requests_controller.ts"
Cohesion: 0.13
Nodes (31): 5. Features, shared resources and the core, Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, once(), running, pad(), shouldFresh() (+23 more)

### Community 116 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 117 - "@playwright/test"
Cohesion: 0.08
Nodes (18): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+10 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "presentation/widgets/read_view.tsx"
Cohesion: 0.19
Nodes (12): isInPlay(), questLineOf(), groupsOf(), QuestItem(), QuestList(), markdown, Props, ReadView() (+4 more)

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 121 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 122 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), VersionView

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "codex_providers.ts"
Cohesion: 0.24
Nodes (8): codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl(), CodexRepository, codexLog(), NOW, SINCE

### Community 125 - "note_bookmarks.ts"
Cohesion: 0.36
Nodes (6): bookmarkOf(), ENTITIES, textOf(), BOOKMARK_LIMITS, BOOKMARK_URL_LIMIT, NoteBookmark

### Community 126 - "daily_notes.e2e.ts"
Cohesion: 0.40
Nodes (5): APP, at, errors, fileTitled(), notesDir()

### Community 127 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 128 - "queue_rules.ts"
Cohesion: 0.28
Nodes (8): Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), orderQueue(), PRIORITY_ORDER, removeTask(), setPriority(), suggestion()

### Community 129 - "feedback.spec.tsx"
Cohesion: 0.18
Nodes (6): ACCOUNTS, BOARD, input(), open(), empty(), reply()

### Community 130 - "description_files.spec.tsx"
Cohesion: 0.27
Nodes (7): box(), drop(), open(), pane(), pick(), saved(), quest()

### Community 131 - "settings.spec.tsx"
Cohesion: 0.20
Nodes (5): FAILED, NEW_FOLDER, open(), Settings, SettingsPage

### Community 132 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 133 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 134 - "notes_backup.e2e.ts"
Cohesion: 0.22
Nodes (4): APP, errors, EXPORTED, PNG

### Community 135 - ".accept"
Cohesion: 0.36
Nodes (4): commandOf(), parse(), textOf(), finishActivity()

### Community 136 - "opening.spec.tsx"
Cohesion: 0.25
Nodes (6): KNOWN, NEW, open(), TWO, SETTINGS_PAGE, MenuItem

### Community 137 - "write_handoff.ts"
Cohesion: 0.36
Nodes (7): factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), checkpointPrompt(), emptyCheckpoint(), ran()

### Community 138 - "git_repository.ts"
Cohesion: 0.38
Nodes (4): 4.1 Home, checkLines(), count(), GitRepository

### Community 139 - "assistant_providers.ts"
Cohesion: 0.52
Nodes (3): assistantRepositoryImpl(), Reply, AssistantRepository

### Community 140 - "note_attachments.e2e.ts"
Cohesion: 0.33
Nodes (3): APP, errors, PNG

### Community 141 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 142 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

### Community 143 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

### Community 144 - "NoteMode"
Cohesion: 0.67
Nodes (3): NoteMode, Global Constraints, Notes knowledge graph view Implementation Plan

### Community 145 - "notes.spec.tsx"
Cohesion: 0.18
Nodes (9): layouts, memoryNotes(), ok(), open(), BOARD, input(), noop(), note() (+1 more)

## Knowledge Gaps
- **7 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1075 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `core/logger.ts`, `finish_api.spec.ts`, `feedback.spec.tsx`, `designs_api.spec.ts`, `detail.spec.tsx`, `settings.spec.tsx`, `new_quest_sheet.tsx`, `opening_api.ts`, `opening.spec.tsx`, `note_graph_layout.ts`, `description_files.spec.tsx`, `first_run.tsx`, `sky_time.ts`, `Reply`, `notes.spec.tsx`, `main.ts`, `notes_api.ts`, `test_support.ts`, `board_tools.tsx`, `sessions.test.ts`, `branch_api.ts`, `createWorkspace`, `design_editor.tsx`, `design_forms.ts`, `designs_api.spec.ts`, `start_api.spec.ts`, `claude_code.ts`, `flows.spec.tsx`, `library_api.ts`, `activity.spec.ts`, `t`, `server.spec.ts`, `host.ts`, `ref_node_fs`, `game.ts`, `messages.ts`, `note_graph_view.tsx`, `setup.ts`, `package.json`, `designs.ts`, `quests_page.tsx`, `notes_backup.spec.ts`, `record_source.ts`, `update.ts`, `judgements.spec.ts`, `ref_node_child_process`, `scope.ts`, `ref_node_path`, `EngineApi`, `app_menu.ts`, `presentation/widgets/read_view.tsx`, `designs.spec.tsx`, `note_bookmarks.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07267884322678843 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `start_api.spec.ts` to `core/logger.ts`, `designs_api.spec.ts`, `opening_api.ts`, `worktrees_repository_impl.ts`, `git_source.ts`, `main.ts`, `tests/helpers.ts`, `sessions.test.ts`, `claude_code.ts`, `library_api.ts`, `activity.spec.ts`, `server.spec.ts`, `File Structure`, `record_source.ts`, `Architecture`, `session_rhythm.ts`, `Workspace app, the rest of the road`, `Part A: the mod`, `codex_providers.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `core/logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0438871473354232 - nodes in this community are weakly interconnected._
- **Why does `formatMinutes()` connect `menu_frame.tsx` to `queue_rules.ts`, `chronicle_page.tsx`, `File Structure`, `check_prompt.ts`, `ref_types`, `workspace_store.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `engine_api.ts`, `band_host.tsx`, `quests_page.tsx`, `app.tsx`, `families.ts`, `test_support.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._