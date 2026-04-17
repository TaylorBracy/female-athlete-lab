import { useEffect, useId, useRef, useState } from 'react'

const easeFluid = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

/** Draft UI: local dev only, or production if VITE_ENABLE_LOCAL_ARTICLE_EDITOR=true at build time. */
const showPrivateArticleEditor =
  import.meta.env.DEV ||
  import.meta.env.VITE_ENABLE_LOCAL_ARTICLE_EDITOR === 'true'

const PILLARS = ['Performance', 'Rehab', 'Data', "Women's Sports"] as const
type Pillar = (typeof PILLARS)[number]

type Article = {
  id: string
  title: string
  /** Fine-grained label (subtitle). */
  category: string
  /** One or more pillars; filter matches if any overlap. */
  pillars: Pillar[]
  /** Session blob URL from uploaded PDF in draft mode, or a hosted https URL. */
  pdfUrl?: string
  googleDocUrl?: string
}

const INITIAL_ARTICLES: Omit<Article, 'id'>[] = [
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

function newArticleId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function FemaleAthleteLabWebsite() {
  const [articles, setArticles] = useState<Article[]>(seedArticles)
  /** Empty = show all. Otherwise show articles whose pillars intersect this set (OR). */
  const [selectedFilterPillars, setSelectedFilterPillars] = useState<Set<Pillar>>(
    () => new Set(),
  )
  const [dropActive, setDropActive] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftPillars, setDraftPillars] = useState<Set<Pillar>>(
    () => new Set<Pillar>(['Performance']),
  )
  const [draftGoogleDocUrl, setDraftGoogleDocUrl] = useState('')
  const [draftPdfBlobUrl, setDraftPdfBlobUrl] = useState<string | null>(null)
  const [draftPdfName, setDraftPdfName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const blobUrlsRef = useRef<string[]>([])
  const dropZoneId = useId()

  useEffect(() => {
    if (!showPrivateArticleEditor) return
    const clearDrop = () => setDropActive(false)
    window.addEventListener('dragend', clearDrop)
    return () => window.removeEventListener('dragend', clearDrop)
  }, [showPrivateArticleEditor])

  useEffect(() => {
    const urls = blobUrlsRef.current
    return () => {
      for (const u of urls) URL.revokeObjectURL(u)
    }
  }, [])

  const featuredPost = {
    title: "What Actually Matters Most in Women's Field Sport Performance",
    category: "Women's Sports",
    date: 'April 2026',
    excerpt:
      'A clear breakdown of what truly drives performance, resilience, and return to sport in female athletes.',
  }

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

  function toggleDraftPillar(pillar: Pillar) {
    setDraftPillars((prev) => {
      const next = new Set(prev)
      if (next.has(pillar)) {
        if (next.size > 1) next.delete(pillar)
      } else {
        next.add(pillar)
      }
      return next
    })
  }

  function rememberBlobUrl(url: string) {
    blobUrlsRef.current.push(url)
  }

  function addArticle(entry: Omit<Article, 'id'>) {
    const title = entry.title?.trim()
    if (!title) return
    const pillars =
      entry.pillars.length > 0 ? entry.pillars : (['Performance'] as Pillar[])
    setArticles((prev) => [
      ...prev,
      {
        id: newArticleId(),
        title,
        category:
          entry.category?.trim() || pillars.join(' · '),
        pillars,
        pdfUrl: entry.pdfUrl,
        googleDocUrl: entry.googleDocUrl?.trim() || undefined,
      },
    ])
  }

  function addArticleFromDrop(payload: {
    title: string
    category: string
    pillars?: Pillar[]
    pillar?: Pillar
    pdfUrl?: string
    googleDocUrl?: string
  }) {
    const title = payload.title?.trim()
    if (!title) return
    const pillars =
      payload.pillars && payload.pillars.length > 0
        ? [...new Set(payload.pillars)]
        : payload.pillar
          ? [payload.pillar]
          : (['Performance'] as Pillar[])
    addArticle({
      title,
      category: payload.category?.trim() || pillars.join(' · '),
      pillars,
      pdfUrl: payload.pdfUrl,
      googleDocUrl: payload.googleDocUrl,
    })
  }

  function submitDraftArticle(e: React.FormEvent) {
    e.preventDefault()
    const doc = draftGoogleDocUrl.trim()
    const pillars = [...draftPillars]
    addArticle({
      title: draftTitle,
      category: pillars.join(' · '),
      pillars,
      pdfUrl: draftPdfBlobUrl ?? undefined,
      googleDocUrl: doc || undefined,
    })
    setDraftTitle('')
    setDraftPillars(new Set<Pillar>(['Performance']))
    /* Do not revoke draftPdfBlobUrl here — the article still uses that blob URL. */
    setDraftPdfBlobUrl(null)
    setDraftPdfName('')
    setDraftGoogleDocUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function onDraftPdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (draftPdfBlobUrl) {
      URL.revokeObjectURL(draftPdfBlobUrl)
      const ix = blobUrlsRef.current.indexOf(draftPdfBlobUrl)
      if (ix >= 0) blobUrlsRef.current.splice(ix, 1)
    }
    const url = URL.createObjectURL(file)
    rememberBlobUrl(url)
    setDraftPdfBlobUrl(url)
    setDraftPdfName(file.name)
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
              <span className="font-mono-ui inline-flex items-center gap-2 rounded-full border border-fuchsia-200/90 bg-gradient-to-r from-fuchsia-50 to-pink-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-900 transition-transform duration-500 group-hover:scale-[1.02]">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                {featuredPost.category}
              </span>

              <h2 className="mt-6 text-3xl font-bold leading-[1.18] tracking-tight text-stone-900 sm:text-4xl lg:text-[2.35rem]">
                {featuredPost.title}
              </h2>

              <p className="font-mono-ui mt-4 text-xs text-pink-700/85">{featuredPost.date}</p>

              <p className="mt-5 max-w-2xl text-base leading-[1.7] text-stone-600 sm:text-lg">
                {featuredPost.excerpt}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <span className="font-mono-ui rounded-full border border-stone-200/90 bg-stone-50/90 px-3 py-1.5 text-[10px] uppercase tracking-widest text-stone-600 transition-colors duration-500 hover:border-pink-200 hover:bg-pink-50/50">
                  Neural-indexed
                </span>
                <span className="font-mono-ui rounded-full border border-stone-200/90 bg-stone-50/90 px-3 py-1.5 text-[10px] uppercase tracking-widest text-stone-600 transition-colors duration-500 hover:border-pink-200 hover:bg-pink-50/50">
                  Field validated
                </span>
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
              id={dropZoneId}
              role="region"
              aria-label={
                showPrivateArticleEditor
                  ? 'Article index and private drop zone'
                  : 'Article index'
              }
              {...(showPrivateArticleEditor
                ? {
                    onDragOver: (e: React.DragEvent) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'copy'
                      setDropActive(true)
                    },
                    onDrop: (e: React.DragEvent) => {
                      e.preventDefault()
                      setDropActive(false)
                      try {
                        const raw = e.dataTransfer.getData('application/json')
                        if (raw) {
                          const data = JSON.parse(raw) as {
                            title?: string
                            category?: string
                            pillars?: Pillar[]
                            pillar?: Pillar
                            pdfUrl?: string
                            googleDocUrl?: string
                          }
                          addArticleFromDrop({
                            title: data.title ?? '',
                            category: data.category ?? '',
                            pillars: data.pillars,
                            pillar: data.pillar,
                            pdfUrl: data.pdfUrl,
                            googleDocUrl: data.googleDocUrl,
                          })
                        }
                      } catch {
                        /* ignore malformed drop */
                      }
                    },
                  }
                : {})}
              className={`rounded-[2rem] border bg-white/[0.96] p-6 font-mono-ui text-[10px] uppercase tracking-widest text-stone-500 shadow-[0_20px_55px_-22px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-500 ${
                showPrivateArticleEditor && dropActive
                  ? 'border-pink-400 ring-2 ring-pink-300/50 ring-offset-2 ring-offset-white/90'
                  : 'border-white/60 hover:border-white/80'
              }`}
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
              {showPrivateArticleEditor ? (
                <p className="mt-4 text-[9px] leading-relaxed tracking-[0.14em] text-stone-500 normal-case">
                  Draft mode: drag a card here to duplicate it, or use the workspace below.
                </p>
              ) : (
                <p className="mt-4 text-[9px] leading-relaxed tracking-[0.14em] text-stone-500 normal-case">
                  Total pieces in the archive.
                </p>
              )}
            </div>

            {showPrivateArticleEditor ? (
              <div className="rounded-[2rem] border border-violet-500/35 bg-stone-900/85 p-6 text-stone-200 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <h3 className="font-mono-ui text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
                  Draft workspace
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-stone-400 normal-case">
                  Only you see this while running{' '}
                  <code className="rounded bg-stone-800 px-1 py-0.5 text-[10px] text-pink-200">
                    npm run dev
                  </code>
                  . PDF uploads use a temporary link in this browser until you refresh. For a
                  permanent PDF, add the file under{' '}
                  <code className="rounded bg-stone-800 px-1 py-0.5 text-[10px]">
                    site/public/papers/
                  </code>{' '}
                  and reference that URL in code later.
                </p>
                <form className="mt-4 space-y-3 normal-case" onSubmit={submitDraftArticle}>
                  <div>
                    <label className="block font-mono-ui text-[9px] uppercase tracking-wider text-stone-500">
                      Title
                    </label>
                    <input
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-600 bg-stone-950/80 px-3 py-2 text-sm text-stone-100 outline-none ring-pink-400/40 transition-shadow focus:ring-2"
                      placeholder="Article headline"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <span className="block font-mono-ui text-[9px] uppercase tracking-wider text-stone-500">
                      Pillars (one or more)
                    </span>
                    <p className="mt-1 text-[10px] leading-snug text-stone-500">
                      At least one must stay on. Matches how the piece shows up in filters.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PILLARS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleDraftPillar(p)}
                          className={`font-mono-ui rounded-lg border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide transition-colors ${
                            draftPillars.has(p)
                              ? 'border-pink-400 bg-pink-600/90 text-white'
                              : 'border-stone-600 bg-stone-950/80 text-stone-400 hover:border-stone-500'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono-ui text-[9px] uppercase tracking-wider text-stone-500">
                      Google Doc (optional)
                    </label>
                    <input
                      value={draftGoogleDocUrl}
                      onChange={(e) => setDraftGoogleDocUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-600 bg-stone-950/80 px-3 py-2 text-sm text-stone-100 outline-none ring-pink-400/40 transition-shadow focus:ring-2"
                      placeholder="https://docs.google.com/document/d/…"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-ui text-[9px] uppercase tracking-wider text-stone-500">
                      PDF (optional)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={onDraftPdfChange}
                      className="mt-1 w-full text-[11px] text-stone-300 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-600 file:px-3 file:py-1.5 file:text-[10px] file:font-semibold file:text-white"
                    />
                    {draftPdfName ? (
                      <p className="mt-1 text-[10px] text-stone-500">
                        Attached: {draftPdfName}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="font-mono-ui w-full rounded-xl bg-pink-600 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-pink-500"
                  >
                    Add article
                  </button>
                </form>
              </div>
            ) : null}
          </aside>
        </section>

        <main className="pb-20">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Latest articles
              </h3>
              <p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-stone-500">
                {selectedFilterPillars.size > 0
                  ? `Showing ${visibleArticles.length} match · ${[...selectedFilterPillars].join(' · ')}`
                  : 'All pillars'}
              </p>
            </div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.25em] text-stone-500 sm:pt-8">
              Archive /2026
            </p>
          </div>

          {visibleArticles.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-stone-400">
              No articles match these pillars yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleArticles.map((post, index) => (
                <article
                  key={post.id}
                  draggable={showPrivateArticleEditor}
                  onDragStart={
                    showPrivateArticleEditor
                      ? (e) => {
                          e.dataTransfer.setData(
                            'application/json',
                            JSON.stringify({
                              title: post.title,
                              category: post.category,
                              pillars: post.pillars,
                              pdfUrl: post.pdfUrl,
                              googleDocUrl: post.googleDocUrl,
                            }),
                          )
                          e.dataTransfer.effectAllowed = 'copy'
                        }
                      : undefined
                  }
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/[0.96] p-6 shadow-[0_16px_48px_-16px_rgba(244,114,182,0.18)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-1.5 hover:border-pink-200/90 hover:shadow-[0_28px_64px_-18px_rgba(244,114,182,0.32)] ${easeFluid} ${
                    showPrivateArticleEditor
                      ? 'cursor-grab active:cursor-grabbing'
                      : ''
                  }`}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-300/40 to-fuchsia-400/25 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 sm:opacity-70" />
                  <div className="relative flex items-start justify-between gap-3">
                    <span className="font-mono-ui text-[10px] font-medium tabular-nums text-pink-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex max-w-[65%] flex-col items-end gap-1 text-right">
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
                  <h4 className="relative mt-4 text-lg font-semibold leading-snug text-stone-900 transition-colors duration-500 group-hover:text-pink-950">
                    {post.title}
                  </h4>
                  <div className="relative mt-3 flex flex-wrap gap-3">
                    {post.pdfUrl ? (
                      <a
                        href={post.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-pink-700 underline decoration-pink-300/60 underline-offset-2 hover:text-pink-900"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        Open PDF
                      </a>
                    ) : null}
                    {post.googleDocUrl ? (
                      <a
                        href={post.googleDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-fuchsia-800 underline decoration-fuchsia-300/50 underline-offset-2 hover:text-fuchsia-950"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        Open Google Doc
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
