import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { t } from '../../../../l10n/en'
import type { Workspace } from '../../../workspace/state_management/workspace_store'
import { captureOf } from '../../domain/notes_view'

// Jots an idea into a realm's Inbox from a screen other than Notes, and a toast
// says how it went: Open on the note, or Try again with the same words.
export const jotIdea = async (engine: EngineApi, workspace: Workspace, key: string, text: string, onOpen: (id: string) => void): Promise<void> => {
  const input = captureOf(text)
  if (input === null) return
  workspace.say({ tone: 'info', text: t.palette.jotting, isBusy: true })
  const pending = workspace.getState().toasts.at(-1)?.id
  const answer = await ask(engine, () => engine.createNote(key, input))
  if (pending !== undefined) workspace.dismiss(pending)
  if (answer.ok) workspace.say({ tone: 'success', text: t.palette.jotted(input.title), action: { label: t.palette.openNote, run: () => onOpen(answer.data.id) } })
  else workspace.say({ tone: 'error', text: t.palette.jotFailed(input.title, answer.message), action: { label: t.failed.tryAgain, run: () => void jotIdea(engine, workspace, key, text, onOpen) } })
}
