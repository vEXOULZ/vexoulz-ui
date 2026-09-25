export type PageItem = number | 'gap'

/**
 * Page buttons to show: always the first and last page, the current page with `siblings` on each side,
 * and a gap marker where pages are skipped. A gap never hides a single page (it shows the page instead).
 */
export function pageRange(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 0) return []
  const cur = Math.min(Math.max(1, current), total)
  // first + last + current + 2*siblings + 2 gaps
  if (total <= 5 + siblings * 2) return Array.from({ length: total }, (_, i) => i + 1)
  let lo = Math.max(2, cur - siblings)
  let hi = Math.min(total - 1, cur + siblings)
  // Keep the window the same width near the edges so the control doesn't change size while paging
  const width = siblings * 2 + 1
  if (lo === 2) hi = Math.min(total - 1, lo + width)
  if (hi === total - 1) lo = Math.max(2, hi - width)
  const out: PageItem[] = [1]
  if (lo === 3) out.push(2)
  else if (lo > 3) out.push('gap')
  for (let p = lo; p <= hi; p++) out.push(p)
  if (hi === total - 2) out.push(total - 1)
  else if (hi < total - 2) out.push('gap')
  out.push(total)
  return out
}
