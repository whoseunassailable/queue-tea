import type { GitRepository } from '../../../../shared/git/domain/repositories/git_repository'

// The commits that appeared since `before`, the commit and branch the turn
// started on. A change of branch is no commit.
export const findNewCommits = async (
  git: GitRepository,
  before: { commit: string; branch: string | null } | null,
): Promise<string[] | null> => {
  if (before === null) return null
  const after = await git.head()
  if (after === null || after.commit === before.commit || after.branch !== before.branch) return null
  let commits: string[]
  try {
    commits = await git.commitsBetween(before.commit, after.commit)
  } catch {
    // Not a descendant (a reset, a rebase): no new commit to name.
    return null
  }

  return commits.length === 0 ? null : commits
}
