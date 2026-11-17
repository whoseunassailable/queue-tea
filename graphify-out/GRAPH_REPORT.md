# Graph Report - notes-backup-export-restore  (2026-11-17)

## Corpus Check
- 579 files · ~543,865 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .css 4, .pen 2)

## Summary
- 3646 nodes · 13313 edges · 137 communities (132 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 702 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `077263cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- note_workspace.tsx
- settings_api.ts
- emptyRecord
- helpers_api.ts
- designs_api.spec.ts
- ports.ts
- EngineApi
- ref_types
- opening_api.ts
- tasks_controller.ts
- hud.tsx
- shell.spec.tsx
- first_run.tsx
- engine_api.ts
- Queue-tea: design
- cup_mood.ts
- scope.ts
- git_source.ts
- main.ts
- version.test.mjs
- brew_quest.tsx
- book_form.ts
- families.ts
- edits.e2e.ts
- palette.ts
- notes_api.ts
- Part 4: the rest of the screens
- checkpoints.ts
- tests/helpers.ts
- branches.spec.tsx
- observation.ts
- project_views.ts
- Refusal
- App
- design_editor.tsx
- design_forms.ts
- ui.test.tsx
- Task 3: Entities and pure rules
- designs_api.spec.ts
- note_attachments.ts
- menu_frame.tsx
- detail_api.ts
- flows.e2e.ts
- devDependencies
- claude_code.ts
- commit_guard.ts
- helpers_api.spec.ts
- compilerOptions
- 4. Screens
- queue_controller.ts
- library_api.ts
- activity.spec.ts
- branch_workflow.e2e.ts
- t
- app.tsx
- designs_page.tsx
- board.e2e.ts
- hoard_page.tsx
- host.ts
- designs.e2e.ts
- Queue-tea architecture
- ref_node_fs
- Queue-tea: panel redesign
- palette_dialog.tsx
- messages.ts
- chronicle_page.tsx
- view_store.ts
- File Structure
- commit-chai-n.md
- vitest
- Queue-tea: workspace app
- Queue-tea
- quest_detail.tsx
- notes.spec.ts
- package.json
- chai-pter.md
- Queue-tea in Codex
- pages.e2e.ts
- card_note.ts
- designs.ts
- tea-dd.md
- quests_page.tsx
- scripts
- Branch workflow in Queue-tea
- tsconfig.json
- install_app.sh
- notes_backup.spec.ts
- record_source.ts
- Merge-check dependency setup
- designs.spec.tsx
- Architecture
- main.tsx
- Designs tab
- session_rhythm.ts
- ref_node_child_process
- Branch workflow completion — 5 November 2026
- Queue-tea: workspace app UI design
- release_guard.d.mts
- Task 2: Filing and editing carry the choice
- Notes
- Refusal
- Task Log
- Workspace app, the rest of the road
- branch_rules.ts
- test_support.ts
- Part B: the app
- Guild helpers on tasks
- workspace-app.md
- ref_node_path
- Reply
- Part 3: setting out and coming back
- settings.spec.tsx
- .line-check-NZS8Gw/tsconfig.json
- requests_controller.ts
- description_files.spec.tsx
- feedback.e2e.ts
- Part 2: edits
- Shared Types (Task 1 writes them; every task uses them)
- check_layers.mjs
- notes_api.spec.ts
- app_menu.ts
- Queue-tea, the workspace app
- feedback.spec.tsx
- note_bookmarks.ts
- A task's life
- Tea-concile
- realms_api.spec.ts
- scene_view.tsx
- What Rohan sees
- The record
- Repository Rules
- detail.spec.tsx
- electron
- Task 5: Time and effort
- fakeEngine

## God Nodes (most connected - your core abstractions)
1. `t` - 112 edges
2. `Refusal` - 108 edges
3. `vitest` - 101 edges
4. `emptyRecord()` - 81 edges
5. `reply()` - 74 edges
6. `EngineApi` - 69 edges
7. `preact` - 67 edges
8. `Reply` - 65 edges
9. `currentTask()` - 64 edges
10. `ask()` - 59 edges

## Surprising Connections (you probably didn't know these)
- `Acceptance criteria` --references--> `merge()`  [INFERRED]
  docs/workspace-app.md → app/e2e/branch_workflow.e2e.ts
- `Writing code` --references--> `main()`  [INFERRED]
  CLAUDE.md → app/main/codex.ts
- `Parallel quests and branches` --references--> `main()`  [INFERRED]
  docs/spec.md → app/main/codex.ts
- `1. Find the merge` --references--> `main()`  [INFERRED]
  skills/tea-concile/SKILL.md → app/main/codex.ts
- `Shortcuts and palette` --references--> `d()`  [INFERRED]
  docs/panel-redesign.md → app/main/features/branches/api/branch_reads.spec.ts

## Import Cycles
- None detected.

## Communities (137 total, 5 thin omitted)

### Community 0 - "note_workspace.tsx"
Cohesion: 0.08
Nodes (65): captureOf(), dailyBodyOf(), dayError(), folderError(), FolderGroup, folderNameError(), foldersOf(), IN_PLAY (+57 more)

### Community 1 - "settings_api.ts"
Cohesion: 0.11
Nodes (28): GithubApi, GithubDeps, Login, login(), accountsOf(), codeOf(), GhAccount, gitProtocolOf() (+20 more)

### Community 2 - "emptyRecord"
Cohesion: 0.06
Nodes (40): BUNDLE, git(), plist(), run, STAGE, record(), won(), NOW (+32 more)

### Community 3 - "helpers_api.ts"
Cohesion: 0.48
Nodes (6): checkPath(), HelpersApi, HelpersDeps, lineReader(), orderOf(), isHelperId()

### Community 4 - "designs_api.spec.ts"
Cohesion: 0.08
Nodes (27): COMMENTS, data(), git(), gitEnv, json(), NOW, onDisk(), PAIR (+19 more)

### Community 5 - "ports.ts"
Cohesion: 0.09
Nodes (37): Audit: what the menu exposes of the engine, Order to fix them, Problems not on the list, Task 9: `conversation` and `message_check`, drawQuestion(), Ask, MenuSpec, SessionUsage (+29 more)

### Community 6 - "EngineApi"
Cohesion: 0.07
Nodes (66): Content(), Answer, ask(), EngineRead, useEngineRead(), Dialog(), FieldProps, Group() (+58 more)

### Community 7 - "ref_types"
Cohesion: 0.06
Nodes (71): loadCodexContext(), CodexContext, codexOperations(), CodexRefusal, readable(), ctx, Task 10: The panel, the band, the status line and the commands, One engine, two hosts (+63 more)

### Community 8 - "opening_api.ts"
Cohesion: 0.24
Nodes (13): canWrite(), installCommand(), openedFromUrl(), OpeningDeps, commandFileIn(), findCommand(), isOurs(), needsPath() (+5 more)

### Community 9 - "tasks_controller.ts"
Cohesion: 0.08
Nodes (43): Global constraints, Guild helpers on tasks: implementation plan, Review focus, Task 4: The turn's instruction and the first message, Task 5: Noting helper runs and the reminder at done, helperToRemind(), markRemindedUseCase(), noteHelperUseCase() (+35 more)

### Community 10 - "hud.tsx"
Cohesion: 0.11
Nodes (33): ALL, hrefOf(), Route, routeOf(), ROUTES, useRoute(), Spinner(), UpdateControl() (+25 more)

### Community 11 - "shell.spec.tsx"
Cohesion: 0.25
Nodes (6): BOARD, FIRST, key(), open(), palette(), SECOND

### Community 12 - "first_run.tsx"
Cohesion: 0.15
Nodes (27): accountsIn(), hasAccounts(), isGone(), isKnown(), needsAnswer(), NO_ACCOUNT, pickedOf(), account() (+19 more)

### Community 13 - "engine_api.ts"
Cohesion: 0.06
Nodes (47): MEDALS, withoutReview(), stepLine(), BOARD, MAIN, OTHER, SEALED, Named (+39 more)

### Community 14 - "Queue-tea: design"
Cohesion: 0.10
Nodes (20): Errands, Helpers, Keeping usage down, Not included, Priority and difficulty, Queue-tea: design, Settings, Telling the mod a task looks done (+12 more)

### Community 15 - "cup_mood.ts"
Cohesion: 0.12
Nodes (25): MOOD_COLOR, MOOD_WORD, AIR, body(), Cup, CUP_COLUMNS, CUP_ROWS, cupArt (+17 more)

### Community 16 - "scope.ts"
Cohesion: 0.12
Nodes (45): projectsFolder(), Logger, GAME_WORDS, MESSAGES, reply(), readChronicle(), GameDeps, readGame() (+37 more)

### Community 17 - "git_source.ts"
Cohesion: 0.27
Nodes (19): Task 8: The task flow, commitsBetween(), diffSince(), git(), lastCommit(), listBranches(), makeBranch(), plural() (+11 more)

### Community 18 - "main.ts"
Cohesion: 0.05
Nodes (59): BUSY_PROBE, COPY_LIMIT, FORBIDDEN_GIT, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, RESTART_FILE (+51 more)

### Community 19 - "version.test.mjs"
Cohesion: 0.12
Nodes (20): env, run, server, fixtures, addToCommit(), bumpOf(), FILES, git() (+12 more)

### Community 20 - "brew_quest.tsx"
Cohesion: 0.15
Nodes (18): brewLineOf(), lineOf(), QuestLine, tickedItemsOf(), BrewQuestCard(), BrewSheet(), DIFFICULTIES, Errors (+10 more)

### Community 21 - "book_form.ts"
Cohesion: 0.29
Nodes (12): BookErrors, BookField, BookForm, bookOf(), EMPTY_BOOK, pageError(), FORM, startError() (+4 more)

### Community 22 - "families.ts"
Cohesion: 0.10
Nodes (48): readChoices(), 4.2 Tasks, with a feature in the detail pane, 4.5 New task, and Add child task inline, 4.9 Back to queue, Blocked…, Move and Remove, What each screen reads from existing data, checkPrompt(), checkTypedMessage(), FeatureFound (+40 more)

### Community 23 - "edits.e2e.ts"
Cohesion: 0.24
Nodes (5): APP, onDisk(), SEED, stored(), titled()

### Community 24 - "palette.ts"
Cohesion: 0.14
Nodes (25): PALETTE_NOTE_ROWS, PALETTE_SNIPPET, actions(), allQuests(), creates(), entry(), filterPalette(), GO_TO (+17 more)

### Community 25 - "notes_api.ts"
Cohesion: 0.09
Nodes (46): changeOf(), folderNameOf(), LINK_KINDS, linkOf(), Loaded, NotesApi, proposedOf(), same() (+38 more)

### Community 26 - "Part 4: the rest of the screens"
Cohesion: 0.29
Nodes (7): game(), Part 4: the rest of the screens, Review focus, Stage A: the pages that only read, Stage C: the board's tools, Stage D: the palette, the menu bar and the narrow window, Data

### Community 27 - "checkpoints.ts"
Cohesion: 0.14
Nodes (24): 4.1 Home, factsNow(), writeHandoffUseCase(), CODEX_RULES(), FIRST_MESSAGE_LABELS, checkLines(), checkpointPrompt(), codexBrief() (+16 more)

### Community 28 - "tests/helpers.ts"
Cohesion: 0.08
Nodes (35): unixFiles(), putBack(), projectRepositoryOf(), CTX, fakePorts(), makeTask(), memoryHost(), Run (+27 more)

### Community 29 - "branches.spec.tsx"
Cohesion: 0.14
Nodes (20): click(), one, open(), openReview(), two, view, branchGraph(), branchReview() (+12 more)

### Community 30 - "observation.ts"
Cohesion: 0.18
Nodes (9): readCodexSession(), Observation, graphLayout(), FORK, SOURCE, TARGET, BranchState, Worktree (+1 more)

### Community 31 - "project_views.ts"
Cohesion: 0.06
Nodes (61): chronicleOf(), dayBefore(), dayTimeOf(), lineOf(), minutesOf(), RANK, totalOf(), winsIn() (+53 more)

### Community 32 - "Refusal"
Cohesion: 0.07
Nodes (96): abandonMerge(), BranchDeps, completeMerge(), freshReview(), messageOf(), openMergeFolder(), prepareMerge(), readBranch() (+88 more)

### Community 33 - "App"
Cohesion: 0.08
Nodes (20): App(), moodOf(), open(), useHour(), BOARD, FIRST, open(), SAGA (+12 more)

### Community 34 - "design_editor.tsx"
Cohesion: 0.12
Nodes (39): commit(), History, historyOf(), redo(), undo(), Box, clamp(), DESIGN_FRAME (+31 more)

### Community 35 - "design_forms.ts"
Cohesion: 0.11
Nodes (28): colourError(), Drafted, draftOf(), labelError(), lineOf(), Names, NextErrors, NextField (+20 more)

### Community 36 - "ui.test.tsx"
Cohesion: 0.09
Nodes (16): HELP_COMMANDS, answerHost(), BAND, CLEAN, COMMAND, DIRTY, ENTRIES, FILE (+8 more)

### Community 37 - "Task 3: Entities and pure rules"
Cohesion: 0.16
Nodes (20): Task 3: Entities and pure rules, Allowance, Band, Checkpoint, claude-code, CommandRun, Difficulty, Effort (+12 more)

### Community 38 - "designs_api.spec.ts"
Cohesion: 0.12
Nodes (34): counted(), DesignsApi, DesignsDeps, fileOf(), folderArg(), idArg(), idsIn(), jsonOf() (+26 more)

### Community 39 - "note_attachments.ts"
Cohesion: 0.22
Nodes (15): filePathOf(), formatOf(), noteFiles(), attachmentError(), extensionOf(), NOTE_ATTACHMENTS, NOTE_FILE_ACCEPT, NOTE_FILE_LIMIT (+7 more)

### Community 40 - "menu_frame.tsx"
Cohesion: 0.10
Nodes (59): Task 11: `tasks`: the task's own cycle, Task 7: Split the menu and the band in place, Task 8: `tea_cup`, `history`, `settings` and the Brew view, drawHelp(), HELP_KEYS, drawHome(), ENTRIES, pressOpenApp() (+51 more)

### Community 41 - "detail_api.ts"
Cohesion: 0.50
Nodes (7): activeOf(), branchToBe(), gitOf(), linesSince(), quietly(), readQuestFacts(), ManaLines

### Community 42 - "flows.e2e.ts"
Cohesion: 0.17
Nodes (9): APP, change(), editTask(), git(), noRequests(), onDisk(), run, session() (+1 more)

### Community 43 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, electron, electron-builder, electron-vite, @fontsource/marcellus, @fontsource/nunito-sans, jsdom, marked (+10 more)

### Community 44 - "claude_code.ts"
Cohesion: 0.10
Nodes (39): appleScriptText(), bringForwardArgv(), claudeLine(), codexLine(), codexOptions(), codexPasteLine(), openLineArgv(), openVsCode() (+31 more)

### Community 45 - "commit_guard.ts"
Cohesion: 0.15
Nodes (15): GIT_OPTIONS_WITH_VALUE, isCommitOrPush(), isRefused(), lex(), Lexed, readParens(), REFUSED_GIT, RESERVED (+7 more)

### Community 46 - "helpers_api.spec.ts"
Cohesion: 0.11
Nodes (20): OutputSink, ProcessRequest, ProcessResult, running, streamProcess(), nodeUserGit(), UserGit, UserGitAction (+12 more)

### Community 47 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, jsxImportSource, lib, module, moduleResolution, noEmit (+7 more)

### Community 48 - "4. Screens"
Cohesion: 0.12
Nodes (17): 4.0 The Tasks layout decision, 4.10 History (here: All projects, last week), 4.11 Usage & time, 4.12 Settings, 4.13 Guild Hall, formerly the Tea Room, 4.14 First run with no projects, 4.15 The failed record, 4.16 States across screens (+9 more)

### Community 49 - "queue_controller.ts"
Cohesion: 0.11
Nodes (46): Features, The eight items, Task 10: `tasks`: the queue side, showBand(), DIFFICULTIES, blockTaskUseCase(), FileResult, removeTaskUseCase() (+38 more)

### Community 50 - "library_api.ts"
Cohesion: 0.21
Nodes (19): bookOf(), isPageCount(), LibraryApi, LibraryDeps, pageIn(), addBook(), changed(), emptyLibrary() (+11 more)

### Community 51 - "activity.spec.ts"
Cohesion: 0.11
Nodes (21): codexEvents, CodexObservation, commandOf(), parse(), Row, textOf(), cache, catalog (+13 more)

### Community 52 - "branch_workflow.e2e.ts"
Cohesion: 0.32
Nodes (11): check(), commitSelected(), dialog(), git(), merge(), mergeButton(), openReview(), prepare() (+3 more)

### Community 53 - "t"
Cohesion: 0.12
Nodes (25): HelperBench(), nameOf(), Props, Report(), fileNamed(), FILES, frontmatter(), Helper (+17 more)

### Community 54 - "app.tsx"
Cohesion: 0.04
Nodes (79): ContentProps, MORE_PAGES, SheetProps, SheetView(), TABS, AUTOSAVE_MS, DEFAULT_LOG_PATH, DETAIL_FLOATS_BELOW (+71 more)

### Community 55 - "designs_page.tsx"
Cohesion: 0.16
Nodes (21): questOfNext(), BrokenVersion(), DesignsPage(), EditorLoader(), Filed, FiledNote(), ScopeProps, takenOf() (+13 more)

### Community 56 - "board.e2e.ts"
Cohesion: 0.21
Nodes (6): APP, change(), git(), onDisk(), run, stored()

### Community 57 - "hoard_page.tsx"
Cohesion: 0.14
Nodes (17): STAGE_SCALE, Coins(), EggArt(), Sky(), StageArt(), FIRST_LEVEL, STAGES, stageState() (+9 more)

### Community 58 - "host.ts"
Cohesion: 0.22
Nodes (13): Block, clip(), doingOf(), fileOf(), HELPER_LIMITS, parse(), Seen, seenIn() (+5 more)

### Community 59 - "designs.e2e.ts"
Cohesion: 0.17
Nodes (12): APP, CHART, designFile(), errors, json(), layerOn(), onDisk(), PAIR (+4 more)

### Community 60 - "Queue-tea architecture"
Cohesion: 0.20
Nodes (10): AppError, 1. The shape of the mod, 2. Rules, 3. The layers, in a picture, 4. Pressing Start, step by step, 7. Tests, 8. Getting there, 9. Not part of the restructure (+2 more)

### Community 61 - "ref_node_fs"
Cohesion: 0.04
Nodes (32): APP, at, errors, fileTitled(), notesDir(), APP, FIRST, record() (+24 more)

### Community 62 - "Queue-tea: panel redesign"
Cohesion: 0.22
Nodes (8): Handoff card, Queue-tea: panel redesign, Shortcuts and palette, The images, described, The panel, top to bottom, What Rohan chose, What the panel can draw (this build's mod API), Where to change it

### Community 63 - "palette_dialog.tsx"
Cohesion: 0.15
Nodes (20): useWindowKeys(), canRun(), PaletteInput, NO_NOTES, optionId(), PaletteDialog(), Props, isFromMenu() (+12 more)

### Community 64 - "messages.ts"
Cohesion: 0.15
Nodes (10): BOOKMARK_AGENT, getOnce(), isPublicAddress(), lookupOf(), PRIVATE, PrivateHost, RANGES, readPage() (+2 more)

### Community 65 - "chronicle_page.tsx"
Cohesion: 0.12
Nodes (32): clockTime(), dayName(), manaLeft(), refillTime(), weekdayIndex(), weekdayOf(), BAR_PX, Column() (+24 more)

### Community 66 - "view_store.ts"
Cohesion: 0.07
Nodes (28): allowanceAtom, bandAtom, bandQueueAtom, blockingAtom, budgetAtom, busyAtom, canContinueAtom, checkedAtom (+20 more)

### Community 67 - "File Structure"
Cohesion: 0.18
Nodes (17): File Structure, Global Constraints, Queue-tea Implementation Plan, Review Focus, addRow(), capital(), escapeCell(), HEAD (+9 more)

### Community 68 - "commit-chai-n.md"
Cohesion: 0.25
Nodes (6): Branch names, Commits, Merging and pulling, Pull requests, The rule you never bend, What you report

### Community 69 - "vitest"
Cohesion: 0.05
Nodes (49): log, main(), createLogger(), stackOf(), attempt(), failed(), isForbiddenGit(), nodeHost() (+41 more)

### Community 70 - "Queue-tea: workspace app"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Build order, for the plan, Checked, Decisions, Errors and edge cases, In this release, Not in this release, Queue-tea: workspace app (+2 more)

### Community 71 - "Queue-tea"
Cohesion: 0.25
Nodes (8): Commands, Develop, Helpers, Install, License, Queue-tea, Settings, What it does

### Community 72 - "quest_detail.tsx"
Cohesion: 0.07
Nodes (55): ACTIVITY_REFRESH_MS, LINES_REFRESH_MS, AttachmentInput(), bytesOf(), Props, State, Field(), Change (+47 more)

### Community 73 - "notes.spec.ts"
Cohesion: 0.22
Nodes (11): linkLineOf(), markdown, firstParagraphOf(), linkPartsOf(), linksOf(), NOTE_TYPES, once(), questIdOf() (+3 more)

### Community 74 - "package.json"
Cohesion: 0.13
Nodes (14): author, description, license, main, name, private, productName, version (+6 more)

### Community 75 - "chai-pter.md"
Cohesion: 0.33
Nodes (5): Before you write, How you write, Keeping docs true, What you don't do, What you report

### Community 76 - "Queue-tea in Codex"
Cohesion: 0.29
Nodes (7): Boundaries, Commands and tools, Helpers and companion skills, Queue-tea in Codex, Standalone setup for CLI, desktop or IDE, Start from Queue-tea, Verification

### Community 77 - "pages.e2e.ts"
Cohesion: 0.29
Nodes (4): APP, task(), TODAY, won()

### Community 78 - "card_note.ts"
Cohesion: 0.39
Nodes (7): 4.4 A task's detail: current, queued and done, cardNote, HandoffSection, handoffSections(), isHeading(), checkpointSections(), latestNote()

### Community 79 - "designs.ts"
Cohesion: 0.18
Nodes (13): commentError(), ids(), CommentRow(), CommentsPanel(), Props, CommentInput, DESIGN_FORMAT, FrameLayer (+5 more)

### Community 80 - "tea-dd.md"
Cohesion: 0.50
Nodes (3): How you work, What you never do, What you report

### Community 81 - "quests_page.tsx"
Cohesion: 0.06
Nodes (74): dayAndTime(), dayOf(), isClaudeOut(), NOW, Dragon(), GoldReward(), PriorityTag(), XpReward() (+66 more)

### Community 82 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, e2e, e2e:packaged, install-app, package, package:stage (+5 more)

### Community 83 - "Branch workflow in Queue-tea"
Cohesion: 0.17
Nodes (11): Acceptance checks, Branch workflow in Queue-tea, Conflicts and recovery, Data and implementation boundaries, Implemented flow and validation, Keep the app update tied to integrated source, Screen layout, Status and motion (+3 more)

### Community 86 - "notes_backup.spec.ts"
Cohesion: 0.19
Nodes (13): change(), created(), data(), exported(), fillRealm(), historyCount(), LOOSE, NOW (+5 more)

### Community 89 - "record_source.ts"
Cohesion: 0.08
Nodes (34): p, canRestoreFrom(), git(), NOW, onDisk(), run, seed(), Task 1: The helper list and the record field (+26 more)

### Community 90 - "Merge-check dependency setup"
Cohesion: 0.29
Nodes (6): Decision and limits, Merge-check dependency setup, Preparing dependencies, Progress, retries and closing the review, Regression coverage and activation, Verification on 12 November 2026

### Community 91 - "designs.spec.tsx"
Cohesion: 0.17
Nodes (8): designsOf(), ok(), open(), readEach(), ready(), scene(), versionOf(), VersionView

### Community 92 - "Architecture"
Cohesion: 0.14
Nodes (14): Architecture, Files in a quest's description, Opening on a project, Parallel quests and the Branches tab, Requests: the app asks a session to act, Review, Sessions: the mod tells the app where Claude Code is, Terminals (+6 more)

### Community 93 - "main.tsx"
Cohesion: 0.33
Nodes (3): workspace, @fontsource/marcellus, @fontsource/nunito-sans

### Community 94 - "Designs tab"
Cohesion: 0.22
Nodes (9): version(), Acceptance checks, Architecture, Behaviour, Decisions, Designs tab, Implemented, Screens (+1 more)

### Community 95 - "session_rhythm.ts"
Cohesion: 0.07
Nodes (87): live(), The core and the app, After this plan, Feature-first restructure Implementation Plan, Global Constraints, Review Focus, Task 0: A clean start (Rohan runs these), Task 12: `app/`, and the end of the flat files (+79 more)

### Community 96 - "ref_node_child_process"
Cohesion: 0.09
Nodes (30): UPDATE_TEXT, Deps, setup(), updateService(), majorOf(), setup(), updateWatch(), WatchDeps (+22 more)

### Community 97 - "Branch workflow completion — 5 November 2026"
Cohesion: 0.40
Nodes (4): Branch workflow completion — 5 November 2026, Completed behavior, Handoff and supported boundaries, Verification commands and actual output

### Community 98 - "Queue-tea: workspace app UI design"
Cohesion: 0.14
Nodes (15): options(), 1. Summary, 2.1 Chosen: "Jade Peaks", 2.2 The game layer, 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28), 2.4 Not chosen: "Neon Lab", 2.5 Not chosen: the other dragon directions (28 Oct), 2. Visual direction (+7 more)

### Community 100 - "Task 2: Filing and editing carry the choice"
Cohesion: 0.20
Nodes (10): Drafting a version for the Designs tab, How you work, What you don't do, What you report, Files on disk, Task 2: Filing and editing carry the choice, edited(), editTaskUseCase() (+2 more)

### Community 101 - "Notes"
Cohesion: 0.10
Nodes (19): Acceptance checks, Answered, Architecture, Attachment boundaries and design choice, Attachments, Behaviour, Bookmarks, Decisions (+11 more)

### Community 102 - "Refusal"
Cohesion: 0.08
Nodes (72): inGameWords(), Refusal, activeTask(), goBack(), lastNoteAt(), putBackNow(), putBackQuest(), finishQuest() (+64 more)

### Community 103 - "Task Log"
Cohesion: 0.40
Nodes (4): 2026-11-03, 2026-11-05, 2026-11-06, Task Log

### Community 104 - "Workspace app, the rest of the road"
Cohesion: 0.20
Nodes (10): After the first install, Part 5: an app you can install, Review focus, Review focus, Stage A: the quest in hand, in full, Stage B: the ways in, Stage C: the build, The road (+2 more)

### Community 105 - "branch_rules.ts"
Cohesion: 0.21
Nodes (9): Already built, SwitchResult, switchToTaskUseCase(), GitState, branchSlug(), count(), FILLER, holdReason() (+1 more)

### Community 106 - "test_support.ts"
Cohesion: 0.16
Nodes (16): chronicle(), mana(), CHRONICLE, DESIGNS, GAME, helperJob(), HOARD, LIBRARY (+8 more)

### Community 107 - "Part B: the app"
Cohesion: 0.13
Nodes (15): Global constraints, Part A: the mod, Part B: the app, Review focus, Task 10: the window's frame, Task 11: Home and Quests, read-only, Task 12: seen working, Task 1: the file seam (+7 more)

### Community 108 - "Guild helpers on tasks"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Decisions, Errors, Guild helpers on tasks, How Claude uses them (the mod), Out of scope, Tests, The reminder at "done" (+2 more)

### Community 109 - "workspace-app.md"
Cohesion: 0.12
Nodes (10): 1. The board: Backlog, In progress, Blocked, Done, 2. Recoverable tasks, 3. Checkpoints in place of the handoff note, Plan: the board, recoverable tasks and checkpoints, Parallel quests: implementation decisions, Later, Next: smarter filing, Not planned (+2 more)

### Community 110 - "ref_node_path"
Cohesion: 0.21
Nodes (11): esbuild, writeBundle(), currentProvenance(), git(), releaseProblem(), root, run(), candidate (+3 more)

### Community 111 - "Reply"
Cohesion: 0.15
Nodes (8): open(), pending(), BOARD, fail, open(), ROW, ProjectView, Reply

### Community 112 - "Part 3: setting out and coming back"
Cohesion: 0.20
Nodes (10): Part 3: setting out and coming back, Review focus, Task 1: the mod's half, Task 2: the terminals, Task 3: Start in main, Task 4: Judgement, Finish and Back in main, Task 5: the flows in the window, Task 6: the cards and sheets (+2 more)

### Community 113 - "settings.spec.tsx"
Cohesion: 0.11
Nodes (12): KNOWN, NEW, open(), TWO, FAILED, NEW_FOLDER, open(), withActive() (+4 more)

### Community 114 - ".line-check-NZS8Gw/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../tsconfig.json

### Community 115 - "requests_controller.ts"
Cohesion: 0.11
Nodes (30): 5. Features, shared resources and the core, Shared resources, Task 5: The shared resources' data and controllers, Task 9: Keeping usage down, once(), running, formatAllowance(), pad() (+22 more)

### Community 116 - "description_files.spec.tsx"
Cohesion: 0.29
Nodes (6): box(), drop(), open(), pane(), pick(), saved()

### Community 117 - "feedback.e2e.ts"
Cohesion: 0.10
Nodes (11): Account, plantGh(), statusOf(), APP, dayBefore(), fileOf(), won(), APP (+3 more)

### Community 118 - "Part 2: edits"
Cohesion: 0.22
Nodes (9): Edit, Part 2: edits, Review focus, Task 1: the engine's three additions, Task 3: edits in the window, Task 4: the forms, Task 5: the board and the detail pane, Task 6: seen working (+1 more)

### Community 119 - "Shared Types (Task 1 writes them; every task uses them)"
Cohesion: 0.25
Nodes (8): held(), hold(), Shared Types (Task 1 writes them; every task uses them), Task 11: Live try, move and install, Task 1: Scaffold, contract and queue order, Task 3: Reading git and making branches, Task 6: The docs log, fakeGit()

### Community 120 - "check_layers.mjs"
Cohesion: 0.21
Nodes (14): Task 2: The layer check, checkLayers(), CLAUDE_MAY(), cyclesIn(), edgeProblem(), importsOf(), isData(), isTypeOnly() (+6 more)

### Community 121 - "notes_api.spec.ts"
Cohesion: 0.19
Nodes (9): noteFileResponse(), NotesDeps, change(), created(), data(), makeApi(), NOW, revealed (+1 more)

### Community 122 - "app_menu.ts"
Cohesion: 0.24
Nodes (9): appMenu(), command(), letter(), Send, items(), menu(), named(), TABS (+1 more)

### Community 123 - "Queue-tea, the workspace app"
Cohesion: 0.33
Nodes (6): Branch review and merge, Check it, Flavors, Install it, Queue-tea, the workspace app, Run it

### Community 124 - "feedback.spec.tsx"
Cohesion: 0.20
Nodes (5): ACCOUNTS, BOARD, input(), open(), empty()

### Community 125 - "note_bookmarks.ts"
Cohesion: 0.36
Nodes (6): bookmarkOf(), ENTITIES, textOf(), BOOKMARK_LIMITS, BOOKMARK_URL_LIMIT, NoteBookmark

### Community 126 - "A task's life"
Cohesion: 0.22
Nodes (9): A task's life, Codex in place of Claude Code, Coming back later, Features, Filing a task, Finishing a task, Parallel quests and branches, Putting a task back (+1 more)

### Community 127 - "Tea-concile"
Cohesion: 0.22
Nodes (8): 1. Find the merge, 2. Read both intents before editing, 3. Resolve by kind, 4. Find what git didn't flag, 5. Hand it back, Common mistakes, Report, Tea-concile

### Community 128 - "realms_api.spec.ts"
Cohesion: 0.29
Nodes (4): fileOf(), NOW, run, seed()

### Community 129 - "scene_view.tsx"
Cohesion: 0.46
Nodes (7): copyWithIds(), LayerView(), SceneThumb(), SceneView(), textStyle(), childrenOf(), isFrame()

### Community 130 - "What Rohan sees"
Cohesion: 0.25
Nodes (8): Commands, Keys, The band above the prompt, The handoff card, The menu, The status line, The tea cup, What Rohan sees

### Community 131 - "The record"
Cohesion: 0.33
Nodes (6): Effort, The record, Time, What a task holds, Where, Writing it

### Community 132 - "Repository Rules"
Cohesion: 0.40
Nodes (4): Forms, Repository Rules, Visual artifacts, Writing code

### Community 133 - "detail.spec.tsx"
Cohesion: 0.20
Nodes (7): ACTIVE, BOARD, FIRST, HELD, open(), QUEST_FACTS, QuestFacts

### Community 134 - "electron"
Cohesion: 0.50
Nodes (3): engine, CHANNELS, electron

### Community 136 - "Task 5: Time and effort"
Cohesion: 0.40
Nodes (6): Read, Task 2: The record, Task 5: Time and effort, Task 7: The message check, ProjectRecord, Task

### Community 145 - "fakeEngine"
Cohesion: 0.18
Nodes (10): body(), memoryNotes(), ok(), open(), write(), versions, note(), quest() (+2 more)

## Knowledge Gaps
- **6 isolated node(s):** `../tsconfig.json`, `@types/node`, `electron-builder`, `jsdom`, `typescript` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1022 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `realms_api.spec.ts`, `note_workspace.tsx`, `emptyRecord`, `designs_api.spec.ts`, `detail.spec.tsx`, `EngineApi`, `ref_types`, `hud.tsx`, `shell.spec.tsx`, `first_run.tsx`, `engine_api.ts`, `fakeEngine`, `book_form.ts`, `palette.ts`, `notes_api.ts`, `branches.spec.tsx`, `observation.ts`, `project_views.ts`, `Refusal`, `App`, `design_editor.tsx`, `design_forms.ts`, `designs_api.spec.ts`, `note_attachments.ts`, `claude_code.ts`, `helpers_api.spec.ts`, `library_api.ts`, `activity.spec.ts`, `t`, `app.tsx`, `host.ts`, `messages.ts`, `notes.spec.ts`, `package.json`, `designs.ts`, `quests_page.tsx`, `notes_backup.spec.ts`, `record_source.ts`, `designs.spec.tsx`, `ref_node_child_process`, `branch_rules.ts`, `test_support.ts`, `ref_node_path`, `Reply`, `settings.spec.tsx`, `description_files.spec.tsx`, `notes_api.spec.ts`, `app_menu.ts`, `feedback.spec.tsx`, `note_bookmarks.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `emptyRecord()` (e.g. with `Task 2: The record` and `4.14 First run with no projects`) actually correct?**
  _`emptyRecord()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.json`, `@types/node`, `electron-builder` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `note_workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08157349896480331 - nodes in this community are weakly interconnected._
- **Why does `Host` connect `scope.ts` to `settings_api.ts`, `designs_api.spec.ts`, `ports.ts`, `ref_types`, `opening_api.ts`, `git_source.ts`, `tests/helpers.ts`, `observation.ts`, `project_views.ts`, `claude_code.ts`, `helpers_api.spec.ts`, `library_api.ts`, `activity.spec.ts`, `File Structure`, `vitest`, `Queue-tea: workspace app`, `record_source.ts`, `session_rhythm.ts`, `Workspace app, the rest of the road`, `Part B: the app`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `settings_api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11182795698924732 - nodes in this community are weakly interconnected._
- **Why does `emptyRecord()` connect `emptyRecord` to `realms_api.spec.ts`, `designs_api.spec.ts`, `ports.ts`, `ref_types`, `Task 5: Time and effort`, `tasks_controller.ts`, `cup_mood.ts`, `scope.ts`, `families.ts`, `tests/helpers.ts`, `project_views.ts`, `Refusal`, `ui.test.tsx`, `helpers_api.spec.ts`, `4. Screens`, `branch_workflow.e2e.ts`, `vitest`, `notes_backup.spec.ts`, `record_source.ts`, `feedback.e2e.ts`, `notes_api.spec.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._