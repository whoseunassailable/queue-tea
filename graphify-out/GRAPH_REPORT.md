# Graph Report - main-integration  (2026-11-18)

## Corpus Check
- 593 files · ~567,377 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3797 nodes · 13703 edges · 143 communities (137 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 732 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `36d1efa8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- core/logger.ts
- finish_api.spec.ts
- Refusal
- designs_api.spec.ts
- vitest
- en.ts
- ref_types
- opening_api.ts
- tasks_controller.ts
- quest_detail.tsx
- GitState
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
- notes.ts
- checks_api.spec.ts
- sessions.test.ts
- branch_api.ts
- createWorkspace
- inspector.tsx
- design_forms.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- start_api.spec.ts
- menu_frame.tsx
- dependency_setup.ts
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
- hud.tsx
- 4. Screens
- board.e2e.ts
- operations.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- ref_node_fs
- Queue-tea: panel redesign
- game.ts
- messages.ts
- formatMinutes
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- cup_mood.ts
- Queue-tea
- workspace_store.ts
- fakeEngine
- package.json
- chai-pter.md
- filing_controller.ts
- pages.e2e.ts
- designs_api.ts
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
- register.tsx
- mana.ts
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Task 2: Filing and editing carry the choice
- Notes
- settings.spec.tsx
- Task Log
- Part 5: an app you can install
- Shared Types (Task 1 writes them; every task uses them)
- note_attachments.ts
- settings_page.tsx
- requests.test.ts
- workspace-app.md
- quest_flows.spec.ts
- ask
- Part 3: setting out and coming back
- workspace-app.md
- .line-check-NZS8Gw/tsconfig.json
- ports.ts
- app_menu.ts
- record_source.ts
- Part 2: edits
- test_support.ts
- check_layers.mjs
- flows.spec.tsx
- designs.spec.tsx
- Queue-tea, the workspace app
- shell.spec.tsx
- feedback.spec.tsx
- description_files.spec.tsx
- effort_tracker.ts
- Guild helpers on tasks
- time.ts
- main.tsx
- board.spec.tsx
- detail.spec.tsx
- A task's life
- What Rohan sees
- activity.ts
- Queue-tea in Codex
- description_files.ts
- orderQueue
- The record
- electron
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

## Communities (143 total, 6 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (72): brewLineOf(), captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderNameError(), foldersOf() (+64 more)

### Community 1 - "core/logger.ts"
Cohesion: 0.05
Nodes (33): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+25 more)

### Community 2 - "finish_api.spec.ts"
Cohesion: 0.06
Nodes (38): BUNDLE, git(), plist(), run, STAGE, record(), won(), NOW (+30 more)

### Community 3 - "Refusal"
Cohesion: 0.08
Nodes (77): inGameWords(), Refusal, HelpersApi, setBudget(), activeTask(), goBack(), lastNoteAt(), putBackNow() (+69 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 5 - "vitest"
Cohesion: 0.09
Nodes (33): esbuild, writeBundle(), run, Deps, setup(), updateService(), exec, APP (+25 more)

### Community 6 - "en.ts"
Cohesion: 0.06
Nodes (56): Answer, DEFAULT_LOG_PATH, Dialog(), Props, State, Empty(), useWindowKeys(), Props (+48 more)

### Community 7 - "ref_types"
Cohesion: 0.06
Nodes (59): ctx, One engine, two hosts, Ctx, Env, Block, withBlock(), BlockResult, blockTaskUseCase() (+51 more)

### Community 8 - "opening_api.ts"
Cohesion: 0.26
Nodes (12): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+4 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (59): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, helperToRemind(), markRemindedUseCase() (+51 more)

### Community 10 - "quest_detail.tsx"
Cohesion: 0.10
Nodes (39): AttachmentInput(), bytesOf(), Props, State, Field(), FieldProps, Pick(), NoteAttachment() (+31 more)

### Community 11 - "GitState"
Cohesion: 0.43
Nodes (3): Task 3: Reading git and making branches, GitState, fakeGit()

### Community 12 - "first_run.tsx"
Cohesion: 0.15
Nodes (28): Group(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+20 more)

### Community 13 - "engine_api.ts"
Cohesion: 0.05
Nodes (80): App(), ContentProps, moodOf(), MORE_PAGES, SheetProps, SheetView(), TABS, useHour() (+72 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "fixes.test.ts"
Cohesion: 0.11
Nodes (29): Task 9: `conversation` and `message_check`, drawQuestion(), Ask, closeBand(), checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository (+21 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.11
Nodes (26): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+18 more)

### Community 17 - "git_source.ts"
Cohesion: 0.17
Nodes (28): File Structure, Task 8: The task flow, Already built, SwitchResult, switchToTaskUseCase(), commitsBetween(), diffSince(), git() (+20 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (60): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+52 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.15
Nodes (17): fixtures, addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion() (+9 more)

### Community 20 - "hoard_page.tsx"
Cohesion: 0.13
Nodes (18): Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES, stageState() (+10 more)

### Community 21 - "quest_keys.ts"
Cohesion: 0.25
Nodes (12): isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, PRIORITY_KEYS, questKeyOf(), useQuestKeys() (+4 more)

### Community 22 - "families.ts"
Cohesion: 0.19
Nodes (25): readChoices(), 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage(), TypedVerdict, MoveResult, moveTaskUseCase(), activeFeature() (+17 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.16
Nodes (22): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), creates(), entry(), filterPalette(), GO_TO (+14 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.08
Nodes (45): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+37 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.40
Nodes (5): Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window

### Community 27 - "checkpoints.ts"
Cohesion: 0.14
Nodes (24): 4.1 Home, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines() (+16 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.10
Nodes (26): View, projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost(), Run, current() (+18 more)

### Community 29 - "notes.ts"
Cohesion: 0.09
Nodes (33): body(), layouts, open(), write(), QuestLine, markdown, backlinksOf(), BackupSkip (+25 more)

### Community 30 - "checks_api.spec.ts"
Cohesion: 0.13
Nodes (15): OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), streamProcess(), d(), cancelMergeChecks() (+7 more)

### Community 31 - "sessions.test.ts"
Cohesion: 0.27
Nodes (11): Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository, HEARTBEAT_MS, parseSession() (+3 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.07
Nodes (91): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+83 more)

### Community 33 - "createWorkspace"
Cohesion: 0.10
Nodes (15): open(), open(), BOARD, CHOICES, FIRST, open(), SAGA, SECOND (+7 more)

### Community 34 - "inspector.tsx"
Cohesion: 0.23
Nodes (13): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+5 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.15
Nodes (20): colourError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, NextForm (+12 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.16
Nodes (20): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+12 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.21
Nodes (17): approvalOf(), checkScene(), isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+9 more)

### Community 39 - "start_api.spec.ts"
Cohesion: 0.08
Nodes (26): git(), NOW, onDisk(), run, seed(), Global constraints, Part A: the mod, Review focus (+18 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.19
Nodes (27): Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu(), grouped() (+19 more)

### Community 41 - "dependency_setup.ts"
Cohesion: 0.31
Nodes (9): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies() (+1 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.13
Nodes (29): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+21 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "ranking.ts"
Cohesion: 0.11
Nodes (36): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+28 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "backlog_view.tsx"
Cohesion: 0.21
Nodes (22): The eight items, capital(), markFor(), KEYS, pressBlock(), pressBudget(), pressFold(), pressPartOf() (+14 more)

### Community 50 - "library_api.ts"
Cohesion: 0.15
Nodes (25): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+17 more)

### Community 51 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (11): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+3 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.14
Nodes (21): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+13 more)

### Community 53 - "t"
Cohesion: 0.10
Nodes (26): HelperBench(), helperDropped(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter() (+18 more)

### Community 54 - "hud.tsx"
Cohesion: 0.11
Nodes (32): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), Spinner(), UpdateControl() (+24 more)

### Community 55 - "4. Screens"
Cohesion: 0.09
Nodes (24): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+16 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "operations.ts"
Cohesion: 0.08
Nodes (37): log, main(), loadCodexContext(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions() (+29 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (15): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader(), orderOf(), parse() (+7 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "ref_node_fs"
Cohesion: 0.03
Nodes (40): APP, at, errors, fileTitled(), notesDir(), APP, FIRST, record() (+32 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "game.ts"
Cohesion: 0.14
Nodes (25): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+17 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "formatMinutes"
Cohesion: 0.07
Nodes (54): EngineRead, open(), pending(), clockTime(), dayAndTime(), dayName(), dayOf(), manaLeft() (+46 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "File Structure"
Cohesion: 0.15
Nodes (19): version(), Behaviour, Global Constraints, Queue-tea Implementation Plan, Review Focus, addRow(), capital(), escapeCell() (+11 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.05
Nodes (71): GRAPH_DRAG_PX, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_SPINNER_MS, GRAPH_ZOOM_MAX, GRAPH_ZOOM_MIN, aroundOf(), GraphEdge (+63 more)

### Community 70 - "cup_mood.ts"
Cohesion: 0.10
Nodes (33): drawCup(), MOOD_COLOR, MOOD_WORD, renderBand(), stillCup(), clearCrashed(), writeBeat(), getView() (+25 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "workspace_store.ts"
Cohesion: 0.07
Nodes (33): ACTIVITY_REFRESH_MS, DETAIL_FLOATS_BELOW, DRAG_SLOP_PX, GRAPH_CHARGE, GRAPH_FIT_PX, GRAPH_GRAVITY, GRAPH_LABEL_ZOOM, GRAPH_LINK_DISTANCE (+25 more)

### Community 73 - "fakeEngine"
Cohesion: 0.15
Nodes (19): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+11 more)

### Community 74 - "package.json"
Cohesion: 0.11
Nodes (17): author, description, license, main, name, private, productName, version (+9 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "filing_controller.ts"
Cohesion: 0.17
Nodes (20): Task 10: `tasks`: the queue side, showBand(), DIFFICULTIES, FileResult, fileFromCommand(), fileTask(), filing, nameNewFeature() (+12 more)

### Community 77 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 78 - "designs_api.ts"
Cohesion: 0.17
Nodes (17): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+9 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.11
Nodes (42): AUTOSAVE_MS, commit(), History, historyOf(), redo(), undo(), Box, clamp() (+34 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.05
Nodes (77): GROWS_AT, isClaudeOut(), Dragon(), GoldReward(), PriorityTag(), XpReward(), Board(), HomePage() (+69 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.19
Nodes (13): change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE, NOW (+5 more)

### Community 89 - "scope.ts"
Cohesion: 0.09
Nodes (52): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readCodexSession(), Observation, observeTask() (+44 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "update.ts"
Cohesion: 0.22
Nodes (9): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, changedBuild(), UpdatePhase, UpdateState (+1 more)

### Community 92 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 93 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 94 - "Designs tab"
Cohesion: 0.25
Nodes (8): Acceptance checks, Architecture, Decisions, Designs tab, Files on disk, Implemented, Screens, What the user should be able to do

### Community 95 - "register.tsx"
Cohesion: 0.08
Nodes (73): live(), 5. Features, shared resources and the core, Features, The core and the app, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files, Task 13: Docs, then the real thing (+65 more)

### Community 96 - "mana.ts"
Cohesion: 0.21
Nodes (21): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+13 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "Task 2: Filing and editing carry the choice"
Cohesion: 0.19
Nodes (12): Drafting a version for the Designs tab, How you work, What you don't do, What you report, NewQuest, QuestEdit, Task 2: Filing and editing carry the choice, How the choice reaches the record (+4 more)

### Community 101 - "Notes"
Cohesion: 0.10
Nodes (20): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+12 more)

### Community 102 - "settings.spec.tsx"
Cohesion: 0.12
Nodes (11): KNOWN, NEW, open(), TWO, FAILED, NEW_FOLDER, open(), input() (+3 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Part 5: an app you can install"
Cohesion: 0.40
Nodes (5): Part 5: an app you can install, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build

### Community 105 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.31
Nodes (9): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check, ProjectRecord (+1 more)

### Community 106 - "note_attachments.ts"
Cohesion: 0.18
Nodes (17): noteFileResponse(), formatOf(), noteFiles(), tokenizer(), attachmentError(), attachmentMarkdown(), extensionOf(), NOTE_ATTACHMENTS (+9 more)

### Community 107 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps (+9 more)

### Community 108 - "requests.test.ts"
Cohesion: 0.24
Nodes (12): pressOpenApp(), live, once(), running, takeRequestUseCase(), closeAnswered(), followRecord(), Handled (+4 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.19
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 110 - "quest_flows.spec.ts"
Cohesion: 0.15
Nodes (9): open(), ACTIVE, HOLD, moved(), open(), QUEST, started(), projectView() (+1 more)

### Community 111 - "ask"
Cohesion: 0.08
Nodes (45): Content(), ask(), useEngineRead(), Failed(), Loading(), useWindowWidth(), BRANCH_POLL_MS, CHECK_CLOCK_MS (+37 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.13
Nodes (15): After the first install, Part 3: setting out and coming back, Review focus, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main (+7 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "ports.ts"
Cohesion: 0.12
Nodes (32): Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, MenuSpec, Ports (+24 more)

### Community 116 - "app_menu.ts"
Cohesion: 0.23
Nodes (10): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+2 more)

### Community 117 - "record_source.ts"
Cohesion: 0.10
Nodes (38): p, Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup() (+30 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.22
Nodes (9): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working (+1 more)

### Community 119 - "test_support.ts"
Cohesion: 0.18
Nodes (14): chronicle(), mana(), CHRONICLE, DESIGNS, GAME, helperJob(), HOARD, LIBRARY (+6 more)

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 121 - "flows.spec.tsx"
Cohesion: 0.14
Nodes (12): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+4 more)

### Community 122 - "designs.spec.tsx"
Cohesion: 0.09
Nodes (25): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), NUDGE_PX, commentError() (+17 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "shell.spec.tsx"
Cohesion: 0.14
Nodes (10): memoryNotes(), ok(), BOARD, FIRST, key(), open(), palette(), SECOND (+2 more)

### Community 125 - "feedback.spec.tsx"
Cohesion: 0.17
Nodes (7): ACCOUNTS, BOARD, input(), open(), empty(), reply(), GithubLoginCode

### Community 126 - "description_files.spec.tsx"
Cohesion: 0.24
Nodes (8): one(), box(), drop(), open(), pane(), pick(), saved(), quest()

### Community 127 - "effort_tracker.ts"
Cohesion: 0.27
Nodes (10): applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending, READS (+2 more)

### Community 128 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+2 more)

### Community 129 - "time.ts"
Cohesion: 0.40
Nodes (7): statusText(), accrue(), addMinutes(), dayKey(), mergeMinutes(), minutesOfStamps(), round2()

### Community 130 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 131 - "board.spec.tsx"
Cohesion: 0.20
Nodes (5): BOARD, FIRST, open(), SAGA, SECOND

### Community 132 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 133 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 134 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 135 - "activity.ts"
Cohesion: 0.11
Nodes (19): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+11 more)

### Community 136 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 137 - "description_files.ts"
Cohesion: 0.43
Nodes (5): DescriptionFile, descriptionFiles(), NOTES_FOLDER, notesFolderOf(), withFilePaths()

### Community 138 - "orderQueue"
Cohesion: 0.40
Nodes (6): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 10: The panel, the band, the status line and the commands, orderQueue(), suggestion()

### Community 139 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 140 - "electron"
Cohesion: 0.50
Nodes (3): engine, CHANNELS, electron

### Community 143 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

### Community 144 - "NoteMode"
Cohesion: 0.67
Nodes (3): NoteMode, Global Constraints, Notes knowledge graph view Implementation Plan

## Knowledge Gaps
- **7 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1078 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `core/logger.ts`, `finish_api.spec.ts`, `Refusal`, `designs_api.spec.ts`, `board.spec.tsx`, `detail.spec.tsx`, `activity.ts`, `ref_types`, `en.ts`, `quest_detail.tsx`, `GitState`, `first_run.tsx`, `engine_api.ts`, `settings_api.ts`, `palette.ts`, `notes_api.ts`, `notes.ts`, `checks_api.spec.ts`, `branch_api.ts`, `createWorkspace`, `design_forms.ts`, `designs_api.spec.ts`, `start_api.spec.ts`, `claude_code.ts`, `library_api.ts`, `t`, `hud.tsx`, `operations.ts`, `host.ts`, `ref_node_fs`, `game.ts`, `messages.ts`, `formatMinutes`, `note_graph_view.tsx`, `fakeEngine`, `package.json`, `designs_api.ts`, `design_editor.tsx`, `quests_page.tsx`, `notes_backup.spec.ts`, `scope.ts`, `update.ts`, `helpers_api.spec.ts`, `settings.spec.tsx`, `note_attachments.ts`, `quest_flows.spec.ts`, `ask`, `app_menu.ts`, `record_source.ts`, `test_support.ts`, `flows.spec.tsx`, `designs.spec.tsx`, `shell.spec.tsx`, `feedback.spec.tsx`, `description_files.spec.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07226107226107226 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `start_api.spec.ts` to `core/logger.ts`, `designs_api.spec.ts`, `activity.ts`, `opening_api.ts`, `ref_types`, `settings_api.ts`, `git_source.ts`, `tests/helpers.ts`, `sessions.test.ts`, `branch_api.ts`, `claude_code.ts`, `library_api.ts`, `branch_workflow.e2e.ts`, `File Structure`, `scope.ts`, `register.tsx`, `Part 3: setting out and coming back`, `ports.ts`, `record_source.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `core/logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05451127819548872 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._