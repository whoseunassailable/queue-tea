// Files stay portable: Markdown holds a relative vault path, never a machine's
// absolute path or the private URL the app uses to show a preview.
export const NOTE_FILE_SCHEME = 'note-file'
export const NOTE_ATTACHMENTS = 'attachments'
export const NOTE_FILE_LIMIT = 10 * 1024 * 1024
export const NOTE_FILE_ACCEPT = 'image/*,application/pdf'
export const NOTE_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'avif', 'svg'] as const
export type NoteFileKind = 'image' | 'pdf' | 'other'
export type NoteAttachment = { path: string; kind: NoteFileKind }
export type NoteUpload = { name: string; type: string; bytes: Uint8Array }

export const extensionOf = (name: string): string => name.split('.').at(-1)?.toLowerCase() ?? ''
export const attachmentError = (file: { name: string; type: string; size: number }): 'type' | 'size' | undefined => {
  const extension = extensionOf(file.name)
  const hasType = file.type.startsWith('image/') || file.type === 'application/pdf'
  const hasExtension = (NOTE_IMAGE_EXTENSIONS as readonly string[]).includes(extension) || extension === 'pdf'
  if (!hasType && !(file.type === '' && hasExtension)) return 'type'
  if (file.size >= NOTE_FILE_LIMIT) return 'size'

  return undefined
}

export const noteFilePath = (href: string): string | null => {
  // Decode components separately: an encoded slash may never add a folder.
  const parts = href.split('#')[0]!.split('/')
  if (parts.length > 2 || (parts.length === 2 && parts[0] !== NOTE_ATTACHMENTS)) return null
  try {
    const names = parts.map(part => decodeURIComponent(part))
    if (names.some(name => name === '' || name.startsWith('.') || name.includes('..') || /[\\/:\x00-\x1f\x7f?<>]/.test(name))) return null
    const leaf = names.at(-1)!
    if (!/\.[a-z0-9]{1,10}$/i.test(leaf) || extensionOf(leaf) === 'md') return null

    return names.join('/')
  } catch {
    // A malformed percent escape is text, not a file link.
    return null
  }
}

export const noteFileUrl = (realm: string, path: string): string => `${NOTE_FILE_SCHEME}://realm/${encodeURIComponent(realm)}/${path.split('/').map(encodeURIComponent).join('/')}`
export const attachmentMarkdown = (file: NoteAttachment, name: string): string => {
  const label = name.replace(/[\r\n]/g, ' ').replace(/[\\[\]]/g, '\\$&')

  return `${file.kind === 'image' ? '!' : ''}[${label}](<${file.path.split('/').map(encodeURIComponent).join('/')}>)`
}
