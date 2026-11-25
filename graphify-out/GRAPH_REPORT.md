# Graph Report - free-disk-space-old  (2026-11-25)

## Corpus Check
- 647 files · ~714,454 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 4150 nodes · 14928 edges · 163 communities (156 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 776 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c0d4fed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- branches.ts
- @playwright/test
- Refusal
- brew_quest.tsx
- designs_api.spec.ts
- EngineApi
- App
- ports.ts
- ref_node_path
- register.tsx
- engine_api.ts
- new_quest_sheet.tsx
- Spinner
- Using Notes
- Queue-tea: design
- Queue-tea: workspace app
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- en.ts
- workspace_store.ts
- t
- designs.ts
- vitest
- notes_api.ts
- Part 3: setting out and coming back
- checkpoints.ts
- emptyRecord
- realms_api.ts
- Tea-concile
- game.ts
- branch_api.ts
- Host
- palette.ts
- designs_page.tsx
- queue_rules.ts
- Task 3: Entities and pure rules
- sessions.test.ts
- effort_tracker.ts
- menu_frame.tsx
- note_workspace.tsx
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- project_views.ts
- compilerOptions
- Notes: the knowledge graph view
- backlog_view.tsx
- Notes
- scopeOf
- branch_workflow.e2e.ts
- app_menu.ts
- hoard_page.tsx
- 4. Screens
- board.e2e.ts
- server.spec.ts
- helpers_api.ts
- record_source.ts
- Queue-tea architecture
- description_files.spec.tsx
- Queue-tea: panel redesign
- ref_types
- messages.ts
- Queue-tea: workspace app UI design
- band_host.tsx
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- Guild helpers on tasks
- design_forms.ts
- note_canvas_view.tsx
- activity.ts
- package.json
- chai-pter.md
- flows.spec.tsx
- t
- chronicle.ts
- design_editor.tsx
- tea-dd.md
- Architecture
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- opening_api.ts
- notes_page.tsx
- hud.tsx
- ref_node_child_process
- core/logger.ts
- Designs tab
- tasks_controller.ts
- Time and mana tracking: proposed design (Q01)
- Branch workflow completion — 5 November 2026
- edits.e2e.ts
- release_guard.d.mts
- checks_api.spec.ts
- notes.spec.tsx
- note_attachments.ts
- Task Log
- dependency_setup.ts
- Gaps
- workspace-app.md
- Shared Types (Task 1 writes them; every task uses them)
- helpers_api.spec.ts
- spec.md
- test_support.ts
- A task's life
- Queue-tea
- Part A: the mod
- .line-check-NZS8Gw/tsconfig.json
- What Rohan sees
- scope.ts
- first_window.e2e.ts
- settings_page.tsx
- space_api.spec.ts
- main/features/notes/domain/note_canvas.ts
- designs.e2e.ts
- judgements.spec.ts
- Queue-tea, the workspace app
- pages.e2e.ts
- realm_time.ts
- What is measured
- Queue-tea in Codex
- update_control.spec.tsx
- The record
- Notes performance and guide
- projects_api.spec.ts
- designs.spec.tsx
- Part 2: edits
- activity.spec.ts
- Git modes
- Merge-check dependency setup
- check_layers.mjs
- shell.spec.tsx
- propose_commit.ts
- release_guard.mjs
- Reply
- start_api.spec.ts
- setup.ts
- comments_panel.tsx
- note_bookmarks.ts
- feedback.spec.tsx
- detail.spec.tsx
- settings.spec.tsx
- Part 4: the rest of the screens
- victory.ts
- history.spec.ts
- quests_edits.spec.tsx
- guild.e2e.ts
- notes.e2e.ts
- notes_performance.e2e.ts
- checked
- test_profile.ts
- sky_time.ts
- branch_graph.tsx
- Repository Rules
- Part 5: an app you can install

## God Nodes (most connected - your core abstractions)
1. `t` - 119 edges
2. `vitest` - 116 edges
3. `Refusal` - 114 edges
4. `emptyRecord()` - 94 edges
5. `reply()` - 79 edges
6. `EngineApi` - 75 edges
7. `preact` - 73 edges
8. `Reply` - 70 edges
9. `currentTask()` - 69 edges
10. `ask()` - 65 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `What blocked Git before (Q02.1)` --references--> `isForbiddenGit()`  [INFERRED]
  docs/git-modes.md → app/main/core/node_host.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (163 total, 7 thin omitted)

### Community 0 - "branches.ts"
Cohesion: 0.09
Nodes (39): freshReview(), messageOf(), readBranch(), requestOf(), taskOf(), commitBranchFiles(), graphOf(), pendingGit() (+31 more)

### Community 1 - "@playwright/test"
Cohesion: 0.04
Nodes (22): APP, at, errors, fileTitled(), notesDir(), APP, errors, PNG (+14 more)

### Community 2 - "Refusal"
Cohesion: 0.10
Nodes (58): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+50 more)

### Community 3 - "brew_quest.tsx"
Cohesion: 0.12
Nodes (20): NOTE_BREW_DRAG_TYPE, lineOf(), tickedItemsOf(), BrewDrag, DragEvent, BrewQuestCard(), BrewSheet(), DIFFICULTIES (+12 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (16): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+8 more)

### Community 5 - "EngineApi"
Cohesion: 0.08
Nodes (62): Content(), Answer, ask(), EngineRead, useEngineRead(), Dialog(), ReadView(), Empty() (+54 more)

### Community 6 - "App"
Cohesion: 0.08
Nodes (22): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+14 more)

### Community 7 - "ports.ts"
Cohesion: 0.09
Nodes (38): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these) (+30 more)

### Community 8 - "ref_node_path"
Cohesion: 0.05
Nodes (39): git(), run, APP, errors, BUNDLE, git(), plist(), run (+31 more)

### Community 9 - "register.tsx"
Cohesion: 0.07
Nodes (88): live(), 5. Features, shared resources and the core, Shared resources, The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, renderBand() (+80 more)

### Community 10 - "engine_api.ts"
Cohesion: 0.06
Nodes (58): ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, DEFAULT_LOG_PATH, MEDALS, GithubChip() (+50 more)

### Community 11 - "new_quest_sheet.tsx"
Cohesion: 0.10
Nodes (37): Field(), FieldProps, Group(), Pick(), BookErrors, BookField, BookForm, bookOf() (+29 more)

### Community 12 - "Spinner"
Cohesion: 0.11
Nodes (36): TOAST_ACTION_MS, TOAST_MS, Spinner(), Item(), Toasts(), accountsIn(), hasAccounts(), isGone() (+28 more)

### Community 13 - "Using Notes"
Cohesion: 0.33
Nodes (6): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes

### Community 14 - "Queue-tea: design"
Cohesion: 0.11
Nodes (18): Errands, Helpers, Not included, Priority and difficulty, Queue-tea: design, Settings, Test profiles, Testing (+10 more)

### Community 15 - "Queue-tea: workspace app"
Cohesion: 0.22
Nodes (9): Acceptance criteria, Build order, for the plan, Checked, Decisions, In this release, Not in this release, Queue-tea: workspace app, Testing (+1 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.12
Nodes (27): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+19 more)

### Community 17 - "git_source.ts"
Cohesion: 0.13
Nodes (36): checkStart(), goneSentence(), holdOf(), stepOf(), holdCommandOf(), holdKindOf(), Task 5: The shared resources' data and controllers, File Structure (+28 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (60): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+52 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "en.ts"
Cohesion: 0.14
Nodes (18): fileNamed(), FILES, frontmatter(), Helper, helperOf(), KINDS, LOGOS, folderName() (+10 more)

### Community 21 - "workspace_store.ts"
Cohesion: 0.06
Nodes (60): useWindowWidth(), openRow(), plain(), rowsOf(), stepFrom(), withWholeSagas(), BoardSection, BoardView (+52 more)

### Community 22 - "t"
Cohesion: 0.08
Nodes (37): AttachmentInput(), bytesOf(), Props, State, NoteAttachment(), Props, State, metaOf() (+29 more)

### Community 23 - "designs.ts"
Cohesion: 0.10
Nodes (41): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+33 more)

### Community 24 - "vitest"
Cohesion: 0.14
Nodes (20): click(), one, open(), openReview(), two, view, click(), open() (+12 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.07
Nodes (55): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+47 more)

### Community 26 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.07
Nodes (50): Task 9: Keeping usage down, 4.4 A task's detail: current, queued and done, pad(), shouldFresh(), shouldHandoff(), windowKey(), turnEnd(), afterTurn() (+42 more)

### Community 28 - "emptyRecord"
Cohesion: 0.03
Nodes (87): seed(), seed(), seed(), seed(), seed(), setup(), Task 1: the file seam, HELP_COMMANDS (+79 more)

### Community 29 - "realms_api.ts"
Cohesion: 0.14
Nodes (22): projectsFolder(), addProject(), fileOf(), nameOf(), openFolder(), placeOf(), readSettingsPage(), realmFile() (+14 more)

### Community 30 - "Tea-concile"
Cohesion: 0.25
Nodes (7): 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 31 - "game.ts"
Cohesion: 0.19
Nodes (18): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+10 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.11
Nodes (50): abandonMerge(), BranchDeps, completeMerge(), openMergeFolder(), prepareMerge(), readBranches(), readMergeWorkspace(), resolveMergeFile() (+42 more)

### Community 33 - "Host"
Cohesion: 0.16
Nodes (17): loadCodexContext(), Host, taskLogRepositoryImpl(), folderOf(), readCodexActivity(), codexRepositoryImpl(), readProjectPlace(), carryOverRecords() (+9 more)

### Community 34 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 35 - "designs_page.tsx"
Cohesion: 0.12
Nodes (29): questOfNext(), ApprovalRow(), ApprovalState, BrokenVersion(), DesignsPage(), EditorLoader(), Filed, FiledNote() (+21 more)

### Community 36 - "queue_rules.ts"
Cohesion: 0.14
Nodes (21): Drafting a version for the Designs tab, How you work, What you don't do, What you report, NewQuest, QuestEdit, Global constraints, Guild helpers on tasks: implementation plan (+13 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.11
Nodes (26): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, CommitProposal, Difficulty (+18 more)

### Community 38 - "sessions.test.ts"
Cohesion: 0.24
Nodes (13): isClaudeWorking(), Task 3: session files, readSessions(), removeSessionFile(), writeSessionFile(), SessionFile, SessionsRepository, HEARTBEAT_MS (+5 more)

### Community 39 - "effort_tracker.ts"
Cohesion: 0.24
Nodes (14): 1. The session's activity clock, CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending, READS (+6 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.15
Nodes (34): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+26 more)

### Community 41 - "note_workspace.tsx"
Cohesion: 0.07
Nodes (68): body(), write(), brewLineOf(), dailyBodyOf(), folderError(), FolderGroup, folderNameError(), foldersOf() (+60 more)

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

### Community 46 - "project_views.ts"
Cohesion: 0.08
Nodes (69): xpOf(), activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf() (+61 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "backlog_view.tsx"
Cohesion: 0.14
Nodes (39): Features, The eight items, Task 10: `tasks`: the queue side, removeTaskUseCase(), setPriorityUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand() (+31 more)

### Community 50 - "Notes"
Cohesion: 0.07
Nodes (44): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+36 more)

### Community 51 - "scopeOf"
Cohesion: 0.21
Nodes (23): clearAfterMerge(), freeFolderSpace(), readFolderSpace(), removeTaskFolder(), gitIn(), headsOf(), buildFoldersOf(), bytesOf() (+15 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "app_menu.ts"
Cohesion: 0.17
Nodes (12): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+4 more)

### Community 54 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (17): STAGE_SCALE, Coins(), EggArt(), Sky(), StageArt(), FIRST_LEVEL, STAGES, stageState() (+9 more)

### Community 55 - "4. Screens"
Cohesion: 0.11
Nodes (19): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+11 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.spec.ts"
Cohesion: 0.19
Nodes (11): files, helperInstructions(), skills, workflows, createCodexServer(), CODEX_LIMITS, CODEX_TEXT, CodexContext (+3 more)

### Community 58 - "helpers_api.ts"
Cohesion: 0.19
Nodes (18): checkPath(), HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS (+10 more)

### Community 59 - "record_source.ts"
Cohesion: 0.13
Nodes (32): p, canRestoreFrom(), isRecordName(), keyOf(), nameOf(), scanRecord(), Task 1: The helper list and the record field, Data (+24 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "description_files.spec.tsx"
Cohesion: 0.29
Nodes (6): box(), drop(), open(), pane(), pick(), saved()

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "ref_types"
Cohesion: 0.07
Nodes (55): codexOperations(), CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, One engine, two hosts, Ctx, Env (+47 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 66 - "band_host.tsx"
Cohesion: 0.04
Nodes (64): drawCup(), MOOD_COLOR, MOOD_WORD, stillCup(), View, allowanceAtom, bandAtom, bandQueueAtom (+56 more)

### Community 67 - "File Structure"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.29
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.04
Nodes (87): GRAPH_CHARGE, GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_GRAVITY, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_LABEL_ZOOM, GRAPH_LINK_DISTANCE (+79 more)

### Community 70 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, What's saved (+2 more)

### Community 71 - "design_forms.ts"
Cohesion: 0.17
Nodes (21): colourError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors, NextField (+13 more)

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.05
Nodes (73): ACTIVITY_REFRESH_MS, CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_CURVE_PX, CANVAS_DRAG_PX, CANVAS_EXCERPT, CANVAS_FIT_PX, CANVAS_MIN_SIZE (+65 more)

### Community 73 - "activity.ts"
Cohesion: 0.19
Nodes (21): AT, COMMIT_ACTIVITY_LIMIT, readActivity(), log, step(), ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, activityEntries() (+13 more)

### Community 74 - "package.json"
Cohesion: 0.08
Nodes (21): author, description, license, main, name, overrides, d3-dispatch, d3-quadtree (+13 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "flows.spec.tsx"
Cohesion: 0.11
Nodes (19): BOARD, held(), hold(), MAIN, OTHER, SEALED, withActive(), ACTIVE (+11 more)

### Community 77 - "t"
Cohesion: 0.07
Nodes (67): clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft(), refillTime(), NOW (+59 more)

### Community 78 - "chronicle.ts"
Cohesion: 0.17
Nodes (17): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+9 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.11
Nodes (48): numberError(), Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf() (+40 more)

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

### Community 89 - "opening_api.ts"
Cohesion: 0.26
Nodes (12): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+4 more)

### Community 90 - "notes_page.tsx"
Cohesion: 0.15
Nodes (20): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, dayError(), folderKeyOf(), folderPageOf(), isDay(), journalOf(), DeleteNote() (+12 more)

### Community 91 - "hud.tsx"
Cohesion: 0.10
Nodes (33): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), GROWS_AT, isStreakAtRisk() (+25 more)

### Community 92 - "ref_node_child_process"
Cohesion: 0.14
Nodes (21): UPDATE_TEXT, Deps, setup(), updateService(), changedBuild(), APP, check(), run (+13 more)

### Community 93 - "core/logger.ts"
Cohesion: 0.06
Nodes (35): log, createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+27 more)

### Community 94 - "Designs tab"
Cohesion: 0.17
Nodes (12): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Implemented, Screens (+4 more)

### Community 95 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (52): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, running, markFor(), helperToRemind(), markRemindedUseCase(), noteHelperUseCase() (+44 more)

### Community 96 - "Time and mana tracking: proposed design (Q01)"
Cohesion: 0.10
Nodes (18): Daily work time in a Realm, Earlier recorded time, Recording and recovery, Scope, Verification, Where the total appears, Acceptance checks, Capability map (+10 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 100 - "checks_api.spec.ts"
Cohesion: 0.14
Nodes (16): OutputSink, ProcessRequest, ProcessResult, running, stopProcesses(), streamProcess(), d(), manifest (+8 more)

### Community 101 - "notes.spec.tsx"
Cohesion: 0.13
Nodes (13): brewTransfer(), dragBrew(), layouts, memoryNotes(), ok(), BOARD, NOTES, ok() (+5 more)

### Community 102 - "note_attachments.ts"
Cohesion: 0.20
Nodes (16): filePathOf(), formatOf(), noteFiles(), attachmentError(), attachmentMarkdown(), extensionOf(), NOTE_ATTACHMENTS, NOTE_FILE_ACCEPT (+8 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "dependency_setup.ts"
Cohesion: 0.33
Nodes (8): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies()

### Community 105 - "Gaps"
Cohesion: 0.12
Nodes (17): main(), Checking the record, G10. Smaller ones, G1. Work outside Claude Code counts nothing, G2. A gap over the limit counts zero, not the limit, G3. A long tool call counts zero, G4. Time sticks to Elsewhere after a quick question, G5. Parallel sessions add up (+9 more)

### Community 107 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.24
Nodes (11): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+3 more)

### Community 108 - "helpers_api.spec.ts"
Cohesion: 0.06
Nodes (25): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), records(), won() (+17 more)

### Community 109 - "spec.md"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 110 - "test_support.ts"
Cohesion: 0.16
Nodes (15): chronicle(), mana(), game(), QUEST, CHRONICLE, DESIGNS, GAME, HOARD (+7 more)

### Community 111 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 112 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 113 - "Part A: the mod"
Cohesion: 0.14
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 116 - "scope.ts"
Cohesion: 0.15
Nodes (33): Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame(), readHoard() (+25 more)

### Community 117 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 118 - "settings_page.tsx"
Cohesion: 0.17
Nodes (18): logPathError(), copyText(), FromClaude(), GIT_MODES, GitModeRow(), Keyboard(), LogDialog(), Motion() (+10 more)

### Community 119 - "space_api.spec.ts"
Cohesion: 0.13
Nodes (12): addThree(), fill(), folderOf(), git(), Id, mergeIntoMain(), NOW, onDisk() (+4 more)

### Community 120 - "main/features/notes/domain/note_canvas.ts"
Cohesion: 0.44
Nodes (10): canvasOf(), edgeOf(), extrasOf(), isId(), isObject(), isPlace(), isSize(), isUnique() (+2 more)

### Community 121 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 122 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 125 - "realm_time.ts"
Cohesion: 0.22
Nodes (13): add(), pending(), applyPending(), TIME, Accrual, mergePeriods(), minutesOf(), overlapMinutes() (+5 more)

### Community 126 - "What is measured"
Cohesion: 0.50
Nodes (4): 2. Codex time, 3. Activity steps, 4. The time budget, What is measured

### Community 127 - "Queue-tea in Codex"
Cohesion: 0.33
Nodes (6): Boundaries, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 128 - "update_control.spec.tsx"
Cohesion: 0.16
Nodes (10): majorOf(), setup(), updateWatch(), WatchDeps, setup(), AppIdentity, AppUpdate, UpdatePhase (+2 more)

### Community 129 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 130 - "Notes performance and guide"
Cohesion: 0.33
Nodes (6): Goal and limits, List behavior, Notes performance and guide, Open questions, Options, Verification

### Community 131 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 132 - "designs.spec.tsx"
Cohesion: 0.15
Nodes (9): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), AUTOSAVE_MS, NUDGE_PX (+1 more)

### Community 133 - "Part 2: edits"
Cohesion: 0.22
Nodes (9): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working (+1 more)

### Community 135 - "activity.spec.ts"
Cohesion: 0.14
Nodes (13): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+5 more)

### Community 136 - "Git modes"
Cohesion: 0.50
Nodes (4): Git modes, How it works, What blocked Git before (Q02.1), What Branches already covers, and what's left

### Community 137 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 138 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 139 - "shell.spec.tsx"
Cohesion: 0.16
Nodes (11): BOARD, FIRST, key(), open(), palette(), SECOND, BOARD, input() (+3 more)

### Community 140 - "propose_commit.ts"
Cohesion: 0.18
Nodes (12): checkProposal(), CREDITS, creditsClaude(), isPath(), PROPOSAL_LIMITS, ProposalInput, ProposalProblem, Proposed (+4 more)

### Community 141 - "release_guard.mjs"
Cohesion: 0.21
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 142 - "Reply"
Cohesion: 0.15
Nodes (8): open(), pending(), BOARD, fail, open(), ROW, ProjectView, Reply

### Community 143 - "start_api.spec.ts"
Cohesion: 0.15
Nodes (6): copyText(), git(), NOW, onDisk(), run, seed()

### Community 144 - "setup.ts"
Cohesion: 0.32
Nodes (10): codexSkills(), companionSkills(), helperDefinition(), skill(), codexConfigArgs(), CodexRuntime, digest(), info() (+2 more)

### Community 145 - "comments_panel.tsx"
Cohesion: 0.24
Nodes (7): commentError(), CommentRow(), CommentsPanel(), Props, CommentInput, isOpen(), Layer

### Community 146 - "note_bookmarks.ts"
Cohesion: 0.29
Nodes (8): bookmarkOf(), ENTITIES, textOf(), tokenizer(), BOOKMARK_LIMITS, BOOKMARK_URL_LIMIT, bookmarkUrlOf(), NoteBookmark

### Community 147 - "feedback.spec.tsx"
Cohesion: 0.18
Nodes (6): ACCOUNTS, BOARD, input(), open(), empty(), reply()

### Community 148 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 149 - "settings.spec.tsx"
Cohesion: 0.20
Nodes (5): FAILED, NEW_FOLDER, open(), Settings, SettingsPage

### Community 150 - "Part 4: the rest of the screens"
Cohesion: 0.20
Nodes (10): After the first install, Part 4: the rest of the screens, Review focus, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window, The road (+2 more)

### Community 151 - "victory.ts"
Cohesion: 0.33
Nodes (7): isSagaWon(), kindOf(), newBadges(), NOW, record(), won(), victoryOf()

### Community 152 - "history.spec.ts"
Cohesion: 0.36
Nodes (5): commit(), History, historyOf(), redo(), undo()

### Community 153 - "quests_edits.spec.tsx"
Cohesion: 0.22
Nodes (6): BOARD, CHOICES, FIRST, open(), SAGA, SECOND

### Community 154 - "guild.e2e.ts"
Cohesion: 0.40
Nodes (3): APP, event(), plantClaude()

### Community 155 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 156 - "notes_performance.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, record(), recordPath()

### Community 157 - "checked"
Cohesion: 0.33
Nodes (6): Commands and tools, Keeping usage down, Telling the mod a task looks done, What the mod itself costs, The reminder at "done", checked()

### Community 158 - "test_profile.ts"
Cohesion: 0.47
Nodes (5): checkTestPick(), isTestProfileId(), readTestProfile(), TEST_PROFILE_IDS, TEST_PROFILE_LIMITS

### Community 159 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

### Community 160 - "branch_graph.tsx"
Cohesion: 0.70
Nodes (3): graphLayout(), BranchGraph(), BranchGraph

### Community 161 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 162 - "Part 5: an app you can install"
Cohesion: 0.40
Nodes (5): Part 5: an app you can install, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build

## Knowledge Gaps
- **8 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1200 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `branches.ts`, `update_control.spec.tsx`, `projects_api.spec.ts`, `designs_api.spec.ts`, `designs.spec.tsx`, `App`, `EngineApi`, `ref_node_path`, `engine_api.ts`, `shell.spec.tsx`, `Spinner`, `new_quest_sheet.tsx`, `Reply`, `start_api.spec.ts`, `setup.ts`, `comments_panel.tsx`, `note_bookmarks.ts`, `git_source.ts`, `detail.spec.tsx`, `feedback.spec.tsx`, `settings.spec.tsx`, `designs.ts`, `victory.ts`, `notes_api.ts`, `history.spec.ts`, `en.ts`, `workspace_store.ts`, `realms_api.ts`, `quests_edits.spec.tsx`, `game.ts`, `branch_api.ts`, `sky_time.ts`, `note_workspace.tsx`, `claude_code.ts`, `Notes`, `scopeOf`, `app_menu.ts`, `server.spec.ts`, `helpers_api.ts`, `description_files.spec.tsx`, `ref_types`, `messages.ts`, `note_graph_view.tsx`, `release_guard.mjs`, `design_forms.ts`, `note_canvas_view.tsx`, `activity.ts`, `package.json`, `flows.spec.tsx`, `t`, `chronicle.ts`, `design_editor.tsx`, `notes_backup.spec.ts`, `ref_node_child_process`, `core/logger.ts`, `checks_api.spec.ts`, `notes.spec.tsx`, `note_attachments.ts`, `helpers_api.spec.ts`, `test_support.ts`, `t`, `space_api.spec.ts`, `judgements.spec.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `branches.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09224489795918367 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `projects_api.spec.ts`, `designs_api.spec.ts`, `ref_node_path`, `propose_commit.ts`, `start_api.spec.ts`, `victory.ts`, `checkpoints.ts`, `realms_api.ts`, `game.ts`, `branch_api.ts`, `project_views.ts`, `backlog_view.tsx`, `branch_workflow.e2e.ts`, `4. Screens`, `server.spec.ts`, `record_source.ts`, `ref_types`, `band_host.tsx`, `chronicle.ts`, `notes_backup.spec.ts`, `core/logger.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `helpers_api.spec.ts`, `space_api.spec.ts`, `judgements.spec.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `@playwright/test` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `Host` to `branches.ts`, `designs_api.spec.ts`, `ports.ts`, `register.tsx`, `start_api.spec.ts`, `settings_api.ts`, `Queue-tea: workspace app`, `git_source.ts`, `Part 4: the rest of the screens`, `emptyRecord`, `realms_api.ts`, `sessions.test.ts`, `claude_code.ts`, `Notes`, `record_source.ts`, `ref_types`, `File Structure`, `activity.ts`, `opening_api.ts`, `core/logger.ts`, `Part A: the mod`, `scope.ts`, `space_api.spec.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._