import {
  FEATURED_INSIGHT,
  FEATURED_INSIGHT_PDF_REVISION,
} from './featuredInsight'

let buffer: ArrayBuffer | undefined
let bufferRevision: string | undefined
let inflight: Promise<ArrayBuffer | undefined> | undefined
let activeFetch: AbortController | null = null

/** Drop bytes so the next open refetches (e.g. after replacing the PDF on disk). */
export function invalidateFeaturedInsightPdfCache() {
  activeFetch?.abort()
  activeFetch = null
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

function pdfFetchInit(signal: AbortSignal): RequestInit {
  // Always bypass HTTP cache for the featured PDF so replacements show immediately.
  return { cache: 'reload', signal }
}

/** Same file URL pdf.js should load when the in-memory buffer is unavailable. */
export function insightPdfUrlForPdfJs(storedUrl: string): string {
  if (!isFeaturedPdf(storedUrl)) return storedUrl
  return featuredPdfNetworkUrl()
}

function syncBufferRevision() {
  if (bufferRevision !== FEATURED_INSIGHT_PDF_REVISION) {
    invalidateFeaturedInsightPdfCache()
    bufferRevision = FEATURED_INSIGHT_PDF_REVISION
  }
}

function startFeaturedPdfFetch(): Promise<ArrayBuffer | undefined> {
  activeFetch?.abort()
  const ac = new AbortController()
  activeFetch = ac
  const { signal } = ac

  return fetch(featuredPdfNetworkUrl(), pdfFetchInit(signal))
    .then((r) => {
      if (!r.ok) throw new Error(`PDF fetch failed: ${r.status}`)
      return r.arrayBuffer()
    })
    .then((b) => {
      if (signal.aborted) return undefined
      if (b.byteLength > 0) buffer = b
      return buffer
    })
    .catch((e: unknown) => {
      if (e instanceof DOMException && e.name === 'AbortError') return undefined
      return undefined
    })
    .finally(() => {
      if (activeFetch?.signal === signal) activeFetch = null
    })
}

/** Start downloading the featured PDF into memory (safe before Read Now — no UI shown). */
export function primeInsightPdf(url: string) {
  if (!isFeaturedPdf(url)) return
  syncBufferRevision()
  if (buffer?.byteLength) return
  if (inflight) return
  inflight = startFeaturedPdfFetch().finally(() => {
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
  inflight = startFeaturedPdfFetch().finally(() => {
    inflight = undefined
  })
  return inflight
}
