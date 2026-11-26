import { useRef, useState } from 'preact/hooks'

import type { CalendarEvent, CalendarImportPreview, CalendarView, CalendarWhen, ImportSkip } from '../../../../../shared/calendar'
import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { CALENDAR_IMPORT_ROWS } from '../../../../core/constants/constants'
import { Dialog } from '../../../../core/widgets/dialog'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'

type Kind = 'import' | 'export'
type Failure = { kind: Kind; message: string }
type Props = { engine: EngineApi; realm: { key: string; name: string }; events: readonly CalendarEvent[]; here: string; onView: (view: CalendarView) => void; onSay: (text: string) => void }

const f = t.calendar.files

const whenLine = (when: CalendarWhen, here: string): string => {
  if (when.kind === 'allDay') return t.calendar.days(when.startDay, when.endDay)
  const span = t.calendar.span(when.start.slice(11), when.start.slice(0, 10) === when.end.slice(0, 10) ? when.end.slice(11) : t.calendar.endsOn(when.end.slice(11), when.end.slice(0, 10)))
  const line = `${t.calendar.dayName(when.start.slice(0, 10))}, ${span}`

  return when.zone === here ? line : `${line} · ${when.zone}`
}

const reasonOf = (skip: ImportSkip) => (skip.reason === 'zone' && skip.detail !== null ? f.zoneNamed(skip.detail) : f.reasons[skip.reason])

// What a picked file would do to the calendar, and the button that does it.
// Only new and changed events go to main; the ones already here stay as they are.
const ImportSheet = ({ engine, realm, preview, here, onView, onSay, onClose }: Pick<Props, 'engine' | 'realm' | 'here' | 'onView' | 'onSay'> & { preview: CalendarImportPreview; onClose: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const [isImporting, setImporting] = useState(false)
  const isSending = useRef(false)
  const coming = preview.items.filter(item => item.status !== 'same')
  const count = (status: 'new' | 'update' | 'same') => preview.items.filter(item => item.status === status).length
  const from = f.from(preview.calendar, preview.app)

  const submit = async () => {
    if (coming.length === 0) return onClose()
    if (isSending.current) return
    isSending.current = true
    setImporting(true)
    setFailure(null)
    const answer = await ask(engine, () => engine.importCalendarEvents(realm.key, coming.map(({ event, source }) => ({ event, source }))))
    isSending.current = false
    setImporting(false)
    if (!answer.ok) return setFailure(answer.message)
    onView(answer.data.view)
    onSay(f.imported(answer.data.added, answer.data.updated))
    onClose()
  }

  return (
    <Dialog title={f.title(preview.file)} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      {from !== null && <p class="form-line">{from}</p>}
      <p class="form-line">{preview.items.length === 0 ? f.nothingAtAll : coming.length === 0 ? f.nothingNew : f.counts(count('new'), count('update'), count('same'))}</p>
      {preview.items.length > 0 && (
        <ul class="cal-import-list" aria-label={f.title(preview.file)}>
          {preview.items.slice(0, CALENDAR_IMPORT_ROWS).map(item => (
            <li key={item.source.uid} class={`cal-import-row ${item.status}`}>
              <span class="cal-tag">{f.statuses[item.status]}</span>
              <span class="cal-name">{item.event.title}</span>
              <span class="sub">{whenLine(item.event.when, here)}</span>
            </li>
          ))}
          {preview.items.length > CALENDAR_IMPORT_ROWS && <li class="sub">{f.andMore(preview.items.length - CALENDAR_IMPORT_ROWS)}</li>}
        </ul>
      )}
      {preview.skipped.length > 0 && (
        <>
          <p class="form-line">{f.leftOut(preview.skipped.length)}</p>
          <ul class="cal-skipped">
            {preview.skipped.slice(0, CALENDAR_IMPORT_ROWS).map((skip, i) => (
              <li key={i}>
                <b>{skip.title ?? f.untitled}</b>: {reasonOf(skip)}
              </li>
            ))}
            {preview.skipped.length > CALENDAR_IMPORT_ROWS && <li class="sub">{f.andMore(preview.skipped.length - CALENDAR_IMPORT_ROWS)}</li>}
          </ul>
        </>
      )}
      {coming.length > 0 && <p class="hint">{f.replaceHint}</p>}
      <div class="sheet-actions">
        {coming.length > 0 && (
          <button type="button" class="btn" onClick={onClose}>
            {t.actions.cancel}
          </button>
        )}
        <button type="submit" class="btn primary" disabled={isImporting}>
          {isImporting ? f.importing : coming.length === 0 ? f.close : f.importIt(coming.length)}
        </button>
      </div>
    </Dialog>
  )
}

// Import… and Export… for the page's header. Main opens the Mac's dialogs;
// while it reads or writes, a line says so. Cancelling a dialog changes
// nothing; a failure opens a dialog that can try again.
export const useCalendarFiles = ({ engine, realm, events, here, onView, onSay }: Props) => {
  const [working, setWorking] = useState<Kind | null>(null)
  const [preview, setPreview] = useState<CalendarImportPreview | null>(null)
  const [failure, setFailure] = useState<Failure | null>(null)
  const buttons = useRef<Partial<Record<Kind, HTMLButtonElement | null>>>({})

  const run = async (kind: Kind) => {
    if (working !== null) return
    setFailure(null)
    if (kind === 'export' && events.length === 0) return onSay(f.nothingToExport)
    setWorking(kind)
    if (kind === 'import') {
      const answer = await ask(engine, () => engine.readCalendarImport(realm.key))
      setWorking(null)
      if (!answer.ok) setFailure({ kind, message: answer.message })
      else if (answer.data !== null) setPreview(answer.data)
    } else {
      const answer = await ask(engine, () => engine.exportCalendar(realm.key, realm.name))
      setWorking(null)
      if (!answer.ok) setFailure({ kind, message: answer.message })
      else if (answer.data !== null) onSay(f.exported(answer.data.events, answer.data.file))
    }
  }
  const focusBack = (kind: Kind) => requestAnimationFrame(() => buttons.current[kind]?.focus())
  const closeFailure = () => {
    const kind = failure?.kind
    setFailure(null)
    if (kind !== undefined) focusBack(kind)
  }

  const controls = (
    <>
      {(['import', 'export'] as const).map(kind => (
        <button key={kind} type="button" class="btn" ref={el => void (buttons.current[kind] = el)} disabled={working !== null} onClick={() => void run(kind)}>
          {kind === 'import' ? f.import : f.export}
        </button>
      ))}
      {working !== null && (
        <p class="hint cal-files-line" role="status">
          <Spinner /> {working === 'import' ? f.reading : f.exporting}
        </p>
      )}
    </>
  )
  const dialog = (
    <>
      {preview !== null && (
        <ImportSheet
          engine={engine}
          realm={realm}
          preview={preview}
          here={here}
          onView={onView}
          onSay={onSay}
          onClose={() => {
            setPreview(null)
            focusBack('import')
          }}
        />
      )}
      {failure !== null && (
        <Dialog title={failure.kind === 'import' ? f.readFailed : f.exportFailed} onCancel={closeFailure} onSubmit={() => void run(failure.kind)}>
          <p class="form-line" role="alert">
            {failure.message}
          </p>
          <div class="sheet-actions">
            <button type="button" class="btn" onClick={closeFailure}>
              {f.close}
            </button>
            <button type="submit" class="btn primary">
              {t.failed.tryAgain}
            </button>
          </div>
        </Dialog>
      )}
    </>
  )

  return { controls, dialog }
}
