/**
 * Featured insight — preview on home; full piece loads from pdfUrl in-app only.
 * Asset: site/public/papers/ (pdfFilename). Optional thumb: site/public/insights/
 */
export const FEATURED_INSIGHT_PDF = 'ankle-sprains-female-athletes-soccer-vs-basketball.pdf'

/** Bump when replacing the PDF so browsers and the in-memory cache pick up the new file. */
export const FEATURED_INSIGHT_PDF_REVISION = '8'

/** Homepage “BLOG 001” line — zero-padded, minimum serial 1. */
export function formatBlogSerialLabel(serial: number): string {
  const n = Math.max(1, Math.floor(Number(serial)) || 1)
  return `BLOG ${String(n).padStart(3, '0')}`
}

export const FEATURED_INSIGHT = {
  /** Stable serial for the homepage card; increment for each new published piece. */
  blogSerial: 1,
  viewerPath: '/insights/ankle-sprains',
  pdfUrl: `/papers/${FEATURED_INSIGHT_PDF}`,
  /** Optional; if missing, HomePage shows a gradient placeholder */
  thumbnailUrl: '/insights/ankle-sprains-thumb.jpg',
  category: 'Injury · Return to play',
  title: 'Ankle Sprains in Female Athletes: Soccer vs. Basketball',
  description:
    'Soccer versus basketball: how lateral ankle sprains differ in load, surface, and footwear—and what that means for rehab and return to play.',
} as const

export type HomepageInsightPreview = typeof FEATURED_INSIGHT

/** Ordered homepage cards; append a new entry when a blog ships (match routing in App when needed). */
export const HOMEPAGE_INSIGHT_PREVIEWS: readonly HomepageInsightPreview[] = [
  FEATURED_INSIGHT,
]
