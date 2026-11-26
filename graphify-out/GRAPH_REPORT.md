# Graph Report - audit-duets-execution  (2026-11-26)

## Corpus Check
- 782 files · ~859,379 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 9, (none) 4, .pen 4)

## Summary
- 5433 nodes · 19169 edges · 162 communities (156 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 919 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4cf1ab75`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- meeting_notes.ts
- @playwright/test
- Refusal
- brew_quest.tsx
- designs_api.spec.ts
- preact
- vitest
- check_prompt.ts
- makeTask
- register.tsx
- plan_page.tsx
- t
- Spinner
- notes.md
- Queue-tea: design
- Queue-tea: workspace app
- settings_api.ts
- git_source.ts
- main.ts
- version.test.mjs
- en.ts
- home_page.tsx
- recipe_panel.tsx
- designs.ts
- ref_node_fs
- notes_api.ts
- Part 3: setting out and coming back
- checkpoints.ts
- emptyRecord
- calendar_items.ts
- Tea-concile
- game.ts
- branch_api.ts
- project_source.ts
- palette.ts
- designs_page.tsx
- file_task.ts
- Task 3: Entities and pure rules
- calendar_api.ts
- services/time.ts
- menu_frame.tsx
- note_workspace.tsx
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- project_views.ts
- compilerOptions
- Notes: the knowledge graph view
- plan.ts
- Notes
- scopeOf
- branch_workflow.e2e.ts
- app_menu.ts
- hoard_page.tsx
- 4. Screens
- file
- server.spec.ts
- brewquest_api.ts
- parseRecord
- Queue-tea architecture
- plan_changes.ts
- Queue-tea: panel redesign
- ref_types
- messages.ts
- Queue-tea: workspace app UI design
- filing_controller.ts
- File Structure
- commit-chai-n.md
- note_graph_view.tsx
- Guild helpers on tasks
- design_forms.ts
- note_canvas_view.tsx
- activity.ts
- package.json
- chai-pter.md
- ics_import.ts
- engine_api.ts
- plan_rules.spec.ts
- design_editor.tsx
- tea-dd.md
- Architecture
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- opening_api.ts
- constants/constants.ts
- app.tsx
- ref_node_child_process
- core/logger.ts
- Designs tab
- tasks_controller.ts
- Time and mana tracking: proposed design (Q01)
- Branch workflow completion — 5 November 2026
- edits.e2e.ts
- release_guard.d.mts
- ics.spec.ts
- plan_board.ts
- event_form.ts
- Task Log
- dependency_setup.ts
- Gaps
- workspace-app.md
- Shared Types (Task 1 writes them; every task uses them)
- helpers_api.spec.ts
- spec.md
- record_source.ts
- A task's life
- brew_reply.ts
- Part A: the mod
- .line-check-NZS8Gw/tsconfig.json
- What Rohan sees
- scope.ts
- view_store.ts
- calendar_page.tsx
- brew_lessons.ts
- main
- designs.e2e.ts
- judgements.spec.ts
- Queue-tea, the workspace app
- library_api.ts
- brew_draft.ts
- Calendar
- plan_filters.tsx
- brew_brief.ts
- The record
- Design
- brew_robot.tsx
- designs.spec.tsx
- Part 2: edits
- activity.spec.ts
- Git modes
- Merge-check dependency setup
- check_layers.mjs
- detail_api.ts
- Home dashboard and quest navigation (Q06)
- release_guard.mjs
- concile_report.ts
- UI refinement
- setup.ts
- shell.e2e.ts
- presentation/widgets/read_view.tsx
- calendar_files.tsx
- BrewQuest: from a note to quests
- Meetings
- Part 4: the rest of the screens
- tokens.spec.ts
- history.spec.ts
- brew_drafts.ts
- claude_host.ts
- notes.e2e.ts
- branch_rules.ts
- GitState
- Helper policies
- Tea-Concile
- agents/brewquest.md
- Repository Rules

## God Nodes (most connected - your core abstractions)
1. `vitest` - 156 edges
2. `t` - 153 edges
3. `Refusal` - 136 edges
4. `emptyRecord()` - 103 edges
5. `preact` - 90 edges
6. `EngineApi` - 88 edges
7. `reply()` - 87 edges
8. `Reply` - 80 edges
9. `fakeEngine()` - 73 edges
10. `ask()` - 72 edges

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

## Communities (162 total, 6 thin omitted)

### Community 0 - "meeting_notes.ts"
Cohesion: 0.06
Nodes (61): MEETING, NOW, meetingOf(), NotesDeps, MEETING, jsonOr(), meetingLines(), NoteFile (+53 more)

### Community 1 - "@playwright/test"
Cohesion: 0.06
Nodes (22): APP, at, errors, fileTitled(), notesDir(), APP, FIRST, record() (+14 more)

### Community 2 - "Refusal"
Cohesion: 0.07
Nodes (77): inGameWords(), Refusal, sessionFor(), activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest() (+69 more)

### Community 3 - "brew_quest.tsx"
Cohesion: 0.12
Nodes (39): countOf(), criteriaError(), criteriaOf(), errorsOf(), Filed, filedIn(), filedKeysOf(), hasErrors() (+31 more)

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.11
Nodes (16): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+8 more)

### Community 5 - "preact"
Cohesion: 0.04
Nodes (131): SheetView(), ask(), EngineRead, useEngineRead(), DEFAULT_LOG_PATH, AttachmentInput(), bytesOf(), Props (+123 more)

### Community 6 - "vitest"
Cohesion: 0.02
Nodes (163): open(), BOARD, FIRST, open(), SAGA, SECOND, click(), one (+155 more)

### Community 7 - "check_prompt.ts"
Cohesion: 0.20
Nodes (13): checkMessage(), checkRepositoryImpl(), replyOf(), CheckRepository, DIFFICULTIES, INTENTS, KINDS, parseCheckAnswer() (+5 more)

### Community 8 - "makeTask"
Cohesion: 0.07
Nodes (25): BUNDLE, git(), plist(), run, STAGE, NOW, record(), won() (+17 more)

### Community 9 - "register.tsx"
Cohesion: 0.06
Nodes (96): live(), The core and the app, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files (+88 more)

### Community 10 - "plan_page.tsx"
Cohesion: 0.10
Nodes (25): Opened, Picked, PlanPage(), Props, withRealm(), PlanEdits, Change, changeEntry() (+17 more)

### Community 11 - "t"
Cohesion: 0.15
Nodes (23): Answer, BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError(), FORM (+15 more)

### Community 12 - "Spinner"
Cohesion: 0.12
Nodes (35): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+27 more)

### Community 13 - "notes.md"
Cohesion: 0.14
Nodes (12): Files and shortcuts, Find a note in a large realm, From a rough idea to a saga, Organize and connect, Save and recover, Using Notes, Goal and limits, List behavior (+4 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.11
Nodes (18): Errands, Helpers, Not included, Priority and difficulty, Queue-tea: design, Settings, Test profiles, Testing (+10 more)

### Community 15 - "Queue-tea: workspace app"
Cohesion: 0.22
Nodes (9): Acceptance criteria, Build order, for the plan, Checked, Decisions, In this release, Not in this release, Queue-tea: workspace app, Testing (+1 more)

### Community 16 - "settings_api.ts"
Cohesion: 0.09
Nodes (33): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+25 more)

### Community 17 - "git_source.ts"
Cohesion: 0.23
Nodes (21): Task 8: The task flow, Already built, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch() (+13 more)

### Community 18 - "main.ts"
Cohesion: 0.04
Nodes (69): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+61 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.20
Nodes (16): addToCommit(), bumpOf(), FILES, git(), isRebasing(), KINDS, moveVersion(), nextVersion() (+8 more)

### Community 20 - "en.ts"
Cohesion: 0.09
Nodes (30): choicesLeft(), HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter() (+22 more)

### Community 21 - "home_page.tsx"
Cohesion: 0.04
Nodes (122): GROWS_AT, HOME_GROUP_PAGE, Dragon(), GoldReward(), PriorityTag(), XpReward(), useWindowKeys(), mergeOperation() (+114 more)

### Community 22 - "recipe_panel.tsx"
Cohesion: 0.05
Nodes (63): AT, step(), cleanLine(), currentStage(), fromCheckpoint(), fromHandoff(), FromNote, hasNote() (+55 more)

### Community 23 - "designs.ts"
Cohesion: 0.09
Nodes (45): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+37 more)

### Community 24 - "ref_node_fs"
Cohesion: 0.06
Nodes (25): git(), run, APP, errors, PNG, APP, paste(), APP (+17 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.06
Nodes (71): Asked, askedOf(), Change, changeOf(), folderNameOf(), linesOf(), LINK_KINDS, linkOf() (+63 more)

### Community 26 - "Part 3: setting out and coming back"
Cohesion: 0.14
Nodes (16): claude(), block(), Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main (+8 more)

### Community 27 - "checkpoints.ts"
Cohesion: 0.06
Nodes (63): 5. Features, shared resources and the core, Shared resources, Task 5: The shared resources' data and controllers, File Structure, Task 9: Keeping usage down, How Claude uses them (the mod), running, formatAllowance() (+55 more)

### Community 28 - "emptyRecord"
Cohesion: 0.04
Nodes (82): setup(), HELP_COMMANDS, checkProposal(), CREDITS, creditsClaude(), isPath(), PROPOSAL_LIMITS, ProposalInput (+74 more)

### Community 29 - "calendar_items.ts"
Cohesion: 0.09
Nodes (42): CALENDAR_HOUR_PX, CALENDAR_MONTH_ITEMS, CALENDAR_OPEN_HOUR, AGENDA_DAYS, CalendarItem, compare(), dueItemsOf(), DueState (+34 more)

### Community 30 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 31 - "game.ts"
Cohesion: 0.19
Nodes (18): actualOf(), countBadge(), dayOf(), gameOf(), hourOf(), levelOf(), nextDay(), runsOf() (+10 more)

### Community 32 - "branch_api.ts"
Cohesion: 0.07
Nodes (104): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+96 more)

### Community 33 - "project_source.ts"
Cohesion: 0.38
Nodes (7): readProjectPlace(), carryOverRecords(), recordPath(), projectRepositoryImpl(), ProjectPlace, ProjectRepository, parseOffset()

### Community 34 - "palette.ts"
Cohesion: 0.13
Nodes (30): actions(), allQuests(), canRun(), creates(), entry(), filterPalette(), GO_TO, isStatus() (+22 more)

### Community 35 - "designs_page.tsx"
Cohesion: 0.13
Nodes (25): DETAIL_IS_PAGE_BELOW, questOfNext(), ApprovalRow(), ApprovalState, BrokenVersion(), DesignsPage(), EditorLoader(), Filed (+17 more)

### Community 36 - "file_task.ts"
Cohesion: 0.08
Nodes (38): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Task 1: the engine's three additions, Task 2: Filing and editing carry the choice, cleared(), edited() (+30 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.09
Nodes (31): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, CommitProposal, Difficulty (+23 more)

### Community 38 - "calendar_api.ts"
Cohesion: 0.10
Nodes (41): baseName(), CalendarApi, CalendarDeps, icsNameOf(), importItemsOf(), CALL, onDisk(), TRIP (+33 more)

### Community 39 - "services/time.ts"
Cohesion: 0.11
Nodes (34): APP, add(), folders, pending(), realm(), store(), 1. The session's activity clock, noteSeen() (+26 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.09
Nodes (68): metaOf(), The eight items, Task 10: `tasks`: the queue side, Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome() (+60 more)

### Community 41 - "note_workspace.tsx"
Cohesion: 0.06
Nodes (86): dayOf(), BREW_MOODS, BrewActivity, brewLineOf(), BrewMood, brewMoodOf(), BrewReaction, captureOf() (+78 more)

### Community 42 - "flows.e2e.ts"
Cohesion: 0.16
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, d3-force, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom (+12 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.05
Nodes (72): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), FORWARD_FOUND, FORWARD_MISSING (+64 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "project_views.ts"
Cohesion: 0.06
Nodes (96): xpOf(), isSagaWon(), kindOf(), newBadges(), victoryOf(), minutesOf(), parentQuestsOf(), planRealmOf() (+88 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "Notes: the knowledge graph view"
Cohesion: 0.10
Nodes (19): Anti-goals, Approaches, Architecture, Clicking, Controls, Docs, Goals, Keys and screen readers (+11 more)

### Community 49 - "plan.ts"
Cohesion: 0.10
Nodes (44): ActSelect(), BulkBar(), Props, targetsOf(), Links(), PlanPane(), Points(), Props (+36 more)

### Community 50 - "Notes"
Cohesion: 0.08
Nodes (26): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, BrewQuest's moods (+18 more)

### Community 51 - "scopeOf"
Cohesion: 0.11
Nodes (32): clearAfterMerge(), freeFolderSpace(), readFolderSpace(), removeTaskFolder(), addThree(), fill(), folderOf(), git() (+24 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "app_menu.ts"
Cohesion: 0.14
Nodes (16): appMenu(), command(), letter(), Send, items(), menu(), named(), TAB_LABELS (+8 more)

### Community 54 - "hoard_page.tsx"
Cohesion: 0.13
Nodes (18): Coins(), EggArt(), MEDALS, StageArt(), FIRST_LEVEL, STAGES, stageState(), stageXp() (+10 more)

### Community 55 - "4. Screens"
Cohesion: 0.12
Nodes (17): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.16 States across screens, 4.17 Narrow window and the command palette (+9 more)

### Community 56 - "file"
Cohesion: 0.05
Nodes (33): How you work, If it goes wrong, The decisions block, The rules you never bend, What you report, Where the work comes from, APP, change() (+25 more)

### Community 57 - "server.spec.ts"
Cohesion: 0.24
Nodes (6): CODEX_LIMITS, CODEX_TEXT, CodexContext, QUEUE_TEA_COMMANDS, @modelcontextprotocol/sdk, zod

### Community 58 - "brewquest_api.ts"
Cohesion: 0.09
Nodes (35): checkPath(), askOf(), BREW_RUN, BrewquestApi, BrewquestDeps, realmQuestsOf(), SAID, HelpersApi (+27 more)

### Community 59 - "parseRecord"
Cohesion: 0.12
Nodes (23): onDisk(), onDisk(), 4.15 The failed record, Errors and edge cases, keepBackup(), parseRecord(), readOthers(), readProblem() (+15 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.14
Nodes (13): chronicle(), mana(), AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 6. The app: frontend, backend and storage (+5 more)

### Community 61 - "plan_changes.ts"
Cohesion: 0.12
Nodes (37): Applied, applyPlanChange(), bulk(), childQuest(), found(), linked(), mapIds(), moved() (+29 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "ref_types"
Cohesion: 0.08
Nodes (40): CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, Ctx, Env, Block, entryOf() (+32 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 66 - "filing_controller.ts"
Cohesion: 0.06
Nodes (62): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), MOOD_COLOR, MOOD_WORD, closeBand() (+54 more)

### Community 67 - "File Structure"
Cohesion: 0.23
Nodes (13): addRow(), capital(), escapeCell(), HEAD, rowLine(), TABLE, writeDocsLog(), DocsRow (+5 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.29
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "note_graph_view.tsx"
Cohesion: 0.04
Nodes (81): failed(), GRAPH_DRAG_PX, GRAPH_FIT_PX, GRAPH_HIT_PX, GRAPH_LABEL_CHARS, GRAPH_LABEL_ZOOM, GRAPH_SPINNER_MS, GRAPH_ZOOM_MAX (+73 more)

### Community 70 - "Guild helpers on tasks"
Cohesion: 0.09
Nodes (21): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification, Keeping usage down (+13 more)

### Community 71 - "design_forms.ts"
Cohesion: 0.13
Nodes (26): colourError(), commentError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors (+18 more)

### Community 72 - "note_canvas_view.tsx"
Cohesion: 0.06
Nodes (61): edgeOf(), extrasOf(), isId(), isObject(), isPlace(), isSize(), isUnique(), isValue() (+53 more)

### Community 73 - "activity.ts"
Cohesion: 0.20
Nodes (14): log, STEP_SUBJECT_LIMIT, WAITING_LIMIT, ENDED, fromOldLog(), isTime(), isWaiting(), KINDS (+6 more)

### Community 74 - "package.json"
Cohesion: 0.10
Nodes (20): author, description, license, main, name, overrides, d3-dispatch, d3-quadtree (+12 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "ics_import.ts"
Cohesion: 0.11
Nodes (37): addDays(), appOf(), Clock, cut(), durationOf(), hashOf(), IcsRead, isRepeating() (+29 more)

### Community 77 - "engine_api.ts"
Cohesion: 0.04
Nodes (80): clockTime(), dayAndTime(), dayName(), isClaudeOut(), manaLeft(), refillTime(), NOW, weekdayIndex() (+72 more)

### Community 78 - "plan_rules.spec.ts"
Cohesion: 0.12
Nodes (34): quests(), Backlog, backlogOf(), dropBefore(), foldKey(), isSaga(), pointsOf(), rowsOf() (+26 more)

### Community 79 - "design_editor.tsx"
Cohesion: 0.10
Nodes (48): useWindowWidth(), numberError(), Box, clamp(), copyWithIds(), DESIGN_FRAME, duplicateLayer(), Handle (+40 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.40
Nodes (4): How you work, Pick a test profile first, What you never do, What you report

### Community 81 - "Architecture"
Cohesion: 0.17
Nodes (12): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Review, Sessions: the mod tells the app where Claude Code is, Several sagas, The Designs tab (+4 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.18
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.10
Nodes (24): change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE, NOW (+16 more)

### Community 89 - "opening_api.ts"
Cohesion: 0.31
Nodes (10): canWrite(), installCommand(), openedFromUrl(), commandFileIn(), findCommand(), isOurs(), needsPath(), COMMAND_MARK (+2 more)

### Community 90 - "constants/constants.ts"
Cohesion: 0.05
Nodes (40): ACTIVITY_REFRESH_MS, BREW_REACTION_MS, CALENDAR_CLOCK_MS, CANVAS_CURVE_PX, CANVAS_EXCERPT, CANVAS_ZOOM_MIN, DETAIL_FLOATS_BELOW, DRAG_SLOP_PX (+32 more)

### Community 91 - "app.tsx"
Cohesion: 0.04
Nodes (68): App(), Content(), ContentProps, moodOf(), MORE_PAGES, SheetProps, tabOf(), TABS (+60 more)

### Community 92 - "ref_node_child_process"
Cohesion: 0.11
Nodes (26): Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps, AppIdentity (+18 more)

### Community 93 - "core/logger.ts"
Cohesion: 0.04
Nodes (65): log, createLogger(), fileSink(), stackOf(), attempt(), isForbiddenGit(), nodeHost(), OutputSink (+57 more)

### Community 94 - "Designs tab"
Cohesion: 0.18
Nodes (11): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Files on disk, Implemented (+3 more)

### Community 95 - "tasks_controller.ts"
Cohesion: 0.05
Nodes (96): codexOperations(), Features, The review points, Task 11: `tasks`: the task's own cycle, Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message (+88 more)

### Community 96 - "Time and mana tracking: proposed design (Q01)"
Cohesion: 0.10
Nodes (18): Daily work time in a Realm, Earlier recorded time, Recording and recovery, Scope, Verification, Where the total appears, Acceptance checks, Capability map (+10 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 100 - "ics.spec.ts"
Cohesion: 0.10
Nodes (31): ownUidOf(), changeIn(), dateOf(), eventLines(), ICS_PRODID, IcsExportContext, icsOf(), localOf() (+23 more)

### Community 101 - "plan_board.ts"
Cohesion: 0.11
Nodes (30): BoardCard, BoardLane, boardOf(), countIn(), DONE_SHOWN, emptyColumns(), laneOf(), Move (+22 more)

### Community 102 - "event_form.ts"
Cohesion: 0.15
Nodes (28): whenOf(), todayIn(), dayError(), EVENT_FIELDS, EventErrors, EventField, EventForm, eventInputOf() (+20 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "dependency_setup.ts"
Cohesion: 0.33
Nodes (8): dependencyKinds, DependencySetupRequired, inside(), inspectDependencies(), Lock, Package, quote(), sameDependencies()

### Community 105 - "Gaps"
Cohesion: 0.11
Nodes (19): 2. Codex time, 3. Activity steps, 4. The time budget, Checking the record, G10. Smaller ones, G1. Work outside Claude Code counts nothing, G2. A gap over the limit counts zero, not the limit, G3. A long tool call counts zero (+11 more)

### Community 106 - "workspace-app.md"
Cohesion: 0.16
Nodes (9): Parallel quests: implementation decisions, Commands, Develop, Helpers, Install, License, Queue-tea, Settings (+1 more)

### Community 107 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.14
Nodes (17): Read, held(), hold(), Global Constraints, Queue-tea Implementation Plan, Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order (+9 more)

### Community 108 - "helpers_api.spec.ts"
Cohesion: 0.11
Nodes (14): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), records(), won() (+6 more)

### Community 109 - "spec.md"
Cohesion: 0.17
Nodes (9): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Later, Next: smarter filing, Not planned, Roadmap: the outside review, checked against the code (+1 more)

### Community 110 - "record_source.ts"
Cohesion: 0.20
Nodes (16): p, game(), Data, areMinutes(), arePeriods(), criteriaSetsRead(), fnv1a(), isDay() (+8 more)

### Community 111 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 112 - "brew_reply.ts"
Cohesion: 0.12
Nodes (28): blockOf(), DIFFICULTIES, draftOfReply(), isOpenTopLevel(), isRaw(), matchOf(), parentOf(), PRIORITIES (+20 more)

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
Cohesion: 0.06
Nodes (82): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+74 more)

### Community 117 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 118 - "calendar_page.tsx"
Cohesion: 0.19
Nodes (23): addDays(), addMonths(), CALENDAR_MODES, CalendarMode, dayOfNumber(), daysFrom(), monthStartOf(), monthWeeksOf() (+15 more)

### Community 119 - "brew_lessons.ts"
Cohesion: 0.15
Nodes (21): keepOutcome(), OutcomeDeps, outcomesFolder(), pathOf(), readOutcomes(), FIELDS, isCount(), keptOf() (+13 more)

### Community 120 - "main"
Cohesion: 0.13
Nodes (21): main(), Duet execution audit, Root cause, What changed, What's left, and where it belongs, Current, graphify's cache is tracked by git, Marked done, but the code was never committed (+13 more)

### Community 121 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 122 - "judgements.spec.ts"
Cohesion: 0.26
Nodes (10): Asked, askedOf(), idOf(), judgementWatch(), asking(), broken, realm(), setup() (+2 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "library_api.ts"
Cohesion: 0.23
Nodes (18): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+10 more)

### Community 125 - "brew_draft.ts"
Cohesion: 0.16
Nodes (15): checklistDraftOf(), DRAFT_KEY, DraftAsk, DraftGroup, draftKeyOf(), EffortPoints, likeness(), OVERLAPS_AT (+7 more)

### Community 126 - "Calendar"
Cohesion: 0.10
Nodes (18): detail(), Acceptance checks, Architecture, Calendar, Decisions, Fields and their checks, Acceptance checks, Architecture (+10 more)

### Community 127 - "plan_filters.tsx"
Cohesion: 0.21
Nodes (16): filterCount(), isChanged(), removeView(), sameFilters(), sameName(), saveView(), state, updateView() (+8 more)

### Community 128 - "brew_brief.ts"
Cohesion: 0.20
Nodes (16): BRIEF_LIMITS, BriefInput, briefOf(), clip(), CONTEXT_FILES, DRAFT_BLOCK, EXAMPLE, fenced() (+8 more)

### Community 129 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 130 - "Design"
Cohesion: 0.11
Nodes (17): Acceptance criteria, Bulk edits, Design, For developers, Goal, How it works, Keys and focus, Limits (+9 more)

### Community 131 - "brew_robot.tsx"
Cohesion: 0.16
Nodes (10): ARM_UP, ARMS_DOWN, EYES, Paint, pixels(), Pose, Px, Robot() (+2 more)

### Community 132 - "designs.spec.tsx"
Cohesion: 0.15
Nodes (9): designsOf(), ok(), readEach(), ready(), scene(), versionOf(), NUDGE_PX, DesignRead (+1 more)

### Community 133 - "Part 2: edits"
Cohesion: 0.29
Nodes (7): Edit, Part 2: edits, Review focus, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working

### Community 135 - "activity.spec.ts"
Cohesion: 0.17
Nodes (11): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+3 more)

### Community 136 - "Git modes"
Cohesion: 0.50
Nodes (4): Git modes, How it works, What blocked Git before (Q02.1), What Branches already covers, and what's left

### Community 137 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 138 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 139 - "detail_api.ts"
Cohesion: 0.31
Nodes (12): readCodexSession(), Observation, observeTask(), activeOf(), branchToBe(), gitOf(), linesSince(), quietly() (+4 more)

### Community 140 - "Home dashboard and quest navigation (Q06)"
Cohesion: 0.15
Nodes (12): Acceptance criteria, Design, Goal, Home dashboard and quest navigation (Q06), Keys, Limits, Narrow window, Open questions (+4 more)

### Community 141 - "release_guard.mjs"
Cohesion: 0.23
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 142 - "concile_report.ts"
Cohesion: 0.26
Nodes (10): CHOICES, clip(), ConcileChoice, ConcileDecision, concileReport, DECISION_LIMITS, decisionOf(), isPath() (+2 more)

### Community 143 - "UI refinement"
Cohesion: 0.17
Nodes (11): Audit, Goal and limits, Scrolling, States, Task activity, Tokens, Toolbar order, UI refinement (+3 more)

### Community 144 - "setup.ts"
Cohesion: 0.21
Nodes (16): codexSkills(), companionSkills(), files, helperBody(), helperDefinition(), helperInstructions(), skill(), skills (+8 more)

### Community 145 - "shell.e2e.ts"
Cohesion: 0.22
Nodes (4): APP, expectStripClear(), stored(), titleStrip()

### Community 146 - "presentation/widgets/read_view.tsx"
Cohesion: 0.14
Nodes (16): bookmarkOf(), ENTITIES, textOf(), NoteAttachment(), NoteBookmark(), markdown, Props, ReadView() (+8 more)

### Community 147 - "calendar_files.tsx"
Cohesion: 0.24
Nodes (9): CALENDAR_IMPORT_ROWS, Failure, ImportSheet(), Kind, Props, reasonOf(), whenLine(), CalendarWhen (+1 more)

### Community 148 - "BrewQuest: from a note to quests"
Cohesion: 0.20
Nodes (10): BrewQuest: from a note to quests, Filing, Learning from your reviews, Limits, Q09's child quests, The review, What it reads, What main checks before you see it (+2 more)

### Community 149 - "Meetings"
Cohesion: 0.20
Nodes (10): Acceptance checks, Architecture, Decisions, Fields and their checks, Meetings, Not in this quest, Screens, Testing (+2 more)

### Community 150 - "Part 4: the rest of the screens"
Cohesion: 0.13
Nodes (15): After the first install, Part 4: the rest of the screens, Part 5: an app you can install, Review focus, Review focus, Review focus, Stage A: the pages that only read, Stage A: the quest in hand, in full (+7 more)

### Community 151 - "tokens.spec.ts"
Cohesion: 0.22
Nodes (8): components, defined, filesUnder(), RENDERER, setInline, sheets, tokens, uses

### Community 152 - "history.spec.ts"
Cohesion: 0.23
Nodes (8): AUTOSAVE_MS, commit(), History, historyOf(), redo(), undo(), SaveState, Scene

### Community 153 - "brew_drafts.ts"
Cohesion: 0.31
Nodes (8): DRAFT_KEPT_MS, drafts, forgetDraft(), keepDraft(), Kept, keptDraft(), keyOf(), BrewDraft

### Community 154 - "claude_host.ts"
Cohesion: 0.36
Nodes (6): bytesOf(), hostOf(), readInRanges(), FileTooLarge, ENGINE_FILE_LIMIT, unixFiles()

### Community 155 - "notes.e2e.ts"
Cohesion: 0.18
Nodes (12): brewQuestDrafts(), brewQuestIsMissing(), line(), plantBrewQuest(), APP, errors, noteFiles(), notesDir() (+4 more)

### Community 156 - "branch_rules.ts"
Cohesion: 0.33
Nodes (7): SwitchResult, switchToTaskUseCase(), branchSlug(), count(), FILLER, holdReason(), slugBranch()

### Community 157 - "GitState"
Cohesion: 0.57
Nodes (3): holdCommandOf(), holdKindOf(), GitState

### Community 158 - "Helper policies"
Cohesion: 0.29
Nodes (7): timed(), Helper policies, Routing by profile, What is measured, When a helper fails, When each helper runs, Which model runs what

### Community 159 - "Tea-Concile"
Cohesion: 0.40
Nodes (5): Child quests, How it works now, Tea-Concile, The skill it grew from (Q08.1), What waits on Q02

### Community 160 - "agents/brewquest.md"
Cohesion: 0.50
Nodes (3): Before you draft, How you draft, What you answer

### Community 161 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

## Knowledge Gaps
- **10 isolated node(s):** `../tsconfig.json`, `RFC-5545`, `RFC-5545`, `@types/d3-force`, `@types/node` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1533 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `brew_brief.ts`, `meeting_notes.ts`, `Refusal`, `brew_quest.tsx`, `designs_api.spec.ts`, `designs.spec.tsx`, `preact`, `brew_robot.tsx`, `makeTask`, `plan_page.tsx`, `t`, `Spinner`, `release_guard.mjs`, `concile_report.ts`, `setup.ts`, `settings_api.ts`, `main.ts`, `presentation/widgets/read_view.tsx`, `en.ts`, `home_page.tsx`, `recipe_panel.tsx`, `designs.ts`, `ref_node_fs`, `notes_api.ts`, `tokens.spec.ts`, `history.spec.ts`, `GitState`, `calendar_items.ts`, `game.ts`, `branch_api.ts`, `palette.ts`, `calendar_api.ts`, `services/time.ts`, `note_workspace.tsx`, `claude_code.ts`, `scopeOf`, `app_menu.ts`, `file`, `server.spec.ts`, `brewquest_api.ts`, `plan_changes.ts`, `ref_types`, `messages.ts`, `note_graph_view.tsx`, `design_forms.ts`, `note_canvas_view.tsx`, `activity.ts`, `package.json`, `engine_api.ts`, `plan_rules.spec.ts`, `design_editor.tsx`, `notes_backup.spec.ts`, `constants/constants.ts`, `app.tsx`, `ref_node_child_process`, `core/logger.ts`, `ics.spec.ts`, `plan_board.ts`, `event_form.ts`, `brew_reply.ts`, `scope.ts`, `calendar_page.tsx`, `brew_lessons.ts`, `judgements.spec.ts`, `library_api.ts`, `brew_draft.ts`, `plan_filters.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `RFC-5545`, `RFC-5545` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `meeting_notes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06126126126126126 - nodes in this community are weakly interconnected._
- **Why does `backlinksOf()` connect `note_workspace.tsx` to `Notes: the knowledge graph view`, `notes_api.ts`, `note_graph_view.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `@playwright/test` be split into smaller, more focused modules?**
  _Cohesion score 0.059743954480796585 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `main` to `Repository Rules`, `Gaps`, `A task's life`, `setup.ts`, `Queue-tea, the workspace app`, `core/logger.ts`, `Tea-concile`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._