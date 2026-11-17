import { useRef, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import type { BackupSkip, NotesRestore, NotesView } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'

type Kind = 'export' | 'restore'
type Outcome = { kind: Kind; title: string; lines: string[]; hint: string | null; skipped: BackupSkip[]; isFailed: boolean }

const b = t.notebook.backup

// Only the lines that aren't zero, or one line when nothing came of it.
const restoredLines = (r: NotesRestore): string[] =>
  r.added + r.files + r.toHistory + r.skipped.length === 0
    ? [b.nothingNew]
    : [...(r.added + r.files > 0 ? [b.added(r.added, r.files)] : []), ...(r.renamed > 0 ? [b.renamed(r.renamed)] : []), ...(r.same > 0 ? [b.same(r.same)] : []), ...(r.toHistory > 0 ? [b.toHistory(r.toHistory)] : [])]

// Export notes and Restore from backup. Main asks for the folder; while it
// works a line says so, and what came of it, or why it failed, opens in a
// dialog. Cancelling the folder picker changes nothing.
// onRefresh: a restore that stopped part way may have added notes already.
// links go in the list and dialog outside it: the list's blur would shrink the
// dialog's dimming to the list alone. Kept by the page, a result also outlives
// the narrow layout's list drawer closing.
export const useNotesBackup = ({ engine, realm, onView, onRefresh }: { engine: EngineApi; realm: string; onView: (view: NotesView) => void; onRefresh: () => void }) => {
  const [working, setWorking] = useState<Kind | null>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const buttons = useRef<Partial<Record<Kind, HTMLButtonElement | null>>>({})

  const failed = (kind: Kind, message: string): Outcome => ({ kind, title: kind === 'export' ? b.exportFailed : b.restoreFailed, lines: [message], hint: null, skipped: [], isFailed: true })
  const run = async (kind: Kind) => {
    if (working !== null) return
    setOutcome(null)
    setWorking(kind)
    if (kind === 'export') {
      const answer = await ask(engine, () => engine.exportNotes(realm))
      setWorking(null)
      if (!answer.ok) setOutcome(failed(kind, answer.message))
      else if (answer.data !== null) setOutcome({ kind, title: b.exportedTitle, lines: [b.exported(answer.data.notes, answer.data.files, answer.data.folder)], hint: b.historyStays, skipped: answer.data.skipped, isFailed: false })
    } else {
      const answer = await ask(engine, () => engine.restoreNotes(realm))
      setWorking(null)
      if (!answer.ok) {
        setOutcome(failed(kind, answer.message))
        onRefresh()
      } else if (answer.data !== null) {
        onView(answer.data.view)
        setOutcome({ kind, title: b.restoredTitle, lines: restoredLines(answer.data), hint: null, skipped: answer.data.skipped, isFailed: false })
      }
    }
  }
  const close = () => {
    const kind = outcome?.kind
    setOutcome(null)
    if (kind !== undefined) requestAnimationFrame(() => buttons.current[kind]?.focus())
  }

  const links = (
    <>
      {(['export', 'restore'] as const).map(kind => (
        <button key={kind} type="button" class="nt-link" ref={el => void (buttons.current[kind] = el)} disabled={working !== null} onClick={() => void run(kind)}>
          {kind === 'export' ? b.export : b.restore}
        </button>
      ))}
      {working !== null && (
        <p class="nt-file-status" role="status">
          <Spinner /> {working === 'export' ? b.exporting : b.restoring}
        </p>
      )}
    </>
  )
  const dialog = outcome !== null && (
    <Dialog title={outcome.title} onCancel={close} onSubmit={() => (outcome.isFailed ? void run(outcome.kind) : close())}>
      {outcome.lines.map(line => (
        <p key={line} class="form-line" role={outcome.isFailed ? 'alert' : undefined}>
          {line}
        </p>
      ))}
      {outcome.skipped.length > 0 && (
        <>
          <p class="form-line">{b.leftOut(outcome.skipped.length)}</p>
          <ul class="nt-skipped">
            {outcome.skipped.map(skip => (
              <li key={skip.path}>
                <code>{skip.path}</code>: {b.reasons[skip.reason]}
              </li>
            ))}
          </ul>
        </>
      )}
      {outcome.hint !== null && <p class="hint">{outcome.hint}</p>}
      <div class="sheet-actions">
        {outcome.isFailed && (
          <button type="button" class="btn" onClick={close}>
            {b.close}
          </button>
        )}
        <button type="submit" class="btn primary">
          {outcome.isFailed ? t.failed.tryAgain : b.close}
        </button>
      </div>
    </Dialog>
  )

  return { links, dialog }
}
