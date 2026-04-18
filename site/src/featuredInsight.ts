/**
 * Featured insight — preview copy only. Full content lives in the PDF at pdfUrl.
 * Add the file to site/public/papers/ (see pdfFilename).
 * Optional thumbnail: site/public/insights/ankle-sprains-thumb.jpg
 */
export const FEATURED_INSIGHT_PDF = 'ankle-sprains-female-athletes-soccer-vs-basketball.pdf'

export const FEATURED_INSIGHT = {
  viewerPath: '/insights/ankle-sprains',
  pdfUrl: `/papers/${FEATURED_INSIGHT_PDF}`,
  /** Optional; if missing, HomePage shows a gradient placeholder */
  thumbnailUrl: '/insights/ankle-sprains-thumb.jpg',
  category: 'Injury · Return to play',
  title: 'Ankle Sprains in Female Athletes: Soccer vs. Basketball',
  description:
    'Soccer versus basketball: how lateral ankle sprains differ in load, surface, and footwear—and what that means for rehab and return to play.',
} as const
