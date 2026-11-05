import type { Host } from '../../../../core/host/host'
import type { CodexRepository } from '../../domain/repositories/codex_repository'
import { readCodexActivity } from '../datasources/codex_log_source'

export const codexRepositoryImpl = (host: Host, home: string): CodexRepository => ({
  activitySince: (folder, sinceMs, nowMs) => readCodexActivity(host, home, folder, sinceMs, nowMs),
})
