import type { Host } from '../../../../core/host/host'
import type { SessionsRepository } from '../../domain/repositories/sessions_repository'
import { readSessions, removeSessionFile, writeSessionFile } from '../datasources/session_source'

export const sessionsRepositoryImpl = (host: Host, home: string): SessionsRepository => ({
  write: session => writeSessionFile(host, home, session),
  remove: id => removeSessionFile(host, home, id),
  list: () => readSessions(host, home),
})
