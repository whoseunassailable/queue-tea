import type { Ctx } from '../env/env'
import { readOptions } from './options'

// The session's own: where it works and its options. A reload starts them
// over.
export const live = {
  opts: readOptions({}),
  ctx: null as Ctx | null,
}
