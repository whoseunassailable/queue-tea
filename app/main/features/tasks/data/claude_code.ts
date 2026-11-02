import type { Host } from '../../../../../hooks/core/host/host'
import type { Handover, TerminalChoice } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { bringForwardArgv, claudeLine, openClaudeArgv } from '../../../core/platform/mac'

export type ClaudeDeps = { host: Host; home: string; terminal: () => Promise<TerminalChoice>; copy: (text: string) => void; log: Logger }

const CLAUDE = 'claude'

// Opens the chosen terminal. A session already here only brings it forward,
// because Open in Claude Code must not start a second one. It never throws: the
// quest is safe either way, and failed gives the screen the line to copy.
export const openClaudeCode = async (d: ClaudeDeps, path: string, isSessionOpen: boolean): Promise<Handover> => {
  const terminal = await d.terminal()
  const failed: Handover = { kind: 'failed', terminal, command: claudeLine(path) }
  try {
    // From home: osascript has no need of the project, whose folder may be gone.
    const ran = await d.host.run(isSessionOpen ? bringForwardArgv(terminal, path) : openClaudeArgv(terminal, path), d.home)
    if (ran.exitCode !== 0) {
      d.log.warn(`opening ${terminal} failed: ${ran.stderr}`)

      return failed
    }
    if (terminal === 'vscode' && !isSessionOpen) d.copy(CLAUDE)

    return { kind: 'opened', terminal }
  } catch (err) {
    d.log.error(`opening ${terminal} failed`, err)

    return failed
  }
}
