import { useState } from 'preact/hooks'

import type { ChronicleScope, ChronicleView, EngineApi, VictoryLine } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { dayAndTime, dayName, dayOf, formatMinutes } from '../../../../core/domain/format'
import { ReadView } from '../../../../core/widgets/read_view'
import { PriorityTag, XpReward } from '../../../../core/widgets/tags'
import { Legend, WeekChart } from '../../../../core/widgets/week_chart'
import { t } from '../../../../l10n/en'

const DAY_MS = 86_400_000
const WEEK_DAYS = 7
const SHORT_COMMIT = 7

const shiftDays = (day: string, days: number): string => new Date(Date.parse(`${day}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)

const RANK = { light: 0, medium: 1, hard: 2 } as const

const movedClass = (line: VictoryLine): string => {
  const moved = RANK[line.actual] - RANK[line.expected]
  if (moved === 0) return ''

  return moved > 0 ? 'harder' : 'easier'
}

const Summary = ({ view }: { view: ChronicleView }) => (
  <p class="summary">
    <b>{t.chronicle.summary(view.victories.length, formatMinutes(view.minutes))}</b>
    {` · ${t.chronicle.split(formatMinutes(view.onQuests), formatMinutes(view.elsewhere))} · ${t.chronicle.moved(view.asExpected, view.harder, view.easier)} · `}
    <b>{t.quest.xp(view.xp)}</b>
  </p>
)

const DayLine = ({ view, picked }: { view: ChronicleView; picked: string | null }) => {
  const day = view.days.find(d => d.day === picked)
  if (day === undefined) return <p class="day-line">{t.chronicle.pickDay}</p>
  const total = day.onQuests + day.elsewhere
  const name = dayName(day.day)

  return <p class="day-line">{total === 0 ? t.chronicle.dayEmpty(name) : t.chronicle.dayLine(name, formatMinutes(total), formatMinutes(day.onQuests), formatMinutes(day.elsewhere))}</p>
}

const Row = ({ line, showRealm, isOpen, onOpen }: { line: VictoryLine; showRealm: boolean; isOpen: boolean; onOpen: () => void }) => (
  <tr class={isOpen ? 'tbl-open' : undefined}>
    <td class="t">
      <button type="button" class="title-btn" aria-label={t.chronicle.open(line.title)} aria-expanded={isOpen} onClick={onOpen}>
        {line.title}
      </button>
    </td>
    <td>
      <PriorityTag priority={line.priority} />
    </td>
    {showRealm && <td>{line.realm}</td>}
    <td class="num">{dayName(line.finished.slice(0, 10))}</td>
    <td class="num">{formatMinutes(line.minutes)}</td>
    <td>
      {`${t.difficulty[line.expected]} → `}
      <span class={movedClass(line)}>{t.difficulty[line.actual]}</span>
    </td>
    <td>
      <XpReward xp={line.xp} />
    </td>
  </tr>
)

const Detail = ({ line, canFollowUp, onFollowUp }: { line: VictoryLine; canFollowUp: boolean; onFollowUp: (title: string) => void }) => (
  <section class="panel panel-pad" aria-label={line.title}>
    <div class="sec-row">
      <h2>{line.title}</h2>
    </div>
    <dl class="kv">
      <dt>{t.chronicle.detail.time}</dt>
      <dd>{t.chronicle.span(formatMinutes(line.minutes), line.started === null ? null : dayAndTime(line.started), dayAndTime(line.finished))}</dd>
      <dt>{t.chronicle.detail.effort}</dt>
      <dd>{t.chronicle.effort(line.improvingMessages)}</dd>
      <dt>{t.chronicle.detail.files}</dt>
      <dd>{t.chronicle.files(line.filesRead, line.filesChanged)}</dd>
      <dt>{t.chronicle.detail.lines}</dt>
      <dd>{t.chronicle.lines(line.linesAdded, line.linesRemoved, line.filesTouched)}</dd>
      {line.branch !== null && (
        <>
          <dt>{t.chronicle.detail.branch}</dt>
          <dd class="mono">{line.branch}</dd>
        </>
      )}
      {line.startCommit !== null && (
        <>
          <dt>{t.chronicle.detail.from}</dt>
          <dd class="mono">{line.startCommit.slice(0, SHORT_COMMIT)}</dd>
        </>
      )}
    </dl>
    {canFollowUp && (
      <div class="row-end">
        <span class="card-note grow">{t.chronicle.followUpNote}</span>
        <button type="button" class="btn" onClick={() => onFollowUp(t.chronicle.followUpTitle(line.title))}>
          {t.chronicle.followUp}
        </button>
      </div>
    )}
  </section>
)

type WinsProps = { view: ChronicleView; path: string; showRealm: boolean; onLastWeek: () => void; onFollowUp: (title: string) => void }

const Wins = ({ view, path, showRealm, onLastWeek, onFollowUp }: WinsProps) => {
  const [openId, setOpen] = useState<string | null>(null)
  const open = view.victories.find(v => v.id === openId)
  if (!view.hasAny) return <p class="hint">{t.chronicle.none}</p>
  if (view.victories.length === 0) {
    return (
      <>
        <p class="hint">{view.isThisWeek ? t.chronicle.noneThisWeek : t.chronicle.noneThatWeek}</p>
        {view.isThisWeek && view.lastWeek.victories > 0 && (
          <button type="button" class="link-btn" onClick={onLastWeek}>
            {t.chronicle.lastWeek(view.lastWeek.victories, formatMinutes(view.lastWeek.minutes))}
          </button>
        )}
      </>
    )
  }
  const { columns } = t.chronicle

  return (
    <>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>{columns.quest}</th>
              <th>{columns.priority}</th>
              {showRealm && <th>{columns.realm}</th>}
              <th>{columns.wonOn}</th>
              <th>{columns.time}</th>
              <th>{columns.moved}</th>
              <th>{columns.xp}</th>
            </tr>
          </thead>
          <tbody>
            {view.victories.map(line => (
              <Row key={line.id} line={line} showRealm={showRealm} isOpen={line.id === openId} onOpen={() => setOpen(line.id === openId ? null : line.id)} />
            ))}
          </tbody>
        </table>
      </div>
      {open !== undefined && <Detail line={open} canFollowUp={open.realmPath === path} onFollowUp={onFollowUp} />}
    </>
  )
}

type PageProps = { engine: EngineApi; realm: string; path: string; scope: ChronicleScope; onScope: (scope: ChronicleScope) => void; onFollowUp: (title: string) => void }

export const ChroniclePage = ({ engine, realm, path, scope, onScope, onFollowUp }: PageProps) => {
  const [week, setWeek] = useState<string | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const read = useEngineRead(engine, () => engine.readChronicle(scope === 'all' ? null : realm, week), [realm, scope, week])
  const first = read.load.status === 'ready' ? (read.load.data.days[0]?.day ?? null) : null
  const go = (step: number) => {
    if (first === null) return
    setWeek(shiftDays(first, step * WEEK_DAYS))
    setPicked(null)
  }
  const last = read.load.status === 'ready' ? read.load.data.days.at(-1)?.day : undefined
  const isThisWeek = read.load.status !== 'ready' || read.load.data.isThisWeek

  return (
    <main class="page chron">
      <div class="page-h panel">
        <h1>{t.chronicle.title}</h1>
        <div class="week-nav">
          <button type="button" class="icon-btn" aria-label={t.chronicle.earlier} onClick={() => go(-1)}>
            ‹
          </button>
          {first !== null && last !== undefined && <span>{t.weekRange(first, last)}</span>}
          <button type="button" class="icon-btn" aria-label={t.chronicle.later} disabled={isThisWeek} onClick={() => go(1)}>
            ›
          </button>
        </div>
        <div class="seg" role="group" aria-label={t.chronicle.which}>
          <button type="button" class={scope === 'realm' ? 'on' : ''} aria-pressed={scope === 'realm'} onClick={() => onScope('realm')}>
            {t.chronicle.thisRealm}
          </button>
          <button type="button" class={scope === 'all' ? 'on' : ''} aria-pressed={scope === 'all'} onClick={() => onScope('all')}>
            {t.chronicle.allRealms}
          </button>
        </div>
      </div>
      <ReadView read={read} line={t.loading.chronicle}>
        {view => (
          <>
            {view.unreadable > 0 && <p class="hint">{t.chronicle.leftOut(view.unreadable)}</p>}
            <section class="panel panel-pad" aria-label={t.chronicle.title}>
              <Summary view={view} />
              <WeekChart days={view.days} picked={picked} label={t.chronicle.chart(dayOf(view.days[0]!.day), dayOf(view.days.at(-1)!.day))} onPick={setPicked} />
              <Legend />
              <DayLine view={view} picked={picked} />
            </section>
            <section class="panel panel-pad" aria-labelledby="wins-h">
              <div class="sec-row">
                <h2 id="wins-h">{t.chronicle.wins}</h2>
              </div>
              <Wins view={view} path={path} showRealm={scope === 'all'} onLastWeek={() => go(-1)} onFollowUp={onFollowUp} />
            </section>
          </>
        )}
      </ReadView>
    </main>
  )
}
