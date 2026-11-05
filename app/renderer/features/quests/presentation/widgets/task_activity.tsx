import type { TaskActivity as Step } from '../../../../../../types'
import type { QuestActivity } from '../../../../../shared/engine_api'
import { dayAndTime } from '../../../../core/domain/format'
import { t } from '../../../../l10n/en'

const ActivityStep = ({ step }: { step: Step }) => (
  <>
    <div class="activity-heading">
      <strong>{t.activity.kind[step.kind]}</strong>
      <span class={`activity-status ${step.status}`}>{t.activity.status[step.status]}</span>
    </div>
    <code class="activity-subject">{step.subject}</code>
    {step.status === 'running' && <p class="hint">{t.activity.waiting}</p>}
    {step.output !== '' && (
      <details class="activity-output">
        <summary>{t.activity.output}</summary>
        <pre>{step.output}</pre>
      </details>
    )}
    {step.truncated && <p class="hint">{t.activity.excerpt}</p>}
  </>
)

// Commands and commits share one chronological list. Stable keys keep an
// expanded output open when a record update completes a different step.
export const TaskActivity = ({ activity }: { activity: QuestActivity }) => {
  const rows = [
    ...activity.steps.map(step => ({ id: `step-${step.id}`, at: step.at, content: <ActivityStep step={step} /> })),
    ...activity.commits.map(commit => ({
      id: `commit-${commit.id}`, at: commit.at,
      content: <>
        <strong>{t.activity.committed}</strong>
        <p class="activity-subject">{commit.message}</p>
        <code>{commit.id.slice(0, 7)}</code>
        <p class="hint">{commit.remotes === null ? t.activity.unknownRemote : commit.remotes.length === 0 ? t.activity.noRemote : t.activity.remote(commit.remotes)}</p>
      </>,
    })),
  ].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))

  return (
    <section class="task-activity" aria-label={t.activity.title}>
      <h3>{t.activity.title}</h3>
      <p class="hint">{t.activity.coverage}</p>
      {activity.gitUnavailable && <p role="alert" class="hint">{t.activity.gitUnavailable}</p>}
      {rows.length === 0 ? <p class="card-note">{t.activity.empty}</p> : (
        <ol class="activity-list">
          {rows.map(row => (
            <li key={row.id}>
              <time dateTime={row.at}>{dayAndTime(row.at)}:{row.at.slice(17, 19)}</time>
              {row.content}
            </li>
          ))}
        </ol>
      )}
      {rows.length > 0 && <p class="hint">{t.activity.retained}</p>}
      {activity.commits.length > 0 && <p class="hint">{t.activity.remoteHint}</p>}
    </section>
  )
}
