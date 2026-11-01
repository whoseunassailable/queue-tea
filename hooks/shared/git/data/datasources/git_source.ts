import type { GitFacts } from '../../../../../types'
import type { GitState } from '../../domain/entities/git_state'
import type { Host } from '../../../../core/host/host'
import { parseShortstat, parseStatus, parseStatusPaths } from '../../domain/services/branch_rules'

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
