import type { JSX } from 'preact'

import { childrenOf, isFrame, isText } from '../../../../../shared/designs'
import type { Layer, Scene } from '../../../../../shared/designs'
import { t } from '../../../../l10n/en'

const LINE_HEIGHT = 1.25

export const textStyle = (layer: Layer): JSX.CSSProperties =>
  isText(layer)
    ? {
        fontFamily: `"${layer.font}", "Nunito Sans", system-ui, sans-serif`,
        fontSize: `${layer.size}px`,
        fontWeight: layer.weight,
        color: layer.color,
        textAlign: layer.align ?? 'left',
        lineHeight: typeof layer.lineHeight === 'number' ? layer.lineHeight : LINE_HEIGHT,
      }
    : {}

// editing: the text being typed into, hidden so its editor shows in its place.
const LayerView = ({ layer, editing }: { layer: Layer; editing: string | null }) => {
  const place = { left: `${layer.x}px`, top: `${layer.y}px`, width: `${layer.width}px` }
  if (isText(layer)) {
    return (
      <div class="dz-text" data-layer={layer.id} style={{ ...place, ...textStyle(layer), visibility: editing === layer.id ? 'hidden' : undefined }}>
        {layer.text === '' ? ' ' : layer.text}
      </div>
    )
  }
  if (isFrame(layer)) {
    const stroke = layer.stroke === undefined ? undefined : `inset 0 0 0 ${layer.stroke.width}px ${layer.stroke.color}`

    return (
      <div class="dz-box" data-layer={layer.id} style={{ ...place, height: `${layer.height}px`, background: layer.fill, borderRadius: layer.radius === undefined ? undefined : `${layer.radius}px`, boxShadow: stroke }}>
        {childrenOf(layer).map(child => (
          <LayerView key={child.id} layer={child} editing={editing} />
        ))}
      </div>
    )
  }

  return (
    <div class="dz-unknown" data-layer={layer.id} style={{ ...place, height: `${typeof layer.height === 'number' ? layer.height : 40}px` }}>
      {t.designs.unknownLayer}
    </div>
  )
}

export const SceneView = ({ scene, editing = null }: { scene: Scene; editing?: string | null }) => (
  <div class="dz-scene" style={{ width: `${scene.width}px`, height: `${scene.height}px`, background: scene.fill }}>
    {scene.nodes.map(layer => (
      <LayerView key={layer.id} layer={layer} editing={editing} />
    ))}
  </div>
)

// A design shrunk to fit a box, for a card. It never takes a click.
export const SceneThumb = ({ scene, width, height }: { scene: Scene; width: number; height: number }) => {
  const scale = Math.min(width / scene.width, height / scene.height)

  return (
    <div class="dz-thumb" style={{ width: `${width}px`, height: `${height}px` }} aria-hidden="true">
      <div style={{ width: `${scene.width * scale}px`, height: `${scene.height * scale}px`, overflow: 'hidden' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
          <SceneView scene={scene} />
        </div>
      </div>
    </div>
  )
}
