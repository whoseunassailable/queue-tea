import { constants } from 'node:fs'
import { mkdir, open, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { NOTE_ATTACHMENTS, NOTE_FILE_LIMIT, noteFilePath } from '../../../../shared/note_attachments'
import { isNoteId } from '../../../../shared/notes'
import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'

// Marks a folder as a Notes backup, so restore never reads an ordinary folder.
export const BACKUP_MANIFEST = 'queue-tea-notes.json'
export const BACKUP_FORMAT = 1

// What a backup carries from a vault, and restore takes from a backup: the
// notes at the top, and the files a note can link (the top and attachments/).
// Symlinks, folders, hidden and odd names, and files half written (.tmp) or
// kept from an old save (.bak) are never part of it, nor is the backup's marker.
export const backupEntriesOf = async (root: string): Promise<{ notes: string[]; files: string[] }> => {
  const top = await readdir(root, { withFileTypes: true })
  const inside = top.some(entry => entry.name === NOTE_ATTACHMENTS && entry.isDirectory()) ? await readdir(join(root, NOTE_ATTACHMENTS), { withFileTypes: true }) : []
  const files = [...top.filter(entry => !entry.name.endsWith('.md')).map(entry => ({ entry, path: entry.name })), ...inside.map(entry => ({ entry, path: `${NOTE_ATTACHMENTS}/${entry.name}` }))]

  return {
    notes: top.filter(entry => entry.isFile() && entry.name.endsWith('.md') && isNoteId(entry.name.slice(0, -3))).map(entry => entry.name).sort(),
    files: files.filter(({ entry, path }) => entry.isFile() && path !== BACKUP_MANIFEST && noteFilePath(path) === path && !/\.(tmp|bak)$/i.test(path)).map(({ path }) => path).sort(),
  }
}

// One file of a vault or backup, refused when it isn't a plain file under the limit.
export const readBackupFile = async (root: string, path: string): Promise<Buffer> => {
  const file = await open(join(root, path), constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const info = await file.stat()
    if (!info.isFile() || info.size >= NOTE_FILE_LIMIT) throw new Refusal(MESSAGES.noteFileSize)

    return await file.readFile()
  } finally {
    await file.close()
  }
}

// A new folder in parent, "name 2" when name is taken; never one already there.
export const newBackupFolder = async (parent: string, name: string): Promise<string> => {
  for (let n = 1; n < 100; n += 1) {
    const folder = join(parent, n === 1 ? name : `${name} ${n}`)
    try {
      await mkdir(folder)

      return folder
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err
    }
  }
  throw new Error(`no free backup folder name for ${name} in ${parent}`)
}

export const writeBackupFile = async (folder: string, path: string, bytes: Uint8Array | string): Promise<void> => {
  if (path.includes('/')) await mkdir(join(folder, path.split('/')[0]!), { recursive: true })
  await writeFile(join(folder, path), bytes, { flag: 'wx' })
}

export const removeBackupFolder = (folder: string): Promise<void> => rm(folder, { recursive: true, force: true })
