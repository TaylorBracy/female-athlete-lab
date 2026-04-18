import {
  FEATURED_INSIGHT,
  FEATURED_INSIGHT_PDF_REVISION,
} from './featuredInsight'

let buffer: ArrayBuffer | undefined
let bufferRevision: string | undefined
let inflight: Promise<ArrayBuffer | undefined> | undefined

/** Drop bytes so the next open refetches (e.g. after replacing the PDF on disk). */
export function invalidateFeaturedInsightPdfCache() {
  buffer = undefined
  bufferRevision = undefined
  inflight = undefined
}

function isFeaturedPdf(url: string) {
  return url === FEATURED_INSIGHT.pdfUrl
}

function featuredPdfNetworkUrl() {
  return `${FEATURED_INSIGHT.pdfUrl}?v=${FEATURED_INSIGHT_PDF_REVISION}`
}

function pdfFetchInit(): RequestInit {
  // In dev, disk + HTTP caches often keep an old PDF; `reload` bypasses them.
  if (import.meta.env.DEV) return { cache: 'reload' }
  return { cache: 'no-cache' }
}

/** Same file URL pdf.js should load when the in-memory buffer is unavailable. */
export function insightPdfUrlForPdfJs(storedUrl: string): string {
  if (!isFeaturedPdf(storedUrl)) return storedUrl
  return featuredPdfNetworkUrl()
}

function syncBufferRevision() {
  if (bufferRevision !== FEATURED_INSIGHT_PDF_REVISION) {
    buffer = undefined
    bufferRevision = FEATURED_INSIGHT_PDF_REVISION
  }
}

/** Start downloading the featured PDF into memory (safe before Read Now — no UI shown). */
export function primeInsightPdf(url: string) {
  if (!isFeaturedPdf(url)) return
  syncBufferRevision()
  if (buffer?.byteLength) return
  if (inflight) return
  inflight = fetch(featuredPdfNetworkUrl(), pdfFetchInit())
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
  syncBufferRevision()
  if (buffer?.byteLength) return buffer
  if (inflight) return inflight
  inflight = fetch(featuredPdfNetworkUrl(), pdfFetchInit())
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
