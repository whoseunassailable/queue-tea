export type RunResult = { exitCode: number; stdout: string; stderr: string }

// The files and processes the pieces use, so each piece can be tested with a
// host held in memory. The mod and the app each build one: the engine has no
// rename or mkdir of its own, so the mod's run commands, and the app's use
// Node's file calls.
export type Host = {
  exists: (path: string) => Promise<boolean>
  read: (path: string) => Promise<string>
  write: (path: string, text: string) => Promise<void>
  run: (argv: string[], cwd?: string) => Promise<RunResult>
  list: (dir: string) => Promise<string[]>
  sleep: (ms: number) => Promise<void>
  move: (from: string, to: string) => Promise<RunResult>
  // Fails when the folder is there already, which is what makes it a lock.
  makeDir: (path: string) => Promise<RunResult>
  makeDirs: (path: string) => Promise<RunResult>
  removeDir: (path: string) => Promise<RunResult>
  remove: (path: string) => Promise<RunResult>
  // When the file last changed, in ms, or null when it isn't there.
  modifiedAt: (path: string) => Promise<number | null>
  open: (url: string) => Promise<RunResult>
}

// The file moves, as commands. Mac only for now: Windows gets its own here.
export const unixFiles = (run: Host['run']): Pick<Host, 'move' | 'makeDir' | 'makeDirs' | 'removeDir' | 'remove'> => ({
  move: (from, to) => run(['mv', '-f', from, to]),
  makeDir: path => run(['mkdir', path]),
  makeDirs: path => run(['mkdir', '-p', path]),
  removeDir: path => run(['rmdir', path]),
  remove: path => run(['rm', '-f', path]),
})
