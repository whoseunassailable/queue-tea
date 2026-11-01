import { holdReason } from '../../../../shared/git/domain/services/branch_rules'
import type { Deps } from './deps'

export type SwitchResult = { kind: 'switched' } | { kind: 'uncommitted'; text: string }

// Switches to the task's branch, unless something is uncommitted.
export const switchToTaskUseCase = async (d: Deps, branch: string): Promise<SwitchResult> => {
  const git = await d.git.state()
  if (git.uncommitted > 0) {
    const text = holdReason({ ...git, unpushed: 0, hasUpstream: true })

    return text === null ? { kind: 'switched' } : { kind: 'uncommitted', text }
  }
  await d.git.switchTo(branch)

  return { kind: 'switched' }
}
