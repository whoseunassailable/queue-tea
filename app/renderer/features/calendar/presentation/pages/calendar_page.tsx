import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { CalendarEvent, CalendarEventInput, CalendarView } from '../../../../../shared/calendar'
import { hereZone, wallOf } from '../../../../../shared/calendar_time'
import type { EngineApi, ProjectView } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { CALENDAR_CLOCK_MS } from '../../../../core/constants/constants'
import { Dialog } from '../../../../core/widgets/dialog'
import { ReadView } from '../../../../core/widgets/read_view'
import { Empty, Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { CALENDAR_MODES, rangeOf, stepOf, todayIn } from '../../domain/calendar_days'
import type { CalendarMode } from '../../domain/calendar_days'
import { itemsOf } from '../../domain/calendar_items'
import { formOf, newEventForm } from '../../domain/event_form'
import type { EventForm } from '../../domain/event_form'
import { AgendaView } from '../widgets/agenda_view'
import { useCalendarFiles } from '../widgets/calendar_files'
import type { ItemActions } from '../widgets/calendar_item'
import { EventSheet } from '../widgets/event_sheet'
import { MonthView } from '../widgets/month_view'
import { WeekView } from '../widgets/week_view'
import '../calendar.css'

type Realm = Extract<ProjectView, { kind: 'readable' }>
type Props = { engine: EngineApi; realm: Realm; onOpenQuest: (id: string) => void; onOpenNote: (id: string) => void; onSay: (text: string, tone?: 'success' | 'error') => void; nowMs?: () => number; zone?: () => string }

const RemoveEvent = ({ event, onRemove, onClose }: { event: CalendarEvent; onRemove: (event: CalendarEvent) => Promise<Answer<unknown>>; onClose: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)
  const submit = async () => {
    if (isSending.current) return
    isSending.current = true
    const answer = await onRemove(event)
    isSending.current = false
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.calendar.removeTitle(event.title)} onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{t.calendar.removeLine}</p>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.calendar.removeIt}
        </button>
      </div>
    </Dialog>
  )
}

const titleOf = (mode: CalendarMode, anchor: string): string => {
  if (mode === 'month') return t.calendar.monthTitle(anchor)
  const { first, last } = rangeOf(mode, anchor)

  return t.calendar.rangeTitle(first, last)
}

// A realm's calendar: its events, the due dates of its quests in play, and
// its Meeting notes that have a time. Times show on the Mac's clock; an event
// or a meeting keeps the zone it was made in.
export const CalendarPage = ({ engine, realm, onOpenQuest, onOpenNote, onSay, nowMs = Date.now, zone = hereZone }: Props) => {
  const here = useMemo(zone, [zone])
  const [now, setNow] = useState(nowMs)
  useEffect(() => {
    const timer = setInterval(() => setNow(nowMs()), CALENDAR_CLOCK_MS)

    return () => clearInterval(timer)
  }, [nowMs])
  const today = todayIn(here, now)
  const [mode, setMode] = useState<CalendarMode>('month')
  const [anchor, setAnchor] = useState(today)
  const [sheet, setSheet] = useState<{ event: CalendarEvent | null; start: EventForm } | null>(null)
  const [removing, setRemoving] = useState<CalendarEvent | null>(null)
  const read = useEngineRead(engine, () => engine.readCalendar(realm.key), [realm.key])
  // The notes come on their own read, so the events show while they're read.
  const notesRead = useEngineRead(engine, () => engine.readNotes(realm.key), [realm.key])
  const events = read.load.status === 'ready' ? read.load.data.events : []
  const notes = notesRead.load.status === 'ready' ? notesRead.load.data.notes : []
  const items = useMemo(() => itemsOf(events, realm, here, today, notes), [events, realm, here, today, notes])
  const files = useCalendarFiles({ engine, realm: { key: realm.key, name: realm.name }, events, here, onView: read.adopt, onSay })

  const change = async (call: () => Promise<Awaited<ReturnType<EngineApi['readCalendar']>>>, said: string): Promise<Answer<CalendarView>> => {
    const answer = await ask(engine, call)
    if (answer.ok) {
      read.adopt(answer.data)
      onSay(said)
    }

    return answer
  }
  const save = (input: CalendarEventInput) => change(() => engine.saveCalendarEvent(realm.key, sheet?.event?.id ?? null, input), t.calendar.saved(input.title))
  const remove = (event: CalendarEvent) => change(() => engine.removeCalendarEvent(realm.key, event.id), t.calendar.removed(event.title))
  const add = (day: string) => setSheet({ event: null, start: newEventForm(day, here, now) })
  const actions: ItemActions = { onEdit: event => setSheet({ event, start: formOf(event, here) }), onOpenQuest, onOpenNote }
  const { first, last } = rangeOf(mode, anchor)
  // New event lands on today when the view shows it, else on the view's first day.
  const addDay = first <= today && today <= last ? today : mode === 'month' ? `${anchor.slice(0, 7)}-01` : first

  return (
    <main class="page cal">
      <ReadView read={read} line={t.loading.calendar}>
        {view => (
          <>
            <div class="page-h panel">
              <h1>{t.calendar.title}</h1>
              <div class="seg" role="group" aria-label={t.calendar.views}>
                {CALENDAR_MODES.map(each => (
                  <button key={each} type="button" class={each === mode ? 'on' : undefined} aria-pressed={each === mode} onClick={() => setMode(each)}>
                    {t.calendar.modes[each]}
                  </button>
                ))}
              </div>
              <div class="cal-actions">
                {files.controls}
                <button type="button" class="btn primary" onClick={() => add(addDay)}>
                  {t.calendar.newEvent}
                </button>
              </div>
            </div>
            {view.unreadable > 0 && (
              <p class="note panel" role="status">
                {t.calendar.unreadable(view.unreadable)}
              </p>
            )}
            {notesRead.load.status === 'loading' && (
              <p class="hint cal-notes-line" role="status">
                <Spinner /> {t.meeting.readingNotes}
              </p>
            )}
            {notesRead.load.status === 'failed' && (
              <p class="note panel" role="alert">
                {t.meeting.notesFailed}{' '}
                <button type="button" class="chip-btn" onClick={notesRead.retry}>
                  {t.failed.tryAgain}
                </button>
              </p>
            )}
            {items.length === 0 ? (
              <Empty title={t.calendar.emptyTitle} line={t.calendar.empty}>
                <button type="button" class="btn primary" onClick={() => add(today)}>
                  {t.calendar.newEvent}
                </button>
              </Empty>
            ) : (
              <>
                <div class="cal-bar">
                  <button type="button" class="icon-btn" aria-label={t.calendar.previous[mode]} onClick={() => setAnchor(stepOf(mode, anchor, -1))}>
                    ‹
                  </button>
                  <button type="button" class="chip-btn" onClick={() => setAnchor(today)}>
                    {t.calendar.today}
                  </button>
                  <button type="button" class="icon-btn" aria-label={t.calendar.next[mode]} onClick={() => setAnchor(stepOf(mode, anchor, 1))}>
                    ›
                  </button>
                  <h2 class="cal-title" aria-live="polite">
                    {titleOf(mode, anchor)}
                  </h2>
                  <span class="hint">{t.calendar.clock(here)}</span>
                </div>
                {mode === 'month' && (
                  <MonthView
                    anchor={anchor}
                    today={today}
                    here={here}
                    items={items}
                    actions={actions}
                    onAdd={add}
                    onMore={day => {
                      setMode('agenda')
                      setAnchor(day)
                    }}
                  />
                )}
                {mode === 'week' && <WeekView anchor={anchor} today={today} now={wallOf(now, here)} here={here} items={items} actions={actions} onAdd={add} />}
                {mode === 'agenda' && <AgendaView anchor={anchor} today={today} here={here} items={items} actions={actions} />}
              </>
            )}
          </>
        )}
      </ReadView>
      {sheet !== null && (
        <EventSheet
          // A new sheet for each event, so one's draft never shows in another.
          key={sheet.event?.id ?? 'new'}
          event={sheet.event}
          start={sheet.start}
          here={here}
          onSave={save}
          onRemove={event => {
            setSheet(null)
            setRemoving(event)
          }}
          onClose={() => setSheet(null)}
        />
      )}
      {removing !== null && <RemoveEvent event={removing} onRemove={remove} onClose={() => setRemoving(null)} />}
      {files.dialog}
    </main>
  )
}
