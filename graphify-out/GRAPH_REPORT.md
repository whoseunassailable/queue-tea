# Graph Report - notes-version-history  (2026-11-07)

## Corpus Check
- 541 files · ~499,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3401 nodes · 12398 edges · 125 communities (120 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 682 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ab1b3b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- core/logger.ts
- tasks_api.ts
- update_service.ts
- file_task.ts
- pages.e2e.ts
- designs_page.tsx
- ref_types
- realms_api.ts
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
- App
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
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
- flows.spec.tsx
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
- useWindowKeys
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- settings_page.tsx
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- chronicle_page.tsx
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- checks_api.ts
- commit_api.ts
- Queue-tea
- quest_detail.tsx
- notes.spec.tsx
- package.json
- chai-pter.md
- branch_workflow.e2e.ts
- emptyRecord
- definitions.ts
- Audit: what the menu exposes of the engine
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
- Queue-tea: workspace app
- Architecture
- Designs tab
- operations.ts
- update_runner.mjs
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- main
- Notes
- start_api.ts
- Task Log
- start_task.ts
- start
- bundle.ts
- workspace-app.md
- Guild helpers on tasks
- Queue-tea, the workspace app
- ref_node_path
- Scene
- Part 3: setting out and coming back
- game.spec.ts
- .line-check-NZS8Gw/tsconfig.json
- Review Focus
- What Rohan sees
- vitest
- Part 2: edits
- user_git.ts
- The record
- mocha-mockup.md
- victory.ts
- Roadmap: the outside review, checked against the code
- flavor.ts

## God Nodes (most connected - your core abstractions)
1. `t` - 103 edges
2. `Refusal` - 97 edges
3. `vitest` - 86 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `currentTask()` - 64 edges
7. `preact` - 63 edges
8. `EngineApi` - 59 edges
9. `Reply` - 58 edges
10. `scopeOf()` - 56 edges

## Surprising Connections (you probably didn't know these)
- `Version history` --references--> `NoteVersion`  [INFERRED]
  docs/notes.md → app/shared/notes.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `2. Rules` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts

## Import Cycles
- None detected.

## Communities (125 total, 5 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.08
Nodes (57): brewLineOf(), captureOf(), folderError(), FolderGroup, foldersOf(), IN_PLAY, isInPlay(), lineOf() (+49 more)

### Community 1 - "core/logger.ts"
Cohesion: 0.05
Nodes (44): createLogger(), Logger, stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+36 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.12
Nodes (52): inGameWords(), Refusal, reply(), requestOf(), activeTask(), goBack(), lastNoteAt(), putBackNow() (+44 more)

### Community 3 - "update_service.ts"
Cohesion: 0.14
Nodes (13): UPDATE_TEXT, Deps, majorOf(), setup(), updateWatch(), WatchDeps, setup(), AppIdentity (+5 more)

### Community 4 - "file_task.ts"
Cohesion: 0.21
Nodes (17): questOfNext(), NewQuest, QuestEdit, Task 1: the engine's three additions, Task 2: Filing and editing carry the choice, How the choice reaches the record, edited(), editTaskUseCase() (+9 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "designs_page.tsx"
Cohesion: 0.09
Nodes (51): Content(), Answer, ask(), EngineRead, useEngineRead(), ReadView(), Empty(), Failed() (+43 more)

### Community 7 - "ref_types"
Cohesion: 0.06
Nodes (68): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, Ctx, Env, MenuSpec, Ports, SessionUsage (+60 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.09
Nodes (34): projectsFolder(), canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn() (+26 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.06
Nodes (60): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), once() (+52 more)

### Community 10 - "designs.ts"
Cohesion: 0.11
Nodes (26): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+18 more)

### Community 11 - "check_prompt.ts"
Cohesion: 0.11
Nodes (33): Order to fix them, Task 9: `conversation` and `message_check`, File Structure, Ask, closeBand(), showBand(), checkMessage(), checkRepositoryImpl() (+25 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.11
Nodes (35): HOLD_FILES_SHOWN, accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+27 more)

### Community 13 - "t"
Cohesion: 0.08
Nodes (39): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+31 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.09
Nodes (27): Problems not on the list, Task 10: The panel, the band, the status line and the commands, AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, CupFacts (+19 more)

### Community 16 - "scope.ts"
Cohesion: 0.08
Nodes (49): GAME_WORDS, MESSAGES, cache, catalog, readCodexSession(), Session, Observation, observeTask() (+41 more)

### Community 17 - "git_source.ts"
Cohesion: 0.25
Nodes (20): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+12 more)

### Community 18 - "main.ts"
Cohesion: 0.06
Nodes (41): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+33 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.09
Nodes (31): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+23 more)

### Community 20 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 21 - "App"
Cohesion: 0.04
Nodes (42): App(), moodOf(), useHour(), BOARD, FIRST, open(), SAGA, SECOND (+34 more)

### Community 22 - "families.ts"
Cohesion: 0.19
Nodes (29): readChoices(), 4.5 New task, and Add child task inline, What each screen reads from existing data, checkTypedMessage(), TypedVerdict, MoveResult, moveTaskUseCase(), activeFeature() (+21 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (22): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+14 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.08
Nodes (51): changeOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf(), same() (+43 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.11
Nodes (24): Task 3: Reading git and making branches, 4.1 Home, 4.4 A task's detail: current, queued and done, CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote, HandoffSection, handoffSections() (+16 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.09
Nodes (28): unixFiles(), projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost(), Run, current() (+20 more)

### Community 29 - "states.tsx"
Cohesion: 0.11
Nodes (33): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), GROWS_AT, Spinner() (+25 more)

### Community 30 - "project_views.ts"
Cohesion: 0.12
Nodes (34): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+26 more)

### Community 31 - "game.ts"
Cohesion: 0.28
Nodes (14): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+6 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.23
Nodes (28): abandonMerge(), BranchDeps, completeMerge(), openMergeFolder(), prepareMerge(), readBranches(), readMergeWorkspace(), resolveMergeFile() (+20 more)

### Community 33 - "test_support.ts"
Cohesion: 0.06
Nodes (42): open(), click(), one, open(), openReview(), two, view, ACCOUNTS (+34 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (42): Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf() (+34 more)

### Community 35 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (17): STAGE_SCALE, Coins(), EggArt(), Sky(), StageArt(), FIRST_LEVEL, STAGES, stageState() (+9 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.11
Nodes (29): Read, Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+21 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.12
Nodes (34): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+26 more)

### Community 39 - "flows.spec.tsx"
Cohesion: 0.11
Nodes (19): BOARD, held(), hold(), MAIN, OTHER, SEALED, withActive(), ACTIVE (+11 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.13
Nodes (40): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+32 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.07
Nodes (40): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+32 more)

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
Nodes (26): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+18 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.12
Nodes (42): The eight items, Task 10: `tasks`: the queue side, removeTaskUseCase(), setPriorityUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand(), parentFor() (+34 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.ts"
Cohesion: 0.18
Nodes (12): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), ACTIVITY_TEXT_LIMIT, finishActivity() (+4 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.12
Nodes (14): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), DESIGN_FORMAT, DesignRead (+6 more)

### Community 53 - "time.ts"
Cohesion: 0.19
Nodes (18): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+10 more)

### Community 54 - "app.tsx"
Cohesion: 0.06
Nodes (45): ContentProps, MORE_PAGES, SheetProps, TABS, AUTOSAVE_MS, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX (+37 more)

### Community 55 - "useWindowKeys"
Cohesion: 0.16
Nodes (18): useWindowKeys(), badgeOf(), Props, Row(), VersionRail(), isFromMenu(), isLetterKey(), isOnControl() (+10 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.06
Nodes (50): ACTIVITY_REFRESH_MS, DEFAULT_LOG_PATH, LINES_REFRESH_MS, XP_BY_DIFFICULTY, dayAndTime(), MEDALS, withoutReview(), askingLine() (+42 more)

### Community 58 - "host.ts"
Cohesion: 0.18
Nodes (19): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+11 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "settings_page.tsx"
Cohesion: 0.19
Nodes (16): logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps (+8 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.08
Nodes (78): live(), 5. Features, shared resources and the core, Features, The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, drawCup() (+70 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.12
Nodes (35): clockTime(), dayName(), dayOf(), manaLeft(), refillTime(), NOW, weekdayIndex(), weekdayOf() (+27 more)

### Community 66 - "view_store.ts"
Cohesion: 0.06
Nodes (36): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+28 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "checks_api.ts"
Cohesion: 0.10
Nodes (28): streamProcess(), dependencies(), executing, runMergeChecks(), CheckDefinition, checksFile(), checksPassed(), discoverChecks() (+20 more)

### Community 70 - "commit_api.ts"
Cohesion: 0.20
Nodes (16): freshReview(), messageOf(), readBranch(), taskOf(), commitBranchFiles(), readCommitProgress(), writeReceipt(), inFlight (+8 more)

### Community 71 - "Queue-tea"
Cohesion: 0.12
Nodes (15): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification, Commands (+7 more)

### Community 72 - "quest_detail.tsx"
Cohesion: 0.09
Nodes (45): SheetView(), Dialog(), Field(), FieldProps, Group(), Pick(), NextForm, NextVersionSheet() (+37 more)

### Community 73 - "notes.spec.tsx"
Cohesion: 0.12
Nodes (14): ACTIVE, BOARD, FIRST, HELD, open(), body(), memoryNotes(), ok() (+6 more)

### Community 74 - "package.json"
Cohesion: 0.11
Nodes (16): author, description, license, main, name, private, productName, version (+8 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.33
Nodes (9): check(), commitSelected(), dialog(), merge(), mergeButton(), openReview(), prepare(), Acceptance criteria (+1 more)

### Community 77 - "emptyRecord"
Cohesion: 0.06
Nodes (27): record(), NOW, record(), won(), NOW, record(), seed(), data() (+19 more)

### Community 78 - "definitions.ts"
Cohesion: 0.24
Nodes (14): codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill(), skills, workflows (+6 more)

### Community 79 - "Audit: what the menu exposes of the engine"
Cohesion: 0.25
Nodes (5): Audit: what the menu exposes of the engine, 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (80): isClaudeOut(), Dragon(), GoldReward(), PriorityTag(), XpReward(), useWindowWidth(), Board(), Glory() (+72 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (17): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+9 more)

### Community 89 - "record_source.ts"
Cohesion: 0.09
Nodes (40): p, log, loadCodexContext(), canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord() (+32 more)

### Community 90 - "branch_source.ts"
Cohesion: 0.21
Nodes (16): digest(), gitIn(), graphOf(), headsOf(), pendingGit(), reviewOf(), workingSnapshot(), parseLog() (+8 more)

### Community 91 - "inspector.tsx"
Cohesion: 0.29
Nodes (6): numberError(), InspectorProps, number(), Small(), WEIGHTS, LIMITS

### Community 92 - "Queue-tea: workspace app"
Cohesion: 0.22
Nodes (9): Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app, Testing (+1 more)

### Community 93 - "Architecture"
Cohesion: 0.17
Nodes (12): Architecture, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The Designs tab (+4 more)

### Community 94 - "Designs tab"
Cohesion: 0.18
Nodes (11): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+3 more)

### Community 95 - "operations.ts"
Cohesion: 0.25
Nodes (11): CODEX_LIMITS, CODEX_TEXT, CodexContext, codexOperations(), CodexRefusal, readable(), QUEUE_TEA_COMMANDS, errandReply() (+3 more)

### Community 96 - "update_runner.mjs"
Cohesion: 0.32
Nodes (12): setup(), updateService(), ACTIVE, exec, git(), publishedSource(), queuePublished(), readJson() (+4 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "main"
Cohesion: 0.08
Nodes (23): main(), createCodexServer(), Forms, Repository Rules, Visual artifacts, Writing code, A task's life, Codex in place of Claude Code (+15 more)

### Community 101 - "Notes"
Cohesion: 0.13
Nodes (14): Acceptance checks, Answered, Architecture, Behaviour, Decisions, Fields and their checks, Keys and focus, Not in Notes 1 (+6 more)

### Community 102 - "start_api.ts"
Cohesion: 0.23
Nodes (17): isSessionOpen(), checkStart(), continueIn(), goneSentence(), handOver(), holdOf(), isClaudeWorking(), needFolder() (+9 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "start_task.ts"
Cohesion: 0.34
Nodes (11): ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase(), keepActivity(), blockedText(), branchSlug(), count() (+3 more)

### Community 105 - "start"
Cohesion: 0.24
Nodes (10): hasChanged(), Stamps, stampsOf(), watchFolders(), WatchOptions, checkJudgements, checkUpdate, sendMenu() (+2 more)

### Community 106 - "bundle.ts"
Cohesion: 0.22
Nodes (10): commitOfProvenance(), isNumber(), relaunchArgv(), Restored, restoredOf(), versionOfPlist(), installedBuild(), restart() (+2 more)

### Community 107 - "workspace-app.md"
Cohesion: 0.22
Nodes (3): Global Constraints, Parallel quests: implementation decisions, Queue-tea Implementation Plan

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.15
Nodes (12): Task 1: The helper list and the record field, Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done" (+4 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_path"
Cohesion: 0.23
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 111 - "Scene"
Cohesion: 0.33
Nodes (6): commit(), History, historyOf(), redo(), undo(), Scene

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "game.spec.ts"
Cohesion: 0.25
Nodes (6): AS_OF_27_OCT, badge(), NOW, record(), game(), Data

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "Review Focus"
Cohesion: 0.25
Nodes (7): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet

### Community 116 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 117 - "vitest"
Cohesion: 0.03
Nodes (64): git(), record(), run, start(), Account, plantGh(), statusOf(), APP (+56 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.29
Nodes (7): Edit, Part 2: edits, Review focus, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "user_git.ts"
Cohesion: 0.40
Nodes (5): OutputSink, argvOf(), nodeUserGit(), UserGit, UserGitAction

### Community 120 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 121 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 122 - "victory.ts"
Cohesion: 0.70
Nodes (4): isSagaWon(), kindOf(), newBadges(), victoryOf()

### Community 123 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

### Community 124 - "flavor.ts"
Cohesion: 0.50
Nodes (3): appIdOf(), Flavor, flavorOf()

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 945 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `core/logger.ts`, `update_service.ts`, `designs_page.tsx`, `realms_api.ts`, `designs.ts`, `first_run.tsx`, `t`, `scope.ts`, `judgements.spec.ts`, `App`, `palette.ts`, `notes_api.ts`, `states.tsx`, `branch_api.ts`, `test_support.ts`, `design_editor.tsx`, `designs_api.ts`, `flows.spec.tsx`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `designs.spec.tsx`, `app.tsx`, `engine_api.ts`, `host.ts`, `app_menu.ts`, `chronicle_page.tsx`, `checks_api.ts`, `quest_detail.tsx`, `notes.spec.tsx`, `package.json`, `emptyRecord`, `definitions.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `branch_source.ts`, `update_runner.mjs`, `start_api.ts`, `ref_node_path`, `Scene`, `game.spec.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08141321044546851 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `core/logger.ts`, `ref_types`, `realms_api.ts`, `tasks_controller.ts`, `check_prompt.ts`, `cup_mood.ts`, `scope.ts`, `judgements.spec.ts`, `families.ts`, `tests/helpers.ts`, `branch_api.ts`, `ui.test.tsx`, `Task 3: Entities and pure rules`, `4. Screens`, `time.ts`, `designs_api.spec.ts`, `record_source.ts`, `game.spec.ts`, `vitest`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `core/logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04903846153846154 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._