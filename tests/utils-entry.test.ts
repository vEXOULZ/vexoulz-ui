import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as utils from '../src/utils'
import * as ui from '../src/index'

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src')

/** Every module an entry reaches through relative imports (bare `import '…'` included), and the packages it names. */
function reach(file: string, seen = new Set<string>(), packages = new Set<string>()) {
  if (seen.has(file)) return { seen, packages }
  seen.add(file)
  if (!file.endsWith('.ts')) return { seen, packages }
  const code = readFileSync(file, 'utf8').replace(/^\s*\/\/.*$/gm, '') // not the usage examples in comments
  for (const [, spec] of code.matchAll(/(?:from|import)\s*'([^']+)'/g)) {
    if (!spec!.startsWith('.')) packages.add(spec!)
    else {
      const target = resolve(dirname(file), spec!)
      reach(/\.\w+$/.test(target) ? target : `${target}.ts`, seen, packages)
    }
  }
  return { seen, packages }
}

describe('@vexoulz/ui/utils', () => {
  it('reaches no component and no style, only vue', () => {
    const { seen, packages } = reach(resolve(SRC, 'utils.ts'))
    expect([...seen].filter((f) => !f.endsWith('.ts'))).toEqual([])
    expect([...seen].filter((f) => f.includes('components'))).toEqual([])
    expect([...packages]).toEqual(['vue'])
    expect(seen.size).toBeGreaterThan(5)
  })

  it('the walk does see components and styles from the main entry', () => {
    const { seen } = reach(resolve(SRC, 'index.ts'))
    expect([...seen].some((f) => f.endsWith('.vue'))).toBe(true)
    expect([...seen].some((f) => f.endsWith('.css'))).toBe(true)
  })

  it('exports the same functions as the main entry, so the toast store is shared', () => {
    for (const [name, value] of Object.entries(utils)) expect(ui[name as keyof typeof ui], name).toBe(value)
    expect(utils.useToast().toasts).toBe(ui.useToast().toasts)
  })
})
