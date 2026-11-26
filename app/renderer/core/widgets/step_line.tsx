import type { TaskStep } from '../../../../types'
import { dayAndTime } from '../domain/format'
import { t } from '../../l10n/en'

// The step a task is on now, or, between steps, the last one and how it ended.
// One line: no command output is kept.
export const StepLine = ({ step }: { step: TaskStep }) => {
  const isRunning = step.status === 'running'

  return (
    <p class="step-line" aria-label={t.activity.stepLabel}>
      <strong>{isRunning ? t.activity.now : t.activity.last}</strong>
      <span>{isRunning ? t.activity.doing[step.kind] : t.activity.done[step.kind]}</span>
      <code class="activity-subject">{step.subject}</code>
      {!isRunning && <span class={`activity-status ${step.status}`}>{t.activity.status[step.status]}</span>}
      <time class="hint" dateTime={step.at}>{isRunning ? t.activity.since(dayAndTime(step.at)) : dayAndTime(step.finished ?? step.at)}</time>
    </p>
  )
}
