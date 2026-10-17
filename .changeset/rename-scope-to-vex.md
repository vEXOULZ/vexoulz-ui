---
'@vex/ui': minor
---

The package is now `@vex/ui`, installed from `github:vexouLuna/vex-ui`, and it uses `@vex/platform-web` 0.9.0. Sites
change their imports from `@vexoulz/ui` (and `/account`, `/utils`, the CSS entries) to `@vex/ui` when they bump, together
with `@vex/platform-web`. Sign-in now sends its CSRF token as `X-Vex-CSRF` (`CSRF_HEADER`); vex-auth accepts both names.
The site list's `repo` fields and the footer's issue and commit links point at the renamed `vexouLuna/*` repos, and the
footer credit reads "made by vexouLuna".
