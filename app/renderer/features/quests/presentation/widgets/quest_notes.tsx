import type { QuestFacts, QuestNote } from '../../../../../shared/engine_api'
import { dayAndTime } from '../../../../core/domain/format'
import { t } from '../../../../l10n/en'
import { TaskActivity } from './task_activity'

// A list item's own text: the engine marks points with "- " for the terminal.
const lineOf = (line: string): string => line.replace(/^- /, '')

const Note = ({ note }: { note: QuestNote }) => (
  <details class="notes" open>
    <summary>{t.notes.note(note.title, dayAndTime(note.written))}</summary>
    {note.sections === null ? (
      <p class="card-note notes-text">{note.text}</p>
    ) : (
      note.sections.map(section => (
        <div key={section.heading} class="notes-section">
          <h4>{section.heading}</h4>
          <ul>
            {section.lines.map(line => (
              <li key={line}>{lineOf(line)}</li>
            ))}
          </ul>
        </div>
      ))
    )}
  </details>
)

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

// What a quest carries with it, on either kind of detail pane.
export const QuestNotes = ({ facts }: { facts: QuestFacts }) => (
  <>
    <TaskActivity activity={facts.activity} />
    {facts.note !== null && <Note note={facts.note} />}
    {facts.messages.length > 0 && <Filed messages={facts.messages} />}
  </>
)
