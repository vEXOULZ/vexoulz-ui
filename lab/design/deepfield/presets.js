// Starting points for the Deep Field lab; every value can then be tweaked in the controls.

const baseStars = {
  mode: 'gen', // off | tile | gen
  density: 1.6, // stars per 10 000 px², roughly what stars_bg.js gives on a 1400×900 screen
  cluster: 1, // 0 = uniform, 1 = stars_bg.js's perlin clumping
  spectrum: 'classic', // classic | bright | mono
  twinkle: true,
  drift: false,
  pointer: false,
  band: false,
  meteors: false,
  glow: false,
  perSite: false,
}

export const presets = [
  {
    id: 'today',
    name: 'As today',
    note: 'Current root look, cleaned up: everything monospace, text chips for games, the original star generator ported to canvas.',
    opts: {
      type: 'mono', head: 'mono', fill: 'grey', accent: 'pastel', panel: 'solid', ring: 'on',
      posters: 'chips', chapterBar: false, live: false, watchSky: 'full',
      stars: { ...baseStars },
    },
  },
  {
    id: 'mixed',
    name: 'Mixed type',
    note: 'Smallest step: Inter for names, titles and prose, JetBrains Mono kept for headings, labels, handles and numbers. Stacked posters, chapter bars, one sky per subdomain.',
    opts: {
      type: 'inter', head: 'mono', fill: 'grey', accent: 'pastel', panel: 'solid', ring: 'on',
      posters: 'stack', chapterBar: true, live: false, watchSky: 'off',
      stars: { ...baseStars, perSite: true },
    },
  },
  {
    id: 'nebula',
    name: 'Nebula glass',
    note: 'Geist pair with sans headings, translucent panels over a denser sky with a milky-way band that drifts slowly. Live card on root.',
    opts: {
      type: 'geist', head: 'sans', fill: 'grey', accent: 'pastel', panel: 'glass', ring: 'on',
      posters: 'stack', chapterBar: true, live: true, watchSky: 'dim',
      stars: { ...baseStars, density: 2.6, cluster: 0.7, spectrum: 'bright', band: true, drift: true, glow: true, perSite: true },
    },
  },
  {
    id: 'hot',
    name: 'Hot accents',
    note: 'IBM Plex pair, headings fade into the site accent, stronger accent colours, outline-only panels, fanned posters on thumbnails, mouse parallax and the odd meteor.',
    opts: {
      type: 'plex', head: 'mono', fill: 'accent', accent: 'hot', panel: 'outline', ring: 'on',
      posters: 'fan', chapterBar: true, live: true, watchSky: 'dim',
      stars: { ...baseStars, density: 2, pointer: true, meteors: true, glow: true },
    },
  },
]
