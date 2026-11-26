import type { SessionTerminal } from '../../shared/sessions/domain/entities/session_file'
import type { Ctx } from '../env/env'
import { readOptions } from './options'

// The session's own: where it works, its options, whether a turn runs, and
// what the app is told. A reload starts them over.
export const live = {
  opts: readOptions({}),
  ctx: null as Ctx | null,
  isTurnRunning: false,
  sessionId: null as string | null,
  startedAt: null as number | null,
  recordSeenAt: null as number | null,
  // The terminal it runs in, read at its first beat.
  terminal: null as SessionTerminal | null,
}
