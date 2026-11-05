import { expect, it, vi } from 'vitest'
import { releaseProblem } from './release_guard.mjs'
const candidate = { version: 1, commit: 'a'.repeat(40), branch: 'main', integration: 'main', dirty: false, builtAt: '2026-11-04' }
it('prevents task, detached, dirty and untraceable builds from replacing production', () => {
  for (const c of [null, { ...candidate, branch: 'task/feature' }, { ...candidate, branch: '' }, { ...candidate, dirty: true }]) expect(releaseProblem(c, null, () => true)).not.toBeNull()
})
it('requires the installed source history even when version numbers would permit an upgrade', () => {
  const ancestor = vi.fn(() => false)
  expect(releaseProblem(candidate, { commit: 'b'.repeat(40) }, ancestor)).toContain('does not include')
  expect(ancestor).toHaveBeenCalledWith('b'.repeat(40), candidate.commit)
  expect(releaseProblem(candidate, { commit: 'b'.repeat(40) }, () => true)).toBeNull()
})
