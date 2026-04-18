import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useEffect, useRef, useState } from 'react'

import {
  getInsightPdfBuffer,
  insightPdfUrlForPdfJs,
} from './insightPdfCache'

/** Device-pixel height per canvas tile (stay under common GPU / canvas limits). */
const TILE_DEVICE_PX = 4096

type Props = {
  pdfUrl: string
}

/** Must match PdfInsightPage reader surface (neutral off-white). */
const readerBg = '#faf9f6'

export default function PdfInsightCanvas({ pdfUrl }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [hostWidth, setHostWidth] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setHostWidth(Math.max(1, Math.floor(el.getBoundingClientRect().width)))
    })
    ro.observe(el)
    setHostWidth(Math.max(1, Math.floor(el.getBoundingClientRect().width)))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (hostWidth <= 0) return
    const host = hostRef.current
    if (!host) return

    let cancelled = false
    const renderTasks: Array<{ cancel: () => void }> = []
    let pdfDoc: { destroy: () => unknown } | null = null

    const run = async () => {
      setPhase('loading')
      host.replaceChildren()

      try {
        const [{ AnnotationMode, getDocument, GlobalWorkerOptions }, bytes] =
          await Promise.all([
            import('pdfjs-dist'),
            getInsightPdfBuffer(pdfUrl),
          ])
        GlobalWorkerOptions.workerSrc = pdfjsWorker

        const task = getDocument(
          bytes?.byteLength
            ? {
                data: new Uint8Array(bytes),
                disableRange: true,
                disableStream: true,
              }
            : {
                url: insightPdfUrlForPdfJs(pdfUrl),
                disableRange: false,
                disableStream: false,
              },
        )
        const pdf = await task.promise
        pdfDoc = pdf
        if (cancelled) return

        const page = await pdf.getPage(1)
        if (cancelled) return

        const baseVp = page.getViewport({ scale: 1 })
        const cssW = hostWidth
        const cssScale = cssW / baseVp.width
        const dpr = Math.min(window.devicePixelRatio || 1, 2.75)
        const scale = cssScale * dpr
        const viewport = page.getViewport({ scale })

        const totalDeviceH = Math.ceil(viewport.height)
        let offset = 0
        let firstTile = true
        while (offset < totalDeviceH) {
          const deviceH = Math.min(TILE_DEVICE_PX, totalDeviceH - offset)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d', { alpha: false })
          if (!ctx) throw new Error('Canvas 2D not available')

          canvas.width = Math.floor(viewport.width)
          canvas.height = deviceH
          canvas.style.width = `${cssW}px`
          canvas.style.height = `${deviceH / dpr}px`
          canvas.style.display = 'block'
          canvas.style.verticalAlign = 'top'

          const rt = page.render({
            canvasContext: ctx,
            viewport,
            transform: [1, 0, 0, 1, 0, -offset],
            intent: 'display',
            annotationMode: AnnotationMode.DISABLE,
          })
          renderTasks.push(rt)
          await rt.promise
          if (cancelled) return

          host.appendChild(canvas)
          if (firstTile) {
            firstTile = false
            if (!cancelled) setPhase('ready')
          }
          offset += deviceH
        }

        page.cleanup()
        if (!cancelled && firstTile) setPhase('ready')
      } catch (e) {
        console.error(e)
        if (!cancelled) setPhase('error')
      }
    }

    void run()

    return () => {
      cancelled = true
      for (const t of renderTasks) {
        try {
          t.cancel()
        } catch {
          /* ignore */
        }
      }
      host.replaceChildren()
      void pdfDoc?.destroy()
      pdfDoc = null
    }
  }, [hostWidth, pdfUrl])

  return (
    <div
      ref={hostRef}
      className="pdf-insight-canvas-host flex w-full min-w-0 flex-col gap-0 leading-none [&>canvas]:block [&>canvas]:max-w-none [&>canvas+canvas]:-mt-[2px]"
      style={{ backgroundColor: readerBg }}
      data-phase={phase}
      aria-busy={phase === 'loading'}
    />
  )
}
