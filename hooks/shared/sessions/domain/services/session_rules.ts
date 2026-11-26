import type { SessionFile, SessionTerminal } from '../entities/session_file'

export const HEARTBEAT_MS = 30_000
export const STALE_MS = 90_000

export const sessionsFolder = (home: string): string => `${home}/.queue-tea/sessions`
export const sessionPath = (home: string, id: string): string => `${sessionsFolder(home)}/${id}.json`

export const isFresh = (session: SessionFile, nowMs: number): boolean => nowMs - session.heartbeat <= STALE_MS

export const UNKNOWN_TERMINAL: SessionTerminal = { program: null, tty: null }

// A terminal app's name for itself, such as Apple_Terminal or iTerm.app.
const PROGRAM = /^[A-Za-z0-9._ -]{1,40}$/
// A tty as ps prints it, with or without /dev/: ttys004 on a Mac, pts/3 on Linux.
// A session with no terminal gets ?? there, which is none.
const TTY = /^(?:\/dev\/)?(tty[A-Za-z0-9]{1,12}|pts\/\d{1,6})$/

const programOf = (text: string | undefined): string | null => {
  const program = text?.trim() ?? ''

  return PROGRAM.test(program) ? program : null
}

const ttyOf = (text: string | undefined): string | null => {
  const found = TTY.exec(text?.trim() ?? '')

  return found === null ? null : `/dev/${found[1]}`
}

// The terminal from what the shell printed: its program on the first line,
// the tty on the second. Anything else reads as unknown.
export const terminalOf = (output: string): SessionTerminal => {
  const [program, tty] = output.split('\n')

  return { program: programOf(program), tty: ttyOf(tty) }
}

// The terminal a session file holds, or undefined when it holds none that
// reads, so a broken field only loses the terminal.
const terminalIn = (value: unknown): SessionTerminal | undefined => {
  if (typeof value !== 'object' || value === null) return undefined
  const { program, tty } = value as Record<string, unknown>
  if ((program !== null && typeof program !== 'string') || (tty !== null && typeof tty !== 'string')) return undefined

  return { program: program === null ? null : programOf(program), tty: tty === null ? null : ttyOf(tty) }
}

// The session a file holds, or null when it isn't one.
export const parseSession = (text: string): SessionFile | null => {
  try {
    const parsed = JSON.parse(text) as Partial<SessionFile> | null
    const isWhole = typeof parsed?.id === 'string' && typeof parsed.projectPath === 'string' && typeof parsed.heartbeat === 'number'
    if (!isWhole) return null
    const session = { ...parsed } as SessionFile
    delete session.terminal
    const terminal = terminalIn(parsed.terminal)

    return terminal === undefined ? session : { ...session, terminal }
  } catch {
    // Not JSON: it is no session, the same as a file with the wrong shape.
    return null
  }
}
