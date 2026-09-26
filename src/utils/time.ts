/** 3725 → "1:02:05"; under an hour → "2:05". */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

const span = (s: number): string => (s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)} min` : `${Math.floor(s / 3600)} h`)

/** "12s ago", "5 min ago", "3 h ago" (or "in 5 min"), then the date. Takes an ISO string or epoch ms; empty → "—". */
export function timeAgo(when: string | number | null | undefined, now = Date.now()): string {
  if (!when) return '—'
  const t = typeof when === 'number' ? when : Date.parse(when)
  if (Number.isNaN(t)) return '—'
  const s = Math.round((now - t) / 1000)
  if (s < 0) return `in ${span(-s)}`
  if (s < 86400) return `${span(s)} ago`
  return new Date(t).toISOString().slice(0, 10)
}
