---
"@vexoulz/ui": patch
---

`VxStarfield` stops its animation frame loop while scrolled out of view instead of waking up every frame to skip
drawing, and picks it up again when it comes back.
