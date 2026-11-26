import { useId, useMemo, useState } from 'preact/hooks'

import { knownZones } from '../../../../../shared/calendar_time'
import type { Meeting } from '../../../../../shared/meetings'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { t } from '../../../../l10n/en'
import { MEETING_FIELDS, meetingFormOf, meetingOfForm, validateMeeting, withDay } from '../../domain/meeting_notes'
import type { MeetingField, MeetingForm } from '../../domain/meeting_notes'

type Props = { meeting: Meeting; here: string; onSave: (meeting: Meeting) => void; onClose: () => void }

// The meeting's day and times, its call link and who comes. Each field is
// checked when it loses focus, and every field on Save details. The note
// saves them as it saves its text, and its save line says how that went.
export const MeetingSheet = ({ meeting, here, onSave, onClose }: Props) => {
  const [form, setForm] = useState<MeetingForm>(() => meetingFormOf(meeting, here))
  const [touched, setTouched] = useState<Partial<Record<MeetingField, boolean>>>({})
  const zonesId = useId()
  const zones = useMemo(knownZones, [])
  const errors = validateMeeting(form)
  const errorOf = (field: MeetingField) => (touched[field] === true ? errors[field] : undefined)
  const touch = (field: MeetingField) => () => setTouched(was => ({ ...was, [field]: true }))
  const set = (patch: Partial<MeetingForm>) => setForm(was => ({ ...was, ...patch }))
  const isTimed = form.day.trim() !== ''

  const submit = () => {
    setTouched(Object.fromEntries(MEETING_FIELDS.map(field => [field, true])))
    if (Object.keys(errors).length > 0) return
    onSave(meetingOfForm(form))
  }

  return (
    <Dialog title={t.meeting.form.title} isSheet onCancel={onClose} onSubmit={submit}>
      <Field label={t.meeting.form.day} type="date" value={form.day} error={errorOf('day')} onInput={day => setForm(was => withDay(was, day))} onBlur={touch('day')} onEnter={submit} />
      <p class="hint">{t.meeting.form.dayHint}</p>
      {isTimed && (
        <>
          <div class="nt-meeting-times">
            <Field label={t.meeting.form.startTime} type="time" isRequired value={form.startTime} error={errorOf('startTime')} onInput={startTime => set({ startTime })} onBlur={touch('startTime')} onEnter={submit} />
            <Field label={t.meeting.form.endTime} type="time" isRequired value={form.endTime} error={errorOf('endTime')} onInput={endTime => set({ endTime })} onBlur={touch('endTime')} onEnter={submit} />
          </div>
          <Field label={t.meeting.form.zone} isRequired value={form.zone} list={zonesId} error={errorOf('zone')} onInput={zone => set({ zone })} onBlur={touch('zone')} onEnter={submit} />
          <datalist id={zonesId}>
            {zones.map(zone => (
              <option key={zone} value={zone} />
            ))}
          </datalist>
          <p class="hint">{t.meeting.form.zoneHint(here)}</p>
        </>
      )}
      <Field label={t.meeting.form.link} value={form.link} error={errorOf('link')} onInput={link => set({ link })} onBlur={touch('link')} onEnter={submit} />
      <p class="hint">{t.meeting.form.linkHint}</p>
      <Field label={t.meeting.form.attendees} isLong value={form.attendees} error={errorOf('attendees')} onInput={attendees => set({ attendees })} onBlur={touch('attendees')} />
      <p class="hint">{t.meeting.form.attendeesHint}</p>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.meeting.form.save}
        </button>
      </div>
    </Dialog>
  )
}
