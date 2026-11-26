import { callKindOf, hasMeeting } from '../../../../../shared/meetings'
import type { Meeting } from '../../../../../shared/meetings'
import { t } from '../../../../l10n/en'
import { meetingWhenOf, sectionsOf } from '../../domain/meeting_notes'
import '../meeting.css'

type Props = { title: string; meeting: Meeting; body: string; here: string; isLive: boolean; onEdit: () => void; onJoin: (link: string) => void; onFollowUp: () => void }

// A Meeting note's details, under its title: when it is on the Mac's clock,
// the call to join, who comes, and how far the agenda and action items went.
export const MeetingCard = ({ title, meeting, body, here, isLive, onEdit, onJoin, onFollowUp }: Props) => {
  const sections = sectionsOf(body)
  const open = sections.actions.filter(action => !action.isDone).length
  const when = meeting.time === null ? null : meetingWhenOf(meeting.time, here)
  const call = meeting.link === null ? null : callKindOf(meeting.link)

  return (
    <section class="nt-meeting" aria-label={t.meeting.card}>
      {!hasMeeting(meeting) ? (
        <p class="sub">{t.meeting.noDetails}</p>
      ) : (
        <>
          <div class="nt-meeting-row">
            <span class="nt-meeting-when">
              <span aria-hidden="true">◷ </span>
              {when === null ? <span class="sub">{t.meeting.noTime}</span> : t.meeting.when(when.day, when.span)}
            </span>
            {when?.own != null && <span class="sub">{when.own}</span>}
            {meeting.link !== null && call !== null && (
              <button type="button" class="btn primary nt-meeting-join" title={meeting.link} aria-label={t.meeting.joinLabel(t.meeting.join[call], title)} onClick={() => meeting.link !== null && onJoin(meeting.link)}>
                {t.meeting.join[call]}
              </button>
            )}
          </div>
          <p class="nt-meeting-people">
            <span class="sub">{t.meeting.attendees} </span>
            {meeting.attendees.length === 0 ? <span class="sub">{t.meeting.noAttendees}</span> : meeting.attendees.join(', ')}
          </p>
        </>
      )}
      <p class="sub nt-meeting-counts">{t.meeting.counts(sections.agenda.length, sections.decisions.length, open, sections.actions.length)}</p>
      {isLive && (
        <div class="nt-meeting-actions">
          <button type="button" class="chip-btn" onClick={onEdit}>
            {hasMeeting(meeting) ? t.meeting.edit : t.meeting.addDetails}
          </button>
          <button type="button" class="chip-btn" title={t.meeting.followUpHint} onClick={onFollowUp}>
            {t.meeting.followUp}
          </button>
        </div>
      )}
    </section>
  )
}
