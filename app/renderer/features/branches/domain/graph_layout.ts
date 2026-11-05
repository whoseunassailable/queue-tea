import type { BranchGraph } from '../../../../shared/branches'

const GAP_X = 100
const GAP_Y = 48
export const graphLayout = (graph: BranchGraph) => {
  const heads = [...graph.heads].sort((a, b) => a.branch === graph.integration ? -1 : b.branch === graph.integration ? 1 : a.branch.localeCompare(b.branch))
  const lanes = new Map<string, number>()
  heads.forEach((h, lane) => { if (!lanes.has(h.head)) lanes.set(h.head, lane) })
  let next = heads.length
  const nodes = graph.commits.map((commit, row) => {
    const lane = lanes.get(commit.id) ?? next++
    commit.parents.forEach((id, i) => { if (!lanes.has(id)) lanes.set(id, i === 0 ? lane : next++) })
    return { ...commit, x: 32 + lane * GAP_X, y: 32 + row * GAP_Y, branches: heads.filter(h => h.head === commit.id).map(h => h.branch) }
  })
  const byId = new Map(nodes.map(n => [n.id, n]))
  const edges = nodes.flatMap(n => n.parents.flatMap(p => {
    const parent = byId.get(p)
    return parent ? [{ from: n, to: parent }] : []
  }))
  return { nodes, edges, width: Math.max(640, ...nodes.map(n => n.x + 380)), height: Math.max(120, nodes.length * GAP_Y + 32) }
}
