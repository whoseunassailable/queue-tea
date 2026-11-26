import type { Task } from '../../../../../types'

// Words that say nothing about which work it is.
const FILLER = new Set([
  'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'it', 'its', 'is', 'be',
  'this', 'that', 'so', 'as', 'into', 'up', 'please', 'can', 'you', 'we', 'i', 'my', 'me', 'add', 'make', 'new', 'some',
])

// At least this share of the words of the two titles together must be the
// same for a task to count as the same work.
export const ALIKE_AT = 0.6

const wordsOf = (title: string): Set<string> =>
  new Set(
    title
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(w => w !== '' && !FILLER.has(w))
      // "quests" and "quest" are one word.
      .map(w => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w)),
  )

export const likeness = (a: string, b: string): number => {
  const x = wordsOf(a)
  const y = wordsOf(b)
  if (x.size === 0 || y.size === 0) return 0
  const shared = [...x].filter(w => y.has(w)).length

  return shared / (x.size + y.size - shared)
}

const RANK: Record<Task['state'], number> = { current: 0, queued: 1, done: 2, removed: 3 }

// The task a new piece of work looks the same as: one waiting, under way or
// already done, never a removed one. The most alike wins; on a tie, the one
// still open before the one done. Null when nothing is alike enough.
export const alikeTask = (tasks: readonly Task[], title: string): Task | null => {
  const found = tasks
    .filter(t => t.state !== 'removed')
    .map(t => ({ t, score: likeness(title, t.title) }))
    .filter(m => m.score >= ALIKE_AT)
    .sort((a, b) => b.score - a.score || RANK[a.t.state] - RANK[b.t.state])

  return found[0]?.t ?? null
}

// The filing band's field for it: the alike task's id, or nothing.
export const alikeOf = (tasks: readonly Task[], title: string): { alike?: string } => {
  const t = alikeTask(tasks, title)

  return t === null ? {} : { alike: t.id }
}
