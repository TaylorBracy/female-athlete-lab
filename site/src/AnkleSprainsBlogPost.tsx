/**
 * First journal post: exact wording from the original Google Doc / PDF export.
 * Visual styling only (fonts, colors, layout)—no copy edits.
 */

const accent = 'text-rose-700'

function XCluster({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none select-none font-mono text-[10px] leading-none text-black/25 ${className}`}
      aria-hidden
    >
      × ×<br />
      × ×
    </span>
  )
}

function Rule() {
  return <div className="my-10 h-px w-full bg-black/20" />
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-16 scroll-mt-8 first:mt-0">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h2
          className={`font-[family-name:var(--font-bebas)] text-[clamp(1.75rem,5vw,2.75rem)] font-normal uppercase leading-[0.95] tracking-[0.02em] ${accent}`}
          style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}
        >
          {children}
        </h2>
        <XCluster className="mt-1 shrink-0" />
      </div>
      <div className="h-0.5 w-16 bg-black" />
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-dm)] text-[0.95rem] leading-relaxed text-neutral-900 sm:text-[1.05rem] sm:leading-[1.7]">
      {children}
    </p>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className={`shrink-0 pt-0.5 ${accent}`} aria-hidden>
        ●
      </span>
      <span>{children}</span>
    </li>
  )
}

function SubBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 pl-6">
      <span className="shrink-0 pt-0.5 text-neutral-700" aria-hidden>
        ○
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function AnkleSprainsBlogPost() {
  return (
    <article className="relative border-y border-black/10 bg-[#f4f1ea] text-neutral-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(190,24,93,0.06),transparent_55%)]" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:max-w-4xl lg:py-16">
        {/* Title strip — editorial sport layout; wording unchanged */}
        <header className="relative -mx-5 mb-16 overflow-visible sm:-mx-8 sm:mb-20">
          <div className="relative overflow-visible rounded-sm bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 px-5 py-8 text-[#f4f1ea] shadow-[0_24px_60px_-20px_rgba(190,24,93,0.45)] sm:px-8 sm:py-10">
            <div className="flex flex-row items-start justify-between gap-3 sm:gap-6">
              <div className="min-w-0 flex-1 pr-1">
                <p
                  className="font-[family-name:var(--font-bebas)] text-[clamp(1.85rem,6.5vw,3.5rem)] font-normal uppercase leading-[0.92] tracking-wide"
                  style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}
                >
                  Ankle Sprains in
                  <br />
                  Female Athletes:
                  <br />
                  Soccer vs Basketball
                </p>
                <p
                  className="mt-4 font-[family-name:var(--font-dm)] text-sm font-medium tracking-wide text-rose-100/95 sm:text-base"
                  style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                >
                  Taylor Bracy, DPT
                </p>
              </div>
              {/* Larger photo; breaks past the red panel (overflow visible on ancestors) */}
              <div className="relative z-20 -mb-11 -mr-1 w-[9rem] shrink-0 sm:-mr-3 sm:w-[11rem] md:-mr-4 md:w-[12.5rem]">
                <img
                  src="/blog/ankle-sprains/hero.png"
                  alt=""
                  className="h-auto w-full translate-x-2 translate-y-1 rounded-lg border-2 border-white/40 object-cover object-[center_22%] shadow-[0_22px_50px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/20 sm:translate-x-4 sm:translate-y-2 md:translate-x-6 md:translate-y-3"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </header>

        <div
          className="space-y-5 pt-8 font-[family-name:var(--font-dm)] text-[0.95rem] leading-relaxed text-neutral-900 sm:pt-10 sm:text-[1.05rem] sm:leading-[1.7]"
          style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
        >
          <H2>Why This Matters</H2>
          <P>
            Ankle sprains are one of the most common injuries we see in female athletes—especially in high school and
            collegiate settings.
          </P>
          <P>But not all ankle sprains are the same.</P>
          <P>Different sports create:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>different mechanisms</Bullet>
            <Bullet>different severity levels</Bullet>
            <Bullet>and different return-to-play timelines</Bullet>
          </ul>
          <P>That matters.</P>
          <P>If we treat every ankle sprain the same, we’re missing the actual problem.</P>

          <H2>What the Data Shows</H2>
          <P>Looking at high school female athletes:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>Girls’ basketball has the highest overall ankle sprain rate</Bullet>
            <Bullet>Girls’ soccer is right behind it</Bullet>
            <Bullet>Over 50% of ankle sprains happen during games, not practice</Bullet>
            <Bullet>The majority come from either:</Bullet>
            <SubBullet>player contact</SubBullet>
            <SubBullet>or non-contact movement breakdowns</SubBullet>
          </ul>
          <P>Two things stand out:</P>
          <ol className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-rose-800">
            <li>~15% of ankle sprains are recurrent</li>
            <li>Non-contact injuries are increasing over time</li>
          </ol>
          <P>That second point matters most.</P>
          <P>This is not just bad luck.</P>
          <P>This is a movement + load problem.</P>

          {/* Second visual — original figure from PDF (unchanged) */}
          <figure className="relative my-12 overflow-hidden border border-black/10 shadow-[8px_8px_0_0_rgba(0,0,0,0.12)]">
            <img
              src="/blog/ankle-sprains/figure-2-original.png"
              alt=""
              className="h-auto w-full object-contain bg-white/40"
              loading="lazy"
            />
          </figure>

          <Rule />

          <H2>{'Soccer vs Basketball: What\'s Actually Different'}</H2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-800">Basketball</p>
          <ul className="space-y-2 pl-1">
            <Bullet>Higher overall injury rate</Bullet>
            <Bullet>More exposure to:</Bullet>
          </ul>
          <ul className="mt-2 space-y-2 pl-1">
            <SubBullet>jumping</SubBullet>
            <SubBullet>landing</SubBullet>
            <SubBullet>contact (especially under the rim)</SubBullet>
          </ul>
          <P>Most common scenario:</P>
          <P>landing on another player’s foot</P>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-rose-800">Soccer</p>
          <ul className="space-y-2 pl-1">
            <Bullet>Slightly lower overall rate</Bullet>
            <Bullet>But more:</Bullet>
          </ul>
          <ul className="mt-2 space-y-2 pl-1">
            <SubBullet>time-loss injuries (&gt;21 days)</SubBullet>
            <SubBullet>non-contact mechanisms</SubBullet>
          </ul>
          <P>Most common scenarios:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>cutting</Bullet>
            <Bullet>deceleration</Bullet>
            <Bullet>uncontrolled inversion</Bullet>
          </ul>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-black">The Real Difference</p>
          <P>Basketball = frequency problem</P>
          <P>Soccer = severity + movement problem</P>

          <H2>Game vs Practice Risk</H2>
          <P>This is one of the most important findings:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>Injury rates are significantly higher in games than practice</Bullet>
            <Bullet>In many cases, 2–3x higher</Bullet>
          </ul>
          <P>Why?</P>
          <P>Games involve:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>higher speed</Bullet>
            <Bullet>more chaos</Bullet>
            <Bullet>more contact</Bullet>
            <Bullet>fatigue + decision-making</Bullet>
          </ul>
          <P>Practice doesn’t replicate that.</P>

          <H2>What This Means for Rehab &amp; Performance</H2>
          <P>This is where most rehab programs fall short.</P>
          <P>They’re:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>too general</Bullet>
            <Bullet>too low-level</Bullet>
            <Bullet>not specific to the sport</Bullet>
          </ul>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-rose-800">For Basketball Athletes</p>
          <P>You need:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>landing control under load</Bullet>
            <Bullet>frontal plane stability</Bullet>
            <Bullet>ability to tolerate contact</Bullet>
          </ul>
          <P>Not just:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>bands</Bullet>
            <Bullet>balance work</Bullet>
            <Bullet>“light movement”</Bullet>
          </ul>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-rose-800">For Soccer Athletes</p>
          <P>You need:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>deceleration mechanics</Bullet>
            <Bullet>cutting at speed</Bullet>
            <Bullet>ankle stiffness + reactive strength</Bullet>
          </ul>
          <P>Not just:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>jogging → running → cleared</Bullet>
          </ul>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-rose-800">For Both</p>
          <P>You have to address:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>non-contact risk factors</Bullet>
            <Bullet>re-injury risk (~15%)</Bullet>
          </ul>
          <P>That means:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>strength</Bullet>
            <Bullet>neuromuscular control</Bullet>
            <Bullet>progressive loading</Bullet>
            <Bullet>actual sport demands</Bullet>
          </ul>

          <H2>Bottom Line</H2>
          <P>Ankle sprains are not random.</P>
          <P>They follow patterns.</P>
          <ul className="space-y-2 pl-1">
            <Bullet>Basketball athletes get injured more often</Bullet>
            <Bullet>Soccer athletes often lose more time</Bullet>
            <Bullet>Most injuries happen in games</Bullet>
            <Bullet>Non-contact injuries are increasing</Bullet>
          </ul>

          <H2>Final Thought</H2>
          <P>If you want to actually reduce ankle sprains:</P>
          <P>You don’t just rehab the ankle.</P>
          <P>You train:</P>
          <ul className="space-y-2 pl-1">
            <Bullet>the athlete</Bullet>
            <Bullet>the movement</Bullet>
            <Bullet>and the demands of their sport</Bullet>
          </ul>
        </div>
      </div>
    </article>
  )
}
