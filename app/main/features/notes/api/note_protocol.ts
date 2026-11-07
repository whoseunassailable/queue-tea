import { NOTE_FILE_SCHEME } from '../../../../shared/note_attachments'
import type { NotesApi } from './notes_api'

// Never hand an arbitrary file URL to Chromium. The same realm and path
// checks protect both the metadata IPC and every request for preview bytes.
export const noteFileResponse = async (url: string, notes: Pick<NotesApi, 'serveNoteFile'>): Promise<Response> => {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    // A malformed URL has no file to serve.
    return new Response(null, { status: 400 })
  }
  if (parsed.protocol !== `${NOTE_FILE_SCHEME}:` || parsed.hostname !== 'realm' || parsed.port !== '' || parsed.username !== '' || parsed.password !== '' || parsed.search !== '') return new Response(null, { status: 400 })
  const [, key, ...parts] = parsed.pathname.split('/')
  const answer = await notes.serveNoteFile(key, parts.join('/'))
  if (!answer.ok) return new Response(null, { status: 404 })
  const file = answer.data
  // Other files can be downloaded through IPC; they never become a document
  // in a frame. SVG is passive in an img and gets a sandbox if navigated to.
  if (file.kind === 'other') return new Response(null, { status: 415 })

  return new Response(new Uint8Array(file.bytes), { headers: {
    'Content-Type': file.mime,
    'Content-Length': String(file.bytes.length),
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  } })
}
