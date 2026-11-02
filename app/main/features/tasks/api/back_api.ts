import type { Task } from '../../../../../types'
import type { Block } from '../../../../../hooks/features/tasks/domain/services/task_rules'
import { addRequestUseCase } from '../../../../../hooks/features/tasks/domain/usecases/add_request'
import { dropRequestsUseCase } from '../../../../../hooks/features/tasks/domain/usecases/drop_requests'
import { putBackUseCase } from '../../../../../hooks/features/tasks/domain/usecases/put_back'
import { wouldLoop } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { latestNote } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import type { BackOutcome, Reply } from '../../../../shared/engine_api'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { questIdOf, sealOf } from '../domain/task_input'
import { isSessionOpen, realmView, scopeOf } from './scope'
import type { Scope, TasksDeps } from './scope'

const LOOP = 'That would make the two tasks wait for each other.'

const activeTask = (scope: Scope, id: string): Task => {
  const task = scope.record.tasks.find(t => t.id === id)
  if (task?.state !== 'current') throw new Refusal(MESSAGES.notActiveBack)

  return task
}

const lastNoteAt = (task: Task): string | null => {
  const note = latestNote(task)
  if (note === 'checkpoint') return task.checkpoint!.written

  return note === 'handoff' ? task.handoff!.written : null
}

// Goes back now, with whatever the session was asked to do taken back first so
// it can't act on a quest that has gone.
const goBack = async (d: TasksDeps, scope: Scope, task: Task, block: Block | undefined, missedCheckpoint: boolean): Promise<BackOutcome> => {
  await dropRequestsUseCase(scope.deps, task.id)
  const saved = await putBackUseCase(scope.deps, task.id, block)
  if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

  return { view: await realmView(d, scope.key, saved), went: 'back', missedCheckpoint: missedCheckpoint ? { lastAt: lastNoteAt(task) } : null }
}

// With a session open it writes Claude's checkpoint, then the quest goes back.
// A begin still waiting means Claude hasn't started, so there is nothing to save.
export const putBackQuest = (d: TasksDeps, key: unknown, taskId: unknown, seal: unknown): Promise<Reply<BackOutcome>> =>
  reply(d.log, MESSAGES.putBackQuest, async () => {
    const scope = await scopeOf(d, key)
    const id = questIdOf(taskId)
    const block = seal === null || seal === undefined ? undefined : sealOf(seal)
    const task = activeTask(scope, id)
    if (block !== undefined && 'waitFor' in block && wouldLoop(scope.record.tasks, id, block.waitFor)) throw new Refusal(inGameWords(LOOP))

    const hasBegun = !scope.record.requests.some(q => q.kind === 'begin' && q.taskId === id)
    if (!hasBegun || !(await isSessionOpen(d, scope.ctx.projectPath))) return goBack(d, scope, task, block, hasBegun)

    const saved = await addRequestUseCase(scope.deps, scope.ctx, 'putBack', id, block)
    if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

    return { view: await realmView(d, scope.key, saved), went: 'asked', missedCheckpoint: null }
  })

// Without waiting for the session. A seal it was going to apply still applies.
export const putBackNow = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<BackOutcome>> =>
  reply(d.log, MESSAGES.putBackQuest, async () => {
    const scope = await scopeOf(d, key)
    const id = questIdOf(taskId)
    const task = activeTask(scope, id)
    const asked = scope.record.requests.find(q => q.kind === 'putBack' && q.taskId === id)

    return goBack(d, scope, task, asked?.block, true)
  })
