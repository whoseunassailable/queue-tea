import type { LayoutInput } from '../../domain/note_graph_layout'
import { layoutOf } from '../../domain/note_graph_layout'
import type { LayoutMessage } from './graph_layout'

// The layout's own thread. It can't reach the engine's log, so a failure goes
// back with its stack and the window logs it.
const post = (message: LayoutMessage) => self.postMessage(message)

self.onmessage = (event: MessageEvent<LayoutInput>) => {
  try {
    post({ kind: 'done', points: layoutOf(event.data, share => post({ kind: 'progress', share })) })
  } catch (error) {
    post({ kind: 'failed', detail: error instanceof Error ? (error.stack ?? error.message) : String(error) })
  }
}
