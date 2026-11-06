# Graph Report - queue-tea  (2026-11-06)

## Corpus Check
- 484 files · ~382,348 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 3, .pen 1)

## Summary
- 3114 nodes · 11334 edges · 112 communities (104 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 666 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98d072f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- holdReason
- ref_node_fs
- tasks_api.ts
- settings_page.tsx
- services/helpers.ts
- quests_page.tsx
- preact
- @playwright/test
- opening_api.spec.ts
- tasks_controller.ts
- Reply
- fixes.test.ts
- first_run.tsx
- helper_card.tsx
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- back_api.spec.ts
- queue_controller.ts
- families.ts
- backlog_view.tsx
- palette.ts
- view_store.ts
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- app.tsx
- ranking.ts
- game.ts
- branch_api.ts
- design_forms.ts
- design_editor.tsx
- engine_api.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- feedback.e2e.ts
- menu_frame.tsx
- start_api.ts
- flows.e2e.ts
- package.json
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- library_api.ts
- activity.ts
- hud.tsx
- ref_types
- helpers_api.spec.ts
- File Structure
- board.e2e.ts
- quest_edits.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- project_views.ts
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- Features
- test_support.ts
- requests.test.ts
- commit-chai-n.md
- board_tools.tsx
- sessions.test.ts
- spec.md
- quest_detail.tsx
- designs.ts
- scene_view.tsx
- chai-pter.md
- branch_workflow.e2e.ts
- start_api.spec.ts
- Repository Rules
- What each screen reads from existing data
- tea-dd.md
- t
- refresh_app.sh
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- branch_source.ts
- project_source.ts
- queue_rules.ts
- Architecture
- Designs tab
- Part B: the app
- records_controller.ts
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app
- release_guard.d.mts
- Tea-concile
- hierarchy.test.ts
- Queue-tea: workspace app UI design
- Task Log
- Part A: the mod
- fixes.test.ts
- workspace-app.md
- Guild helpers on tasks
- Queue-tea, the workspace app
- Scene
- tasks/codex.test.ts
- vitest

## God Nodes (most connected - your core abstractions)
1. `t` - 94 edges
2. `Refusal` - 92 edges
3. `emptyRecord()` - 78 edges
4. `vitest` - 74 edges
5. `reply()` - 72 edges
6. `currentTask()` - 62 edges
7. `preact` - 56 edges
8. `scopeOf()` - 54 edges
9. `Reply` - 54 edges
10. `App()` - 53 edges

## Surprising Connections (you probably didn't know these)
- `Behaviour` --references--> `fileQuest()`  [INFERRED]
  docs/design-tab.md → app/main/features/tasks/api/tasks_api.ts
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

## Communities (112 total, 8 thin omitted)

### Community 0 - "holdReason"
Cohesion: 0.14
Nodes (14): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+6 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.06
Nodes (40): FORBIDDEN_GIT, appIdOf(), Flavor, flavorOf(), createLogger(), fileSink(), stackOf(), attempt() (+32 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.13
Nodes (43): inGameWords(), Refusal, requestOf(), newBadges(), victoryOf(), finishQuest(), keepLog(), Logged (+35 more)

### Community 3 - "settings_page.tsx"
Cohesion: 0.18
Nodes (16): copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps, Sections (+8 more)

### Community 4 - "services/helpers.ts"
Cohesion: 0.11
Nodes (20): Drafting a version for the Designs tab, How you work, What you don't do, What you report, fileNamed(), FILES, frontmatter(), Helper (+12 more)

### Community 5 - "quests_page.tsx"
Cohesion: 0.18
Nodes (21): clockTime(), dayName(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex(), weekdayOf() (+13 more)

### Community 6 - "preact"
Cohesion: 0.07
Nodes (68): Content(), ask(), EngineRead, useEngineRead(), ReadView(), Failed(), Loading(), Window (+60 more)

### Community 7 - "@playwright/test"
Cohesion: 0.05
Nodes (19): APP, onDisk(), SEED, stored(), titled(), APP, FIRST, record() (+11 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.20
Nodes (14): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+6 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.10
Nodes (50): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, shouldCheck(), helperToRemind(), noteHelperUseCase(), putBackUseCase(), setReviewUseCase() (+42 more)

### Community 10 - "Reply"
Cohesion: 0.11
Nodes (38): projectsFolder(), Logger, readChronicle(), GameDeps, readHoard(), isProjectKey(), readProject(), canRestoreFrom() (+30 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.10
Nodes (36): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand() (+28 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.13
Nodes (31): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+23 more)

### Community 13 - "helper_card.tsx"
Cohesion: 0.24
Nodes (11): folderName(), orderError(), HelperBot(), PROPS, Bubble(), GuildRealm, HelperCard(), Mood (+3 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 16 - "scope.ts"
Cohesion: 0.10
Nodes (44): GAME_WORDS, MESSAGES, reply(), openMergeFolder(), cancelMergeChecks(), readPush(), readGame(), readMana() (+36 more)

### Community 17 - "git_source.ts"
Cohesion: 0.18
Nodes (23): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+15 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (57): BUSY_PROBE, COPY_LIMIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE, SETTINGS_FILE (+49 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.08
Nodes (36): currentProvenance(), git(), releaseProblem(), root, run(), candidate, Task 2: The layer check, checkLayers() (+28 more)

### Community 20 - "back_api.spec.ts"
Cohesion: 0.08
Nodes (25): record(), won(), AT, NOW, record(), won(), seed(), Asked (+17 more)

### Community 21 - "queue_controller.ts"
Cohesion: 0.16
Nodes (29): The eight items, Task 10: `tasks`: the queue side, markRemindedUseCase(), setFeatureUseCase(), setPriorityUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), clearHold() (+21 more)

### Community 22 - "families.ts"
Cohesion: 0.16
Nodes (30): isSagaWon(), kindOf(), readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase() (+22 more)

### Community 23 - "backlog_view.tsx"
Cohesion: 0.27
Nodes (13): capital(), markFor(), KEYS, pressBlock(), pressFold(), pressPartOf(), pressRow(), drawBacklog() (+5 more)

### Community 24 - "palette.ts"
Cohesion: 0.16
Nodes (20): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+12 more)

### Community 25 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.11
Nodes (18): Edit, After the first install, Part 2: edits, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the quest in hand, in full (+10 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.13
Nodes (22): 4.1 Home, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines() (+14 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.12
Nodes (30): record(), seed(), seed(), emptyRecord(), CTX, fakePorts(), makeTask(), memoryHost() (+22 more)

### Community 29 - "app.tsx"
Cohesion: 0.06
Nodes (51): ContentProps, MORE_PAGES, SheetProps, TABS, AUTOSAVE_MS, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX (+43 more)

### Community 30 - "ranking.ts"
Cohesion: 0.12
Nodes (32): Already built, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass, 4.9 Back to queue, Blocked…, Move and Remove, ParallelDeps (+24 more)

### Community 31 - "game.ts"
Cohesion: 0.19
Nodes (18): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+10 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (73): streamProcess(), abandonMerge(), BranchDeps, freshReview(), messageOf(), prepareMerge(), readBranch(), readBranches() (+65 more)

### Community 33 - "design_forms.ts"
Cohesion: 0.11
Nodes (26): colourError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, NextForm (+18 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.14
Nodes (36): Box, clamp(), copyWithIds(), duplicateLayer(), Handle, handlesOf(), layerOf(), mapLayers() (+28 more)

### Community 35 - "engine_api.ts"
Cohesion: 0.05
Nodes (56): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, STAGE_SCALE, dayAndTime(), Coins(), EggArt(), MEDALS, Sky() (+48 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.10
Nodes (15): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+7 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.09
Nodes (35): held(), hold(), Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record, Task 3: Reading git and making branches (+27 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.13
Nodes (32): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+24 more)

### Community 39 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (11): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+3 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.16
Nodes (34): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+26 more)

### Community 41 - "start_api.ts"
Cohesion: 0.25
Nodes (18): isSessionOpen(), checkStart(), continueIn(), goneSentence(), handOver(), holdOf(), isClaudeWorking(), needFolder() (+10 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "package.json"
Cohesion: 0.04
Nodes (43): author, description, devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans (+35 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.22
Nodes (19): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexPasteLine(), openLineArgv(), openVsCode(), script() (+11 more)

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
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.20
Nodes (18): applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending, READS (+10 more)

### Community 50 - "library_api.ts"
Cohesion: 0.15
Nodes (21): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), DUNE, NOW, addBook() (+13 more)

### Community 51 - "activity.ts"
Cohesion: 0.15
Nodes (13): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+5 more)

### Community 52 - "hud.tsx"
Cohesion: 0.09
Nodes (34): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), GROWS_AT, isStreakAtRisk() (+26 more)

### Community 53 - "ref_types"
Cohesion: 0.13
Nodes (20): ctx, Ctx, Env, MenuSpec, SessionUsage, View, Block, withBlock() (+12 more)

### Community 54 - "helpers_api.spec.ts"
Cohesion: 0.12
Nodes (16): OutputSink, ProcessRequest, running, stopProcesses(), DONE, INIT, jobOf(), last() (+8 more)

### Community 55 - "File Structure"
Cohesion: 0.18
Nodes (16): Global Constraints, Queue-tea Implementation Plan, Review Focus, addRow(), capital(), escapeCell(), HEAD, rowLine() (+8 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "quest_edits.ts"
Cohesion: 0.16
Nodes (18): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withPlayNext(), withPriority(), QuestEdits (+10 more)

### Community 58 - "host.ts"
Cohesion: 0.18
Nodes (19): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+11 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.13
Nodes (13): chronicle(), mana(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 6. The app: frontend, backend and storage (+5 more)

### Community 61 - "project_views.ts"
Cohesion: 0.22
Nodes (16): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+8 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.09
Nodes (67): The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, drawCup(), renderBand(), stillCup(), toggleMenu(), loadContext() (+59 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.27
Nodes (8): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS

### Community 65 - "Features"
Cohesion: 0.18
Nodes (17): live(), 5. Features, shared resources and the core, Features, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these) (+9 more)

### Community 66 - "test_support.ts"
Cohesion: 0.03
Nodes (112): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+104 more)

### Community 67 - "requests.test.ts"
Cohesion: 0.24
Nodes (12): pressOpenApp(), once(), running, takeRequestUseCase(), TakeResult, closeAnswered(), followRecord(), Handled (+4 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "board_tools.tsx"
Cohesion: 0.21
Nodes (13): BoardSection, Filters, Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel() (+5 more)

### Community 70 - "sessions.test.ts"
Cohesion: 0.11
Nodes (29): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+21 more)

### Community 71 - "spec.md"
Cohesion: 0.12
Nodes (12): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Commands, Develop, Helpers, Install (+4 more)

### Community 72 - "quest_detail.tsx"
Cohesion: 0.07
Nodes (60): SheetView(), Answer, DEFAULT_LOG_PATH, XP_BY_DIFFICULTY, Dialog(), Field(), FieldProps, Group() (+52 more)

### Community 73 - "designs.ts"
Cohesion: 0.16
Nodes (14): commentError(), CommentRow(), CommentsPanel(), Props, Author, CommentInput, DESIGN_FORMAT, DesignComment (+6 more)

### Community 74 - "scene_view.tsx"
Cohesion: 0.70
Nodes (4): LayerView(), SceneThumb(), SceneView(), isFrame()

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.26
Nodes (13): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+5 more)

### Community 77 - "start_api.spec.ts"
Cohesion: 0.17
Nodes (5): git(), NOW, onDisk(), run, seed()

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "What each screen reads from existing data"
Cohesion: 0.33
Nodes (9): 4.4 A task's detail: current, queued and done, What each screen reads from existing data, Options, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections() (+1 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "t"
Cohesion: 0.06
Nodes (73): dayOf(), Dragon(), Spinner(), GoldReward(), PriorityTag(), XpReward(), useWindowWidth(), Board() (+65 more)

### Community 82 - "refresh_app.sh"
Cohesion: 1.00
Nodes (3): refresh(), say(), refresh_app.sh script

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 89 - "record_source.ts"
Cohesion: 0.17
Nodes (16): Task 1: The helper list and the record field, What's saved, fnv1a(), parseRecord(), readOthers(), readRecord(), replaceWith(), updateRecord() (+8 more)

### Community 90 - "branch_source.ts"
Cohesion: 0.22
Nodes (18): completeMerge(), ancestor(), gitIn(), graphOf(), headsOf(), pendingGit(), reviewOf(), workingSnapshot() (+10 more)

### Community 91 - "project_source.ts"
Cohesion: 0.38
Nodes (7): readProjectPlace(), carryOverRecords(), recordPath(), projectRepositoryImpl(), ProjectPlace, ProjectRepository, parseOffset()

### Community 92 - "queue_rules.ts"
Cohesion: 0.15
Nodes (21): Task 10: The panel, the band, the status line and the commands, One engine, two hosts, FileInput, FileResult, fileTaskUseCase(), removeTaskUseCase(), fileFromCommand(), fileTask() (+13 more)

### Community 93 - "Architecture"
Cohesion: 0.17
Nodes (12): Architecture, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The Designs tab (+4 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "Part B: the app"
Cohesion: 0.22
Nodes (9): Global constraints, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 7: the project, Task 9: the game rules (+1 more)

### Community 96 - "records_controller.ts"
Cohesion: 0.14
Nodes (28): Shared resources, Task 5: The shared resources' data and controllers, File Structure, Task 9: Keeping usage down, How Claude uses them (the mod), shouldFresh(), shouldHandoff(), windowKey() (+20 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app"
Cohesion: 0.12
Nodes (16): game(), Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window, Build order, for the plan, Checked (+8 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "hierarchy.test.ts"
Cohesion: 0.22
Nodes (5): ARROWS, CLEAN, DIRTY, recordOf(), repo()

### Community 102 - "Queue-tea: workspace app UI design"
Cohesion: 0.13
Nodes (16): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+8 more)

### Community 104 - "Part A: the mod"
Cohesion: 0.25
Nodes (7): Part A: the mod, Task 1: the file seam, Task 2: the new record fields, Task 4: `review`, Task 5: requests, Task 6: Open in Queue-tea app, unixFiles()

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.20
Nodes (9): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", Where Rohan chooses (+1 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "Scene"
Cohesion: 0.33
Nodes (6): commit(), History, historyOf(), redo(), undo(), Scene

### Community 115 - "tasks/codex.test.ts"
Cohesion: 0.13
Nodes (12): codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl(), CodexRepository, codexLog(), NOW, SINCE (+4 more)

### Community 117 - "vitest"
Cohesion: 0.07
Nodes (26): BUNDLE, git(), plist(), run, STAGE, git(), NOW, run (+18 more)

## Knowledge Gaps
- **6 isolated node(s):** `@types/node`, `electron-builder`, `jsdom`, `typescript`, `vite` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 862 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ref_node_fs`, `quests_page.tsx`, `preact`, `opening_api.spec.ts`, `Reply`, `first_run.tsx`, `helper_card.tsx`, `git_source.ts`, `main.ts`, `version.test.mjs`, `back_api.spec.ts`, `palette.ts`, `app.tsx`, `game.ts`, `branch_api.ts`, `design_forms.ts`, `design_editor.tsx`, `designs_api.ts`, `package.json`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `hud.tsx`, `ref_types`, `helpers_api.spec.ts`, `quest_edits.ts`, `host.ts`, `app_menu.ts`, `test_support.ts`, `sessions.test.ts`, `quest_detail.tsx`, `designs.ts`, `start_api.spec.ts`, `t`, `designs_api.spec.ts`, `Scene`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `electron-builder`, `jsdom` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `holdReason` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `Reply` to `ref_node_fs`, `opening_api.spec.ts`, `git_source.ts`, `back_api.spec.ts`, `Part 2: edits`, `tests/helpers.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `ref_types`, `File Structure`, `register.tsx`, `sessions.test.ts`, `start_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `branch_source.ts`, `project_source.ts`, `queue_rules.ts`, `Part B: the app`, `Queue-tea: workspace app`, `Part A: the mod`, `tasks/codex.test.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.05737704918032787 - nodes in this community are weakly interconnected._
- **Why does `Queue-tea: design` connect `Queue-tea: design` to `spec.md`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._