import type { SharedChapter } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'

// A chapter that is also part of this saga. Its own row stands under the saga
// it is listed under, so this one only opens it.
export const SharedRow = ({ chapter, onOpen }: { chapter: SharedChapter; onOpen: (id: string) => void }) => (
  <li>
    <div class="qrow child shared">
      <span class="qr-mark" aria-hidden="true">
        ↔
      </span>
      <button type="button" class="qrow-open" aria-label={t.detail.openActive(chapter.title)} onClick={() => onOpen(chapter.id)}>
        <span class="qc-body">
          <span class="qc-title">{chapter.title}</span>
          <span class="qc-sub">{t.quest.listedUnder(chapter.listedUnder)}</span>
        </span>
      </button>
    </div>
  </li>
)
