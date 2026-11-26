import { describe, expect, it } from 'vitest'

import type { Recipe, RecipeMark, RecipeStageId } from '../../../../shared/engine_api'
import { checkTally, isRecipeDetail, progressOf, recipeStatus, showsSteps, showsTechnical, stageCount } from './recipe_view'

const IDS: RecipeStageId[] = ['setOut', 'understand', 'design', 'build', 'verify', 'review']

const recipe = (marks: RecipeMark[], over: Partial<Recipe> = {}): Recipe => ({
  phase: 'active',
  stages: marks.map((mark, i) => ({ id: IDS[i] ?? 'review', mark })),
  goal: null,
  steps: [],
  doneWhen: [],
  attention: [],
  profile: null,
  checks: [],
  notes: [],
  written: null,
  ...over,
})

describe('where a recipe is', () => {
  it('counts the stage in hand, and the last stage once all are done', () => {
    expect(stageCount(recipe(['done', 'done', 'now', 'next', 'next']))).toEqual({ at: 3, of: 5 })
    expect(stageCount(recipe(['now', 'next', 'next', 'next', 'next', 'next']))).toEqual({ at: 1, of: 6 })
    expect(stageCount(recipe(['done', 'done', 'done', 'done', 'done']))).toEqual({ at: 5, of: 5 })
  })

  it('counts the stage in hand as half done', () => {
    expect(progressOf(recipe(['done', 'done', 'now', 'next', 'next']))).toBe(0.5)
    expect(progressOf(recipe(['done', 'done', 'done', 'done', 'done']))).toBe(1)
    expect(progressOf(recipe([]))).toBe(0)
  })
})

describe('what a recipe says the quest is doing', () => {
  const going = recipe(['done', 'now', 'next', 'next', 'next'])

  it('follows the session while the quest is in hand', () => {
    expect(recipeStatus(going, 'working', false)).toBe('brewing')
    expect(recipeStatus(going, 'several', false)).toBe('brewing')
    expect(recipeStatus(going, 'open', false)).toBe('waiting')
    expect(recipeStatus(going, 'needsYou', false)).toBe('needsYou')
    expect(recipeStatus(going, 'none', false)).toBe('paused')
  })

  it('waits on Rohan once Claude says it looks done, even mid-turn', () => {
    expect(recipeStatus(recipe(['done', 'done', 'done', 'done', 'now'], { attention: [{ kind: 'looksDone', text: null }] }), 'working', false)).toBe('needsYou')
  })

  it('is with Codex while Codex has it', () => {
    expect(recipeStatus(going, 'none', true)).toBe('withCodex')
  })

  it('goes by the quest itself once it is back in the queue or complete', () => {
    expect(recipeStatus(recipe(['done', 'now', 'next', 'next', 'next'], { phase: 'paused' }), 'working', true)).toBe('shelved')
    expect(recipeStatus(recipe(['done', 'done', 'done', 'done', 'done'], { phase: 'complete' }), 'working', false)).toBe('complete')
  })
})

describe('how much a depth shows', () => {
  it('keeps the steps out of compact, and the notes and checks for technical', () => {
    expect([showsSteps('compact'), showsSteps('detailed'), showsSteps('technical')]).toEqual([false, true, true])
    expect([showsTechnical('compact'), showsTechnical('detailed'), showsTechnical('technical')]).toEqual([false, false, true])
  })

  it('knows its own depths and no others', () => {
    expect(['compact', 'detailed', 'technical'].every(isRecipeDetail)).toBe(true)
    expect([undefined, 'everything', 3].some(isRecipeDetail)).toBe(false)
  })

  it('tallies the checks', () => {
    const at = '2026-11-25T15:33:10-06:00'
    expect(checkTally([{ command: 'npm test', isOk: true, at, summary: '' }, { command: 'npm run lint', isOk: false, at, summary: '' }, { command: 'npm run typecheck', isOk: true, at, summary: '' }])).toEqual({ passed: 2, failed: 1 })
  })
})
