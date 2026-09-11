import { config } from '../config.mjs'
import { bannedClaims, hero } from '../content/site.mjs'

/**
 * What the site is not allowed to say, checked on the generated HTML rather
 * than on the source.
 *
 * A page is the thing a visitor reads, so it is the thing worth checking:
 * copy assembled from three files can say something none of them says on its
 * own. The build fails rather than warns — an overclaim that ships is a
 * promise somebody has to keep.
 *
 * Everything here is generic web hygiene and runs wherever the site is built.
 * The project's own internal vocabulary is passed in from a file that is not
 * published; see `content/internal-terms.mjs` for why.
 */

/** Anything that would make a visitor's browser talk to somebody else. */
const trackerSignatures = [
  'googletagmanager',
  'google-analytics',
  'gtag(',
  'plausible.io',
  'posthog',
  'segment.com',
  'hotjar',
  'mixpanel',
  'facebook.net',
  'connect.facebook',
  'snap.licdn.com',
  'clarity.ms',
  'fullstory',
  'logrocket',
  'sentry.io',
  'fbq(',
]

/** Fonts and scripts fetched from elsewhere. */
const externalAssetSignatures = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com']

/** Prices we have not agreed and would have to honour. */
const pricingSignatures = [/£\s?\d/, /\$\s?\d/, /\d+\s?(?:per|\/)\s?month/i, /free trial/i, /founding (?:price|member)/i]

export function validate(pages, { internalTerms = [] } = {}) {
  const problems = []
  const say = (route, message) => problems.push(`${route}: ${message}`)

  for (const [route, html] of pages) {
    const text = html.toLowerCase()

    for (const claim of bannedClaims) {
      if (text.includes(claim.toLowerCase())) say(route, `makes a claim we cannot stand behind: "${claim}"`)
    }
    for (const term of internalTerms) {
      if (text.includes(term.toLowerCase())) say(route, `leaks an internal term: "${term}"`)
    }
    for (const signature of trackerSignatures) {
      if (text.includes(signature)) say(route, `loads a tracker: "${signature}"`)
    }
    for (const signature of externalAssetSignatures) {
      if (text.includes(signature)) say(route, `fetches an asset from elsewhere: "${signature}"`)
    }
    for (const pattern of pricingSignatures) {
      if (pattern.test(html)) say(route, `publishes a price or a commercial promise: ${pattern}`)
    }
    // Task numbers and commit hashes belong to the engineering side.
    if (/\btask\s?\d+\b/i.test(html)) say(route, 'mentions an internal task number')
    if (/\b[0-9a-f]{7,40}\b/.test(html.replace(/#[0-9a-f]{3,8}\b/gi, ''))) {
      say(route, 'contains something shaped like a commit hash')
    }
    if (/\.dmg\b/i.test(html)) say(route, 'links or names a disk image')
    if (/localhost|127\.0\.0\.1/i.test(html)) say(route, 'contains a local address')
    if (/\/Users\/[A-Za-z]/.test(html)) say(route, "contains a path from somebody's computer")

    // A form with nowhere to go is worse than an honest sentence, so a form
    // is allowed only once an endpoint has been configured — and then only
    // pointing at that endpoint, and only next to a line saying where the
    // address goes. The rule did not go away; it grew the one exception the
    // product actually has.
    const endpoint = config.preview.waitingListEndpoint
    for (const form of html.match(/<form\b[^>]*>/g) ?? []) {
      if (!endpoint) {
        say(route, 'contains a form, and no form endpoint is configured')
      } else if (!form.includes(`action="${endpoint}"`)) {
        say(route, 'contains a form posting somewhere other than the configured endpoint')
      }
    }
    if (/type="email"/i.test(html)) {
      if (!endpoint) say(route, 'asks for an email address with nowhere to send it')
      else if (!html.includes('class="signup__note"')) {
        say(route, 'asks for an email address without saying where it goes')
      }
    }

    // Accessibility and structure basics that are cheap to get wrong.
    if (!html.includes('class="skip-link"')) say(route, 'has no skip link')
    if (!html.includes('lang="en-GB"')) say(route, 'does not declare a language')
    if (!html.includes('<meta name="description"')) say(route, 'has no meta description')
    const h1s = (html.match(/<h1\b/g) ?? []).length
    if (h1s !== 1) say(route, `has ${h1s} first-level headings, and should have exactly one`)
    for (const image of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\balt="/.test(image)) say(route, 'has an image with no alt text')
    }
  }

  // The things the site exists to say.
  const home = pages.find(([route]) => route === 'index.html')?.[1] ?? ''
  if (!home.includes(hero.headline)) problems.push('index.html: the hero headline is missing')
  if (!home.includes(config.helpURL)) problems.push('index.html: the Help site is not linked')
  for (const required of ['id="privacy"', 'id="how-it-works"', 'id="assist"', 'id="preview"', 'id="ai"']) {
    if (!home.includes(required)) problems.push(`index.html: the ${required} section is missing`)
  }

  return problems
}
