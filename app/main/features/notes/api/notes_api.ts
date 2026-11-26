import { createHash } from 'node:crypto'

import { fileTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/file_task'
import { isoLocal } from '../../../../../hooks/shared/time/domain/services/time'
import type { ParentPick } from '../../../../../types'
import type { Reply } from '../../../../shared/engine_api'
import { attendeesOf, cleanAttendee, MEETING_LIMITS, meetingLinkOf, meetingTimeOf, NO_MEETING } from '../../../../shared/meetings'
import type { Meeting } from '../../../../shared/meetings'
import { cleanTag, firstParagraphOf, freeTitle, INBOX, isNoteId, isTitleTaken, linksOf, NOTE_FOLDER_BAD, NOTE_HISTORY_FOLDER, NOTE_LIMITS, NOTE_TITLE_BAD, NOTE_VERSION_ID, NOTES_FOLDER, noteTypeOf, renameLinks } from '../../../../shared/notes'
import type { BackupSkip, Note, NoteChange, NoteFiled, NoteQuest, NoteSave, NotesExport, NotesRestore, NotesView, NoteType, NoteVersion, ProposedQuest } from '../../../../shared/notes'
import { projectsFolder } from '../../../core/constants'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import { realmView, scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { newQuestOf, parentOf } from '../../tasks/domain/task_input'
import { noteText, parseNote } from '../domain/note_file'
import type { NoteFile } from '../domain/note_file'
import type { NoteAttachment } from '../../../../shared/note_attachments'
import { BOOKMARK_LIMITS, bookmarkUrlOf } from '../../../../shared/note_bookmarks'
import type { NoteBookmark } from '../../../../shared/note_bookmarks'
import { readPage } from '../data/bookmark_page'
import { BACKUP_FORMAT, BACKUP_MANIFEST, backupEntriesOf, newBackupFolder, readBackupFile, removeBackupFolder, writeBackupFile } from '../data/note_backup'
import { filePathOf, noteFiles } from '../data/note_files'
import { bookmarkOf } from '../domain/bookmark'
import { canvasOf, canvasText, parseCanvas } from '../domain/note_canvas'
import { CANVAS_LIMITS, NOTE_CANVAS } from '../../../../shared/note_canvas'
import type { CanvasSave, CanvasView } from '../../../../shared/note_canvas'
import { versionsToKeep } from '../domain/note_history'

// pickFolder: the system's folder picker, with its button named; null when cancelled.
export type NotesDeps = TasksDeps & { newNoteId: () => string; reveal: (path: string) => void; saveNoteFile?: (name: string, bytes: Uint8Array) => Promise<boolean>; readPage?: (url: string) => Promise<string>; pickFolder?: (button: string) => Promise<string | null> }

const stampOf = (text: string) => createHash('sha1').update(text).digest('hex')
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

// Everything from the window is checked again here: the editor's checks are
// for the person writing, these are for the file.
const folderNameOf = (value: unknown): string => {
  const folder = typeof value === 'string' ? value.trim().replace(/[\r\n]/g, ' ') : ''
  if (folder.length > NOTE_LIMITS.folder) throw new Refusal(MESSAGES.noteFolderLong)
  if (NOTE_FOLDER_BAD.test(folder)) throw new Refusal(MESSAGES.noteFolderBad)

  return folder
}

// A meeting's details, checked as the meeting sheet checks them.
const meetingOf = (value: unknown): Meeting => {
  if (typeof value !== 'object' || value === null) throw new Refusal(MESSAGES.badValue)
  const v = value as Record<string, unknown>
  const given = v.attendees ?? []
  if (!Array.isArray(given) || given.some(name => typeof name !== 'string')) throw new Refusal(MESSAGES.badValue)
  const names = (given as string[]).map(cleanAttendee).filter(name => name !== '')
  if (names.some(name => name.length > MEETING_LIMITS.attendee)) throw new Refusal(MESSAGES.meetingAttendeeLong)
  // Repeats are dropped, so only different names count, as in the sheet.
  if (new Set(names.map(name => name.toLowerCase())).size > MEETING_LIMITS.attendees) throw new Refusal(MESSAGES.meetingTooManyAttendees)
  const link = v.link ?? null
  if (link !== null && meetingLinkOf(link) === null) throw new Refusal(MESSAGES.badMeetingLink)
  const time = (v.time ?? null) as Record<string, unknown> | null
  const when = time === null ? null : meetingTimeOf(time.start, time.end, time.zone)
  if (time !== null && when === null) throw new Refusal(MESSAGES.badMeetingTime)

  return { attendees: attendeesOf(names), link: link === null ? null : meetingLinkOf(link), time: when }
}

// A change from the window. Without a meeting, the file's stays as it is.
type Change = Omit<NoteChange, 'meeting'> & { meeting?: Meeting }

const changeOf = (value: unknown): Change => {
  const v = (value ?? {}) as Record<string, unknown>
  const title = typeof v.title === 'string' ? v.title.trim() : ''
  if (title === '') throw new Refusal(MESSAGES.noteTitleRequired)
  if (title.length > NOTE_LIMITS.title) throw new Refusal(MESSAGES.noteTitleLong)
  if (NOTE_TITLE_BAD.test(title)) throw new Refusal(MESSAGES.noteTitleBad)
  const folder = folderNameOf(v.folder)
  const type = v.type ?? null
  if (type !== null && noteTypeOf(type) !== type) throw new Refusal(MESSAGES.badValue)
  const isPinned = v.isPinned ?? false
  if (typeof isPinned !== 'boolean') throw new Refusal(MESSAGES.badValue)
  if (typeof v.body !== 'string') throw new Refusal(MESSAGES.badValue)
  if (v.body.length > NOTE_LIMITS.body) throw new Refusal(MESSAGES.noteTooLong)
  const given = v.tags ?? []
  if (!Array.isArray(given) || given.some(tag => typeof tag !== 'string')) throw new Refusal(MESSAGES.badValue)
  const tags = [...new Set((given as string[]).map(cleanTag).filter(tag => tag !== ''))]
  if (tags.some(tag => tag.length > NOTE_LIMITS.tag)) throw new Refusal(MESSAGES.noteTagLong)
  if (tags.length > NOTE_LIMITS.tags) throw new Refusal(MESSAGES.noteTooManyTags)

  return { title, folder: folder === '' ? INBOX : folder, type: type as NoteType | null, isPinned, tags, body: v.body, ...(v.meeting === undefined ? {} : { meeting: meetingOf(v.meeting) }) }
}

const proposedOf = (value: unknown): ProposedQuest[] => {
  if (!Array.isArray(value)) throw new Refusal(MESSAGES.badValue)
  if (value.length === 0) throw new Refusal(MESSAGES.noQuestsToFile)
  if (value.length > NOTE_LIMITS.quests) throw new Refusal(MESSAGES.tooManyQuests)

  return value.map((q: Record<string, unknown> | null) => {
    const item = q?.item ?? null
    if (item !== null && (typeof item !== 'string' || item.length > NOTE_LIMITS.item)) throw new Refusal(MESSAGES.badValue)
    // newQuestOf checks the title, priority and difficulty as the quest form does.
    const quest = newQuestOf({ ...q, parent: { kind: 'none' } })

    return { title: quest.title, priority: quest.priority, difficulty: quest.difficulty, item }
  })
}

// A link from a note opens in the browser or mail app, and nothing else does.
const LINK_KINDS = ['http:', 'https:', 'mailto:']
const linkOf = (value: unknown): string => {
  if (typeof value !== 'string' || value.length > 2048) throw new Refusal(MESSAGES.badNoteLink)
  try {
    if (LINK_KINDS.includes(new URL(value).protocol)) return value
  } catch {
    // Not a URL at all: refused below, as any other kind is.
  }
  throw new Refusal(MESSAGES.badNoteLink)
}

type Loaded = { id: string; file: NoteFile; text: string }

// A file too large or not a plain file is refused; anything else just wouldn't read.
const skipOf = (err: unknown): BackupSkip['reason'] => (err instanceof Refusal ? 'size' : 'unreadable')

// A realm's notes keep to a folder of Markdown files outside its repository:
// one there would hold Start until committed, and notes change all the time.
// The folder opens as an Obsidian vault as it is.
export const notesApi = (d: NotesDeps) => {
  const files = noteFiles(d.home)
  const bookmarks = new Map<string, NoteBookmark>()
  const folderOf = (key: string) => `${d.home}/${NOTES_FOLDER}/${key}`
  const pathOf = (key: string, id: string) => `${folderOf(key)}/${id}.md`
  const historyOf = (key: string, id: string) => `${folderOf(key)}/${NOTE_HISTORY_FOLDER}/${id}`
  const nowText = () => isoLocal(d.now(), d.offsetMinutes())

  const realmOf = async (key: unknown): Promise<string> => {
    if (!isProjectKey(key) || !(await d.host.exists(`${projectsFolder(d.home)}/${key}.json`))) throw new Refusal(MESSAGES.unknownProject)

    return key
  }
  const idOf = (id: unknown): string => {
    if (!isNoteId(id)) throw new Refusal(MESSAGES.unknownNote)

    return id
  }

  const readOne = async (key: string, id: string): Promise<Loaded | null> => {
    const path = pathOf(key, id)
    if (!(await d.host.exists(path))) return null
    const text = await d.host.read(path)
    const changed = await d.host.modifiedAt(path)
    d.log.debug(`note read: ${path}`)

    return { id, text, file: parseNote(text, id, isoLocal(changed ?? d.now(), d.offsetMinutes())) }
  }

  const loadAll = async (key: string): Promise<{ loaded: Loaded[]; unreadable: string[] }> => {
    // shortcut: reads every note on each change, which suits a few thousand small notes; index them if realms grow past that.
    const names = (await d.host.list(folderOf(key))).filter(name => name.endsWith('.md') && isNoteId(name.slice(0, -3))).sort()
    const loaded: Loaded[] = []
    const unreadable: string[] = []
    for (const name of names.slice(0, NOTE_LIMITS.notes)) {
      try {
        const one = await readOne(key, name.slice(0, -3))
        if (one !== null) loaded.push(one)
      } catch (err) {
        // One file that won't read doesn't hide the rest; the page names it.
        d.log.error(`reading note ${name} failed`, err)
        unreadable.push(name)
      }
    }

    return { loaded, unreadable }
  }

  const noteOf = ({ id, file, text }: Loaded): Note => ({ id, title: file.title, folder: file.folder, type: file.type, isPinned: file.isPinned, tags: file.tags, created: file.created, updated: file.updated, isArchived: file.isArchived, quests: file.quests, meeting: file.meeting, body: file.body, stamp: stampOf(text) })

  const titlesOf = async (key: string) => (await loadAll(key)).loaded.map(one => ({ id: one.id, title: one.file.title, isArchived: one.file.isArchived }))

  const viewOf = async (key: string): Promise<NotesView> => {
    const { loaded, unreadable } = await loadAll(key)

    return { notes: loaded.map(noteOf).sort((a, b) => b.updated.localeCompare(a.updated)), unreadable, folder: folderOf(key) }
  }

  const history = async (key: string, id: string): Promise<NoteVersion[]> =>
    (await d.host.list(historyOf(key, id)))
      .filter(name => name.endsWith('.md') && NOTE_VERSION_ID.test(name.slice(0, -3)))
      .map(name => ({ id: name.slice(0, -3), savedAt: new Date(Number(NOTE_VERSION_ID.exec(name.slice(0, -3))![1])).toISOString() }))
      .sort((a, b) => b.id.localeCompare(a.id))

  const snapshot = async (key: string, id: string, text: string, isSave = false): Promise<void> => {
    const latest = (await history(key, id))[0]
    const hash = stampOf(text)
    // Before overwriting, also keep an imported or externally edited file.
    if (!isSave && latest?.id.endsWith(hash) && await d.host.read(`${historyOf(key, id)}/${latest.id}.md`) === text) return
    const at = Math.max(d.now(), latest === undefined ? 0 : Number(NOTE_VERSION_ID.exec(latest.id)![1]) + 1)
    const version = `v-${String(at).padStart(13, '0')}-${hash}`
    const path = `${historyOf(key, id)}/${version}.md`
    const made = await d.host.makeDirs(historyOf(key, id))
    if (made.exitCode !== 0) throw new Error(made.stderr)
    await d.host.write(`${path}.tmp`, text)
    const moved = await d.host.move(`${path}.tmp`, path)
    if (moved.exitCode !== 0) throw new Error(moved.stderr)
    d.log.debug(`note version kept: ${path}`)
  }

  const readVersion = async (key: string, id: string, version: unknown): Promise<Loaded> => {
    if (typeof version !== 'string' || !NOTE_VERSION_ID.test(version)) throw new Refusal(MESSAGES.unknownNoteVersion)
    const path = `${historyOf(key, id)}/${version}.md`
    if (!(await d.host.exists(path))) throw new Refusal(MESSAGES.unknownNoteVersion)
    const text = await d.host.read(path)
    if (!version.endsWith(stampOf(text))) throw new Refusal(MESSAGES.unknownNoteVersion)
    d.log.debug(`note version read: ${path}`)

    return { id, text, file: parseNote(text, id, new Date(Number(NOTE_VERSION_ID.exec(version)![1])).toISOString()) }
  }

  const remove = async (path: string) => {
    const gone = await d.host.remove(path)
    if (gone.exitCode !== 0) throw new Error(gone.stderr)
  }

  // Snapshots are durable before the new text replaces the live file. A failed
  // snapshot/write never leaves half a note. Legacy backups join the history.
  const write = async (key: string, id: string, file: NoteFile): Promise<Loaded> => {
    const made = await d.host.makeDirs(folderOf(key))
    if (made.exitCode !== 0) throw new Error(made.stderr)
    const path = pathOf(key, id)
    const text = noteText(file)
    await d.host.write(`${path}.tmp`, text)
    if (await d.host.exists(`${path}.bak`)) {
      if ((await history(key, id)).length === 0) await snapshot(key, id, await d.host.read(`${path}.bak`))
    }
    if (await d.host.exists(path)) await snapshot(key, id, await d.host.read(path))
    await snapshot(key, id, text, true)
    const moved = await d.host.move(`${path}.tmp`, path)
    if (moved.exitCode !== 0) throw new Error(moved.stderr)
    await remove(`${path}.bak`)
    const versions = await history(key, id)
    const keep = new Set(versionsToKeep(versions).map(version => version.id))
    for (const version of versions) if (!keep.has(version.id)) await remove(`${historyOf(key, id)}/${version.id}.md`)
    d.log.debug(`note written: ${path}`)

    return { id, file, text }
  }

  const known = async (key: string, id: string): Promise<Loaded> => {
    const one = await readOne(key, id)
    if (one === null) throw new Refusal(MESSAGES.noteGone)

    return one
  }

  // One change at a time, so two quick saves can't lose each other.
  let queue: Promise<unknown> = Promise.resolve()
  const inTurn = <T>(failure: string, work: () => Promise<T>): Promise<Reply<T>> => {
    const run = queue.then(() => reply(d.log, failure, work))
    queue = run

    return run
  }

  // Renaming a note rewrites [[Old]] in the realm's other notes, unless
  // another note has the old title too and the links could mean that one.
  // How many notes it rewrote, for the save line.
  const relink = async (key: string, id: string, from: string, to: string): Promise<number> => {
    const { loaded } = await loadAll(key)
    const others = loaded.filter(one => one.id !== id)
    if (others.some(one => same(one.file.title, from))) return 0
    const linking = others.filter(one => linksOf(one.file.body).some(title => same(title, from)))
    for (const one of linking) await write(key, one.id, { ...one.file, body: renameLinks(one.file.body, from, to) })

    return linking.length
  }

  // The picker waits on the person, so it runs before the work joins the
  // save queue: an open note keeps saving while it is up.
  const picked = (key: unknown, failure: string, button: string, check: (realm: string) => Promise<void> = async () => {}) =>
    reply(d.log, failure, async () => {
      const realm = await realmOf(key)
      await check(realm)
      if (d.pickFolder === undefined) throw new Error('pickFolder is unavailable')
      const folder = await d.pickFolder(button)

      return folder === null ? null : { realm, folder }
    })

  const canvasPathOf = (key: string) => `${folderOf(key)}/${NOTE_CANVAS}`
  // The board as its file holds it, or an empty one before the first save. A
  // file that isn't a canvas is refused and never written over.
  const canvasViewOf = async (key: string): Promise<CanvasView> => {
    const path = canvasPathOf(key)
    if (!(await d.host.exists(path))) return { canvas: { nodes: [], edges: [] }, stamp: null }
    const text = await d.host.read(path)
    d.log.debug(`canvas read: ${path}`)
    const canvas = text.length > CANVAS_LIMITS.bytes ? null : parseCanvas(text)
    if (canvas === null) throw new Refusal(MESSAGES.badCanvasFile)

    return { canvas, stamp: stampOf(text) }
  }

  const newId = async (key: string): Promise<string> => {
    for (let tries = 0; tries < 5; tries += 1) {
      const id = d.newNoteId()
      if (!(await d.host.exists(pathOf(key, id)))) return id
    }
    throw new Error('no free note id after 5 tries')
  }

  return {
    // No note id: a file for a quest's description, kept in the same vault.
    attachNoteFile: (key: unknown, id: unknown, file: unknown): Promise<Reply<NoteAttachment>> =>
      inTurn(id === null ? MESSAGES.attachQuestFile : MESSAGES.attachNoteFile, async () => {
        const realm = await realmOf(key)
        if (id !== null && (await known(realm, idOf(id))).file.isArchived) throw new Refusal(MESSAGES.archivedNoteFile)

        return files.import(realm, file)
      }),

    readNoteFile: (key: unknown, href: unknown): Promise<Reply<NoteAttachment>> =>
      reply(d.log, MESSAGES.readNoteFile, async () => {
        const realm = await realmOf(key)
        const path = filePathOf(href)
        const file = await files.read(realm, path)

        return { path, kind: file.kind }
      }),

    // Only main's private protocol uses the bytes; the window gets metadata.
    serveNoteFile: (key: unknown, href: unknown) => reply(d.log, MESSAGES.readNoteFile, async () => files.read(await realmOf(key), filePathOf(href))),

    downloadNoteFile: (key: unknown, href: unknown): Promise<Reply<boolean>> =>
      reply(d.log, MESSAGES.downloadNoteFile, async () => {
        const realm = await realmOf(key)
        const path = filePathOf(href)
        const file = await files.read(realm, path)
        if (d.saveNoteFile === undefined) throw new Error('saveNoteFile is unavailable')

        return d.saveNoteFile(path.split('/').at(-1)!, file.bytes)
      }),

    readNotes: (key: unknown): Promise<Reply<NotesView>> => reply(d.log, MESSAGES.readNotes, async () => viewOf(await realmOf(key))),

    readNoteHistory: (key: unknown, id: unknown): Promise<Reply<NoteVersion[]>> =>
      inTurn(MESSAGES.readNoteHistory, async () => {
        const realm = await realmOf(key)
        const one = await known(realm, idOf(id))

        return history(realm, one.id)
      }),

    readNoteVersion: (key: unknown, id: unknown, version: unknown): Promise<Reply<Note>> =>
      inTurn(MESSAGES.readNoteHistory, async () => {
        const realm = await realmOf(key)
        const one = await known(realm, idOf(id))

        return noteOf(await readVersion(realm, one.id, version))
      }),

    restoreNoteVersion: (key: unknown, id: unknown, version: unknown, stamp: unknown): Promise<Reply<NoteSave>> =>
      inTurn(MESSAGES.restoreNoteVersion, async (): Promise<NoteSave> => {
        const realm = await realmOf(key)
        const noteId = idOf(id)
        const previous = await readVersion(realm, noteId, version)
        const now = await readOne(realm, noteId)
        if (now === null) return { kind: 'changed', note: null }
        if (stampOf(now.text) !== stamp) return { kind: 'changed', note: noteOf(now) }
        const next = changeOf({ ...previous.file, type: now.file.type, isPinned: now.file.isPinned })
        const title = now.file.isArchived ? next.title : freeTitle(await titlesOf(realm), next.title, noteId)
        // Filing quests, archiving, typing and pinning are separate actions.
        // Restore the text while retaining the current note metadata.
        const saved = await write(realm, noteId, { ...now.file, ...next, title, updated: nowText() })
        const relinked = same(now.file.title, title) ? 0 : await relink(realm, noteId, now.file.title, title)

        return { kind: 'saved', view: await viewOf(realm), note: noteOf(saved), relinked }
      }),

    openLink: (url: unknown): Promise<Reply<null>> =>
      reply(d.log, MESSAGES.openLink, async () => {
        const opened = await d.host.open(linkOf(url))
        if (opened.exitCode !== 0) throw new Error(opened.stderr)

        return null
      }),

    // A preview read once stays for the session, so turning to Read doesn't
    // fetch every page again. A failed read isn't kept, so Try again reads anew.
    readBookmark: (url: unknown): Promise<Reply<NoteBookmark>> =>
      reply(d.log, MESSAGES.readBookmark, async () => {
        const link = typeof url === 'string' ? bookmarkUrlOf(url) : null
        if (link === null) throw new Refusal(MESSAGES.badBookmark)
        const known = bookmarks.get(link)
        if (known !== undefined) return known
        const bookmark = bookmarkOf(link, await (d.readPage ?? readPage)(link))
        if (bookmarks.size >= BOOKMARK_LIMITS.cache) bookmarks.delete(bookmarks.keys().next().value!)
        bookmarks.set(link, bookmark)

        return bookmark
      }),

    readCanvas: (key: unknown): Promise<Reply<CanvasView>> => reply(d.log, MESSAGES.readCanvas, async () => canvasViewOf(await realmOf(key))),

    // stamp is the file as the board read it, null when there was none. When
    // the file on disk isn't that one any more, nothing is written and the
    // board gets the file as it is now, to ask which to keep.
    saveCanvas: (key: unknown, canvas: unknown, stamp: unknown): Promise<Reply<CanvasSave>> =>
      inTurn(MESSAGES.saveCanvas, async (): Promise<CanvasSave> => {
        const realm = await realmOf(key)
        const counts = (canvas ?? {}) as { nodes?: unknown; edges?: unknown }
        if ((Array.isArray(counts.nodes) && counts.nodes.length > CANVAS_LIMITS.nodes) || (Array.isArray(counts.edges) && counts.edges.length > CANVAS_LIMITS.edges)) throw new Refusal(MESSAGES.canvasTooBig)
        const next = canvasOf(canvas)
        if (next === null || (stamp !== null && typeof stamp !== 'string')) throw new Refusal(MESSAGES.badValue)
        const text = canvasText(next)
        if (text.length > CANVAS_LIMITS.bytes) throw new Refusal(MESSAGES.canvasTooBig)
        const path = canvasPathOf(realm)
        const now = (await d.host.exists(path)) ? stampOf(await d.host.read(path)) : null
        if (now !== stamp) return { kind: 'changed', view: await canvasViewOf(realm) }
        const made = await d.host.makeDirs(folderOf(realm))
        if (made.exitCode !== 0) throw new Error(made.stderr)
        await d.host.write(`${path}.tmp`, text)
        const moved = await d.host.move(`${path}.tmp`, path)
        if (moved.exitCode !== 0) throw new Error(moved.stderr)
        d.log.debug(`canvas written: ${path}`)

        return { kind: 'saved', stamp: stampOf(text) }
      }),

    // Shows the realm's notes folder in Finder, made first if it isn't there yet.
    showNotes: (key: unknown): Promise<Reply<null>> =>
      reply(d.log, MESSAGES.showRecord, async () => {
        const realm = await realmOf(key)
        const made = await d.host.makeDirs(folderOf(realm))
        if (made.exitCode !== 0) throw new Error(made.stderr)
        d.reveal(folderOf(realm))

        return null
      }),

    // A new folder holding the realm's notes byte for byte and the files they
    // can link, as an Obsidian vault does; history stays behind. Unreadable
    // files are left out and named. null: the picker was cancelled.
    exportNotes: async (key: unknown): Promise<Reply<NotesExport | null>> => {
      const asked = await picked(key, MESSAGES.exportNotes, MESSAGES.exportButton, async realm => {
        if (!(await d.host.exists(folderOf(realm))) || (await backupEntriesOf(folderOf(realm))).notes.length === 0) throw new Refusal(MESSAGES.nothingToExport)
      })
      if (!asked.ok || asked.data === null) return asked as Reply<null>
      const { realm, folder: parent } = asked.data

      return inTurn(MESSAGES.exportNotes, async () => {
        const vault = folderOf(realm)
        const entries = await backupEntriesOf(vault)
        const folder = await newBackupFolder(parent, `Notes backup ${realm} ${nowText().slice(0, 10)}`)
        const copied = { notes: 0, files: 0 }
        const skipped: BackupSkip[] = []
        try {
          for (const [kind, paths] of [['notes', entries.notes], ['files', entries.files]] as const) {
            for (const path of paths) {
              let bytes: Buffer
              try {
                bytes = await readBackupFile(vault, path)
              } catch (err) {
                // One file that won't read doesn't stop the backup; the result names it.
                d.log.error(`exporting ${path} failed`, err)
                skipped.push({ path, reason: skipOf(err) })
                continue
              }
              await writeBackupFile(folder, path, bytes)
              copied[kind] += 1
            }
          }
          // Written last: a folder cut short never reads as a backup.
          await writeBackupFile(folder, BACKUP_MANIFEST, `${JSON.stringify({ format: BACKUP_FORMAT, realm, exported: nowText(), ...copied }, null, 2)}\n`)
        } catch (err) {
          await removeBackupFolder(folder).catch(gone => d.log.error(`removing the unfinished backup ${folder} failed`, gone))
          throw err
        }
        d.log.debug(`notes exported: ${folder}`)

        return { folder: folder.split('/').at(-1)!, ...copied, skipped }
      })
    },

    // Never replaces anything, so running it twice changes nothing more. A
    // note is matched by id: a missing one comes back as it was saved; one
    // that differs stays, and the backup's text joins its History. A file is
    // matched by name. A backup file that is unreadable, too large, damaged
    // or named like a different file here is left out and named.
    restoreNotes: async (key: unknown): Promise<Reply<NotesRestore | null>> => {
      const asked = await picked(key, MESSAGES.restoreNotes, MESSAGES.restoreButton)
      if (!asked.ok || asked.data === null) return asked as Reply<null>
      const { realm, folder: backup } = asked.data

      return inTurn(MESSAGES.restoreNotes, async (): Promise<NotesRestore> => {
        let format: unknown
        try {
          format = (JSON.parse((await readBackupFile(backup, BACKUP_MANIFEST)).toString('utf8')) as { format?: unknown } | null)?.format
        } catch (err) {
          // No manifest, or one that isn't JSON: refused below as not a backup.
          d.log.debug(`no notes backup manifest in ${backup}: ${String(err)}`)
        }
        if (typeof format === 'number' && format > BACKUP_FORMAT) throw new Refusal(MESSAGES.backupTooNew)
        if (format !== BACKUP_FORMAT) throw new Refusal(MESSAGES.notABackup)
        const entries = await backupEntriesOf(backup)
        if (entries.notes.length > NOTE_LIMITS.notes) throw new Refusal(MESSAGES.backupTooBig)
        const done = { added: 0, renamed: 0, same: 0, toHistory: 0, files: 0 }
        const skipped: BackupSkip[] = []
        // A backup file that won't read is left out; a failure writing here stops the restore.
        const fromBackup = async (path: string): Promise<Buffer | null> => {
          try {
            return await readBackupFile(backup, path)
          } catch (err) {
            d.log.error(`reading ${path} from the backup failed`, err)
            skipped.push({ path, reason: skipOf(err) })

            return null
          }
        }
        // A file here by that name that won't read (too large, say) is a different file too.
        const place = (path: string, bytes: Buffer) => files.publish(realm, path, bytes).catch(err => (err instanceof Refusal ? ('different' as const) : Promise.reject(err)))
        // Files first, so a note's pictures are there when it is.
        for (const path of entries.files) {
          const bytes = await fromBackup(path)
          if (bytes === null) continue
          const hash = /^attachments\/([0-9a-f]{64})\./.exec(path)?.[1]
          if (hash !== undefined && createHash('sha256').update(bytes).digest('hex') !== hash) skipped.push({ path, reason: 'damaged' })
          else {
            const placed = await place(path, bytes)
            if (placed === 'different') skipped.push({ path, reason: 'taken' })
            else if (placed === 'added') done.files += 1
          }
        }
        const titles = await titlesOf(realm)
        for (const name of entries.notes) {
          const bytes = await fromBackup(name)
          if (bytes === null) continue
          const id = name.slice(0, -3)
          const text = bytes.toString('utf8')
          const file = parseNote(text, id, nowText())
          const now = await readOne(realm, id)
          if (file.body.length > NOTE_LIMITS.body) skipped.push({ path: name, reason: 'size' })
          else if (now === null) {
            // A live title taken since the backup gets the next number, as
            // archive's restore does. The backup's own text goes into History
            // first, so the next restore finds it there and adds nothing.
            const title = file.isArchived ? file.title : freeTitle(titles, file.title)
            if (title !== file.title) {
              await snapshot(realm, id, text)
              await write(realm, id, { ...file, title })
              done.renamed += 1
            } else if ((await place(name, bytes)) === 'different') {
              skipped.push({ path: name, reason: 'taken' })
              continue
            }
            titles.push({ id, title, isArchived: file.isArchived })
            done.added += 1
          } else if (now.text === text || (await history(realm, id)).some(version => version.id.endsWith(`-${stampOf(text)}`))) done.same += 1
          else {
            await snapshot(realm, id, text)
            done.toHistory += 1
          }
        }
        d.log.debug(`notes restored from ${backup}: ${JSON.stringify(done)}, skipped ${skipped.length}`)

        return { view: await viewOf(realm), ...done, skipped }
      })
    },

    createNote: (key: unknown, input: unknown): Promise<Reply<{ view: NotesView; id: string }>> =>
      inTurn(MESSAGES.saveNote, async () => {
        const realm = await realmOf(key)
        const note = changeOf({ ...(input as object), tags: [] })
        const now = nowText()
        const id = await newId(realm)
        // A taken title gets the next number, so a link still means one note.
        const title = freeTitle(await titlesOf(realm), note.title)
        await write(realm, id, { ...note, meeting: note.meeting ?? NO_MEETING, title, created: now, updated: now, isArchived: false, quests: [], aliases: [], rest: [] })

        return { view: await viewOf(realm), id }
      }),

    // stamp is the file as the editor read it. When the file on disk isn't
    // that one any more, nothing is written and the window asks what to keep.
    saveNote: (key: unknown, id: unknown, change: unknown, stamp: unknown): Promise<Reply<NoteSave>> =>
      inTurn(MESSAGES.saveNote, async (): Promise<NoteSave> => {
        const realm = await realmOf(key)
        const noteId = idOf(id)
        const next = changeOf(change)
        const now = await readOne(realm, noteId)
        if (now === null) return { kind: 'changed', note: null }
        if (stampOf(now.text) !== stamp) return { kind: 'changed', note: noteOf(now) }
        if (!same(now.file.title, next.title) && isTitleTaken(await titlesOf(realm), next.title, noteId)) throw new Refusal(MESSAGES.noteTitleTaken(next.title))
        const saved = await write(realm, noteId, { ...now.file, ...next, updated: nowText() })
        const relinked = same(now.file.title, next.title) ? 0 : await relink(realm, noteId, now.file.title, next.title)

        return { kind: 'saved', view: await viewOf(realm), note: noteOf(saved), relinked }
      }),

    archiveNote: (key: unknown, id: unknown, isArchived: unknown): Promise<Reply<NotesView>> =>
      inTurn(MESSAGES.saveNote, async () => {
        const realm = await realmOf(key)
        if (typeof isArchived !== 'boolean') throw new Refusal(MESSAGES.badValue)
        const one = await known(realm, idOf(id))
        // A note restored while another has its title comes back numbered.
        const title = isArchived ? one.file.title : freeTitle(await titlesOf(realm), one.file.title, one.id)
        await write(realm, one.id, { ...one.file, title, isArchived })

        return viewOf(realm)
      }),

    // Moves every note in a folder, archived ones too, to another; onto one
    // that's there already, the two become one. Links name a note by title and
    // the files stay where they are, so every link still works.
    renameFolder: (key: unknown, from: unknown, to: unknown): Promise<Reply<NotesView>> =>
      inTurn(MESSAGES.renameFolder, async () => {
        const realm = await realmOf(key)
        // Inbox keeps its name: new notes land there.
        if (typeof from !== 'string' || from === '' || from === INBOX) throw new Refusal(MESSAGES.badValue)
        const name = folderNameOf(to)
        if (name === '') throw new Refusal(MESSAGES.noteFolderRequired)
        for (const one of (await loadAll(realm)).loaded.filter(one => one.file.folder === from)) await write(realm, one.id, { ...one.file, folder: name })
        d.log.debug(`notes folder renamed: ${from} → ${name}`)

        return viewOf(realm)
      }),

    deleteNote: (key: unknown, id: unknown): Promise<Reply<NotesView>> =>
      inTurn(MESSAGES.saveNote, async () => {
        const realm = await realmOf(key)
        const one = await known(realm, idOf(id))
        if (!one.file.isArchived) throw new Refusal(MESSAGES.deleteNotArchived)
        const versions = historyOf(realm, one.id)
        for (const name of await d.host.list(versions)) await remove(`${versions}/${name}`)
        if (await d.host.exists(versions)) {
          const gone = await d.host.removeDir(versions)
          if (gone.exitCode !== 0) throw new Error(gone.stderr)
        }
        for (const path of [pathOf(realm, one.id), `${pathOf(realm, one.id)}.bak`, `${pathOf(realm, one.id)}.tmp`]) await remove(path)
        d.log.debug(`note deleted: ${pathOf(realm, one.id)}`)

        return viewOf(realm)
      }),

    // Files the quests one by one into the realm's queue, and links each to
    // the note as soon as it is in. A line the note already lists is skipped,
    // so Try again after a failure part way never files a line twice.
    fileNoteQuests: (key: unknown, id: unknown, proposal: unknown): Promise<Reply<NoteFiled>> =>
      inTurn(MESSAGES.fileNoteQuests, async () => {
        const realm = await realmOf(key)
        let note = await known(realm, idOf(id))
        const p = (proposal ?? {}) as { parent?: unknown; quests?: unknown }
        const asked = proposedOf(p.quests)
        let parent: ParentPick = parentOf(p.parent)
        const scope = await scopeOf(d, realm)
        const isOpen = (questId: string) => scope.record.tasks.some(task => task.id === questId && (task.state === 'queued' || task.state === 'current'))
        // A parent already filed from this note, and still open, takes the new lines.
        const own = note.file.quests.find(q => q.item === null && isOpen(q.id))
        if (parent.kind === 'new' && own !== undefined) parent = { kind: 'task', id: own.id }
        const filedItems = new Set(note.file.quests.map(q => q.item))
        const quests = asked.filter(quest => !filedItems.has(quest.item))
        const from = `From the note "${note.file.title}" in Notes.`
        let record = scope.record
        for (const quest of quests) {
          const about = quest.item === null ? firstParagraphOf(note.file.body) : null
          const filed = await fileTaskUseCase(scope.deps, scope.ctx, { title: quest.title, priority: quest.priority, difficulty: quest.difficulty, parent, description: about === null ? from : `${from}\n\n${about}`, criteria: [], text: quest.title, intent: 'improving' })
          if (filed.kind === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
          if (filed.kind === 'refused') throw new Refusal(inGameWords(filed.notice))
          const linked: NoteQuest[] = [{ id: filed.task.id, item: quest.item }]
          if (parent.kind === 'new' && filed.parent !== null) {
            linked.unshift({ id: filed.parent.id, item: null })
            parent = { kind: 'task', id: filed.parent.id }
          }
          note = await write(realm, note.id, { ...note.file, quests: [...note.file.quests, ...linked] })
          record = filed.record
        }

        return { view: await viewOf(realm), project: await realmView(d, realm, record) }
      }),
  }
}

export type NotesApi = ReturnType<typeof notesApi>
