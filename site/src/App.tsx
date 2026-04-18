import { FEATURED_INSIGHT } from './featuredInsight'
import HomePage from './HomePage'
import PdfInsightPage from './PdfInsightPage'

function normalizePath(pathname: string) {
  const p = pathname || '/'
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}

export default function App() {
  const path =
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)

  if (path === FEATURED_INSIGHT.viewerPath) {
    return <PdfInsightPage />
  }

  return <HomePage />
}
