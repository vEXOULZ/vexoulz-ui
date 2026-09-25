# @vexoulz/ui

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
