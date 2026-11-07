import { useEffect, useRef } from 'preact/hooks'

// ⇧⌘N works from every screen. The app opens Notes and asks here; the Notes
// page makes the note as soon as it is there to hear it.
let isWaiting = false
const listeners = new Set<() => void>()

export const askForNewNote = (): void => {
  if (listeners.size === 0) isWaiting = true
  else for (const heard of listeners) heard()
}

export const useNewNoteAsks = (onAsk: () => void): void => {
  const latest = useRef(onAsk)
  latest.current = onAsk
  useEffect(() => {
    const heard = () => latest.current()
    listeners.add(heard)
    if (isWaiting) {
      isWaiting = false
      heard()
    }

    return () => void listeners.delete(heard)
  }, [])
}
