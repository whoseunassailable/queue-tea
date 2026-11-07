import { describe, expect, it, vi } from 'vitest'

import { activeQuest, projectRow, projectView, quest } from '../../../test_support'
import { filterPalette, matchScore, paletteEntries } from './palette'
import type { PaletteInput } from './palette'

const noop = () => {}
const BOARD = projectView('a-000001', { ready: [{ kind: 'quest', quest: quest({ id: 'first', title: 'Fix the docs', isStar: true, branch: 'task/fix-docs' }) }, { kind: 'quest', quest: quest({ id: 'second', title: 'Other quest' }) }], sealed: [{ kind: 'quest', quest: quest({ id: 'stuck', title: 'Stuck quest', sealedBecause: 'waiting' }) }], canStart: 2 })

const input = (over: Partial<PaletteInput> = {}): PaletteInput => ({
  view: BOARD as PaletteInput['view'],
  realms: [projectRow('a-000001', { name: 'here' }), projectRow('b-000002', { name: 'elsewhere' })],
  selected: 'a-000001',
  onStart: noop,
  onOpenQuest: noop,
  onFinish: noop,
  onBack: noop,
  onOpenClaude: noop,
  onNewQuest: noop,
  onGo: noop,
  onPickRealm: noop,
  onOpenFolder: noop,
  ...over,
})

const labels = (entries: ReturnType<typeof paletteEntries>, section: string) => entries.filter(e => e.section === section).map(e => e.label)

describe('what the palette offers', () => {
  it('suggests starting the main quest, and a new quest', () => {
    expect(labels(filterPalette(paletteEntries(input()), ''), 'suggested')).toEqual(['Start ★ Fix the docs', 'New quest'])
  })

  it('suggests the active quest\'s actions when there is one', () => {
    const view = { ...BOARD, active: activeQuest() } as PaletteInput['view']

    expect(labels(filterPalette(paletteEntries(input({ view })), ''), 'suggested')).toEqual(['Open in Claude Code', 'Finish quest… Active one', 'New quest'])
  })

  it('with no realm picked, still goes places', () => {
    const entries = filterPalette(paletteEntries(input({ view: null, selected: null })), '')

    expect(labels(entries, 'suggested')).toEqual([])
    expect(labels(entries, 'goto')).toContain('Settings')
    expect(labels(entries, 'realms')).toEqual(['here', 'elsewhere'])
  })

  it('leaves the quests out until you type', () => {
    expect(labels(filterPalette(paletteEntries(input()), ''), 'quests')).toEqual([])
  })

  it('lists the other realms and not this one, by name', () => {
    expect(labels(filterPalette(paletteEntries(input()), ''), 'realms')).toEqual(['elsewhere'])
  })

  it('shows the keys', () => {
    const entries = filterPalette(paletteEntries(input()), '')

    expect(entries.find(e => e.label === 'New quest')?.keys).toBe('⌘N')
    expect(entries.find(e => e.label === 'Home')?.keys).toBe('⌘1')
  })

  it('gives the tabs the same keys as the menu, with Designs on ⌘3', () => {
    const goTo = filterPalette(paletteEntries(input()), '').filter(e => e.section === 'goto' && e.keys?.match(/^⌘\d$/))

    expect(goTo.map(e => [e.label, e.keys])).toEqual([
      ['Home', '⌘1'],
      ['Quests', '⌘2'],
      ['Designs', '⌘3'],
      ['Branches', '⌘4'],
      ['Chronicle', '⌘5'],
      ['Mana & time', '⌘6'],
      ['Notes', '⌘7'],
    ])
  })
})

describe('typing in the palette', () => {
  it('finds a quest by title', () => {
    expect(labels(filterPalette(paletteEntries(input()), 'docs'), 'quests')).toEqual(['Fix the docs'])
  })

  it('finds a quest by branch', () => {
    expect(labels(filterPalette(paletteEntries(input()), 'task/fix'), 'quests')).toEqual(['Fix the docs'])
  })

  it('finds a sealed quest as well', () => {
    expect(labels(filterPalette(paletteEntries(input()), 'stuck'), 'quests')).toEqual(['Stuck quest'])
  })

  it('finds letters in order, not only side by side', () => {
    expect(labels(filterPalette(paletteEntries(input()), 'ftd'), 'quests')).toEqual(['Fix the docs'])
  })

  it('offers to file what was typed, always', () => {
    expect(labels(filterPalette(paletteEntries(input()), 'zebra'), 'create')).toEqual(['+ New quest "zebra"'])
  })

  it('offers no Create with no realm to file in', () => {
    expect(labels(filterPalette(paletteEntries(input({ view: null, selected: null })), 'zebra'), 'create')).toEqual([])
  })

  it('files the words as they were typed', () => {
    const onNewQuest = vi.fn()

    filterPalette(paletteEntries(input({ onNewQuest })), '  Mend the Gate ').find(e => e.section === 'create')?.run()

    expect(onNewQuest).toHaveBeenCalledWith('Mend the Gate')
  })

  it('puts what starts with the words first', () => {
    const view = { ...BOARD, ready: [{ kind: 'quest' as const, quest: quest({ id: 'a', title: 'Later about fix' }) }, { kind: 'quest' as const, quest: quest({ id: 'b', title: 'Fix first' }) }] } as PaletteInput['view']

    expect(labels(filterPalette(paletteEntries(input({ view })), 'fix'), 'quests')).toEqual(['Fix first', 'Later about fix'])
  })
})

describe('the order of what\'s found', () => {
  it('leads with the strongest match, whichever section it is in', () => {
    const [first] = filterPalette(paletteEntries(input()), 'hoard')

    expect(first?.label).toBe('Hoard')
  })

  it('lets a quest lead when it fits best', () => {
    const [first] = filterPalette(paletteEntries(input()), 'other')

    expect(first?.label).toBe('Other quest')
  })
})

describe('what can\'t run', () => {
  const held = { ...BOARD, active: activeQuest({ title: 'The active one' }) } as PaletteInput['view']

  it('allows Start while another quest is active', () => {
    const entry = filterPalette(paletteEntries(input({ view: held })), 'docs').find(e => e.section === 'quests')

    expect(entry?.reason).toBeNull()
  })

  it('still opens the quest, since opening isn\'t starting', () => {
    const onOpenQuest = vi.fn()

    filterPalette(paletteEntries(input({ view: held, onOpenQuest })), 'docs').find(e => e.section === 'quests')?.run()

    expect(onOpenQuest).toHaveBeenCalledWith('first')
  })

  it('offers Start for another unsealed quest', () => {
    const entry = filterPalette(paletteEntries(input({ view: held })), 'docs').find(e => e.section === 'quests')

    expect(entry?.start).toBeTypeOf('function')
  })

  it('has no start for a sealed quest', () => {
    const entry = filterPalette(paletteEntries(input()), 'stuck').find(e => e.section === 'quests')

    expect(entry?.start).toBeNull()
  })

  it('dims Start ★ with nothing to run, when asked for by name', () => {
    const entry = filterPalette(paletteEntries(input({ view: held })), 'start').find(e => e.section === 'actions')

    expect(entry?.reason).toBeNull()
  })

  it('dims Back to the board with no active quest', () => {
    const entry = filterPalette(paletteEntries(input()), 'back').find(e => e.section === 'actions')

    expect(entry?.reason).toBe('No quest is active.')
  })
})

describe('matching', () => {
  it('scores a start above a word above letters in order, and no match at none', () => {
    const start = matchScore('Fix the docs', 'fix')
    const inside = matchScore('The fix', 'fix')
    const scattered = matchScore('Find it x', 'fix')

    expect(start).toBeGreaterThan(inside)
    expect(inside).toBeGreaterThan(scattered)
    expect(scattered).toBeGreaterThan(0)
    expect(matchScore('Other', 'fix')).toBe(0)
  })
})
