import { describe, expect, it } from 'vitest'

import type { BrewDraft, DraftGroup, DraftQuest } from '../../../../shared/brew_draft'
import { t } from '../../../l10n/en'
import { countOf, errorsOf, filedIn, filedKeysOf, hasErrors, mergedInto, mergeTargetsOf, outcomeFrom, proposalFrom, reviewOf, rowsOf, withGroup, withRow } from './brew_review'
import type { Filed } from './brew_review'

const ID = 'd-abcd1234'
const quest = (n: number, over: Partial<DraftQuest> = {}): DraftQuest => ({
  key: `${ID}.q${n}`,
  title: `Quest ${n}`,
  summary: `Summary ${n}.`,
  priority: 'mid',
  difficulty: 'medium',
  points: 3,
  criteria: [`Works ${n}`],
  waitsFor: [],
  sources: [{ noteId: 'n-1', title: 'Plan', quote: `Line ${n}`, isFound: true }],
  doubts: [],
  match: null,
  item: null,
  ...over,
})
const group = (n: number, quests: DraftQuest[], parent: DraftGroup['parent'] = { kind: 'new', title: `Saga ${n}`, why: '' }): DraftGroup => ({ key: `${ID}.g${n}`, parent, quests })
const draftOf = (groups: DraftGroup[], by: BrewDraft['by'] = 'claude'): BrewDraft => ({ id: ID, by, understood: '', groups, questions: [], missing: [], read: { notes: [], files: [] }, trouble: null, learned: [] })
const NONE: Filed = { row: () => false, parent: () => false }
const SAME = { id: 't-1', title: 'Sidebar polish', state: 'queued' as const, kind: 'same' as const, why: '', by: 'title' as const }

describe('starting a review', () => {
  it('starts every quest in, except one already in the realm, and every new parent with its title', () => {
    const review = reviewOf(draftOf([group(1, [quest(1), quest(2, { match: SAME }), quest(3, { match: { ...SAME, kind: 'overlaps' } })])]))

    expect(rowsOf(review).map(row => row.isIn)).toEqual([true, false, true])
    expect(review.groups[0]).toMatchObject({ parentTitle: 'Saga 1', isParentIn: true })
  })
})

describe('merging', () => {
  it('folds a quest into another one step deep, into quests that are in', () => {
    let review = reviewOf(draftOf([group(1, [quest(1), quest(2), quest(3)])]))
    review = mergedInto(review, `${ID}.q2`, `${ID}.q1`)

    expect(mergedInto(review, `${ID}.q1`, `${ID}.q3`)).toBe(review)
    expect(mergedInto(review, `${ID}.q3`, `${ID}.q3`)).toBe(review)
    expect(mergeTargetsOf(review, `${ID}.q3`).map(row => row.key)).toEqual([`${ID}.q1`])
    expect(rowsOf(mergedInto(review, `${ID}.q2`, null)).map(row => row.mergedInto)).toEqual([null, null, null])
  })
})

describe('checking a review before filing', () => {
  it('counts the quests and new parents it files', () => {
    let review = reviewOf(draftOf([group(1, [quest(1), quest(2)]), group(2, [quest(3)], { kind: 'existing', id: 't-9', title: 'Old', why: '' }), group(3, [quest(4)])]))
    review = withRow(review, `${ID}.q4`, { isIn: false })
    review = mergedInto(review, `${ID}.q2`, `${ID}.q1`)

    expect(countOf(review, NONE)).toEqual({ quests: 2, parents: 1 })
    expect(countOf(withGroup(review, `${ID}.g1`, { isParentIn: false }), NONE)).toEqual({ quests: 2, parents: 0 })
  })

  it('says what’s wrong with each quest and parent it files, and nothing about the ones left out', () => {
    let review = reviewOf(draftOf([group(1, [quest(1), quest(2), quest(3), quest(4)])]))
    review = withRow(review, `${ID}.q1`, { title: ' ' })
    review = withRow(review, `${ID}.q2`, { criteria: Array.from({ length: 11 }, (_, i) => `C${i}`) })
    review = withRow(review, `${ID}.q3`, { title: '', isIn: false })
    review = withGroup(review, `${ID}.g1`, { parentTitle: '' })

    const errors = errorsOf(review, NONE)
    expect(errors.rows).toEqual({ [`${ID}.q1`]: t.notebook.brew.questTitleRequired, [`${ID}.q2`]: t.notebook.brew.criteriaMany(10) })
    expect(errors.parents).toEqual({ [`${ID}.g1`]: t.notebook.brew.parentRequired })
    expect(errors.none).toBeUndefined()
  })

  it('asks for a quest when none is in, and for the merge target to be in', () => {
    let review = reviewOf(draftOf([group(1, [quest(1), quest(2)])]))
    review = mergedInto(review, `${ID}.q2`, `${ID}.q1`)
    review = withRow(review, `${ID}.q1`, { isIn: false })

    expect(errorsOf(review, NONE)).toEqual({ rows: { [`${ID}.q2`]: t.notebook.brew.mergeTargetOut }, parents: {}, none: t.notebook.brew.pickOne })
    expect(hasErrors(errorsOf(reviewOf(draftOf([group(1, [quest(1)])])), NONE))).toBe(false)
  })
})

describe('what a review files', () => {
  it('sends a checklist draft as the checklist always did', () => {
    const review = reviewOf(draftOf([group(1, [quest(1, { item: 'Scan' })])], 'checklist'))

    expect(proposalFrom(review, NONE, new Set())).toEqual({ groups: [{ parent: { kind: 'new', title: 'Saga 1' }, quests: [{ title: 'Quest 1', priority: 'mid', difficulty: 'medium', item: 'Scan' }] }] })
  })

  it('sends a Claude draft with its keys, folding merged quests in and waiting only on quests that are filed', () => {
    const one = quest(1, { waitsFor: [`${ID}.q3`, `${ID}.q4`, 't-7'], doubts: ['Which terminals?'] })
    const two = quest(2, { criteria: ['works 1', 'Two more'], waitsFor: [`${ID}.q1`], sources: [{ noteId: 'n-1', title: 'Plan', quote: 'Line 1', isFound: true }, { noteId: 'n-2', title: 'Research', quote: 'More', isFound: true }] })
    const three = quest(3, { waitsFor: [`${ID}.q2`] })
    const four = quest(4)
    let review = reviewOf(draftOf([group(1, [one, two]), group(2, [three, four], { kind: 'none' })]))
    review = mergedInto(review, `${ID}.q2`, `${ID}.q1`)
    review = withRow(review, `${ID}.q4`, { isIn: false })
    review = withRow(review, `${ID}.q1`, { points: 8, priority: 'high' })

    const sent = proposalFrom(review, NONE, new Set())

    expect(sent.groups).toEqual([
      {
        key: `${ID}.g1`,
        parent: { kind: 'new', title: 'Saga 1' },
        quests: [
          {
            title: 'Quest 1',
            priority: 'high',
            difficulty: 'medium',
            item: null,
            key: `${ID}.q1`,
            summary: `Summary 1.\n\n${t.notebook.brew.alsoCovers(['Quest 2'])}`,
            criteria: ['Works 1', 'Two more'],
            points: 8,
            waitsFor: [`${ID}.q3`, 't-7'],
            sources: [
              { title: 'Plan', quote: 'Line 1' },
              { title: 'Research', quote: 'More' },
            ],
            doubts: ['Which terminals?'],
          },
        ],
      },
      { key: `${ID}.g2`, parent: { kind: 'none' }, quests: [expect.objectContaining({ key: `${ID}.q3`, waitsFor: [`${ID}.q1`] })] },
    ])
    expect(sent.draft).toEqual({ id: ID, by: 'claude', proposed: 4, rejected: ['Quest 4'], merged: 1, reused: 0, changed: [{ title: 'Quest 1', field: 'priority', from: 'mid', to: 'high' }, { title: 'Quest 1', field: 'points', from: '3', to: '8' }] })
  })

  it('waits on a quest filed by an earlier try, and sends again only what isn’t filed yet', () => {
    const review = reviewOf(draftOf([group(1, [quest(1), quest(2, { waitsFor: [`${ID}.q1`] })])]))
    const filed = filedIn([{ id: 't-1', item: null, key: `${ID}.g1`, under: null }, { id: 't-2', item: null, key: `${ID}.q1`, under: 't-1' }], { by: 'claude' }, 0)

    expect(proposalFrom(review, filed, filedKeysOf([{ id: 't-2', item: null, key: `${ID}.q1` }])).groups).toEqual([{ key: `${ID}.g1`, parent: { kind: 'new', title: 'Saga 1' }, quests: [expect.objectContaining({ key: `${ID}.q2`, waitsFor: [`${ID}.q1`] })] }])
    expect(countOf(review, filed)).toEqual({ quests: 1, parents: 0 })
  })

  it('counts a quest left to the one already in the realm apart from one turned down', () => {
    const review = reviewOf(draftOf([group(1, [quest(1, { match: SAME }), quest(2)])]))

    expect(outcomeFrom(review)).toMatchObject({ rejected: [], reused: 1, merged: 0 })
  })
})

describe('what the note already lists', () => {
  it('knows a checklist quest by its line, and its parent once the note has one more', () => {
    const review = reviewOf(draftOf([group(1, [quest(1, { item: 'Scan' }), quest(2, { item: 'Report' })])], 'checklist'))
    const filed = filedIn([{ id: 't-own', item: null }, { id: 't-1', item: 'Scan' }], { by: 'checklist' }, 0)

    expect(rowsOf(review).map(filed.row)).toEqual([true, false])
    expect(filed.parent(review.groups[0]!)).toBe(true)
    expect(filedIn([{ id: 't-own', item: null }], { by: 'checklist' }, 1).parent(review.groups[0]!)).toBe(false)
  })
})
