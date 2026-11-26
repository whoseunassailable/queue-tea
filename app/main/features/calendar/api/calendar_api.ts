import type { Host } from '../../../../../hooks/core/host/host'
import { CALENDAR_FILE, CALENDAR_LIMITS, ICS_LIMITS, SOURCE_LIMITS } from '../../../../shared/calendar'
import type { CalendarExport, CalendarImport, CalendarImportPreview, CalendarView, ImportItem } from '../../../../shared/calendar'
import type { Reply } from '../../../../shared/engine_api'
import { NOTES_FOLDER } from '../../../../shared/notes'
import { projectsFolder } from '../../../core/constants'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import { calendarText, emptyCalendar, eventInputOf, importStatusOf, isEventId, parseCalendar, sourceOf, withEvent, withImported, withoutEvent } from '../domain/calendar_file'
import type { CalendarFile } from '../domain/calendar_file'
import { icsOf } from '../domain/ics_export'
import { readIcs } from '../domain/ics_import'

// The dialogs are the Mac's: pickIcsFile asks for a file to import and
// chooseIcsSave where to put an export, each null when Rohan cancels. zone is
// the Mac's time zone, for times a file gives without one.
export type CalendarDeps = {
  host: Host
  home: string
  log: Logger
  newId: () => string
  now: () => number
  zone: () => string
  pickIcsFile: () => Promise<string | null>
  sizeOf: (path: string) => Promise<number>
  chooseIcsSave: (name: string) => Promise<string | null>
}

const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path

// A realm's name as a file name: no slashes, colons or controls, and short.
export const icsNameOf = (name: unknown): string => {
  const plain = typeof name === 'string' ? name.replace(/[\u0000-\u001f\u007f/\\:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/^\.+/, '') : ''
  const short = plain.slice(0, ICS_LIMITS.fileName).trim()

  return short === '' ? 'Calendar' : short
}

// Events back from the window, checked again as they would be from a file.
const importItemsOf = (value: unknown): ImportItem[] => {
  if (!Array.isArray(value) || value.length > CALENDAR_LIMITS.events) throw new Refusal(MESSAGES.badValue)

  return value.map(item => {
    const v = (item ?? {}) as Record<string, unknown>

    return { event: eventInputOf(v.event), source: sourceOf(v.source) }
  })
}

const viewOf = (file: CalendarFile): CalendarView => ({ events: file.events, unreadable: file.kept.length })

// A realm's calendar lives in its notes folder, beside Canvas.canvas, so the
// notes' export and restore carry it too.
export const calendarApi = (d: CalendarDeps) => {
  const folderOf = (key: string) => `${d.home}/${NOTES_FOLDER}/${key}`
  const pathOf = (key: string) => `${folderOf(key)}/${CALENDAR_FILE}`

  const realmOf = async (key: unknown): Promise<string> => {
    if (!isProjectKey(key) || !(await d.host.exists(`${projectsFolder(d.home)}/${key}.json`))) throw new Refusal(MESSAGES.unknownProject)

    return key
  }

  // Nothing to read before the first event. A file that doesn't read is
  // refused and never written over: it holds Rohan's plans.
  const load = async (key: string): Promise<CalendarFile> => {
    const path = pathOf(key)
    if (!(await d.host.exists(path))) return emptyCalendar()
    const text = await d.host.read(path)
    d.log.debug(`calendar read: ${path}`)
    const file = text.length > CALENDAR_LIMITS.bytes ? 'unreadable' : parseCalendar(text)
    if (file === 'unreadable') throw new Refusal(MESSAGES.badCalendarFile(path))
    if (file === 'newer') throw new Refusal(MESSAGES.newerCalendar(path))

    return file
  }

  const save = async (key: string, file: CalendarFile): Promise<void> => {
    const path = pathOf(key)
    const text = calendarText(file)
    if (text.length > CALENDAR_LIMITS.bytes) throw new Refusal(MESSAGES.tooManyEvents)
    const made = await d.host.makeDirs(folderOf(key))
    if (made.exitCode !== 0) throw new Error(made.stderr)
    await d.host.write(`${path}.tmp`, text)
    if (await d.host.exists(path)) await d.host.write(`${path}.bak`, await d.host.read(path))
    const moved = await d.host.move(`${path}.tmp`, path)
    if (moved.exitCode !== 0) throw new Error(moved.stderr)
    d.log.debug(`calendar written: ${path}`)
  }

  // One change at a time, so two quick saves can't lose each other.
  let queue: Promise<unknown> = Promise.resolve()
  const change = (failure: string, key: unknown, work: (file: CalendarFile) => CalendarFile): Promise<Reply<CalendarView>> => {
    const run = queue.then(() =>
      reply(d.log, failure, async () => {
        const realm = await realmOf(key)
        const next = work(await load(realm))
        await save(realm, next)

        return viewOf(next)
      }),
    )
    queue = run

    return run
  }

  const newIdIn = (file: CalendarFile): string => {
    for (let tries = 0; tries < 5; tries += 1) {
      const id = d.newId()
      if (!file.events.some(e => e.id === id)) return id
    }
    throw new Error('no free event id')
  }

  return {
    readCalendar: (key: unknown): Promise<Reply<CalendarView>> => reply(d.log, MESSAGES.readCalendar, async () => viewOf(await load(await realmOf(key)))),

    // id null adds an event; an id changes that one, which must still be there.
    saveCalendarEvent: (key: unknown, id: unknown, input: unknown): Promise<Reply<CalendarView>> =>
      change(MESSAGES.saveCalendarEvent, key, file => {
        const event = eventInputOf(input)
        if (id === null) {
          if (file.events.length >= CALENDAR_LIMITS.events) throw new Refusal(MESSAGES.tooManyEvents)

          return withEvent(file, { id: newIdIn(file), ...event })
        }
        const before = isEventId(id) ? file.events.find(e => e.id === id) : undefined
        if (before === undefined) throw new Refusal(MESSAGES.eventGone)

        // An imported event keeps where it came from, so importing the file
        // again still finds it.
        return withEvent(file, before.source === undefined ? { id: before.id, ...event } : { id: before.id, ...event, source: before.source })
      }),

    removeCalendarEvent: (key: unknown, id: unknown): Promise<Reply<CalendarView>> =>
      change(MESSAGES.removeCalendarEvent, key, file => {
        if (!isEventId(id) || !file.events.some(e => e.id === id)) throw new Refusal(MESSAGES.eventGone)

        return withoutEvent(file, id)
      }),

    // An .ics file Rohan picks, read and held against the calendar: what
    // would come in new, change or stay, and what can't come in and why.
    // Nothing changes until importCalendarEvents. null when he cancels.
    readCalendarImport: (key: unknown): Promise<Reply<CalendarImportPreview | null>> =>
      reply(d.log, MESSAGES.readCalendarImport, async () => {
        const realm = await realmOf(key)
        const path = await d.pickIcsFile()
        if (path === null) return null
        const name = baseName(path).slice(0, SOURCE_LIMITS.file)
        if ((await d.sizeOf(path)) > ICS_LIMITS.bytes) throw new Refusal(MESSAGES.icsTooBig(name))
        const read = readIcs(await d.host.read(path), { file: name, here: d.zone(), now: d.now(), untitled: MESSAGES.untitledEvent })
        if (read === null) throw new Refusal(MESSAGES.notCalendarFile(name))
        d.log.debug(`calendar import read: ${path}, ${read.items.length} events, ${read.skipped.length} skipped`)
        const file = await load(realm)
        const items = read.items.map(item => ({ ...item, status: importStatusOf(file, item) }))
        if (file.events.length + items.filter(item => item.status === 'new').length > CALENDAR_LIMITS.events) throw new Refusal(MESSAGES.importTooMany)

        return { file: name, calendar: read.calendar, app: read.app, items, skipped: read.skipped }
      }),

    // The events Rohan chose from a preview, joined in one save: new ones
    // added, ones imported before updated in place, the same left alone.
    importCalendarEvents: async (key: unknown, items: unknown): Promise<Reply<CalendarImport>> => {
      let counts = { added: 0, updated: 0, same: 0 }
      const done = await change(MESSAGES.importCalendar, key, file => {
        const joined = withImported(file, importItemsOf(items), newIdIn)
        if (joined.file.events.length > CALENDAR_LIMITS.events) throw new Refusal(MESSAGES.importTooMany)
        counts = { added: joined.added, updated: joined.updated, same: joined.same }

        return joined.file
      })

      return done.ok ? { ok: true, data: { view: done.data, ...counts } } : done
    },

    // The realm's own events as an .ics file where Rohan chooses. Due dates
    // and meeting notes stay out: they live with their quests and notes.
    exportCalendar: (key: unknown, name: unknown): Promise<Reply<CalendarExport | null>> =>
      reply(d.log, MESSAGES.exportCalendar, async () => {
        const realm = await realmOf(key)
        const file = await load(realm)
        if (file.events.length === 0) throw new Refusal(MESSAGES.nothingToExportCalendar)
        const title = icsNameOf(name)
        const text = icsOf(file.events, { calendar: title, here: d.zone(), now: d.now() })
        const path = await d.chooseIcsSave(`${title}.ics`)
        if (path === null) return null
        await d.host.write(path, text)
        d.log.debug(`calendar exported: ${path}, ${file.events.length} events`)

        return { file: baseName(path), events: file.events.length }
      }),
  }
}

export type CalendarApi = ReturnType<typeof calendarApi>
