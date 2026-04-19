#!/usr/bin/env node
/**
 * Publish / replace the featured insight PDF and bump cache revision.
 *
 * Usage:
 *   npm run publish-insight -- /path/to/article.pdf
 *   npm run publish-insight -- /path/to/article.pdf --slug acl-trends --title "..." --description "..."
 *
 * Replace only the file (keep routes + card copy):
 *   npm run publish-insight -- ~/Desktop/updated.pdf
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const manifestPath = path.join(siteRoot, 'src/content/featured-insight.json')
const papersDir = path.join(siteRoot, 'public/papers')
const insightsDir = path.join(siteRoot, 'public/insights')

function printHelp() {
  console.log(`
publish-insight — copy a PDF into the site and update the featured insight manifest.

  npm run publish-insight -- <source.pdf> [options]

Options:
  --slug <id>           URL + filename stem (e.g. ankle-sprains → /insights/ankle-sprains, ankle-sprains.pdf)
  --title <text>        Card title on the homepage
  --description <text>  Card subtitle / blurb
  --category <text>     Category line (e.g. "Injury · Return to play")
  --thumb <image.jpg>   Copy image to public/insights/ and set thumbnail URL

Omit --slug to replace the PDF named in featured-insight.json (same article, new file).

Edits: src/content/featured-insight.json
Assets: public/papers/<slug>.pdf  (and optional thumbnail under public/insights/)
`)
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') {
      out.help = true
      continue
    }
    if (a.startsWith('--')) {
      const key = a.slice(2)
      if (key === 'help') {
        out.help = true
        continue
      }
      const val = argv[i + 1]
      if (!val || val.startsWith('--')) {
        console.error(`Missing value for --${key}`)
        process.exit(1)
      }
      out[key] = val
      i++
      continue
    }
    if (!out._source) out._source = a
    else {
      console.error('Unexpected argument:', a)
      process.exit(1)
    }
  }
  return out
}

function slugifyFilename(base) {
  const s = base
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
  return s || 'insight'
}

function main() {
  const argv = process.argv.slice(2)
  const opts = parseArgs(argv)
  if (opts.help || argv.length === 0) {
    printHelp()
    process.exit(opts.help ? 0 : 1)
  }

  const sourcePdf = path.resolve(opts._source || '')
  if (!sourcePdf || !fs.existsSync(sourcePdf)) {
    console.error('Provide a path to an existing .pdf file as the first argument.')
    process.exit(1)
  }
  if (!sourcePdf.toLowerCase().endsWith('.pdf')) {
    console.error('Source file must be a .pdf')
    process.exit(1)
  }

  if (!fs.existsSync(manifestPath)) {
    console.error('Missing manifest:', manifestPath)
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  if (typeof manifest.revision !== 'number') manifest.revision = 0

  const slug =
    opts.slug != null && String(opts.slug).trim()
      ? slugifyFilename(String(opts.slug).trim())
      : null

  let destPdfName = manifest.pdf
  if (slug) {
    destPdfName = `${slug}.pdf`
    manifest.pdf = destPdfName
    manifest.viewerPath = `/insights/${slug}`
    manifest.thumbnailUrl = `/insights/${slug}-thumb.jpg`
  }

  if (opts.title != null) manifest.title = String(opts.title)
  if (opts.description != null) manifest.description = String(opts.description)
  if (opts.category != null) manifest.category = String(opts.category)

  fs.mkdirSync(papersDir, { recursive: true })
  const destPdf = path.join(papersDir, destPdfName)
  fs.copyFileSync(sourcePdf, destPdf)
  console.log('Wrote', path.relative(siteRoot, destPdf))

  if (opts.thumb != null) {
    const thumbSrc = path.resolve(String(opts.thumb))
    if (!fs.existsSync(thumbSrc)) {
      console.error('Thumbnail not found:', thumbSrc)
      process.exit(1)
    }
    const ext = path.extname(thumbSrc).toLowerCase() || '.jpg'
    fs.mkdirSync(insightsDir, { recursive: true })
    const thumbSlug = slug || slugifyFilename(destPdfName)
    const thumbDest = path.join(insightsDir, `${thumbSlug}-thumb${ext}`)
    fs.copyFileSync(thumbSrc, thumbDest)
    manifest.thumbnailUrl = `/insights/${path.basename(thumbDest)}`
    console.log('Wrote', path.relative(siteRoot, thumbDest))
  }

  manifest.revision = manifest.revision + 1
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  )
  console.log(
    'Updated src/content/featured-insight.json — revision',
    manifest.revision,
  )
  console.log('\nNext: git commit, push, and let Vercel deploy (or run npm run dev locally).')
}

main()
