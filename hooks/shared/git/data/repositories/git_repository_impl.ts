import type { Host } from '../../../../core/host/host'
import type { GitRepository } from '../../domain/repositories/git_repository'
import { commitsBetween, diffSince, listBranches, makeBranch, readDrift, readFacts, readGit, readHead, switchBranch } from '../datasources/git_source'

export const gitRepositoryImpl = (host: Host, cwd: string): GitRepository => ({
  state: () => readGit(host, cwd),
  facts: () => readFacts(host, cwd),
  head: () => readHead(host, cwd),
  branches: () => listBranches(host, cwd),
  make: branch => makeBranch(host, cwd, branch),
  switchTo: branch => switchBranch(host, cwd, branch),
  diffSince: commit => diffSince(host, cwd, commit),
  drift: task => readDrift(host, cwd, task),
  commitsBetween: (from, to) => commitsBetween(host, cwd, from, to),
})
