import { Fragment } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

import type { Allowance, Difficulty, Platform } from '../../../../../../types'
import type { EngineApi, QuestEdit, QuestRow } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { dayOf, formatSpan } from '../../../../core/domain/format'
import { AttachmentInput } from '../../../../core/widgets/attachment_input'
import { Field, Pick } from '../../../../core/widgets/field'
import { GoldReward, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { Spinner } from '../../../../core/widgets/states'
import type { Row } from '../../domain/board'
import { titleError } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'
import { ClaudeOut } from './claude_out'
import { DescriptionFiles, withFileLink } from './description_files'
import { DueControl } from './due_control'
import { HelperToggles } from './helper_toggles'
import { TestProfileControl } from './test_profile_control'
import { PriorityControl } from './priority_control'
import { QuestNotes } from './quest_notes'
import { RecipePanel } from './recipe_panel'

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
// what's being typed alone. A file goes in at the caret while the box has
// focus, else at the end, and is saved at once.
const Description = ({ engine, realm, value, onSave }: { engine: EngineApi; realm: string; value: string | null; onSave: (description: string) => Promise<unknown> }) => {
  const [draft, setDraft] = useState<string | null>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  // The newest text, typed or sent, so a file landing before the save comes
  // back keeps it, and a batch of files keeps every link. An older save's
  // reply can land after a newer save went out, so the saved text only
  // replaces it once no save is still on its way.
  const latest = useRef(value ?? '')
  const saving = useRef(0)
  useEffect(() => {
    if (draft === null && saving.current === 0) latest.current = value ?? ''
  }, [value])
  const save = (text: string) => {
    latest.current = text
    saving.current += 1
    void onSave(text).finally(() => { saving.current -= 1 })
  }
  const insert = async (markdown: string) => {
    const text = latest.current
    const box = area.current
    if (box === null || document.activeElement !== box) {
      save(withFileLink(text, markdown))
      setDraft(null)

      return
    }
    const from = Math.min(box.selectionStart, text.length)
    const link = `${from > 0 && text[from - 1] !== '\n' ? '\n' : ''}${markdown}\n`
    const next = text.slice(0, from) + link + text.slice(Math.max(from, box.selectionEnd))
    save(next)
    setDraft(next)
    requestAnimationFrame(() => box.setSelectionRange(from + link.length, from + link.length))
  }
  const shown = draft ?? value ?? ''

  return (
    <AttachmentInput engine={engine} realm={realm} id={null} onInsert={insert}>
      <textarea
        ref={area}
        class="input"
        rows={3}
        aria-label={t.detail.description}
        placeholder={t.detail.descriptionPlaceholder}
        value={shown}
        onInput={event => {
          latest.current = (event.target as HTMLTextAreaElement).value
          setDraft(latest.current)
        }}
        onBlur={event => {
          const text = (event.target as HTMLTextAreaElement).value
          if (text.trim() !== (value ?? '')) save(text)
          setDraft(null)
        }}
      />
      <DescriptionFiles engine={engine} realm={realm} text={shown} />
    </AttachmentInput>
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

// Part of two or more sagas, a quest has one set of criteria for every saga
// or a set for each. A set for each starts from the shared lines, and one
// set again keeps every line once.
const SagaCriteria = ({ quest, onEdit }: { quest: QuestRow; onEdit: (edit: QuestEdit) => void }) => {
  const sets = quest.criteriaByParent
  const toEach = () => onEdit({ criteria: [], criteriaByParent: Object.fromEntries(quest.parents.map(parent => [parent.id, quest.criteria])) })
  const toOne = () => onEdit({ criteria: [...new Set([...quest.criteria, ...(sets ?? []).flatMap(set => set.lines)])], criteriaByParent: null })

  return (
    <>
      <fieldset class="form-group">
        <legend class="sr">{t.form.criteriaSets}</legend>
        <div class="segments">
          <Pick name={`criteria-mode-${quest.id}`} label={t.form.criteriaOne} isPicked={sets === null} onPick={toOne} />
          <Pick name={`criteria-mode-${quest.id}`} label={t.form.criteriaEach} isPicked={sets !== null} onPick={toEach} />
        </div>
      </fieldset>
      {sets === null && <Criteria lines={quest.criteria} onSave={criteria => onEdit({ criteria })} />}
      {sets !== null && quest.criteria.length > 0 && (
        <>
          <h4>{t.detail.criteriaEvery}</h4>
          <Criteria lines={quest.criteria} onSave={criteria => onEdit({ criteria })} />
        </>
      )}
      {sets?.map(set => (
        <Fragment key={set.parent.id}>
          <h4>{t.detail.criteriaFor(set.parent.title)}</h4>
          <Criteria lines={set.lines} onSave={lines => onEdit({ criteriaByParent: { [set.parent.id]: lines } })} />
        </Fragment>
      ))}
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
      {facts?.recipe != null && <RecipePanel engine={engine} recipe={facts.recipe} session="none" isWithCodex={false} />}
      {facts !== null && <QuestNotes facts={facts} />}
      {read.load.status === 'loading' && <p class="hint" role="status"><Spinner />{t.loading.stillReading}</p>}
      {failure !== null && <p class="hint" role="alert">{failure}</p>}
      <button type="button" class="link-btn" disabled={read.isRefreshing || read.load.status === 'loading'} onClick={read.load.status === 'failed' ? read.retry : read.refresh}>
        {read.isRefreshing && <Spinner />}{read.isRefreshing ? t.detail.refreshing : t.detail.refresh}
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
      <Description key={quest.id} engine={engine} realm={realm} value={quest.description} onSave={description => edits.edit(realm, quest, { description })} />
      {quest.description === null && quest.goal !== null && (
        <button type="button" class="link-btn" onClick={() => void edits.edit(realm, quest, { description: quest.goal })}>
          {t.detail.useGoal}
        </button>
      )}
      <h3>{t.detail.criteria}</h3>
      {quest.parents.length >= 2 ? (
        <SagaCriteria quest={quest} onEdit={edit => void edits.edit(realm, quest, edit)} />
      ) : (
        <Criteria lines={quest.criteria} onSave={criteria => void edits.edit(realm, quest, { criteria })} />
      )}
      {quest.criteriaByParent === null && quest.criteria.length === 0 && quest.acceptance.length > 0 && (
        <button type="button" class="link-btn" onClick={() => void edits.edit(realm, quest, { criteria: quest.acceptance })}>
          {t.detail.useAcceptance(quest.acceptance.length)}
        </button>
      )}
      <h3>{t.helpers.label}</h3>
      <HelperToggles on={quest.helpers} onChange={helpers => edits.edit(realm, quest, { helpers })} />
      <h3>{t.testProfile.label}</h3>
      <TestProfileControl profile={quest.testProfile} onChange={testProfile => edits.edit(realm, quest, { testProfile })} />
      <DueControl key={quest.id} due={quest.due} onChange={due => edits.edit(realm, quest, { due })} />
      {sagaOf !== null && (
        <>
          <h3>{t.detail.chapters(sagaOf.chapters.length + sagaOf.shared.length)}</h3>
          <ul class="chapters">
            {sagaOf.chapters.map(chapter => (
              <li key={chapter.id}>{chapter.title}</li>
            ))}
            {sagaOf.shared.map(chapter => (
              <li key={chapter.id}>
                ↔ {chapter.title} · {t.quest.listedUnder(chapter.listedUnder)}
              </li>
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
