import type { Reply } from '../../shared/engine_api'
import type { Logger } from './logger'

// A sentence for the user: the engine said no, and nothing went wrong.
export class Refusal extends Error {}

// Every engine call runs through here: an exception is logged with its stack,
// and the window only ever gets the plain message.
export const reply = async <T>(log: Logger, message: string, work: () => Promise<T>): Promise<Reply<T>> => {
  try {
    return { ok: true, data: await work() }
  } catch (err) {
    if (err instanceof Refusal) return { ok: false, error: { message: err.message } }
    log.error(message, err)

    return { ok: false, error: { message } }
  }
}
