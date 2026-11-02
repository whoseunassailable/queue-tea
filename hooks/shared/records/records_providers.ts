import type { Ctx } from '../../core/env/env'
import type { Ports } from '../../core/ports/ports'
import { projectRepositoryImpl } from './data/repositories/project_repository_impl'
import { recordsRepositoryImpl } from './data/repositories/records_repository_impl'
import type { ProjectRepository } from './domain/repositories/project_repository'
import type { RecordsRepository } from './domain/repositories/records_repository'

export const recordsRepositoryOf = (p: Ports, ctx: Ctx): RecordsRepository => recordsRepositoryImpl(p.host, ctx)

export const projectRepositoryOf = (p: Ports): ProjectRepository => projectRepositoryImpl(p.host, p.log)
