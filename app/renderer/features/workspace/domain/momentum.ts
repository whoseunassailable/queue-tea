import { rowsOf } from '../../quests/domain/board'
import type { Badge, GameState, ProjectView } from '../../../../shared/engine_api'
import { GROWS_AT } from '../../../core/constants/constants'
import { t } from '../../../l10n/en'

const CLOSE_SHARE = 0.9

export type QuestAhead = { title: string; xp: number }

export type Momentum = {
  // How far through the level you are, and what the quest ahead would add.
  share: number
  gain: number
  headline: string
  // The next thing worth doing, always something you can act on.
  hook: string
  isClose: boolean
}

export const isStreakAtRisk = (game: GameState): boolean => game.streak > 0 && !game.wonToday

// The quest in hand, or the main quest waiting.
export const questAheadOf = (view: Extract<ProjectView, { kind: 'readable' }> | null): QuestAhead | null => {
  if (view === null) return null
  const quest = view.active ?? rowsOf(view.ready).find(row => row.quest.isStar)?.quest

  return quest === undefined ? null : { title: quest.title, xp: quest.xp }
}

// The unearned badge you're nearest to, among those with something to count.
const nearestBadge = (badges: Badge[]): Badge | null => {
  const counting = badges.filter(badge => badge.earnedOn === null && badge.have > 0)

  return counting.sort((a, b) => a.need - a.have - (b.need - b.have))[0] ?? null
}

const laterHook = (game: GameState): string => {
  const badge = nearestBadge(game.badges)
  if (badge !== null) return t.hud.nearBadge(badge.need - badge.have, t.badges[badge.id])
  const growsAt = GROWS_AT[game.stage]

  return growsAt === null ? t.hud.elder : t.hud.grows(t.stage[game.stage], growsAt)
}

// What the level bar says. Worked out from the game and the quest ahead, so
// nothing is kept, and it always ends in something to go and do.
export const momentumOf = (game: GameState, quest: QuestAhead | null): Momentum => {
  const left = game.xpToNextLevel - game.xpIntoLevel
  const nextLevel = game.level + 1
  const reachesLevel = quest !== null && quest.xp >= left
  const atRisk = isStreakAtRisk(game)
  const share = game.xpIntoLevel / game.xpToNextLevel

  const hookOf = (): string => {
    if (reachesLevel) return t.hud.levelsUp(quest.title, nextLevel)
    if (atRisk) return t.hud.keepStreak(game.streak)
    if (quest !== null) return t.hud.questsToGo(Math.ceil(left / quest.xp), quest.xp, nextLevel)

    return laterHook(game)
  }

  return {
    share,
    gain: quest === null ? 0 : Math.min(quest.xp, left) / game.xpToNextLevel,
    headline: t.hud.toGo(left, nextLevel),
    hook: hookOf(),
    isClose: reachesLevel || share >= CLOSE_SHARE,
  }
}
