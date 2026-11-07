# Graph Report - notes-command-palette  (2026-11-07)

## Corpus Check
- 539 files · ~498,401 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3397 nodes · 12411 edges · 118 communities (113 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 680 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ab1b3b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- vitest
- Refusal
- update_service.ts
- services/helpers.ts
- pages.e2e.ts
- preact
- board_tools.tsx
- opening_api.spec.ts
- tasks_controller.ts
- designs_page.tsx
- time.ts
- first_run.tsx
- t
- Queue-tea: design
- git_rules.spec.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- update_runner.mjs
- backlog_view.tsx
- families.ts
- emptyRecord
- palette.ts
- band_host.tsx
- Part 3: setting out and coming back
- checkpoints.ts
- ref_claude_code
- states.tsx
- project_views.ts
- game.ts
- branch_api.ts
- test_support.ts
- design_editor.tsx
- hoard_page.tsx
- ui.test.tsx
- Task 3: Entities and pure rules
- helpers_api.spec.ts
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
- tasks_api.ts
- library_api.ts
- activity.ts
- Notes
- ref_types
- quest_keys.ts
- requests_controller.ts
- ref_node_os
- quest_edits.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- app.tsx
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- Queue-tea: workspace app UI design
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- branch_rules.ts
- task_input.ts
- Queue-tea
- quest_detail.tsx
- check_layers.mjs
- package.json
- chai-pter.md
- branch_workflow.e2e.ts
- start_api.spec.ts
- server.spec.ts
- app/README.md
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- codex_source.ts
- domain/helpers.ts
- Shared Types (Task 1 writes them; every task uses them)
- Architecture
- Designs tab
- Part B: the app
- Queue-tea in Codex
- Branch workflow completion — 5 November 2026
- projects_api.spec.ts
- release_guard.d.mts
- Tea-concile
- Part 2: edits
- GitState
- Task Log
- first_window.e2e.ts
- shared/codex.test.ts
- notes.e2e.ts
- mocha-mockup.md
- Guild helpers on tasks
- Queue-tea, the workspace app
- release_guard.mjs
- sky_time.ts
- Repository Rules
- Roadmap: the outside review, checked against the code
- .line-check-NZS8Gw/tsconfig.json
- Plan: the board, recoverable tasks and checkpoints
- Review focus
- edits.e2e.ts

## God Nodes (most connected - your core abstractions)
1. `t` - 103 edges
2. `Refusal` - 97 edges
3. `vitest` - 85 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `currentTask()` - 64 edges
7. `preact` - 62 edges
8. `Reply` - 61 edges
9. `EngineApi` - 61 edges
10. `scopeOf()` - 56 edges

## Surprising Connections (you probably didn't know these)
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
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

## Communities (118 total, 5 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.05
Nodes (96): changeOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf(), same() (+88 more)

### Community 1 - "vitest"
Cohesion: 0.05
Nodes (44): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+36 more)

### Community 2 - "Refusal"
Cohesion: 0.12
Nodes (40): Refusal, dependencies(), activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+32 more)

### Community 3 - "update_service.ts"
Cohesion: 0.16
Nodes (12): UPDATE_TEXT, Deps, majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, AppUpdate (+4 more)

### Community 4 - "services/helpers.ts"
Cohesion: 0.27
Nodes (14): NewQuest, QuestEdit, Task 2: Filing and editing carry the choice, How the choice reaches the record, One engine, two hosts, edited(), editTaskUseCase(), TaskEdit (+6 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "preact"
Cohesion: 0.09
Nodes (49): Content(), ROUTES, ask(), EngineRead, useEngineRead(), DEFAULT_LOG_PATH, ReadView(), Empty() (+41 more)

### Community 7 - "board_tools.tsx"
Cohesion: 0.12
Nodes (25): BoardSection, BoardView, EMPTY_BOARD, filterEntries(), Filters, hasFilters(), isFiltering(), matchesText() (+17 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (65): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once(), running, helperToRemind(), markRemindedUseCase(), noteHelperUseCase() (+57 more)

### Community 10 - "designs_page.tsx"
Cohesion: 0.05
Nodes (65): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), THUMB_BOX (+57 more)

### Community 11 - "time.ts"
Cohesion: 0.17
Nodes (18): statusText(), noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once() (+10 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.13
Nodes (30): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+22 more)

### Community 13 - "t"
Cohesion: 0.07
Nodes (36): HelperBench(), nameOf(), Props, Report(), HELPERS, folderName(), orderError(), GuildPage() (+28 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "git_rules.spec.ts"
Cohesion: 0.15
Nodes (16): OutputSink, ProcessRequest, running, stopProcesses(), streamProcess(), argvOf(), nodeUserGit(), UserGit (+8 more)

### Community 16 - "scope.ts"
Cohesion: 0.10
Nodes (57): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readCodexSession(), Observation, readChronicle() (+49 more)

### Community 17 - "git_source.ts"
Cohesion: 0.31
Nodes (18): Task 8: The task flow, What each screen reads from existing data, Options, commitsBetween(), diffSince(), git(), lastCommit(), listBranches() (+10 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (58): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+50 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.20
Nodes (16): addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion(), nextVersion() (+8 more)

### Community 20 - "update_runner.mjs"
Cohesion: 0.27
Nodes (14): request(), setup(), updateService(), exec, ACTIVE, exec, git(), publishedSource() (+6 more)

### Community 21 - "backlog_view.tsx"
Cohesion: 0.16
Nodes (34): The eight items, Task 10: `tasks`: the queue side, capital(), markFor(), KEYS, fileFromCommand(), parentFor(), blockTask() (+26 more)

### Community 22 - "families.ts"
Cohesion: 0.16
Nodes (30): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), TypedVerdict, FeatureFound, findFeatureUseCase(), MoveResult (+22 more)

### Community 23 - "emptyRecord"
Cohesion: 0.06
Nodes (38): BUNDLE, git(), plist(), run, STAGE, record(), won(), NOW (+30 more)

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 25 - "band_host.tsx"
Cohesion: 0.06
Nodes (72): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these) (+64 more)

### Community 26 - "Part 3: setting out and coming back"
Cohesion: 0.10
Nodes (20): After the first install, Part 3: setting out and coming back, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in (+12 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.13
Nodes (24): Already built, 4.1 Home, CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote, HandoffSection, handoffSections(), isHeading() (+16 more)

### Community 28 - "ref_claude_code"
Cohesion: 0.06
Nodes (52): Ask, MenuSpec, SessionUsage, View, checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository (+44 more)

### Community 29 - "states.tsx"
Cohesion: 0.10
Nodes (33): ALL, hrefOf(), Route, routeOf(), useRoute(), isStreakAtRisk(), laterHook(), Momentum (+25 more)

### Community 30 - "project_views.ts"
Cohesion: 0.11
Nodes (41): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+33 more)

### Community 31 - "game.ts"
Cohesion: 0.20
Nodes (19): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+11 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.09
Nodes (82): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+74 more)

### Community 33 - "test_support.ts"
Cohesion: 0.03
Nodes (114): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+106 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.05
Nodes (88): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+80 more)

### Community 35 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (16): STAGE_SCALE, Coins(), EggArt(), MEDALS, StageArt(), FIRST_LEVEL, STAGES, stageState() (+8 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.13
Nodes (25): Task 3: Entities and pure rules, Task 2: The record, Task 5: Time and effort, Allowance, Band, Checkpoint, claude-code, CommandRun (+17 more)

### Community 38 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 39 - "makeTask"
Cohesion: 0.10
Nodes (12): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+4 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.18
Nodes (30): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+22 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.13
Nodes (25): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+17 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.21
Nodes (21): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+13 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.11
Nodes (25): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 49 - "tasks_api.ts"
Cohesion: 0.20
Nodes (20): inGameWords(), edit(), editQuest(), fileQuest(), moveQuest(), removeQuest(), restoreQuest(), sealQuest() (+12 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.ts"
Cohesion: 0.16
Nodes (14): codexEvents, commandOf(), parse(), Row, textOf(), COMMIT_ACTIVITY_LIMIT, readActivity(), ACTIVITY_LIMIT (+6 more)

### Community 52 - "Notes"
Cohesion: 0.13
Nodes (14): Acceptance checks, Answered, Architecture, Behaviour, Decisions, Fields and their checks, Keys and focus, Not in Notes 1 (+6 more)

### Community 53 - "ref_types"
Cohesion: 0.08
Nodes (36): codexOperations(), CodexRefusal, readable(), Task 10: The panel, the band, the status line and the commands, Ctx, Env, errandReply(), Block (+28 more)

### Community 54 - "quest_keys.ts"
Cohesion: 0.23
Nodes (13): isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, menuKey(), PRIORITY_KEYS, questKeyOf() (+5 more)

### Community 55 - "requests_controller.ts"
Cohesion: 0.17
Nodes (21): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd() (+13 more)

### Community 56 - "ref_node_os"
Cohesion: 0.05
Nodes (27): APP, change(), git(), onDisk(), run, stored(), APP, event() (+19 more)

### Community 57 - "quest_edits.ts"
Cohesion: 0.18
Nodes (16): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withPlayNext(), withPriority(), QuestEdits (+8 more)

### Community 58 - "host.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.11
Nodes (19): chronicle(), mana(), game(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step (+11 more)

### Community 61 - "app.tsx"
Cohesion: 0.06
Nodes (48): ContentProps, MORE_PAGES, SheetProps, TABS, AUTOSAVE_MS, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX (+40 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.10
Nodes (68): live(), 5. Features, shared resources and the core, Features, The core and the app, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, renderBand(), pressOpenApp() (+60 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.19
Nodes (11): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+3 more)

### Community 65 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.22
Nodes (14): File Structure, addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog() (+6 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "branch_rules.ts"
Cohesion: 0.24
Nodes (11): SwitchResult, switchToTaskUseCase(), branchSlug(), count(), FILLER, holdReason(), parseShortstat(), slugBranch() (+3 more)

### Community 70 - "task_input.ts"
Cohesion: 0.35
Nodes (11): criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf(), helpersOf(), newQuestOf(), parentOf(), PLATFORMS (+3 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.07
Nodes (55): SheetView(), Answer, XP_BY_DIFFICULTY, Dialog(), Field(), FieldProps, Group(), Pick() (+47 more)

### Community 73 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 74 - "package.json"
Cohesion: 0.09
Nodes (19): esbuild, author, description, license, main, name, private, productName (+11 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.13
Nodes (22): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+14 more)

### Community 77 - "start_api.spec.ts"
Cohesion: 0.08
Nodes (24): loadCodexContext(), AT, git(), NOW, onDisk(), run, seed(), log (+16 more)

### Community 78 - "server.spec.ts"
Cohesion: 0.16
Nodes (21): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+13 more)

### Community 79 - "app/README.md"
Cohesion: 0.16
Nodes (4): Global Constraints, Parallel quests: implementation decisions, Queue-tea Implementation Plan, Review Focus

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (110): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft() (+102 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (17): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+9 more)

### Community 89 - "record_source.ts"
Cohesion: 0.12
Nodes (28): p, AS_OF_27_OCT, badge(), NOW, record(), canRestoreFrom(), Task 1: The helper list and the record field, Data (+20 more)

### Community 90 - "codex_source.ts"
Cohesion: 0.18
Nodes (5): CodexObservation, cache, catalog, Session, counts

### Community 91 - "domain/helpers.ts"
Cohesion: 0.28
Nodes (8): fileNamed(), FILES, frontmatter(), Helper, helperOf(), KINDS, LOGOS, HELPER_IDS

### Community 92 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.25
Nodes (8): held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 4: The git guard, Task 6: The docs log, Task 7: The message check

### Community 93 - "Architecture"
Cohesion: 0.17
Nodes (12): Architecture, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The Designs tab (+4 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

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

### Community 101 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 102 - "GitState"
Cohesion: 0.29
Nodes (6): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, GitRepository, fakeGit()

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 105 - "shared/codex.test.ts"
Cohesion: 0.32
Nodes (5): folderOf(), readCodexActivity(), codexLog(), NOW, SINCE

### Community 106 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 107 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+3 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "release_guard.mjs"
Cohesion: 0.39
Nodes (7): writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate

### Community 111 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

### Community 112 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 113 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "Plan: the board, recoverable tasks and checkpoints"
Cohesion: 0.50
Nodes (4): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints

### Community 116 - "Review focus"
Cohesion: 0.50
Nodes (3): Global constraints, Guild helpers on tasks: implementation plan, Review focus

### Community 117 - "edits.e2e.ts"
Cohesion: 0.12
Nodes (6): APP, onDisk(), SEED, stored(), titled(), APP

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 944 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `update_service.ts`, `preact`, `board_tools.tsx`, `designs_page.tsx`, `first_run.tsx`, `t`, `git_rules.spec.ts`, `update_runner.mjs`, `emptyRecord`, `states.tsx`, `branch_api.ts`, `test_support.ts`, `design_editor.tsx`, `helpers_api.spec.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `ref_node_os`, `quest_edits.ts`, `host.ts`, `app_menu.ts`, `quest_detail.tsx`, `package.json`, `start_api.spec.ts`, `server.spec.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `record_source.ts`, `codex_source.ts`, `projects_api.spec.ts`, `GitState`, `release_guard.mjs`, `sky_time.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05211141060197664 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `vitest`, `tasks_controller.ts`, `time.ts`, `scope.ts`, `families.ts`, `band_host.tsx`, `ref_claude_code`, `branch_api.ts`, `ui.test.tsx`, `Task 3: Entities and pure rules`, `helpers_api.spec.ts`, `makeTask`, `4. Screens`, `ref_types`, `ref_node_os`, `branch_workflow.e2e.ts`, `start_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `projects_api.spec.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.05028305028305028 - nodes in this community are weakly interconnected._
- **Why does `Queue-tea: workspace app UI design` connect `Queue-tea: workspace app UI design` to `4. Screens`, `record_source.ts`, `app/README.md`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._