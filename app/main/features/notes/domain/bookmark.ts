import { BOOKMARK_LIMITS } from '../../../../shared/note_bookmarks'
import type { NoteBookmark } from '../../../../shared/note_bookmarks'

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

// Plain text from the page, shown as text and never as HTML.
const textOf = (raw: string | undefined, limit: number): string | null => {
  const text = (raw ?? '')
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, name: string) => {
      if (name[0] !== '#') return ENTITIES[name.toLowerCase()] ?? whole
      const code = /^#x/i.test(name) ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10)

      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole
    })
    .replace(/[\s\x00-\x1f\x7f]+/g, ' ')
    .trim()
  if (text === '') return null

  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text
}

// A page's own title and description, from its Open Graph tags first.
// shortcut: reads meta tags with patterns, not an HTML parser; a page that
// hides them in odd markup just shows no preview.
export const bookmarkOf = (url: string, html: string): NoteBookmark => {
  const metas = new Map<string, string>()
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = new Map([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)].map(found => [found[1]!.toLowerCase(), found[2] ?? found[3] ?? found[4] ?? '']))
    const key = (attrs.get('property') ?? attrs.get('name'))?.toLowerCase()
    const content = attrs.get('content')
    if (key !== undefined && content !== undefined && !metas.has(key)) metas.set(key, content)
  }
  const first = (keys: string[], limit: number) => keys.map(key => textOf(metas.get(key), limit)).find(text => text !== null) ?? null

  return {
    url,
    title: first(['og:title', 'twitter:title'], BOOKMARK_LIMITS.title) ?? textOf(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1], BOOKMARK_LIMITS.title),
    description: first(['og:description', 'twitter:description', 'description'], BOOKMARK_LIMITS.description),
    site: first(['og:site_name'], BOOKMARK_LIMITS.site),
  }
}
