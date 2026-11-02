import type { Priority } from '../../../../../../types'
import { XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { metaOf } from '../../domain/board'
import type { Row } from '../../domain/board'
import { PriorityControl } from './priority_control'

type RowProps = {
  row: Row
  isOpen: boolean
  isSaved: boolean
  onOpen: (id: string) => void
  onFold: (id: string) => void
  onPriority: (row: Row, priority: Priority) => void
}

export const QuestRowView = ({ row, isOpen, isSaved, onOpen, onFold, onPriority }: RowProps) => {
  const { quest, isChapter, sagaOf, isFolded, foldedStar } = row
  const parts = ['qrow', isChapter ? 'child' : '', isOpen ? 'sel' : '', quest.sealedBecause === null ? '' : 'sealed'].filter(part => part !== '')

  return (
    <li>
      <div class={parts.join(' ')}>
        <span class="qr-mark" role={quest.isStar ? 'img' : undefined} aria-label={quest.isStar ? t.board.mainQuest : undefined}>
          {quest.isStar ? '★' : quest.isPlayNext ? '↥' : ''}
        </span>
        {sagaOf !== null && (
          <button type="button" class="fold-btn" aria-expanded={isFolded ? 'false' : 'true'} aria-label={isFolded ? t.actions.unfold(quest.title) : t.actions.fold(quest.title)} onClick={() => onFold(quest.id)}>
            {isFolded ? '▸' : '▾'}
          </button>
        )}
        <button type="button" class="qrow-open" aria-pressed={isOpen ? 'true' : 'false'} onClick={() => onOpen(quest.id)}>
          <span class="qc-body">
            <span class="qc-title">{quest.title}</span>
            <span class="qc-sub">{metaOf(row)}</span>
            {quest.why !== null && <span class="qc-sub">★ {quest.why}</span>}
            {foldedStar !== null && (
              <span class="qc-sub">
                ★ {foldedStar.title} · {foldedStar.why}
              </span>
            )}
          </span>
        </button>
        <span class="qc-side">
          <PriorityControl title={quest.title} priority={quest.priority} isSaved={isSaved} onPick={priority => onPriority(row, priority)} />
          <XpReward xp={quest.xp} />
        </span>
      </div>
    </li>
  )
}
