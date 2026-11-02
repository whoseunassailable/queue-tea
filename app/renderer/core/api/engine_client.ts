import type { EngineApi, Reply } from '../../../shared/engine_api'
import { t } from '../../l10n/en'

export type Answer<T> = { ok: true; data: T } | { ok: false; message: string }

// The one file that turns an engine reply into data or an error. Every call
// goes through it, so a screen never reads a raw error. When HTTP sits behind
// the API later, this is where each status gets its plain message.
export const ask = async <T>(engine: Pick<EngineApi, 'log'>, call: () => Promise<Reply<T>>): Promise<Answer<T>> => {
  try {
    const reply = await call()

    return reply.ok ? { ok: true, data: reply.data } : { ok: false, message: reply.error.message }
  } catch (err) {
    engine.log('error', `an engine call failed: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`)

    return { ok: false, message: t.failed.noAnswer }
  }
}
