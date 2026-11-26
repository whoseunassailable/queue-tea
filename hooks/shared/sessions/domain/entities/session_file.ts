import type { Allowance } from '../../../../../types'
import type { Options } from '../../../../core/env/env'

// The terminal a session runs in, as the shell saw it: the terminal app's own
// name for itself (TERM_PROGRAM) and the session's tty, each null when unknown.
// The app uses them to bring that very tab forward.
export type SessionTerminal = { program: string | null; tty: string | null }

// What a session tells the app about itself, in its own file. A file whose
// heartbeat has gone stale belongs to a session that crashed.
export type SessionFile = {
  id: string
  projectPath: string
  workingPath?: string
  recordFile: string
  currentTaskId: string | null
  isTurnRunning: boolean
  cup: { mood: 'idle' | 'working' | 'attention' | 'done'; line: string }
  allowance: Allowance | null
  // The commit warning, which otherwise lives only in the session. Absent from
  // a file written by an older mod.
  warning?: string | null
  // Where its terminal is. Absent from a file written by an older mod.
  terminal?: SessionTerminal
  options: Options
  heartbeat: number
  startedAt: number
}
