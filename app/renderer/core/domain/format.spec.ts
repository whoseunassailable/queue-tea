import { describe, expect, it } from 'vitest'

import { isClaudeOut } from './format'

const NOW = Date.parse('2026-10-27T17:50:00Z')

describe("whether Claude's allowance is used up", () => {
  it('is used up at 100% while the reset is still ahead', () => {
    expect(isClaudeOut({ percent: 100, resetsAt: '2026-10-27T19:00:00Z' }, NOW)).toBe(true)
  })

  it('counts a reading over 100% as used up too', () => {
    expect(isClaudeOut({ percent: 104, resetsAt: '2026-10-27T19:00:00Z' }, NOW)).toBe(true)
  })

  it('is used up at 100% when the reset is not known', () => {
    expect(isClaudeOut({ percent: 100, resetsAt: null }, NOW)).toBe(true)
  })

  it('is not used up at 99%', () => {
    expect(isClaudeOut({ percent: 99, resetsAt: '2026-10-27T19:00:00Z' }, NOW)).toBe(false)
  })

  it('is not used up once the reset has passed, or at the moment it comes', () => {
    expect(isClaudeOut({ percent: 100, resetsAt: '2026-10-27T17:00:00Z' }, NOW)).toBe(false)
    expect(isClaudeOut({ percent: 100, resetsAt: '2026-10-27T17:50:00Z' }, NOW)).toBe(false)
  })

  it('is not used up when nothing is known of the allowance', () => {
    expect(isClaudeOut(null, NOW)).toBe(false)
  })
})
