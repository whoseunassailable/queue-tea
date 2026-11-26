import type { HelperId, Task } from '../../../../../types'

// The one helper Branches sends to a merge with conflicts.
export const CONCILE_HELPER: HelperId = 'tea-concile'
export const CONCILE_ONLY = 'Only Tea-Concile reconciles a merge. Send it from this merge in Branches.'

// How much of each quest goes into Tea-Concile's order. The order is one
// argument on Claude Code's command line, so it stays well under the size a
// command line can carry.
export const CONCILE_LIMITS = { text: 1_200, item: 300, items: 12, landed: 6 } as const

// What Tea-Concile is told about the two sides of a merge. The quests come
// from Queue-tea's record: what Rohan filed and what the quest's checkpoint
// says was decided. `landed` are quests that reached the target after the
// task branched; null when Queue-tea couldn't work them out.
export type ConcileSides = {
  source: string
  target: string
  sourceQuest: Task | null
  targetQuest: Task | null
  landed: Task[] | null
}

const CONCILE_TEXT = {
  heading: "What each side of this merge was for, from Queue-tea's record. It is Rohan's own description of the work: use it to judge what each side meant, together with the commits.",
  task: (branch: string) => `The task branch, ${branch}:`,
  target: (branch: string) => `The target, ${branch}:`,
  noQuest: "Queue-tea's record has no quest for this branch. Read its commits to tell what it was for.",
  integration: (branch: string) => `${branch} is not a quest's branch. Read its commits since the task branched to tell what changed there.`,
  landed: (branch: string, source: string) => `Quests that reached ${branch} after ${source} branched off it:`,
  noneLanded: (branch: string) => `No quest in Queue-tea's record reached ${branch} after the task branched.`,
  landedUnknown: (branch: string) => `Queue-tea couldn't work out which quests reached ${branch} after the task branched. Read the commits on ${branch} since the merge base.`,
  more: (count: number) => `…and ${count} more, not listed here.`,
  quest: (title: string, branch: string | null) => (branch === null ? `Quest "${title}"` : `Quest "${title}" (${branch})`),
  forLine: 'What it is for:',
  done: 'Done when:',
  decisions: 'Decided along the way:',
  ruledOut: 'Ruled out:',
} as const

const clip = (text: string, limit: number): string => {
  const flat = text.trim()

  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat
}

const list = (label: string, items: readonly string[]): string[] => {
  const shown = items.map(item => item.trim()).filter(Boolean)
  if (shown.length === 0) return []

  return [label, ...shown.slice(0, CONCILE_LIMITS.items).map(item => `- ${clip(item, CONCILE_LIMITS.item)}`)]
}

// One quest, as the lines Tea-Concile reads.
export const questLines = (quest: Task): string[] => [
  CONCILE_TEXT.quest(clip(quest.title, CONCILE_LIMITS.item), quest.branch),
  ...(quest.description?.trim() ? [`${CONCILE_TEXT.forLine} ${clip(quest.description, CONCILE_LIMITS.text)}`] : []),
  ...list(CONCILE_TEXT.done, quest.criteria),
  ...list(CONCILE_TEXT.decisions, quest.checkpoint?.decisions ?? []),
  ...list(CONCILE_TEXT.ruledOut, quest.checkpoint?.rejected ?? []),
]

// The part of the order that carries both quests' intent (Q08.6).
export const concileBrief = (sides: ConcileSides): string => {
  const landed = sides.landed === null
    ? [CONCILE_TEXT.landedUnknown(sides.target)]
    : sides.landed.length === 0
      ? [CONCILE_TEXT.noneLanded(sides.target)]
      : [
          CONCILE_TEXT.landed(sides.target, sides.source),
          ...sides.landed.slice(0, CONCILE_LIMITS.landed).flatMap(quest => ['', ...questLines(quest)]),
          ...(sides.landed.length > CONCILE_LIMITS.landed ? ['', CONCILE_TEXT.more(sides.landed.length - CONCILE_LIMITS.landed)] : []),
        ]

  return [
    CONCILE_TEXT.heading,
    '',
    CONCILE_TEXT.task(sides.source),
    ...(sides.sourceQuest === null ? [CONCILE_TEXT.noQuest] : questLines(sides.sourceQuest)),
    '',
    CONCILE_TEXT.target(sides.target),
    ...(sides.targetQuest === null ? [CONCILE_TEXT.integration(sides.target)] : questLines(sides.targetQuest)),
    '',
    ...landed,
  ].join('\n')
}
