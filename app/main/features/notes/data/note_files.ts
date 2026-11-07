import { createHash, randomUUID } from 'node:crypto'
import { constants } from 'node:fs'
import { link, mkdir, open, realpath, unlink } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'

import { attachmentError, extensionOf, NOTE_ATTACHMENTS, NOTE_FILE_LIMIT, noteFilePath } from '../../../../shared/note_attachments'
import type { NoteAttachment, NoteFileKind, NoteUpload } from '../../../../shared/note_attachments'
import { NOTES_FOLDER } from '../../../../shared/notes'
import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'

// Content, rather than a picker-supplied MIME type, decides what may render.
const formatOf = (bytes: Uint8Array): { extension: string; mime: string; kind: NoteFileKind } => {
  const b = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const head = b.subarray(0, 1024).toString('utf8')
  const hex = b.subarray(0, 12).toString('hex')
  const image = (extension: string, mime = `image/${extension}`) => ({ extension, mime, kind: 'image' as const })
  if (head.startsWith('%PDF-')) return { extension: 'pdf', mime: 'application/pdf', kind: 'pdf' }
  if (hex.startsWith('89504e470d0a1a0a')) return image('png')
  if (hex.startsWith('ffd8ff')) return image('jpg', 'image/jpeg')
  if (/^GIF8[79]a/.test(head)) return image('gif')
  if (head.startsWith('RIFF') && b.subarray(8, 12).toString() === 'WEBP') return image('webp')
  if (head.startsWith('BM')) return image('bmp')
  if (hex.startsWith('00000100')) return image('ico', 'image/x-icon')
  if (b.subarray(4, 8).toString() === 'ftyp' && ['avif', 'avis'].includes(b.subarray(8, 12).toString())) return image('avif')
  if (/^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(head)) return image('svg', 'image/svg+xml')

  return { extension: '', mime: 'application/octet-stream', kind: 'other' }
}

export const noteFiles = (home: string) => {
  const vault = (key: string) => resolve(home, NOTES_FOLDER, key)
  const checkedPath = async (key: string, path: string): Promise<string> => {
    const root = await realpath(vault(key))
    const actual = await realpath(join(root, path))
    if (!actual.startsWith(root + sep)) throw new Refusal(MESSAGES.badNoteFile)

    return actual
  }

  const read = async (key: string, path: string) => {
    const file = await open(await checkedPath(key, path), constants.O_RDONLY | constants.O_NOFOLLOW)
    try {
      const info = await file.stat()
      if (!info.isFile() || info.size >= NOTE_FILE_LIMIT) throw new Refusal(MESSAGES.noteFileSize)
      const bytes = await file.readFile()
      if (bytes.length >= NOTE_FILE_LIMIT) throw new Refusal(MESSAGES.noteFileSize)

      return { bytes, ...formatOf(bytes) }
    } finally {
      await file.close()
    }
  }

  return {
    read,
    import: async (key: string, value: unknown): Promise<NoteAttachment> => {
      const file = (value ?? {}) as Partial<NoteUpload>
      if (typeof file.name !== 'string' || typeof file.type !== 'string' || !(file.bytes instanceof Uint8Array) || /[\\/\x00-\x1f]/.test(file.name)) throw new Refusal(MESSAGES.noteFileType)
      const error = attachmentError({ name: file.name, type: file.type, size: file.bytes.byteLength })
      if (error !== undefined) throw new Refusal(error === 'type' ? MESSAGES.noteFileType : MESSAGES.noteFileSize)
      const format = formatOf(file.bytes)
      const extension = extensionOf(file.name).replace(/^jpeg$/, 'jpg')
      if (format.kind === 'other' || (file.name.includes('.') && extension !== format.extension)) throw new Refusal(MESSAGES.noteFileType)
      const hash = createHash('sha256').update(file.bytes).digest('hex')
      const path = `${NOTE_ATTACHMENTS}/${hash}.${format.extension}`
      await mkdir(join(vault(key), NOTE_ATTACHMENTS), { recursive: true })
      // A symlinked attachments folder must not redirect writes out of the vault.
      const root = await realpath(vault(key))
      const folder = await realpath(join(root, NOTE_ATTACHMENTS))
      if (!folder.startsWith(root + sep)) throw new Refusal(MESSAGES.badNoteFile)
      const target = join(folder, `${hash}.${format.extension}`)
      const temporary = `${target}.${randomUUID()}.tmp`
      const output = await open(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600)
      try {
        try {
          await output.writeFile(file.bytes)
        } finally {
          await output.close()
        }
        try {
          // A hard link publishes the complete file without replacing one a
          // second writer published first. Neither can read half a picture.
          await link(temporary, target)
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err
          const existing = await read(key, path)
          if (!existing.bytes.equals(Buffer.from(file.bytes))) throw err
        }
      } finally {
        await unlink(temporary)
      }

      return { path, kind: format.kind }
    },
  }
}

export const filePathOf = (value: unknown): string => {
  const path = typeof value === 'string' ? noteFilePath(value) : null
  if (path === null) throw new Refusal(MESSAGES.badNoteFile)

  return path
}
