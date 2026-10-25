import type { GitFacts, GitState } from '../types'
import type { Host } from './host'

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

const git = async (host: Host, cwd: string, args: string[]) => {
  const ran = await host.run(['git', ...args], cwd)
  if (ran.exitCode !== 0) throw new Error(`git ${args.join(' ')} failed (${ran.exitCode}): ${ran.stderr}`)

  return ran.stdout
}

export const readGit = async (host: Host, cwd: string): Promise<GitState> => {
  const inside = await host.run(['git', 'rev-parse', '--is-inside-work-tree'], cwd)
  if (inside.exitCode !== 0) {
    return { isRepo: false, branch: null, isDetached: false, head: null, uncommitted: 0, unpushed: 0, hasUpstream: false }
  }

  const status = parseStatus(await git(host, cwd, ['status', '--porcelain=v2', '--branch']))
  if (status.hasUpstream || status.branch === null || status.head === null) return { isRepo: true, ...status }

  // No upstream: the commits that no remote branch has, every one of them
  // when there is no remote.
  const localOnly = Number((await git(host, cwd, ['rev-list', '--count', 'HEAD', '--not', '--remotes'])).trim())

  return { isRepo: true, ...status, unpushed: localOnly }
}

export const listBranches = async (host: Host, cwd: string): Promise<string[]> =>
  (await git(host, cwd, ['branch', '--format=%(refname:short)'])).split('\n').filter(Boolean)

export const makeBranch = async (host: Host, cwd: string, name: string): Promise<void> => {
  await git(host, cwd, ['switch', '-c', name])
}

export const switchBranch = async (host: Host, cwd: string, name: string): Promise<void> => {
  await git(host, cwd, ['switch', name])
}

export const diffSince = async (host: Host, cwd: string, commit: string) =>
  parseShortstat(await git(host, cwd, ['diff', '--shortstat', commit]))

// The commit checked out and its branch; null outside a repository or before
// the first commit.
export const readHead = async (host: Host, cwd: string): Promise<{ commit: string; branch: string | null } | null> => {
  const ran = await host.run(['git', 'rev-parse', 'HEAD'], cwd)
  if (ran.exitCode !== 0) return null
  const named = await host.run(['git', 'symbolic-ref', '--short', '-q', 'HEAD'], cwd)

  return { commit: ran.stdout.trim(), branch: named.exitCode === 0 ? named.stdout.trim() : null }
}

// The commits after `from` up to `to`, newest first, as "1a2b3c4 subject".
export const commitsBetween = async (host: Host, cwd: string, from: string, to: string): Promise<string[]> =>
  (await git(host, cwd, ['log', '--format=%h %s', `${from}..${to}`])).split('\n').filter(Boolean)

// The last commit as "1a2b3c4 subject", or null.
export const lastCommit = async (host: Host, cwd: string): Promise<string | null> => {
  const ran = await host.run(['git', 'log', '-1', '--format=%h %s'], cwd)

  return ran.exitCode === 0 && ran.stdout.trim() !== '' ? ran.stdout.trim() : null
}

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

// The branch, the last commit and the files not committed, as a checkpoint
// keeps them; null outside a repository.
export const readFacts = async (host: Host, cwd: string): Promise<GitFacts | null> => {
  const inside = await host.run(['git', 'rev-parse', '--is-inside-work-tree'], cwd)
  if (inside.exitCode !== 0) return null
  const status = await git(host, cwd, ['status', '--porcelain=v2', '--branch'])

  return {
    branch: parseStatus(status).branch,
    head: await lastCommit(host, cwd),
    uncommitted: parseStatusPaths(status).slice(0, 20),
  }
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// What has moved under a task since it started, in plain words, from local
// git only: its branch gone, its start commit no longer on it, its base
// branch ahead of where the task started.
export const readDrift = async (
  host: Host,
  cwd: string,
  task: { branch: string | null; baseBranch: string | null; startCommit: string | null },
): Promise<string[]> => {
  if (task.branch === null) return []
  const branches = await listBranches(host, cwd)
  if (!branches.includes(task.branch)) return [`The branch ${task.branch} is gone.`]

  const lines: string[] = []
  if (task.startCommit !== null) {
    const held = await host.run(['git', 'merge-base', '--is-ancestor', task.startCommit, task.branch], cwd)
    if (held.exitCode === 1) {
      lines.push(`${task.branch} no longer holds the commit it started from (${task.startCommit.slice(0, 7)}): a rebase or a reset?`)
    }
  }
  if (task.startCommit !== null && task.baseBranch !== null && task.baseBranch !== task.branch && branches.includes(task.baseBranch)) {
    const ahead = await host.run(['git', 'rev-list', '--count', `${task.startCommit}..${task.baseBranch}`], cwd)
    const n = Number(ahead.stdout.trim())
    if (ahead.exitCode === 0 && n > 0) {
      lines.push(`${task.baseBranch} has ${plural(n, 'commit', 'commits')} that ${task.branch} doesn't.`)
    }
  }

  return lines
}
