import { config, url, absoluteURL } from '../config.mjs'
import { markSvg } from '../src/brand.mjs'
import { screens } from '../content/screens.mjs'
import * as copy from '../content/site.mjs'
import { escapeHtml, eyebrow, list, lockup, paragraphs, productFrame, section } from './components.mjs'

/* ------------------------------------------------------------------ shell */

const nav = [
  { label: 'How it works', href: `${url('')}#how-it-works` },
  { label: 'Privacy & Security', href: url('privacy-security/') },
  { label: 'Changelog', href: url('changelog/') },
  { label: 'Help', href: config.helpURL, external: true },
]

const navLink = ({ label, href, external }) =>
  `<a class="nav__link" href="${href}"${external ? ' rel="noreferrer"' : ''}>${escapeHtml(label)}${
    external ? '<span class="visually-hidden"> (opens the Help site)</span>' : ''
  }</a>`

const header = () => `
<header class="header">
  <div class="wrap header__inner">
    ${lockup({ size: 26 })}
    <nav class="nav" aria-label="Main">
      ${nav.map(navLink).join('')}
      <a class="button button--small" href="${url('')}#preview">Preview</a>
    </nav>
  </div>
</header>`

const footer = () => `
<footer class="footer">
  <div class="wrap footer__inner">
    <div>
      <p class="footer__brand">${markSvg({ size: 20 })}<span>${escapeHtml(config.wordmarkTail)}</span></p>
      <p class="footer__tagline">${escapeHtml(copy.footer.tagline)}</p>
    </div>
    <nav class="footer__links" aria-label="Footer">
      <a href="${url('')}#how-it-works">How it works</a>
      <a href="${url('')}#privacy">Privacy</a>
      <a href="${url('privacy-security/')}">Privacy &amp; Security</a>
      <a href="${url('changelog/')}">Changelog</a>
      <a href="${config.helpURL}" rel="noreferrer">${escapeHtml(config.helpLabel)}</a>
    </nav>
    <p class="footer__note">${escapeHtml(copy.footer.note)}</p>
  </div>
</footer>`

/**
 * The page shell.
 *
 * No fonts are fetched, no scripts are loaded from anywhere else, and there
 * is nothing here that would make a request to a third party. A visitor's
 * browser talks to this site and nothing else.
 */
function page({ title, description, route = '', body, bodyClass = '' }) {
  const canonical = absoluteURL(route)
  const social = absoluteURL('social-card.svg')
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${config.allowIndexing ? '' : '<meta name="robots" content="noindex, nofollow">\n'}${
    canonical ? `<link rel="canonical" href="${canonical}">\n` : ''
  }<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(config.siteName)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}${
    social ? `<meta property="og:image" content="${social}">\n` : ''
  }<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${url('assets/theme.css')}">
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to content</a>
${header()}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
<script src="${url('assets/site.js')}" defer></script>
</body>
</html>
`
}

/* ------------------------------------------------------------------- home */

const heroSection = (screenshots) => `
<section class="band band--paper hero">
  <div class="wrap hero__inner">
    <div class="hero__text">
      ${eyebrow(copy.hero.eyebrow)}
      <h1 class="hero__headline">${escapeHtml(copy.hero.headline)}</h1>
      <p class="hero__standfirst">${escapeHtml(copy.hero.standfirst)}</p>
      <p class="hero__actions">
        <a class="button" href="${copy.hero.primary.href}">${escapeHtml(copy.hero.primary.label)}</a>
        <a class="button button--quiet" href="${config.helpURL}" rel="noreferrer">${escapeHtml(
          copy.hero.secondary.label
        )}</a>
      </p>
      <p class="hero__note">${escapeHtml(copy.hero.note)}</p>
    </div>
    <div class="hero__visual">
      ${productFrame(screens.home, { screenshots, className: 'frame--hero' })}
    </div>
  </div>
</section>`

const lateStartSection = () =>
  section({
    id: 'why',
    tone: 'ink',
    inner: `
    <div class="lede">
      ${eyebrow(copy.lateStart.eyebrow)}
      <h2>${escapeHtml(copy.lateStart.heading)}</h2>
      <p class="standfirst">${escapeHtml(copy.lateStart.standfirst)}</p>
    </div>
    <ol class="chain">
      ${copy.lateStart.chain
        .map(
          (link) =>
            `<li class="chain__item"><span class="chain__step">${escapeHtml(
              link.step
            )}</span> ${escapeHtml(link.text)}</li>`
        )
        .join('')}
    </ol>
    <p class="turn">${escapeHtml(copy.lateStart.turn)}</p>
    <blockquote class="pull">
      <p>${escapeHtml(copy.lateStart.pullQuote)}</p>
      <p class="pull__answer">${escapeHtml(copy.lateStart.pullQuoteAnswer)}</p>
    </blockquote>`,
  })

const howSection = () =>
  section({
    id: 'how-it-works',
    tone: 'light',
    inner: `
    <div class="lede">
      ${eyebrow(copy.howItWorks.eyebrow)}
      <h2>${escapeHtml(copy.howItWorks.heading)}</h2>
    </div>
    <ol class="steps">
      ${copy.howItWorks.steps
        .map(
          (step, index) => `
      <li class="step">
        <span class="step__number" aria-hidden="true">${index + 1}</span>
        <h3 class="step__title">${escapeHtml(step.title)}</h3>
        <p class="step__text">${escapeHtml(step.text)}</p>
      </li>`
        )
        .join('')}
    </ol>`,
  })

/** A product section: words on one side, the app on the other. */
const featureSection = ({ id, tone, block, screen, screenshots, flip = false }) =>
  section({
    id,
    tone,
    className: `feature${flip ? ' feature--flip' : ''}`,
    inner: `
    <div class="feature__inner">
      <div class="feature__text">
        ${eyebrow(block.eyebrow)}
        <h2>${escapeHtml(block.heading)}</h2>
        ${paragraphs(block.body)}
        ${block.points ? list(block.points) : ''}
      </div>
      <div class="feature__visual">${productFrame(screen, { screenshots })}</div>
    </div>`,
  })

const assistSection = () =>
  section({
    id: 'assist',
    tone: 'ink',
    inner: `
    <div class="lede">
      ${eyebrow(copy.assist.eyebrow)}
      <h2>${escapeHtml(copy.assist.heading)}</h2>
      <p class="principle">${escapeHtml(copy.assist.principle)}</p>
      ${paragraphs(copy.assist.body, 'standfirst')}
    </div>
    <ol class="gates">
      <li>You choose the file.</li>
      <li>You choose where it goes.</li>
      <li>You see exactly what will happen.</li>
      <li>You approve it.</li>
      <li>Then, and only then, it runs.</li>
    </ol>
    <div class="note-card">
      <h3>${escapeHtml(copy.assist.limitation.heading)}</h3>
      <p>${escapeHtml(copy.assist.limitation.text)}</p>
    </div>`,
  })

const privacySection = () =>
  section({
    id: 'privacy',
    tone: 'paper',
    inner: `
    <div class="lede">
      ${eyebrow(copy.privacy.eyebrow)}
      <h2>${escapeHtml(copy.privacy.heading)}</h2>
      <p class="principle principle--light">${escapeHtml(copy.privacy.principle)}</p>
      <p class="standfirst">${escapeHtml(copy.privacy.standfirst)}</p>
    </div>
    <div class="cards">
      ${copy.privacy.cards
        .map(
          (card) => `
      <article class="card">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.text)}</p>
      </article>`
        )
        .join('')}
    </div>
    <div class="columns">
      <div class="column">
        <h3>${escapeHtml(copy.observes.notices.title)}</h3>
        ${list(copy.observes.notices.items)}
      </div>
      <div class="column column--never">
        <h3>${escapeHtml(copy.observes.never.title)}</h3>
        ${list(copy.observes.never.items, 'crosses')}
      </div>
    </div>`,
  })

const notSurveillanceSection = () =>
  section({
    tone: 'light',
    className: 'statement',
    inner: `
    ${eyebrow(copy.notSurveillance.eyebrow)}
    <h2>${escapeHtml(copy.notSurveillance.heading)}</h2>
    ${paragraphs(copy.notSurveillance.body, 'standfirst')}
    <p class="statement__line">${escapeHtml(copy.notSurveillance.line)}</p>`,
  })

const aiSection = () =>
  section({
    id: 'ai',
    tone: 'light',
    inner: `
    <div class="split">
      <div>
        ${eyebrow(copy.ai.eyebrow)}
        <h2>${escapeHtml(copy.ai.heading)}</h2>
      </div>
      <div>
        ${paragraphs(copy.ai.body)}
        ${list(copy.ai.points)}
      </div>
    </div>`,
  })

const useCasesSection = () =>
  section({
    id: 'examples',
    tone: 'paper',
    inner: `
    <div class="lede">
      ${eyebrow(copy.useCases.eyebrow)}
      <h2>${escapeHtml(copy.useCases.heading)}</h2>
      <p class="standfirst">${escapeHtml(copy.useCases.standfirst)}</p>
    </div>
    <div class="cards cards--three">
      ${copy.useCases.items
        .map(
          (item) => `
      <article class="card card--quiet">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>`
        )
        .join('')}
    </div>
    <div class="audience">
      <h3>${escapeHtml(copy.audience.heading)}</h3>
      <p class="standfirst">${escapeHtml(copy.audience.standfirst)}</p>
      <p class="chips">${copy.audience.examples
        .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
        .join('')}</p>
    </div>`,
  })

const macSection = () =>
  section({
    tone: 'light',
    inner: `
    <div class="lede">
      ${eyebrow(copy.macNative.eyebrow)}
      <h2>${escapeHtml(copy.macNative.heading)}</h2>
    </div>
    <div class="cards cards--four">
      ${copy.macNative.items
        .map(
          (item) => `
      <article class="card card--quiet">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>`
        )
        .join('')}
    </div>`,
  })

/**
 * The Preview section.
 *
 * There is no signup, so there is no form: a field that goes nowhere is
 * worse than an honest sentence. The tester disk image is not linked here or
 * anywhere else on the site — it is signed only for the machine that built
 * it, and handing it to the public would be handing out something that does
 * not work.
 */
const previewSection = () => {
  const invitation = config.preview.invitationURL
  return section({
    id: 'preview',
    tone: 'ink',
    inner: `
    <div class="lede">
      ${eyebrow(copy.preview.eyebrow)}
      <h2>${escapeHtml(copy.preview.heading)}</h2>
      ${paragraphs(copy.preview.body, 'standfirst')}
    </div>
    <div class="preview">
      <div class="preview__state">
        <p class="preview__platform">${markSvg({ size: 22 })}<span>${escapeHtml(
          copy.preview.state.platform
        )}</span></p>
        <p class="preview__label">${escapeHtml(copy.preview.state.label)}</p>
        <p class="preview__detail">${escapeHtml(copy.preview.state.detail)}</p>
        ${
          invitation
            ? `<p><a class="button" href="${invitation}" rel="noreferrer">Join the Preview</a></p>`
            : ''
        }
      </div>
      <div class="preview__help">
        <h3>${escapeHtml(copy.preview.help.heading)}</h3>
        <p>${escapeHtml(copy.preview.help.text)}</p>
        <p><a class="button button--quiet" href="${config.helpURL}" rel="noreferrer">${escapeHtml(
          copy.preview.help.label
        )}</a></p>
      </div>
    </div>`,
  })
}

/**
 * The five-second version, directly under the hero.
 *
 * A strip rather than a band: it is a summary of promises kept further down,
 * not a place to make new ones.
 */
const trustStripSection = () => `
<section class="band band--paper strip-band" aria-label="${escapeHtml(copy.trustStrip.label)}">
  <div class="wrap">
    <ul class="strip">
      ${copy.trustStrip.items
        .map((item) => `<li class="strip__item">${escapeHtml(item)}</li>`)
        .join('')}
    </ul>
  </div>
</section>`

const offlineSection = () =>
  section({
    id: 'offline',
    tone: 'paper',
    inner: `
    <div class="lede">
      ${eyebrow(copy.offline.eyebrow)}
      <h2>${escapeHtml(copy.offline.heading)}</h2>
      ${paragraphs(copy.offline.body, 'standfirst')}
    </div>
    <ul class="strip strip--inline">
      ${copy.offline.strip.map((item) => `<li class="strip__item">${escapeHtml(item)}</li>`).join('')}
    </ul>
    <p class="principle principle--light">${escapeHtml(copy.offline.line)}</p>`,
  })

const feedbackSection = () =>
  section({
    id: 'feedback',
    tone: 'light',
    inner: `
    <div class="lede">
      ${eyebrow(copy.feedback.eyebrow)}
      <h2>${escapeHtml(copy.feedback.heading)}</h2>
      <p class="standfirst">${escapeHtml(copy.feedback.standfirst)}</p>
    </div>
    <div class="columns">
      <div class="column">
        <h3>${escapeHtml(copy.feedback.sends.title)}</h3>
        ${list(copy.feedback.sends.items)}
      </div>
      <div class="column column--never">
        <h3>${escapeHtml(copy.feedback.withheld.title)}</h3>
        ${list(copy.feedback.withheld.items, 'crosses')}
      </div>
    </div>
    <p class="principle principle--light">${escapeHtml(copy.feedback.line)}</p>`,
  })

const breachSection = () =>
  section({
    id: 'breach',
    tone: 'ink',
    inner: `
    <div class="lede">
      ${eyebrow(copy.breach.eyebrow)}
      <h2>${escapeHtml(copy.breach.heading)}</h2>
      ${paragraphs(copy.breach.body, 'standfirst')}
    </div>
    <p class="principle">${escapeHtml(copy.breach.line)}</p>`,
  })

const faqSection = () =>
  section({
    id: 'faq',
    tone: 'paper',
    inner: `
    <div class="lede">
      ${eyebrow(copy.faq.eyebrow)}
      <h2>${escapeHtml(copy.faq.heading)}</h2>
    </div>
    <div class="faq">
      ${copy.faq.items
        .map(
          (item) => `
      <div class="faq__item">
        <h3 class="faq__question">${escapeHtml(item.question)}</h3>
        <p class="faq__answer">${escapeHtml(item.answer)}</p>
      </div>`
        )
        .join('')}
    </div>
    <p class="hero__actions"><a class="button button--quiet" href="${url(
      'privacy-security/'
    )}">${escapeHtml(copy.faq.more)}</a></p>`,
  })

export function homePage({ screenshots = new Set() } = {}) {
  return page({
    title: `${config.productName} — ${config.tagline}`,
    description: config.description,
    bodyClass: 'home',
    body: [
      heroSection(screenshots),
      trustStripSection(),
      lateStartSection(),
      howSection(),
      featureSection({
        id: 'patterns',
        tone: 'paper',
        block: copy.patterns,
        screen: screens.patterns,
        screenshots,
      }),
      featureSection({
        id: 'opportunities',
        tone: 'light',
        block: copy.opportunities,
        screen: screens.opportunity,
        screenshots,
        flip: true,
      }),
      featureSection({
        id: 'insights',
        tone: 'paper',
        block: copy.insights,
        screen: screens.insights,
        screenshots,
      }),
      section({
        id: 'recommendations',
        tone: 'light',
        inner: `
        <div class="split">
          <div>
            ${eyebrow(copy.recommendations.eyebrow)}
            <h2>${escapeHtml(copy.recommendations.heading)}</h2>
          </div>
          <div>
            ${paragraphs(copy.recommendations.body)}
            ${list(copy.recommendations.points)}
          </div>
        </div>`,
      }),
      assistSection(),
      privacySection(),
      offlineSection(),
      feedbackSection(),
      breachSection(),
      notSurveillanceSection(),
      aiSection(),
      useCasesSection(),
      macSection(),
      faqSection(),
      previewSection(),
    ].join('\n'),
  })
}

/* -------------------------------------------------- privacy and security */

export function privacySecurityPage() {
  const block = copy.privacyPage
  const body = section({
    tone: 'paper',
    className: 'prose-band privacy-page',
    inner: `
    <div class="lede">
      ${eyebrow(block.eyebrow)}
      <h1>${escapeHtml(block.headline)}</h1>
      <p class="standfirst">${escapeHtml(block.standfirst)}</p>
      <p class="hero__note">${escapeHtml(block.note)}</p>
    </div>
    <div class="pp">
      <nav class="contents" aria-label="On this page">
        <p class="contents__title">On this page</p>
        ${block.sections
          .map((item) => `<a href="#${item.id}">${escapeHtml(item.question)}</a>`)
          .join('')}
      </nav>
      <div class="pp__body">
        ${block.sections
          .map(
            (item) => `
        <article class="qa" id="${item.id}">
          <h2 class="qa__question">${escapeHtml(item.question)}</h2>
          ${item.answer ? `<p class="qa__answer">${escapeHtml(item.answer)}</p>` : ''}
          ${paragraphs(item.body)}
        </article>`
          )
          .join('')}
        <div class="note-card">
          <h3>${escapeHtml(block.help.heading)}</h3>
          <p>${escapeHtml(block.help.text)}</p>
          <p><a class="button button--quiet" href="${config.helpURL}" rel="noreferrer">${escapeHtml(
            config.helpLabel
          )}</a></p>
        </div>
      </div>
    </div>`,
  })
  return page({
    title: `Privacy and Security — ${config.productName}`,
    description:
      'What Onceaway observes, what it never records, where it is stored, and what leaves your Mac when you send feedback.',
    route: 'privacy-security/',
    body,
  })
}

/* -------------------------------------------------------------- changelog */

export function changelogPage(releases) {
  const body = section({
    tone: 'paper',
    className: 'prose-band',
    inner: `
    <div class="lede">
      ${eyebrow('Changelog')}
      <h1>What changed</h1>
      <p class="standfirst">Release notes for ${escapeHtml(
        config.productName
      )}, newest first. Onceaway is in Preview, so these describe test builds.</p>
    </div>
    ${
      releases.length
        ? releases
            .map(
              (release) => `
    <article class="release">
      <h2 id="${escapeHtml(release.slug)}">${escapeHtml(release.title)}</h2>
      <div class="prose">${release.html}</div>
    </article>`
            )
            .join('')
        : '<p class="standfirst">Nothing published yet.</p>'
    }`,
  })
  return page({
    title: `What changed — ${config.productName}`,
    description: `Release notes for ${config.productName}.`,
    route: 'changelog/',
    body,
  })
}

/* -------------------------------------------------------------------- 404 */

export function notFoundPage() {
  return page({
    title: `Page not found — ${config.productName}`,
    description: 'That page could not be found.',
    body: section({
      tone: 'paper',
      className: 'notfound',
      inner: `
      <div class="lede">
        ${markSvg({ size: 48 })}
        <h1>We couldn’t find that page.</h1>
        <p class="standfirst">It may have moved, or it may never have existed. Both happen.</p>
        <p class="hero__actions">
          <a class="button" href="${url('')}">Back to ${escapeHtml(config.productName)}</a>
          <a class="button button--quiet" href="${config.helpURL}" rel="noreferrer">${escapeHtml(
            config.helpLabel
          )}</a>
        </p>
      </div>`,
    }),
  })
}
