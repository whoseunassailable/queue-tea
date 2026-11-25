import type { Host } from '../../../../../hooks/core/host/host'
import { CALENDAR_FILE, CALENDAR_LIMITS } from '../../../../shared/calendar'
import type { CalendarView } from '../../../../shared/calendar'
import type { Reply } from '../../../../shared/engine_api'
import { NOTES_FOLDER } from '../../../../shared/notes'
import { projectsFolder } from '../../../core/constants'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import { calendarText, emptyCalendar, eventInputOf, isEventId, parseCalendar, withEvent, withoutEvent } from '../domain/calendar_file'
import type { CalendarFile } from '../domain/calendar_file'

export type CalendarDeps = { host: Host; home: string; log: Logger; newId: () => string }

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
        if (!isEventId(id) || !file.events.some(e => e.id === id)) throw new Refusal(MESSAGES.eventGone)

        return withEvent(file, { id, ...event })
      }),

    removeCalendarEvent: (key: unknown, id: unknown): Promise<Reply<CalendarView>> =>
      change(MESSAGES.removeCalendarEvent, key, file => {
        if (!isEventId(id) || !file.events.some(e => e.id === id)) throw new Refusal(MESSAGES.eventGone)

        return withoutEvent(file, id)
      }),
  }
}

export type CalendarApi = ReturnType<typeof calendarApi>
