import type { ComponentChildren } from 'preact'

import type { GameView } from '../../../../../shared/engine_api'
import { hrefOf, ROUTES } from '../../../../config/routing/routes'
import { manaLeft, refillTime } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { isStreakAtRisk, momentumOf } from '../../domain/momentum'
import type { Momentum, QuestAhead } from '../../domain/momentum'
import type { Load } from '../../state_management/workspace_store'

const FLAME = 'M8 14.5c-3 0-4.5-2-4.5-4.3C3.5 7 6.5 6 6.5 2.5c2 1.2 3 3 2.8 4.6.8-.4 1.3-1.1 1.4-2 1.5 1.3 1.8 3 1.8 4.5 0 2.7-1.6 4.9-4.5 4.9z'
const COIN = 'M8 5v6M6.3 6.5h2.6a1.2 1.2 0 0 1 0 2.4H7.1a1.2 1.2 0 0 0 0 2.4h2.6'
const CRYSTAL = 'M8 1.5 12.5 6 8 14.5 3.5 6zM3.5 6h9M8 1.5 6.5 6 8 14.5 9.5 6z'

const percent = (share: number): string => `${share * 100}%`

// The road to the next level: how far you've come, the stretch the quest ahead
// would add, and a pearl at the front of it.
const Road = ({ momentum, label }: { momentum: Momentum; label: string }) => (
  <span class="bar xp road" role="img" aria-label={label}>
    <span class="fill" style={{ transform: `scaleX(${momentum.share})` }} />
    {momentum.gain > 0 && <span class="gain" style={{ left: percent(momentum.share), width: percent(momentum.gain) }} />}
    <span class="pearl" style={{ transform: `translateX(${percent(momentum.share)})` }} />
  </span>
)

const Level = ({ game, quest }: { game: GameView; quest: QuestAhead | null }) => {
  const momentum = momentumOf(game, quest)

  return (
    <a class={momentum.isClose ? 'hud-chip panel lvl close' : 'hud-chip panel lvl'} href={hrefOf(ROUTES.hoard)} aria-label={t.hud.levelLink(game.level, momentum.headline, momentum.hook)}>
      <span class="lvl-badge">{t.hud.level(game.level)}</span>
      <span class="road-stack">
        <span class="road-head">
          <b>{momentum.headline}</b>
        </span>
        <Road momentum={momentum} label={t.hud.xp(game.xpIntoLevel, game.xpToNextLevel, game.level + 1)} />
        <span class="hud-sub road-hook">{momentum.hook}</span>
      </span>
    </a>
  )
}

const Streak = ({ game }: { game: GameView }) => (
  <a class={isStreakAtRisk(game) ? 'hud-chip panel risk' : 'hud-chip panel'} href={hrefOf(ROUTES.chronicle)} aria-label={t.hud.streakLink(game.streak, game.bestStreak)}>
    <svg class="ico flame" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
      <path d={FLAME} />
    </svg>
    <span class="hud-stack">
      <b>{t.hud.streak(game.streak)}</b>
      <span class="hud-sub">{t.hud.best(game.bestStreak)}</span>
    </span>
  </a>
)

const Gold = ({ game }: { game: GameView }) => (
  <a class="hud-chip panel" href={hrefOf(ROUTES.hoard)} aria-label={t.hud.goldLink(game.gold)}>
    <svg class="ico coin" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <path d={COIN} />
    </svg>
    <span class="hud-stack">
      <b>{game.gold}</b>
      <span class="hud-sub">{t.hud.gold}</span>
    </span>
  </a>
)

// Only once it's known. A pill with nothing to say just looks like a button.
const Mana = ({ game }: { game: GameView }) => {
  if (game.allowance === null) return null
  const left = manaLeft(game.allowance)

  return (
    <div class="hud-chip panel mana">
      <svg class="ico crystal" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
        <path d={CRYSTAL} />
      </svg>
      <span class="hud-stack">
        <span class="bar mp" role="img" aria-label={t.hud.manaLabel(left)}>
          <span class="fill" style={{ transform: `scaleX(${left / 100})` }} />
        </span>
        <span class="hud-sub">{t.hud.mana(left, refillTime(game.allowance))}</span>
      </span>
    </div>
  )
}

type HudProps = { game: Load<GameView>; quest: QuestAhead | null; onRetry: () => void; children?: ComponentChildren }

export const Hud = ({ game, quest, onRetry, children }: HudProps) => {
  if (game.status === 'loading') {
    return (
      <div class="hud" role="status">
        <div class="hud-chip panel">
          <Spinner />
          <span class="hud-sub">{t.loading.game}</span>
        </div>
      </div>
    )
  }
  if (game.status === 'failed') {
    return (
      <div class="hud" role="alert">
        <div class="hud-chip panel">
          <span class="hud-sub">{game.message}</span>
          <button type="button" class="link-btn" onClick={onRetry}>
            {t.failed.tryAgain}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div class="hud">
      <Level game={game.data} quest={quest} />
      <Streak game={game.data} />
      <Gold game={game.data} />
      <Mana game={game.data} />
      {children}
    </div>
  )
}
