import type { Difficulty, ParentPick, Priority } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import { closeBand, showBand } from '../../../../core/store/band_queue'
import { guessParent } from '../../../../shared/backlog/domain/services/families'
import { currentTask } from '../../../../shared/records/domain/services/queue_rules'
import { markUnreadable } from '../../../../shared/records/presentation/state_management/records_controller'
import { startTask } from './tasks_controller'
import { fileTaskUseCase } from '../../domain/usecases/file_task'
import type { FileInput, FileResult } from '../../domain/usecases/file_task'
import { tasksDepsOf } from '../../tasks_providers'

const filing = new Set<string>()

// Saves a held message as a task. Two presses of Save file it once. Filing
// never touches the current task, its branch or the conversation; with
// nothing current, the task itself starts, never a new feature.
export const fileTask = async (p: Ports, ctx: Ctx, input: FileInput): Promise<void> => {
  const pick = input.parent ?? { kind: 'none' }
  if (input.parent === null || (pick.kind === 'new' && pick.title.trim() === '')) {
    await p.set('notice', pick.kind === 'new' ? 'Name the new feature first.' : 'Pick what it is part of first, or On its own.')

    return
  }
  if (filing.has(input.text)) return
  filing.add(input.text)
  try {
    let result: FileResult
    try {
      result = await fileTaskUseCase(tasksDepsOf(p, ctx), ctx, input)
    } catch (err) {
      p.log(`saving the task failed: ${err instanceof Error ? err.message : String(err)}`)
      await p.set('notice', "Couldn't save the task. Try Save again.")

      return
    }
    if (result.kind === 'unreadable') {
      await markUnreadable(p, ctx)

      return
    }
    await p.set('record', result.record)
    if (result.kind === 'refused') {
      await p.set('notice', result.notice)

      return
    }

    await closeBand(p)
    const { task, parent } = result
    p.toast(`Queued: ${task.title} (${task.priority})${parent === null ? '' : ` · part of ${parent.title}`}`)
    if (currentTask(result.record.tasks, ctx) === null) await startTask(p, ctx, task.id)
  } finally {
    filing.delete(input.text)
  }
}

export async function pickBand(p: Ports, patch: Partial<{ priority: Priority; difficulty: Difficulty; parent: ParentPick }>) {
  const band = await p.get('band')
  if (band.kind === 'file') await p.set('band', { ...band, ...patch })
  if (band.kind === 'difficulty' && patch.difficulty !== undefined) {
    await p.set('band', { ...band, picked: patch.difficulty })
  }
}

export async function saveFile(p: Ports) {
  const band = await p.get('band')
  if (band.kind !== 'file' || live.ctx === null) return
  await fileTask(p, live.ctx, band)
}

// The name of the new feature a held message goes under.
export async function nameNewFeature(p: Ports, title: string) {
  const band = await p.get('band')
  if (band.kind === 'file') await p.set('band', { ...band, parent: { kind: 'new', title: title.trim() } })
}

// What a message filed with no check is offered under: a feature it names,
// or, with a feature active, the question.
async function parentFor(p: Ports, text: string) {
  const record = await p.get('record')

  return record === null ? null : guessParent(record, text, null)
}

export async function fileFromCommand(p: Ports, text: string) {
  await showBand(p, {
    kind: 'file',
    text,
    title: text.slice(0, 60),
    priority: 'mid',
    difficulty: 'medium',
    intent: 'improving',
    ...(await parentFor(p, text)),
  })
}
