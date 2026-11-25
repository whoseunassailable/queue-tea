import { useId, useRef, useState } from 'preact/hooks'

import { isDay } from '../../../../../shared/calendar'
import type { Answer } from '../../../../core/api/engine_client'
import { hereZone } from '../../../../../shared/calendar_time'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { daysFrom, todayIn } from '../../../calendar/domain/calendar_days'

type Props = { due: string | null; onChange: (due: string | null) => Promise<Answer<unknown>>; today?: string }

// The day a quest is due, saved when the field loses focus or on Return, so
// a year typed digit by digit is never saved half-way. Clear takes it off.
// The quest then shows on that day of the realm's calendar.
export const DueControl = ({ due, onChange, today = todayIn(hereZone(), Date.now()) }: Props) => {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setSaving] = useState(false)
  const isSending = useRef(false)
  const shown = draft ?? due ?? ''

  const save = async (next: string | null) => {
    if (next === due) {
      setDraft(null)
      setError(null)

      return
    }
    if (isSending.current) return
    isSending.current = true
    setSaving(true)
    const answer = await onChange(next)
    isSending.current = false
    setSaving(false)
    setError(answer.ok ? null : answer.message)
    if (answer.ok) setDraft(null)
  }
  const check = () => {
    const value = shown.trim()
    if (value === '') return void (due === null ? setError(null) : save(null))
    if (!isDay(value)) return void setError(t.detail.dueBad)
    void save(value)
  }
  const away = due === null ? 0 : daysFrom(today, due)

  return (
    <div class="form-field due-field">
      <label for={id}>{t.detail.due}</label>
      <div class="due-row">
        <input
          id={id}
          type="date"
          class="input"
          value={shown}
          aria-invalid={error === null ? undefined : 'true'}
          aria-describedby={error === null ? `${id}-hint` : `${id}-error ${id}-hint`}
          onInput={event => setDraft((event.target as HTMLInputElement).value)}
          onBlur={check}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              check()
            }
          }}
        />
        {due !== null && (
          <button type="button" class="chip-btn" disabled={isSaving} onClick={() => void save(null)}>
            {t.detail.dueClear}
          </button>
        )}
      </div>
      {error !== null && (
        <p class="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
      <p class="hint" id={`${id}-hint`} role={isSaving ? 'status' : undefined}>
        {isSaving ? (
          <>
            <Spinner />
            {t.detail.dueSaving}
          </>
        ) : due === null ? (
          t.detail.dueNone
        ) : away < 0 ? (
          t.detail.dueOverdue(due, away)
        ) : (
          t.detail.dueOn(due, away)
        )}
      </p>
    </div>
  )
}
