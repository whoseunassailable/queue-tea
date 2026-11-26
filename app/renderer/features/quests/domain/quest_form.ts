import { defaultHelpers } from '../../../../../hooks/shared/records/domain/services/helpers'
import { logFileIn } from '../../../../../hooks/features/tasks/domain/services/task_rules'
import type { Difficulty, HelperId, ParentPick, Priority } from '../../../../../types'
import type { NewQuest, Seal } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'

const TITLE_LIMIT = 200

// What it is part of, in the order ticked: saga ids, and 'new' for a new saga,
// or 'none' alone for On its own. Empty is the answer not given yet.
export type QuestForm = {
  title: string
  priority: Priority
  difficulty: Difficulty
  parts: string[]
  sagaTitle: string
  description: string
  // Asked once two or more sagas are ticked: one set of criteria for every
  // saga, or a set for each, by its id or 'new'.
  criteriaMode: CriteriaMode
  criteria: string
  criteriaFor: Record<string, string>
  helpers: HelperId[]
}

export type CriteriaMode = 'one' | 'each'
export type QuestField = 'title' | 'part' | 'sagaTitle'
export type QuestErrors = Partial<Record<QuestField, string>>

export const emptyQuestForm = (parts: string[]): QuestForm => ({
  title: '',
  priority: 'mid',
  difficulty: 'medium',
  parts,
  sagaTitle: '',
  description: '',
  criteriaMode: 'one',
  criteria: '',
  criteriaFor: {},
  helpers: defaultHelpers().on,
})

// On its own clears the sagas, and a saga clears On its own.
export const tickPart = (parts: string[], part: string): string[] => {
  if (part === 'none') return parts.includes('none') ? [] : ['none']
  const sagas = parts.filter(p => p !== 'none')

  return sagas.includes(part) ? sagas.filter(p => p !== part) : [...sagas, part]
}

export const sagasOf = (form: Pick<QuestForm, 'parts'>): string[] => form.parts.filter(p => p !== 'none')

export const asksCriteriaMode = (form: Pick<QuestForm, 'parts'>): boolean => sagasOf(form).length >= 2

const isEach = (form: QuestForm): boolean => asksCriteriaMode(form) && form.criteriaMode === 'each'

// A set for each saga starts from what was written for all of them.
export const withCriteriaMode = (form: QuestForm, criteriaMode: CriteriaMode): QuestForm =>
  criteriaMode === 'one' ? { ...form, criteriaMode } : { ...form, criteriaMode, criteriaFor: Object.fromEntries(sagasOf(form).map(part => [part, form.criteriaFor[part] ?? form.criteria])) }

export const titleError = (title: string): string | undefined => {
  const trimmed = title.trim()
  if (trimmed === '') return t.form.titleRequired

  return trimmed.length > TITLE_LIMIT ? t.form.titleLong : undefined
}

export const validateQuest = (form: QuestForm): QuestErrors => ({
  ...(titleError(form.title) === undefined ? {} : { title: titleError(form.title)! }),
  ...(form.parts.length === 0 ? { part: t.form.pickPart } : {}),
  // Required only because of the answer above it.
  ...(form.parts.includes('new') && form.sagaTitle.trim() === '' ? { sagaTitle: t.form.sagaRequired } : {}),
})

const parentOf = (form: QuestForm): ParentPick => {
  const sagas = sagasOf(form)
  const ids = sagas.filter(part => part !== 'new')
  const title = sagas.includes('new') ? form.sagaTitle.trim() : null
  if (sagas.length >= 2) return { kind: 'several', ids, title }
  if (title !== null) return { kind: 'new', title }

  return ids[0] === undefined ? { kind: 'none' } : { kind: 'task', id: ids[0] }
}

const linesOf = (text: string): string[] =>
  text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')

export const questOf = (form: QuestForm): NewQuest => ({
  title: form.title.trim(),
  priority: form.priority,
  difficulty: form.difficulty,
  parent: parentOf(form),
  description: form.description.trim() === '' ? null : form.description.trim(),
  criteria: isEach(form) ? [] : linesOf(form.criteria),
  criteriaByParent: isEach(form) ? Object.fromEntries(sagasOf(form).map(part => [part, linesOf(form.criteriaFor[part] ?? '')])) : null,
  helpers: form.helpers,
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
