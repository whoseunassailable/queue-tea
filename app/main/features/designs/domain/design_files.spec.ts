import { describe, expect, it } from 'vitest'

import type { Layer } from '../../../../shared/designs'
import { checkScene, lineOf, parseComments, parseJson, parseScene, parseVersion } from './design_files'
import type { Parsed } from './design_files'

const text = (id: string, over: Record<string, unknown> = {}) => ({ id, type: 'text', name: id, x: 24, y: 40, width: 342, text: 'Walk better', font: 'Nunito Sans', size: 15, weight: 400, color: '#2A2218', ...over })
const frame = (id: string, children: unknown[] = [], over: Record<string, unknown> = {}) => ({ id, type: 'frame', name: id, x: 0, y: 0, width: 390, height: 420, fill: '#BFE3D5', radius: 12, children, ...over })
const scene = (nodes: unknown[], over: Record<string, unknown> = {}) => ({ format: 1, name: 'Welcome', width: 390, height: 844, fill: '#F6F1E7', nodes, ...over })

const detail = <T>(parsed: Parsed<T>): string => {
  if (parsed.ok) throw new Error('should not read')

  return parsed.detail
}
const value = <T>(parsed: Parsed<T>): T => {
  if (!parsed.ok) throw new Error(`should read: ${parsed.detail}`)

  return parsed.value
}

// A comma missing after "width": 390, so the parser stops on line 5.
const LIVE_WALK = '{\n  "format": 1,\n  "name": "Live walk",\n  "width": 390\n  "height": 844\n}\n'

describe('where a JSON mistake is', () => {
  it('takes the line the parser names', () => {
    expect(lineOf('', "Expected ',' after property value in JSON at position 52 (line 4 column 3)")).toBe(4)
  })

  it('counts the lines up to a position when that is all it gives', () => {
    expect(lineOf('a\nb\nc', 'Unexpected token in JSON at position 4')).toBe(3)
  })

  it('has no line when the parser gives neither', () => {
    expect(lineOf('{', 'Unexpected end of JSON input')).toBeNull()
  })

  it('says the line, in plain words, never the parser\'s', () => {
    const said = detail(parseJson(LIVE_WALK))

    expect(said).toBe('It has a mistake near line 5.')
    expect(said).not.toMatch(/Expected|position|JSON|token/)
  })

  // V8 gives no position for an unexpected token, only the text round it.
  it('finds the line of a word that is not JSON, mid-file', () => {
    expect(detail(parseJson('{\n  "format": 1,\n  "name": "Welcome",\n  "width": 390,\n  "height": 844,\n  "fill": nope,\n  "nodes": []\n}\n'))).toBe('It has a mistake near line 6.')
  })

  it('finds the line of a stray bracket at the end of the file', () => {
    expect(detail(parseJson('{ "format": 1,\n "comments": [\n }'))).toBe('It has a mistake near line 3.')
  })

  it('finds the line of a mistake in the first few characters', () => {
    expect(detail(parseJson('[\nnope, 1, 2, 3, 4, 5, 6, 7, 8]'))).toBe('It has a mistake near line 2.')
  })

  it('trusts the place over words in the quoted text that look like a line', () => {
    // V8 quotes ',\n  "c": no line 1\n}' round the bad o, and the mistake is on line 4.
    const file = '{\n  "a": 1,\n  "b": 2,\n  "c": no line 1\n}\n'

    expect(detail(parseJson(file))).toBe('It has a mistake near line 4.')
  })

  it('says it cannot place a mistake in a file so short V8 quotes all of it', () => {
    expect(detail(parseJson('{"a": nope}'))).toBe('It has a mistake Queue-tea can’t place.')
  })

  it('reads good JSON as it is', () => {
    expect(value(parseJson('{"a": [1, 2]}'))).toEqual({ a: [1, 2] })
  })
})

describe('a design file', () => {
  it('reads a good one', () => {
    expect(value(parseScene(JSON.stringify(scene([frame('hero', [frame('sun')]), text('headline')])))).name).toBe('Welcome')
  })

  it('gives the line of a JSON mistake', () => {
    expect(detail(parseScene(LIVE_WALK))).toBe('It has a mistake near line 5.')
  })

  it('keeps fields and layers it does not know, just as they were', () => {
    const read = value(checkScene(scene([text('headline', { locked: true }), { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] }], { grid: { size: 8 } })))

    expect(read.grid).toEqual({ size: 8 })
    expect(read.nodes[0]!.locked).toBe(true)
    expect(read.nodes[1]).toMatchObject({ type: 'chart', series: [1, 2, 3] })
  })

  it('accepts an unknown layer type without a height', () => {
    expect(checkScene(scene([{ id: 'odd', type: 'sparkle', name: 'Odd', x: 0, y: 0, width: 10 }])).ok).toBe(true)
  })

  it.each([
    ['nothing', null, 'It isn’t a design.'],
    ['a list', [], 'It isn’t a design.'],
    ['format 2', scene([], { format: 2 }), 'It isn’t in a design format this app knows.'],
    ['no name', scene([], { name: '  ' }), 'The design has no usable name.'],
    ['a width of 0', scene([], { width: 0 }), 'The design has no usable width.'],
    ['a width over 10,000', scene([], { width: 10_001 }), 'The design has no usable width.'],
    ['a fill that is not #RRGGBB', scene([], { fill: 'red' }), 'The design has no usable fill.'],
    ['no layers', scene(undefined as unknown as unknown[]), 'The design has no usable layers.'],
  ])('refuses %s', (_, file, said) => {
    expect(detail(checkScene(file))).toBe(said)
  })

  it.each([
    ['a layer that is not an object', [5], 'One of its layers isn’t a layer.'],
    ['a layer with no id', [text('')], 'One of its layers has no id.'],
    ['two layers with one id', [text('a'), frame('f', [text('a', { name: 'Again' })])], 'The layer “Again” shares its id with another layer.'],
    ['a layer with no type', [text('a', { type: 3 })], 'The layer “a” has no usable type.'],
    ['an x past 10,000', [text('a', { x: 10_001 })], 'The layer “a” has no usable x.'],
    ['a y below -10,000', [text('a', { y: -10_001 })], 'The layer “a” has no usable y.'],
    ['a negative width', [text('a', { width: -1 })], 'The layer “a” has no usable width.'],
    ['a text with no colour', [text('a', { color: 'blue' })], 'The layer “a” has no usable color.'],
    ['a text size of 0', [text('a', { size: 0 })], 'The layer “a” has no usable size.'],
    ['a text weight of 950', [text('a', { weight: 950 })], 'The layer “a” has no usable weight.'],
    ['a text aligned to justify', [text('a', { align: 'justify' })], 'The layer “a” has no usable align.'],
    ['a frame with no height', [frame('f', [], { height: undefined })], 'The layer “f” has no usable height.'],
    ['a frame radius over 1,000', [frame('f', [], { radius: 1001 })], 'The layer “f” has no usable radius.'],
    ['a frame stroke with no colour', [frame('f', [], { stroke: { width: 1 } })], 'The layer “f” has no usable stroke.'],
    ['a frame whose children are not a list', [frame('f', [], { children: {} })], 'The layer “f” has no usable children.'],
    ['a bad layer deep inside', [frame('f', [frame('g', [text('t', { size: 'big' })])])], 'The layer “t” has no usable size.'],
  ])('refuses %s', (_, nodes, said) => {
    expect(detail(checkScene(scene(nodes)))).toBe(said)
  })

  it('takes 2,000 layers and refuses the 2,001st', () => {
    const many = (n: number) => Array.from({ length: n }, (_, i) => text(`t${i}`))

    expect(checkScene(scene(many(2000))).ok).toBe(true)
    expect(detail(checkScene(scene(many(2001))))).toBe('It has more than 2000 layers.')
  })

  it('takes layers nested 20 deep and refuses 21', () => {
    const nest = (depth: number): Layer => (depth === 1 ? (frame('f1') as Layer) : (frame(`f${depth}`, [nest(depth - 1)]) as Layer))

    expect(checkScene(scene([nest(20)])).ok).toBe(true)
    expect(detail(checkScene(scene([nest(21)])))).toBe('Its layers nest more than 20 deep.')
  })
})

describe('a version file', () => {
  it('reads a good one, and keeps fields it does not know', () => {
    const read = value(parseVersion(JSON.stringify({ format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles'], theme: 'night' })))

    expect(read).toMatchObject({ label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles'], next: null, theme: 'night' })
  })

  it('fills in what it can do without', () => {
    expect(value(parseVersion('{"format": 1, "label": "First sketch"}'))).toMatchObject({ made: null, by: null, from: null, designs: [], next: null })
  })

  it('takes a label of 40 characters and refuses 41, like the form', () => {
    expect(parseVersion(JSON.stringify({ format: 1, label: 'x'.repeat(40) })).ok).toBe(true)
    expect(detail(parseVersion(JSON.stringify({ format: 1, label: 'x'.repeat(41) })))).toBe('The version has no usable label.')
  })

  it('takes an author it does not know as none', () => {
    expect(value(parseVersion('{"format": 1, "label": "v5", "by": "robot"}')).by).toBeNull()
  })

  it('reads the next version a quest was filed for', () => {
    expect(value(parseVersion('{"format": 1, "label": "5.4.3", "next": {"label": "5.4.4", "quest": "Designs 5.4.4"}}')).next).toEqual({ label: '5.4.4', quest: 'Designs 5.4.4' })
  })

  it.each([
    ['a JSON mistake', '{ "format": 1, "label": "5.4.2",\n  "made": "2026-10-28T16:02:00-06:00"\n  "designs": [] }\n', 'It has a mistake near line 3.'],
    ['something that is not an object', '[1]', 'It isn’t a version file.'],
    ['an unknown format', '{"format": 2, "label": "v5"}', 'It isn’t in a design format this app knows.'],
    ['no label', '{"format": 1}', 'The version has no usable label.'],
    ['a design id that climbs out', '{"format": 1, "label": "v5", "designs": ["../x"]}', 'The version has no usable list of designs.'],
    ['a next version with no label', '{"format": 1, "label": "v5", "next": {"label": "", "quest": "Q"}}', 'The version has no usable next version.'],
  ])('refuses %s', (_, file, said) => {
    expect(detail(parseVersion(file))).toBe(said)
  })
})

describe('a comments file', () => {
  const COMMENT = { id: 'c1', design: 'welcome', on: 'headline', text: 'Shorter', by: 'Rohan', at: '2026-11-05T14:02:00-06:00', resolved: null, sentTo: null }

  it('reads a good one, and keeps fields it does not know', () => {
    const read = value(parseComments(JSON.stringify({ format: 1, comments: [COMMENT], pinned: ['c1'] })))

    expect(read.comments).toEqual([COMMENT])
    expect(read.pinned).toEqual(['c1'])
  })

  it('takes a missing format as 1', () => {
    expect(value(parseComments(JSON.stringify({ comments: [] }))).format).toBe(1)
  })

  it.each([
    ['no list of comments', { format: 1 }, 'It isn’t a comments file.'],
    ['a comment with no text', { format: 1, comments: [{ ...COMMENT, text: undefined }] }, 'One of its comments is missing a field.'],
    ['a comment on a design id that climbs out', { format: 1, comments: [{ ...COMMENT, design: '../x' }] }, 'One of its comments is missing a field.'],
  ])('refuses %s', (_, file, said) => {
    expect(detail(parseComments(JSON.stringify(file)))).toBe(said)
  })
})
