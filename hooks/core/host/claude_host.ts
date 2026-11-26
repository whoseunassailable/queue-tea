import type { EngineInterface } from 'claude-code'

import { FileTooLarge, unixFiles } from './host'
import type { Host } from './host'
import { ENGINE_FILE_LIMIT } from './host_limits'

const bytesOf = (base64: string): Uint8Array => Uint8Array.from(atob(base64), c => c.charCodeAt(0))

// A file past what Claude Code reads at once, read in ranges of bytes, which
// $.fs.read answers as base64, and joined as bytes, so a character split
// between two ranges stays whole.
async function readInRanges($: EngineInterface, path: string, size: number): Promise<string> {
  const whole = new Uint8Array(size)
  let filled = 0
  while (filled < size) {
    const range = { as: 'bytes', offset: filled, length: Math.min(ENGINE_FILE_LIMIT, size - filled) }
    const part = bytesOf(((await $.fs.read(path, range as never)) as unknown as { base64: string }).base64)
    // The file got shorter since it was measured: what was read is all of it.
    if (part.length === 0) break
    whole.set(part.subarray(0, size - filled), filled)
    filled += part.length
  }

  return new TextDecoder().decode(whole.subarray(0, filled))
}

export function hostOf($: EngineInterface): Host {
  const run: Host['run'] = (argv, cwd) => $.process.run(argv, cwd === undefined ? undefined : { cwd })

  return {
    exists: path => $.fs.exists(path),
    read: async path => {
      const { size } = await $.fs.stat(path)

      return size > ENGINE_FILE_LIMIT ? readInRanges($, path, size) : $.fs.read(path)
    },
    write: async (path, text) => {
      const bytes = new TextEncoder().encode(text).length
      if (bytes > ENGINE_FILE_LIMIT) throw new FileTooLarge(path, bytes, ENGINE_FILE_LIMIT)
      await $.fs.write(path, text)
    },
    run,
    list: async dir => ((await $.fs.exists(dir)) ? (await $.fs.list(dir)).filter(e => e.kind === 'file').map(e => e.name) : []),
    sleep: ms => $.clock.sleep(ms),
    ...unixFiles(run),
    modifiedAt: async path => {
      try {
        return (await $.fs.stat(path)).mtimeMs
      } catch {
        // A file that isn't there has no time, and that is the answer asked for.
        return null
      }
    },
    open: url => run(['open', url]),
  }
}
