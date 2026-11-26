import { describe, expect, it } from 'vitest'

import { DESCRIPTION_LIMIT, questDescriptionOf } from './quest_description'

describe('a filed quest’s description', () => {
  it('says where a checklist line came from and nothing more', () => {
    expect(questDescriptionOf('Plan', 'First words.', { item: 'Scan logs' })).toBe('From the note "Plan" in Notes.')
  })

  it('gives the note’s own quest its first paragraph when nothing else describes it', () => {
    expect(questDescriptionOf('Plan', 'First words.', { item: null })).toBe('From the note "Plan" in Notes.\n\nFirst words.')
    expect(questDescriptionOf('Plan', null, { item: null })).toBe('From the note "Plan" in Notes.')
  })

  it('lays out what BrewQuest drafted: what it’s for, the words it came from, its effort and what isn’t confirmed', () => {
    const text = questDescriptionOf('Plan', 'First words.', {
      item: null,
      summary: 'Terminal time counts toward the quest.',
      sources: [
        { title: 'Plan', quote: 'Count terminal time.\nAll of it.' },
        { title: 'Research', quote: 'iTerm counts.' },
      ],
      points: 1,
      doubts: ['Which terminals?'],
    })

    expect(text).toBe(
      [
        'From the note "Plan" in Notes.',
        'Terminal time counts toward the quest.',
        'The note\'s words:\n\n> Count terminal time.\n> All of it.\n>\n> iTerm counts.\n> (from "Research")',
        "Effort: 1 point (BrewQuest's estimate).",
        'Not confirmed yet:\n- Which terminals?',
      ].join('\n\n'),
    )
  })

  it('never runs past what a quest’s description holds', () => {
    const text = questDescriptionOf('Plan', null, { item: null, summary: 'x'.repeat(DESCRIPTION_LIMIT * 2) })

    expect(text).toHaveLength(DESCRIPTION_LIMIT)
    expect(text.endsWith('…')).toBe(true)
  })
})
