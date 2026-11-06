import { describe, expect, it } from 'vitest'

import type { DesignComment } from '../../../../shared/designs'
import { t } from '../../../l10n/en'
import { colourError, commentError, labelError, nextFormOf, numberError, questOfNext, relabel, titleError, validateNext } from './design_forms'
import type { Names, NextForm } from './design_forms'

const comment = (over: Partial<DesignComment> & { id: string }): DesignComment => ({ design: 'welcome', on: null, text: 'Shorter', by: 'Rohan', at: '2026-11-05T10:00:00Z', resolved: null, sentTo: null, ...over })

const COMMENTS: DesignComment[] = [
  comment({ id: 'c1', on: 'headline', text: 'Make the headline shorter,\n it wraps.' }),
  comment({ id: 'c2', text: 'The hero is too tall.' }),
  comment({ id: 'c3', on: 'tip', text: 'Use the jade tip card.', resolved: '2026-11-04T09:00:00Z' }),
  comment({ id: 'c4', text: 'Already sent.', sentTo: '5.4.3' }),
]
const NAMES: Names = { welcome: { name: 'Welcome', layers: { headline: 'Headline', tip: 'Tip card' } } }
const FROM = { label: '5.4.3', folder: '5.4.3' }

const form = (over: Partial<NextForm> = {}): NextForm => ({ ...nextFormOf('Gait-feedback', FROM, COMMENTS, NAMES, ['5.4.3']), ...over })

describe('the comments box', () => {
  it('needs a comment', () => {
    expect(commentError('')).toBe('Comment is required.')
    expect(commentError('   \n ')).toBe(t.designs.commentRequired)
  })

  it('takes 2,000 characters and refuses more', () => {
    expect(commentError('x'.repeat(2000))).toBeUndefined()
    expect(commentError('x'.repeat(2001))).toBe(t.designs.commentLong)
  })

  it('does not count the spaces around a comment', () => {
    expect(commentError(`  ${'x'.repeat(2000)}  `)).toBeUndefined()
  })
})

describe('the version label', () => {
  it('is required', () => {
    expect(labelError('  ', [])).toBe('Version label is required.')
  })

  it('can be 40 characters', () => {
    expect(labelError('x'.repeat(40), [])).toBeUndefined()
    expect(labelError('x'.repeat(41), [])).toBe(t.designs.labelLong)
  })

  it('needs a letter or number', () => {
    expect(labelError('...', [])).toBe(t.designs.labelNoLetters)
  })

  it('names the label that is taken', () => {
    expect(labelError('5.4.2', ['5.4.2', '5.4.3'])).toBe('A version called 5.4.2 already exists. Pick another label.')
  })

  it('counts a label with the same folder as taken', () => {
    expect(labelError('Onboarding Pass 2', ['onboarding-pass-2'])).toBe(t.designs.labelTaken('Onboarding Pass 2'))
  })

  it.each(['5.4.4', 'v6', 'Onboarding pass 3', 'First sketch'])('takes any free label, such as %j', label => {
    expect(labelError(label, ['5.4.3'])).toBeUndefined()
  })
})

describe('the quest title', () => {
  it('is required, and can be 200 characters', () => {
    expect(titleError(' ')).toBe('Quest title is required.')
    expect(titleError('x'.repeat(200))).toBeUndefined()
    expect(titleError('x'.repeat(201))).toBe(t.designs.questTitleLong)
  })
})

describe('checking the Next version form', () => {
  it('gives an error for each field that is wrong', () => {
    expect(validateNext(form({ label: '', title: '' }), [])).toEqual({ label: t.designs.labelRequired, title: t.designs.questTitleRequired })
  })

  it('has nothing to say about a good form', () => {
    expect(validateNext(form(), ['5.4.3'])).toEqual({})
  })
})

describe('what the Next version form starts with', () => {
  it('suggests the label after this one, past those taken', () => {
    expect(nextFormOf('Gait-feedback', FROM, COMMENTS, NAMES, ['5.4.3', '5.4.4']).label).toBe('5.4.5')
  })

  it('titles the quest from the two labels', () => {
    expect(form().title).toBe("Designs 5.4.4 from 5.4.3's feedback")
  })

  it('lists one line per open comment, then the version file', () => {
    expect(form().criteria.split('\n')).toEqual([
      'Welcome · Headline: Make the headline shorter, it wraps.',
      'Welcome: The hero is too tall.',
      'docs/designs/5.4.4/version.json names 5.4.3 as the version it comes from.',
    ])
  })

  it('quotes a design or layer it has no name for by its id', () => {
    const criteria = nextFormOf('Gait-feedback', FROM, [comment({ id: 'c9', design: 'pair', on: 'left', text: 'Bigger' })], {}, []).criteria

    expect(criteria.split('\n')[0]).toBe('pair · left: Bigger')
  })

  it('asks for a copy of the version it starts from, in the new folder', () => {
    expect(form().description).toBe(t.designs.nextDescription('5.4.4', 'Gait-feedback', 'docs/designs/5.4.4/', '5.4.3', 'docs/designs/5.4.3/'))
  })

  it('suggests "1" for a realm\'s first designs, built from no comments', () => {
    const first = nextFormOf('Gait-feedback', null, [], {}, [])

    expect(first).toMatchObject({ from: null, label: '1', title: t.designs.firstTitle('Gait-feedback'), criteria: 'docs/designs/1/version.json exists and names this version.', priority: 'mid', edited: {} })
  })
})

describe('a new label', () => {
  it('redrafts the title, description and criteria for it', () => {
    const after = relabel(form(), '6.0', 'Gait-feedback', COMMENTS, NAMES)

    expect(after.label).toBe('6.0')
    expect(after.title).toBe("Designs 6.0 from 5.4.3's feedback")
    expect(after.criteria).toContain('docs/designs/6.0/version.json')
    expect(after.description).toContain('docs/designs/6.0/')
  })

  it('keeps what was changed by hand', () => {
    const edited = form({ title: 'My own title', criteria: 'My own line', edited: { title: true, criteria: true } })
    const after = relabel(edited, '6.0', 'Gait-feedback', COMMENTS, NAMES)

    expect(after.title).toBe('My own title')
    expect(after.criteria).toBe('My own line')
    expect(after.description).toContain('docs/designs/6.0/')
  })
})

describe('the quest it files', () => {
  it('trims the title, drops blank criteria lines and an empty description', () => {
    const quest = questOfNext(form({ title: '  Designs 5.4.4  ', description: '   ', criteria: 'One\n\n  Two  \n', priority: 'high' }))

    expect(quest).toMatchObject({ title: 'Designs 5.4.4', description: null, criteria: ['One', 'Two'], priority: 'high', parent: { kind: 'none' } })
  })
})

describe('the helpers on the quest', () => {
  it('turns on Mocha Mockup, who knows the design format, beside the defaults', () => {
    expect(questOfNext(form()).helpers).toEqual(['mocha-mockup', 'tea-dd'])
  })
})

describe('an inspector field', () => {
  it('takes a number in range, with spaces round it', () => {
    expect(numberError(' 390 ', 1, 10_000, t.designs.what.width)).toBeUndefined()
  })

  it.each(['', 'abc', '0', '10001', 'Infinity'])('says what to enter for %j', typed => {
    expect(numberError(typed, 1, 10000, t.designs.what.width)).toBe('Enter a width from 1 to 10000.')
  })

  it('takes a #RRGGBB colour and refuses anything else', () => {
    expect(colourError(' #ddf2e8 ')).toBeUndefined()
    expect(colourError('jade')).toBe('Enter a colour like #DDF2E8.')
  })
})
