import type { Reply } from '../../shared/engine_api'
import type { Logger } from './logger'

// Every engine call runs through here: an exception is logged with its stack,
// and the window only ever gets the plain message.
export const reply = async <T>(log: Logger, message: string, work: () => Promise<T>): Promise<Reply<T>> => {
  try {
    return { ok: true, data: await work() }
  } catch (err) {
    log.error(message, err)

    return { ok: false, error: { message } }
  }
}
