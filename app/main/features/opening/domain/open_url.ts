const SCHEME = 'queue-tea:'
const ACTION = 'open'

// The folder a link names, or null when it isn't a link we made. A link can come
// from anywhere, so this is the whole of what it can say.
export const pathFromUrl = (url: string): string | null => {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    // Not a URL at all, which is what the null says.
    return null
  }
  if (parsed.protocol !== SCHEME || parsed.hostname !== ACTION) return null
  const path = parsed.searchParams.get('path')
  if (path === null || !path.startsWith('/') || path.includes('\0')) return null

  return path.length > 1 ? path.replace(/\/+$/, '') : path
}
