import { describe, expect, it } from 'vitest'

import type { GitState } from '../../../../../hooks/shared/git/domain/entities/git_state'
import { holdCommandOf, holdKindOf } from './hold'

const git = (over: Partial<GitState>): GitState => ({ isRepo: true, branch: 'task/x', isDetached: false, head: 'abc1234', uncommitted: 0, unpushed: 0, hasUpstream: true, ...over })

describe('what holds a Start, and the command to copy', () => {
  it.each([
    ['files not committed', git({ uncommitted: 2 }), 'uncommitted', 'git status'],
    ['files come first when there are commits to push too', git({ uncommitted: 2, unpushed: 1 }), 'uncommitted', 'git status'],
    ['commits not pushed', git({ unpushed: 1 }), 'unpushed', 'git push'],
    ['a branch never pushed', git({ unpushed: 1, hasUpstream: false }), 'neverPushed', 'git push -u origin task/x'],
    ['a detached HEAD', git({ isDetached: true, branch: null }), 'detached', 'git switch <branch>'],
  ])('%s', (_, state, kind, command) => {
    expect(holdKindOf(state)).toBe(kind)
    expect(holdCommandOf(state)).toBe(command)
  })
})
