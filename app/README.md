# Queue-tea, the workspace app

Every project's queue, in a window beside Claude Code. It's Electron with a Preact window, and it runs the mod's own rules over Node. The spec is [docs/workspace-app.md](../docs/workspace-app.md), the design [docs/workspace-app-design.md](../docs/workspace-app-design.md), and the plans [docs/plan-workspace-app.md](../docs/plan-workspace-app.md) and [docs/plan-workspace-app-2.md](../docs/plan-workspace-app-2.md).

Today the window has every screen: Home, Quests, Branches, Chronicle, Mana & time, the Hoard, the Guild Hall, the Library and Settings, for every project in `~/.queue-tea`, with first run, the failed record, the ⌘K palette, the menu bar and the narrow window. It has every edit: priority, New quest, chapters, Seal…, Part of…, Play next, Remove, Undo, and a quest's title, difficulty, description and criteria. **These edits change your real records**, through the same lock, `.bak` copy and atomic replace as the mod, so a session writing at the same moment can't lose a change.

It also runs a quest from end to end: Start through the git check, onto the quest's branch, and over to Claude Code; Judgement; Finish quest with the task log row and the victory; Back to the board; and sealing the active quest. Start creates a branch in its own checkout; Finish updates the task record and log. From Branches, you can review pending files, approve a selected-file commit, resolve a prepared merge, run its checks, approve integration, and separately approve a push. The general agent interface still refuses commits, merges, pushes and pulls.

Open a quest's details for **Task activity**: timestamped branch creation and switching, file reads and edits, commands, and check results. A connected Claude Code session records tool calls when they start and return. The local Codex adapter reads native command, file-change and background-result events, including commands nested in exec batches and resumed older sessions. Activity follows record changes automatically; Codex panes refresh every second and read appended log bytes incrementally. **Refresh activity** retries a failed read while keeping the last result visible.

The feed keeps the latest 200 steps, with up to 8,000 characters of command output per step, and 20 commits since the task's starting commit. Older records can show their saved command summaries. Commit messages and containing remote branches come from local Git history; a branch such as `origin/main` is labelled as local tracking data, not live verification of a push. Arbitrary external terminals are outside the activity feed. Git operations and checks started from Queue-tea stream output before they finish; agent output updates when its session records new events. A step with no completion result stays marked **Awaiting result**, including when its session has stopped.

A realm can name its GitHub account, from the HUD, Settings, or when it's added. The accounts are the ones `gh` knows, and adding one runs `gh`'s own sign-in: the app holds no tokens, and it needs `brew install gh`. Connecting names the account for you to see; it doesn't change how git pushes. The Library keeps your books in `~/.queue-tea/library.json`, apart from every project.

With a session open, the app asks it through the record. With none, it opens a terminal running `claude`. Until the mod's half is merged and running, a session won't act on what the app asks, so the app shows it waiting.

## Run it

Every command runs from this folder.

```sh
npm install
npx --no install-electron    # Electron 45 fetches its binary here, not during install
npm run dev
```

## Install it

```sh
npm run install-app   # builds, then copies Queue-tea.app to /Applications
```

The app can stay open. The build is signed ad hoc, so the first time macOS may ask you to confirm opening it. `npm run package` only builds, into `dist/`, and `npm run package:stage` builds a stage app that installs beside it. Install command line tool… in the app's menu then gives you `queue-tea open [path]`.

Build/install from a clean integration-branch checkout after integrating the work. A configured post-commit hook can request `tools/refresh_app.sh` there; feature, detached and dirty checkouts skip production installation. It tells you with a notification when the new version is in, and what it did is in `~/Library/Logs/Queue-tea/refresh.log`. An open app moves to the new version by itself: it waits until you're in another app with no dialog open, no text field in use and nothing being saved, then restarts behind what you're using, on the same screen and in the same place. A new major version (2.0.0, 3.0.0) asks first if you're using the window, with Restart now and Later. Sessions in Terminal keep running through a restart. About Queue-tea in the app's menu shows which version you have.

## Check it

```sh
npm test            # unit and component tests, *.spec.ts(x)
npm run typecheck   # also fails if the app reaches anything that imports claude-code
npm run e2e         # builds, then drives the real app on a temporary HOME
npm run e2e:packaged  # the same, on the built apps themselves
```

Keep the Mac awake for the end-to-end run, with `caffeinate -dimsu npm run e2e`: a sleeping display stops the window painting, and the failures look like the app's.

To look at the skies, set `QUEUE_TEA_SHOTS` to a folder before `npm run e2e`. Set `QUEUE_TEA_REAL_COPY` to a folder of record copies to see those too.

## Flavors

`QUEUE_TEA_FLAVOR` is `dev`, `stage` or `prod`. An unpackaged app is `dev` and a packaged one `prod`. Each has its own app id, settings and log folder, and only `dev` logs anything below a warning.


### Branch review and merge

Branches shows actual local commit ancestry and observed task activity. Open **Review work** to inspect changes, commit selected files, prepare an isolated merge, resolve text conflicts, and explicitly approve applying the result. Configured npm test, typecheck, lint, validate and build scripts can run against the prepared result, with live output and cancellation. Results record the prepared Git tree; failed, cancelled or stale checks block merging until a passing retry. Compatible installed dependencies are reused in the isolated folder without installing software. Publishing has its own remote check and Push button. No remote access happens while browsing or merging locally. Completed operations and command output are retained in `~/.queue-tea/integrations/` for restart recovery.

The branch workflow integration tests are opt-in because they create disposable commits, merges, and a local-only push: `QUEUE_TEA_GIT_TESTS=1 npm test -- main/features/branches/api/branch_integration.spec.ts`. Ordinary test runs skip that suite. The read-only branch UI test inspects local history. `branch_workflow.e2e.ts` drives the complete start → observed work → commit → checks → merge → push flow in disposable repositories with a local bare remote.

Production updates require a clean integration-branch build with source provenance containing the installed app's history. Feature commits no longer replace `/Applications/Queue-tea.app`. Installations retain the prior bundle for recovery. See [the workflow design](../docs/branch-workflow.md) for legacy-app adoption and limitations.
