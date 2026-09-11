import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../build.mjs'
import { config, url } from '../config.mjs'
import { geometry, brand } from '../src/brand.mjs'
import * as copy from '../content/site.mjs'
import { loadReleases, parseName } from '../lib/changelog.mjs'

const run = promisify(execFile)
const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, '../dist')
const repository = path.resolve(here, '../..')

let result

before(async () => {
  result = await build({ quiet: true })
})

const read = (route) => readFile(path.join(dist, route), 'utf8')
const routes = ['index.html', 'changelog/index.html', '404.html']
const allPages = async () => Promise.all(routes.map(read))

/* ------------------------------------------------------------------ pages */

describe('pages', () => {
  test('the site is three pages and the assets they need', async () => {
    for (const route of [...routes, 'assets/theme.css', 'assets/site.js', 'favicon.svg', 'robots.txt']) {
      assert.ok((await read(route)).length > 0, `${route} is missing or empty`)
    }
  })

  test('the hero says the thing the product is for', async () => {
    const home = await read('index.html')
    assert.ok(home.includes('Make repeated work go away.'), 'the tagline is not the headline')
    assert.ok(home.includes(copy.hero.standfirst))
    assert.equal((home.match(/<h1\b/g) ?? []).length, 1)
  })

  test('every section the site exists for is on the page', async () => {
    const home = await read('index.html')
    for (const id of ['why', 'how-it-works', 'patterns', 'opportunities', 'insights', 'recommendations', 'assist', 'privacy', 'ai', 'examples', 'preview']) {
      assert.ok(home.includes(`id="${id}"`), `no ${id} section`)
    }
  })

  test('the differentiating argument is made, not implied', async () => {
    const home = await read('index.html')
    assert.ok(home.includes('Automation usually starts too late.'))
    assert.ok(home.includes('It notices the repetition first.'))
    assert.ok(home.includes('The hardest part of automation is knowing what should disappear.'))
  })

  test('the 404 offers a way out', async () => {
    const page = await read('404.html')
    assert.ok(page.includes('We couldn’t find that page.'))
    assert.ok(page.includes(url('')))
    assert.ok(page.includes(config.helpURL))
  })
})

/* ------------------------------------------------------------ truthfulness */

describe('what the site claims', () => {
  test('Assist is described as bounded, and its one current action is named', async () => {
    const home = await read('index.html')
    assert.ok(home.includes('No observed event, AI answer or recommendation can directly cause an action.'))
    assert.ok(home.includes('moving a single file you have chosen'))
    // Never described as doing more than it does.
    for (const overclaim of ['automate your workflow', 'runs your workflows', 'does the work for you']) {
      assert.ok(!home.toLowerCase().includes(overclaim), `Assist is oversold: ${overclaim}`)
    }
  })

  test('AI is optional, and not the headline', async () => {
    const home = await read('index.html')
    assert.ok(home.includes('Useful without AI. Better with it, when you choose.'))
    assert.ok(home.includes('AI can never trigger Assist.'))
    const beforeAI = home.slice(0, home.indexOf('id="ai"'))
    assert.ok(beforeAI.includes('id="privacy"'), 'AI is introduced before privacy')
  })

  test('observation is described as what it is, and not as what it is not', async () => {
    const home = await read('index.html')
    for (const claim of ['No screen recording', 'No keystrokes', 'No page contents', 'No filenames']) {
      assert.ok(home.includes(claim), `the site does not rule out: ${claim}`)
    }
    for (const untrue of ['screen recording of', 'reads your screen', 'monitors everything']) {
      assert.ok(!home.toLowerCase().includes(untrue))
    }
  })

  test('no claim from the banned list survives to a page', async () => {
    for (const [index, html] of (await allPages()).entries()) {
      for (const claim of copy.bannedClaims) {
        assert.ok(!html.toLowerCase().includes(claim.toLowerCase()), `${routes[index]} claims "${claim}"`)
      }
    }
  })

  test('the Preview state is stated plainly and nothing is sold', async () => {
    const home = await read('index.html')
    assert.ok(home.includes('Preview access is currently limited.'))
    assert.ok(!/<form\b/i.test(home), 'there is a form, and no form backend exists')
    assert.ok(!/type="email"/i.test(home))
    assert.ok(!/£\s?\d|\$\s?\d/.test(home), 'a price appeared')
    for (const shell of ['Invite your team', 'Get a free month', 'Unlock more with Pro']) {
      assert.ok(!home.includes(shell), `${shell} is a shell in the app and must not be sold here`)
    }
  })
})

/* ---------------------------------------------------------------- privacy */

describe('the site itself', () => {
  test('nothing on any page reaches a third party', async () => {
    for (const [index, html] of (await allPages()).entries()) {
      const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map((match) => match[1])
      for (const link of external) {
        assert.ok(link.startsWith(config.helpURL), `${routes[index]} reaches ${link}`)
      }
    }
  })

  test('no analytics, no pixels, no session replay', async () => {
    for (const html of await allPages()) {
      for (const tracker of ['gtag', 'googletagmanager', 'analytics', 'plausible', 'posthog', 'hotjar', 'mixpanel', 'clarity.ms', 'fbq(', 'pixel']) {
        assert.ok(!html.toLowerCase().includes(tracker), `found ${tracker}`)
      }
    }
  })

  test('no font is fetched from anywhere', async () => {
    const css = await read('assets/theme.css')
    assert.ok(!css.includes('@import'))
    assert.ok(!css.includes('fonts.googleapis'))
    assert.ok(!css.includes('src: url('))
    assert.ok(css.includes('-apple-system'), 'the system font stack is missing')
  })

  test('the only script does one thing and stores nothing', async () => {
    const script = await read('assets/site.js')
    for (const forbidden of ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'document.cookie', 'navigator.sendBeacon']) {
      assert.ok(!script.includes(forbidden), `the script uses ${forbidden}`)
    }
  })

  test('the tester disk image is never named or linked', async () => {
    for (const [index, html] of (await allPages()).entries()) {
      assert.ok(!/\.dmg\b/i.test(html), `${routes[index]} names a disk image`)
      assert.ok(!/Onceaway-\d+\.\d+\.\d+/.test(html), `${routes[index]} names a specific build`)
    }
  })

  test('nothing shaped like a private detail reaches a public page', async () => {
    for (const [index, html] of (await allPages()).entries()) {
      assert.ok(!/\btask\s?\d+\b/i.test(html), `${routes[index]} names an internal task`)
      assert.ok(!/\/Users\/[A-Za-z]/.test(html), `${routes[index]} contains somebody's file path`)
      assert.ok(!/localhost|127\.0\.0\.1/i.test(html), `${routes[index]} contains a local address`)
      // A bare hex run of commit length, ignoring CSS colours.
      assert.ok(
        !/\b[0-9a-f]{7,40}\b/.test(html.replace(/#[0-9a-f]{3,8}\b/gi, '')),
        `${routes[index]} contains something shaped like a commit hash`
      )
    }
  })
})

/* ------------------------------------------------------------------ brand */

describe('brand', () => {
  test('the palette is the locked one', () => {
    assert.deepEqual(brand, {
      ink: '#0F1218',
      surface: '#171C25',
      border: '#262D3A',
      signalGreen: '#4FD6A6',
      offWhite: '#E9ECF1',
      greenText: '#1F9F74',
      muted: '#7D8594',
    })
  })

  test('every locked colour is in the stylesheet, and no other green is', async () => {
    const css = (await read('assets/theme.css')).toLowerCase()
    for (const value of Object.values(brand)) {
      assert.ok(css.includes(value.toLowerCase()), `${value} is missing from the stylesheet`)
    }
    // A second mint would be a second brand.
    const greens = [...css.matchAll(/#[0-9a-f]{6}/g)]
      .map((match) => match[0])
      .filter((hex) => {
        const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16))
        return g > r + 40 && g > b + 20
      })
    assert.deepEqual([...new Set(greens)].sort(), ['#1f9f74', '#4fd6a6', '#63e0b4'].sort(),
      'an unapproved green appeared; #63e0b4 is the hover state of the locked mint')
  })

  test('the dot has left the ring, and the arc is one open stroke', async () => {
    // Centre (24,24), radius 17: the dot's distance from the centre must be
    // greater than the radius, in the upper right. That is the whole idea.
    const dx = geometry.dotCentreX - 24
    const dy = 24 - geometry.dotCentreY
    assert.ok(Math.hypot(dx, dy) > 17, 'the dot is inside the ring')
    assert.ok(dx > 0 && dy > 0, 'the dot is not in the upper right')
    assert.equal((geometry.arcPath.match(/A/g) ?? []).length, 1, 'the mark is not a single arc')
    assert.ok(!geometry.arcPath.includes('Z'), 'the arc is closed')

    const home = await read('index.html')
    assert.ok(home.includes(geometry.arcPath), 'the page does not use the brief’s path data')
    // The only vector on the page is the mark. The superseded eye, or any
    // other drawing that crept in, would show up as a second path.
    const paths = [...home.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1])
    assert.ok(paths.length > 0, 'the mark is not on the page')
    assert.deepEqual([...new Set(paths)], [geometry.arcPath], 'the page draws something other than the mark')
  })

  test('the wordmark is lower case with the mark standing in for its o', async () => {
    const home = await read('index.html')
    assert.ok(home.includes('>nceaway</span>'))
    assert.ok(!home.includes('OnceAway'), 'the wordmark is camel case somewhere')
    assert.ok(!home.includes('ONCEAWAY'), 'the wordmark is shouting somewhere')
    assert.equal(config.wordmarkTail, 'nceaway')
  })
})

/* ---------------------------------------------------------------- content */

describe('content', () => {
  test('the changelog is rendered from the release notes, not retyped', async () => {
    const releases = await loadReleases()
    assert.ok(releases.length >= 1)
    const page = await read('changelog/index.html')
    for (const release of releases) {
      assert.ok(page.includes(release.title), `${release.slug} is missing from the changelog`)
      for (const section of ['Added', 'Improved', 'Fixed', 'Known limitations']) {
        assert.ok(page.includes(`>${section}</h2>`), `${release.slug} is missing ${section}`)
      }
    }
    // Nothing is stored in this project: the words come from Docs/Releases.
    const source = await readFile(path.join(repository, 'Docs/Releases/0.5.0-test2.md'), 'utf8')
    assert.ok(source.includes('corrected Onceaway brand'))
    assert.ok(page.includes('corrected Onceaway brand'))
  })

  test('a release file name says which release it is', () => {
    assert.deepEqual(parseName('0.5.0-test2'), { version: '0.5.0', label: 'test2' })
    assert.deepEqual(parseName('0.6.0'), { version: '0.6.0', label: null })
  })

  test('product vocabulary matches the app', async () => {
    const home = await read('index.html')
    for (const term of ['Pattern', 'Opportunit', 'Recommendation', 'Insights', 'Assist', 'Privacy']) {
      assert.ok(home.includes(term), `the site avoids the product's own word: ${term}`)
    }
    // No fourth name for something that already has one.
    for (const invented of ['Workflow Radar', 'Repetition Engine', 'Automation Score', 'Onceaway Journey']) {
      assert.ok(!home.includes(invented), `invented product name: ${invented}`)
    }
  })
})

/* ----------------------------------------------------------- the shell */

describe('structure and access', () => {
  test('each page is navigable by keyboard and describes itself', async () => {
    for (const [index, html] of (await allPages()).entries()) {
      assert.ok(html.includes('class="skip-link" href="#main"'), `${routes[index]} has no skip link`)
      assert.ok(html.includes('id="main"'), `${routes[index]} has no main landmark`)
      assert.ok(html.includes('lang="en-GB"'))
      assert.ok(html.includes('name="viewport"'))
      assert.ok(html.includes('<meta name="description"'))
      assert.ok(/<nav class="nav" aria-label="Main">/.test(html) || routes[index] !== 'index.html')
    }
  })

  test('the stylesheet keeps its promises about motion and focus', async () => {
    const css = await read('assets/theme.css')
    assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'))
    assert.ok(css.includes(':focus-visible'))
    // A hidden starting state is how a page ends up blank. There is none.
    assert.ok(!/\.reveal\s*\{[^}]*opacity:\s*0/.test(css), 'content starts hidden')
    assert.ok(!/animation:[^;]*\bboth\b/.test(css.replace(/\.mark--leaving[^}]*}/g, '')),
      'a section animation fills backwards, which paints it invisible when queued')
  })

  test('every drawn product frame is hidden from screen readers and described', async () => {
    const home = await read('index.html')
    const drawn = home.match(/<div class="app" aria-hidden="true">/g) ?? []
    assert.ok(drawn.length > 0, 'the page draws no product frames at all')
    // A drawn frame is decoration: its invented contents are hidden, and the
    // figure around it carries the one description a screen reader should get.
    const figures = home.match(/<figure class="frame[^"]*"[^>]*>/g) ?? []
    const described = figures.filter((tag) => tag.includes('role="img"') && tag.includes('aria-label="'))
    assert.equal(described.length, drawn.length, 'a drawn frame has no description')
  })

  test('the hero animation can be stopped, and is not sent to everyone', async () => {
    const home = await read('index.html')
    // `public/hero/` is optional, so this only applies where it exists.
    if (!home.includes('frame--loop')) return
    // The tour is several images, and a screen reader should hear one
    // description of it rather than four near-identical ones.
    const tour = home.match(/<img class="loop__frame"[\s\S]*?>/g) ?? []
    assert.ok(tour.length > 1, 'the tour has fewer than two frames')
    const spoken = tour.filter((tag) => /\balt="[^"]+"/.test(tag))
    assert.equal(spoken.length, 1, 'the tour should carry exactly one description')
    for (const tag of tour.filter((tag) => !/\balt="[^"]+"/.test(tag))) {
      assert.ok(/\balt=""/.test(tag) && tag.includes('aria-hidden="true"'), 'a tour frame is neither described nor hidden')
    }

    // Reduced motion is settled by the stylesheet, not by a second asset.
    const css = await read('assets/theme.css')
    assert.ok(
      /@media \(prefers-reduced-motion: reduce\) \{[^}]*\.loop__frame[\s\S]*?animation:\s*none/.test(css),
      'the tour still animates for people who asked for less motion'
    )
    // Moving content that runs past five seconds has to be stoppable, and the
    // control must not appear until the script that works it has run.
    assert.ok(home.includes('class="loop-toggle" type="button" hidden'), 'the pause control ships visible')

    const js = await read('assets/site.js')
    assert.ok(js.includes('toggle.hidden = false'), 'nothing reveals the pause control')
    // The script walks up from the button to find the image it controls. If
    // the markup moves the button out of that container the button is simply
    // never revealed, and the page looks fine while failing silently.
    const container = js.match(/toggle\.closest\('\.([\w-]+)'\)/)
    assert.ok(container, 'the script no longer looks for a container')
    assert.ok(
      new RegExp(`<div class="${container[1]}">[\\s\\S]*?loop-toggle`).test(home),
      `the pause control is not inside the .${container[1]} the script looks for`
    )
  })

  test('nothing is decided by colour alone', async () => {
    const home = await read('index.html')
    // The two observation lists are told apart by their headings, not their
    // bullet colour.
    assert.ok(home.includes('What Onceaway notices'))
    assert.ok(home.includes('What it never does'))
  })
})

/* ------------------------------------------------------------ portability */

describe('portability', () => {
  test('the site can be served from a subfolder without editing a link', async () => {
    await run('node', ['build.mjs'], {
      cwd: path.resolve(here, '..'),
      env: { ...process.env, SITE_BASE: '/onceaway/', SITE_ORIGIN: 'https://example.test', SITE_INDEXING: 'true' },
    })
    const home = await read('index.html')
    assert.ok(home.includes('href="/onceaway/assets/theme.css"') || home.includes('/onceaway/assets/theme.css'))
    assert.ok(home.includes('/onceaway/changelog/'))
    assert.ok(home.includes('<link rel="canonical" href="https://example.test/onceaway/">'))
    const robots = await read('robots.txt')
    assert.ok(robots.includes('Allow: /'))
    assert.ok((await read('sitemap.xml')).includes('https://example.test/onceaway/changelog/'))
    // Put it back the way the repository expects it.
    await run('node', ['build.mjs'], { cwd: path.resolve(here, '..') })
  })

  test('with no domain configured, no address is invented', async () => {
    const home = await read('index.html')
    assert.ok(!home.includes('<link rel="canonical"'), 'a canonical URL appeared without an origin')
    assert.ok(!home.includes('goonceaway'), 'an unapproved domain appeared')
    assert.ok((await read('robots.txt')).includes('Disallow: /'), 'the Preview site invites indexing')
  })

  test('the build is small and has one dependency', async () => {
    const manifest = JSON.parse(await readFile(path.resolve(here, '../package.json'), 'utf8'))
    assert.deepEqual(Object.keys(manifest.dependencies), ['markdown-it'])
    assert.equal(manifest.devDependencies, undefined)
    const css = await read('assets/theme.css')
    const script = await read('assets/site.js')
    assert.ok(css.length + script.length < 40_000, 'the assets have got heavy')
  })
})
