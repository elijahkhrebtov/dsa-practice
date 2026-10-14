# Hint 2

Use a **sliding window** with two pointers that only move forward. Move `right` forward until the window covers `t`, then move `left` forward as far as the window stays valid. Record the window each time it's valid.

You need an O(1) "does the window cover `t`?" check. Keep a frequency table of what `t` still needs, plus a single counter of how many required characters, duplicates included, are still missing.
