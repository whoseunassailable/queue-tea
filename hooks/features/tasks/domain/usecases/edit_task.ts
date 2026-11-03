import type { Difficulty, HelperId, Task } from '../../../../../types'
import { onlyHelpers } from '../../../../shared/records/domain/services/helpers'
import type { Deps } from './deps'

export type TaskEdit = {
  title?: string
  description?: string | null
  criteria?: string[]
  difficulty?: Difficulty
  helpers?: HelperId[]
}

const edited = (t: Task, edit: TaskEdit): Task => ({
  ...t,
  ...(edit.title === undefined ? {} : { title: edit.title }),
  ...(edit.description === undefined ? {} : { description: edit.description }),
  ...(edit.criteria === undefined ? {} : { criteria: edit.criteria }),
  ...(edit.difficulty === undefined ? {} : { difficulty: { ...t.difficulty, expected: edit.difficulty } }),
  ...(edit.helpers === undefined ? {} : { helpers: { ...t.helpers, on: onlyHelpers(edit.helpers) } }),
})

// Changes what a task says about itself. A finished task keeps what it said.
export const editTaskUseCase = (d: Pick<Deps, 'records'>, taskId: string, edit: TaskEdit) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && (t.state === 'queued' || t.state === 'current') ? edited(t, edit) : t)),
  }))
