export type AppIdentity = { version: string; commit: string | null }
export type UpdatePhase = 'idle' | 'queued' | 'checking' | 'building' | 'verifying' | 'installing' | 'installed' | 'failed'
export type UpdateState = { phase: UpdatePhase; commit: string | null; detail: string | null }
export type AppUpdate = { running: AppIdentity; installed: AppIdentity | null; state: UpdateState; canRetry: boolean; canRestart: boolean }

export const changedBuild = (running: AppIdentity, installed: AppIdentity | null): boolean => installed !== null &&
  (running.version !== installed.version || (running.commit !== null && installed.commit !== null && running.commit !== installed.commit))
