# Branch workflow completion — 5 November 2026

The initial GUI foundation was committed by Rohan as `c493e86` and installed. This follow-up completes the four gaps identified afterward. These changes remain uncommitted in the `task/task-description` worktree. The production app has not been replaced with this follow-up.

## Completed behavior

- Codex activity reads native commands (including nested exec batches), file additions/edits/deletions, background results, questions, completion and stale-session states. Resumed sessions are discovered regardless of their original date. Incremental reads and bounded caches avoid rereading whole logs on every refresh. History remains available after a task finishes.
- Branch review and Codex task details refresh every second. Recorded command output updates as new session events arrive. Git commits/merges/pushes and checks started by the app stream output before process completion; stored output is bounded.
- The merge review offers configured npm test/typecheck/lint/validate/build scripts from the prepared result. Checks run there, can be cancelled, and record their exit code, output, definition and Git tree. Failed, cancelled, interrupted or stale checks cannot satisfy merge approval. Compatible installed dependencies are reused in the isolated worktree; no package installation is automatic.
- Full GUI tests start a task, show live work and review state, commit selected files with streamed output, run checks, resolve a real conflict, require a passing retry after failure, approve a merge, and separately approve a push to a local bare remote.
- Preview reads use a private index copy so UI refreshes do not contend with commit/check startup. Prepared commits can be retained and abandoned when source changes invalidate the operation. Displayed merge messages come from the actual Git commit.
- App builds explicitly use the app's TypeScript transform settings; a clean checkout no longer needs the ignored generated plugin types to package the app. In-app checks find installed Homebrew/user-local Node tools when the app is opened from Finder.

## Verification commands and actual output

All dependencies were already installed. Test Git operations were confined to disposable temporary repositories and a local bare remote under the previously approved test exception. No production repository commit/push or network access was performed.

| Command | Printed result |
| --- | --- |
| `QUEUE_TEA_GIT_TESTS=1 npm --prefix app test -- --reporter=dot` | `Test Files 61 passed (61)`; `Tests 1155 passed (1155)` |
| `node app/node_modules/typescript/bin/tsc -p app/tsconfig.json --noEmit` | Exit 0, no output |
| `node app/node_modules/typescript/bin/tsc -p . --noEmit` | Exit 0, no output |
| `node app/node_modules/electron-vite/bin/electron-vite.js build app --logLevel warn` | Exit 0, no output |
| `npm --prefix app run build`, with `.claude-plugin/types` temporarily renamed and restored in a `finally` block | Main, preload and renderer builds all completed; exit 0. No generated plugin types were present during the build. |
| `node tools/check_layers.mjs` | Exit 0, no output |
| `node --test tools/check_layers.test.mjs` | `tests 26`; `pass 26`; `fail 0` |
| `git diff --check` | Exit 0, no output |

After the final task-pane polling and wording changes, `node app/node_modules/vitest/vitest.mjs run --root app renderer/app/branches.spec.tsx renderer/app/detail.spec.tsx renderer/features/quests/presentation/flows.spec.tsx renderer/app/board.spec.tsx --reporter=dot` printed `Test Files 4 passed (4)` and `Tests 146 passed (146)`.

The full app suite includes real Git integration tests, process streaming/cancellation, interrupted/stale check rules, existing-dependency reuse, Codex command/file/background observation and resumed-session reading, UI components, the older task APIs, and the real filesystem watcher tests. The native Claude plugin suite was not rerun; this follow-up changes app-side code and configuration.

The GUI regression command was:

```sh
node app/node_modules/@playwright/test/cli.js test \
  --config app/playwright.config.ts \
  branch_workflow.e2e.ts branches.e2e.ts activity.e2e.ts flows.e2e.ts \
  --output app/test-results-completion
```

It printed `16 passed (39.1s)`. This covers the full workflow and existing task start, judgement, finish, put-back, parallel-task and activity screens. The read-only graph case now checks actual ancestry instead of assuming this task branch has not been merged.

The two full workflow tests also passed with the app process given a Finder-style system-only PATH. They use Codex event fixtures written to real session files and real command processes, Git branches, commits, conflicts, merges and a local push. They do not launch an AI agent or contact a remote service. The source task checkout and the destination are checked after each operation.

A final targeted GUI rerun additionally checks that native Codex events appear in the task details pane as well as Branches. Its command is:

```sh
node app/node_modules/@playwright/test/cli.js test \
  --config app/playwright.config.ts branch_workflow.e2e.ts \
  --output app/test-results-completion-finder
```

The final targeted rerun printed `2 passed (29.7s)`.

Screenshots of the prepared checks and failed-check state are under the ignored Playwright output directories.

## Handoff and supported boundaries

Review, commit and integrate this follow-up, then build/install from the clean integration checkout. The installed app still contains the earlier `c493e86` foundation until that owner-controlled update. It already has source provenance, so legacy-adoption setup is not needed again.

The in-app check runner currently uses configured npm scripts and compatible existing dependencies. Symlink/submodule conflicts require an editor; ordinary text conflicts and whole regular-file side selection are handled in the GUI. The activity feed displays observed agent tool events, not arbitrary external terminals or private reasoning. External agent output can update only when its session writes an event. Tests certify local behavior; remote authentication, branch protection and production release installation were not exercised.
