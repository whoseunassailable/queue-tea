import type { ComponentChildren } from 'preact'
import { lexer } from 'marked'
import type { Token, Tokens } from 'marked'

import { linkPartsOf, noteTitled } from '../../../../../shared/notes'
import type { Note } from '../../../../../shared/notes'
import { t } from '../../../../l10n/en'

type Props = { body: string; notes: readonly Note[]; isLive: boolean; onToggle: (index: number) => void; onOpenNote: (id: string) => void; onOpenLink: (url: string) => void }

const CALLOUT = /^\[!(\w+)\][+-]?[ \t]*(.*)$/

// A note as it reads. marked only cuts the Markdown into tokens; every token
// becomes an element here, so nothing in a note is ever run as HTML: a tag in
// the text shows as the text it is.
export const ReadView = ({ body, notes, isLive, onToggle, onOpenNote, onOpenLink }: Props) => {
  // The boxes are numbered in the order they're drawn, which is the order
  // toggleTaskAt counts the lines in.
  let box = -1

  const wiki = (text: string): ComponentChildren =>
    linkPartsOf(text).map((part, i) => {
      if (part.kind === 'text') return part.text
      const target = noteTitled(notes, part.title)

      return target === undefined ? (
        <span key={i} class="nt-md-broken" title={t.notebook.broken(part.title)}>
          {part.shown}
        </span>
      ) : (
        <button key={i} type="button" class="nt-link nt-md-wiki" onClick={() => onOpenNote(target.id)}>
          {part.shown}
        </button>
      )
    })

  const external = (href: string, children: ComponentChildren, key: number, title = href) => (
    <a
      key={key}
      href={href}
      title={title}
      class="nt-md-link"
      onClick={event => {
        event.preventDefault()
        onOpenLink(href)
      }}
    >
      {children}
    </a>
  )

  const inline = (tokens: Token[] | undefined): ComponentChildren =>
    (tokens ?? []).map((token, i) => {
      switch (token.type) {
        case 'text':
          return 'tokens' in token && token.tokens !== undefined ? inline(token.tokens) : wiki(token.text)
        case 'escape':
          return token.text
        case 'strong':
          return <strong key={i}>{inline(token.tokens)}</strong>
        case 'em':
          return <em key={i}>{inline(token.tokens)}</em>
        case 'del':
          return <del key={i}>{inline(token.tokens)}</del>
        case 'codespan':
          return <code key={i}>{token.text}</code>
        case 'br':
          return <br key={i} />
        case 'link':
          return external(token.href, inline(token.tokens), i)
        // Images wait for attachments: for now the picture opens in the browser.
        case 'image':
          return external(token.href, `🖼 ${token.text === '' ? t.notebook.image : token.text}`, i, t.notebook.imageTitle)
        case 'checkbox':
          return null
        default:
          return token.raw
      }
    })

  const item = (entry: Tokens.ListItem, i: number) => {
    if (!entry.task) return <li key={i}>{blocks(entry.tokens)}</li>
    box += 1
    const index = box

    return (
      <li key={i} class="nt-md-task">
        <input type="checkbox" checked={entry.checked === true} disabled={!isLive} aria-label={t.notebook.taskBox(entry.text.split('\n')[0]!)} onChange={() => onToggle(index)} />
        <div>{blocks(entry.tokens)}</div>
      </li>
    )
  }

  const callout = (quote: Tokens.Blockquote, i: number) => {
    const [first, ...rest] = quote.text.split('\n')
    const found = CALLOUT.exec(first ?? '')
    if (found === null) return <blockquote key={i}>{blocks(quote.tokens)}</blockquote>
    const kind = found[1]!.toLowerCase()

    return (
      <aside key={i} class={`nt-md-callout ${kind}`} aria-label={found[2] || kind}>
        <p class="nt-md-callout-title">{found[2] === '' ? kind.charAt(0).toUpperCase() + kind.slice(1) : wiki(found[2]!)}</p>
        {blocks(lexer(rest.join('\n')))}
      </aside>
    )
  }

  const blocks = (tokens: Token[] | undefined): ComponentChildren =>
    (tokens ?? []).map((token, i) => {
      switch (token.type) {
        case 'space':
        case 'def':
        case 'checkbox':
          return null
        case 'heading': {
          const Heading = `h${Math.min(6, token.depth + 1)}` as 'h2'

          return (
            <Heading key={i} class="nt-md-h" data-depth={token.depth}>
              {inline(token.tokens)}
            </Heading>
          )
        }
        case 'paragraph':
          return <p key={i}>{inline(token.tokens)}</p>
        case 'text':
          return 'tokens' in token && token.tokens !== undefined ? <span key={i}>{inline(token.tokens)}</span> : <span key={i}>{wiki(token.text)}</span>
        case 'code':
          return (
            <pre key={i} class="nt-md-code">
              <code>{token.text}</code>
            </pre>
          )
        case 'blockquote':
          return callout(token as Tokens.Blockquote, i)
        case 'list': {
          const list = token as Tokens.List
          const items = list.items.map(item)

          return list.ordered ? (
            <ol key={i} start={typeof list.start === 'number' ? list.start : undefined}>
              {items}
            </ol>
          ) : (
            <ul key={i}>{items}</ul>
          )
        }
        case 'table': {
          const table = token as Tokens.Table

          return (
            <div key={i} class="nt-md-table">
              <table>
                <thead>
                  <tr>
                    {table.header.map((cell, c) => (
                      <th key={c} style={{ textAlign: table.align[c] ?? undefined }}>
                        {inline(cell.tokens)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} style={{ textAlign: table.align[c] ?? undefined }}>
                          {inline(cell.tokens)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        case 'hr':
          return <hr key={i} />
        // Raw HTML is shown as the text it is, never run.
        case 'html':
          return (
            <p key={i} class="nt-md-raw">
              {token.raw}
            </p>
          )
        default:
          return <p key={i}>{token.raw}</p>
      }
    })

  const tokens = lexer(body)

  return <article class="nt-read">{body.trim() === '' ? <p class="hint">{t.notebook.readEmpty}</p> : blocks(tokens)}</article>
}
