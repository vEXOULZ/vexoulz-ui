---
"@vexoulz/ui": minor
---

Fixes that sites used to patch around, and less work at runtime:

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
