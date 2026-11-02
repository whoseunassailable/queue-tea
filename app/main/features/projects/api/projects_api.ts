import type { Host } from '../../../../../hooks/core/host/host'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import type { ProjectRow, ProjectView, Reply } from '../../../../shared/engine_api'
import { projectsFolder } from '../../../core/constants'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { reply } from '../../../core/reply'
import { scanRecord, scanRecords } from '../data/projects_source'
import { rowOf, viewOf } from '../domain/project_views'

export type ProjectsDeps = { host: Host; home: string; now: () => number; log: Logger }

const KEY = /^[^./\\][^/\\]*-[0-9a-f]{6}$/

export const isProjectKey = (key: unknown): key is string => typeof key === 'string' && KEY.test(key)

export const listProjects = (d: ProjectsDeps): Promise<Reply<ProjectRow[]>> =>
  reply(d.log, MESSAGES.listProjects, async () => {
    const sessions = await sessionsRepositoryImpl(d.host, d.home).list()
    const now = d.now()

    return (await scanRecords(d.host, d.home, d.log)).map(s =>
      s.kind === 'readable' ? rowOf(s.key, s.record, sessions, now) : { kind: 'unreadable', key: s.key, name: s.name },
    )
  })

export const readProject = async (d: ProjectsDeps, key: unknown): Promise<Reply<ProjectView>> => {
  if (!isProjectKey(key)) {
    d.log.warn('readProject was given a key that is not one')

    return { ok: false, error: { message: MESSAGES.unknownProject } }
  }

  return reply(d.log, MESSAGES.readProject, async () => {
    const folder = projectsFolder(d.home)
    const name = `${key}.json`
    if (!(await d.host.exists(`${folder}/${name}`))) throw new Error(`no record for ${key}`)
    const scanned = await scanRecord(d.host, folder, name, d.log)
    if (scanned.kind === 'unreadable') {
      return { kind: 'unreadable', key, name: scanned.name, isNewer: scanned.isNewer, canRestore: scanned.canRestore }
    }

    return viewOf(key, scanned.record, await sessionsRepositoryImpl(d.host, d.home).list(), d.now())
  })
}
