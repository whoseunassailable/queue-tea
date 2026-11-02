# Queue-tea, the workspace app

Every project's queue, in a window beside Claude Code. It's Electron with a Preact window, and it runs the mod's own rules over Node. The spec is [docs/workspace-app.md](../docs/workspace-app.md), the design [docs/workspace-app-design.md](../docs/workspace-app-design.md) and the plan so far [docs/plan-workspace-app.md](../docs/plan-workspace-app.md).

Today the window is read-only: Home and Quests, for every project in `~/.queue-tea`. It writes nothing there except the empty `sessions` folder, if that's missing.

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
