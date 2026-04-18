import { clearAnkleInsightRead } from './ankleInsightGate'
import type { NavigateFn } from './navigation'
import { FEATURED_INSIGHT } from './featuredInsight'
import PdfInsightCanvas from './PdfInsightCanvas'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

export default function PdfInsightPage({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#141210] text-stone-200">
      <div className="fixed left-0 right-0 top-0 z-50 flex items-start px-[max(0.75rem,env(safe-area-inset-left))] pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            clearAnkleInsightRead()
            navigate('/')
          }}
          className={`font-mono-ui pointer-events-auto rounded-lg border border-[#e8e6e1]/12 bg-[#181416]/92 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8e6e1] shadow-[0_8px_28px_-8px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:text-[#f5f3ef] ${easeFluid}`}
        >
          ← Lab
        </a>
      </div>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <div className="flex w-full min-w-0 flex-1 flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[calc(2.75rem+env(safe-area-inset-top))]">
          <PdfInsightCanvas pdfUrl={FEATURED_INSIGHT.pdfUrl} />
        </div>
      </main>
    </div>
  )
}
