import { isDraftKey } from '../../../../shared/brew_draft'
import { attendeesOf, MEETING_KEYS, meetingLinkOf, meetingTimeOf } from '../../../../shared/meetings'
import type { Meeting } from '../../../../shared/meetings'
import { cleanTag, INBOX, NOTE_LIMITS, noteTypeOf } from '../../../../shared/notes'
import type { NoteQuest, NoteType } from '../../../../shared/notes'

// A note on disk: front matter between --- lines, then the Markdown body.
// Queue-tea writes its values as JSON, which YAML reads too, so Obsidian shows
// them as properties. The title goes in aliases too, since Obsidian follows
// [[Title]] by file name or alias and the files are named by id; aliases holds
// the others, which are kept. rest is every front-matter line Queue-tea
// doesn't own, written back as it was read. A type Queue-tea doesn't know
// (type: book) is one of those; type and pinned are written only when set.
// A meeting's keys are written only when set too, and a link or time that
// doesn't read stays in rest as it was, until a new one is saved over it.
export type NoteFile = { title: string; folder: string; type: NoteType | null; isPinned: boolean; tags: string[]; meeting: Meeting; created: string; updated: string; isArchived: boolean; quests: NoteQuest[]; aliases: string[]; body: string; rest: string[] }

const OWNED = ['title', 'folder', 'type', 'pinned', 'tags', 'created', 'updated', 'archived', 'quests', 'aliases', MEETING_KEYS.attendees, MEETING_KEYS.link, MEETING_KEYS.start, MEETING_KEYS.end, MEETING_KEYS.zone] as const
type Owned = (typeof OWNED)[number]
const TIME_KEYS = [MEETING_KEYS.start, MEETING_KEYS.end, MEETING_KEYS.zone] as const

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
    ? value
        .filter((q): q is NoteQuest => typeof q?.id === 'string' && (q.item === null || typeof q.item === 'string'))
        // A draft's key and the quest it went under are kept when they read, and left off when they don't.
        .map(q => ({ id: q.id, item: q.item, ...(isDraftKey(q.key) ? { key: q.key } : {}), ...(q.under === null || typeof q.under === 'string' ? { under: q.under } : {}) }))
    : []

export const parseNote = (raw: string, name: string, fileTime: string): NoteFile => {
  const text = raw.replace(/\r\n/g, '\n')
  const lines = text.split('\n')
  const end = lines[0] === '---' ? lines.indexOf('---', 1) : -1
  const found: Partial<Record<Owned, unknown>> = {}
  // The lines each key was read from, to keep a value that doesn't read.
  const read: Partial<Record<Owned, string[]>> = {}
  const rest: string[] = []
  for (let i = 1; i < end; i += 1) {
    const line = lines[i]!
    const m = /^([A-Za-z_][\w-]*):\s?(.*)$/.exec(line)
    const key = m?.[1] as Owned | undefined
    if (m === null || key === undefined || !OWNED.includes(key) || (key === 'type' && noteTypeOf(jsonOr(m[2]!.trim())) === null)) {
      rest.push(line)
      continue
    }
    const from = i
    // A YAML list under the key: "tags:" then "  - idea" lines.
    if (m[2]!.trim() === '') {
      const items: string[] = []
      while (i + 1 < end && /^\s+-\s/.test(lines[i + 1]!)) items.push(lines[++i]!.replace(/^\s+-\s+/, ''))
      found[key] = items.map(jsonOr)
    } else found[key] = jsonOr(m[2]!.trim())
    read[key] = lines.slice(from, i + 1)
  }
  const kept = (...keys: Owned[]) => rest.push(...keys.flatMap(key => read[key] ?? []))
  const attendees = attendeesOf(found[MEETING_KEYS.attendees])
  if (attendees.length === 0) kept(MEETING_KEYS.attendees)
  const link = meetingLinkOf(found[MEETING_KEYS.link])
  if (link === null) kept(MEETING_KEYS.link)
  const time = meetingTimeOf(found[MEETING_KEYS.start], found[MEETING_KEYS.end], found[MEETING_KEYS.zone])
  if (time === null) kept(...TIME_KEYS)

  const title = textOf(found.title, NOTE_LIMITS.title) || name
  const aliases = (Array.isArray(found.aliases) ? found.aliases : typeof found.aliases === 'string' ? [found.aliases] : []).map(alias => textOf(alias, NOTE_LIMITS.title)).filter(alias => alias !== '' && alias !== title)

  return {
    title,
    folder: textOf(found.folder, NOTE_LIMITS.folder) || INBOX,
    type: noteTypeOf(found.type),
    isPinned: found.pinned === true || found.pinned === 'true',
    tags: tagsOf(found.tags),
    meeting: { attendees, link, time },
    created: textOf(found.created, 40) || fileTime,
    updated: textOf(found.updated, 40) || fileTime,
    isArchived: found.archived === true || found.archived === 'true',
    quests: questsOf(found.quests),
    aliases: [...new Set(aliases)],
    body: end === -1 ? text : lines.slice(end + 1).join('\n'),
    rest,
  }
}

// The rest without the lines of keys Queue-tea writes its own value for, and
// the lists under them: a type it knows, or a meeting's new link or time.
const without = (rest: readonly string[], keys: readonly string[]): string[] => {
  let isDropped = false

  return rest.filter(line => {
    isDropped = keys.some(key => line.startsWith(`${key}:`)) || (isDropped && /^\s/.test(line))

    return !isDropped
  })
}

// What a meeting writes, key by key, leaving out what isn't set.
const meetingLines = ({ attendees, link, time }: Meeting): string[] => [
  ...(attendees.length === 0 ? [] : [`${MEETING_KEYS.attendees}: ${JSON.stringify(attendees)}`]),
  ...(link === null ? [] : [`${MEETING_KEYS.link}: ${JSON.stringify(link)}`]),
  ...(time === null ? [] : [`${MEETING_KEYS.start}: ${JSON.stringify(time.start)}`, `${MEETING_KEYS.end}: ${JSON.stringify(time.end)}`, `${MEETING_KEYS.zone}: ${JSON.stringify(time.zone)}`]),
]

const replacedKeys = (note: NoteFile): string[] => [
  ...(note.type === null ? [] : ['type']),
  ...(note.meeting.attendees.length === 0 ? [] : [MEETING_KEYS.attendees]),
  ...(note.meeting.link === null ? [] : [MEETING_KEYS.link]),
  ...(note.meeting.time === null ? [] : TIME_KEYS),
]

export const noteText = (note: NoteFile): string =>
  [
    '---',
    `title: ${JSON.stringify(note.title)}`,
    `folder: ${JSON.stringify(note.folder)}`,
    ...(note.type === null ? [] : [`type: ${JSON.stringify(note.type)}`]),
    ...(note.isPinned ? ['pinned: true'] : []),
    `tags: ${JSON.stringify(note.tags)}`,
    ...meetingLines(note.meeting),
    `created: ${JSON.stringify(note.created)}`,
    `updated: ${JSON.stringify(note.updated)}`,
    `archived: ${note.isArchived}`,
    `quests: ${JSON.stringify(note.quests)}`,
    `aliases: ${JSON.stringify([note.title, ...note.aliases.filter(alias => alias !== note.title)])}`,
    ...without(note.rest, replacedKeys(note)),
    '---',
    note.body,
  ].join('\n')
