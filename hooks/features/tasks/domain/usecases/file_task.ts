import type { Difficulty, Intent, ParentPick, Priority, ProjectRecord, Task } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { parentOf, parentRefusal } from '../../../../shared/backlog/domain/services/families'
import { newTask } from '../../../../shared/records/domain/services/queue_rules'
import { isoLocal } from '../../../../shared/time/domain/services/time'
import type { Deps } from './deps'

export type FileInput = {
  text: string
  title: string
  priority: Priority
  difficulty: Difficulty
  intent: Intent
  parent?: ParentPick | null
  description?: string | null
  criteria?: string[]
}

export type FileResult =
  | { kind: 'filed'; task: Task; parent: Task | null; record: ProjectRecord }
  | { kind: 'refused'; notice: string; record: ProjectRecord }
  | { kind: 'unreadable' }

// Saves a held message as a task: on its own, under a feature, or under a new
// feature filed with it. A failed write throws.
export const fileTaskUseCase = async (d: Deps, ctx: Ctx, input: FileInput): Promise<FileResult> => {
  const pick = input.parent ?? { kind: 'none' as const }
  const now = isoLocal(await d.env.now(), ctx.offsetMinutes)
  const feature =
    pick.kind === 'new'
      ? newTask({ title: pick.title.trim(), priority: input.priority, difficulty: 'medium', messages: [], now, id: d.env.newId() })
      : null
  const task: Task = {
    ...newTask({
      title: input.title,
      priority: input.priority,
      difficulty: input.difficulty,
      messages: [input.text],
      now,
      id: d.env.newId(),
      parentId: pick.kind === 'task' ? pick.id : (feature?.id ?? null),
    }),
    description: input.description ?? null,
    criteria: input.criteria ?? [],
  }
  // The feature may have gone since the band went up: checked against the
  // record as it is now.
  let refused = null as string | null
  const saved = await d.records.update(r => {
    refused = pick.kind === 'task' ? parentRefusal(r.tasks, task.id, pick.id) : null

    return refused === null ? { ...r, tasks: [...r.tasks, ...(feature === null ? [] : [feature]), task] } : r
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (refused !== null) return { kind: 'refused', notice: `${refused} Pick again.`, record: saved }

  return { kind: 'filed', task, parent: parentOf(task, saved.tasks), record: saved }
}
