import type { Ports } from '../../core/ports/ports'
import { checkRepositoryImpl } from './data/repositories/check_repository_impl'
import type { CheckRepository } from './domain/repositories/check_repository'

export const checkRepositoryOf = (p: Ports): CheckRepository => checkRepositoryImpl(p)
