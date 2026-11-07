import { createHash } from 'node:crypto'

import { fileTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/file_task'
import { isoLocal } from '../../../../../hooks/shared/time/domain/services/time'
import type { ParentPick } from '../../../../../types'
import type { Reply } from '../../../../shared/engine_api'
import { cleanTag, firstParagraphOf, freeTitle, INBOX, isNoteId, isTitleTaken, linksOf, NOTE_FOLDER_BAD, NOTE_HISTORY_FOLDER, NOTE_LIMITS, NOTE_TITLE_BAD, NOTE_VERSION_ID, NOTES_FOLDER, renameLinks } from '../../../../shared/notes'
import type { Note, NoteChange, NoteFiled, NoteQuest, NoteSave, NotesView, NoteVersion, ProposedQuest } from '../../../../shared/notes'
import { projectsFolder } from '../../../core/constants'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import { realmView, scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { newQuestOf, parentOf } from '../../tasks/domain/task_input'
import { noteText, parseNote } from '../domain/note_file'
import type { NoteFile } from '../domain/note_file'
import { versionsToKeep } from '../domain/note_history'

export type NotesDeps = TasksDeps & { newNoteId: () => string; reveal: (path: string) => void }

const stampOf = (text: string) => createHash('sha1').update(text).digest('hex')
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

// Everything from the window is checked again here: the editor's checks are
// for the person writing, these are for the file.
const changeOf = (value: unknown): NoteChange => {
  const v = (value ?? {}) as Record<string, unknown>
  const title = typeof v.title === 'string' ? v.title.trim() : ''
  if (title === '') throw new Refusal(MESSAGES.noteTitleRequired)
  if (title.length > NOTE_LIMITS.title) throw new Refusal(MESSAGES.noteTitleLong)
  if (NOTE_TITLE_BAD.test(title)) throw new Refusal(MESSAGES.noteTitleBad)
  const folder = typeof v.folder === 'string' ? v.folder.trim().replace(/[\r\n]/g, ' ') : ''
  if (folder.length > NOTE_LIMITS.folder) throw new Refusal(MESSAGES.noteFolderLong)
  if (NOTE_FOLDER_BAD.test(folder)) throw new Refusal(MESSAGES.noteFolderBad)
  if (typeof v.body !== 'string') throw new Refusal(MESSAGES.badValue)
  if (v.body.length > NOTE_LIMITS.body) throw new Refusal(MESSAGES.noteTooLong)
  const given = v.tags ?? []
  if (!Array.isArray(given) || given.some(tag => typeof tag !== 'string')) throw new Refusal(MESSAGES.badValue)
  const tags = [...new Set((given as string[]).map(cleanTag).filter(tag => tag !== ''))]
  if (tags.some(tag => tag.length > NOTE_LIMITS.tag)) throw new Refusal(MESSAGES.noteTagLong)
  if (tags.length > NOTE_LIMITS.tags) throw new Refusal(MESSAGES.noteTooManyTags)

  return { title, folder: folder === '' ? INBOX : folder, tags, body: v.body }
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

// A realm's notes keep to a folder of Markdown files outside its repository:
// one there would hold Start until committed, and notes change all the time.
// The folder opens as an Obsidian vault as it is.
export const notesApi = (d: NotesDeps) => {
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

  const noteOf = ({ id, file, text }: Loaded): Note => ({ id, title: file.title, folder: file.folder, tags: file.tags, created: file.created, updated: file.updated, isArchived: file.isArchived, quests: file.quests, body: file.body, stamp: stampOf(text) })

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

  const newId = async (key: string): Promise<string> => {
    for (let tries = 0; tries < 5; tries += 1) {
      const id = d.newNoteId()
      if (!(await d.host.exists(pathOf(key, id)))) return id
    }
    throw new Error('no free note id after 5 tries')
  }

  return {
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
        const next = changeOf(previous.file)
        const title = now.file.isArchived ? next.title : freeTitle(await titlesOf(realm), next.title, noteId)
        // Filing quests and archiving are separate actions: restoring text must
        // not detach quests or make an archived note live again.
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

    // Shows the realm's notes folder in Finder, made first if it isn't there yet.
    showNotes: (key: unknown): Promise<Reply<null>> =>
      reply(d.log, MESSAGES.showRecord, async () => {
        const realm = await realmOf(key)
        const made = await d.host.makeDirs(folderOf(realm))
        if (made.exitCode !== 0) throw new Error(made.stderr)
        d.reveal(folderOf(realm))

        return null
      }),

    createNote: (key: unknown, input: unknown): Promise<Reply<{ view: NotesView; id: string }>> =>
      inTurn(MESSAGES.saveNote, async () => {
        const realm = await realmOf(key)
        const note = changeOf({ ...(input as object), tags: [] })
        const now = nowText()
        const id = await newId(realm)
        // A taken title gets the next number, so a link still means one note.
        const title = freeTitle(await titlesOf(realm), note.title)
        await write(realm, id, { ...note, title, created: now, updated: now, isArchived: false, quests: [], aliases: [], rest: [] })

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
