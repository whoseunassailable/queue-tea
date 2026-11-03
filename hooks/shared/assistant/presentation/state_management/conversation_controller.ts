import type { Ctx } from '../../../../core/env/env'
import type { Ports } from '../../../../core/ports/ports'
import type { Task } from '../../../../../types'
import { firstMessage } from '../../../checkpoints/domain/services/checkpoints'
import { checkNowUseCase } from '../../../checkpoints/domain/usecases/check_now'
import { gitRepositoryOf } from '../../../git/git_providers'
import { recordsRepositoryOf } from '../../../records/records_providers'
import { markUnreadable } from '../../../records/presentation/state_management/records_controller'
import { assistantRepositoryOf } from '../../assistant_providers'
import { writeHandoffUseCase } from '../../domain/usecases/write_handoff'

// A fresh conversation is on its way: no other is started until it is.
let isFreshPending = false
export const markFreshPending = (isPending: boolean): void => {
  isFreshPending = isPending
}
export const scheduleFresh = (p: Ports, ctx: Ctx, task: Task) => {
  isFreshPending = true
  p.later(() => freshConversation(p, ctx, task))
}

// True while Queue-tea is starting a conversation of its own, so the clear it
// makes is not taken for one to recover from.
export const isStartingFresh = () => isFreshPending

// When the clear or the first message fails, the task stays current and
// Continue is offered, so it can be tried again.
export const freshConversation = async (p: Ports, ctx: Ctx, task: Task): Promise<void> => {
  try {
    const checked = await checkNowUseCase(gitRepositoryOf(p, ctx), p.log, task)
    const assistant = assistantRepositoryOf(p)
    await assistant.clear()
    await assistant.submit(firstMessage(task, checked))
  } catch (err) {
    p.log(`starting the conversation for ${task.id} failed: ${err instanceof Error ? err.message : String(err)}`)
    await p.set('notice', `Couldn't open the conversation for ${task.title}. Press Continue to try again.`)
    await p.set('canContinue', true)
  } finally {
    isFreshPending = false
  }
}

const HANDOFF_FAILED = "Queue-tea: couldn't write the checkpoint; trying again after the next reply"

export const writeHandoff = async (p: Ports, ctx: Ctx, taskId: string): Promise<Task | null> => {
  const record = await p.get('record')
  const task = record?.tasks.find(t => t.id === taskId)
  if (task === undefined) return null
  const result = await writeHandoffUseCase(
    { records: recordsRepositoryOf(p, ctx), git: gitRepositoryOf(p, ctx), assistant: assistantRepositoryOf(p), env: p },
    ctx,
    task,
  )
  if (result.kind === 'not_written') {
    p.log(`checkpoint not written: ${result.reason}`)
    p.status(HANDOFF_FAILED)

    return null
  }
  if (result.kind === 'unreadable') {
    await markUnreadable(p, ctx)

    return null
  }
  await p.set('record', result.record)

  return result.record.tasks.find(t => t.id === taskId) ?? null
}
