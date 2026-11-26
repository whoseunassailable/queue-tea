// The text layer of an .ics file (RFC 5545): content lines, their parameters,
// escaped text, and lines folded at 75 bytes. Nothing here knows what an
// event is; ics_import.ts and ics_export.ts do.

export type IcsLine = { name: string; params: Record<string, string>; value: string }
// A component, such as VEVENT, with its own lines and the components inside it.
export type IcsBlock = { name: string; lines: IcsLine[]; blocks: IcsBlock[] }

const LIMIT = 75

// A line that goes on starts the next with a space or a tab.
const unfold = (text: string): string[] =>
  text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n[ \t]/g, '')
    .split('\n')

// NAME;PARAM=value;PARAM="quoted: value":the value. Only a colon outside
// quotes ends the name and its parameters. null for a line that isn't one.
export const lineOf = (raw: string): IcsLine | null => {
  let quoted = false
  let colon = -1
  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i]
    if (char === '"') quoted = !quoted
    else if (char === ':' && !quoted) {
      colon = i
      break
    }
  }
  if (colon <= 0) return null
  const [name, ...rest] = splitOutsideQuotes(raw.slice(0, colon), ';')
  if (name === undefined || !/^[A-Za-z0-9-]+$/.test(name)) return null
  const params: Record<string, string> = {}
  for (const param of rest) {
    const equals = param.indexOf('=')
    if (equals <= 0) continue
    params[param.slice(0, equals).toUpperCase()] = param.slice(equals + 1).replace(/^"(.*)"$/, '$1')
  }

  return { name: name.toUpperCase(), params, value: raw.slice(colon + 1) }
}

const splitOutsideQuotes = (text: string, by: string): string[] => {
  const parts: string[] = []
  let quoted = false
  let from = 0
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '"') quoted = !quoted
    else if (text[i] === by && !quoted) {
      parts.push(text.slice(from, i))
      from = i + 1
    }
  }
  parts.push(text.slice(from))

  return parts
}

// The file's components, outermost first. A line outside any component, or an
// END that closes nothing, is passed over: files in the wild aren't all tidy.
export const blocksOf = (text: string): IcsBlock[] => {
  const top: IcsBlock = { name: '', lines: [], blocks: [] }
  const open: IcsBlock[] = [top]
  for (const raw of unfold(text)) {
    if (raw.trim() === '') continue
    const line = lineOf(raw)
    if (line === null) continue
    const current = open.at(-1)!
    if (line.name === 'BEGIN') {
      const block: IcsBlock = { name: line.value.trim().toUpperCase(), lines: [], blocks: [] }
      current.blocks.push(block)
      open.push(block)
    } else if (line.name === 'END') {
      const name = line.value.trim().toUpperCase()
      const at = open.map(block => block.name).lastIndexOf(name)
      if (at > 0) open.length = at
    } else current.lines.push(line)
  }

  return top.blocks
}

export const firstLine = (block: IcsBlock, name: string): IcsLine | undefined => block.lines.find(line => line.name === name)

// TEXT values escape \, ; and , with a backslash, and a new line as \n.
export const unescapeText = (value: string): string => value.replace(/\\([\\;,nN])/g, (_, char: string) => (char === 'n' || char === 'N' ? '\n' : char))
export const escapeText = (value: string): string => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

const bytesOf = (char: string) => new TextEncoder().encode(char).length

// One content line, folded so no line passes 75 bytes, never inside a
// character, and ended with CRLF.
export const folded = (line: string): string => {
  const out: string[] = []
  let current = ''
  let size = 0
  for (const char of line) {
    const width = bytesOf(char)
    // A folded line starts with a space, which counts.
    if (size + width > (out.length === 0 ? LIMIT : LIMIT - 1)) {
      out.push(current)
      current = ''
      size = 0
    }
    current += char
    size += width
  }
  out.push(current)

  return `${out.join('\r\n ')}\r\n`
}
