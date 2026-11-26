import type { Host } from '../../../../core/host/host'
import type { SessionFile, SessionTerminal } from '../../domain/entities/session_file'
import { parseSession, sessionPath, sessionsFolder, terminalOf } from '../../domain/services/session_rules'

// The terminal app's name for itself, then the tty of the process that ran
// this shell: Claude Code, whose tty a tab keeps whatever its title becomes.
export const TERMINAL_LINE = 'printf "%s\\n" "$TERM_PROGRAM"; ps -o tty= -p "$PPID"'

// Through a temp file, so the app never reads half a session.
export const writeSessionFile = async (host: Host, home: string, session: SessionFile): Promise<void> => {
  const file = sessionPath(home, session.id)
  const tmp = `${file}.tmp`
  await host.write(tmp, JSON.stringify(session, null, 2))
  const moved = await host.move(tmp, file)
  if (moved.exitCode !== 0) throw new Error(`mv of the session file failed: ${moved.stderr}`)
}

export const removeSessionFile = async (host: Host, home: string, id: string): Promise<void> => {
  const removed = await host.remove(sessionPath(home, id))
  if (removed.exitCode !== 0) throw new Error(`rm of the session file failed: ${removed.stderr}`)
}

// Every session file that reads, fresh or not. One the session removed since
// the folder was listed is skipped: it has ended, which is what it would say.
export const readSessions = async (host: Host, home: string): Promise<SessionFile[]> => {
  const folder = sessionsFolder(home)
  const sessions: SessionFile[] = []
  for (const name of (await host.list(folder)).filter(n => n.endsWith('.json')).sort()) {
    try {
      const session = parseSession(await host.read(`${folder}/${name}`))
      if (session !== null) sessions.push(session)
    } catch {
      continue
    }
  }

  return sessions
}

// Where this session's terminal is. A shell that fails throws, like any other
// data source; the caller decides that unknown will do.
export const readTerminal = async (host: Host): Promise<SessionTerminal> => {
  const ran = await host.run(['sh', '-c', TERMINAL_LINE])
  if (ran.exitCode !== 0) throw new Error(`reading the terminal failed: ${ran.stderr}`)

  return terminalOf(ran.stdout)
}
