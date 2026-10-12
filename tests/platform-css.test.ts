import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// platform-web is a devDependency pinned to the release the sites use; bump it with them.
const platformCss = readFileSync(createRequire(import.meta.url).resolve('@vexoulz/platform-web/style.css'), 'utf8')
const mapping = readFileSync(resolve(ROOT, 'src/styles/platform.css'), 'utf8')
const tokens = readFileSync(resolve(ROOT, 'src/styles/tokens.css'), 'utf8')

const noComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')
/** The custom properties a stylesheet declares (`--name:`), not the ones it only reads. */
const declared = (css: string, prefix: string) =>
  new Set([...noComments(css).matchAll(new RegExp(`(${prefix}[\\w-]+)\\s*:`, 'g'))].map((m) => m[1]!))

describe('platform.css', () => {
  const defined = declared(platformCss, '--vxp-')
  const mapped = declared(mapping, '--vxp-')

  it('maps every --vxp-* variable platform-web defines', () => {
    expect(defined.size).toBeGreaterThan(0)
    expect([...defined].filter((v) => !mapped.has(v))).toEqual([])
  })

  it('maps nothing platform-web no longer defines', () => {
    expect([...mapped].filter((v) => !defined.has(v))).toEqual([])
  })

  it('reads only --vx-* tokens that exist', () => {
    const known = declared(tokens, '--vx-')
    const read = [...noComments(mapping).matchAll(/var\((--vx-[\w-]+)/g)].map((m) => m[1]!)
    expect(read.filter((v) => !known.has(v))).toEqual([])
  })

  it('sits on plain :root, so it outranks platform-web’s :where(:root) defaults', () => {
    expect(noComments(mapping).trim()).toMatch(/^:root\s*\{/)
  })
})
