# vexoulz-ui

Shared design for every `*.vexoulz.net` site ("Deep Field"). The repo holds two things:

- **`@vexoulz/ui`** (`src/`): the library the sites use. Tokens, base styles and Vue 3 + TypeScript components,
  documented in Histoire.
- **The design lab** (`lab/`): the Vue app where the look was worked out. It's still the place to try out and
  compare ideas before they go into the library.

```bash
npm install
npm run story:dev   # http://localhost:6006  component stories (Histoire)
npm run dev         # http://localhost:5174  design lab (opens /design/deepfield/v4)
npm test            # vitest
npm run typecheck   # vue-tsc
npm run build       # library → dist/ (index.js, style.css, types/)
git config core.hooksPath .githooks   # once per clone: branch-name rules, see CONTRIBUTING.md
```

`main` is merge-only and branches follow [Conventional Branch](https://conventional-branch.github.io/)
(`feature/…`, `bugfix/…`, `hotfix/…`, `release/…`, `chore/…`). See [CONTRIBUTING.md](CONTRIBUTING.md).

## Using it in a site

Sites install a tagged version straight from git. The `prepare` script builds the package on install, so `dist/`
is never committed.

```bash
npm install github:vEXOULZ/vexoulz-ui#v0.1.0
```

```ts
// main.ts
import '@vexoulz/ui/fonts.css' // self-hosted Geist + Geist Mono (your bundler emits the font files)
import '@vexoulz/ui/style.css' // tokens, base shell, component styles
```

```vue
<script setup lang="ts">
import { VxAccountMenu, VxButton, VxSiteShell, useToast } from '@vexoulz/ui'
const { show } = useToast()
</script>

<template>
  <VxSiteShell site="vods" :nav="[{ label: 'VODs', to: '/vods' }, { label: 'Games', to: '/games' }]">
    <template #account><VxAccountMenu disabled /></template>
    <VxButton @click="show('Link copied')">Copy link</VxButton>
  </VxSiteShell>
</template>
```

- `VxSiteShell` draws the starfield (seeded by the site's hostname), the 48px header, the footer and the toast host.
  It also sets `data-site` on `<html>`, so dialogs and toasts teleported to `<body>` keep the site's accent.
- The sites themselves are one list, `SITES` in [`src/sites.ts`](src/sites.ts): host, one line for the switcher,
  link, accent colour, and `hidden` for a site that isn't live yet (left out of the switchers, except on itself).
  The switchers, the sky seed and the accent CSS (`--vx-accent-<id>`, `[data-site=<id>]`, `.vx-accent-<id>`) all
  come from it, so adding or removing a site is one entry there, then a release that the sites pick up.
- The footer shows which build is running, linked to its commit, and a "report an issue" link to the site's `repo`
  from that list. Each site passes its commit at build time: `define: { __COMMIT__: … }` in `vite.config.ts` (the
  output of `git rev-parse HEAD`), then `app.use(VxBuild, { commit: __COMMIT__ })` in `main.ts`. A site that tags
  releases can add `version` too.
- Links use `RouterLink` when vue-router is installed and a plain `<a>` otherwise. The library doesn't depend on
  vue-router.
- Every class and token is prefixed `vx-` / `--vx-`, so site CSS won't collide with it.

| group | components |
|---|---|
| chrome | `VxSiteShell` `VxSiteHeader` `VxSiteFooter` `VxSiteSwitcher` `VxLockup` `VxAccountMenu` `VxLink` |
| controls | `VxButton` `VxInput` `VxField` `VxSelect` `VxStepper` `VxSwitch` `VxCheckbox` `VxRadioGroup` `VxSlider` `VxDateRange` `VxTabs` `VxSegmented` `VxPagination` |
| overlays | `VxPopover` `VxMenuItem` `VxMenuLabel` `VxMenuSeparator` `VxDialog` `VxToastHost` + `useToast()` `VxTooltip` |
| feedback | `VxCallout` `VxProgress` `VxSpinner` `VxSkeleton` `VxEmptyState` |
| data | `VxTable` `VxChip` `VxStatusDot` `VxAvatar` `VxKbd` |
| media | `VxStarfield` `VxPosters` `VxChapterBar` `VxPlaceholder` |

Helpers are exported as well: `gameColor`, `twitchColor`, `pageRange`, `place` (popover placement), `stepValue`,
`formatDuration`, and the seeded star generator.

## Releasing

1. Any PR that changes `src/` adds a changeset (`npm run changeset`).
2. On a `release/x-y-z` branch, `npm run release` bumps the version and writes `CHANGELOG.md`. Merge it.
3. Tag the merge on `main` and push: `git tag vX.Y.Z && git push --tags`.
4. Sites bump `github:vEXOULZ/vexoulz-ui#vX.Y.Z` (Renovate opens those PRs).

`.github/workflows/publish-site.yml` is a reusable workflow for the site repos: checks, build, then push the
build to a `deploy` branch. It contains no hosting details.

## Rules

- One control height (`--vx-ctl`, 32px; 26px small) for buttons, inputs, selects and the avatar, plus one
  header height (48px) on every page, signed in or out.
- Icon buttons are square. State changes swap the icon or colour, never the size; confirmations show as a toast.
- Popovers open towards free space, stay below the header and scroll when they don't fit.
- **Mobile has the same functions as desktop.** Controls reflow and tables scroll sideways; nothing is hidden.
- All images and logos are placeholders (`VxPlaceholder`) until real assets exist.

## Layout

```
src/
  index.ts                     public exports
  styles/                      tokens.css, base.css, components.css → dist/style.css; fonts.css (separate)
  components/{chrome,controls,overlays,feedback,data,media}/Vx*.vue
  composables/                 useToast, useSite, useDismiss
  utils/                       place, pagination, number, color, random, perlin, starfield, time
  types.ts
stories/                       Histoire stories, one file per component group
tests/                         vitest (utils + components)
lab/                           the design lab (routes below)
docs/                          repo-layout.md, implementation-plan.md
```

| lab path | what |
|---|---|
| `/design/deepfield/v4` | **latest**: all pages (root, vods, watch, dtp, dtp admin/explain, UI kit), design and state controls, mobile/desktop frames |
| `/design/deepfield/v3` … `/design/deepfield` | earlier rounds, kept for comparison |
| `/design` | the original four directions |

Lab settings live in the URL (`?page=&w=&o=`), so a link reproduces exactly what you were looking at.

## Infrastructure

This repo is host-agnostic: it builds and publishes, nothing more. Details about where or how the sites are
hosted (machines, addresses, proxy or tunnel config, server paths, deploy scripts) belong in the private
`homelab-docs` repo and must never be committed here. `.gitignore` blocks `.env*` (except `.env.example`),
`*.local.*` and `/deploy.local/` so local host files can't slip in. The implementation plan is in
[docs/implementation-plan.md](docs/implementation-plan.md).
