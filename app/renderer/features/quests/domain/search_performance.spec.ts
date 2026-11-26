import { expect, it } from 'vitest'

import type { BoardEntry } from '../../../../shared/engine_api'
import { quest } from '../../../test_support'
import { EMPTY_BOARD, filterEntries } from './search'

// Runs with the other speed budgets, after every other test file has finished.
it('filters 500 quests within 50 ms', () => {
  const entries = Array.from({ length: 500 }, (_, i): BoardEntry => ({ kind: 'quest', quest: quest({ id: `Quest number ${i}`, title: `Quest number ${i}`, branch: `task/quest-${i}` }) }))
  const started = performance.now()

  const found = filterEntries(entries, { ...EMPTY_BOARD, search: 'number 49', filters: { ...EMPTY_BOARD.filters, priorities: ['mid'] } }, null, null)

  expect(performance.now() - started).toBeLessThan(50)
  expect(found.length).toBe(11)
})
