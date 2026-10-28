import { useCallback, useEffect, useState } from 'react'
import {
  parseHash,
  routeToHash,
  type Route,
} from '@/lib/router'

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  )
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash))
      setCanGoBack(true)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback(
    (next: Route, options?: { replace?: boolean }) => {
      const hash = routeToHash(next)
      if (options?.replace) {
        window.history.replaceState(null, '', hash)
        setRoute(next)
        return
      }
      if (window.location.hash === hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      window.location.hash = hash
    },
    [],
  )

  return { route, navigate, canGoBack }
}
