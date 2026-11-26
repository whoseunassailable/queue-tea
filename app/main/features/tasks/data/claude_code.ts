import type { Host } from '../../../../../hooks/core/host/host'
import type { SessionFile } from '../../../../../hooks/shared/sessions/domain/entities/session_file'
import type { Handover, TerminalChoice } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { bringForwardArgv, claudeLine, codexLine, codexPasteLine, FORWARD_MISSING, openLineArgv, terminalOfProgram } from '../../../core/platform/mac'

export type ClaudeDeps = { host: Host; home: string; terminal: () => Promise<TerminalChoice>; copy: (text: string) => void; log: Logger; prepareCodex?: (path: string) => Promise<string[]> }

const CLAUDE = 'claude'

const briefFile = (home: string, taskId: string) => `${home}/.queue-tea/briefs/${taskId}.md`

// Where an open session's terminal is, as far as its file says: its tty, and
// the terminal app it runs in, or null to try the chosen one.
export type OpenSession = { tty: string | null; terminal: TerminalChoice | null }

// A file from an older mod says nothing of its terminal: the tab is then found
// by its title, in the chosen terminal.
export const openSessionOf = (file: SessionFile): OpenSession => ({ tty: file.terminal?.tty ?? null, terminal: terminalOfProgram(file.terminal?.program ?? null) })

// Opens the chosen terminal on the line, or with a session open only brings
// that session's terminal forward. It never throws: the quest is safe either
// way, and failed gives the screen the line to copy. VS Code can't be told to
// run a line, so it is copied to paste.
const launch = async (d: ClaudeDeps, path: string, line: string, session: OpenSession | null, pasted: string): Promise<Handover> => {
  const terminal = session?.terminal ?? (await d.terminal())
  const failed: Handover = { kind: 'failed', terminal, command: line }
  try {
    // From home: osascript has no need of the project, whose folder may be gone.
    const ran = await d.host.run(session === null ? openLineArgv(terminal, path, line) : bringForwardArgv(terminal, path, session.tty), d.home)
    if (ran.exitCode !== 0) {
      d.log.warn(`opening ${terminal} failed: ${ran.stderr}`)

      return failed
    }
    if (session !== null && ran.stdout.trim() === FORWARD_MISSING) {
      d.log.warn(`no ${terminal} tab holds the session in ${path}`)

      return { kind: 'notFound', terminal }
    }
    if (terminal === 'vscode' && session === null) d.copy(pasted)
    d.log.debug(session === null ? `opened ${terminal} in ${path}` : `brought ${terminal} forward for ${path}`)

    return { kind: 'opened', terminal }
  } catch (err) {
    d.log.error(`opening ${terminal} failed`, err)

    return failed
  }
}

// A session already here only comes forward, because Open in Claude Code must
// not start a second one: null opens a new one, a session brings its own tab.
export const openClaudeCode = (d: ClaudeDeps, path: string, session: OpenSession | null): Promise<Handover> =>
  launch(d, path, claudeLine(path), session, CLAUDE)

// Codex writes no session file, so its tab is found by its title in the chosen
// terminal.
const CODEX_TAB: OpenSession = { tty: null, terminal: null }

// Only brings the existing terminal forward. If that fails, recovery stays
// with Codex and carries the brief without relying on a file still existing.
export const focusCodex = async (d: ClaudeDeps, path: string, brief: string): Promise<Handover> => {
  const line = codexPasteLine(path, brief)
  const focused = await launch(d, path, line, CODEX_TAB, line)
  if (focused.kind === 'opened' || focused.kind === 'session') return focused

  // An existing session needs no setup and cannot take new configuration.
  // Only a failed focus, or a tab that isn't there, needs a command that can
  // start a replacement session.
  const args = await d.prepareCodex?.(path) ?? []

  return { kind: 'failed', terminal: focused.terminal, command: codexPasteLine(path, brief, args) }
}

// Codex gets the brief as its first prompt, written to a file first. A brief
// that can't be written fails like a terminal that can't open.
export const openCodex = async (d: ClaudeDeps, path: string, taskId: string, brief: string): Promise<Handover> => {
  const file = briefFile(d.home, taskId)
  // Preparation failure reaches the API's normal error path. Do not silently
  // open an unconfigured session and claim the integration is available.
  const args = await d.prepareCodex?.(path) ?? []
  const line = codexLine(path, file, args)
  try {
    const made = await d.host.makeDirs(`${d.home}/.queue-tea/briefs`)
    if (made.exitCode !== 0) throw new Error(made.stderr)
    await d.host.write(file, brief)
  } catch (err) {
    d.log.error('writing the Codex brief failed', err)

    return { kind: 'failed', terminal: await d.terminal(), command: codexPasteLine(path, brief, args) }
  }

  return launch(d, path, line, null, line)
}
