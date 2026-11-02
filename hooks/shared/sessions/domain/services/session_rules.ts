import type { SessionFile } from '../entities/session_file'

export const HEARTBEAT_MS = 30_000
export const STALE_MS = 90_000

export const sessionsFolder = (home: string): string => `${home}/.queue-tea/sessions`
export const sessionPath = (home: string, id: string): string => `${sessionsFolder(home)}/${id}.json`

export const isFresh = (session: SessionFile, nowMs: number): boolean => nowMs - session.heartbeat <= STALE_MS

// The session a file holds, or null when it isn't one.
export const parseSession = (text: string): SessionFile | null => {
  try {
    const parsed = JSON.parse(text) as Partial<SessionFile> | null
    const isWhole = typeof parsed?.id === 'string' && typeof parsed.projectPath === 'string' && typeof parsed.heartbeat === 'number'

    return isWhole ? (parsed as SessionFile) : null
  } catch {
    // Not JSON: it is no session, the same as a file with the wrong shape.
    return null
  }
}
