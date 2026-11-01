import type { Host } from '../../../../core/host/host'
import type { TaskLogRepository } from '../../domain/repositories/task_log_repository'
import { writeDocsLog } from '../datasources/docs_log_source'

export const taskLogRepositoryImpl = (host: Host, projectPath: string): TaskLogRepository => ({
  add: (logPath, row, day) => writeDocsLog(host, projectPath, logPath, row, day),
})
