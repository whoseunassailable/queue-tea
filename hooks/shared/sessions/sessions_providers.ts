import type { Ctx } from '../../core/env/env'
import type { Ports } from '../../core/ports/ports'
import { sessionsRepositoryImpl } from './data/repositories/sessions_repository_impl'
import type { SessionsRepository } from './domain/repositories/sessions_repository'

export const sessionsRepositoryOf = (p: Ports, ctx: Ctx): SessionsRepository => sessionsRepositoryImpl(p.host, ctx.home)
