/**
 * The two built assets, and the version stamp on their URLs.
 *
 * A page and its stylesheet are separate downloads with separate lifetimes.
 * Ship a change to both and a browser will happily take the new HTML and keep
 * yesterday's CSS, because the address it was cached under has not changed.
 * The page then renders half-styled, which looks exactly like a bug in the
 * code and has twice now been mistaken for one.
 *
 * So the address changes whenever the file does: every asset URL carries a
 * short hash of the bytes actually being written. Same bytes, same URL, still
 * cached; one character different and it is a new address the browser has
 * never seen. Nothing to remember, and nothing to clear.
 *
 * The concatenation lives here rather than in the build so that the thing
 * that gets hashed and the thing that gets written cannot drift apart: there
 * is one definition of what a built asset is, and it is this.
 */

import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { url } from '../config.mjs'

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const read = (name) => readFileSync(path.join(src, name), 'utf8')

/** Route in the built site → the exact bytes served from it. */
export const assets = {
  // theme.css is the design system; trust.css holds the styles for the privacy
  // sections and everything added since. One stylesheet reaches the browser.
  'assets/theme.css': [read('theme.css'), read('trust.css')].join('\n'),
  'assets/site.js': read('site.js'),
}

/**
 * Six characters, deliberately.
 *
 * The site refuses to publish a page containing a bare run of seven or more
 * hex characters, because that is the shape of a commit hash and no internal
 * identifier belongs on a public page. This stamp is the one hash that is
 * meant to be there, so it stays under that line rather than being exempted
 * from it — the guard keeps working, unweakened, and nobody has to decide
 * whether a given hash on a page is the allowed one.
 *
 * Six is ample here. A collision would have to be between two consecutive
 * versions of the same file, and its only cost would be one browser keeping
 * a stylesheet it already had.
 */
const stamp = (content) => createHash('sha256').update(content).digest('hex').slice(0, 6)

const stamps = new Map(Object.entries(assets).map(([route, content]) => [route, stamp(content)]))

/** The address a page should link an asset by: its path, plus what is in it. */
export const assetURL = (route) => `${url(route)}?v=${stamps.get(route)}`
