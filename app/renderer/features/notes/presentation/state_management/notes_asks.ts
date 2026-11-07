import { useEffect, useRef } from 'preact/hooks'

export type NotesAsk = { kind: 'new' } | { kind: 'open'; id: string } | { kind: 'jot'; text: string; isOpening: boolean }

// ⇧⌘N and the palette work from every screen. The app opens Notes and asks
// here; the Notes page acts as soon as it is there to hear it. Only the latest
// ask waits.
let waiting: NotesAsk | null = null
const listeners = new Set<(ask: NotesAsk) => void>()

export const askNotes = (ask: NotesAsk): void => {
  if (listeners.size === 0) waiting = ask
  else for (const heard of listeners) heard(ask)
}

export const useNotesAsks = (onAsk: (ask: NotesAsk) => void): void => {
  const latest = useRef(onAsk)
  latest.current = onAsk
  useEffect(() => {
    const heard = (ask: NotesAsk) => latest.current(ask)
    listeners.add(heard)
    if (waiting !== null) {
      const ask = waiting
      waiting = null
      heard(ask)
    }

    return () => void listeners.delete(heard)
  }, [])
}
