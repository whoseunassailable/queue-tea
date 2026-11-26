import type { ProposedQuest } from '../../../../shared/notes'

export const DESCRIPTION_LIMIT = 8_000

// A filed quest's description: where it came from, then what BrewQuest said it's
// for, the note's words it came from, its effort estimate and what isn't
// confirmed. A checklist line has only the first part; the note's own quest
// takes the note's first paragraph when nothing else describes it.
export const questDescriptionOf = (noteTitle: string, firstParagraph: string | null, quest: Pick<ProposedQuest, 'item' | 'summary' | 'sources' | 'points' | 'doubts'>): string => {
  const parts = [`From the note "${noteTitle}" in Notes.`]
  const summary = quest.summary?.trim() ?? ''
  if (summary !== '') parts.push(summary)
  else if (quest.item === null && firstParagraph !== null) parts.push(firstParagraph)
  const sources = quest.sources ?? []
  if (sources.length > 0) {
    const quoted = sources.map(source => {
      const lines = source.quote.split('\n').map(line => `> ${line}`)

      return source.title === noteTitle ? lines.join('\n') : `${lines.join('\n')}\n> (from "${source.title}")`
    })
    parts.push(`The note's words:\n\n${quoted.join('\n>\n')}`)
  }
  if (quest.points !== undefined) parts.push(`Effort: ${quest.points} ${quest.points === 1 ? 'point' : 'points'} (BrewQuest's estimate).`)
  const doubts = quest.doubts ?? []
  if (doubts.length > 0) parts.push(`Not confirmed yet:\n${doubts.map(doubt => `- ${doubt}`).join('\n')}`)
  const text = parts.join('\n\n')

  return text.length > DESCRIPTION_LIMIT ? `${text.slice(0, DESCRIPTION_LIMIT - 1)}…` : text
}
