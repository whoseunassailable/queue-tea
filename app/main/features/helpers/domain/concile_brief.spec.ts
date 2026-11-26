import { describe, expect, it } from 'vitest'

import type { Checkpoint } from '../../../../../types'
import { makeTask } from '../../tasks/api/fixtures'
import { CONCILE_LIMITS, concileBrief, questLines } from './concile_brief'

const checkpoint = (over: Partial<Checkpoint> = {}): Checkpoint => ({ written: null, goal: '', acceptance: [], changes: [], decisions: [], rejected: [], remaining: [], blockers: [], nextAction: '', seen: null, ...over })
const timer = makeTask({ id: 'one', title: 'Calm timer', branch: 'task/calm-timer', description: 'A timer that never flashes', criteria: ['The timer fades in'], checkpoint: checkpoint({ decisions: ['Fade over 300ms'], rejected: ['A blinking dot'] }) })
const sides = (over: object = {}) => ({ source: 'task/calm-timer', target: 'main', sourceQuest: timer, targetQuest: null, landed: [], ...over })

describe("Tea-Concile's order", () => {
  it("carries what the task's quest is for, what counts as done and what it decided and ruled out", () => {
    expect(questLines(timer)).toEqual([
      'Quest "Calm timer" (task/calm-timer)',
      'What it is for: A timer that never flashes',
      'Done when:',
      '- The timer fades in',
      'Decided along the way:',
      '- Fade over 300ms',
      'Ruled out:',
      '- A blinking dot',
    ])
  })

  it('leaves out what a quest has none of', () => {
    expect(questLines(makeTask({ id: 'two', title: 'Bare', branch: null, description: null, criteria: [] }))).toEqual(['Quest "Bare"'])
  })

  it('names both sides, and says when a side has no quest or a target is an integration branch', () => {
    const brief = concileBrief(sides({ sourceQuest: null }))
    expect(brief).toContain('The task branch, task/calm-timer:')
    expect(brief).toContain("Queue-tea's record has no quest for this branch.")
    expect(brief).toContain('main is not a quest\'s branch.')
    expect(brief).toContain('No quest in Queue-tea\'s record reached main after the task branched.')
  })

  it("lists the quests that reached the target since the task branched, a few at most, or says it couldn't tell", () => {
    const landed = Array.from({ length: CONCILE_LIMITS.landed + 2 }, (_, i) => makeTask({ id: `l${i}`, title: `Landed ${i}`, branch: `task/landed-${i}` }))
    const brief = concileBrief(sides({ landed }))
    expect(brief).toContain('Quests that reached main after task/calm-timer branched off it:')
    expect(brief).toContain(`Landed ${CONCILE_LIMITS.landed - 1}`)
    expect(brief).not.toContain(`Landed ${CONCILE_LIMITS.landed}`)
    expect(brief).toContain('…and 2 more, not listed here.')
    expect(concileBrief(sides({ landed: null }))).toContain("Queue-tea couldn't work out which quests reached main")
  })

  it('keeps a long description and long lists to their limits', () => {
    const long = makeTask({ id: 'long', title: 'Long', branch: 'task/long', description: 'x'.repeat(CONCILE_LIMITS.text * 2), criteria: Array.from({ length: CONCILE_LIMITS.items + 5 }, (_, i) => `${i} ${'y'.repeat(CONCILE_LIMITS.item)}`) })
    const lines = questLines(long)
    expect(lines[1]!.length).toBeLessThanOrEqual('What it is for: '.length + CONCILE_LIMITS.text)
    expect(lines.filter(line => line.startsWith('- '))).toHaveLength(CONCILE_LIMITS.items)
    expect(lines.every(line => line.length <= 'What it is for: '.length + CONCILE_LIMITS.text)).toBe(true)
  })
})
