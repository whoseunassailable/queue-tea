import { useEffect } from 'preact/hooks'

import type { ActiveFacts, ActiveQuest, EngineApi } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { LINES_REFRESH_MS } from '../../../../core/constants/constants'
import { dayAndTime, formatMinutes } from '../../../../core/domain/format'
import { t } from '../../../../l10n/en'
import type { QuestEdits } from '../state_management/quest_edits'
import { PriorityControl } from './priority_control'
import { QuestNotes } from './quest_notes'

const Facts = ({ facts }: { facts: ActiveFacts }) => (
  <dl class="facts">
    <dt>{t.notes.timeLabel}</dt>
    <dd>{t.notes.time(formatMinutes(facts.minutes), facts.started === null ? null : dayAndTime(facts.started), formatMinutes(facts.today))}</dd>
    <dt>{t.notes.effortLabel}</dt>
    <dd>{t.notes.effort(facts.improvingMessages, facts.understandingMessages)}</dd>
    <dt>{t.notes.filesLabel}</dt>
    <dd>{t.notes.files(facts.filesRead, facts.filesChanged)}</dd>
    {facts.lines !== null && (
      <>
        <dt>{t.notes.linesLabel}</dt>
        <dd>{t.notes.lines(facts.lines.added, facts.lines.removed, facts.lines.since)}</dd>
      </>
    )}
    {facts.git !== null && (
      <>
        <dt>{t.notes.gitLabel}</dt>
        <dd class="mono">{facts.git.head ?? facts.git.branch}</dd>
      </>
    )}
  </dl>
)

const NotCommitted = ({ git }: { git: NonNullable<ActiveFacts['git']> }) => {
  if (git.uncommittedCount === 0) return null
  const hidden = git.uncommittedCount - git.uncommitted.length

  return (
    <details class="notes">
      <summary>{t.notes.uncommitted(git.uncommittedCount)}</summary>
      <div class="files">
        {git.uncommitted.map(file => (
          <span key={file}>{file}</span>
        ))}
        {hidden > 0 && <span>{t.flow.more(hidden)}</span>}
      </div>
    </details>
  )
}

type Props = { engine: EngineApi; realm: string; active: ActiveQuest; isSaved: boolean; edits: QuestEdits }

// The quest in hand, in full. Its actions stay on the card beside it.
export const ActiveDetail = ({ engine, realm, active, isSaved, edits }: Props) => {
  const read = useEngineRead(engine, () => engine.readQuestFacts(realm, active.id), [realm, active.id])
  // The lines change as Claude works, and no record change says so.
  useEffect(() => {
    const timer = setInterval(read.refresh, LINES_REFRESH_MS)

    return () => clearInterval(timer)
  }, [read.refresh])
  const facts = read.load.status === 'ready' ? read.load.data : null

  return (
    <aside class="detail panel" aria-label={t.detail.label}>
      <p class="d-kind">{active.isBoss ? t.quest.boss : t.quest.active}</p>
      <h2 class="d-title">{active.title}</h2>
      <div class="d-chips">
        <PriorityControl title={active.title} priority={active.priority} isSaved={isSaved} onPick={priority => void edits.setPriority(realm, active, priority)} />
        <span class="d-est">{t.difficulty[active.difficulty]}</span>
      </div>
      <hr />
      {read.load.status === 'loading' && <p class="hint">{t.loading.stillReading}</p>}
      {read.load.status === 'failed' && <p class="hint">{read.load.message}</p>}
      {read.note !== null && <p class="hint">{read.note}</p>}
      {facts?.active != null && <Facts facts={facts.active} />}
      {facts?.active?.git != null && <NotCommitted git={facts.active.git} />}
      {facts !== null && <QuestNotes facts={facts} />}
    </aside>
  )
}
