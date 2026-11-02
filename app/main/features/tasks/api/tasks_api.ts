import type { Task } from '../../../../../types'
import type { Ctx } from '../../../../../hooks/core/env/env'
import { readOptions } from '../../../../../hooks/core/session/options'
import { taskLogRepositoryImpl } from '../../../../../hooks/features/tasks/data/repositories/task_log_repository_impl'
import { blockTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/block_task'
import type { Deps } from '../../../../../hooks/features/tasks/domain/usecases/deps'
import { editTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/edit_task'
import { fileTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/file_task'
import { moveTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/move_task'
import { removeTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/remove_task'
import { restoreTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/restore_task'
import { setFeatureUseCase } from '../../../../../hooks/features/tasks/domain/usecases/set_feature'
import { setPriorityUseCase } from '../../../../../hooks/features/tasks/domain/usecases/set_priority'
import { togglePlayNextUseCase } from '../../../../../hooks/features/tasks/domain/usecases/toggle_play_next'
import { unblockTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/unblock_task'
import { childrenOf, filingCandidates, loneTasks, parentChoices, progressOf, progressText } from '../../../../../hooks/shared/backlog/domain/services/families'
import { canWaitFor } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { gitRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/git_repository_impl'
import { recordsRepositoryImpl } from '../../../../../hooks/shared/records/data/repositories/records_repository_impl'
import type { Saved } from '../../../../../hooks/shared/records/domain/repositories/records_repository'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import type { Choices, ProjectView, QuestChoice, Reply } from '../../../../shared/engine_api'
import { projectsFolder } from '../../../core/constants'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import type { ProjectsDeps } from '../../projects/api/projects_api'
import { scanRecord } from '../../projects/data/projects_source'
import type { Scanned } from '../../projects/data/projects_source'
import { viewOf } from '../../projects/domain/project_views'
import { newQuestOf, priorityOf, questEditOf, questIdOf, sealOf } from '../domain/task_input'

export type TasksDeps = ProjectsDeps & { offsetMinutes: () => number; newId: () => string }

type Scope = { key: string; deps: Deps; ctx: Ctx; record: Extract<Scanned, { kind: 'readable' }>['record'] }

// The mod's own repositories over the app's host, for one realm's record.
const scopeOf = async (d: TasksDeps, key: unknown): Promise<Scope> => {
  if (!isProjectKey(key)) throw new Refusal(MESSAGES.unknownProject)
  const folder = projectsFolder(d.home)
  const name = `${key}.json`
  if (!(await d.host.exists(`${folder}/${name}`))) throw new Refusal(MESSAGES.unknownProject)
  const scanned = await scanRecord(d.host, folder, name, d.log)
  if (scanned.kind === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

  const { path, name: projectName } = scanned.record.project
  const ctx: Ctx = { cwd: path, home: d.home, projectPath: path, projectName, file: scanned.file, offsetMinutes: d.offsetMinutes(), options: readOptions({}) }
  const deps: Deps = {
    records: recordsRepositoryImpl(d.host, ctx),
    git: gitRepositoryImpl(d.host, path),
    taskLog: taskLogRepositoryImpl(d.host, path),
    env: { now: async () => d.now(), newId: d.newId, log: text => d.log.debug(text) },
  }

  return { key, deps, ctx, record: scanned.record }
}

// One edit: the record changes under its lock, and the window gets the realm
// as it is now.
const edit = (d: TasksDeps, key: unknown, failure: string, work: (scope: Scope) => Promise<Saved>): Promise<Reply<ProjectView>> =>
  reply(d.log, failure, async () => {
    const scope = await scopeOf(d, key)
    const saved = await work(scope)
    if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

    return viewOf(scope.key, saved, await sessionsRepositoryImpl(d.host, d.home).list(), d.now())
  })

export const setPriority = (d: TasksDeps, key: unknown, taskId: unknown, priority: unknown) =>
  edit(d, key, MESSAGES.setPriority, ({ deps }) => setPriorityUseCase(deps, questIdOf(taskId), priorityOf(priority)))

export const togglePlayNext = (d: TasksDeps, key: unknown, taskId: unknown) =>
  edit(d, key, MESSAGES.togglePlayNext, ({ deps }) => togglePlayNextUseCase(deps, questIdOf(taskId)))

// Filing never starts a quest.
export const fileQuest = (d: TasksDeps, key: unknown, input: unknown) =>
  edit(d, key, MESSAGES.fileQuest, async ({ deps, ctx }) => {
    const quest = newQuestOf(input)
    const filed = await fileTaskUseCase(deps, ctx, { ...quest, text: quest.title, intent: 'improving' })
    if (filed.kind === 'refused') throw new Refusal(inGameWords(filed.notice))

    return filed.kind === 'unreadable' ? 'unreadable' : filed.record
  })

export const moveQuest = (d: TasksDeps, key: unknown, taskId: unknown, parentId: unknown) =>
  edit(d, key, MESSAGES.moveQuest, async ({ deps }) => {
    const moved = await moveTaskUseCase(deps, questIdOf(taskId), parentId === null ? null : questIdOf(parentId))
    if (moved.kind === 'refused') throw new Refusal(inGameWords(moved.notice))

    return moved.kind === 'unreadable' ? 'unreadable' : moved.record
  })

export const sealQuest = (d: TasksDeps, key: unknown, taskId: unknown, seal: unknown) =>
  edit(d, key, MESSAGES.sealQuest, async ({ deps, record }) => {
    const sealed = await blockTaskUseCase(deps, record, questIdOf(taskId), sealOf(seal))
    if (sealed.kind === 'refused') throw new Refusal(inGameWords(sealed.notice))
    if (sealed.kind === 'is_current') throw new Refusal(MESSAGES.sealActive)
    if (sealed.kind === 'none') throw new Refusal(MESSAGES.badQuest)

    return sealed.saved
  })

export const unsealQuest = (d: TasksDeps, key: unknown, taskId: unknown) =>
  edit(d, key, MESSAGES.unsealQuest, ({ deps }) => unblockTaskUseCase(deps, questIdOf(taskId)))

export const removeQuest = (d: TasksDeps, key: unknown, taskId: unknown) =>
  edit(d, key, MESSAGES.removeQuest, ({ deps }) => removeTaskUseCase(deps, questIdOf(taskId)))

export const restoreQuest = (d: TasksDeps, key: unknown, taskId: unknown) =>
  edit(d, key, MESSAGES.restoreQuest, ({ deps }) => restoreTaskUseCase(deps, questIdOf(taskId)))

export const editQuest = (d: TasksDeps, key: unknown, taskId: unknown, change: unknown) =>
  edit(d, key, MESSAGES.editQuest, ({ deps }) => editTaskUseCase(deps, questIdOf(taskId), questEditOf(change)))

export const setActiveSaga = (d: TasksDeps, key: unknown, taskId: unknown) =>
  edit(d, key, MESSAGES.setActiveSaga, async ({ deps }) => {
    const id = taskId === null ? null : questIdOf(taskId)
    const { said, saved } = await setFeatureUseCase(deps, id)
    if (saved !== 'unreadable' && id !== null && saved.feature !== id) throw new Refusal(said)

    return saved
  })

export const readChoices = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<Choices>> =>
  reply(d.log, MESSAGES.readChoices, async () => {
    const { record } = await scopeOf(d, key)
    const { tasks } = record
    const choice = (task: Task): QuestChoice => ({
      id: task.id,
      title: task.title,
      detail: childrenOf(task, tasks).length > 0 ? progressText(progressOf(task, tasks)) : null,
    })
    const id = taskId === null ? null : questIdOf(taskId)

    return {
      features: filingCandidates(record).map(choice),
      lone: loneTasks(record).map(choice),
      parents: id === null ? [] : parentChoices(tasks, id).map(choice),
      waitFor: id === null ? [] : canWaitFor(tasks, id).map(choice),
    }
  })
