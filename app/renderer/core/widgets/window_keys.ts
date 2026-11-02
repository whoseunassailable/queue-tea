import { useLayoutEffect, useRef } from 'preact/hooks'

// Listens for keys on the whole window. An ordinary effect runs some time after
// painting, so a listener rebuilt on every render still holds the last render's
// values for a moment, and a key pressed right after changing rows acts on the
// row before; a new one misses what's pressed first. This one attaches as the
// screen commits, and always calls the newest handler, set while rendering.
export const useWindowKeys = (onKey: (event: KeyboardEvent) => void) => {
  const latest = useRef(onKey)
  latest.current = onKey
  useLayoutEffect(() => {
    const heard = (event: KeyboardEvent) => latest.current(event)
    window.addEventListener('keydown', heard)

    return () => window.removeEventListener('keydown', heard)
  }, [])
}
