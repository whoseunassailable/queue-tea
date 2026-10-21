import type { EngineInterface } from 'claude-code'

export type RunResult = { exitCode: number; stdout: string; stderr: string }

// The files and processes the pieces use, so each piece can be tested with a
// host held in memory.
export type Host = {
  exists: (path: string) => Promise<boolean>
  read: (path: string) => Promise<string>
  write: (path: string, text: string) => Promise<void>
  run: (argv: string[], cwd?: string) => Promise<RunResult>
  list: (dir: string) => Promise<string[]>
}

export function hostOf($: EngineInterface): Host {
  return {
    exists: path => $.fs.exists(path),
    read: path => $.fs.read(path),
    write: (path, text) => $.fs.write(path, text),
    run: (argv, cwd) => $.process.run(argv, cwd === undefined ? undefined : { cwd }),
    list: async dir => ((await $.fs.exists(dir)) ? (await $.fs.list(dir)).filter(e => e.kind === 'file').map(e => e.name) : []),
  }
}
