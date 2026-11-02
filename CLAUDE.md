# Repository Rules

Queue-tea keeps one task in progress per project and the rest in a priority queue. The repository holds every part of it, one folder per part:

| Folder                      | What it is                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hooks/register.tsx`        | The plugin's entry: the hooks, tools and commands                                                                                                                  |
| `hooks/app/`                | What puts the features together: the menu frame, the band's host, the session's rhythm                                                                             |
| `hooks/core/`               | Used everywhere: files and processes, the engine as one object, the view state, the logger, widgets                                                                |
| `hooks/shared/`             | What two or more features use: records, backlog, git, assistant, checkpoints, effort, time, sessions                                                               |
| `hooks/features/`           | One folder per feature, each with `data/`, `domain/` and `presentation/`. `docs/architecture.md` has the rules                                                     |
| `agents/`                   | The four helpers: Commit Chai-n, Mocha Mockup, Chai-pter, Tea-DD                                                                                                   |
| `tools/`                    | `check_layers.mjs`, which reads every import under `hooks/` and fails on a broken layer rule                                                                       |
| `tests/`                    | The mod's tests, `*.test.ts(x)`, run with `claude plugin test .` from the repository root                                                                          |
| `types/`, `.claude-plugin/` | The plugin's types, manifest, icon, helper logos and marketplace entry                                                                                             |
| `app/`                      | The workspace app, being built: Electron and Preact, specified in `docs/workspace-app.md` and designed in `docs/workspace-app-design.md`                           |
| `docs/`                     | The spec, plans, the app's spec and design, and the task log                                                                                                       |

- **Each part lives in its own folder.** The mod is the repository root: its code in `hooks/`, feature-first with three layers per feature, helpers in `agents/`, tests in `tests/`. The workspace app goes in `app/` and is its own project with its own dependencies, build, tests (`*.spec.ts(x)`, Vitest) and docs, and its commands run from inside `app/`. Engine modules the app imports import nothing from Claude Code.
- **Every view that waits for something shows where it is.** A screen, section, card, menu or band that loads, reads, scans, checks git or saves shows one of these states, and never a blank, frozen or silent screen:
  - **Loading:** a circular progress indicator and a line saying what is happening ("Reading your queue…").
  - **Partly loaded:** what has arrived so far, with the progress indicator or a "still reading" line kept beside it until the work ends.
  - **Done:** the result. **Done but empty:** say that nothing was found and what to try next.
  - **Failed:** what went wrong and how to put it right, in plain words, with a way to try again. Show it where the work was happening, or in a dialog when the user started a one-off action such as saving or starting a task. Never show an exception's text to the user; log it instead.
- **Diagrams explain; they do not quote code.** A diagram says in plain words what happens and who does it ("the quest board", "the record", "Claude Code", "saved on disk"). Class, function, hook, route, field and file names, parameters and code expressions stay out of it. When a developer needs them, name them in the text or a table next to the diagram.

## Writing code

- **The architecture fits the size of the part, and its layers stay apart.** What the user sees (the app's screens, the mod's menus and band) never reaches files, git or a process itself; it asks the layer below. In the app the window asks main through the engine API; in the mod a view asks its feature's controller, which runs a use case. Business rules (the queue, ranking, families, time, effort, the game rules) are plain code that knows nothing of screens or Claude Code. Dependencies point inwards.
- **Every call that can fail runs in a try/catch.** Files, the record's lock, git, processes, IPC and JSON parsing: the code that makes the call catches every exception, logs it with its stack trace, and passes on an error with a message written for the user. The screen shows the failed state. The app's main process and window also catch whatever slips through and log it, so nothing fails silently. A `catch` that drops an error says in a comment why that is safe.
- **One base file turns an engine API reply into data or an error.** It lives in the app's window code, and every call goes through it; a screen never reads a raw error. When HTTP sits behind the API later, the same file gives each status a plain message: 400 bad request, 401 not signed in, 403 not allowed, 404 not found, 408 or a timeout, 409 conflict, 413 too large, 422 rejected input, 429 too many requests, 500, 502, 503 and 504 server trouble, any other 4xx or 5xx, and no connection.
- **Three flavors of the app: dev, stage and prod.** Dev is for building and debugging, stage for trying a release build, prod for daily use. Each flavor has its own app id and settings, so they install side by side.
- **Log generously in dev, and only warnings and errors elsewhere.** Log through one logger, never `console.log`. In dev add a line wherever it would help debug a failure later: each record read and written, file-watch event, git command and its result, session found or lost, request added or handled, terminal opened, and every caught error with its stack trace. Stage and prod write warnings and errors only; the flavor sets this once at start-up. Per-frame code (animations, the sky) never logs.
- **Text and fixed values live in constants files.** Text the user reads is never typed into a component: it goes in the part's localisation file, so the app can be translated. Paths, keys, durations and limits go in a constants file. In the mod, text moves there when its file is next changed.
- **Every route is declared in one file in the app.** A path is lowercase words naming the screen, nested under the screen it opens from (`/quests/saga`), never an id or an abbreviation.
- **A feature is done when its validation and tests are.** Once a feature is built, write the checks on its input and its tests (unit tests for the rules, component tests for what the user sees) before calling it finished, and run them: `claude plugin test .`, `npx -y -p typescript@5.9 tsc -p .`, `claude plugin validate .` and `node tools/check_layers.mjs` for the mod; `npm test`, `npm run typecheck` and `npm run e2e` in `app/` for the app.
- **A replacement removes what it replaces.** Once the new implementation is confirmed working, delete the old one, its tests and any dependency nothing uses any more. Two ways of doing one thing never stay side by side.

## Forms

Every form validates each field and shows its error under it.

- **Validate when a field loses focus,** so errors appear while the form is being filled in, not only on submit.
- **On submit, validate every field,** mark them all as touched and block the submission while any error remains. The submit button stays enabled; pressing it shows the errors.
- **Errors appear inline,** directly under the field. A banner at the top is only for errors from the engine API or the network.
- **A message says what is wrong and how to fix it,** in the field's own words: "Enter a task title", never "Invalid input".
- **Required fields** have `*` in the label. The error is "[Field name] is required."
- **When a form asks for them:** an email is checked with a regular expression ("Enter a valid email address."); a phone number needs a 3-digit area code and a number that is not empty ("Enter a valid phone number."); an upload takes images or PDF only, at most 10 MB ("Only image or PDF files are accepted." and "File must be under 10 MB.").
- **Conditional fields:** a field that becomes required because of another answer is validated too.
- **Input outside a form is checked the same way.** A setting, a path typed into a dialog or a value read from another screen is validated before it is used, with the error shown beside it.

## Visual artifacts

- **Every visual artifact goes through the `artifact-design` skill first.** A colour palette, UI mockup, design reference or layout preview made with the Artifact tool starts with `Skill("artifact-design")`, before the design is sketched and before any code, even when it looks simple. The skill sets how much design the artifact needs and keeps palette, type and layout decisions the same across the project, so no part looks designed with care while another looks dashed off.
