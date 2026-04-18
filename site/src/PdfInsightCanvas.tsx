import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useEffect, useRef, useState } from 'react'

/** Device-pixel height per canvas tile (stay under common GPU / canvas limits). */
const TILE_DEVICE_PX = 4096

type Props = {
  pdfUrl: string
}

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
        const { AnnotationMode, getDocument, GlobalWorkerOptions } =
          await import('pdfjs-dist')
        GlobalWorkerOptions.workerSrc = pdfjsWorker

        const task = getDocument({
          url: pdfUrl,
          disableRange: false,
          disableStream: false,
        })
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

        const frag = document.createDocumentFragment()
        let offset = 0
        while (offset < viewport.height) {
          const sliceH = Math.min(TILE_DEVICE_PX, viewport.height - offset)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d', { alpha: false })
          if (!ctx) throw new Error('Canvas 2D not available')

          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(sliceH)
          canvas.style.width = `${cssW}px`
          canvas.style.height = `${sliceH / dpr}px`
          canvas.style.display = 'block'

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

          frag.appendChild(canvas)
          offset += sliceH
        }

        page.cleanup()
        host.appendChild(frag)
        if (!cancelled) setPhase('ready')
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
      className="pdf-insight-canvas-host flex w-full min-w-0 flex-col bg-[#f4f1ec] [&>canvas]:max-w-none [&>canvas]:shadow-[0_1px_0_rgba(15,10,8,0.06)]"
      data-phase={phase}
      aria-busy={phase === 'loading'}
    />
  )
}
