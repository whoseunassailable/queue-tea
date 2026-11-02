import type { Task } from '../../../../../types'
import { blockTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/block_task'
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
import type { Choices, QuestChoice, Reply } from '../../../../shared/engine_api'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { newQuestOf, priorityOf, questEditOf, questIdOf, sealOf } from '../domain/task_input'
import { edit, scopeOf } from './scope'
import type { TasksDeps } from './scope'

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
