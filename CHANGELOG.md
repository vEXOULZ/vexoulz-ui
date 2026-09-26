# @vexoulz/ui

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
