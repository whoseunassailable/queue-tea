import type { BoardEntry, ProjectView, QuestRow } from '../../../../shared/engine_api'
import { formatAge, formatSpan } from '../../../core/domain/format'
import { t } from '../../../l10n/en'

export type Row = { quest: QuestRow; isChapter: boolean; sagaOf: BoardEntry | null }

// The board as one list: a saga, then its chapters directly under it.
export const rowsOf = (entries: BoardEntry[]): Row[] =>
  entries.flatMap(entry =>
    entry.kind === 'quest'
      ? [{ quest: entry.quest, isChapter: false, sagaOf: null }]
      : [{ quest: entry.quest, isChapter: false, sagaOf: entry }, ...entry.chapters.map(quest => ({ quest, isChapter: true, sagaOf: null }))],
  )

export const allRows = (view: Extract<ProjectView, { kind: 'readable' }>): Row[] => [...rowsOf(view.ready), ...rowsOf(view.sealed)]

export const metaOf = (entry: Pick<Row, 'quest' | 'sagaOf'>): string => {
  const { quest, sagaOf } = entry
  const difficulty = t.difficulty[quest.difficulty]
  const estimate = formatSpan(quest.estimateMinutes)
  const waited = formatAge(quest.waitedMs)
  if (sagaOf?.kind === 'saga') return t.quest.sagaMeta(sagaOf.progress.done, sagaOf.progress.total, difficulty, estimate, waited)

  return quest.sealedBecause === null ? t.quest.meta(difficulty, estimate, waited) : `⊘ ${quest.sealedBecause}`
}

// The quest the detail pane opens on: the one picked, else the ★, else the first.
export const openRow = (rows: Row[], picked: string | undefined): Row | null =>
  rows.find(r => r.quest.id === picked) ?? rows.find(r => r.quest.isStar) ?? rows[0] ?? null
