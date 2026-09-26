---
'@vexoulz/ui': minor
---

One list of sites, `SITES` in `src/sites.ts`: each entry has its host, switcher line, link and accent colour, and
`hidden` leaves a site that isn't live yet out of the switchers (dtp, for now). The accent CSS is generated from it,
so a new site is one entry. `--vx-info` replaces `--vx-accent-root` where the pale blue meant "info" (info callouts,
placeholders in code); `--vx-accent-<id>` and `.vx-accent-<id>` still exist, now generated. `SiteInfo.id` is a
plain string; `NetworkSiteId` is the id of any entry.
