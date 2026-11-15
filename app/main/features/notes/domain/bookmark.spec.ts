import { describe, expect, it } from 'vitest'

import { bookmarkUrlOf } from '../../../../shared/note_bookmarks'
import { bookmarkOf } from './bookmark'

const URL_ = 'https://example.com/post'

describe('a bookmark link', () => {
  it('is a web link, trimmed of the space around it', () => {
    expect(bookmarkUrlOf('https://example.com/a?b=1#c')).toBe('https://example.com/a?b=1#c')
    expect(bookmarkUrlOf('  http://example.com/\n')).toBe('http://example.com/')
    expect(bookmarkUrlOf('HTTPS://Example.com/Café')).toBe('HTTPS://Example.com/Café')
  })

  it('is nothing for other schemes, text that is not a link, or a link with space inside', () => {
    for (const text of ['', '   ', 'example.com', 'not a url', 'ftp://example.com/', 'file:///etc/passwd', 'javascript:alert(1)', 'mailto:rohan@example.com', 'https://exa mple.com', 'https://example.com/a\nb', 'https://', 'see https://example.com']) expect(bookmarkUrlOf(text)).toBeNull()
  })

  it('takes a link of 2,048 characters but not one longer', () => {
    const base = 'https://example.com/'
    expect(bookmarkUrlOf(base + 'a'.repeat(2048 - base.length))).not.toBeNull()
    expect(bookmarkUrlOf(base + 'a'.repeat(2049 - base.length))).toBeNull()
  })
})

describe('a page’s preview', () => {
  it('takes the Open Graph title and description before Twitter’s and the page’s own', () => {
    const html = '<title>Page title</title><meta name="description" content="Plain"><meta name="twitter:description" content="Tweet"><meta property="og:description" content="Graph"><meta name="twitter:title" content="Tweet title"><meta property="og:title" content="Graph title"><meta property="og:site_name" content="Example">'
    expect(bookmarkOf(URL_, html)).toEqual({ url: URL_, title: 'Graph title', description: 'Graph', site: 'Example' })
  })

  it('falls back to Twitter’s tags, then the <title> and description', () => {
    expect(bookmarkOf(URL_, '<title>Page title</title><meta name="twitter:title" content="Tweet title"><meta name="twitter:description" content="Tweet"><meta name="description" content="Plain">')).toMatchObject({ title: 'Tweet title', description: 'Tweet' })
    expect(bookmarkOf(URL_, '<title lang="en">\n  Page title\n</title><meta name="description" content="Plain">')).toMatchObject({ title: 'Page title', description: 'Plain', site: null })
  })

  it('skips an empty tag for the next one', () => {
    expect(bookmarkOf(URL_, '<meta property="og:title" content="  "><meta property="og:description" content=""><title>Page title</title><meta name="description" content="Plain">')).toMatchObject({ title: 'Page title', description: 'Plain' })
  })

  it('keeps the first of two tags with the same name', () => {
    expect(bookmarkOf(URL_, '<meta property="og:title" content="First"><meta property="og:title" content="Second">').title).toBe('First')
  })

  it('reads attributes in any order, any case, and with single, double or no quotes', () => {
    expect(bookmarkOf(URL_, '<meta content="Content first" property="og:title">').title).toBe('Content first')
    expect(bookmarkOf(URL_, "<meta property='og:title' content='It is \"quoted\"'>").title).toBe('It is "quoted"')
    expect(bookmarkOf(URL_, '<meta property=og:title content=Bare>').title).toBe('Bare')
    expect(bookmarkOf(URL_, '<META PROPERTY="OG:TITLE" CONTENT="Shouted" />').title).toBe('Shouted')
    expect(bookmarkOf(URL_, '<meta name="og:site_name" content="By name">').site).toBe('By name')
  })

  it('decodes named, numeric and hex entities, and leaves unknown or impossible ones as written', () => {
    const html = '<meta property="og:title" content="Tom &amp; Jerry &lt;3 &quot;hi&quot; &#39;a&#x27; &#8217;s &#x1F375; &AMP;"><meta property="og:description" content="&copy; &#0; &#x110000; &bogus;">'
    expect(bookmarkOf(URL_, html)).toMatchObject({ title: 'Tom & Jerry <3 "hi" \'a\' ’s 🍵 &', description: '&copy; &#0; &#x110000; &bogus;' })
  })

  it('collapses runs of whitespace and control characters to one space', () => {
    expect(bookmarkOf(URL_, '<title>\n\tOne&nbsp;\u0007 two \r\n three \u007f</title>').title).toBe('One two three')
  })

  it('shows tags as text, never as markup', () => {
    expect(bookmarkOf(URL_, '<meta property="og:title" content="&lt;img src=x onerror=alert(1)&gt;">').title).toBe('<img src=x onerror=alert(1)>')
  })

  it('cuts the title at 200, the description at 300 and the site at 80 characters, ending with …', () => {
    const html = `<meta property="og:title" content="${'t'.repeat(201)}"><meta property="og:description" content="${'d'.repeat(301)}"><meta property="og:site_name" content="${'s'.repeat(81)}">`
    const preview = bookmarkOf(URL_, html)
    expect(preview.title).toBe(`${'t'.repeat(199)}…`)
    expect(preview.description).toBe(`${'d'.repeat(299)}…`)
    expect(preview.site).toBe(`${'s'.repeat(79)}…`)
  })

  it('keeps text that is exactly at the limit whole', () => {
    expect(bookmarkOf(URL_, `<title>${'t'.repeat(200)}</title>`).title).toBe('t'.repeat(200))
  })

  it('is empty for a page with nothing to show', () => {
    for (const html of ['', '<html><body>Hi</body></html>', '<title> </title><meta name="description" content="&#32;">']) expect(bookmarkOf(URL_, html)).toEqual({ url: URL_, title: null, description: null, site: null })
  })
})
