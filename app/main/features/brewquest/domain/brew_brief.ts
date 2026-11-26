import type { RealmQuest } from '../../../../shared/brew_draft'
import { BREW_LIMITS, EFFORT_POINTS } from '../../../../shared/brew_draft'
import type { Note } from '../../../../shared/notes'

// The order BrewQuest gets: the note, the notes beside it, the realm's quests
// and what past reviews taught it, with how to answer. Claude reads the realm's
// own files itself; this names the ones that explain the project.
export const BRIEF_LIMITS = { note: 40_000, linked: 8_000, quests: 400, questLine: 240, files: 12, lessons: 12, order: 200_000 } as const

// Files that explain a project, read before drafting when they exist.
export const CONTEXT_FILES = ['CLAUDE.md', 'AGENTS.md', 'README.md', 'docs/architecture.md', 'docs/spec.md', 'docs/roadmap.md', 'docs/plan.md'] as const

export const DRAFT_BLOCK = 'brewquest-draft'

export type BriefInput = {
  realm: { name: string; path: string }
  note: Pick<Note, 'id' | 'title' | 'body'>
  linked: Pick<Note, 'id' | 'title' | 'body'>[]
  quests: readonly RealmQuest[]
  files: string[]
  lessons: string[]
}

const clip = (text: string, limit: number) => (text.length > limit ? `${text.slice(0, limit)}\n[… cut at ${limit.toLocaleString('en')} characters]` : text)
// A note's text can't close the tag it sits in.
const fenced = (title: string, body: string, limit: number) => `<note title=${JSON.stringify(title)}>\n${clip(body, limit).replace(/<\/note>/gi, '</ note>')}\n</note>`
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()

const questLine = (quest: RealmQuest) => {
  const under = quest.parentIds.length === 0 ? '' : ` | under ${quest.parentIds.join(', ')}`
  const about = quest.description === null ? '' : ` | ${oneLine(quest.description)}`

  return clip(`${quest.id} | ${quest.state} | ${quest.priority} | ${oneLine(quest.title)}${under}${about}`, BRIEF_LIMITS.questLine).split('\n')[0]!
}

// The quests BrewQuest is shown: the open ones first, then the done ones, newest last.
const shownQuests = (quests: readonly RealmQuest[]) => {
  const live = quests.filter(quest => quest.state !== 'removed')
  const open = live.filter(quest => quest.state !== 'done')
  const done = live.filter(quest => quest.state === 'done')

  return [...open, ...done].slice(0, BRIEF_LIMITS.quests)
}

const EXAMPLE = {
  understood: 'One sentence on what the note asks for.',
  groups: [
    {
      parent: { existing: 't-1a2b3c4d' },
      why: 'The note fixes what this quest is already about.',
      quests: [
        {
          key: 'q1',
          title: 'Count terminal time toward a quest',
          summary: 'What the quest is for and why, in one or two sentences.',
          priority: 'high',
          difficulty: 'medium',
          points: 3,
          criteria: ['A check a test or a look at the screen can confirm.'],
          waitsFor: [],
          sources: [{ note: 'The note title', quote: "words copied exactly from that note" }],
          doubts: ["What the note doesn't settle."],
          match: null,
          item: null,
        },
      ],
    },
    { parent: { new: 'Title of a new parent quest' }, why: 'Why these belong together.', quests: [] },
    { parent: null, why: 'Quests that stand on their own.', quests: [] },
  ],
  questions: ['A decision Rohan has to make before this plan holds.'],
  missing: ['Context you looked for and could not find.'],
  files: ['docs/architecture.md'],
}

export const briefOf = ({ realm, note, linked, quests, files, lessons }: BriefInput): string => {
  const shown = shownQuests(quests)
  const live = quests.filter(quest => quest.state !== 'removed').length
  const parts = [
    'You are BrewQuest. Read the note below and draft quests from it for Rohan to review in the Queue-tea app. You only read: you never edit a file, file a quest or run a command. Nothing you draft is filed until Rohan approves it.',
    [
      '## How to draft',
      '',
      '1. Understand the project before proposing work. When an idea belongs under an existing quest, put it there instead of starting a new one. "Fix the sidebar formatting" goes under an existing UI refinement quest when there is one.',
      '2. Group related requirements under one parent: an existing open quest that is not itself under another (by its id), a new parent you name, or none when a quest stands alone. Never scatter one feature into unrelated quests.',
      `3. For each quest give: a key (q1, q2, …), a title (a short phrase, at most 80 characters), a summary, priority (urgent, high, mid, okay or low), difficulty (light, medium or hard), points for its relative size (${EFFORT_POINTS.join(', ')}; never hours), up to five acceptance criteria a test or a look at the screen can check, waitsFor (keys in your draft or ids of existing quests it can't start before), sources (each a note's title and words copied exactly from it), doubts (what the note doesn't confirm), match (an existing quest that already covers it: kind same or overlaps, with why) and item (the exact text of the unticked checklist line it came from, or null).`,
      '4. Never invent project facts. A decision Rohan has to make goes in questions. Context you looked for and could not find goes in missing.',
      '5. Leave out work the note does not ask for, and work an existing quest already covers unless the note adds to it; say so with match.',
      '6. List in files the realm files you read.',
      '',
      `Answer with one fenced block tagged ${DRAFT_BLOCK} holding JSON shaped like this example, and nothing after it:`,
      '',
      `\`\`\`${DRAFT_BLOCK}`,
      JSON.stringify(EXAMPLE, null, 2),
      '```',
    ].join('\n'),
    `## The realm\n\n${realm.name}, in ${realm.path}, which is your working folder. Before drafting, read what explains the project${files.length === 0 ? ' (none of the usual files are there, so look for a README or a docs folder)' : `: ${files.slice(0, BRIEF_LIMITS.files).join(', ')}`}. Read code only where the note's words need it to be understood.`,
    `## The note\n\n${fenced(note.title, note.body, BRIEF_LIMITS.note)}`,
    ...(linked.length === 0 ? [] : [`## Notes linked from it or to it\n\nRelated ideas. A quest may come from them too; quote the note it came from.\n\n${linked.slice(0, BREW_LIMITS.linked).map(other => fenced(other.title, other.body, BRIEF_LIMITS.linked)).join('\n\n')}`]),
    ...(lessons.length === 0 ? [] : [`## What Rohan's past reviews of your drafts showed\n\n${lessons.slice(0, BRIEF_LIMITS.lessons).map(lesson => `- ${lesson}`).join('\n')}\n\nLean on these, but the note comes first.`]),
    `## Quests already in the realm\n\nOne per line: id | state | priority | title | under (the parent's id) | description.${shown.length < live ? ` Only the first ${shown.length} of ${live} are listed.` : ''}\n\n${shown.length === 0 ? '(none yet)' : shown.map(questLine).join('\n')}`,
  ]

  // Only the quest list can run long enough to be cut, and it comes last.
  return clip(`${parts.join('\n\n')}\n\nAnswer with the ${DRAFT_BLOCK} block only.`, BRIEF_LIMITS.order)
}
