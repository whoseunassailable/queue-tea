# Graph Report - notes-link-straight-quest  (2026-11-07)

## Corpus Check
- 538 files · ~496,824 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3397 nodes · 12381 edges · 134 communities (127 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 681 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ab1b3b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- notes_api.ts
- vitest
- tasks_api.ts
- update_service.ts
- task_input.ts
- library_page.tsx
- preact
- notes_view.ts
- opening_api.spec.ts
- tasks_controller.ts
- designs.ts
- App
- first_run.tsx
- t
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- branch_api.ts
- fakeEngine
- families.ts
- edits.e2e.ts
- palette.ts
- fixes.test.ts
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- states.tsx
- project_views.ts
- game.ts
- test_support.ts
- feedback.spec.tsx
- design_editor.tsx
- engine_api.ts
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
- ref_types
- quest_flows.spec.ts
- conversation_turn_controller.ts
- File Structure
- notes.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- update_runner.mjs
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- formatMinutes
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- git_rules.spec.ts
- flows.spec.tsx
- Queue-tea
- quest_detail.tsx
- check_layers.mjs
- package.json
- chai-pter.md
- branch_workflow.e2e.ts
- start_api.spec.ts
- ref_node_path
- Roadmap: the outside review, checked against the code
- tea-dd.md
- workspace_store.ts
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- Refusal
- shell.e2e.ts
- Queue-tea: workspace app UI design
- effort_tracker.ts
- Designs tab
- note_workspace.tsx
- Queue-tea in Codex
- Branch workflow completion — 5 November 2026
- projects_api.spec.ts
- release_guard.d.mts
- Tea-concile
- helpers_api.spec.ts
- app.tsx
- Task Log
- Part A: the mod
- release_guard.mjs
- codex_source.ts
- workspace-app.md
- judgements.spec.ts
- Queue-tea, the workspace app
- Notes
- brew_quest.tsx
- detail.spec.tsx
- inspector.tsx
- .line-check-NZS8Gw/tsconfig.json
- ports.ts
- notes.spec.tsx
- ref_node_os
- Scene
- Part 3: setting out and coming back
- presentation/widgets/read_view.tsx
- Shared Types (Task 1 writes them; every task uses them)
- features.test.ts
- GitState
- shell.spec.tsx
- pages.e2e.ts
- first_window.e2e.ts
- guild.e2e.ts
- A task's life
- What Rohan sees
- The record
- Plan: the board, recoverable tasks and checkpoints
- sky_time.ts
- worktrees_repository_impl.ts

## God Nodes (most connected - your core abstractions)
1. `t` - 102 edges
2. `Refusal` - 97 edges
3. `vitest` - 85 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `currentTask()` - 64 edges
7. `preact` - 62 edges
8. `Reply` - 58 edges
9. `EngineApi` - 58 edges
10. `scopeOf()` - 56 edges

## Surprising Connections (you probably didn't know these)
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Behaviour` --references--> `fileQuest()`  [INFERRED]
  docs/design-tab.md → app/main/features/tasks/api/tasks_api.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts

## Import Cycles
- None detected.

## Communities (134 total, 7 thin omitted)

### Community 0 - "notes_api.ts"
Cohesion: 0.12
Nodes (26): changeOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf(), same() (+18 more)

### Community 1 - "vitest"
Cohesion: 0.05
Nodes (43): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+35 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.19
Nodes (20): inGameWords(), edit(), editQuest(), fileQuest(), moveQuest(), removeQuest(), restoreQuest(), sealQuest() (+12 more)

### Community 3 - "update_service.ts"
Cohesion: 0.22
Nodes (9): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, changedBuild(), UpdatePhase, UpdateState (+1 more)

### Community 4 - "task_input.ts"
Cohesion: 0.05
Nodes (56): Drafting a version for the Designs tab, How you work, What you don't do, What you report, criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf() (+48 more)

### Community 5 - "library_page.tsx"
Cohesion: 0.18
Nodes (21): Content(), Answer, Empty(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK (+13 more)

### Community 6 - "preact"
Cohesion: 0.10
Nodes (46): ROUTES, ask(), EngineRead, useEngineRead(), ReadView(), Loading(), Window, BRANCH_POLL_MS (+38 more)

### Community 7 - "notes_view.ts"
Cohesion: 0.15
Nodes (22): body(), write(), captureOf(), folderError(), FolderGroup, foldersOf(), IN_PLAY, linkOptionsOf() (+14 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.09
Nodes (64): Shared resources, Task 11: `tasks`: the task's own cycle, Task 5: The shared resources' data and controllers, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), saveBeforeClear(), once() (+56 more)

### Community 10 - "designs.ts"
Cohesion: 0.10
Nodes (33): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+25 more)

### Community 11 - "App"
Cohesion: 0.12
Nodes (17): App(), moodOf(), open(), useHour(), open(), open(), open(), open() (+9 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.08
Nodes (50): HOLD_FILES_SHOWN, Spinner(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT (+42 more)

### Community 13 - "t"
Cohesion: 0.11
Nodes (28): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+20 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.08
Nodes (38): drawCup(), drawQuestion(), MOOD_COLOR, MOOD_WORD, renderBand(), stillCup(), getView(), DIFFICULTIES (+30 more)

### Community 16 - "scope.ts"
Cohesion: 0.09
Nodes (58): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readCodexSession(), Observation, readChronicle() (+50 more)

### Community 17 - "git_source.ts"
Cohesion: 0.34
Nodes (15): Task 8: The task flow, commitsBetween(), git(), lastCommit(), listBranches(), makeBranch(), plural(), readDrift() (+7 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (58): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+50 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.20
Nodes (16): addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion(), nextVersion() (+8 more)

### Community 20 - "branch_api.ts"
Cohesion: 0.08
Nodes (84): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), prepareMerge(), readBranch(), readBranches() (+76 more)

### Community 21 - "fakeEngine"
Cohesion: 0.15
Nodes (18): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+10 more)

### Community 22 - "families.ts"
Cohesion: 0.14
Nodes (31): readChoices(), 4.2 Tasks, with a feature in the detail pane, 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), TypedVerdict, FeatureFound, MoveResult (+23 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (23): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+15 more)

### Community 25 - "fixes.test.ts"
Cohesion: 0.09
Nodes (39): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, One engine, two hosts, Ask, closeBand(), showBand() (+31 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.12
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.14
Nodes (18): Already built, 4.1 Home, CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), checkpointPrompt(), commandRun(), count() (+10 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (36): ASKED, HELPER_LINES, projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost(), Run (+28 more)

### Community 29 - "states.tsx"
Cohesion: 0.11
Nodes (30): ALL, hrefOf(), Route, routeOf(), useRoute(), GROWS_AT, isStreakAtRisk(), laterHook() (+22 more)

### Community 30 - "project_views.ts"
Cohesion: 0.11
Nodes (40): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+32 more)

### Community 31 - "game.ts"
Cohesion: 0.19
Nodes (21): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+13 more)

### Community 32 - "test_support.ts"
Cohesion: 0.14
Nodes (18): chronicle(), mana(), questAheadOf(), game(), QUEST, CHRONICLE, DESIGNS, GAME (+10 more)

### Community 33 - "feedback.spec.tsx"
Cohesion: 0.10
Nodes (12): ACCOUNTS, BOARD, input(), open(), FAILED, NEW_FOLDER, open(), empty() (+4 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.13
Nodes (40): Box, clamp(), copyWithIds(), duplicateLayer(), Handle, handlesOf(), layerOf(), mapLayers() (+32 more)

### Community 35 - "engine_api.ts"
Cohesion: 0.06
Nodes (49): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+41 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Options, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.13
Nodes (31): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+23 more)

### Community 39 - "makeTask"
Cohesion: 0.05
Nodes (40): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+32 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.17
Nodes (33): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+25 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.11
Nodes (28): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+20 more)

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
Cohesion: 0.10
Nodes (28): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+20 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.16
Nodes (32): The eight items, Task 10: `tasks`: the queue side, KEYS, findFeatureUseCase(), fileFromCommand(), parentFor(), blockTask(), featureCommand() (+24 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.ts"
Cohesion: 0.19
Nodes (11): codexEvents, commandOf(), parse(), Row, textOf(), ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, finishActivity() (+3 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf()

### Community 53 - "ref_types"
Cohesion: 0.09
Nodes (40): codexOperations(), CodexRefusal, readable(), Task 10: The panel, the band, the status line and the commands, Ctx, Env, Block, withBlock() (+32 more)

### Community 54 - "quest_flows.spec.ts"
Cohesion: 0.13
Nodes (12): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+4 more)

### Community 55 - "conversation_turn_controller.ts"
Cohesion: 0.35
Nodes (8): Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd(), conversationState, markFreshPending()

### Community 56 - "File Structure"
Cohesion: 0.19
Nodes (15): File Structure, Global Constraints, Queue-tea Implementation Plan, Review Focus, SwitchResult, switchToTaskUseCase(), diffSince(), branchSlug() (+7 more)

### Community 57 - "notes.ts"
Cohesion: 0.27
Nodes (15): backlinksOf(), firstParagraphOf(), freeTitle(), isNoteId(), isTitleTaken(), LinkPart, linksOf(), noteTitled() (+7 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (17): HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader() (+9 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "update_runner.mjs"
Cohesion: 0.25
Nodes (14): UPDATE_TEXT, Deps, setup(), updateService(), ACTIVE, exec, git(), publishedSource() (+6 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.07
Nodes (83): live(), 5. Features, shared resources and the core, Features, The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing (+75 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 65 - "formatMinutes"
Cohesion: 0.08
Nodes (50): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft() (+42 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "git_rules.spec.ts"
Cohesion: 0.21
Nodes (10): OutputSink, ProcessRequest, running, stopProcesses(), streamProcess(), argvOf(), nodeUserGit(), UserGit (+2 more)

### Community 70 - "flows.spec.tsx"
Cohesion: 0.14
Nodes (12): BOARD, held(), hold(), MAIN, OTHER, SEALED, withActive(), activeQuest() (+4 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.10
Nodes (43): SheetView(), Dialog(), Field(), FieldProps, Group(), Pick(), Failed(), NextVersionSheet() (+35 more)

### Community 73 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 74 - "package.json"
Cohesion: 0.11
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.14
Nodes (21): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+13 more)

### Community 77 - "start_api.spec.ts"
Cohesion: 0.10
Nodes (18): AT, git(), NOW, run, seed(), log, step(), Task 1: the file seam (+10 more)

### Community 78 - "ref_node_path"
Cohesion: 0.09
Nodes (31): log, main(), loadCodexContext(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions() (+23 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "workspace_store.ts"
Cohesion: 0.05
Nodes (84): HOME_BADGES, HOME_BOARD_ROWS, Dragon(), GoldReward(), PriorityTag(), XpReward(), Board(), Glory() (+76 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 89 - "record_source.ts"
Cohesion: 0.11
Nodes (30): p, AS_OF_27_OCT, badge(), NOW, record(), canRestoreFrom(), onDisk(), Task 1: The helper list and the record field (+22 more)

### Community 90 - "Refusal"
Cohesion: 0.14
Nodes (40): Refusal, openMergeFolder(), activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+32 more)

### Community 91 - "shell.e2e.ts"
Cohesion: 0.14
Nodes (5): APP, errors, noteFiles(), notesDir(), APP

### Community 92 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 93 - "effort_tracker.ts"
Cohesion: 0.26
Nodes (11): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+3 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "note_workspace.tsx"
Cohesion: 0.16
Nodes (23): brewLineOf(), isInPlay(), linkLineOf(), localDay(), questLineOf(), whenOf(), caretPoint(), changeOf() (+15 more)

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

### Community 101 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 102 - "app.tsx"
Cohesion: 0.05
Nodes (64): ContentProps, MORE_PAGES, SheetProps, TABS, KNOWN, NEW, TWO, AUTOSAVE_MS (+56 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Part A: the mod"
Cohesion: 0.13
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 105 - "release_guard.mjs"
Cohesion: 0.23
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 106 - "codex_source.ts"
Cohesion: 0.18
Nodes (5): CodexObservation, cache, catalog, Session, counts

### Community 108 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "Notes"
Cohesion: 0.14
Nodes (13): Acceptance checks, Answered, Architecture, Behaviour, Decisions, Fields and their checks, Keys and focus, Not in Notes 1 (+5 more)

### Community 111 - "brew_quest.tsx"
Cohesion: 0.16
Nodes (16): lineOf(), tickedItemsOf(), BrewQuestCard(), BrewSheet(), DIFFICULTIES, Errors, parentError(), PRIORITIES (+8 more)

### Community 112 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 113 - "inspector.tsx"
Cohesion: 0.27
Nodes (8): numberError(), DESIGN_FRAME, Inspector(), InspectorProps, number(), Small(), WEIGHTS, LIMITS

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "ports.ts"
Cohesion: 0.13
Nodes (21): After this plan, Feature-first restructure Implementation Plan, Global Constraints, MenuSpec, Ports, SessionUsage, finishBackgroundActivity(), beginActivity() (+13 more)

### Community 116 - "notes.spec.tsx"
Cohesion: 0.14
Nodes (9): BOARD, FIRST, open(), SAGA, SECOND, memoryNotes(), ok(), note() (+1 more)

### Community 117 - "ref_node_os"
Cohesion: 0.06
Nodes (26): APP, change(), git(), onDisk(), run, stored(), fileOf(), NOW (+18 more)

### Community 118 - "Scene"
Cohesion: 0.33
Nodes (6): commit(), History, historyOf(), redo(), undo(), Scene

### Community 119 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 120 - "presentation/widgets/read_view.tsx"
Cohesion: 0.24
Nodes (7): QuestLine, markdown, Props, line(), linkPartsOf(), Note, marked

### Community 121 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.15
Nodes (16): Edit, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check, Part 2: edits (+8 more)

### Community 122 - "features.test.ts"
Cohesion: 0.46
Nodes (7): What each screen reads from existing data, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote()

### Community 123 - "GitState"
Cohesion: 0.39
Nodes (5): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, fakeGit()

### Community 124 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), open(), palette(), SECOND

### Community 125 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 126 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 127 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 128 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 129 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 130 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 131 - "Plan: the board, recoverable tasks and checkpoints"
Cohesion: 0.50
Nodes (4): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints

### Community 132 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 944 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `update_service.ts`, `sky_time.ts`, `library_page.tsx`, `preact`, `notes_view.ts`, `designs.ts`, `App`, `first_run.tsx`, `t`, `branch_api.ts`, `fakeEngine`, `palette.ts`, `test_support.ts`, `feedback.spec.tsx`, `design_editor.tsx`, `designs_api.ts`, `makeTask`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `designs.spec.tsx`, `quest_flows.spec.ts`, `notes.ts`, `host.ts`, `update_runner.mjs`, `app_menu.ts`, `formatMinutes`, `git_rules.spec.ts`, `flows.spec.tsx`, `package.json`, `start_api.spec.ts`, `ref_node_path`, `workspace_store.ts`, `designs_api.spec.ts`, `record_source.ts`, `projects_api.spec.ts`, `helpers_api.spec.ts`, `app.tsx`, `release_guard.mjs`, `codex_source.ts`, `judgements.spec.ts`, `detail.spec.tsx`, `notes.spec.tsx`, `ref_node_os`, `Scene`, `presentation/widgets/read_view.tsx`, `GitState`, `shell.spec.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `notes_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `makeTask` to `vitest`, `cup_mood.ts`, `scope.ts`, `branch_api.ts`, `families.ts`, `fixes.test.ts`, `tests/helpers.ts`, `ui.test.tsx`, `4. Screens`, `queue_controller.ts`, `ref_types`, `branch_workflow.e2e.ts`, `start_api.spec.ts`, `ref_node_path`, `designs_api.spec.ts`, `record_source.ts`, `effort_tracker.ts`, `projects_api.spec.ts`, `helpers_api.spec.ts`, `judgements.spec.ts`, `ref_node_os`, `Shared Types (Task 1 writes them; every task uses them)`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.05365296803652968 - nodes in this community are weakly interconnected._
- **Why does `Queue-tea: workspace app UI design` connect `Queue-tea: workspace app UI design` to `4. Screens`, `record_source.ts`, `workspace-app.md`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._