# Graph Report - designs-approve-version-next  (2026-11-18)

## Corpus Check
- 552 files · ~518,400 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3486 nodes · 12772 edges · 139 communities (131 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 682 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21c2bd06`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- ref_node_fs
- Refusal
- ports.ts
- queue_rules.ts
- pages.e2e.ts
- EngineApi
- time.ts
- opening_api.spec.ts
- tasks_controller.ts
- design_forms.ts
- check_prompt.ts
- first_run.tsx
- t
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- emptyRecord
- notes_view.ts
- families.ts
- edits.e2e.ts
- palette.ts
- server.ts
- Part 2: edits
- checkpoints.ts
- tests/helpers.ts
- hud.tsx
- ranking.ts
- game.ts
- branch_api.ts
- App
- design_editor.tsx
- sessions.test.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- note_attachments.ts
- menu_frame.tsx
- worktrees_repository_impl.ts
- flows.e2e.ts
- devDependencies
- app_menu.ts
- commit_guard.ts
- settings_api.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- activity.ts
- designs.spec.tsx
- notes.ts
- library_page.tsx
- app.tsx
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- settings_page.tsx
- Queue-tea: panel redesign
- band_host.tsx
- flows.spec.tsx
- chronicle_page.tsx
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- helpers_api.spec.ts
- hoard_page.tsx
- app/README.md
- quest_detail.tsx
- notes_api.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- live_api.spec.ts
- server.ts
- Roadmap: the outside review, checked against the code
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- designs_api.spec.ts
- record_source.ts
- detail_api.ts
- designs.ts
- branch_workflow.e2e.ts
- Architecture
- Designs tab
- test_support.ts
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Tea-concile
- Notes
- Shared Types (Task 1 writes them; every task uses them)
- Task Log
- main.tsx
- feedback.spec.tsx
- helpers_api.ts
- project_views.ts
- Guild helpers on tasks
- Queue-tea, the workspace app
- ref_node_path
- detail.spec.tsx
- Part 3: setting out and coming back
- check_layers.mjs
- .line-check-NZS8Gw/tsconfig.json
- register.tsx
- quest_keys.ts
- notes.e2e.ts
- Part 2: edits
- ProjectView
- brew_quest.tsx
- codex_providers.ts
- fakeEngine
- Scene
- judgements.spec.ts
- projects_api.spec.ts
- board.spec.tsx
- shell.spec.tsx
- comments_panel.tsx
- Queue-tea: workspace app
- Review Focus
- settings.spec.tsx
- Queue-tea
- first_window.e2e.ts
- sky_time.ts
- queue_rules.ts
- quests_edits.spec.tsx
- electron
- update_control.spec.tsx

## God Nodes (most connected - your core abstractions)
1. `t` - 109 edges
2. `Refusal` - 101 edges
3. `vitest` - 90 edges
4. `emptyRecord()` - 80 edges
5. `reply()` - 74 edges
6. `preact` - 65 edges
7. `EngineApi` - 65 edges
8. `currentTask()` - 64 edges
9. `Reply` - 61 edges
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
- `Version history` --references--> `NoteVersion`  [INFERRED]
  docs/notes.md → app/shared/notes.ts

## Import Cycles
- None detected.

## Communities (139 total, 8 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.15
Nodes (25): isInPlay(), localDay(), QuestLine, questLineOf(), whenOf(), caretPoint(), changeOf(), groupsOf() (+17 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.05
Nodes (45): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+37 more)

### Community 2 - "Refusal"
Cohesion: 0.09
Nodes (66): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+58 more)

### Community 3 - "ports.ts"
Cohesion: 0.10
Nodes (40): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, MenuSpec, Ports, SessionUsage, pad(), shouldFresh() (+32 more)

### Community 4 - "queue_rules.ts"
Cohesion: 0.17
Nodes (19): Drafting a version for the Designs tab, How you work, What you don't do, What you report, NewQuest, QuestEdit, Task 1: the engine's three additions, Task 2: Filing and editing carry the choice (+11 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "EngineApi"
Cohesion: 0.08
Nodes (57): ask(), EngineRead, useEngineRead(), ReadView(), Loading(), Spinner(), useWindowWidth(), Window (+49 more)

### Community 7 - "time.ts"
Cohesion: 0.07
Nodes (55): codexOperations(), CodexRefusal, readable(), ctx, setup(), One engine, two hosts, Ctx, Env (+47 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (61): Task 11: `tasks`: the task's own cycle, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), once(), running, markFor(), helperToRemind() (+53 more)

### Community 10 - "design_forms.ts"
Cohesion: 0.12
Nodes (23): colourError(), Drafted, draftOf(), labelError(), lineOf(), NextErrors, NextField, nextFormOf() (+15 more)

### Community 11 - "check_prompt.ts"
Cohesion: 0.19
Nodes (14): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+6 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.12
Nodes (35): HOLD_FILES_SHOWN, accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf() (+27 more)

### Community 13 - "t"
Cohesion: 0.10
Nodes (31): Content(), Failed(), HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES (+23 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.11
Nodes (24): AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt, CupFacts, cupOf() (+16 more)

### Community 16 - "scope.ts"
Cohesion: 0.11
Nodes (51): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+43 more)

### Community 17 - "git_source.ts"
Cohesion: 0.19
Nodes (28): Task 8: The task flow, Already built, What each screen reads from existing data, Options, commitsBetween(), diffSince(), git(), lastCommit() (+20 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (61): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+53 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (21): env, run, server, @modelcontextprotocol/sdk, fixtures, addToCommit(), bumpOf(), FILES (+13 more)

### Community 20 - "emptyRecord"
Cohesion: 0.05
Nodes (31): Account, plantGh(), statusOf(), APP, dayBefore(), won(), APP, BUNDLE (+23 more)

### Community 21 - "notes_view.ts"
Cohesion: 0.14
Nodes (26): brewLineOf(), folderError(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY, isUntitled(), linkOptionsOf() (+18 more)

### Community 22 - "families.ts"
Cohesion: 0.18
Nodes (26): 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, checkPrompt(), checkTypedMessage(), TypedVerdict, MoveResult, moveTaskUseCase(), activeFeature() (+18 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 25 - "server.ts"
Cohesion: 0.13
Nodes (25): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+17 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.14
Nodes (25): 4.4 A task's detail: current, queued and done, CODEX_RULES(), FIRST_MESSAGE_LABELS, cardNote, HandoffSection, handoffSections(), isHeading(), checkLines() (+17 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.07
Nodes (41): Task 1: the file seam, unixFiles(), emptyRecord(), projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost() (+33 more)

### Community 29 - "hud.tsx"
Cohesion: 0.09
Nodes (34): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), GROWS_AT, isStreakAtRisk() (+26 more)

### Community 30 - "ranking.ts"
Cohesion: 0.18
Nodes (22): 4.2 Tasks, with a feature in the detail pane, blockedTasks(), blockedText(), blockersOf(), BUDGETS, canWaitFor(), DEFAULT_MINUTES, effectivePriority() (+14 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (23): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+15 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.08
Nodes (86): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+78 more)

### Community 33 - "App"
Cohesion: 0.19
Nodes (23): App(), moodOf(), open(), useHour(), open(), open(), open(), open() (+15 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.13
Nodes (40): Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf(), layerOf() (+32 more)

### Community 35 - "sessions.test.ts"
Cohesion: 0.07
Nodes (43): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+35 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.15
Nodes (21): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+13 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.17
Nodes (20): approvalOf(), checkScene(), CommentsFile, isComment(), isNumberIn(), isObject(), isText(), Json (+12 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.16
Nodes (20): filePathOf(), formatOf(), noteFiles(), AttachmentInput(), bytesOf(), tokenizer(), attachmentError(), attachmentMarkdown() (+12 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.17
Nodes (33): Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), pressOpenApp() (+25 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "app_menu.ts"
Cohesion: 0.24
Nodes (9): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+1 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "settings_api.ts"
Cohesion: 0.13
Nodes (24): GithubApi, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf(), isGithubLogin(), rawAccounts() (+16 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.16
Nodes (39): Features, The eight items, Task 10: `tasks`: the queue side, KEYS, togglePlayNextUseCase(), unblockTaskUseCase(), fileTask(), clearHold() (+31 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.ts"
Cohesion: 0.11
Nodes (20): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+12 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.14
Nodes (9): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), AUTOSAVE_MS, NUDGE_PX (+1 more)

### Community 53 - "notes.ts"
Cohesion: 0.12
Nodes (25): body(), memoryNotes(), ok(), write(), linkLineOf(), versions, note(), backlinksOf() (+17 more)

### Community 54 - "library_page.tsx"
Cohesion: 0.18
Nodes (20): Answer, Empty(), BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError() (+12 more)

### Community 55 - "app.tsx"
Cohesion: 0.05
Nodes (54): ContentProps, MORE_PAGES, SheetProps, TABS, KNOWN, NEW, TWO, DETAIL_FLOATS_BELOW (+46 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.06
Nodes (49): MEDALS, withoutReview(), askingLine(), stepLine(), Named, QuestActions, Readable, Named (+41 more)

### Community 58 - "host.ts"
Cohesion: 0.22
Nodes (13): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, parse(), Seen, seenIn() (+5 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.18
Nodes (11): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 5. Features, shared resources and the core, 7. Tests, 8. Getting there (+3 more)

### Community 61 - "settings_page.tsx"
Cohesion: 0.15
Nodes (19): DEFAULT_LOG_PATH, logPathError(), copyText(), FromClaude(), Keyboard(), LogDialog(), Motion(), Opening() (+11 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.20
Nodes (9): plain(), Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API) (+1 more)

### Community 63 - "band_host.tsx"
Cohesion: 0.16
Nodes (27): live(), Order to fix them, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand(), showBand() (+19 more)

### Community 64 - "flows.spec.tsx"
Cohesion: 0.15
Nodes (11): line(), BOARD, held(), hold(), MAIN, OTHER, SEALED, withActive() (+3 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.08
Nodes (57): clockTime(), dayAndTime(), dayName(), dayOf(), isClaudeOut(), manaLeft(), refillTime(), NOW (+49 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.18
Nodes (17): loadCodexContext(), File Structure, addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE (+9 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "helpers_api.spec.ts"
Cohesion: 0.14
Nodes (13): ProcessRequest, DONE, INIT, jobOf(), last(), NOW, ran(), READ (+5 more)

### Community 70 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (17): STAGE_SCALE, Coins(), EggArt(), Sky(), StageArt(), FIRST_LEVEL, STAGES, stageState() (+9 more)

### Community 72 - "quest_detail.tsx"
Cohesion: 0.08
Nodes (49): SheetView(), Dialog(), Field(), FieldProps, Group(), Pick(), useWindowKeys(), NextForm (+41 more)

### Community 73 - "notes_api.ts"
Cohesion: 0.10
Nodes (33): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+25 more)

### Community 74 - "package.json"
Cohesion: 0.15
Nodes (12): author, description, license, main, name, private, productName, version (+4 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 77 - "live_api.spec.ts"
Cohesion: 0.14
Nodes (12): data(), facts(), git(), NOW, run, seed(), logged, NOW (+4 more)

### Community 78 - "server.ts"
Cohesion: 0.21
Nodes (21): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+13 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.14
Nodes (11): Audit: what the menu exposes of the engine, Problems not on the list, 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing (+3 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.06
Nodes (59): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, metaOf(), openRow(), Row, rowsOf(), stepFrom(), withWholeSagas() (+51 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (18): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+10 more)

### Community 89 - "record_source.ts"
Cohesion: 0.07
Nodes (41): fileOf(), realmFile(), p, canRestoreFrom(), git(), NOW, onDisk(), run (+33 more)

### Community 90 - "detail_api.ts"
Cohesion: 0.21
Nodes (15): readCodexSession(), Observation, observeTask(), activeOf(), branchToBe(), gitOf(), linesSince(), quietly() (+7 more)

### Community 91 - "designs.ts"
Cohesion: 0.15
Nodes (22): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+14 more)

### Community 92 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 93 - "Architecture"
Cohesion: 0.15
Nodes (13): Architecture, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals, The Designs tab (+5 more)

### Community 94 - "Designs tab"
Cohesion: 0.15
Nodes (13): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+5 more)

### Community 95 - "test_support.ts"
Cohesion: 0.17
Nodes (15): chronicle(), mana(), game(), CHRONICLE, DESIGNS, GAME, helperJob(), HOARD (+7 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.13
Nodes (23): Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity (+15 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.15
Nodes (14): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+6 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "Notes"
Cohesion: 0.10
Nodes (19): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Decisions, Fields and their checks (+11 more)

### Community 102 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.24
Nodes (11): Read, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 2: The record, Task 3: Reading git and making branches, Task 5: Time and effort, Task 6: The docs log, Task 7: The message check (+3 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 105 - "feedback.spec.tsx"
Cohesion: 0.15
Nodes (9): ACCOUNTS, BOARD, input(), moved(), started(), empty(), projectView(), reply() (+1 more)

### Community 106 - "helpers_api.ts"
Cohesion: 0.19
Nodes (13): OutputSink, running, stopProcesses(), streamProcess(), nodeUserGit(), UserGit, UserGitAction, HelpersApi (+5 more)

### Community 107 - "project_views.ts"
Cohesion: 0.21
Nodes (15): activeOf(), BRANCH_ORDER, difficultyOf(), entryOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf() (+7 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", What's saved (+2 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_path"
Cohesion: 0.06
Nodes (20): APP, event(), plantClaude(), APP, errors, PNG, APP, esbuild (+12 more)

### Community 111 - "detail.spec.tsx"
Cohesion: 0.25
Nodes (5): ACTIVE, BOARD, FIRST, HELD, QUEST_FACTS

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "check_layers.mjs"
Cohesion: 0.23
Nodes (13): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+5 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "register.tsx"
Cohesion: 0.10
Nodes (62): The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, drawCup(), renderBand(), stillCup(), toggleMenu() (+54 more)

### Community 116 - "quest_keys.ts"
Cohesion: 0.21
Nodes (14): isFromMenu(), isLetterKey(), isOnControl(), isTyping(), LETTERS, menuKey(), PRIORITY_KEYS, QuestKey (+6 more)

### Community 117 - "notes.e2e.ts"
Cohesion: 0.40
Nodes (4): APP, errors, noteFiles(), notesDir()

### Community 118 - "Part 2: edits"
Cohesion: 0.29
Nodes (7): Edit, Part 2: edits, Review focus, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 119 - "ProjectView"
Cohesion: 0.13
Nodes (9): BOARD, input(), noop(), BOARD, fail, ROW, projectRow(), quest() (+1 more)

### Community 120 - "brew_quest.tsx"
Cohesion: 0.22
Nodes (13): lineOf(), tickedItemsOf(), BrewQuestCard(), BrewSheet(), DIFFICULTIES, Errors, parentError(), PRIORITIES (+5 more)

### Community 121 - "codex_providers.ts"
Cohesion: 0.24
Nodes (8): codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl(), CodexRepository, codexLog(), NOW, SINCE

### Community 122 - "fakeEngine"
Cohesion: 0.19
Nodes (13): click(), one, openReview(), two, view, branchGraph(), branchReview(), FORK (+5 more)

### Community 123 - "Scene"
Cohesion: 0.33
Nodes (6): commit(), History, historyOf(), redo(), undo(), Scene

### Community 124 - "judgements.spec.ts"
Cohesion: 0.29
Nodes (9): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, setup(), WatchDeps (+1 more)

### Community 125 - "projects_api.spec.ts"
Cohesion: 0.18
Nodes (8): ProjectsDeps, list(), logged, NOW, put(), putRecord(), read(), record()

### Community 126 - "board.spec.tsx"
Cohesion: 0.20
Nodes (5): BOARD, FIRST, SAGA, SECOND, LiveFacts

### Community 127 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), palette(), SECOND, NOTES

### Community 128 - "comments_panel.tsx"
Cohesion: 0.31
Nodes (8): commentError(), ids(), CommentRow(), CommentsPanel(), Props, CommentInput, layersOf(), Problem

### Community 129 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 130 - "Review Focus"
Cohesion: 0.22
Nodes (8): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check

### Community 131 - "settings.spec.tsx"
Cohesion: 0.25
Nodes (3): FAILED, NEW_FOLDER, SETTINGS_PAGE

### Community 132 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 133 - "first_window.e2e.ts"
Cohesion: 0.38
Nodes (5): APP, FIRST, record(), recordFile(), replaceRecord()

### Community 134 - "sky_time.ts"
Cohesion: 0.70
Nodes (3): skyAt(), skyOf(), SkyTime

### Community 135 - "queue_rules.ts"
Cohesion: 0.32
Nodes (7): Task 10: The panel, the band, the status line and the commands, removeTaskUseCase(), setPriorityUseCase(), orderQueue(), removeTask(), setPriority(), suggestion()

### Community 136 - "quests_edits.spec.tsx"
Cohesion: 0.25
Nodes (5): BOARD, CHOICES, FIRST, SAGA, SECOND

### Community 137 - "electron"
Cohesion: 0.50
Nodes (3): engine, CHANNELS, electron

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 961 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ref_node_fs` to `note_workspace.tsx`, `Refusal`, `settings.spec.tsx`, `EngineApi`, `time.ts`, `sky_time.ts`, `quests_edits.spec.tsx`, `design_forms.ts`, `update_control.spec.tsx`, `first_run.tsx`, `t`, `emptyRecord`, `notes_view.ts`, `server.ts`, `hud.tsx`, `game.ts`, `branch_api.ts`, `design_editor.tsx`, `sessions.test.ts`, `designs_api.ts`, `note_attachments.ts`, `app_menu.ts`, `library_api.ts`, `activity.ts`, `designs.spec.tsx`, `notes.ts`, `library_page.tsx`, `app.tsx`, `engine_api.ts`, `host.ts`, `flows.spec.tsx`, `chronicle_page.tsx`, `helpers_api.spec.ts`, `notes_api.ts`, `package.json`, `live_api.spec.ts`, `server.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `record_source.ts`, `designs.ts`, `test_support.ts`, `ref_node_child_process`, `feedback.spec.tsx`, `ref_node_path`, `detail.spec.tsx`, `ProjectView`, `fakeEngine`, `Scene`, `judgements.spec.ts`, `projects_api.spec.ts`, `board.spec.tsx`, `shell.spec.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1477832512315271 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `tests/helpers.ts` to `ref_node_fs`, `ports.ts`, `time.ts`, `cup_mood.ts`, `scope.ts`, `emptyRecord`, `families.ts`, `game.ts`, `branch_api.ts`, `sessions.test.ts`, `ui.test.tsx`, `4. Screens`, `helpers_api.spec.ts`, `live_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `branch_workflow.e2e.ts`, `Shared Types (Task 1 writes them; every task uses them)`, `judgements.spec.ts`, `projects_api.spec.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.04542124542124542 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `scope.ts` to `ref_node_fs`, `Queue-tea: workspace app`, `ports.ts`, `time.ts`, `opening_api.spec.ts`, `git_source.ts`, `Part 2: edits`, `tests/helpers.ts`, `sessions.test.ts`, `worktrees_repository_impl.ts`, `settings_api.ts`, `library_api.ts`, `activity.ts`, `docs_log_source.ts`, `server.ts`, `designs_api.spec.ts`, `record_source.ts`, `detail_api.ts`, `register.tsx`, `codex_providers.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._