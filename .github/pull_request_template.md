## What changed

## Checklist
- [ ] **Mobile has the same functions as desktop.** Checked at ~390px: controls reflow or scroll, tables scroll sideways, nothing is hidden.
- [ ] Controls use the fixed heights (`--vx-ctl` 32px / `--vx-ctl-sm` 26px); the header stays 48px.
- [ ] Images, logos and icons are placeholders (`VxPlaceholder`) until real assets exist.
- [ ] A story covers the change (`npm run story:dev`), and the lab still runs (`npm run dev`).
- [ ] A changeset was added if `src/` changed (`npm run changeset`).
- [ ] **No private infrastructure**: no hostnames of machines, IPs, server paths, proxy/tunnel config or deploy scripts. Those belong in the private homelab docs, not here.
