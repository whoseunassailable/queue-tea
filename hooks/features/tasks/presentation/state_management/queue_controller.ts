import type { Priority } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { nextBudget } from '../../../../shared/backlog/domain/services/ranking'
import { flush } from '../../../../shared/effort/presentation/state_management/effort_controller'
import { applySaved, markUnreadable } from '../../../../shared/records/presentation/state_management/records_controller'
import { putBack } from './tasks_controller'
import type { Block } from '../../domain/services/task_rules'
import { blockTaskUseCase } from '../../domain/usecases/block_task'
import { findFeatureUseCase } from '../../domain/usecases/find_feature'
import { moveTaskUseCase } from '../../domain/usecases/move_task'
import { removeTaskUseCase } from '../../domain/usecases/remove_task'
import { setFeatureUseCase } from '../../domain/usecases/set_feature'
import { setPriorityUseCase } from '../../domain/usecases/set_priority'
import { togglePlayNextUseCase } from '../../domain/usecases/toggle_play_next'
import { unblockTaskUseCase } from '../../domain/usecases/unblock_task'
import { tasksDepsOf } from '../../tasks_providers'
import { clearHold } from './hold'

// Removes a queued task, and the git check's hold on it.
export const removeQueued = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  const saved = await applySaved(p, ctx, await removeTaskUseCase(tasksDepsOf(p, ctx), taskId))
  if (saved === null) return
  await clearHold(p, taskId)
  await p.set('openRow', null)
}

// Blocks a task; on the current task it puts the task back, blocked.
export const blockTask = async (p: Ports, ctx: Ctx, taskId: string, block: Block): Promise<void> => {
  const record = await p.get('record')
  await p.set('blocking', null)
  const result = await blockTaskUseCase(tasksDepsOf(p, ctx), record, taskId, block)
  if (result.kind === 'none') return
  if (result.kind === 'refused') {
    await p.set('notice', result.notice)

    return
  }
  if (result.kind === 'is_current') {
    await putBack(p, ctx, block)

    return
  }
  await applySaved(p, ctx, result.saved)
  await p.set('openRow', null)
}

export const unblockTask = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  await applySaved(p, ctx, await unblockTaskUseCase(tasksDepsOf(p, ctx), taskId))
  await p.set('openRow', null)
}

export const togglePlayNext = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  await applySaved(p, ctx, await togglePlayNextUseCase(tasksDepsOf(p, ctx), taskId))
  await p.set('openRow', null)
}

// Returns what happened, in plain words.
export const setFeature = async (p: Ports, ctx: Ctx, taskId: string | null): Promise<string> => {
  const { said, saved } = await setFeatureUseCase(tasksDepsOf(p, ctx), taskId)

  return (await applySaved(p, ctx, saved)) === null ? "Couldn't read the task record." : said
}

export const featureCommand = async (p: Ports, ctx: Ctx, args: string): Promise<string> => {
  const found = await findFeatureUseCase(tasksDepsOf(p, ctx), args)

  return found.kind === 'say' ? found.text : setFeature(p, ctx, found.taskId)
}

export const moveTask = async (p: Ports, ctx: Ctx, taskId: string, parentId: string | null): Promise<void> => {
  await p.set('parenting', null)
  const result = await moveTaskUseCase(tasksDepsOf(p, ctx), taskId, parentId)
  if (result.kind === 'unreadable') {
    await markUnreadable(p, ctx)

    return
  }
  await p.set('record', result.record)
  if (result.kind === 'refused') {
    await p.set('notice', result.notice)

    return
  }
  const { task, parent } = result
  if (task !== undefined) p.toast(parent === null ? `On its own: ${task.title}` : `Part of ${parent.title}: ${task.title}`)
}

// Opens the blocking view for a task: what it waits for, or a reason.
export async function pressBlock(p: Ports, taskId: string) {
  await p.set('parenting', null)
  await p.set('blocking', taskId)
}

export async function pressCancelBlock(p: Ports) {
  await p.set('blocking', null)
}

export async function pressBlockWith(p: Ports, taskId: string, block: Block) {
  if (live.ctx === null) return
  await flush(p)
  await blockTask(p, live.ctx, taskId, block)
}

export async function pressUnblock(p: Ports, taskId: string) {
  if (live.ctx !== null) await unblockTask(p, live.ctx, taskId)
}

export async function pressPlayNext(p: Ports, taskId: string) {
  if (live.ctx !== null) await togglePlayNext(p, live.ctx, taskId)
}

// Steps "Time I have" through any, 30m, 1h and 2h.
export async function pressBudget(p: Ports) {
  await p.set('budget', nextBudget(await p.get('budget')))
}

export async function pressRow(p: Ports, taskId: string) {
  const open = await p.get('openRow')
  await p.set('openRow', open === taskId ? null : taskId)
}

export async function pressPriority(p: Ports, taskId: string, priority: Priority) {
  const ctx = live.ctx
  if (ctx === null) return
  try {
    await applySaved(p, ctx, await setPriorityUseCase(tasksDepsOf(p, ctx), taskId, priority))
  } catch (err) {
    debug(p, 'writing the record failed', err)
  }
}

export async function pressRemove(p: Ports, taskId: string) {
  if (live.ctx !== null) await removeQueued(p, live.ctx, taskId)
}

// Shows a feature's tasks under it in the backlog, or folds them away.
export async function pressFold(p: Ports, parentId: string) {
  const open = await p.get('openParents')
  await p.set('openParents', open.includes(parentId) ? open.filter(id => id !== parentId) : [...open, parentId])
}

// Opens the Part of… view for a task: the features it can go under.
export async function pressPartOf(p: Ports, taskId: string) {
  await p.set('blocking', null)
  await p.set('parenting', taskId)
}

export async function pressCancelPartOf(p: Ports) {
  await p.set('parenting', null)
}

export async function pressPartOfWith(p: Ports, taskId: string, parentId: string | null) {
  if (live.ctx !== null) await moveTask(p, live.ctx, taskId, parentId)
}

// Makes a task the active feature, or, pressed on the active one, none.
export async function pressFeature(p: Ports, taskId: string) {
  if (live.ctx === null) return
  const record = await p.get('record')
  p.toast(`Queue-tea: ${await setFeature(p, live.ctx, record?.feature === taskId ? null : taskId)}`)
}

export async function pressClearFeature(p: Ports) {
  if (live.ctx !== null) p.toast(`Queue-tea: ${await setFeature(p, live.ctx, null)}`)
}

// /feature, answered in the command's reply.
export async function runFeature(p: Ports, args: string): Promise<string> {
  return live.ctx === null ? 'Queue-tea has no project here.' : featureCommand(p, live.ctx, args)
}
