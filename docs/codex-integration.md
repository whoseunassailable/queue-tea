# Queue-tea in Codex

Queue-tea provides Codex skills and a local stdio MCP server. They use the same task records, record lock, backup and atomic writes as the Claude mod and workspace app. The server belongs to one working folder; it identifies the repository through Git’s common directory and selects only the current task in that folder. It never commits, starts a task, switches branches or finishes a task.

## Start from Queue-tea

A build containing this integration prepares it when **Start in Codex** or **Continue in Codex** opens a session:

1. Generate the twelve Queue-tea skills under `~/.agents/skills/queue-tea-<name>/`.
2. Link available companion skills from the local Claude installation, keeping their supporting files with them.
3. Pass `mcp_servers.queue-tea` command, arguments, working folder and required-startup settings to `codex` with `-c`. The app does not rewrite `~/.codex/config.toml` or a project’s configuration.
4. Open Codex with the existing task brief, `--sandbox workspace-write --ask-for-approval on-request`, and the MCP configuration. The packaged app runs its bundled `Resources/codex/server.cjs` with its own Electron executable in Node mode; no separate Node installation is needed for this server.

For VS Code, the app copies that complete command to paste. If terminal launch or brief-file creation fails, the recovery command retains the MCP configuration. If integration setup itself fails, the normal app error is shown and the underlying error is logged; it does not launch a session without the adapter. Existing sessions brought forward cannot acquire new startup configuration: start a fresh Codex session after setup.

Changes on a feature branch do not update an installed app. Keep the existing release safeguards; activate the feature through the normal reviewed release. For local development, use the standalone setup below. No app installation is needed to test the server.

## Standalone setup for CLI, desktop or IDE

Build from the repository’s `app/` folder with its dependencies installed:

```sh
npm run build
node out/codex/server.cjs setup
```

Setup reports generated skills, linked companions and missing companions. It writes only its own generated skills and new companion links. Generated files have a stored hash: setup refuses to overwrite a file edited since generation, an unrelated folder or a symlink. Move a conflicting skill to a name/location you want to keep before retrying. Companion destinations are preserved, including links to an older plugin version; replace those links deliberately when upgrading the source plugin.

Add the server for the folder you want to work in, using absolute paths:

```sh
codex mcp add queue-tea -- node /absolute/queue-tea/app/out/codex/server.cjs --cwd /absolute/project-or-worktree
codex mcp get queue-tea --json
```

That command writes Codex’s MCP configuration. A desktop or IDE client can use the same local configuration, or its MCP settings UI with command `node` and the same arguments. Restart the client/session, inspect `/mcp`, and select the skills through `/skills` or `$`. The configured working folder is fixed: change it when moving to another worktree, or use the app’s per-session launch configuration. A global server entry is not automatically rebound to every session’s current folder.

For isolated tests or an alternative installation directory, setup accepts `--skills-dir /absolute/directory` and `--home /absolute/home`. Server mode accepts `--cwd /absolute/directory` and `--home /absolute/home`. Neither option is a model-callable tool parameter. The normal defaults are the process working directory and the OS home directory.

## Commands and tools

Codex skills use `$skill-name` or the skill picker. **This adapter does not register native bare `/brew`, `/instant`, `/tea`, `/steep`, `/done`, `/feature` or `/queue-tea` commands in Codex.** Slash wording can be understood as an alias if the host delivers it to the model; a host may intercept it first. Use the supported skill form below.

| Claude command | Codex invocation | MCP operation and behavior |
| --- | --- | --- |
| `/brew <request>` | `$brew <request>` | `brew`: returns the shared errand instructions. Codex performs the work in the same conversation and branch, without a task-record mutation |
| `/instant <request>` | `$instant <request>` | `instant`: the same workflow as brew |
| `/tea <question>` | `$tea <question>` | `tea`: instructions to answer using reads only, without editing files or task records |
| `/steep <message>` | `$steep <message>` | `steep`: validates and queues the message. Accepts an optional title and explicitly chosen parent ID; does not start it |
| `/done` | `$done` | `done`: requests review of the supplied current task ID; leaves completion to Rohan |
| `/feature [title or off]` | `$feature [title or off]` | `feature`: reads, sets or clears the active feature, using the shared matching rules |
| `/queue-tea` | `$queue-tea` | `queue_tea`: reads a text view of the task in this folder, active feature and priority queue |

`task_looks_done` is also available for Codex to request review after completing work. Like `done`, it takes `taskId` from `queue_tea` and an optional `checked` summary of at most 300 characters. The enabled testing/git helper is reminded once; after that, an unavailable helper is noted in the review. A request with a stale ID or a task belonging to another worktree fails under the record lock. No completion operation is exposed.

`helper_instructions` returns the selected helper’s shared instructions and companion skill names; it neither starts a model nor records a helper run. `helper_finished` records the helper only after its work is completed, with the same current-task check under the lock. Errands must not call it. The server cannot verify a model’s claims about checks or helper work, so reports must name actual commands and results.

## Helpers and companion skills

Use `$chai-pter`, `$commit-chai-n`, `$mocha-mockup` and `$tea-dd`. Their skills are generated from `agents/*.md`; Tea-concile comes from `skills/tea-concile/SKILL.md`. There is no second maintained set of personas. A helper runs in the current Codex conversation, or through delegation when that session supports and authorizes it. The Guild Hall’s existing background **Send** flow still launches Claude Code.

There are **eight external companion skills**, in addition to the bundled Tea-concile:

| Installed Claude plugin | Skills linked for Codex when present |
| --- | --- |
| `agent-skills` | `git-workflow-and-versioning`, `documentation-and-adrs`, `spec-driven-development`, `api-and-interface-design`, `frontend-ui-engineering`, `test-driven-development` |
| `frontend-design` | `frontend-design` |
| `superpowers` | `verification-before-completion` |

Setup consults `~/.claude/plugins/installed_plugins.json` and the corresponding plugin’s `skills/<name>/` folder, with `~/.claude/skills/<name>/` as a fallback. It creates symlinks under `~/.agents/skills/queue-tea-companion-<plugin>-<name>`. It does not download plugins, copy third-party content into this repository, or claim missing dependencies are installed. Skill names are read from the source `SKILL.md`; Claude plugin namespaces are not Codex tool names. If the same skill is already installed elsewhere in Codex, duplicate entries can appear in its picker.

The helper instructions require Codex to load available companions, report missing ones, and use the self-contained helper procedure when a companion is absent. Third-party instructions can still mention Claude-specific tools; use the Codex equivalent and report unsupported capabilities. Chai-pter’s optional local `write-like-a-human` reference files remain optional and are not installed by this adapter.

## Boundaries

- Claude’s animated band, interactive menu, prompt interception, automatic clear/handoff and per-tool git guard are not ported by this adapter. Codex uses skills, MCP, its own sandbox and approval policy. Its shell commands do not pass through Queue-tea’s Claude guard.
- `tea` and errand behavior are model instructions, not a sandbox change. The MCP tools themselves do not execute the requested errand or expose shell execution.
- The adapter does not attach hooks to arbitrary turns or capture their usage/check results. The app’s existing native Codex activity reader remains separate.
- MCP tool approval is controlled by the Codex client. This integration does not grant blanket approval, disable approvals or broaden the shell sandbox.
- Local stdio requires access to the same machine, working folder and task records. This does not provide a hosted ChatGPT connector or remote cloud deployment.
- A corrupt task record returns an error and remains untouched; restore it through Queue-tea. Server diagnostics go to stderr, leaving stdout for MCP messages.

## Verification

From `app/`:

```sh
npm run typecheck
npm test
npm run build
npm run test:codex
npm run e2e
```

The MCP unit tests use a real SDK client over in-memory transport and temporary records, covering validation, worktree isolation, stale IDs, review/helper state, corrupt records and concurrent writes. `test:codex` uses the built server through a real SDK stdio client, checks persistence across two server processes, and exercises skill setup in a temporary directory. Run it with `QUEUE_TEA_CODEX_RUNTIME=/absolute/path/to/Electron` to test the same bundle with Electron in Node mode. No model request is made by these tests.

The setup tests cover idempotence, edited-file preservation, symlink refusal, companion resources and existing-destination preservation. App launch tests verify that setup precedes launch and that failure/recovery retains the configuration. The mod’s checks remain `claude plugin test .`, `claude plugin validate .`, TypeScript checking, `node tools/check_layers.mjs` and `node --test 'tools/*.test.mjs'` at the repository root.

Supported extension points were checked against the installed `codex-cli 0.166.0` help and official OpenAI documentation: [skills and local discovery](https://learn.chatgpt.com/docs/build-skills), [local MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), and [plugin packaging](https://developers.openai.com/plugins/build/plugins). This implementation uses local skills and MCP directly, not a published Codex plugin.
