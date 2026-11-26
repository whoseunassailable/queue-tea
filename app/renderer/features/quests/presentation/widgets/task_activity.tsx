import type { QuestActivity } from '../../../../../shared/engine_api'
import { dayAndTime } from '../../../../core/domain/format'
import { StepLine } from '../../../../core/widgets/step_line'
import { t } from '../../../../l10n/en'

// The step the quest is on now, then its commits, oldest first.
export const TaskActivity = ({ activity }: { activity: QuestActivity }) => {
  const commits = [...activity.commits].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))

  return (
    <section class="task-activity" aria-label={t.activity.title}>
      <h3>{t.activity.title}</h3>
      <p class="hint">{t.activity.coverage}</p>
      {activity.gitUnavailable && <p role="alert" class="hint">{t.activity.gitUnavailable}</p>}
      {activity.step === null ? <p class="card-note">{t.activity.empty}</p> : <StepLine step={activity.step} />}
      {commits.length > 0 && (
        <ol class="activity-list">
          {commits.map(commit => (
            <li key={commit.id}>
              <time dateTime={commit.at}>{dayAndTime(commit.at)}:{commit.at.slice(17, 19)}</time>
              <strong>{t.activity.committed}</strong>
              <p class="activity-subject">{commit.message}</p>
              <code>{commit.id.slice(0, 7)}</code>
              <p class="hint">{commit.remotes === null ? t.activity.unknownRemote : commit.remotes.length === 0 ? t.activity.noRemote : t.activity.remote(commit.remotes)}</p>
            </li>
          ))}
        </ol>
      )}
      {commits.length > 0 && <p class="hint">{t.activity.retained}</p>}
      {commits.length > 0 && <p class="hint">{t.activity.remoteHint}</p>}
    </section>
  )
}
