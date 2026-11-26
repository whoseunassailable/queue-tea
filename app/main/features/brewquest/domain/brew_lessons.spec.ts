import { describe, expect, it } from 'vitest'

import { keptOf, lessonsOf, outcomeOf } from './brew_lessons'
import type { KeptOutcome } from './brew_lessons'

const outcome = (over: Partial<KeptOutcome> = {}): KeptOutcome => ({ id: 'd-abcd1234', by: 'claude', proposed: 4, rejected: [], merged: 0, reused: 0, changed: [], at: '2026-11-07T13:00:00+01:00', filed: 4, ...over })

describe('what a review keeps', () => {
  it('reads an outcome the window sent, and nothing that is not one', () => {
    const sent = { id: 'd-abcd1234', by: 'claude', proposed: 3, rejected: ['A', ' ', 7], merged: 1, reused: 0, changed: [{ title: 'B', field: 'points', from: '3', to: '5' }, { title: 'C', field: 'title', from: 'x', to: 'y' }, { title: 'D', field: 'priority', from: 'mid', to: 'mid' }] }

    expect(outcomeOf(sent)).toEqual({ id: 'd-abcd1234', by: 'claude', proposed: 3, rejected: ['A'], merged: 1, reused: 0, changed: [{ title: 'B', field: 'points', from: '3', to: '5' }] })
    for (const wrong of [null, 'x', { ...sent, id: 'nope' }, { ...sent, by: 'robot' }, { ...sent, proposed: -1 }, { ...sent, rejected: 'A' }]) expect(outcomeOf(wrong)).toBeNull()
  })

  it('reads back the last twenty kept outcomes that still read', () => {
    const kept = Array.from({ length: 25 }, (_, i) => outcome({ filed: i }))

    expect(keptOf([...kept, { broken: true }]).map(one => one.filed)).toEqual(Array.from({ length: 20 }, (_, i) => i + 5))
    expect(keptOf('not a list')).toEqual([])
  })
})

describe('what BrewQuest learns from it', () => {
  it('learns nothing before Claude’s first draft is reviewed', () => {
    expect(lessonsOf([])).toEqual([])
    expect(lessonsOf([outcome({ by: 'checklist', rejected: ['A'] })])).toEqual([])
  })

  it('says only what Rohan did: what he turned down, merged, left to a quest already there and changed', () => {
    const lessons = lessonsOf([
      outcome({ rejected: ['Old idea'], changed: [{ title: 'A', field: 'priority', from: 'mid', to: 'high' }] }),
      outcome({ proposed: 3, rejected: ['Newer idea'], merged: 2, reused: 1, changed: [{ title: 'B', field: 'points', from: '3', to: '5' }, { title: 'C', field: 'points', from: '8', to: '3' }] }),
    ])

    expect(lessons).toEqual([
      'Rohan reviewed 2 drafts with 7 quests in this realm.',
      'He turned down 2 quests, such as "Newer idea", "Old idea".',
      'He merged 2 quests into another drafted quest before filing.',
      'He left 1 quest to a quest already in the realm instead of filing a new one.',
      'He raised the priority once, as on "A" (mid to high).',
      'He raised the effort points once and lowered the effort points once, as on "C" (8 to 3).',
    ])
  })
})
