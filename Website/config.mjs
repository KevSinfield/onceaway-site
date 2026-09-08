/**
 * Everything about this site a person might reasonably want to change without
 * touching the build. Nothing here is secret, and nothing is sent anywhere.
 */
export const config = {
  siteName: 'Onceaway',
  productName: 'Onceaway',
  /** The wordmark after the mark, which stands in for its leading "o". */
  wordmarkTail: 'nceaway',
  tagline: 'Make repeated work go away.',
  description:
    'Onceaway notices the work you repeat on your Mac, helps you see which of it is worth reducing, and can help you do something about it — when you ask.',

  /**
   * Where the site will eventually live. Used only for canonical URLs and
   * Open Graph tags, and empty until a domain actually exists. No Onceaway
   * domain has been approved, and putting a fictional one into every page
   * would be worse than leaving them out: the site works without it.
   */
  origin: process.env.SITE_ORIGIN ?? '',

  /**
   * Path the site is served from. `/` for a dedicated domain, `/onceaway/`
   * to hang it off an existing one. Every generated link runs through this,
   * so moving is a one-line change rather than a find-and-replace.
   */
  basePath: process.env.SITE_BASE ?? '/',

  /**
   * Whether search engines are invited in. False while Onceaway is in
   * Preview: there is nothing to sign up for yet, so ranking for it would
   * only disappoint whoever arrived. Deployment policy is a later decision.
   */
  allowIndexing: process.env.SITE_INDEXING === 'true',

  /**
   * The published Help site. Real, approved, and the only external
   * destination this site links to.
   */
  helpURL: 'https://kevsinfield.github.io/onceaway-help/',
  helpLabel: 'Onceaway Help',

  /**
   * What the public may currently do about getting Onceaway.
   *
   * `invitationURL` is null because no signup exists. While it is null the
   * Preview section states plainly that access is limited and offers Help
   * instead — it never renders a form that goes nowhere, and it never links
   * the tester build, which is signed for one machine and would not open on
   * anybody else's.
   */
  preview: {
    label: 'Onceaway Preview',
    version: '0.5.0',
    invitationURL: null,
  },
}

/** Joins a site-relative path onto the configured base path. */
export function url(path = '') {
  const base = config.basePath.endsWith('/') ? config.basePath : `${config.basePath}/`
  const clean = String(path).replace(/^\/+/, '')
  return `${base}${clean}`
}

/** An absolute URL when an origin is configured, and nothing otherwise. */
export function absoluteURL(path = '') {
  if (!config.origin) return null
  return new URL(url(path), config.origin).href
}
