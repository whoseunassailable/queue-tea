# Graph Report - q03-tea-dd-adaptive  (2026-11-21)

## Corpus Check
- 639 files · ~705,293 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 4089 nodes · 14631 edges · 137 communities (129 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 756 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `268a00b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ui.test.tsx
- ref_node_fs
- Refusal
- GitState
- designs_api.spec.ts
- library_api.ts
- Spinner
- cup_mood.ts
- project_views.ts
- register.tsx
- preact
- EngineApi
- Spinner
- Using Notes
- Queue-tea: design
- Queue-tea: workspace app
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- en.ts
- check_prompt.ts
- app.tsx
- designs_api.ts
- engine_api.ts
- notes_api.ts
- Workspace app, the rest of the road
- checkpoints.ts
- emptyRecord
- note_workspace.tsx
- Tea-concile
- game.ts
- Refusal
- project_views.ts
- palette.ts
- designs_page.tsx
- chronicle.ts
- Task 3: Entities and pure rules
- sessions.test.ts
- realm_time.spec.ts
- menu_frame.tsx
- note_workspace.tsx
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- What each screen reads from existing data
- compilerOptions
- Notes: the knowledge graph view
- check_layers.mjs
- Notes
- designs.e2e.ts
- branch_workflow.e2e.ts
- app_menu.ts
- hoard_page.tsx
- 4. Screens
- board.e2e.ts
- server.spec.ts
- helpers_api.ts
- record_source.ts
- Queue-tea architecture
- emptyRecord
- Queue-tea: panel redesign
- deps.ts
- messages.ts
- Queue-tea: workspace app UI design
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- activity.ts
- board_tools.tsx
- note_canvas_view.tsx
- designs.spec.tsx
- package.json
- chai-pter.md
- judgements.spec.ts
- formatMinutes
- quest_keys.ts
- design_editor.tsx
- tea-dd.md
- Architecture
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- realms_api.ts
- Merge-check dependency setup
- ports.ts
- update_service.ts
- core/logger.ts
- Designs tab
- tasks_controller.ts
- Time and mana tracking: proposed design (Q01)
- Branch workflow completion — 5 November 2026
- edits.e2e.ts
- release_guard.d.mts
- Host
- services/time.ts
- ref_node_path
- Task Log
- dependency_setup.ts
- Gaps
- workspace-app.md
- Shared Types (Task 1 writes them; every task uses them)
- shell.e2e.ts
- spec.md
- Time and mana tracking: audit (Q01.1)
- projects_api.spec.ts
- Queue-tea
- Part A: the mod
- .line-check-NZS8Gw/tsconfig.json
- design_card.tsx
- scope.ts
- start_api.spec.ts
- Part 2: edits
- Part 3: setting out and coming back
- notes_backup.e2e.ts
- guild.e2e.ts
- inspector.tsx
- Queue-tea, the workspace app
- pages.e2e.ts
- mocha-mockup.md
- Scene
- hud.tsx
- realm_time.ts
- Queue-tea in Codex
- helpers_api.spec.ts
- description_files.ts
- Review Focus
- 5. Mana
- activity.spec.ts
- Git modes

## God Nodes (most connected - your core abstractions)
1. `t` - 118 edges
2. `vitest` - 113 edges
3. `Refusal` - 111 edges
4. `emptyRecord()` - 91 edges
5. `reply()` - 75 edges
6. `EngineApi` - 73 edges
7. `preact` - 72 edges
8. `currentTask()` - 69 edges
9. `Reply` - 66 edges
10. `ask()` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `G5. Parallel sessions add up` --references--> `main()`  [INFERRED]
  docs/time-tracking-audit.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `What blocked Git before (Q02.1)` --references--> `isForbiddenGit()`  [INFERRED]
  docs/git-modes.md → app/main/core/node_host.ts

## Import Cycles
- None detected.

## Communities (137 total, 8 thin omitted)

### Community 0 - "ui.test.tsx"
Cohesion: 0.09
Nodes (19): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+11 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.04
Nodes (35): APP, at, errors, fileTitled(), notesDir(), APP, errors, PNG (+27 more)

### Community 2 - "Refusal"
Cohesion: 0.10
Nodes (62): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+54 more)

### Community 3 - "GitState"
Cohesion: 0.39
Nodes (5): holdCommandOf(), holdKindOf(), Task 3: Reading git and making branches, GitState, fakeGit()

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.08
Nodes (23): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+15 more)

### Community 5 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 6 - "Spinner"
Cohesion: 0.09
Nodes (33): filePathOf(), formatOf(), noteFiles(), TOAST_ACTION_MS, TOAST_MS, AttachmentInput(), bytesOf(), Props (+25 more)

### Community 7 - "cup_mood.ts"
Cohesion: 0.07
Nodes (54): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawCup(), drawQuestion(), MOOD_COLOR, MOOD_WORD (+46 more)

### Community 8 - "project_views.ts"
Cohesion: 0.22
Nodes (17): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+9 more)

### Community 9 - "register.tsx"
Cohesion: 0.08
Nodes (87): live(), The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, toggleMenu(), loadContext(), beat() (+79 more)

### Community 10 - "preact"
Cohesion: 0.07
Nodes (51): Field(), FieldProps, Group(), Pick(), NextVersionSheet(), Props, BookErrors, BookField (+43 more)

### Community 11 - "EngineApi"
Cohesion: 0.06
Nodes (74): Content(), SheetView(), Answer, ask(), EngineRead, open(), pending(), useEngineRead() (+66 more)

### Community 12 - "Spinner"
Cohesion: 0.12
Nodes (34): HOLD_FILES_SHOWN, accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+26 more)

### Community 13 - "Using Notes"
Cohesion: 0.14
Nodes (12): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes, Goal and limits, List behavior (+4 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (44): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+36 more)

### Community 15 - "Queue-tea: workspace app"
Cohesion: 0.12
Nodes (17): game(), Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window, Acceptance criteria, Build order, for the plan (+9 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.11
Nodes (27): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+19 more)

### Community 17 - "git_source.ts"
Cohesion: 0.20
Nodes (26): File Structure, Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch() (+18 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (67): BOOKMARK_AGENT, BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE (+59 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "en.ts"
Cohesion: 0.08
Nodes (35): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+27 more)

### Community 21 - "check_prompt.ts"
Cohesion: 0.21
Nodes (13): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+5 more)

### Community 22 - "app.tsx"
Cohesion: 0.06
Nodes (72): GROWS_AT, Dragon(), GoldReward(), PriorityTag(), XpReward(), Board(), HomePage(), HomeProps (+64 more)

### Community 23 - "designs_api.ts"
Cohesion: 0.09
Nodes (39): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+31 more)

### Community 24 - "engine_api.ts"
Cohesion: 0.03
Nodes (136): App(), open(), BOARD, FIRST, open(), SAGA, SECOND, click() (+128 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.06
Nodes (72): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+64 more)

### Community 26 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.10
Nodes (33): Already built, How Claude uses them (the mod), 4.4 A task's detail: current, queued and done, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES() (+25 more)

### Community 28 - "emptyRecord"
Cohesion: 0.05
Nodes (58): seed(), checkProposal(), CREDITS, creditsClaude(), isPath(), PROPOSAL_LIMITS, ProposalInput, ProposalProblem (+50 more)

### Community 29 - "note_workspace.tsx"
Cohesion: 0.09
Nodes (45): isInPlay(), lineOf(), linkLineOf(), QuestLine, questLineOf(), tickedItemsOf(), withLink(), BrewQuestCard() (+37 more)

### Community 30 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (22): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+14 more)

### Community 32 - "Refusal"
Cohesion: 0.07
Nodes (97): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+89 more)

### Community 33 - "project_views.ts"
Cohesion: 0.17
Nodes (22): 4.2 Tasks, with a feature in the detail pane, 4.9 Back to queue, Blocked…, Move and Remove, blockedText(), blockersOf(), budgetLabel(), BUDGETS, canWaitFor(), DEFAULT_MINUTES (+14 more)

### Community 34 - "palette.ts"
Cohesion: 0.14
Nodes (25): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+17 more)

### Community 35 - "designs_page.tsx"
Cohesion: 0.10
Nodes (38): Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors, NextField, NextForm (+30 more)

### Community 36 - "chronicle.ts"
Cohesion: 0.16
Nodes (23): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+15 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.11
Nodes (26): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, CommitProposal, Difficulty (+18 more)

### Community 38 - "sessions.test.ts"
Cohesion: 0.20
Nodes (16): readCodexSession(), Observation, observeTask(), BranchState, Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile() (+8 more)

### Community 39 - "realm_time.spec.ts"
Cohesion: 0.16
Nodes (17): add(), folders, pending(), realm(), store(), applyPending(), CHANGES, countToolCall() (+9 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.11
Nodes (53): The eight items, Task 10: `tasks`: the queue side, Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu() (+45 more)

### Community 41 - "note_workspace.tsx"
Cohesion: 0.05
Nodes (69): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, NOTE_BREW_DRAG_TYPE, NOTE_LIST_PAGE_SIZE, captureOf(), dailyBodyOf(), dayError(), folderError() (+61 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.26
Nodes (17): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+9 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "What each screen reads from existing data"
Cohesion: 0.17
Nodes (30): readChoices(), 4.5 New task, and Add child task inline, What each screen reads from existing data, checkPrompt(), checkTypedMessage(), FeatureFound, findFeatureUseCase(), MoveResult (+22 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 50 - "Notes"
Cohesion: 0.08
Nodes (25): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+17 more)

### Community 51 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "app_menu.ts"
Cohesion: 0.19
Nodes (11): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+3 more)

### Community 54 - "hoard_page.tsx"
Cohesion: 0.07
Nodes (38): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+30 more)

### Community 55 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.spec.ts"
Cohesion: 0.16
Nodes (20): codexArgs(), NASTY, run, codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions() (+12 more)

### Community 58 - "helpers_api.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 59 - "record_source.ts"
Cohesion: 0.07
Nodes (55): p, canRestoreFrom(), Task 10: The panel, the band, the status line and the commands, Task 2: Filing and editing carry the choice, What's saved, 7. Acceptance criteria, One engine, two hosts, edited() (+47 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.15
Nodes (13): chronicle(), mana(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 6. The app: frontend, backend and storage (+5 more)

### Community 61 - "emptyRecord"
Cohesion: 0.06
Nodes (30): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+22 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "deps.ts"
Cohesion: 0.10
Nodes (26): codexOperations(), CodexRefusal, readable(), ctx, Proposed, errandReply(), Block, DIFFICULTIES (+18 more)

### Community 64 - "messages.ts"
Cohesion: 0.16
Nodes (9): getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage(), servers (+1 more)

### Community 65 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 67 - "File Structure"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.29
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.03
Nodes (104): ACTIVITY_REFRESH_MS, AUTOSAVE_MS, CANVAS_CURVE_PX, CANVAS_DRAG_PX, CANVAS_FIT_PX, CANVAS_ZOOM_MAX, DRAG_SLOP_PX, GRAPH_CHARGE (+96 more)

### Community 70 - "activity.ts"
Cohesion: 0.08
Nodes (31): AT, COMMIT_ACTIVITY_LIMIT, readActivity(), log, step(), Acceptance criteria, Decisions, Errors (+23 more)

### Community 71 - "board_tools.tsx"
Cohesion: 0.21
Nodes (13): BoardSection, Filters, Check(), Chip, chipsOf(), DIFFICULTIES, FiltersPopover(), Funnel() (+5 more)

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.08
Nodes (49): CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_EXCERPT, CANVAS_MIN_SIZE, CANVAS_STEP_PX, CANVAS_ZOOM_MIN, NOTE_AUTOSAVE_MS, anchorOf() (+41 more)

### Community 73 - "designs.spec.tsx"
Cohesion: 0.18
Nodes (7): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), DesignsView

### Community 74 - "package.json"
Cohesion: 0.08
Nodes (22): author, description, license, main, name, overrides, d3-dispatch, d3-quadtree (+14 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 77 - "formatMinutes"
Cohesion: 0.08
Nodes (51): clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft(), refillTime(), NOW (+43 more)

### Community 78 - "quest_keys.ts"
Cohesion: 0.23
Nodes (13): isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, menuKey(), PRIORITY_KEYS, questKeyOf() (+5 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.11
Nodes (44): commentError(), Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf() (+36 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.40
Nodes (4): How you work, Pick a test profile first, What you never do, What you report

### Community 81 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.19
Nodes (13): change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE, NOW (+5 more)

### Community 89 - "realms_api.ts"
Cohesion: 0.08
Nodes (39): projectsFolder(), canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn() (+31 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "ports.ts"
Cohesion: 0.13
Nodes (22): 5. Features, shared resources and the core, Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, pad(), readAllowance(), shouldFresh(), shouldHandoff() (+14 more)

### Community 92 - "update_service.ts"
Cohesion: 0.09
Nodes (30): Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity (+22 more)

### Community 93 - "core/logger.ts"
Cohesion: 0.04
Nodes (51): log, main(), appIdOf(), Flavor, flavorOf(), createLogger(), stackOf(), attempt() (+43 more)

### Community 94 - "Designs tab"
Cohesion: 0.15
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "tasks_controller.ts"
Cohesion: 0.05
Nodes (87): Features, Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once() (+79 more)

### Community 96 - "Time and mana tracking: proposed design (Q01)"
Cohesion: 0.17
Nodes (12): Acceptance checks, Capability map, Confirmed counting rule, Counting overlapping work, Evidence and proposed contracts, Goal and limits, Options, Persistence and migration (+4 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 100 - "Host"
Cohesion: 0.13
Nodes (18): Task 1: the file seam, Host, RunResult, unixFiles(), codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl() (+10 more)

### Community 101 - "services/time.ts"
Cohesion: 0.38
Nodes (10): 1. The session's activity clock, recordRealmTime(), accrue(), addMinutes(), dayKey(), mergeMinutes(), minutesOfStamps(), pad() (+2 more)

### Community 102 - "ref_node_path"
Cohesion: 0.11
Nodes (18): APP, FIRST, record(), recordFile(), replaceRecord(), esbuild, writeBundle(), currentProvenance() (+10 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "dependency_setup.ts"
Cohesion: 0.25
Nodes (9): CheckStopped, dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote() (+1 more)

### Community 105 - "Gaps"
Cohesion: 0.13
Nodes (15): Checking the record, G10. Smaller ones, G1. Work outside Claude Code counts nothing, G2. A gap over the limit counts zero, not the limit, G3. A long tool call counts zero, G4. Time sticks to Elsewhere after a quick question, G5. Parallel sessions add up, G6. Errands count on the quest (+7 more)

### Community 107 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.18
Nodes (14): Read, held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record, Task 4: The git guard (+6 more)

### Community 109 - "spec.md"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 110 - "Time and mana tracking: audit (Q01.1)"
Cohesion: 0.25
Nodes (6): Daily work time in a Realm, Earlier recorded time, Recording and recovery, Scope, Verification, Where the total appears

### Community 111 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 112 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 113 - "Part A: the mod"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "design_card.tsx"
Cohesion: 0.29
Nodes (9): BrokenFile(), CardRead, DesignCard(), Props, TextEdit(), LayerView(), SceneThumb(), SceneView() (+1 more)

### Community 116 - "scope.ts"
Cohesion: 0.11
Nodes (43): Logger, GAME_WORDS, MESSAGES, UPDATE_TEXT, reply(), readChronicle(), GameDeps, readGame() (+35 more)

### Community 117 - "start_api.spec.ts"
Cohesion: 0.17
Nodes (5): git(), NOW, onDisk(), run, seed()

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 120 - "notes_backup.e2e.ts"
Cohesion: 0.22
Nodes (4): APP, errors, EXPORTED, PNG

### Community 121 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 122 - "inspector.tsx"
Cohesion: 0.33
Nodes (7): numberError(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, isFrame()

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 125 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 126 - "Scene"
Cohesion: 0.36
Nodes (5): commit(), History, historyOf(), redo(), undo()

### Community 127 - "hud.tsx"
Cohesion: 0.06
Nodes (52): ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), ALL, hrefOf() (+44 more)

### Community 128 - "realm_time.ts"
Cohesion: 0.36
Nodes (6): TIME, Accrual, minutesOf(), realmDayTime(), rounded(), TimedRecord

### Community 129 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 130 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 131 - "description_files.ts"
Cohesion: 0.48
Nodes (4): DescriptionFiles(), DescriptionFile, descriptionFiles(), withFilePaths()

### Community 132 - "Review Focus"
Cohesion: 0.29
Nodes (7): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet

### Community 133 - "5. Mana"
Cohesion: 0.40
Nodes (5): 2. Codex time, 3. Activity steps, 4. The time budget, 5. Mana, What is measured

### Community 135 - "activity.spec.ts"
Cohesion: 0.18
Nodes (11): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+3 more)

### Community 136 - "Git modes"
Cohesion: 0.50
Nodes (4): Git modes, How it works, What blocked Git before (Q02.1), What Branches already covers, and what's left

## Knowledge Gaps
- **8 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1186 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `engine_api.ts` to `ref_node_fs`, `helpers_api.spec.ts`, `GitState`, `designs_api.spec.ts`, `library_api.ts`, `Spinner`, `preact`, `EngineApi`, `Spinner`, `settings_api.ts`, `en.ts`, `app.tsx`, `designs_api.ts`, `notes_api.ts`, `game.ts`, `Refusal`, `designs_page.tsx`, `chronicle.ts`, `realm_time.spec.ts`, `note_workspace.tsx`, `claude_code.ts`, `app_menu.ts`, `hoard_page.tsx`, `server.spec.ts`, `helpers_api.ts`, `emptyRecord`, `deps.ts`, `messages.ts`, `note_graph_view.tsx`, `activity.ts`, `note_canvas_view.tsx`, `designs.spec.tsx`, `package.json`, `judgements.spec.ts`, `formatMinutes`, `design_editor.tsx`, `notes_backup.spec.ts`, `realms_api.ts`, `update_service.ts`, `core/logger.ts`, `ref_node_path`, `projects_api.spec.ts`, `scope.ts`, `start_api.spec.ts`, `Scene`, `hud.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ui.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.03990384615384615 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `ui.test.tsx`, `helpers_api.spec.ts`, `designs_api.spec.ts`, `cup_mood.ts`, `game.ts`, `Refusal`, `chronicle.ts`, `realm_time.spec.ts`, `What each screen reads from existing data`, `branch_workflow.e2e.ts`, `4. Screens`, `record_source.ts`, `emptyRecord`, `deps.ts`, `judgements.spec.ts`, `notes_backup.spec.ts`, `realms_api.ts`, `ports.ts`, `core/logger.ts`, `tasks_controller.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `projects_api.spec.ts`, `scope.ts`, `start_api.spec.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._