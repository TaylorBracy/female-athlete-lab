import { useState } from 'react'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

const PILLARS = ['Performance', 'Rehab', 'Data', "Women's Sports"] as const
type Pillar = (typeof PILLARS)[number]

type Article = {
  id: string
  title: string
  /** Fine-grained label (subtitle). */
  category: string
  /** One or more pillars; filter matches if any overlap. */
  pillars: Pillar[]
  /** Short teaser; shown on cards when set. */
  excerpt?: string
  pdfUrl?: string
  googleDocUrl?: string
}

const INITIAL_ARTICLES: Omit<Article, 'id'>[] = [
  {
    title: 'Ankle Sprains in Female Athletes: Soccer vs. Basketball',
    category: 'Injury · Return to play',
    pillars: ['Rehab', "Women's Sports", 'Performance'],
    excerpt:
      'Soccer versus basketball: how lateral ankle sprains differ in load, surface, and footwear—and what that means for rehab.',
    pdfUrl: '/papers/ankle-sprains-female-athletes-soccer-vs-basketball.pdf',
  },
  {
    title: 'What Female Athletes Actually Need Physically',
    category: 'Training load',
    pillars: ['Performance'],
  },
  {
    title: "Why Strength Matters More in Women's Sports",
    category: 'Strength',
    pillars: ["Women's Sports"],
  },
  {
    title: "Return to Sport Isn't Just Time-Based",
    category: 'Criteria',
    pillars: ['Rehab'],
  },
  {
    title: 'What Force Plate Data Actually Tells Us',
    category: 'Lab',
    pillars: ['Data', 'Performance'],
  },
  {
    title: 'Common Movement Faults in Soccer Athletes',
    category: 'On-field',
    pillars: ['Performance'],
  },
]

function seedArticles(): Article[] {
  return INITIAL_ARTICLES.map((a, i) => ({
    ...a,
    id: `seed-${i}`,
  }))
}

/** Long-form dek for the lead story hero (first item in `INITIAL_ARTICLES`). */
const FEATURED_DEK =
  "Lateral ankle sprains are among the most common injuries in women's court and field sports. This note compares how they show up in soccer versus basketball—loading patterns, surfaces, and footwear—and what that implies for assessment, rehab sequencing, and return to play."

export default function FemaleAthleteLabWebsite() {
  const [articles] = useState<Article[]>(seedArticles)
  /** Empty = show all. Otherwise show articles whose pillars intersect this set (OR). */
  const [selectedFilterPillars, setSelectedFilterPillars] = useState<Set<Pillar>>(
    () => new Set(),
  )

  /** Editorial lead: always mirrors the first entry in the archive so copy stays in sync. */
  const leadArticle = articles[0]

  const articleCount = articles.length
  const barPercent = Math.min(100, (articleCount / 20) * 100)
  const visibleArticles =
    selectedFilterPillars.size === 0
      ? articles
      : articles.filter((a) =>
          a.pillars.some((p) => selectedFilterPillars.has(p)),
        )

  function toggleFilterPillar(pillar: Pillar) {
    setSelectedFilterPillars((prev) => {
      const next = new Set(prev)
      if (next.has(pillar)) next.delete(pillar)
      else next.add(pillar)
      return next
    })
  }

  const Pill = ({
    pillar,
    tone,
  }: {
    pillar: Pillar
    tone: 'pink' | 'violet'
  }) => {
    const selected = selectedFilterPillars.has(pillar)

    const inactiveClasses =
      tone === 'pink'
        ? `border-pink-300/60 bg-white/95 text-pink-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-pink-400/90 hover:shadow-[0_0_32px_rgba(244,114,182,0.22)] hover:-translate-y-0.5 ${easeFluid}`
        : `border-fuchsia-300/60 bg-white/95 text-fuchsia-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-fuchsia-400/90 hover:shadow-[0_0_32px_rgba(217,70,239,0.2)] hover:-translate-y-0.5 ${easeFluid}`

    return (
      <button
        type="button"
        onClick={() => toggleFilterPillar(pillar)}
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

        <section className="grid gap-7 py-10 lg:grid-cols-[1.65fr_1fr] lg:gap-10">
          <article
            className={`group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/[0.97] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_32px_80px_-24px_rgba(244,114,182,0.28)] backdrop-blur-2xl transition-all duration-700 hover:border-white/90 hover:shadow-[0_40px_90px_-28px_rgba(244,114,182,0.35)] sm:p-10 ${easeFluid} hover:-translate-y-1`}
          >
            <div
              className="animate-border-glow pointer-events-none absolute inset-0 rounded-[2rem] opacity-40"
              style={{
                background:
                  'linear-gradient(125deg, transparent 20%, rgba(251,207,232,0.55) 45%, rgba(245,208,254,0.35) 55%, transparent 80%)',
              }}
              aria-hidden
            />
            <div
              className="animate-sheen pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden
            />
            <div className="relative">
              <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-[0.28em] text-pink-600">
                From the Lab
              </p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-200/90 bg-gradient-to-r from-fuchsia-50 to-pink-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-900 transition-transform duration-500 group-hover:scale-[1.01]">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                {leadArticle.category}
              </span>

              <h2 className="mt-5 max-w-[22ch] text-balance text-3xl font-bold leading-[1.15] tracking-tight text-stone-900 sm:text-4xl lg:text-[2.35rem]">
                {leadArticle.title}
              </h2>

              <p className="font-mono-ui mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500">
                <time dateTime="2026-04">April 2026</time>
                <span className="text-stone-300" aria-hidden>
                  ·
                </span>
                <span className="text-pink-700/90">Full paper</span>
              </p>

              <p className="mt-6 max-w-2xl text-pretty text-base leading-[1.75] text-stone-700 sm:text-[1.0625rem]">
                {FEATURED_DEK}
              </p>

              {leadArticle.pdfUrl ? (
                <a
                  href={leadArticle.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-mono-ui mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-pink-500 to-fuchsia-600 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_40px_-8px_rgba(219,39,119,0.45)] transition-all duration-500 hover:shadow-[0_16px_48px_-6px_rgba(192,38,211,0.4)] sm:w-auto ${easeFluid}`}
                >
                  Read the full paper
                  <span aria-hidden className="text-sm font-normal opacity-90">
                    →
                  </span>
                </a>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-2 border-t border-stone-200/80 pt-8">
                {leadArticle.pillars.map((p) => (
                  <span
                    key={p}
                    className="font-mono-ui rounded-full border border-pink-200/90 bg-gradient-to-b from-white to-pink-50/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-pink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <aside className={`flex flex-col gap-7 ${easeFluid}`}>
            <div className="rounded-[2rem] border border-white/65 bg-white/[0.96] p-7 shadow-[0_28px_70px_-28px_rgba(217,70,239,0.22)] backdrop-blur-2xl transition-all duration-700 hover:border-white/85 hover:shadow-[0_36px_80px_-24px_rgba(217,70,239,0.28)]">
              <h3 className="font-mono-ui text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-900">
                Pillars
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Select one or more pillars. Articles appear if they match{' '}
                <strong>any</strong> selected pillar. Tap again to deselect. When none are
                selected, everything shows.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Pill pillar="Performance" tone="pink" />
                <Pill pillar="Rehab" tone="violet" />
                <Pill pillar="Data" tone="pink" />
                <Pill pillar="Women's Sports" tone="violet" />
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
              className="rounded-[2rem] border border-white/60 bg-white/[0.96] p-6 font-mono-ui text-[10px] uppercase tracking-widest text-stone-500 shadow-[0_20px_55px_-22px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-500 hover:border-white/80"
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

        <main className="pb-20">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Journal
              </h3>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-stone-400">
                Papers and short notes—evidence-forward, built for coaches, clinicians, and athletes in
                women&apos;s sport.
              </p>
              <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-stone-500">
                {selectedFilterPillars.size > 0
                  ? `Showing ${visibleArticles.length} match · ${[...selectedFilterPillars].join(' · ')}`
                  : 'Filter by pillar above · or browse the full list'}
              </p>
            </div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.25em] text-stone-500 sm:pt-8">
              Vol. 2026
            </p>
          </div>

          {visibleArticles.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-stone-400">
              No articles match these pillars yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleArticles.map((post, index) => {
                const isPaper = Boolean(post.pdfUrl)
                return (
                  <article
                    key={post.id}
                    className={`group relative overflow-hidden rounded-[1.75rem] border bg-white/[0.96] p-6 shadow-[0_16px_48px_-16px_rgba(244,114,182,0.18)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_-18px_rgba(244,114,182,0.32)] ${easeFluid} ${
                      isPaper
                        ? 'border-pink-200/90 border-l-[3px] border-l-pink-500 hover:border-pink-300/90'
                        : 'border-white/80 hover:border-pink-200/90'
                    }`}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-300/40 to-fuchsia-400/25 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 sm:opacity-70" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono-ui text-[10px] font-medium tabular-nums text-pink-700">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {isPaper ? (
                          <span className="font-mono-ui w-fit rounded-md border border-pink-300/70 bg-pink-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-pink-900">
                            Paper
                          </span>
                        ) : (
                          <span className="font-mono-ui w-fit rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-stone-600">
                            Note
                          </span>
                        )}
                      </div>
                      <div className="flex max-w-[58%] flex-col items-end gap-1 text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          {post.pillars.map((p) => (
                            <span
                              key={p}
                              className="font-mono-ui rounded-full border border-pink-200 bg-pink-50/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-pink-900"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono-ui text-[9px] uppercase tracking-[0.14em] text-fuchsia-800/75">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <h4 className="relative mt-4 text-balance text-lg font-semibold leading-snug tracking-tight text-stone-900 transition-colors duration-500 group-hover:text-pink-950">
                      {post.title}
                    </h4>
                    {post.excerpt ? (
                      <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <div className="relative mt-5 flex flex-col gap-2">
                      {post.pdfUrl ? (
                        <a
                          href={post.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-mono-ui inline-flex w-full items-center justify-center rounded-xl border border-pink-200/90 bg-gradient-to-b from-white to-pink-50/90 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-pink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-500 hover:border-pink-300 hover:shadow-[0_8px_24px_-6px_rgba(244,114,182,0.35)] ${easeFluid}`}
                        >
                          Open PDF
                        </a>
                      ) : null}
                      {post.googleDocUrl ? (
                        <a
                          href={post.googleDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-ui text-center text-[10px] font-semibold uppercase tracking-wider text-fuchsia-800 underline decoration-fuchsia-300/50 underline-offset-2 hover:text-fuchsia-950"
                        >
                          Google Doc
                        </a>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
