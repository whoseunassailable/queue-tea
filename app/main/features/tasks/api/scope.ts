import type { ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../../hooks/core/env/env'
import { readOptions } from '../../../../../hooks/core/session/options'
import { taskLogRepositoryImpl } from '../../../../../hooks/features/tasks/data/repositories/task_log_repository_impl'
import type { Deps } from '../../../../../hooks/features/tasks/domain/usecases/deps'
import { codexRepositoryImpl } from '../../../../../hooks/shared/codex/data/repositories/codex_repository_impl'
import { gitRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/git_repository_impl'
import { recordsRepositoryImpl } from '../../../../../hooks/shared/records/data/repositories/records_repository_impl'
import type { Saved } from '../../../../../hooks/shared/records/domain/repositories/records_repository'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import type { ProjectView, Reply } from '../../../../shared/engine_api'
import { projectsFolder } from '../../../core/constants'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import type { ProjectsDeps } from '../../projects/api/projects_api'
import { budgetOf } from '../../projects/data/budgets'
import { scanRecord } from '../../projects/data/projects_source'
import { sessionsIn, viewOf } from '../../projects/domain/project_views'
import type { ClaudeDeps } from '../data/claude_code'

export type TasksDeps = ProjectsDeps & ClaudeDeps & { offsetMinutes: () => number; newId: () => string }

export type Scope = { key: string; deps: Deps; ctx: Ctx; record: ProjectRecord }

// The mod's own repositories over the app's host, for one realm's record.
export const scopeOf = async (d: TasksDeps, key: unknown, taskId?: unknown): Promise<Scope> => {
  if (!isProjectKey(key)) throw new Refusal(MESSAGES.unknownProject)
  const folder = projectsFolder(d.home)
  const name = `${key}.json`
  if (!(await d.host.exists(`${folder}/${name}`))) throw new Refusal(MESSAGES.unknownProject)
  const scanned = await scanRecord(d.host, folder, name, d.log)
  if (scanned.kind === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

  const { path, name: projectName } = scanned.record.project
  const workingPath = scanned.record.tasks.find(t => t.id === taskId)?.worktreePath ?? path
  const ctx: Ctx = { cwd: workingPath, home: d.home, projectPath: path, projectName, file: scanned.file, offsetMinutes: d.offsetMinutes(), options: readOptions({}) }
  const deps: Deps = {
    records: recordsRepositoryImpl(d.host, ctx),
    git: gitRepositoryImpl(d.host, workingPath),
    taskLog: taskLogRepositoryImpl(d.host, workingPath),
    codex: codexRepositoryImpl(d.host, d.home),
    env: { now: async () => d.now(), newId: d.newId, log: text => d.log.debug(text) },
  }

  return { key, deps, ctx, record: scanned.record }
}

export const realmView = async (d: TasksDeps, key: string, record: ProjectRecord): Promise<ProjectView> =>
  viewOf(key, record, await sessionsRepositoryImpl(d.host, d.home).list(), d.now(), budgetOf(key))

export const isSessionOpen = async (d: TasksDeps, path: string): Promise<boolean> =>
  sessionsIn(await sessionsRepositoryImpl(d.host, d.home).list(), path, d.now()).some(s => (s.workingPath ?? s.projectPath) === path)

// One edit: the record changes under its lock, and the window gets the realm
// as it is now.
export const edit = (d: TasksDeps, key: unknown, failure: string, work: (scope: Scope) => Promise<Saved>): Promise<Reply<ProjectView>> =>
  reply(d.log, failure, async () => {
    const scope = await scopeOf(d, key)
    const saved = await work(scope)
    if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

    return realmView(d, scope.key, saved)
  })
