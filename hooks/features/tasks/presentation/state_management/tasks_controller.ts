import type { Difficulty, ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { once } from '../../../../core/session/once'
import { closeBand, showBand } from '../../../../core/store/band_queue'
import { isStartingFresh, scheduleFresh, writeHandoff } from '../../../../shared/assistant/presentation/state_management/conversation_controller'
import { suggest } from '../../../../shared/backlog/domain/services/ranking'
import { flush } from '../../../../shared/effort/presentation/state_management/effort_controller'
import { gitRepositoryOf } from '../../../../shared/git/git_providers'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { applySaved, markUnreadable } from '../../../../shared/records/presentation/state_management/records_controller'
import type { Block } from '../../domain/services/task_rules'
import { finishTaskUseCase } from '../../domain/usecases/finish_task'
import { putBackUseCase } from '../../domain/usecases/put_back'
import { saveDocsPathUseCase } from '../../domain/usecases/save_docs_path'
import { startTaskUseCase } from '../../domain/usecases/start_task'
import { switchToTaskUseCase } from '../../domain/usecases/switch_to_task'
import { tasksDepsOf } from '../../tasks_providers'
import { clearHold } from './hold'

const DOCS_LOG = 'docs/task_log.md'

export const taskSection = (record: ProjectRecord | null) => {
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null) return null

  return {
    id: 'queue-tea:task',
    scope: 'session' as const,
    text: `The current Queue-tea task is "${current.title}". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.`,
  }
}

// The git check, the branch, then a fresh conversation for the task.
export const startTask = (p: Ports, ctx: Ctx, taskId: string): Promise<'started' | 'held' | 'failed'> =>
  once(`start:${taskId}`, () => startOnce(p, ctx, taskId), 'failed')

const startOnce = async (p: Ports, ctx: Ctx, taskId: string): Promise<'started' | 'held' | 'failed'> => {
  const result = await startTaskUseCase(tasksDepsOf(p, ctx), ctx, taskId)
  if (result.kind === 'unreadable') {
    await markUnreadable(p, ctx)

    return 'failed'
  }
  if (result.kind === 'gone') {
    await clearHold(p, taskId)

    return 'failed'
  }
  if (result.kind === 'blocked') {
    await p.set('notice', result.notice)

    return 'failed'
  }
  if (result.kind === 'held') {
    await p.set('hold', { taskId, text: result.text })

    return 'held'
  }
  if (result.kind === 'refused') {
    await p.set('record', result.record)
    await clearHold(p, taskId)
    await p.set('notice', result.notice)

    return 'failed'
  }

  if (result.notice !== null) await p.set('notice', result.notice)
  if (result.kind === 'branch_failed') {
    await applySaved(p, ctx, result.record)
    await p.set('hold', { taskId, text: result.text })

    return 'held'
  }

  await p.set('record', result.record)
  await p.set('hold', null)
  await p.set('isChoosingNext', false)
  await p.set('openRow', null)
  await p.set('drift', [])
  scheduleFresh(p, ctx, result.task)

  return 'started'
}

// The done question, with what Claude says it checked when it says.
export const taskLooksDone = async (p: Ports, checked?: unknown): Promise<void> => {
  const line = typeof checked === 'string' ? checked.trim().slice(0, 300) : ''
  await p.set('checked', line === '' ? null : line)
  await p.set('isAskingDone', true)
}

const sayLogFailed = async (p: Ports, path: string | null) => {
  if (path !== null) await p.set('notice', `Couldn't write the task log at ${path}`)
}

// Finishes the task, asking for the docs log's path the first time.
export const finishTask = (p: Ports, ctx: Ctx, taskId: string, actual: Difficulty): Promise<void> =>
  once(`finish:${taskId}`, () => finishOnce(p, ctx, taskId, actual), undefined)

const finishOnce = async (p: Ports, ctx: Ctx, taskId: string, actual: Difficulty): Promise<void> => {
  const result = await finishTaskUseCase(tasksDepsOf(p, ctx), ctx, taskId, actual)
  if (result.kind === 'unreadable') {
    await markUnreadable(p, ctx)

    return
  }
  if (result.kind === 'skipped') return

  await p.set('record', result.record)
  await p.set('isAskingDone', false)
  await p.set('checked', null)
  if (result.askPath) {
    await showBand(p, { kind: 'docsPath', taskId, suggested: DOCS_LOG })

    return
  }
  await sayLogFailed(p, result.logFailedAt)
  await p.set('isChoosingNext', true)
}

export const finishDocs = (p: Ports, ctx: Ctx, taskId: string, path: string): Promise<void> =>
  once(`docs:${taskId}`, () => docsOnce(p, ctx, taskId, path), undefined)

const docsOnce = async (p: Ports, ctx: Ctx, taskId: string, path: string): Promise<void> => {
  const band = await p.get('band')
  if (band.kind !== 'docsPath' || band.taskId !== taskId) return
  const result = await saveDocsPathUseCase(tasksDepsOf(p, ctx), ctx, taskId, path)
  if (result.kind === 'unreadable') {
    await markUnreadable(p, ctx)

    return
  }

  await p.set('record', result.record)
  await closeBand(p)
  await sayLogFailed(p, result.logFailedAt)
  await p.set('isChoosingNext', true)
}

export const continueTask = async (p: Ports, ctx: Ctx): Promise<void> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current !== null && !isStartingFresh()) scheduleFresh(p, ctx, current)
}

// Switches to the current task's branch, unless something is uncommitted.
export const switchToTask = async (p: Ports, ctx: Ctx): Promise<'switched' | string> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current?.branch == null) return 'switched'

  const result = await switchToTaskUseCase(tasksDepsOf(p, ctx), current.branch)
  if (result.kind === 'uncommitted') return result.text
  await p.set('notice', null)

  return 'switched'
}

// Puts the current task back in the backlog with a checkpoint. With `block`,
// it goes back blocked.
export const putBack = (p: Ports, ctx: Ctx, block?: Block): Promise<'queued' | 'none'> =>
  once('put-back', () => putBackOnce(p, ctx, block), 'none')

const putBackOnce = async (p: Ports, ctx: Ctx, block: Block | undefined): Promise<'queued' | 'none'> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null || isStartingFresh()) return 'none'

  await p.set('busy', 'Saving a checkpoint…')
  let isNoted: boolean
  try {
    isNoted = (await writeHandoff(p, ctx, current.id)) !== null
  } catch (err) {
    p.log(`the handoff note failed: ${err instanceof Error ? err.message : String(err)}`)
    isNoted = false
  } finally {
    await p.set('busy', null)
  }
  const saved = await applySaved(p, ctx, await putBackUseCase(tasksDepsOf(p, ctx), current.id, block))
  if (saved === null) return 'none'

  await p.set('isAskingDone', false)
  await p.set('checked', null)
  await p.set('canContinue', false)
  await p.set('mismatch', null)
  await p.set('isChoosingNext', true)
  await p.set('drift', [])
  if (!isNoted) await p.set('notice', "Couldn't save a checkpoint, so Start will begin from what was saved before.")
  p.toast(block === undefined ? `Back in the backlog: ${current.title}` : `Blocked: ${current.title}`)

  return 'queued'
}

// What has moved under the current task, for the panel.
export const refreshDrift = async (p: Ports, ctx: Ctx): Promise<void> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null) {
    await p.set('drift', [])

    return
  }
  try {
    await p.set('drift', await gitRepositoryOf(p, ctx).drift(current))
  } catch (err) {
    p.log(`reading the drift failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

// The current task's lines so far, for the panel: what finishing it would
// measure now. Marked with the task, so another task's count never shows.
export const refreshLines = async (p: Ports, ctx: Ctx): Promise<void> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null || current.startCommit === null) {
    await p.set('lines', null)

    return
  }
  try {
    const diff = await gitRepositoryOf(p, ctx).diffSince(current.startCommit)
    await p.set('lines', { taskId: current.id, added: diff.linesAdded, removed: diff.linesRemoved })
  } catch (err) {
    p.log(`measuring the change failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

// At a session's start with a current task: offer Continue, and Switch when
// another branch is checked out.
export async function checkResume(p: Ports) {
  const ctx = live.ctx
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (ctx === null || current === null) return

  await p.set('canContinue', true)
  if (current.branch === null) return
  const git = await gitRepositoryOf(p, ctx).state()
  if (git.isRepo && git.branch !== current.branch) {
    await p.set('mismatch', `You're on ${git.branch ?? 'a detached HEAD'}; this task is on ${current.branch}.`)
  }
  await refreshDrift(p, ctx)
  await refreshLines(p, ctx)
}

export async function askDone(p: Ports): Promise<boolean> {
  const record = await p.get('record')
  if (record === null || currentTask(record.tasks) === null) return false
  await p.set('isAskingDone', true)

  return true
}

export async function pressStart(p: Ports, taskId: string) {
  if (live.ctx !== null) await startTask(p, live.ctx, taskId)
}

// Start from the backlog, then show the task where its hold or branch shows.
export async function pressStartFromBacklog(p: Ports, taskId: string) {
  await pressStart(p, taskId)
  await p.set('menuView', 'current')
}

// Starts the task marked ★.
export async function pressStartNext(p: Ports) {
  const record = await p.get('record')
  const next = record === null ? null : suggest(record, await p.get('budget'))
  if (next !== null) await pressStart(p, next.id)
}

// Puts the current task back in Up next, its time so far written first.
export async function pressBackToQueue(p: Ports) {
  if (live.ctx === null) return
  await flush(p)
  await putBack(p, live.ctx)
}

export async function pressCheckAgain(p: Ports) {
  const hold = await p.get('hold')
  if (hold !== null && live.ctx !== null) await startTask(p, live.ctx, hold.taskId)
}

export async function pressContinue(p: Ports) {
  await p.set('canContinue', false)
  if (live.ctx !== null) await continueTask(p, live.ctx)
}

export async function pressSwitch(p: Ports) {
  if (live.ctx === null) return
  try {
    const result = await switchToTask(p, live.ctx)
    if (result === 'switched') await p.set('mismatch', null)
    else await p.set('notice', `${result}: commit or stash first, then Switch.`)
  } catch (err) {
    debug(p, 'switching branches failed', err)
    await p.set('notice', "Couldn't switch branches. Try again.")
  }
}

export async function pressDoneYes(p: Ports) {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  await p.set('isAskingDone', false)
  await p.set('checked', null)
  if (current !== null) {
    await showBand(p, { kind: 'difficulty', taskId: current.id, picked: current.difficulty.expected })
  }
}

export async function pressDoneNotYet(p: Ports) {
  await p.set('isAskingDone', false)
  await p.set('checked', null)
}

export async function saveDifficulty(p: Ports) {
  const band = await p.get('band')
  if (band.kind !== 'difficulty' || live.ctx === null) return
  await closeBand(p)
  await finishTask(p, live.ctx, band.taskId, band.picked)
}

export async function saveDocsPath(p: Ports, value: string) {
  const band = await p.get('band')
  if (band.kind !== 'docsPath' || live.ctx === null) return
  await finishDocs(p, live.ctx, band.taskId, value.trim() === '' ? band.suggested : value.trim())
}
