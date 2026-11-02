import type { EngineApi, ManaAllowance, ManaView } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { clockTime, formatMinutes, manaLeft, refillTime, weekdayOf } from '../../../../core/domain/format'
import { ReadView } from '../../../../core/widgets/read_view'
import { Legend, MiniChart } from '../../../../core/widgets/week_chart'
import { t } from '../../../../l10n/en'

const ATTENTION_PERCENT = 90

const Orb = ({ allowance, view }: { allowance: ManaAllowance; view: ManaView }) => {
  const left = manaLeft(allowance)
  const used = Math.round(allowance.percent)
  const rules = t.mana.rules(view.options.freshAtTokens.toLocaleString('en-US'), view.options.handoffAtPercent)

  return (
    <>
      <div class={used >= ATTENTION_PERCENT ? 'mana-orb low' : 'mana-orb'} role="img" aria-label={t.mana.orbLabel(left)}>
        <div class="liquid" style={{ height: `${left}%` }}>
          <svg class="wave" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10C25 0 25 20 50 10S75 0 100 10 125 20 150 10 175 0 200 10V20H0Z" />
          </svg>
        </div>
        <div class="read">
          <b>{left}%</b>
          <span>{t.mana.left}</span>
        </div>
      </div>
      <p class="big mana-used">{allowance.isStale ? t.mana.lastSeen(used, clockTime(allowance.seenAt)) : t.mana.used(used, refillTime(allowance))}</p>
      <p class="card-note">{allowance.isStale ? rules : `${t.mana.from(clockTime(allowance.seenAt))} ${rules}`}</p>
    </>
  )
}

const Tiles = ({ view }: { view: ManaView }) => {
  const most = Math.max(1, view.elsewhere, ...view.byQuest.map(row => row.minutes))
  const bar = (label: string, minutes: number) => (
    <div key={label} class="bar-row">
      <span>{label}</span>
      <span class="num">{formatMinutes(minutes)}</span>
      <span class="track">
        <span style={{ width: `${(minutes / most) * 100}%` }} />
      </span>
    </div>
  )

  return (
    <div class="mana-grid">
      <section class="panel panel-pad mana-card" aria-labelledby="mana-h">
        <h2 class="sec-row" id="mana-h">
          {t.mana.orb}
        </h2>
        {view.allowance === null ? (
          <>
            <p class="big mana-used">{t.mana.unknown}</p>
            <p class="card-note">{t.mana.unknownLine}</p>
          </>
        ) : (
          <Orb allowance={view.allowance} view={view} />
        )}
      </section>
      <section class="panel panel-pad" aria-labelledby="today-h">
        <h3 id="today-h">{t.mana.today(`${weekdayOf(view.today.day)} ${Number(view.today.day.slice(8, 10))}`)}</h3>
        <p class="big">{formatMinutes(view.today.onQuests + view.today.elsewhere)}</p>
        <dl class="kv">
          <dt>{t.mana.onQuests}</dt>
          <dd>{formatMinutes(view.today.onQuests)}</dd>
          <dt>{t.mana.elsewhere}</dt>
          <dd>{formatMinutes(view.today.elsewhere)}</dd>
        </dl>
      </section>
      <section class="panel panel-pad" aria-labelledby="week-h">
        <h3 id="week-h">{t.mana.week}</h3>
        <p class="big">{formatMinutes(view.weekMinutes)}</p>
        <p class="card-note">{t.mana.weekLine(formatMinutes(view.lastWeekMinutes), view.victories, view.inProgress)}</p>
        <MiniChart days={view.days} />
        <Legend />
      </section>
      {view.active !== null && (
        <section class="panel panel-pad" aria-labelledby="quest-h">
          <h3 id="quest-h">{view.active.isBoss ? t.mana.boss : t.mana.active}</h3>
          <p>{t.mana.questLine(view.active.title, formatMinutes(view.active.minutes))}</p>
          <dl class="kv">
            <dt>{t.mana.messages}</dt>
            <dd>{t.mana.messagesLine(view.active.understandingMessages, view.active.improvingMessages)}</dd>
            <dt>{t.mana.files}</dt>
            <dd>{t.mana.filesLine(view.active.filesRead, view.active.filesChanged)}</dd>
            {view.lines !== null && (
              <>
                <dt>{t.mana.lines}</dt>
                <dd>{t.mana.linesLine(view.lines.added, view.lines.removed, view.lines.since)}</dd>
              </>
            )}
          </dl>
        </section>
      )}
      <section class="panel panel-pad" aria-labelledby="by-h">
        <h3 id="by-h">{t.mana.byQuest}</h3>
        {view.byQuest.length === 0 && view.elsewhere === 0 && <p class="hint">{t.mana.nothing}</p>}
        {view.byQuest.map(row => bar(row.title, row.minutes))}
        {view.elsewhere > 0 && bar(t.mana.elsewhereRow, view.elsewhere)}
      </section>
    </div>
  )
}

export const ManaPage = ({ engine, realm }: { engine: EngineApi; realm: string }) => {
  const read = useEngineRead(engine, () => engine.readMana(realm), [realm])
  const sub = read.load.status === 'ready' ? t.mana.sub(read.load.data.realm, read.load.data.days[0]!.day, read.load.data.days.at(-1)!.day) : null

  return (
    <main class="page">
      <div class="page-h panel">
        <h1>{t.mana.title}</h1>
        {sub !== null && <span class="sec-sub">{sub}</span>}
      </div>
      <ReadView read={read} line={t.loading.mana}>
        {view => <Tiles view={view} />}
      </ReadView>
    </main>
  )
}
