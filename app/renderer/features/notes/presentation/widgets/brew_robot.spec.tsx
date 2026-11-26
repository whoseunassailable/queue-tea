// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { cleanup, render } from '@testing-library/preact'
import { afterEach, describe, expect, it } from 'vitest'

import { BREW_MOODS } from '../../domain/notes_view'
import { Robot } from './brew_robot'

afterEach(cleanup)

const drawn = (mood: (typeof BREW_MOODS)[number], size?: number) => render(<Robot mood={mood} size={size} />).container.querySelector('svg')!

// The stylesheet with its no-preference blocks taken out, and those blocks alone.
const motionSplit = (css: string) => {
  const opener = /@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{/g
  let outside = ''
  let inside = ''
  let from = 0
  for (const match of css.matchAll(opener)) {
    const start = match.index
    let depth = 0
    let end = start + match[0].length - 1
    for (; end < css.length; end++) {
      if (css[end] === '{') depth++
      if (css[end] === '}' && --depth === 0) break
    }
    outside += css.slice(from, start)
    inside += css.slice(start, end + 1)
    from = end + 1
  }

  return { outside: outside + css.slice(from), inside }
}

describe('BrewQuest’s robot', () => {
  it.each(BREW_MOODS)('in %s, keeps the size it was given and says its mood', mood => {
    const svg = drawn(mood, 88)
    expect(svg.getAttribute('width')).toBe('88')
    expect(svg.getAttribute('height')).toBe('88')
    expect(svg.getAttribute('viewBox')).toBe('0 0 12 12')
    expect(svg.getAttribute('data-mood')).toBe(mood)
    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })

  it('is idle unless told otherwise, at the card’s 44 px', () => {
    const svg = render(<Robot />).container.querySelector('svg')!
    expect(svg.getAttribute('data-mood')).toBe('idle')
    expect(svg.getAttribute('width')).toBe('44')
  })

  it.each(BREW_MOODS)('in %s, draws every pixel inside its own 12 × 12 box, so nothing reaches past the card', mood => {
    const rects = [...drawn(mood).querySelectorAll('rect')]
    expect(rects.length).toBeGreaterThan(0)
    for (const rect of rects) {
      const [x, y, width, height] = ['x', 'y', 'width', 'height'].map(name => Number(rect.getAttribute(name)))
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(x! + width!).toBeLessThanOrEqual(12)
      expect(y! + height!).toBeLessThanOrEqual(12)
    }
  })

  it('draws each mood differently when still, so it reads with motion turned off', () => {
    const stills = BREW_MOODS.map(mood => {
      const svg = drawn(mood)
      svg.removeAttribute('data-mood')
      const markup = svg.outerHTML
      cleanup()

      return markup
    })
    expect(new Set(stills).size).toBe(BREW_MOODS.length)
  })

  it('moves in every mood only where motion is welcome, and clips to its box', () => {
    const css = readFileSync(resolve(__dirname, '../notes.css'), 'utf8')
    const { outside, inside } = motionSplit(css)
    // Outside a no-preference block, no rule for the robot sets an animation.
    const stillRules = outside.split('}').filter(rule => rule.includes('.nt-robot'))
    expect(stillRules.length).toBeGreaterThan(0)
    for (const rule of stillRules) expect(rule).not.toMatch(/animation\s*:/)
    for (const mood of BREW_MOODS) expect(inside).toContain(`.nt-robot[data-mood='${mood}']`)
    expect(outside).toMatch(/\.rm \.nt-robot \{[^}]*overflow: hidden/)
  })
})
