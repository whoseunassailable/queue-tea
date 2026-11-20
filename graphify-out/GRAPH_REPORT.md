# Graph Report - q02-git-lifecycle-merge  (2026-11-20)

## Corpus Check
- 620 files · ~600,488 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 4036 nodes · 14419 edges · 141 communities (133 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 751 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dde74e29`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- notes_page.tsx
- @playwright/test
- app.tsx
- Refusal
- designs_api.spec.ts
- update_runner.mjs
- env.ts
- queue_controller.ts
- realms_api.ts
- register.tsx
- t
- git_repository.ts
- Spinner
- Using Notes
- Queue-tea: design
- Queue-tea: workspace app
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- en.ts
- fixes.test.ts
- domain/format.ts
- edits.e2e.ts
- engine_api.ts
- notes_api.ts
- Part 3: setting out and coming back
- checkpoints.ts
- ref_claude_code
- note_attachments.ts
- Tea-concile
- designs.ts
- Refusal
- project_views.ts
- palette.ts
- designs_page.tsx
- ui.test.tsx
- Task 3: Entities and pure rules
- realm_time.spec.ts
- services/time.ts
- menu_frame.tsx
- note_workspace.tsx
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- queue_rules.ts
- compilerOptions
- Notes: the knowledge graph view
- designs.e2e.ts
- library_api.ts
- designs.e2e.ts
- branch_workflow.e2e.ts
- app_menu.ts
- hoard_page.tsx
- 4. Screens
- board.e2e.ts
- server.ts
- host.ts
- Task 2: Filing and editing carry the choice
- Queue-tea architecture
- game.ts
- Queue-tea: panel redesign
- ref_types
- messages.ts
- app.tsx
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- cup_mood.ts
- Queue-tea
- note_canvas_view.tsx
- setup.ts
- package.json
- chai-pter.md
- designs.spec.tsx
- engine_api.ts
- designs_api.ts
- design_editor.tsx
- tea-dd.md
- Architecture
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- realms_api.ts
- Queue-tea in Codex
- Gaps
- update_service.ts
- ref_node_path
- Designs tab
- tasks_controller.ts
- Daily work time in a Realm
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- judgements.spec.ts
- A task's life
- release_guard.mjs
- Task Log
- main/features/notes/domain/note_canvas.ts
- project_source.ts
- workspace-app.md
- Shared Types (Task 1 writes them; every task uses them)
- shell.e2e.ts
- spec.md
- Time and mana tracking: proposed design (Q01)
- inspector.tsx
- What Rohan sees
- Part A: the mod
- .line-check-NZS8Gw/tsconfig.json
- Time and mana tracking: audit (Q01.1)
- first_window.e2e.ts
- record_source.ts
- Part 2: edits
- quest_files.e2e.ts
- pages.e2e.ts
- Merge-check dependency setup
- notes_backup.e2e.ts
- Queue-tea, the workspace app
- daily_notes.e2e.ts
- guild.e2e.ts
- Scene
- hud.tsx
- Guild helpers on tasks
- Git modes
- helpers_api.spec.ts
- card_note.ts
- note_attachments.e2e.ts
- note_canvas.e2e.ts
- notes.e2e.ts
- activity.ts
- The record
- Repository Rules
- Part 4: the rest of the screens
- overrides
- detail_api.ts

## God Nodes (most connected - your core abstractions)
1. `t` - 116 edges
2. `vitest` - 111 edges
3. `Refusal` - 110 edges
4. `emptyRecord()` - 88 edges
5. `reply()` - 75 edges
6. `EngineApi` - 73 edges
7. `preact` - 71 edges
8. `Reply` - 66 edges
9. `currentTask()` - 66 edges
10. `ask()` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
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

## Communities (141 total, 8 thin omitted)

### Community 0 - "notes_page.tsx"
Cohesion: 0.08
Nodes (51): body(), write(), DETAIL_FLOATS_BELOW, captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup (+43 more)

### Community 1 - "@playwright/test"
Cohesion: 0.18
Nodes (7): APP, paste(), APP, errors, record(), recordPath(), @playwright/test

### Community 2 - "app.tsx"
Cohesion: 0.06
Nodes (45): ContentProps, moodOf(), MORE_PAGES, SheetProps, SheetView(), TABS, useHour(), DETAIL_IS_PAGE_BELOW (+37 more)

### Community 3 - "Refusal"
Cohesion: 0.09
Nodes (53): inGameWords(), activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), notYet(), edit() (+45 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (16): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+8 more)

### Community 5 - "update_runner.mjs"
Cohesion: 0.24
Nodes (15): request(), Deps, setup(), updateService(), exec, ACTIVE, exec, git() (+7 more)

### Community 6 - "env.ts"
Cohesion: 0.08
Nodes (42): 5. Features, shared resources and the core, Shared resources, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, Ctx (+34 more)

### Community 7 - "queue_controller.ts"
Cohesion: 0.15
Nodes (40): Features, The eight items, Task 10: `tasks`: the queue side, setPriorityUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand(), parentFor() (+32 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.22
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+5 more)

### Community 9 - "register.tsx"
Cohesion: 0.09
Nodes (73): live(), The core and the app, Task 12: `app/`, and the end of the flat files, Task 6: `commit_guard` and `errands`, renderBand(), toggleMenu(), loadContext(), beat() (+65 more)

### Community 10 - "t"
Cohesion: 0.11
Nodes (37): Answer, Field(), Empty(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK (+29 more)

### Community 11 - "git_repository.ts"
Cohesion: 0.57
Nodes (3): holdCommandOf(), holdKindOf(), GitState

### Community 12 - "Spinner"
Cohesion: 0.07
Nodes (60): DEFAULT_LOG_PATH, Dialog(), Spinner(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer() (+52 more)

### Community 13 - "Using Notes"
Cohesion: 0.14
Nodes (12): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes, Goal and limits, List behavior (+4 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "Queue-tea: workspace app"
Cohesion: 0.14
Nodes (14): game(), What's saved, Build order, for the plan, Checked, Data, Decisions, Errors and edge cases, In this release (+6 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.11
Nodes (26): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+18 more)

### Community 17 - "git_source.ts"
Cohesion: 0.19
Nodes (26): Task 8: The task flow, Already built, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch() (+18 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (68): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+60 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.09
Nodes (31): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+23 more)

### Community 20 - "en.ts"
Cohesion: 0.08
Nodes (33): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+25 more)

### Community 21 - "fixes.test.ts"
Cohesion: 0.07
Nodes (60): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 4: The core (+52 more)

### Community 22 - "domain/format.ts"
Cohesion: 0.14
Nodes (28): clockTime(), dayName(), manaLeft(), weekdayOf(), BAR_PX, Column(), dayTotal(), Legend() (+20 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "engine_api.ts"
Cohesion: 0.03
Nodes (135): App(), open(), BOARD, FIRST, open(), SAGA, SECOND, click() (+127 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.08
Nodes (54): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+46 more)

### Community 26 - "Part 3: setting out and coming back"
Cohesion: 0.10
Nodes (20): After the first install, Part 3: setting out and coming back, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in (+12 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.13
Nodes (22): How Claude uses them (the mod), 4.1 Home, CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), codexBrief(), commandRun(), count() (+14 more)

### Community 28 - "ref_claude_code"
Cohesion: 0.05
Nodes (61): record(), seed(), seed(), seed(), seed(), seed(), seed(), checkProposal() (+53 more)

### Community 29 - "note_attachments.ts"
Cohesion: 0.09
Nodes (34): filePathOf(), formatOf(), noteFiles(), bookmarkOf(), ENTITIES, textOf(), AttachmentInput(), bytesOf() (+26 more)

### Community 30 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 31 - "designs.ts"
Cohesion: 0.13
Nodes (14): commentError(), CommentRow(), CommentsPanel(), Props, Approval, Author, CommentInput, DESIGN_FORMAT (+6 more)

### Community 32 - "Refusal"
Cohesion: 0.06
Nodes (106): Refusal, abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+98 more)

### Community 33 - "project_views.ts"
Cohesion: 0.11
Nodes (38): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+30 more)

### Community 34 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 35 - "designs_page.tsx"
Cohesion: 0.06
Nodes (85): Content(), ask(), EngineRead, useEngineRead(), FieldProps, Group(), Pick(), ReadView() (+77 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.08
Nodes (17): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+9 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.12
Nodes (24): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, CommitProposal, Difficulty (+16 more)

### Community 38 - "realm_time.spec.ts"
Cohesion: 0.08
Nodes (36): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, record(), won() (+28 more)

### Community 39 - "services/time.ts"
Cohesion: 0.13
Nodes (30): APP, File Structure, 1. The session's activity clock, FinishResult, leaveCodexUseCase(), noteSeen(), applyPending(), CHANGES (+22 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.14
Nodes (38): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+30 more)

### Community 41 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (52): NOTE_BREW_DRAG_TYPE, brewLineOf(), isInPlay(), lineOf(), linkLineOf(), QuestLine, questLineOf(), tagsError() (+44 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.24
Nodes (19): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+11 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "queue_rules.ts"
Cohesion: 0.10
Nodes (45): codexOperations(), CodexRefusal, readable(), readChoices(), Task 10: The panel, the band, the status line and the commands, 4.5 New task, and Add child task inline, checkPrompt(), checkTypedMessage() (+37 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 50 - "library_api.ts"
Cohesion: 0.08
Nodes (42): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+34 more)

### Community 51 - "designs.e2e.ts"
Cohesion: 0.10
Nodes (11): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+3 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.26
Nodes (13): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+5 more)

### Community 53 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 54 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (20): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+12 more)

### Community 55 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.ts"
Cohesion: 0.23
Nodes (12): codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill(), skills, workflows (+4 more)

### Community 58 - "host.ts"
Cohesion: 0.23
Nodes (12): Block, clip(), doingOf(), fileOf(), parse(), Seen, seenIn(), siteOf() (+4 more)

### Community 59 - "Task 2: Filing and editing carry the choice"
Cohesion: 0.15
Nodes (14): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 1: The helper list and the record field (+6 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.15
Nodes (13): chronicle(), mana(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 6. The app: frontend, backend and storage (+5 more)

### Community 61 - "game.ts"
Cohesion: 0.13
Nodes (26): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+18 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "ref_types"
Cohesion: 0.12
Nodes (21): ctx, setup(), Proposed, Block, withBlock(), BlockResult, blockTaskUseCase(), Deps (+13 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "app.tsx"
Cohesion: 0.05
Nodes (86): GROWS_AT, dayOf(), isClaudeOut(), refillTime(), NOW, weekdayIndex(), Dragon(), GoldReward() (+78 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "File Structure"
Cohesion: 0.22
Nodes (14): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), taskLogRepositoryImpl() (+6 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.04
Nodes (82): GRAPH_CHARGE, GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_GRAVITY, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_LABEL_ZOOM, GRAPH_LINK_DISTANCE (+74 more)

### Community 70 - "cup_mood.ts"
Cohesion: 0.12
Nodes (23): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+15 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.05
Nodes (69): CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_CURVE_PX, CANVAS_DRAG_PX, CANVAS_EXCERPT, CANVAS_FIT_PX, CANVAS_MIN_SIZE, CANVAS_STEP_PX (+61 more)

### Community 73 - "setup.ts"
Cohesion: 0.31
Nodes (10): log, main(), loadCodexContext(), createCodexServer(), codexConfigArgs(), CodexRuntime, digest(), info() (+2 more)

### Community 74 - "package.json"
Cohesion: 0.10
Nodes (17): author, description, license, main, name, private, productName, version (+9 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "designs.spec.tsx"
Cohesion: 0.12
Nodes (15): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), Badge(), badgeOf() (+7 more)

### Community 77 - "engine_api.ts"
Cohesion: 0.06
Nodes (55): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, dayAndTime(), Change, changeEntry(), changeQuests(), dropQuest(), withoutQuest() (+47 more)

### Community 78 - "designs_api.ts"
Cohesion: 0.13
Nodes (32): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+24 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.14
Nodes (36): DRAG_SLOP_PX, NUDGE_PX, ZOOM_RANGE, Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer() (+28 more)

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
Cohesion: 0.18
Nodes (14): NotesDeps, change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE (+6 more)

### Community 89 - "realms_api.ts"
Cohesion: 0.07
Nodes (69): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+61 more)

### Community 90 - "Queue-tea in Codex"
Cohesion: 0.25
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 91 - "Gaps"
Cohesion: 0.18
Nodes (11): G10. Smaller ones, G1. Work outside Claude Code counts nothing, G2. A gap over the limit counts zero, not the limit, G3. A long tool call counts zero, G4. Time sticks to Elsewhere after a quick question, G5. Parallel sessions add up, G6. Errands count on the quest, G7. A session that ends abruptly loses its unsaved minutes (+3 more)

### Community 92 - "update_service.ts"
Cohesion: 0.20
Nodes (10): majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity, AppUpdate, changedBuild(), UpdatePhase (+2 more)

### Community 93 - "ref_node_path"
Cohesion: 0.03
Nodes (76): APP, errors, BUNDLE, git(), plist(), run, STAGE, createLogger() (+68 more)

### Community 94 - "Designs tab"
Cohesion: 0.15
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "tasks_controller.ts"
Cohesion: 0.06
Nodes (65): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, One engine, two hosts, once(), running, helperToRemind(), dropRequestsUseCase() (+57 more)

### Community 96 - "Daily work time in a Realm"
Cohesion: 0.25
Nodes (6): Daily work time in a Realm, Earlier recorded time, Recording and recovery, Scope, Verification, Where the total appears

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.13
Nodes (16): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+8 more)

### Community 100 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 101 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 102 - "release_guard.mjs"
Cohesion: 0.21
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "main/features/notes/domain/note_canvas.ts"
Cohesion: 0.30
Nodes (12): canvasOf(), canvasText(), edgeOf(), extrasOf(), isId(), isObject(), isPlace(), isSize() (+4 more)

### Community 105 - "project_source.ts"
Cohesion: 0.42
Nodes (6): readProjectPlace(), carryOverRecords(), recordPath(), ProjectPlace, ProjectRepository, parseOffset()

### Community 107 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.18
Nodes (14): Read, held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 2: The record, Task 3: Reading git and making branches (+6 more)

### Community 109 - "spec.md"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 110 - "Time and mana tracking: proposed design (Q01)"
Cohesion: 0.17
Nodes (12): Acceptance checks, Capability map, Confirmed counting rule, Counting overlapping work, Evidence and proposed contracts, Goal and limits, Options, Persistence and migration (+4 more)

### Community 111 - "inspector.tsx"
Cohesion: 0.21
Nodes (14): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+6 more)

### Community 112 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 113 - "Part A: the mod"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "Time and mana tracking: audit (Q01.1)"
Cohesion: 0.25
Nodes (8): 2. Codex time, 3. Activity steps, 4. The time budget, Checking the record, Time and mana tracking: audit (Q01.1), What each child quest starts from, What is measured, Where it is kept

### Community 116 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 117 - "record_source.ts"
Cohesion: 0.14
Nodes (27): p, canRestoreFrom(), onDisk(), onDisk(), onDisk(), areMinutes(), arePeriods(), backupPath() (+19 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "quest_files.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, errors, PNG, SEED

### Community 120 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 121 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 122 - "notes_backup.e2e.ts"
Cohesion: 0.22
Nodes (4): APP, errors, EXPORTED, PNG

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "daily_notes.e2e.ts"
Cohesion: 0.40
Nodes (5): APP, at, errors, fileTitled(), notesDir()

### Community 125 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 126 - "Scene"
Cohesion: 0.21
Nodes (9): AUTOSAVE_MS, commit(), History, historyOf(), redo(), undo(), SaveState, useAutosave() (+1 more)

### Community 127 - "hud.tsx"
Cohesion: 0.10
Nodes (31): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), setup(), UpdateControl() (+23 more)

### Community 128 - "Guild helpers on tasks"
Cohesion: 0.20
Nodes (9): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", Where Rohan chooses (+1 more)

### Community 129 - "Git modes"
Cohesion: 0.50
Nodes (4): Git modes, How it works, What blocked Git before (Q02.1), What Branches already covers, and what's left

### Community 130 - "helpers_api.spec.ts"
Cohesion: 0.07
Nodes (36): OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), streamProcess(), nodeUserGit(), UserGit (+28 more)

### Community 131 - "card_note.ts"
Cohesion: 0.39
Nodes (8): What each screen reads from existing data, Options, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote()

### Community 132 - "note_attachments.e2e.ts"
Cohesion: 0.33
Nodes (3): APP, errors, PNG

### Community 134 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 135 - "activity.ts"
Cohesion: 0.18
Nodes (12): codexEvents, commandOf(), parse(), Row, textOf(), AT, step(), ACTIVITY_TEXT_LIMIT (+4 more)

### Community 136 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 137 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 138 - "Part 4: the rest of the screens"
Cohesion: 0.40
Nodes (5): Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window

### Community 139 - "overrides"
Cohesion: 0.50
Nodes (4): overrides, d3-dispatch, d3-quadtree, d3-timer

### Community 140 - "detail_api.ts"
Cohesion: 0.35
Nodes (9): activeOf(), branchToBe(), gitOf(), linesSince(), quietly(), readQuestFacts(), COMMIT_ACTIVITY_LIMIT, readActivity() (+1 more)

## Knowledge Gaps
- **8 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1171 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `engine_api.ts` to `notes_page.tsx`, `helpers_api.spec.ts`, `app.tsx`, `designs_api.spec.ts`, `update_runner.mjs`, `realms_api.ts`, `t`, `git_repository.ts`, `Spinner`, `settings_api.ts`, `main.ts`, `en.ts`, `notes_api.ts`, `note_attachments.ts`, `designs.ts`, `Refusal`, `designs_page.tsx`, `realm_time.spec.ts`, `claude_code.ts`, `library_api.ts`, `app_menu.ts`, `host.ts`, `game.ts`, `ref_types`, `messages.ts`, `app.tsx`, `note_graph_view.tsx`, `note_canvas_view.tsx`, `setup.ts`, `package.json`, `designs.spec.tsx`, `engine_api.ts`, `designs_api.ts`, `design_editor.tsx`, `notes_backup.spec.ts`, `realms_api.ts`, `update_service.ts`, `ref_node_path`, `judgements.spec.ts`, `release_guard.mjs`, `main/features/notes/domain/note_canvas.ts`, `Scene`, `hud.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `notes_page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08246753246753247 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `setup.ts` to `A task's life`, `Repository Rules`, `Queue-tea, the workspace app`, `Time and mana tracking: audit (Q01.1)`, `Gaps`, `ref_node_path`, `Tea-concile`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `app.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05952380952380952 - nodes in this community are weakly interconnected._
- **Why does `nodeHost()` connect `ref_node_path` to `Refusal`, `helpers_api.spec.ts`, `designs_api.spec.ts`, `realm_time.spec.ts`, `realms_api.ts`, `setup.ts`, `settings_api.ts`, `main.ts`, `notes_backup.spec.ts`, `realms_api.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._