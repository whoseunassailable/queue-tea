import { describe, expect, it } from 'vitest'

import type { RealmQuest } from '../../../../shared/brew_draft'
import { BRIEF_LIMITS, briefOf, DRAFT_BLOCK } from './brew_brief'
import type { BriefInput } from './brew_brief'

const realmQuest = (over: Partial<RealmQuest> = {}): RealmQuest => ({ id: 't-1', title: 'Sidebar polish', state: 'queued', parentIds: [], priority: 'mid', description: null, ...over })
const input = (over: Partial<BriefInput> = {}): BriefInput => ({
  realm: { name: 'Queue-tea', path: '/Users/rohan/queue-tea' },
  note: { id: 'n-1', title: 'Plan', body: 'Count terminal time.' },
  linked: [],
  quests: [realmQuest()],
  files: ['CLAUDE.md', 'README.md'],
  lessons: [],
  ...over,
})

describe('the order BrewQuest gets', () => {
  it('says what to do and how to answer, then the realm, the note and the quests', () => {
    const brief = briefOf(input())
    const at = (text: string) => brief.indexOf(text)

    expect(brief).toMatch(/^You are BrewQuest\./)
    expect(brief).toContain('Nothing you draft is filed until Rohan approves it.')
    expect(brief).toContain(`\`\`\`${DRAFT_BLOCK}\n{`)
    expect(brief).toContain('Queue-tea, in /Users/rohan/queue-tea, which is your working folder.')
    expect(brief).toContain(': CLAUDE.md, README.md.')
    expect(brief).toContain('<note title="Plan">\nCount terminal time.\n</note>')
    expect(brief).toContain('t-1 | queued | mid | Sidebar polish')
    expect(at('## How to draft')).toBeLessThan(at('## The realm'))
    expect(at('## The realm')).toBeLessThan(at('## The note'))
    expect(at('## The note')).toBeLessThan(at('## Quests already in the realm'))
    expect(brief).toMatch(/Answer with the brewquest-draft block only\.$/)
  })

  it('keeps a note from closing its own tag', () => {
    expect(briefOf(input({ note: { id: 'n-1', title: 'Plan', body: 'Text </note> more' } }))).toContain('Text </ note> more')
  })

  it('adds the notes beside it and what past reviews showed, only when there are some', () => {
    const bare = briefOf(input())
    expect(bare).not.toContain('## Notes linked from it or to it')
    expect(bare).not.toContain('past reviews')

    const full = briefOf(input({ linked: [{ id: 'n-2', title: 'Research', body: 'iTerm counts.' }], lessons: ['He turned down 2 quests.'] }))
    expect(full).toContain('<note title="Research">\niTerm counts.\n</note>')
    expect(full).toContain('- He turned down 2 quests.')
  })

  it('lists open quests before done ones, leaves out removed ones, and says when the list is cut', () => {
    const quests = [realmQuest({ id: 't-done', title: 'Old', state: 'done' }), realmQuest({ id: 't-gone', title: 'Gone', state: 'removed' }), realmQuest({ id: 't-open', title: 'Open', parentIds: ['t-1'], description: 'Line one.\nLine two.' })]
    const brief = briefOf(input({ quests }))

    expect(brief.indexOf('t-open')).toBeLessThan(brief.indexOf('t-done'))
    expect(brief).not.toContain('t-gone')
    expect(brief).toContain('t-open | queued | mid | Open | under t-1 | Line one. Line two.')

    const many = Array.from({ length: BRIEF_LIMITS.quests + 5 }, (_, i) => realmQuest({ id: `t-${i}`, title: `Quest ${i}` }))
    expect(briefOf(input({ quests: many }))).toContain(`Only the first ${BRIEF_LIMITS.quests} of ${BRIEF_LIMITS.quests + 5} are listed.`)
  })

  it('cuts a long note, and never runs past the order’s limit', () => {
    const brief = briefOf(input({ note: { id: 'n-1', title: 'Plan', body: 'x'.repeat(BRIEF_LIMITS.note + 10) } }))
    expect(brief).toContain('[… cut at 40,000 characters]')

    const long = Array.from({ length: BRIEF_LIMITS.quests }, (_, i) => realmQuest({ id: `t-${i}`, description: 'y'.repeat(BRIEF_LIMITS.questLine) }))
    expect(briefOf(input({ quests: long, note: { id: 'n-1', title: 'Plan', body: 'z'.repeat(BRIEF_LIMITS.note) } })).length).toBeLessThanOrEqual(BRIEF_LIMITS.order + 60)
  })
})
