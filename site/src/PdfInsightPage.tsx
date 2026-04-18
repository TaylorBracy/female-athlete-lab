import { useLayoutEffect } from 'react'

import { clearAnkleInsightRead } from './ankleInsightGate'
import type { NavigateFn } from './navigation'
import { FEATURED_INSIGHT } from './featuredInsight'
import { invalidateFeaturedInsightPdfCache } from './insightPdfCache'
import PdfInsightCanvas from './PdfInsightCanvas'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

/** Reader-only surface: neutral off-white (no rose/beige tint). */
const readerBg = '#faf9f6'

export default function PdfInsightPage({ navigate }: { navigate: NavigateFn }) {
  useLayoutEffect(() => {
    if (import.meta.env.DEV) invalidateFeaturedInsightPdfCache()
  }, [])

  useLayoutEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor
    const prevBody = document.body.style.backgroundColor
    document.documentElement.style.backgroundColor = readerBg
    document.body.style.backgroundColor = readerBg
    return () => {
      document.documentElement.style.backgroundColor = prevHtml
      document.body.style.backgroundColor = prevBody
    }
  }, [])

  return (
    <div
      className="flex min-h-dvh flex-col text-stone-900 antialiased"
      style={{ backgroundColor: readerBg }}
    >
      <div className="fixed left-0 right-0 top-0 z-50 flex items-start px-[max(0.75rem,env(safe-area-inset-left))] pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            clearAnkleInsightRead()
            navigate('/')
          }}
          className={`font-mono-ui pointer-events-auto rounded-full bg-[#faf9f6]/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_20px_-6px_rgba(0,0,0,0.08)] backdrop-blur-md transition-[background-color,box-shadow] hover:bg-white/85 ${easeFluid}`}
        >
          ← Lab
        </a>
      </div>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <div
          className="mx-auto flex w-full min-w-0 max-w-[min(100%,42.5rem)] flex-1 flex-col px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[calc(3rem+env(safe-area-inset-top))] sm:px-8"
          style={{ backgroundColor: readerBg }}
        >
          <PdfInsightCanvas pdfUrl={FEATURED_INSIGHT.pdfUrl} />
        </div>
      </main>
    </div>
  )
}
