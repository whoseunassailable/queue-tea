import type { Host } from '../../../../core/host/host'
import type { ProjectRepository } from '../../domain/repositories/project_repository'
import { readProjectPlace } from '../datasources/project_source'

export const projectRepositoryImpl = (host: Host, log: (text: string) => void): ProjectRepository => ({
  locate: (cwd, home) => readProjectPlace(host, cwd, home, log),
})
