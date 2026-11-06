import { childrenOf, freeId, isText, layersOf, LIMITS } from '../../../../shared/designs'
import type { Layer, Scene } from '../../../../shared/designs'

// The design frame itself, when it's what is selected.
export const DESIGN_FRAME = '#design'

export type Box = { x: number; y: number; width: number; height: number }
export type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, Math.round(value)))

// The layer and the layers it sits in, outermost first; null when it's gone.
export const pathTo = (nodes: readonly Layer[], id: string): Layer[] | null => {
  for (const layer of nodes) {
    if (layer.id === id) return [layer]
    const inner = pathTo(childrenOf(layer), id)
    if (inner !== null) return [layer, ...inner]
  }

  return null
}

export const layerOf = (scene: Scene, id: string): Layer | null => pathTo(scene.nodes, id)?.at(-1) ?? null

export const parentOf = (scene: Scene, id: string): string | null => {
  const path = pathTo(scene.nodes, id)

  return path === null || path.length < 2 ? null : path.at(-2)!.id
}

// Where a layer's top-left corner sits in the design frame.
export const placeOf = (scene: Scene, id: string): { x: number; y: number } | null => {
  const path = pathTo(scene.nodes, id)

  return path === null ? null : path.reduce((at, layer) => ({ x: at.x + layer.x, y: at.y + layer.y }), { x: 0, y: 0 })
}

const mapLayers = (nodes: readonly Layer[], id: string, change: (layer: Layer) => Layer | null): Layer[] =>
  nodes.flatMap(layer => {
    if (layer.id === id) {
      const changed = change(layer)

      return changed === null ? [] : [changed]
    }
    const children = childrenOf(layer)

    return children.length === 0 ? [layer] : [{ ...layer, children: mapLayers(children, id, change) }]
  })

// A layer with some fields changed, and every other field just as it was.
export const updateLayer = (scene: Scene, id: string, patch: Partial<Layer>): Scene => {
  if (id === DESIGN_FRAME) return { ...scene, ...patch } as Scene

  return { ...scene, nodes: mapLayers(scene.nodes, id, layer => ({ ...layer, ...patch }) as Layer) }
}

export const moveBy = (scene: Scene, id: string, dx: number, dy: number): Scene => {
  const layer = layerOf(scene, id)
  if (layer === null) return scene

  return updateLayer(scene, id, { x: clamp(layer.x + dx, -LIMITS.place, LIMITS.place), y: clamp(layer.y + dy, -LIMITS.place, LIMITS.place) })
}

// The box after dragging one handle by dx, dy. With keepRatio, the side that
// moved least follows the one that moved most.
export const resizeBox = (start: Box, handle: Handle, dx: number, dy: number, keepRatio: boolean): Box => {
  const west = handle.includes('w')
  const north = handle.includes('n')
  const sideways = handle.includes('e') || west
  const upright = handle.includes('s') || north
  let width = sideways ? start.width + (west ? -dx : dx) : start.width
  let height = upright ? start.height + (north ? -dy : dy) : start.height
  if (keepRatio && start.width > 0 && start.height > 0) {
    const ratio = start.width / start.height
    if (sideways && (!upright || Math.abs(width / start.width) >= Math.abs(height / start.height))) height = width / ratio
    else width = height * ratio
  }
  width = clamp(width, 1, LIMITS.size)
  height = clamp(height, 1, LIMITS.size)

  return { x: west ? start.x + start.width - width : start.x, y: north ? start.y + start.height - height : start.y, width, height }
}

export const removeLayer = (scene: Scene, id: string): Scene => ({ ...scene, nodes: mapLayers(scene.nodes, id, () => null) })

const copyWithIds = (layer: Layer, taken: Set<string>): Layer => {
  const id = freeId(layer.name === '' ? layer.id : layer.name, taken)
  taken.add(id)
  const children = childrenOf(layer)

  return { ...structuredClone(layer), id, ...(children.length === 0 ? {} : { children: children.map(child => copyWithIds(child, taken)) }) }
}

// A copy just below and right of the layer, above it, with ids of its own.
export const duplicateLayer = (scene: Scene, id: string): { scene: Scene; id: string } | null => {
  const layer = layerOf(scene, id)
  if (layer === null) return null
  const taken = new Set(layersOf(scene.nodes).map(l => l.id))
  const copy = { ...copyWithIds(layer, taken), x: clamp(layer.x + 16, -LIMITS.place, LIMITS.place), y: clamp(layer.y + 16, -LIMITS.place, LIMITS.place) }
  const after = (nodes: readonly Layer[]): Layer[] =>
    nodes.flatMap(each => {
      if (each.id === id) return [each, copy]
      const children = childrenOf(each)

      return children.length === 0 ? [each] : [{ ...each, children: after(children) }]
    })

  return { scene: { ...scene, nodes: after(scene.nodes) }, id: copy.id }
}

// Tab's order: every layer, parents before what they hold.
export const stepFrom = (scene: Scene, id: string | null, back: boolean): string | null => {
  const ids = layersOf(scene.nodes).map(l => l.id)
  if (ids.length === 0) return null
  const at = id === null ? -1 : ids.indexOf(id)
  if (at === -1) return back ? ids.at(-1)! : ids[0]!

  return ids[(at + (back ? ids.length - 1 : 1)) % ids.length]!
}

// A text grows with what it says, so only its width has handles.
export const handlesOf = (selected: string, layer: Layer | null): Handle[] => {
  if (selected === DESIGN_FRAME) return ['e', 's', 'se']
  if (layer !== null && isText(layer)) return ['e', 'w']

  return ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
}
