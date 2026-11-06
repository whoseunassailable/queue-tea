import { describe, expect, it } from 'vitest'

import { layersOf } from '../../../../shared/designs'
import type { Layer, Scene } from '../../../../shared/designs'
import { DESIGN_FRAME, duplicateLayer, handlesOf, layerOf, moveBy, parentOf, placeOf, removeLayer, resizeBox, stepFrom, updateLayer } from './scene_edits'
import type { Box, Handle } from './scene_edits'

const text = (id: string, name: string, x: number, y: number): Layer => ({ id, type: 'text', name, x, y, width: 310, text: name, font: 'Nunito Sans', size: 15, weight: 400, color: '#1B6650' })
const frame = (id: string, name: string, x: number, y: number, width: number, height: number, children: Layer[] = []): Layer => ({ id, type: 'frame', name, x, y, width, height, fill: '#DDF2E8', radius: 12, children })

// Hero holds the sun; the tip card holds its title; the chart is a layer
// type the editor doesn't know, with a field of its own.
const SCENE: Scene = {
  format: 1,
  name: 'Welcome',
  width: 390,
  height: 844,
  fill: '#F6F1E7',
  grid: { size: 8 },
  nodes: [
    frame('hero', 'Hero', 0, 0, 390, 420, [frame('sun', 'Sun', 250, 60, 90, 90)]),
    text('headline', 'Headline', 24, 293),
    frame('tip', 'Tip card', 24, 467, 342, 104, [text('tip-title', 'Tip title', 16, 16)]),
    { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] },
  ],
}

const ids = (scene: Scene) => layersOf(scene.nodes).map(l => l.id)

describe('finding a layer', () => {
  it('finds a layer at any depth, and none that is gone', () => {
    expect(layerOf(SCENE, 'tip-title')?.name).toBe('Tip title')
    expect(layerOf(SCENE, 'gone')).toBeNull()
  })

  it('names the layer it sits in, and none at the top', () => {
    expect(parentOf(SCENE, 'sun')).toBe('hero')
    expect(parentOf(SCENE, 'hero')).toBeNull()
    expect(parentOf(SCENE, 'gone')).toBeNull()
  })

  it('places a nested layer by adding up its parents', () => {
    expect(placeOf(SCENE, 'sun')).toEqual({ x: 250, y: 60 })
    expect(placeOf(SCENE, 'tip-title')).toEqual({ x: 40, y: 483 })
    expect(placeOf(SCENE, 'gone')).toBeNull()
  })
})

describe('changing a layer', () => {
  it('changes only the fields given, and keeps the rest', () => {
    const after = updateLayer(SCENE, 'chart', { x: 40 })

    expect(layerOf(after, 'chart')).toEqual({ ...SCENE.nodes[3], x: 40 })
  })

  it('changes a nested layer and leaves its neighbours alone', () => {
    const after = updateLayer(SCENE, 'sun', { width: 120 })

    expect(layerOf(after, 'sun')?.width).toBe(120)
    expect(layerOf(after, 'hero')?.width).toBe(390)
    expect(layerOf(after, 'tip')).toEqual(layerOf(SCENE, 'tip'))
  })

  it('changes the design frame itself', () => {
    const after = updateLayer(SCENE, DESIGN_FRAME, { fill: '#000000' } as Partial<Layer>)

    expect(after.fill).toBe('#000000')
    expect(after.grid).toEqual({ size: 8 })
    expect(after.nodes).toBe(SCENE.nodes)
  })

  it('leaves the scene it was given as it was, so undo can go back to it', () => {
    updateLayer(SCENE, 'sun', { width: 120 })
    moveBy(SCENE, 'headline', 5, 5)
    removeLayer(SCENE, 'tip')

    expect(layerOf(SCENE, 'sun')?.width).toBe(90)
    expect(layerOf(SCENE, 'headline')?.x).toBe(24)
    expect(layerOf(SCENE, 'tip')).not.toBeNull()
  })
})

describe('moving', () => {
  it('moves by whole pixels', () => {
    expect(layerOf(moveBy(SCENE, 'headline', 10.4, -3.6), 'headline')).toMatchObject({ x: 34, y: 289 })
  })

  it('moves a nested layer within its parent', () => {
    const after = moveBy(SCENE, 'sun', -10, 0)

    expect(layerOf(after, 'sun')?.x).toBe(240)
    expect(layerOf(after, 'hero')?.x).toBe(0)
  })

  it('stops at 10,000 either way', () => {
    expect(layerOf(moveBy(SCENE, 'headline', 20_000, -20_000), 'headline')).toMatchObject({ x: 10_000, y: -10_000 })
  })

  it('leaves the scene alone for a layer that is gone', () => {
    expect(moveBy(SCENE, 'gone', 5, 5)).toBe(SCENE)
  })
})

describe('resizing by a handle', () => {
  const START: Box = { x: 10, y: 20, width: 100, height: 50 }

  it.each<[Handle, Box]>([
    ['e', { x: 10, y: 20, width: 110, height: 50 }],
    ['w', { x: 20, y: 20, width: 90, height: 50 }],
    ['s', { x: 10, y: 20, width: 100, height: 55 }],
    ['n', { x: 10, y: 25, width: 100, height: 45 }],
    ['se', { x: 10, y: 20, width: 110, height: 55 }],
    ['sw', { x: 20, y: 20, width: 90, height: 55 }],
    ['ne', { x: 10, y: 25, width: 110, height: 45 }],
    ['nw', { x: 20, y: 25, width: 90, height: 45 }],
  ])('the %s handle dragged right 10 and down 5 gives %j', (handle, box) => {
    expect(resizeBox(START, handle, 10, 5, false)).toEqual(box)
  })

  it('never makes a box smaller than 1 px, and keeps the far side still', () => {
    expect(resizeBox(START, 'w', 500, 0, false)).toEqual({ x: 109, y: 20, width: 1, height: 50 })
    expect(resizeBox(START, 'n', 0, 500, false)).toEqual({ x: 10, y: 69, width: 100, height: 1 })
    expect(resizeBox(START, 'se', -500, -500, false)).toEqual({ x: 10, y: 20, width: 1, height: 1 })
  })

  it('never makes a box larger than 10,000 px', () => {
    expect(resizeBox(START, 'se', 20_000, 20_000, false)).toMatchObject({ width: 10_000, height: 10_000 })
  })

  describe('keeping proportions', () => {
    it('lets the side that moved most lead a corner', () => {
      expect(resizeBox(START, 'se', 50, 0, true)).toEqual({ x: 10, y: 20, width: 150, height: 75 })
      expect(resizeBox(START, 'se', 0, 50, true)).toEqual({ x: 10, y: 20, width: 200, height: 100 })
    })

    it('makes the other side follow a side handle', () => {
      expect(resizeBox(START, 'e', 20, 0, true)).toMatchObject({ width: 120, height: 60 })
      expect(resizeBox(START, 's', 0, 10, true)).toMatchObject({ width: 120, height: 60 })
    })

    it('keeps the opposite corner still from the north-west', () => {
      expect(resizeBox(START, 'nw', -50, 0, true)).toEqual({ x: -40, y: -5, width: 150, height: 75 })
    })

    it('does nothing odd with a box of no size', () => {
      const box = resizeBox({ x: 0, y: 0, width: 0, height: 0 }, 'se', 10, 10, true)

      expect(box).toEqual({ x: 0, y: 0, width: 10, height: 10 })
    })
  })
})

describe('deleting', () => {
  it('removes a layer at the top', () => {
    expect(ids(removeLayer(SCENE, 'headline'))).toEqual(['hero', 'sun', 'tip', 'tip-title', 'chart'])
  })

  it('removes a nested layer and keeps its parent', () => {
    expect(ids(removeLayer(SCENE, 'sun'))).toEqual(['hero', 'headline', 'tip', 'tip-title', 'chart'])
  })

  it('removes a frame with everything in it', () => {
    expect(ids(removeLayer(SCENE, 'tip'))).toEqual(['hero', 'sun', 'headline', 'chart'])
  })

  it('changes nothing for a layer that is gone', () => {
    expect(ids(removeLayer(SCENE, 'gone'))).toEqual(ids(SCENE))
  })
})

describe('duplicating', () => {
  it('puts the copy just above the layer, 16 px right and down', () => {
    const copied = duplicateLayer(SCENE, 'headline')!

    expect(copied.scene.nodes.map(l => l.id)).toEqual(['hero', 'headline', copied.id, 'tip', 'chart'])
    expect(layerOf(copied.scene, copied.id)).toMatchObject({ x: 40, y: 309, text: 'Headline' })
  })

  it('gives the copy and everything in it ids of their own', () => {
    const copied = duplicateLayer(SCENE, 'tip')!
    const all = ids(copied.scene)

    expect(new Set(all).size).toBe(all.length)
    expect(copied.id).not.toBe('tip')
    expect(layerOf(copied.scene, copied.id)?.children).toHaveLength(1)
  })

  it('gives each of two copies its own id', () => {
    const once = duplicateLayer(SCENE, 'headline')!
    const twice = duplicateLayer(once.scene, 'headline')!
    const all = ids(twice.scene)

    expect(new Set(all).size).toBe(all.length)
    expect(twice.id).not.toBe(once.id)
  })

  it('keeps the fields of a layer it does not know, as a copy of their own', () => {
    const copied = duplicateLayer(SCENE, 'chart')!
    const copy = layerOf(copied.scene, copied.id)!

    expect(copy).toMatchObject({ type: 'chart', series: [1, 2, 3], height: 60 })
    ;(copy.series as number[]).push(4)
    expect(layerOf(copied.scene, 'chart')?.series).toEqual([1, 2, 3])
  })

  it('copies a nested layer inside the same parent', () => {
    const copied = duplicateLayer(SCENE, 'sun')!

    expect(parentOf(copied.scene, copied.id)).toBe('hero')
  })

  it('names a copy of a nameless layer from its id', () => {
    const nameless = updateLayer(SCENE, 'headline', { name: '' })

    expect(duplicateLayer(nameless, 'headline')!.id).toBe('headline-2')
  })

  it('has nothing to copy for a layer that is gone', () => {
    expect(duplicateLayer(SCENE, 'gone')).toBeNull()
  })
})

describe('Tab through the layers', () => {
  it('starts at the first layer, or the last going back', () => {
    expect(stepFrom(SCENE, null, false)).toBe('hero')
    expect(stepFrom(SCENE, null, true)).toBe('chart')
  })

  it('goes parents first, then what they hold', () => {
    expect(stepFrom(SCENE, 'hero', false)).toBe('sun')
    expect(stepFrom(SCENE, 'sun', false)).toBe('headline')
    expect(stepFrom(SCENE, 'tip', false)).toBe('tip-title')
  })

  it('wraps round both ways', () => {
    expect(stepFrom(SCENE, 'chart', false)).toBe('hero')
    expect(stepFrom(SCENE, 'hero', true)).toBe('chart')
  })

  it('starts again from a layer that is gone', () => {
    expect(stepFrom(SCENE, 'gone', false)).toBe('hero')
  })

  it('has nowhere to go in an empty design', () => {
    expect(stepFrom({ ...SCENE, nodes: [] }, null, false)).toBeNull()
  })
})

describe('the handles', () => {
  it('gives the design frame only its right and bottom edges', () => {
    expect(handlesOf(DESIGN_FRAME, null)).toEqual(['e', 's', 'se'])
  })

  it('gives a text only its width, since it grows with what it says', () => {
    expect(handlesOf('headline', layerOf(SCENE, 'headline'))).toEqual(['e', 'w'])
  })

  it('gives a frame and an unknown layer all eight', () => {
    expect(handlesOf('tip', layerOf(SCENE, 'tip'))).toHaveLength(8)
    expect(handlesOf('chart', layerOf(SCENE, 'chart'))).toHaveLength(8)
  })
})
