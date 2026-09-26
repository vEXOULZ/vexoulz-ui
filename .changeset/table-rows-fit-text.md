---
'@vexoulz/ui': patch
---

`.vx-table` rows hug their text (7px above and below) instead of always being 44px tall, so a table of one-line
rows no longer floats its words in empty space. A table with controls in its cells (buttons, inputs, switches,
steppers, segmented controls) keeps 44px rows, so rows with and without a button still line up.
