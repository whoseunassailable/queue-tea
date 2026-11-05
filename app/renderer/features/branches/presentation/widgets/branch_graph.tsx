import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { BranchGraph as Graph } from '../../../../../shared/branches'
import { t } from '../../../../l10n/en'
import { graphLayout } from '../../domain/graph_layout'

export const BranchGraph = ({ graph, onSelect }: { graph: Graph; onSelect: (id: string) => void }) => {
  const layout = useMemo(() => graphLayout(graph), [graph])
  const [zoom, setZoom] = useState(1)
  const scroller = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => { setZoom(Math.max(.3, Math.min(1, (scroller.current?.clientWidth || layout.width) / layout.width))) }, [layout.width])
  return <section class="panel history-graph" aria-label={t.branches.graph}>
    <div class="graph-tools">
      <strong>{t.branches.graph}</strong>
      <button class="btn" type="button" onClick={() => setZoom(Math.max(.5, zoom - .2))} aria-label={t.branches.zoomOut}>−</button>
      <button class="btn" type="button" onClick={() => setZoom(Math.min(2, zoom + .2))} aria-label={t.branches.zoomIn}>+</button>
      <button class="btn" type="button" onClick={() => setZoom(Math.max(.3, Math.min(1, (scroller.current?.clientWidth ?? layout.width) / layout.width)))}>{t.branches.fit}</button>
      <button class="btn" type="button" onClick={() => {
        const task = graph.tasks.find(q => q.state === 'working')
        const node = layout.nodes.find(n => n.id === task?.head)
        if (node) scroller.current?.scrollTo({ top: Math.max(0, node.y * zoom - 80), left: Math.max(0, node.x * zoom - 80) })
        if (task) onSelect(task.id)
      }}>{t.branches.focus}</button>
    </div>
    <div class="graph-scroll" ref={scroller} tabIndex={0} aria-label={t.branches.pan}>
      <svg width={layout.width * zoom} height={layout.height * zoom} viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={t.branches.graphHint}>
        {layout.edges.map(edge => <path key={`${edge.from.id}-${edge.to.id}`} class="commit-edge" d={`M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${edge.from.y + 24}, ${edge.to.x} ${edge.to.y - 24}, ${edge.to.x} ${edge.to.y}`} />)}
        {layout.nodes.map(node => {
          const task = graph.tasks.find(q => q.head === node.id)
          return <g key={node.id} transform={`translate(${node.x},${node.y})`}>
            <circle r="7" class={`commit-dot ${task?.state === 'working' ? 'observed-working' : ''}`} />
            <title>{`${node.id} · ${node.message}`}</title>
            {node.branches.length > 0 ? <g role={task ? 'button' : undefined} tabIndex={task ? 0 : undefined} aria-label={task ? t.branches.reviewNamed(task.title) : undefined} onClick={() => task && onSelect(task.id)} onKeyDown={e => { if (task && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(task.id) } }}>
              <rect x="14" y="-16" width="330" height="32" rx="8" class="commit-label-bg" />
              <text x="24" y="5" class="commit-label">{node.branches.join(', ').slice(0, 45)}</text>
            </g> : <text x="14" y="4" class="commit-caption">{node.id.slice(0, 7)} · {node.message.slice(0, 38)}</text>}
          </g>
        })}
      </svg>
    </div>
    <p class="hint">{t.branches.graphHint} {graph.limited ? t.branches.limited : ''}</p>
  </section>
}
