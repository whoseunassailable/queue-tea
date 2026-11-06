import { defaultHelpers, onlyHelpers } from '../../../../../hooks/shared/records/domain/services/helpers'
import type { Priority } from '../../../../../types'
import { DESIGNS_FOLDER, folderOf, isHex, isOpen, LIMITS, suggestLabel } from '../../../../shared/designs'
import type { DesignComment } from '../../../../shared/designs'
import type { NewQuest } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'

export const commentError = (text: string): string | undefined => {
  const trimmed = text.trim()
  if (trimmed === '') return t.designs.commentRequired

  return trimmed.length > LIMITS.comment ? t.designs.commentLong : undefined
}

// from: the version the next one starts from; null for a realm's first.
// edited: the fields changed by hand, which a new label leaves alone.
export type Drafted = 'title' | 'description' | 'criteria'
export type NextForm = { from: { label: string; folder: string } | null; label: string; title: string; description: string; criteria: string; priority: Priority; edited: Partial<Record<Drafted, true>> }
export type NextField = 'label' | 'title'
export type NextErrors = Partial<Record<NextField, string>>

export const labelError = (label: string, taken: readonly string[]): string | undefined => {
  const trimmed = label.trim()
  if (trimmed === '') return t.designs.labelRequired
  if (trimmed.length > LIMITS.label) return t.designs.labelLong
  if (folderOf(trimmed) === '') return t.designs.labelNoLetters

  return taken.includes(folderOf(trimmed)) ? t.designs.labelTaken(trimmed) : undefined
}

export const titleError = (title: string): string | undefined => {
  const trimmed = title.trim()
  if (trimmed === '') return t.designs.questTitleRequired

  return trimmed.length > LIMITS.title ? t.designs.questTitleLong : undefined
}

export const validateNext = (form: NextForm, taken: readonly string[]): NextErrors => {
  const label = labelError(form.label, taken)
  const title = titleError(form.title)

  return { ...(label === undefined ? {} : { label }), ...(title === undefined ? {} : { title }) }
}

// Names to quote comments by: each design's name, and its layers' names.
export type Names = Record<string, { name: string; layers: Record<string, string> }>

const lineOf = (c: DesignComment, names: Names) => {
  const design = names[c.design]
  const where = design?.name ?? c.design
  const on = c.on === null ? null : (design?.layers[c.on] ?? c.on)

  return `${on === null ? where : `${where} · ${on}`}: ${c.text.replace(/\s+/g, ' ')}`
}

// What the quest says for a label, built from the version it starts from.
const draftOf = (realm: string, from: NextForm['from'], comments: readonly DesignComment[], names: Names, label: string): Record<Drafted, string> => {
  const folder = `${DESIGNS_FOLDER}/${folderOf(label)}/`
  if (from === null) return { title: t.designs.firstTitle(realm), description: t.designs.firstDescription(realm, folder), criteria: t.designs.firstVersionLine(`${folder}version.json`) }

  return {
    title: t.designs.nextTitle(label, from.label),
    description: t.designs.nextDescription(label, realm, folder, from.label, `${DESIGNS_FOLDER}/${from.folder}/`),
    criteria: [...comments.filter(isOpen).map(c => lineOf(c, names)), t.designs.nextVersionLine(`${folder}version.json`, from.label)].join('\n'),
  }
}

// A realm's first version is suggested as the one after 0, so "1".
export const nextFormOf = (realm: string, from: NextForm['from'], comments: readonly DesignComment[], names: Names, taken: readonly string[]): NextForm => {
  const label = suggestLabel(from?.label ?? '0', taken)

  return { from, label, ...draftOf(realm, from, comments, names, label), priority: 'mid', edited: {} }
}

export const relabel = (form: NextForm, label: string, realm: string, comments: readonly DesignComment[], names: Names): NextForm => {
  const draft = draftOf(realm, form.from, comments, names, label)

  return { ...form, label, title: form.edited.title ? form.title : draft.title, description: form.edited.description ? form.description : draft.description, criteria: form.edited.criteria ? form.criteria : draft.criteria }
}

export const questOfNext = (form: NextForm): NewQuest => ({
  title: form.title.trim(),
  priority: form.priority,
  difficulty: 'medium',
  parent: { kind: 'none' },
  description: form.description.trim() === '' ? null : form.description.trim(),
  criteria: form.criteria
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== ''),
  // Mocha Mockup drafts the version; agents/mocha-mockup.md has the format.
  helpers: onlyHelpers([...defaultHelpers().on, 'mocha-mockup']),
})

// An inspector field: a whole number from low to high, or a colour.
export const numberError = (text: string, low: number, high: number, name: string): string | undefined => {
  const value = Number(text.trim())

  return text.trim() === '' || !Number.isFinite(value) || value < low || value > high ? t.designs.numberRange(name, low, high) : undefined
}

export const colourError = (text: string): string | undefined => (isHex(text.trim()) ? undefined : t.designs.colourBad)
