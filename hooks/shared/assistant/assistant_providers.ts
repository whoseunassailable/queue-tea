import type { Ports } from '../../core/ports/ports'
import { assistantRepositoryImpl } from './data/repositories/assistant_repository_impl'
import type { AssistantRepository } from './domain/repositories/assistant_repository'

export const assistantRepositoryOf = (p: Ports): AssistantRepository => assistantRepositoryImpl(p)
