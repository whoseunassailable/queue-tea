import type { ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { once } from '../../../../core/session/once'
import { isStartingFresh, scheduleFresh } from '../../../../shared/assistant/presentation/state_management/conversation_controller'
import { flush } from '../../../../shared/effort/presentation/state_management/effort_controller'
import { currentTask, taskFolder } from '../../../../shared/records/domain/services/queue_rules'
import { markUnreadable, reloadIfChanged } from '../../../../shared/records/presentation/state_management/records_controller'
import { takeRequestUseCase } from '../../domain/usecases/take_request'
import { tasksDepsOf } from '../../tasks_providers'
import { putBack } from './tasks_controller'

export type Handled = 'none' | 'waiting' | 'dropped' | 'handled'

// No turn running, nothing half typed, no conversation of ours on its way.
const isSafePoint = async (p: Ports): Promise<boolean> =>
  !live.isTurnRunning && !isStartingFresh() && (await p.prompt.read()).text.trim() === ''

// Acts on the oldest request. Run from a timer and never inside a hook, so a
// first message is never submitted from within a turn the hook is holding.
export const handleRequests = async (p: Ports, ctx: Ctx): Promise<Handled> => {
  const record = await p.get('record')
  const request = record?.requests.find(q => {
    const task = record.tasks.find(t => t.id === q.taskId)

    return task === undefined ? ctx.cwd === ctx.projectPath : taskFolder(task, ctx.projectPath) === ctx.cwd
  })
  if (record === null || request === undefined) return 'none'

  const task = record.tasks.find(t => t.id === request.taskId)
  const isStale = task?.state !== 'current'
  if (!isStale && !(await isSafePoint(p))) {
    if (request.kind === 'begin' && !(await p.get('canContinue'))) await p.set('canContinue', true)

    return 'waiting'
  }

  const taken = await takeRequestUseCase(tasksDepsOf(p, ctx), request.id, ctx)
  if (taken.kind === 'unreadable') {
    await markUnreadable(p, ctx)

    return 'none'
  }
  if (taken.kind === 'gone') return 'none'

  await p.set('record', taken.record)
  if (task === undefined || isStale) {
    p.log(`dropped the app's ${request.kind} request: ${request.taskId} is not the current task`)

    return 'dropped'
  }
  if (request.kind === 'begin') {
    await p.set('canContinue', false)
    scheduleFresh(p, ctx, task)
  } else {
    await flush(p)
    await putBack(p, ctx, taken.request.block)
  }

  return 'handled'
}

// The app answered the done question, so the terminal stops asking it.
const closeAnswered = async (p: Ports, ctx: Ctx, before: ProjectRecord | null, after: ProjectRecord): Promise<void> => {
  const was = before === null ? null : currentTask(before.tasks, ctx)
  if (was?.review == null) return
  const now = after.tasks.find(t => t.id === was.id)
  if (now?.review == null) {
    await p.set('isAskingDone', false)
    await p.set('checked', null)
  }
}

// The timer's work: the record again when it changed, then any request.
export const followRecord = (p: Ports, ctx: Ctx): Promise<void> =>
  once(
    'follow-record',
    async () => {
      const before = await p.get('record')
      const fresh = await reloadIfChanged(p, ctx)
      if (fresh !== null) await closeAnswered(p, ctx, before, fresh)
      await handleRequests(p, ctx)
    },
    undefined,
  )
