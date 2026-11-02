import type { ComponentChildren } from 'preact'

import type { EngineRead } from '../api/use_engine_read'
import { Failed, Loading } from './states'

// Every page's three states, so none of them can leave one out.
export const ReadView = <T,>({ read, line, children }: { read: EngineRead<T>; line: string; children: (data: T) => ComponentChildren }) => {
  const { load, note, retry } = read
  if (load.status === 'loading') return <Loading line={line} />
  if (load.status === 'failed') return <Failed message={load.message} onRetry={retry} />

  return (
    <>
      {note !== null && (
        <p class="note panel" role="status">
          {note}
        </p>
      )}
      {children(load.data)}
    </>
  )
}
