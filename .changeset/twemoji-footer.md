---
'@vexoulz/ui': minor
---

Emoji render as Twemoji on every site: `fonts.css` adds a self-hosted Twemoji face ("Vx Twemoji") after Geist in
both font stacks. It only covers characters that are emoji by default, so text symbols (arrows, ▶, ⚙) keep the
text font, and the full set (~430 KB) loads only on pages that show other emoji than the footer's.

Footer: the build sits next to the site switcher, then "🛑 report an issue" and the credit, now "made by vEXOULZ
with 🧻", on the right. On phones: switcher | report, then build | credit.
