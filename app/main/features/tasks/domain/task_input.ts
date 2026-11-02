import type { Difficulty, ParentPick, Priority } from '../../../../../types'
import type { NewQuest, QuestEdit, Seal } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'

const TITLE_LIMIT = 200
const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

// Everything from the window is checked again here: a screen's checks are for
// the person using it, and these are for the record.

export const questIdOf = (value: unknown): string => {
  if (typeof value !== 'string' || value === '') throw new Refusal(MESSAGES.badQuest)

  return value
}

export const priorityOf = (value: unknown): Priority => {
  if (!PRIORITIES.includes(value as Priority)) throw new Refusal(MESSAGES.badValue)

  return value as Priority
}

const difficultyOf = (value: unknown): Difficulty => {
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

const parentOf = (value: unknown): ParentPick => {
  const pick = value as { kind?: unknown; id?: unknown; title?: unknown } | null
  if (pick?.kind === 'none') return { kind: 'none' }
  if (pick?.kind === 'task') return { kind: 'task', id: questIdOf(pick.id) }
  if (pick?.kind === 'new') return { kind: 'new', title: titleOf(pick.title) }
  throw new Refusal(MESSAGES.badValue)
}

export const newQuestOf = (value: unknown): NewQuest => {
  const v = (value ?? {}) as Record<string, unknown>

  return {
    title: titleOf(v.title),
    priority: priorityOf(v.priority),
    difficulty: difficultyOf(v.difficulty),
    parent: parentOf(v.parent),
    description: descriptionOf(v.description),
    criteria: criteriaOf(v.criteria),
  }
}

export const questEditOf = (value: unknown): QuestEdit => {
  const v = (value ?? {}) as Record<string, unknown>

  return {
    ...(v.title === undefined ? {} : { title: titleOf(v.title) }),
    ...(v.description === undefined ? {} : { description: descriptionOf(v.description) }),
    ...(v.criteria === undefined ? {} : { criteria: criteriaOf(v.criteria) }),
    ...(v.difficulty === undefined ? {} : { difficulty: difficultyOf(v.difficulty) }),
  }
}

export const sealOf = (value: unknown): Seal => {
  const v = (value ?? {}) as { waitFor?: unknown; reason?: unknown }
  if (typeof v.waitFor === 'string' && v.waitFor !== '') return { waitFor: v.waitFor }
  if (typeof v.reason === 'string' && v.reason.trim() !== '') return { reason: v.reason.trim() }
  throw new Refusal(MESSAGES.reasonRequired)
}
