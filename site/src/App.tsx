import { useCallback, useEffect, useState } from 'react'

import { FEATURED_INSIGHT } from './featuredInsight'
import HomePage from './HomePage'
import type { NavigateFn } from './navigation'
import PdfInsightPage from './PdfInsightPage'

function normalizePath(pathname: string) {
  const p = pathname || '/'
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}

export default function App() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname),
  )

  useEffect(() => {
    const onPop = () =>
      setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback<NavigateFn>((to) => {
    const next = normalizePath(to)
    if (normalizePath(window.location.pathname) !== next) {
      window.history.pushState({}, '', to)
    }
    setPath(next)
  }, [])

  if (path === FEATURED_INSIGHT.viewerPath) {
    return <PdfInsightPage navigate={navigate} />
  }

  return <HomePage navigate={navigate} />
}
