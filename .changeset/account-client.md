---
"@vexoulz/ui": minor
---

`@vexoulz/ui/account`: the shared *.vexoulz.net sign-in from a site's side. `createAccount({ authBase })` (installed
with `app.use`) and `useAccount()` give the signed-in user from vexoulz-auth, `signIn()`, `signOut({ everywhere })`,
and `request()` for credentialed calls with the CSRF header. Without `authBase` the account is disabled.
`VxAccountMenu`'s disabled title now says sign-in isn't available here, not "coming soon".
