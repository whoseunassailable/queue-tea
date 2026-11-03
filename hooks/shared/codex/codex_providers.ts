import type { Ctx } from '../../core/env/env'
import type { Ports } from '../../core/ports/ports'
import { codexRepositoryImpl } from './data/repositories/codex_repository_impl'
import type { CodexRepository } from './domain/repositories/codex_repository'

export const codexRepositoryOf = (p: Ports, ctx: Ctx): CodexRepository => codexRepositoryImpl(p.host, ctx.home)
