import { expect, it, vi } from 'vitest'
import type { RunResult } from '../../../../../hooks/core/host/host'
import { createLogger } from '../../../core/logger'
import type { TasksDeps } from '../../tasks/api/scope'
import { mergePreview } from './merge_workspace'

const TREE = 'a'.repeat(40)
const deps = (result: RunResult) => {
  const run = vi.fn(async () => result)
  const warn = vi.fn()
  return { d: { host: { run }, log: { ...createLogger('dev', () => {}), warn } } as unknown as TasksDeps, run, warn }
}

it('names each file the merge would conflict in, once each, and runs nothing in a folder', async () => {
  const { d, run } = deps({ exitCode: 1, stdout: `${TREE}\0a.ts\0docs/b c.md\0a.ts\0\0`, stderr: '' })
  expect(await mergePreview(d, '/repo-conflicts', 'target', 'source')).toEqual(['a.ts', 'docs/b c.md'])
  expect(run).toHaveBeenCalledWith(['git', '--no-optional-locks', 'merge-tree', '-z', '--write-tree', '--name-only', '--no-messages', 'target', 'source'], '/repo-conflicts')
})

it('says a merge that would be clean has no conflicts', async () => {
  const { d } = deps({ exitCode: 0, stdout: `${TREE}\0`, stderr: '' })
  expect(await mergePreview(d, '/repo-clean', 'target', 'source')).toEqual([])
})

it('works out the same two commits only once, since the answer never changes', async () => {
  const { d, run } = deps({ exitCode: 1, stdout: `${TREE}\0a.ts\0`, stderr: '' })
  await mergePreview(d, '/repo-once', 'target', 'source')
  expect(await mergePreview(d, '/repo-once', 'target', 'source')).toEqual(['a.ts'])
  expect(run).toHaveBeenCalledTimes(1)
  await mergePreview(d, '/repo-once', 'target', 'newer')
  expect(run).toHaveBeenCalledTimes(2)
})

it('tells nothing, and logs why, when this git is too old or the merge cannot be worked out', async () => {
  const { d, run, warn } = deps({ exitCode: 129, stdout: '', stderr: 'unknown option: --write-tree' })
  expect(await mergePreview(d, '/repo-old', 'target', 'source')).toBeNull()
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('unknown option'))
  // Not remembered: a newer git can tell next time.
  await mergePreview(d, '/repo-old', 'target', 'source')
  expect(run).toHaveBeenCalledTimes(2)
})

it('leaves out a name that points outside the folder', async () => {
  const { d } = deps({ exitCode: 1, stdout: `${TREE}\0../escape\0.git/config\0ok.ts\0`, stderr: '' })
  expect(await mergePreview(d, '/repo-names', 'target', 'source')).toEqual(['ok.ts'])
})
