import type { Recipe, RecipeCheck, RecipeDetail, SessionState } from '../../../../shared/engine_api'

// How a recipe reads on screen: where it is, whether it's moving, and how much
// of it shows. The recipe itself comes from the engine.

export const RECIPE_DETAILS: readonly RecipeDetail[] = ['compact', 'detailed', 'technical']
export const DEFAULT_RECIPE_DETAIL: RecipeDetail = 'compact'

export const isRecipeDetail = (value: unknown): value is RecipeDetail => RECIPE_DETAILS.includes(value as RecipeDetail)

// What the quest is doing now. A quest in hand brews while Claude Code runs a
// turn, waits while it's open between turns, waits on Rohan once Claude says it
// looks done, and is paused with no session at all.
export type RecipeStatus = 'brewing' | 'waiting' | 'needsYou' | 'withCodex' | 'paused' | 'shelved' | 'complete'

export const recipeStatus = (recipe: Recipe, session: SessionState, isWithCodex: boolean): RecipeStatus => {
  if (recipe.phase === 'complete') return 'complete'
  if (recipe.phase === 'paused') return 'shelved'
  if (isWithCodex) return 'withCodex'
  if (recipe.attention.some(item => item.kind === 'looksDone') || session === 'needsYou') return 'needsYou'
  if (session === 'working' || session === 'several') return 'brewing'

  return session === 'open' ? 'waiting' : 'paused'
}

// "Step 3 of 5": the stage it is on, or the last one once all are done.
export const stageCount = (recipe: Recipe): { at: number; of: number } => {
  const of = recipe.stages.length
  const now = recipe.stages.findIndex(stage => stage.mark === 'now')

  return { at: now === -1 ? of : now + 1, of }
}

// How far through, from 0 to 1, counting the stage in hand as half done.
export const progressOf = (recipe: Recipe): number => {
  if (recipe.stages.length === 0) return 0
  const done = recipe.stages.filter(stage => stage.mark === 'done').length
  const now = recipe.stages.some(stage => stage.mark === 'now') ? 0.5 : 0

  return (done + now) / recipe.stages.length
}

export const checkTally = (checks: readonly RecipeCheck[]): { passed: number; failed: number } => ({
  passed: checks.filter(check => check.isOk).length,
  failed: checks.filter(check => !check.isOk).length,
})

// Which parts a depth shows. Attention, the stages and the verification line
// show at every depth, so nothing that needs Rohan hides in the detail.
export const showsSteps = (detail: RecipeDetail) => detail !== 'compact'
export const showsTechnical = (detail: RecipeDetail) => detail === 'technical'
