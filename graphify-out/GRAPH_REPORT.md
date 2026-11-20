# Graph Report - notes-section  (2026-11-20)

## Corpus Check
- 634 files · ~695,968 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 4043 nodes · 14441 edges · 133 communities (128 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 751 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43b8deb7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- queue_controller.ts
- ref_node_fs
- Refusal
- GitState
- designs_api.spec.ts
- note_graph_layout.ts
- vitest
- cup_mood.ts
- realms_api.ts
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
- designs.ts
- engine_api.ts
- notes_api.ts
- Part 3: setting out and coming back
- checkpoints.ts
- tests/helpers.ts
- presentation/widgets/read_view.tsx
- Tea-concile
- game.ts
- Refusal
- project_views.ts
- palette.ts
- design_forms.ts
- ui.test.tsx
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
- settings_api.ts
- Notes
- designs.e2e.ts
- branch_workflow.e2e.ts
- app_menu.ts
- hoard_page.tsx
- 4. Screens
- board.e2e.ts
- server.spec.ts
- host.ts
- file_task.ts
- Queue-tea architecture
- emptyRecord
- Queue-tea: panel redesign
- ref_types
- messages.ts
- board_tools.tsx
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- settings_page.tsx
- check_layers.mjs
- note_canvas_view.tsx
- designs.spec.tsx
- package.json
- chai-pter.md
- band_host.tsx
- quest_edits.ts
- quest_keys.ts
- design_editor.tsx
- tea-dd.md
- Architecture
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- scope.ts
- README.md
- conversation_turn_controller.ts
- update_service.ts
- core/logger.ts
- Designs tab
- tasks_controller.ts
- Time and mana tracking: proposed design (Q01)
- Branch workflow completion — 5 November 2026
- edits.e2e.ts
- release_guard.d.mts
- judgements.spec.ts
- Part 3: setting out and coming back
- ref_node_path
- Task Log
- main/features/notes/domain/note_canvas.ts
- Gaps
- workspace-app.md
- Shared Types (Task 1 writes them; every task uses them)
- notes_backup.e2e.ts
- spec.md
- Time and mana tracking: audit (Q01.1)
- pages.e2e.ts
- Queue-tea
- Part A: the mod
- .line-check-NZS8Gw/tsconfig.json
- operations.ts
- detail_api.ts
- record_source.ts
- Part 2: edits
- assistant_providers.ts
- daily_notes.e2e.ts
- guild.e2e.ts
- notes_performance.e2e.ts
- Queue-tea, the workspace app
- main.tsx
- mocha-mockup.md
- Scene
- hud.tsx
- Guild helpers on tasks
- Task 3: Helper chips in the app
- helpers_api.spec.ts
- activity.spec.ts
- overrides

## God Nodes (most connected - your core abstractions)
1. `t` - 116 edges
2. `vitest` - 112 edges
3. `Refusal` - 110 edges
4. `emptyRecord()` - 88 edges
5. `reply()` - 75 edges
6. `EngineApi` - 73 edges
7. `preact` - 71 edges
8. `Reply` - 66 edges
9. `currentTask()` - 66 edges
10. `ask()` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `What blocked Git before (Q02.1)` --references--> `isForbiddenGit()`  [INFERRED]
  docs/git-modes.md → app/main/core/node_host.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts
- `Keys` --references--> `d()`  [INFERRED]
  docs/spec.md → app/main/features/branches/api/branch_reads.spec.ts
- `What it does` --references--> `d()`  [INFERRED]
  README.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (133 total, 5 thin omitted)

### Community 0 - "queue_controller.ts"
Cohesion: 0.12
Nodes (44): The eight items, Task 10: `tasks`: the queue side, Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand() (+36 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.07
Nodes (23): APP, FIRST, record(), recordFile(), replaceRecord(), APP, paste(), APP (+15 more)

### Community 2 - "Refusal"
Cohesion: 0.10
Nodes (61): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+53 more)

### Community 3 - "GitState"
Cohesion: 0.33
Nodes (6): holdCommandOf(), holdKindOf(), HoldKind, Task 3: Reading git and making branches, GitState, fakeGit()

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (16): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+8 more)

### Community 5 - "note_graph_layout.ts"
Cohesion: 0.08
Nodes (31): GRAPH_CHARGE, GRAPH_GRAVITY, GRAPH_LINK_DISTANCE, GRAPH_PROGRESS_TICKS, GRAPH_THETA, GRAPH_TICKS, GRAPH_WARM_ALPHA, GraphEdge (+23 more)

### Community 6 - "vitest"
Cohesion: 0.09
Nodes (18): codexArgs(), NASTY, run, now, counts, codexConfigArgs(), fileOf(), NOW (+10 more)

### Community 7 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "register.tsx"
Cohesion: 0.08
Nodes (89): live(), 5. Features, shared resources and the core, Features, Shared resources, The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 5: The shared resources' data and controllers (+81 more)

### Community 10 - "preact"
Cohesion: 0.07
Nodes (72): Content(), SheetView(), Answer, Dialog(), Field(), FieldProps, Group(), Pick() (+64 more)

### Community 11 - "EngineApi"
Cohesion: 0.05
Nodes (69): ask(), EngineRead, open(), pending(), useEngineRead(), AttachmentInput(), bytesOf(), Props (+61 more)

### Community 12 - "Spinner"
Cohesion: 0.12
Nodes (34): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+26 more)

### Community 13 - "Using Notes"
Cohesion: 0.14
Nodes (12): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes, Goal and limits, List behavior (+4 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "Queue-tea: workspace app"
Cohesion: 0.22
Nodes (9): Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app, Testing (+1 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.20
Nodes (12): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+4 more)

### Community 17 - "git_source.ts"
Cohesion: 0.19
Nodes (26): File Structure, Task 8: The task flow, Already built, commitsBetween(), diffSince(), git(), lastCommit(), listBranches() (+18 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (72): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+64 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "en.ts"
Cohesion: 0.05
Nodes (42): skyAt(), skyOf(), SkyTime, GithubChip(), fileNamed(), FILES, frontmatter(), Helper (+34 more)

### Community 21 - "check_prompt.ts"
Cohesion: 0.24
Nodes (11): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+3 more)

### Community 22 - "app.tsx"
Cohesion: 0.04
Nodes (108): ContentProps, MORE_PAGES, SheetProps, TABS, DETAIL_IS_PAGE_BELOW, GROWS_AT, clockTime(), dayAndTime() (+100 more)

### Community 23 - "designs.ts"
Cohesion: 0.09
Nodes (44): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+36 more)

### Community 24 - "engine_api.ts"
Cohesion: 0.02
Nodes (150): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+142 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.07
Nodes (54): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+46 more)

### Community 26 - "Part 3: setting out and coming back"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.10
Nodes (35): 4.1 Home, 4.4 A task's detail: current, queued and done, factsNow(), HandoffDeps, HandoffResult, writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS (+27 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.05
Nodes (49): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 1: the file seam, hostOf(), unixFiles(), checkProposal(), CREDITS (+41 more)

### Community 29 - "presentation/widgets/read_view.tsx"
Cohesion: 0.14
Nodes (14): bookmarkOf(), ENTITIES, textOf(), cardOf(), markdown, Props, callbacks(), tokenizer() (+6 more)

### Community 30 - "Tea-concile"
Cohesion: 0.12
Nodes (14): main(), Forms, Repository Rules, Visual artifacts, Writing code, G5. Parallel sessions add up, 1. Find the merge, 2. Read both intents before editing (+6 more)

### Community 31 - "game.ts"
Cohesion: 0.18
Nodes (21): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+13 more)

### Community 32 - "Refusal"
Cohesion: 0.06
Nodes (113): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+105 more)

### Community 33 - "project_views.ts"
Cohesion: 0.09
Nodes (46): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+38 more)

### Community 34 - "palette.ts"
Cohesion: 0.13
Nodes (29): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+21 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.13
Nodes (24): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField (+16 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.08
Nodes (17): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+9 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.12
Nodes (24): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, CommitProposal, Difficulty (+16 more)

### Community 38 - "sessions.test.ts"
Cohesion: 0.20
Nodes (15): readCodexSession(), Observation, BranchState, Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile (+7 more)

### Community 39 - "realm_time.spec.ts"
Cohesion: 0.05
Nodes (78): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+70 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.18
Nodes (28): Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp(), renderMenu() (+20 more)

### Community 41 - "note_workspace.tsx"
Cohesion: 0.05
Nodes (96): NOTE_BREW_DRAG_TYPE, brewLineOf(), captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderKeyOf() (+88 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.24
Nodes (18): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+10 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "What each screen reads from existing data"
Cohesion: 0.16
Nodes (32): readChoices(), 4.5 New task, and Add child task inline, What each screen reads from existing data, checkPrompt(), checkTypedMessage(), TypedVerdict, FeatureFound, findFeatureUseCase() (+24 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "settings_api.ts"
Cohesion: 0.22
Nodes (14): cleanSettings(), DEFAULT_SETTINGS, isFolds(), isLastProject(), isRealmAccounts(), isScope(), isSky(), isTerminal() (+6 more)

### Community 50 - "Notes"
Cohesion: 0.08
Nodes (25): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+17 more)

### Community 51 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.26
Nodes (13): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+5 more)

### Community 53 - "app_menu.ts"
Cohesion: 0.19
Nodes (11): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+3 more)

### Community 54 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (19): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+11 more)

### Community 55 - "4. Screens"
Cohesion: 0.07
Nodes (31): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+23 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.spec.ts"
Cohesion: 0.18
Nodes (18): codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill(), skills, workflows (+10 more)

### Community 58 - "host.ts"
Cohesion: 0.22
Nodes (13): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, parse(), Seen, seenIn() (+5 more)

### Community 59 - "file_task.ts"
Cohesion: 0.25
Nodes (15): NewQuest, QuestEdit, Task 2: Filing and editing carry the choice, How the choice reaches the record, edited(), editTaskUseCase(), TaskEdit, FileInput (+7 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.13
Nodes (13): chronicle(), mana(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 6. The app: frontend, backend and storage (+5 more)

### Community 61 - "emptyRecord"
Cohesion: 0.05
Nodes (41): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+33 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "ref_types"
Cohesion: 0.09
Nodes (31): Ctx, Env, Options, Proposed, Block, withBlock(), BlockResult, blockTaskUseCase() (+23 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "board_tools.tsx"
Cohesion: 0.13
Nodes (23): BoardSection, BoardView, EMPTY_BOARD, filterEntries(), Filters, hasFilters(), isFiltering(), matchesText() (+15 more)

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
Cohesion: 0.06
Nodes (64): GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_LABEL_ZOOM, GRAPH_SPINNER_MS, GRAPH_ZOOM_MAX, GRAPH_ZOOM_MIN (+56 more)

### Community 70 - "settings_page.tsx"
Cohesion: 0.16
Nodes (18): DEFAULT_LOG_PATH, copyText(), FromClaude(), GIT_MODES, GitModeRow(), Keyboard(), Motion(), Opening() (+10 more)

### Community 71 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.05
Nodes (73): ACTIVITY_REFRESH_MS, CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_CURVE_PX, CANVAS_DRAG_PX, CANVAS_EXCERPT, CANVAS_FIT_PX, CANVAS_MIN_SIZE (+65 more)

### Community 73 - "designs.spec.tsx"
Cohesion: 0.17
Nodes (8): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), NUDGE_PX, VersionView

### Community 74 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, license, main, name, private, productName, version (+7 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "band_host.tsx"
Cohesion: 0.12
Nodes (38): Order to fix them, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 9: `conversation` and `message_check`, drawCup(), drawQuestion() (+30 more)

### Community 77 - "quest_edits.ts"
Cohesion: 0.21
Nodes (13): Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest(), withPlayNext(), withPriority(), QuestEdits (+5 more)

### Community 78 - "quest_keys.ts"
Cohesion: 0.21
Nodes (14): isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, menuKey(), PRIORITY_KEYS, QuestKey (+6 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.11
Nodes (47): numberError(), Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf() (+39 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "Architecture"
Cohesion: 0.15
Nodes (13): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+5 more)

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
Cohesion: 0.07
Nodes (67): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readPush(), readChronicle(), loadCodexContext() (+59 more)

### Community 90 - "README.md"
Cohesion: 0.12
Nodes (13): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification, Decision and limits (+5 more)

### Community 91 - "conversation_turn_controller.ts"
Cohesion: 0.35
Nodes (9): Task 9: Keeping usage down, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd(), afterTurn(), conversationState (+1 more)

### Community 92 - "update_service.ts"
Cohesion: 0.13
Nodes (24): Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity (+16 more)

### Community 93 - "core/logger.ts"
Cohesion: 0.05
Nodes (44): log, createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+36 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "tasks_controller.ts"
Cohesion: 0.06
Nodes (71): Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, once(), running (+63 more)

### Community 96 - "Time and mana tracking: proposed design (Q01)"
Cohesion: 0.17
Nodes (12): Acceptance checks, Capability map, Confirmed counting rule, Counting overlapping work, Evidence and proposed contracts, Goal and limits, Options, Persistence and migration (+4 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 100 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 101 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 102 - "ref_node_path"
Cohesion: 0.06
Nodes (19): APP, errors, PNG, APP, Board, APP, esbuild, writeBundle() (+11 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "main/features/notes/domain/note_canvas.ts"
Cohesion: 0.25
Nodes (14): canvasOf(), canvasText(), edgeOf(), extrasOf(), isId(), isObject(), isPlace(), isSize() (+6 more)

### Community 105 - "Gaps"
Cohesion: 0.20
Nodes (10): G10. Smaller ones, G1. Work outside Claude Code counts nothing, G2. A gap over the limit counts zero, not the limit, G3. A long tool call counts zero, G4. Time sticks to Elsewhere after a quick question, G6. Errands count on the quest, G7. A session that ends abruptly loses its unsaved minutes, G8. Idle time inside the limit counts as work (+2 more)

### Community 106 - "workspace-app.md"
Cohesion: 0.24
Nodes (5): Git modes, How it works, What blocked Git before (Q02.1), What Branches already covers, and what's left, Parallel quests: implementation decisions

### Community 107 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.19
Nodes (13): Read, held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record, Task 4: The git guard (+5 more)

### Community 108 - "notes_backup.e2e.ts"
Cohesion: 0.22
Nodes (4): APP, errors, EXPORTED, PNG

### Community 109 - "spec.md"
Cohesion: 0.14
Nodes (11): Audit: what the menu exposes of the engine, Problems not on the list, 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing (+3 more)

### Community 110 - "Time and mana tracking: audit (Q01.1)"
Cohesion: 0.17
Nodes (10): Daily work time in a Realm, Earlier recorded time, Recording and recovery, Scope, Verification, Where the total appears, Checking the record, Time and mana tracking: audit (Q01.1) (+2 more)

### Community 111 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 112 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 113 - "Part A: the mod"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "operations.ts"
Cohesion: 0.52
Nodes (6): CodexContext, codexOperations(), CodexRefusal, readable(), errandReply(), setFeatureUseCase()

### Community 116 - "detail_api.ts"
Cohesion: 0.62
Nodes (6): activeOf(), branchToBe(), gitOf(), linesSince(), quietly(), readQuestFacts()

### Community 117 - "record_source.ts"
Cohesion: 0.06
Nodes (40): p, AS_OF_27_OCT, NOW, record(), git(), NOW, onDisk(), run (+32 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "assistant_providers.ts"
Cohesion: 0.52
Nodes (3): assistantRepositoryImpl(), Reply, AssistantRepository

### Community 120 - "daily_notes.e2e.ts"
Cohesion: 0.40
Nodes (5): APP, at, errors, fileTitled(), notesDir()

### Community 121 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 122 - "notes_performance.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, record(), recordPath()

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 125 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 126 - "Scene"
Cohesion: 0.21
Nodes (9): AUTOSAVE_MS, commit(), History, historyOf(), redo(), undo(), SaveState, useAutosave() (+1 more)

### Community 127 - "hud.tsx"
Cohesion: 0.09
Nodes (37): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), manaLeft(), Spinner() (+29 more)

### Community 128 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+3 more)

### Community 129 - "Task 3: Helper chips in the app"
Cohesion: 0.67
Nodes (3): QuestForm, Task 3: Helper chips in the app, HelperId

### Community 130 - "helpers_api.spec.ts"
Cohesion: 0.15
Nodes (12): DONE, INIT, jobOf(), last(), NOW, ran(), READ, REAL_WAIT (+4 more)

### Community 135 - "activity.spec.ts"
Cohesion: 0.11
Nodes (21): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+13 more)

### Community 139 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

## Knowledge Gaps
- **8 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ref_node_fs`, `helpers_api.spec.ts`, `GitState`, `designs_api.spec.ts`, `note_graph_layout.ts`, `activity.spec.ts`, `preact`, `EngineApi`, `Spinner`, `settings_api.ts`, `main.ts`, `en.ts`, `app.tsx`, `designs.ts`, `engine_api.ts`, `notes_api.ts`, `presentation/widgets/read_view.tsx`, `Refusal`, `palette.ts`, `design_forms.ts`, `realm_time.spec.ts`, `note_workspace.tsx`, `claude_code.ts`, `app_menu.ts`, `host.ts`, `emptyRecord`, `messages.ts`, `board_tools.tsx`, `note_graph_view.tsx`, `note_canvas_view.tsx`, `designs.spec.tsx`, `package.json`, `quest_edits.ts`, `design_editor.tsx`, `notes_backup.spec.ts`, `scope.ts`, `update_service.ts`, `core/logger.ts`, `judgements.spec.ts`, `ref_node_path`, `main/features/notes/domain/note_canvas.ts`, `record_source.ts`, `Scene`, `hud.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `queue_controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11689291101055807 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `Tea-concile` to `Queue-tea: design`, `Time and mana tracking: audit (Q01.1)`, `scope.ts`, `Queue-tea, the workspace app`, `core/logger.ts`, `server.spec.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.06606606606606606 - nodes in this community are weakly interconnected._
- **Why does `nodeHost()` connect `core/logger.ts` to `Refusal`, `helpers_api.spec.ts`, `designs_api.spec.ts`, `vitest`, `realm_time.spec.ts`, `settings_api.ts`, `main.ts`, `record_source.ts`, `notes_backup.spec.ts`, `emptyRecord`, `Tea-concile`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._