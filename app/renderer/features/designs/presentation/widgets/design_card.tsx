import { useEffect, useState } from 'preact/hooks'

import { isOpen, layersOf } from '../../../../../shared/designs'
import type { DesignComment, DesignRead, Problem } from '../../../../../shared/designs'
import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { THUMB_BOX } from '../../../../core/constants/constants'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Names } from '../../domain/design_forms'
import { SceneThumb } from './scene_view'

export type CardRead = 'ready' | 'broken' | 'failed'

// A file that doesn't read: which, where, and the ways to mend it.
export const BrokenFile = ({ title, problem, onRetry, onRestore }: { title: string; problem: Problem; onRetry: () => void; onRestore: () => Promise<string | null> }) => {
  const [failure, setFailure] = useState<string | null>(null)

  return (
    <div class="dz-broken" role="alert">
      <h3>{title}</h3>
      <p>{t.designs.brokenLine(problem.file, problem.detail)}</p>
      <div class="dz-broken-acts">
        <button type="button" class="btn" onClick={onRetry}>
          {t.failed.tryAgain}
        </button>
        {problem.backupAt !== null && (
          <button type="button" class="btn" onClick={() => void onRestore().then(setFailure)}>
            {t.designs.useLastGood}
          </button>
        )}
      </div>
      {failure !== null && <p class="field-error">{failure}</p>}
    </div>
  )
}

type Props = {
  engine: EngineApi
  realm: string
  folder: string
  id: string
  comments: DesignComment[]
  onOpen: () => void
  onRead: (id: string, read: CardRead, names: Names[string] | null) => void
}

export const DesignCard = ({ engine, realm, folder, id, comments, onOpen, onRead }: Props) => {
  const read = useEngineRead<DesignRead>(engine, () => engine.readDesign(realm, folder, id), [realm, folder, id])
  const { load } = read
  useEffect(() => {
    if (load.status === 'loading') return
    if (load.status === 'failed') onRead(id, 'failed', null)
    else if (load.data.kind === 'broken') onRead(id, 'broken', null)
    else onRead(id, 'ready', { name: load.data.scene.name, layers: Object.fromEntries(layersOf(load.data.scene.nodes).map(l => [l.id, l.name])) })
  }, [load])

  if (load.status === 'loading') {
    return (
      <div class="dz-card panel" role="status">
        <div class="dz-thumb dz-thumb-wait" style={{ width: `${THUMB_BOX.width}px`, height: `${THUMB_BOX.height}px` }}>
          <Spinner />
        </div>
        <p class="sub">{t.designs.readingDesign(id)}</p>
      </div>
    )
  }
  if (load.status === 'failed') {
    return (
      <div class="dz-card panel" role="alert">
        <p class="state-line">{load.message}</p>
        <button type="button" class="btn" onClick={read.retry}>
          {t.failed.tryAgain}
        </button>
      </div>
    )
  }
  if (load.data.kind === 'broken') {
    return (
      <div class="dz-card panel">
        <BrokenFile
          title={t.designs.brokenTitle(id)}
          problem={load.data.problem}
          onRetry={read.retry}
          onRestore={async () => {
            const answer = await ask(engine, () => engine.restoreDesignFile(realm, folder, id))
            if (answer.ok) read.retry()

            return answer.ok ? null : answer.message
          }}
        />
      </div>
    )
  }
  const { scene } = load.data
  const open = comments.filter(c => c.design === id && isOpen(c)).length

  return (
    <button type="button" class="dz-card panel" onClick={onOpen}>
      <SceneThumb scene={scene} width={THUMB_BOX.width} height={THUMB_BOX.height} />
      <span class="dz-card-h">
        <b>{scene.name}</b>
        <span class={open > 0 ? 'dz-badge open' : 'sub'}>{open > 0 ? t.designs.cardOpen(open) : t.designs.noComments}</span>
      </span>
      <span class="sub">{t.designs.cardMeta(scene.width, scene.height, scene.edited, Date.now())}</span>
    </button>
  )
}
