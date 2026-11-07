# Graph Report - queue-tea-notes-release  (2026-11-07)

## Corpus Check
- 552 files · ~515,433 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3479 nodes · 12751 edges · 116 communities (110 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 682 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ab54f87`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- vitest
- tasks_api.ts
- update_service.ts
- tasks_api.ts
- pages.e2e.ts
- designs_page.tsx
- time.ts
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
- emptyRecord
- notes_view.ts
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
- github_api.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- activity.ts
- designs.spec.tsx
- time.ts
- app.tsx
- notes_page.tsx
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- settings_page.tsx
- Queue-tea: panel redesign
- band_host.tsx
- settings_api.ts
- chronicle_page.tsx
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- helpers_api.spec.ts
- session_beat.ts
- app/README.md
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
- operations.ts
- core/logger.ts
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Tea-concile
- Notes
- GitState
- Task Log
- main.tsx
- worktrees_repository_impl.ts
- Part B: the app
- Guild helpers on tasks
- Queue-tea, the workspace app
- ref_node_path
- Part 3: setting out and coming back
- .line-check-NZS8Gw/tsconfig.json
- session_rhythm.ts
- ref_node_fs
- Part 2: edits
- mocha-mockup.md

## God Nodes (most connected - your core abstractions)
1. `t` - 109 edges
2. `Refusal` - 101 edges
3. `vitest` - 90 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `preact` - 65 edges
7. `EngineApi` - 65 edges
8. `currentTask()` - 64 edges
9. `Reply` - 61 edges
10. `scopeOf()` - 56 edges

## Surprising Connections (you probably didn't know these)
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts

## Import Cycles
- None detected.

## Communities (116 total, 6 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.11
Nodes (33): brewLineOf(), isInPlay(), lineOf(), localDay(), questLineOf(), tickedItemsOf(), whenOf(), BrewQuestCard() (+25 more)

### Community 1 - "vitest"
Cohesion: 0.05
Nodes (33): attempt(), failed(), isForbiddenGit(), nodeHost(), host, log, DUNE, NOW (+25 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.12
Nodes (46): COPY_LIMIT, inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest() (+38 more)

### Community 3 - "update_service.ts"
Cohesion: 0.22
Nodes (8): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, UpdatePhase, UpdateState, PublishedRequest

### Community 4 - "tasks_api.ts"
Cohesion: 0.10
Nodes (39): editQuest(), setPriority(), togglePlayNext(), criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf(), helpersOf() (+31 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "designs_page.tsx"
Cohesion: 0.07
Nodes (64): Answer, ask(), EngineRead, useEngineRead(), THUMB_BOX, ReadView(), Loading(), useWindowWidth() (+56 more)

### Community 7 - "time.ts"
Cohesion: 0.07
Nodes (47): ctx, One engine, two hosts, Ctx, Env, Block, logFileIn(), withBlock(), BlockResult (+39 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.09
Nodes (32): projectsFolder(), canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn() (+24 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (80): Features, Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, beat() (+72 more)

### Community 10 - "designs.ts"
Cohesion: 0.11
Nodes (29): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+21 more)

### Community 11 - "check_prompt.ts"
Cohesion: 0.19
Nodes (14): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+6 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.13
Nodes (31): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+23 more)

### Community 13 - "t"
Cohesion: 0.11
Nodes (22): fileNamed(), FILES, frontmatter(), Helper, helperOf(), HELPERS, KINDS, LOGOS (+14 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 16 - "scope.ts"
Cohesion: 0.13
Nodes (41): GAME_WORDS, MESSAGES, reply(), cancelMergeChecks(), Observation, readChronicle(), GameDeps, readGame() (+33 more)

### Community 17 - "git_source.ts"
Cohesion: 0.20
Nodes (27): File Structure, Task 8: The task flow, What each screen reads from existing data, Options, commitsBetween(), diffSince(), git(), lastCommit() (+19 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (59): BUSY_PROBE, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE, SETTINGS_FILE (+51 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (26): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+18 more)

### Community 20 - "emptyRecord"
Cohesion: 0.05
Nodes (37): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+29 more)

### Community 21 - "notes_view.ts"
Cohesion: 0.13
Nodes (27): folderError(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY, isUntitled(), linkOptionsOf(), linkPicksOf() (+19 more)

### Community 22 - "families.ts"
Cohesion: 0.17
Nodes (30): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult, moveTaskUseCase() (+22 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.15
Nodes (25): actions(), allQuests(), canRun(), creates(), entry(), filterPalette(), GO_TO, isStatus() (+17 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.12
Nodes (29): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf() (+21 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.12
Nodes (16): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+8 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.13
Nodes (22): 4.4 A task's detail: current, queued and done, CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote, HandoffSection, handoffSections(), isHeading(), checkLines() (+14 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.07
Nodes (38): Global Constraints, projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost(), Run, current() (+30 more)

### Community 29 - "states.tsx"
Cohesion: 0.09
Nodes (36): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), GROWS_AT, UPDATE_POLL_MS (+28 more)

### Community 30 - "project_views.ts"
Cohesion: 0.12
Nodes (35): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+27 more)

### Community 31 - "game.ts"
Cohesion: 0.14
Nodes (23): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+15 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (77): streamProcess(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+69 more)

### Community 33 - "test_support.ts"
Cohesion: 0.03
Nodes (109): App(), open(), BOARD, FIRST, open(), SAGA, SECOND, click() (+101 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (40): commit(), History, historyOf(), redo(), undo(), Box, clamp(), copyWithIds() (+32 more)

### Community 35 - "mana.ts"
Cohesion: 0.18
Nodes (21): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+13 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.11
Nodes (30): Read, Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+22 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.12
Nodes (34): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+26 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.15
Nodes (21): filePathOf(), formatOf(), noteFiles(), AttachmentInput(), bytesOf(), tokenizer(), attachmentError(), attachmentMarkdown() (+13 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.16
Nodes (32): Task 7: Split the menu and the band in place, Task 10: The panel, the band, the status line and the commands, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+24 more)

### Community 41 - "sessions.test.ts"
Cohesion: 0.16
Nodes (17): NOW, record(), Part A: the mod, Task 2: the new record fields, Task 3: session files, Task 4: `review`, Task 5: requests, Task 6: Open in Queue-tea app (+9 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.11
Nodes (30): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+22 more)

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
Cohesion: 0.10
Nodes (20): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+12 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.17
Nodes (32): The eight items, Task 10: `tasks`: the queue side, unblockTaskUseCase(), fileFromCommand(), parentFor(), blockTask(), featureCommand(), moveTask() (+24 more)

### Community 50 - "library_api.ts"
Cohesion: 0.20
Nodes (20): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+12 more)

### Community 51 - "activity.ts"
Cohesion: 0.13
Nodes (18): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), AT, COMMIT_ACTIVITY_LIMIT (+10 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.17
Nodes (8): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), VersionView

### Community 53 - "time.ts"
Cohesion: 0.26
Nodes (11): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+3 more)

### Community 54 - "app.tsx"
Cohesion: 0.04
Nodes (67): ContentProps, moodOf(), MORE_PAGES, SheetProps, SheetView(), TABS, useHour(), AUTOSAVE_MS (+59 more)

### Community 55 - "notes_page.tsx"
Cohesion: 0.08
Nodes (41): Content(), Dialog(), Empty(), useWindowKeys(), captureOf(), DeleteNote(), keyOf(), layoutOf() (+33 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.05
Nodes (52): STAGE_SCALE, dayOf(), Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL (+44 more)

### Community 58 - "host.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps (+9 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "band_host.tsx"
Cohesion: 0.08
Nodes (56): 5. Features, shared resources and the core, The core and the app, Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files (+48 more)

### Community 64 - "settings_api.ts"
Cohesion: 0.22
Nodes (14): cleanSettings(), DEFAULT_SETTINGS, isFolds(), isLastProject(), isRealmAccounts(), isScope(), isSky(), isTerminal() (+6 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.12
Nodes (32): clockTime(), dayName(), manaLeft(), weekdayIndex(), weekdayOf(), BAR_PX, Column(), dayTotal() (+24 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.23
Nodes (12): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+4 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 70 - "session_beat.ts"
Cohesion: 0.42
Nodes (6): clearCrashed(), endBeat(), writeBeat(), readCup(), SessionsRepository, sessionsRepositoryOf()

### Community 71 - "app/README.md"
Cohesion: 0.15
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.09
Nodes (42): Field(), FieldProps, Group(), Pick(), Failed(), BookErrors, BookField, BookForm (+34 more)

### Community 73 - "notes.ts"
Cohesion: 0.15
Nodes (20): NOW, versionsToKeep(), body(), write(), linkLineOf(), backlinksOf(), firstParagraphOf(), isNoteId() (+12 more)

### Community 74 - "package.json"
Cohesion: 0.14
Nodes (13): author, description, license, main, name, private, productName, version (+5 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 77 - "start_api.spec.ts"
Cohesion: 0.09
Nodes (22): loadCodexContext(), CodexContext, git(), NOW, onDisk(), run, seed(), Task 1: the file seam (+14 more)

### Community 78 - "server.ts"
Cohesion: 0.11
Nodes (28): log, main(), codexArgs(), NASTY, run, codexSkills(), companionSkills(), files (+20 more)

### Community 79 - "spec.md"
Cohesion: 0.14
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.04
Nodes (104): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), isClaudeOut(), refillTime(), NOW, Dragon(), Spinner() (+96 more)

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
Cohesion: 0.10
Nodes (37): p, Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup() (+29 more)

### Community 90 - "branch_source.ts"
Cohesion: 0.28
Nodes (14): digest(), gitIn(), graphOf(), headsOf(), pendingGit(), reviewOf(), workingSnapshot(), observeTask() (+6 more)

### Community 91 - "inspector.tsx"
Cohesion: 0.23
Nodes (13): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+5 more)

### Community 92 - "branch_workflow.e2e.ts"
Cohesion: 0.14
Nodes (21): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+13 more)

### Community 93 - "Architecture"
Cohesion: 0.15
Nodes (13): Architecture, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The Designs tab (+5 more)

### Community 94 - "Designs tab"
Cohesion: 0.15
Nodes (12): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+4 more)

### Community 95 - "operations.ts"
Cohesion: 0.16
Nodes (23): codexOperations(), CodexRefusal, readable(), live(), Task 6: `commit_guard` and `errands`, runErrand(), Errand, ERRAND_NOT_SENT (+15 more)

### Community 96 - "core/logger.ts"
Cohesion: 0.08
Nodes (36): createLogger(), Logger, stackOf(), OutputSink, ProcessRequest, running, log, stopProcesses() (+28 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "Notes"
Cohesion: 0.11
Nodes (17): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Decisions, Fields and their checks (+9 more)

### Community 102 - "GitState"
Cohesion: 0.39
Nodes (5): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, fakeGit()

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 107 - "Part B: the app"
Cohesion: 0.20
Nodes (9): Global constraints, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 7: the project, Task 9: the game rules (+1 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", What's saved (+2 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_path"
Cohesion: 0.23
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "session_rhythm.ts"
Cohesion: 0.09
Nodes (48): Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, How Claude uses them (the mod), pressRestore() (+40 more)

### Community 117 - "ref_node_fs"
Cohesion: 0.04
Nodes (39): APP, FIRST, record(), recordFile(), replaceRecord(), APP, event(), plantClaude() (+31 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 121 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 959 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `update_service.ts`, `designs_page.tsx`, `time.ts`, `realms_api.ts`, `designs.ts`, `first_run.tsx`, `t`, `emptyRecord`, `notes_view.ts`, `states.tsx`, `game.ts`, `branch_api.ts`, `test_support.ts`, `design_editor.tsx`, `designs_api.ts`, `note_attachments.ts`, `sessions.test.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `activity.ts`, `designs.spec.tsx`, `app.tsx`, `notes_page.tsx`, `engine_api.ts`, `host.ts`, `helpers_api.spec.ts`, `quest_detail.tsx`, `notes.ts`, `package.json`, `start_api.spec.ts`, `server.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `record_source.ts`, `branch_source.ts`, `core/logger.ts`, `GitState`, `ref_node_path`, `ref_node_fs`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1126984126984127 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `vitest`, `time.ts`, `realms_api.ts`, `cup_mood.ts`, `families.ts`, `tests/helpers.ts`, `game.ts`, `branch_api.ts`, `ui.test.tsx`, `Task 3: Entities and pure rules`, `menu_frame.tsx`, `sessions.test.ts`, `4. Screens`, `time.ts`, `helpers_api.spec.ts`, `start_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `branch_workflow.e2e.ts`, `core/logger.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `server.ts` to `vitest`, `Tea-concile`, `Queue-tea, the workspace app`, `start_api.spec.ts`, `Queue-tea: design`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._