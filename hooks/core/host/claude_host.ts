import type { EngineInterface } from 'claude-code'

import { unixFiles } from './host'
import type { Host } from './host'

export function hostOf($: EngineInterface): Host {
  const run: Host['run'] = (argv, cwd) => $.process.run(argv, cwd === undefined ? undefined : { cwd })

  return {
    exists: path => $.fs.exists(path),
    read: path => $.fs.read(path),
    write: (path, text) => $.fs.write(path, text),
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
