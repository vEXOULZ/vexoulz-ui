---
'@vexoulz/ui': minor
---

For status.vexoulz.net:

- `status` in `SITES` (lavender accent, hidden until the site is live, repo `vEXOULZ/vexoulz-status`).
- `VxStatusDot` takes `status="down"`: plain red, where `live` is red with a halo. Its statuses other than `live`
  are the new `Health` type (`ok | warn | down | off`).
- `VxUptimeBar`: a row of ticks, one per check, hour or day, coloured by `Health`, with each tick's label shown on
  hover or focus. `slots` pads it to a fixed length so stacked bars line up; `selectable` with
  `v-model:selected` makes the ticks buttons (arrow keys move between them) so a page can show the chosen one in
  full.
