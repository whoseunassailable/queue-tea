// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ChronicleView, EngineApi, ManaView, Reply } from '../../shared/engine_api'
import { formatMinutes } from '../core/domain/format'
import { HELPERS } from '../features/guild/domain/helpers'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { CHRONICLE, fakeEngine, GAME, HOARD, MANA, victoryLine } from '../test_support'
import { App } from './app'

const open = async (route: string, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  const { engine, fire } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, fire }
}

const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))
const chronicle = (over: Partial<ChronicleView>): Reply<ChronicleView> => ({ ok: true, data: { ...CHRONICLE, ...over } })
const mana = (over: Partial<ManaView>): Reply<ManaView> => ({ ok: true, data: { ...MANA, ...over } })

afterEach(cleanup)

describe('finding the pages', () => {
  it('has a tab each for Chronicle and Mana & time', async () => {
    await open('/home')

    expect(screen.getByRole('link', { name: t.nav.chronicle }).getAttribute('href')).toBe('#/chronicle')
    expect(screen.getByRole('link', { name: t.nav.mana }).getAttribute('href')).toBe('#/mana')
  })

  it('keeps Guild Hall and Hoard in the sidebar', async () => {
    await open('/home')

    expect(screen.getByRole('link', { name: t.nav.guild }).getAttribute('href')).toBe('#/guild')
    expect(screen.getByRole('link', { name: t.nav.hoard }).getAttribute('href')).toBe('#/hoard')
  })

  it('⌘4 and ⌘5 go to Chronicle and Mana', async () => {
    await open('/home')

    await act(() => void fireEvent.keyDown(document.body, { key: '4', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/chronicle'))
    await act(() => void fireEvent.keyDown(document.body, { key: '5', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/mana'))
  })

  it('opens the app-wide pages with no realm picked', async () => {
    await open('/hoard', { listProjects: async () => ({ ok: true, data: [] }) })

    expect(await screen.findByRole('heading', { name: t.hoard.title })).toBeTruthy()
  })
})

describe('Chronicle', () => {
  it('sums up the week', async () => {
    await open('/chronicle')

    await screen.findByText('Short branch names')
    const summary = document.querySelector('.summary') as HTMLElement
    expect(summary.textContent).toContain(t.chronicle.summary(1, '2h 11m'))
    expect(summary.textContent).toContain(t.chronicle.split('54m', '1h 17m'))
    expect(summary.textContent).toContain(t.chronicle.moved(0, 0, 1))
    expect(summary.textContent).toContain('+25 XP')
  })

  it('reads this realm by default, and remembers All realms', async () => {
    const { engine } = await open('/chronicle')
    await waitFor(() => expect(engine.readChronicle).toHaveBeenCalledWith('a-000001', null))

    await press(t.chronicle.allRealms)

    await waitFor(() => expect(engine.readChronicle).toHaveBeenLastCalledWith(null, null))
    expect(engine.saveSettings).toHaveBeenCalledWith({ chronicleScope: 'all' })
  })

  it('goes back a week, and can\'t go past this one', async () => {
    const { engine } = await open('/chronicle')
    await screen.findByText('Short branch names')

    expect(screen.getByRole<HTMLButtonElement>('button', { name: t.chronicle.later }).disabled).toBe(true)
    await press(t.chronicle.earlier)

    await waitFor(() => expect(engine.readChronicle).toHaveBeenLastCalledWith('a-000001', '2026-10-12'))
  })

  it('shows a day when it is picked', async () => {
    await open('/chronicle')
    await screen.findByText('Short branch names')

    await press(/Thu/)

    expect(screen.getByText(t.chronicle.dayLine('Thu 22 Oct', '2h 11m', '54m', '1h 17m'))).toBeTruthy()
  })

  it('says a day had no time, rather than dividing by it', async () => {
    await open('/chronicle')
    await screen.findByText('Short branch names')

    await press(/Mon/)

    expect(screen.getByText(t.chronicle.dayEmpty('Mon 19 Oct'))).toBeTruthy()
  })

  it('marks which way a difficulty moved', async () => {
    await open('/chronicle')

    expect((await screen.findByText('Medium')).className).toBe('easier')
  })

  it('opens a row with what it took, and a follow-up', async () => {
    await open('/chronicle')
    await screen.findByText('Short branch names')

    await press(t.chronicle.open('Short branch names'))

    expect(screen.getByText(t.chronicle.lines(958, 799, 27))).toBeTruthy()
    expect(screen.getByText('c1fc035')).toBeTruthy()
    await press(t.chronicle.followUp)
    expect((within(screen.getByRole('dialog')).getByLabelText(`${t.form.title} *`) as HTMLInputElement).value).toBe(t.chronicle.followUpTitle('Short branch names'))
  })

  it('offers no follow-up for another realm\'s win', async () => {
    await open('/chronicle', { readChronicle: async () => chronicle({ victories: [victoryLine({ realmPath: '/p/elsewhere' })] }) })
    await screen.findByText('Short branch names')

    await press(t.chronicle.open('Short branch names'))

    expect(screen.queryByRole('button', { name: t.chronicle.followUp })).toBeNull()
  })

  it('says so with no history at all', async () => {
    await open('/chronicle', { readChronicle: async () => chronicle({ victories: [], hasAny: false, xp: 0, minutes: 0, days: CHRONICLE.days.map(d => ({ ...d, onQuests: 0, elsewhere: 0 })) }) })

    expect(await screen.findByText(t.chronicle.none)).toBeTruthy()
  })

  it('points to last week when this one is empty', async () => {
    const { engine } = await open('/chronicle', { readChronicle: vi.fn(async () => chronicle({ victories: [] })) })

    await screen.findByText(t.chronicle.noneThisWeek)
    await press(t.chronicle.lastWeek(2, formatMinutes(300)))

    await waitFor(() => expect(engine.readChronicle).toHaveBeenLastCalledWith('a-000001', '2026-10-12'))
  })

  it('says when a broken realm is left out', async () => {
    await open('/chronicle', { readChronicle: async () => chronicle({ unreadable: 1 }) })

    expect(await screen.findByText(t.chronicle.leftOut(1))).toBeTruthy()
  })

  it('shows the failure with a way to try again', async () => {
    const readChronicle = vi.fn(async (): Promise<Reply<ChronicleView>> => ({ ok: false, error: { message: "Couldn't read the chronicle." } }))
    await open('/chronicle', { readChronicle })

    expect((await screen.findByRole('alert')).textContent).toContain("Couldn't read the chronicle.")
    readChronicle.mockResolvedValueOnce(chronicle({}))
    await press(t.failed.tryAgain)
    expect(await screen.findByText('Short branch names')).toBeTruthy()
  })

  it('keeps what it showed when a refresh fails, and says so', async () => {
    const readChronicle = vi.fn(async () => chronicle({}))
    const { fire } = await open('/chronicle', { readChronicle })
    await screen.findByText('Short branch names')

    readChronicle.mockResolvedValueOnce({ ok: false, error: { message: 'That read failed.' } })
    await act(async () => fire())

    expect(await screen.findByText('That read failed.')).toBeTruthy()
    expect(screen.getByText('Short branch names')).toBeTruthy()
  })

  it('reads again when a record changes', async () => {
    const { engine, fire } = await open('/chronicle')
    await screen.findByText('Short branch names')
    const before = vi.mocked(engine.readChronicle).mock.calls.length

    await act(async () => fire())

    await waitFor(() => expect(vi.mocked(engine.readChronicle).mock.calls.length).toBeGreaterThan(before))
  })
})

describe('Mana & time', () => {
  it('shows what is left in the orb', async () => {
    await open('/mana')

    expect(await screen.findByRole('img', { name: t.mana.orbLabel(38) })).toBeTruthy()
    expect(screen.getByText(t.mana.used(62, null))).toBeTruthy()
  })

  it('says the allowance is unknown with nothing reported', async () => {
    await open('/mana', { readMana: async () => mana({ allowance: null }) })

    expect(await screen.findByText(t.mana.unknown)).toBeTruthy()
    expect(screen.queryByRole('img', { name: /allowance left/ })).toBeNull()
  })

  it('marks a figure as the last one seen', async () => {
    await open('/mana', { readMana: async () => mana({ allowance: { percent: 62, resetsAt: null, seenAt: new Date(2026, 9, 27, 15, 10).getTime(), isStale: true } }) })

    expect(await screen.findByText(t.mana.lastSeen(62, '15:10'))).toBeTruthy()
  })

  it('shows the rules with the session\'s own values', async () => {
    await open('/mana', { readMana: async () => mana({ options: { ...MANA.options, freshAtTokens: 50_000, handoffAtPercent: 80 } }) })

    expect(await screen.findByText(t.mana.rules('50,000', 80), { exact: false })).toBeTruthy()
  })

  it('calls an urgent quest the boss, and gives its lines', async () => {
    await open('/mana')

    expect(await screen.findByRole('heading', { name: t.mana.boss })).toBeTruthy()
    expect(screen.getByText(t.mana.linesLine(812, 95, '1649ade'))).toBeTruthy()
  })

  it('leaves the block out with no active quest', async () => {
    await open('/mana', { readMana: async () => mana({ active: null, lines: null }) })

    await screen.findByText(t.mana.week)
    expect(screen.queryByText(t.mana.messages)).toBeNull()
  })

  it('leaves the lines out when they could not be measured', async () => {
    await open('/mana', { readMana: async () => mana({ lines: null }) })

    await screen.findByText(t.mana.messages)
    expect(screen.queryByText(t.mana.lines)).toBeNull()
  })

  it('says so with no time this week', async () => {
    await open('/mana', { readMana: async () => mana({ byQuest: [], elsewhere: 0 }) })

    expect(await screen.findByText(t.mana.nothing)).toBeTruthy()
  })
})

describe('Hoard', () => {
  it('counts the gold by realm', async () => {
    await open('/hoard')

    expect(await screen.findByText(t.hoard.realm('queue-tea', 4))).toBeTruthy()
    expect(screen.getByText(t.hoard.goldCount(95))).toBeTruthy()
  })

  it('shows a realm with no victories at 0 gold', async () => {
    await open('/hoard', { readHoard: async () => ({ ok: true, data: { ...HOARD, realms: [{ key: 'c-000003', name: 'New realm', victories: 0, gold: 0 }] } }) })

    expect(await screen.findByText(t.hoard.goldCount(0))).toBeTruthy()
  })

  it('marks where the dragon is', async () => {
    await open('/hoard')

    await screen.findByText(t.hoard.title)
    expect(document.querySelector('.stage-i.done')?.textContent).toContain(t.hoard.stages.egg)
    expect(document.querySelector('.stage-i.now')?.textContent).toContain(t.hoard.here)
    expect(document.querySelectorAll('.stage-i.locked')).toHaveLength(3)
  })

  it('gives the XP each stage is reached at', async () => {
    await open('/hoard')

    expect(await screen.findByText(`${t.hoard.levels.young} · 1,000 XP`)).toBeTruthy()
    expect(screen.getByText(`${t.hoard.levels.elder} · 19,000 XP`)).toBeTruthy()
  })

  it('shows earned badges with a date and locked ones with progress', async () => {
    await open('/hoard', { readHoard: async () => ({ ok: true, data: { ...HOARD, game: { ...HOARD.game, badges: [{ id: 'firstFlame', need: 1, have: 1, earnedOn: '2026-10-20' }, { id: 'tenTales', need: 10, have: 5, earnedOn: null }] } } }) })

    expect(await screen.findByText(`${t.hoard.badgeLine.firstFlame()} · 20 Oct`)).toBeTruthy()
    expect(screen.getByText(t.hoard.badgeLine.tenTales(5, 10))).toBeTruthy()
    expect(screen.getByRole('img', { name: t.hoard.wayAlong(50) })).toBeTruthy()
    expect(screen.getByText(t.hoard.earned(1, 2))).toBeTruthy()
  })

  it('before the first victory, says how the hoard starts', async () => {
    await open('/hoard', { readHoard: async () => ({ ok: true, data: { ...HOARD, game: { ...GAME, victories: 0, gold: 0, xp: 0, level: 1, stage: 'egg', badges: [] }, realms: [] } }) })

    expect(await screen.findByText(t.hoard.noneYet)).toBeTruthy()
    expect(document.querySelector('.stage-i.now')?.textContent).toContain(t.hoard.stages.egg)
  })

  it('says when a broken realm is left out', async () => {
    await open('/hoard', { readHoard: async () => ({ ok: true, data: { ...HOARD, unreadable: 2 } }) })

    expect(await screen.findByText(t.chronicle.leftOut(2))).toBeTruthy()
  })
})

describe('Guild Hall', () => {
  it('reads all four helpers from the agents folder', () => {
    expect(HELPERS.map(h => h.id)).toEqual(['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd'])
    expect(HELPERS[0]).toMatchObject({ name: 'Commit Chai-n', role: 'Git', mention: '@queue-tea:commit-chai-n', kind: 'git', skills: ['git-workflow-and-versioning'] })
    expect(HELPERS[1]!.skills.length).toBeGreaterThan(1)
  })

  it('drops the sentence that only names the helper', () => {
    expect(HELPERS[3]!.summary.startsWith('Use for every feature')).toBe(true)
  })

  it('has a logo for each', () => {
    for (const helper of HELPERS) expect(helper.logo).not.toBe('')
  })

  it('shows each helper and copies its @-mention', async () => {
    const { engine } = await open('/guild')

    expect(screen.getByRole('heading', { name: 'Tea-DD' })).toBeTruthy()
    await press(t.guild.copy('Tea-DD'))

    await waitFor(() => expect(engine.copyText).toHaveBeenCalledWith('@queue-tea:tea-dd'))
  })

  it('the Guild Hall says where helpers are turned on', async () => {
    await open('/guild')

    expect(screen.getByText(t.guild.where)).toBeTruthy()
  })

  it('offers nothing that hands work to a helper', async () => {
    await open('/guild')

    for (const control of screen.getAllByRole('button').filter(b => b.closest('.party') !== null)) {
      expect(control.getAttribute('aria-label')).toMatch(/^Copy/)
    }
  })
})
