# Graph Report - notes-templates-pinned-notes  (2026-11-07)

## Corpus Check
- 537 files · ~498,357 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3396 nodes · 12382 edges · 127 communities (122 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 679 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ab1b3b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- notes.ts
- node_host.ts
- tasks_api.ts
- update_runner.mjs
- ref_types
- pages.e2e.ts
- designs_page.tsx
- workspace_store.ts
- opening_api.spec.ts
- tasks_controller.ts
- designs.ts
- check_prompt.ts
- first_run.tsx
- en.ts
- Queue-tea: design
- test_support.ts
- realms_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- judgements.spec.ts
- notes_page.tsx
- families.ts
- emptyRecord
- palette.ts
- band_host.tsx
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- states.tsx
- project_views.ts
- game.ts
- branch_api.ts
- App
- design_editor.tsx
- hoard_page.tsx
- Host
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
- time.ts
- app.tsx
- requests_controller.ts
- board.e2e.ts
- quest_detail.tsx
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- settings_page.tsx
- Queue-tea: panel redesign
- register.tsx
- engine_api.ts
- chronicle_page.tsx
- view_store.ts
- note_workspace.tsx
- commit-chai-n.md
- scope.ts
- flows.spec.tsx
- Queue-tea
- new_quest_sheet.tsx
- check_layers.mjs
- package.json
- chai-pter.md
- branch_workflow.e2e.ts
- notes_api.ts
- server.spec.ts
- Roadmap: the outside review, checked against the code
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- library_page.tsx
- design_forms.ts
- Queue-tea: workspace app
- Architecture
- Designs tab
- Part B: the app
- Queue-tea in Codex
- Branch workflow completion — 5 November 2026
- projects_api.spec.ts
- release_guard.d.mts
- Tea-concile
- fakeEngine
- Shared Types (Task 1 writes them; every task uses them)
- Task Log
- brew_quest.tsx
- helpers_api.spec.ts
- project_views.ts
- Notes
- Guild helpers on tasks
- Queue-tea, the workspace app
- ref_node_fs
- stream_process.ts
- queue_rules.ts
- main.tsx
- .line-check-NZS8Gw/tsconfig.json
- EngineApi
- quests_edits.spec.tsx
- ref_node_fs
- detail.spec.tsx
- Part 3: setting out and coming back
- A task's life
- What Rohan sees
- withDefaults
- Part 2: edits
- The record
- scene_view.tsx
- Roadmap: the outside review, checked against the code

## God Nodes (most connected - your core abstractions)
1. `t` - 102 edges
2. `Refusal` - 98 edges
3. `vitest` - 84 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `currentTask()` - 64 edges
7. `preact` - 62 edges
8. `Reply` - 58 edges
9. `EngineApi` - 58 edges
10. `scopeOf()` - 56 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `The note file` --references--> `created()`  [INFERRED]
  docs/notes.md → app/main/features/notes/api/notes_api.spec.ts
- `Behaviour` --references--> `fileQuest()`  [INFERRED]
  docs/design-tab.md → app/main/features/tasks/api/tasks_api.ts

## Import Cycles
- None detected.

## Communities (127 total, 5 thin omitted)

### Community 0 - "notes.ts"
Cohesion: 0.13
Nodes (24): body(), write(), isUntitled(), templateChange(), Props, ReadView(), backlinksOf(), firstParagraphOf() (+16 more)

### Community 1 - "node_host.ts"
Cohesion: 0.09
Nodes (18): attempt(), failed(), isForbiddenGit(), nodeHost(), host, log, DUNE, NOW (+10 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.09
Nodes (59): inGameWords(), Refusal, goBack(), lastNoteAt(), putBackQuest(), notYet(), retryTaskLog(), edit() (+51 more)

### Community 3 - "update_runner.mjs"
Cohesion: 0.11
Nodes (28): createLogger(), stackOf(), UPDATE_TEXT, request(), Deps, setup(), updateService(), majorOf() (+20 more)

### Community 4 - "ref_types"
Cohesion: 0.19
Nodes (17): Drafting a version for the Designs tab, How you work, What you don't do, What you report, NewQuest, QuestEdit, Task 2: Filing and editing carry the choice, How the choice reaches the record (+9 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "designs_page.tsx"
Cohesion: 0.07
Nodes (61): Content(), ask(), EngineRead, useEngineRead(), ReadView(), Failed(), Loading(), BRANCH_POLL_MS (+53 more)

### Community 7 - "workspace_store.ts"
Cohesion: 0.09
Nodes (19): open(), BOARD, FIRST, open(), SAGA, SECOND, BOARD, fail (+11 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.29
Nodes (11): canWrite(), installCommand(), openedFromUrl(), commandFileIn(), findCommand(), isOurs(), needsPath(), COMMAND_MARK (+3 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.13
Nodes (28): Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, helperToRemind(), markRemindedUseCase(), noteHelperUseCase(), setReviewUseCase(), ASKED, BACK_IN_BACKLOG() (+20 more)

### Community 10 - "designs.ts"
Cohesion: 0.12
Nodes (30): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+22 more)

### Community 11 - "check_prompt.ts"
Cohesion: 0.21
Nodes (13): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+5 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.12
Nodes (34): Dialog(), FieldProps, Group(), Pick(), NextVersionSheet(), Props, accountsIn(), hasAccounts() (+26 more)

### Community 13 - "en.ts"
Cohesion: 0.13
Nodes (16): folderName(), orderError(), withoutReview(), stepLine(), Named, QuestFlows, DIFFICULTIES, SheetProps (+8 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "test_support.ts"
Cohesion: 0.10
Nodes (24): memoryNotes(), ok(), open(), chronicle(), mana(), open(), game(), QUEST (+16 more)

### Community 16 - "realms_api.ts"
Cohesion: 0.09
Nodes (42): projectsFolder(), Logger, readChronicle(), GameDeps, readGame(), readHoard(), isProjectKey(), listProjects() (+34 more)

### Community 17 - "git_source.ts"
Cohesion: 0.17
Nodes (28): File Structure, Global Constraints, Queue-tea Implementation Plan, Review Focus, Task 8: The task flow, commitsBetween(), diffSince(), git() (+20 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (58): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+50 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.15
Nodes (17): fixtures, addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion() (+9 more)

### Community 20 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 21 - "notes_page.tsx"
Cohesion: 0.12
Nodes (26): captureOf(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY, localDay(), matches(), questLinesOf() (+18 more)

### Community 22 - "families.ts"
Cohesion: 0.21
Nodes (24): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), TypedVerdict, MoveResult, moveTaskUseCase(), activeFeature() (+16 more)

### Community 23 - "emptyRecord"
Cohesion: 0.06
Nodes (37): BUNDLE, git(), plist(), run, STAGE, record(), won(), NOW (+29 more)

### Community 24 - "palette.ts"
Cohesion: 0.13
Nodes (24): actions(), allQuests(), canRun(), entry(), filterPalette(), GO_TO, matchScore(), paletteEntries() (+16 more)

### Community 25 - "band_host.tsx"
Cohesion: 0.07
Nodes (53): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand() (+45 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.10
Nodes (32): Already built, 4.1 Home, 4.4 A task's detail: current, queued and done, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES() (+24 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (35): Task 1: the file seam, unixFiles(), View, shouldCheck(), projectRepositoryOf(), CTX, fakePorts(), makeTask() (+27 more)

### Community 29 - "states.tsx"
Cohesion: 0.13
Nodes (28): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), Spinner(), UpdateControl() (+20 more)

### Community 30 - "project_views.ts"
Cohesion: 0.14
Nodes (31): questOf(), 4.9 Back to queue, Blocked…, Move and Remove, What each screen reads from existing data, ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase(), keepActivity() (+23 more)

### Community 31 - "game.ts"
Cohesion: 0.14
Nodes (25): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+17 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (90): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+82 more)

### Community 33 - "App"
Cohesion: 0.08
Nodes (21): App(), ACCOUNTS, BOARD, input(), open(), KNOWN, NEW, open() (+13 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (41): commit(), History, historyOf(), redo(), undo(), Box, clamp(), copyWithIds() (+33 more)

### Community 35 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (19): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+11 more)

### Community 36 - "Host"
Cohesion: 0.05
Nodes (45): loadCodexContext(), HELP_COMMANDS, Host, addRow(), capital(), escapeCell(), HEAD, rowLine() (+37 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.17
Nodes (20): checkScene(), CommentsFile, isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+12 more)

### Community 39 - "makeTask"
Cohesion: 0.10
Nodes (11): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+3 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (34): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+26 more)

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
Cohesion: 0.20
Nodes (22): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+14 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "github_api.ts"
Cohesion: 0.11
Nodes (27): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+19 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.06
Nodes (33): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+25 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.08
Nodes (72): Features, The eight items, Task 10: `tasks`: the queue side, Task 11: `tasks`: the task's own cycle, once(), running, capital(), markFor() (+64 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.ts"
Cohesion: 0.12
Nodes (18): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+10 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.17
Nodes (8): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), DesignsView

### Community 53 - "time.ts"
Cohesion: 0.08
Nodes (39): Block, withBlock(), BlockResult, blockTaskUseCase(), Deps, FinishResult, finishTaskUseCase(), leaveCodexUseCase() (+31 more)

### Community 54 - "app.tsx"
Cohesion: 0.05
Nodes (50): ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), ACTIVITY_REFRESH_MS, AUTOSAVE_MS (+42 more)

### Community 55 - "requests_controller.ts"
Cohesion: 0.11
Nodes (33): 5. Features, shared resources and the core, Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, Ctx (+25 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "quest_detail.tsx"
Cohesion: 0.08
Nodes (35): LINES_REFRESH_MS, fileNamed(), FILES, frontmatter(), Helper, helperOf(), KINDS, LOGOS (+27 more)

### Community 58 - "host.ts"
Cohesion: 0.22
Nodes (13): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, parse(), Seen, seenIn() (+5 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): DEFAULT_LOG_PATH, logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening() (+9 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "register.tsx"
Cohesion: 0.08
Nodes (77): live(), The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core (+69 more)

### Community 64 - "engine_api.ts"
Cohesion: 0.08
Nodes (30): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+22 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.14
Nodes (33): clockTime(), dayAndTime(), dayName(), dayOf(), manaLeft(), refillTime(), NOW, weekdayIndex() (+25 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "note_workspace.tsx"
Cohesion: 0.15
Nodes (26): useWindowKeys(), brewLineOf(), folderError(), isInPlay(), linkLineOf(), linkOptionsOf(), linkQueryAt(), questLineOf() (+18 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "scope.ts"
Cohesion: 0.10
Nodes (39): GAME_WORDS, MESSAGES, reply(), HelpersApi, HelpersDeps, lineReader(), orderOf(), readMana() (+31 more)

### Community 70 - "flows.spec.tsx"
Cohesion: 0.09
Nodes (23): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+15 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "new_quest_sheet.tsx"
Cohesion: 0.10
Nodes (35): SheetView(), Field(), Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withPlayNext() (+27 more)

### Community 73 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 74 - "package.json"
Cohesion: 0.13
Nodes (14): author, description, license, main, name, private, productName, version (+6 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 77 - "notes_api.ts"
Cohesion: 0.16
Nodes (24): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+16 more)

### Community 78 - "server.spec.ts"
Cohesion: 0.08
Nodes (36): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+28 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.16
Nodes (5): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (78): GROWS_AT, HOLD_FILES_SHOWN, isClaudeOut(), Dragon(), GoldReward(), PriorityTag(), XpReward(), useWindowWidth() (+70 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.10
Nodes (20): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+12 more)

### Community 89 - "record_source.ts"
Cohesion: 0.10
Nodes (27): p, onDisk(), onDisk(), onDisk(), logged, NOW, onDisk(), seed() (+19 more)

### Community 90 - "library_page.tsx"
Cohesion: 0.19
Nodes (19): Answer, Empty(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError() (+11 more)

### Community 91 - "design_forms.ts"
Cohesion: 0.12
Nodes (24): colourError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, NextForm (+16 more)

### Community 92 - "Queue-tea: workspace app"
Cohesion: 0.22
Nodes (9): Acceptance criteria, Build order, for the plan, Checked, Decisions, In this release, Not in this release, Queue-tea: workspace app, Testing (+1 more)

### Community 93 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, One engine, two hosts, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented, Screens (+1 more)

### Community 95 - "Part B: the app"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 96 - "Queue-tea in Codex"
Cohesion: 0.25
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

### Community 101 - "fakeEngine"
Cohesion: 0.16
Nodes (18): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+10 more)

### Community 102 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.21
Nodes (12): Edit, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+4 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "brew_quest.tsx"
Cohesion: 0.15
Nodes (16): lineOf(), QuestLine, tickedItemsOf(), BrewSheet(), DIFFICULTIES, Errors, parentError(), PRIORITIES (+8 more)

### Community 105 - "helpers_api.spec.ts"
Cohesion: 0.14
Nodes (13): ProcessRequest, DONE, INIT, jobOf(), last(), NOW, ran(), READ (+5 more)

### Community 106 - "project_views.ts"
Cohesion: 0.20
Nodes (15): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), rowOf(), sessionInfoOf(), statusOf() (+7 more)

### Community 107 - "Notes"
Cohesion: 0.12
Nodes (15): Acceptance checks, Answered, Architecture, Behaviour, Decisions, Fields and their checks, Keys and focus, Not in Notes 1 (+7 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+2 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_fs"
Cohesion: 0.06
Nodes (28): esbuild, writeBundle(), hasChanged(), log, Stamps, stampsOf(), watchFolders(), WatchOptions (+20 more)

### Community 111 - "stream_process.ts"
Cohesion: 0.24
Nodes (9): OutputSink, running, log, stopProcesses(), streamProcess(), nodeUserGit(), UserGit, UserGitAction (+1 more)

### Community 112 - "queue_rules.ts"
Cohesion: 0.28
Nodes (8): Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), orderQueue(), PRIORITY_ORDER, removeTask(), setPriority(), suggestion()

### Community 113 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "EngineApi"
Cohesion: 0.20
Nodes (8): BOARD, FIRST, key(), open(), palette(), SECOND, Window, EngineApi

### Community 116 - "quests_edits.spec.tsx"
Cohesion: 0.18
Nodes (8): BOARD, CHOICES, FIRST, open(), SAGA, SECOND, BoardEntry, Choices

### Community 117 - "ref_node_fs"
Cohesion: 0.06
Nodes (19): APP, onDisk(), SEED, stored(), titled(), APP, FIRST, record() (+11 more)

### Community 118 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 119 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 120 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 121 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 122 - "withDefaults"
Cohesion: 0.25
Nodes (7): Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 1: The helper list and the record field, What's saved, fnv1a(), withDefaults()

### Community 123 - "Part 2: edits"
Cohesion: 0.29
Nodes (7): Part 2: edits, Review focus, Task 1: the engine's three additions, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working, FileInput

### Community 124 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 125 - "scene_view.tsx"
Cohesion: 0.70
Nodes (4): LayerView(), SceneThumb(), SceneView(), isFrame()

### Community 126 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.40
Nodes (5): Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code, This pass

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 941 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `engine_api.ts` to `notes.ts`, `node_host.ts`, `tasks_api.ts`, `update_runner.mjs`, `designs_page.tsx`, `workspace_store.ts`, `designs.ts`, `first_run.tsx`, `en.ts`, `test_support.ts`, `realms_api.ts`, `judgements.spec.ts`, `emptyRecord`, `palette.ts`, `game.ts`, `branch_api.ts`, `App`, `design_editor.tsx`, `designs_api.ts`, `sessions.test.ts`, `claude_code.ts`, `github_api.ts`, `library_api.ts`, `activity.ts`, `designs.spec.tsx`, `quest_detail.tsx`, `host.ts`, `chronicle_page.tsx`, `note_workspace.tsx`, `scope.ts`, `flows.spec.tsx`, `new_quest_sheet.tsx`, `package.json`, `server.spec.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `record_source.ts`, `library_page.tsx`, `design_forms.ts`, `projects_api.spec.ts`, `fakeEngine`, `helpers_api.spec.ts`, `ref_node_fs`, `stream_process.ts`, `EngineApi`, `quests_edits.spec.tsx`, `detail.spec.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `notes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `node_host.ts`, `realms_api.ts`, `judgements.spec.ts`, `families.ts`, `band_host.tsx`, `tests/helpers.ts`, `game.ts`, `branch_api.ts`, `Host`, `makeTask`, `menu_frame.tsx`, `sessions.test.ts`, `4. Screens`, `queue_controller.ts`, `time.ts`, `scope.ts`, `branch_workflow.e2e.ts`, `server.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `projects_api.spec.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `helpers_api.spec.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `node_host.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Why does `Queue-tea: workspace app UI design` connect `4. Screens` to `Roadmap: the outside review, checked against the code`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._