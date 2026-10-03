<!-- conventions:begin: synced from vEXOULZ/conventions; edit it there, then run `conventions sync` -->
## What changed

## Checklist
- [ ] The branch is named per [Conventional Branch](../CONTRIBUTING.md#branches) (`feature/`, `bugfix/`, `hotfix/`, `release/`, `chore/`).
- [ ] New behaviour has a test, and docs that describe the changed behaviour are updated in this PR.
- [ ] Nothing synced from vEXOULZ/conventions was edited by hand (`.conventions/`, managed blocks).
- [ ] **No private infrastructure**: no machine hostnames, private IPs, server paths, proxy/tunnel config or deploy scripts. Those belong in the private infrastructure repo.
- [ ] No secret values anywhere in the diff, the description or the commit messages.
<!-- conventions:end -->

## vexoulz-ui
- [ ] **Mobile has the same functions as desktop.** Checked at ~390px: controls reflow or scroll, tables scroll sideways, nothing is hidden.
- [ ] Controls use the fixed heights (`--vx-ctl` 32px / `--vx-ctl-sm` 26px); the header stays 48px.
- [ ] Images, logos and icons are placeholders (`VxPlaceholder`) until real assets exist.
- [ ] A story covers the change (`npm run story:dev`), and the lab still runs (`npm run dev`).
- [ ] A changeset was added if `src/` changed (`npm run changeset`).
