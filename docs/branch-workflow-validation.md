# Branch workflow verification — 4 November 2026

Implementation is in the `task/task-description` worktree. The owner-approved integration of `task/multiple-tasks` is resolved but remains an uncommitted merge. HEAD remains the owner's `c391dc8`; no task-repository commit or push was made. The task remains reopened. The installed application remains 1.5.2.

## Commands and results

All commands were run from this task worktree, using dependencies already installed locally.

| Command | Observed result |
| --- | --- |
| `QUEUE_TEA_GIT_TESTS=1 npm --prefix app run test:branches` | `Test Files 4 passed (4)`; `Tests 31 passed (31)` |
| `node app/node_modules/typescript/bin/tsc -p app/tsconfig.json --noEmit` | Exit 0; no output |
| `node app/node_modules/typescript/bin/tsc -p . --noEmit` | Exit 0; no output |
| `node app/node_modules/electron-vite/bin/electron-vite.js build app --logLevel warn` | Exit 0; no output |
| `node tools/check_layers.mjs` | Exit 0; no output |
| `node --test tools/check_layers.test.mjs` | `tests 26`, `pass 26`, `fail 0` |
| `git diff --check` and `git diff --cached --check` | Exit 0; no output |
| `git diff --name-only --diff-filter=U` | Exit 0; no output: no unresolved conflicts |
| `git branch --show-current` | `task/task-description` |
| `git rev-parse --short HEAD` | `c391dc8` |
| `node app/tools/release_guard.mjs refresh` | Exit 3; `Queue-tea update skipped: Feature and detached builds are previews. Merge into the integration branch before updating the installed app.` No build or install attempted. |

The 31 focused tests include 13 real Git integration tests, nine UI tests, seven Git parsing/graph/activity tests, and two production-update policy tests. The owner explicitly approved the disposable-repository exception. Those integration tests used temporary repositories with local hooks disabled and a temporary local bare remote; they made no network requests or changes to this task repository.

The real Git cases cover: isolated preparation; two-parent merge; stale source approval; dirty destination; text conflict resolution; abandonment; recovery after a lost commit response; concurrent preparation; selected-file commit and duplicate delivery; failed push preserving a local merge; commit hooks changing the prepared result; observed active writers; dirty-file content changes; a destination without a checkout; and retry after a definite commit failure. Several cases share a test.

The broader regression command was:

```sh
node app/node_modules/vitest/vitest.mjs run --root app \
  --exclude '**/detail_api.spec.ts' \
  --exclude '**/start_api.spec.ts' \
  --exclude '**/live_api.spec.ts' \
  --exclude '**/finish_api.spec.ts' \
  --exclude 'main/core/watcher.spec.ts' \
  --reporter=dot
```

It printed `Test Files 52 passed | 1 skipped (53)` and `Tests 1022 passed | 8 skipped (1030)`. The opt-in merge suite was skipped in that run, then expanded and run separately above. The four older Git-mutating API suites were outside the granted test exception. The filesystem watcher suite has an existing sandbox-dependent event behavior; the GUI checks below exercised record watching through the actual app.

The hook activity tests ran through a local Vitest compatibility config (the native Claude test executable is unavailable):

```sh
node app/node_modules/vitest/vitest.mjs run --config app/node_modules/.cache/activity-vitest.config.mjs
```

It printed `Test Files 1 passed (1)` and `Tests 5 passed (5)`, including attribution to the correct task when two worktrees are active. This is not a claim that the full native plugin test or validation suite ran.

## GUI verification

```sh
node app/node_modules/@playwright/test/cli.js test \
  --config app/playwright.config.ts branches.e2e.ts activity.e2e.ts \
  --output app/test-results
```

Printed `2 passed (6.9s)`. The app used a temporary HOME and settings; branch history was read-only. The checks covered local Git → main → IPC → graph/review, disabled merging of a pending merge, observed check output, and a record update changing a running check into a failed result.

After inspecting the screenshots and correcting graph-label contrast in the night theme, rerunning the `branches.e2e.ts` case printed `1 passed (3.7s)`. Screenshots are under `app/test-results/branches.e2e.ts-branch-gra-b3631-l-local-history-through-IPC/` (ignored build artifacts).

## Handoff

Review and stage the intended changes before committing the pending merge in Queue-tea. The new GUI is in source and the local build; the production app has not been replaced. After integrating into the production integration branch, build/install from its clean checkout. Feature-branch commits now intentionally skip production installation.

The first upgrade from the restored 1.5.2 bundle requires adopting its known source commit because that bundle predates provenance: `QUEUE_TEA_ADOPT_INSTALLED_COMMIT=7bbbd01789b87b2b57685fffeeaa59457c552ba4` for the installation. Future upgrades use the recorded provenance automatically and retain the previous application for recovery.

Known boundaries: Codex observation is passive and may not cover unsupported tools or sessions older than 14 days. Checks are shown as observed evidence, not certified against the prepared merge. Use Open integration folder to run checks on that result before approving it. Symlink/submodule conflicts require an editor; ordinary text conflicts and whole regular-file side selection are handled in the GUI. No remote service or production installation was exercised by this task's tests.
