import type { Badge, EngineApi, GameState, HoardView, Stage } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { dayOf } from '../../../../core/domain/format'
import { Coins, EggArt, StageArt } from '../../../../core/widgets/art'
import { MEDALS } from '../../../../core/widgets/art/medals'
import { ReadView } from '../../../../core/widgets/read_view'
import { t } from '../../../../l10n/en'
import { STAGES, stageState, stageXp } from '../../domain/stages'

const Hoard = ({ view }: { view: HoardView }) => {
  const { game, realms } = view
  const most = Math.max(1, ...realms.map(r => r.gold))

  return (
    <section class="panel panel-pad" aria-labelledby="gold-h">
      <div class="sec-row">
        <h2 id="gold-h">{t.hoard.title}</h2>
      </div>
      <Coins />
      <p class="gold-big">
        {game.gold} <span>{t.hoard.gold(game.victories)}</span>
      </p>
      {realms.map(realm => (
        <div key={realm.key} class="bar-row">
          <span>{t.hoard.realm(realm.name, realm.victories)}</span>
          <span class="num">{t.hoard.goldCount(realm.gold)}</span>
          <span class="track">
            <span style={{ width: `${(realm.gold / most) * 100}%` }} />
          </span>
        </div>
      ))}
      <p class="card-note">{game.victories === 0 ? t.hoard.noneYet : t.hoard.note}</p>
    </section>
  )
}

const stageLine = (stage: Stage, state: 'done' | 'now' | 'locked'): string => {
  if (state === 'done') return `${t.hoard.levels[stage]} · ${t.hoard.hatched}`
  if (state === 'now') return `${t.hoard.levels[stage]} · ${t.hoard.here}`

  return `${t.hoard.levels[stage]} · ${t.hoard.atXp(stageXp(stage).toLocaleString('en-US'))}`
}

const YourDragon = ({ game }: { game: GameState }) => (
  <section class="panel panel-pad" aria-labelledby="dragon-h">
    <div class="sec-row">
      <h2 id="dragon-h">{t.hoard.dragon}</h2>
      <span class="sec-sub">{t.hoard.dragonSub(game.level, game.xp)}</span>
    </div>
    <ol class="stages">
      {STAGES.map(stage => {
        const state = stageState(stage, game.stage)

        return (
          <li key={stage} class={`stage-i ${state}`}>
            <span class="art">{stage === 'egg' ? <EggArt /> : <StageArt stage={stage} />}</span>
            <b>{t.hoard.stages[stage]}</b>
            <i>{stageLine(stage, state)}</i>
          </li>
        )
      })}
    </ol>
    <div class="bar-row">
      <span>{t.hoard.toLevel(game.level + 1)}</span>
      <span class="num">{t.hoard.xpBar(game.xpIntoLevel, game.xpToNextLevel)}</span>
      <span class="track">
        <span style={{ width: `${(game.xpIntoLevel / game.xpToNextLevel) * 100}%` }} />
      </span>
    </div>
    <p class="card-note">{t.hoard.rules}</p>
  </section>
)

const BadgeItem = ({ badge }: { badge: Badge }) => {
  const percent = Math.round((badge.have / badge.need) * 100)
  const line = t.hoard.badgeLine[badge.id](badge.have, badge.need)

  return (
    <li class={badge.earnedOn === null ? 'bdg' : 'bdg got'}>
      <span class="medal" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MEDALS[badge.id] }} />
      <span>
        <b>{t.badges[badge.id]}</b>
        <i>{badge.earnedOn === null ? line : `${line} · ${dayOf(badge.earnedOn)}`}</i>
        {badge.earnedOn === null && (
          <span class="track" role="img" aria-label={t.hoard.wayAlong(percent)}>
            <span style={{ width: `${percent}%` }} />
          </span>
        )}
      </span>
    </li>
  )
}

export const HoardPage = ({ engine }: { engine: EngineApi }) => {
  const read = useEngineRead(engine, () => engine.readHoard(), [])

  return (
    <main class="page">
      <ReadView read={read} line={t.loading.hoard}>
        {view => (
          <>
            {view.unreadable > 0 && <p class="hint">{t.chronicle.leftOut(view.unreadable)}</p>}
            <div class="hoard-grid">
              <Hoard view={view} />
              <YourDragon game={view.game} />
            </div>
            <section class="panel panel-pad" aria-labelledby="badges-h">
              <div class="sec-row">
                <h2 id="badges-h">{t.hoard.badges}</h2>
                <span class="sec-sub">{t.hoard.earned(view.game.badges.filter(b => b.earnedOn !== null).length, view.game.badges.length)}</span>
              </div>
              <ul class="badge-grid">
                {view.game.badges.map(badge => (
                  <BadgeItem key={badge.id} badge={badge} />
                ))}
              </ul>
            </section>
          </>
        )}
      </ReadView>
    </main>
  )
}
