import type { GitState } from '../entities/git_state'

// `git status --porcelain=v2 --branch`: the `#` lines describe the branch,
// every other line is one uncommitted file, untracked included.
export const parseStatus = (text: string): Omit<GitState, 'isRepo'> => {
  let branch: string | null = null
  let isDetached = false
  let head: string | null = null
  let hasUpstream = false
  let unpushed = 0
  let uncommitted = 0

  for (const line of text.split('\n')) {
    if (line === '') continue
    if (!line.startsWith('# ')) {
      uncommitted += 1
      continue
    }
    const [, key, value = ''] = line.match(/^# (\S+) ?(.*)$/) ?? []
    if (key === 'branch.oid') head = value === '(initial)' ? null : value.slice(0, 7)
    if (key === 'branch.head') {
      isDetached = value === '(detached)'
      branch = isDetached ? null : value
    }
    if (key === 'branch.upstream') hasUpstream = true
    if (key === 'branch.ab') unpushed = Number(value.match(/^\+(\d+)/)?.[1] ?? 0)
  }

  return { branch, isDetached, head, uncommitted, unpushed, hasUpstream }
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// What keeps a task from starting, in plain words; null when nothing does.
export const holdReason = (g: GitState): string | null => {
  if (!g.isRepo) return null
  if (g.isDetached) return 'Detached HEAD: check out a branch first'

  const parts = [
    g.uncommitted > 0 ? `${count(g.uncommitted, 'file', 'files')} not committed` : null,
    g.hasUpstream && g.unpushed > 0 ? `${count(g.unpushed, 'commit', 'commits')} not pushed` : null,
  ].filter(part => part !== null)
  if (parts.length > 0) return parts.join(' · ')
  // A branch never pushed holds a task only when it has commits no remote has.
  if (!g.hasUpstream && g.unpushed > 0) return 'This branch has never been pushed'

  return null
}

// Words a branch name does without.
const FILLER = new Set(
  (
    'a an the and or but nor of to for from in into on onto at by with without via as about than ' +
    'is are was were be been being it its this that these those there here ' +
    'i me my we us our you your he she they them their ' +
    'please pls can could would should will shall must may might need needs want wants let lets ' +
    'just also so then now some any all very really maybe still again ' +
    'make makes making get gets getting do does doing go going see try tell through'
  ).split(' '),
)
const SLUG_LENGTH = 30
const SLUG_WORDS = 4

// A branch's short name from a task title: up to four of its meaningful
// words, in order, at most 30 characters, without links, ports, filler
// words and punctuation. The same title always gives the same name.
export const branchSlug = (title: string): string => {
  const words = title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S*/g, ' ')
    .replace(/\bwww\.\S+/g, ' ')
    .replace(/\b(?:localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?/g, ' ')
    .replace(/:\d{2,5}\b/g, ' ')
    .replace(/\bports?\s*#?\d{2,5}\b/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter(w => w !== '')
  const meaningful = words.filter(w => !FILLER.has(w) && (w.length > 1 || /\d/.test(w)))
  const pool = meaningful.length > 0 ? meaningful : words

  // A word that would run past the length is passed over for a later one.
  const picked: string[] = []
  for (const word of pool) {
    if (picked.length === SLUG_WORDS) break
    if ([...picked, word].join('-').length <= SLUG_LENGTH) picked.push(word)
  }
  if (picked.length > 0) return picked.join('-')

  return pool[0]?.slice(0, SLUG_LENGTH) ?? 'task'
}

// `task/<short name>`; a name taken by another branch gets -2, -3 and so on.
export const slugBranch = (title: string, taken: string[]): string => {
  const base = `task/${branchSlug(title)}`
  if (!taken.includes(base)) return base

  let n = 2
  while (taken.includes(`${base}-${n}`)) n += 1

  return `${base}-${n}`
}

export const parseShortstat = (
  text: string,
): { linesAdded: number; linesRemoved: number; filesTouched: number } => ({
  filesTouched: Number(text.match(/(\d+) files? changed/)?.[1] ?? 0),
  linesAdded: Number(text.match(/(\d+) insertions?\(\+\)/)?.[1] ?? 0),
  linesRemoved: Number(text.match(/(\d+) deletions?\(-\)/)?.[1] ?? 0),
})

// The paths `git status --porcelain=v2` lists as not committed, untracked
// included; a renamed file by its new path.
export const parseStatusPaths = (text: string): string[] =>
  text
    .split('\n')
    .filter(line => line !== '' && !line.startsWith('# '))
    .map(line => {
      const fields = line.split(' ')
      if (line.startsWith('1 ')) return fields.slice(8).join(' ')
      if (line.startsWith('2 ')) return fields.slice(9).join(' ').split('\t')[0]!
      if (line.startsWith('u ')) return fields.slice(10).join(' ')

      return line.slice(2)
    })
