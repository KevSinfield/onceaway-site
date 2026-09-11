/*
 * The version stamp on asset URLs.
 *
 * This is the guard for a bug that does not look like one. A page and its
 * stylesheet are separate downloads: ship both and a browser can take the new
 * page while keeping the old CSS, which renders half-styled and reads as
 * broken code. Nothing fails, nothing logs, and the person seeing it has no
 * way to know it is not the site.
 *
 * So the check is not "is there a stamp" but "is the stamp the hash of what
 * is actually served". A stamp that stops tracking the file is worse than no
 * stamp at all: it would look right here and still serve yesterday's CSS.
 */

import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../build.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, '../dist')
const read = (route) => readFile(path.join(dist, route), 'utf8')

before(async () => {
  await build({ quiet: true })
})

describe('asset addresses', () => {
  test('every asset is served from an address that changes when it does', async () => {
    const home = await read('index.html')
    const linked = [...home.matchAll(/"[^"]*\/(assets\/[\w.]+)\?v=([0-9a-f]+)"/g)]
    assert.equal(linked.length, 2, 'the page does not stamp both of its assets')

    for (const [, route, stamp] of linked) {
      const served = await read(route)
      assert.equal(
        stamp,
        createHash('sha256').update(served).digest('hex').slice(0, 6),
        `${route} is stamped with something other than its own contents`
      )
      // Seven or more hex characters is the shape of a commit hash, which the
      // validator refuses to publish. The stamp stays under that line rather
      // than being exempted from it, so lengthening it fails here first.
      assert.ok(stamp.length < 7, 'the stamp is long enough to read as a commit hash')
    }
  })

  test('the stamp follows the file, not the build', async () => {
    // Two builds of the same source must produce the same address, or every
    // deploy would throw away a cache that was still good.
    const first = await read('index.html')
    await build({ quiet: true })
    const second = await read('index.html')
    const stamps = (html) => [...html.matchAll(/\?v=([0-9a-f]+)"/g)].map((match) => match[1])
    assert.deepEqual(stamps(second), stamps(first), 'an unchanged site changed its asset addresses')
    assert.ok(stamps(first).length > 0, 'nothing is stamped at all')
  })
})
