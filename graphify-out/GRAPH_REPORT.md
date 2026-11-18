# Graph Report - designs-approve-version-next  (2026-11-18)

## Corpus Check
- 552 files · ~518,447 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3487 nodes · 12773 edges · 118 communities (113 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 682 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9edf92fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- ref_node_fs
- tasks_api.ts
- ports.ts
- notes_page.tsx
- pages.e2e.ts
- t
- time.ts
- opening_api.spec.ts
- tasks_controller.ts
- designs_page.tsx
- fixes.test.ts
- first_run.tsx
- mana.ts
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
- start_api.ts
- design_editor.tsx
- sessionsRepositoryImpl
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.ts
- note_attachments.ts
- menu_frame.tsx
- effort_tracker.ts
- flows.e2e.ts
- devDependencies
- app_menu.ts
- commit_guard.ts
- settings_api.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- codex_events.ts
- designs.spec.tsx
- notes.spec.ts
- Part A: the mod
- workspace_store.ts
- board.e2e.ts
- engine_api.ts
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- TasksDeps
- Queue-tea: panel redesign
- filing_controller.ts
- current_view.tsx
- chronicle_page.tsx
- view_store.ts
- docs_log_source.ts
- commit-chai-n.md
- inspector.tsx
- realms_api.spec.ts
- app/README.md
- quest_detail.tsx
- notes_api.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- card_note.ts
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
- designs.ts
- branch_workflow.e2e.ts
- Designs tab
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Tea-concile
- Notes
- Task Log
- main.tsx
- Host
- Guild helpers on tasks
- Queue-tea, the workspace app
- ref_node_fs
- Part 3: setting out and coming back
- .line-check-NZS8Gw/tsconfig.json
- register.tsx
- app.tsx
- test_support.ts
- brew_quest.tsx
- git_rules.spec.ts
- Scene
- projects_api.spec.ts
- comments_panel.tsx
- Review Focus
- Queue-tea
- electron

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
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Version history` --references--> `NoteVersion`  [INFERRED]
  docs/notes.md → app/shared/notes.ts
- `The road` --references--> `Host`  [INFERRED]
  docs/plan-workspace-app-2.md → hooks/core/host/host.ts
- `Decisions` --references--> `Host`  [INFERRED]
  docs/workspace-app.md → hooks/core/host/host.ts

## Import Cycles
- None detected.

## Communities (118 total, 5 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.17
Nodes (21): isInPlay(), QuestLine, questLineOf(), NoteAttachment(), groupsOf(), Props, QuestGroup, QuestItem() (+13 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.04
Nodes (52): createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost(), host, log (+44 more)

### Community 2 - "tasks_api.ts"
Cohesion: 0.06
Nodes (63): Drafting a version for the Designs tab, How you work, What you don't do, What you report, inGameWords(), notYet(), edit(), editQuest() (+55 more)

### Community 3 - "ports.ts"
Cohesion: 0.11
Nodes (37): Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, MenuSpec, Ports, SessionUsage, findNewCommits(), pad() (+29 more)

### Community 4 - "notes_page.tsx"
Cohesion: 0.11
Nodes (26): captureOf(), FolderGroup, localDay(), questLinesOf(), whenOf(), DeleteNote(), keyOf(), layoutOf() (+18 more)

### Community 5 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 6 - "t"
Cohesion: 0.06
Nodes (73): Content(), ROUTES, Answer, ask(), EngineRead, useEngineRead(), clockTime(), ReadView() (+65 more)

### Community 7 - "time.ts"
Cohesion: 0.09
Nodes (41): codexOperations(), CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, One engine, two hosts, Ctx, Env (+33 more)

### Community 8 - "opening_api.spec.ts"
Cohesion: 0.16
Nodes (22): projectsFolder(), canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs() (+14 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.07
Nodes (64): Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, How Claude uses them (the mod), once(), running, helperToRemind(), finishTaskUseCase(), markRemindedUseCase() (+56 more)

### Community 10 - "designs_page.tsx"
Cohesion: 0.09
Nodes (39): useWindowWidth(), colourError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors (+31 more)

### Community 11 - "fixes.test.ts"
Cohesion: 0.09
Nodes (34): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), closeBand(), showBand(), checkMessage() (+26 more)

### Community 12 - "first_run.tsx"
Cohesion: 0.15
Nodes (28): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+20 more)

### Community 13 - "mana.ts"
Cohesion: 0.17
Nodes (22): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+14 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.05
Nodes (43): A task's life, Codex in place of Claude Code, Coming back later, Commands, Effort, Errands, Features, Filing a task (+35 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.10
Nodes (29): drawCup(), MOOD_COLOR, MOOD_WORD, stillCup(), saveDocsPath(), drawDocsPathBand(), AIR, body() (+21 more)

### Community 16 - "scope.ts"
Cohesion: 0.09
Nodes (56): Logger, GAME_WORDS, MESSAGES, reply(), cancelMergeChecks(), readChronicle(), GameDeps, readGame() (+48 more)

### Community 17 - "git_source.ts"
Cohesion: 0.21
Nodes (23): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+15 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (61): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+53 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.09
Nodes (30): checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly(), placeOf() (+22 more)

### Community 20 - "emptyRecord"
Cohesion: 0.05
Nodes (38): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+30 more)

### Community 21 - "notes_view.ts"
Cohesion: 0.17
Nodes (22): folderError(), folderNameError(), foldersOf(), IN_PLAY, isUntitled(), linkOptionsOf(), linkPicksOf(), linkQueryAt() (+14 more)

### Community 22 - "families.ts"
Cohesion: 0.16
Nodes (34): entryOf(), viewOf(), readChoices(), 4.5 New task, and Add child task inline, What each screen reads from existing data, checkPrompt(), checkTypedMessage(), FeatureFound (+26 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (27): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), canRun(), creates(), entry(), filterPalette() (+19 more)

### Community 25 - "server.ts"
Cohesion: 0.09
Nodes (30): log, main(), codexSkills(), companionSkills(), files, helperDefinition(), helperInstructions(), skill() (+22 more)

### Community 26 - "Part 2: edits"
Cohesion: 0.12
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.19
Nodes (16): 4.1 Home, CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), checkpointPrompt(), codexBrief(), commandRun(), count() (+8 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.07
Nodes (38): Task 1: the file seam, unixFiles(), fileTask(), codexRepositoryOf(), folderOf(), readCodexActivity(), codexRepositoryImpl(), CodexRepository (+30 more)

### Community 29 - "hud.tsx"
Cohesion: 0.19
Nodes (19): hrefOf(), manaLeft(), isStreakAtRisk(), laterHook(), Momentum, momentumOf(), nearestBadge(), QuestAhead (+11 more)

### Community 30 - "ranking.ts"
Cohesion: 0.12
Nodes (32): activeOf(), BRANCH_ORDER, difficultyOf(), minutesOf(), questOf(), rowOf(), sessionInfoOf(), statusOf() (+24 more)

### Community 31 - "game.ts"
Cohesion: 0.15
Nodes (23): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+15 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.09
Nodes (86): Refusal, abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge() (+78 more)

### Community 33 - "start_api.ts"
Cohesion: 0.22
Nodes (17): isSessionOpen(), checkStart(), continueIn(), copyText(), goneSentence(), handOver(), holdOf(), isClaudeWorking() (+9 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (43): DETAIL_IS_PAGE_BELOW, Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle, handlesOf() (+35 more)

### Community 35 - "sessionsRepositoryImpl"
Cohesion: 0.19
Nodes (18): readCodexSession(), Observation, observeTask(), readSettingsPage(), BranchState, Stage B: Settings, first run and the failed record, Task 3: session files, readSessions() (+10 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.07
Nodes (43): Read, held(), hold(), Edit, Task 3: Entities and pure rules, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order (+35 more)

### Community 38 - "designs_api.ts"
Cohesion: 0.21
Nodes (17): approvalOf(), checkScene(), isComment(), isNumberIn(), isObject(), isText(), Json, layerFault() (+9 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.19
Nodes (16): formatOf(), noteFiles(), AttachmentInput(), bytesOf(), attachmentError(), attachmentMarkdown(), extensionOf(), NOTE_ATTACHMENTS (+8 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.18
Nodes (27): Task 7: Split the menu and the band in place, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressMenu(), renderMenu(), grouped() (+19 more)

### Community 41 - "effort_tracker.ts"
Cohesion: 0.20
Nodes (16): noteSeen(), applyPending(), CHANGES, countToolCall(), createTracker(), nothing(), once(), Pending (+8 more)

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
Cohesion: 0.12
Nodes (26): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+18 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.11
Nodes (18): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+10 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.16
Nodes (34): The eight items, Task 10: `tasks`: the queue side, KEYS, setFeatureUseCase(), fileFromCommand(), parentFor(), blockTask(), featureCommand() (+26 more)

### Community 50 - "library_api.ts"
Cohesion: 0.23
Nodes (18): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+10 more)

### Community 51 - "codex_events.ts"
Cohesion: 0.23
Nodes (9): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), finishActivity(), toolActivity() (+1 more)

### Community 52 - "designs.spec.tsx"
Cohesion: 0.11
Nodes (17): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), AUTOSAVE_MS, NUDGE_PX (+9 more)

### Community 53 - "notes.spec.ts"
Cohesion: 0.18
Nodes (14): body(), write(), brewLineOf(), linkLineOf(), linksOf(), NOTE_TYPES, once(), openItemsOf() (+6 more)

### Community 54 - "Part A: the mod"
Cohesion: 0.13
Nodes (14): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 2: the new record fields (+6 more)

### Community 55 - "workspace_store.ts"
Cohesion: 0.08
Nodes (29): ACTIVITY_REFRESH_MS, DETAIL_FLOATS_BELOW, DRAG_SLOP_PX, GROWS_AT, HOME_BADGES, HOME_BOARD_ROWS, LINES_REFRESH_MS, NOTE_AUTOSAVE_MS (+21 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "engine_api.ts"
Cohesion: 0.06
Nodes (47): STAGE_SCALE, Coins(), EggArt(), MEDALS, StageArt(), FIRST_LEVEL, STAGES, stageState() (+39 more)

### Community 58 - "host.ts"
Cohesion: 0.20
Nodes (17): HelpersApi, HelpersDeps, Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, lineReader() (+9 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.15
Nodes (13): chronicle(), mana(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 6. The app: frontend, backend and storage (+5 more)

### Community 61 - "TasksDeps"
Cohesion: 0.16
Nodes (6): now, cache, catalog, Session, counts, TasksDeps

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "filing_controller.ts"
Cohesion: 0.25
Nodes (11): DIFFICULTIES, FileInput, FileResult, filing, nameNewFeature(), pickBand(), saveFile(), saveDifficulty() (+3 more)

### Community 64 - "current_view.tsx"
Cohesion: 0.34
Nodes (13): Task 11: `tasks`: the task's own cycle, capital(), markFor(), pressBackToQueue(), pressCheckAgain(), pressContinue(), pressDoneNotYet(), pressStart() (+5 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.15
Nodes (24): dayName(), weekdayIndex(), weekdayOf(), BAR_PX, Column(), dayTotal(), MiniChart(), mostOf() (+16 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (29): View, allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom (+21 more)

### Community 67 - "docs_log_source.ts"
Cohesion: 0.22
Nodes (14): File Structure, addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog() (+6 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "inspector.tsx"
Cohesion: 0.33
Nodes (7): numberError(), Inspector(), InspectorProps, number(), Small(), WEIGHTS, isFrame()

### Community 70 - "realms_api.spec.ts"
Cohesion: 0.29
Nodes (4): fileOf(), NOW, run, seed()

### Community 71 - "app/README.md"
Cohesion: 0.22
Nodes (3): Global Constraints, Parallel quests: implementation decisions, Queue-tea Implementation Plan

### Community 72 - "quest_detail.tsx"
Cohesion: 0.06
Nodes (63): SheetView(), DEFAULT_LOG_PATH, XP_BY_DIFFICULTY, Dialog(), Field(), FieldProps, Group(), Pick() (+55 more)

### Community 73 - "notes_api.ts"
Cohesion: 0.10
Nodes (40): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, NotesDeps, proposedOf() (+32 more)

### Community 74 - "package.json"
Cohesion: 0.15
Nodes (12): author, description, license, main, name, private, productName, version (+4 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 77 - "card_note.ts"
Cohesion: 0.43
Nodes (6): 4.4 A task's detail: current, queued and done, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections()

### Community 78 - "server.ts"
Cohesion: 0.21
Nodes (21): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+13 more)

### Community 79 - "Roadmap: the outside review, checked against the code"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.04
Nodes (102): HOLD_FILES_SHOWN, dayAndTime(), dayOf(), isClaudeOut(), refillTime(), NOW, Dragon(), Spinner() (+94 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "designs_api.spec.ts"
Cohesion: 0.08
Nodes (27): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+19 more)

### Community 89 - "record_source.ts"
Cohesion: 0.08
Nodes (36): p, git(), NOW, onDisk(), run, seed(), game(), What's saved (+28 more)

### Community 91 - "designs.ts"
Cohesion: 0.13
Nodes (24): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+16 more)

### Community 92 - "branch_workflow.e2e.ts"
Cohesion: 0.08
Nodes (34): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+26 more)

### Community 94 - "Designs tab"
Cohesion: 0.18
Nodes (11): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+3 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.07
Nodes (37): esbuild, writeBundle(), Deps, setup(), updateService(), majorOf(), setup(), updateWatch() (+29 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 101 - "Notes"
Cohesion: 0.11
Nodes (18): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Decisions, Fields and their checks (+10 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 106 - "Host"
Cohesion: 0.11
Nodes (22): OutputSink, ProcessRequest, running, stopProcesses(), streamProcess(), nodeUserGit(), UserGit, UserGitAction (+14 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.20
Nodes (9): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, Out of scope, Tests, The reminder at "done", Where Rohan chooses (+1 more)

### Community 109 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 110 - "ref_node_fs"
Cohesion: 0.05
Nodes (29): APP, FIRST, record(), recordFile(), replaceRecord(), APP, event(), plantClaude() (+21 more)

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.17
Nodes (12): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+4 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "register.tsx"
Cohesion: 0.09
Nodes (68): live(), 5. Features, shared resources and the core, Features, The core and the app, Task 12: `app/`, and the end of the flat files, Task 4: The core, Task 6: `commit_guard` and `errands`, renderBand() (+60 more)

### Community 116 - "app.tsx"
Cohesion: 0.06
Nodes (52): App(), ContentProps, moodOf(), MORE_PAGES, SheetProps, TABS, useHour(), ALL (+44 more)

### Community 119 - "test_support.ts"
Cohesion: 0.03
Nodes (109): open(), BOARD, FIRST, open(), SAGA, SECOND, click(), one (+101 more)

### Community 120 - "brew_quest.tsx"
Cohesion: 0.19
Nodes (13): lineOf(), tickedItemsOf(), BrewSheet(), DIFFICULTIES, Errors, parentError(), PRIORITIES, questTitleError() (+5 more)

### Community 122 - "git_rules.spec.ts"
Cohesion: 0.33
Nodes (7): graphLayout(), BranchGraph(), FORK, MERGE, SOURCE, TARGET, BranchGraph

### Community 123 - "Scene"
Cohesion: 0.36
Nodes (5): commit(), History, historyOf(), redo(), undo()

### Community 125 - "projects_api.spec.ts"
Cohesion: 0.20
Nodes (7): list(), logged, NOW, put(), putRecord(), read(), record()

### Community 128 - "comments_panel.tsx"
Cohesion: 0.38
Nodes (6): commentError(), CommentRow(), CommentsPanel(), Props, CommentInput, Problem

### Community 130 - "Review Focus"
Cohesion: 0.25
Nodes (8): After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 13: Docs, then the real thing, Task 1: Pin what the tests don't cover yet, Task 2: The layer check

### Community 132 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 137 - "electron"
Cohesion: 0.50
Nodes (3): engine, CHANNELS, electron

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 962 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ref_node_fs` to `note_workspace.tsx`, `t`, `time.ts`, `designs_page.tsx`, `first_run.tsx`, `emptyRecord`, `notes_view.ts`, `server.ts`, `game.ts`, `branch_api.ts`, `start_api.ts`, `design_editor.tsx`, `designs_api.ts`, `note_attachments.ts`, `app_menu.ts`, `library_api.ts`, `designs.spec.tsx`, `notes.spec.ts`, `engine_api.ts`, `host.ts`, `TasksDeps`, `realms_api.spec.ts`, `quest_detail.tsx`, `notes_api.ts`, `package.json`, `server.ts`, `quests_page.tsx`, `designs_api.spec.ts`, `record_source.ts`, `designs.ts`, `ref_node_child_process`, `ref_node_fs`, `app.tsx`, `test_support.ts`, `git_rules.spec.ts`, `Scene`, `projects_api.spec.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.041736694677871146 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `ref_node_fs`, `time.ts`, `opening_api.spec.ts`, `tasks_controller.ts`, `fixes.test.ts`, `cup_mood.ts`, `families.ts`, `server.ts`, `tests/helpers.ts`, `game.ts`, `branch_api.ts`, `ui.test.tsx`, `Task 3: Entities and pure rules`, `menu_frame.tsx`, `effort_tracker.ts`, `4. Screens`, `realms_api.spec.ts`, `designs_api.spec.ts`, `record_source.ts`, `branch_workflow.e2e.ts`, `projects_api.spec.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `tasks_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06316590563165905 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `Host` to `ref_node_fs`, `ports.ts`, `docs_log_source.ts`, `sessionsRepositoryImpl`, `time.ts`, `opening_api.spec.ts`, `settings_api.ts`, `server.ts`, `scope.ts`, `branch_workflow.e2e.ts`, `library_api.ts`, `register.tsx`, `git_source.ts`, `designs_api.spec.ts`, `Part A: the mod`, `record_source.ts`, `Part 2: edits`, `tests/helpers.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._