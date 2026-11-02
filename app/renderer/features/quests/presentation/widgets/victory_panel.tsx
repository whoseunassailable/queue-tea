import { useLayoutEffect, useRef } from 'preact/hooks'

import { GROWS_AT } from '../../../../core/constants/constants'
import { t } from '../../../../l10n/en'
import { GoldReward, XpReward } from '../../../../core/widgets/tags'
import type { Won } from '../../../workspace/state_management/workspace_store'

// Where each coin lands, and when it sets off.
const COINS = [
  { dx: -220, dy: -160, delay: 0 },
  { dx: -140, dy: -230, delay: 0.05 },
  { dx: -40, dy: -260, delay: 0.1 },
  { dx: 60, dy: -250, delay: 0.02 },
  { dx: 160, dy: -210, delay: 0.12 },
  { dx: 230, dy: -140, delay: 0.07 },
  { dx: -260, dy: -60, delay: 0.15 },
  { dx: 270, dy: -50, delay: 0.18 },
] as const

// Shown once the win is saved, so it can't hold anything up. It takes no keys
// of its own: the board's keep working behind it, and the window handles Esc.
export const VictoryPanel = ({ won, isCalm, onClose }: { won: Won; isCalm: boolean; onClose: () => void }) => {
  const { victory, logPath } = won
  const close = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => close.current?.focus(), [])
  const finished = t.win.finishedAs(t.difficulty[victory.actual], t.difficulty[victory.expected])
  const growsAt = GROWS_AT[victory.stage]

  return (
    <div
      class="win-layer"
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {!isCalm && (
        <div class="coins" aria-hidden="true">
          {COINS.map(coin => (
            <span key={coin.dx} class="cn" style={{ '--dx': `${coin.dx}px`, '--dy': `${coin.dy}px`, animationDelay: `${coin.delay}s` }} />
          ))}
        </div>
      )}
      <div class="victory panel" role="dialog" aria-labelledby="w-title">
        <p class="win-kicker">{t.win.kicker[victory.kind]}</p>
        <h2 class="win-title" id="w-title">
          {t.win.title}
        </h2>
        <p class="win-quest">{victory.title}</p>
        <div class="win-rows">
          {victory.didLevelUp && (
            <p>
              <span class="reward xp">{t.win.level(victory.level)}</span>
              <span>{t.win.nextLevel(victory.nextLevelAt)}</span>
            </p>
          )}
          <p>
            <XpReward xp={victory.xp} />
            <span>{t.win.toLevel(victory.xpIntoLevel, victory.xpToNextLevel, victory.level + 1)}</span>
          </p>
          <p>
            <GoldReward gold={victory.gold} />
            <span>{t.win.hoard(victory.hoard)}</span>
          </p>
          {victory.newBadges.map(badge => (
            <p key={badge}>
              <span class="reward badge-r">{t.badges[badge]}</span>
              <span>{t.win.badgeEarned}</span>
            </p>
          ))}
        </div>
        <p class="win-note">{logPath === null ? finished : `${finished} · ${t.win.rowWent(logPath)}`}</p>
        {victory.didLevelUp && growsAt !== null && <p class="win-note">{t.win.grows(t.stage[victory.stage], growsAt)}</p>}
        <button ref={close} type="button" class="btn primary" onClick={onClose}>
          {t.win.close}
        </button>
      </div>
    </div>
  )
}
