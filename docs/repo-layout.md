# vexoulz: repo layout sketch

A draft, not a decision. It covers separate repos per site, one shared design repo, and a vods engine
with no built-in look, so a friend can run their own vods site with their own design.

```
github.com/vEXOULZ/
├─ vexoulz-ui            design system: tokens, fonts, Vue components, Histoire docs     → @vexoulz/ui
├─ vods-core             headless VOD engine: API client, time math, chat sync, loaders  → @vexoulz/vods-core
├─ vexoulz-auth          auth.vexoulz.net (Twitch OAuth → session) + tiny client          → @vexoulz/auth-client
├─ vexoulz-root          vexoulz.net           (this repo, Vue + Vite)
├─ vexoulz-vods          vods.vexoulz.net      (Vue, rewrite of Archive-React-Vex)
├─ dtp-web               dtp.vexoulz.net       (Vue, talks to the doomtp-bot API)
├─ doomtp-bot            the bot + its HTTP API (FastAPI; Jinja pages go away over time)
└─ (friend)/their-vods   friend's own repo: vods-core + their own components/theme
```

Rule of thumb: **packages hold code that more than one site needs; sites hold routes, pages and config.**
If only one site uses something, it lives in that site until a second one needs it.

---

## 1. `vexoulz-ui`: the design system

```
vexoulz-ui/
├─ src/
│  ├─ tokens/            tokens.css (colours, --ctl, --head-h, radii, fonts), accents per site
│  ├─ base/              reset, type roles (.h-display, .eyebrow, .mono), panel, focus ring
│  ├─ components/
│  │  ├─ chrome/         SiteHeader, SiteFooter, SiteSwitcher, Lockup, AccountMenu
│  │  ├─ controls/       Button, IconButton, Input, Select, Stepper, Switch, Checkbox, Radio, Slider, DateRange
│  │  ├─ overlay/        Popover (space-aware), Menu, Dialog, Toast, Tooltip
│  │  ├─ feedback/       Callout, Progress, Spinner, Skeleton, EmptyState
│  │  ├─ data/           Table (sortable), Chip, StatusDot, Avatar, AvatarGroup, Kbd, Tabs, Pagination
│  │  └─ media/          Starfield, Posters (stack/fan/row), ChapterBar
│  ├─ composables/       useToast, usePopover, useTwitchColor, useSiteAccent
│  └─ index.ts
├─ stories/              Histoire stories, one per component (the /design/deepfield/v4 "kit" frame)
├─ fonts/                Geist + Geist Mono, self-hosted (no Google Fonts call on the live sites)
└─ package.json          "name": "@vexoulz/ui", peerDependencies: { vue: ^3.5 }
```

- **Ships as**: an ES module build plus `style.css` (Vite library mode). Each site imports
  `@vexoulz/ui/style.css` once and imports components by name, so unused components are dropped from the build.
- **Theming contract**: components read CSS variables and hard-code no colours. A different look (the
  friend's site) overrides `tokens.css`, or skips `vexoulz-ui` entirely.
- **Assets**: logos and marks are props or slots. The package ships no brand images; each site provides its own.

## 2. `vods-core`: the engine (no UI)

Plain TypeScript with no Vue components. Where Vue helps it offers optional composables
(`@vexoulz/vods-core/vue`). Anyone can build any look on top of it.

| module | job | comes from (Archive-React-Vex) |
|---|---|---|
| `config` | `{ channel, twitchId, apiBase, youtubePartLength, branding }` | env vars in `vods/client.js`, hard-coded constants in several files |
| `api/vods` | list/search/filter VODs (date, title, game), get one VOD | Feathers client in `vods/client.js`, queries in `vods/Vods.js` |
| `time` | `toHMS`, `toSeconds`, `convertTimestamp`, parse `?t=` | `utils/helpers.js` |
| `parts` | VOD ↔ YouTube-part mapping, restricted-chapter correction, "which part/offset is VOD time t" | `vods/YoutubeVod.js` (~L73–132), `VodChapters.js` / `ChaptersMenu.js` click handling |
| `player` | part auto-advance, time polling, seek across parts, unavailable-part handling | `vods/YoutubePlayer.js` (`onEnd`, `timeUpdate`) |
| `chat/sync` | chat offset (`vodDuration − youtubeTotal − restricted` + user delay), fetch by cursor or `content_offset_seconds`, buffer | `vods/YoutubeVod.js` delay calc, `vods/YoutubeChat.js`, `vods/Chat.js` |
| `chat/badges` | channel badges (`/v2/badges`) + global badges | `vods/Chat.js`, `vods/YoutubeChat.js` |
| `chat/emotes` | per-VOD emotes (`/emotes?vod_id=`) + BTTV / FFZ / 7TV globals | `vods/Chat.js` |
| `chat/colors` | Twitch default palette for chatters with no colour, "readable" contrast adjustment | new (design lab `data.js`) |
| `progress` | watch position per VOD (local, or synced through the account API) | new ("resume on cards") |

Heads-up found while mapping: `YoutubeChat.js` still calls `badges.twitch.tv/v1/badges/global/display`.
Twitch shut that endpoint down, so global badges should come from Helix `GET /chat/badges/global`
(proxied by the Archive API) instead.

Tests live here too. The part/restricted math is the easiest thing to break and the easiest to unit-test
(`ytToVod`, `vodToYt` and the part lookup with 0, 1 or several cut chapters and missing parts).

## 3. Sites

```
vexoulz-vods/
├─ src/
│  ├─ pages/       VodsPage, WatchPage, GamesPage, LivePage, NotFound
│  ├─ components/  site-only pieces (VodCard, WatchControls, ChatPanel…) built from @vexoulz/ui
│  ├─ vods.config.ts   createVods({ channel: 'vexoulz', apiBase: …, … })
│  └─ main.ts
└─ package.json   deps: @vexoulz/ui, @vexoulz/vods-core, @vexoulz/auth-client
```

The **friend's vods** is the same shape: a copy of the `vexoulz-vods` template (or a fresh Vite app) with its own
`vods.config.ts` and their own components. It can use `vexoulz-ui` or not. What they share with you is the
engine, not the look, which is exactly why the engine can't live inside a site repo.

`vexoulz-root` and `dtp-web` follow the same pattern with `@vexoulz/ui` (+ `auth-client` for dtp).

## 4. Auth (`vexoulz-auth`)

- `auth.vexoulz.net` runs the Twitch OAuth dance and knows **who** you are. It never decides what you may do.
- Each site gets its own host-only session through a redirect: site → auth → back with a one-time code → the
  site's backend swaps it for its session. There's no shared `.vexoulz.net` cookie, which keeps shop (third-party
  host) and any friend instance out of it.
- `@vexoulz/auth-client`: `login()`, `logout({ everywhere })`, `useUser()`, plus the `AccountMenu`
  wiring. CSRF on state-changing requests; CORS with credentials only for the known subdomains.
- Permissions stay with the app: dtp checks broadcaster/mod per channel, vods has almost none.

## 5. Versions, updates, local dev

- **Publishing**: GitHub Packages (or public npm) under `@vexoulz/*`, semver. Tag → CI builds → publishes.
  Changesets writes the changelog.
- **Consuming**: sites pin `^x.y`. **Renovate** opens a PR in each site when `ui` or `vods-core` releases, and CI
  on that PR (build + a few Playwright screenshots) shows whether anything moved.
- **Breaking changes** (a token renamed, a prop removed) go out as a major version, with a note in the changelog.
  Sites upgrade when they choose to. This is the main advantage over a monorepo: vods can stay on ui@1 while
  root moves to ui@2.
- **Local dev across repos**: `pnpm link ../vexoulz-ui` (or a `pnpm-workspace.yaml` that exists only on your
  machine) lets you edit the kit and see it live in a site, then publish.
- **Deploy**: each site deploys on its own (same host as today), and its CI only builds that site.

## 6. Migration order (suggested)

1. Pull `tokens.css`, the base styles and the chrome (header/footer/switcher/lockup) out of this lab into
   `vexoulz-ui`, with Histoire. Use it in `vexoulz-root` first, since it's the smallest site.
2. Build `vods-core` from the Archive's logic, with tests for part/restricted/delay math first.
3. `vexoulz-vods`: Vue rewrite on core + ui. Keep the Archive API as is.
4. `vexoulz-auth` when the first signed-in feature ships (resume on cards, or dtp admin).
5. `dtp-web`: the Jinja pages move to Vue page by page. The bot keeps serving JSON.
6. Friend instance: template repo + docs once core has held steady for a while.
