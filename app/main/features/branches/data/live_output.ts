import { BRANCH_LIMITS } from '../domain/constants'

// Serialize atomic saves and coalesce noisy output. Flush must finish before
// the final event is saved, so a delayed chunk cannot overwrite completion.
export const liveOutput = (save: (output: string, truncated: boolean) => Promise<void>) => {
  let text = ''; let truncated = false; let timer: ReturnType<typeof setTimeout> | undefined
  let pending = Promise.resolve(); let failure: unknown = null
  const write = () => {
    clearTimeout(timer); timer = undefined
    const captured = text; const cut = truncated
    pending = pending.then(() => save(captured, cut)).catch(err => { failure = err })
  }
  return {
    append(chunk: string) {
      truncated ||= text.length + chunk.length > BRANCH_LIMITS.output
      text = (text + chunk).slice(-BRANCH_LIMITS.output)
      timer ??= setTimeout(write, BRANCH_LIMITS.streamMs)
    },
    async flush() { write(); await pending; if (failure) throw failure; return { output: text, truncated } },
  }
}
