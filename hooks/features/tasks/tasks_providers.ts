import type { Ctx } from '../../core/env/env'
import type { Ports } from '../../core/ports/ports'
import { codexRepositoryOf } from '../../shared/codex/codex_providers'
import { gitRepositoryOf } from '../../shared/git/git_providers'
import { recordsRepositoryOf } from '../../shared/records/records_providers'
import { taskLogRepositoryImpl } from './data/repositories/task_log_repository_impl'
import type { Deps } from './domain/usecases/deps'

export const tasksDepsOf = (p: Ports, ctx: Ctx): Deps => ({
  records: recordsRepositoryOf(p, ctx),
  git: gitRepositoryOf(p, ctx),
  taskLog: taskLogRepositoryImpl(p.host, ctx.cwd),
  codex: codexRepositoryOf(p, ctx),
  env: p,
})
