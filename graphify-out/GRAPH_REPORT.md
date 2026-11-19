# Graph Report - notes-canvas-visual-planning  (2026-11-19)

## Corpus Check
- 605 files · ~583,160 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3914 nodes · 14052 edges · 114 communities (106 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 736 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `353520fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- vitest
- makeTask
- Refusal
- designs_api.spec.ts
- vitest
- EngineApi
- ref_types
- realms_api.ts
- tasks_controller.ts
- quest_detail.tsx
- start_api.ts
- first_run.tsx
- Using Notes
- Queue-tea: design
- fixes.test.ts
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- engine_api.ts
- projects_api.spec.ts
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 4: the rest of the screens
- checkpoints.ts
- emptyRecord
- notes.ts
- Tea-concile
- sessions.test.ts
- branch_api.ts
- worktrees_repository_impl.ts
- inspector.tsx
- designs_page.tsx
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- codex_repository_impl.ts
- menu_frame.tsx
- branches.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- ranking.ts
- compilerOptions
- Notes: the knowledge graph view
- backlog_view.tsx
- library_api.ts
- feedback.e2e.ts
- branch_workflow.e2e.ts
- t
- app.tsx
- 4. Screens
- board.e2e.ts
- server.ts
- host.ts
- Guild helpers on tasks: implementation plan
- Queue-tea architecture
- ref_node_fs
- Queue-tea: panel redesign
- game.ts
- messages.ts
- t
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- cup_mood.ts
- Queue-tea
- note_canvas_view.tsx
- test_support.ts
- package.json
- chai-pter.md
- queue_controller.ts
- designs_api.ts
- design_editor.tsx
- tea-dd.md
- board_tools.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- scope.ts
- Merge-check dependency setup
- helpers_api.spec.ts
- Designs tab
- register.tsx
- mana.ts
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- mocha-mockup.md
- Task Log
- presentation/widgets/read_view.tsx
- workspace-app.md
- Part 3: setting out and coming back
- .line-check-NZS8Gw/tsconfig.json
- ports.ts
- record_source.ts
- Part 2: edits
- designs.spec.tsx
- Queue-tea, the workspace app
- Guild helpers on tasks
- main.tsx
- activity.ts
- Queue-tea in Codex
- overrides

## God Nodes (most connected - your core abstractions)
1. `t` - 115 edges
2. `vitest` - 110 edges
3. `Refusal` - 108 edges
4. `emptyRecord()` - 81 edges
5. `reply()` - 74 edges
6. `EngineApi` - 73 edges
7. `preact` - 70 edges
8. `Reply` - 66 edges
9. `currentTask()` - 64 edges
10. `ask()` - 62 edges

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

## Communities (114 total, 8 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (75): brewLineOf(), captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderKeyOf(), folderNameError() (+67 more)

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (53): log, main(), createLogger(), Logger, stackOf(), attempt(), failed(), isForbiddenGit() (+45 more)

### Community 2 - "makeTask"
Cohesion: 0.09
Nodes (24): BUNDLE, git(), plist(), run, STAGE, won(), NOW, record() (+16 more)

### Community 3 - "Refusal"
Cohesion: 0.08
Nodes (69): inGameWords(), Refusal, setTaskLog(), activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest() (+61 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 5 - "vitest"
Cohesion: 0.07
Nodes (37): writeBundle(), Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps (+29 more)

### Community 6 - "EngineApi"
Cohesion: 0.05
Nodes (92): Content(), Answer, ask(), EngineRead, open(), pending(), useEngineRead(), DEFAULT_LOG_PATH (+84 more)

### Community 7 - "ref_types"
Cohesion: 0.07
Nodes (47): codexOperations(), CodexRefusal, readable(), Block, withBlock(), addRequestUseCase(), BlockResult, blockTaskUseCase() (+39 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.11
Nodes (27): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+19 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (61): live(), Task 11: `tasks`: the task's own cycle, Task 5: The shared resources' data and controllers, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), once(), running (+53 more)

### Community 10 - "quest_detail.tsx"
Cohesion: 0.08
Nodes (43): SheetView(), Field(), NoteAttachment(), Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest() (+35 more)

### Community 11 - "start_api.ts"
Cohesion: 0.21
Nodes (19): checkStart(), continueIn(), goneSentence(), handOver(), holdOf(), isClaudeWorking(), needFolder(), openClaude() (+11 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.10
Nodes (40): FieldProps, Group(), Pick(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer() (+32 more)

### Community 13 - "Using Notes"
Cohesion: 0.14
Nodes (12): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes, Goal and limits, List behavior (+4 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "fixes.test.ts"
Cohesion: 0.15
Nodes (24): Order to fix them, Task 9: `conversation` and `message_check`, closeBand(), showBand(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES (+16 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.11
Nodes (25): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+17 more)

### Community 17 - "git_source.ts"
Cohesion: 0.17
Nodes (29): File Structure, Task 8: The task flow, 4.1 Home, checkMessage(), parseCheckAnswer(), commitsBetween(), diffSince(), git() (+21 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (71): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+63 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.08
Nodes (34): env, run, server, Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem() (+26 more)

### Community 20 - "engine_api.ts"
Cohesion: 0.05
Nodes (55): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+47 more)

### Community 21 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 22 - "families.ts"
Cohesion: 0.22
Nodes (26): readChoices(), 4.5 New task, and Add child task inline, What each screen reads from existing data, checkPrompt(), checkTypedMessage(), TypedVerdict, MoveResult, moveTaskUseCase() (+18 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.13
Nodes (28): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+20 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.08
Nodes (50): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+42 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.12
Nodes (16): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+8 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.15
Nodes (17): CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), commandRun(), count(), isTestCommand(), lastLine(), parseCheckpoint() (+9 more)

### Community 28 - "emptyRecord"
Cohesion: 0.05
Nodes (59): record(), seed(), seed(), seed(), seed(), seed(), seed(), shouldCheck() (+51 more)

### Community 29 - "notes.ts"
Cohesion: 0.07
Nodes (46): jsonOr(), NoteFile, noteText(), OWNED, parseNote(), questsOf(), tagsOf(), textOf() (+38 more)

### Community 30 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 31 - "sessions.test.ts"
Cohesion: 0.11
Nodes (25): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+17 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.12
Nodes (56): reply(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+48 more)

### Community 34 - "inspector.tsx"
Cohesion: 0.32
Nodes (6): Inspector(), InspectorProps, number(), Small(), WEIGHTS, LIMITS

### Community 35 - "designs_page.tsx"
Cohesion: 0.10
Nodes (42): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors (+34 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.09
Nodes (35): Read, held(), hold(), Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record (+27 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.21
Nodes (17): approvalOf(), checkScene(), isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+9 more)

### Community 39 - "codex_repository_impl.ts"
Cohesion: 0.25
Nodes (6): folderOf(), readCodexActivity(), CodexRepository, codexLog(), NOW, SINCE

### Community 40 - "menu_frame.tsx"
Cohesion: 0.18
Nodes (29): Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu(), capital() (+21 more)

### Community 41 - "branches.ts"
Cohesion: 0.06
Nodes (54): streamProcess(), d(), executing, runMergeChecks(), manifest, packages, run(), state (+46 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.23
Nodes (19): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+11 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "ranking.ts"
Cohesion: 0.11
Nodes (40): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+32 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "backlog_view.tsx"
Cohesion: 0.17
Nodes (25): Audit: what the menu exposes of the engine, Problems not on the list, The eight items, Task 10: `tasks`: the queue side, Task 10: The panel, the band, the status line and the commands, KEYS, fileFromCommand(), parentFor() (+17 more)

### Community 50 - "library_api.ts"
Cohesion: 0.08
Nodes (42): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+34 more)

### Community 51 - "feedback.e2e.ts"
Cohesion: 0.07
Nodes (23): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+15 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.07
Nodes (36): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+28 more)

### Community 53 - "t"
Cohesion: 0.10
Nodes (26): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+18 more)

### Community 54 - "app.tsx"
Cohesion: 0.04
Nodes (69): ContentProps, MORE_PAGES, SheetProps, TABS, chronicle(), mana(), ALL, hrefOf() (+61 more)

### Community 55 - "4. Screens"
Cohesion: 0.09
Nodes (26): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+18 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.ts"
Cohesion: 0.17
Nodes (19): codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill(), skills, workflows (+11 more)

### Community 58 - "host.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "ref_node_fs"
Cohesion: 0.03
Nodes (57): APP, at, errors, fileTitled(), notesDir(), APP, FIRST, record() (+49 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "game.ts"
Cohesion: 0.15
Nodes (23): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+15 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "t"
Cohesion: 0.05
Nodes (104): DETAIL_IS_PAGE_BELOW, clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft(), refillTime() (+96 more)

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
Cohesion: 0.03
Nodes (113): ACTIVITY_REFRESH_MS, CANVAS_CURVE_PX, CANVAS_DRAG_PX, CANVAS_FIT_PX, CANVAS_ZOOM_MAX, CANVAS_ZOOM_MIN, DETAIL_FLOATS_BELOW, DRAG_SLOP_PX (+105 more)

### Community 70 - "cup_mood.ts"
Cohesion: 0.11
Nodes (25): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+17 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.07
Nodes (51): CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_EXCERPT, CANVAS_MIN_SIZE, NOTE_PICKER_QUEST_ROWS, anchorOf(), boundsOf(), Card (+43 more)

### Community 73 - "test_support.ts"
Cohesion: 0.03
Nodes (120): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+112 more)

### Community 74 - "package.json"
Cohesion: 0.13
Nodes (14): author, description, license, main, name, private, productName, version (+6 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "queue_controller.ts"
Cohesion: 0.19
Nodes (19): Features, removeTaskUseCase(), setPriorityUseCase(), clearHold(), blockTask(), featureCommand(), moveTask(), pressPriority() (+11 more)

### Community 78 - "designs_api.ts"
Cohesion: 0.11
Nodes (29): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+21 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.10
Nodes (48): AUTOSAVE_MS, commit(), History, historyOf(), redo(), undo(), Box, clamp() (+40 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "board_tools.tsx"
Cohesion: 0.12
Nodes (25): BoardSection, BoardView, EMPTY_BOARD, filterEntries(), Filters, hasFilters(), isFiltering(), matchesText() (+17 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.19
Nodes (13): change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE, NOW (+5 more)

### Community 89 - "scope.ts"
Cohesion: 0.10
Nodes (44): projectsFolder(), GAME_WORDS, MESSAGES, UPDATE_TEXT, readCodexSession(), Observation, observeTask(), readChronicle() (+36 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 93 - "helpers_api.spec.ts"
Cohesion: 0.11
Nodes (17): OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), DONE, INIT, jobOf() (+9 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "register.tsx"
Cohesion: 0.07
Nodes (83): The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core, Task 6: `commit_guard` and `errands` (+75 more)

### Community 96 - "mana.ts"
Cohesion: 0.18
Nodes (23): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+15 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 100 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 106 - "presentation/widgets/read_view.tsx"
Cohesion: 0.15
Nodes (13): bookmarkOf(), ENTITIES, textOf(), NoteBookmark(), markdown, Props, tokenizer(), BOOKMARK_LIMITS (+5 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.14
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "ports.ts"
Cohesion: 0.09
Nodes (41): 5. Features, shared resources and the core, Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 9: Keeping usage down, pressRestore(), Ctx (+33 more)

### Community 117 - "record_source.ts"
Cohesion: 0.07
Nodes (42): p, loadCodexContext(), canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord(), git() (+34 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 122 - "designs.spec.tsx"
Cohesion: 0.11
Nodes (16): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), NUDGE_PX, Badge() (+8 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 128 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", What's saved (+2 more)

### Community 130 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 135 - "activity.ts"
Cohesion: 0.11
Nodes (21): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+13 more)

### Community 136 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 143 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

## Knowledge Gaps
- **8 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1114 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `makeTask`, `designs_api.spec.ts`, `vitest`, `EngineApi`, `activity.ts`, `realms_api.ts`, `quest_detail.tsx`, `start_api.ts`, `first_run.tsx`, `settings_api.ts`, `main.ts`, `engine_api.ts`, `projects_api.spec.ts`, `palette.ts`, `notes_api.ts`, `notes.ts`, `branch_api.ts`, `designs_page.tsx`, `designs_api.spec.ts`, `branches.ts`, `claude_code.ts`, `library_api.ts`, `t`, `app.tsx`, `server.ts`, `host.ts`, `ref_node_fs`, `game.ts`, `messages.ts`, `t`, `note_graph_view.tsx`, `note_canvas_view.tsx`, `test_support.ts`, `package.json`, `designs_api.ts`, `design_editor.tsx`, `board_tools.tsx`, `notes_backup.spec.ts`, `helpers_api.spec.ts`, `presentation/widgets/read_view.tsx`, `record_source.ts`, `designs.spec.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07046070460704607 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.04223469660518578 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `record_source.ts` to `vitest`, `worktrees_repository_impl.ts`, `File Structure`, `designs_api.spec.ts`, `activity.ts`, `realms_api.ts`, `codex_repository_impl.ts`, `claude_code.ts`, `emptyRecord`, `settings_api.ts`, `git_source.ts`, `library_api.ts`, `ports.ts`, `branch_workflow.e2e.ts`, `scope.ts`, `Part 4: the rest of the screens`, `sessions.test.ts`, `register.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._