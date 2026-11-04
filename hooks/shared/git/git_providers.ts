import type { Ctx } from '../../core/env/env'
import type { Ports } from '../../core/ports/ports'
import { gitRepositoryImpl } from './data/repositories/git_repository_impl'
import type { GitRepository } from './domain/repositories/git_repository'

export const gitRepositoryOf = (p: Ports, ctx: Ctx): GitRepository => gitRepositoryImpl(p.host, ctx.cwd)
