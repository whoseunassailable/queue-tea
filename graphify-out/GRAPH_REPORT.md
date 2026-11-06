# Graph Report - design-tab  (2026-11-06)

## Corpus Check
- 472 files · ~370,396 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 3, .pen 1)

## Summary
- 3037 nodes · 11075 edges · 107 communities (100 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 665 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `936beef8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- What each screen reads from existing data
- ref_node_fs
- tasks_api.ts
- workspace_store.ts
- Task 2: Filing and editing carry the choice
- quests_page.tsx
- t
- feedback.e2e.ts
- realms_api.ts
- tasks_controller.ts
- record_source.ts
- fixes.test.ts
- first_run.tsx
- ref_node_path
- Queue-tea: design
- ref_types
- allowance.ts
- git_source.ts
- main.ts
- version.test.mjs
- File Structure
- queue_controller.ts
- families.ts
- checkpoints.ts
- band_host.tsx
- view_store.ts
- Workspace app, the rest of the road
- hoard_page.tsx
- tests/helpers.ts
- palette.ts
- ranking.ts
- game.ts
- branch_api.ts
- designs_page.tsx
- design_editor.tsx
- quest_flows.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- en.ts
- menu_frame.tsx
- scope.ts
- flows.e2e.ts
- package.json
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- new_quest_sheet.tsx
- Roadmap: the outside review, checked against the code
- hud.tsx
- ref_types
- branches.ts
- File Structure
- board.e2e.ts
- start_api.ts
- settings_api.ts
- designs.e2e.ts
- Queue-tea architecture
- edits.e2e.ts
- Queue-tea: panel redesign
- register.tsx
- app_menu.ts
- Part 3: setting out and coming back
- vitest
- start
- commit-chai-n.md
- pages.e2e.ts
- sessions.test.ts
- Queue-tea
- finish_api.spec.ts
- designs.spec.tsx
- designs.ts
- chai-pter.md
- branch_workflow.e2e.ts
- project_views.ts
- Repository Rules
- branch_rules.ts
- tea-dd.md
- t
- refresh_app.sh
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- start_api.spec.ts
- board_tools.tsx
- Part 4: the rest of the screens
- history.spec.ts
- Architecture
- Designs tab
- release_guard.mjs
- assistant_providers.ts
- Branch workflow completion — 5 November 2026
- flavor.ts
- release_guard.d.mts
- Queue-tea: workspace app UI design
- Task Log
- GitState
- Part B: the app
- update_watch.ts
- workspace-app.md
- Queue-tea, the workspace app

## God Nodes (most connected - your core abstractions)
1. `Refusal` - 90 edges
2. `t` - 90 edges
3. `emptyRecord()` - 76 edges
4. `vitest` - 71 edges
5. `reply()` - 70 edges
6. `currentTask()` - 60 edges
7. `preact` - 53 edges
8. `App()` - 53 edges
9. `Reply` - 53 edges
10. `scopeOf()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Behaviour` --references--> `fileQuest()`  [INFERRED]
  docs/design-tab.md → app/main/features/tasks/api/tasks_api.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts

## Import Cycles
- None detected.

## Communities (107 total, 7 thin omitted)

### Community 0 - "What each screen reads from existing data"
Cohesion: 0.41
Nodes (11): What each screen reads from existing data, ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase(), keepActivity(), blockedTasks(), blockedText() (+3 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.05
Nodes (43): createLogger(), fileSink(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+35 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.11
Nodes (50): GAME_WORDS, inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest() (+42 more)

### Community 3 - "workspace_store.ts"
Cohesion: 0.10
Nodes (24): AUTOSAVE_MS, DEFAULT_LOG_PATH, DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, DRAG_SLOP_PX, HOLD_FILES_SHOWN, HOME_BADGES, HOME_BOARD_ROWS (+16 more)

### Community 4 - "Task 2: Filing and editing carry the choice"
Cohesion: 0.09
Nodes (30): Drafting a version for the Designs tab, How you work, What you don't do, What you report, fileNamed(), FILES, frontmatter(), Helper (+22 more)

### Community 5 - "quests_page.tsx"
Cohesion: 0.08
Nodes (49): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, clockTime(), dayAndTime(), dayName(), dayOf(), manaLeft(), refillTime() (+41 more)

### Community 6 - "t"
Cohesion: 0.07
Nodes (69): Content(), ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, Answer, ask() (+61 more)

### Community 7 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (11): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+3 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.11
Nodes (29): projectsFolder(), canWrite(), installCommand(), openedFromUrl(), commandFileIn(), findCommand(), isOurs(), needsPath() (+21 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (55): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, Task 6: Docs, the real session check and every check, once() (+47 more)

### Community 10 - "record_source.ts"
Cohesion: 0.15
Nodes (28): canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord(), Task 1: The helper list and the record field, Data, 7. Acceptance criteria (+20 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.19
Nodes (14): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+6 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.14
Nodes (29): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+21 more)

### Community 13 - "ref_node_path"
Cohesion: 0.06
Nodes (25): APP, FIRST, record(), recordFile(), replaceRecord(), BUNDLE, git(), plist() (+17 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "ref_types"
Cohesion: 0.12
Nodes (38): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawCup(), drawQuestion(), MOOD_COLOR, MOOD_WORD (+30 more)

### Community 16 - "allowance.ts"
Cohesion: 0.46
Nodes (6): Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd()

### Community 17 - "git_source.ts"
Cohesion: 0.33
Nodes (16): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+8 more)

### Community 18 - "main.ts"
Cohesion: 0.06
Nodes (38): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+30 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.10
Nodes (30): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+22 more)

### Community 20 - "File Structure"
Cohesion: 0.25
Nodes (8): held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 3: Reading git and making branches, Task 6: The docs log, fakeGit()

### Community 21 - "queue_controller.ts"
Cohesion: 0.16
Nodes (36): The eight items, Task 10: `tasks`: the queue side, blockTaskUseCase(), removeTaskUseCase(), setPriorityUseCase(), fileFromCommand(), parentFor(), blockTask() (+28 more)

### Community 22 - "families.ts"
Cohesion: 0.16
Nodes (31): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), TypedVerdict, FeatureFound, findFeatureUseCase(), MoveResult (+23 more)

### Community 23 - "checkpoints.ts"
Cohesion: 0.05
Nodes (54): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), AT, log (+46 more)

### Community 24 - "band_host.tsx"
Cohesion: 0.11
Nodes (24): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+16 more)

### Community 25 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 26 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 27 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (19): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+11 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.07
Nodes (41): seed(), Task 1: the file seam, hostOf(), unixFiles(), shouldCheck(), takeRequestUseCase(), continueTask(), putBack() (+33 more)

### Community 29 - "palette.ts"
Cohesion: 0.09
Nodes (35): useWindowKeys(), actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore() (+27 more)

### Community 30 - "ranking.ts"
Cohesion: 0.18
Nodes (20): Already built, 4.2 Tasks, with a feature in the detail pane, 4.9 Back to queue, Blocked…, Move and Remove, budgetLabel(), BUDGETS, canWaitFor(), DEFAULT_MINUTES, effectivePriority() (+12 more)

### Community 31 - "game.ts"
Cohesion: 0.07
Nodes (61): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+53 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.10
Nodes (72): streamProcess(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+64 more)

### Community 33 - "designs_page.tsx"
Cohesion: 0.08
Nodes (49): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors (+41 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (44): Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf() (+36 more)

### Community 35 - "quest_flows.ts"
Cohesion: 0.09
Nodes (38): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withoutReview(), withPlayNext(), withPriority() (+30 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.12
Nodes (27): Edit, Task 3: Entities and pure rules, Task 2: The record, Task 5: Time and effort, Task 7: The message check, Task 3: edits in the window, Allowance, Band (+19 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.11
Nodes (33): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+25 more)

### Community 39 - "en.ts"
Cohesion: 0.10
Nodes (23): skyAt(), skyOf(), SkyTime, GithubChip(), BookErrors, BookField, BookForm, bookOf() (+15 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (34): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+26 more)

### Community 41 - "scope.ts"
Cohesion: 0.10
Nodes (52): Logger, MESSAGES, reply(), cancelMergeChecks(), Observation, observeTask(), readChronicle(), GameDeps (+44 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "package.json"
Cohesion: 0.04
Nodes (43): author, description, devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans (+35 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.23
Nodes (19): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexPasteLine(), openLineArgv(), openVsCode(), script() (+11 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.20
Nodes (12): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+4 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.20
Nodes (16): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+8 more)

### Community 50 - "new_quest_sheet.tsx"
Cohesion: 0.12
Nodes (23): HELPERS, GuildPage(), skillsText(), emptyQuestForm(), parentOf(), QuestErrors, QuestField, QuestForm (+15 more)

### Community 51 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 52 - "hud.tsx"
Cohesion: 0.10
Nodes (33): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), isStreakAtRisk(), laterHook() (+25 more)

### Community 53 - "ref_types"
Cohesion: 0.11
Nodes (25): Task 10: The panel, the band, the status line and the commands, Ctx, Env, Options, MenuSpec, SessionUsage, Block, withBlock() (+17 more)

### Community 54 - "branches.ts"
Cohesion: 0.11
Nodes (22): graphLayout(), FORK, MERGE, SOURCE, TARGET, BranchGraph, BranchReview, BranchState (+14 more)

### Community 55 - "File Structure"
Cohesion: 0.17
Nodes (18): File Structure, Global Constraints, Queue-tea Implementation Plan, Review Focus, addRow(), capital(), escapeCell(), HEAD (+10 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "start_api.ts"
Cohesion: 0.21
Nodes (19): isSessionOpen(), checkStart(), continueIn(), goneSentence(), handOver(), holdOf(), isClaudeWorking(), needFolder() (+11 more)

### Community 58 - "settings_api.ts"
Cohesion: 0.22
Nodes (15): cleanSettings(), DEFAULT_SETTINGS, isFolds(), isLastProject(), isRealmAccounts(), isScope(), isSky(), isTerminal() (+7 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.07
Nodes (98): live(), 5. Features, shared resources and the core, Features, Shared resources, The core and the app, After this plan, Feature-first restructure Implementation Plan, Global Constraints (+90 more)

### Community 64 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 65 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 66 - "vitest"
Cohesion: 0.03
Nodes (103): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+95 more)

### Community 67 - "start"
Cohesion: 0.19
Nodes (13): isNumber(), relaunchArgv(), Restored, restoredOf(), run, versionOfPlist(), checkJudgements, checkUpdate (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 70 - "sessions.test.ts"
Cohesion: 0.27
Nodes (11): Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository, HEARTBEAT_MS, parseSession() (+3 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "finish_api.spec.ts"
Cohesion: 0.08
Nodes (26): record(), won(), NOW, record(), won(), NOW, record(), Asked (+18 more)

### Community 73 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), VersionView

### Community 74 - "designs.ts"
Cohesion: 0.16
Nodes (11): numberError(), InspectorProps, number(), Small(), WEIGHTS, Author, DESIGN_FORMAT, FrameLayer (+3 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 77 - "project_views.ts"
Cohesion: 0.22
Nodes (12): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), statusOf(), victoryOf() (+4 more)

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "branch_rules.ts"
Cohesion: 0.24
Nodes (10): SwitchResult, switchToTaskUseCase(), branchSlug(), count(), FILLER, holdReason(), parseShortstat(), noUpstream() (+2 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "t"
Cohesion: 0.06
Nodes (72): GROWS_AT, isClaudeOut(), Dragon(), Spinner(), GoldReward(), PriorityTag(), XpReward(), useWindowWidth() (+64 more)

### Community 82 - "refresh_app.sh"
Cohesion: 1.00
Nodes (3): refresh(), say(), refresh_app.sh script

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 89 - "start_api.spec.ts"
Cohesion: 0.07
Nodes (26): OutputSink, ProcessRequest, running, stopProcesses(), git(), NOW, onDisk(), run (+18 more)

### Community 90 - "board_tools.tsx"
Cohesion: 0.21
Nodes (13): BoardSection, Filters, Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel() (+5 more)

### Community 91 - "Part 4: the rest of the screens"
Cohesion: 0.22
Nodes (9): chronicle(), mana(), game(), 6. The app: frontend, backend and storage, Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools (+1 more)

### Community 92 - "history.spec.ts"
Cohesion: 0.36
Nodes (5): commit(), History, historyOf(), redo(), undo()

### Community 93 - "Architecture"
Cohesion: 0.09
Nodes (23): Acceptance criteria, Architecture, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release (+15 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "release_guard.mjs"
Cohesion: 0.43
Nodes (6): currentProvenance(), git(), releaseProblem(), root, run(), candidate

### Community 96 - "assistant_providers.ts"
Cohesion: 0.46
Nodes (4): assistantRepositoryOf(), assistantRepositoryImpl(), Reply, AssistantRepository

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "flavor.ts"
Cohesion: 0.50
Nodes (3): appIdOf(), Flavor, flavorOf()

### Community 102 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 104 - "GitState"
Cohesion: 0.57
Nodes (3): holdCommandOf(), holdKindOf(), GitState

### Community 105 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 106 - "update_watch.ts"
Cohesion: 0.53
Nodes (4): majorOf(), setup(), updateWatch(), WatchDeps

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

## Knowledge Gaps
- **6 isolated node(s):** `@types/node`, `electron-builder`, `jsdom`, `typescript`, `vite` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 838 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ref_node_fs`, `quests_page.tsx`, `t`, `realms_api.ts`, `first_run.tsx`, `ref_node_path`, `checkpoints.ts`, `palette.ts`, `game.ts`, `branch_api.ts`, `designs_page.tsx`, `design_editor.tsx`, `quest_flows.ts`, `designs_api.ts`, `en.ts`, `scope.ts`, `package.json`, `claude_code.ts`, `github_api.ts`, `new_quest_sheet.tsx`, `hud.tsx`, `branches.ts`, `settings_api.ts`, `app_menu.ts`, `start`, `finish_api.spec.ts`, `designs.spec.tsx`, `t`, `designs_api.spec.ts`, `start_api.spec.ts`, `history.spec.ts`, `release_guard.mjs`, `GitState`, `update_watch.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `electron-builder`, `jsdom` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.0471841704718417 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `start_api.spec.ts` to `ref_node_fs`, `realms_api.ts`, `record_source.ts`, `git_source.ts`, `checkpoints.ts`, `Workspace app, the rest of the road`, `tests/helpers.ts`, `game.ts`, `scope.ts`, `claude_code.ts`, `github_api.ts`, `ref_types`, `File Structure`, `start_api.ts`, `settings_api.ts`, `register.tsx`, `sessions.test.ts`, `designs_api.spec.ts`, `Architecture`, `Part B: the app`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `tasks_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10586811857229281 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `tests/helpers.ts` to `branch_api.ts`, `ref_node_fs`, `ui.test.tsx`, `Task 3: Entities and pure rules`, `feedback.e2e.ts`, `finish_api.spec.ts`, `realms_api.ts`, `scope.ts`, `record_source.ts`, `branch_workflow.e2e.ts`, `ref_node_path`, `tasks_controller.ts`, `4. Screens`, `designs_api.spec.ts`, `families.ts`, `band_host.tsx`, `start_api.spec.ts`, `game.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._