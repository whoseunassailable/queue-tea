import type { Ctx } from '../types'
import type { Tracker } from './effort'
import type { Errand } from './errand'
import { readOptions } from './session'

// The session's own: where it works, what it has gathered since the last
// flush, the reset window a handoff note was last written for, the commit
// the running turn started on, and a /brew or /tea errand on its way or
// running. A reload starts them over.
export const live = {
  opts: readOptions({}),
  ctx: null as Ctx | null,
  tracker: null as Tracker | null,
  handedOffFor: null as string | null,
  turnHead: null as { commit: string; branch: string | null } | null,
  errand: null as Errand | null,
}
