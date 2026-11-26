import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { describe, expect, it } from 'vitest'

// Reads the window's style sheets as text, the way the lint reads imports:
// a custom property that no sheet defines falls back to nothing, and the
// screen quietly loses its colour or its spacing.
const RENDERER = join(__dirname, '..', '..')

const filesUnder = (folder: string, ending: string): string[] =>
  readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const path = join(folder, entry.name)
    if (entry.isDirectory()) return filesUnder(path, ending)

    return entry.name.endsWith(ending) ? [path] : []
  })

const sheets = filesUnder(RENDERER, '.css').map(path => ({ name: relative(RENDERER, path), text: readFileSync(path, 'utf8') }))
const components = filesUnder(RENDERER, '.tsx').map(path => readFileSync(path, 'utf8'))
const tokens = readFileSync(join(__dirname, 'tokens.css'), 'utf8')

const defined = new Set(sheets.flatMap(sheet => [...sheet.text.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]!)))
// Set on an element by a component, such as the title strip's height.
const setInline = new Set(components.flatMap(text => [...text.matchAll(/['"](--[\w-]+)['"]\s*:/g)].map(match => match[1]!)))
const uses = sheets.flatMap(sheet => [...sheet.text.matchAll(/var\((--[\w-]+)\s*(?:,\s*([^)]*))?\)/g)].map(match => ({ sheet: sheet.name, name: match[1]!, fallback: match[2]?.trim() ?? null })))

describe('the design tokens', () => {
  it('defines every custom property a style sheet uses', () => {
    const missing = uses.filter(use => !defined.has(use.name) && !setInline.has(use.name)).map(use => `${use.sheet}: ${use.name}`)

    expect([...new Set(missing)]).toEqual([])
  })

  it("never hides a token behind a colour of its own, which wouldn't follow the sky", () => {
    const hidden = uses.filter(use => use.fallback !== null && /^#|^rgb/.test(use.fallback)).map(use => `${use.sheet}: var(${use.name}, ${use.fallback})`)

    expect(hidden).toEqual([])
  })

  it('names the spacing, type, corner, width, layer and status tokens the screens share', () => {
    const names = [...tokens.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1])

    for (const name of ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--pad-panel', '--pad-sheet', '--text-small', '--text-body', '--text-section', '--radius', '--radius-pill', '--width-sheet', '--width-detail', '--layer-scrim', '--shadow-menu', '--accent', '--danger', '--success']) {
      expect(names).toContain(name)
    }
  })

  it('loads the tokens before the theme and the app’s own styles', () => {
    const main = readFileSync(join(RENDERER, 'main.tsx'), 'utf8')
    const order = ['tokens.css', 'jade_peaks.css', 'app.css'].map(name => main.indexOf(`./core/theme/${name}`))

    expect(order.every(at => at >= 0)).toBe(true)
    expect([...order].sort((a, b) => a - b)).toEqual(order)
  })
})
