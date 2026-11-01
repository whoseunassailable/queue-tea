import type { Ctx } from '../../core/env/env'
import type { Ports } from '../../core/ports/ports'
import { recordsRepositoryImpl } from './data/repositories/records_repository_impl'
import type { RecordsRepository } from './domain/repositories/records_repository'

export const recordsRepositoryOf = (p: Ports, ctx: Ctx): RecordsRepository => recordsRepositoryImpl(p.host, ctx)
