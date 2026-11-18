# Graph Report - main-integration  (2026-11-18)

## Corpus Check
- 579 files · ~543,947 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3647 nodes · 13315 edges · 133 communities (126 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 702 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5fdab5b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- settings_api.ts
- finish_api.spec.ts
- tasks_api.ts
- designs_api.spec.ts
- check_prompt.ts
- preact
- ref_types
- opening_api.ts
- tasks_controller.ts
- merge_workspace.ts
- branch_source.ts
- first_run.tsx
- engine_api.ts
- Queue-tea: design
- band_host.tsx
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- brew_quest.tsx
- book_form.ts
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 4: the rest of the screens
- checkpoints.ts
- tests/helpers.ts
- createLogger
- vitest
- sessions.test.ts
- reply
- test_support.ts
- design_editor.tsx
- design_forms.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- note_attachments.ts
- menu_frame.tsx
- core/reply.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- helpers_api.spec.ts
- compilerOptions
- designs_api.ts
- queue_controller.ts
- library_api.ts
- activity.spec.ts
- branch_workflow.e2e.ts
- t
- app.tsx
- designs_page.tsx
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
- core/logger.ts
- Queue-tea: workspace app
- Queue-tea
- quest_edits.ts
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
- mocha-mockup.md
- Notes
- Refusal
- Task Log
- Workspace app, the rest of the road
- GitState
- projects_api.spec.ts
- Host
- Guild helpers on tasks
- workspace-app.md
- ref_node_path
- EngineApi
- Part 3: setting out and coming back
- .line-check-NZS8Gw/tsconfig.json
- requests_controller.ts
- victory.ts
- feedback.e2e.ts
- Part 2: edits
- shell.e2e.ts
- check_layers.mjs
- first_window.e2e.ts
- quest_files.e2e.ts
- Queue-tea, the workspace app
- note_history.spec.ts
- note_bookmarks.ts
- daily_notes.e2e.ts
- Tea-concile
- guild.e2e.ts
- game.spec.ts
- Repository Rules
- detail_api.spec.ts
- notes.ts

## God Nodes (most connected - your core abstractions)
1. `t` - 112 edges
2. `Refusal` - 108 edges
3. `vitest` - 101 edges
4. `emptyRecord()` - 81 edges
5. `reply()` - 74 edges
6. `EngineApi` - 69 edges
7. `preact` - 67 edges
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

## Communities (133 total, 7 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (67): brewLineOf(), captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderNameError(), foldersOf() (+59 more)

### Community 1 - "settings_api.ts"
Cohesion: 0.12
Nodes (25): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+17 more)

### Community 2 - "finish_api.spec.ts"
Cohesion: 0.09
Nodes (20): APP, dayBefore(), fileOf(), won(), BUNDLE, git(), plist(), run (+12 more)

### Community 3 - "tasks_api.ts"
Cohesion: 0.13
Nodes (34): editQuest(), setPriority(), togglePlayNext(), criteriaOf(), descriptionOf(), DIFFICULTIES, difficultyOf(), helpersOf() (+26 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.10
Nodes (19): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+11 more)

### Community 5 - "check_prompt.ts"
Cohesion: 0.19
Nodes (14): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+6 more)

### Community 6 - "preact"
Cohesion: 0.07
Nodes (72): SheetView(), Answer, ask(), AttachmentInput(), bytesOf(), Props, State, Dialog() (+64 more)

### Community 7 - "ref_types"
Cohesion: 0.07
Nodes (56): codexOperations(), CodexRefusal, readable(), ctx, Ctx, Env, errandReply(), Block (+48 more)

### Community 8 - "opening_api.ts"
Cohesion: 0.20
Nodes (14): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+6 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.06
Nodes (70): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once(), running (+62 more)

### Community 10 - "merge_workspace.ts"
Cohesion: 0.18
Nodes (17): CheckDefinition, checksFile(), checksPassed(), readChecks(), saveChecks(), readCommitProgress(), operation, state (+9 more)

### Community 11 - "branch_source.ts"
Cohesion: 0.20
Nodes (18): digest(), gitIn(), graphOf(), headsOf(), pendingGit(), reviewOf(), taskReads(), workingSnapshot() (+10 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.11
Nodes (36): HOLD_FILES_SHOWN, accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+28 more)

### Community 13 - "engine_api.ts"
Cohesion: 0.05
Nodes (66): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), Coins(), EggArt(), MEDALS, StageArt(), FIRST_LEVEL (+58 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "band_host.tsx"
Cohesion: 0.06
Nodes (70): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core (+62 more)

### Community 16 - "scope.ts"
Cohesion: 0.08
Nodes (49): projectsFolder(), GAME_WORDS, MESSAGES, readChronicle(), GameDeps, readGame(), readHoard(), readMana() (+41 more)

### Community 17 - "git_source.ts"
Cohesion: 0.20
Nodes (27): File Structure, Task 8: The task flow, What each screen reads from existing data, Options, commitsBetween(), diffSince(), git(), lastCommit() (+19 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (72): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+64 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "brew_quest.tsx"
Cohesion: 0.18
Nodes (15): lineOf(), tickedItemsOf(), BrewQuestCard(), BrewSheet(), DIFFICULTIES, Errors, parentError(), PRIORITIES (+7 more)

### Community 21 - "book_form.ts"
Cohesion: 0.18
Nodes (20): Content(), Empty(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError() (+12 more)

### Community 22 - "families.ts"
Cohesion: 0.05
Nodes (84): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+76 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.12
Nodes (29): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+21 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.12
Nodes (35): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+27 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.22
Nodes (9): chronicle(), mana(), game(), 6. The app: frontend, backend and storage, Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools (+1 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.12
Nodes (25): findNewCommits(), factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines() (+17 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.11
Nodes (28): emptyRecord(), CTX, fakePorts(), makeTask(), memoryHost(), Run, current(), setup() (+20 more)

### Community 29 - "createLogger"
Cohesion: 0.13
Nodes (17): createLogger(), stackOf(), OutputSink, ProcessRequest, ProcessResult, running, log, stopProcesses() (+9 more)

### Community 30 - "vitest"
Cohesion: 0.11
Nodes (23): choice, graphLayout(), BranchGraph(), FORK, mergeOperation(), mergeWorkspace(), SOURCE, TARGET (+15 more)

### Community 31 - "sessions.test.ts"
Cohesion: 0.10
Nodes (32): Observation, chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf() (+24 more)

### Community 32 - "reply"
Cohesion: 0.15
Nodes (46): reply(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+38 more)

### Community 33 - "test_support.ts"
Cohesion: 0.03
Nodes (97): open(), BOARD, FIRST, open(), SAGA, SECOND, click(), one (+89 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.11
Nodes (47): numberError(), Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf() (+39 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.16
Nodes (17): Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, NextForm, nextFormOf() (+9 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.09
Nodes (33): Read, held(), hold(), Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record (+25 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.15
Nodes (22): checkScene(), CommentsFile, isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+14 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.24
Nodes (14): filePathOf(), formatOf(), noteFiles(), attachmentError(), extensionOf(), NOTE_ATTACHMENTS, NOTE_FILE_ACCEPT, NOTE_FILE_LIMIT (+6 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (38): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+30 more)

### Community 41 - "core/reply.ts"
Cohesion: 0.18
Nodes (16): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies() (+8 more)

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

### Community 46 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "designs_api.ts"
Cohesion: 0.19
Nodes (16): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+8 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.12
Nodes (43): The eight items, Task 10: `tasks`: the queue side, Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), fileFromCommand(), parentFor(), clearHold() (+35 more)

### Community 50 - "library_api.ts"
Cohesion: 0.15
Nodes (21): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), DUNE, NOW, addBook() (+13 more)

### Community 51 - "activity.spec.ts"
Cohesion: 0.10
Nodes (23): codexEvents, CodexObservation, commandOf(), parse(), Row, now, textOf(), cache (+15 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "t"
Cohesion: 0.13
Nodes (21): fileNamed(), FILES, frontmatter(), Helper, helperOf(), HELPERS, KINDS, LOGOS (+13 more)

### Community 54 - "app.tsx"
Cohesion: 0.04
Nodes (85): App(), ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), BOARD (+77 more)

### Community 55 - "designs_page.tsx"
Cohesion: 0.14
Nodes (23): useWindowWidth(), Names, questOfNext(), BrokenVersion(), DesignsPage(), EditorLoader(), Filed, FiledNote() (+15 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.spec.ts"
Cohesion: 0.16
Nodes (12): files, helperInstructions(), skill(), skills, workflows, createCodexServer(), CODEX_LIMITS, CODEX_TEXT (+4 more)

### Community 58 - "host.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.12
Nodes (14): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 5. Features, shared resources and the core, 7. Tests, 8. Getting there (+6 more)

### Community 61 - "ref_node_fs"
Cohesion: 0.06
Nodes (17): APP, errors, PNG, APP, paste(), APP, errors, EXPORTED (+9 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "game.ts"
Cohesion: 0.28
Nodes (14): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+6 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (36): clockTime(), dayName(), dayOf(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex() (+28 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "File Structure"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "core/logger.ts"
Cohesion: 0.06
Nodes (32): appIdOf(), Flavor, flavorOf(), fileSink(), attempt(), failed(), isForbiddenGit(), nodeHost() (+24 more)

### Community 70 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_edits.ts"
Cohesion: 0.19
Nodes (15): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withPlayNext(), withPriority(), QuestEdits (+7 more)

### Community 73 - "setup.ts"
Cohesion: 0.30
Nodes (11): log, main(), codexSkills(), companionSkills(), helperDefinition(), codexConfigArgs(), CodexRuntime, digest() (+3 more)

### Community 74 - "package.json"
Cohesion: 0.11
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

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
Cohesion: 0.27
Nodes (8): cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote(), CLEAN, withTasks()

### Community 79 - "designs.ts"
Cohesion: 0.15
Nodes (16): commentError(), commit(), History, historyOf(), redo(), undo(), SaveState, CommentRow() (+8 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (87): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, HOME_BADGES, HOME_BOARD_ROWS, Dragon(), GoldReward(), PriorityTag(), XpReward() (+79 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.18
Nodes (14): NotesDeps, change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE (+6 more)

### Community 89 - "record_source.ts"
Cohesion: 0.09
Nodes (35): p, canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord(), git(), NOW (+27 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (7): RunChecksRequest, Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "update.ts"
Cohesion: 0.22
Nodes (9): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, changedBuild(), UpdatePhase, UpdateState (+1 more)

### Community 92 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 93 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "session_rhythm.ts"
Cohesion: 0.10
Nodes (63): live(), Features, The core and the app, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, renderBand(), toggleMenu(), loadContext() (+55 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.23
Nodes (15): UPDATE_TEXT, Deps, setup(), updateService(), exec, ACTIVE, exec, git() (+7 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 100 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 101 - "Notes"
Cohesion: 0.11
Nodes (19): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+11 more)

### Community 102 - "Refusal"
Cohesion: 0.12
Nodes (48): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+40 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 105 - "GitState"
Cohesion: 0.39
Nodes (5): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, fakeGit()

### Community 106 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 107 - "Host"
Cohesion: 0.08
Nodes (31): Logger, loadCodexContext(), COMMIT_ACTIVITY_LIMIT, Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame (+23 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+3 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.14
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 110 - "ref_node_path"
Cohesion: 0.15
Nodes (13): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+5 more)

### Community 111 - "EngineApi"
Cohesion: 0.08
Nodes (45): EngineRead, open(), pending(), useEngineRead(), DEFAULT_LOG_PATH, ReadView(), Window, BRANCH_POLL_MS (+37 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "requests_controller.ts"
Cohesion: 0.11
Nodes (27): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd() (+19 more)

### Community 116 - "victory.ts"
Cohesion: 0.33
Nodes (7): isSagaWon(), kindOf(), newBadges(), NOW, record(), won(), victoryOf()

### Community 117 - "feedback.e2e.ts"
Cohesion: 0.14
Nodes (6): Account, plantGh(), statusOf(), APP, realmFile(), APP

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 121 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 122 - "quest_files.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, errors, PNG, SEED

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "note_history.spec.ts"
Cohesion: 0.38
Nodes (5): NOW, versionsToKeep(), NOTE_HISTORY_LIMITS, NoteVersion, Version history

### Community 125 - "note_bookmarks.ts"
Cohesion: 0.18
Nodes (12): bookmarkOf(), ENTITIES, textOf(), markdown, Props, tokenizer(), BOOKMARK_LIMITS, BOOKMARK_URL_LIMIT (+4 more)

### Community 126 - "daily_notes.e2e.ts"
Cohesion: 0.40
Nodes (5): APP, at, errors, fileTitled(), notesDir()

### Community 127 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 128 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 129 - "game.spec.ts"
Cohesion: 0.33
Nodes (4): AS_OF_27_OCT, badge(), NOW, record()

### Community 132 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 133 - "detail_api.spec.ts"
Cohesion: 0.20
Nodes (8): git(), NOW, run, seed(), QuestFacts, APP, check(), run

### Community 145 - "notes.ts"
Cohesion: 0.11
Nodes (29): body(), memoryNotes(), ok(), write(), versions, note(), backlinksOf(), BackupSkip (+21 more)

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1022 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `game.spec.ts`, `finish_api.spec.ts`, `settings_api.ts`, `designs_api.spec.ts`, `detail_api.spec.ts`, `preact`, `ref_types`, `opening_api.ts`, `merge_workspace.ts`, `branch_source.ts`, `first_run.tsx`, `engine_api.ts`, `scope.ts`, `notes.ts`, `main.ts`, `book_form.ts`, `palette.ts`, `createLogger`, `sessions.test.ts`, `reply`, `test_support.ts`, `design_editor.tsx`, `design_forms.ts`, `designs_api.spec.ts`, `note_attachments.ts`, `claude_code.ts`, `helpers_api.spec.ts`, `designs_api.ts`, `library_api.ts`, `activity.spec.ts`, `t`, `app.tsx`, `server.spec.ts`, `host.ts`, `ref_node_fs`, `messages.ts`, `chronicle_page.tsx`, `core/logger.ts`, `quest_edits.ts`, `setup.ts`, `package.json`, `designs.ts`, `quests_page.tsx`, `notes_backup.spec.ts`, `record_source.ts`, `update.ts`, `judgements.spec.ts`, `ref_node_child_process`, `GitState`, `projects_api.spec.ts`, `ref_node_path`, `EngineApi`, `victory.ts`, `note_history.spec.ts`, `note_bookmarks.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0747871158830063 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `Host` to `settings_api.ts`, `File Structure`, `designs_api.spec.ts`, `core/logger.ts`, `Queue-tea: workspace app`, `opening_api.ts`, `Workspace app, the rest of the road`, `branch_source.ts`, `claude_code.ts`, `tests/helpers.ts`, `band_host.tsx`, `scope.ts`, `git_source.ts`, `library_api.ts`, `activity.spec.ts`, `record_source.ts`, `sessions.test.ts`, `session_rhythm.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `settings_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11586452762923351 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._