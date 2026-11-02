import type { GitState } from '../../../../../hooks/shared/git/domain/entities/git_state'
import type { HoldKind } from '../../../../shared/engine_api'

// What the engine's hold is about. The sentence is the engine's; this picks
// the advice and the command that go with it.
export const holdKindOf = (git: GitState): HoldKind => {
  if (git.isDetached) return 'detached'
  if (git.uncommitted > 0) return 'uncommitted'

  return git.hasUpstream ? 'unpushed' : 'neverPushed'
}

// Text to copy. The app never runs these.
export const holdCommandOf = (git: GitState): string => {
  const kind = holdKindOf(git)
  if (kind === 'detached') return 'git switch <branch>'
  if (kind === 'uncommitted') return 'git status'

  return kind === 'unpushed' ? 'git push' : `git push -u origin ${git.branch}`
}
