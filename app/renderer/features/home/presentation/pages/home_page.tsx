import { useState } from 'preact/hooks'

import type { EngineApi, GameView, LiveFacts, ProjectView, SessionState } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { hrefOf, ROUTES } from '../../../../config/routing/routes'
import { GROWS_AT, HOME_BADGES, HOME_BOARD_ROWS } from '../../../../core/constants/constants'
import { dayOf, formatMinutes } from '../../../../core/domain/format'
import { Dragon } from '../../../../core/widgets/art'
import { PriorityTag, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { metaOf, rowsOf } from '../../../quests/domain/board'
import { runFlowKey } from '../../../quests/presentation/state_management/flow_keys'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import { useQuestKeys } from '../../../quests/presentation/state_management/quest_keys'
import { ActiveCard } from '../../../quests/presentation/widgets/active_card'
import { TimeControl } from '../../../quests/presentation/widgets/board_tools'
import { EmptyBoard } from '../../../quests/presentation/widgets/empty_board'
import { FlowCard } from '../../../quests/presentation/widgets/flow_card'
import { JudgementCard } from '../../../quests/presentation/widgets/judgement_card'
import type { Load, QuestFlow } from '../../../workspace/state_management/workspace_store'

type View = Extract<ProjectView, { kind: 'readable' }>

const Lair = ({ game, session, onPet }: { game: Load<GameView>; session: SessionState; onPet: () => void }) => {
  const stage = game.status === 'ready' ? game.data.stage : 'hatchling'

  return (
    <section class="lair" aria-label={t.dragon.plaque(t.stage[stage])}>
      <Dragon stage={stage} onPet={onPet} />
      <div class="plaque panel">
        <span class="plaque-name">{t.dragon.plaque(t.stage[stage])}</span>
        {game.status === 'ready' && <span class="plaque-sub">{t.dragon.level(game.data.level, GROWS_AT[stage])}</span>}
        <span class="plaque-mood">{t.mood[session]}</span>
      </div>
    </section>
  )
}

const mainQuest = (view: View) => rowsOf(view.ready).find(r => r.quest.isStar)?.quest

const NoActive = ({ view, actions }: { view: View; actions: QuestActions }) => {
  const next = mainQuest(view)

  return (
    <section class="quest panel" aria-labelledby="active-title">
      <h1 class="q-title" id="active-title">
        {t.quest.noneTitle}
      </h1>
      <p class="q-line">{next === undefined ? t.quest.noneEmpty : t.quest.noneLine(next.title)}</p>
      {next?.why != null && <p class="hint">★ {next.why}</p>}
      <p class="q-status">{t.session[view.session.state]}</p>
      {next !== undefined && (
        <div class="q-actions">
          <button type="button" class="btn primary" onClick={() => actions.onStart(next)}>
            {t.actions.startNamed(next.title)}
          </button>
        </div>
      )}
    </section>
  )
}

const Board = ({ view, actions, onNewQuest }: { view: View; actions: QuestActions; onNewQuest: () => void }) => {
  const rows = rowsOf(view.ready)
    .filter(r => !r.isChapter || r.quest.isStar)
    .slice(0, HOME_BOARD_ROWS)
  const total = view.canStart + view.sealedCount

  return (
    <section class="board panel" aria-labelledby="b-title">
      <div class="sec-h">
        <h2 id="b-title">{t.board.title}</h2>
        <span class="sec-sub">{t.board.counts(view.canStart, view.sealedCount)}</span>
        <TimeControl budget={view.budget} onStep={actions.onStepBudget} />
      </div>
      {view.active !== null && total > 0 && <p class="hint">{t.board.startHint}</p>}
      {total === 0 && <EmptyBoard onNewQuest={onNewQuest} />}
      {total > 0 && view.canStart === 0 && <p class="hint">{t.empty.allSealed}</p>}
      {rows.map(row => (
        <div key={row.quest.id} class={row.quest.isStar ? 'qcard main-q' : 'qcard'}>
          {row.quest.isStar && (
            <span class="q-star" role="img" aria-label={t.board.mainQuest}>
              ★
            </span>
          )}
          <span class="qc-body">
            <span class="qc-title">{row.quest.title}</span>
            <span class="qc-sub">{metaOf(row)}</span>
          </span>
          <span class="qc-side">
            <PriorityTag priority={row.quest.priority} />
            <XpReward xp={row.quest.xp} />
          </span>
        </div>
      ))}
      {total > 0 && (
        <a class="more" href={hrefOf(ROUTES.quests)}>
          {t.board.all(total)}
        </a>
      )}
    </section>
  )
}

const Glory = ({ view, game }: { view: View; game: Load<GameView> }) => (
  <section class="glory panel" aria-labelledby="g-title">
    <div class="sec-h">
      <h2 id="g-title">{t.glory.title}</h2>
      {game.status === 'ready' && <span class="sec-sub">{t.glory.line(game.data.victories)}</span>}
    </div>
    {view.victories.length === 0 && <p class="hint">{game.status === 'ready' && game.data.victories > 0 ? t.empty.noVictoriesHere : t.empty.noVictories}</p>}
    {view.victories.map(v => (
      <p key={v.id} class="victory-row">
        <span>{v.title}</span>
        <span class="v-meta">{t.glory.victory(dayOf(v.finished), formatMinutes(v.minutes), v.xp)}</span>
      </p>
    ))}
    {game.status === 'ready' && (
      <ul class="badges" aria-label={t.glory.badges}>
        {[...game.data.badges]
          .sort((a, b) => Number(b.earnedOn !== null) - Number(a.earnedOn !== null))
          .slice(0, HOME_BADGES)
          .map(badge => (
            <li key={badge.id} class={badge.earnedOn === null ? 'badge' : 'badge got'}>
              <span>
                <b>{t.badges[badge.id]}</b>
                <i>{badge.earnedOn === null ? t.glory.progress(badge.have, badge.need) : t.glory.earned(dayOf(badge.earnedOn))}</i>
              </span>
            </li>
          ))}
      </ul>
    )}
  </section>
)

const QuestCard = ({ view, flow, actions }: { view: View; flow: QuestFlow | undefined; actions: QuestActions }) => {
  if (flow !== undefined) return <FlowCard flow={flow} actions={actions} />
  if (view.active === null) return <NoActive view={view} actions={actions} />
  if (view.active.review !== null) return <JudgementCard active={view.active} actions={actions} kind="full" />

  return <ActiveCard active={view.active} session={view.session} actions={actions} kind="full" />
}

const LiveLines = ({ live, note, onSwitch }: { live: LiveFacts | null; note: string | null; onSwitch: () => void }) => (
  <>
    {live?.drift.map(line => (
      <p key={line} class="live-line">
        ! {line}
      </p>
    ))}
    {live?.mismatch != null && (
      <p class="live-line">
        {live.mismatch.uncommitted === null ? t.live.mismatch(live.mismatch.on, live.mismatch.branch) : t.live.mismatchHeld(live.mismatch.on, live.mismatch.branch)}
        {live.mismatch.uncommitted === null && (
          <button type="button" class="chip-btn" onClick={onSwitch}>
            {t.live.switch}
          </button>
        )}
      </p>
    )}
    {note !== null && <p class="hint">{note}</p>}
  </>
)

type HomeProps = { engine: EngineApi; view: View; game: Load<GameView>; flow: QuestFlow | undefined; actions: QuestActions; isSheetOpen: boolean; letterKeys: boolean; onPet: () => void; onNewQuest: () => void; onSwitch: (branch: string) => Promise<boolean> }

export const HomePage = ({ engine, view, game, flow, actions, isSheetOpen, letterKeys, onPet, onNewQuest, onSwitch }: HomeProps) => {
  const read = useEngineRead(engine, () => engine.readLive(view.key), [view.key, view.active?.id, view.active?.branch])
  const [dismissed, setDismissed] = useState<string | null>(null)
  const live = read.load.status === 'ready' ? read.load.data : null
  const failure = read.note ?? (read.load.status === 'failed' ? read.load.message : null)
  const warning = live?.warning != null && live.warning !== dismissed ? live.warning : null
  const switchBranch = () => {
    if (live?.mismatch?.uncommitted === null) void onSwitch(live.mismatch.branch).then(isDone => isDone && read.refresh())
  }

  useQuestKeys(!isSheetOpen, letterKeys, key => {
    if (runFlowKey(key, view, flow, actions)) return true
    const next = mainQuest(view)
    if (key.kind === 'start' && view.active === null && next !== undefined) actions.onStart(next)
    else if (key.kind === 'seal' && view.active !== null) actions.onSealActive(view.active)
    else if (key.kind === 'switch') switchBranch()
    else if (key.kind === 'dismiss' && warning !== null) setDismissed(warning)
    else return false

    return true
  })

  return (
    <main class="stage">
      <div class="col-left">
        <Lair game={game} session={view.session.state} onPet={onPet} />
        {warning !== null && (
          <div class="warning-strip panel" role="alert">
            <span class="grow">{warning}</span>
            <button type="button" class="chip-btn" onClick={() => setDismissed(warning)}>
              {t.actions.ok}
            </button>
          </div>
        )}
        <QuestCard view={view} flow={flow} actions={actions} />
        <LiveLines live={live} note={failure} onSwitch={switchBranch} />
      </div>
      <div class="col-right">
        <Board view={view} actions={actions} onNewQuest={onNewQuest} />
        <Glory view={view} game={game} />
      </div>
    </main>
  )
}
