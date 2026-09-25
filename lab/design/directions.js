// Design directions shown in the /design lab. Tokens live in lab.css under [data-dir="<id>"].

export const directions = [
  {
    id: 'deepfield',
    name: 'Deep Field',
    pitch: 'Evolve what vexoulz.net already is: black sky, starfield, monospace, grey-to-white gradient headings. Each subdomain gets one star colour as its accent.',
    type: 'JetBrains Mono for everything',
    light: false,
    pros: ['Closest to the current root, least migration', 'Strong, recognisable identity', 'Monospace suits the bot docs and code blocks'],
    cons: ['Monospace is tiring for long docs and VOD titles', 'Dark-only; the starfield has to stay subtle on dense pages'],
  },
  {
    id: 'dune',
    name: 'Dune',
    pitch: 'Grow out of doomtp-bot’s warm desert palette: charcoal and sand, a serif display face, amber accents. Feels hand-made and editorial.',
    type: 'Fraunces display · Inter body · JetBrains Mono code',
    light: true,
    pros: ['Most distinctive and “personal”', 'Already half-built in the bot’s web UI', 'Light mode comes naturally'],
    cons: ['Drops the starfield/space identity of root', 'Serif headings clash a bit with video-thumbnail grids'],
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    pitch: 'Streamer-native app look: Twitch-adjacent near-black, rounded panels, Inter, one saturated accent per site. Takes the Archive’s #0e0e10 as the base.',
    type: 'Inter everywhere, tight display tracking',
    light: true,
    pros: ['Viewers already know this language from Twitch/YouTube', 'Best fit for the VOD player + chat', 'Easy to build with any component library'],
    cons: ['Least unique; could be anyone’s site', 'Loses root’s personality unless the landing page keeps extras'],
  },
  {
    id: 'zine',
    name: 'Zine',
    pitch: 'Brutalist and loud: hard 2px borders, no radius, offset accent shadows, uppercase grotesk headings over mono body. Meme energy, on purpose.',
    type: 'Space Grotesk display · JetBrains Mono body',
    light: false,
    pros: ['Matches the shitpost tone of the landing copy', 'Very cheap to implement: borders, no gradients', 'Accent-per-site reads instantly'],
    cons: ['Hard borders get busy in dense tables and chat', 'Polarising; harder to make feel calm'],
  },
]

export const sites = [
  { id: 'root', host: 'vexoulz.net', label: 'root' },
  { id: 'vods', host: 'vods.vexoulz.net', label: 'vods' },
  { id: 'dtp', host: 'dtp.vexoulz.net', label: 'dtp' },
]
