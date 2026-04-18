import { FEATURED_INSIGHT } from './featuredInsight'
import PdfInsightCanvas from './PdfInsightCanvas'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

export default function PdfInsightPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#141210] text-stone-200">
      <div className="fixed left-0 right-0 top-0 z-50 flex items-start justify-between gap-3 px-[max(0.75rem,env(safe-area-inset-left))] pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <a
          href="/"
          className={`font-mono-ui pointer-events-auto rounded-lg border border-white/10 bg-[#181416]/92 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-300/95 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:text-pink-100 ${easeFluid}`}
        >
          ← Lab
        </a>
        <a
          href={FEATURED_INSIGHT.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-mono-ui pointer-events-auto rounded-lg border border-white/10 bg-[#181416]/92 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-300/95 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:text-pink-100 ${easeFluid}`}
        >
          Open PDF
        </a>
      </div>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <div className="flex w-full min-w-0 flex-1 flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[calc(2.75rem+env(safe-area-inset-top))]">
          <PdfInsightCanvas pdfUrl={FEATURED_INSIGHT.pdfUrl} />
          <p className="font-mono-ui mt-4 px-[max(0.75rem,env(safe-area-inset-left))] text-center text-[9px] text-stone-500 pr-[max(0.75rem,env(safe-area-inset-right))]">
            Trouble viewing?{' '}
            <a
              href={FEATURED_INSIGHT.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 underline decoration-pink-500/40 underline-offset-2 hover:text-pink-300"
            >
              Open the PDF
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
