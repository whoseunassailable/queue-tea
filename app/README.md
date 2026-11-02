# Queue-tea, the workspace app

Every project's queue, in a window beside Claude Code. It's Electron with a Preact window, and it runs the mod's own rules over Node. The spec is [docs/workspace-app.md](../docs/workspace-app.md), the design [docs/workspace-app-design.md](../docs/workspace-app-design.md), and the plans [docs/plan-workspace-app.md](../docs/plan-workspace-app.md) and [docs/plan-workspace-app-2.md](../docs/plan-workspace-app-2.md).

Today the window has Home and Quests for every project in `~/.queue-tea`, and every edit: priority, New quest, chapters, Seal…, Part of…, Play next, Remove, Undo, and a quest's title, difficulty, description and criteria. **These edits change your real records**, through the same lock, `.bak` copy and atomic replace as the mod, so a session writing at the same moment can't lose a change.

It also runs a quest from end to end: Start through the git check, onto the quest's branch, and over to Claude Code; Judgement; Finish quest with the task log row and the victory; Back to the board; and sealing the active quest. Start and Finish change your git branches and your task log for real. The app never commits, pushes, merges or pulls: a git command only ever appears as text to copy.

With a session open, the app asks it through the record. With none, it opens a terminal running `claude`. Until the mod's half is merged and running, a session won't act on what the app asks, so the app shows it waiting.

## Run it

Every command runs from this folder.

```sh
npm install
npx --no install-electron    # Electron 45 fetches its binary here, not during install
npm run dev
```

## Check it

```sh
npm test            # unit and component tests, *.spec.ts(x)
npm run typecheck   # also fails if the app reaches anything that imports claude-code
npm run e2e         # builds, then drives the real app on a temporary HOME
```

To look at the skies, set `QUEUE_TEA_SHOTS` to a folder before `npm run e2e`. Set `QUEUE_TEA_REAL_COPY` to a folder of record copies to see those too.

## Flavors

`QUEUE_TEA_FLAVOR` is `dev`, `stage` or `prod`. An unpackaged app is `dev` and a packaged one `prod`. Each has its own app id, settings and log folder, and only `dev` logs anything below a warning.
