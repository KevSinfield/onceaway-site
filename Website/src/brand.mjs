/**
 * The Onceaway mark, for the marketing site.
 *
 * The mark is the letter O of "Onceaway" opened up, with a piece leaving it:
 * a single arc, and a detached dot outside the circle. The gap and the
 * departed dot are the whole idea. Do not redraw it.
 *
 * The numbers below are the brand asset brief's artwork, used verbatim. The
 * same numbers appear in the app's own logo source and in the Help site's, and
 * a test checks all three agree, so the app, the Help site and this site
 * cannot drift apart.
 */
export const geometry = {
  designBox: 48,
  arcPath: 'M32.5 9.3 A17 17 0 1 0 38.7 15.5',
  dotCentreX: 43,
  dotCentreY: 5,
  strokeWidthLarge: 7.5,
  dotRadiusLarge: 4,
  smallSizeThreshold: 24,
  strokeWidthSmall: 9,
  dotRadiusSmall: 5,
}

/** The palette, exactly as the brand asset brief defines it. */
export const brand = {
  ink: '#0F1218',
  surface: '#171C25',
  border: '#262D3A',
  signalGreen: '#4FD6A6',
  offWhite: '#E9ECF1',
  greenText: '#1F9F74',
  muted: '#7D8594',
}

const strokeWidth = (size) =>
  size < geometry.smallSizeThreshold ? geometry.strokeWidthSmall : geometry.strokeWidthLarge

const dotRadius = (size) =>
  size < geometry.smallSizeThreshold ? geometry.dotRadiusSmall : geometry.dotRadiusLarge

/**
 * The mark as inline SVG. It keeps its signal green on light and dark grounds
 * alike, so the colour never changes with the surface it sits on. Round caps
 * are required: square caps ruin it.
 *
 * `animated` adds a class the stylesheet uses for the one restrained motion
 * on the site — the dot easing outward once — which is switched off entirely
 * under Reduce Motion.
 */
export function markSvg({ size = 32, colour = brand.signalGreen, className = 'mark', animated = false } = {}) {
  const box = geometry.designBox
  const classes = [className, animated ? 'mark--leaving' : ''].filter(Boolean).join(' ')
  return `<svg class="${classes}" width="${size}" height="${size}" viewBox="0 0 ${box} ${box}" fill="none" aria-hidden="true" focusable="false">
  <path d="${geometry.arcPath}" stroke="${colour}" stroke-width="${strokeWidth(size)}" stroke-linecap="round"/>
  <circle class="mark__dot" cx="${geometry.dotCentreX}" cy="${geometry.dotCentreY}" r="${dotRadius(size)}" fill="${colour}"/>
</svg>`
}

/**
 * The application icon as an SVG document: the mark in signal green on the
 * dark tile, matching the Mac icon. Used for the favicon, where the brief
 * asks for a smaller corner radius because it renders much smaller.
 */
export function iconSvg({ cornerRadius = 0.2 } = {}) {
  const box = 48
  const markScale = 0.68
  const offset = (box - box * markScale) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}" fill="none">
  <rect width="${box}" height="${box}" rx="${(box * cornerRadius).toFixed(2)}" fill="${brand.surface}"/>
  <rect x="0.5" y="0.5" width="${box - 1}" height="${box - 1}" rx="${(box * cornerRadius - 0.5).toFixed(2)}" stroke="${brand.border}"/>
  <g transform="translate(${offset.toFixed(2)} ${offset.toFixed(2)}) scale(${markScale})">
    <path d="${geometry.arcPath}" stroke="${brand.signalGreen}" stroke-width="${geometry.strokeWidthSmall}" stroke-linecap="round"/>
    <circle cx="${geometry.dotCentreX}" cy="${geometry.dotCentreY}" r="${geometry.dotRadiusSmall}" fill="${brand.signalGreen}"/>
  </g>
</svg>
`
}

/**
 * The social card: the mark and the tagline on the ink ground. Generated
 * rather than drawn, so it cannot fall out of step with the brand either.
 */
export function socialCardSvg(tagline) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="${brand.ink}"/>
  <g transform="translate(96 232) scale(2.2)">
    <path d="${geometry.arcPath}" stroke="${brand.signalGreen}" stroke-width="${geometry.strokeWidthLarge}" stroke-linecap="round"/>
    <circle cx="${geometry.dotCentreX}" cy="${geometry.dotCentreY}" r="${geometry.dotRadiusLarge}" fill="${brand.signalGreen}"/>
  </g>
  <text x="212" y="352" fill="${brand.offWhite}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="76" font-weight="800" letter-spacing="-3">nceaway</text>
  <text x="96" y="452" fill="${brand.muted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="38" font-weight="500">${tagline}</text>
</svg>
`
}
