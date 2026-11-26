import { useEffect, useRef, useState } from 'preact/hooks'

import type { Difficulty, Priority } from '../../../../../../types'
import { EFFORT_POINTS } from '../../../../../shared/brew_draft'
import type { DraftAsk, EffortPoints } from '../../../../../shared/brew_draft'
import type { EngineApi, HelperDoing } from '../../../../../shared/engine_api'
import type { Note, NoteFiled } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { countOf, errorsOf, filedIn, filedKeysOf, hasErrors, mergedInto, mergeTargetsOf, parentTitleError, proposalFrom, reviewOf, rowError, rowsOf, withGroup, withRow } from '../../domain/brew_review'
import type { Review, ReviewErrors, ReviewGroup, ReviewRow } from '../../domain/brew_review'
import { lineOf, sheetMoodOf, tickedItemsOf } from '../../domain/notes_view'
import type { QuestLine } from '../../domain/notes_view'
import { forgetDraft, keepDraft, keptDraft } from '../state_management/brew_drafts'
import type { BrewDrag } from '../state_management/brew_drag'
import type { BrewMoodState } from '../state_management/brew_mood'
import { Robot } from './brew_robot'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

export const BrewQuestCard = ({ line, drag, mood, onBrew }: { line: string; drag: BrewDrag; mood: BrewMoodState; onBrew: () => void }) => (
  <div class="nt-brew" {...mood.near}>
    <span class="nt-brew-drag" role="img" aria-label={t.notebook.brew.drag} title={t.notebook.brew.drag} {...drag.source}>
      <Robot mood={mood.moodWith(drag.isDragging)} />
    </span>
    <div class="nt-brew-text">
      <b>{t.notebook.brew.name}</b>
      <span class="sub">{line}</span>
      <span class="sub nt-brew-drag-hint">{t.notebook.brew.drag}</span>
    </div>
    <button type="button" class="btn primary" onClick={onBrew}>
      {t.notebook.brew.turn}
    </button>
  </div>
)

type SheetProps = { engine: EngineApi; realm: string; realmName: string; note: Note; quests: Map<string, QuestLine>; onFiled: (filed: NoteFiled, count: number) => void; onRefresh: () => void; onClose: () => void }

// Reading: BrewQuest at work, with what it opened last. failed: the read
// couldn't even start, so there's nothing to review yet.
type Phase = { kind: 'reading'; mode: DraftAsk['mode']; doing: HelperDoing | null; steps: number } | { kind: 'review'; review: Review } | { kind: 'failed'; message: string }

const NO_ERRORS: ReviewErrors = { rows: {}, parents: {} }

// What BrewQuest drafted from the note, to check before anything is filed. It
// opens on Claude's reading of the note and the project; whenever that fails
// the checklist draft is shown with the reason, and "Use the checklist instead"
// skips the reading.
export const BrewSheet = ({ engine, realm, realmName, note, quests, onFiled, onRefresh, onClose }: SheetProps) => {
  const [withLinked, setWithLinked] = useState(true)
  const [phase, setPhase] = useState<Phase>(() => {
    const kept = keptDraft(engine, realm, note)

    return kept === null ? { kind: 'reading', mode: 'claude', doing: null, steps: 0 } : { kind: 'review', review: reviewOf(kept) }
  })
  const [parentsAtStart] = useState(() => note.quests.filter(q => q.item === null).length)
  const [errors, setErrors] = useState<ReviewErrors>(NO_ERRORS)
  const [failure, setFailure] = useState<string | null>(null)
  const [isFiling, setFiling] = useState(false)
  const [shown, setShown] = useState<ReadonlySet<string>>(new Set())
  const isSending = useRef(false)
  const reads = useRef(0)
  const isReading = useRef(false)

  const read = async (mode: DraftAsk['mode'], isLinked = withLinked) => {
    const token = (reads.current += 1)
    if (isReading.current) void engine.stopNoteDraft(realm)
    isReading.current = mode === 'claude'
    setPhase({ kind: 'reading', mode, doing: null, steps: 0 })
    setFailure(null)
    setErrors(NO_ERRORS)
    const answer = await ask(engine, () => engine.draftNoteQuests(realm, note.id, { mode, withLinked: isLinked }))
    // A later read, or the sheet closing, makes this one stale.
    if (token !== reads.current) return
    isReading.current = false
    if (!answer.ok) return setPhase({ kind: 'failed', message: answer.message })
    keepDraft(engine, realm, note, answer.data)
    setPhase({ kind: 'review', review: reviewOf(answer.data) })
  }

  useEffect(() => {
    const off = engine.onBrewing(progress => {
      if (progress.key !== realm || progress.noteId !== note.id) return
      setPhase(was => (was.kind === 'reading' && was.mode === 'claude' ? { ...was, doing: progress.doing, steps: progress.steps } : was))
    })
    if (phase.kind === 'reading') void read('claude')

    return () => {
      off()
      reads.current += 1
      // Closing the sheet stops a read; nothing it drafted is kept or filed.
      if (isReading.current) void engine.stopNoteDraft(realm)
    }
  }, [])

  const review = phase.kind === 'review' ? phase.review : null
  const draft = review?.draft ?? null
  const isClaude = draft?.by === 'claude'
  const filed = filedIn(note.quests, draft ?? { by: 'checklist' }, parentsAtStart)
  const rows = review === null ? [] : rowsOf(review)
  const count = review === null ? { quests: 0, parents: 0 } : countOf(review, filed)
  const ticked = tickedItemsOf(note.body)
  const newParents = review?.groups.filter(group => group.parent.kind === 'new') ?? []

  const change = (next: Review) => setPhase({ kind: 'review', review: next })
  const recheck = (next: Review) => {
    const found = errorsOf(next, filed)
    // On blur only what's already shown, or the field just left, updates; the rest waits for File.
    setErrors(was => ({ rows: Object.fromEntries(Object.entries(found.rows).filter(([key]) => key in was.rows)), parents: Object.fromEntries(Object.entries(found.parents).filter(([key]) => key in was.parents)) }))
  }
  const blurRow = (key: string) => {
    if (review === null) return
    const row = rows.find(one => one.key === key)
    const error = row === undefined ? undefined : rowError(review, row, filed)
    setErrors(was => {
      const next = { ...was.rows }
      if (error === undefined) delete next[key]
      else next[key] = error

      return { ...was, rows: next }
    })
  }
  const blurParent = (group: ReviewGroup) =>
    setErrors(was => {
      const error = group.parent.kind === 'new' && group.isParentIn && !filed.parent(group) ? parentTitleError(group.parentTitle) : undefined
      const next = { ...was.parents }
      if (error === undefined) delete next[group.key]
      else next[group.key] = error

      return { ...was, parents: next }
    })

  const submit = async () => {
    if (review === null) return
    const found = errorsOf(review, filed)
    setErrors(found)
    if (isSending.current || hasErrors(found)) return
    isSending.current = true
    setFiling(true)
    setFailure(null)
    const sent = proposalFrom(review, filed, filedKeysOf(note.quests))
    const answer = await ask(engine, () => engine.fileNoteQuests(realm, note.id, sent))
    isSending.current = false
    setFiling(false)
    if (!answer.ok) {
      setFailure(answer.message)
      // Some may have gone in: read the note again, so their rows lock.
      onRefresh()

      return
    }
    forgetDraft(engine, realm, note.id)
    const after = answer.data.view.notes.find(n => n.id === note.id)?.quests.length ?? note.quests.length
    onFiled(answer.data, after - note.quests.length)
    onClose()
  }

  const total = (() => {
    const all = count.quests + count.parents
    const groups = review?.groups.filter(group => group.rows.some(row => row.isIn && row.mergedInto === null && !filed.row(row))) ?? []
    const [only] = groups
    if (groups.length !== 1 || only === undefined) return t.notebook.brew.total(all, realmName)
    if (only.parent.kind === 'new' && count.parents === 1) return t.notebook.brew.totalWithParent(all, realmName, count.quests)
    if (only.parent.kind === 'existing') return t.notebook.brew.totalUnder(all, realmName, only.parent.title)

    return t.notebook.brew.total(all, realmName)
  })()

  const mood = phase.kind === 'reading' ? 'thinking' : sheetMoodOf({ isFiling, hasFailed: failure !== null || phase.kind === 'failed', isEmpty: rows.length === 0 })
  let n = 0

  return (
    <Dialog title={t.notebook.brew.sheet(note.title)} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      <div class="nt-sheet-head">
        <Robot mood={mood} />
        <div class="nt-sheet-say">
          {phase.kind === 'reading' ? (
            <>
              <p class="form-line" role="status">
                <Spinner /> {phase.mode === 'claude' ? t.notebook.brew.reading : t.notebook.brew.drafting}
              </p>
              {phase.mode === 'claude' && (
                <p class="hint">
                  {phase.doing === null ? t.guild.starting : t.guild.doing(phase.doing.kind, phase.doing.target)} {phase.steps > 0 && t.notebook.brew.readingSteps(phase.steps)}
                </p>
              )}
            </>
          ) : phase.kind === 'failed' ? (
            <p class="form-line">{t.notebook.brew.readFailed}</p>
          ) : rows.length === 0 ? (
            <p class="form-line">{isClaude ? t.notebook.brew.emptyClaude : t.notebook.brew.nothing}</p>
          ) : (
            <>
              <p class="form-line">{isClaude ? t.notebook.brew.introClaude : t.notebook.brew.intro}</p>
              {isClaude && draft!.understood !== '' && <p class="hint">{t.notebook.brew.understood(draft!.understood)}</p>}
              {isClaude && <p class="hint">{t.notebook.brew.readWhat(draft!.read.notes.length, draft!.read.files.length)}</p>}
            </>
          )}
        </div>
      </div>
      {phase.kind === 'failed' && (
        <p class="form-banner" role="alert">
          {phase.message}
        </p>
      )}
      {draft?.trouble != null && (
        <p class="form-banner nt-brew-trouble" role="status">
          {draft.trouble}
        </p>
      )}
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      {isClaude && (draft!.questions.length > 0 || draft!.missing.length > 0) && (
        <section class="nt-brew-decide" aria-label={t.notebook.brew.decide}>
          <h3>{t.notebook.brew.decide}</h3>
          <ul>
            {draft!.questions.map(question => (
              <li key={question}>{question}</li>
            ))}
          </ul>
          {draft!.missing.length > 0 && (
            <>
              <h4>{t.notebook.brew.missing}</h4>
              <ul>
                {draft!.missing.map(missing => (
                  <li key={missing}>{missing}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      {review !== null && rows.length > 0 && (
        <>
          <div class={isClaude ? 'nt-cols drafted sub' : 'nt-cols sub'} aria-hidden="true">
            <span>{t.notebook.brew.columnTitle}</span>
            <span>{t.notebook.brew.columnPriority}</span>
            <span>{t.notebook.brew.columnDifficulty}</span>
            {isClaude && <span>{t.notebook.brew.columnPoints}</span>}
          </div>
          {review.groups.map(group => {
            const p = newParents.indexOf(group) + 1
            const isParentFiled = filed.parent(group)
            const isParentSent = group.parent.kind === 'new' && group.isParentIn && !isParentFiled

            return (
              <section key={group.key} class="nt-brew-group" aria-label={group.parent.kind === 'existing' ? t.notebook.brew.groupUnder(group.parent.title) : group.parent.kind === 'new' ? group.parentTitle || t.notebook.brew.parent : t.notebook.brew.groupAlone}>
                {group.parent.kind === 'new' && (
                  <div class={isParentSent ? 'nt-row parent' : 'nt-row parent out'}>
                    <input type="checkbox" checked={group.isParentIn || isParentFiled} disabled={isParentFiled || isFiling} aria-label={newParents.length === 1 ? t.notebook.brew.includeParent : t.notebook.brew.includeParentNumbered(p)} onChange={event => change(withGroup(review, group.key, { isParentIn: (event.target as HTMLInputElement).checked }))} />
                    <div class="nt-row-title">
                      <Field label={newParents.length === 1 ? t.notebook.brew.parent : t.notebook.brew.parentNumbered(p)} isLabelHidden isRequired value={group.parentTitle} error={errors.parents[group.key]} onInput={parentTitle => change(withGroup(review, group.key, { parentTitle }))} onBlur={() => blurParent(group)} />
                      <p class="hint">{isParentFiled ? t.notebook.brew.filedRow : isClaude ? (group.parent.why || t.notebook.brew.newParentCaption) : t.notebook.brew.parentCaption}</p>
                    </div>
                  </div>
                )}
                {group.parent.kind === 'existing' && <p class="hint">{isClaude && group.parent.why !== '' ? `${t.notebook.brew.under(group.parent.title)} ${group.parent.why}` : t.notebook.brew.under(group.parent.title)}</p>}
                {group.parent.kind === 'none' && isClaude && review.groups.length > 1 && <p class="hint nt-brew-alone">{t.notebook.brew.groupAlone}</p>}
                <ol class={group.parent.kind === 'new' ? 'nt-proposal under' : 'nt-proposal'}>
                  {group.rows.map(row => {
                    n += 1

                    return <DraftRow key={row.key} n={n} row={row} review={review} note={note} isClaude={isClaude} isFiled={filed.row(row)} isFiling={isFiling} error={errors.rows[row.key]} isShown={shown.has(row.key)} onShow={isShown => setShown(was => (isShown ? new Set([...was, row.key]) : new Set([...was].filter(key => key !== row.key))))} onChange={next => change(next)} onBlur={() => blurRow(row.key)} onRecheck={recheck} />
                  })}
                </ol>
              </section>
            )
          })}
          {ticked.length > 0 && <p class="hint">{t.notebook.brew.ticked(ticked)}</p>}
          {isClaude && draft!.learned.length > 0 && (
            <details class="nt-brew-learned">
              <summary>{t.notebook.brew.learned}</summary>
              <ul>
                {draft!.learned.map(lesson => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </details>
          )}
          {errors.none !== undefined && <p class="field-error">{errors.none}</p>}
          <p class="nt-total">{total}</p>
        </>
      )}
      <div class="sheet-actions">
        {phase.kind === 'reading' && phase.mode === 'claude' ? (
          <button type="button" class="btn" onClick={() => void read('checklist')}>
            {t.notebook.brew.useChecklist}
          </button>
        ) : (
          <>
            {rows.length > 0 && (
              <span class="sub nt-keys" aria-hidden="true">
                {t.notebook.brew.keys}
              </span>
            )}
            {phase.kind !== 'reading' && (
              <label class="nt-brew-linked">
                <input type="checkbox" checked={withLinked} disabled={isFiling} onChange={event => setWithLinked((event.target as HTMLInputElement).checked)} />
                <span>{t.notebook.brew.withLinked}</span>
              </label>
            )}
            {phase.kind !== 'reading' && (
              <button type="button" class="btn" disabled={isFiling} onClick={() => void read('claude')}>
                {t.notebook.brew.readAgain}
              </button>
            )}
            {phase.kind === 'failed' && (
              <button type="button" class="btn" onClick={() => void read('checklist')}>
                {t.notebook.brew.useChecklist}
              </button>
            )}
          </>
        )}
        <button type="button" class="btn" onClick={onClose}>
          {rows.length === 0 && phase.kind === 'review' ? t.notebook.brew.close : t.actions.cancel}
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
              t.notebook.brew.file(count.quests + count.parents)
            )}
          </button>
        )}
      </div>
    </Dialog>
  )
}

type RowProps = {
  n: number
  row: ReviewRow
  review: Review
  note: Note
  isClaude: boolean
  isFiled: boolean
  isFiling: boolean
  error: string | undefined
  isShown: boolean
  onShow: (isShown: boolean) => void
  onChange: (review: Review) => void
  onBlur: () => void
  onRecheck: (review: Review) => void
}

// One drafted quest: kept or not, its title, priority and difficulty, and for
// a Claude draft its effort, a quest already in the realm it matches, and its
// details: what it's for, how to tell it's done, the note's words, what isn't
// confirmed, what it waits for and a quest to merge it into.
const DraftRow = ({ n, row, review, note, isClaude, isFiled, isFiling, error, isShown, onShow, onChange, onBlur, onRecheck }: RowProps) => {
  const isOut = !row.isIn || row.mergedInto !== null || isFiled
  const line = row.draft.item === null ? null : lineOf(note.body, row.draft.item)
  const set = (patch: Partial<ReviewRow>) => onChange(withRow(review, row.key, patch))
  const match = row.draft.match
  const into = row.mergedInto === null ? null : rowsOf(review).find(other => other.key === row.mergedInto)
  const titleOf = (key: string) => rowsOf(review).find(other => other.key === key)?.title ?? key
  const detailsId = `nt-brew-details-${row.key}`
  const hint = isFiled
    ? t.notebook.brew.filedRow
    : into != null
      ? t.notebook.brew.merged(into.title)
      : !row.isIn && match?.kind === 'same'
        ? t.notebook.brew.skipped
        : isClaude
          ? row.draft.summary
          : row.draft.item === null
            ? t.notebook.brew.fromNote
            : line === null
              ? ''
              : t.notebook.brew.fromLine(line)

  return (
    <li class={isOut ? 'nt-row out' : 'nt-row'} data-drafted={isClaude ? 'true' : undefined}>
      <input type="checkbox" checked={row.isIn || isFiled} disabled={isFiled || isFiling || row.mergedInto !== null} aria-label={t.notebook.brew.include(n)} onChange={event => set({ isIn: (event.target as HTMLInputElement).checked })} />
      <div class="nt-row-title">
        <Field label={t.notebook.brew.questTitle(n)} isLabelHidden isRequired value={row.title} error={error} onInput={title => set({ title })} onBlur={onBlur} />
        <p class="hint">{hint}</p>
        {isClaude && match !== null && !isFiled && (
          <p class={match.kind === 'same' ? 'nt-brew-match same' : 'nt-brew-match'}>
            <span>
              {match.kind === 'same' ? t.notebook.brew.same(match.title) : t.notebook.brew.overlaps(match.title)} {match.why}
            </span>
            {match.kind === 'same' && row.mergedInto === null && (
              <button type="button" class="chip-btn" disabled={isFiling} onClick={() => set({ isIn: !row.isIn })}>
                {row.isIn ? t.notebook.brew.skipIt : t.notebook.brew.keepBoth}
              </button>
            )}
          </p>
        )}
        {isClaude && (
          <button type="button" class="chip-btn nt-brew-more" aria-expanded={isShown} aria-controls={detailsId} aria-label={t.notebook.brew.details(n)} onClick={() => onShow(!isShown)}>
            {t.notebook.brew.detailsShort}
          </button>
        )}
        {isClaude && isShown && (
          <div class="nt-brew-details" id={detailsId}>
            <Field label={t.notebook.brew.summary(n)} isLong value={row.summary} onInput={summary => set({ summary })} onBlur={onBlur} />
            <Field label={t.notebook.brew.criteria(n)} isLong value={row.criteria.join('\n')} onInput={text => set({ criteria: text.split('\n') })} onBlur={onBlur} />
            {row.draft.sources.length > 0 && (
              <div class="nt-brew-sources">
                <h4>{t.notebook.brew.sources}</h4>
                {row.draft.sources.map(source => (
                  <blockquote key={`${source.noteId}:${source.quote}`} class={source.isFound ? undefined : 'not-found'}>
                    {source.quote}
                    {source.title !== note.title && <cite> {t.notebook.brew.sourceFrom(source.title)}</cite>}
                    {!source.isFound && <span class="hint"> {t.notebook.brew.notFound}</span>}
                  </blockquote>
                ))}
              </div>
            )}
            {row.draft.doubts.length > 0 && (
              <div>
                <h4>{t.notebook.brew.doubts}</h4>
                <ul>
                  {row.draft.doubts.map(doubt => (
                    <li key={doubt}>{doubt}</li>
                  ))}
                </ul>
              </div>
            )}
            {row.draft.waitsFor.length > 0 && <p class="hint">{t.notebook.brew.waits(row.draft.waitsFor.map(titleOf))}</p>}
            <label class="form-field">
              <span>{t.notebook.brew.mergeInto(n)}</span>
              <select
                class="chip-select"
                value={row.mergedInto ?? ''}
                disabled={isFiled || isFiling || rowsOf(review).some(other => other.mergedInto === row.key)}
                onChange={event => {
                  const next = mergedInto(review, row.key, (event.target as HTMLSelectElement).value || null)
                  onChange(next)
                  onRecheck(next)
                }}
              >
                <option value="">{t.notebook.brew.dontMerge}</option>
                {mergeTargetsOf(review, row.key).map(other => (
                  <option key={other.key} value={other.key}>
                    {other.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      <select class="chip-select" aria-label={t.notebook.brew.priority(n)} value={row.priority} disabled={isFiled} onChange={event => set({ priority: (event.target as HTMLSelectElement).value as Priority })}>
        {PRIORITIES.map(priority => (
          <option key={priority} value={priority}>
            {t.priority[priority]}
          </option>
        ))}
      </select>
      <select class="chip-select" aria-label={t.notebook.brew.difficulty(n)} value={row.difficulty} disabled={isFiled} onChange={event => set({ difficulty: (event.target as HTMLSelectElement).value as Difficulty })}>
        {DIFFICULTIES.map(difficulty => (
          <option key={difficulty} value={difficulty}>
            {t.difficulty[difficulty]}
          </option>
        ))}
      </select>
      {isClaude && (
        <select class="chip-select" aria-label={t.notebook.brew.points(n)} value={String(row.points)} disabled={isFiled} onChange={event => set({ points: Number((event.target as HTMLSelectElement).value) as EffortPoints })}>
          {EFFORT_POINTS.map(points => (
            <option key={points} value={String(points)}>
              {t.notebook.brew.pointsOption(points)}
            </option>
          ))}
        </select>
      )}
    </li>
  )
}
