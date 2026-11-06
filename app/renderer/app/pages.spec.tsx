// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HELPER_ORDER_CHARS } from '../../shared/engine_api'
import type { ChronicleView, EngineApi, ManaView, Reply } from '../../shared/engine_api'
import { formatMinutes } from '../core/domain/format'
import { HELPERS } from '../features/guild/domain/helpers'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { CHRONICLE, fakeEngine, GAME, helperJob, HOARD, MANA, victoryLine } from '../test_support'
import { App } from './app'

const open = async (route: string, over: Partial<EngineApi> = {}) => {
  window.location.hash = `#${route}`
  const { engine, fire, tellHelpers } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, fire, tellHelpers }
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

  it('⌘3 opens Designs, and Branches, Chronicle and Mana move to ⌘4, ⌘5 and ⌘6', async () => {
    await open('/home')

    await act(() => void fireEvent.keyDown(document.body, { key: '3', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/designs'))
    await act(() => void fireEvent.keyDown(document.body, { key: '4', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/branches'))
    await act(() => void fireEvent.keyDown(document.body, { key: '5', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/chronicle'))
    await act(() => void fireEvent.keyDown(document.body, { key: '6', metaKey: true }))
    await waitFor(() => expect(window.location.hash).toBe('#/mana'))
  })

  it('puts the Designs tab right after Quests', async () => {
    await open('/home')

    const tabs = screen.getAllByRole('link').map(link => link.getAttribute('href'))
    expect(tabs.indexOf('#/designs')).toBe(tabs.indexOf('#/quests') + 1)
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
    expect(HELPERS[0]).toMatchObject({ name: 'Commit Chai-n', role: 'Git', mention: '@queue-tea:commit-chai-n', kind: 'git', skills: ['git-workflow-and-versioning', 'tea-concile'] })
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

  it('each helper waits for an order with a line of its own', async () => {
    await open('/guild')

    expect(await screen.findByText(t.guild.idle['tea-dd'])).toBeTruthy()
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
    expect(document.querySelectorAll('.portrait.idle')).toHaveLength(4)
  })

  it('says where orders go once a realm is picked', async () => {
    await open('/guild')

    expect(screen.getByText(t.guild.worksIn('a'))).toBeTruthy()
  })

  it('asks for a realm before it takes orders', async () => {
    await open('/guild', { listProjects: async () => ({ ok: true as const, data: [] }) })

    expect(screen.getByText(t.guild.pickRealm)).toBeTruthy()
    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: t.guild.send })).toBeNull()
  })

  it('says it is checking on the helpers until the first read lands', async () => {
    await open('/guild', { readHelpers: () => new Promise(() => {}) })

    expect(within(screen.getByRole('article', { name: 'Tea-DD' })).getByRole('status').textContent).toBe(t.guild.checking)
  })

  it('says an empty order is required and sends nothing', async () => {
    const { engine } = await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))

    expect(card.getByText(t.guild.orderRequired)).toBeTruthy()
    expect(engine.sendHelper).not.toHaveBeenCalled()
  })

  it('checks the order when the field loses focus', async () => {
    await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Chai-pter' }))

    await act(() => void fireEvent.blur(card.getByLabelText(/Order for Chai-pter/)))

    expect(card.getByText(t.guild.orderRequired)).toBeTruthy()
  })

  it('sends the order to the helper in the picked realm and clears the field', async () => {
    const { engine } = await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))
    const field = card.getByLabelText(/Order for Tea-DD/) as HTMLTextAreaElement

    await act(() => void fireEvent.input(field, { target: { value: '  Write tests for the timer  ' } }))
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))

    await waitFor(() => expect(engine.sendHelper).toHaveBeenCalledWith('a-000001', 'tea-dd', 'Write tests for the timer'))
    await waitFor(() => expect(field.value).toBe(''))
  })

  it('shows a refusal from the engine under the order', async () => {
    await open('/guild', { sendHelper: vi.fn(async () => ({ ok: false as const, error: { message: 'This helper is still on its last order.' } })) })
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    await act(() => void fireEvent.input(card.getByLabelText(/Order for Tea-DD/), { target: { value: 'Again' } }))
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))

    await waitFor(() => expect(card.getByRole('alert').textContent).toBe('This helper is still on its last order.'))
  })

  it('shows what a working helper is doing, and stops it', async () => {
    const { engine, tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ doing: { kind: 'reading', target: 'timer.ts' }, steps: 3 })]))
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    expect(card.getByText(t.guild.doing('reading', 'timer.ts'))).toBeTruthy()
    expect(card.getByText(t.guild.working(3, 'a-000001'))).toBeTruthy()
    expect(document.querySelector('.member.tests .portrait.working')).not.toBeNull()
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.stop })))

    await waitFor(() => expect(engine.stopHelper).toHaveBeenCalledWith('tea-dd'))
  })

  it("shows Claude's own words for a command, with nothing in front", async () => {
    const { tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ doing: { kind: 'step', target: 'Run the tests' }, steps: 1 })]))

    expect(within(screen.getByRole('article', { name: 'Tea-DD' })).getByText('Run the tests…')).toBeTruthy()
  })

  it("shows the helper's answer when it is done", async () => {
    const { tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ helper: 'chai-pter', status: 'done', reply: 'The README now covers Branches.', steps: 4, finished: 1 })]))
    const card = within(screen.getByRole('article', { name: 'Chai-pter' }))

    expect(card.getByText('The README now covers Branches.')).toBeTruthy()
    expect(card.getByText(t.guild.states.done)).toBeTruthy()
  })

  it('says why a helper got stuck and sends the same order again', async () => {
    const { engine, tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ realm: 'b-000002', status: 'failed', error: 'The helper could not finish this order.', finished: 1 })]))
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))
    expect(card.getByRole('alert').textContent).toBe('The helper could not finish this order.')
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.tryAgain })))

    await waitFor(() => expect(engine.sendHelper).toHaveBeenCalledWith('b-000002', 'tea-dd', 'Write tests for the timer'))
  })

  it("says so when it can't see what the helpers are doing", async () => {
    await open('/guild', { readHelpers: async () => ({ ok: false as const, error: { message: "Couldn't see what the helpers are doing. Try again." } }) })

    expect(await screen.findByText("Couldn't see what the helpers are doing. Try again.")).toBeTruthy()
    expect(screen.getByRole('button', { name: t.failed.tryAgain })).toBeTruthy()
  })

  it('says it is getting started before the first step', async () => {
    const { tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob()]))
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    expect(card.getByText(t.guild.starting)).toBeTruthy()
    expect(card.getByText(t.guild.working(0, 'a-000001'))).toBeTruthy()
  })

  it('a helper at work can be stopped while no realm is picked', async () => {
    const { engine, tellHelpers } = await open('/guild', { listProjects: async () => ({ ok: true as const, data: [] }) })

    await act(() => tellHelpers([helperJob()]))
    await press(t.guild.stop)

    await waitFor(() => expect(engine.stopHelper).toHaveBeenCalledWith('tea-dd'))
  })

  it('shows why a stop did not go through', async () => {
    const { tellHelpers } = await open('/guild', { stopHelper: vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't stop the helper. Try again." } })) })

    await act(() => tellHelpers([helperJob()]))
    await press(t.guild.stop)
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    await waitFor(() => expect(card.getByRole('alert').textContent).toBe("Couldn't stop the helper. Try again."))
  })

  it('says Sending… while the order is on its way, and a second press sends nothing more', async () => {
    const { engine } = await open('/guild', { sendHelper: vi.fn(() => new Promise<never>(() => {})) })
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    await act(() => void fireEvent.input(card.getByLabelText(/Order for Tea-DD/), { target: { value: 'Write tests' } }))
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))
    const sending = card.getByRole('button', { name: t.guild.sending }) as HTMLButtonElement
    await act(() => void fireEvent.click(sending))

    expect(sending.disabled).toBe(false)
    expect(engine.sendHelper).toHaveBeenCalledTimes(1)
  })

  it('shows an answer that came while you were on another page', async () => {
    let jobs = [helperJob()]
    const { tellHelpers } = await open('/guild', { readHelpers: async () => ({ ok: true as const, data: jobs }) })
    expect(await screen.findByText(t.guild.starting)).toBeTruthy()

    window.location.hash = '#/hoard'
    await waitFor(() => expect(screen.queryByRole('heading', { name: t.guild.title })).toBeNull())
    jobs = [helperJob({ status: 'done', reply: 'Added three tests.', steps: 2, finished: 1 })]
    act(() => tellHelpers(jobs))
    window.location.hash = '#/guild'

    expect(await screen.findByText('Added three tests.')).toBeTruthy()
  })

  it('marks the order required and keeps Send enabled while the order has an error', async () => {
    await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))

    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))

    expect(card.getByLabelText(`${t.guild.orderLabel('Tea-DD')} *`)).toBeTruthy()
    expect((card.getByRole('button', { name: t.guild.send }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('says an order one past the limit is too long once the field loses focus, under the field, and sends nothing', async () => {
    const { engine } = await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))
    const field = card.getByLabelText(/Order for Tea-DD/)
    const tooLong = t.guild.orderLong(HELPER_ORDER_CHARS)

    await act(() => void fireEvent.input(field, { target: { value: 'x'.repeat(HELPER_ORDER_CHARS + 1) } }))
    expect(card.queryByText(tooLong)).toBeNull()
    await act(() => void fireEvent.blur(field))

    expect(document.getElementById(field.getAttribute('aria-describedby')!)?.textContent).toBe(tooLong)
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))
    expect(engine.sendHelper).not.toHaveBeenCalled()
  })

  it('sends an order of exactly the longest length', async () => {
    const { engine } = await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))
    const longest = 'x'.repeat(HELPER_ORDER_CHARS)

    await act(() => void fireEvent.input(card.getByLabelText(/Order for Tea-DD/), { target: { value: longest } }))
    await act(() => void fireEvent.click(card.getByRole('button', { name: t.guild.send })))

    await waitFor(() => expect(engine.sendHelper).toHaveBeenCalledWith('a-000001', 'tea-dd', longest))
  })

  it('takes the error away once the order is fixed', async () => {
    await open('/guild')
    const card = within(screen.getByRole('article', { name: 'Tea-DD' }))
    const field = card.getByLabelText(/Order for Tea-DD/)

    await act(() => void fireEvent.blur(field))
    await act(() => void fireEvent.input(field, { target: { value: 'Write tests' } }))

    expect(card.queryByText(t.guild.orderRequired)).toBeNull()
  })

  it('shows on the portrait when a helper is stuck or stopped', async () => {
    const { tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ helper: 'chai-pter', status: 'failed', error: 'Stuck.', finished: 1 }), helperJob({ status: 'stopped', finished: 1 })]))

    expect(screen.getByRole('article', { name: 'Chai-pter' }).querySelector('.portrait.failed')).not.toBeNull()
    expect(screen.getByRole('article', { name: 'Tea-DD' }).querySelector('.portrait.stopped')).not.toBeNull()
    expect(within(screen.getByRole('article', { name: 'Tea-DD' })).getByText(t.guild.stopped)).toBeTruthy()
  })

  it('draws each helper as a bot in its mood, and sends a stopped merge order back to its merge', async () => {
    const { engine, tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ status: 'stopped', merge: 'op-1', order: 'Resolve the conflicts', finished: 1 })]))
    const card = screen.getByRole('article', { name: 'Tea-DD' })
    expect(card.querySelector('.portrait svg.bot.stopped')).not.toBeNull()
    await act(() => void fireEvent.click(within(card).getByRole('button', { name: t.guild.tryAgain })))

    expect(engine.concileMerge).toHaveBeenCalledWith('a-000001', 'tea-dd', 'op-1')
    expect(engine.sendHelper).not.toHaveBeenCalled()
  })

  it('says so when a helper is done with nothing to say', async () => {
    const { tellHelpers } = await open('/guild')

    await act(() => tellHelpers([helperJob({ status: 'done', reply: '  ', steps: 1, finished: 1 })]))

    expect(within(screen.getByRole('article', { name: 'Tea-DD' })).getByText(t.guild.noReply)).toBeTruthy()
  })
})
