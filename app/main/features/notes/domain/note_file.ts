import { cleanTag, INBOX, NOTE_LIMITS, noteTypeOf } from '../../../../shared/notes'
import type { NoteQuest, NoteType } from '../../../../shared/notes'

// A note on disk: front matter between --- lines, then the Markdown body.
// Queue-tea writes its values as JSON, which YAML reads too, so Obsidian shows
// them as properties. The title goes in aliases too, since Obsidian follows
// [[Title]] by file name or alias and the files are named by id; aliases holds
// the others, which are kept. rest is every front-matter line Queue-tea
// doesn't own, written back as it was read. A type Queue-tea doesn't know
// (type: book) is one of those; type and pinned are written only when set.
export type NoteFile = { title: string; folder: string; type: NoteType | null; isPinned: boolean; tags: string[]; created: string; updated: string; isArchived: boolean; quests: NoteQuest[]; aliases: string[]; body: string; rest: string[] }

const OWNED = ['title', 'folder', 'type', 'pinned', 'tags', 'created', 'updated', 'archived', 'quests', 'aliases'] as const
type Owned = (typeof OWNED)[number]

const jsonOr = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    // Not JSON: a plain YAML value, such as Obsidian writes. The text is the value.
    return text.replace(/^(['"])(.*)\1$/, '$2')
  }
}

const textOf = (value: unknown, most: number): string => (typeof value === 'string' ? value.trim().slice(0, most) : '')

const tagsOf = (value: unknown): string[] => {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  const tags = raw.map(tag => cleanTag(textOf(tag, NOTE_LIMITS.tag))).filter(tag => tag !== '')

  return [...new Set(tags)].slice(0, NOTE_LIMITS.tags)
}

const questsOf = (value: unknown): NoteQuest[] =>
  // shortcut: a quests line that isn't Queue-tea's JSON reads as none and is rewritten on the next save; upgrade if other tools start writing it.
  Array.isArray(value)
    ? value.filter((q): q is NoteQuest => typeof q?.id === 'string' && (q.item === null || typeof q.item === 'string')).map(q => ({ id: q.id, item: q.item }))
    : []

export const parseNote = (raw: string, name: string, fileTime: string): NoteFile => {
  const text = raw.replace(/\r\n/g, '\n')
  const lines = text.split('\n')
  const end = lines[0] === '---' ? lines.indexOf('---', 1) : -1
  const found: Partial<Record<Owned, unknown>> = {}
  const rest: string[] = []
  for (let i = 1; i < end; i += 1) {
    const line = lines[i]!
    const m = /^([A-Za-z_][\w-]*):\s?(.*)$/.exec(line)
    const key = m?.[1] as Owned | undefined
    if (m === null || key === undefined || !OWNED.includes(key) || (key === 'type' && noteTypeOf(jsonOr(m[2]!.trim())) === null)) {
      rest.push(line)
      continue
    }
    // A YAML list under the key: "tags:" then "  - idea" lines.
    if (m[2]!.trim() === '') {
      const items: string[] = []
      while (i + 1 < end && /^\s+-\s/.test(lines[i + 1]!)) items.push(lines[++i]!.replace(/^\s+-\s+/, ''))
      found[key] = items.map(jsonOr)
    } else found[key] = jsonOr(m[2]!.trim())
  }

  const title = textOf(found.title, NOTE_LIMITS.title) || name
  const aliases = (Array.isArray(found.aliases) ? found.aliases : typeof found.aliases === 'string' ? [found.aliases] : []).map(alias => textOf(alias, NOTE_LIMITS.title)).filter(alias => alias !== '' && alias !== title)

  return {
    title,
    folder: textOf(found.folder, NOTE_LIMITS.folder) || INBOX,
    type: noteTypeOf(found.type),
    isPinned: found.pinned === true || found.pinned === 'true',
    tags: tagsOf(found.tags),
    created: textOf(found.created, 40) || fileTime,
    updated: textOf(found.updated, 40) || fileTime,
    isArchived: found.archived === true || found.archived === 'true',
    quests: questsOf(found.quests),
    aliases: [...new Set(aliases)],
    body: end === -1 ? text : lines.slice(end + 1).join('\n'),
    rest,
  }
}

// The rest without a type line, and the list under it, once Queue-tea writes its own.
const withoutType = (rest: readonly string[]): string[] => {
  let isType = false

  return rest.filter(line => {
    isType = /^type:/.test(line) || (isType && /^\s/.test(line))

    return !isType
  })
}

export const noteText = (note: NoteFile): string =>
  [
    '---',
    `title: ${JSON.stringify(note.title)}`,
    `folder: ${JSON.stringify(note.folder)}`,
    ...(note.type === null ? [] : [`type: ${JSON.stringify(note.type)}`]),
    ...(note.isPinned ? ['pinned: true'] : []),
    `tags: ${JSON.stringify(note.tags)}`,
    `created: ${JSON.stringify(note.created)}`,
    `updated: ${JSON.stringify(note.updated)}`,
    `archived: ${note.isArchived}`,
    `quests: ${JSON.stringify(note.quests)}`,
    `aliases: ${JSON.stringify([note.title, ...note.aliases.filter(alias => alias !== note.title)])}`,
    ...(note.type === null ? note.rest : withoutType(note.rest)),
    '---',
    note.body,
  ].join('\n')
