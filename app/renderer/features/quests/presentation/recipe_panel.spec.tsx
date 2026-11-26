// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, Recipe, RecipeDetail, RecipeStageId, SessionState } from '../../../../shared/engine_api'
import { dayAndTime } from '../../../core/domain/format'
import { t } from '../../../l10n/en'
import { fakeEngine } from '../../../test_support'
import { forgetRecipeDetail } from './state_management/recipe_detail'
import { RecipePanel } from './widgets/recipe_panel'

const AT = '2026-11-25T15:33:10-06:00'
const ORDER: RecipeStageId[] = ['setOut', 'understand', 'build', 'verify', 'review']

// A recipe on its third of five stages, with a checkpoint behind it.
const recipe = (over: Partial<Recipe> = {}): Recipe => ({
  phase: 'active',
  stages: ORDER.map((id, i) => ({ id, mark: i < 2 ? 'done' : i === 2 ? 'now' : 'next' })),
  goal: 'Stop saving every command',
  steps: [
    { text: 'Dropped activity from the record', mark: 'done' },
    { text: 'Update the docs', mark: 'now' },
    { text: 'Run the e2e', mark: 'next' },
  ],
  doneWhen: ['One line shows the current step'],
  attention: [],
  profile: { id: 'deep', by: 'tea-dd', reason: 'a stored field' },
  checks: [
    { command: 'npm run typecheck', isOk: true, at: AT, summary: '' },
    { command: 'npm test', isOk: false, at: AT, summary: '1 failed' },
  ],
  notes: [
    { kind: 'decisions', heading: null, lines: ['Keep the latest step only'] },
    { kind: 'rejected', heading: null, lines: ['A capped list of steps'] },
  ],
  written: { kind: 'checkpoint', at: AT },
  ...over,
})

const savedAt = (detail: RecipeDetail | undefined) => ({
  readSettings: vi.fn(async () => ({ ok: true as const, data: { sky: 'day' as const, isCalm: false, lastProject: null, folds: {}, terminal: 'terminal' as const, chronicleScope: 'realm' as const, letterKeys: true, realmAccounts: {}, recipeDetail: detail } })),
})

const show = async (shown: Recipe = recipe(), session: SessionState = 'working', over: Partial<EngineApi> = {}, isWithCodex = false) => {
  const { engine } = fakeEngine(over)
  await act(async () => {
    render(<RecipePanel engine={engine} recipe={shown} session={session} isWithCodex={isWithCodex} />)
  })

  return { engine, panel: () => screen.getByRole('region', { name: t.recipe.label }) }
}

const pick = (detail: RecipeDetail) => act(() => void fireEvent.click(screen.getByRole('button', { name: t.recipe.details[detail] })))
const pressedDetail = () => screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent)

afterEach(() => {
  cleanup()
  forgetRecipeDetail()
})

describe('a quest\'s recipe, compact', () => {
  it('opens compact, with the stage it is on, how far through, and the verification in one line', async () => {
    const { panel } = await show()

    expect(pressedDetail()).toEqual([t.recipe.details.compact])
    expect(within(panel()).getByText(t.recipe.step(3, 5))).toBeTruthy()
    expect(within(panel()).getByText(t.recipe.status.brewing)).toBeTruthy()
    expect(within(panel()).getByRole('progressbar', { name: t.recipe.progress(3, 5) }).getAttribute('aria-valuenow')).toBe('2')
    expect(within(panel()).getAllByRole('listitem').map(li => li.textContent)).toEqual(ORDER.map((id, i) => `${t.recipe.marks[i < 2 ? 'done' : i === 2 ? 'now' : 'next']}: ${t.recipe.stages[id]}`))
    expect(within(panel()).getByText(t.recipe.stages.build).closest('li')!.getAttribute('aria-current')).toBe('step')
    expect(within(panel()).getByText(t.recipe.verification('Deep', t.recipe.scope.deep), { exact: false })).toBeTruthy()
    expect(within(panel()).getByText(`· ${t.recipe.tally(1, 1)}`, { exact: false })).toBeTruthy()
  })

  it('keeps the steps, the goal and every check out of the compact view', async () => {
    const { panel } = await show()

    expect(within(panel()).queryByText('Update the docs')).toBeNull()
    expect(within(panel()).queryByText('Stop saving every command')).toBeNull()
    expect(within(panel()).queryByText('npm test')).toBeNull()
  })

  it('says when Tea-DD has yet to pick a profile, and leaves out a tally with no checks', async () => {
    const { panel } = await show(recipe({ profile: null, checks: [] }))

    expect(within(panel()).getByText(t.recipe.noProfile)).toBeTruthy()
    expect(within(panel()).queryByText(/checks passed/)).toBeNull()
  })

  it('shows blockers and Claude\'s question above the stages at every depth', async () => {
    await show(recipe({ attention: [{ kind: 'looksDone', text: null }, { kind: 'blocker', text: 'Needs the staging key' }] }), 'needsYou')
    const needs = () => screen.getByRole('list', { name: t.recipe.attentionLabel })

    for (const detail of ['compact', 'detailed', 'technical'] as const) {
      await pick(detail)
      expect(within(needs()).getByText(t.recipe.attention.looksDone)).toBeTruthy()
      expect(within(needs()).getByText('Needs the staging key', { exact: false })).toBeTruthy()
    }
    expect(screen.getByText(t.recipe.status.needsYou)).toBeTruthy()
  })
})

describe('what the recipe says the quest is doing', () => {
  it.each([
    ['working', 'brewing'],
    ['several', 'brewing'],
    ['open', 'waiting'],
    ['none', 'paused'],
    ['needsYou', 'needsYou'],
  ] as const)('a %s session reads as %s', async (session, status) => {
    await show(recipe(), session)

    expect(screen.getByText(t.recipe.status[status])).toBeTruthy()
  })

  it('is with Codex while Codex has it', async () => {
    await show(recipe(), 'none', {}, true)

    expect(screen.getByText(t.recipe.status.withCodex)).toBeTruthy()
  })

  it('is paused back in the queue, or complete with every stage counted', async () => {
    await show(recipe({ phase: 'paused' }))
    expect(screen.getByText(t.recipe.status.shelved)).toBeTruthy()
    cleanup()

    await show(recipe({ phase: 'complete', stages: ORDER.map(id => ({ id, mark: 'done' })) }))
    expect(screen.getByText(t.recipe.status.complete)).toBeTruthy()
    expect(screen.getByText(t.recipe.step(5, 5))).toBeTruthy()
  })
})

describe('a quest\'s recipe, opened up', () => {
  it('shows the goal, the steps with the one in hand and what counts as done, keeping the stages', async () => {
    const { panel } = await show()

    await pick('detailed')

    expect(within(panel()).getByText('Stop saving every command')).toBeTruthy()
    expect(within(panel()).getByText('Update the docs').closest('li')!.getAttribute('aria-current')).toBe('step')
    expect(within(panel()).getByText('One line shows the current step')).toBeTruthy()
    expect(within(panel()).getByText(t.recipe.written.checkpoint(dayAndTime(AT)))).toBeTruthy()
    expect(within(panel()).getByText(t.recipe.stages.build)).toBeTruthy()
    expect(within(panel()).queryByText('Keep the latest step only')).toBeNull()
  })

  it('says when no steps are written yet', async () => {
    await show(recipe({ steps: [], goal: null, written: null }))

    await pick('detailed')

    expect(screen.getByText(t.recipe.noSteps)).toBeTruthy()
  })

  it('adds the decisions, the approaches dropped and each check with its result, technically', async () => {
    const { panel } = await show()

    await pick('technical')

    expect(within(panel()).getByText(t.recipe.notes.decisions)).toBeTruthy()
    expect(within(panel()).getByText('A capped list of steps')).toBeTruthy()
    const failed = within(panel()).getByText('npm test').closest('li')!
    expect(within(failed).getByText(t.recipe.checkResult.failed)).toBeTruthy()
    expect(within(failed).getByText('1 failed')).toBeTruthy()
    expect(within(panel()).getByText('Update the docs')).toBeTruthy()
  })

  it('keeps a handoff section under Claude\'s own heading, and a plain note whole', async () => {
    await show(recipe({ notes: [{ kind: 'section', heading: 'Open threads', lines: ['The e2e on CI'] }, { kind: 'note', heading: null, lines: ['Carry on with the diagrams.'] }] }))

    await pick('technical')

    expect(screen.getByRole('heading', { name: 'Open threads' })).toBeTruthy()
    expect(screen.getByText('Carry on with the diagrams.')).toBeTruthy()
  })

  it('says there is nothing more when Claude has written no note', async () => {
    await show(recipe({ notes: [], written: null, checks: [] }))

    await pick('technical')

    expect(screen.getByText(t.recipe.nothingTechnical)).toBeTruthy()
    expect(screen.getByText(t.recipe.noChecks)).toBeTruthy()
  })
})

describe('the depth Rohan picks', () => {
  it('is kept in the settings, and the next recipe opens at it', async () => {
    const { engine } = await show()

    await pick('technical')
    await waitFor(() => expect(engine.saveSettings).toHaveBeenCalledWith({ recipeDetail: 'technical' }))
    cleanup()

    const readSettings = vi.fn(engine.readSettings)
    await show(recipe(), 'working', { readSettings })
    expect(pressedDetail()).toEqual([t.recipe.details.technical])
    expect(screen.getByText('npm test')).toBeTruthy()
    expect(readSettings).not.toHaveBeenCalled()
  })

  it('opens at the depth saved in an earlier window', async () => {
    await show(recipe(), 'working', savedAt('detailed'))

    await waitFor(() => expect(pressedDetail()).toEqual([t.recipe.details.detailed]))
  })

  it('opens compact for settings from before the recipe, and when they don\'t read', async () => {
    await show(recipe(), 'working', savedAt(undefined))
    expect(pressedDetail()).toEqual([t.recipe.details.compact])
    cleanup()
    forgetRecipeDetail()

    await show(recipe(), 'working', { readSettings: async () => ({ ok: false, error: { message: 'No settings.' } }) })
    expect(pressedDetail()).toEqual([t.recipe.details.compact])
  })

  it('still shows the depth when it can\'t be kept, says so, and tries again', async () => {
    const saveSettings = vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't save the settings." } }))
    await show(recipe(), 'working', { saveSettings })

    await pick('detailed')

    expect(await screen.findByText(t.recipe.detailNotSaved("Couldn't save the settings."), { exact: false })).toBeTruthy()
    expect(pressedDetail()).toEqual([t.recipe.details.detailed])
    await act(() => void fireEvent.click(screen.getByRole('button', { name: t.failed.tryAgain })))
    await waitFor(() => expect(saveSettings).toHaveBeenCalledTimes(2))
    expect(saveSettings).toHaveBeenLastCalledWith({ recipeDetail: 'detailed' })
  })
})
