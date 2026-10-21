import { expect, test } from 'claude-code/testing'

import { readOptions } from '../hooks/session'

test('readOptions fills the defaults', () => {
  expect(readOptions({})).toEqual({
    idleGapMinutes: 15,
    freshAtTokens: 100000,
    handoffAtPercent: 90,
    checkTimeoutSeconds: 10,
  })
})

test('readOptions keeps set numbers and drops nonsense', () => {
  expect(readOptions({ idleGapMinutes: 20, freshAtTokens: 'lots', handoffAtPercent: -5 })).toEqual({
    idleGapMinutes: 20,
    freshAtTokens: 100000,
    handoffAtPercent: 90,
    checkTimeoutSeconds: 10,
  })
})
