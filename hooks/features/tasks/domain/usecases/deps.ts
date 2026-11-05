import type { Env } from '../../../../core/env/env'
import type { CodexRepository } from '../../../../shared/codex/domain/repositories/codex_repository'
import type { GitRepository } from '../../../../shared/git/domain/repositories/git_repository'
import type { RecordsRepository } from '../../../../shared/records/domain/repositories/records_repository'
import type { TaskLogRepository } from '../repositories/task_log_repository'

// What the tasks use cases work through. A use case never sees the ports.
export type Deps = { records: RecordsRepository; git: GitRepository; taskLog: TaskLogRepository; codex: CodexRepository; env: Env }
