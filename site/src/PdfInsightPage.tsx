import { FEATURED_INSIGHT } from './featuredInsight'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

export default function PdfInsightPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#181416] text-stone-200">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#181416]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
          <a
            href="/"
            className={`font-mono-ui shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-pink-300/95 transition-colors hover:text-pink-100 ${easeFluid}`}
          >
            ← The Female Athlete Lab
          </a>
          <p className="min-w-0 flex-1 text-center font-mono-ui text-[9px] uppercase tracking-widest text-stone-500 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:text-center">
            Insight
          </p>
          <a
            href={FEATURED_INSIGHT.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono-ui shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-300/95 transition-colors hover:text-pink-100 ${easeFluid}`}
          >
            Open PDF
          </a>
        </div>
      </header>

      <iframe
        title={FEATURED_INSIGHT.title}
        src={FEATURED_INSIGHT.pdfUrl}
        className="min-h-[calc(100vh-3.5rem)] w-full flex-1 border-0 bg-stone-900"
      />

      <p className="border-t border-white/10 px-5 py-3 text-center font-mono-ui text-[9px] text-stone-500">
        PDF not loading?{' '}
        <a
          href={FEATURED_INSIGHT.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 underline decoration-pink-500/40 underline-offset-2 hover:text-pink-300"
        >
          Open in a new tab
        </a>
        .
      </p>
    </div>
  )
}
