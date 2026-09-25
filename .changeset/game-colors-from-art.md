---
'@vexoulz/ui': patch
---

Game colours can come from box art: `learnGameColors()` samples each game's art once and `gameColor()` then uses
its dominant hue (same muted saturation and lightness as before, so every game stays in one pastel family and
readable on black). Games without art, or with grey art, keep the name-based hue. Also exports `dominantHue`,
`setGameHue`, `hasGameHue` and `sampleHue`.
