---
"@vexoulz/ui": minor
---

`createAccount()` defaults to the production vexoulz-auth and reads the site's `VITE_AUTH_BASE` itself; new `<VxAccount>` (VxAccountMenu wired to `useAccount()`); the tab-return listener is removed when the app unmounts or on `account.dispose()`.
