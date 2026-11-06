import type { Host } from '../../../../../hooks/core/host/host'
import type { Handover, TerminalChoice } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { bringForwardArgv, claudeLine, codexLine, codexPasteLine, openLineArgv } from '../../../core/platform/mac'

export type ClaudeDeps = { host: Host; home: string; terminal: () => Promise<TerminalChoice>; copy: (text: string) => void; log: Logger; prepareCodex?: (path: string) => Promise<string[]> }

const CLAUDE = 'claude'

const briefFile = (home: string, taskId: string) => `${home}/.queue-tea/briefs/${taskId}.md`

// Opens the chosen terminal on the line, or only brings it forward. It never
// throws: the quest is safe either way, and failed gives the screen the line
// to copy. VS Code can't be told to run a line, so it is copied to paste.
const launch = async (d: ClaudeDeps, path: string, line: string, isForwardOnly: boolean, pasted: string): Promise<Handover> => {
  const terminal = await d.terminal()
  const failed: Handover = { kind: 'failed', terminal, command: line }
  try {
    // From home: osascript has no need of the project, whose folder may be gone.
    const ran = await d.host.run(isForwardOnly ? bringForwardArgv(terminal, path) : openLineArgv(terminal, path, line), d.home)
    if (ran.exitCode !== 0) {
      d.log.warn(`opening ${terminal} failed: ${ran.stderr}`)

      return failed
    }
    if (terminal === 'vscode' && !isForwardOnly) d.copy(pasted)

    return { kind: 'opened', terminal }
  } catch (err) {
    d.log.error(`opening ${terminal} failed`, err)

    return failed
  }
}

// A session already here only comes forward, because Open in Claude Code must
// not start a second one.
export const openClaudeCode = (d: ClaudeDeps, path: string, isSessionOpen: boolean): Promise<Handover> =>
  launch(d, path, claudeLine(path), isSessionOpen, CLAUDE)

// Only brings the existing terminal forward. If that fails, recovery stays
// with Codex and carries the brief without relying on a file still existing.
export const focusCodex = async (d: ClaudeDeps, path: string, brief: string): Promise<Handover> => {
  const line = codexPasteLine(path, brief)
  const focused = await launch(d, path, line, true, line)
  if (focused.kind !== 'failed') return focused

  // An existing session needs no setup and cannot take new configuration.
  // Only a failed focus needs a command that can start a replacement session.
  const args = await d.prepareCodex?.(path) ?? []

  return { ...focused, command: codexPasteLine(path, brief, args) }
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

  return launch(d, path, line, false, line)
}
