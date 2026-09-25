# Implementation plan: *.vexoulz.net on the Deep Field design

## Context
The three sites don't share a look or a stack: root is Vue 3 and JS, vods is React CRA + MUI, and dtp is FastAPI + Jinja with inline CSS. We designed a shared look ("Deep Field") in the lab, and it now lives in `X:\Users\vex\3D Objects\vexoulz-ui` (lab v4 plus UI kit). This plan turns the lab into real code: one shared design package, a headless vods engine, and three Vue + TypeScript sites that deploy separately. Your answers: **TypeScript**; **accounts in a later phase**, so watch progress lives in the browser until then; **a separate `dtp-web` repo**; **packages installed from git tags**.

What the codebase surveys found:
- **Hosting:** private, documented only in `homelab-docs` (see the boundary rule below). What matters for the repos: sites are static builds behind a reverse proxy, vods reaches its API at `/backend/*`, and the existing SSH `deploy_main.yml` workflows in root and Archive point at a host that no longer exists, so **those deploys are dead**.
- **twitch-archive** (Python, FastAPI):
  - `archive-api` is a read-only, Feathers-compatible API: `/vods`, `/games`, `/emotes`, `/streams`, `/v1/vods/{id}/comments`, `/v2/badges` (via Helix).
  - The vod model (`packages/common/archive_common/models.py`):
    - `youtube[]`: `{id, type: vod|live, duration, part, thumbnail_url}`.
    - `chapters[]`: `{gameId, name, image, start, end, restricted}`. **`end` is the chapter's length, not its end time.**
    - `drive[]` and `games[]` (per-game uploads). `duration` is a `HH:MM:SS` string.
- **doomtp-bot:**
  - The JSON API already covers about 70% of the admin UI: `api/routes/data.py` and `language.py` under `/api/v1`.
  - Admin login is one shared password with a cookie and CSRF (`webui/auth.py`). API keys are a Bearer `dtb_…` token.
  - It ships as a GHCR image with a pull-based updater (`deploy/update.sh` + timer). uvicorn runs without `proxy_headers`.
- **Archive-React-Vex:**
  - Routes: `/`, `/vods`, `/vods/:id`, `/live/:id`, `/youtube/:id`, `/games/:id`.
  - Filters: date, title (`$iLike`), game (`chapters[name]`), `?page=`. Watch URLs take `?t=` and `?part=`.
  - Chat and emote logic lives in `src/vods/Chat.js`. `YoutubeChat.js` and `WatchMenu.js` are dead code.
  - Bug: `REACT_APP_DEFAULT_DELAY` is a string, and adding it to the delay concatenates instead of adding.
  - No user login or progress anywhere.

---

## Boundary rule: no private infrastructure in project repos
- **Project repos** (vexoulz-ui, vods-core, vexoulz-vods, rootvexoulznet, dtp-web, doomtp-bot, twitch-archive, vexoulz-auth) contain only generic, host-agnostic things:
  - Build output.
  - A generic "publish" step (the build pushed to a `deploy` branch or attached to a GitHub Release).
  - Example config with placeholder values (`.env.example`, `vods.config.example.ts`).
  - They never contain hostnames of machines, IPs, guest ids, proxy/tunnel config, server paths, timers or deploy scripts.
- **Everything host-specific lives in the private `homelab-docs` repo:**
  - Proxy vhosts for root, vods, dtp and auth.
  - Tunnel entries.
  - The pull/deploy script and timer for static sites, including its release-directory and rollback layout.
  - Server-side env files.
  - Runbooks (cutover, rollback, smoke checks).
- **Enforced in each project repo:**
  - `.gitignore` gets `*.local.*`, `.env`, `.env.*` (with `!.env.example`) and `/deploy.local/`, so local host-specific files can't be committed.
  - A short "Infrastructure" note in each repo's README / `CLAUDE.md`: private hosting details belong in homelab-docs, never here.
  - Existing repo-side files that leak host details get cleaned up as part of their phase. Example: the dead SSH `deploy_main.yml` workflows reference `/var/www/…`.

## Phase 0: Foundations (vexoulz-ui 0.1, deploy pipeline)
**vexoulz-ui**, from the lab:
- Keep `lab/` as the dev playground (routes stay the same). Add `src/` for the library: Vite library mode, TypeScript, `vue-tsc`.
- **Tokens:** merge `lab/design/deepfield/df.css` + `df4.css` into `src/tokens/tokens.css` and `src/base/*.css`. **Fix the picked options as defaults** (Geist, mono headings, grey→white heading fill, star pastel accents, glass panels, ring hover on) and delete the lab's `data-*` variant switches. Per-site accent comes from a `data-site` attribute. Self-host the Geist and Geist Mono fonts.
- **Components** (port from the lab files; props typed):
  - Chrome: `SiteHeader` (fixed 48px) / `SiteFooter` from `DFChrome.vue`; `SiteSwitcher` + `Lockup`; `AccountMenu` from `AccountMenu4.vue`, with a `disabled` sign-in until Phase 5.
  - Controls, from `DF4Kit.vue`: `Button`/`IconButton` (32px `--ctl`, square), `Input`, `Select`, `Stepper`, `Switch`, `Checkbox`, `Radio`, `Slider`, `DateRange`, `Tabs`, `Pagination`.
  - Overlays: `Popover` from `DPop.vue` (space-aware, stays under the header), `Menu`, `Dialog`, `Toast` (+ `useToast`), `Tooltip`.
  - Feedback and data: `Callout`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`, `Table` (sortable, scrolls sideways on mobile), `Chip`, `StatusDot`, `Avatar`.
  - Media: `Starfield` (keep the seeded generator; respect prefers-reduced-motion), `Posters`, `ChapterBar`.
- **Histoire:** add it, one story per component. The lab's kit frame becomes the stories.
- **Rule in the README and PR checklist:** mobile has the same functions as desktop (controls reflow, tables scroll, nothing is hidden), and images stay placeholders (`Ph`) until real assets exist.
- **Distribution:** git tags. Sites depend on `github:vEXOULZ/vexoulz-ui#v0.1.0`, and the package builds itself on install through a `prepare` script, so no committed `dist`. Changesets for the changelog.

**Shared CI/CD pattern:**
- **In each site repo (generic):** a GitHub Action runs typecheck, vitest and build, then publishes `dist/` to an orphan `deploy` branch. The repo knows nothing about where the build is served.
- Delete the dead SSH `deploy_main.yml` workflows.
- **Branch rules in every repo** (same as doomtp-bot): `main` is merge-only, branches follow Conventional Branch (`feature|bugfix|hotfix|release|chore/<lowercase-words>`). Each repo carries the same `.githooks/` (`pre-commit` + `check-branch-name.sh`), a `branch-name` CI job running that script on pull requests, and a `CONTRIBUTING.md` with the rules. New repos start with them.
- Renovate config in every repo: it watches the vexoulz-ui and vods-core tags.
- **In homelab-docs (private):** a pull-based deploy that fetches each site's `deploy` branch and switches releases atomically with rollback, following the pull model already used for the backends. Plus the proxy vhosts and runbooks.

## Phase 1: vexoulz.net (root) on vexoulz-ui
**Repo:** `rootvexoulznet`, converted to TypeScript. Pages:
- **Landing:** link groups from `Landing.vue`, with the same links. Fix the Discord link: the working tree has `http://`, HEAD has `https://`.
- **Live/offline card:** use archive-api `/streams` if it reflects the live state. Otherwise add a small cached `GET /live` to archive-api (Helix streams).
- **NotFound:** the kit's 404 empty state.
- **OBS sources:** `/obs_sources/countdown` keeps its own transparent layout, with no site chrome or starfield.

Drop `ItemLink` / `ItemGroup` / `stars_bg.js` / `StandardPage` once they're replaced (the Starfield component comes from a port of `stars_bg.js`). Move the lab out of `src/design` (it lives in vexoulz-ui now); keep the dev-only route optional.

## Phase 2: vods-core (headless engine, TypeScript, no UI)
New repo `vods-core`. Modules (sources in Archive-React-Vex, with the model from twitch-archive):
- **`config`:** `{ channel, twitchId, apiBase, startDate, defaultDelay: number }`. Parse numbers properly, which fixes the string-concatenation bug.
- **`api`:**
  - Typed client for archive-api: `vods.find` with date / title / game / page filters, `vods.get`, `games`, `emotes`, `badges`, `comments` (by offset or cursor).
  - Normalize chapters to `{start, end: start + length}` so no page ever sees the length-as-`end` quirk.
  - Convert `duration` from `HH:MM:SS` to seconds.
- **`time`:** port of `utils/helpers.js` (`toHMS`, `toSeconds`, `convertTimestamp`) plus `?t=` parsing.
- **`parts`:**
  - Map VOD time to part and offset and back, with the restricted-chapter correction (from `YoutubeVod.js` ~L73–132; the lab's `ytToVod`/`vodToYt` in `lab/design/deepfield/data.js`).
  - Part status: missing, private or processing, from YouTube IFrame errors.
  - `vod` vs `live` part sets (the `/youtube/:id` fallback).
- **`player`:** a YouTube IFrame controller that auto-advances parts, seeks across parts and skips restricted spans (from `YoutubePlayer.js`).
- **`chat`:** the delay formula (`duration − Σparts − Σrestricted` + the user's offset), a buffered comment stream, badge loaders (`/v2/badges`), emote loaders (per-VOD `/emotes` + BTTV / FFZ / 7TV globals and channel sets, the endpoints in `Chat.js`), and Twitch default name colours plus the "readable" contrast mode (from the lab's `twitchColor`).
- **`progress`:** a storage interface. `LocalProgressStore` (localStorage) now; `AccountProgressStore` in Phase 5.
- **`vue` subpath:** composables `useVods`, `useWatch`, `useChat`.
- **Tests (vitest):**
  - Part and restricted math with 0, 1 or several cuts and missing parts.
  - Delay formula.
  - Filter to query-string output, as snapshots against Feathers syntax.
  - Comment paging.

## Phase 3: vods.vexoulz.net (vexoulz-vods)
New repo `vexoulz-vods` (Vue 3 + TypeScript + vue-router + vexoulz-ui + vods-core). Replaces Archive-React-Vex.
- **Routes:**
  - `/` and `/vods`: list with filter chips, date range, title search (the search icon on mobile), `?page=` plus "load more", and resume chips from `LocalProgressStore`.
  - `/vods/:id?t=&part=`: v4 watch page.
    - Part dropdown, timeline across all parts, missing-part panel.
    - Chapters popover, chat replay with the settings popover. The ±0.1s delay and viewer settings are saved in localStorage.
    - Copy link with a toast, download (Drive) when `drive[]` exists, theater mode, shortcuts.
  - `/youtube/:id` and `/live/:id`: same page with the part set chosen. Keep the old URLs working.
  - `/games/:id`: per-game uploads (`games[]`).
  - Kit 404.
- **Config:** one `vods.config.ts` holding what used to be `REACT_APP_*` values.
- **Player controls:** YouTube's native controls stay the default. Ship with a flag and **live-test on real VODs before locking it**, as you asked.
- **Cutover:**
  - The repo side just publishes the build.
  - Switching the vods site from the old build to the new one, keeping `/backend/*` unchanged, is a homelab-docs runbook with a rollback step.
  - Archive the Archive-React-Vex repo afterwards.

## Phase 4: dtp.vexoulz.net (dtp-web + doomtp-bot API gaps)
**doomtp-bot changes (backend only):**
- **New JSON endpoints:**
  - `GET /api/v1/session`: who am I, plus the CSRF token.
  - `POST /api/v1/session` and `DELETE /api/v1/session`: log in and out with the shared password; same cookie as today.
  - API keys: list, create, revoke.
  - `GET /api/v1/health/components`.
  - Ignored users per channel.
  - `GET /api/v1/explain/{token}`.
  - Published packs per channel.
  - Public channel list with no auth.
  - Roles table for the features page.
- Make uvicorn `proxy_headers` / `forwarded_allow_ips` configurable through env (generic setting, no addresses in the repo).
- Add tests next to `tests/test_api_data.py`.

**dtp-web (new repo):**
- **Pages** (template → page):
  - `index` → home
  - `commands` / `_commands` → commands with filter
  - `language` → language page (keep loading the bot's `/static/editor/editor.js` and railroad SVGs)
  - `features`
  - `channel`
  - `explain` + `_explain` → explain report (the v4 lab layout)
  - `login`
  - `admin` → keys, channels, health
  - `admin_channel` → the v4 admin example (status tags, ban callout + rejoin, modules, publications, filters, triggers/timers)
  - `admin_explain`
- **Serving model** (the repo only documents the contract):
  - The SPA expects to be served same-origin with the bot's `/api/*`, `/auth/*`, `/static/*` and `/healthz` behind the same host, so no CORS is needed.
  - The actual vhost, tunnel entry and the bot's `PUBLIC_BASE_URL` value go in homelab-docs.
- **Retire Jinja:** once the pages match, set `PUBLIC_WEB_UI=false` (keep `/auth/*` for the bot-account and channel-connect OAuth), then delete the templates in a later bot release.

## Phase 5: Accounts (auth.vexoulz.net)
- **New service `vexoulz-auth`** (Python FastAPI, matching the other backends):
  - Twitch OAuth for identity only.
  - Per-site host-only sessions through a redirect and a one-time code, with no `.vexoulz.net` cookie (keeps shop and friend instances out).
  - "Sign out everywhere" and CSRF.
- **User-data API:** `GET` and `PUT /progress/{vodId}` plus a list, stored in its own Postgres database.
- **Clients:**
  - `@vexoulz/auth-client` (TypeScript): `login()`, `logout({everywhere})`, `useUser()`. Wire it into the `AccountMenu` sign-in.
  - vods: `AccountProgressStore`, which imports local progress on the first sign-in.
  - dtp: admin moves to Twitch login, gated by `BOT_OWNER_IDS` / channel broadcaster. The shared password is kept as a break-glass fallback for one release.

## Phase 6: Friend instance
- A `vods-template` repo: vods-core plus a minimal theme on its own tokens, a `vods.config.ts` example, and setup docs (archive-api URL, Twitch id).
- Only after vods-core has been stable through one minor version.

---

## Order & dependencies
0 → 1 (root is the smallest real use of vexoulz-ui) → 2 → 3 → 4. Phase 4's bot-endpoint work can run in parallel with Phase 2/3. Phase 5 comes after 3 and 4 ship. Phase 6 is last.

## Critical files (sources to port from)
- **Lab:** `vexoulz-ui/lab/design/deepfield/` — `df.css`, `df4.css`, `DPop.vue`, `DFChrome.vue`, `AccountMenu4.vue`, `SiteSwitcher.vue`, `Lockup.vue`, `Starfield.vue`, `Posters.vue`, `DF4Watch.vue`, `DF4Vods.vue`, `DF4Kit.vue`, `DF4DtpAdmin.vue`, `DF4DtpExplain.vue`, `data.js`
- **Archive-React-Vex:** `src/vods/{YoutubeVod,YoutubePlayer,Chat,Vods,Vod,client,Settings,VodChapters,ChaptersMenu}.js`, `src/games/Games.js`, `src/utils/helpers.js`
- **twitch-archive:** `services/api/archive_api/{main,feathers_query,services}.py`, `packages/common/archive_common/models.py`
- **doomtp-bot:** `src/doomtp_bot/api/routes/{data,language,auth}.py`, `webui/{pages,auth}.py`, `webui/templates/*`, `api/app.py`
- **Private, updated only in homelab-docs:** `homelab-docs/{PORTS,README,MANIFEST,HOST-SCRIPTS}.md`, plus the new site deploy script and timer and the proxy/tunnel entries

## Verification
- **Every repo in CI:** `vue-tsc`, vitest, build.
- **Visual checks:** Playwright smoke tests at 1280px and 390px:
  - Header height is 48px signed in and out.
  - No horizontal overflow.
  - Every popover stays inside the viewport.
  - Watch-page controls are the same set on mobile and desktop.
- **vexoulz-ui:** Histoire builds, and every story renders with no console errors.
- **vods-core:** unit tests on the part, restricted and delay math against real VOD JSON pulled from archive-api (fixtures).
- **vods:** `vite preview` against the live `/backend` (or a staging vhost, set up via homelab-docs). Compare against the old site: the same VOD at the same `?t=` lands on the same part and time, and chat lines line up. Test a VOD with a restricted chapter and a multi-part VOD. Live-test the native YouTube controls here.
- **dtp:** a pytest per new endpoint. The SPA admin flow (log in → toggle module → rejoin → publish) works against a local `compose.yaml` stack.
- **Deploy:** in each repo, check that a push to `main` produces a correct `deploy` branch (it serves via `vite preview` from a checkout). Server-side smoke and rollback checks are part of the homelab-docs runbook.
- **Boundary check:** in each project repo, a `git grep` for private markers (IP ranges, guest names, tunnel/proxy config words, server paths) finds nothing before each phase is merged.
