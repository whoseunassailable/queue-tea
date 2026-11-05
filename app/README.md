# Queue-tea, the workspace app

Every project's queue, in a window beside Claude Code. It's Electron with a Preact window, and it runs the mod's own rules over Node. The spec is [docs/workspace-app.md](../docs/workspace-app.md), the design [docs/workspace-app-design.md](../docs/workspace-app-design.md), and the plans [docs/plan-workspace-app.md](../docs/plan-workspace-app.md) and [docs/plan-workspace-app-2.md](../docs/plan-workspace-app-2.md).

Today the window has every screen: Home, Quests, Chronicle, Mana & time, the Hoard, the Guild Hall, the Library and Settings, for every project in `~/.queue-tea`, with first run, the failed record, the ⌘K palette, the menu bar and the narrow window. It has every edit: priority, New quest, chapters, Seal…, Part of…, Play next, Remove, Undo, and a quest's title, difficulty, description and criteria. **These edits change your real records**, through the same lock, `.bak` copy and atomic replace as the mod, so a session writing at the same moment can't lose a change.

It also runs a quest from end to end: Start through the git check, onto the quest's branch, and over to Claude Code; Judgement; Finish quest with the task log row and the victory; Back to the board; and sealing the active quest. Start and Finish change your git branches and your task log for real. The app never commits, pushes, merges or pulls: a git command only ever appears as text to copy.

Open a quest's details for **Task activity**: timestamped branch creation and switching, file reads and edits, commands, and check results. A connected Claude Code session records each supported tool call when it starts and when it returns; command output expands beneath it. Activity follows record changes automatically, and the active pane also refreshes Git every 30 seconds. **Refresh activity** retries a failed read while keeping the last result visible.

The feed keeps the latest 200 steps, with up to 8,000 characters of command output per step, and 20 commits since the task's starting commit. Older records can show their saved command summaries. Commit messages and containing remote branches come from local Git history; a branch such as `origin/main` is labelled as local tracking data, not live verification of a push. Other terminals and agents without the Queue-tea hook do not stream their commands here. A step with no completion result stays marked **Awaiting result**, including when its session has stopped.

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

Quit the app first. The build is signed ad hoc, so the first time macOS may ask you to confirm opening it. `npm run package` only builds, into `dist/`, and `npm run package:stage` builds a stage app that installs beside it. Install command line tool… in the app's menu then gives you `queue-tea open [path]`.

You rarely need to run this by hand: after every commit `tools/refresh_app.sh` does it in the background. It tells you with a notification when the new version is in, or asks you to quit the app first if it's open, and what it did is in `~/Library/Logs/Queue-tea/refresh.log`. About Queue-tea in the app's menu shows which version you have.

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
