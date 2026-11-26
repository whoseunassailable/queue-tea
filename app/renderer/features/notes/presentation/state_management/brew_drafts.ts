import type { BrewDraft } from '../../../../../shared/brew_draft'

// The last draft Claude made of each note, kept while the app runs so that
// closing the sheet and opening it again doesn't read the note again. It's
// used only while the note's text is as it was read, for half an hour, and
// a draft that fell back to the checklist is never kept. Keyed by the engine,
// so each window, and each test, has its own.
export const DRAFT_KEPT_MS = 30 * 60_000

type Kept = { body: string; draft: BrewDraft; at: number }
const drafts = new WeakMap<object, Map<string, Kept>>()
const keyOf = (realm: string, noteId: string) => `${realm}/${noteId}`

export const keptDraft = (engine: object, realm: string, note: { id: string; body: string }, now = Date.now()): BrewDraft | null => {
  const kept = drafts.get(engine)?.get(keyOf(realm, note.id))

  return kept !== undefined && kept.body === note.body && now - kept.at < DRAFT_KEPT_MS ? kept.draft : null
}

export const keepDraft = (engine: object, realm: string, note: { id: string; body: string }, draft: BrewDraft, now = Date.now()): void => {
  if (draft.by !== 'claude' || draft.trouble !== null) return
  const kept = drafts.get(engine) ?? new Map<string, Kept>()
  kept.set(keyOf(realm, note.id), { body: note.body, draft, at: now })
  drafts.set(engine, kept)
}

export const forgetDraft = (engine: object, realm: string, noteId: string): void => void drafts.get(engine)?.delete(keyOf(realm, noteId))
