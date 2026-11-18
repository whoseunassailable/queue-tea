import type { Note, NoteType } from '../../../../shared/notes'
import { linksOf, questLinksOf } from '../../../../shared/notes'
import type { QuestLine, QuestState } from './notes_view'
import { questLineOf } from './notes_view'

// The knowledge graph: a realm's live notes and the quests they link to or
// filed, joined by one line per pair however many links there are.

export type GraphNodeKind = 'note' | 'meeting' | 'quest'
// title is null only for a quest that isn't in the queue and has no title.
export type GraphNode = { id: string; kind: GraphNodeKind; title: string | null; noteType: NoteType | null; questState: QuestState | null; links: number }
export type GraphEdge = { a: string; b: string }
export type NoteGraph = { nodes: Map<string, GraphNode>; edges: GraphEdge[]; neighbours: Map<string, Set<string>> }
export type GraphSteps = 1 | 2
export type GraphFilter = { hiddenTypes: ReadonlySet<NoteType | 'none'>; quests: boolean; doneQuests: boolean }

export const SHOW_ALL: GraphFilter = { hiddenTypes: new Set(), quests: true, doneQuests: true }

// A note id can't hold '/', so a quest's node id never clashes with a note's.
const QUEST_NODE = 'quest/'
export const questNodeId = (questId: string): string => `${QUEST_NODE}${questId}`
export const questIdOfNode = (nodeId: string): string | null => (nodeId.startsWith(QUEST_NODE) ? nodeId.slice(QUEST_NODE.length) : null)

// Keeps nodes and their neighbours, and counts and lists the lines between them.
const graphOf = (nodes: Map<string, GraphNode>, neighbours: Map<string, Set<string>>): NoteGraph => {
  const edges: GraphEdge[] = []
  const kept = new Map<string, GraphNode>()
  for (const [id, node] of nodes) {
    const near = neighbours.get(id) ?? new Set<string>()
    kept.set(id, { ...node, links: near.size })
    for (const other of near) if (id < other) edges.push({ a: id, b: other })
  }

  return { nodes: kept, edges, neighbours }
}

export const noteGraphOf = (notes: readonly Note[], quests: Map<string, QuestLine>): NoteGraph => {
  const live = notes.filter(note => !note.isArchived)
  // The first note with a title wins, as noteTitled picks it.
  const byTitle = new Map<string, Note>()
  for (const note of live) if (!byTitle.has(note.title.toLowerCase())) byTitle.set(note.title.toLowerCase(), note)

  const nodes = new Map<string, GraphNode>()
  const neighbours = new Map<string, Set<string>>()
  const join = (a: string, b: string) => {
    if (a === b) return
    neighbours.set(a, (neighbours.get(a) ?? new Set()).add(b))
    neighbours.set(b, (neighbours.get(b) ?? new Set()).add(a))
  }
  for (const note of live) nodes.set(note.id, { id: note.id, kind: note.type === 'meeting' ? 'meeting' : 'note', title: note.title, noteType: note.type, questState: null, links: 0 })
  for (const note of live) {
    for (const title of linksOf(note.body)) {
      const target = byTitle.get(title.toLowerCase())
      if (target !== undefined) join(note.id, target.id)
    }
    for (const questId of [...questLinksOf(note.body), ...note.quests.map(quest => quest.id)]) {
      const id = questNodeId(questId)
      if (!nodes.has(id)) {
        const line = questLineOf(quests, questId)
        nodes.set(id, { id, kind: 'quest', title: line.title, noteType: null, questState: line.state, links: 0 })
      }
      join(note.id, id)
    }
  }

  return graphOf(nodes, neighbours)
}

// The nodes within steps of the centre, following lines either way.
export const aroundOf = (graph: NoteGraph, centre: string, steps: GraphSteps): NoteGraph => {
  if (!graph.nodes.has(centre)) return { nodes: new Map(), edges: [], neighbours: new Map() }
  const reached = new Set([centre])
  let edge = [centre]
  for (let step = 0; step < steps; step++) {
    const next: string[] = []
    for (const id of edge) {
      for (const other of graph.neighbours.get(id) ?? []) {
        if (!reached.has(other)) {
          reached.add(other)
          next.push(other)
        }
      }
    }
    edge = next
  }
  const nodes = new Map([...graph.nodes].filter(([id]) => reached.has(id)))
  const neighbours = new Map([...reached].map(id => [id, new Set([...(graph.neighbours.get(id) ?? [])].filter(other => reached.has(other)))]))

  return graphOf(nodes, neighbours)
}

export const shownIdsOf = (graph: NoteGraph, filter: GraphFilter, openId: string): Set<string> => {
  const isShown = (node: GraphNode) => {
    if (node.id === openId) return true
    if (node.kind === 'quest') return filter.quests && (node.questState !== 'done' || filter.doneQuests)

    return !filter.hiddenTypes.has(node.noteType ?? 'none')
  }

  return new Set([...graph.nodes.values()].filter(isShown).map(node => node.id))
}
