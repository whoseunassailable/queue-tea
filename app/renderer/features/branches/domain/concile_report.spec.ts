import { describe, expect, it } from 'vitest'

import { DECISION_LIMITS, concileReport } from './concile_report'

const block = (entries: unknown) => `\`\`\`tea-concile-decisions\n${JSON.stringify(entries)}\n\`\`\``
const TIMER = { file: 'src/timer.ts', question: 'Fade or blink?', target: 'main blinks the dot', source: 'The task fades it in', recommend: 'source', why: 'The quest says never flash.' }

describe("reading Tea-Concile's choices", () => {
  it('takes the choices out of the report, so the report reads without them', () => {
    const report = concileReport(`Resolved 3 of 4 files.\n\n${block([TIMER])}`)
    expect(report).toEqual({ text: 'Resolved 3 of 4 files.', decisions: [TIMER], problem: null })
  })

  it('has no choices for a report without the block, or no report', () => {
    expect(concileReport('All resolved and staged.')).toEqual({ text: 'All resolved and staged.', decisions: [], problem: null })
    expect(concileReport(null)).toEqual({ text: '', decisions: [], problem: null })
  })

  it('reads the last block, since an earlier one is quoted', () => {
    const other = { ...TIMER, file: 'src/other.ts' }
    expect(concileReport(`${block([other])}\nThen:\n${block([TIMER])}`).decisions).toEqual([TIMER])
  })

  it('says a block that does not read is unreadable, and marks nothing', () => {
    const report = concileReport('Done.\n```tea-concile-decisions\n[{ not json\n```')
    expect(report.decisions).toEqual([])
    expect(report.problem).toEqual(expect.any(String))
    expect(report.text).toBe('Done.')
    expect(concileReport(block({ file: 'a.ts' })).problem).toBe('the decisions block is not a list')
  })

  it('drops a choice on a file outside the merge, or with no question, and keeps the first for a file', () => {
    const report = concileReport(block([{ ...TIMER, file: '../escape.ts' }, { ...TIMER, file: '/etc/hosts' }, { ...TIMER, file: 'a//b.ts' }, { ...TIMER, question: ' ' }, 'not one', null, TIMER, { ...TIMER, question: 'Again?' }]))
    expect(report.decisions).toEqual([TIMER])
  })

  it('keeps an unknown recommendation as none, and clips what is too long', () => {
    const [decision] = concileReport(block([{ ...TIMER, recommend: 'both', why: 'w'.repeat(DECISION_LIMITS.field + 50), target: 7 }])).decisions
    expect(decision).toMatchObject({ recommend: null, target: '' })
    expect(decision!.why).toHaveLength(DECISION_LIMITS.field)
    expect(decision!.why.endsWith('…')).toBe(true)
  })

  it('reads a fixed number of choices at most', () => {
    const many = Array.from({ length: DECISION_LIMITS.decisions + 10 }, (_, i) => ({ ...TIMER, file: `f${i}.ts` }))
    expect(concileReport(block(many)).decisions).toHaveLength(DECISION_LIMITS.decisions)
  })
})
