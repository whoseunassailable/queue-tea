import type { QuestFacts } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'
import { TaskActivity } from './task_activity'

const Filed = ({ messages }: { messages: string[] }) => (
  <details class="notes">
    <summary>{t.notes.filed(messages.length)}</summary>
    {messages.map(message => (
      <p key={message} class="card-note notes-text">
        {message}
      </p>
    ))}
  </details>
)

// What a quest carries with it, on either kind of detail pane, beside its recipe.
export const QuestNotes = ({ facts }: { facts: QuestFacts }) => (
  <>
    <TaskActivity activity={facts.activity} />
    {facts.messages.length > 0 && <Filed messages={facts.messages} />}
  </>
)
