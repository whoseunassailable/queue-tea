import type { Priority } from '../../../../../../types'
import { XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { metaOf } from '../../domain/board'
import type { Row } from '../../domain/board'
import { partsOf } from '../../domain/search'
import { PriorityControl } from './priority_control'

type RowProps = {
  row: Row
  isOpen: boolean
  isSaved: boolean
  onOpen: (id: string) => void
  onFold: (id: string) => void
  onPriority: (row: Row, priority: Priority) => void
  search: string
  isDropTarget: boolean
  onDragStart: (row: Row) => void
  onDragEnd: () => void
  onDragOver: (row: Row, event: DragEvent) => void
  onDrop: (row: Row) => void
}

const Title = ({ title, search }: { title: string; search: string }) => (
  <span class="qc-title">{partsOf(title, search).map(part => (part.isMatch ? <mark key={part.text}>{part.text}</mark> : part.text))}</span>
)

export const QuestRowView = ({ row, isOpen, isSaved, onOpen, onFold, onPriority, search, isDropTarget, onDragStart, onDragEnd, onDragOver, onDrop }: RowProps) => {
  const { quest, isChapter, sagaOf, isFolded, foldedStar } = row
  const parts = ['qrow', isChapter ? 'child' : '', isOpen ? 'sel' : '', quest.sealedBecause === null ? '' : 'sealed', isDropTarget ? 'drop' : ''].filter(part => part !== '')

  return (
    <li>
      <div
        class={parts.join(' ')}
        draggable
        onDragStart={() => onDragStart(row)}
        onDragEnd={onDragEnd}
        onDragOver={event => onDragOver(row, event)}
        onDrop={event => {
          event.preventDefault()
          onDrop(row)
        }}
      >
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
            <Title title={quest.title} search={search} />
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
