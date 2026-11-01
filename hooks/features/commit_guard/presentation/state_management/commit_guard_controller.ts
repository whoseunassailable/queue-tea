import type { Ctx } from '../../../../core/env/env'
import type { Ports } from '../../../../core/ports/ports'
import { gitRepositoryOf } from '../../../../shared/git/git_providers'
import { findNewCommits } from '../../domain/usecases/find_new_commits'

// The commit the running turn started on. A reload starts it over.
export const commitGuardState = { turnHead: null as { commit: string; branch: string | null } | null }

// After a turn: names the commits that appeared during it.
export const commitWarning = async (
  p: Ports,
  ctx: Ctx,
  before: { commit: string; branch: string | null } | null,
): Promise<string | null> => {
  const commits = await findNewCommits(gitRepositoryOf(p, ctx), before)
  if (commits === null) return null

  const named = commits.length === 1 ? `a commit appeared: ${commits[0]}` : `${commits.length} commits appeared, newest ${commits[0]}`
  const text = `During the last turn ${named}. Queue-tea stops Claude's commits, so check it was yours.`
  await p.set('warning', text)
  p.toast(`Queue-tea: ${named}`)

  return text
}

export async function pressDismissWarning(p: Ports) {
  await p.set('warning', null)
}
