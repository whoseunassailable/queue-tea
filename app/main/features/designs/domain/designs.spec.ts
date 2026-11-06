// The shared design rules, tested with the rest of the designs' rules: vitest
// reads no specs under shared/.
import { describe, expect, it } from 'vitest'

import { childrenOf, folderOf, freeId, isDesignId, isFolderName, isHex, isOpen, layersOf, suggestLabel } from '../../../../shared/designs'
import type { DesignComment, Layer } from '../../../../shared/designs'

const frame = (id: string, children: Layer[] = []): Layer => ({ id, type: 'frame', name: id, x: 0, y: 0, width: 10, height: 10, children })
const text = (id: string): Layer => ({ id, type: 'text', name: id, x: 0, y: 0, width: 10, text: id, font: 'Nunito Sans', size: 15, weight: 400, color: '#000000' })
const comment = (over: Partial<DesignComment>): DesignComment => ({ id: 'c1', design: 'welcome', on: null, text: 'Shorter', by: 'Rohan', at: '2026-11-05T10:00:00Z', resolved: null, sentTo: null, ...over })

describe("a version's folder", () => {
  it.each([
    ['5.4.3', '5.4.3'],
    ['v5', 'v5'],
    ['Onboarding pass 2', 'onboarding-pass-2'],
    ['First sketch', 'first-sketch'],
    ['  First   sketch!! ', 'first-sketch'],
    ['UPPER', 'upper'],
  ])('is the label %j lower-cased with runs of other characters as one dash: %j', (label, folder) => {
    expect(folderOf(label)).toBe(folder)
  })

  it.each(['../x', '..', 'a/../../b', '.hidden', 'a\\b', '/etc/passwd'])('never climbs out of the designs folder from %j', label => {
    const folder = folderOf(label)

    expect(folder.includes('..')).toBe(false)
    expect(folder.includes('/')).toBe(false)
    expect(folder.includes('\\')).toBe(false)
    expect(folder.startsWith('.')).toBe(false)
  })

  it('is empty for a label with no letter or number', () => {
    expect(folderOf('...')).toBe('')
    expect(folderOf('!!!')).toBe('')
    expect(folderOf('')).toBe('')
  })

  it('turns letters outside a to z into dashes, so the folder is still a safe name', () => {
    expect(isFolderName(folderOf('Café crème 2'))).toBe(true)
  })

  it('makes two labels that differ only in case or spacing the same folder', () => {
    expect(folderOf('Onboarding Pass 2')).toBe(folderOf('onboarding  pass-2'))
  })

  it('makes every realistic label a folder name the API accepts', () => {
    for (const label of ['5.4.3', 'v5', 'Onboarding pass 2', 'First sketch', 'x'.repeat(40), 'Release 2026.11 (final)']) {
      expect(isFolderName(folderOf(label)), label).toBe(true)
    }
  })
})

describe('the names the window may send', () => {
  it.each(['5.4.3', 'v5', 'onboarding-pass-2', 'a', '1'])('accepts the folder %j', name => {
    expect(isFolderName(name)).toBe(true)
  })

  it.each(['../x', 'a/b', '.hidden', 'UPPER', '', '..', 'a..b', '-a', 'a-', 'a.', 'a b', 'a\\b', 'x'.repeat(61), 5, null, undefined])('refuses the folder %j', name => {
    expect(isFolderName(name)).toBe(false)
  })

  it.each(['welcome', 'pair-your-insoles', 'w2'])('accepts the design id %j', id => {
    expect(isDesignId(id)).toBe(true)
  })

  it.each(['../x', 'a/b', 'a.b', '.hidden', 'Welcome', '', '-a', 'a-', 'x'.repeat(61), 7, null])('refuses the design id %j', id => {
    expect(isDesignId(id)).toBe(false)
  })

  it.each(['#DDF2E8', '#ddf2e8', '#000000'])('accepts the colour %j', colour => {
    expect(isHex(colour)).toBe(true)
  })

  it.each(['#DDF2E', 'DDF2E8', '#GGGGGG', '#DDF2E8FF', 'red', '', null])('refuses the colour %j', colour => {
    expect(isHex(colour)).toBe(false)
  })
})

describe('the suggested next label', () => {
  it.each([
    ['5.4.3', '5.4.4'],
    ['v5', 'v6'],
    ['Onboarding pass 2', 'Onboarding pass 3'],
    ['First sketch', 'First sketch 2'],
    ['v9', 'v10'],
    ['5.4.9', '5.4.10'],
    ['Pass 2 final', 'Pass 3 final'],
    ['0', '1'],
  ])('after %j is %j', (label, next) => {
    expect(suggestLabel(label, [])).toBe(next)
  })

  it('skips a label already taken', () => {
    expect(suggestLabel('5.4.3', ['5.4.3', '5.4.4'])).toBe('5.4.5')
  })

  it('skips a taken label given by its folder', () => {
    expect(suggestLabel('First sketch', ['first-sketch', 'first-sketch-2'])).toBe('First sketch 3')
    expect(suggestLabel('Onboarding pass 2', ['onboarding-pass-3'])).toBe('Onboarding pass 4')
  })

  it('skips every taken label in a row', () => {
    expect(suggestLabel('v1', ['v2', 'v3', 'v4'])).toBe('v5')
  })
})

describe('a free id', () => {
  it('is the name in folder form', () => {
    expect(freeId('Tip card', new Set())).toBe('tip-card')
  })

  it('gets the next free number when the name is taken', () => {
    expect(freeId('Tip card', new Set(['tip-card']))).toBe('tip-card-2')
    expect(freeId('Tip card', new Set(['tip-card', 'tip-card-2']))).toBe('tip-card-3')
  })

  it('is "layer" for a name with no letters', () => {
    expect(freeId('!!', new Set())).toBe('layer')
  })

  it('is always a design id, even from dots or a long name', () => {
    for (const name of ['5.4', 'Welcome (yours)', 'x'.repeat(80), `${'a'.repeat(54)} b`]) {
      expect(isDesignId(freeId(name, new Set())), name).toBe(true)
    }
  })
})

describe('a comment', () => {
  it('is open until resolved or sent', () => {
    expect(isOpen(comment({}))).toBe(true)
    expect(isOpen(comment({ resolved: '2026-11-05T11:00:00Z' }))).toBe(false)
    expect(isOpen(comment({ sentTo: '5.4.4' }))).toBe(false)
  })
})

describe('the layers of a design', () => {
  it('lists parents before what they hold, in drawing order', () => {
    const nodes = [frame('hero', [frame('sun'), text('sky')]), text('headline'), frame('tip', [text('tip-title')])]

    expect(layersOf(nodes).map(l => l.id)).toEqual(['hero', 'sun', 'sky', 'headline', 'tip', 'tip-title'])
  })

  it('gives children only to a frame', () => {
    expect(childrenOf({ ...text('t'), children: [text('inner')] })).toEqual([])
    expect(childrenOf(frame('f', [text('inner')])).map(l => l.id)).toEqual(['inner'])
    expect(childrenOf({ ...frame('f'), children: 'not a list' } as unknown as Layer)).toEqual([])
  })
})
