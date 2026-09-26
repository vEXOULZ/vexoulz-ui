---
'@vexoulz/ui': minor
---

The footer shows which build of the site is running (the commit, linked to it on GitHub, plus a release version
when there is one) and a "report an issue" link to the site's GitHub issues. Sites pass their build with
`app.use(VxBuild, { commit })`; `SITES` entries gain `repo`.
