import type { Allowance } from '../../../../../types'
import type { Options } from '../../../../core/env/env'

// What a session tells the app about itself, in its own file. A file whose
// heartbeat has gone stale belongs to a session that crashed.
export type SessionFile = {
  id: string
  projectPath: string
  recordFile: string
  currentTaskId: string | null
  isTurnRunning: boolean
  cup: { mood: 'idle' | 'working' | 'attention' | 'done'; line: string }
  allowance: Allowance | null
  options: Options
  heartbeat: number
  startedAt: number
}
