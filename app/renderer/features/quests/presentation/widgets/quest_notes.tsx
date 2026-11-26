import type { QuestFacts } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'

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
// The step it is on and its commits stay in the facts for tracking; the pane no
// longer lists them. Branches still shows the current step when you review the work.
export const QuestNotes = ({ facts }: { facts: QuestFacts }) => (
  <>
    {facts.messages.length > 0 && <Filed messages={facts.messages} />}
  </>
)
