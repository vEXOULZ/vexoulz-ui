# @vexoulz/ui

## 0.6.1

### Patch Changes

- c3e6bce: vods' accent is a brighter mint green (`#51ffa8`, was `#74e39a`).

## 0.6.0

### Minor Changes

- ada1cec: Fixes that sites used to patch around, and less work at runtime:
  
  - `VxInput` passes attributes and listeners (`aria-*`, `min`, `@blur`, …) to its `<input>`; `class`/`style` stay on
    the wrapper.
  - `VxSiteShell` takes `header` (off for theater-style views), and a page's own shell now fills the window
    (`min-height: 100dvh`, `100dvh` when `fill`) on the site background, with `html`/`body` margins reset. Sites can
    drop their copies of those rules.
  - `VxButton` takes `block` (full width).
  - `VxPopover` focuses its panel's `[autofocus]` element on open, stays above later siblings while open, and only
    listens on the document while open (`useDismiss` attaches its listeners only while active).
  - New `timeAgo(isoOrMs)` time helper.
  - No more `!important` in the header and chapter bar styles; removed the unused `.vx-btn-group`, `.vx-breadcrumbs`
    and `.vx-avatar-initials` classes and the `.vx-panel.is-pop` selector.
  - `twitchColor` caches readable colours; learned box-art hues are applied once per frame instead of once per image.

## 0.5.1

### Patch Changes

- a745251: Footer: the year is back in the credit ("made by vEXOULZ with 🧻 · 2026"); both emoji are drawn at text size and
  every item shares one line height, so the words line up; the switcher's label lines up with the build below it on
  phones.

## 0.5.0

### Minor Changes

- 5bd5d19: Emoji render as Twemoji on every site: `fonts.css` adds a self-hosted Twemoji face ("Vx Twemoji") after Geist in
  both font stacks. It only covers characters that are emoji by default, so text symbols (arrows, ▶, ⚙) keep the
  text font, and the full set (~430 KB) loads only on pages that show other emoji than the footer's.
  
  Footer: the build sits next to the site switcher, then "🛑 report an issue" and the credit, now "made by vEXOULZ
  with 🧻", on the right. On phones: switcher | report, then build | credit.

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
