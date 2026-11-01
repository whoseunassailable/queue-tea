export type RunResult = { exitCode: number; stdout: string; stderr: string }

// The files and processes the pieces use, so each piece can be tested with a
// host held in memory.
export type Host = {
  exists: (path: string) => Promise<boolean>
  read: (path: string) => Promise<string>
  write: (path: string, text: string) => Promise<void>
  run: (argv: string[], cwd?: string) => Promise<RunResult>
  list: (dir: string) => Promise<string[]>
  sleep: (ms: number) => Promise<void>
}
