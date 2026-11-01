export type Options = {
  idleGapMinutes: number
  freshAtTokens: number
  handoffAtPercent: number
  checkTimeoutSeconds: number
}

export type Ctx = {
  cwd: string
  projectPath: string
  projectName: string
  file: string
  offsetMinutes: number
  options: Options
}

// What a use case needs from the engine besides its repositories.
export type Env = { now: () => Promise<number>; newId: () => string; log: (text: string) => void }
