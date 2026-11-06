import { randomUUID } from 'node:crypto'

import type { Ctx } from '../../../../../hooks/core/env/env'
import type { Host } from '../../../../../hooks/core/host/host'
import { readOptions } from '../../../../../hooks/core/session/options'
import { taskLogRepositoryImpl } from '../../../../../hooks/features/tasks/data/repositories/task_log_repository_impl'
import { codexRepositoryImpl } from '../../../../../hooks/shared/codex/data/repositories/codex_repository_impl'
import { gitRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/git_repository_impl'
import { projectRepositoryImpl } from '../../../../../hooks/shared/records/data/repositories/project_repository_impl'
import { recordsRepositoryImpl } from '../../../../../hooks/shared/records/data/repositories/records_repository_impl'
import type { Logger } from '../../../core/logger'
import type { CodexContext } from '../domain/operations'

export const loadCodexContext = async (host: Host, log: Logger, cwd: string, home: string): Promise<CodexContext> => {
  const place = await projectRepositoryImpl(host, text => log.debug(text)).locate(cwd, home)
  const ctx: Ctx = { ...place, cwd: place.workingPath ?? cwd, home, projectName: place.projectPath.split('/').pop() ?? place.projectPath, options: readOptions({}) }

  return {
    ctx,
    deps: {
      records: recordsRepositoryImpl(host, ctx),
      git: gitRepositoryImpl(host, ctx.cwd),
      taskLog: taskLogRepositoryImpl(host, ctx.cwd),
      codex: codexRepositoryImpl(host, home),
      env: { now: async () => Date.now(), newId: () => `t-${randomUUID()}`, log: text => log.debug(text) },
    },
  }
}
