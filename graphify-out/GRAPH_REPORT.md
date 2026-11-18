# Graph Report - main-integration  (2026-11-18)

## Corpus Check
- 593 files · ~567,334 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3796 nodes · 13702 edges · 137 communities (132 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 732 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d4c3ea0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- vitest
- finish_api.spec.ts
- Refusal
- designs_api.spec.ts
- File Structure
- notes_page.tsx
- ref_types
- opening_api.ts
- tasks_controller.ts
- quest_detail.tsx
- start_api.ts
- first_run.tsx
- engine_api.ts
- Queue-tea: design
- fixes.test.ts
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- hoard_page.tsx
- quest_keys.ts
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 4: the rest of the screens
- checkpoints.ts
- tests/helpers.ts
- board_tools.tsx
- git_rules.spec.ts
- sessions.test.ts
- branch_api.ts
- workspace_store.ts
- scene_edits.ts
- design_forms.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- start_api.spec.ts
- menu_frame.tsx
- checks_api.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- ranking.ts
- compilerOptions
- Notes: the knowledge graph view
- queue_controller.ts
- library_api.ts
- Features
- branch_workflow.e2e.ts
- t
- hud.tsx
- 4. Screens
- board.e2e.ts
- server.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- ref_node_path
- Queue-tea: panel redesign
- game.ts
- messages.ts
- chronicle_page.tsx
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- cup_mood.ts
- Queue-tea
- workspace_store.ts
- setup.ts
- package.json
- chai-pter.md
- project_views.ts
- pages.e2e.ts
- card_note.ts
- design_editor.tsx
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- scope.ts
- Merge-check dependency setup
- update.ts
- Architecture
- helpers_api.spec.ts
- Designs tab
- band_host.tsx
- mana.ts
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- file_task.ts
- Notes
- reply
- Task Log
- Workspace app, the rest of the road
- Shared Types (Task 1 writes them; every task uses them)
- note_attachments.ts
- Part A: the mod
- designs.ts
- workspace-app.md
- bundle.ts
- settings_page.tsx
- Part 3: setting out and coming back
- workspace-app.md
- .line-check-NZS8Gw/tsconfig.json
- session_rhythm.ts
- app_menu.ts
- record_source.ts
- Part 2: edits
- projects_api.spec.ts
- Queue-tea: workspace app
- first_window.e2e.ts
- designs.spec.tsx
- Queue-tea, the workspace app
- codex_providers.ts
- start_task.ts
- daily_notes.e2e.ts
- Tea-concile
- Review focus
- start
- main.tsx
- victory.ts
- Repository Rules
- activity.ts
- guild.e2e.ts
- overrides
- NoteMode

## God Nodes (most connected - your core abstractions)
1. `t` - 113 edges
2. `Refusal` - 108 edges
3. `vitest` - 106 edges
4. `emptyRecord()` - 81 edges
5. `reply()` - 74 edges
6. `EngineApi` - 71 edges
7. `preact` - 69 edges
8. `Reply` - 65 edges
9. `currentTask()` - 64 edges
10. `ask()` - 60 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts
- `Keys` --references--> `d()`  [INFERRED]
  docs/spec.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (137 total, 5 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.08
Nodes (59): body(), write(), dayOf(), brewLineOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup (+51 more)

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (54): log, createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+46 more)

### Community 2 - "finish_api.spec.ts"
Cohesion: 0.06
Nodes (38): BUNDLE, git(), plist(), run, STAGE, record(), won(), NOW (+30 more)

### Community 3 - "Refusal"
Cohesion: 0.11
Nodes (52): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+44 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (17): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+9 more)

### Community 5 - "File Structure"
Cohesion: 0.28
Nodes (12): File Structure, Task 9: Keeping usage down, formatAllowance(), pad(), readAllowance(), shouldFresh(), shouldHandoff(), windowKey() (+4 more)

### Community 6 - "notes_page.tsx"
Cohesion: 0.05
Nodes (90): SheetView(), ask(), AttachmentInput(), bytesOf(), Props, State, Dialog(), Field() (+82 more)

### Community 7 - "ref_types"
Cohesion: 0.08
Nodes (49): Problems not on the list, Task 10: The panel, the band, the status line and the commands, Ctx, Env, Block, withBlock(), BlockResult, Deps (+41 more)

### Community 8 - "opening_api.ts"
Cohesion: 0.20
Nodes (14): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+6 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.09
Nodes (45): Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, helperToRemind(), markRemindedUseCase(), noteHelperUseCase(), setReviewUseCase(), ASKED, BACK_IN_BACKLOG() (+37 more)

### Community 10 - "quest_detail.tsx"
Cohesion: 0.10
Nodes (30): dayAndTime(), NoteAttachment(), Props, State, ActiveDetail(), Facts(), NotCommitted(), Props (+22 more)

### Community 11 - "start_api.ts"
Cohesion: 0.18
Nodes (20): isSessionOpen(), checkStart(), continueIn(), goneSentence(), handOver(), holdOf(), needFolder(), openClaude() (+12 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.13
Nodes (30): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+22 more)

### Community 13 - "engine_api.ts"
Cohesion: 0.06
Nodes (56): Answer, BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError(), FORM (+48 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "fixes.test.ts"
Cohesion: 0.08
Nodes (45): Order to fix them, Task 9: `conversation` and `message_check`, drawQuestion(), closeBand(), showBand(), checkMessage(), checkRepositoryImpl(), replyOf() (+37 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.11
Nodes (24): GithubApi, GithubDeps, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf(), isGithubLogin() (+16 more)

### Community 17 - "git_source.ts"
Cohesion: 0.17
Nodes (26): Task 8: The task flow, SwitchResult, switchToTaskUseCase(), commitsBetween(), diffSince(), git(), lastCommit(), listBranches() (+18 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (46): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+38 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.10
Nodes (30): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+22 more)

### Community 20 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (17): STAGE_SCALE, Coins(), EggArt(), MEDALS, StageArt(), FIRST_LEVEL, STAGES, stageState() (+9 more)

### Community 21 - "quest_keys.ts"
Cohesion: 0.23
Nodes (13): isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, menuKey(), PRIORITY_KEYS, questKeyOf() (+5 more)

### Community 22 - "families.ts"
Cohesion: 0.18
Nodes (27): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult, moveTaskUseCase() (+19 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.07
Nodes (67): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+59 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.22
Nodes (9): chronicle(), mana(), game(), 6. The app: frontend, backend and storage, Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools (+1 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.13
Nodes (21): Already built, 4.1 Home, CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), commandRun(), count(), firstMessage() (+13 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (31): findNewCommits(), commitGuardState, commitWarning(), projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost() (+23 more)

### Community 29 - "board_tools.tsx"
Cohesion: 0.21
Nodes (13): BoardSection, Filters, Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel() (+5 more)

### Community 30 - "git_rules.spec.ts"
Cohesion: 0.18
Nodes (11): OutputSink, streamProcess(), nodeUserGit(), UserGit, UserGitAction, graphLayout(), BranchGraph(), FORK (+3 more)

### Community 31 - "sessions.test.ts"
Cohesion: 0.27
Nodes (11): Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository, HEARTBEAT_MS, parseSession() (+3 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.10
Nodes (69): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+61 more)

### Community 33 - "workspace_store.ts"
Cohesion: 0.03
Nodes (126): App(), open(), BOARD, FIRST, open(), SAGA, SECOND, click() (+118 more)

### Community 34 - "scene_edits.ts"
Cohesion: 0.10
Nodes (33): numberError(), Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, layerOf() (+25 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.12
Nodes (34): colourError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors, NextField (+26 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.13
Nodes (32): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+24 more)

### Community 39 - "start_api.spec.ts"
Cohesion: 0.17
Nodes (5): git(), NOW, onDisk(), run, seed()

### Community 40 - "menu_frame.tsx"
Cohesion: 0.17
Nodes (31): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu() (+23 more)

### Community 41 - "checks_api.ts"
Cohesion: 0.11
Nodes (25): executing, runMergeChecks(), CheckDefinition, checksFile(), checksPassed(), discoverChecks(), readChecks(), saveChecks() (+17 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.21
Nodes (21): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+13 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "ranking.ts"
Cohesion: 0.17
Nodes (21): 4.9 Back to queue, Blocked…, Move and Remove, blockersOf(), budgetLabel(), BUDGETS, canWaitFor(), DEFAULT_MINUTES, effectivePriority(), estimateMinutes() (+13 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.11
Nodes (51): The eight items, Task 10: `tasks`: the queue side, Task 11: `tasks`: the task's own cycle, capital(), markFor(), KEYS, removeTaskUseCase(), setPriorityUseCase() (+43 more)

### Community 50 - "library_api.ts"
Cohesion: 0.23
Nodes (18): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+10 more)

### Community 51 - "Features"
Cohesion: 0.19
Nodes (20): live(), 5. Features, shared resources and the core, Features, Task 6: `commit_guard` and `errands`, runErrand(), Errand, ERRAND_NOT_SENT, ErrandKind (+12 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "t"
Cohesion: 0.11
Nodes (28): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+20 more)

### Community 54 - "hud.tsx"
Cohesion: 0.07
Nodes (46): ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), ALL, hrefOf() (+38 more)

### Community 55 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.ts"
Cohesion: 0.23
Nodes (11): files, skill(), skills, workflows, CODEX_LIMITS, CODEX_TEXT, codexOperations(), CodexRefusal (+3 more)

### Community 58 - "host.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "ref_node_path"
Cohesion: 0.03
Nodes (62): APP, errors, PNG, APP, paste(), APP, errors, APP (+54 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "game.ts"
Cohesion: 0.19
Nodes (18): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+10 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.11
Nodes (35): clockTime(), dayName(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex(), weekdayOf() (+27 more)

### Community 66 - "view_store.ts"
Cohesion: 0.06
Nodes (32): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+24 more)

### Community 67 - "File Structure"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.05
Nodes (67): GRAPH_LABEL_CHARS, aroundOf(), GraphEdge, GraphFilter, GraphNode, GraphNodeKind, graphOf(), GraphSteps (+59 more)

### Community 70 - "cup_mood.ts"
Cohesion: 0.15
Nodes (19): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+11 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "workspace_store.ts"
Cohesion: 0.06
Nodes (39): ACTIVITY_REFRESH_MS, DRAG_SLOP_PX, GRAPH_CHARGE, GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_GRAVITY, GRAPH_HIT_PX, GRAPH_LABEL_ZOOM (+31 more)

### Community 73 - "setup.ts"
Cohesion: 0.26
Nodes (13): main(), codexSkills(), companionSkills(), helperDefinition(), helperInstructions(), createCodexServer(), codexConfigArgs(), CodexRuntime (+5 more)

### Community 74 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "project_views.ts"
Cohesion: 0.22
Nodes (17): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+9 more)

### Community 77 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 78 - "card_note.ts"
Cohesion: 0.46
Nodes (7): What each screen reads from existing data, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote()

### Community 79 - "design_editor.tsx"
Cohesion: 0.14
Nodes (25): AUTOSAVE_MS, commit(), History, historyOf(), redo(), undo(), handlesOf(), parentOf() (+17 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.06
Nodes (72): DETAIL_FLOATS_BELOW, Dragon(), GoldReward(), PriorityTag(), XpReward(), Board(), Glory(), HomePage() (+64 more)

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
Cohesion: 0.09
Nodes (39): projectsFolder(), Logger, GAME_WORDS, MESSAGES, GameDeps, Login, isProjectKey(), ProjectsDeps (+31 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.33
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "update.ts"
Cohesion: 0.20
Nodes (10): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, AppUpdate, changedBuild(), UpdatePhase (+2 more)

### Community 92 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 93 - "helpers_api.spec.ts"
Cohesion: 0.14
Nodes (13): ProcessRequest, ProcessResult, running, DONE, INIT, jobOf(), last(), NOW (+5 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "band_host.tsx"
Cohesion: 0.10
Nodes (44): The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core, drawCup() (+36 more)

### Community 96 - "mana.ts"
Cohesion: 0.24
Nodes (15): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+7 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "file_task.ts"
Cohesion: 0.10
Nodes (28): Drafting a version for the Designs tab, How you work, What you don't do, What you report, NewQuest, QuestEdit, Task 2: Filing and editing carry the choice, Acceptance criteria (+20 more)

### Community 101 - "Notes"
Cohesion: 0.10
Nodes (20): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+12 more)

### Community 102 - "reply"
Cohesion: 0.13
Nodes (35): reply(), cancelMergeChecks(), readCodexSession(), Observation, observeTask(), readChronicle(), readGame(), readHoard() (+27 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 105 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.18
Nodes (14): Read, held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record, Task 3: Reading git and making branches (+6 more)

### Community 106 - "note_attachments.ts"
Cohesion: 0.24
Nodes (13): formatOf(), noteFiles(), attachmentError(), attachmentMarkdown(), extensionOf(), NOTE_ATTACHMENTS, NOTE_FILE_ACCEPT, NOTE_FILE_LIMIT (+5 more)

### Community 107 - "Part A: the mod"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 108 - "designs.ts"
Cohesion: 0.16
Nodes (14): commentError(), CommentRow(), CommentsPanel(), Props, Approval, Author, CommentInput, DESIGN_FORMAT (+6 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.13
Nodes (11): Audit: what the menu exposes of the engine, 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing (+3 more)

### Community 110 - "bundle.ts"
Cohesion: 0.22
Nodes (10): commitOfProvenance(), isNumber(), relaunchArgv(), Restored, restoredOf(), versionOfPlist(), installedBuild(), restart() (+2 more)

### Community 111 - "settings_page.tsx"
Cohesion: 0.10
Nodes (36): Content(), EngineRead, open(), pending(), useEngineRead(), DEFAULT_LOG_PATH, ReadView(), BRANCH_POLL_MS (+28 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "workspace-app.md"
Cohesion: 0.15
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "session_rhythm.ts"
Cohesion: 0.10
Nodes (47): Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, pressOpenApp(), clearCrashed(), endBeat() (+39 more)

### Community 116 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 117 - "record_source.ts"
Cohesion: 0.06
Nodes (40): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+32 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "projects_api.spec.ts"
Cohesion: 0.22
Nodes (6): logged, NOW, put(), putRecord(), read(), record()

### Community 120 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 121 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 122 - "designs.spec.tsx"
Cohesion: 0.11
Nodes (17): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), NUDGE_PX, Badge() (+9 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "codex_providers.ts"
Cohesion: 0.24
Nodes (8): codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl(), CodexRepository, codexLog(), NOW, SINCE

### Community 125 - "start_task.ts"
Cohesion: 0.53
Nodes (8): ParallelDeps, startParallelTaskUseCase(), StartResult, startTaskUseCase(), keepActivity(), blockedText(), isBlocked(), slugBranch()

### Community 126 - "daily_notes.e2e.ts"
Cohesion: 0.40
Nodes (5): APP, at, errors, fileTitled(), notesDir()

### Community 127 - "Tea-concile"
Cohesion: 0.25
Nodes (7): 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 128 - "Review focus"
Cohesion: 0.29
Nodes (6): ran(), untilStopped(), Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 6: Docs, the real session check and every check

### Community 129 - "start"
Cohesion: 0.40
Nodes (6): checkJudgements, checkUpdate, handle(), sendMenu(), start(), tellWindows()

### Community 130 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 131 - "victory.ts"
Cohesion: 0.70
Nodes (4): isSagaWon(), kindOf(), newBadges(), victoryOf()

### Community 132 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 135 - "activity.ts"
Cohesion: 0.14
Nodes (15): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+7 more)

### Community 141 - "guild.e2e.ts"
Cohesion: 0.18
Nodes (7): APP, event(), plantClaude(), APP, errors, noteFiles(), notesDir()

### Community 143 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

### Community 144 - "NoteMode"
Cohesion: 0.67
Nodes (3): NoteMode, Global Constraints, Notes knowledge graph view Implementation Plan

## Knowledge Gaps
- **7 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1077 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `finish_api.spec.ts`, `designs_api.spec.ts`, `notes_page.tsx`, `opening_api.ts`, `quest_detail.tsx`, `start_api.ts`, `first_run.tsx`, `engine_api.ts`, `settings_api.ts`, `notes_api.ts`, `git_rules.spec.ts`, `branch_api.ts`, `workspace_store.ts`, `scene_edits.ts`, `design_forms.ts`, `designs_api.spec.ts`, `start_api.spec.ts`, `checks_api.ts`, `claude_code.ts`, `library_api.ts`, `t`, `hud.tsx`, `host.ts`, `ref_node_path`, `game.ts`, `messages.ts`, `chronicle_page.tsx`, `note_graph_view.tsx`, `setup.ts`, `package.json`, `design_editor.tsx`, `quests_page.tsx`, `notes_backup.spec.ts`, `scope.ts`, `update.ts`, `helpers_api.spec.ts`, `note_attachments.ts`, `settings_page.tsx`, `app_menu.ts`, `projects_api.spec.ts`, `designs.spec.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08302485457429931 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `scope.ts` to `vitest`, `designs_api.spec.ts`, `opening_api.ts`, `start_api.ts`, `settings_api.ts`, `git_source.ts`, `tests/helpers.ts`, `sessions.test.ts`, `start_api.spec.ts`, `claude_code.ts`, `library_api.ts`, `File Structure`, `helpers_api.spec.ts`, `band_host.tsx`, `Workspace app, the rest of the road`, `Part A: the mod`, `session_rhythm.ts`, `record_source.ts`, `Queue-tea: workspace app`, `codex_providers.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.04377564979480164 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._