import type { Difficulty, HelperId, ParentPick, Platform, Priority, TestProfileId } from '../../../../../types'
import { logFileIn } from '../../../../../hooks/features/tasks/domain/services/task_rules'
import { NEW_PARENT } from '../../../../../hooks/features/tasks/domain/usecases/file_task'
import { isDay } from '../../../../shared/calendar'
import type { NewQuest, QuestEdit, Seal } from '../../../../shared/engine_api'
import { defaultHelpers, isQuestHelperId, onlyHelpers } from '../../../../../hooks/shared/records/domain/services/helpers'
import { isTestProfileId } from '../../../../../hooks/shared/records/domain/services/test_profile'
import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'

const TITLE_LIMIT = 200
const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']
const PLATFORMS: readonly Platform[] = ['claude', 'codex']

// Everything from the window is checked again here: a screen's checks are for
// the person using it, and these are for the record.

export const questIdOf = (value: unknown): string => {
  if (typeof value !== 'string' || value === '') throw new Refusal(MESSAGES.badQuest)

  return value
}

// Quest ids, each once, in their order.
export const questIdsOf = (value: unknown): string[] => {
  if (!Array.isArray(value)) throw new Refusal(MESSAGES.badQuest)

  return [...new Set(value.map(questIdOf))]
}

export const priorityOf = (value: unknown): Priority => {
  if (!PRIORITIES.includes(value as Priority)) throw new Refusal(MESSAGES.badValue)

  return value as Priority
}

export const platformOf = (value: unknown): Platform => {
  if (!PLATFORMS.includes(value as Platform)) throw new Refusal(MESSAGES.badPlatform)

  return value as Platform
}

export const difficultyOf = (value: unknown): Difficulty => {
  if (!DIFFICULTIES.includes(value as Difficulty)) throw new Refusal(MESSAGES.badValue)

  return value as Difficulty
}

const titleOf = (value: unknown): string => {
  const title = typeof value === 'string' ? value.trim() : ''
  if (title === '') throw new Refusal(MESSAGES.titleRequired)
  if (title.length > TITLE_LIMIT) throw new Refusal(MESSAGES.titleTooLong)

  return title
}

const descriptionOf = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') throw new Refusal(MESSAGES.badValue)

  return value.trim() === '' ? null : value.trim()
}

const criteriaOf = (value: unknown): string[] => {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.some(line => typeof line !== 'string')) throw new Refusal(MESSAGES.badValue)

  return (value as string[]).map(line => line.trim()).filter(line => line !== '')
}

const helpersOf = (value: unknown): HelperId[] => {
  // Tea-Concile works on merges, so a quest can't turn it on.
  if (!Array.isArray(value) || !value.every(isQuestHelperId)) throw new Refusal(MESSAGES.badValue)

  return onlyHelpers(value)
}

export const parentOf = (value: unknown): ParentPick => {
  const pick = value as { kind?: unknown; id?: unknown; ids?: unknown; title?: unknown } | null
  if (pick?.kind === 'none') return { kind: 'none' }
  if (pick?.kind === 'task') return { kind: 'task', id: questIdOf(pick.id) }
  if (pick?.kind === 'new') return { kind: 'new', title: titleOf(pick.title) }
  if (pick?.kind === 'several') {
    const several = { kind: 'several' as const, ids: questIdsOf(pick.ids), title: pick.title === null ? null : titleOf(pick.title) }
    // Several means two or more; one or none has a pick of its own.
    if (several.ids.length + (several.title === null ? 0 : 1) < 2) throw new Refusal(MESSAGES.badValue)

    return several
  }
  throw new Refusal(MESSAGES.badValue)
}

// The sagas a pick puts a quest under, with 'new' for one filed with it.
const pickedParents = (pick: ParentPick): string[] => {
  if (pick.kind === 'task') return [pick.id]
  if (pick.kind === 'new') return [NEW_PARENT]
  if (pick.kind === 'several') return [...pick.ids, ...(pick.title === null ? [] : [NEW_PARENT])]

  return []
}

// A criteria set for each saga, by the saga's id; null for one set. Only
// sagas the quest is part of may have one.
const criteriaSetsOf = (value: unknown, parents: string[] | null): Record<string, string[]> | null => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'object' || Array.isArray(value)) throw new Refusal(MESSAGES.badValue)
  const entries = Object.entries(value as Record<string, unknown>)
  if (parents !== null && entries.some(([id]) => !parents.includes(id))) throw new Refusal(MESSAGES.badValue)

  return Object.fromEntries(entries.map(([id, lines]) => [questIdOf(id), criteriaOf(lines)]))
}

export const newQuestOf = (value: unknown): NewQuest => {
  const v = (value ?? {}) as Record<string, unknown>
  const parent = parentOf(v.parent)
  const parents = pickedParents(parent)

  return {
    title: titleOf(v.title),
    priority: priorityOf(v.priority),
    difficulty: difficultyOf(v.difficulty),
    parent,
    description: descriptionOf(v.description),
    criteria: criteriaOf(v.criteria),
    // A set for each saga needs two or more of them.
    criteriaByParent: parents.length < 2 ? null : criteriaSetsOf(v.criteriaByParent, parents),
    helpers: v.helpers === undefined ? defaultHelpers().on : helpersOf(v.helpers),
  }
}

const testProfileOf = (value: unknown): TestProfileId | null => {
  if (value !== null && !isTestProfileId(value)) throw new Refusal(MESSAGES.badValue)

  return value
}

// A day such as 2026-12-01, or null to clear it.
const dueOf = (value: unknown): string | null => {
  if (value === null) return null
  if (!isDay(value)) throw new Refusal(MESSAGES.dueBad)

  return value
}

export const questEditOf = (value: unknown): QuestEdit => {
  const v = (value ?? {}) as Record<string, unknown>

  return {
    ...(v.title === undefined ? {} : { title: titleOf(v.title) }),
    ...(v.description === undefined ? {} : { description: descriptionOf(v.description) }),
    ...(v.criteria === undefined ? {} : { criteria: criteriaOf(v.criteria) }),
    ...(v.criteriaByParent === undefined ? {} : { criteriaByParent: criteriaSetsOf(v.criteriaByParent, null) }),
    ...(v.difficulty === undefined ? {} : { difficulty: difficultyOf(v.difficulty) }),
    ...(v.helpers === undefined ? {} : { helpers: helpersOf(v.helpers) }),
    ...(v.testProfile === undefined ? {} : { testProfile: testProfileOf(v.testProfile) }),
    ...(v.due === undefined ? {} : { due: dueOf(v.due) }),
  }
}

// The task log's path, or null when none was given. A file, on one line.
export const logPathOf = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  const path = typeof value === 'string' ? value.trim() : ''
  if (path === '') throw new Refusal(MESSAGES.logPathRequired)
  if (path.endsWith('/') || /[\r\n\0]/.test(path)) throw new Refusal(MESSAGES.logPathBad)

  return path
}

// As above, and inside this realm: one realm's log never lands in another.
export const logPathIn = (value: unknown, projectPath: string): string | null => {
  const path = logPathOf(value)
  if (path !== null && logFileIn(projectPath, path) === null) throw new Refusal(MESSAGES.logPathOutside)

  return path
}

export const sealOf = (value: unknown): Seal => {
  const v = (value ?? {}) as { waitFor?: unknown; reason?: unknown }
  if (typeof v.waitFor === 'string' && v.waitFor !== '') return { waitFor: v.waitFor }
  if (typeof v.reason === 'string' && v.reason.trim() !== '') return { reason: v.reason.trim() }
  throw new Refusal(MESSAGES.reasonRequired)
}
