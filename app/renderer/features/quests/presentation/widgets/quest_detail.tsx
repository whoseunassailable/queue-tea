import { useState } from 'preact/hooks'

import type { Allowance, Difficulty, Platform } from '../../../../../../types'
import type { EngineApi } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { dayOf, formatSpan } from '../../../../core/domain/format'
import { Field } from '../../../../core/widgets/field'
import { GoldReward, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { Spinner } from '../../../../core/widgets/states'
import type { Row } from '../../domain/board'
import { titleError } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'
import { ClaudeOut } from './claude_out'
import { HelperToggles } from './helper_toggles'
import { PriorityControl } from './priority_control'
import { QuestNotes } from './quest_notes'

const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

export type DetailActions = {
  onStart: (platform: Platform) => void
  allowance: Allowance | null
  onSeal: () => void
  onUnseal: () => void
  onPartOf: () => void
  onRemove: () => void
  onPlayNext: () => void
  onActiveSaga: () => void
}

type DetailProps = DetailActions & { engine: EngineApi; realm: string; row: Row | null; isBusy: boolean; isActiveSaga: boolean; isSaved: boolean; note: string | undefined; edits: QuestEdits }

// The title, read until clicked. A field being edited keeps its text when the
// record changes underneath it.
const EditableTitle = ({ title, onSave }: { title: string; onSave: (title: string) => Promise<string | undefined> }) => {
  const [draft, setDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const save = async () => {
    if (draft === null || draft.trim() === title) {
      setDraft(null)
      setError(undefined)

      return
    }
    const problem = titleError(draft) ?? (await onSave(draft))
    setError(problem)
    if (problem === undefined) setDraft(null)
  }
  if (draft === null) {
    return (
      <h2 class="d-title">
        <button type="button" class="title-btn" aria-label={t.actions.editTitle(title)} onClick={() => setDraft(title)}>
          {title}
        </button>
      </h2>
    )
  }

  return (
    <div
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          setDraft(null)
          setError(undefined)
        }
      }}
    >
      <Field label={t.form.title} isRequired value={draft} error={error} onInput={setDraft} onBlur={() => void save()} onEnter={() => void save()} />
    </div>
  )
}

// Keyed by quest, so a draft belongs to one quest and a change on disk leaves
// what's being typed alone.
const Description = ({ value, onSave }: { value: string | null; onSave: (description: string) => void }) => {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <textarea
      class="input"
      rows={3}
      aria-label={t.detail.description}
      placeholder={t.detail.descriptionPlaceholder}
      value={draft ?? value ?? ''}
      onInput={event => setDraft((event.target as HTMLTextAreaElement).value)}
      onBlur={event => {
        const text = (event.target as HTMLTextAreaElement).value
        if (text.trim() !== (value ?? '')) onSave(text)
        setDraft(null)
      }}
    />
  )
}

const Criteria = ({ lines, onSave }: { lines: string[]; onSave: (lines: string[]) => void }) => {
  const [draft, setDraft] = useState('')
  const add = () => {
    if (draft.trim() === '') return
    onSave([...lines, draft.trim()])
    setDraft('')
  }

  return (
    <>
      {lines.length > 0 && (
        <ul class="chapters">
          {lines.map(line => (
            <li key={line}>
              <span class="grow">{line}</span>
              <button type="button" class="link-btn" aria-label={t.actions.removeCriterion(line)} onClick={() => onSave(lines.filter(l => l !== line))}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        class="input"
        type="text"
        aria-label={t.actions.addCriterion}
        placeholder={t.detail.criterionPlaceholder}
        value={draft}
        onInput={event => setDraft((event.target as HTMLInputElement).value)}
        onBlur={add}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault()
            add()
          }
        }}
      />
    </>
  )
}

// Read apart from the board: the pane stands without it, and its own failure
// stays on its own line.
const Facts = ({ engine, realm, row, filedOn }: { engine: EngineApi; realm: string; row: Row; filedOn: string }) => {
  const { quest } = row
  const read = useEngineRead(engine, () => engine.readQuestFacts(realm, quest.id), [realm, quest.id])
  const facts = read.load.status === 'ready' ? read.load.data : null
  const failure = read.load.status === 'failed' ? read.load.message : read.note

  return (
    <>
      {facts !== null && <QuestNotes facts={facts} />}
      {read.load.status === 'loading' && <p class="hint" role="status"><Spinner />{t.loading.stillReading}</p>}
      {failure !== null && <p class="hint" role="alert">{failure}</p>}
      <button type="button" class="link-btn" disabled={read.isRefreshing || read.load.status === 'loading'} onClick={read.load.status === 'failed' ? read.retry : read.refresh}>
        {read.isRefreshing && <Spinner />}{read.isRefreshing ? t.activity.refreshing : t.activity.refresh}
      </button>
      <dl class="facts">
        <dt>{t.detail.branch}</dt>
        <dd class="mono">{quest.branch ?? facts?.branchToBe ?? t.detail.noBranch}</dd>
        <dt>{t.detail.filed}</dt>
        <dd>{filedOn}</dd>
      </dl>
    </>
  )
}

export const QuestDetail = ({ engine, realm, row, isBusy, isActiveSaga, isSaved, note, edits, onStart, allowance, onSeal, onUnseal, onPartOf, onRemove, onPlayNext, onActiveSaga }: DetailProps) => {
  if (row === null) {
    return (
      <aside class="detail panel" aria-label={t.detail.label}>
        <p class="ph">{t.detail.pick}</p>
      </aside>
    )
  }
  const { quest, sagaOf } = row
  const isSealed = quest.sealedBecause !== null
  const kind = isSealed ? t.detail.sealed : sagaOf !== null ? t.detail.saga : t.detail.quest
  const saveTitle = async (title: string) => {
    const answer = await edits.edit(realm, quest, { title })

    return answer.ok ? undefined : answer.message
  }

  return (
    <aside class="detail panel" aria-label={t.detail.label}>
      <p class="d-kind">{t.detail.onBoard(kind)}</p>
      <EditableTitle key={quest.id} title={quest.title} onSave={saveTitle} />
      <div class="d-chips">
        <PriorityControl title={quest.title} priority={quest.priority} isSaved={isSaved} onPick={priority => void edits.setPriority(realm, quest, priority)} />
        <select
          class="chip-select"
          aria-label={t.form.difficulty}
          value={quest.difficulty}
          onChange={event => void edits.edit(realm, quest, { difficulty: (event.target as HTMLSelectElement).value as Difficulty })}
        >
          {DIFFICULTIES.map(difficulty => (
            <option key={difficulty} value={difficulty}>
              {t.difficulty[difficulty]}
            </option>
          ))}
        </select>
        <span class="d-est">~{formatSpan(quest.estimateMinutes)}</span>
      </div>
      <div class="d-reward">
        <XpReward xp={quest.xp} />
        <GoldReward gold={quest.xp} />
      </div>
      {!isSealed && <ClaudeOut allowance={allowance} />}
      <div class="q-actions">
        {!isSealed && (
          <button type="button" class="btn primary" disabled={isBusy} onClick={() => onStart('claude')}>
            {quest.isStar ? t.actions.startMain : t.actions.start}
          </button>
        )}
        {!isSealed && (
          <button type="button" class="btn" disabled={isBusy} onClick={() => onStart('codex')}>
            {t.actions.startCodex}
          </button>
        )}
        {!isSealed && (
          <button type="button" class="btn" onClick={onPlayNext}>
            {quest.isPlayNext ? t.actions.playNextOff : t.actions.playNext}
          </button>
        )}
        {isSealed ? (
          <button type="button" class="btn" onClick={onUnseal}>
            {t.actions.unseal}
          </button>
        ) : (
          <button type="button" class="btn" onClick={onSeal}>
            {t.actions.seal}
          </button>
        )}
      </div>
      {note !== undefined && <p class="card-note">⚠ {note}</p>}
      <hr />
      {quest.why !== null && <p class="d-star">{t.detail.main(quest.why)}</p>}
      {isSealed && <p class="d-star">⊘ {quest.sealedBecause}</p>}
      <h3>{t.detail.description}</h3>
      <Description key={quest.id} value={quest.description} onSave={description => void edits.edit(realm, quest, { description })} />
      {quest.description === null && quest.goal !== null && (
        <button type="button" class="link-btn" onClick={() => void edits.edit(realm, quest, { description: quest.goal })}>
          {t.detail.useGoal}
        </button>
      )}
      <h3>{t.detail.criteria}</h3>
      <Criteria lines={quest.criteria} onSave={criteria => void edits.edit(realm, quest, { criteria })} />
      {quest.criteria.length === 0 && quest.acceptance.length > 0 && (
        <button type="button" class="link-btn" onClick={() => void edits.edit(realm, quest, { criteria: quest.acceptance })}>
          {t.detail.useAcceptance(quest.acceptance.length)}
        </button>
      )}
      <h3>{t.helpers.label}</h3>
      <HelperToggles on={quest.helpers} onChange={helpers => edits.edit(realm, quest, { helpers })} />
      {sagaOf !== null && (
        <>
          <h3>{t.detail.chapters(sagaOf.chapters.length)}</h3>
          <ul class="chapters">
            {sagaOf.chapters.map(chapter => (
              <li key={chapter.id}>{chapter.title}</li>
            ))}
          </ul>
        </>
      )}
      <hr />
      <Facts key={quest.id} engine={engine} realm={realm} row={row} filedOn={dayOf(quest.created)} />
      <div class="d-foot">
        {!row.isChapter && (
          <button type="button" class="link-btn" onClick={onActiveSaga}>
            {isActiveSaga ? t.actions.sagaOff : t.actions.makeSaga}
          </button>
        )}
        <button type="button" class="link-btn" onClick={onPartOf}>
          {t.actions.partOf}
        </button>
        <button type="button" class="link-btn danger" onClick={onRemove}>
          {t.actions.remove}
        </button>
      </div>
    </aside>
  )
}
