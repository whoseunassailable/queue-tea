import type { SessionFile } from '../entities/session_file'

export type SessionsRepository = {
  write: (session: SessionFile) => Promise<void>
  remove: (id: string) => Promise<void>
  list: () => Promise<SessionFile[]>
}
