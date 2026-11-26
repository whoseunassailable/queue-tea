import type { Difficulty, HelperId, Intent, ParentPick, Priority, ProjectRecord, Task } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { homeOf, parentsRefusal } from '../../../../shared/backlog/domain/services/families'
import { defaultHelpers, onlyHelpers } from '../../../../shared/records/domain/services/helpers'
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
  // A set for each feature, by its id, with NEW_PARENT for a feature filed
  // with it; kept only with two features or more.
  criteriaByParent?: Record<string, string[]>
  helpers?: HelperId[]
}

// The key of a new feature's criteria set, before the feature has an id.
export const NEW_PARENT = 'new'

export type FileResult =
  | { kind: 'filed'; task: Task; parent: Task | null; record: ProjectRecord }
  | { kind: 'refused'; notice: string; record: ProjectRecord }
  | { kind: 'unreadable' }

// The features already there that a pick names, and the title of one filed
// with it, if any.
const partsOf = (pick: ParentPick): { ids: string[]; title: string | null } => {
  if (pick.kind === 'task') return { ids: [pick.id], title: null }
  if (pick.kind === 'new') return { ids: [], title: pick.title }
  if (pick.kind === 'several') return { ids: [...new Set(pick.ids)], title: pick.title }

  return { ids: [], title: null }
}

// The sets keyed by the features' ids, the new one's included; none under
// fewer than two features.
const setsOf = (sets: Record<string, string[]> | undefined, parentIds: string[], featureId: string | null): Record<string, string[]> | null => {
  if (sets === undefined || parentIds.length < 2) return null

  return Object.fromEntries(parentIds.map(id => [id, sets[id === featureId ? NEW_PARENT : id] ?? []]))
}

// Saves a held message as a task: on its own, under one feature or several,
// some of them perhaps a new feature filed with it. A failed write throws.
export const fileTaskUseCase = async (d: Deps, ctx: Ctx, input: FileInput): Promise<FileResult> => {
  const pick = input.parent ?? { kind: 'none' as const }
  const parts = partsOf(pick)
  const now = isoLocal(await d.env.now(), ctx.offsetMinutes)
  const feature =
    parts.title !== null
      ? newTask({ title: parts.title.trim(), priority: input.priority, difficulty: 'medium', messages: [], now, id: d.env.newId() })
      : null
  const parentIds = [...parts.ids, ...(feature === null ? [] : [feature.id])]
  const sets = setsOf(input.criteriaByParent, parentIds, feature?.id ?? null)
  const task: Task = {
    ...newTask({
      title: input.title,
      priority: input.priority,
      difficulty: input.difficulty,
      messages: [input.text],
      now,
      id: d.env.newId(),
      parentIds,
    }),
    description: input.description ?? null,
    criteria: input.criteria ?? [],
    ...(sets === null ? {} : { criteriaByParent: sets }),
    ...(input.helpers === undefined ? {} : { helpers: { ...defaultHelpers(), on: onlyHelpers(input.helpers) } }),
  }
  // A feature may have gone since the band went up: checked against the
  // record as it is now.
  let refused = null as string | null
  const saved = await d.records.update(r => {
    refused = parentsRefusal(r.tasks, task.id, parts.ids)

    return refused === null ? { ...r, tasks: [...r.tasks, ...(feature === null ? [] : [feature]), task] } : r
  })
  if (saved === 'unreadable') return { kind: 'unreadable' }
  if (refused !== null) return { kind: 'refused', notice: `${refused} Pick again.`, record: saved }

  return { kind: 'filed', task, parent: homeOf(task, saved.tasks), record: saved }
}
