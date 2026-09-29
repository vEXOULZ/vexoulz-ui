---
'@vexoulz/ui': minor
---

VxPopover (and so VxSelect, VxAccountMenu and VxSiteSwitcher) teleports its panel to `<body>` and places it from
its trigger, so a dialog, a table's scroller or a sideways-scrolling bar no longer cuts it off. It follows the trigger
while the page scrolls and sits above dialogs. A percentage `width` is now of the trigger's width, and on VxSelect it makes the select fill its container. VxTooltip's bubble is teleported the same way, so a table's scroller no longer hides it. `useDismiss`
takes several elements. New `.vx-form-row`: a row of fields and buttons that stays lined up with the fields'
controls when a field shows help or error text underneath.
