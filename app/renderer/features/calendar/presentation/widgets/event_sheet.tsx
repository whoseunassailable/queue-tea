import { useId, useMemo, useRef, useState } from 'preact/hooks'

import type { CalendarEvent, CalendarEventInput } from '../../../../../shared/calendar'
import { knownZones } from '../../../../../shared/calendar_time'
import type { Answer } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { t } from '../../../../l10n/en'
import { todayIn } from '../../domain/calendar_days'
import { EVENT_FIELDS, eventInputOf, validateEvent, withStartDay } from '../../domain/event_form'
import type { EventField, EventForm } from '../../domain/event_form'

type Props = {
  // null for a new event.
  event: CalendarEvent | null
  start: EventForm
  here: string
  onSave: (input: CalendarEventInput) => Promise<Answer<unknown>>
  onRemove: (event: CalendarEvent) => void
  onClose: () => void
}

// Adds an event or changes one. Each field is checked when it loses focus,
// and every field when the sheet is sent.
export const EventSheet = ({ event, start, here, onSave, onRemove, onClose }: Props) => {
  const [form, setForm] = useState(start)
  const [touched, setTouched] = useState<Partial<Record<EventField, boolean>>>({})
  const [failure, setFailure] = useState<string | null>(null)
  const [isSaving, setSaving] = useState(false)
  const isSending = useRef(false)
  const zonesId = useId()
  const zones = useMemo(knownZones, [])
  const errors = validateEvent(form)
  const errorOf = (field: EventField) => (touched[field] === true ? errors[field] : undefined)
  const touch = (field: EventField) => () => setTouched(was => ({ ...was, [field]: true }))
  const set = (patch: Partial<EventForm>) => setForm(was => ({ ...was, ...patch }))

  const submit = async () => {
    setTouched(Object.fromEntries(EVENT_FIELDS.map(field => [field, true])))
    setFailure(null)
    if (isSending.current || Object.keys(errors).length > 0) return
    isSending.current = true
    setSaving(true)
    const answer = await onSave(eventInputOf(form))
    isSending.current = false
    setSaving(false)
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }
  const enter = () => void submit()

  return (
    <Dialog title={event === null ? t.calendar.form.add : t.calendar.form.edit} isSheet onCancel={onClose} onSubmit={enter}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      {event?.source !== undefined && (
        <div class="cal-source">
          <p class="form-line">{t.calendar.sourceLine(todayIn(here, Date.parse(event.source.importedAt)), event.source.file, event.source.calendar, event.source.app)}</p>
          <p class="hint">{t.calendar.sourceHint}</p>
        </div>
      )}
      <Field label={t.form.title} isRequired value={form.title} error={errorOf('title')} onInput={title => set({ title })} onBlur={touch('title')} onEnter={enter} />
      <label class="check">
        <input type="checkbox" checked={form.isAllDay} onChange={change => set({ isAllDay: (change.target as HTMLInputElement).checked })} />
        <span>{t.calendar.form.allDay}</span>
      </label>
      <div class="cal-form-row">
        <Field label={t.calendar.form.startDay} type="date" isRequired value={form.startDay} error={errorOf('startDay')} onInput={day => setForm(was => withStartDay(was, day))} onBlur={touch('startDay')} onEnter={enter} />
        {!form.isAllDay && <Field label={t.calendar.form.startTime} type="time" isRequired value={form.startTime} error={errorOf('startTime')} onInput={startTime => set({ startTime })} onBlur={touch('startTime')} onEnter={enter} />}
      </div>
      <div class="cal-form-row">
        <Field label={t.calendar.form.endDay} type="date" isRequired value={form.endDay} error={errorOf('endDay')} onInput={endDay => set({ endDay })} onBlur={touch('endDay')} onEnter={enter} />
        {!form.isAllDay && <Field label={t.calendar.form.endTime} type="time" isRequired value={form.endTime} error={errorOf('endTime')} onInput={endTime => set({ endTime })} onBlur={touch('endTime')} onEnter={enter} />}
      </div>
      {!form.isAllDay && (
        <>
          <Field label={t.calendar.form.zone} isRequired value={form.zone} list={zonesId} error={errorOf('zone')} onInput={zone => set({ zone })} onBlur={touch('zone')} onEnter={enter} />
          <datalist id={zonesId}>
            {zones.map(zone => (
              <option key={zone} value={zone} />
            ))}
          </datalist>
          <p class="hint">{t.calendar.form.zoneHint(here)}</p>
        </>
      )}
      <Field label={t.calendar.form.place} value={form.place} error={errorOf('place')} onInput={place => set({ place })} onBlur={touch('place')} onEnter={enter} />
      <Field label={t.calendar.form.notes} isLong value={form.notes} error={errorOf('notes')} onInput={notes => set({ notes })} onBlur={touch('notes')} />
      <div class="sheet-actions">
        {event !== null && (
          <button type="button" class="link-btn danger cal-remove" onClick={() => onRemove(event)}>
            {t.calendar.form.remove}
          </button>
        )}
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary" disabled={isSaving}>
          {isSaving ? t.calendar.form.saving : event === null ? t.calendar.form.addIt : t.calendar.form.save}
        </button>
      </div>
    </Dialog>
  )
}
