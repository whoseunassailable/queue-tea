# Queue-tie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Queue-tie mod in [spec.md](spec.md): one current task per project, a priority queue, a branch per task, a fresh conversation per task, a git guard, and a record of time and effort.

**Architecture:** One Claude Code mod (a hooks module plugin). The logic that needs no engine (queue order, git output parsing, the guard's matcher, time accrual, the docs log, check answers) lives in pure functions, each in its own file and tested on its own. Thin adapters reach the engine through `$` (`$.fs`, `$.process.run`, `$.model.fork`, `$.command.run`, `$.prompt.submit`, `$.session.usage`). `hooks/register.tsx` only wires events to them. Display state lives in `$.state` atoms. The record lives in a JSON file per project.

**Tech Stack:** TypeScript and TSX hooks module against the `claude-code` API of build 2.1.304, its testing kit `claude-code/testing`, `claude plugin validate`, `claude plugin test`, `tsc`, and git through `$.process.run`.

**Spec:** `~/Documents/projects/personal_projects/queue-tie/docs/spec.md`

**API reference while building:** `/private/tmp/claude-501/bundled-skills/2.1.304/b83111368ebe5d0152d38b9f71c09350/plugin-authoring/types/claude-code.d.ts` until the mod has loaded once, then `<mod>/.claude-plugin/types/claude-code/index.d.ts`. Grep it for the name at hand (`export type ToolCallResult`, `'process.run'`). Where this plan names a call's shape, the declaration file wins.

## Global Constraints

- **No commits, no pushes.** Rohan commits. Every task ends with a checkpoint that lists the files it changed, never `git commit`.
- **Mod folder while building:** `M=~/.claude/dev-mods/<session>/queue-tie`. Every path below is relative to `$M`.
- **Plugin name:** `queue-tie`. Pane id `queue-tie`, pane title `Queue-tie · <project>`.
- **Priorities, in order:** `urgent`, `high`, `mid`, `okay`, `low`.
- **Difficulties:** `light`, `medium`, `hard`.
- **Task states:** `queued`, `current`, `done`, `removed`.
- **Branch:** `task/<slug>`, made from the branch checked out now. A taken name gets `-2`, `-3` and so on.
- **Record file:** `$HOME/.queue-tie/projects/<folder>-<hash6>.json`.
- **Defaults (userConfig):** `idleGapMinutes` 15, `freshAtTokens` 100000, `handoffAtPercent` 90, `checkTimeoutSeconds` 10.
- **Docs log suggestion:** `docs/task_log.md`.
- **Commands:** `/queue-tie`, `/done`, `/task <message>`.
- **Errors** go to `$.ui.log(text, { to: 'debug' })`, never to the screen. The screen says what went wrong in plain words, with a way to try again.
- **Every waiting view** shows loading (a turning character and a line), partly loaded, done, done but empty, or failed. Never blank.
- **Exact copy from the spec** (use these strings as written):
  - `Queue-tie: checking your message…`
  - `Queued: <title> (<priority>)`
  - `Is <task> done for now?` and `Is this done for now?`
  - `Reading your queue…`
  - `Nothing queued yet. Tell me what you're working on and it becomes the first task.`
  - `Couldn't read your task record`
  - `Not a git repository, so no branches are made`
  - `This branch has never been pushed`
  - `Queue-tie: commits and pushes are yours to make.`
  - status line `Queue-tie: <task> · <time> · 5h <n>%`
  - allowance `5h: <n>% · resets <HH:MM>`
- **Health data:** the docs log holds titles and numbers only, never message text.

## Review Focus

1. **Task titles that break things.** A title with `/`, `|`, backticks, emoji, or 200 characters must still give a valid branch name and an unbroken docs log table. Tests: `slugBranch` in Task 3, `escapeCell` in Task 6.
2. **A broken record file.** Invalid JSON, or a file from a newer `version`, must show the failed state and must never be overwritten with an empty record. That would lose the history. Test in Task 2.
3. **A check answer that isn't clean JSON.** Prose around it, a code fence, or a missing field must still parse when a JSON object is in there. Otherwise it gives the can't-tell buttons with "the check didn't run". Tests in Task 7.
4. **The guard and quoted text.** `grep -r "git push" docs/` and `echo "git commit"` must be allowed. `bash -c "git push"`, `sh -c '…'` and `$(git commit …)` must be refused. Tests in Task 4.
5. **Pressing Save twice.** Two quick presses on the band's **Save** must file one task, not two. Test in Task 8.

---

## File Structure

| File | Its one job |
| --- | --- |
| `.claude-plugin/plugin.json` | Manifest: name, version, description, `types`, `userConfig` |
| `hooks/hooks.json` | `{ "modules": ["./register.tsx"] }` |
| `types/index.d.ts` | The contract: every domain type and every `$.state` value under `PluginState['queue-tie']` |
| `hooks/register.tsx` | Wires events to the pieces. No logic of its own |
| `hooks/state.ts` | The atoms (`atom(ref, initial)`), one per `$.state` value |
| `hooks/queue.ts` | Pure: queue order, the suggestion, adding, removing, re-prioritising |
| `hooks/record.ts` | Project key, record path, read, `updateRecord` (read again, change, write via temp file and `mv`) |
| `hooks/git.ts` | Pure parsers (`parseStatus`, `parseShortstat`, `slugBranch`, `holdReason`) plus `readGit`, `makeBranch`, `diffSince`, `switchBranch` over `$.process.run` |
| `hooks/guard.ts` | Pure `isCommitOrPush(command)` |
| `hooks/time.ts` | Pure `accrue`, `dayKey`, `formatMinutes` |
| `hooks/effort.ts` | Pure `countToolCall` (file reads and changes from a tool call) |
| `hooks/docslog.ts` | Pure `addRow`, `escapeCell`, plus `writeDocsLog` over `$.fs` |
| `hooks/check.ts` | Pure `checkPrompt`, `parseCheckAnswer`, plus `checkMessage` over `$.model.fork` with a timeout |
| `hooks/flow.ts` | Task flow over `$`: `fileTask`, `startTask`, `finishTask`, `continueTask`, `freshConversation`, `firstMessage` |
| `hooks/usage.ts` | Pure `readAllowance`, `formatAllowance`, `shouldFresh`, `shouldHandoff` |
| `hooks/ui/panel.tsx` | The pane's tree |
| `hooks/ui/band.tsx` | The band above the prompt |
| `hooks/ui/status.ts` | Pure `statusText` |
| `tests/helpers.ts` | Test fakes: git table, in-memory files, fork answers |
| `tests/*.test.ts(x)` | One test file per piece |

## Shared Types (Task 1 writes them; every task uses them)

In `types/index.d.ts`:

```ts
export type Priority = 'urgent' | 'high' | 'mid' | 'okay' | 'low'
export type Difficulty = 'light' | 'medium' | 'hard'
export type TaskState = 'queued' | 'current' | 'done' | 'removed'
export type Intent = 'understanding' | 'improving'

export type Effort = {
  understandingMessages: number
  improvingMessages: number
  filesRead: number
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  filesTouched: number             // from git at the finish
}

export type Task = {
  id: string                       // `t-` + 8 hex characters
  title: string
  state: TaskState
  priority: Priority
  difficulty: { expected: Difficulty; actual: Difficulty | null }
  messages: string[]
  handoff: { text: string; written: string } | null
  branch: string | null
  startCommit: string | null
  created: string                  // ISO 8601 with the local offset
  started: string | null
  finished: string | null
  minutesByDay: Record<string, number>   // 'YYYY-MM-DD' -> minutes, two decimals
  effort: Effort
  files: { read: string[]; changed: string[] }   // de-duplication for the counts
}

export type ProjectRecord = {
  version: 1
  project: { name: string; path: string }
  docsLogPath: string | null
  tasks: Task[]
  unassignedMinutesByDay: Record<string, number>
}

export type GitState = {
  isRepo: boolean
  branch: string | null            // null when detached or not a repo
  isDetached: boolean
  head: string | null              // short hash
  uncommitted: number              // porcelain lines, untracked included
  unpushed: number
  hasUpstream: boolean
}

export type CheckAnswer = {
  kind: 'same' | 'new' | 'quick' | 'unsure'
  intent: Intent
  title?: string                   // kind 'new' only
  difficulty?: Difficulty          // kind 'new' only
}

export type Band =
  | { kind: 'none' }
  | { kind: 'file'; text: string; title: string; priority: Priority; difficulty: Difficulty; intent: Intent }
  | { kind: 'unsure'; text: string; intent: Intent; didCheckRun: boolean }
  | { kind: 'difficulty'; taskId: string; picked: Difficulty }
  | { kind: 'docsPath'; taskId: string; suggested: string }

export type Allowance = { percent: number; resetsAt: string | null }

declare module 'claude-code' {
  interface PluginState {
    'queue-tie': {
      record: ProjectRecord | null
      load: 'loading' | 'ready' | 'failed'
      hold: string | null          // what the git check says is left, or null
      band: Band
      isAskingDone: boolean
      isChoosingNext: boolean
      openRow: string | null       // task id pressed in Up next
      isChecking: boolean
      allowance: Allowance | null
      notice: string | null        // one plain line under Now ("the check didn't run")
      spin: number                 // frame of the turning character
    }
  }
}
```

---

### Task 1: Scaffold, contract and queue order

**Files:**
- Create: `.claude-plugin/plugin.json`, `hooks/hooks.json`, `types/index.d.ts` (the Shared Types above), `hooks/state.ts`, `hooks/queue.ts`, `hooks/register.tsx`
- Test: `tests/queue.test.ts`

**Interfaces:**
- Produces:
  - `PRIORITY_ORDER: readonly Priority[]` = `['urgent','high','mid','okay','low']`
  - `orderQueue(tasks: Task[]): Task[]`: queued tasks only; priority, then `created` oldest first
  - `suggestion(tasks: Task[]): Task | null`: the first of `orderQueue`
  - `currentTask(tasks: Task[]): Task | null`
  - `newTask(input: { title: string; priority: Priority; difficulty: Difficulty; messages: string[]; now: string; id: string }): Task`
  - `setPriority(tasks: Task[], id: string, p: Priority): Task[]`
  - `removeTask(tasks: Task[], id: string): Task[]` (state `removed`; queued tasks only)
  - in `state.ts`: one atom per `PluginState['queue-tie']` key, named like the key (`record`, `load`, `hold`, `band`…), refs `{ plugin: 'queue-tie', key: '<key>' } as const`; initial values `null`, `'loading'`, `null`, `{ kind: 'none' }`, `false`, `false`, `null`, `false`, `null`, `null`, `0`

- [ ] **Step 1: Write the manifest and module files**

`plugin.json`: `{ "name": "queue-tie", "version": "0.1.0", "description": "One task at a time per project, a priority queue, a branch per task, and a record of time and effort.", "types": "./types/index.d.ts", "userConfig": { … } }`. The four numeric fields go under `userConfig` with the Global Constraints defaults, each with a title and a one-line description. Check the field shape against `claude plugin validate` output in Step 6. `hooks/register.tsx` exports `register: Register` with an empty `session.start` hook that returns `next(e)`.

- [ ] **Step 2: Write the failing tests** in `tests/queue.test.ts`

```ts
test('urgent before high before mid before okay before low', …)
  // five queued tasks created in reverse order → titles in priority order
test('same priority: oldest first', …)
test('only queued tasks are in the queue', …)   // current, done, removed left out
test('suggestion is the first of the queue, null when empty', …)
test('removeTask marks a queued task removed and leaves a current one alone', …)
test('setPriority moves a task in the order', …)
```

- [ ] **Step 3: Run them and see them fail**

Run: `claude plugin test $M`. Expected: FAIL, the functions are not defined.

- [ ] **Step 4: Implement `hooks/queue.ts` and `hooks/state.ts`**

- [ ] **Step 5: Run the tests**

Run: `claude plugin test $M`. Expected: all pass.

- [ ] **Step 6: Validate and type-check**

Run: `claude plugin validate $M`. Expected: no errors, and it lists the `queue-tie` state keys. Then run `tsc -p $M` once `.claude-plugin/types/` exists. Before the mod has loaded, use the header `tsconfig.json` of the API file, kept outside `$M`. Expected: no errors.

- [ ] **Step 7: Checkpoint.** List the files created. Don't commit.

---

### Task 2: The record

**Files:**
- Create: `hooks/record.ts`, `tests/helpers.ts`
- Test: `tests/record.test.ts`

**Interfaces:**
- Consumes: `ProjectRecord`, `Task` (Task 1)
- Produces:
  - `projectKey(path: string): string` returns `<last folder name>-<6 hex>`. The 6 hex are the first six of an FNV-1a 32-bit hash of the full path, as lowercase hex.
  - `recordPath(home: string, key: string): string` returns `${home}/.queue-tie/projects/${key}.json`
  - `emptyRecord(name: string, path: string): ProjectRecord`
  - `parseRecord(text: string): ProjectRecord | 'unreadable'`: `'unreadable'` for invalid JSON or `version !== 1`
  - `readRecord($, file: string, name: string, path: string): Promise<ProjectRecord | 'unreadable'>`: a missing file gives `emptyRecord`
  - `updateRecord($, file: string, change: (r: ProjectRecord) => ProjectRecord, name: string, path: string): Promise<ProjectRecord | 'unreadable'>`. It reads again right before writing, applies `change`, writes `${file}.tmp`, then runs `['mv', '-f', tmp, file]`. When the read is `'unreadable'` it writes nothing and returns `'unreadable'`.
  - in `tests/helpers.ts`: `fakeFiles(on, initial?: Record<string,string>)` answers `fs.read` / `fs.write` / `fs.exists` from a map, and `mv` through `process.run`. `fakeGit(on, table: Record<string, { stdout?: string; exitCode?: number }>)` answers `process.run` by `argv.join(' ')`. Calls the table lacks get exit code 1.

- [ ] **Step 1: Write the failing tests**

```ts
test('projectKey: same folder name, different paths, different keys', …)
  // '/a/frontend' and '/b/frontend' → both start 'frontend-', keys differ, 6 hex each
test('a missing file reads as an empty record', …)
test('updateRecord keeps a task another session wrote in between', …)
  // file holds task A; change adds B; between read and write nothing else → both A and B
  // second case: file is rewritten with A+C before updateRecord runs → result A, C, B
test('updateRecord writes through a temp file and mv', …)   // fs.write on .tmp, then mv argv
test('an unreadable record is never overwritten', …)          // Review Focus 2
  // file holds '{not json' → updateRecord returns 'unreadable', no fs.write, no mv
test('a record of version 2 is unreadable', …)
```

- [ ] **Step 2: Run them and see them fail.** `claude plugin test $M`. Expected: FAIL.
- [ ] **Step 3: Implement `hooks/record.ts` and `tests/helpers.ts`**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.** List files. Don't commit.

---

### Task 3: Reading git and making branches

**Files:**
- Create: `hooks/git.ts`
- Test: `tests/git.test.ts`

**Interfaces:**
- Consumes: `GitState` (Task 1), `fakeGit` (Task 2)
- Produces:
  - `parseStatus(porcelainV2Branch: string): Omit<GitState, 'isRepo'>`. Its input is the output of `git status --porcelain=v2 --branch`: `# branch.head` (`(detached)` means detached), `# branch.oid`, `# branch.upstream` (absent means no upstream), `# branch.ab +A -B` gives `unpushed = A`, and every other non-`#` line counts one toward `uncommitted`.
  - `holdReason(g: GitState): string | null`, checked in this order:
    - not a repo gives `null` (the caller shows `Not a git repository, so no branches are made` and skips branching)
    - detached gives `Detached HEAD: check out a branch first`
    - uncommitted or unpushed gives `<n> files not committed · <m> commits not pushed`, each part shown only when its number is above 0, joined by ` · `, with singular `file` and `commit` at 1
    - no upstream gives `This branch has never been pushed`
    - otherwise `null`
  - `slugBranch(title: string, taken: string[]): string`:
    - lowercase, runs of anything outside `a-z0-9` become `-`, trimmed of `-`, cut to 50 characters, `task` when nothing is left
    - prefixed `task/`
    - when taken, `-2`, `-3` and so on
  - `readGit($, cwd: string): Promise<GitState>`: `git rev-parse --is-inside-work-tree` exit code not 0 means `isRepo: false`
  - `listBranches($, cwd): Promise<string[]>`: `git branch --format=%(refname:short)`
  - `makeBranch($, cwd, name): Promise<void>`: `git switch -c <name>`, rejects on a non-zero exit
  - `switchBranch($, cwd, name): Promise<void>`: `git switch <name>`
  - `diffSince($, cwd, commit): Promise<{ linesAdded: number; linesRemoved: number; filesTouched: number }>`: `git diff --shortstat <commit>`, parsed by the pure `parseShortstat(text)`, with empty output giving zeros

- [ ] **Step 1: Write the failing tests**

```ts
test('parseStatus: clean, pushed branch', …)            // holdReason → null
test('parseStatus: 3 changed, 2 ahead', …)              // '3 files not committed · 2 commits not pushed'
test('one file, one commit is singular', …)             // '1 file not committed · 1 commit not pushed'
test('no upstream', …)                                  // 'This branch has never been pushed'
test('detached', …)                                     // 'Detached HEAD: check out a branch first'
test('not a repo', …)                                   // readGit → isRepo false, holdReason null
test('slugBranch: plain title', …)                      // 'Retry button on the scan page' → 'task/retry-button-on-the-scan-page'
test('slugBranch: slashes, pipes, backticks, emoji, 200 chars', …)   // Review Focus 1: only [a-z0-9-], ≤ 55 chars total
test('slugBranch: nothing usable becomes task', …)      // '🚀🚀' → 'task/task'
test('slugBranch: taken names get -2 then -3', …)
test('parseShortstat', …)  // ' 4 files changed, 160 insertions(+), 38 deletions(-)' → 160, 38, 4; one-sided lines too
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement `hooks/git.ts`**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.**

---

### Task 4: The git guard

**Files:**
- Create: `hooks/guard.ts`
- Modify: `hooks/register.tsx` (add the `tool.call` hook on `Bash`)
- Test: `tests/guard.test.ts`

**Interfaces:**
- Produces: `isCommitOrPush(command: string): boolean`

Approach:
1. Split the command into commands at `&&`, `||`, `;`, `|` and newlines, outside quotes.
2. Tokenise each command, respecting single and double quotes.
3. Treat the inside of `$( … )` and backticks as commands of their own. Treat the string argument of `bash -c`, `sh -c`, `zsh -c` and `eval` the same way, recursively.
4. In each command, skip leading `VAR=value` words and the words `sudo`, `env`, `command`, `exec`, `time`, `nohup`.
5. For `git`, skip global options: `-C <path>`, `-c <k=v>`, `--git-dir[=]<p>`, `--work-tree[=]<p>`, `--no-pager`, `-P`, `--bare`. Refuse when the subcommand is in `commit push merge rebase cherry-pick revert pull am`.
6. For `gh`, refuse `repo create … --push` and `pr merge`.
7. A quoted word is data and is never read as a command, so `grep "git push"` passes.

`git pull` and `git am` are added to the spec's list because both make commits; the spec says "side effects included".

- Hook: `on('tool.call', { tool: 'Bash' }, ($, e, next) => isCommitOrPush(e.command) ? { deny: 'Queue-tie: commits and pushes are yours to make.' } : next(e))`, with `.catch(($, e, next) => next.called ? next(e) : { deny: 'Queue-tie: commits and pushes are yours to make.' })`.

- [ ] **Step 1: Write the failing tests**

```ts
const refused = [
  'git commit -m "x"', 'git commit --amend', 'git push', 'git push --force', 'git push --tags',
  'git merge main', 'git rebase main', 'git cherry-pick abc', 'git revert abc', 'git pull', 'git am x.patch',
  'cd x && git commit -m y', 'git -C /tmp/r commit -m y', 'git -c user.name=a commit',
  'GIT_AUTHOR_NAME=a git commit', 'bash -c "git push"', "sh -c 'git commit -m x'",
  'echo $(git commit -m x)', 'gh repo create a/b --push --source .', 'gh pr merge 12',
]
const allowed = [
  'git status', 'git log --oneline', 'git diff', 'git branch', 'git switch -c task/x',
  'grep -r "git push" docs/', 'echo "git commit"', 'gh pr view 12', 'gh repo create a/b',
]
test('refuses every commit and push', …)    // each of refused → true
test('allows the rest', …)                  // each of allowed → false (Review Focus 4)
test('the hook denies with the spec text', …)   // $.tool.call({ tool: 'Bash', command: 'git push' }) → deny text
test('the hook passes git status through', …)
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement `hooks/guard.ts` and the hook**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.**

---

### Task 5: Time and effort

**Files:**
- Create: `hooks/time.ts`, `hooks/effort.ts`
- Modify: `hooks/register.tsx`
- Test: `tests/time.test.ts`, `tests/effort.test.ts`

**Interfaces:**
- Consumes: `Task`, `ProjectRecord`, `updateRecord` (Task 2), `currentTask` (Task 1)
- Produces:
  - `dayKey(ms: number, offsetMinutes: number): string`: `YYYY-MM-DD` of the local day
  - `accrue(prevMs: number | null, nowMs: number, gapMinutes: number): number`: minutes. It gives 0 when `prev` is null, the gap is negative, or the gap is over `gapMinutes`, and the gap in minutes otherwise.
  - `addMinutes(byDay: Record<string, number>, day: string, minutes: number): Record<string, number>`: rounds to two decimals
  - `formatMinutes(m: number): string`: `24m`, `1h 24m`, `6h 40m`, `0m` under one minute
  - `parseOffset(dateZ: string): number`: `+0200` gives 120 and `-0530` gives -330
  - `countToolCall(files: Task['files'], tool: string, input: Record<string, unknown>): Task['files']`:
    - reads: `Read` (`file_path`), `Grep` and `Glob` (`path` when given)
    - changes: `Edit`, `Write`, `NotebookEdit` (`file_path` / `notebook_path`)
    - each path once; other tools leave it as is
  - Hooks:
    - at `session.start`, keep the offset from `$.process.run(['date', '+%z'])`
    - on `prompt.submit`, `tool.call` and `turn.complete`, accrue since the last activity into a pending module variable (not `$.state`): `{ minutes: Record<string, number>; files: Task['files']; understanding: number; improving: number }`
    - for `Read`/`Grep`/`Glob`/`Edit`/`Write`/`NotebookEdit` tool calls, also update the pending files
    - `addIntent(intent: Intent): void` adds one to the pending `understanding` or `improving` count; Task 8 calls it
    - at `turn.complete` and `session.end`, flush with `updateRecord` and reset the pending values:
      - minutes go to the current task's `minutesByDay`, or to `unassignedMinutesByDay` when nothing is current
      - files merge into the current task's `files`, and `effort.filesRead` / `filesChanged` are set to their lengths
      - the intent counts are added to `effort.understandingMessages` / `improvingMessages`

- [ ] **Step 1: Write the failing tests**

```ts
test('a gap of 15 minutes counts, 15m01s does not', …)   // accrue with gapMinutes 15
test('a negative gap counts nothing', …)
test('dayKey uses the local offset across midnight', …) // 2026-10-21T23:50Z with +120 → '2026-10-22'
test('formatMinutes', …)                                 // 24 → '24m', 84 → '1h 24m', 400 → '6h 40m'
test('each file counts once', …)                         // Read a, Read a, Edit a → read [a], changed [a]
test('a turn flushes minutes to the current task and unassigned when none', …)
  // mock.clock; prompt.submit at 0, tool.call at 5 min, turn.complete at 9 min → 9 minutes on the task
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.**

---

### Task 6: The docs log

**Files:**
- Create: `hooks/docslog.ts`
- Test: `tests/docslog.test.ts`

**Interfaces:**
- Consumes: `formatMinutes` (Task 5)
- Produces:
  - `type DocsRow = { title: string; priority: Priority; expected: Difficulty; actual: Difficulty; minutes: number; branch: string | null }`
  - `escapeCell(text: string): string`: `|` becomes `\|`, newlines become spaces
  - `addRow(existing: string | null, row: DocsRow, day: string): string`. When there's no file, it starts with `# Task Log`, a blank line and `Every task finished in this project, newest first. Written by Queue-tie.`. It puts the row first under `## <day>`, which goes above every older date's heading. The table header is `| Task | Priority | Difficulty | Time | Branch |` with `| --- | --- | --- | --- | --- |`. Cells: the escaped title; the priority capitalised (`High`); `Light → Medium`, or just `Light` when both are the same; `formatMinutes`; the branch in backticks, or `—` when null.
  - `writeDocsLog($, projectPath: string, logPath: string, row: DocsRow, day: string): Promise<void>`

- [ ] **Step 1: Write the failing tests**

```ts
test('a new log gets the heading, intro, date and row', …)  // exact text against the spec's example
test('a second task the same day goes first under that date', …)
test('a new day goes above the older day', …)
test('pipes and newlines in a title do not break the table', …)   // Review Focus 1
test('same expected and actual difficulty shows once', …)
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.**

---

### Task 7: The message check

**Files:**
- Create: `hooks/check.ts`
- Test: `tests/check.test.ts`

**Interfaces:**
- Consumes: `CheckAnswer`, `Task` (Task 1)
- Produces:
  - `checkPrompt(current: Task | null, queued: Task[], text: string): string`. It asks for one JSON object only: `{"kind":"same|new|quick|unsure","intent":"understanding|improving","title":"…","difficulty":"light|medium|hard"}`, with `title` (at most 60 characters) and `difficulty` only for `new`. It defines each kind in one line:
    - `same` continues the current task
    - `new` is other work to do later
    - `quick` is a side question that isn't work
    - `unsure`
    - with no current task, work is `new`
    It also names the current task's title and the queued titles, then gives the message.
  - `parseCheckAnswer(reply: string): CheckAnswer | null`:
    - takes the first `{…}` in the reply, code fences allowed
    - `null` when there's no object, `kind` or `intent` isn't one of the allowed words, or `kind` is `new` with no title
    - a missing `difficulty` on `new` becomes `medium`
  - `checkMessage($, prompt: string, timeoutMs: number): Promise<CheckAnswer | null>`:
    - races `$.model.fork({ prompt })` against `$.clock.sleep(timeoutMs)`
    - `nothing-to-fork` falls back to `$.model.complete({ model: 'claude-haiku-5-5', prompt, maxTokens: 200 })`
    - `null` on a timeout, an unanswered result or an unparseable reply, and each of those goes to `$.ui.log(…, { to: 'debug' })`

- [ ] **Step 1: Write the failing tests**

```ts
test('parses a clean answer', …)
test('parses an answer inside prose and a code fence', …)          // Review Focus 3
test('new without a title is null; new without difficulty is medium', …)
test('an unknown kind is null', …)
test('a fork that answers in time gives the answer', …)            // on('model.fork', () => ({ value: { isAnswered: true, text: '…', usage } }))
test('a fork slower than the time limit gives null', …)            // mock.clock; fork answers after 11 s, limit 10 s
test('nothing-to-fork falls back to a completion', …)
test('the prompt names the current task and the queue', …)
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.**

---

### Task 8: The task flow

**Files:**
- Create: `hooks/flow.ts`
- Modify: `hooks/register.tsx`
- Test: `tests/flow.test.ts`

**Interfaces:**
- Consumes: everything in Tasks 1 to 7
- Produces:
  - `firstMessage(task: Task): string`. It's the task's title as a heading line `Task: <title>`, then each filed message, then, when `handoff` is set, `Handoff note (<written>):` with its text.
  - `fileTask($, ctx: Ctx, input: { text: string; title: string; priority: Priority; difficulty: Difficulty; intent: Intent }): Promise<void>`:
    - sets `band` to `{ kind: 'none' }` before anything else, so a second press finds nothing to save
    - adds the task with `updateRecord` and toasts `Queued: <title> (<priority>)`
    - when nothing is current, calls `startTask`
  - `startTask($, ctx, taskId: string): Promise<'started' | 'held' | 'failed'>`:
    1. Run `readGit`. When `holdReason` isn't null, set `hold` and return `'held'`.
    2. When it's a repo, `slugBranch` against `listBranches`, then `makeBranch`.
    3. Mark the task `current` with `started`, `branch` and `startCommit` (the head).
    4. Clear `hold`, `isChoosingNext` and `openRow`.
    5. Call `freshConversation($, task)`.
  - `freshConversation($, task: Task): Promise<void>`: `$.command.run({ command: 'clear' })`, then `$.prompt.submit({ text: firstMessage(task) })`. It's always run from `$.clock.after(0, …)`, never inside a hook the turn waits on.
  - `finishTask($, ctx, taskId, actual: Difficulty): Promise<void>`:
    1. `diffSince(startCommit)` goes into effort.
    2. Set state `done`, `finished` and `difficulty.actual`.
    3. When `docsLogPath` is null, set `band` to `docsPath` (suggested `docs/task_log.md`) and stop. The band's save calls `finishDocs`.
    4. Otherwise run `writeDocsLog`.
    5. Set `isChoosingNext` true and `isAskingDone` false.
  - `finishDocs($, ctx, taskId, path: string): Promise<void>`: saves `docsLogPath`, writes the row, sets `isChoosingNext`
  - `continueTask($, ctx): Promise<void>`: `freshConversation` with the current task
  - `switchToTask($, ctx): Promise<'switched' | string>`: the hold text when anything is uncommitted
  - `type Ctx = { cwd: string; projectPath: string; projectName: string; file: string; options: Options }`, where `Options` is the four userConfig values
  - The done tool: at `session.start`, `$.tool.register({ name: 'task_looks_done', description: 'Call when your reply has finished what the current Queue-tie task asked. Rohan is then asked in the panel whether it is done for now.', inputSchema: { type: 'object', properties: {} }, isDeferred: false })`. A `tool.call` hook on `mcp__queue-tie__task_looks_done` sets `isAskingDone` true and answers with the tool's result. Check the result shape with `export type ToolCallResult`.
  - System prompt: a `prompt.compose` hook appends `{ id: 'queue-tie:task', scope: 'session', text }` to `next(e)`'s sections while a task is current. The text is: `The current Queue-tie task is "<title>". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.`
  - The message check is wired into `prompt.submit`:
    - Skip when `e.command` is set, `e.isMeta` is set, or `e.origin` is this plugin.
    - Set `isChecking`, run `checkMessage`, then clear `isChecking`.
    - `same` or `quick`: return `next(e)`.
    - `new`: set `band` to `file` with the answer's title, priority `mid` and the guessed difficulty, then return `{ drop: 'Queue-tie: held as a new task' }`.
    - `unsure`, or `null`: set `band` to `unsure` (`didCheckRun: answer !== null`) and drop the same way.
    - Call `addIntent(answer.intent)` (Task 5) for `same`, `quick` and `new`.
  - **An unreadable record stops the flow.** When `updateRecord` returns `'unreadable'`, every flow function sets `load` to `'failed'` and returns without clearing, branching or starting. `startTask` returns `'failed'`.
  - `resubmit($, text): Promise<void>`: `$.prompt.submit({ text })`, for the band's **Same task** and **Quick question**

- [ ] **Step 1: Write the failing tests**

```ts
test('a new message is held and the band asks for its priority', …)
test('a same-task message goes through', …)
test('a failed check holds the message and says the check did not run', …)
test('slash commands and the mod’s own prompts are not checked', …)
test('Save twice files one task', …)                     // Review Focus 5: two fileTask calls, one task
test('filing with nothing current starts the task: branch, clear, first message', …)
  // fakeGit clean + upstream; expects 'git switch -c task/…', command.run clear, prompt.submit with 'Task: …'
test('a dirty tree holds the start and says what is left', …)   // hold '3 files not committed · 2 commits not pushed'
test('not a repo starts without a branch', …)
test('task_looks_done asks in the panel', …)            // isAskingDone true
test('finishing measures the diff, marks done and writes the docs log', …)
test('the first finish in a project asks for the docs log path', …)
test('the compose hook adds the task section only while a task is current', …)
test('firstMessage includes the handoff note when there is one', …)
test('an unreadable record stops the start: no branch, no clear', …)
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Validate.** Run `claude plugin validate $M`. Expected: the `prompt.submit`, `tool.call` and `prompt.compose` hooks are listed, and the guard is listed among the gating hooks with `.catch`.
- [ ] **Step 6: Checkpoint.**

---

### Task 9: Keeping usage down

**Files:**
- Create: `hooks/usage.ts`
- Modify: `hooks/register.tsx`, `hooks/flow.ts` (add `writeHandoff`)
- Test: `tests/usage.test.ts`

**Interfaces:**
- Consumes: `freshConversation`, `updateRecord`, the `allowance` atom
- Produces:
  - `readAllowance(rateLimits: { kind: string; percentUsed: number; resetsAt?: string }[]): Allowance | null`: the `five_hour` window
  - `formatAllowance(a: Allowance, offsetMinutes: number): string`: `5h: 62% · resets 16:40`, or `5h: 62%` with no reset time
  - `shouldFresh(tokens: number | undefined, freshAt: number): boolean`: true when `tokens` is over `freshAt`
  - `shouldHandoff(percent: number, mark: number, alreadyForReset: string | null, resetsAt: string | null): boolean`: true once per reset window, when `percent` is at or over `mark`
  - `HANDOFF_PROMPT`: `Write a handoff note for the current task so a fresh conversation can carry it on: what is done, what is left, which files changed, what was decided. Plain text, under 300 words.`
  - `writeHandoff($, ctx): Promise<boolean>`: runs `$.model.fork({ prompt: HANDOFF_PROMPT })`. When answered, it saves `handoff` with `written` set to now and returns true. Otherwise it logs to debug, sets `$.ui.status('Queue-tie: couldn't write the handoff note; trying again after the next reply')`, and returns false.
  - Hooks:
    - `session.measure` updates `allowance` from `e.rateLimits`.
    - `turn.complete`, while a task is current, reads `$.session.usage()`. When `shouldFresh` is true, it calls `writeHandoff` and, only if that succeeds, schedules `freshConversation` with `$.clock.after(0, …)`. When `shouldHandoff` is true, it calls `writeHandoff` alone and remembers the reset time it wrote for.

- [ ] **Step 1: Write the failing tests**

```ts
test('readAllowance picks the five-hour window', …)
test('formatAllowance with and without a reset time', …)
test('over 100,000 tokens: handoff, then clear and the first message from the note', …)
test('a failed handoff note does not clear', …)
test('90% writes one handoff note per reset window', …)
test('under the size nothing happens', …)
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Checkpoint.**

---

### Task 10: The panel, the band, the status line and the commands

**Files:**
- Create: `hooks/ui/panel.tsx`, `hooks/ui/band.tsx`, `hooks/ui/status.ts`
- Modify: `hooks/register.tsx`
- Test: `tests/ui.test.tsx`

**Interfaces:**
- Consumes: every atom, `orderQueue`, `suggestion`, `currentTask`, `formatMinutes`, `formatAllowance`, the flow functions
- Produces:
  - `statusText(task: Task | null, minutes: number, allowance: Allowance | null, isChecking: boolean): string | undefined`:
    - `Queue-tie: checking your message…` while checking
    - `Queue-tie: <title> · <formatMinutes> · 5h <n>%` with a task, leaving out the allowance part when it's null
    - `undefined` with no task and no check
  - `weekLine(tasks: Task[], unassigned: Record<string, number>, today: string): string`: `<n> done · <formatMinutes>`. It covers the week from Monday that holds `today`. `n` counts tasks finished that week, and the minutes are every task's and the unassigned minutes on those days.
  - `formatAge(ms: number): string`: `5m`, `3h`, `2d`, from a task's `created` to now
  - `renderPanel($, e): Promise<Tree>` for `{ component: 'Pane', requestId: 'queue-tie' }`. Sections and states are as in the spec under "The panel". Lay it out to `e.props.bodyColumns`.
    - Loading draws `'◐◓◑◒'[spin % 4]` and `Reading your queue…`. A `$.clock.every(150, …)` steps `spin` only while `load` is `'loading'` or `isChecking` is true.
    - Every Button gets its own `key`: `start:<id>`, `prio:<id>:<p>`, `remove:<id>`, `done-yes`, `done-not-yet`, `check-again`, `switch`, `continue`, `retry`.
  - `renderBand($, e, next): Promise<Tree>` for `{ component: 'AbovePrompt' }`. It returns `next(e)` when `band.kind === 'none'` or `e.props.hasSurvey`.
    - `file`: a line `New task: <title>`, priority buttons, difficulty buttons, **Save** and **Same task**. The picked buttons use `variant="primary"`.
    - `unsure`: **Same task**, **New task** and **Quick question**, with the line `The check didn't run, so pick one.` when `!didCheckRun`.
    - `difficulty`: three buttons, the picked one primary, then **Save**.
    - `docsPath`: an `Input` prefilled with `suggested`, and **Save**.
  - Commands, registered at `session.start`:
    - `queue-tie` opens the pane
    - `done` sets `isAskingDone` and opens the pane
    - `task` takes `argumentHint: '<message>'`. It sets `band` to `file` with the title from the first 60 characters of the arguments, priority `mid` and difficulty `medium`, with no check.
    - When a name is refused, register `queue-tie-done` or `queue-tie-task` instead, and say so in the pane's notice.
  - At `session.start`:
    1. Find the project with `git rev-parse --show-toplevel`, or the cwd.
    2. Read the record and set `load`.
    3. `$.ui.open({ id: 'queue-tie', title: 'Queue-tie · <name>' })`.
    4. When a task is current and the checked-out branch isn't its branch, set the notice `You're on <branch>; this task is on <task branch>.` and show **Switch**.
    5. `$.ui.status(statusText(…))` after every change that affects it.
  - At every `turn.complete`, read the record again into the `record` atom, so a second session's changes show.

- [ ] **Step 1: Write the failing tests**, looping over `['terminal', 'desktop'] as const`

```ts
test('loading shows the turning character and Reading your queue…', …)
test('empty shows the empty line', …)
test('failed shows Couldn't read your task record and Try again', …)
test('Up next is in priority order with the suggestion marked', …)
test('a held start shows what is left and Check again', …)
test('Is this done for now? Yes leads to the difficulty band', …)
test('the file band: pick high and hard, Save, toast Queued: … (high)', …)
test('the unsure band without a check says the check didn't run', …)
test('statusText', …)    // the three forms
test('weekLine counts this week from Monday only', …)   // a task done last Sunday is left out
test('formatAge', …)      // 5 min → '5m', 3 h → '3h', 50 h → '2d'
test('/task files without a check', …)
```

- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Validate and type-check.** Run `claude plugin validate $M` and `tsc -p $M`. Expected: no errors.
- [ ] **Step 6: Checkpoint.**

---

### Task 11: Live try, move and install

**Files:**
- Copy: `$M/` → `~/Documents/projects/personal_projects/queue-tie/`, keeping `docs/`
- Create: `~/Documents/projects/personal_projects/queue-tie/.claude-plugin/marketplace.json`, `~/Documents/projects/personal_projects/queue-tie/README.md`

- [ ] **Step 1: Live try in a throwaway repository**

Make `/private/tmp/claude-501/<session>/scratchpad/qt-try`, `git init`, one commit, and a bare repository beside it as the remote, pushed. In this session, with the mods switched on, check each of these:
- a new task is held, and the band asks for its priority
- Save gives the toast, the branch is made, and the conversation starts fresh with `Task: …`
- a follow-up message goes through
- a side question goes through
- `task_looks_done` asks in the panel; Yes and the difficulty lead to the docs path question, the docs log row and the Up next choice
- a dirty tree holds the next start
- `git commit` from Claude is refused
- the record file is written at `~/.queue-tie/projects/qt-try-<hash6>.json`, which confirms `$.fs` can write outside the project folder

Expected: each one happens as the spec says. Write down anything that doesn't.

- [ ] **Step 2: Copy into Rohan's folder.** Run `rsync -a --exclude .claude-plugin/types $M/ ~/Documents/projects/personal_projects/queue-tie/`. The docs there stay.
- [ ] **Step 3: Marketplace file.** `{ "name": "queue-tie", "owner": { "name": "Rohan Bhande" }, "plugins": [{ "name": "queue-tie", "source": "./" }] }`. Then run `claude plugin validate ~/Documents/projects/personal_projects/queue-tie`. Expected: no errors.
- [ ] **Step 4: Ask Rohan, then install.** Ask before changing Rohan's Claude Code setup. After a yes, run `claude plugin marketplace add ~/Documents/projects/personal_projects/queue-tie` and `claude plugin install queue-tie@queue-tie --scope user`. Expected: `Installed queue-tie`. Edits to the folder reach a session through `/reload-plugins`.
- [ ] **Step 5: Hand over.** List every file in the folder for Rohan to commit. Don't commit.
