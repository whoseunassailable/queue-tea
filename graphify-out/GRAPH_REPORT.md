# Graph Report - q01-mana-time-tracking  (2026-11-19)

## Corpus Check
- 613 files · ~592,979 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3991 nodes · 14231 edges · 138 communities (132 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 747 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9bf562b0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- ref_node_path
- app.tsx
- Refusal
- designs_api.spec.ts
- update_runner.mjs
- EngineApi
- ref_types
- realms_api.ts
- operations.ts
- new_quest_sheet.tsx
- git_repository.ts
- first_run.tsx
- Using Notes
- Queue-tea: design
- record_source.ts
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- t
- useWindowKeys
- quest_detail.tsx
- edits.e2e.ts
- feedback.spec.tsx
- notes_api.ts
- Part 4: the rest of the screens
- checkpoints.ts
- ref_claude_code
- note_attachments.ts
- Tea-concile
- designs.ts
- Refusal
- hoard_page.tsx
- palette.ts
- design_forms.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- project_views.ts
- createWorkspace
- menu_frame.tsx
- notes_page.tsx
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- What each screen reads from existing data
- compilerOptions
- Notes: the knowledge graph view
- queue_controller.ts
- library_api.ts
- designs.e2e.ts
- branch_workflow.e2e.ts
- App
- engine_api.ts
- 4. Screens
- board.e2e.ts
- server.ts
- host.ts
- settings_page.tsx
- Queue-tea architecture
- emptyRecord
- Queue-tea: panel redesign
- services/time.ts
- messages.ts
- app.tsx
- view_store.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- band_host.tsx
- Queue-tea
- note_canvas_view.tsx
- App
- package.json
- chai-pter.md
- designs.spec.tsx
- test_support.ts
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
- conversation_turn_controller.ts
- update_service.ts
- vitest
- Designs tab
- tasks_controller.ts
- branches.spec.tsx
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- judgements.spec.ts
- Reply
- release_guard.mjs
- Task Log
- main/features/notes/domain/note_canvas.ts
- notes.spec.tsx
- Shared Types (Task 1 writes them; every task uses them)
- flows.spec.tsx
- spec.md
- Gaps
- inspector.tsx
- Part 3: setting out and coming back
- detail.spec.tsx
- .line-check-NZS8Gw/tsconfig.json
- activity.spec.ts
- description_files.spec.tsx
- start_api.spec.ts
- Part 2: edits
- check_layers.mjs
- pages.e2e.ts
- first_window.e2e.ts
- description_files.ts
- Queue-tea, the workspace app
- Time and mana tracking: proposed design (Q01)
- settings.spec.tsx
- Scene
- dependency_setup.ts
- Guild helpers on tasks
- Daily work time in a Realm
- notes.e2e.ts
- card_note.ts
- mocha-mockup.md
- assistant_providers.ts
- Notes performance and guide
- activity.ts
- Repository Rules
- Part 5: an app you can install

## God Nodes (most connected - your core abstractions)
1. `t` - 115 edges
2. `vitest` - 111 edges
3. `Refusal` - 108 edges
4. `emptyRecord()` - 84 edges
5. `reply()` - 74 edges
6. `EngineApi` - 73 edges
7. `preact` - 71 edges
8. `Reply` - 66 edges
9. `currentTask()` - 64 edges
10. `ask()` - 62 edges

## Surprising Connections (you probably didn't know these)
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `G5. Parallel sessions add up` --references--> `main()`  [INFERRED]
  docs/time-tracking-audit.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (138 total, 6 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.05
Nodes (77): body(), write(), NOTE_BREW_DRAG_TYPE, NOTE_PICKER_QUEST_ROWS, brewLineOf(), dailyBodyOf(), dayError(), folderError() (+69 more)

### Community 1 - "ref_node_path"
Cohesion: 0.03
Nodes (60): APP, at, errors, fileTitled(), notesDir(), APP, event(), plantClaude() (+52 more)

### Community 2 - "app.tsx"
Cohesion: 0.07
Nodes (55): ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, ALL, hrefOf(), Route (+47 more)

### Community 3 - "Refusal"
Cohesion: 0.08
Nodes (76): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+68 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (16): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+8 more)

### Community 5 - "update_runner.mjs"
Cohesion: 0.23
Nodes (15): UPDATE_TEXT, Deps, setup(), updateService(), AppIdentity, ACTIVE, exec, git() (+7 more)

### Community 6 - "EngineApi"
Cohesion: 0.06
Nodes (71): Content(), Answer, ask(), EngineRead, useEngineRead(), NoteAttachment(), Props, State (+63 more)

### Community 7 - "ref_types"
Cohesion: 0.07
Nodes (37): ctx, 4.2 Tasks, with a feature in the detail pane, 7. Acceptance criteria, Env, Block, withBlock(), addRequestUseCase(), BlockResult (+29 more)

### Community 8 - "realms_api.ts"
Cohesion: 0.19
Nodes (15): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, logged, run, commandFileIn(), findCommand() (+7 more)

### Community 9 - "operations.ts"
Cohesion: 0.10
Nodes (37): codexOperations(), CodexRefusal, readable(), live(), Features, Problems not on the list, Task 6: `commit_guard` and `errands`, Task 10: The panel, the band, the status line and the commands (+29 more)

### Community 10 - "new_quest_sheet.tsx"
Cohesion: 0.11
Nodes (35): Field(), FieldProps, Pick(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK (+27 more)

### Community 11 - "git_repository.ts"
Cohesion: 0.29
Nodes (4): Task 3: Reading git and making branches, GitState, GitRepository, fakeGit()

### Community 12 - "first_run.tsx"
Cohesion: 0.13
Nodes (30): Group(), accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+22 more)

### Community 13 - "Using Notes"
Cohesion: 0.33
Nodes (6): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "record_source.ts"
Cohesion: 0.09
Nodes (35): p, onDisk(), logged, NOW, onDisk(), seed(), stored(), Task 1: The helper list and the record field (+27 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.10
Nodes (27): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+19 more)

### Community 17 - "git_source.ts"
Cohesion: 0.23
Nodes (21): commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural(), readDrift() (+13 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (73): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+65 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.20
Nodes (16): addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion(), nextVersion() (+8 more)

### Community 20 - "t"
Cohesion: 0.13
Nodes (22): fileNamed(), FILES, frontmatter(), Helper, helperOf(), HELPERS, KINDS, LOGOS (+14 more)

### Community 21 - "useWindowKeys"
Cohesion: 0.13
Nodes (22): useWindowKeys(), Badge(), badgeOf(), Props, Row(), VersionMenu(), VersionRail(), isFromMenu() (+14 more)

### Community 22 - "quest_detail.tsx"
Cohesion: 0.06
Nodes (69): clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft(), refillTime(), NOW (+61 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "feedback.spec.tsx"
Cohesion: 0.18
Nodes (6): ACCOUNTS, BOARD, input(), open(), empty(), reply()

### Community 25 - "notes_api.ts"
Cohesion: 0.08
Nodes (60): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+52 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.20
Nodes (10): After the first install, Part 4: the rest of the screens, Review focus, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window, The road (+2 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.20
Nodes (15): 4.1 Home, CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), checkpointPrompt(), codexBrief(), commandRun(), count() (+7 more)

### Community 28 - "ref_claude_code"
Cohesion: 0.05
Nodes (55): Task 8: The task flow, checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS (+47 more)

### Community 29 - "note_attachments.ts"
Cohesion: 0.12
Nodes (27): filePathOf(), formatOf(), noteFiles(), bookmarkOf(), ENTITIES, textOf(), AttachmentInput(), bytesOf() (+19 more)

### Community 30 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 31 - "designs.ts"
Cohesion: 0.13
Nodes (15): commentError(), CommentRow(), CommentsPanel(), Props, Approval, Author, CommentInput, DESIGN_FORMAT (+7 more)

### Community 32 - "Refusal"
Cohesion: 0.07
Nodes (94): streamProcess(), abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), prepareMerge(), readBranch() (+86 more)

### Community 33 - "hoard_page.tsx"
Cohesion: 0.12
Nodes (20): STAGE_SCALE, Coins(), EggArt(), MEDALS, Sky(), StageArt(), FIRST_LEVEL, STAGES (+12 more)

### Community 34 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.18
Nodes (17): colourError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, nextFormOf() (+9 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.13
Nodes (23): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+15 more)

### Community 38 - "project_views.ts"
Cohesion: 0.05
Nodes (61): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+53 more)

### Community 39 - "createWorkspace"
Cohesion: 0.13
Nodes (15): ACTIVE, HOLD, moved(), open(), QUEST, started(), BOARD, fail (+7 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.12
Nodes (45): Task 11: `tasks`: the task's own cycle, Task 12: `app/`, and the end of the flat files, Task 7: Split the menu and the band in place, drawCup(), renderBand(), stillCup(), drawHelp(), HELP_KEYS (+37 more)

### Community 41 - "notes_page.tsx"
Cohesion: 0.12
Nodes (23): Dialog(), useWindowWidth(), captureOf(), whenOf(), DeleteNote(), layoutOf(), NotesPage(), Props (+15 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.22
Nodes (20): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+12 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "What each screen reads from existing data"
Cohesion: 0.09
Nodes (59): readChoices(), Already built, 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, What each screen reads from existing data, One engine, two hosts, checkPrompt(), checkTypedMessage() (+51 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.16
Nodes (35): The eight items, Task 10: `tasks`: the queue side, removeTaskUseCase(), togglePlayNextUseCase(), unblockTaskUseCase(), fileFromCommand(), parentFor(), blockTask() (+27 more)

### Community 50 - "library_api.ts"
Cohesion: 0.07
Nodes (43): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+35 more)

### Community 51 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.26
Nodes (13): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+5 more)

### Community 53 - "App"
Cohesion: 0.13
Nodes (11): App(), moodOf(), open(), useHour(), KNOWN, NEW, open(), TWO (+3 more)

### Community 54 - "engine_api.ts"
Cohesion: 0.06
Nodes (47): DEFAULT_LOG_PATH, skyAt(), skyOf(), SkyTime, Change, changeEntry(), changeQuests(), dropQuest() (+39 more)

### Community 55 - "4. Screens"
Cohesion: 0.12
Nodes (16): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.16 States across screens, 4.17 Narrow window and the command palette (+8 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "server.ts"
Cohesion: 0.16
Nodes (21): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+13 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (15): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader(), orderOf(), parse() (+7 more)

### Community 59 - "settings_page.tsx"
Cohesion: 0.18
Nodes (17): logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening(), PageProps (+9 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "emptyRecord"
Cohesion: 0.04
Nodes (54): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+46 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "services/time.ts"
Cohesion: 0.07
Nodes (60): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+52 more)

### Community 64 - "messages.ts"
Cohesion: 0.13
Nodes (13): GAME_WORDS, MESSAGES, GameDeps, HelpersDeps, getOnce(), isPublicAddress(), lookupOf(), PRIVATE (+5 more)

### Community 65 - "app.tsx"
Cohesion: 0.06
Nodes (69): DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, Dragon(), PriorityTag(), Board(), Glory(), HomePage(), HomeProps (+61 more)

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
Cohesion: 0.04
Nodes (88): GRAPH_CHARGE, GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_GRAVITY, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_LABEL_ZOOM, GRAPH_LINK_DISTANCE (+80 more)

### Community 70 - "band_host.tsx"
Cohesion: 0.05
Nodes (68): Order to fix them, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet (+60 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.05
Nodes (77): ACTIVITY_REFRESH_MS, CANVAS_CARD_SIZE, CANVAS_CASCADE_PX, CANVAS_CURVE_PX, CANVAS_DRAG_PX, CANVAS_EXCERPT, CANVAS_FIT_PX, CANVAS_MIN_SIZE (+69 more)

### Community 73 - "App"
Cohesion: 0.09
Nodes (15): BOARD, FIRST, open(), SAGA, SECOND, open(), pending(), BOARD (+7 more)

### Community 74 - "package.json"
Cohesion: 0.08
Nodes (23): author, description, license, main, name, overrides, d3-dispatch, d3-quadtree (+15 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "designs.spec.tsx"
Cohesion: 0.15
Nodes (9): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), AUTOSAVE_MS (+1 more)

### Community 77 - "test_support.ts"
Cohesion: 0.17
Nodes (15): chronicle(), mana(), game(), CHRONICLE, DESIGNS, GAME, helperJob(), HOARD (+7 more)

### Community 78 - "designs_api.ts"
Cohesion: 0.13
Nodes (33): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+25 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.14
Nodes (35): Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf() (+27 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "Architecture"
Cohesion: 0.10
Nodes (21): Architecture, Build order, for the plan, Checked, Decisions, Files in a quest's description, In this release, Not in this release, Opening on a project (+13 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.19
Nodes (13): change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE, NOW (+5 more)

### Community 89 - "realms_api.ts"
Cohesion: 0.08
Nodes (61): projectsFolder(), reply(), openMergeFolder(), cancelMergeChecks(), readPush(), readCodexSession(), Observation, observeTask() (+53 more)

### Community 90 - "Queue-tea in Codex"
Cohesion: 0.13
Nodes (13): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification, Decision and limits (+5 more)

### Community 91 - "conversation_turn_controller.ts"
Cohesion: 0.28
Nodes (12): File Structure, Task 9: Keeping usage down, formatAllowance(), pad(), readAllowance(), shouldFresh(), shouldHandoff(), windowKey() (+4 more)

### Community 92 - "update_service.ts"
Cohesion: 0.23
Nodes (8): majorOf(), setup(), updateWatch(), WatchDeps, changedBuild(), UpdatePhase, UpdateState, PublishedRequest

### Community 93 - "vitest"
Cohesion: 0.04
Nodes (51): createLogger(), Logger, stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host (+43 more)

### Community 94 - "Designs tab"
Cohesion: 0.14
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (100): 5. Features, shared resources and the core, Shared resources, The core and the app, Task 5: The shared resources' data and controllers, Task 4: The turn's instruction and the first message, pressOpenApp(), toggleMenu(), loadContext() (+92 more)

### Community 96 - "branches.spec.tsx"
Cohesion: 0.13
Nodes (20): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+12 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 100 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 101 - "Reply"
Cohesion: 0.16
Nodes (11): BOARD, FIRST, key(), open(), palette(), SECOND, BOARD, input() (+3 more)

### Community 102 - "release_guard.mjs"
Cohesion: 0.23
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "main/features/notes/domain/note_canvas.ts"
Cohesion: 0.30
Nodes (12): canvasOf(), canvasText(), edgeOf(), extrasOf(), isId(), isObject(), isPlace(), isSize() (+4 more)

### Community 105 - "notes.spec.tsx"
Cohesion: 0.13
Nodes (12): brewTransfer(), dragBrew(), layouts, memoryNotes(), ok(), open(), BOARD, NOTES (+4 more)

### Community 107 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.27
Nodes (10): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 4: The git guard, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+2 more)

### Community 108 - "flows.spec.tsx"
Cohesion: 0.13
Nodes (13): BOARD, held(), hold(), MAIN, open(), OTHER, SEALED, withActive() (+5 more)

### Community 109 - "spec.md"
Cohesion: 0.13
Nodes (11): Audit: what the menu exposes of the engine, 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing (+3 more)

### Community 110 - "Gaps"
Cohesion: 0.11
Nodes (19): 2. Codex time, 3. Activity steps, 4. The time budget, Checking the record, G10. Smaller ones, G1. Work outside Claude Code counts nothing, G2. A gap over the limit counts zero, not the limit, G3. A long tool call counts zero (+11 more)

### Community 111 - "inspector.tsx"
Cohesion: 0.21
Nodes (14): numberError(), TextEdit(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, LayerView() (+6 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "activity.spec.ts"
Cohesion: 0.24
Nodes (10): AT, COMMIT_ACTIVITY_LIMIT, readActivity(), log, step(), ACTIVITY_LIMIT, ACTIVITY_TEXT_LIMIT, activityEntries() (+2 more)

### Community 116 - "description_files.spec.tsx"
Cohesion: 0.29
Nodes (6): box(), drop(), open(), pane(), pick(), saved()

### Community 117 - "start_api.spec.ts"
Cohesion: 0.11
Nodes (19): loadCodexContext(), git(), NOW, run, seed(), Task 1: the file seam, Host, RunResult (+11 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.25
Nodes (8): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "check_layers.mjs"
Cohesion: 0.30
Nodes (11): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+3 more)

### Community 120 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 121 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 122 - "description_files.ts"
Cohesion: 0.39
Nodes (6): firstMessage(), DescriptionFile, descriptionFiles(), NOTES_FOLDER, notesFolderOf(), withFilePaths()

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "Time and mana tracking: proposed design (Q01)"
Cohesion: 0.17
Nodes (12): Acceptance checks, Capability map, Confirmed counting rule, Counting overlapping work, Evidence and proposed contracts, Goal and limits, Options, Persistence and migration (+4 more)

### Community 125 - "settings.spec.tsx"
Cohesion: 0.20
Nodes (5): FAILED, NEW_FOLDER, open(), Settings, SettingsPage

### Community 126 - "Scene"
Cohesion: 0.33
Nodes (6): commit(), History, historyOf(), redo(), undo(), Scene

### Community 127 - "dependency_setup.ts"
Cohesion: 0.33
Nodes (8): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies()

### Community 128 - "Guild helpers on tasks"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+3 more)

### Community 129 - "Daily work time in a Realm"
Cohesion: 0.25
Nodes (6): Daily work time in a Realm, Earlier recorded time, Recording and recovery, Scope, Verification, Where the total appears

### Community 130 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 131 - "card_note.ts"
Cohesion: 0.39
Nodes (7): 4.4 A task's detail: current, queued and done, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote()

### Community 132 - "mocha-mockup.md"
Cohesion: 0.40
Nodes (4): Drafting a version for the Designs tab, How you work, What you don't do, What you report

### Community 133 - "assistant_providers.ts"
Cohesion: 0.46
Nodes (4): assistantRepositoryOf(), assistantRepositoryImpl(), Reply, AssistantRepository

### Community 134 - "Notes performance and guide"
Cohesion: 0.33
Nodes (6): Goal and limits, List behavior, Notes performance and guide, Open questions, Options, Verification

### Community 135 - "activity.ts"
Cohesion: 0.18
Nodes (11): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+3 more)

### Community 136 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 137 - "Part 5: an app you can install"
Cohesion: 0.40
Nodes (5): Part 5: an app you can install, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build

## Knowledge Gaps
- **8 isolated node(s):** `../tsconfig.json`, `@types/d3-force`, `@types/node`, `electron-builder`, `jsdom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `note_workspace.tsx`, `ref_node_path`, `app.tsx`, `designs_api.spec.ts`, `update_runner.mjs`, `EngineApi`, `ref_types`, `realms_api.ts`, `new_quest_sheet.tsx`, `git_repository.ts`, `first_run.tsx`, `record_source.ts`, `settings_api.ts`, `main.ts`, `t`, `useWindowKeys`, `quest_detail.tsx`, `feedback.spec.tsx`, `notes_api.ts`, `note_attachments.ts`, `designs.ts`, `Refusal`, `design_forms.ts`, `project_views.ts`, `createWorkspace`, `notes_page.tsx`, `claude_code.ts`, `library_api.ts`, `App`, `engine_api.ts`, `server.ts`, `host.ts`, `emptyRecord`, `services/time.ts`, `messages.ts`, `app.tsx`, `note_graph_view.tsx`, `note_canvas_view.tsx`, `App`, `package.json`, `designs.spec.tsx`, `test_support.ts`, `designs_api.ts`, `design_editor.tsx`, `notes_backup.spec.ts`, `update_service.ts`, `branches.spec.tsx`, `judgements.spec.ts`, `Reply`, `release_guard.mjs`, `main/features/notes/domain/note_canvas.ts`, `notes.spec.tsx`, `flows.spec.tsx`, `detail.spec.tsx`, `activity.spec.ts`, `description_files.spec.tsx`, `start_api.spec.ts`, `settings.spec.tsx`, `Scene`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/d3-force`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05434173669467787 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `start_api.spec.ts` to `designs_api.spec.ts`, `realms_api.ts`, `record_source.ts`, `settings_api.ts`, `git_source.ts`, `Part 4: the rest of the screens`, `ref_claude_code`, `Refusal`, `project_views.ts`, `claude_code.ts`, `What each screen reads from existing data`, `library_api.ts`, `messages.ts`, `File Structure`, `band_host.tsx`, `Architecture`, `realms_api.ts`, `vitest`, `tasks_controller.ts`, `activity.spec.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `ref_node_path` be split into smaller, more focused modules?**
  _Cohesion score 0.025741769407939305 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `server.ts` to `Repository Rules`, `Queue-tea: design`, `Gaps`, `start_api.spec.ts`, `Queue-tea, the workspace app`, `vitest`, `Tea-concile`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._