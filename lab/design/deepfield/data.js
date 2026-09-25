// Mock content for the Deep Field lab.

export const vods = [
  { title: 'doom eternal nightmare any% attempts until i cry', date: 'Sep 21', dur: '5:12:40', chapters: [['Just Chatting', 0.1], ['DOOM Eternal', 0.9]] },
  { title: 'just chatting + reacting to your terrible clips', date: 'Sep 19', dur: '3:04:11', chapters: [['Just Chatting', 1]] },
  { title: 'first time hollow knight?? (blind)', date: 'Sep 17', dur: '6:48:02', chapters: [['Just Chatting', 0.08], ['Hollow Knight', 0.82], ['Just Chatting', 0.1]] },
  { title: 'subathon day 3 — the bot is sentient now', date: 'Sep 14', dur: '11:20:55', chapters: [['Just Chatting', 0.3], ['Balatro', 0.25], ['DOOM Eternal', 0.2], ['Hollow Knight', 0.15], ['Jackbox Party Pack', 0.1]] },
  { title: 'balatro but every joker is cursed', date: 'Sep 12', dur: '4:02:19', chapters: [['Balatro', 1]] },
  { title: 'community game night', date: 'Sep 10', dur: '2:55:30', chapters: [['Just Chatting', 0.15], ['Jackbox Party Pack', 0.85]] },
]

export const gamesOf = (v) => [...new Set(v.chapters.map(([g]) => g))]

// Stable muted hue per game, so a game has the same colour on every chapter bar
export function gameColor(name) {
  let x = 0
  for (const c of name) x = (x * 31 + c.charCodeAt(0)) >>> 0
  return `hsl(${x % 360} 38% 62%)`
}

// Chat usernames get star colours instead of Twitch's random ones
const starColors = ['#92b5ff', '#a2c0ff', '#d5e0ff', '#f9f5ff', '#ffede3', '#ffdab5', '#ffb56c']
export function userColor(name) {
  let x = 0
  for (const c of name) x = (x * 33 + c.charCodeAt(0)) >>> 0
  return starColors[x % starColors.length]
}

const lines = [
  ['doomguy_', 'KEKW'],
  ['viewer_one', 'no way he missed that'],
  ['mod_person', '!uptime'],
  ['dtp', 'stream has been live for 2h 14m'],
  ['lurker42', 'first time watching the vod hi'],
  ['doomguy_', 'the bot is sentient now'],
  ['someone', 'clip it'],
  ['starchart', 'that jump was frame perfect'],
  ['viewer_one', 'chat is this real'],
  ['mod_person', '!random 1-100 | echo you rolled {1}!'],
  ['dtp', 'you rolled 69!'],
  ['lurker42', 'LMAO'],
  ['nebula_', 'what keybinds does he use'],
  ['someone', 'he is going to die here'],
  ['doomguy_', 'called it'],
]
export const chat = Array.from({ length: 40 }, (_, i) => {
  const [u, m] = lines[i % lines.length]
  const s = 3764 + i * 11
  return { u, m, t: `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }
})

// ---- Twitch chat colours (v2 lab) ----
// What each chatter picked in Twitch (IRC/EventSub `color`); null = never picked one.
export const twitchColors = {
  doomguy_: '#FF0000',
  viewer_one: '#1E90FF',
  mod_person: '#00FF7F',
  dtp: '#DAA520',
  lurker42: null,
  someone: '#8A2BE2',
  starchart: '#0000FF',
  nebula_: '#FF69B4',
  vexoulz: '#9146FF',
}
// Twitch's fallback palette for chatters who never chose a colour
const twitchDefaults = ['#FF0000', '#0000FF', '#008000', '#B22222', '#FF7F50', '#9ACD32', '#FF4500', '#2E8B57', '#DAA520', '#D2691E', '#5F9EA0', '#1E90FF', '#FF69B4', '#8A2BE2', '#00FF7F']

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function luminance([r, g, b]) {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
// Blend towards white until the colour has at least 4.5:1 contrast on black (what Twitch's dark mode roughly does)
function readable(hex) {
  let rgb = hexToRgb(hex)
  for (let i = 0; i < 20 && (luminance(rgb) + 0.05) / 0.05 < 4.5; i++) rgb = rgb.map((c) => Math.round(c + (255 - c) * 0.12))
  return `rgb(${rgb.join(' ')})`
}

export function twitchColor(name, mode = 'readable') {
  let hex = twitchColors[name]
  if (!hex) {
    let x = 0
    for (const c of name) x = (x * 31 + c.charCodeAt(0)) >>> 0
    hex = twitchDefaults[x % twitchDefaults.length]
  }
  return mode === 'raw' ? hex : readable(hex)
}

// ---- v3 watch page: one VOD as the Archive serves it ----
// Chapters in VOD seconds; `restricted` chapters were cut from the YouTube upload (DMCA), like the Archive's chapter.restricted.
export const watchVod = {
  title: 'subathon day 3 — the bot is sentient now',
  date: 'Sep 14',
  duration: 40855,
  chapters: [
    { game: 'Just Chatting', start: 0, end: 3600 },
    { game: 'Balatro', start: 3600, end: 13500 },
    { game: 'Music', start: 13500, end: 14400, restricted: true },
    { game: 'DOOM Eternal', start: 14400, end: 25200 },
    { game: 'Hollow Knight', start: 25200, end: 33000 },
    { game: 'Jackbox Party Pack', start: 33000, end: 40855 },
  ],
  // YouTube uploads, split every 3h of *uploaded* time (restricted parts don't count)
  parts: [10800, 10800, 10800, 7555],
}

// Map uploaded (YouTube) seconds to VOD seconds by re-inserting the cut chapters
export function ytToVod(t, chapters = watchVod.chapters) {
  let out = t
  for (const c of chapters) if (c.restricted && c.start <= out) out += c.end - c.start
  return out
}
export function vodToYt(t, chapters = watchVod.chapters) {
  let cut = 0
  for (const c of chapters) {
    if (!c.restricted || c.start >= t) continue
    cut += Math.min(t, c.end) - c.start
  }
  return t - cut
}
export function hms(s) {
  s = Math.max(0, Math.floor(s))
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export const emoteNames = ['KEKW', 'Pog', 'catJAM', 'OMEGALUL', 'Clap', 'monkaS']
const lines3 = [
  ['doomguy_', ['sub'], 'KEKW KEKW'],
  ['viewer_one', [], 'no way he missed that'],
  ['mod_person', ['mod', 'sub'], '!uptime'],
  ['dtp', ['bot'], 'stream has been live for 4h 11m'],
  ['lurker42', [], 'first time watching the vod hi'],
  ['doomguy_', ['sub'], 'the bot is sentient now monkaS'],
  ['someone', ['vip'], 'clip it Clap'],
  ['starchart', ['sub', 'bits'], 'that jump was frame perfect Pog'],
  ['viewer_one', [], 'chat is this real'],
  ['mod_person', ['mod', 'sub'], '!random 1-100 | echo you rolled {1}!'],
  ['dtp', ['bot'], 'you rolled 69!'],
  ['lurker42', [], 'OMEGALUL'],
  ['nebula_', ['sub'], 'what keybinds does he use'],
  ['someone', ['vip'], 'he is going to die here catJAM'],
  ['doomguy_', ['sub'], 'called it'],
]
export const chat3 = Array.from({ length: 45 }, (_, i) => {
  const [u, badges, m] = lines3[i % lines3.length]
  return { u, badges, m, t: 15087 - (45 - i) * 9 }
})

// ---- v4: a 27h marathon with many parts, two of them unavailable on YouTube ----
// parts: uploaded length per YouTube video + status ('ok' | 'removed' | 'processing')
export const marathonVod = {
  title: '27 hour subathon finale — we are not sleeping',
  date: 'Sep 06',
  duration: 97200,
  chapters: [
    { game: 'Just Chatting', start: 0, end: 5400 },
    { game: 'Balatro', start: 5400, end: 16200 },
    { game: 'Music', start: 16200, end: 17100, restricted: true },
    { game: 'DOOM Eternal', start: 17100, end: 32400 },
    { game: 'Just Chatting', start: 32400, end: 54000 },
    { game: 'Music', start: 54000, end: 55800, restricted: true },
    { game: 'Hollow Knight', start: 55800, end: 70200 },
    { game: 'Minecraft', start: 70200, end: 86400 },
    { game: 'Jackbox Party Pack', start: 86400, end: 97200 },
  ],
  parts: [
    { len: 10800 }, { len: 10800 }, { len: 10800 },
    { len: 10800, status: 'removed' }, { len: 10800, status: 'removed' },
    { len: 10800 }, { len: 10800 }, { len: 10800 },
    { len: 8100, status: 'processing' },
  ],
}
