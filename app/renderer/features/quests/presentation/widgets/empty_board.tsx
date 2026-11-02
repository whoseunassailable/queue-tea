import { t } from '../../../../l10n/en'

// A board with nothing on it says so, and offers the way to fill it.
export const EmptyBoard = ({ onNewQuest }: { onNewQuest: () => void }) => (
  <div class="empty-board">
    <p class="hint">
      {t.empty.boardTitle}. {t.empty.boardLine}
    </p>
    <button type="button" class="btn" onClick={onNewQuest}>
      {t.empty.fileOne}
    </button>
  </div>
)
