import type { Difficulty, HelperId, Task, TestProfileId } from '../../../../../types'
import { onlyHelpers } from '../../../../shared/records/domain/services/helpers'
import type { Deps } from './deps'

export type TaskEdit = {
  title?: string
  description?: string | null
  criteria?: string[]
  // Sets for some of its features, by their ids, each replacing that one's
  // set; features it isn't part of are left out. Null goes back to one set,
  // and `criteria` should then carry the lines to keep.
  criteriaByParent?: Record<string, string[]> | null
  difficulty?: Difficulty
  helpers?: HelperId[]
  // Rohan's pick, or null to let Tea-DD pick again.
  testProfile?: TestProfileId | null
  // The day it's due, as YYYY-MM-DD, or null for none.
  due?: string | null
}

const edited = (t: Task, edit: TaskEdit): Task => ({
  ...t,
  ...(edit.title === undefined ? {} : { title: edit.title }),
  ...(edit.description === undefined ? {} : { description: edit.description }),
  ...(edit.criteria === undefined ? {} : { criteria: edit.criteria }),
  ...(edit.difficulty === undefined ? {} : { difficulty: { ...t.difficulty, expected: edit.difficulty } }),
  ...(edit.helpers === undefined ? {} : { helpers: { ...t.helpers, on: onlyHelpers(edit.helpers) } }),
  ...(edit.testProfile === undefined || edit.testProfile === null ? {} : { testProfile: { id: edit.testProfile, by: 'rohan' as const } }),
  ...(edit.due === undefined || edit.due === null ? {} : { due: edit.due }),
})

const withoutProfile = ({ testProfile: _cleared, ...t }: Task): Task => t
const withoutDue = ({ due: _cleared, ...t }: Task): Task => t
const withoutSets = ({ criteriaByParent: _cleared, ...t }: Task): Task => t
// A null clears the field, so the task reads as one saved before it existed.
const cleared = (t: Task, edit: TaskEdit): Task => {
  const kept = edit.testProfile === null ? withoutProfile(t) : t
  const sets = edit.criteriaByParent === null ? withoutSets(kept) : kept

  return edit.due === null ? withoutDue(sets) : sets
}

// A set for each feature only under two or more, and only for features the
// task is part of; the sets it has for others stay as they were.
const withSets = (t: Task, sets: Record<string, string[]> | null | undefined): Task => {
  if (sets === undefined || sets === null || t.parentIds.length < 2) return t
  const given = Object.fromEntries(Object.entries(sets).filter(([id]) => t.parentIds.includes(id)))

  return { ...t, criteriaByParent: { ...Object.fromEntries(t.parentIds.map(id => [id, []])), ...t.criteriaByParent, ...given } }
}

// Changes what a task says about itself. A finished task keeps what it said.
export const editTaskUseCase = (d: Pick<Deps, 'records'>, taskId: string, edit: TaskEdit) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && (t.state === 'queued' || t.state === 'current') ? withSets(edited(cleared(t, edit), edit), edit.criteriaByParent) : t)),
  }))
