import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'

const here = path.dirname(fileURLToPath(import.meta.url))

/**
 * The release notes, read from the one place they are written.
 *
 * `Docs/Releases/` is the single source: the same files the disk image
 * carries and the updater will eventually show. Nothing is retyped here, so
 * there is no second copy to fall out of step, and a note that has not been
 * written yet simply does not appear.
 */
export const releasesRoot = path.resolve(here, '../../Docs/Releases')

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: true })

/** "0.5.0-test2" → { version, label }. A stable release has no label. */
export function parseName(name) {
  const [version, ...rest] = name.split('-')
  return { version, label: rest.length ? rest.join('-') : null }
}

/** Newest first, by version then label. */
function compare(a, b) {
  const parts = (value) => value.split('.').map((part) => Number.parseInt(part, 10) || 0)
  const [aMajor, aMinor, aPatch] = parts(a.version)
  const [bMajor, bMinor, bPatch] = parts(b.version)
  if (aMajor !== bMajor) return bMajor - aMajor
  if (aMinor !== bMinor) return bMinor - aMinor
  if (aPatch !== bPatch) return bPatch - aPatch
  return (b.label ?? '').localeCompare(a.label ?? '')
}

export async function loadReleases(root = releasesRoot) {
  const names = (await readdir(root)).filter((name) => name.endsWith('.md') && name !== 'README.md')
  const releases = []
  for (const name of names) {
    const slug = name.replace(/\.md$/, '')
    const source = await readFile(path.join(root, name), 'utf8')
    const { version, label } = parseName(slug)
    // The note's own H1 becomes the entry's heading, and is dropped from the
    // body so the page does not say the same thing twice.
    const lines = source.split('\n')
    const headingIndex = lines.findIndex((line) => line.startsWith('# '))
    const title = headingIndex >= 0 ? lines[headingIndex].slice(2).trim() : slug
    const body = lines.filter((_, index) => index !== headingIndex).join('\n').trim()
    releases.push({ slug, version, label, title, html: markdown.render(body), source: body })
  }
  return releases.sort(compare)
}
