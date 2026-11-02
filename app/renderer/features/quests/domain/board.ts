import type { BoardEntry, QuestRow } from '../../../../shared/engine_api'
import { formatAge, formatSpan } from '../../../core/domain/format'
import { t } from '../../../l10n/en'
import type { ReadableView } from '../../workspace/state_management/workspace_store'

export type Row = {
  quest: QuestRow
  isChapter: boolean
  sagaOf: Extract<BoardEntry, { kind: 'saga' }> | null
  isFolded: boolean
  // The ★ hidden inside a folded saga.
  foldedStar: QuestRow | null
}

const plain = (quest: QuestRow, isChapter: boolean): Row => ({ quest, isChapter, sagaOf: null, isFolded: false, foldedStar: null })

// The board as one list: a saga, then its chapters directly under it unless
// it is folded.
export const rowsOf = (entries: BoardEntry[], folded: readonly string[] = []): Row[] =>
  entries.flatMap(entry => {
    if (entry.kind === 'quest') return [plain(entry.quest, false)]
    const isFolded = folded.includes(entry.quest.id)
    const saga: Row = { quest: entry.quest, isChapter: false, sagaOf: entry, isFolded, foldedStar: isFolded ? (entry.chapters.find(c => c.isStar) ?? null) : null }

    return isFolded ? [saga] : [saga, ...entry.chapters.map(chapter => plain(chapter, true))]
  })

export const allRows = (view: ReadableView, folded: readonly string[] = []): Row[] => [...rowsOf(view.ready, folded), ...rowsOf(view.sealed, folded)]

export const metaOf = (entry: Pick<Row, 'quest' | 'sagaOf'>): string => {
  const { quest, sagaOf } = entry
  const difficulty = t.difficulty[quest.difficulty]
  const estimate = formatSpan(quest.estimateMinutes)
  const waited = formatAge(quest.waitedMs)
  if (sagaOf !== null) return t.quest.sagaMeta(sagaOf.progress.done, sagaOf.progress.total, difficulty, estimate, waited)

  return quest.sealedBecause === null ? t.quest.meta(difficulty, estimate, waited) : `⊘ ${quest.sealedBecause}`
}

// The quest the detail pane opens on: the one picked, else the ★, else the first.
export const openRow = (rows: Row[], picked: string | undefined): Row | null =>
  rows.find(r => r.quest.id === picked) ?? rows.find(r => r.quest.isStar) ?? rows[0] ?? null

// The row after or before the open one, staying on the first or last.
export const stepFrom = (rows: Row[], openId: string | undefined, step: 1 | -1): Row | null => {
  const at = rows.findIndex(r => r.quest.id === openId)

  return rows[Math.max(0, Math.min(rows.length - 1, at === -1 ? 0 : at + step))] ?? null
}
