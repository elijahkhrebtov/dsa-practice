# Hint 3

After sorting by end, keep a variable `lastEnd`: the end of the most recently kept interval (start it at `-Infinity`). For each interval in order:

- If `start >= lastEnd` (`>=` because touching is fine), keep it and set `lastEnd = end`.
- Otherwise it overlaps something you kept, so count it as removed. Leave `lastEnd` unchanged, because the kept interval ends no later than this one.

Return the number removed.
