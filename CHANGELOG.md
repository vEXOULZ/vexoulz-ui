# @vexoulz/ui

## 0.4.1

### Patch Changes

- 5390581: Footer: "report an issue" gets a red ❗ (Twemoji) and sits on the switcher's row on phones, with the credit and build
  on their own row below.

## 0.4.0

### Minor Changes

- 3e7aebd: The footer shows which build of the site is running (the commit, linked to it on GitHub, plus a release version
  when there is one) and a "report an issue" link to the site's GitHub issues. Sites pass their build with
  `app.use(VxBuild, { commit })`; `SITES` entries gain `repo`.

## 0.3.0

### Minor Changes

- a716ccd: One list of sites, `SITES` in `src/sites.ts`: each entry has its host, switcher line, link and accent colour, and
  `hidden` leaves a site that isn't live yet out of the switchers (dtp, for now). The accent CSS is generated from it,
  so a new site is one entry. `--vx-info` replaces `--vx-accent-root` where the pale blue meant "info" (info callouts,
  placeholders in code); `--vx-accent-<id>` and `.vx-accent-<id>` still exist, now generated. `SiteInfo.id` is a
  plain string; `NetworkSiteId` is the id of any entry.

## 0.2.1

### Patch Changes

- de75a58: vods' accent is green (`#74e39a`) instead of orange. It's brighter and more saturated than `--vx-ok`, so an ok status
  still reads apart from the accent.

## 0.2.0

### Minor Changes

- bd60aae: The header brand (`VxSiteSwitcher brand`) links to the site's home page from every other page, so there's always a
  way back. Its caret is a separate button that still opens the site menu. On the home page, the whole brand opens the
  menu as before. The new `home` prop (default `/`) says where home is.

### Patch Changes

- 6201a58: Bare `code`, `kbd`, `samp` and `pre` inside a site use `--vx-font-mono` instead of the browser's default monospace,
  so they match the rest of the site (and a site's own font stack, like dtp's Twemoji sign, reaches them too).
- f4b3bc1: `.vx-table` rows hug their text (7px above and below) instead of always being 44px tall, so a table of one-line
  rows no longer floats its words in empty space. A table with controls in its cells (buttons, inputs, switches,
  steppers, segmented controls) keeps 44px rows, so rows with and without a button still line up.

## 0.1.2

### Patch Changes

- d03a930: Game colours can come from box art: `learnGameColors()` samples each game's art once and `gameColor()` then uses
  its dominant hue (same muted saturation and lightness as before, so every game stays in one pastel family and
  readable on black). Games without art, or with grey art, keep the name-based hue. Also exports `dominantHue`,
  `setGameHue`, `hasGameHue` and `sampleHue`.
- 86e30a4: Posters get a solid colour band along the bottom (`PosterGame.color`, or the game's colour). `gamePalette(names)`
  gives neighbouring games with similar hues different shades so they stay apart; `VxChapterBar` takes it as `palette`.
- 1eaf4d9: `VxPosters` keeps its z-order to itself (`isolation: isolate`), so posters in a scrolling menu no longer paint over a
  sticky header above them.
- b00b9f5: `VxInput type="search"` no longer shows the browser's own clear button next to the `clearable` one.

## 0.1.1

### Patch Changes

- 7f58ae1: VxPopover slides sideways to stay on screen when its alignment would push it past the viewport edge (narrow
  phones). New `clampX` helper in the placement utils.

## 0.1.0

### Minor Changes

- 8614834: First release of the Deep Field library: tokens, base styles, site chrome (shell, header, footer, site switcher,
  account menu), controls, overlays, feedback, data and media components, and Histoire stories.
