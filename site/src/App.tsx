import { useCallback, useEffect, useState } from 'react'

import {
  isAnkleInsightReadAuthorized,
} from './ankleInsightGate'
import { FEATURED_INSIGHT } from './featuredInsight'
import HomePage from './HomePage'
import type { NavigateFn } from './navigation'
import PdfInsightPage from './PdfInsightPage'

function normalizePath(pathname: string) {
  const p = pathname || '/'
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}

function syncPathFromLocation(): string {
  let p = normalizePath(window.location.pathname)
  if (
    p === FEATURED_INSIGHT.viewerPath &&
    !isAnkleInsightReadAuthorized()
  ) {
    window.history.replaceState({}, '', '/')
    p = '/'
  }
  return p
}

export default function App() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : syncPathFromLocation(),
  )

  useEffect(() => {
    const onPop = () => {
      setPath(syncPathFromLocation())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback<NavigateFn>((to) => {
    const next = normalizePath(to)
    if (
      next === FEATURED_INSIGHT.viewerPath &&
      !isAnkleInsightReadAuthorized()
    ) {
      return
    }
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
