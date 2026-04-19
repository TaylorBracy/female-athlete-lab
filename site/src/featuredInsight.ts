import manifest from './content/featured-insight.json'

/**
 * Featured insight — preview on home; full piece loads from pdfUrl in-app only.
 * PDF + metadata: `src/content/featured-insight.json` (use `npm run publish-insight`).
 * Assets: `public/papers/` (pdf), optional `public/insights/` (thumbnail).
 */
export const FEATURED_INSIGHT_PDF = manifest.pdf

/** Bumped automatically when you run `npm run publish-insight`. */
export const FEATURED_INSIGHT_PDF_REVISION = String(manifest.revision)

export const FEATURED_INSIGHT = {
  viewerPath: manifest.viewerPath,
  pdfUrl: `/papers/${manifest.pdf}`,
  thumbnailUrl: manifest.thumbnailUrl,
  category: manifest.category,
  title: manifest.title,
  description: manifest.description,
} as const
