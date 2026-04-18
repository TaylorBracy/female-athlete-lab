import { useLayoutEffect, useState } from 'react'

import { authorizeAnkleInsightRead } from './ankleInsightGate'
import {
  FEATURED_INSIGHT,
  HOMEPAGE_INSIGHT_PREVIEWS,
  formatBlogSerialLabel,
  type HomepageInsightPreview,
} from './featuredInsight'
import { primeInsightPdf } from './insightPdfCache'
import type { NavigateFn } from './navigation'
import { type Pillar } from './articlesData'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

function warmInsightRoute() {
  void import('pdfjs-dist')
  primeInsightPdf(FEATURED_INSIGHT.pdfUrl)
}

function warmInsightPreviewPdf(preview: HomepageInsightPreview) {
  void import('pdfjs-dist')
  primeInsightPdf(preview.pdfUrl)
}

function openHomepageInsightPreview(
  navigate: NavigateFn,
  preview: HomepageInsightPreview,
) {
  if (preview.viewerPath === FEATURED_INSIGHT.viewerPath) {
    authorizeAnkleInsightRead()
  }
  navigate(preview.viewerPath)
}

function PillarPill({
  pillar,
  tone,
  selected,
  onToggle,
}: {
  pillar: Pillar
  tone: 'pink' | 'violet'
  selected: boolean
  onToggle: () => void
}) {
  const inactiveClasses =
    tone === 'pink'
      ? `border-pink-300/60 bg-white/95 text-pink-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-pink-400/90 hover:shadow-[0_0_32px_rgba(244,114,182,0.22)] hover:-translate-y-0.5 ${easeFluid}`
      : `border-fuchsia-300/60 bg-white/95 text-fuchsia-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-fuchsia-400/90 hover:shadow-[0_0_32px_rgba(217,70,239,0.2)] hover:-translate-y-0.5 ${easeFluid}`

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`font-mono-ui rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-500 ${easeFluid} ${
        selected
          ? 'border-pink-500 bg-pink-600 text-white shadow-[0_0_32px_rgba(219,39,119,0.4)] scale-[1.02]'
          : inactiveClasses
      }`}
    >
      {pillar}
    </button>
  )
}

export default function HomePage({ navigate }: { navigate: NavigateFn }) {
  const [selectedFilterPillars, setSelectedFilterPillars] = useState<Set<Pillar>>(
    () => new Set(),
  )
  const [thumbFailedSerials, setThumbFailedSerials] = useState(
    () => new Set<number>(),
  )

  useLayoutEffect(() => {
    warmInsightRoute()
  }, [])

  const articleCount = HOMEPAGE_INSIGHT_PREVIEWS.length
  const barPercent = Math.min(100, (articleCount / 20) * 100)

  function toggleFilterPillar(pillar: Pillar) {
    setSelectedFilterPillars((prev) => {
      const next = new Set(prev)
      if (next.has(pillar)) next.delete(pillar)
      else next.add(pillar)
      return next
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#181416] text-stone-200">
      <div
        className="animate-mesh pointer-events-none absolute -left-1/3 -top-1/4 h-[75vh] w-[75vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.22)_0%,transparent_68%)] blur-[100px]"
        aria-hidden
      />
      <div
        className="animate-mesh pointer-events-none absolute -right-1/3 top-[20%] h-[65vh] w-[65vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.14)_0%,transparent_65%)] blur-[90px] [animation-delay:-8s]"
        aria-hidden
      />
      <div
        className="animate-mesh pointer-events-none absolute bottom-0 left-1/2 h-[50vh] w-[90vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(251,113,133,0.08)_0%,transparent_55%)] blur-[80px] [animation-delay:-4s]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,transparent_0%,#181416_78%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1] [mask-image:linear-gradient(to_bottom,transparent_0%,black_42%,black)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          transform: 'perspective(520px) rotateX(58deg) scale(1.35)',
          transformOrigin: '50% 0%',
        }}
        aria-hidden
      />

      <div
        className="animate-grid-scroll pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(231, 229, 228, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(231, 229, 228, 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/50 to-transparent blur-[1px]"
        aria-hidden
      />

      <div className={`relative z-10 mx-auto max-w-7xl px-5 sm:px-6 ${easeFluid}`}>
        <header className="flex flex-col gap-5 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono-ui text-[11px] font-medium tracking-[0.12em] text-pink-400/95">
              Performance · Rehab · Data · Women&apos;s Sports
            </p>
            <h1 className="mt-3 bg-gradient-to-br from-white via-pink-50 to-fuchsia-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              The Female Athlete Lab
            </h1>
            <p className="mt-3 max-w-md text-sm leading-[1.65] text-stone-400">
              Engineered insight for the next era of play.
            </p>
          </div>

          <div
            className={`font-mono-ui flex items-center gap-2.5 self-start rounded-full border border-pink-400/30 bg-white/[0.08] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-pink-50 shadow-[0_8px_40px_rgba(244,114,182,0.15)] backdrop-blur-xl transition-all duration-500 hover:border-pink-400/50 hover:bg-white/[0.12] sm:self-auto ${easeFluid}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-35" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.95)]" />
            </span>
            Live stream
          </div>
        </header>

        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/25 to-transparent"
          aria-hidden
        />

        {/* Insights — homepage preview cards only; full piece on /insights/... */}
        <section className="py-8 lg:py-10" aria-labelledby="insights-heading">
          <h2
            id="insights-heading"
            className="font-mono-ui text-[10px] font-semibold uppercase tracking-[0.28em] text-pink-400/90"
          >
            Insights
          </h2>
          <div className="mt-4 flex flex-col gap-5">
            {HOMEPAGE_INSIGHT_PREVIEWS.map((preview) => {
              const thumbFailed = thumbFailedSerials.has(preview.blogSerial)
              return (
                <article
                  key={preview.blogSerial}
                  className={`relative overflow-hidden rounded-2xl border border-pink-500/[0.14] bg-[#0d0c0d] shadow-[0_28px_72px_-28px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(244,114,182,0.12)] ${easeFluid}`}
                >
                  <p className="pointer-events-none absolute right-5 top-5 z-20 font-mono-ui text-[9px] font-medium uppercase tracking-[0.42em] text-pink-400/80 sm:right-7 sm:top-6">
                    {formatBlogSerialLabel(preview.blogSerial)}
                  </p>
                  <div className="grid gap-0 md:grid-cols-[minmax(0,220px)_1fr] lg:grid-cols-[minmax(0,260px)_1fr]">
                    <div className="relative aspect-[16/10] border-b border-white/[0.06] bg-[#141214] md:border-b-0 md:border-r md:border-white/[0.06] md:aspect-auto md:min-h-[200px]">
                      {!thumbFailed ? (
                        <img
                          src={preview.thumbnailUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-[0.92]"
                          loading="lazy"
                          onError={() =>
                            setThumbFailedSerials((prev) => {
                              const next = new Set(prev)
                              next.add(preview.blogSerial)
                              return next
                            })
                          }
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center bg-[#141214]"
                          aria-hidden
                        >
                          <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-[0.35em] text-pink-500/35">
                            Lab
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative flex flex-col justify-center gap-5 p-6 sm:p-8">
                      <p className="font-mono-ui max-w-xl text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-stone-500">
                        {preview.category}
                      </p>
                      <h3 className="text-balance pr-16 text-xl font-semibold leading-snug tracking-tight text-white sm:pr-20 sm:text-2xl">
                        {preview.title}
                      </h3>
                      <p className="max-w-xl text-pretty text-sm leading-relaxed text-stone-400 sm:text-[0.9375rem]">
                        {preview.description}
                      </p>
                      <div>
                        <a
                          href={preview.viewerPath}
                          onMouseEnter={() => warmInsightPreviewPdf(preview)}
                          onFocus={() => warmInsightPreviewPdf(preview)}
                          onClick={(e) => {
                            e.preventDefault()
                            openHomepageInsightPreview(navigate, preview)
                          }}
                          className={`font-mono-ui inline-flex items-center justify-center rounded-full border border-white/[0.14] bg-transparent px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/95 transition-[border-color,background-color,color,box-shadow] duration-500 hover:border-pink-400/45 hover:bg-pink-500/[0.07] hover:shadow-[0_0_28px_-8px_rgba(244,114,182,0.35)] ${easeFluid}`}
                        >
                          Read Now
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className={`mx-auto max-w-xl pb-16 ${easeFluid}`}>
          <aside className={`flex flex-col gap-7 ${easeFluid}`}>
            <div className="rounded-[2rem] border border-pink-200/45 bg-gradient-to-br from-white/[0.94] via-pink-50/35 to-fuchsia-100/25 p-7 shadow-[0_28px_70px_-28px_rgba(217,70,239,0.28)] backdrop-blur-2xl transition-all duration-700 hover:border-pink-200/70 hover:shadow-[0_36px_80px_-24px_rgba(217,70,239,0.34)]">
              <h3 className="font-mono-ui text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-900">
                Pillars
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Select one or more pillars. When more pieces ship, they will filter by{' '}
                <strong>any</strong> match. Tap again to deselect.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <PillarPill
                  pillar="Performance"
                  tone="pink"
                  selected={selectedFilterPillars.has('Performance')}
                  onToggle={() => toggleFilterPillar('Performance')}
                />
                <PillarPill
                  pillar="Rehab"
                  tone="violet"
                  selected={selectedFilterPillars.has('Rehab')}
                  onToggle={() => toggleFilterPillar('Rehab')}
                />
                <PillarPill
                  pillar="Data"
                  tone="pink"
                  selected={selectedFilterPillars.has('Data')}
                  onToggle={() => toggleFilterPillar('Data')}
                />
                <PillarPill
                  pillar="Women's Sports"
                  tone="violet"
                  selected={selectedFilterPillars.has("Women's Sports")}
                  onToggle={() => toggleFilterPillar("Women's Sports")}
                />
              </div>
              {selectedFilterPillars.size > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelectedFilterPillars(new Set())}
                  className="font-mono-ui mt-4 w-full rounded-xl border border-stone-300 bg-stone-50 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-700 transition-colors hover:bg-stone-100"
                >
                  Clear pillar filters
                </button>
              ) : null}
            </div>

            <div
              role="region"
              aria-label="Article index"
              className="rounded-[2rem] border border-pink-200/40 bg-gradient-to-br from-white/[0.93] via-fuchsia-50/25 to-pink-50/30 p-6 font-mono-ui text-[10px] uppercase tracking-widest text-stone-500 shadow-[0_20px_55px_-22px_rgba(217,70,239,0.18)] backdrop-blur-xl transition-all duration-500 hover:border-pink-200/65"
            >
              <div className="flex justify-between text-pink-700">
                <span>Articles</span>
                <span className="tabular-nums">{articleCount}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100/90">
                <div
                  className="animate-bar-glow h-full rounded-full bg-gradient-to-r from-pink-500 via-pink-400 to-fuchsia-500 transition-[width] duration-500 ease-out"
                  style={{ width: `${barPercent}%` }}
                />
              </div>
              <p className="mt-4 text-[9px] leading-relaxed tracking-[0.14em] text-stone-500 normal-case">
                Total pieces in the archive.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
