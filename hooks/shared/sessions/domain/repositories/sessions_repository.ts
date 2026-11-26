import type { SessionFile, SessionTerminal } from '../entities/session_file'

export type SessionsRepository = {
  write: (session: SessionFile) => Promise<void>
  remove: (id: string) => Promise<void>
  list: () => Promise<SessionFile[]>
  // The terminal this session runs in. Throws when it can't be read.
  terminal: () => Promise<SessionTerminal>
}
