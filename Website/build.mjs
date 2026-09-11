import { mkdir, readFile, readdir, rm, writeFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config, url } from './config.mjs'
import { assets } from './lib/assets.mjs'
import { loadReleases } from './lib/changelog.mjs'
import { changelogPage, homePage, notFoundPage, privacySecurityPage } from './lib/templates.mjs'
import { validate } from './lib/validate.mjs'
import { iconSvg, socialCardSvg } from './src/brand.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, 'dist')
const src = path.join(here, 'src')
const publicDir = path.join(here, 'public')

/** Real captures of the app, when any have been taken. */
async function availableScreenshots() {
  try {
    const names = await readdir(path.join(publicDir, 'screenshots'))
    return new Set(names.filter((name) => name.endsWith('.png') || name.endsWith('.webp')))
  } catch {
    return new Set()
  }
}

/**
 * Whether the hero's animated tour is present and complete.
 *
 * All four screens or none: a tour missing a frame would show a gap where a
 * screen should be, and the first frame is also what the hero falls back to
 * for anyone who asked for less motion.
 */
async function heroLoopAvailable() {
  const wanted = ['1-home.webp', '2-patterns.webp', '3-opportunity.webp', '4-insights.webp']
  try {
    const present = new Set(await readdir(path.join(publicDir, 'hero')))
    return wanted.every((file) => present.has(file))
  } catch {
    return false
  }
}

export async function build({ quiet = false } = {}) {
  const log = (...args) => {
    if (!quiet) console.log(...args)
  }

  const screenshots = await availableScreenshots()
  const heroLoop = await heroLoopAvailable()
  const releases = await loadReleases()
  log(
    `Building ${config.siteName}: ${releases.length} release note(s), ${screenshots.size} screenshot(s), ` +
      `hero ${heroLoop ? 'loop' : 'still'}`
  )

  const pages = [
    ['index.html', homePage({ screenshots, heroLoop })],
    [path.join('changelog', 'index.html'), changelogPage(releases)],
    [path.join('privacy-security', 'index.html'), privacySecurityPage()],
    ['404.html', notFoundPage()],
  ]

  // The internal-vocabulary list lives in a file that is not published, so it
  // is loaded if it is here and simply absent if it is not.
  let internalTerms = []
  try {
    ;({ bannedInternalTerms: internalTerms } = await import('./content/internal-terms.mjs'))
  } catch {
    log('  (no internal-term list in this checkout; the generic checks still run)')
  }

  const problems = validate(
    pages.map(([route, html]) => [route.replaceAll(path.sep, '/'), html]),
    { internalTerms }
  )
  if (problems.length) {
    console.error(`\nThe site did not pass its own content check (${problems.length} problem(s)):\n`)
    for (const problem of problems) console.error('  -', problem)
    throw new Error('website validation failed')
  }

  await rm(dist, { recursive: true, force: true })
  await mkdir(path.join(dist, 'assets'), { recursive: true })

  for (const [route, html] of pages) {
    const target = path.join(dist, route)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, html, 'utf8')
  }

  // What the pages linked to a moment ago, written to the paths they named.
  // lib/assets.mjs owns both the contents and the version stamp in the URL,
  // so the bytes that were hashed are the bytes that land here.
  for (const [route, content] of Object.entries(assets)) {
    await writeFile(path.join(dist, ...route.split('/')), content)
  }
  await writeFile(path.join(dist, 'favicon.svg'), iconSvg())
  await writeFile(path.join(dist, 'social-card.svg'), socialCardSvg(config.tagline))
  await copyTree(publicDir, dist)

  // Search engines are told the truth about whether they are wanted, and the
  // sitemap only exists once there is an address to put in it.
  await writeFile(
    path.join(dist, 'robots.txt'),
    config.allowIndexing
      ? `User-agent: *\nAllow: /\n${config.origin ? `Sitemap: ${new URL(url('sitemap.xml'), config.origin).href}\n` : ''}`
      : 'User-agent: *\nDisallow: /\n'
  )
  if (config.origin) {
    const routes = ['', 'changelog/', 'privacy-security/']
    await writeFile(
      path.join(dist, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
        .map((route) => `  <url><loc>${new URL(url(route), config.origin).href}</loc></url>`)
        .join('\n')}\n</urlset>\n`
    )
  }

  log(`Wrote ${pages.length} pages to ${path.relative(here, dist)}/`)
  return { pages, releases, screenshots }
}

/** Copies `public/` verbatim, minus the notes to whoever fills it. */
async function copyTree(from, to) {
  let entries
  try {
    entries = await readdir(from, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.name === 'README.md' || entry.name.startsWith('.')) continue
    const source = path.join(from, entry.name)
    const target = path.join(to, entry.name)
    if (entry.isDirectory()) {
      await mkdir(target, { recursive: true })
      await copyTree(source, target)
    } else {
      await writeFile(target, await readFile(source))
    }
  }
}

/* ------------------------------------------------------------- dev server */

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

async function serve(port = 4321) {
  const server = createServer(async (request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const relative = requested.replace(config.basePath, '/').replace(/^\/+/, '')
    const candidates = [relative, path.join(relative, 'index.html'), '404.html']
    for (const candidate of candidates) {
      const file = path.join(dist, candidate)
      if (!file.startsWith(dist)) continue
      try {
        if ((await stat(file)).isFile()) {
          response.writeHead(candidate === '404.html' ? 404 : 200, {
            'content-type': types[path.extname(file)] ?? 'application/octet-stream',
          })
          response.end(await readFile(file))
          return
        }
      } catch {
        // try the next candidate
      }
    }
    response.writeHead(404).end('Not found')
  })
  server.listen(port, () => console.log(`Serving ${config.siteName} on http://localhost:${port}${config.basePath}`))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await build()
  if (process.argv.includes('--serve')) await serve()
  if (process.argv.includes('--watch')) {
    const { watch } = await import('node:fs')
    for (const directory of [src, path.join(here, 'lib'), path.join(here, 'content'), publicDir]) {
      watch(directory, { recursive: true }, async () => {
        try {
          await build()
        } catch (error) {
          console.error(error.message)
        }
      })
    }
  }
}
