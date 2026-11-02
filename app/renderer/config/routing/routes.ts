import { useEffect, useState } from 'preact/hooks'

// Every route in the app. A path is lowercase words naming the screen.
export const ROUTES = { home: '/home', quests: '/quests' } as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]

export const routeOf = (hash: string): Route => (hash.slice(1) === ROUTES.quests ? ROUTES.quests : ROUTES.home)

export const hrefOf = (route: Route): string => `#${route}`

export const useRoute = (): Route => {
  const [route, setRoute] = useState(() => routeOf(window.location.hash))
  useEffect(() => {
    const heard = () => setRoute(routeOf(window.location.hash))
    window.addEventListener('hashchange', heard)

    return () => window.removeEventListener('hashchange', heard)
  }, [])

  return route
}
