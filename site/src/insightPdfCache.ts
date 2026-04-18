import { FEATURED_INSIGHT } from './featuredInsight'

let buffer: ArrayBuffer | undefined
let inflight: Promise<ArrayBuffer | undefined> | undefined

function isFeaturedPdf(url: string) {
  return url === FEATURED_INSIGHT.pdfUrl
}

/** Start downloading the featured PDF into memory (safe before Read Now — no UI shown). */
export function primeInsightPdf(url: string) {
  if (!isFeaturedPdf(url)) return
  if (buffer?.byteLength) return
  if (inflight) return
  inflight = fetch(url, { cache: 'force-cache' })
    .then((r) => r.arrayBuffer())
    .then((b) => {
      if (b.byteLength > 0) buffer = b
      return buffer
    })
    .catch(() => undefined)
    .finally(() => {
      inflight = undefined
    })
}

/** Resolved buffer for pdf.js, or undefined to fall back to URL loading. */
export async function getInsightPdfBuffer(
  url: string,
): Promise<ArrayBuffer | undefined> {
  if (!isFeaturedPdf(url)) return undefined
  if (buffer?.byteLength) return buffer
  if (inflight) return inflight
  inflight = fetch(url, { cache: 'force-cache' })
    .then((r) => r.arrayBuffer())
    .then((b) => {
      if (b.byteLength > 0) buffer = b
      return buffer
    })
    .catch(() => undefined)
    .finally(() => {
      inflight = undefined
    })
  return inflight
}
