import type { EngineInterface } from 'claude-code'

import type { Host } from './host'

export function hostOf($: EngineInterface): Host {
  return {
    exists: path => $.fs.exists(path),
    read: path => $.fs.read(path),
    write: (path, text) => $.fs.write(path, text),
    run: (argv, cwd) => $.process.run(argv, cwd === undefined ? undefined : { cwd }),
    list: async dir => ((await $.fs.exists(dir)) ? (await $.fs.list(dir)).filter(e => e.kind === 'file').map(e => e.name) : []),
    sleep: ms => $.clock.sleep(ms),
  }
}
