import { expect, it } from 'vitest'

import { note } from '../../../../test_support'
import { noteGraphOf, questNodeId } from '../../domain/note_graph'
import type { GraphColours, GraphFrame } from './note_graph_draw'
import { drawGraph } from './note_graph_draw'

// A 2D context that records the text it is asked to fill and ignores everything else.
const recordingContext = () => {
  const texts: string[] = []
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (store, key: string) => (key === 'fillText' ? (text: string) => void texts.push(text) : key in store ? store[key] : () => undefined),
    set: (store, key: string, value) => ((store[key] = value), true),
  })

  return { ctx: ctx as unknown as CanvasRenderingContext2D, texts }
}

it('labels a quest that is not in the queue with the gone-quest text', () => {
  const open = note({ id: 'n-00000001', title: 'Gait sensor', body: '[[quest:t-5e6f|Old]]' })
  const graph = noteGraphOf([open], new Map())
  const gone = questNodeId('t-5e6f')
  const colour = '#000'
  const colours: GraphColours = { note: colour, meeting: colour, quest: colour, gone: colour, line: colour, ring: colour, label: colour, halo: colour }
  // goneQuest is the argument the fix is expected to pass the text in by.
  const frame = {
    width: 800, height: 600, ratio: 1, view: { zoom: 1, x: 400, y: 300 }, graph, shown: new Set(graph.nodes.keys()), openId: open.id, hot: null, isLabelled: true, colours,
    points: new Map([[open.id, { x: 0, y: 0 }], [gone, { x: 60, y: 0 }]]),
    goneQuest: 'Quest not in the queue',
  }
  const { ctx, texts } = recordingContext()
  drawGraph(ctx, frame as GraphFrame)

  expect(texts).toContain('Gait sensor')
  expect(texts).toContain('Quest not in the queue')
})
