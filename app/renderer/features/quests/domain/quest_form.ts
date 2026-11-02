import { logFileIn } from '../../../../../hooks/features/tasks/domain/services/task_rules'
import type { Difficulty, ParentPick, Priority } from '../../../../../types'
import type { NewQuest, Seal } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'

const TITLE_LIMIT = 200

// 'unset' is the answer not given yet; 'none' is On its own; 'new' a new saga;
// anything else the id of the quest it goes under.
export type QuestForm = {
  title: string
  priority: Priority
  difficulty: Difficulty
  part: string
  sagaTitle: string
  description: string
  criteria: string
}

export type QuestField = 'title' | 'part' | 'sagaTitle'
export type QuestErrors = Partial<Record<QuestField, string>>

export const emptyQuestForm = (part: string): QuestForm => ({ title: '', priority: 'mid', difficulty: 'medium', part, sagaTitle: '', description: '', criteria: '' })

export const titleError = (title: string): string | undefined => {
  const trimmed = title.trim()
  if (trimmed === '') return t.form.titleRequired

  return trimmed.length > TITLE_LIMIT ? t.form.titleLong : undefined
}

export const validateQuest = (form: QuestForm): QuestErrors => ({
  ...(titleError(form.title) === undefined ? {} : { title: titleError(form.title)! }),
  ...(form.part === 'unset' ? { part: t.form.pickPart } : {}),
  // Required only because of the answer above it.
  ...(form.part === 'new' && form.sagaTitle.trim() === '' ? { sagaTitle: t.form.sagaRequired } : {}),
})

const parentOf = (form: QuestForm): ParentPick => {
  if (form.part === 'new') return { kind: 'new', title: form.sagaTitle.trim() }

  return form.part === 'none' || form.part === 'unset' ? { kind: 'none' } : { kind: 'task', id: form.part }
}

export const questOf = (form: QuestForm): NewQuest => ({
  title: form.title.trim(),
  priority: form.priority,
  difficulty: form.difficulty,
  parent: parentOf(form),
  description: form.description.trim() === '' ? null : form.description.trim(),
  criteria: form.criteria
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== ''),
})

export type SealForm = { waitFor: string | null; reason: string }

export const sealError = (form: SealForm): string | undefined => (form.waitFor === null && form.reason.trim() === '' ? t.form.sealRequired : undefined)

export const sealOf = (form: SealForm): Seal => (form.waitFor !== null ? { waitFor: form.waitFor } : { reason: form.reason.trim() })

// A file, on one line, inside the realm. Main checks the same again.
export const logPathError = (path: string, realmPath: string): string | undefined => {
  const trimmed = path.trim()
  if (trimmed === '') return t.finish.pathRequired
  if (trimmed.endsWith('/') || /[\r\n]/.test(trimmed)) return t.finish.pathBad

  return logFileIn(realmPath, trimmed) === null ? t.finish.pathOutside : undefined
}
