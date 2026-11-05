// Codex keeps its own log of every session; Queue-tea only reads it.
export type CodexRepository = {
  // When something happened, in ms, in a Codex session run in the folder
  // since the moment given. Throws when the log can't be read.
  activitySince: (folder: string, sinceMs: number, nowMs: number) => Promise<number[]>
}
