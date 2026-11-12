# Merge-check dependency setup

Design owner: codex. This fixes the recurring `sh: docusaurus: command not found` failure in fresh integration worktrees, including packages in folders such as `docs/`.

## Decision and limits

The check runner uses dependencies prepared inside the retained integration folder. It verifies the package manifests, npm lockfile, installed lock metadata, installed package versions and command links before starting a check. It does not link another worktree's `node_modules`. Build tools can write into that folder, so a shared link would also share their writes.

An automatic `npm ci` would install packages and could execute package installation scripts. It needs separate approval for those effects and any network access. Copying dependencies from another worktree would need a verified installation snapshot and rules for links and cancellation. The chosen path keeps installation explicit: a missing or mismatched installation produces **Dependency setup required** with instructions. The build has not run and this result never counts as passed.

No new install API or permission flag is introduced. `RunChecksRequest` still identifies the operation, approval and selected checks. `CheckRun.status` adds `setupRequired`, with a finished time, no process exit code and setup instructions in the output. Existing failed, cancelled, interrupted and running results still block approval. Checks without declared dependencies can run without `node_modules`.

## Preparing dependencies

1. In **Branches**, prepare and review the merge, select its checks and press **Run selected checks**.
2. If a check reports **Dependency setup required**, use **Open integration folder**. The output names the package folder and, when a lockfile can be used, gives a command such as `cd '/path/to/integration/worktree/docs' && npm ci --offline`.
3. Approve dependency installation before running that command. Review package installation scripts too: `--offline` controls npm package fetching, but scripts can start their own processes and network requests. Run setup only in this operation's folder.
4. If npm reports a missing cached package, installation failed. Approve network access separately before running `npm ci` without `--offline`. The runner never retries online or treats a cache miss as a successful check.
5. After setup succeeds, refresh the review and run the checks again. A real build or test failure remains a failed check with its output and exit code.

Use a committed `package-lock.json` or `npm-shrinkwrap.json` with `lockfileVersion` 2 or 3. Shrinkwrap takes precedence. An independent nested package uses its own lock and installation. A package listed in an ancestor npm workspace lock uses that lock's installation, including a package whose scripts use tools declared only at the root. A missing or unsupported lock needs a source change and a fresh merge preparation; installing a global binary cannot repair it. A shared dependency link from an older operation must be replaced with a local installation before retrying. Queue-tea does not remove the link or alter its target.

Local untracked `node_modules` directories do not change the approved Git tree, even when a project has omitted its ignore rule. Tracked changes and unrelated untracked files still invalidate approval. Dependency inspection checks paths and does not follow a package folder or executable link into another worktree. Dependency inspection and the command share the 15-minute limit. Cancellation stops inspection before a command starts, or stops the running process group. Approval is checked again after inspection and after execution.

## Progress, retries and closing the review

The checks panel shows the latest attempt for each available check. A retry replaces the previous failure in that panel as the new result arrives. Earlier attempts stay in the saved check record. **Elapsed** updates once a second while a check is running and shows its 15-minute limit; **Duration** shows the final elapsed time. Output and exit codes still come from the check runner.

**Close** stays in the review header while its content scrolls. It works during checks. Closing stops the view's polling and leaves checks running in the app; reopen the review to see their progress. **Stop checks** requests cancellation. Quitting the app is different from closing a review.

Each view allows one outstanding read and coalesces repeated polls and change events into one trailing read. Completed results can appear while that trailing read starts, so continuous output events cannot starve the display. Changed parameters and adopted mutation replies invalidate older results. Unmounting drops pending refreshes and unsubscribes listeners.

The main process shares simultaneous matching graph, branch and merge-workspace reads. It discards each shared promise when it settles, including failures. Different projects, destinations and operations use separate reads. Mutation approval still reads the files and branch heads directly. The graph timer pauses while a review is open; graph events and closing the review still refresh it. Graph task inspection runs at most four tasks concurrently. On failure it drains those tasks before allowing a retry.

## Regression coverage and activation

The regression tests are in `app/main/features/branches/api/checks_api.spec.ts`. They use real temporary dependency folders with process and Git boundaries faked. They cover fresh root and nested packages, npm workspaces, matching and mismatched dependencies in another worktree, stale local installation metadata and versions, changed manifests and locks, missing locks or command links, unreadable files, external metadata links, incomplete offline setup, setup retry, cancellation, timeout, approval changes and command failure. `app/main/features/branches/data/checks_source.spec.ts` checks that setup-required results cannot satisfy approval. `app/main/features/branches/data/merge_workspace.spec.ts` covers local dependency directories and approval. `app/renderer/app/branches.spec.tsx` checks the visible state, blocked merge and retry action. `app/main/core/stream_process.spec.ts` distinguishes actual timeouts from scripts returning exit code 130.

`app/renderer/core/api/use_engine_read.spec.tsx` covers slow reads, event bursts, trailing refreshes, parameter changes, adoption, errors and unmounting. `app/main/features/branches/api/branch_reads.spec.ts` covers simultaneous backend reads, retry and isolation. `app/main/features/branches/data/branch_source.spec.ts` covers Git fanout, result order, freshness and draining after failure. `app/renderer/app/branch_polling.spec.tsx` opens the graph, branch review and live checks under slow reads and confirms final output and cleanup after closing. `app/renderer/features/branches/presentation/widgets/merge_checks.spec.tsx` covers retry display, bounded rendered logs and elapsed/final duration.

Rohan reviews and commits these changes, integrates them and deploys Queue-tea. Source edits do not activate this behavior in an already installed app. The repository's release path is **Push to origin/main** in the installed app or `node tools/push.mjs [remote] [branch]` from an integration checkout. It verifies and packages the acknowledged integration commit before installing it. Restart into the deployed build before retrying retained merge checks. This task does not patch the installed application or change Musimo's feature files.

## Verification on 12 November 2026

This task worktree has no `app/node_modules`. Verification used the existing tools in `/Users/whoseunassailable/.queue-tea/worktrees/queue-tea-a60ae6/main-integration/app/node_modules` read-only. Temporary configs under `/private/tmp` preserve the repository's entry points, test selection and compiler options while resolving dependencies from that existing folder and keeping caches out of it. No dependency copy, download or installation was needed. The temporary `npx` wrapper resolves only the existing TypeScript compiler, with npm offline.

The final full app suite ran from `app/`:

```sh
env PATH="/private/tmp/queue-tea-merge-check-tools:/Users/whoseunassailable/.queue-tea/worktrees/queue-tea-a60ae6/main-integration/app/node_modules/.bin:$PATH" npm_config_offline=true npm_config_update_notifier=false node /Users/whoseunassailable/.queue-tea/worktrees/queue-tea-a60ae6/main-integration/app/node_modules/vitest/vitest.mjs run --root . --config /private/tmp/queue_tea_merge_full.vitest.config.mjs --maxWorkers=2 --reporter=dot
```

It exited 0 and printed `Test Files 91 passed | 3 skipped (94)` and `Tests 1823 passed | 28 skipped (1851)`. The skips are the existing opt-in Git fixtures. The command also warned that the root's ignored `.claude-plugin/types/tsconfig.json` was absent; the temporary compiler options avoid depending on that file.

| Command | Printed result |
| --- | --- |
| `node /Users/whoseunassailable/.queue-tea/worktrees/queue-tea-a60ae6/main-integration/app/node_modules/typescript/bin/tsc -p /private/tmp/queue_tea_merge_dependencies.tsconfig.json --noEmit` | Exit 0, no output |
| From `app/`: `node /Users/whoseunassailable/.queue-tea/worktrees/queue-tea-a60ae6/main-integration/app/node_modules/electron-vite/bin/electron-vite.js build --config /private/tmp/queue_tea_merge_dependencies.electron.config.ts --logLevel warn` | Exit 0; Codex server build printed `448 modules transformed` and `built in 1.88s`. Two Zod annotation warnings. |
| `node tools/check_layers.mjs` | Exit 0, no output |
| `git diff --check` | Exit 0, no output |
| `node /private/tmp/queue_tea_polling_browser.cjs` (approved outside the sandbox) | `Browser retained JS heap after 10,000 change events: 2684 KiB -> 3016 KiB`, followed by the pass line below |

The browser command printed:

```text
PASS: slow reads peak=1; 100-event burst coalesced; old failures replaced; elapsed and final duration visible; Close stays visible at 1100x720 and 320x568; close stops polling; reopen shows final success; no page errors
```

The browser harness bundles this worktree's components with a delayed fake engine. It blocks page network requests. It checks repeated event bursts and a retry over 100 older failures, then closes while a check is running and reopens for its final result. Screenshots are `/private/tmp/queue_tea_checks_1100.png` and `/private/tmp/queue_tea_checks_320.png`. The memory numbers measure retained JavaScript heap in that harness, not installed-app RSS or a long production session.

The first dependency regressions printed `10 failed | 3 passed` before the dependency fix. The polling regressions printed `9 failed | 1 passed`, including 101 simultaneous hook reads, 30 duplicate graph reads and 24 concurrent graph Git calls. The UI regressions printed `3 failed | 16 passed` before the latest-attempt, header-close and elapsed-time changes. Additional tests reproduced failure draining and missing root tools in a dependency-free workspace before their fixes.

The opt-in Git workflow tests and the existing GUI merge suite were not run because their fixtures commit and merge. The standalone browser check exercises the changed UI without Git mutations. Earlier in this task, `node --test 'tools/*.test.mjs'` inadvertently ran existing disposable Git fixtures and printed `tests 42`, `pass 42`, `fail 0`; it did not change this task's history or the installed app and was not rerun. Earlier full-suite attempts also encountered disk-space and sandbox watcher failures; the final full run above passed without changing or disabling those tests.

The task remains on `task/fix-merge-check-dependency`, with no upstream, at `21c2bd061827430fc4c1c0af0607979b64d019fc`. Changes are uncommitted and unstaged. The pre-existing graph query stamp is unrelated to the fix and should be excluded from the commit. Suggested subject for Rohan: `fixed merge dependencies and runaway check status polling`.
