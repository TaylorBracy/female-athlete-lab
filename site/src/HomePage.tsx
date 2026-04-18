import { useLayoutEffect, useState } from 'react'

import { authorizeAnkleInsightRead } from './ankleInsightGate'
import { FEATURED_INSIGHT } from './featuredInsight'
import { primeInsightPdf } from './insightPdfCache'
import type { NavigateFn } from './navigation'
import { type Pillar } from './articlesData'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

/** One published PDF insight in the archive. */
const PUBLISHED_INSIGHT_COUNT = 1

function warmInsightRoute() {
  void import('pdfjs-dist')
  primeInsightPdf(FEATURED_INSIGHT.pdfUrl)
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
  const [thumbFailed, setThumbFailed] = useState(false)

  useLayoutEffect(() => {
    warmInsightRoute()
  }, [])

  const articleCount = PUBLISHED_INSIGHT_COUNT
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
        className="animate-mesh pointer-events-none absolute -left-1/3 -top-1/4 h-[75vh] w-[75vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.3)_0%,transparent_68%)] blur-[100px]"
        aria-hidden
      />
      <div
        className="animate-mesh pointer-events-none absolute -right-1/3 top-[20%] h-[65vh] w-[65vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.19)_0%,transparent_65%)] blur-[90px] [animation-delay:-8s]"
        aria-hidden
      />
      <div
        className="animate-mesh pointer-events-none absolute bottom-0 left-1/2 h-[50vh] w-[90vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(251,113,133,0.12)_0%,transparent_55%)] blur-[80px] [animation-delay:-4s]"
        aria-hidden
      />
      <div
        className="animate-mesh pointer-events-none absolute left-[12%] top-[38%] h-[42vh] w-[48vw] -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.09)_0%,transparent_62%)] blur-[72px] [animation-delay:-11s]"
        aria-hidden
      />
      <div
        className="animate-mesh pointer-events-none absolute right-0 top-[28%] h-[38vh] w-[42vw] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(192,38,211,0.08)_0%,transparent_58%)] blur-[78px] [animation-delay:-6s]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-5%,rgba(244,114,182,0.08)_0%,transparent_48%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,transparent_0%,#181416_78%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.38)_100%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13] [mask-image:linear-gradient(to_bottom,transparent_0%,black_42%,black)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.42) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.42) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          transform: 'perspective(520px) rotateX(58deg) scale(1.35)',
          transformOrigin: '50% 0%',
        }}
        aria-hidden
      />

      <div
        className="animate-grid-scroll pointer-events-none absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(244, 114, 182, 0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(217, 70, 239, 0.14) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/65 to-transparent blur-[1px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/25 to-transparent"
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
          className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/40 to-transparent shadow-[0_0_24px_rgba(244,114,182,0.12)]"
          aria-hidden
        />

        {/* Insights — preview only; full PDF loads only on /insights/... */}
        <section className="py-8 lg:py-10" aria-labelledby="insights-heading">
          <h2
            id="insights-heading"
            className="font-mono-ui text-[10px] font-semibold uppercase tracking-[0.28em] text-pink-400/90"
          >
            Insights
          </h2>
          <div
            className={`mt-4 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06] shadow-[0_24px_64px_-28px_rgba(0,0,0,0.55),0_0_52px_-22px_rgba(244,114,182,0.14),inset_0_1px_0_0_rgba(244,114,182,0.08)] backdrop-blur-xl ${easeFluid}`}
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,220px)_1fr] lg:grid-cols-[minmax(0,260px)_1fr]">
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[200px]">
                {!thumbFailed ? (
                  <img
                    src={FEATURED_INSIGHT.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    onError={() => setThumbFailed(true)}
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-950/90 via-[#1a1412] to-stone-950"
                    aria-hidden
                  >
                    <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-[0.35em] text-pink-300/50">
                      Lab
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                <span className="font-mono-ui w-fit rounded-full border border-pink-400/25 bg-pink-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-pink-200/90">
                  {FEATURED_INSIGHT.category}
                </span>
                <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                  {FEATURED_INSIGHT.title}
                </h3>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-stone-400 sm:text-[0.9375rem]">
                  {FEATURED_INSIGHT.description}
                </p>
                <div>
                  <a
                    href={FEATURED_INSIGHT.viewerPath}
                    onMouseEnter={warmInsightRoute}
                    onFocus={warmInsightRoute}
                    onClick={(e) => {
                      e.preventDefault()
                      authorizeAnkleInsightRead()
                      navigate(FEATURED_INSIGHT.viewerPath)
                    }}
                    className={`font-mono-ui inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 via-pink-500 to-fuchsia-600 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_36px_-8px_rgba(219,39,119,0.45)] transition-all duration-500 hover:shadow-[0_16px_44px_-6px_rgba(192,38,211,0.35)] ${easeFluid}`}
                  >
                    Read Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`mx-auto max-w-xl pb-16 ${easeFluid}`}>
          <aside className={`flex flex-col gap-7 ${easeFluid}`}>
            <div className="rounded-[2rem] border border-pink-200/45 bg-gradient-to-br from-white/[0.92] via-pink-50/38 to-fuchsia-100/28 p-7 shadow-[0_28px_70px_-28px_rgba(217,70,239,0.32),0_0_48px_-20px_rgba(244,114,182,0.12)] backdrop-blur-2xl transition-all duration-700 hover:border-pink-200/75 hover:shadow-[0_36px_80px_-24px_rgba(217,70,239,0.38),0_0_56px_-18px_rgba(244,114,182,0.16)]">
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
              className="rounded-[2rem] border border-pink-200/40 bg-gradient-to-br from-white/[0.91] via-fuchsia-50/28 to-pink-50/32 p-6 font-mono-ui text-[10px] uppercase tracking-widest text-stone-500 shadow-[0_20px_55px_-22px_rgba(217,70,239,0.22),0_0_40px_-20px_rgba(244,114,182,0.1)] backdrop-blur-xl transition-all duration-500 hover:border-pink-200/72 hover:shadow-[0_24px_60px_-20px_rgba(217,70,239,0.26),0_0_48px_-16px_rgba(244,114,182,0.14)]"
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
