import type { Scene } from '../../../../shared/designs'

const STEPS = 200

// One design's undo and redo, for as long as that design stays open.
export type History = { past: Scene[]; present: Scene; future: Scene[] }

export const historyOf = (scene: Scene): History => ({ past: [], present: scene, future: [] })

export const commit = (h: History, next: Scene): History => (next === h.present ? h : { past: [...h.past, h.present].slice(-STEPS), present: next, future: [] })

export const undo = (h: History): History => (h.past.length === 0 ? h : { past: h.past.slice(0, -1), present: h.past.at(-1)!, future: [h.present, ...h.future] })

export const redo = (h: History): History => (h.future.length === 0 ? h : { past: [...h.past, h.present], present: h.future[0]!, future: h.future.slice(1) })
