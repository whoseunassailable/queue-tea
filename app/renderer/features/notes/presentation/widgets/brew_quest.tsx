import { useRef, useState } from 'preact/hooks'

import type { Difficulty, Priority } from '../../../../../../types'
import type { EngineApi } from '../../../../../shared/engine_api'
import { NOTE_LIMITS, proposalOf } from '../../../../../shared/notes'
import type { Note, NoteFiled, ProposedQuest, QuestProposal } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { questLineOf } from '../../domain/notes_view'
import type { QuestLine } from '../../domain/notes_view'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

// BrewQuest, drawn in pixels: a small robot with a tea-cup antenna.
const Robot = () => (
  <svg class="nt-robot" viewBox="0 0 12 12" width="44" height="44" role="presentation" aria-hidden="true" shape-rendering="crispEdges">
    <rect x="5" y="0" width="2" height="1" fill="#E8B04B" />
    <rect x="5.5" y="1" width="1" height="1" fill="#54473A" />
    <rect x="2" y="2" width="8" height="5" fill="#EEF3F8" stroke="#2A3550" stroke-width="0.4" />
    <rect x="3.5" y="3.5" width="1.5" height="1.5" fill="#3BA6D6" />
    <rect x="7" y="3.5" width="1.5" height="1.5" fill="#3BA6D6" />
    <rect x="5" y="5.6" width="2" height="0.6" fill="#2A3550" />
    <rect x="3" y="7.5" width="6" height="3" fill="#DDE6EF" stroke="#2A3550" stroke-width="0.4" />
    <rect x="5" y="8.3" width="2" height="1.4" fill="#2E9C7E" />
    <rect x="1.4" y="7.8" width="1.2" height="2" fill="#B8C6D4" />
    <rect x="9.4" y="7.8" width="1.2" height="2" fill="#B8C6D4" />
    <rect x="3.6" y="10.6" width="1.6" height="1.2" fill="#54473A" />
    <rect x="6.8" y="10.6" width="1.6" height="1.2" fill="#54473A" />
  </svg>
)

export const BrewQuestCard = ({ onBrew }: { onBrew: () => void }) => (
  <div class="nt-brew">
    <Robot />
    <div class="nt-brew-text">
      <b>{t.notebook.brew.name}</b>
      <span class="sub">{t.notebook.brew.line}</span>
    </div>
    <button type="button" class="btn primary" onClick={onBrew}>
      {t.notebook.brew.turn}
    </button>
  </div>
)

type Row = ProposedQuest & { isIn: boolean }
type Errors = { parent?: string; rows: Record<number, string>; none?: string }

const questTitleError = (title: string): string | undefined => {
  if (title.trim() === '') return t.notebook.brew.questTitleRequired
  if (title.trim().length > NOTE_LIMITS.title) return t.notebook.brew.titleLong

  return undefined
}

const parentError = (title: string): string | undefined => {
  if (title.trim() === '') return t.notebook.brew.parentRequired
  if (title.trim().length > NOTE_LIMITS.title) return t.notebook.brew.titleLong

  return undefined
}

// What BrewQuest drafted from the note, to check before anything is filed.
const IN_PLAY: readonly QuestLine['state'][] = ['waiting', 'sealed', 'active']

export const BrewSheet = ({ engine, realm, note, quests, onFiled, onRefresh, onClose }: { engine: EngineApi; realm: string; note: Note; quests: Map<string, QuestLine>; onFiled: (filed: NoteFiled, count: number) => void; onRefresh: () => void; onClose: () => void }) => {
  // A parent that's done or gone takes no more quests, so new lines get a new one.
  const [proposal] = useState(() => proposalOf(note, id => IN_PLAY.includes(questLineOf(quests, id).state)))
  const [rows, setRows] = useState<Row[]>(() => proposal.quests.map(quest => ({ ...quest, isIn: true })))
  const [parentTitle, setParentTitle] = useState(proposal.parent.kind === 'new' ? proposal.parent.title : '')
  const [errors, setErrors] = useState<Errors>({ rows: {} })
  const [failure, setFailure] = useState<string | null>(null)
  const [isFiling, setFiling] = useState(false)
  const isSending = useRef(false)
  // Filed already, by an attempt that stopped part way: locked, and never sent again.
  const isFiled = (row: Row) => note.quests.some(q => q.item === row.item)
  const picked = rows.filter(row => row.isIn && !isFiled(row))

  const setRow = (i: number, patch: Partial<Row>) => setRows(was => was.map((row, j) => (j === i ? { ...row, ...patch } : row)))
  const checkRow = (i: number) => setErrors(was => ({ ...was, rows: { ...was.rows, [i]: rows[i]!.isIn ? questTitleError(rows[i]!.title) : undefined } as Record<number, string> }))

  const submit = async () => {
    const rowErrors = Object.fromEntries(rows.map((row, i) => [i, row.isIn && !isFiled(row) ? questTitleError(row.title) : undefined]).filter(([, error]) => error !== undefined))
    const next: Errors = { rows: rowErrors, parent: proposal.parent.kind === 'new' ? parentError(parentTitle) : undefined, none: picked.length === 0 ? t.notebook.brew.pickOne : undefined }
    setErrors(next)
    if (isSending.current || Object.keys(rowErrors).length > 0 || next.parent !== undefined || next.none !== undefined) return
    isSending.current = true
    setFiling(true)
    setFailure(null)
    const sent: QuestProposal = {
      parent: proposal.parent.kind === 'new' ? { kind: 'new', title: parentTitle.trim() } : proposal.parent,
      quests: picked.map(({ isIn: _, ...quest }) => ({ ...quest, title: quest.title.trim() })),
    }
    const answer = await ask(engine, () => engine.fileNoteQuests(realm, note.id, sent))
    isSending.current = false
    setFiling(false)
    if (!answer.ok) {
      setFailure(answer.message)
      // Some may have gone in: read the note again, so their rows lock.
      onRefresh()

      return
    }
    const after = answer.data.view.notes.find(n => n.id === note.id)?.quests.length ?? note.quests.length
    onFiled(answer.data, after - note.quests.length)
    onClose()
  }

  const under = proposal.parent.kind === 'task' ? questLineOf(quests, proposal.parent.id).title : null

  return (
    <Dialog title={t.notebook.brew.sheet(note.title)} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      {rows.length === 0 ? (
        <p class="form-line">{t.notebook.brew.nothing}</p>
      ) : (
        <>
          <p class="form-line">{t.notebook.brew.intro}</p>
          {proposal.parent.kind === 'new' && <Field label={t.notebook.brew.parent} isRequired value={parentTitle} error={errors.parent} onInput={setParentTitle} onBlur={() => setErrors(was => ({ ...was, parent: parentError(parentTitle) }))} />}
          {under !== null && <p class="hint">{t.notebook.brew.under(under)}</p>}
          <ol class="nt-proposal">
            {rows.map((row, i) => (
              <li key={i} class={row.isIn && !isFiled(row) ? 'nt-row' : 'nt-row out'}>
                <input type="checkbox" checked={row.isIn || isFiled(row)} disabled={isFiled(row) || isFiling} aria-label={t.notebook.brew.include(i + 1)} onChange={event => setRow(i, { isIn: (event.target as HTMLInputElement).checked })} />
                <div class="nt-row-title">
                  <Field label={t.notebook.brew.questTitle(i + 1)} isRequired value={row.title} error={errors.rows[i]} onInput={title => setRow(i, { title })} onBlur={() => checkRow(i)} />
                  {isFiled(row) && <p class="hint">{t.notebook.brew.filedRow}</p>}
                </div>
                <select class="chip-select" aria-label={t.notebook.brew.priority(i + 1)} value={row.priority} onChange={event => setRow(i, { priority: (event.target as HTMLSelectElement).value as Priority })}>
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>
                      {t.priority[priority]}
                    </option>
                  ))}
                </select>
                <select class="chip-select" aria-label={t.notebook.brew.difficulty(i + 1)} value={row.difficulty} onChange={event => setRow(i, { difficulty: (event.target as HTMLSelectElement).value as Difficulty })}>
                  {DIFFICULTIES.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {t.difficulty[difficulty]}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ol>
          {errors.none !== undefined && <p class="field-error">{errors.none}</p>}
        </>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {rows.length === 0 ? t.notebook.brew.close : t.actions.cancel}
        </button>
        {rows.length > 0 && (
          <button type="submit" class="btn primary" disabled={isFiling}>
            {isFiling ? (
              <>
                <Spinner /> {t.notebook.brew.filing}
              </>
            ) : failure !== null ? (
              t.notebook.brew.tryAgain
            ) : (
              t.notebook.brew.file(picked.length)
            )}
          </button>
        )}
      </div>
    </Dialog>
  )
}
