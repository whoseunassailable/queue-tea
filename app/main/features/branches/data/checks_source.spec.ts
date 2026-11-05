import { expect, it } from 'vitest'
import { checkPath } from '../domain/constants'
import { checksPassed } from './checks_source'
import type { CheckRun } from '../../../../shared/branches'
const choice = { id: 'current-definition', name: 'test', folder: '.', command: 'npm test' }
const run = (over: Partial<CheckRun> = {}): CheckRun => ({ id: 'run', checkId: choice.id, name: 'test', command: 'npm test', tree: 'tree-one', at: 1, finished: 2, owner: 1, status: 'succeeded', output: 'passed', exitCode: 0, truncated: false, ...over })
it('requires a current passing check and treats a later failure or cancellation as authoritative', () => {
  expect(checksPassed([], 'tree-one', [choice])).toBe(false)
  expect(checksPassed([run()], 'tree-two', [choice])).toBe(false)
  expect(checksPassed([run({ checkId: 'obsolete-definition' })], 'tree-one', [choice])).toBe(false)
  expect(checksPassed([run()], 'tree-one', [choice])).toBe(true)
  for (const status of ['failed', 'cancelled', 'running', 'interrupted'] as const) expect(checksPassed([run(), run({ status })], 'tree-one', [choice])).toBe(false)
  expect(checksPassed([run({ status: 'failed' }), run()], 'tree-one', [choice])).toBe(true)
})
it('permits review when the project has no configured checks', () => {
  expect(checksPassed([], 'tree', [])).toBe(true)
})

it('finds the installed Node tools when launched from Finder with only system PATH', () => {
  const path = checkPath('/example', '/usr/bin:/bin')
  expect(path).toContain('/opt/homebrew/bin')
  expect(path).toContain('/usr/local/bin')
  expect(path).toContain('/example/.local/bin')
})
