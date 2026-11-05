# Graph Report - queue-tea  (2026-11-03)

## Corpus Check
- 397 files · ~306,244 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 2520 nodes · 8952 edges · 93 communities (86 shown, 7 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 638 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bda7cc54`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- start_task.ts
- vitest
- tasks_api.ts
- workspace_store.ts
- Task 2: Filing and editing carry the choice
- quests_page.tsx
- t
- feedback.e2e.ts
- scope.ts
- tasks_controller.ts
- record_source.ts
- fixes.test.ts
- first_run.tsx
- shell.e2e.ts
- Queue-tea: design
- ref_types
- ports.ts
- git_source.ts
- main.ts
- version.test.mjs
- File Structure
- queue_controller.ts
- families.ts
- checkpoints.ts
- band_host.tsx
- view_store.ts
- game.ts
- hoard_page.tsx
- tests/helpers.ts
- palette.ts
- What each screen reads from existing data
- library_api.ts
- tasks_api.spec.ts
- Review Focus
- Plan: several quests in progress, each in its own worktree
- quest_flows.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- victory.ts
- queue_rules.ts
- menu_frame.tsx
- live_api.spec.ts
- flows.e2e.ts
- package.json
- claude_code.ts
- commit_guard.ts
- github_api.ts
- compilerOptions
- 4. Screens
- effort_tracker.ts
- devDependencies
- Roadmap: the outside review, checked against the code
- hud.tsx
- time.ts
- board.e2e.ts
- scripts
- Queue-tea architecture
- edits.e2e.ts
- Queue-tea: panel redesign
- register.tsx
- Part 3: setting out and coming back
- vitest
- Guild helpers on tasks
- commit-chai-n.md
- pages.e2e.ts
- Host
- Queue-tea
- ref_types
- chai-pter.md
- Repository Rules
- mocha-mockup.md
- tea-dd.md
- quests_page.tsx
- refresh_app.sh
- tsconfig.json
- install_app.sh
- judgements.spec.ts
- project_source.ts
- board_tools.tsx
- Architecture
- Queue-tea: workspace app
- first_window.e2e.ts
- detail_api.ts
- Queue-tea: workspace app UI design
- Task Log
- GitState
- Part B: the app
- update_watch.ts
- Queue-tea, the workspace app
- Part A: the mod

## God Nodes (most connected - your core abstractions)
1. `t` - 72 edges
2. `emptyRecord()` - 67 edges
3. `currentTask()` - 62 edges
4. `Refusal` - 57 edges
5. `vitest` - 54 edges
6. `reply()` - 51 edges
7. `App()` - 49 edges
8. `formatMinutes()` - 49 edges
9. `What each screen reads from existing data` - 49 edges
10. `Reply` - 43 edges

## Surprising Connections (you probably didn't know these)
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts
- `1. The shape of the mod` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `2. Rules` --references--> `Ports`  [INFERRED]
  docs/architecture.md → hooks/core/ports/ports.ts
- `Tests` --references--> `helperToRemind()`  [INFERRED]
  docs/superpowers/specs/2026-11-03-guild-helpers-on-tasks-design.md → hooks/features/tasks/domain/services/task_rules.ts

## Import Cycles
- None detected.

## Communities (93 total, 7 thin omitted)

### Community 0 - "start_task.ts"
Cohesion: 0.27
Nodes (7): withBlock(), BlockResult, blockTaskUseCase(), setFeatureUseCase(), StartResult, wouldLoop(), Saved

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (57): BUNDLE, git(), plist(), run, STAGE, appIdOf(), Flavor, flavorOf() (+49 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.09
Nodes (64): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+56 more)

### Community 3 - "workspace_store.ts"
Cohesion: 0.12
Nodes (21): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, GROWS_AT, HOME_BADGES, HOME_BOARD_ROWS, PET_MS, SAVED_MS, SKY_CHECK_MS (+13 more)

### Community 4 - "Task 2: Filing and editing carry the choice"
Cohesion: 0.19
Nodes (15): fileNamed(), FILES, frontmatter(), Helper, helperOf(), KINDS, LOGOS, Task 2: Filing and editing carry the choice (+7 more)

### Community 5 - "quests_page.tsx"
Cohesion: 0.06
Nodes (81): useEngineRead(), LINES_REFRESH_MS, clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), refillTime() (+73 more)

### Community 6 - "t"
Cohesion: 0.06
Nodes (83): Content(), SheetView(), Answer, ask(), EngineRead, DEFAULT_LOG_PATH, XP_BY_DIFFICULTY, Dialog() (+75 more)

### Community 7 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (12): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), realm(), won() (+4 more)

### Community 8 - "scope.ts"
Cohesion: 0.10
Nodes (55): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+47 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (67): Features, Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, Task 6: Docs, the real session check and every check (+59 more)

### Community 10 - "record_source.ts"
Cohesion: 0.16
Nodes (25): canRestoreFrom(), onDisk(), onDisk(), onDisk(), Task 1: The helper list and the record field, Data, 7. Acceptance criteria, New fields (+17 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.19
Nodes (14): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+6 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.12
Nodes (36): HOLD_FILES_SHOWN, Spinner(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT (+28 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (42): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+34 more)

### Community 15 - "ref_types"
Cohesion: 0.15
Nodes (28): Order to fix them, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand(), showBand(), TypedVerdict (+20 more)

### Community 16 - "ports.ts"
Cohesion: 0.10
Nodes (43): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, MenuSpec, Ports, SessionUsage, running, pad() (+35 more)

### Community 17 - "git_source.ts"
Cohesion: 0.19
Nodes (27): File Structure, Task 8: The task flow, Already built, commitsBetween(), diffSince(), git(), lastCommit(), listBranches() (+19 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (55): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+47 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.10
Nodes (29): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+21 more)

### Community 20 - "File Structure"
Cohesion: 0.17
Nodes (12): held(), hold(), Global Constraints, Queue-tea Implementation Plan, Review Focus, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order (+4 more)

### Community 21 - "queue_controller.ts"
Cohesion: 0.17
Nodes (30): The eight items, Task 10: `tasks`: the queue side, KEYS, togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand(), parentFor(), blockTask() (+22 more)

### Community 22 - "families.ts"
Cohesion: 0.18
Nodes (29): readChoices(), 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult (+21 more)

### Community 23 - "checkpoints.ts"
Cohesion: 0.15
Nodes (21): 4.1 Home, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines() (+13 more)

### Community 24 - "band_host.tsx"
Cohesion: 0.11
Nodes (25): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+17 more)

### Community 25 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 26 - "game.ts"
Cohesion: 0.06
Nodes (44): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+36 more)

### Community 27 - "hoard_page.tsx"
Cohesion: 0.10
Nodes (24): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+16 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.09
Nodes (25): CTX, fakePorts(), makeTask(), memoryHost(), Run, current(), setup(), codexLog() (+17 more)

### Community 29 - "palette.ts"
Cohesion: 0.05
Nodes (59): ContentProps, MORE_PAGES, SheetProps, TABS, ALL, Route, routeOf(), ROUTES (+51 more)

### Community 30 - "What each screen reads from existing data"
Cohesion: 0.13
Nodes (37): activeOf(), difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf(), statusOf() (+29 more)

### Community 31 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 32 - "tasks_api.spec.ts"
Cohesion: 0.25
Nodes (5): logged, NOW, onDisk(), seed(), stored()

### Community 33 - "Review Focus"
Cohesion: 0.25
Nodes (8): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check

### Community 34 - "Plan: several quests in progress, each in its own worktree"
Cohesion: 0.29
Nodes (7): Decided, Plan: several quests in progress, each in its own worktree, Steps, once the open questions are answered, Still open, The design so far, What phase 1 leaves for this phase, What Rohan wants

### Community 35 - "quest_flows.ts"
Cohesion: 0.10
Nodes (30): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withoutReview(), withPlayNext(), withPriority() (+22 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.10
Nodes (15): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+7 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.12
Nodes (27): Edit, Task 3: Entities and pure rules, Task 2: The record, Task 5: Time and effort, Task 7: The message check, Task 3: edits in the window, Allowance, Band (+19 more)

### Community 38 - "victory.ts"
Cohesion: 0.60
Nodes (5): xpOf(), isSagaWon(), kindOf(), newBadges(), victoryOf()

### Community 39 - "queue_rules.ts"
Cohesion: 0.18
Nodes (14): Audit: what the menu exposes of the engine, Problems not on the list, Task 10: The panel, the band, the status line and the commands, One engine, two hosts, fileTaskUseCase(), removeTaskUseCase(), setPriorityUseCase(), defaultHelpers() (+6 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (37): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+29 more)

### Community 41 - "live_api.spec.ts"
Cohesion: 0.20
Nodes (13): budgets, setBudget(), mismatchOf(), readLive(), setTimeBudget(), data(), facts(), git() (+5 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.16
Nodes (8): APP, change(), editTask(), git(), noRequests(), onDisk(), run, stored()

### Community 43 - "package.json"
Cohesion: 0.09
Nodes (18): author, description, license, main, name, private, productName, version (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.11
Nodes (30): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+22 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.11
Nodes (24): GithubApi, GithubDeps, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf(), isGithubLogin() (+16 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.12
Nodes (17): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+9 more)

### Community 49 - "effort_tracker.ts"
Cohesion: 0.26
Nodes (11): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+3 more)

### Community 50 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, @playwright/test (+7 more)

### Community 51 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 52 - "hud.tsx"
Cohesion: 0.17
Nodes (21): hrefOf(), manaLeft(), isStreakAtRisk(), laterHook(), Momentum, momentumOf(), nearestBadge(), QuestAhead (+13 more)

### Community 53 - "time.ts"
Cohesion: 0.08
Nodes (39): Ctx, Env, addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE (+31 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+3 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 5. Features, shared resources and the core, 7. Tests, 8. Getting there (+2 more)

### Community 61 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.08
Nodes (65): live(), The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, drawCup(), renderBand(), stillCup() (+57 more)

### Community 65 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 66 - "vitest"
Cohesion: 0.03
Nodes (90): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+82 more)

### Community 67 - "Guild helpers on tasks"
Cohesion: 0.13
Nodes (19): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+11 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 70 - "Host"
Cohesion: 0.12
Nodes (26): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+18 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "ref_types"
Cohesion: 0.07
Nodes (23): record(), won(), NOW, record(), won(), NOW, record(), record() (+15 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 78 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 79 - "mocha-mockup.md"
Cohesion: 0.50
Nodes (3): How you work, What you don't do, What you report

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.10
Nodes (36): useWindowWidth(), metaOf(), openRow(), plain(), Row, rowsOf(), stepFrom(), withWholeSagas() (+28 more)

### Community 82 - "refresh_app.sh"
Cohesion: 1.00
Nodes (3): refresh(), say(), refresh_app.sh script

### Community 86 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 89 - "project_source.ts"
Cohesion: 0.24
Nodes (11): readProjectPlace(), carryOverRecords(), recordPath(), projectRepositoryImpl(), ProjectPlace, ProjectRepository, RecordsRepository, projectRepositoryOf() (+3 more)

### Community 90 - "board_tools.tsx"
Cohesion: 0.21
Nodes (13): BoardSection, Filters, Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel() (+5 more)

### Community 93 - "Architecture"
Cohesion: 0.20
Nodes (10): Architecture, Opening on a project, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The engine API, Updating while open (+2 more)

### Community 94 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 97 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 101 - "detail_api.ts"
Cohesion: 0.42
Nodes (8): activeOf(), branchToBe(), gitOf(), linesSince(), quietly(), readQuestFacts(), Scope, ManaLines

### Community 102 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 104 - "GitState"
Cohesion: 0.57
Nodes (3): holdCommandOf(), holdKindOf(), GitState

### Community 105 - "Part B: the app"
Cohesion: 0.22
Nodes (9): Global constraints, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 7: the project, Task 9: the game rules (+1 more)

### Community 106 - "update_watch.ts"
Cohesion: 0.53
Nodes (4): majorOf(), setup(), updateWatch(), WatchDeps

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.40
Nodes (5): Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "Part A: the mod"
Cohesion: 0.29
Nodes (7): Part A: the mod, Task 1: the file seam, Task 2: the new record fields, Task 4: `review`, Task 5: requests, Task 6: Open in Queue-tea app, unixFiles()

## Knowledge Gaps
- **6 isolated node(s):** `@types/node`, `electron-builder`, `jsdom`, `typescript`, `vite` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `vitest`, `quests_page.tsx`, `t`, `first_run.tsx`, `main.ts`, `game.ts`, `palette.ts`, `library_api.ts`, `tasks_api.spec.ts`, `quest_flows.ts`, `live_api.spec.ts`, `package.json`, `claude_code.ts`, `github_api.ts`, `hud.tsx`, `ref_types`, `quests_page.tsx`, `judgements.spec.ts`, `GitState`, `update_watch.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/node`, `electron-builder`, `jsdom` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.039926739926739924 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `scope.ts` to `vitest`, `Host`, `queue_rules.ts`, `Part B: the app`, `record_source.ts`, `claude_code.ts`, `tests/helpers.ts`, `github_api.ts`, `Part A: the mod`, `ports.ts`, `git_source.ts`, `time.ts`, `project_source.ts`, `game.ts`, `library_api.ts`, `Queue-tea: workspace app`, `register.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `currentTask()` (e.g. with `Steps, once the open questions are answered` and `The design so far`) actually correct?**
  _`currentTask()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `tasks_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09249786871270248 - nodes in this community are weakly interconnected._