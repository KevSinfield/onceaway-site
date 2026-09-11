import { config, url } from '../config.mjs'
import { markSvg } from '../src/brand.mjs'
import { sidebar } from '../content/screens.mjs'

export const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

/** The mark and the wordmark it stands in for the leading "o" of. */
export const lockup = ({ size = 26, href = url('') } = {}) => `
<a class="lockup" href="${href}">
  ${markSvg({ size })}
  <span class="lockup__text">${escapeHtml(config.wordmarkTail)}</span>
  <span class="visually-hidden">Onceaway home</span>
</a>`

export const eyebrow = (text) => `<p class="eyebrow">${escapeHtml(text)}</p>`

/**
 * A macOS-style window frame around a product screen.
 *
 * When a real capture exists in `public/screenshots/`, it goes inside this
 * frame. When it does not, the frame holds the screen drawn from the app's
 * own words — see `content/screens.mjs` for why both exist.
 */
export function productFrame(screen, { screenshots = new Set(), className = '' } = {}) {
  const hasPhoto = screen.screenshot && screenshots.has(screen.screenshot)
  const inner = hasPhoto
    ? `<img class="frame__shot" src="${url(`screenshots/${screen.screenshot}`)}" alt="${escapeHtml(screen.alt)}" loading="lazy" decoding="async" width="1180" height="760">`
    : appScreen(screen)
  return `
<figure class="frame ${className}"${hasPhoto ? '' : ' role="img" aria-label="' + escapeHtml(screen.alt) + '"'}>
  ${hasPhoto ? '' : chrome()}
  <div class="frame__body">${inner}</div>
</figure>`
}

/**
 * The three dots along the top of a drawn frame.
 *
 * Only drawn frames get one. A real capture is a whole window and arrives
 * with a title bar of its own — `public/screenshots/README.md` asks for the
 * window rather than its contents — so drawing a second one above it would
 * give the app two.
 */
const chrome = () => `
  <div class="frame__chrome" aria-hidden="true">
    <span class="frame__dot"></span><span class="frame__dot"></span><span class="frame__dot"></span>
  </div>`

/**
 * The hero's animated tour: four real captures, crossfaded.
 *
 * The animation is CSS over four plain images rather than one packed
 * animated file. That is not a workaround: it crossfades properly, stays
 * sharp at any size, needs no palette, and `prefers-reduced-motion` is
 * handled by the stylesheet rather than by shipping a second asset.
 *
 * Every image is loaded, so the tour never stutters on its first pass, and
 * the frames are positioned on top of one another with the first in normal
 * flow so the figure keeps the height of a single window.
 *
 * Only the first frame carries the alt text. The other three are decorative:
 * a screen reader should hear one description of what the tour shows, not
 * four near-identical ones.
 *
 * The pause control is `hidden` in the markup and revealed by the script, so
 * a browser running no JavaScript is never shown a button that does nothing.
 * Content that moves for more than five seconds has to be stoppable, and this
 * loop runs for about twelve.
 *
 * It sits below the window rather than on top of it. The capture inside the
 * frame is drawn at about half size, so any control legible enough to use
 * would be larger than every button in the picture it covered, and would read
 * as part of the app — which has a Pause button of its own, for something
 * else entirely.
 */
export function heroLoop(copy) {
  const frames = copy.frames
    .map(
      (frame, index) => `
      <img class="loop__frame" style="--i:${index}" src="${url(`hero/${frame.file}`)}"
        width="900" height="580" decoding="async"${index ? ' alt="" aria-hidden="true"' : ` alt="${escapeHtml(copy.alt)}"`}>`
    )
    .join('')
  return `
<div class="loop">
  <figure class="frame frame--hero frame--loop" style="--frames:${copy.frames.length}">${frames}
  </figure>
  <p class="loop__control">
    <button class="loop-toggle" type="button" hidden data-pause="${escapeHtml(
      copy.pause
    )}" data-play="${escapeHtml(copy.play)}">${escapeHtml(copy.pause)}</button>
  </p>
</div>`
}

/** The app's own chrome: its sidebar, and whichever screen is shown. */
function appScreen(screen) {
  return `
<div class="app" aria-hidden="true">
  <nav class="app__sidebar">
    <div class="app__lockup">${markSvg({ size: 18 })}<span>${escapeHtml(config.wordmarkTail)}</span></div>
    <ul class="app__nav">
      ${sidebar.sections
        .map(
          (item) =>
            `<li class="app__nav-item${item === screen.active ? ' is-active' : ''}">${escapeHtml(item)}</li>`
        )
        .join('')}
    </ul>
    <ul class="app__nav app__nav--secondary">
      ${sidebar.secondary
        .map(
          (item) =>
            `<li class="app__nav-item${item === screen.active ? ' is-active' : ''}">${escapeHtml(item)}</li>`
        )
        .join('')}
    </ul>
    <p class="app__status"><span class="app__status-dot"></span>${escapeHtml(sidebar.status)}</p>
  </nav>
  <div class="app__main">
    <header class="app__head">
      <h3 class="app__title">${escapeHtml(screen.title)}</h3>
      ${screen.subtitle ? `<p class="app__subtitle">${escapeHtml(screen.subtitle)}</p>` : ''}
      ${screen.tags ? `<p class="app__tags">${screen.tags.map(tag).join('')}</p>` : ''}
    </header>
    ${screen.filters ? filterRow(screen) : ''}
    ${screen.stats ? statRow(screen.stats) : ''}
    ${(screen.cards ?? []).map(appCard).join('')}
    ${screen.funnel ? barCard(screen.funnel) : ''}
    ${screen.categories ? barCard(screen.categories) : ''}
    ${screen.detail ? screen.detail.map(detailRow).join('') : ''}
  </div>
</div>`
}

const tag = (item) => `<span class="app__tag app__tag--${item.tone}">${escapeHtml(item.label)}</span>`

const filterRow = (screen) => `
<div class="app__filters">
  ${screen.filters
    .map(
      (item) =>
        `<span class="app__filter${item === screen.activeFilter ? ' is-active' : ''}">${escapeHtml(item)}</span>`
    )
    .join('')}
</div>`

const statRow = (stats) => `
<div class="app__stats">
  ${stats
    .map(
      (item) =>
        `<div class="app__stat"><span class="app__stat-value">${escapeHtml(item.value)}</span><span class="app__stat-label">${escapeHtml(item.label)}</span></div>`
    )
    .join('')}
</div>`

const appCard = (card) => `
<section class="app__card">
  ${card.heading ? `<h4 class="app__card-heading">${escapeHtml(card.heading)}</h4>` : ''}
  ${card.note ? `<p class="app__card-note">${escapeHtml(card.note)}</p>` : ''}
  ${(card.rows ?? []).map(appRow).join('')}
</section>`

const appRow = (row) => `
<div class="app__row">
  <div class="app__row-text">
    <p class="app__row-title">${escapeHtml(row.title)}</p>
    <p class="app__row-meta">${escapeHtml(row.meta ?? '')}</p>
    <p class="app__row-tags">${(row.tags ?? []).map(tag).join('')}${
      row.trailing ? `<span class="app__row-trailing">${escapeHtml(row.trailing)}</span>` : ''
    }</p>
  </div>
  ${row.action ? `<span class="app__row-action">${escapeHtml(row.action)}</span>` : ''}
</div>`

const barCard = (group) => `
<section class="app__card">
  <h4 class="app__card-heading">${escapeHtml(group.heading)}</h4>
  <p class="app__card-note">${escapeHtml(group.note)}</p>
  ${group.rows
    .map(
      (row) => `
  <div class="app__bar">
    <span class="app__bar-label">${escapeHtml(row.label)}</span>
    <span class="app__bar-track"><span class="app__bar-fill" style="width:${Math.round(
      (row.value / row.of) * 100
    )}%"></span></span>
    <span class="app__bar-value">${row.value}</span>
  </div>`
    )
    .join('')}
</section>`

const detailRow = (row) => `
<section class="app__card app__card--detail">
  <div class="app__detail-head">
    <h4 class="app__card-heading">${escapeHtml(row.heading)}</h4>
    <span class="app__detail-trailing">${escapeHtml(row.trailing)}</span>
  </div>
  ${row.body ? `<p class="app__card-note">${escapeHtml(row.body)}</p>` : ''}
</section>`

/** A section wrapper, so every band on the page has the same anatomy. */
export function section({ id, tone = 'light', className = '', inner }) {
  return `
<section class="band band--${tone} ${className}"${id ? ` id="${id}"` : ''}>
  <div class="wrap">${inner}</div>
</section>`
}

export const list = (items, className = 'ticks') =>
  `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

export const paragraphs = (items, className = '') =>
  items.map((text) => `<p${className ? ` class="${className}"` : ''}>${escapeHtml(text)}</p>`).join('')
