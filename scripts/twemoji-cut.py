"""Cut Twemoji Mozilla into the two woff2 files in src/fonts, and print their unicode-ranges for src/styles/fonts.css.

Run it in a folder holding:
- Twemoji.Mozilla.ttf from https://github.com/mozilla/twemoji-colr/releases (v0.7.0 now),
- emoji-data.txt from https://www.unicode.org/Public/15.0.0/ucd/emoji/,
- emoji-zwj-sequences.txt from https://www.unicode.org/Public/emoji/15.0/,
with `pip install fonttools brotli`, then copy the two .woff2 files to src/fonts and the ranges (ranges.txt) into
fonts.css.

- twemoji.woff2: every emoji that shows as an emoji by default (Emoji_Presentation), everything that takes part in
  a ZWJ sequence or takes a skin tone (so sequences stay in one font), the joiners (ZWJ, VS16, keycap, skin tones,
  tags), and a few text-default ones that are nearly always meant as emoji (the EMOJI_ANYWAY list). Other
  text-default symbols such as the arrows, play and gear signs are left to the text font.
- twemoji-core.woff2: only what the library's own chrome uses (the footer's stop sign and toilet paper), so a page
  with no other emoji loads under a kilobyte instead of the full set.
"""
import re
from fontTools import subset
from fontTools.ttLib import TTFont

SRC = 'Twemoji.Mozilla.ttf'
CORE = [0x1F6D1, 0x1F9FB]
# Text-default characters that chat and titles nearly always mean as emoji.
EMOJI_ANYWAY = [0x2764, 0x2763, 0x263A, 0x2639, 0x270C, 0x261D, 0x270D, 0x2620, 0x2744, 0x2600, 0x2601, 0x2602,
                0x26F8, 0x2618, 0x2665, 0x2660, 0x2663, 0x2666, 0x26D1, 0x26D3, 0x2694, 0x2692, 0x2696, 0x2697]
JOINERS = [0x200D, 0xFE0F, 0x20E3] + list(range(0x1F3FB, 0x1F400)) + list(range(0xE0020, 0xE0080))

presentation = set()
for line in open('emoji-data.txt', encoding='utf-8'):
    m = re.match(r'([0-9A-F]+)(?:\.\.([0-9A-F]+))?\s*;\s*Emoji_Presentation\b', line)
    if m:
        a = int(m.group(1), 16)
        b = int(m.group(2) or m.group(1), 16)
        presentation.update(range(a, b + 1))

# Anything that is part of a ZWJ sequence (♀ ♂ in 🙋‍♀️, 🏳 in 🏳️‍🌈, ✈ in 🧑‍✈️) or takes a skin tone (✌ 🖐) has to be in
# the same font as the rest of the sequence, or the sequence falls apart.
for line in open('emoji-zwj-sequences.txt', encoding='utf-8'):
    if not line.startswith('#') and 'RGI_Emoji_ZWJ_Sequence' in line:
        presentation.update(int(h, 16) for h in line.split(';')[0].split())
for line in open('emoji-data.txt', encoding='utf-8'):
    m = re.match(r'([0-9A-F]+)(?:\.\.([0-9A-F]+))?\s*;\s*Emoji_Modifier_Base', line)
    if m:
        presentation.update(range(int(m.group(1), 16), int(m.group(2) or m.group(1), 16) + 1))

cmap = set(TTFont(SRC).getBestCmap())
full = sorted(c for c in cmap if c > 0x7F and (c in presentation or c in EMOJI_ANYWAY or c in JOINERS))
left_out = sorted(c for c in cmap if c > 0x7F and c not in full)


def ranges(points):
    out, start, prev = [], None, None
    for c in points:
        if start is not None and c == prev + 1:
            prev = c
            continue
        if start is not None:
            out.append((start, prev))
        start = prev = c
    if start is not None:
        out.append((start, prev))
    return ', '.join(f'U+{a:X}' if a == b else f'U+{a:X}-{b:X}' for a, b in out)


def cut(points, out):
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.notdef_outline = False
    opts.drop_tables += ['FFTM']
    f = TTFont(SRC)
    s = subset.Subsetter(opts)
    s.populate(unicodes=points)
    s.subset(f)
    f.flavor = 'woff2'
    f.save(out)


cut(full, 'twemoji.woff2')
cut(CORE + [0xFE0F], 'twemoji-core.woff2')
with open('ranges.txt', 'w', encoding='utf-8') as f:
    f.write(ranges(full) + '\n' + ranges(CORE) + '\n')
print('full:', len(full), 'code points; left to the text font:', ' '.join(chr(c) for c in left_out))
