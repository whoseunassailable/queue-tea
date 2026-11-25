import type { Difficulty, HelperId, Task, TestProfileId } from '../../../../../types'
import { onlyHelpers } from '../../../../shared/records/domain/services/helpers'
import type { Deps } from './deps'

export type TaskEdit = {
  title?: string
  description?: string | null
  criteria?: string[]
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
// A null clears the field, so the task reads as one saved before it existed.
const cleared = (t: Task, edit: TaskEdit): Task => {
  const kept = edit.testProfile === null ? withoutProfile(t) : t

  return edit.due === null ? withoutDue(kept) : kept
}

// Changes what a task says about itself. A finished task keeps what it said.
export const editTaskUseCase = (d: Pick<Deps, 'records'>, taskId: string, edit: TaskEdit) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && (t.state === 'queued' || t.state === 'current') ? edited(cleared(t, edit), edit) : t)),
  }))
