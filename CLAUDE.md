@.conventions/CLAUDE.md

# vexoulz-ui

The shared design for the vexoulz sites: tokens, Vue components and the design lab (`lab/`). The sites
install a tag (`github:vEXOULZ/vexoulz-ui#vX.Y.Z`), so a change reaches them only when a release is
tagged on `main` and their pins move.

- Follow README "Rules": one control height (`--vx-ctl` 32px, `--vx-ctl-sm` 26px), a 48px header,
  square icon buttons, and mobile has the same functions as desktop (check at ~390px).
- Images, logos and icons are placeholders (`VxPlaceholder`) until real assets exist.
- A component change gets a story (`npm run story:dev`); the `stories` CI job builds them all. The lab
  (`npm run dev`) must still run.
- A change to `src/` adds a changeset (`npm run changeset`). Releases go through a `release/x-y-z`
  branch, and the tag is set on `main` after it merges (README "Releasing").
