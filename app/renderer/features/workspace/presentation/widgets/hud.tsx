import type { GameView } from '../../../../../shared/engine_api'
import { manaLeft, refillTime } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load } from '../../state_management/workspace_store'

const Bar = ({ kind, share, label }: { kind: 'xp' | 'mp'; share: number; label: string }) => (
  <span class={`bar ${kind}`} role="img" aria-label={label}>
    <span class="fill" style={{ transform: `scaleX(${share})` }} />
  </span>
)

const Mana = ({ game }: { game: GameView }) => {
  if (game.allowance === null) {
    return (
      <div class="hud-chip panel mana">
        <span class="hud-stack">
          <span class="hud-sub">{t.hud.manaUnknown}</span>
        </span>
      </div>
    )
  }
  const left = manaLeft(game.allowance)

  return (
    <div class="hud-chip panel mana">
      <span class="hud-stack">
        <Bar kind="mp" share={left / 100} label={t.hud.manaLabel(left)} />
        <span class="hud-sub">{t.hud.mana(left, refillTime(game.allowance))}</span>
      </span>
    </div>
  )
}

export const Hud = ({ game, onRetry }: { game: Load<GameView>; onRetry: () => void }) => {
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

  const { data } = game
  const xpLine = t.hud.xp(data.xpIntoLevel, data.xpToNextLevel, data.level + 1)

  return (
    <div class="hud">
      <div class="hud-chip panel lvl">
        <span class="lvl-badge">{t.hud.level(data.level)}</span>
        <span class="hud-stack">
          <Bar kind="xp" share={data.xpIntoLevel / data.xpToNextLevel} label={xpLine} />
          <span class="hud-sub">{xpLine}</span>
        </span>
      </div>
      <div class="hud-chip panel">
        <span class="hud-stack">
          <b>{t.hud.streak(data.streak)}</b>
          <span class="hud-sub">{t.hud.best(data.bestStreak)}</span>
        </span>
      </div>
      <div class="hud-chip panel">
        <span class="hud-stack">
          <b>{data.gold}</b>
          <span class="hud-sub">{t.hud.gold}</span>
        </span>
      </div>
      <Mana game={data} />
    </div>
  )
}
