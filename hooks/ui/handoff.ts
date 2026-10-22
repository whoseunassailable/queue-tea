import type { Task } from '../../types'
import { checkpointSections, latestNote } from '../checkpoint'

export type HandoffSection = { heading: string; lines: string[] }

// A line that is a heading alone: "Next steps:", "## Next steps", "3. Decisions:"
// or "**Left:**". A line with text after its colon is content.
const HEADING = /^\s*(?:#{1,4}\s+|\d+[.)]\s+)?\**([A-Za-z][A-Za-z0-9 '&/-]{0,40}?)\**\s*:?\**\s*$/

const isHeading = (line: string): string | null => {
  const m = line.match(HEADING)
  if (m === null) return null
  const hasMark = /:\**\s*$/.test(line) || /^\s*(#|\d+[.)]\s)/.test(line) || /^\s*\*\*/.test(line)

  return hasMark ? m[1]!.trim() : null
}

// The note as its sections, in order; null when it has fewer than two
// headings, and the card shows it as plain text.
export const handoffSections = (text: string): HandoffSection[] | null => {
  const sections: HandoffSection[] = []
  const before: string[] = []
  for (const line of text.split('\n')) {
    const heading = isHeading(line)
    if (heading !== null) sections.push({ heading, lines: [] })
    else if (line.trim() !== '') (sections.at(-1)?.lines ?? before).push(line.trim())
  }
  if (sections.length < 2) return null

  return before.length === 0 ? sections : [{ heading: 'Note', lines: before }, ...sections]
}

export type CardNote = { title: string; written: string; text: string; sections: HandoffSection[] | null }

// What the Continue card shows: the note Continue carries on from. A
// checkpoint's points are listed, its goal left plain.
export const cardNote = (task: Task): CardNote | null => {
  const note = latestNote(task)
  const c = task.checkpoint
  if (note === 'checkpoint' && c !== null && c.written !== null) {
    const sections = checkpointSections(c).map(s => ({
      heading: s.heading,
      lines: s.heading === 'Goal' ? s.lines : s.lines.map(line => `- ${line}`),
    }))

    return { title: 'Checkpoint', written: c.written, text: '', sections }
  }
  if (note === 'handoff' && task.handoff !== null) {
    const { text, written } = task.handoff

    return { title: 'Handoff note', written, text, sections: handoffSections(text) }
  }

  return null
}
