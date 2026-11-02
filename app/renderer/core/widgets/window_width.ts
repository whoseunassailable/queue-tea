import { useEffect, useState } from 'preact/hooks'

// The window's width, for the layouts CSS can't decide alone.
export const useWindowWidth = (): number => {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const heard = () => setWidth(window.innerWidth)
    window.addEventListener('resize', heard)

    return () => window.removeEventListener('resize', heard)
  }, [])

  return width
}
