import { useEffect, useState } from 'preact/hooks'

import type { EngineApi, RecipeDetail } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { DEFAULT_RECIPE_DETAIL, isRecipeDetail } from '../../domain/recipe_view'

// How much of a recipe Rohan last chose to see. It is kept in the app's
// settings, so it holds across restarts, and remembered here too, so the next
// pane that opens starts at it without waiting for a read.
let remembered: RecipeDetail | null = null

// For tests: start again as a fresh window would.
export const forgetRecipeDetail = () => {
  remembered = null
}

export type RecipeDetailChoice = {
  detail: RecipeDetail
  pick: (detail: RecipeDetail) => void
  isSaving: boolean
  failure: string | null
  retry: () => void
}

export const useRecipeDetail = (engine: EngineApi): RecipeDetailChoice => {
  const [detail, setDetail] = useState<RecipeDetail>(remembered ?? DEFAULT_RECIPE_DETAIL)
  const [isSaving, setSaving] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  useEffect(() => {
    if (remembered !== null) return undefined
    let isLive = true
    void ask(engine, () => engine.readSettings()).then(answer => {
      // A settings read that fails leaves the recipe compact; the Settings
      // page is where that failure is shown and put right.
      if (!answer.ok) {
        engine.log('warn', `the recipe detail did not read: ${answer.message}`)

        return
      }
      if (remembered === null) remembered = isRecipeDetail(answer.data.recipeDetail) ? answer.data.recipeDetail : DEFAULT_RECIPE_DETAIL
      if (isLive) setDetail(remembered)
    })

    return () => {
      isLive = false
    }
  }, [engine])

  const save = async (next: RecipeDetail) => {
    setSaving(true)
    const answer = await ask(engine, () => engine.saveSettings({ recipeDetail: next }))
    setSaving(false)
    setFailure(answer.ok ? null : answer.message)
  }

  return {
    detail,
    pick: next => {
      remembered = next
      setDetail(next)
      void save(next)
    },
    isSaving,
    failure,
    retry: () => void save(detail),
  }
}
