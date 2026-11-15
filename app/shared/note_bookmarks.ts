// A web link on a line of its own reads as a bookmark card; anywhere else it
// stays a plain link. The note keeps only the link, so it reads the same in Obsidian.
export type NoteBookmark = { url: string; title: string | null; description: string | null; site: string | null }

export const BOOKMARK_URL_LIMIT = 2048
// A preview reads only a page's head: these keep a slow or huge page from
// holding the Read view, and the cache keeps turning to Read from fetching again.
export const BOOKMARK_LIMITS = { timeoutMs: 5_000, bytes: 512 * 1024, redirects: 5, cache: 200, title: 200, description: 300, site: 80 } as const

export const bookmarkUrlOf = (text: string): string | null => {
  const url = text.trim()
  if (url === '' || url.length > BOOKMARK_URL_LIMIT || /\s/.test(url)) return null
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol) ? url : null
  } catch {
    // Text that isn't a URL is no bookmark.
    return null
  }
}
