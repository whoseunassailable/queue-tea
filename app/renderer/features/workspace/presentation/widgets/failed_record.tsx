import type { ProjectView } from '../../../../../shared/engine_api'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { t } from '../../../../l10n/en'
import { isLetterKey, isTyping } from '../../../quests/presentation/state_management/quest_keys'

type Failed = Extract<ProjectView, { kind: 'unreadable' }>
type Props = { view: Failed; letterKeys: boolean; isSheetOpen: boolean; onRestore: () => void; onRetry: () => void; onShow: () => void; onCopy: (text: string) => void }

const sentenceOf = (reason: string): string => `${reason.charAt(0).toUpperCase()}${reason.slice(1)}.`

// Stands in for every tab of a realm whose record doesn't read. The reason is
// the engine's own, and the record stays exactly as it is.
export const FailedRecord = ({ view, letterKeys, isSheetOpen, onRestore, onRetry, onShow, onCopy }: Props) => {
  useWindowKeys(event => {
    if (isSheetOpen || isTyping(event.target) || event.metaKey || (!letterKeys && isLetterKey(event.key))) return
    if (event.key === 'l' && view.canRestore) onRestore()
    else if (event.key === 'r') onRetry()
  })

  return (
    <main class="page">
      <section class="mcard panel" aria-labelledby="failed-h">
        <h1 class="q-title" id="failed-h">
          <span aria-hidden="true">⚠ </span>
          {t.failedRecord.title}
        </h1>
        <p>{sentenceOf(view.reason)}</p>
        <p class="card-note">{view.canRestore ? t.failedRecord.leftWithCopy : t.failedRecord.left}</p>
        <span class="copy-line">
          <code>{view.file}</code>
          <button type="button" class="icon-btn" aria-label={t.flow.copy} onClick={() => onCopy(view.file)}>
            ⧉
          </button>
        </span>
        {view.isNewer && <p class="card-note">{t.failedRecord.newerNote}</p>}
        <div class="q-actions">
          {view.canRestore && (
            <button type="button" class="btn primary" onClick={onRestore}>
              {t.failedRecord.restore}
            </button>
          )}
          <button type="button" class={view.canRestore ? 'btn' : 'btn primary'} onClick={onRetry}>
            {t.failed.tryAgain}
          </button>
          <button type="button" class="btn" onClick={onShow}>
            {t.settings.showInFinder}
          </button>
        </div>
      </section>
      <p class="hint">{`${t.failedRecord.noChange(view.name)} ${t.failedRecord.others}`}</p>
    </main>
  )
}
